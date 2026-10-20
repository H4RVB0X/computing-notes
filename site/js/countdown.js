/* =====================================================================
   countdown.js — exam countdowns on the dashboard
   The AQA papers come from CS.config.exams; anyone can add their own (mocks, NEA deadline, other
   subjects). Personal ones are stored as countdowns = { [id]: { name, at, gone } } so they sync, and
   "gone" (rather than deleting) stops a removed countdown coming back from another device.
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const DAY = 86400000;

  function all() {
    const fixed = ((CS.config && CS.config.exams) || []).map((e) => ({ name: e.name, at: new Date(e.date).getTime(), detail: e.detail, fixed: true }));
    const mine = CS.store.get("countdowns", {});
    const own = Object.keys(mine)
      .filter((id) => !mine[id].gone)
      .map((id) => ({ id: id, name: mine[id].name, at: mine[id].at }));
    return fixed.concat(own).sort((a, b) => a.at - b.at);
  }
  const upcoming = () => all().filter((e) => e.at > Date.now() - DAY / 2); // keep "today" up for the rest of the day

  /** "231 days", "3 days 4 h", "5 h 20 min", "today" */
  function until(at) {
    const ms = at - Date.now();
    if (ms <= 0) return "now";
    const d = Math.floor(ms / DAY),
      hrs = Math.floor((ms % DAY) / 3600000),
      min = Math.floor((ms % 3600000) / 60000);
    if (d >= 14) return d + " days";
    if (d >= 1) return d + (d === 1 ? " day " : " days ") + hrs + " h";
    return hrs + " h " + min + " min";
  }
  // always shown in UK time: the exams are in the UK whatever the device's clock is set to
  const when = (at) => new Date(at).toLocaleString("en-GB", { timeZone: "Europe/London", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

  /** the strip at the top of the dashboard */
  function strip() {
    const list = upcoming().slice(0, 4);
    const box = h("div", { class: "countdowns" });
    if (!list.length) return box;
    list.forEach((e) => {
      const weeks = Math.floor((e.at - Date.now()) / (7 * DAY));
      box.appendChild(
        h("div", { class: "countdown" + (e.at - Date.now() < 14 * DAY ? " soon" : ""), title: when(e.at) + (e.detail ? " · " + e.detail : "") }, [
          h("div", { class: "cd-v", text: until(e.at) }),
          h("div", { class: "cd-l", text: e.name }),
          h("div", { class: "cd-d", text: new Date(e.at).toLocaleDateString("en-GB", { timeZone: "Europe/London", day: "numeric", month: "short" }) + (weeks >= 2 ? " · " + weeks + " weeks of revision" : "") }),
        ])
      );
    });
    box.appendChild(h("a", { class: "cd-edit", href: "#/progress", text: "＋ add your own", title: "Add mocks, the NEA deadline or other exams on the Progress page" }));
    // tick every minute while the dashboard is open
    const timer = setInterval(() => {
      if (!box.isConnected) return clearInterval(timer);
      box.querySelectorAll(".cd-v").forEach((v, i) => (v.textContent = until(list[i].at)));
    }, 60000);
    return box;
  }

  /** settings card: the AQA dates plus your own, with add/remove */
  function card() {
    const c = h("div", { class: "card", style: "margin-bottom:16px", id: "countdowns-card" });
    c.appendChild(h("h3", { style: "margin-top:0", text: "⏳ Exam countdowns" }));
    const ul = h("ul", { class: "cd-list" });
    all().forEach((e) => {
      const li = h("li", null, [h("b", { text: e.name }), h("span", { class: "muted small", text: " · " + when(e.at) + (e.at < Date.now() ? " (done)" : " · " + until(e.at)) })]);
      if (e.fixed && e.detail) li.appendChild(h("div", { class: "small muted", text: e.detail }));
      if (!e.fixed) {
        const del = h("button", { type: "button", class: "btn sm ghost", text: "Remove", "aria-label": "Remove " + e.name });
        del.addEventListener("click", () => {
          CS.store.update("countdowns", (m) => Object.assign(m, { [e.id]: Object.assign({}, m[e.id], { gone: true }) }), {});
          c.replaceWith(card());
        });
        li.appendChild(del);
      }
      ul.appendChild(li);
    });
    c.appendChild(ul);
    const name = h("input", { type: "text", placeholder: "e.g. Mock Paper 1, NEA deadline, Maths Paper 1", "aria-label": "Countdown name", style: "flex:2;min-width:180px" });
    const date = h("input", { type: "date", "aria-label": "Date", style: "flex:1;min-width:140px" });
    const time = h("input", { type: "time", value: "09:00", "aria-label": "Start time", style: "width:auto" });
    const add = h("button", { type: "button", class: "btn primary", text: "Add" });
    add.addEventListener("click", () => {
      if (!name.value.trim() || !date.value) return alert("Give it a name and a date.");
      const at = new Date(date.value + "T" + (time.value || "09:00")).getTime(); // local time on this device
      const id = "c" + Date.now().toString(36);
      CS.store.update("countdowns", (m) => Object.assign(m, { [id]: { name: name.value.trim().slice(0, 60), at: at } }), {});
      c.replaceWith(card());
    });
    c.appendChild(h("div", { class: "row", style: "margin-top:10px" }, [name, date, time, add]));
    c.appendChild(h("p", { class: "small muted", style: "margin:8px 0 0", text: "Your own countdowns sync to your other devices when you're signed in. The AQA dates are AQA's published timetable, which is provisional until confirmed, so check with your exams officer nearer the time." }));
    return c;
  }

  CS.countdown = { strip: strip, card: card, all: all };
  (CS.settingsCards = CS.settingsCards || []).push(card);
})();
