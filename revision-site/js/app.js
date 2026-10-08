/* =====================================================================
   app.js — boot, sidebar, router and page views
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (tag, attrs, children) => U.el(tag, attrs, children);

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
    renderSidebar();
    bindHeader();
    window.addEventListener("hashchange", route);
    route();
  }

  /* ---------------- sidebar ---------------- */
  function renderSidebar() {
    const nav = document.getElementById("nav");
    nav.innerHTML = "";
    CS.sections.forEach((s) => {
      const group = h("div", { class: "nav-group", "data-section": s.id, style: "--sc: var(--s" + s.id + ")" });
      const btn = h("button", { class: "nav-section-btn", type: "button", "aria-expanded": "false" }, [h("span", { class: "dot" }), h("span", { class: "num", text: s.id === "R" ? "REF" : s.id }), h("span", { text: s.short || s.title }), h("span", { class: "chev", text: "▶" })]);
      btn.addEventListener("click", () => {
        group.classList.toggle("open");
        btn.setAttribute("aria-expanded", group.classList.contains("open"));
      });
      const ul = h("ul", { class: "nav-topics" });
      s.topics.forEach((t) => {
        const a = h("a", { href: "#/topic/" + t.id, "data-topic": t.id }, [h("span", { class: "pid", text: t.id }), h("span", { text: t.title }), h("span", { class: "prog" }, h("i"))]);
        ul.appendChild(h("li", null, a));
      });
      group.append(btn, ul);
      nav.appendChild(group);
    });
    updateSidebarProgress();
  }

  function updateSidebarProgress() {
    document.querySelectorAll(".nav-topics a").forEach((a) => {
      const id = a.getAttribute("data-topic");
      const c = CS.progress.completion(id);
      a.querySelector(".prog i").style.width = Math.round(c * 100) + "%";
    });
  }

  function setActiveNav(topicId, pageKey) {
    document.querySelectorAll(".nav-topics a").forEach((a) => a.classList.toggle("active", a.getAttribute("data-topic") === topicId));
    document.querySelectorAll(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("data-page") === pageKey));
    if (topicId) {
      const sec = CS.sectionOf(topicId);
      if (sec) {
        const g = document.querySelector('.nav-group[data-section="' + sec.id + '"]');
        if (g && !g.classList.contains("open")) {
          g.classList.add("open");
          g.querySelector(".nav-section-btn").setAttribute("aria-expanded", "true");
        }
        const a = document.querySelector('.nav-topics a[data-topic="' + topicId + '"]');
        if (a && a.scrollIntoView) a.scrollIntoView({ block: "nearest" });
      }
    }
  }

  /* ---------------- header ---------------- */
  function bindHeader() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const closeSidebar = () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    };
    document.getElementById("menu-btn").addEventListener("click", () => {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show", sidebar.classList.contains("open"));
    });
    backdrop.addEventListener("click", closeSidebar);
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeSidebar();
    });
    document.getElementById("theme-btn").addEventListener("click", CS.prefs.toggleTheme);
    document.getElementById("font-up").addEventListener("click", () => CS.prefs.fontScale(0.1));
    document.getElementById("font-down").addEventListener("click", () => CS.prefs.fontScale(-0.1));
    const form = document.getElementById("search-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = form.querySelector("input").value.trim();
      if (q) location.hash = "#/search/" + encodeURIComponent(q);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea|select/i.test(e.target.tagName)) {
        e.preventDefault();
        form.querySelector("input").focus();
      }
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ---------------- router ---------------- */
  CS.views = CS.views || {};

  function route() {
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\/?/, "").split("/");
    const page = parts[0] || "home";
    const arg = parts.slice(1).map(decodeURIComponent);
    const main = document.getElementById("content");
    main.className = "content";
    main.innerHTML = "";
    window.scrollTo(0, 0);
    document.title = "CS Revision";
    const view = CS.views[page] || CS.views.notfound;
    try {
      view(main, arg);
    } catch (err) {
      console.error(err);
      main.innerHTML = '<div class="card"><h2>Something went wrong rendering this page</h2><pre class="mono small">' + U.esc(err && err.stack ? err.stack : err) + "</pre></div>";
    }
    if (page !== "topic") setActiveNav(null, page);
  }
  CS.route = route;
  CS.navigate = (hash) => {
    if (location.hash === hash) route();
    else location.hash = hash;
  };

  CS.toast = function (msg) {
    let t = document.getElementById("toast");
    if (!t) {
      t = h("div", { id: "toast", class: "toast" });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1800);
  };

  CS.views.notfound = function (main) {
    main.innerHTML = '<div class="card"><h2>Page not found</h2><p><a href="#/">Back to the dashboard</a></p></div>';
  };

  /* ---------------- HOME ---------------- */
  CS.views.home = function (main) {
    document.title = "CS Revision · Dashboard";
    const ids = CS.allTopicIds();
    const total = ids.length;
    let completionSum = 0,
      quizzed = 0,
      read = 0;
    ids.forEach((id) => {
      completionSum += CS.progress.completion(id);
      const t = CS.progress.topic(id);
      if (t.quizBest != null) quizzed++;
      if ((t.read || 0) >= 0.9) read++;
    });
    const due = CS.flash ? CS.flash.dueCount() : 0;
    const last = CS.store.get("lastTopic", null);
    const lastMeta = last ? CS.topicMeta(last) : null;
    const nQ = Object.values(CS.quizzes).reduce((a, b) => a + b.length, 0);
    const nTools = Object.keys(CS.tools).length;

    const hero = h("div", { class: "hero" });
    const left = h("div", { class: "card" });
    left.innerHTML =
      "<h1>AQA A-Level Computer Science</h1><p>Everything in the 7517 specification: notes, worked examples, quizzes, flashcards and interactive tools. Pick a section, or follow the suggestions on the right.</p>" +
      '<div class="stat-row"><div class="stat"><div class="v">' + Math.round((completionSum / total) * 100) + '%</div><div class="l">overall progress</div></div><div class="stat"><div class="v">' + read + "/" + total + '</div><div class="l">pages read</div></div><div class="stat"><div class="v">' + quizzed + "/" + total + '</div><div class="l">quizzes tried</div></div><div class="stat"><div class="v">' + due + '</div><div class="l">flashcards due</div></div></div>';
    const actions = h("div", { class: "row", style: "margin-top:14px" });
    if (lastMeta) actions.appendChild(h("a", { class: "btn primary", href: "#/topic/" + last, text: "Continue: " + last + " " + lastMeta.title }));
    actions.appendChild(h("a", { class: "btn", href: "#/mock", text: "🎲 Mixed mock" }));
    actions.appendChild(h("a", { class: "btn", href: "#/flashcards", text: "🃏 Flashcards" }));
    actions.appendChild(h("a", { class: "btn", href: "#/tools", text: "🧰 Tools (" + nTools + ")" }));
    actions.appendChild(h("a", { class: "btn", href: "#/checklist", text: "✅ Spec checklist" }));
    left.appendChild(actions);

    const right = h("div", { class: "card" });
    right.innerHTML = "<h3 style='margin:0 0 6px'>What should I revise next?</h3>";
    const list = h("ul", { class: "next-list" });
    nextSuggestions().forEach((s) => {
      if (s.custom) {
        list.appendChild(h("li", null, [h("a", { href: s.href, text: s.label }), h("span", { class: "why", text: s.why })]));
        return;
      }
      const m = CS.topicMeta(s.id);
      if (!m) return;
      list.appendChild(h("li", null, [h("a", { href: s.href || "#/topic/" + s.id, text: s.id + " " + m.title }), h("span", { class: "why", text: s.why })]));
    });
    right.appendChild(list);
    const weak = CS.progress.weakest(5);
    if (weak.length) {
      right.appendChild(h("h3", { style: "margin:14px 0 6px", text: "Weakest topics (quiz best score)" }));
      const wl = h("ul", { class: "next-list" });
      weak.forEach((w) => {
        const m = CS.topicMeta(w.id);
        if (!m) return;
        wl.appendChild(h("li", null, [h("a", { href: "#/quiz/" + w.id, text: w.id + " " + m.title }), h("span", { class: "pill " + (w.pct < 50 ? "bad" : w.pct < 75 ? "warn" : "ok"), text: w.pct + "%" })]));
      });
      right.appendChild(wl);
    }
    hero.append(left, right);
    main.appendChild(hero);

    if (CS.loadErrors) {
      main.appendChild(h("div", { class: "card", style: "border-color:var(--bad);margin-bottom:14px", html: "<b>Some content files failed to load:</b> " + CS.loadErrors.map(U.esc).join(", ") + ". Check <code>content/manifest.js</code>." }));
    }

    main.appendChild(h("h2", { text: "Specification sections", style: "margin:8px 0 10px" }));
    const cards = h("div", { class: "section-cards" });
    CS.sections.forEach((s) => {
      const comp = s.topics.reduce((a, t) => a + CS.progress.completion(t.id), 0) / s.topics.length;
      const a = h("a", { class: "section-card", href: "#/section/" + s.id, style: "--sc: var(--s" + s.id + ")" });
      a.innerHTML = '<div class="num">' + (s.spec ? "Spec " + s.spec : s.id === "R" ? "Reference" : "") + '</div><div class="t">' + U.esc(s.title) + '</div><div class="progress-bar" style="margin:6px 0"><i style="width:' + Math.round(comp * 100) + '%"></i></div><div class="meta"><span>' + s.topics.length + " pages</span><span>" + Math.round(comp * 100) + "%</span></div>";
      cards.appendChild(a);
    });
    main.appendChild(cards);
    main.appendChild(h("p", { class: "muted small", style: "margin-top:18px", text: nQ + " quiz questions · " + Object.values(CS.exams).reduce((a, b) => a + b.length, 0) + " exam-style questions · " + Object.values(CS.flashcards).reduce((a, b) => a + b.length, 0) + " flashcards · " + nTools + " interactive tools. Press / to search." }));
  };

  function nextSuggestions() {
    const out = [];
    const ids = CS.allTopicIds();
    const dueCount = CS.flash ? CS.flash.dueCount() : 0;
    if (dueCount) out.push({ id: "flash", label: "Review flashcards", href: "#/flashcards/due", why: dueCount + " cards are due for review", custom: true });
    // weakest with attempts
    const weak = CS.progress.weakest(3).filter((w) => w.pct < 70);
    weak.forEach((w) => out.push({ id: w.id, href: "#/topic/" + w.id, why: "quiz best only " + w.pct + "% — reread then retry" }));
    // read but not quizzed
    ids.forEach((id) => {
      if (out.length >= 6) return;
      const t = CS.progress.topic(id);
      if ((t.read || 0) >= 0.6 && t.quizBest == null) out.push({ id: id, href: "#/quiz/" + id, why: "you have read this but not tried the quiz" });
    });
    // untouched, in spec order
    ids.forEach((id) => {
      if (out.length >= 6) return;
      const t = CS.progress.topic(id);
      if (!t.viewed && !out.some((o) => o.id === id)) out.push({ id: id, why: "not started yet" });
    });
    return out.slice(0, 6);
  }

  /* ---------------- SECTION ---------------- */
  CS.views.section = function (main, arg) {
    const s = CS.sectionById(arg[0]);
    if (!s) return CS.views.notfound(main);
    document.title = "CS Revision · " + s.title;
    main.appendChild(h("div", { class: "topic-head" }, [h("div", { class: "crumbs", html: '<a href="#/">Home</a> › Section ' + U.esc(s.id) }), h("h1", { text: s.title }), h("p", { class: "muted", text: s.blurb || "" })]));
    const grid = h("div", { class: "grid cols-2" });
    s.topics.forEach((t) => {
      const p = CS.progress.topic(t.id);
      const card = h("div", { class: "card" });
      card.innerHTML = '<div class="row spread"><a href="#/topic/' + t.id + '" style="font-weight:800;font-size:1.05rem">' + t.id + " " + U.esc(t.title) + "</a>" + (p.quizBest != null ? '<span class="pill ' + (p.quizBest < 50 ? "bad" : p.quizBest < 75 ? "warn" : "ok") + '">quiz ' + p.quizBest + "%</span>" : "") + '</div><div class="progress-bar" style="margin:8px 0"><i style="width:' + Math.round(CS.progress.completion(t.id) * 100) + '%"></i></div><div class="row small"><a class="btn sm" href="#/topic/' + t.id + '">Read</a><a class="btn sm" href="#/quiz/' + t.id + '">Quiz</a><a class="btn sm" href="#/exam/' + t.id + '">Exam Qs</a><a class="btn sm" href="#/flashcards/' + t.id + '">Cards</a></div>';
      grid.appendChild(card);
    });
    main.appendChild(grid);
  };

  /* ---------------- TOPIC ---------------- */
  let scrollHandler = null;
  CS.views.topic = function (main, arg) {
    const id = arg[0];
    const meta = CS.topicMeta(id);
    const topic = CS.topics[id];
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · " + id + " " + meta.title;
    setActiveNav(id, null);
    CS.progress.markViewed(id);
    const sec = meta.section;
    main.style.setProperty("--sc", "var(--s" + sec.id + ")");

    const head = h("div", { class: "topic-head" });
    head.innerHTML = '<div class="crumbs"><a href="#/">Home</a> › <a href="#/section/' + sec.id + '">' + U.esc(sec.title) + "</a></div><h1><span class='pid'>" + U.esc(id) + "</span>" + U.esc(meta.title) + "</h1>" + (meta.spec ? '<div class="small muted">Specification: ' + meta.spec.map((s) => '<span class="spec-badge">' + U.esc(s) + "</span>").join(" ") + "</div>" : "");
    main.appendChild(head);

    if (!topic) {
      main.appendChild(h("div", { class: "card", html: "<h3>Content not written yet</h3><p>This page has no content file. Add <code>content/topics/" + U.esc(id) + ".md.js</code> and list it in <code>content/manifest.js</code>.</p>" }));
      return;
    }

    // tools row
    const mode = CS.store.get("prefs.viewMode", "full");
    const toolsRow = h("div", { class: "topic-tools" });
    const toggle = h("div", { class: "view-toggle", role: "group", "aria-label": "View mode" });
    const bQuick = h("button", { type: "button", class: mode === "quick" ? "active" : "", text: "⚡ Quick view" });
    const bFull = h("button", { type: "button", class: mode === "full" ? "active" : "", text: "📖 Full detail" });
    toggle.append(bQuick, bFull);
    toolsRow.appendChild(toggle);
    const nq = (CS.quizzes[id] || []).length;
    if (nq) toolsRow.appendChild(h("a", { class: "btn sm", href: "#/quiz/" + id, text: "Quiz (" + nq + ")" }));
    if ((CS.exams[id] || []).length) toolsRow.appendChild(h("a", { class: "btn sm", href: "#/exam/" + id, text: "Exam questions" }));
    if ((CS.flashcards[id] || []).length || topic) toolsRow.appendChild(h("a", { class: "btn sm", href: "#/flashcards/" + id, text: "Flashcards" }));
    const pr = CS.progress.topic(id);
    if (pr.quizBest != null) toolsRow.appendChild(h("span", { class: "pill " + (pr.quizBest < 50 ? "bad" : pr.quizBest < 75 ? "warn" : "ok"), text: "Quiz best " + pr.quizBest + "%" }));
    main.appendChild(toolsRow);

    const layout = h("div", { class: "topic-layout" });
    const body = h("article", { class: "topic-body " + (mode === "quick" ? "quick" : "") });
    const ctx = { toc: [], keyterms: [] };
    body.innerHTML = CS.markdown.render(topic.md, ctx);
    topic.keyterms = ctx.keyterms;
    if (mode === "quick") body.insertAdjacentHTML("afterbegin", '<div class="quick-notice" data-quick="1">⚡ <b>Quick view</b> shows the objectives, summary, key terms and recap only. Switch to <b>Full detail</b> for explanations, worked examples and diagrams.</div>');

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
    layout.appendChild(toc);
    main.appendChild(layout);

    bQuick.addEventListener("click", () => {
      CS.store.set("prefs.viewMode", "quick");
      route();
    });
    bFull.addEventListener("click", () => {
      CS.store.set("prefs.viewMode", "full");
      route();
    });

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
    const grid = h("div", { class: "topic-actions" });
    const nq = (CS.quizzes[id] || []).length;
    const ne = (CS.exams[id] || []).length;
    const nf = (CS.flashcards[id] || []).length + ((CS.topics[id] && CS.topics[id].keyterms) || []).length;
    const nt = (CS.tracesByTopic[id] || []).length;
    const card = (href, ico, t, d) => h("a", { class: "action-card", href: href, html: '<div class="ico">' + ico + '</div><div class="t">' + t + '</div><div class="d">' + d + "</div>" });
    if (nq) grid.appendChild(card("#/quiz/" + id, "🧠", "Quiz", nq + " questions with instant feedback"));
    if (ne) grid.appendChild(card("#/exam/" + id, "📝", "Exam-style questions", ne + " questions with mark schemes"));
    if (nf) grid.appendChild(card("#/flashcards/" + id, "🃏", "Flashcards", nf + " cards, spaced repetition"));
    if (nt) grid.appendChild(card("#/trace/" + id, "🔍", "Trace challenges", nt + " code-tracing tasks"));
    grid.appendChild(card("#/mock", "🎲", "Mixed mock", "random questions across topics"));
    wrap.appendChild(grid);
    return wrap;
  }

  function renderChecklist(id, meta) {
    const points = meta.specPoints || [];
    const wrap = h("section", { class: "card", style: "margin:1.5em 0", "data-quick": "1" });
    wrap.appendChild(h("h3", { style: "margin:0 0 6px", text: "Revision checklist — tick what you can do" }));
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
        updateSidebarProgress();
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
      el.innerHTML = '<div class="tool-missing">🧰 Interactive tool “' + U.esc(id) + "” is not available (file missing from manifest?).</div>";
      return;
    }
    const frame = h("div", { class: "tool-frame" });
    const head = h("div", { class: "tool-frame-head" }, [h("span", { text: "🧰 " + tool.title }), embedded ? h("a", { class: "btn sm ghost", href: "#/tool/" + id, text: "Open full page ↗" }) : h("span", { class: "muted small", text: tool.desc || "" })]);
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
    if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
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
        if (frac >= 0.85) updateSidebarProgress();
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
      if (document.documentElement.scrollHeight <= window.innerHeight + 40) CS.progress.markRead(id, 1);
    }, 300);
  }

  /* ---------------- TOOLS ---------------- */
  CS.views.tools = function (main) {
    document.title = "CS Revision · Interactive tools";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Tools</div><h1>Interactive tools</h1><p class="muted">Visualisers, simulators and calculators. Each one also appears inside the topic page it belongs to.</p>' }));
    const bySection = {};
    Object.values(CS.tools).forEach((t) => (bySection[t.section || "misc"] = bySection[t.section || "misc"] || []).push(t));
    const order = CS.sections.map((s) => s.id).concat(["misc"]);
    order.forEach((sid) => {
      const list = bySection[sid];
      if (!list) return;
      const sec = CS.sectionById(sid);
      main.appendChild(h("h2", { text: sec ? sec.id + " · " + sec.title : "Other tools", style: "margin:1.4em 0 0.6em" }));
      const grid = h("div", { class: "grid cols-3" });
      list.sort((a, b) => a.title.localeCompare(b.title)).forEach((t) => grid.appendChild(h("a", { class: "action-card", href: "#/tool/" + t.id, html: '<div class="ico">' + (t.icon || "🧰") + '</div><div class="t">' + U.esc(t.title) + '</div><div class="d">' + U.esc(t.desc || "") + "</div>" })));
      main.appendChild(grid);
    });
    if (!Object.keys(CS.tools).length) main.appendChild(h("p", { class: "muted", text: "No tools registered yet." }));
  };

  CS.views.tool = function (main, arg) {
    const id = arg[0];
    const tool = CS.tools[id];
    main.classList.add("wide", "tool-page");
    document.title = "CS Revision · " + (tool ? tool.title : "Tool");
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/tools">Tools</a></div><h1>' + (tool ? U.esc(tool.title) : "Unknown tool") + "</h1>" + (tool && tool.desc ? '<p class="muted">' + U.esc(tool.desc) + "</p>" : "") + (tool && tool.topic ? '<p class="small">Belongs to topic <a href="#/topic/' + U.esc(tool.topic) + '">' + U.esc(tool.topic) + "</a></p>" : "") }));
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
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Checklist</div><h1>Specification checklist</h1><p class="muted">Every AQA 7517 content point, mapped to the page that covers it. Tick what you can confidently do — ticks are saved on this device.</p>' }));
    let totalPts = 0,
      done = 0;
    const allUl = [];
    CS.sections.forEach((s) => {
      const sec = h("section", { class: "card", style: "margin-bottom:14px;--sc:var(--s" + s.id + ")" });
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
          if (isDone) done++;
          const cb = h("input", { type: "checkbox", id: "ck-" + p.id });
          cb.checked = isDone;
          const li = h("li", { class: isDone ? "done" : "" }, [cb, h("label", { for: "ck-" + p.id, html: '<span class="sp">' + U.esc(p.id) + "</span> " + U.esc(p.text) })]);
          cb.addEventListener("change", () => {
            CS.store.set(key, cb.checked);
            li.classList.toggle("done", cb.checked);
            updateSidebarProgress();
            summary.textContent = summaryText();
          });
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        allUl.push(ul);
      });
      main.appendChild(sec);
    });
    const summaryText = () => {
      let d = 0;
      allUl.forEach((ul) => ul.querySelectorAll("input:checked").forEach(() => d++));
      return d + " of " + totalPts + " specification points ticked (" + Math.round((d / Math.max(1, totalPts)) * 100) + "%)";
    };
    const summary = h("div", { class: "pill accent", text: summaryText(), style: "font-size:0.9rem;padding:6px 14px" });
    main.insertBefore(summary, main.children[1]);
  };

  /* ---------------- PROGRESS / SETTINGS ---------------- */
  CS.views.progress = function (main) {
    document.title = "CS Revision · Progress";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Progress</div><h1>Progress &amp; settings</h1>' }));
    const table = h("div", { class: "table-wrap" });
    let html = "<table><thead><tr><th>Topic</th><th>Read</th><th>Quiz best</th><th>Attempts</th><th>Checklist</th><th>Overall</th></tr></thead><tbody>";
    CS.sections.forEach((s) =>
      s.topics.forEach((t) => {
        const p = CS.progress.topic(t.id);
        const pts = t.specPoints || [];
        const ticked = pts.filter((x) => CS.store.get("checklist." + x.id, false)).length;
        html += "<tr><td><a href='#/topic/" + t.id + "'>" + t.id + " " + U.esc(t.title) + "</a></td><td>" + Math.round((p.read || 0) * 100) + "%</td><td>" + (p.quizBest != null ? p.quizBest + "%" : "—") + "</td><td>" + (p.quizAttempts || 0) + "</td><td>" + (pts.length ? ticked + "/" + pts.length : "—") + "</td><td><div class='progress-bar' style='width:90px'><i style='width:" + Math.round(CS.progress.completion(t.id) * 100) + "%'></i></div></td></tr>";
      })
    );
    html += "</tbody></table>";
    table.innerHTML = html;
    main.appendChild(table);

    const card = h("div", { class: "card", style: "margin-top:16px" });
    card.innerHTML = "<h3 style='margin-top:0'>Export, import or reset</h3><p class='small muted'>Progress is stored in this browser's localStorage. Export a backup before clearing your browser data or switching devices.</p>";
    const row = h("div", { class: "row" });
    const exportBtn = h("button", { class: "btn", type: "button", text: "⬇ Export progress (JSON)" });
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
    const importBtn = h("button", { class: "btn", type: "button", text: "⬆ Import progress" });
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", () => {
      const f = importInput.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          CS.store.replace(JSON.parse(r.result));
          CS.prefs.apply();
          CS.toast("Progress imported");
          route();
          updateSidebarProgress();
        } catch (e) {
          alert("That file is not valid progress JSON.");
        }
      };
      r.readAsText(f);
    });
    const resetBtn = h("button", { class: "btn danger", type: "button", text: "🗑 Reset all progress" });
    resetBtn.addEventListener("click", () => {
      if (confirm("Delete all saved progress, quiz scores, flashcard boxes and checklist ticks on this device?")) {
        CS.store.reset();
        CS.prefs.apply();
        updateSidebarProgress();
        CS.toast("Progress reset");
        route();
      }
    });
    row.append(exportBtn, importBtn, importInput, resetBtn);
    card.appendChild(row);
    main.appendChild(card);

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
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Glossary</div><h1>Glossary</h1><p class="muted">Every key term from every page, in mark-scheme wording.</p>' }));
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
    const filter = h("input", { type: "search", placeholder: "Filter terms…", style: "margin-bottom:12px" });
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
