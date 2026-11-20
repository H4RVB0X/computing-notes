/* =====================================================================
   app.js — boot, top bar, router and page views
   Layout: a top bar with five areas (Home, Notes, Practise, Tools, Progress), a bottom tab bar on
   phones, and a "topic hub" for every notes page: a contents tree on the left, the topic header,
   and tabs for its notes, quiz, exam questions, flashcards, trace tables and code problems.
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (tag, attrs, children) => U.el(tag, attrs, children);
  const icon = (name, cls) => CS.icon(name, cls);

  /* ---------------- boot: load content & tool files listed in manifest ---------------- */
  function loadScripts(paths, done) {
    let remaining = paths.length;
    const failed = [];
    if (!remaining) return done(failed);
    paths.forEach((p) => {
      const s = document.createElement("script");
      s.src = p;
      s.async = false;
      s.onload = () => {
        if (--remaining === 0) done(failed);
      };
      s.onerror = () => {
        failed.push(p);
        console.error("Failed to load " + p);
        if (--remaining === 0) done(failed);
      };
      document.head.appendChild(s);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    CS.prefs.apply();
    const files = (CS.manifest || []).slice();
    loadScripts(files, (failed) => {
      if (failed.length) CS.loadErrors = failed;
      init();
    });
  });

  function init() {
    CS.migrateStore();
    renderSaveBadge();
    bindHeader();
    window.addEventListener("hashchange", route);
    route();
  }

  /* ---------------- small shared helpers ---------------- */
  const pct = (x) => Math.round(x * 100);
  /** "Paper 1", "Paper 2" or "" for a section (from the blurb in sections.js) */
  function paperOf(s) {
    if (s.id === "P") return "Paper 1";
    const m = /Paper ([12])\.\s*$/.exec(s.blurb || "");
    return m ? "Paper " + m[1] : "";
  }
  /** short label for a section number: 4.1 … 4.13, NEA, P1, Ref */
  const secLabel = (s) => (s.spec ? s.spec : s.id === "P" ? "P1" : s.id === "R" ? "Ref" : s.id);
  /** "done" (read), "half" (opened or partly read) or "" (not started) */
  function topicStatus(id) {
    const t = CS.progress.topic(id);
    if ((t.read || 0) >= 0.9) return "done";
    if (t.viewed || t.read) return "half";
    return "";
  }
  const statusHtml = (id) => {
    const s = topicStatus(id);
    return '<span class="status ' + s + '" title="' + (s === "done" ? "Read" : s === "half" ? "In progress" : "Not started") + '">' + (s === "done" ? "✓" : "") + "</span>";
  };
  const quizPill = (best) => '<span class="pill ' + (best < 50 ? "bad" : best < 75 ? "warn" : "ok") + '">quiz ' + Number(best) + "%</span>";
  const flashCount = (id) => (CS.flash ? CS.flash.cardsFor(id).length : (CS.flashcards[id] || []).length);
  const problemsFor = (id) => Object.values(CS.problems || {}).filter((p) => p.topic === id);
  const codeSolved = () => CS.store.get("codeSolved", {});
  CS.paperOf = paperOf;
  CS.topicStatus = topicStatus;

  /* ---------------- top bar ---------------- */
  /** small notice in the top bar when memory-only mode is on */
  function renderSaveBadge() {
    let b = document.getElementById("save-badge");
    if (CS.store.isSaving()) {
      if (b) b.remove();
      return;
    }
    if (!b) {
      b = h("a", { id: "save-badge", class: "save-badge", href: "#/progress", title: "Progress is not being saved on this device. Click to change.", text: "Not saving" });
      const slot = document.getElementById("account-slot");
      if (slot) slot.insertBefore(b, slot.firstChild);
    }
  }

  /** refresh the read/in-progress marks in the contents tree after progress changes */
  CS.refreshSidebar = () => updateTreeStatus();
  function updateTreeStatus() {
    document.querySelectorAll(".tree a[data-topic]").forEach((a) => {
      const old = a.querySelector(".status");
      if (old) old.outerHTML = statusHtml(a.getAttribute("data-topic"));
    });
  }

  /** which top-level area each route belongs to (drives the top bar and the tab bar) */
  function navKey(page, arg) {
    if (page === "flashcards") return arg[0] && arg[0] !== "due" ? "notes" : "practise";
    const map = { home: "home", notes: "notes", section: "notes", topic: "notes", quiz: "notes", exam: "notes", trace: "notes", problems: "notes", glossary: "notes", practise: "practise", mock: "practise", mistakes: "practise", levels: "practise", code: "practise", exams: "practise", traces: "practise", tools: "tools", tool: "tools", progress: "progress", checklist: "progress", search: "search" };
    return map[page] || "";
  }
  function setActiveNav(key) {
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const on = a.getAttribute("data-nav") === key;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function bindHeader() {
    document.getElementById("theme-btn").addEventListener("click", CS.prefs.toggleTheme);
    const form = document.getElementById("search-form");
    const input = document.getElementById("search-input");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) location.hash = "#/search/" + encodeURIComponent(q);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea|select/i.test(e.target.tagName) && !e.target.isContentEditable) {
        e.preventDefault();
        if (input.offsetParent) input.focus();
        else location.hash = "#/search"; // phones: the search box lives on its own page
      }
    });
  }

  /* ---------------- router ---------------- */
  CS.views = CS.views || {};
  // routes that show inside a topic's hub, and which tab they are
  const HUB_TABS = { topic: "notes", quiz: "quiz", exam: "exam", flashcards: "flashcards", trace: "trace", problems: "code" };
  let scrollHandler = null;

  function route() {
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\/?/, "").split("/");
    const page = parts[0] || "home";
    const arg = parts.slice(1).map(decodeURIComponent);
    const main = document.getElementById("content");
    main.className = "content";
    main.removeAttribute("style");
    main.innerHTML = "";
    // the reading tracker only runs on notes pages
    if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
    const bar = document.getElementById("page-progress");
    if (bar) bar.style.width = "0";
    window.scrollTo(0, 0);
    document.title = "CS Revision";
    const view = CS.views[page] || CS.views.notfound;
    try {
      let target = main;
      if (HUB_TABS[page] && arg[0] && CS.topicMeta(arg[0])) target = topicHub(main, arg[0], HUB_TABS[page]);
      view(target, arg);
    } catch (err) {
      console.error(err);
      main.innerHTML = '<div class="card"><h2>Something went wrong rendering this page</h2><pre class="mono small">' + U.esc(err && err.stack ? err.stack : err) + "</pre></div>";
    }
    setActiveNav(navKey(page, arg));
  }
  CS.route = route;
  CS.navigate = (hash) => {
    if (location.hash === hash) route();
    else location.hash = hash;
  };

  CS.toast = function (msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = h("div", { id: "toast", class: "toast", role: "status" });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1800);
  };

  CS.views.notfound = function (main) {
    main.innerHTML = '<div class="card"><h2>Page not found</h2><p><a href="#/">Back to Home</a> or <a href="#/notes">browse the notes</a>.</p></div>';
  };

  /** page heading block used by most pages */
  function pageHead(crumbs, title, intro, extraHtml) {
    return h("div", { class: "page-head", html: (crumbs ? '<div class="crumbs">' + crumbs + "</div>" : "") + "<h1>" + title + "</h1>" + (intro ? '<p class="muted">' + intro + "</p>" : "") + (extraHtml || "") });
  }

  /* ---------------- HOME: what to do today ---------------- */
  CS.views.home = function (main) {
    document.title = "CS Revision · Home";
    const ids = CS.allTopicIds();
    if (CS.countdown && CS.countdown.line) main.appendChild(CS.countdown.line());
    if (CS.loadErrors) main.appendChild(h("div", { class: "card", style: "border-color:var(--bad);margin-bottom:16px", html: "<b>Some content files failed to load:</b> " + CS.loadErrors.map(U.esc).join(", ") + ". Check <code>content/manifest.js</code>." }));

    const grid = h("div", { class: "home-grid" });
    const left = h("div", { class: "home-main" });
    const right = h("aside", { class: "home-side", "aria-label": "Your progress" });
    grid.append(left, right);
    main.appendChild(grid);

    // continue where you left off (or start at the beginning)
    const last = CS.store.get("lastTopic", null);
    const lastMeta = last ? CS.topicMeta(last) : null;
    const id = lastMeta ? last : ids.find((x) => !CS.progress.topic(x).viewed) || ids[0];
    const m = CS.topicMeta(id);
    if (m) {
      const t = CS.progress.topic(id);
      const read = pct(t.read || 0);
      const nq = (CS.quizzes[id] || []).length;
      const pts = m.specPoints || [];
      const ticked = pts.filter((p) => CS.store.get("checklist." + p.id, false)).length;
      const paper = paperOf(m.section);
      const card = h("section", { class: "continue" });
      const metaBits = [];
      if (nq) metaBits.push(t.quizBest != null ? "Quiz best <b class='" + (t.quizBest < 50 ? "bad-t" : t.quizBest < 75 ? "warn-t" : "ok-t") + "'>" + Number(t.quizBest) + "%</b>" : "Quiz not tried yet");
      if (pts.length) metaBits.push(ticked + " of " + pts.length + " spec points ticked");
      if (t.quizAttempts) metaBits.push(t.quizAttempts + " quiz attempt" + (t.quizAttempts === 1 ? "" : "s"));
      card.innerHTML =
        '<div class="eyebrow">' + (lastMeta ? "Continue where you left off" : "Start here") + "</div>" +
        '<div class="cont-row"><div><h1><a href="#/topic/' + id + '">' + U.esc(id + " " + m.title) + '</a></h1><p class="cont-sub">' + U.esc(m.section.title) + (paper ? " · " + paper : "") + "</p></div>" +
        '<span class="ring" style="--p:' + read + '" role="img" aria-label="' + read + '% read"><b>' + read + "%</b><small>read</small></span></div>" +
        (metaBits.length ? '<div class="cont-meta">' + metaBits.map((x) => "<span>" + x + "</span>").join("") + "</div>" : '<div style="height:16px"></div>');
      const row = h("div", { class: "row" });
      row.appendChild(h("a", { class: "btn primary", href: "#/topic/" + id, text: !lastMeta ? "Start reading" : read >= 90 ? "Read it again" : "Resume reading" }));
      if (nq) row.appendChild(h("a", { class: "btn", href: "#/quiz/" + id, text: t.quizBest != null ? "Retry the quiz" : "Take the quiz" }));
      const nxt = CS.prevNext(id).next;
      if (lastMeta && read >= 90 && nxt) row.appendChild(h("a", { class: "btn", href: "#/topic/" + nxt, text: "Next: " + nxt + " " + CS.topicMeta(nxt).title }));
      card.appendChild(row);
      left.appendChild(card);
    }

    // due today
    const due = [];
    const mistakesDue = CS.mistakes ? CS.mistakes.dueCount() : 0;
    if (mistakesDue) due.push({ ico: "repeat", cls: "bad", t: "Retry your mistakes", d: mistakesDue + " question" + (mistakesDue === 1 ? " is" : "s are") + " due again", href: "#/mistakes", b: "Start" });
    const flashDue = CS.flash ? CS.flash.dueCount() : 0;
    if (flashDue) due.push({ ico: "cards", cls: "", t: "Flashcards", d: flashDue + " card" + (flashDue === 1 ? " is" : "s are") + " due for review", href: "#/flashcards/due", b: "Review" });
    CS.progress
      .weakest(2)
      .filter((w) => w.pct < 70)
      .forEach((w) => due.push({ ico: "quiz", cls: "warn", t: w.id + " " + CS.topicMeta(w.id).title + " quiz", d: "Best score " + w.pct + "%. Reread the notes, then try again", href: "#/quiz/" + w.id, b: "Quiz" }));
    const readNotQuizzed = ids.find((x) => {
      const t = CS.progress.topic(x);
      return (t.read || 0) >= 0.6 && t.quizBest == null && (CS.quizzes[x] || []).length;
    });
    if (readNotQuizzed) due.push({ ico: "quiz", cls: "", t: readNotQuizzed + " " + CS.topicMeta(readNotQuizzed).title + " quiz", d: "You've read this but haven't tried the quiz", href: "#/quiz/" + readNotQuizzed, b: "Quiz" });
    const dueBlock = h("section", { class: "block" });
    dueBlock.appendChild(h("div", { class: "block-h", html: "<h2>Due today</h2>" + (due.length ? '<span class="muted small">' + due.length + " thing" + (due.length === 1 ? "" : "s") + "</span>" : "") }));
    if (due.length) {
      const ul = h("ul", { class: "due" });
      due.forEach((d) => ul.appendChild(h("li", { html: '<span class="due-ico ' + d.cls + '">' + icon(d.ico) + '</span><div class="due-t"><b>' + U.esc(d.t) + "</b><span>" + U.esc(d.d) + '</span></div><a class="btn sm" href="' + d.href + '">' + d.b + "</a>" })));
      dueBlock.appendChild(ul);
    } else dueBlock.appendChild(h("p", { class: "empty-note", html: "Nothing is due right now. Carry on reading, or try a <a href='#/mock'>mixed mock</a>." }));
    left.appendChild(dueBlock);

    // start something new
    const fresh = [];
    const nextAfter = lastMeta ? CS.prevNext(last).next : null;
    if (nextAfter && !CS.progress.topic(nextAfter).viewed) fresh.push({ id: nextAfter, why: "Next after " + last });
    ids.forEach((x) => {
      if (fresh.length >= 3 || x === id || fresh.some((f) => f.id === x) || CS.progress.topic(x).viewed) return;
      const s = CS.sectionOf(x);
      fresh.push({ id: x, why: s ? s.short || s.title : "" });
    });
    if (fresh.length) {
      const nb = h("section", { class: "block" });
      nb.appendChild(h("div", { class: "block-h", html: '<h2>Start something new</h2><a class="small" href="#/notes">All notes</a>' }));
      const row = h("div", { class: "new-row" });
      fresh.forEach((f) => row.appendChild(h("a", { class: "new", href: "#/topic/" + f.id, html: '<span class="mono">' + U.esc(f.id) + "</span><b>" + U.esc(CS.topicMeta(f.id).title) + '</b><span class="muted small">' + U.esc(f.why) + "</span>" })));
      nb.appendChild(row);
      left.appendChild(nb);
    }

    // progress, split by paper
    const prog = h("section", { class: "side-block" });
    let html = "<h3>Progress</h3>";
    ["Paper 1", "Paper 2"].forEach((p) => {
      const tids = CS.sections.filter((s) => paperOf(s) === p).flatMap((s) => s.topics.map((t) => t.id));
      if (!tids.length) return;
      const c = pct(tids.reduce((a, x) => a + CS.progress.completion(x), 0) / tids.length);
      html += '<div class="paper"><div class="paper-h"><span>' + p + "</span><b>" + c + '%</b></div><span class="bar"><i style="width:' + c + '%"></i></span><div class="paper-s">' + tids.length + " pages</div></div>";
    });
    const readN = ids.filter((x) => (CS.progress.topic(x).read || 0) >= 0.9).length;
    const quizzed = ids.filter((x) => CS.progress.topic(x).quizBest != null).length;
    const allPts = CS.sections.flatMap((s) => s.topics.flatMap((t) => t.specPoints || []));
    const tickedAll = allPts.filter((p) => CS.store.get("checklist." + p.id, false)).length;
    const probs = Object.keys(CS.problems || {});
    const solvedN = probs.filter((p) => codeSolved()[p]).length;
    const kv = [["Pages read", readN + " of " + ids.length], ["Quizzes tried", quizzed + " of " + ids.length]];
    if (probs.length) kv.push(["Code problems solved", solvedN + " of " + probs.length]);
    if (allPts.length) kv.push(["Spec points ticked", tickedAll + " of " + allPts.length]);
    html += '<dl class="kv">' + kv.map((r) => "<div><dt>" + r[0] + "</dt><dd>" + r[1] + "</dd></div>").join("") + '</dl><a class="small" href="#/progress">Full breakdown</a>';
    prog.innerHTML = html;
    right.appendChild(prog);
    const weak = CS.progress.weakest(4);
    if (weak.length) {
      const wb = h("section", { class: "side-block" });
      wb.innerHTML = "<h3>Weakest topics</h3>";
      const ol = h("ol", { class: "weak" });
      weak.forEach((w) => {
        const wm = CS.topicMeta(w.id);
        if (wm) ol.appendChild(h("li", { html: '<a href="#/quiz/' + w.id + '">' + U.esc(w.id + " " + wm.title) + "</a>" + quizPill(w.pct).replace("quiz ", "") }));
      });
      wb.appendChild(ol);
      right.appendChild(wb);
    }

    const nQ = Object.values(CS.quizzes).reduce((a, b) => a + b.length, 0);
    const nE = Object.values(CS.exams).reduce((a, b) => a + b.length, 0);
    main.appendChild(h("p", { class: "site-foot", html: nQ.toLocaleString("en-GB") + " quiz questions · " + nE + " exam-style questions · " + Object.keys(CS.tools).length + " interactive tools · " + ids.length + " pages of notes. Press <kbd>/</kbd> to search." }));
  };

  /* ---------------- NOTES: the whole specification as a syllabus ---------------- */
  CS.views.notes = function (main) {
    document.title = "CS Revision · Notes";
    const ids = CS.allTopicIds();
    main.appendChild(pageHead("", "Notes", "The whole AQA 7517 specification in spec order: " + ids.length + " pages across " + CS.sections.length + " sections.", '<div class="head-links"><a href="#/glossary">Glossary</a><a href="#/checklist">Spec checklist</a></div>'));
    const filters = h("div", { class: "filters", role: "group", "aria-label": "Filter pages" });
    const chips = [["all", "All"], ["Paper 1", "Paper 1"], ["Paper 2", "Paper 2"], ["half", "In progress"], ["none", "Not started"]];
    let mode = "all";
    chips.forEach(([v, t]) => {
      const b = h("button", { type: "button", class: "chip" + (v === "all" ? " active" : ""), text: t, "aria-pressed": String(v === "all") });
      b.addEventListener("click", () => {
        mode = v;
        filters.querySelectorAll(".chip").forEach((c) => {
          c.classList.toggle("active", c === b);
          c.setAttribute("aria-pressed", String(c === b));
        });
        draw();
      });
      filters.appendChild(b);
    });
    const q = h("input", { type: "search", placeholder: "Filter pages", "aria-label": "Filter pages by name" });
    filters.appendChild(q);
    main.querySelector(".page-head").appendChild(filters);
    const list = h("div");
    main.appendChild(list);
    const closed = {};

    function draw() {
      list.innerHTML = "";
      const text = U.normalise(q.value);
      const filtering = mode !== "all" || text;
      let shown = 0;
      CS.sections.forEach((s) => {
        const paper = paperOf(s);
        if ((mode === "Paper 1" || mode === "Paper 2") && paper !== mode) return;
        const topics = s.topics.filter((t) => {
          const st = topicStatus(t.id);
          if (mode === "half" && st !== "half") return false;
          if (mode === "none" && st !== "") return false;
          if (text && !U.normalise(t.id + " " + t.title).includes(text)) return false;
          return true;
        });
        if (!topics.length) return;
        shown++;
        const read = s.topics.filter((t) => topicStatus(t.id) === "done").length;
        const comp = pct(s.topics.reduce((a, t) => a + CS.progress.completion(t.id), 0) / s.topics.length);
        const open = filtering || !closed[s.id];
        const sec = h("section", { class: "syl" + (open ? " open" : "") });
        const head = h("button", { type: "button", class: "syl-h", "aria-expanded": String(open), html: '<span class="syl-num">' + U.esc(secLabel(s)) + '</span><span class="syl-title">' + U.esc(s.title) + "</span>" + '<span class="tag">' + (paper || (s.id === "14" ? "NEA" : "Reference")) + '</span><span class="syl-p">' + read + " of " + s.topics.length + ' read</span><span class="bar sm"><i style="width:' + comp + '%"></i></span><span class="chev"></span>' });
        head.addEventListener("click", () => {
          const now = !sec.classList.contains("open");
          sec.classList.toggle("open", now);
          head.setAttribute("aria-expanded", String(now));
          closed[s.id] = !now;
        });
        const body = h("div", { class: "syl-body" });
        if (s.blurb && !filtering) body.appendChild(h("p", { class: "syl-blurb", text: s.blurb }));
        const ul = h("ul", { class: "syl-list" });
        topics.forEach((t) => {
          const best = CS.progress.topic(t.id).quizBest;
          ul.appendChild(h("li", { html: '<a href="#/topic/' + t.id + '">' + statusHtml(t.id) + '<span class="mono">' + t.id + '</span><span class="syl-t">' + U.esc(t.title) + "</span>" + (best != null ? quizPill(best) : "") + "</a>" }));
        });
        body.appendChild(ul);
        body.appendChild(h("div", { class: "syl-foot", html: '<a href="#/section/' + s.id + '">Section overview</a>' }));
        sec.append(head, body);
        list.appendChild(sec);
      });
      if (!shown) list.appendChild(h("p", { class: "empty-note", text: "No pages match." }));
    }
    q.addEventListener("input", U.debounce(draw, 120));
    draw();
  };

  /* ---------------- SECTION overview ---------------- */
  CS.views.section = function (main, arg) {
    const s = CS.sectionById(arg[0]);
    if (!s) return CS.views.notfound(main);
    document.title = "CS Revision · " + s.title;
    const paper = paperOf(s);
    main.appendChild(pageHead('<a href="#/notes">Notes</a> › ' + U.esc(secLabel(s)), U.esc(s.title), U.esc(s.blurb || ""), paper ? '<div class="head-links"><span class="tag">' + paper + "</span></div>" : ""));
    const ul = h("ul", { class: "topic-rows" });
    s.topics.forEach((t) => {
      const p = CS.progress.topic(t.id);
      const li = h("li");
      let btns = '<a class="btn sm" href="#/topic/' + t.id + '">Read</a>';
      if ((CS.quizzes[t.id] || []).length) btns += '<a class="btn sm" href="#/quiz/' + t.id + '">Quiz</a>';
      if ((CS.exams[t.id] || []).length) btns += '<a class="btn sm" href="#/exam/' + t.id + '">Exam Qs</a>';
      if (flashCount(t.id)) btns += '<a class="btn sm" href="#/flashcards/' + t.id + '">Cards</a>';
      li.innerHTML = statusHtml(t.id) + '<span class="tr-t"><span class="mono">' + t.id + '</span><a href="#/topic/' + t.id + '">' + U.esc(t.title) + "</a></span>" + (p.quizBest != null ? quizPill(p.quizBest) : "") + '<span class="row">' + btns + "</span>";
      ul.appendChild(li);
    });
    main.appendChild(ul);
  };

  /* ---------------- TOPIC HUB: tree + header + tabs ---------------- */
  function buildTree(activeId) {
    const tree = h("nav", { class: "tree", "aria-label": "Contents" });
    tree.appendChild(h("div", { class: "tree-h", text: "Contents" }));
    const activeSec = CS.sectionOf(activeId);
    CS.sections.forEach((s) => {
      const open = activeSec && activeSec.id === s.id;
      const g = h("div", { class: "tree-group" + (open ? " open" : "") });
      const btn = h("button", { type: "button", class: "tree-sec", "aria-expanded": String(!!open), html: '<span class="mono">' + U.esc(secLabel(s)) + "</span><span>" + U.esc(s.short || s.title) + '</span><span class="chev"></span>' });
      btn.addEventListener("click", () => {
        g.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(g.classList.contains("open")));
      });
      const ul = h("ul");
      s.topics.forEach((t) => ul.appendChild(h("li", { html: '<a href="#/topic/' + t.id + '" data-topic="' + t.id + '"' + (t.id === activeId ? ' class="active" aria-current="page"' : "") + ">" + statusHtml(t.id) + "<span>" + U.esc(t.id + " " + t.title) + "</span></a>" })));
      g.append(btn, ul);
      tree.appendChild(g);
    });
    return tree;
  }

  /** builds the hub around a topic page and returns the panel the tab's own view renders into */
  function topicHub(main, id, tab) {
    const meta = CS.topicMeta(id);
    const sec = meta.section;
    if (tab === "notes") CS.progress.markViewed(id);
    main.classList.add("hub-page");
    const tree = buildTree(id);
    const hub = h("div", { class: "hub" });
    const t = CS.progress.topic(id);
    const paper = paperOf(sec);
    const bits = [];
    if (meta.spec && meta.spec.length) bits.push("Spec " + meta.spec.map((s) => '<span class="spec-badge">' + U.esc(s) + "</span>").join(" "));
    if (paper) bits.push(paper);
    if (t.read) bits.push(pct(t.read) + "% read");
    if (t.quizBest != null) bits.push("Quiz best <b class='" + (t.quizBest < 50 ? "bad-t" : t.quizBest < 75 ? "warn-t" : "ok-t") + "'>" + Number(t.quizBest) + "%</b>");
    hub.appendChild(h("div", { class: "hub-head", html: '<div class="crumbs"><a href="#/notes">Notes</a><span>›</span><a href="#/section/' + sec.id + '">' + U.esc(secLabel(sec) + " " + (sec.short || sec.title)) + "</a></div><h1>" + U.esc(id + " " + meta.title) + "</h1>" + (bits.length ? '<div class="hub-meta">' + bits.map((b) => "<span>" + b + "</span>").join("") + "</div>" : "") }));

    const tabs = [
      ["notes", "Notes", "#/topic/" + id, -1],
      ["quiz", "Quiz", "#/quiz/" + id, (CS.quizzes[id] || []).length],
      ["exam", "Exam questions", "#/exam/" + id, (CS.exams[id] || []).length],
      ["flashcards", "Flashcards", "#/flashcards/" + id, CS.topics[id] || (CS.flashcards[id] || []).length ? flashCount(id) : 0],
      ["trace", "Trace", "#/trace/" + id, (CS.tracesByTopic[id] || []).length],
      ["code", "Code", "#/problems/" + id, problemsFor(id).length],
    ];
    const row = h("div", { class: "tabs-row" });
    const nav = h("nav", { class: "hub-tabs", "aria-label": "This topic" });
    tabs.forEach(([k, label, href, n]) => {
      if (n === 0 && k !== tab) return;
      nav.appendChild(h("a", { href: href, class: k === tab ? "active" : "", "aria-current": k === tab ? "page" : null, html: U.esc(label) + (n > 0 ? "<i>" + n + "</i>" : "") }));
    });
    row.appendChild(nav);
    if (tab === "notes" && CS.topics[id]) {
      const mode = CS.store.get("prefs.viewMode", "full");
      const toggle = h("div", { class: "view-toggle", role: "group", "aria-label": "View mode" });
      [["quick", "Quick"], ["full", "Full"]].forEach(([v, label]) => {
        const b = h("button", { type: "button", class: mode === v ? "active" : "", text: label, "aria-pressed": String(mode === v), title: v === "quick" ? "Objectives, summary, key terms and recap only" : "Everything: explanations, worked examples and diagrams" });
        b.addEventListener("click", () => {
          CS.store.set("prefs.viewMode", v);
          route();
        });
        toggle.appendChild(b);
      });
      row.appendChild(toggle);
    }
    hub.appendChild(row);
    const panel = h("div", { class: "hub-panel" });
    hub.appendChild(panel);
    main.append(tree, hub);
    const a = tree.querySelector("a.active");
    if (a && a.scrollIntoView) setTimeout(() => a.scrollIntoView({ block: "nearest" }), 0);
    return panel;
  }
  CS.topicHub = topicHub;

  /* ---------------- TOPIC notes (the Notes tab) ---------------- */
  CS.views.topic = function (main, arg) {
    const id = arg[0];
    const meta = CS.topicMeta(id);
    const topic = CS.topics[id];
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · " + id + " " + meta.title;
    if (!topic) {
      main.appendChild(h("div", { class: "card", html: "<h3>Content not written yet</h3><p>This page has no content file. Add <code>content/topics/" + U.esc(id) + ".md.js</code> and list it in <code>content/manifest.js</code>.</p>" }));
      return;
    }
    const mode = CS.store.get("prefs.viewMode", "full");
    const layout = h("div", { class: "topic-layout" });
    const body = h("article", { class: "topic-body " + (mode === "quick" ? "quick" : "") });
    const ctx = { toc: [], keyterms: [] };
    body.innerHTML = CS.markdown.render(topic.md, ctx);
    topic.keyterms = ctx.keyterms;
    if (mode === "quick") body.insertAdjacentHTML("afterbegin", '<div class="quick-notice" data-quick="1"><b>Quick view</b> shows the objectives, summary, key terms and recap only. Switch to <b>Full</b> for explanations, worked examples and diagrams.</div>');

    // footer actions inside article so they stay with content
    body.appendChild(renderTopicActions(id));
    body.appendChild(renderChecklist(id, meta));
    body.appendChild(renderPrevNext(id));
    layout.appendChild(body);

    // TOC
    const toc = h("nav", { class: "toc", "aria-label": "On this page" });
    toc.appendChild(h("div", { class: "toc-title", text: "On this page" }));
    ctx.toc.forEach((t) => toc.appendChild(h("a", { href: "#" + t.id, class: t.level === 3 ? "l3" : "", text: t.text, "data-target": t.id })));
    toc.appendChild(h("a", { href: "#topic-practice", text: "Practise this topic", "data-target": "topic-practice" }));
    if ((CS.quizzes[id] || []).length) toc.appendChild(h("div", { class: "toc-next", html: '<span class="muted small">When you\'ve read it</span><a class="btn sm primary" href="#/quiz/' + id + '">Take the quiz →</a>' }));
    layout.appendChild(toc);
    main.appendChild(layout);

    enhance(body);
    mountEmbeds(body);
    bindTocScroll(toc, body, id);
    // in-page anchor links: hash routing conflicts, so handle manually
    main.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/^#[^/]/.test(href)) {
        e.preventDefault();
        const el = document.getElementById(href.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    // deep link #/topic/1.1/heading
    if (arg[1]) {
      const el = document.getElementById(arg[1]);
      if (el) setTimeout(() => el.scrollIntoView({ block: "start" }), 50);
    }
  };

  function renderTopicActions(id) {
    const wrap = h("div", { id: "topic-practice", "data-quick": "1" });
    wrap.appendChild(h("h2", { text: "Practise this topic", style: "margin-top:2em" }));
    const list = h("ul", { class: "topic-actions" });
    const nq = (CS.quizzes[id] || []).length;
    const ne = (CS.exams[id] || []).length;
    const nf = flashCount(id);
    const nt = (CS.tracesByTopic[id] || []).length;
    const row = (href, ico, t, d) => list.appendChild(h("li", { html: '<a class="action-row" href="' + href + '"><span class="due-ico">' + icon(ico) + '</span><span class="t">' + t + '<br><span class="d">' + d + '</span></span><span class="chev"></span></a>' }));
    if (nq) row("#/quiz/" + id, "quiz", "Quiz", nq + " questions with instant feedback");
    if (ne) row("#/exam/" + id, "pen", "Exam-style questions", ne + " questions with mark schemes");
    if (nf) row("#/flashcards/" + id, "cards", "Flashcards", nf + " cards, spaced repetition");
    if (nt) row("#/trace/" + id, "trace", "Trace challenges", nt + " code-tracing tasks");
    const np = problemsFor(id).length;
    if (np) row("#/problems/" + id, "code", "Code practice", np + " Python problem" + (np === 1 ? "" : "s") + " with automatic tests");
    const lv = (CS.exams[id] || []).filter((q) => q.levels && q.exemplars);
    if (lv.length) row("#/levels/" + lv[0].id, "target", "Extended answers", "mark example answers to " + lv.length + " levelled question" + (lv.length === 1 ? "" : "s"));
    row("#/mock", "dice", "Mixed mock", "random questions across topics");
    wrap.appendChild(list);
    const resetRow = h("div", { class: "row small", style: "justify-content:flex-end;margin-top:8px" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "Reset my progress on this page", title: "Forget reading progress, quiz and exam scores, checklist ticks, trace results and flashcard boxes for this page only" });
    resetBtn.addEventListener("click", () => {
      if (!confirm("Reset your progress on " + id + " only? This forgets reading progress, quiz and exam scores, saved exam answers, checklist ticks, trace results, flashcard boxes and My mistakes entries for this page.")) return;
      CS.progress.resetTopic(id);
      updateTreeStatus();
      CS.toast("Progress on " + id + " reset");
      route();
    });
    if (CS.report) resetRow.appendChild(CS.report.link({ where: "Notes page " + id }, "Report a mistake on this page"));
    resetRow.appendChild(resetBtn);
    wrap.appendChild(resetRow);
    return wrap;
  }

  function renderChecklist(id, meta) {
    const points = meta.specPoints || [];
    const wrap = h("section", { class: "card", style: "margin:1.5em 0", "data-quick": "1" });
    wrap.appendChild(h("h3", { style: "margin:0 0 6px", text: "Revision checklist: tick what you can do" }));
    if (!points.length) {
      wrap.appendChild(h("p", { class: "muted small", text: "No specification points are mapped to this page yet." }));
      return wrap;
    }
    const ul = h("ul", { class: "checklist" });
    points.forEach((p) => {
      const key = "checklist." + p.id;
      const done = CS.store.get(key, false);
      const cb = h("input", { type: "checkbox", id: "cl-" + p.id });
      cb.checked = done;
      const li = h("li", { class: done ? "done" : "" }, [cb, h("label", { for: "cl-" + p.id, html: '<span class="sp">' + U.esc(p.id) + "</span> " + U.esc(p.text) })]);
      cb.addEventListener("change", () => {
        CS.store.set(key, cb.checked);
        li.classList.toggle("done", cb.checked);
        updateTreeStatus();
      });
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  }

  function renderPrevNext(id) {
    const pn = CS.prevNext(id);
    const wrap = h("div", { class: "prev-next", "data-quick": "1" });
    if (pn.prev) {
      const m = CS.topicMeta(pn.prev);
      wrap.appendChild(h("a", { href: "#/topic/" + pn.prev, class: "prev", html: '<div class="lbl">← Previous</div><div>' + pn.prev + " " + U.esc(m.title) + "</div>" }));
    } else wrap.appendChild(h("span"));
    if (pn.next) {
      const m = CS.topicMeta(pn.next);
      wrap.appendChild(h("a", { href: "#/topic/" + pn.next, class: "next", html: '<div class="lbl">Next →</div><div>' + pn.next + " " + U.esc(m.title) + "</div>" }));
    }
    return wrap;
  }

  /** Progressive enhancements on rendered markdown */
  function enhance(root) {
    // tabs
    root.querySelectorAll(".tabs").forEach((tabs) => {
      tabs.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const k = btn.getAttribute("data-tab");
          tabs.querySelectorAll(".tab-btn").forEach((b) => {
            b.classList.toggle("active", b === btn);
            b.setAttribute("aria-selected", b === btn);
          });
          tabs.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.getAttribute("data-tab") === k));
        });
      });
    });
    // copy buttons + line numbers
    root.querySelectorAll("figure.code").forEach((fig) => {
      const code = fig.querySelector("code");
      const btn = fig.querySelector(".copy-btn");
      if (btn)
        btn.addEventListener("click", () => {
          const text = code.textContent.replace(/^\s*\d+\s{2}/gm, "");
          const raw = fig._raw || text;
          (navigator.clipboard ? navigator.clipboard.writeText(raw) : Promise.reject()).then(() => CS.toast("Copied")).catch(() => CS.toast("Copy not available"));
        });
      if (fig.classList.contains("numbered")) {
        fig._raw = code.textContent;
        const lines = code.innerHTML.split("\n");
        code.innerHTML = lines.map((l, i) => '<span class="ln">' + (i + 1) + "</span>" + l).join("\n");
      } else fig._raw = code.textContent;
    });
  }
  CS.enhance = enhance;

  /** Mount tools / trace challenges embedded in content */
  function mountEmbeds(root) {
    root.querySelectorAll(".tool-embed").forEach((el) => {
      const id = el.getAttribute("data-tool");
      let params = {};
      try {
        params = JSON.parse(el.getAttribute("data-params") || "{}");
      } catch (e) {}
      CS.mountTool(el, id, params, true);
    });
    root.querySelectorAll(".trace-embed").forEach((el) => {
      const id = el.getAttribute("data-trace");
      if (CS.trace && CS.traces[id]) CS.trace.mount(el, CS.traces[id]);
      else el.innerHTML = '<div class="tool-missing">Trace challenge “' + U.esc(id) + "” is not registered.</div>";
    });
  }
  CS.mountEmbeds = mountEmbeds;

  CS.mountTool = function (el, id, params, embedded) {
    const tool = CS.tools[id];
    el.innerHTML = "";
    if (!tool) {
      el.innerHTML = '<div class="tool-missing">Interactive tool “' + U.esc(id) + "” is not available (file missing from manifest?).</div>";
      return;
    }
    const frame = h("div", { class: "tool-frame" });
    const head = h("div", { class: "tool-frame-head" }, [h("span", { text: tool.title }), embedded ? h("a", { class: "btn sm ghost", href: "#/tool/" + id, text: "Open full page ↗" }) : null].filter(Boolean));
    const body = h("div", { class: "tool-frame-body tool" });
    frame.append(head, body);
    el.appendChild(frame);
    try {
      tool.mount(body, params || {});
    } catch (err) {
      console.error("Tool " + id + " failed:", err);
      body.innerHTML = '<div class="err">This tool hit an error: ' + U.esc(err.message || err) + "</div>";
    }
  };

  function bindTocScroll(toc, body, id) {
    const bar = document.getElementById("page-progress");
    const links = Array.from(toc.querySelectorAll("a[data-target]"));
    const targets = links.map((a) => document.getElementById(a.getAttribute("data-target"))).filter(Boolean);
    let maxRead = 0;
    scrollHandler = U.debounce(() => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const frac = docH > 0 ? window.scrollY / docH : 1;
      if (bar) bar.style.width = Math.round(Math.min(1, frac) * 100) + "%";
      if (frac > maxRead) {
        maxRead = frac;
        CS.progress.markRead(id, frac >= 0.85 ? 1 : frac);
        if (frac >= 0.85) updateTreeStatus();
      }
      let active = null;
      const y = window.scrollY + 120;
      targets.forEach((t) => {
        if (t.offsetTop <= y) active = t.id;
      });
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("data-target") === active));
    }, 60);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    // short pages count as read
    setTimeout(() => {
      if (document.documentElement.scrollHeight <= window.innerHeight + 40) {
        CS.progress.markRead(id, 1);
        updateTreeStatus();
      }
    }, 300);
  }

  /* ---------------- CODE tab: one topic's coding problems ---------------- */
  CS.views.problems = function (main, arg) {
    const id = arg[0];
    const meta = CS.topicMeta(id);
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · Code practice " + id;
    const list = problemsFor(id).sort((a, b) => a.difficulty - b.difficulty || a.title.localeCompare(b.title));
    if (!list.length) {
      main.appendChild(h("p", { class: "empty-note", html: "No coding problems for this topic. See <a href='#/code'>all code practice</a>." }));
      return;
    }
    const s = codeSolved();
    const DIFF = { 1: "warm-up", 2: "standard", 3: "stretch" };
    const ul = h("ul", { class: "problem-list" });
    list.forEach((p) => ul.appendChild(h("li", { html: '<span class="status ' + (s[p.id] ? "done" : "") + '" title="' + (s[p.id] ? "Solved" : "Not solved yet") + '">' + (s[p.id] ? "✓" : "") + '</span><a href="#/code/' + p.id + '">' + U.esc(p.title) + '</a><span class="diff diff-' + p.difficulty + '">' + (DIFF[p.difficulty] || "") + "</span>" })));
    main.appendChild(ul);
    main.appendChild(h("p", { class: "small muted", style: "margin-top:12px", html: "Python runs in your browser and is checked against visible and hidden tests. <a href='#/code'>All code practice</a>" }));
  };

  /* ---------------- PRACTISE: everything that tests you ---------------- */
  CS.views.practise = function (main) {
    document.title = "CS Revision · Practise";
    main.appendChild(pageHead("", "Practise", "Everything that tests you, in one place. Start with whatever is due."));
    const mDue = CS.mistakes ? CS.mistakes.dueCount() : 0;
    const fDue = CS.flash ? CS.flash.dueCount() : 0;
    const dueNow = h("section", { class: "due-now" });
    dueNow.innerHTML =
      '<div class="dn"><div class="dn-n' + (mDue ? "" : " zero") + '">' + mDue + '</div><div class="dn-t"><b>Mistakes due</b><span>Questions you got wrong come back after 1, 3 and 7 days</span></div><a class="btn' + (mDue ? " primary" : "") + '" href="#/mistakes">' + (mDue ? "Retry" : "Open") + "</a></div>" +
      '<div class="dn"><div class="dn-n' + (fDue ? "" : " zero") + '">' + fDue + '</div><div class="dn-t"><b>Flashcards due</b><span>Spaced repetition across every topic</span></div><a class="btn' + (fDue ? " primary" : "") + '" href="#/flashcards/due">Review</a></div>';
    main.appendChild(dueNow);

    const nQ = Object.values(CS.quizzes).reduce((a, b) => a + b.length, 0);
    const nE = Object.values(CS.exams).reduce((a, b) => a + b.length, 0);
    const probs = Object.keys(CS.problems || {});
    const solvedN = probs.filter((p) => codeSolved()[p]).length;
    const lvQs = CS.levelsTrainer ? CS.levelsTrainer.questions() : [];
    const lvSaved = CS.store.get("levelsTrainer", {});
    const lvDone = lvQs.filter((q) => lvSaved[q.id] && lvSaved[q.id].t).length;
    const traceIds = Object.keys(CS.traces || {});
    const traceDone = traceIds.filter((t) => {
      const r = CS.store.get("trace." + t, null);
      return r && r.total && r.ok === r.total;
    }).length;
    const inDeck = CS.mistakes ? CS.mistakes.list().length : 0;
    const modes = [
      ["dice", "Mixed mock", "Random quiz questions across the topics you pick, with an optional timer and a breakdown at the end.", "#/mock", nQ.toLocaleString("en-GB") + " questions"],
      ["repeat", "My mistakes", "Every question you get wrong, brought back until you get it right each time.", "#/mistakes", inDeck + " in your deck"],
      ["cards", "Flashcards", "Key terms and facts for every topic, in Leitner boxes.", "#/flashcards", fDue + " due"],
      ["code", "Code practice", "Python in the browser, checked against visible and hidden tests: Section B style, the programming booklet and the skeleton program's Section D.", "#/code", solvedN + " of " + probs.length + " solved"],
      ["pen", "Exam-style questions", "Questions with mark schemes for every topic. Write your answer, then mark it honestly.", "#/exams", nE + " questions"],
      ["target", "Extended-answer trainer", "Mark three example answers to a 6, 9 or 12-mark question, then compare with the examiner.", "#/levels", lvDone + " of " + lvQs.length + " done"],
      ["trace", "Trace tables", "Hand-trace code and fill the table exactly as you would in the exam.", "#/traces", traceDone + " of " + traceIds.length + " done"],
    ];
    main.appendChild(h("h2", { class: "sub-h", text: "Ways to practise" }));
    const ul = h("ul", { class: "modes" });
    modes.forEach(([ico, t, d, href, stat]) => ul.appendChild(h("li", { html: '<a class="mode" href="' + href + '"><span class="mode-ico">' + icon(ico) + '</span><span class="mode-t"><b>' + t + "</b><span>" + d + '</span></span><span class="mode-s">' + stat + '</span><span class="chev"></span></a>' })));
    main.appendChild(ul);
    main.appendChild(h("p", { class: "small muted", style: "margin-top:14px", html: "Each topic's own quiz is on its page: open it from <a href='#/notes'>Notes</a>." }));
  };

  /** list of topics that have something (exam questions, traces) — used by the two index pages */
  function topicIndex(main, count, href, extra) {
    CS.sections.forEach((s) => {
      const rows = s.topics.filter((t) => count(t.id) > 0);
      if (!rows.length) return;
      main.appendChild(h("h2", { class: "sub-h", style: "margin-top:22px", text: secLabel(s) + " " + s.title }));
      const ul = h("ul", { class: "topic-rows" });
      rows.forEach((t) => ul.appendChild(h("li", { html: '<span class="tr-t"><span class="mono">' + t.id + '</span><a href="' + href(t.id) + '">' + U.esc(t.title) + "</a></span>" + extra(t.id) })));
      main.appendChild(ul);
    });
  }

  CS.views.exams = function (main) {
    document.title = "CS Revision · Exam-style questions";
    main.appendChild(pageHead('<a href="#/practise">Practise</a> › Exam-style questions', "Exam-style questions", "Write your answer as you would in the exam, then reveal the mark scheme and tick each point you hit. Pick a topic."));
    topicIndex(
      main,
      (id) => (CS.exams[id] || []).length,
      (id) => "#/exam/" + id,
      (id) => {
        const qs = CS.exams[id];
        const marks = qs.reduce((a, q) => a + (q.marks || 0), 0);
        return '<span class="muted small">' + qs.length + " question" + (qs.length === 1 ? "" : "s") + " · " + marks + " marks</span>" + (CS.progress.topic(id).examDone ? '<span class="pill ok">attempted</span>' : "");
      }
    );
  };

  CS.views.traces = function (main) {
    document.title = "CS Revision · Trace tables";
    main.appendChild(pageHead('<a href="#/practise">Practise</a> › Trace tables', "Trace tables", "Hand-trace the code and fill the table exactly as you would in the exam. Every cell is checked."));
    topicIndex(
      main,
      (id) => (CS.tracesByTopic[id] || []).length,
      (id) => "#/trace/" + id,
      (id) => {
        const list = CS.tracesByTopic[id];
        const done = list.filter((t) => {
          const r = CS.store.get("trace." + t, null);
          return r && r.total && r.ok === r.total;
        }).length;
        return '<span class="muted small">' + list.length + " challenge" + (list.length === 1 ? "" : "s") + "</span>" + (done ? '<span class="pill ' + (done === list.length ? "ok" : "warn") + '">' + done + " of " + list.length + " done</span>" : "");
      }
    );
  };

  /* ---------------- TOOLS ---------------- */
  CS.views.tools = function (main) {
    document.title = "CS Revision · Interactive tools";
    main.appendChild(pageHead("", "Interactive tools", "Visualisers, simulators and calculators. Each one also appears inside the notes page it belongs to."));
    const bySection = {};
    Object.values(CS.tools).forEach((t) => (bySection[t.section || "misc"] = bySection[t.section || "misc"] || []).push(t));
    const order = CS.sections.map((s) => s.id).concat(["misc"]);
    order.forEach((sid) => {
      const list = bySection[sid];
      if (!list) return;
      const sec = CS.sectionById(sid);
      main.appendChild(h("h2", { class: "sub-h", text: sec ? secLabel(sec) + " " + sec.title : "Other tools", style: "margin:1.6em 0 0.6em" }));
      const grid = h("div", { class: "grid cols-3" });
      list.sort((a, b) => a.title.localeCompare(b.title)).forEach((t) => grid.appendChild(h("a", { class: "action-card", href: "#/tool/" + t.id, html: (t.topic ? '<div class="k">' + U.esc(t.topic) + "</div>" : "") + '<div class="t">' + U.esc(t.title) + '</div><div class="d">' + U.esc(t.desc || "") + "</div>" })));
      main.appendChild(grid);
    });
    if (!Object.keys(CS.tools).length) main.appendChild(h("p", { class: "muted", text: "No tools registered yet." }));
  };

  CS.views.tool = function (main, arg) {
    const id = arg[0];
    const tool = CS.tools[id];
    main.classList.add("tool-page");
    document.title = "CS Revision · " + (tool ? tool.title : "Tool");
    main.appendChild(pageHead('<a href="#/tools">Tools</a> › ' + (tool ? U.esc(tool.title) : "Unknown"), tool ? U.esc(tool.title) : "Unknown tool", tool && tool.desc ? U.esc(tool.desc) : "", tool && tool.topic && CS.topicMeta(tool.topic) ? '<div class="head-links"><a href="#/topic/' + U.esc(tool.topic) + '">Notes: ' + U.esc(tool.topic + " " + CS.topicMeta(tool.topic).title) + "</a></div>" : ""));
    const holder = h("div");
    main.appendChild(holder);
    CS.mountTool(holder, id, {}, false);
    if (tool && tool.help) {
      const help = h("div", { class: "card", style: "margin-top:16px" });
      help.innerHTML = "<h3 style='margin-top:0'>How to use this</h3>" + CS.markdown.render(tool.help, {});
      main.appendChild(help);
    }
  };

  /* ---------------- CHECKLIST ---------------- */
  CS.views.checklist = function (main) {
    document.title = "CS Revision · Specification checklist";
    main.appendChild(pageHead('<a href="#/progress">Progress</a> › Spec checklist', "Specification checklist", "Every AQA 7517 content point, mapped to the page that covers it. Tick what you can confidently do."));
    let totalPts = 0;
    const allUl = [];
    const summaryText = () => {
      let d = 0;
      allUl.forEach((ul) => ul.querySelectorAll("input:checked").forEach(() => d++));
      return d + " of " + totalPts + " specification points ticked (" + Math.round((d / Math.max(1, totalPts)) * 100) + "%)";
    };
    const summary = h("div", { class: "pill accent", style: "font-size:0.9rem;padding:6px 14px;margin-bottom:16px" });
    main.appendChild(summary);
    CS.sections.forEach((s) => {
      const sec = h("section", { class: "card", style: "margin-bottom:14px" });
      sec.appendChild(h("h2", { style: "margin:0 0 8px;font-size:1.2rem", text: (s.spec ? s.spec + " " : "") + s.title }));
      s.topics.forEach((t) => {
        const pts = t.specPoints || [];
        if (!pts.length) return;
        sec.appendChild(h("h3", { style: "margin:12px 0 4px;font-size:1rem" }, h("a", { href: "#/topic/" + t.id, text: t.id + " " + t.title })));
        const ul = h("ul", { class: "checklist" });
        pts.forEach((p) => {
          totalPts++;
          const key = "checklist." + p.id;
          const isDone = CS.store.get(key, false);
          const cb = h("input", { type: "checkbox", id: "ck-" + p.id });
          cb.checked = isDone;
          const li = h("li", { class: isDone ? "done" : "" }, [cb, h("label", { for: "ck-" + p.id, html: '<span class="sp">' + U.esc(p.id) + "</span> " + U.esc(p.text) })]);
          cb.addEventListener("change", () => {
            CS.store.set(key, cb.checked);
            li.classList.toggle("done", cb.checked);
            summary.textContent = summaryText();
          });
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        allUl.push(ul);
      });
      main.appendChild(sec);
    });
    summary.textContent = summaryText();
  };

  /* ---------------- PROGRESS / SETTINGS ---------------- */
  /** "Install as an app" instructions: a real button where the browser offers one, steps for iPhone/iPad */
  function installCard() {
    const card = h("div", { class: "card", style: "margin-bottom:16px" });
    const standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let body;
    if (standalone) body = "<p class='small' style='margin:0'>You're using the installed app. It works offline: everything is saved on this device.</p>";
    else if (!/^https?:$/.test(location.protocol)) body = "<p class='small muted' style='margin:0'>Installing only works on the live website (not when the page is opened as a file).</p>";
    else if (ios) body = "<ol class='small' style='margin:0;padding-left:1.2em'><li>Open this site in <b>Safari</b>.</li><li>Tap the <b>Share</b> button (the square with an arrow).</li><li>Choose <b>Add to Home Screen</b>, then <b>Add</b>.</li></ol><p class='small muted' style='margin:8px 0 0'>It opens full screen from its own icon and works offline. Open it at least once a week: iOS can clear saved progress from web apps that haven't been used for a while.</p>";
    else body = "<p class='small' style='margin:0 0 8px'>Add the site to your home screen or desktop. It opens in its own window and works offline.</p>";
    card.innerHTML = "<h3 style='margin-top:0'>Install as an app</h3>" + body;
    if (!standalone && !ios && /^https?:$/.test(location.protocol)) {
      const btn = h("button", { type: "button", class: "btn primary", text: "Install app" });
      btn.addEventListener("click", async () => {
        if (!CS.installPrompt) return alert("Use your browser's menu: ⋮ → Install app (Chrome/Edge) or Add to Home screen (Android).");
        CS.installPrompt.prompt();
        await CS.installPrompt.userChoice;
        CS.installPrompt = null;
      });
      card.appendChild(btn);
    }
    return card;
  }

  CS.views.progress = function (main) {
    document.title = "CS Revision · Progress";
    main.appendChild(pageHead("", "Progress &amp; settings", "", '<div class="head-links"><a href="#/checklist">Spec checklist</a><a href="#/glossary">Glossary</a></div>'));
    (CS.settingsCards || []).forEach((make) => main.appendChild(make())); // e.g. accounts (sync.js), countdowns
    main.appendChild(installCard());
    const table = h("div", { class: "table-wrap" });
    let html = "<table><thead><tr><th>Topic</th><th>Read</th><th>Quiz best</th><th>Attempts</th><th>Checklist</th><th>Overall</th></tr></thead><tbody>";
    CS.sections.forEach((s) =>
      s.topics.forEach((t) => {
        const p = CS.progress.topic(t.id);
        const pts = t.specPoints || [];
        const ticked = pts.filter((x) => CS.store.get("checklist." + x.id, false)).length;
        html += "<tr><td><a href='#/topic/" + t.id + "'>" + t.id + " " + U.esc(t.title) + "</a></td><td>" + Math.round((p.read || 0) * 100) + "%</td><td>" + (p.quizBest != null ? Number(p.quizBest) + "%" : "—") + "</td><td>" + Number(p.quizAttempts || 0) + "</td><td>" + (pts.length ? ticked + "/" + pts.length : "—") + "</td><td><div class='progress-bar' style='width:90px'><i style='width:" + Math.round(CS.progress.completion(t.id) * 100) + "%'></i></div></td></tr>";
      })
    );
    html += "</tbody></table>";
    table.innerHTML = html;
    main.appendChild(table);

    const card = h("div", { class: "card", style: "margin-top:16px" });
    card.innerHTML = "<h3 style='margin-top:0'>Export, import or reset</h3><p class='small muted'>Progress is stored in this browser's localStorage. Export a backup before clearing your browser data or switching devices.</p>";
    const row = h("div", { class: "row" });
    const exportBtn = h("button", { class: "btn", type: "button", text: "Export progress (JSON)" });
    exportBtn.addEventListener("click", () => {
      const blob = new Blob([CS.store.exportJSON()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "cs-revision-progress-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
    const importInput = h("input", { type: "file", accept: "application/json", style: "display:none" });
    const importBtn = h("button", { class: "btn", type: "button", text: "Import progress" });
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", () => {
      const f = importInput.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("not a progress file");
          // an imported backup is a deliberate restore: stamp it so it wins over the cloud copy when signed in
          data.syncEpoch = Date.now();
          delete data.syncMeta;
          if (CS.store.all().syncMeta) data.syncMeta = CS.store.all().syncMeta;
          CS.store.replace(data);
          CS.migrateStore();
          CS.prefs.apply();
          CS.toast("Progress imported");
          route();
        } catch (e) {
          alert("That file is not valid progress JSON.");
        }
      };
      r.readAsText(f);
    });
    const resetBtn = h("button", { class: "btn danger", type: "button", text: "Reset all progress" });
    resetBtn.addEventListener("click", () => {
      if (confirm("Delete all saved progress, quiz scores, flashcard boxes and checklist ticks on this device?")) {
        CS.store.reset();
        CS.prefs.apply();
        CS.toast("Progress reset");
        route();
      }
    });
    row.append(exportBtn, importBtn, importInput, resetBtn);
    card.appendChild(row);
    card.appendChild(h("p", { class: "small muted", text: "To reset a single page, use the “Reset my progress on this page” button at the bottom of that page." }));
    main.appendChild(card);

    const mem = h("div", { class: "card", style: "margin-top:16px" });
    mem.innerHTML = "<h3 style='margin-top:0'>Memory on this device</h3><p class='small muted'>When saving is off, nothing is written to this browser: progress, scores, flashcard boxes and settings last only until you close or reload the tab. Turning it off also deletes what is already saved here (export a backup first if you want it). Useful on a shared or school computer.</p>";
    const memLabel = h("label", { class: "row" }, [h("input", { type: "checkbox" }), h("span", { html: "<b>Save my progress on this device</b>" })]);
    const memBox = memLabel.querySelector("input");
    memBox.checked = CS.store.isSaving();
    memBox.addEventListener("change", () => {
      if (!memBox.checked && !confirm("Stop saving on this device and delete the progress already saved here?")) {
        memBox.checked = true;
        return;
      }
      CS.store.setSaving(memBox.checked);
      if (CS.sync && CS.sync.applyPersistence) CS.sync.applyPersistence(); // off = signed in only until the tab closes
      renderSaveBadge();
      CS.toast(memBox.checked ? "Progress will be saved on this device" : "Saving is off — progress lasts until you close the tab");
    });
    mem.appendChild(memLabel);
    main.appendChild(mem);

    const prefs = h("div", { class: "card", style: "margin-top:16px" });
    prefs.innerHTML = "<h3 style='margin-top:0'>Display</h3>";
    const prow = h("div", { class: "row" });
    const tb = h("button", { class: "btn", type: "button", text: "Toggle dark / light" });
    tb.addEventListener("click", CS.prefs.toggleTheme);
    const fu = h("button", { class: "btn", type: "button", text: "A+ larger text" });
    fu.addEventListener("click", () => CS.prefs.fontScale(0.1));
    const fd = h("button", { class: "btn", type: "button", text: "A− smaller text" });
    fd.addEventListener("click", () => CS.prefs.fontScale(-0.1));
    const compact = h("label", { class: "row small" }, [h("input", { type: "checkbox" }), h("span", { text: "Compact line spacing" })]);
    compact.querySelector("input").checked = CS.store.get("prefs.compact", false);
    compact.querySelector("input").addEventListener("change", (e) => {
      CS.store.set("prefs.compact", e.target.checked);
      CS.prefs.apply();
    });
    prow.append(tb, fu, fd, compact);
    prefs.appendChild(prow);
    main.appendChild(prefs);
  };

  /* ---------------- GLOSSARY ---------------- */
  CS.views.glossary = function (main) {
    document.title = "CS Revision · Glossary";
    main.appendChild(pageHead('<a href="#/notes">Notes</a> › Glossary', "Glossary", "Every key term from every page, in mark-scheme wording."));
    const terms = [];
    CS.allTopicIds().forEach((id) => {
      const t = CS.topics[id];
      if (!t) return;
      if (!t.keyterms) {
        const ctx = { toc: [], keyterms: [] };
        CS.markdown.render(t.md, ctx);
        t.keyterms = ctx.keyterms;
      }
      t.keyterms.forEach((k) => terms.push(Object.assign({ topic: id }, k)));
    });
    terms.sort((a, b) => a.term.localeCompare(b.term));
    const filter = h("input", { type: "search", placeholder: "Filter terms…", "aria-label": "Filter terms", style: "margin-bottom:12px;max-width:420px" });
    main.appendChild(filter);
    const list = h("div");
    main.appendChild(list);
    const render = () => {
      const q = U.normalise(filter.value);
      list.innerHTML = "";
      let letter = "";
      terms
        .filter((t) => !q || U.normalise(t.term + " " + t.formal).includes(q))
        .forEach((t) => {
          const L = t.term[0].toUpperCase();
          if (L !== letter) {
            letter = L;
            list.appendChild(h("div", { class: "glossary-letter", text: L }));
          }
          list.appendChild(h("div", { class: "term", style: "margin-bottom:8px", html: '<div class="term-name">' + CS.markdown.inline(t.term) + ' <a class="small muted" href="#/topic/' + t.topic + '">' + t.topic + '</a></div><div class="term-formal">' + CS.markdown.inline(t.formal) + "</div>" + (t.plain ? '<div class="term-plain">' + CS.markdown.inline(t.plain) + "</div>" : "") }));
        });
      if (!list.children.length) list.appendChild(h("p", { class: "muted", text: "No terms match." }));
    };
    filter.addEventListener("input", U.debounce(render, 120));
    render();
  };
})();
