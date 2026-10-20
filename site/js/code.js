/* =====================================================================
   code.js — code practice: write Python in the browser, run it against automatic tests
   (Paper 1 Section B style). Python runs in js/py-worker.js via Pyodide, loaded from a CDN
   the first time it's needed (about 10 MB, then cached).
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const md = (s) => CS.markdown.render(String(s == null ? "" : s), {});
  const TIME_LIMIT = 3000; // ms per run (2 s of Python plus some slack for the browser)
  const DIFF = { 1: "warm-up", 2: "standard", 3: "stretch" };

  /* ---------------- the Python runner ---------------- */
  let worker = null,
    readyPromise = null,
    seq = 0;
  const waiting = {};
  function startWorker(onLoading) {
    if (worker) return readyPromise;
    worker = new Worker("js/py-worker.js");
    readyPromise = new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        const m = e.data;
        if (m.type === "ready") resolve();
        else if (m.type === "failed") reject(new Error(m.error));
        else if (m.type === "result" && waiting[m.id]) waiting[m.id](m);
      };
      worker.onerror = (e) => reject(new Error(e.message || "Python could not be loaded"));
    });
    if (onLoading) onLoading();
    readyPromise.catch(() => stopWorker());
    return readyPromise;
  }
  function stopWorker() {
    if (worker) worker.terminate();
    worker = null;
    readyPromise = null;
    // any other run still waiting on this worker would never be answered: tell it to try again
    Object.keys(waiting).forEach((k) => waiting[k]({ out: "", transcript: "", error: "Python was restarted (another program ran for too long). Run it again.", restarted: true }));
  }
  /** run once: resolves {out, transcript, error, timedOut}. If Python was restarted under it (another
      program hit the time limit), it's simply run again on the fresh worker. */
  function runOnce(code, input, extra, files, eofOk) {
    return runRaw(code, input, extra, files, eofOk).then((r) => (r.restarted ? runRaw(code, input, extra, files, eofOk) : r));
  }
  function runRaw(code, input, extra, files, eofOk) {
    return (worker ? readyPromise : startWorker()).then(
      () =>
        new Promise((resolve) => {
          const id = ++seq;
          const timer = setTimeout(() => {
            delete waiting[id];
            stopWorker(); // the only way to stop a runaway loop; the next run reloads Python (cached)
            resolve({ out: "", transcript: "", error: "Time limit exceeded: your program ran for more than 2 seconds. Is there an infinite loop, or an input() it keeps waiting on?", timedOut: true });
          }, TIME_LIMIT);
          waiting[id] = (m) => {
            clearTimeout(timer);
            delete waiting[id];
            resolve(m);
          };
          worker.postMessage({ id: id, code: code, input: input, extra: extra, files: files, eofOk: !!eofOk });
        })
    );
  }

  /* ---------------- output checking (same rules as scripts/check_problems.py) ---------------- */
  const rlines = (s) => {
    const l = String(s).replace(/\r/g, "").split("\n").map((x) => x.replace(/\s+$/, ""));
    while (l.length && l[l.length - 1] === "") l.pop();
    return l;
  };
  function passes(test, mode, out) {
    if (mode === "contains") {
      let pos = 0;
      return rlines(test.expect)
        .filter(Boolean)
        .every((line) => {
          const i = out.indexOf(line, pos);
          if (i === -1) return false;
          pos = i + line.length;
          return true;
        });
    }
    const a = rlines(out),
      b = rlines(test.expect);
    return a.length === b.length && a.every((x, i) => x === b[i]);
  }
  CS.codePractice = { passes: passes };

  /* ---------------- storage ---------------- */
  const drafts = () => CS.store.get("codeDrafts", {});
  const solved = () => CS.store.get("codeSolved", {});
  const list = () => Object.values(CS.problems).sort((a, b) => topicOrder(a.topic) - topicOrder(b.topic) || a.difficulty - b.difficulty || a.title.localeCompare(b.title));
  function topicOrder(t) {
    const i = CS.allTopicIds().indexOf(t);
    return i === -1 ? 999 : i;
  }

  /* ---------------- list page ---------------- */
  CS.views.code = function (main, arg) {
    if (arg[0]) return problemPage(main, arg[0]);
    document.title = "CS Revision · Code practice";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Code practice</div><h1>Code practice</h1><p class="muted">Write real Python and check it against automatic tests, like Paper 1 Section B. Some tests are hidden, so make your program work in general, not just for the example. Only what you <code>print</code> is checked: put prompts inside <code>input("…")</code> rather than printing them separately. Python runs inside your browser: nothing is sent anywhere.</p>' }));
    const all = list();
    if (!all.length) {
      main.appendChild(h("div", { class: "card", text: "No coding problems yet." }));
      return;
    }
    const s = solved();
    const nSolved = all.filter((p) => s[p.id]).length;
    main.appendChild(h("div", { class: "card", style: "margin-bottom:14px", html: '<div class="stat-row"><div class="stat"><div class="v">' + nSolved + "/" + all.length + '</div><div class="l">solved</div></div>' + [1, 2, 3].map((d) => '<div class="stat"><div class="v">' + all.filter((p) => p.difficulty === d && s[p.id]).length + "/" + all.filter((p) => p.difficulty === d).length + '</div><div class="l">' + DIFF[d] + "</div></div>").join("") + "</div>" + (location.protocol === "file:" ? "<p class='small' style='margin:10px 0 0'>⚠️ Code practice needs the live website (or a local server such as <code>python3 -m http.server</code> in the <code>site</code> folder): browsers don't run background Python from a file.</p>" : "") }));
    const filter = h("div", { class: "row small", style: "margin-bottom:10px" });
    let level = 0; // 0 all, 1-3 difficulty, "pot" skeleton-program (Section D) tasks, "bk" programming booklet
    const table = h("div", { class: "table-wrap" });
    const draw = () => {
      const rows = all.filter((p) => (level === "pot" ? p.topic === "P.5" : level === "bk" ? /^bk-/.test(p.id) : !level || p.difficulty === level));
      table.innerHTML =
        "<table><thead><tr><th></th><th>Problem</th><th>Topic</th><th>Level</th></tr></thead><tbody>" +
        rows
          .map((p) => {
            const m = CS.topicMeta(p.topic);
            return "<tr><td>" + (s[p.id] ? "✅" : "") + "</td><td><a href='#/code/" + p.id + "'>" + U.esc(p.title) + "</a></td><td>" + U.esc(p.topic + (m ? " " + m.title : "")) + "</td><td><span class='diff diff-" + p.difficulty + "'>" + DIFF[p.difficulty] + "</span></td></tr>";
          })
          .join("") +
        "</tbody></table>";
    };
    const filters = [[0, "All"], [1, "Warm-up"], [2, "Standard"], [3, "Stretch"]];
    if (all.some((p) => p.topic === "P.5")) filters.push(["pot", "Paper 1 skeleton (Section D)"]);
    if (all.some((p) => /^bk-/.test(p.id))) filters.push(["bk", "Programming booklet"]);
    filters.forEach(([v, t]) => {
      const b = h("button", { type: "button", class: "btn sm" + (v === 0 ? " primary" : ""), text: t });
      b.addEventListener("click", () => {
        level = v;
        filter.querySelectorAll("button").forEach((x) => x.classList.remove("primary"));
        b.classList.add("primary");
        draw();
      });
      filter.appendChild(b);
    });
    main.append(filter, table);
    draw();
  };

  /* ---------------- one problem ---------------- */
  function problemPage(main, id) {
    const p = CS.problems[id];
    if (!p) return CS.views.notfound(main);
    const meta = CS.topicMeta(p.topic);
    document.title = "CS Revision · " + p.title;
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/code">Code practice</a> › ' + U.esc(p.title) + "</div><h1>" + U.esc(p.title) + '</h1><div class="row small"><span class="diff diff-' + p.difficulty + '">' + DIFF[p.difficulty] + "</span>" + (meta ? "<a class='pill' href='#/topic/" + p.topic + "'>" + p.topic + " " + U.esc(meta.title) + "</a>" : "") + (solved()[id] ? "<span class='pill ok'>✅ solved</span>" : "") + "</div>" }));
    const task = h("div", { class: "card code-task" });
    task.innerHTML = md(p.task);
    if (p.files && Object.keys(p.files).length) task.insertAdjacentHTML("beforeend", "<p class='small muted'>Files available to your program: " + Object.keys(p.files).map((f) => "<code>" + U.esc(f) + "</code>").join(", ") + " (each test may use different contents).</p>");
    if (CS.report) task.appendChild(h("div", { class: "row small", style: "justify-content:flex-end" }, CS.report.link({ where: "Code practice: " + p.title, id: "code/" + id, text: p.title })));
    main.appendChild(task);
    if (CS.enhance) CS.enhance(task);

    // editor
    // an empty draft means "start again": it's stored (with its edit time) so the reset reaches other devices
    const saveDraft = (v) => {
      CS.store.update("codeDrafts", (d) => Object.assign(d, { [id]: v }), {});
      CS.store.stampText("codeDrafts." + id);
    };
    const editor = makeEditor(drafts()[id] || p.starter || "");
    editor.onChange(U.debounce(() => saveDraft(editor.value()), 400)); // reads the editor when it fires, so a reset can't be overwritten
    main.appendChild(editor.el);
    main.appendChild(h("p", { class: "small muted", style: "margin:4px 0 0", text: "Tab indents (4 spaces). To move on with the keyboard, press Esc then Tab." }));

    const visible = p.tests.filter((t) => !t.hidden);
    const stdin = h("textarea", { class: "mono stdin", rows: 3, spellcheck: "false", "aria-label": "Input for Run" });
    stdin.value = (visible.find((t) => t.input != null) || {}).input || "";
    const runBtn = h("button", { type: "button", class: "btn", text: "▶ Run" });
    const checkBtn = h("button", { type: "button", class: "btn primary", text: "✔ Check against tests" });
    const resetBtn = h("button", { type: "button", class: "btn ghost sm", text: "↺ Start again" });
    main.appendChild(h("div", { class: "row", style: "margin:10px 0" }, [checkBtn, runBtn, h("span", { class: "grow" }), resetBtn]));
    stdin.style.marginBottom = "10px";
    main.appendChild(h("label", { class: "small muted", style: "display:block;margin:0 0 4px", text: "Input used by ▶ Run: one line per input() call" }));
    main.appendChild(stdin);
    const status = h("div", { class: "small muted", style: "min-height:1.4em" });
    const output = h("pre", { class: "code-output", style: "display:none" });
    const results = h("div");
    main.append(status, output, results);

    const busy = (on) => (runBtn.disabled = checkBtn.disabled = on);
    const ensurePython = () => {
      if (location.protocol === "file:") {
        status.innerHTML = "⚠️ Code practice needs the live website (or a local server: <code>python3 -m http.server</code> in the <code>site</code> folder). Browsers don't run background Python from a file.";
        return Promise.reject(new Error("file"));
      }
      if (!navigator.onLine && !worker) status.textContent = "You're offline. Python loads from the internet the first time (then it's saved), so this may fail.";
      return startWorker(() => (status.textContent = "Loading Python… (the first time takes a few seconds; after that it's saved)")).catch((err) => {
        status.textContent = "Couldn't load Python: " + err.message + ". Check your internet connection and try again.";
        throw err;
      });
    };

    runBtn.addEventListener("click", async () => {
      busy(true);
      try {
        await ensurePython();
        status.textContent = "Running…";
        const r = await runOnce(editor.value(), stdin.value, "", (visible[0] && visible[0].files) || p.files || {}, p.eofOk);
        output.style.display = "";
        output.textContent = r.transcript + (r.error ? (r.transcript && !r.transcript.endsWith("\n") ? "\n" : "") + "⚠ " + r.error : "") || "(no output)";
        status.textContent = r.error ? "Your program stopped with an error." : "Finished.";
      } catch (e) {}
      busy(false);
    });

    checkBtn.addEventListener("click", async () => {
      busy(true);
      results.innerHTML = "";
      output.style.display = "none";
      try {
        await ensurePython();
        const rows = [];
        for (let i = 0; i < p.tests.length; i++) {
          if (!editor.el.isConnected) return; // left the page: stop running this problem's tests
          status.textContent = "Running test " + (i + 1) + " of " + p.tests.length + "…";
          const t = p.tests[i];
          const r = await runOnce(editor.value(), t.input || "", t.code || "", t.files || p.files || {}, p.eofOk);
          rows.push({ t: t, r: r, ok: !r.error && passes(t, p.match, r.out) });
        }
        const nOk = rows.filter((x) => x.ok).length;
        status.textContent = "";
        showResults(results, p, rows);
        if (nOk === rows.length) {
          const first = !solved()[id];
          CS.store.update("codeSolved", (s) => Object.assign(s, { [id]: Date.now() }), {});
          if (first) CS.toast("Solved! ✅");
          solution.style.display = "";
          if (peek.isConnected) peek.remove();
        }
      } catch (e) {}
      busy(false);
    });

    resetBtn.addEventListener("click", () => {
      if (!confirm("Replace your code with the starting code?")) return;
      editor.set(p.starter || "");
      saveDraft("");
    });

    // hints, then the model answer
    const help = h("div", { class: "card", style: "margin-top:16px" });
    const hintBox = h("div");
    let shown = 0;
    const hintBtn = h("button", { type: "button", class: "btn sm", text: "💡 Hint (" + (p.hints || []).length + ")" });
    hintBtn.addEventListener("click", () => {
      if (shown >= p.hints.length) return;
      hintBox.appendChild(h("div", { class: "callout callout-tip", style: "margin:8px 0", html: "<div class='callout-body'><p><b>Hint " + (shown + 1) + ".</b> " + CS.markdown.inline(p.hints[shown]) + "</p></div>" }));
      shown++;
      hintBtn.textContent = shown < p.hints.length ? "💡 Another hint" : "No more hints";
      hintBtn.disabled = shown >= p.hints.length;
    });
    const solution = h("div", { style: solved()[id] ? "" : "display:none" });
    // skeleton tasks show just the changed code; the full program is one click away
    solution.innerHTML = p.answer
      ? "<h3>Model answer</h3>" + md(p.answer) + "<details class='collapse'><summary>The whole modified program</summary><div class='collapse-body'>" + CS.markdown.render("```python\n" + p.solution + "\n```", {}) + "</div></details>" + (p.explain ? md(p.explain) : "")
      : "<h3>Model answer</h3>" + CS.markdown.render("```python\n" + p.solution + "\n```", {}) + (p.explain ? md(p.explain) : "");
    if (CS.enhance) CS.enhance(solution);
    const peek = h("button", { type: "button", class: "btn sm ghost", text: "Show the model answer" });
    peek.addEventListener("click", () => {
      if (solution.style.display === "none" && !confirm("Have a proper go first: you learn far more from getting it working yourself. Show the answer anyway?")) return;
      solution.style.display = "";
      peek.remove();
    });
    if (p.hints && p.hints.length) help.appendChild(hintBtn);
    if (!solved()[id]) help.appendChild(peek);
    help.append(hintBox, solution);
    main.appendChild(help);
  }

  function showResults(box, p, rows) {
    const nOk = rows.filter((x) => x.ok).length;
    box.appendChild(h("div", { class: "feedback " + (nOk === rows.length ? "ok" : "bad"), html: '<div class="fb-title">' + (nOk === rows.length ? "✅ All " + rows.length + " tests passed" : "❌ " + nOk + " of " + rows.length + " tests passed") + "</div>" + (nOk === rows.length ? "<p>Now compare with the model answer below: is yours as clear? Would it get the marks for the method, not just the output?</p>" : "") }));
    rows.forEach((x, i) => {
      const t = x.t;
      const d = h("details", { class: "collapse test-row " + (x.ok ? "ok" : "bad") });
      if (!x.ok && !t.hidden && !box.querySelector("details[open]")) d.open = true;
      d.appendChild(h("summary", { html: (x.ok ? "✅" : "❌") + " Test " + (i + 1) + ": " + U.esc(t.name || "") + (t.hidden ? " <span class='pill'>hidden</span>" : "") }));
      const body = h("div", { class: "collapse-body small" });
      if (t.hidden) body.innerHTML = x.ok ? "<p>Passed.</p>" : "<p>This test is hidden. Check the edge cases in the question: empty input, boundary values, invalid input, the first and last items.</p>" + (x.r.error ? "<p><b>Error:</b> " + U.esc(x.r.error) + "</p>" : "");
      else {
        body.innerHTML = (t.input ? "<p><b>Input</b> (one line per input())</p><pre class='code-output'>" + U.esc(t.input) + "</pre>" : "") + (t.code ? "<p><b>Check code run after your program</b></p><pre class='code-output'>" + U.esc(t.code) + "</pre>" : "") + "<div class='grid cols-2'><div><p><b>Expected output</b>" + (p.match === "contains" ? " (must contain)" : "") + "</p><pre class='code-output'>" + U.esc(t.expect) + "</pre></div><div><p><b>Your output</b></p><pre class='code-output'>" + U.esc(x.r.out || "") + "</pre></div></div>" + (x.r.error ? "<p><b>Error:</b> " + U.esc(x.r.error) + "</p>" : "") + (!x.ok && !x.r.error && rlines(x.r.out).join("\n").toLowerCase() === rlines(t.expect).join("\n").toLowerCase() ? "<p>Nearly: only capital letters differ.</p>" : "") + (!x.ok && !x.r.error && rlines(x.r.out).join("") === rlines(t.expect).join("") ? "<p>Nearly: the text is right but it's split across lines differently.</p>" : "");
      }
      d.appendChild(body);
      box.appendChild(d);
    });
  }

  /* ---------------- a small code editor: a textarea with line numbers, Tab and auto-indent ---------------- */
  function makeEditor(initial) {
    const wrap = h("div", { class: "code-editor" });
    const gutter = h("div", { class: "gutter", "aria-hidden": "true" });
    const ta = h("textarea", { spellcheck: "false", autocapitalize: "off", autocomplete: "off", autocorrect: "off", "aria-label": "Your Python code. Tab indents; press Escape then Tab to move on." });
    ta.value = initial;
    wrap.append(gutter, ta);
    const listeners = [];
    const update = () => {
      const n = ta.value.split("\n").length;
      if (gutter.childElementCount !== n) gutter.textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n");
      ta.style.height = "auto";
      ta.style.height = Math.max(240, ta.scrollHeight + 4) + "px";
    };
    const insert = (text, back) => {
      const s = ta.selectionStart,
        e = ta.selectionEnd;
      // execCommand keeps the browser's undo history (Ctrl+Z); setRangeText is the fallback
      if (!(document.execCommand && document.execCommand("insertText", false, text))) {
        ta.setRangeText(text, s, e, "end");
        ta.dispatchEvent(new Event("input"));
      }
      if (back) ta.selectionStart = ta.selectionEnd = ta.selectionEnd - back;
    };
    let escaped = false; // Escape then Tab leaves the editor (otherwise Tab indents)
    ta.addEventListener("keydown", (e) => {
      const leaving = escaped;
      escaped = e.key === "Escape";
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !leaving) {
        e.preventDefault();
        insert("    ");
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf("\n") + 1);
        let indent = line.match(/^\s*/)[0];
        if (/:\s*(#.*)?$/.test(line)) indent += "    ";
        insert("\n" + indent);
      }
    });
    ta.addEventListener("input", () => {
      update();
      listeners.forEach((f) => f(ta.value));
    });
    setTimeout(update);
    return {
      el: wrap,
      value: () => ta.value,
      set(v) {
        ta.value = v;
        update();
      },
      onChange: (f) => listeners.push(f),
    };
  }
})();
