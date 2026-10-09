/* =====================================================================
   trace.js — fill-in trace-table challenges
   challenge = { id, topic, title, code, lang, columns:[...], rows:[[...]], prefill?:[[...]], hint, note }
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);

  function mount(el, ch) {
    el.innerHTML = "";
    const frame = h("div", { class: "tool-frame" });
    frame.appendChild(h("div", { class: "tool-frame-head" }, [h("span", { text: "🔍 Trace challenge: " + (ch.title || ch.id) }), h("span", { class: "muted small", text: ch.rows.length + " rows × " + ch.columns.length + " columns" })]));
    const body = h("div", { class: "tool-frame-body" });
    if (ch.intro) body.insertAdjacentHTML("beforeend", CS.markdown.render(ch.intro, {}));
    const fig = h("div");
    fig.innerHTML = CS.markdown.render("```" + (ch.lang || "pseudocode") + "\n" + ch.code + "\n```", {});
    body.appendChild(fig);
    CS.enhance && CS.enhance(fig);
    body.appendChild(h("p", { class: "small muted", text: ch.instructions || "Fill in the trace table. Leave a cell blank if the value does not change on that row (unless the challenge says otherwise). Values are not case-sensitive." }));
    const tw = h("div", { class: "trace-table" });
    const table = h("table");
    const thead = h("thead");
    const hr = h("tr");
    ch.columns.forEach((c) => hr.appendChild(h("th", { html: CS.markdown.inline(c) })));
    thead.appendChild(hr);
    table.appendChild(thead);
    const tbody = h("tbody");
    const inputs = [];
    ch.rows.forEach((row, r) => {
      const tr = h("tr");
      const rowInputs = [];
      ch.columns.forEach((c, k) => {
        const td = h("td");
        const pre = ch.prefill && ch.prefill[r] && ch.prefill[r][k] != null && ch.prefill[r][k] !== "";
        const inp = h("input", { type: "text", "aria-label": c + " row " + (r + 1), autocomplete: "off" });
        if (pre) {
          inp.value = ch.prefill[r][k];
          inp.disabled = true;
        }
        td.appendChild(inp);
        tr.appendChild(td);
        rowInputs.push({ inp: inp, td: td, expected: row[k] == null ? "" : String(row[k]) });
      });
      inputs.push(rowInputs);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tw.appendChild(table);
    body.appendChild(tw);
    const ctr = h("div", { class: "row", style: "margin-top:10px" });
    const check = h("button", { type: "button", class: "btn primary sm", text: "Check" });
    const show = h("button", { type: "button", class: "btn sm", text: "Show answers" });
    const reset = h("button", { type: "button", class: "btn sm ghost", text: "Reset" });
    const result = h("span", { class: "small" });
    ctr.append(check, show, reset, result);
    body.appendChild(ctr);
    if (ch.hint) {
      const d = h("details", { class: "collapse", style: "margin-top:10px" });
      d.innerHTML = "<summary>Hint</summary><div class='collapse-body'>" + CS.markdown.render(ch.hint, {}) + "</div>";
      body.appendChild(d);
    }
    const norm = (s) => U.normalise(s).replace(/^"|"$|^'|'$/g, "").replace(/\s+/g, "");
    check.addEventListener("click", () => {
      let ok = 0,
        total = 0;
      inputs.forEach((row) =>
        row.forEach((cell) => {
          if (cell.inp.disabled) return;
          total++;
          const good = norm(cell.inp.value) === norm(cell.expected) || (cell.expected === "" && /^[-–—]?$/.test(cell.inp.value.trim()));
          cell.td.classList.toggle("ok", good);
          cell.td.classList.toggle("bad", !good);
          if (good) ok++;
        })
      );
      result.innerHTML = ok === total ? "<span class='ok-text'>All " + total + " cells correct ✓</span>" : ok + " / " + total + " cells correct";
      CS.store.set("trace." + ch.id, { ok: ok, total: total, t: Date.now() });
    });
    show.addEventListener("click", () => {
      inputs.forEach((row) =>
        row.forEach((cell) => {
          if (cell.inp.disabled) return;
          cell.td.querySelectorAll(".hint-val").forEach((x) => x.remove());
          cell.td.appendChild(h("span", { class: "hint-val", text: cell.expected === "" ? "(blank)" : cell.expected }));
        })
      );
    });
    reset.addEventListener("click", () => {
      inputs.forEach((row) =>
        row.forEach((cell) => {
          if (cell.inp.disabled) return;
          cell.inp.value = "";
          cell.td.classList.remove("ok", "bad");
          cell.td.querySelectorAll(".hint-val").forEach((x) => x.remove());
        })
      );
      result.textContent = "";
    });
    if (ch.note) body.insertAdjacentHTML("beforeend", "<div class='explain'>" + CS.markdown.render(ch.note, {}) + "</div>");
    frame.appendChild(body);
    el.appendChild(frame);
  }
  CS.trace = { mount: mount };

  CS.views.trace = function (main, arg) {
    const id = arg[0];
    const meta = CS.topicMeta(id);
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · Trace challenges " + id;
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/topic/' + id + '">' + id + " " + U.esc(meta.title) + '</a> › Trace challenges</div><h1>Trace challenges: ' + U.esc(meta.title) + '</h1><p class="muted">Hand-trace the code and fill the table exactly as you would in the exam.</p>' }));
    const list = CS.tracesByTopic[id] || [];
    if (!list.length) {
      main.appendChild(h("div", { class: "card", text: "No trace challenges for this topic yet." }));
      return;
    }
    list.forEach((tid) => {
      const holder = h("div", { style: "margin-bottom:18px" });
      main.appendChild(holder);
      mount(holder, CS.traces[tid]);
    });
  };
})();
