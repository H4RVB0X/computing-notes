/* =====================================================================
   review.js — "Report a mistake" links and the My mistakes deck
   (wrong answers come back on a spaced schedule until you get them right twice)
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const md = (s) => CS.markdown.render(String(s == null ? "" : s), {});
  const DAY = 86400000;

  /* ---------------- report a mistake ---------------- */
  /** ctx: { where, id, text } — where = human-readable location, id = stable question id, text = question text */
  function reportUrl(ctx) {
    const cfg = (CS.config && CS.config.report) || {};
    const page = location.href.split("#")[0].startsWith("http") ? location.href : location.hash || "#/";
    const where = (ctx.where || document.title.replace(/^CS Revision · /, "")) + " — " + page;
    const question = [ctx.id ? "[" + ctx.id + "]" : "", String(ctx.text || "").slice(0, 600)].filter(Boolean).join(" ");
    const f = cfg.form || {};
    if (f.url && f.fields && f.fields.where) {
      const qs = ["usp=pp_url", f.fields.where + "=" + encodeURIComponent(where)];
      if (f.fields.question && question) qs.push(f.fields.question + "=" + encodeURIComponent(question));
      return f.url + (f.url.includes("?") ? "&" : "?") + qs.join("&");
    }
    const title = "Mistake: " + (ctx.id || ctx.where || "page");
    const body = "**Where:** " + where + "\n" + (question ? "**Question:** " + question + "\n" : "") + "\n**What's wrong:**\n\n";
    return (cfg.github || "https://github.com/") + "?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body);
  }
  CS.report = {
    url: reportUrl,
    open(ctx) {
      if (CS.sync && CS.sync.report && CS.sync.report(ctx)) return; // signed in: report goes to the database
      window.open(reportUrl(ctx), "_blank", "noopener");
    },
    /** a small "⚑ Report" link to drop into a question or page */
    link(ctx, label) {
      const a = h("button", { type: "button", class: "report-link", title: "Spotted a mistake? Tell the site's author", text: label || "⚑ Report a mistake" });
      a.addEventListener("click", (e) => {
        e.stopPropagation();
        CS.report.open(typeof ctx === "function" ? ctx() : ctx);
      });
      return a;
    },
  };

  /* ---------------- mistakes deck ---------------- */
  /* store: mistakes = { [questionId]: { box: 1-3, due: ms, added: ms, src: "quiz"|"exam" } }
     Wrong → box 1, due tomorrow. Right when due → up a box (3, then 7 days); right in box 3 → gone. */
  const INTERVALS = [0, 1, 3, 7];
  const today = () => new Date(new Date().toDateString()).getTime();
  const all = () => CS.store.get("mistakes", {});
  const save = (m) => CS.store.set("mistakes", m);
  /** remember when an entry left the deck, so a cloud copy from another device doesn't bring it back */
  const bury = (id) => CS.store.update("mistakesGone", (g) => Object.assign(g, { [id]: Date.now() }), {});
  const isDue = (e) => e.due <= Date.now();

  CS.mistakes = {
    all,
    has: (id) => !!all()[id],
    add(q, src) {
      if (!q || !q.id) return;
      const m = all();
      m[q.id] = { box: 1, due: today() + INTERVALS[1] * DAY, added: (m[q.id] && m[q.id].added) || Date.now(), src: src || "quiz", at: Date.now() };
      save(m);
    },
    remove(id) {
      const m = all();
      delete m[id];
      save(m);
      bury(id);
    },
    /** record an answer. In ordinary quizzes a right answer only counts once the question is due. */
    record(q, ok, fromReview) {
      if (!q || !q.id) return;
      const m = all();
      const e = m[q.id];
      if (!ok) return CS.mistakes.add(q, e ? e.src : "quiz");
      if (!e || (!fromReview && !isDue(e))) return;
      if (e.box >= 3) {
        delete m[q.id];
        bury(q.id);
      } else {
        e.box++;
        e.due = today() + INTERVALS[e.box] * DAY;
        e.at = Date.now();
      }
      save(m);
    },
    /** entries whose question still exists, with the question attached */
    list() {
      const m = all();
      return Object.keys(m)
        .map((id) => Object.assign({ id: id, q: CS.findQuestion(id) }, m[id]))
        .filter((e) => e.q);
    },
    due() {
      return CS.mistakes.list().filter(isDue);
    },
    dueCount() {
      return CS.mistakes.due().length;
    },
    forgetTopic(topicId) {
      const m = all();
      Object.keys(m).forEach((id) => {
        if (id.split("/")[0] !== topicId) return;
        delete m[id];
        bury(id);
      });
      save(m);
    },
  };

  /* ---------------- My mistakes page ---------------- */
  CS.views.mistakes = function (main) {
    document.title = "CS Revision · My mistakes";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › My mistakes</div><h1>My mistakes</h1><p class="muted">Every quiz question you get wrong lands here, plus any exam question you add. Each one comes back the next day, then after 3 days, then 7. Get it right each time and it leaves the deck; get it wrong and it starts again.</p>' }));
    const list = CS.mistakes.list();
    const due = list.filter(isDue);
    if (!list.length) {
      main.appendChild(h("div", { class: "card", html: "<p><b>Nothing here yet.</b> Do a <a href='#/mock'>mixed mock</a> or any topic quiz: questions you miss are added automatically. On exam-question pages, use <b>➕ Add to My mistakes</b> under the mark scheme.</p>" }));
      return;
    }
    const top = h("div", { class: "card" });
    const boxes = [1, 2, 3].map((b) => list.filter((e) => e.box === b).length);
    top.innerHTML = '<div class="stat-row"><div class="stat"><div class="v">' + due.length + '</div><div class="l">due now</div></div><div class="stat"><div class="v">' + list.length + '</div><div class="l">in the deck</div></div>' + boxes.map((n, i) => '<div class="stat"><div class="v">' + n + '</div><div class="l">box ' + (i + 1) + " (" + INTERVALS[i + 1] + "d)</div></div>").join("") + "</div>";
    const row = h("div", { class: "row", style: "margin-top:12px" });
    const goDue = h("button", { type: "button", class: "btn primary", text: "Review due (" + due.length + ")" });
    goDue.disabled = !due.length;
    const goAll = h("button", { type: "button", class: "btn", text: "Practise all " + list.length + " now" });
    row.append(goDue, goAll);
    top.appendChild(row);
    if (!due.length) top.appendChild(h("p", { class: "small muted", style: "margin:10px 0 0", text: "Nothing is due. The next one is due " + U.fmtDate(Math.min.apply(null, list.map((e) => e.due))) + "." }));
    main.appendChild(top);

    // by topic
    const byTopic = {};
    list.forEach((e) => (byTopic[e.q.topicId] = byTopic[e.q.topicId] || []).push(e));
    main.appendChild(h("h2", { text: "By topic", style: "margin:20px 0 8px" }));
    const tbl = h("div", { class: "table-wrap" });
    tbl.innerHTML =
      "<table><thead><tr><th>Topic</th><th>In deck</th><th>Due</th><th></th></tr></thead><tbody>" +
      Object.keys(byTopic)
        .sort((a, b) => byTopic[b].length - byTopic[a].length)
        .map((t) => {
          const m = CS.topicMeta(t);
          return "<tr><td><a href='#/topic/" + t + "'>" + t + " " + U.esc(m ? m.title : "") + "</a></td><td>" + byTopic[t].length + "</td><td>" + byTopic[t].filter(isDue).length + "</td><td><button type='button' class='btn sm' data-topic='" + U.esc(t) + "'>Practise</button></td></tr>";
        })
        .join("") +
      "</tbody></table>";
    tbl.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-topic]");
      if (b) session(main, byTopic[b.getAttribute("data-topic")]);
    });
    main.appendChild(tbl);
    goDue.addEventListener("click", () => session(main, due));
    goAll.addEventListener("click", () => session(main, list));
  };

  /** run a review session over mistake entries (quiz and exam questions mixed, shuffled) */
  function session(main, entries) {
    const queue = U.shuffle(entries);
    main.innerHTML = "";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/mistakes">My mistakes</a> › Review</div><h1>Reviewing ' + queue.length + " mistake" + (queue.length === 1 ? "" : "s") + "</h1>" }));
    const counter = h("p", { class: "mono small" });
    const wrap = h("div");
    const next = h("button", { type: "button", class: "btn primary", text: "Next →", style: "display:none;margin:8px 0 24px" });
    main.append(counter, wrap, next);
    let i = 0,
      right = 0;
    const done = (ok) => {
      CS.mistakes.record(queue[i].q, ok, true);
      if (ok) right++;
      next.style.display = "";
      next.textContent = i === queue.length - 1 ? "Finish →" : "Next →";
      next.focus();
    };
    const show = () => {
      wrap.innerHTML = "";
      counter.textContent = i + 1 + " / " + queue.length;
      const e = queue[i];
      const q = Object.assign({}, e.q, { topic: e.q.topicId });
      if (e.id.includes("/e-")) wrap.appendChild(examCard(q, done));
      else CS.quiz.renderQuestion(wrap, q, i, done);
      window.scrollTo(0, 0);
    };
    next.addEventListener("click", () => {
      next.style.display = "none";
      if (++i < queue.length) return show();
      counter.remove();
      next.remove();
      const left = CS.mistakes.list().length;
      wrap.innerHTML = '<div class="card quiz-summary"><div class="big">' + right + "/" + queue.length + "</div><p>Right this time. Those move up a box" + (right ? " (or leave the deck if they were in box 3)" : "") + "; the rest start again tomorrow.</p><p>" + left + ' left in the deck.</p><p><a class="btn primary" href="#/mistakes">Back to My mistakes</a></p></div>';
    });
    show();
  }

  /** an exam question in review: answer, reveal the scheme, then say honestly whether you got full marks */
  function examCard(q, onDone) {
    const box = h("div", { class: "exam-q" });
    box.innerHTML = '<span class="marks">[' + q.marks + " mark" + (q.marks === 1 ? "" : "s") + ']</span><div class="qnum"><span class="pill">' + U.esc(q.topicId) + '</span> Exam question</div><div class="qtext">' + md(q.q) + "</div>";
    if (q.code) {
      const fig = h("div");
      fig.innerHTML = CS.markdown.render("```" + (q.lang || "pseudocode") + "\n" + q.code + "\n```", {});
      box.appendChild(fig);
      CS.enhance && CS.enhance(fig);
    }
    box.appendChild(h("textarea", { placeholder: "Write your answer, then check it against the mark scheme…", "aria-label": "Your answer" }));
    const reveal = h("button", { type: "button", class: "btn sm", text: "Reveal mark scheme", style: "margin-top:8px" });
    const scheme = h("div", { class: "scheme", style: "display:none" });
    const pts = q.points || q.scheme || [];
    if (q.levels) scheme.innerHTML = "<p><b>Levels:</b></p><ul>" + q.levels.map((l) => "<li><b>Level " + U.esc(l.band) + " (" + U.esc(l.marks) + "):</b> " + CS.markdown.inline(l.desc) + "</li>").join("") + "</ul>";
    if (pts.length) scheme.insertAdjacentHTML("beforeend", "<p><b>" + (q.levels ? "Indicative content" : "Mark scheme") + "</b>" + (q.maxPoints && q.maxPoints < pts.length ? " (any " + q.marks + ")" : "") + ":</p><ul>" + pts.map((p) => "<li>" + CS.markdown.inline(p) + "</li>").join("") + "</ul>");
    if (q.model) scheme.insertAdjacentHTML("beforeend", "<details class='collapse'><summary>Model answer</summary><div class='collapse-body'>" + md(q.model) + "</div></details>");
    const verdict = h("div", { class: "row", style: "margin-top:10px" });
    const yes = h("button", { type: "button", class: "btn ok", text: "✓ I'd get full marks" });
    const no = h("button", { type: "button", class: "btn", text: "✗ Not yet" });
    verdict.append(yes, no);
    scheme.appendChild(verdict);
    const pick = (ok) => {
      yes.disabled = no.disabled = true;
      (ok ? yes : no).classList.add("primary");
      onDone(ok);
    };
    yes.addEventListener("click", () => pick(true));
    no.addEventListener("click", () => pick(false));
    reveal.addEventListener("click", () => {
      scheme.style.display = "";
      reveal.remove();
    });
    box.append(reveal, scheme);
    return box;
  }

  /** button for exam pages: put this question in the deck */
  CS.mistakes.addButton = function (q) {
    const b = h("button", { type: "button", class: "btn sm ghost" });
    const draw = () => (b.textContent = CS.mistakes.has(q.id) ? "✓ In My mistakes" : "➕ Add to My mistakes");
    draw();
    b.addEventListener("click", () => {
      if (CS.mistakes.has(q.id)) CS.mistakes.remove(q.id);
      else CS.mistakes.add(q, "exam");
      draw();
    });
    return b;
  };
})();
