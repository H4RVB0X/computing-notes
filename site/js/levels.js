/* =====================================================================
   levels.js — the extended-answer trainer ("12-marker trainer")
   For each levels-of-response exam question: mark three example answers yourself, compare with
   the examiner's level and comment, then write and self-mark your own answer.
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const md = (s) => CS.markdown.render(String(s == null ? "" : s), {});
  const LETTERS = "ABCDEF";
  const KEY = "levelsTrainer"; // { [questionId]: { t, levelHits, n, markDiff, own: {text, band} } }

  /** every levelled exam question that has example answers, in spec order */
  function questions() {
    const out = [];
    CS.allTopicIds().forEach((t) => (CS.exams[t] || []).forEach((q) => q.levels && q.exemplars && q.exemplars.length && out.push(q)));
    return out;
  }
  CS.levelsTrainer = { questions: questions };
  const saved = () => CS.store.get(KEY, {});
  const remember = (id, patch) => CS.store.update(KEY, (all) => Object.assign(all, { [id]: Object.assign({}, all[id], patch) }), {});
  const range = (lv) => String(lv.marks).split(/[-–]/).map(Number);

  CS.views.levels = function (main, arg) {
    if (arg.length >= 2) return trainer(main, arg.join("/"));
    document.title = "CS Revision · Extended-answer trainer";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Extended-answer trainer</div><h1>Extended-answer trainer</h1><p class="muted">The 6-, 9- and 12-mark questions are marked by <b>level</b>, not by counting points. The fastest way to learn what examiners reward is to mark some answers yourself. For each question: mark three example answers, see how the examiner would have marked them, then write and mark your own.</p>' }));
    const qs = questions();
    if (!qs.length) {
      main.appendChild(h("div", { class: "card", text: "No extended-answer questions with example answers yet." }));
      return;
    }
    const s = saved();
    const done = qs.filter((q) => s[q.id] && s[q.id].t);
    const hits = done.reduce((a, q) => a + s[q.id].levelHits, 0);
    const n = done.reduce((a, q) => a + s[q.id].n, 0);
    main.appendChild(h("div", { class: "card", style: "margin-bottom:14px", html: '<div class="stat-row"><div class="stat"><div class="v">' + done.length + "/" + qs.length + '</div><div class="l">questions done</div></div><div class="stat"><div class="v">' + (n ? Math.round((100 * hits) / n) + "%" : "—") + '</div><div class="l">example answers put in the right level</div></div></div>' }));
    const tbl = h("div", { class: "table-wrap" });
    tbl.innerHTML =
      "<table><thead><tr><th>Topic</th><th>Question</th><th>Marks</th><th>Your marking</th></tr></thead><tbody>" +
      qs
        .map((q) => {
          const r = s[q.id];
          const status = r && r.t ? '<span class="pill ' + (r.levelHits === r.n ? "ok" : r.levelHits ? "warn" : "bad") + '">' + r.levelHits + "/" + r.n + " levels right</span>" : '<span class="muted small">not tried</span>';
          const first = U.esc(String(q.q).replace(/[*_`]/g, "").slice(0, 110)) + (q.q.length > 110 ? "…" : "");
          return "<tr><td><a href='#/topic/" + q.topicId + "'>" + q.topicId + "</a></td><td><a href='#/levels/" + q.id + "'>" + first + "</a></td><td>" + q.marks + "</td><td>" + status + "</td></tr>";
        })
        .join("") +
      "</tbody></table>";
    main.appendChild(tbl);
  };

  function trainer(main, id) {
    const q = CS.findQuestion(id);
    if (!q || !q.levels || !q.exemplars) return CS.views.notfound(main);
    const meta = CS.topicMeta(q.topicId);
    document.title = "CS Revision · Extended-answer trainer " + q.topicId;
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/levels">Extended-answer trainer</a> › ' + q.topicId + " " + U.esc(meta ? meta.title : "") + "</div><h1>" + q.marks + "-mark question</h1>" }));

    const qbox = h("div", { class: "exam-q" });
    qbox.innerHTML = '<span class="marks">[' + q.marks + ' marks]</span><div class="qtext">' + md(q.q) + "</div>";
    if (q.code) {
      const fig = h("div");
      fig.innerHTML = CS.markdown.render("```" + (q.lang || "pseudocode") + "\n" + q.code + "\n```", {});
      qbox.appendChild(fig);
      CS.enhance && CS.enhance(fig);
    }
    if (CS.report) qbox.appendChild(h("div", { class: "row small", style: "justify-content:flex-end" }, CS.report.link({ where: "Extended-answer trainer " + q.topicId, id: q.id, text: q.q })));
    main.appendChild(qbox);

    // level descriptors, always visible: you need them to mark
    const desc = h("details", { class: "collapse", open: "open", style: "margin:12px 0" });
    desc.innerHTML = "<summary>Level descriptors (what the examiner uses)</summary><div class='collapse-body'>" + q.levels.map((lv) => "<p><b>Level " + U.esc(lv.band) + " (" + U.esc(lv.marks) + " marks):</b> " + CS.markdown.inline(lv.desc) + "</p>").join("") + (q.guidance ? "<p class='small muted'>" + CS.markdown.inline(q.guidance) + "</p>" : "") + "</div>";
    main.appendChild(desc);

    /* ---- step 1: mark the examples ---- */
    main.appendChild(h("h2", { text: "1 · Mark these three answers", style: "margin:20px 0 4px" }));
    main.appendChild(h("p", { class: "muted small", text: "Read each answer, choose the level that best fits, then give a mark inside that level's range. Length is not a level: long answers that only describe, without applying or evaluating, stay low." }));
    const order = U.shuffle(q.exemplars.map((e, i) => i));
    const picks = order.map(() => ({ band: null, mark: null }));
    const cards = order.map((ei, k) => {
      const ex = q.exemplars[ei];
      const card = h("div", { class: "card exemplar", style: "margin-bottom:12px" });
      card.appendChild(h("div", { class: "row spread" }, [h("b", { text: "Answer " + LETTERS[k] }), h("span", { class: "small muted", text: String(ex.answer).split(/\s+/).length + " words" })]));
      card.appendChild(h("div", { class: "exemplar-text", html: md(ex.answer) }));
      const row = h("div", { class: "row small", style: "margin-top:10px;align-items:center" });
      row.appendChild(h("span", { text: "Level:" }));
      const levelBtns = q.levels.map((lv) => {
        const b = h("button", { type: "button", class: "btn sm", text: String(lv.band) });
        b.addEventListener("click", () => {
          levelBtns.forEach((x) => x.classList.remove("primary"));
          b.classList.add("primary");
          picks[k].band = String(lv.band);
          const [lo, hi] = range(lv);
          mark.min = lo;
          mark.max = hi;
          if (picks[k].mark == null || picks[k].mark < lo || picks[k].mark > hi) mark.value = Math.round((lo + hi) / 2);
          picks[k].mark = +mark.value;
          checkReady();
        });
        row.appendChild(b);
        return b;
      });
      row.appendChild(h("span", { text: "Mark:", style: "margin-left:10px" }));
      const mark = h("input", { type: "number", min: 0, max: q.marks, style: "width:5em", "aria-label": "Mark for answer " + LETTERS[k] });
      mark.addEventListener("input", () => {
        picks[k].mark = mark.value === "" ? null : +mark.value;
        checkReady();
      });
      row.appendChild(mark);
      card.appendChild(row);
      const verdict = h("div");
      card.appendChild(verdict);
      main.appendChild(card);
      return { card, verdict, ex, levelBtns, mark };
    });
    const check = h("button", { type: "button", class: "btn primary", text: "Check my marking", disabled: "disabled" });
    main.appendChild(check);
    function checkReady() {
      check.disabled = !picks.every((p) => p.band && p.mark != null);
    }
    const summary = h("div", { style: "margin-top:12px" });
    main.appendChild(summary);

    check.addEventListener("click", () => {
      check.remove();
      let hits = 0,
        diff = 0;
      cards.forEach((c, k) => {
        const p = picks[k];
        const right = String(c.ex.level) === p.band;
        if (right) hits++;
        diff += Math.abs(p.mark - c.ex.mark);
        c.levelBtns.forEach((b) => (b.disabled = true));
        c.mark.disabled = true;
        c.verdict.className = "feedback " + (right ? "ok" : "bad");
        c.verdict.style.marginTop = "10px";
        c.verdict.innerHTML = '<div class="fb-title">' + (right ? "✅ Right level" : "❌ Examiner: Level " + U.esc(c.ex.level)) + " · examiner's mark " + c.ex.mark + "/" + q.marks + " (you gave " + p.mark + ")</div>" + md(c.ex.comment);
      });
      const avg = diff / cards.length;
      summary.innerHTML = '<div class="card quiz-summary"><div class="big">' + hits + "/" + cards.length + "</div><p>answers put in the right level · your marks were " + (avg < 0.05 ? "spot on" : "on average " + avg.toFixed(1) + " away from the examiner's") + ".</p><p class='small muted'>" + (hits === cards.length ? "You can tell the levels apart. Now write your own answer and hold it to the same standard." : "Read the comments on the ones you misplaced: they say what was missing for the next level up.") + "</p></div>";
      remember(q.id, { t: Date.now(), levelHits: hits, n: cards.length, markDiff: +avg.toFixed(2) });
      ownAnswer(main, q);
    });
  }

  /* ---- step 2: your own answer, self-marked with the same descriptors ---- */
  function ownAnswer(main, q) {
    const prev = saved()[q.id] || {};
    main.appendChild(h("h2", { text: "2 · Now write your own", style: "margin:24px 0 4px" }));
    main.appendChild(h("p", { class: "muted small", text: "Aim for the Level " + q.levels[q.levels.length - 1].band + " descriptor. In the exam you'd have about " + Math.round(q.marks * 1.5) + " minutes for this (papers are 100 marks in 2½ hours)." }));
    const ta = h("textarea", { rows: 12, placeholder: "Your answer…", "aria-label": "Your answer" });
    ta.value = (prev.own && prev.own.text) || "";
    ta.addEventListener("input", U.debounce(() => remember(q.id, { own: Object.assign({}, saved()[q.id].own, { text: ta.value }) }), 400));
    main.appendChild(ta);
    const box = h("div", { class: "card", style: "margin-top:12px" });
    box.appendChild(h("p", { html: "<b>Tick the indicative content you covered</b> (a top answer doesn't need all of it, but it must be applied and reach a justified conclusion):" }));
    const ul = h("ul", { class: "checklist" });
    (q.points || []).forEach((pt, j) => {
      const cb = h("input", { type: "checkbox", id: "own-" + j });
      ul.appendChild(h("li", null, [cb, h("label", { for: "own-" + j, html: CS.markdown.inline(pt) })]));
    });
    box.appendChild(ul);
    const row = h("div", { class: "row small", style: "align-items:center" }, h("span", { text: "Which level is it honestly?" }));
    q.levels.forEach((lv) => {
      const b = h("button", { type: "button", class: "btn sm" + (prev.own && prev.own.band === String(lv.band) ? " primary" : ""), text: "Level " + lv.band });
      b.addEventListener("click", () => {
        row.querySelectorAll("button").forEach((x) => x.classList.remove("primary"));
        b.classList.add("primary");
        remember(q.id, { own: Object.assign({}, saved()[q.id].own, { text: ta.value, band: String(lv.band) }) });
        CS.toast("Saved: Level " + lv.band);
      });
      row.appendChild(b);
    });
    box.appendChild(row);
    if (q.model) box.appendChild(h("details", { class: "collapse", style: "margin-top:10px", html: "<summary>Model answer</summary><div class='collapse-body'>" + md(q.model) + "</div>" }));
    main.appendChild(box);
    const qs = questions();
    const next = qs[(qs.findIndex((x) => x.id === q.id) + 1) % qs.length];
    main.appendChild(h("p", { style: "margin-top:16px" }, [h("a", { class: "btn", href: "#/levels", text: "All questions" }), " ", next && next.id !== q.id ? h("a", { class: "btn primary", href: "#/levels/" + next.id, text: "Next question →" }) : null]));
  }
})();
