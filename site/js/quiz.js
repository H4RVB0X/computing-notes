/* =====================================================================
   quiz.js — quiz engine (mcq / short / spot / order), exam-style
   self-marking questions, and the mixed-topic mock mode
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const md = (s) => CS.markdown.render(String(s == null ? "" : s), {});
  const LETTERS = "ABCDEFGH";

  /* ---------- single question renderer ---------- */
  /**
   * Render one question into container. Calls onAnswered(correct:boolean) once.
   * Returns {reveal()} for timeouts.
   */
  function renderQuestion(container, q, index, onAnswered) {
    const type = q.type || "mcq";
    const box = h("div", { class: "quiz-q" });
    const diff = q.difficulty || 2;
    const head = h("div", { class: "qnum" }, [h("span", { text: "Question " + (index + 1) }), h("span", { class: "diff diff-" + diff, text: diff === 1 ? "warm-up" : diff === 2 ? "standard" : "stretch" }), q.topic ? h("span", { class: "pill", text: q.topic }) : null]);
    if (CS.report) head.appendChild(CS.report.link({ where: "Quiz " + (q.topicId || q.topic || ""), id: q.id, text: q.q }, "⚑ Report"));
    box.appendChild(head);
    const qtext = h("div", { class: "qtext" });
    qtext.innerHTML = md(q.q);
    box.appendChild(qtext);
    if (q.code && type !== "spot") {
      const fig = h("div");
      fig.innerHTML = CS.markdown.render("```" + (q.lang || "pseudocode") + "\n" + q.code + "\n```", {});
      box.appendChild(fig);
      if (CS.enhance) CS.enhance(fig);
    }
    let answered = false;
    const fb = h("div");
    const finish = (correct, extraHtml) => {
      if (answered) return;
      answered = true;
      fb.className = "feedback " + (correct ? "ok" : "bad");
      fb.innerHTML = '<div class="fb-title">' + (correct ? "✅ Correct" : "❌ Not quite") + "</div>" + (extraHtml || "") + (q.explain ? md(q.explain) : "");
      box.appendChild(fb);
      onAnswered(correct);
    };

    if (type === "mcq" || type === "truefalse") {
      const options = type === "truefalse" ? ["True", "False"] : q.options;
      const multi = Array.isArray(q.answer);
      const answerSet = new Set(multi ? q.answer : [q.answer]);
      // shuffle MCQ options every time (so the answer's position gives nothing away), unless the
      // author opts out or an option refers to the others ("All of the above", "Both A and B"…)
      let order = options.map((o, i) => i);
      const refersToOthers = options.some((o) => /\b(all|none|both|neither) of the (above|others)\b|\b(both|neither) [A-D] (and|nor) [A-D]\b|\boptions? [A-D]\b/i.test(String(o)));
      if (type === "mcq" && q.shuffle !== false && !refersToOthers) order = U.shuffle(order);
      const opts = h("div", { class: "opts", role: multi ? "group" : "radiogroup" });
      const selected = new Set();
      const btns = [];
      order.forEach((i, k) => {
        const b = h("button", { type: "button", class: "opt", "data-i": i }, [h("span", { class: "letter", text: LETTERS[k] }), h("span", { html: CS.markdown.inline(options[i]) })]);
        b.addEventListener("click", () => {
          if (answered) return;
          if (multi) {
            if (selected.has(i)) selected.delete(i);
            else selected.add(i);
            b.classList.toggle("selected", selected.has(i));
          } else {
            selected.clear();
            selected.add(i);
            check();
          }
        });
        btns.push(b);
        opts.appendChild(b);
      });
      box.appendChild(opts);
      const check = () => {
        let correct = selected.size === answerSet.size && [...selected].every((x) => answerSet.has(x));
        btns.forEach((b) => {
          const i = +b.getAttribute("data-i");
          b.disabled = true;
          if (answerSet.has(i)) b.classList.add("correct");
          else if (selected.has(i)) b.classList.add("wrong");
        });
        let extra = "";
        if (!correct && q.wrong) {
          [...selected].forEach((i) => {
            if (!answerSet.has(i) && q.wrong[i]) extra += "<p><b>" + CS.markdown.inline(options[i]) + ":</b> " + CS.markdown.inline(q.wrong[i]) + "</p>";
          });
        }
        if (!correct && multi) extra += "<p>Correct answer" + (answerSet.size > 1 ? "s" : "") + ": " + [...answerSet].map((i) => "<b>" + LETTERS[order.indexOf(i)] + "</b>").join(", ") + "</p>";
        finish(correct, extra);
      };
      if (multi) {
        const cb = h("button", { type: "button", class: "btn primary sm", text: "Check answer", style: "margin-top:10px" });
        cb.addEventListener("click", () => selected.size && check());
        box.appendChild(cb);
        box.appendChild(h("div", { class: "small muted", text: "Select all that apply, then check." }));
      }
      box._reveal = () => {
        if (!answered) {
          selected.clear();
          check();
        }
      };
    } else if (type === "short") {
      const row = h("div", { class: "row" });
      const input = h("input", { type: "text", placeholder: q.placeholder || "Type your answer…", style: "max-width:360px", autocomplete: "off" });
      const btn = h("button", { type: "button", class: "btn primary sm", text: "Check" });
      const check = () => {
        if (answered) return;
        const given = input.value;
        if (!given.trim()) return;
        const ok = U.answerMatches(given, q.answers || q.answer);
        input.disabled = true;
        btn.disabled = true;
        finish(ok, ok ? "" : "<p>Accepted answer" + ((q.answers || []).length > 1 ? "s" : "") + ": <b>" + (q.answers || [q.answer]).slice(0, 4).map(U.esc).join("</b> / <b>") + "</b></p>");
      };
      btn.addEventListener("click", check);
      input.addEventListener("keydown", (e) => e.key === "Enter" && check());
      row.append(input, btn);
      box.appendChild(row);
      box._reveal = () => {
        if (!answered) {
          input.disabled = true;
          finish(false, "<p>Answer: <b>" + U.esc((q.answers || [q.answer])[0]) + "</b></p>");
        }
      };
    } else if (type === "spot") {
      // click the line containing the error
      const lines = String(q.code || "").split("\n");
      const codeBox = h("div", { class: "code-lines" });
      let sel = null;
      const rows = [];
      lines.forEach((l, i) => {
        const r = h("div", { class: "cl", "data-n": i + 1 }, [h("span", { class: "n", text: i + 1 }), h("span", { html: CS.highlight ? CS.highlight(l, q.lang || "python") : U.esc(l) })]);
        r.addEventListener("click", () => {
          if (answered) return;
          sel = i + 1;
          rows.forEach((x) => x.classList.toggle("selected", +x.getAttribute("data-n") === sel));
          check();
        });
        rows.push(r);
        codeBox.appendChild(r);
      });
      box.appendChild(h("div", { class: "small muted", text: "Click the line that contains the error." }));
      box.appendChild(codeBox);
      const check = () => {
        const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
        const ok = ans.includes(sel);
        rows.forEach((x) => {
          const n = +x.getAttribute("data-n");
          if (ans.includes(n)) x.classList.add("correct");
          else if (n === sel) x.classList.add("wrong");
        });
        finish(ok, ok ? "" : "<p>The error is on line <b>" + ans.join(" / ") + "</b>." + (q.fix ? " Fix: <code>" + U.esc(q.fix) + "</code>" : "") + "</p>");
      };
      box._reveal = () => {
        if (!answered) check();
      };
    } else if (type === "order") {
      // arrange items into the correct order
      const correctOrder = q.items.slice();
      let cur = U.shuffle(correctOrder.map((_, i) => i));
      if (cur.every((v, i) => v === i)) cur.reverse();
      const ul = h("ol", { class: "order-list" });
      const draw = () => {
        ul.innerHTML = "";
        cur.forEach((idx, pos) => {
          const li = h("li", null, [h("span", { class: "txt", html: CS.markdown.inline(correctOrder[idx]) })]);
          const up = h("button", { type: "button", class: "btn sm ghost", text: "▲", "aria-label": "move up" });
          const dn = h("button", { type: "button", class: "btn sm ghost", text: "▼", "aria-label": "move down" });
          up.addEventListener("click", () => {
            if (answered || pos === 0) return;
            [cur[pos - 1], cur[pos]] = [cur[pos], cur[pos - 1]];
            draw();
          });
          dn.addEventListener("click", () => {
            if (answered || pos === cur.length - 1) return;
            [cur[pos + 1], cur[pos]] = [cur[pos], cur[pos + 1]];
            draw();
          });
          li.append(up, dn);
          ul.appendChild(li);
        });
      };
      draw();
      box.appendChild(h("div", { class: "small muted", text: "Use the arrows to put the steps in the correct order, then check." }));
      box.appendChild(ul);
      const btn = h("button", { type: "button", class: "btn primary sm", text: "Check order", style: "margin-top:10px" });
      const check = () => {
        if (answered) return;
        let ok = true;
        [...ul.children].forEach((li, pos) => {
          const right = cur[pos] === pos;
          li.classList.add(right ? "correct" : "wrong");
          if (!right) ok = false;
        });
        finish(ok, ok ? "" : "<p>Correct order:</p><ol>" + correctOrder.map((x) => "<li>" + CS.markdown.inline(x) + "</li>").join("") + "</ol>");
      };
      btn.addEventListener("click", check);
      box.appendChild(btn);
      box._reveal = check;
    } else {
      box.appendChild(h("p", { class: "err", text: "Unknown question type: " + type }));
    }
    container.appendChild(box);
    return box;
  }
  CS.quiz = { renderQuestion: renderQuestion };

  /* ---------- quiz page ---------- */
  CS.views.quiz = function (main, arg) {
    const id = arg[0];
    const meta = CS.topicMeta(id);
    const all = CS.quizzes[id] || [];
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · Quiz " + id;
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/topic/' + id + '">' + id + " " + U.esc(meta.title) + '</a> › Quiz</div><h1>Quiz: ' + U.esc(meta.title) + "</h1>" }));
    if (!all.length) {
      main.appendChild(h("div", { class: "card", text: "No quiz questions have been written for this topic yet." }));
      return;
    }
    // setup
    const setup = h("div", { class: "card" });
    setup.innerHTML = "<p>" + all.length + " questions: " + all.filter((q) => (q.difficulty || 2) === 1).length + " warm-up, " + all.filter((q) => (q.difficulty || 2) === 2).length + " standard, " + all.filter((q) => (q.difficulty || 2) === 3).length + " stretch. You get instant feedback and an explanation after each answer.</p>";
    const row = h("div", { class: "row" });
    const count = h("select", { style: "width:auto" });
    [["all", "All questions"], ["10", "10 random"], ["5", "5 quick ones"]].forEach(([v, t]) => count.appendChild(h("option", { value: v, text: t })));
    const shuffle = h("label", { class: "row small" }, [h("input", { type: "checkbox", checked: "checked" }), h("span", { text: "Shuffle" })]);
    const start = h("button", { class: "btn primary", type: "button", text: "Start quiz" });
    row.append(count, shuffle, start);
    setup.appendChild(row);
    const best = CS.progress.topic(id).quizBest;
    if (best != null) setup.appendChild(h("p", { class: "small muted", style: "margin:10px 0 0", text: "Your best score so far: " + best + "%." }));
    main.appendChild(setup);
    start.addEventListener("click", () => {
      let qs = all.slice();
      if (shuffle.querySelector("input").checked) qs = U.shuffle(qs);
      if (count.value !== "all") qs = qs.slice(0, +count.value);
      setup.remove();
      runQuiz(main, qs, { topicId: id, title: meta.title });
    });
  };

  /** Run a sequence of questions one at a time. opts: {topicId, title, timeLimit (s), onDone} */
  function runQuiz(main, qs, opts) {
    let i = 0,
      score = 0;
    const results = [];
    const wrap = h("div");
    const nav = h("div", { class: "quiz-nav" });
    const progress = h("div", { class: "progress-bar", style: "flex:1;min-width:120px" }, h("i"));
    const counter = h("span", { class: "mono small" });
    const timer = h("span", { class: "timer", style: opts.timeLimit ? "" : "display:none" });
    nav.append(counter, progress, timer);
    main.appendChild(nav);
    main.appendChild(wrap);
    let remaining = opts.timeLimit || 0;
    let tick = null;
    if (opts.timeLimit) {
      const draw = () => {
        const m = Math.floor(remaining / 60),
          s = remaining % 60;
        timer.textContent = m + ":" + (s < 10 ? "0" : "") + s;
        timer.classList.toggle("low", remaining <= 60);
      };
      draw();
      tick = setInterval(() => {
        if (!wrap.isConnected) return clearInterval(tick); // left the page: abandon this timed run
        remaining--;
        draw();
        if (remaining <= 0) {
          clearInterval(tick);
          CS.toast("Time's up!");
          finishAll(true);
        }
      }, 1000);
    }
    const nextBtn = h("button", { type: "button", class: "btn primary", text: "Next question →", style: "display:none;margin:8px 0 24px" });
    main.appendChild(nextBtn);
    const show = () => {
      wrap.innerHTML = "";
      counter.textContent = i + 1 + " / " + qs.length;
      progress.firstChild.style.width = Math.round((i / qs.length) * 100) + "%";
      const q = qs[i];
      const box = renderQuestion(wrap, q, i, (ok) => {
        if (ok) score++;
        results.push({ q: q, ok: ok });
        if (CS.mistakes) CS.mistakes.record(q, ok);
        nextBtn.style.display = "";
        nextBtn.textContent = i === qs.length - 1 ? "See results →" : "Next question →";
        nextBtn.focus();
      });
      wrap._box = box;
      window.scrollTo({ top: Math.max(0, nav.offsetTop - 80), behavior: "smooth" });
    };
    const finishAll = (timedOut) => {
      if (tick) clearInterval(tick);
      // reveal any unanswered
      if (timedOut && wrap._box && wrap._box._reveal) wrap._box._reveal();
      nav.remove();
      wrap.innerHTML = "";
      nextBtn.remove();
      const total = qs.length;
      const pct = Math.round((score / total) * 100);
      if (opts.topicId) CS.progress.setQuiz(opts.topicId, score, total);
      const sum = h("div", { class: "card quiz-summary" });
      sum.innerHTML = '<div class="big">' + pct + '%</div><p>You scored <b>' + score + " / " + total + "</b>" + (timedOut ? " (time ran out)" : "") + ".</p><p>" + (pct >= 85 ? "Excellent — this topic is in good shape. Try the exam-style questions next." : pct >= 60 ? "Solid, but check the explanations for the ones you missed and retry in a day or two." : "Reread the page (Full detail), then retry — focus on the explanations below.") + "</p>";
      const row = h("div", { class: "row", style: "justify-content:center" });
      const again = h("button", { type: "button", class: "btn primary", text: "Try again" });
      again.addEventListener("click", () => CS.route());
      row.appendChild(again);
      if (opts.topicId) {
        row.appendChild(h("a", { class: "btn", href: "#/topic/" + opts.topicId, text: "Back to notes" }));
        row.appendChild(h("a", { class: "btn", href: "#/exam/" + opts.topicId, text: "Exam-style questions" }));
      }
      sum.appendChild(row);
      wrap.appendChild(sum);
      if (opts.onDone) opts.onDone(results, score, total);
      // review list of wrong answers
      const wrong = results.filter((r) => !r.ok);
      if (wrong.length) {
        wrap.appendChild(h("h3", { text: "Review the ones you missed", style: "margin-top:20px" }));
        wrong.forEach((r, k) => {
          const d = h("div", { class: "quiz-q" });
          d.innerHTML = '<div class="qnum">' + (r.q.topic ? "<span class='pill'>" + U.esc(r.q.topic) + "</span>" : "") + '</div><div class="qtext">' + md(r.q.q) + "</div>" + answerHtml(r.q) + (r.q.explain ? '<div class="feedback ok" style="margin-top:8px">' + md(r.q.explain) + "</div>" : "");
          if (CS.report) d.querySelector(".qnum").appendChild(CS.report.link({ where: "Quiz " + (r.q.topicId || ""), id: r.q.id, text: r.q.q }, "⚑ Report"));
          wrap.appendChild(d);
        });
      }
      document.querySelectorAll(".nav-topics a").forEach((a) => {
        if (a.getAttribute("data-topic") === opts.topicId) {
          const c = CS.progress.completion(opts.topicId);
          a.querySelector(".prog i").style.width = Math.round(c * 100) + "%";
        }
      });
    };
    nextBtn.addEventListener("click", () => {
      nextBtn.style.display = "none";
      i++;
      if (i >= qs.length) finishAll(false);
      else show();
    });
    show();
  }
  CS.quiz.run = runQuiz;

  function answerHtml(q) {
    const t = q.type || "mcq";
    if (t === "mcq") {
      const ans = Array.isArray(q.answer) ? q.answer : [q.answer];
      return "<p><b>Answer:</b> " + ans.map((i) => CS.markdown.inline(q.options[i])).join(", ") + "</p>";
    }
    if (t === "truefalse") return "<p><b>Answer:</b> " + (q.answer === 0 ? "True" : "False") + "</p>";
    if (t === "short") return "<p><b>Answer:</b> " + U.esc((q.answers || [q.answer])[0]) + "</p>";
    if (t === "spot") return "<p><b>Error on line " + (Array.isArray(q.answer) ? q.answer.join("/") : q.answer) + "</b>" + (q.fix ? " — fix: <code>" + U.esc(q.fix) + "</code>" : "") + "</p>";
    if (t === "order") return "<p><b>Correct order:</b></p><ol>" + q.items.map((x) => "<li>" + CS.markdown.inline(x) + "</li>").join("") + "</ol>";
    return "";
  }

  /* ---------- exam-style questions with self-marking ---------- */
  CS.views.exam = function (main, arg) {
    const id = arg[0];
    const meta = CS.topicMeta(id);
    const qs = CS.exams[id] || [];
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · Exam questions " + id;
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/topic/' + id + '">' + id + " " + U.esc(meta.title) + '</a> › Exam-style questions</div><h1>Exam-style questions: ' + U.esc(meta.title) + '</h1><p class="muted">Write your answer as you would in the exam, then reveal the mark scheme and tick each marking point you hit. Be honest — the point is to learn what the examiner is looking for.</p>' }));
    if (!qs.length) {
      main.appendChild(h("div", { class: "card", text: "No exam-style questions for this topic yet." }));
      return;
    }
    const totals = h("div", { class: "card", style: "margin-bottom:14px" });
    const totalMarks = qs.reduce((a, q) => a + (q.marks || 0), 0);
    const scoreLine = h("div", { class: "row spread" }, [h("span", { html: "<b>Your self-marked total:</b> <span class='score-pill' id='exam-total'>0</span> / " + totalMarks }), h("span", { class: "small muted", text: "Scores are saved on this device." })]);
    totals.appendChild(scoreLine);
    main.appendChild(totals);
    const scores = {};
    const saved = CS.store.get("exam." + id, {});
    const updateTotal = () => {
      const t = Object.keys(scores).reduce((a, k2) => a + (k2.endsWith("_pts") ? 0 : scores[k2]), 0);
      document.getElementById("exam-total").textContent = t;
      CS.store.set("exam." + id, scores);
      if (Object.keys(scores).length) CS.store.set("topics." + id + ".examDone", true);
    };
    qs.forEach((q, k) => {
      const box = h("div", { class: "exam-q" });
      const cmd = (q.q.match(/^(State|Describe|Explain|Discuss|Evaluate|Compare|Define|Give|Identify|Write|Calculate|Show|Complete|Convert|Outline|Justify|Draw|Suggest|Analyse|Name|Trace)\b/) || [""])[0];
      box.innerHTML = '<span class="marks">[' + q.marks + " mark" + (q.marks === 1 ? "" : "s") + ']</span><div class="qnum">Question ' + (k + 1) + (cmd ? ' · <span class="cmd">' + cmd + "</span>" : "") + '</div><div class="qtext">' + md(q.q) + "</div>";
      if (q.code) {
        const fig = h("div");
        fig.innerHTML = CS.markdown.render("```" + (q.lang || "pseudocode") + "\n" + q.code + "\n```", {});
        box.appendChild(fig);
        CS.enhance && CS.enhance(fig);
      }
      const ta = h("textarea", { placeholder: "Write your answer here…", "aria-label": "Your answer" });
      ta.value = CS.store.get("examAnswers." + id, {})[q.id] || "";
      ta.addEventListener(
        "input",
        U.debounce(() => {
          CS.store.update("examAnswers." + id, (all) => Object.assign(all, { [q.id]: ta.value }), {});
          CS.store.stampText("examAnswers." + id + "." + q.id); // newest edit wins across devices
        }, 400)
      );
      box.appendChild(ta);
      const reveal = h("button", { type: "button", class: "btn sm", text: "Reveal mark scheme", style: "margin-top:8px" });
      box.appendChild(reveal);
      const scheme = h("div", { class: "scheme", style: "display:none" });
      const qKey = q.id;
      if (q.levels) {
        scheme.appendChild(h("p", { html: "<b>Levels of response.</b> Choose the band that best describes your answer." + (q.guidance ? " " + md(q.guidance) : "") }));
        q.levels.forEach((lv) => {
          const d = h("div", { class: "level", html: "<b>Level " + U.esc(lv.band) + " (" + U.esc(lv.marks) + " marks):</b> " + md(lv.desc) });
          d.addEventListener("click", () => {
            scheme.querySelectorAll(".level").forEach((x) => x.classList.remove("selected"));
            d.classList.add("selected");
            scores[qKey] = +lv.score;
            updateTotal();
          });
          scheme.appendChild(d);
        });
        if (q.points && q.points.length) scheme.appendChild(h("div", { html: "<p><b>Indicative content</b> (what a top answer mentions):</p><ul>" + q.points.map((p) => "<li>" + CS.markdown.inline(p) + "</li>").join("") + "</ul>" }));
        if (q.exemplars && q.exemplars.length) scheme.appendChild(h("p", { class: "small", html: "🎯 Not sure which level you're in? <a href='#/levels/" + q.id + "'>Mark three example answers for this question</a> in the extended-answer trainer." }));
      } else {
        const pts = q.scheme || q.points || [];
        scheme.appendChild(h("p", { html: "<b>Mark scheme</b> — tick each point you made. " + (q.maxPoints && q.maxPoints < pts.length ? "Any <b>" + q.marks + "</b> of these for full marks." : "") + (q.guidance ? "<br>" + CS.markdown.inline(q.guidance) : "") }));
        const ul = h("ul");
        const boxes = [];
        pts.forEach((p, j) => {
          const cb = h("input", { type: "checkbox", id: "ex-" + id + "-" + k + "-" + j });
          const saved1 = (saved[qKey + "_pts"] || [])[j];
          if (saved1) cb.checked = true;
          boxes.push(cb);
          const li = h("li", null, [cb, h("label", { for: cb.id, html: CS.markdown.inline(p) })]);
          cb.addEventListener("change", () => {
            const n = boxes.filter((b) => b.checked).length;
            scores[qKey] = Math.min(q.marks, n * (q.marksPerPoint || 1));
            scores[qKey + "_pts"] = boxes.map((b) => (b.checked ? 1 : 0));
            got.textContent = scores[qKey] + " / " + q.marks;
            updateTotal();
          });
          ul.appendChild(li);
        });
        scheme.appendChild(ul);
        const got = h("div", { class: "score-pill", text: (scores[qKey] || 0) + " / " + q.marks });
        scheme.appendChild(got);
        if (saved[qKey + "_pts"]) {
          scores[qKey] = Math.min(q.marks, boxes.filter((b) => b.checked).length * (q.marksPerPoint || 1));
          scores[qKey + "_pts"] = saved[qKey + "_pts"];
          got.textContent = scores[qKey] + " / " + q.marks;
        }
      }
      if (q.model) scheme.appendChild(h("details", { class: "collapse", style: "margin-top:10px", html: "<summary>Model answer</summary><div class='collapse-body'>" + md(q.model) + "</div>" }));
      const tools = h("div", { class: "row small", style: "justify-content:flex-end;margin-top:8px" });
      if (CS.mistakes) tools.appendChild(CS.mistakes.addButton(q));
      if (CS.report) tools.appendChild(CS.report.link({ where: "Exam questions " + id + ", Q" + (k + 1), id: q.id, text: q.q }));
      scheme.appendChild(tools);
      box.appendChild(scheme);
      reveal.addEventListener("click", () => {
        scheme.style.display = scheme.style.display === "none" ? "" : "none";
        reveal.textContent = scheme.style.display === "none" ? "Reveal mark scheme" : "Hide mark scheme";
      });
      main.appendChild(box);
    });
    // restore saved totals
    Object.keys(saved).forEach((k2) => {
      if (!k2.endsWith("_pts") && typeof saved[k2] === "number") scores[k2] = saved[k2];
    });
    updateTotal();
  };

  /* ---------- mixed mock ---------- */
  CS.views.mock = function (main) {
    document.title = "CS Revision · Mixed mock";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Mock</div><h1>Mixed-topic mock</h1><p class="muted">Random questions from the topics you choose, with an optional timer and a breakdown by topic at the end.</p>' }));
    const card = h("div", { class: "card" });
    const form = h("div");
    const topicsBox = h("div", { class: "mock-topics" });
    const checks = [];
    CS.sections.forEach((s) => {
      const secLabel = h("div", { class: "sec" });
      const all = h("input", { type: "checkbox" });
      secLabel.append(all, h("span", { text: s.id + " " + s.title }));
      topicsBox.appendChild(secLabel);
      const these = [];
      s.topics.forEach((t) => {
        const n = (CS.quizzes[t.id] || []).length;
        if (!n) return;
        const cb = h("input", { type: "checkbox", value: t.id });
        const lab = h("label", null, [cb, h("span", { text: t.id + " " + t.title }), h("span", { class: "muted small", text: "(" + n + ")" })]);
        checks.push(cb);
        these.push(cb);
        topicsBox.appendChild(lab);
      });
      all.addEventListener("change", () => these.forEach((c) => (c.checked = all.checked)));
    });
    const quick = h("div", { class: "row", style: "margin-bottom:10px" });
    const selAll = h("button", { type: "button", class: "btn sm", text: "Select all" });
    const selNone = h("button", { type: "button", class: "btn sm", text: "Clear" });
    const selWeak = h("button", { type: "button", class: "btn sm", text: "Weakest 5 topics" });
    const selPaper1 = h("button", { type: "button", class: "btn sm", text: "Paper 1 topics (1–4)" });
    const selPaper2 = h("button", { type: "button", class: "btn sm", text: "Paper 2 topics (5–12)" });
    selAll.addEventListener("click", () => checks.forEach((c) => (c.checked = true)));
    selNone.addEventListener("click", () => checks.forEach((c) => (c.checked = false)));
    selWeak.addEventListener("click", () => {
      const weak = CS.progress.weakest(5).map((w) => w.id);
      checks.forEach((c) => (c.checked = weak.includes(c.value)));
      if (!weak.length) CS.toast("No quiz results yet — try some quizzes first");
    });
    selPaper1.addEventListener("click", () => checks.forEach((c) => (c.checked = /^[1-4]\./.test(c.value))));
    selPaper2.addEventListener("click", () => checks.forEach((c) => (c.checked = /^([5-9]|1[0-2])\./.test(c.value))));
    quick.append(selAll, selNone, selWeak, selPaper1, selPaper2);
    form.append(quick, topicsBox);
    const opts = h("div", { class: "row", style: "margin-top:14px" });
    const n = h("select", { style: "width:auto" });
    [10, 20, 30, 40, 60].forEach((v) => n.appendChild(h("option", { value: v, text: v + " questions" })));
    n.value = "20";
    const t = h("select", { style: "width:auto" });
    [["0", "No timer"], ["600", "10 minutes"], ["1200", "20 minutes"], ["1800", "30 minutes"], ["2700", "45 minutes"]].forEach(([v, l]) => t.appendChild(h("option", { value: v, text: l })));
    const start = h("button", { type: "button", class: "btn primary", text: "Start mock" });
    opts.append(n, t, start);
    form.appendChild(opts);
    card.appendChild(form);
    main.appendChild(card);
    const hist = CS.store.get("mocks", []);
    if (hist.length) {
      const hc = h("div", { class: "card", style: "margin-top:14px" });
      hc.innerHTML = "<h3 style='margin-top:0'>Previous mocks</h3>" + '<div class="table-wrap"><table><thead><tr><th>Date</th><th>Topics</th><th>Score</th></tr></thead><tbody>' + hist.slice(-8).reverse().map((m) => "<tr><td>" + U.fmtDate(m.t) + "</td><td>" + U.esc(m.topics) + "</td><td>" + Number(m.score) + "/" + Number(m.total) + " (" + Number(m.pct) + "%)</td></tr>").join("") + "</tbody></table></div>";
      main.appendChild(hc);
    }
    start.addEventListener("click", () => {
      const chosen = checks.filter((c) => c.checked).map((c) => c.value);
      if (!chosen.length) return CS.toast("Choose at least one topic");
      let pool = [];
      chosen.forEach((id) => (CS.quizzes[id] || []).forEach((q) => pool.push(Object.assign({}, q, { topic: id }))));
      pool = U.shuffle(pool).slice(0, +n.value);
      card.remove();
      main.querySelectorAll(".card").forEach((c) => c.remove());
      runQuiz(main, pool, {
        title: "Mock",
        timeLimit: +t.value || 0,
        onDone: (results, score, total) => {
          const byTopic = {};
          results.forEach((r) => {
            const b = (byTopic[r.q.topic] = byTopic[r.q.topic] || { ok: 0, n: 0 });
            b.n++;
            if (r.ok) b.ok++;
          });
          const pct = Math.round((score / total) * 100);
          const bd = h("div", { class: "card", style: "margin-top:16px" });
          bd.innerHTML = "<h3 style='margin-top:0'>Breakdown by topic</h3>";
          let html = '<div class="table-wrap"><table class="breakdown"><thead><tr><th>Topic</th><th>Score</th><th class="bar"></th><th>Next step</th></tr></thead><tbody>';
          Object.keys(byTopic)
            .sort((a, b) => byTopic[a].ok / byTopic[a].n - byTopic[b].ok / byTopic[b].n)
            .forEach((id) => {
              const b = byTopic[id];
              const p = Math.round((b.ok / b.n) * 100);
              const m = CS.topicMeta(id);
              html += "<tr><td><a href='#/topic/" + id + "'>" + id + " " + U.esc(m ? m.title : "") + "</a></td><td>" + b.ok + "/" + b.n + "</td><td class='bar'><div class='progress-bar'><i style='width:" + p + "%'></i></div></td><td>" + (p < 50 ? "<a href='#/topic/" + id + "'>Reread notes</a>" : p < 80 ? "<a href='#/quiz/" + id + "'>Retry topic quiz</a>" : "<a href='#/exam/" + id + "'>Exam-style Qs</a>") + "</td></tr>";
            });
          html += "</tbody></table></div>";
          bd.insertAdjacentHTML("beforeend", html);
          main.appendChild(bd);
          hist.push({ t: Date.now(), topics: chosen.length, score: score, total: total, pct: pct });
          CS.store.set("mocks", hist.slice(-30));
          // record weak topics into per-topic history so "weakest" reflects mocks too
          Object.keys(byTopic).forEach((id) => {
            const b = byTopic[id];
            if (b.n >= 3) {
              const prev = CS.progress.topic(id);
              if (prev.quizBest == null) CS.progress.setQuiz(id, b.ok, b.n);
            }
          });
        },
      });
    });
  };
})();
