/* =====================================================================
   core.js — shared namespace, registries, storage, utilities
   Everything on the site hangs off the global `CS` object.
   ===================================================================== */
(function () {
  "use strict";

  const CS = (window.CS = window.CS || {});

  /* ---------- registries filled by content files ---------- */
  CS.topics = {};        // id -> { meta, md }
  CS.quizzes = {};       // topicId -> [questions]
  CS.exams = {};         // topicId -> [exam questions]
  CS.flashcards = {};    // topicId -> [cards]
  CS.traces = {};        // traceId -> trace challenge  (also indexed by topic)
  CS.tracesByTopic = {}; // topicId -> [traceId]
  CS.tools = {};         // toolId -> tool definition
  CS.sections = CS.sections || [];
  CS.views = CS.views || {};   // page views, filled by app.js, quiz.js, flashcards.js, trace.js, search.js

  /* ---------- registration API (used by content/*.js and tools/*.js) ---------- */

  /** Extract markdown written inside a block comment of a function body. */
  function extractComment(fn) {
    if (typeof fn === "string") return fn;
    const src = fn.toString();
    const start = src.indexOf("/*");
    const end = src.lastIndexOf("*/");
    if (start === -1 || end === -1) return "";
    return src.slice(start + 2, end);
  }

  CS.registerTopic = function (meta, body) {
    if (!meta || !meta.id) throw new Error("registerTopic needs meta.id");
    CS.topics[meta.id] = { meta: meta, md: extractComment(body) };
  };
  /** Give every question a stable id that survives reordering: topic + kind + hash of the question text
   *  (and code). Options are left out so rebalancing the MCQ wording keeps the id. An explicit `id` wins. */
  function stampIds(topicId, questions, kind) {
    questions.forEach((q) => {
      if (!q.id) q.id = topicId + "/" + kind + "-" + CS.util.hash(String(q.q || "") + "\n" + String(q.code || ""));
      q.topicId = topicId;
    });
    return questions;
  }
  CS.registerQuiz = function (topicId, questions) {
    CS.quizzes[topicId] = (CS.quizzes[topicId] || []).concat(stampIds(topicId, questions, "q"));
  };
  CS.registerExam = function (topicId, questions) {
    CS.exams[topicId] = (CS.exams[topicId] || []).concat(stampIds(topicId, questions, "e"));
  };
  CS.problems = {};      // problemId -> coding problem (code practice)
  CS.registerProblems = function (problems) {
    problems.forEach((p) => (CS.problems[p.id] = p));
  };
  /** look up any quiz or exam question by its stable id */
  CS.findQuestion = function (id) {
    const topicId = String(id).split("/")[0];
    const list = (/\/e-/.test(id) ? CS.exams : CS.quizzes)[topicId] || [];
    return list.find((q) => q.id === id) || null;
  };
  CS.registerFlashcards = function (topicId, cards) {
    CS.flashcards[topicId] = (CS.flashcards[topicId] || []).concat(cards);
  };
  CS.registerTrace = function (challenge) {
    if (!challenge.id) throw new Error("registerTrace needs id");
    CS.traces[challenge.id] = challenge;
    const t = challenge.topic || challenge.id.split("-")[0];
    (CS.tracesByTopic[t] = CS.tracesByTopic[t] || []).push(challenge.id);
  };
  CS.registerTool = function (tool) {
    if (!tool.id) throw new Error("registerTool needs id");
    CS.tools[tool.id] = tool;
  };

  /* ---------- section / topic lookups ---------- */
  CS.allTopicIds = function () {
    const ids = [];
    CS.sections.forEach((s) => s.topics.forEach((t) => ids.push(t.id)));
    return ids;
  };
  CS.topicMeta = function (id) {
    for (const s of CS.sections) for (const t of s.topics) if (t.id === id) return Object.assign({ section: s }, t);
    return null;
  };
  CS.sectionOf = function (topicId) {
    for (const s of CS.sections) for (const t of s.topics) if (t.id === topicId) return s;
    return null;
  };
  CS.sectionById = function (id) {
    return CS.sections.find((s) => s.id === id) || null;
  };
  CS.prevNext = function (id) {
    const ids = CS.allTopicIds();
    const i = ids.indexOf(id);
    return { prev: i > 0 ? ids[i - 1] : null, next: i >= 0 && i < ids.length - 1 ? ids[i + 1] : null };
  };

  /* ---------- storage (localStorage with safe fallbacks) ---------- */
  const KEY = "cs-revision-v1";
  let memStore = null;
  function loadStore() {
    if (memStore) return memStore;
    try {
      memStore = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      memStore = {};
    }
    return memStore;
  }
  const NOSAVE_KEY = "cs-revision-nosave";
  function noSave() {
    try {
      return localStorage.getItem(NOSAVE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  function saveStore() {
    if (CS.store && CS.store.onChange) CS.store.onChange(); /* cloud sync (sync.js) */
    if (noSave()) return; /* memory-only mode: progress lasts until the tab is closed */
    try {
      localStorage.setItem(KEY, JSON.stringify(memStore));
    } catch (e) {
      /* private mode etc. — keep in memory */
    }
  }
  CS.store = {
    get(path, fallback) {
      const parts = path.split(".");
      let cur = loadStore();
      for (const p of parts) {
        if (cur == null || typeof cur !== "object" || !(p in cur)) return fallback;
        cur = cur[p];
      }
      return cur === undefined ? fallback : cur;
    },
    set(path, value) {
      const parts = path.split(".");
      let cur = loadStore();
      for (let i = 0; i < parts.length - 1; i++) {
        if (cur[parts[i]] == null || typeof cur[parts[i]] !== "object") cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      saveStore();
    },
    /** delete a value (and tidy up empty parent objects) */
    remove(path) {
      const parts = path.split(".");
      const chain = [loadStore()];
      for (let i = 0; i < parts.length - 1; i++) {
        const next = chain[i] && chain[i][parts[i]];
        if (next == null || typeof next !== "object") return;
        chain.push(next);
      }
      delete chain[chain.length - 1][parts[parts.length - 1]];
      for (let i = chain.length - 1; i > 0; i--) if (Object.keys(chain[i]).length === 0) delete chain[i - 1][parts[i - 1]];
      saveStore();
    },
    /** memory-only mode: nothing is written to this device */
    isSaving() {
      return !noSave();
    },
    setSaving(on) {
      try {
        if (on) {
          localStorage.removeItem(NOSAVE_KEY);
          saveStore();
        } else {
          localStorage.setItem(NOSAVE_KEY, "1");
          localStorage.removeItem(KEY);
        }
      } catch (e) {}
    },
    /** record when a piece of text (an answer, a code draft) was last edited, so the newest edit wins when
     *  devices sync. path is the text's full store path, e.g. "codeDrafts.digit-sum". */
    stampText(path) {
      const m = CS.store.get("textAt", {});
      m[path] = Date.now();
      CS.store.set("textAt", m);
    },
    update(path, fn, fallback) {
      const v = CS.store.get(path, fallback);
      CS.store.set(path, fn(v));
    },
    all() {
      return loadStore();
    },
    replace(obj) {
      memStore = obj || {};
      saveStore();
    },
    reset() {
      /* a full reset also wins over older copies in the cloud (sync.js); keep which account this device syncs with */
      const meta = loadStore().syncMeta;
      memStore = { syncEpoch: Date.now() };
      if (meta) memStore.syncMeta = meta;
      saveStore(); /* written straight away, so a reload before the upload can't bring the old progress back */
    },
    exportJSON() {
      return JSON.stringify(loadStore(), null, 2);
    },
  };

  /* ---------- progress helpers ---------- */
  CS.progress = {
    /** forget everything recorded for one page: reading, quiz, exam, checklist, traces, flashcards */
    resetTopic(id) {
      CS.store.remove("topics." + id);
      CS.store.remove("exam." + id);
      CS.store.remove("examAnswers." + id);
      const meta = CS.topicMeta ? CS.topicMeta(id) : null;
      ((meta && meta.specPoints) || []).forEach((p) => CS.store.remove("checklist." + p.id));
      (CS.tracesByTopic[id] || []).forEach((t) => CS.store.remove("trace." + t));
      if (CS.flash) CS.flash.cardsFor(id).forEach((c) => CS.store.remove("flash." + c.id));
      if (CS.mistakes) CS.mistakes.forgetTopic(id);
      if (CS.store.get("lastTopic") === id) CS.store.remove("lastTopic");
      if (CS.sync && CS.sync.overwrite) CS.sync.overwrite();
    },
    markViewed(id) {
      CS.store.set("topics." + id + ".viewed", Date.now());
      CS.store.set("lastTopic", id);
    },
    markRead(id, fraction) {
      const prev = CS.store.get("topics." + id + ".read", 0);
      if (fraction > prev) CS.store.set("topics." + id + ".read", Math.min(1, fraction));
    },
    setQuiz(id, score, total) {
      const best = CS.store.get("topics." + id + ".quizBest", null);
      const pct = total ? Math.round((score / total) * 100) : 0;
      const attempts = CS.store.get("topics." + id + ".quizAttempts", 0) + 1;
      CS.store.set("topics." + id + ".quizAttempts", attempts);
      CS.store.set("topics." + id + ".quizLast", pct);
      if (best === null || pct > best) CS.store.set("topics." + id + ".quizBest", pct);
      const hist = CS.store.get("topics." + id + ".quizHistory", []);
      hist.push({ t: Date.now(), pct: pct });
      CS.store.set("topics." + id + ".quizHistory", hist.slice(-20));
    },
    topic(id) {
      return CS.store.get("topics." + id, {});
    },
    /** 0..1 completion estimate for a topic */
    completion(id) {
      const t = CS.progress.topic(id);
      let score = 0;
      if (t.read) score += 0.4 * t.read;
      if (t.quizBest != null) score += 0.3 * (t.quizBest / 100);
      const meta = CS.topicMeta(id);
      const points = (meta && meta.specPoints) || [];
      if (points.length) {
        const ticked = points.filter((p) => CS.store.get("checklist." + p.id, false)).length;
        score += 0.2 * (ticked / points.length);
      } else score += 0.2 * (t.read || 0);
      if (t.examDone) score += 0.1;
      return Math.min(1, score);
    },
    weakest(n) {
      const rows = [];
      CS.allTopicIds().forEach((id) => {
        const t = CS.progress.topic(id);
        if (t.quizBest != null) rows.push({ id: id, pct: t.quizBest, attempts: t.quizAttempts || 0 });
      });
      rows.sort((a, b) => a.pct - b.pct);
      return rows.slice(0, n || 5);
    },
    untried() {
      return CS.allTopicIds().filter((id) => CS.progress.topic(id).quizBest == null);
    },
  };

  /** Older versions keyed exam scores and answers by question position (0, 1, "1_pts"…). Re-key them by
   *  stable question id. Safe to run on every boot and after an import: only position keys are touched. */
  CS.migrateStore = function () {
    Object.keys(CS.exams).forEach((t) => {
      const qs = CS.exams[t];
      [["exam." + t, /^(\d+)(_pts)?$/], ["examAnswers." + t, /^(\d+)()$/]].forEach(([path, re]) => {
        const old = CS.store.get(path, null);
        if (!old || typeof old !== "object" || !Object.keys(old).some((k) => re.test(k))) return;
        const out = {};
        Object.keys(old).forEach((k) => {
          const m = k.match(re);
          if (!m) out[k] = old[k];
          else if (qs[+m[1]]) out[qs[+m[1]].id + (m[2] || "")] = old[k];
        });
        CS.store.set(path, out);
      });
    });
  };

  /* ---------- small utilities ---------- */
  CS.util = {
    esc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },
    slug(s) {
      return String(s)
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    el(tag, attrs, children) {
      const e = document.createElement(tag);
      if (attrs)
        for (const k in attrs) {
          if (k === "class") e.className = attrs[k];
          else if (k === "html") e.innerHTML = attrs[k];
          else if (k === "text") e.textContent = attrs[k];
          else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]);
          else if (attrs[k] != null) e.setAttribute(k, attrs[k]);
        }
      if (children) (Array.isArray(children) ? children : [children]).forEach((c) => c != null && e.append(c));
      return e;
    },
    normalise(s) {
      return String(s == null ? "" : s)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[’‘]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[\u2212\u2013\u2014]/g, "-");
    },
    /** compare a student answer with accepted answers (strings or numbers) */
    answerMatches(given, accepted) {
      const g = CS.util.normalise(given);
      if (!g) return false;
      const list = Array.isArray(accepted) ? accepted : [accepted];
      return list.some((a) => {
        const an = CS.util.normalise(a);
        if (g === an) return true;
        // numeric tolerance
        const gn = parseFloat(g.replace(/[^0-9.\-]/g, ""));
        const anNum = parseFloat(an.replace(/[^0-9.\-]/g, ""));
        if (!isNaN(gn) && !isNaN(anNum) && /^[-\d.\s%]+$/.test(an) && /^[-\d.\s%]+$/.test(g)) {
          return Math.abs(gn - anNum) < 1e-9 || Math.abs(gn - anNum) <= Math.abs(anNum) * 0.001;
        }
        // strip punctuation / articles for short text answers
        const strip = (x) => x.replace(/[^a-z0-9 ]/g, "").replace(/\b(the|a|an)\b/g, "").replace(/\s+/g, " ").trim();
        return strip(g) === strip(an);
      });
    },
    fmtDate(ts) {
      try {
        return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      } catch (e) {
        return "";
      }
    },
    hash(s) {
      let h = 2166136261;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0).toString(36);
    },
    debounce(fn, ms) {
      let t;
      return function () {
        clearTimeout(t);
        const args = arguments;
        t = setTimeout(() => fn.apply(null, args), ms);
      };
    },
  };

  /* ---------- theme & preferences ---------- */
  CS.prefs = {
    apply() {
      const theme = CS.store.get("prefs.theme", null);
      const root = document.documentElement;
      if (theme) root.setAttribute("data-theme", theme);
      else root.removeAttribute("data-theme");
      const fs = CS.store.get("prefs.fontScale", 1);
      root.style.setProperty("--font-scale", fs);
      const dys = CS.store.get("prefs.compact", false);
      root.classList.toggle("compact", !!dys);
    },
    toggleTheme() {
      const root = document.documentElement;
      const cur = root.getAttribute("data-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      CS.store.set("prefs.theme", cur === "dark" ? "light" : "dark");
      CS.prefs.apply();
    },
    fontScale(delta) {
      let fs = CS.store.get("prefs.fontScale", 1) + delta;
      fs = Math.max(0.8, Math.min(1.5, Math.round(fs * 20) / 20));
      CS.store.set("prefs.fontScale", fs);
      CS.prefs.apply();
    },
  };
})();
