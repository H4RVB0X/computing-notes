/* =====================================================================
   search.js — client-side full-text search over all content
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  let index = null;

  function stripMd(md) {
    return md
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\{\{[^}]*\}\}/g, " ")
      .replace(/^:{3,}.*$/gm, " ")
      .replace(/[#*_>`|]/g, " ")
      .replace(/\s+/g, " ");
  }

  function build() {
    index = [];
    CS.allTopicIds().forEach((id) => {
      const meta = CS.topicMeta(id);
      const t = CS.topics[id];
      if (!meta) return;
      const entry = { type: "topic", id: id, title: id + " " + meta.title, href: "#/topic/" + id, headings: [], terms: [], body: "" };
      if (t) {
        const ctx = { toc: [], keyterms: [] };
        CS.markdown.render(t.md, ctx);
        t.keyterms = ctx.keyterms;
        entry.headings = ctx.toc.map((x) => ({ text: x.text, id: x.id }));
        entry.terms = ctx.keyterms.map((k) => k.term + " " + k.formal);
        entry.body = stripMd(t.md);
      }
      entry.lower = (entry.title + " " + entry.headings.map((x) => x.text).join(" ") + " " + entry.terms.join(" ") + " " + entry.body).toLowerCase();
      index.push(entry);
    });
    Object.values(CS.tools).forEach((tool) => {
      index.push({ type: "tool", id: tool.id, title: "Tool: " + tool.title, href: "#/tool/" + tool.id, headings: [], terms: [], body: tool.desc || "", lower: (tool.title + " " + (tool.desc || "")).toLowerCase() });
    });
  }

  function search(q) {
    if (!index) build();
    const words = U.normalise(q).split(" ").filter((w) => w.length > 1);
    if (!words.length) return [];
    const out = [];
    index.forEach((e) => {
      let score = 0;
      const titleL = e.title.toLowerCase();
      words.forEach((w) => {
        if (titleL.includes(w)) score += 12;
        e.headings.forEach((hd) => hd.text.toLowerCase().includes(w) && (score += 5));
        e.terms.forEach((tm) => tm.toLowerCase().includes(w) && (score += 6));
        const n = e.lower.split(w).length - 1;
        score += Math.min(n, 10);
      });
      const allPresent = words.every((w) => e.lower.includes(w));
      if (score > 0 && (allPresent || words.length === 1)) out.push({ e: e, score: score + (allPresent ? 5 : 0) });
    });
    out.sort((a, b) => b.score - a.score);
    return out.slice(0, 40).map((r) => {
      const e = r.e;
      // best heading match
      const hd = e.headings.find((x) => words.some((w) => x.text.toLowerCase().includes(w)));
      let snippet = "";
      const bodyL = e.body.toLowerCase();
      const pos = Math.min(...words.map((w) => (bodyL.indexOf(w) === -1 ? Infinity : bodyL.indexOf(w))));
      if (pos !== Infinity) {
        const s = Math.max(0, pos - 80);
        snippet = (s > 0 ? "…" : "") + e.body.slice(s, pos + 140) + "…";
      }
      const re = new RegExp("(" + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
      snippet = U.esc(snippet).replace(re, "<mark>$1</mark>");
      return { title: e.title, href: hd && e.type === "topic" ? "#/topic/" + e.id + "/" + hd.id : e.href, path: e.type === "tool" ? "Interactive tool" : hd ? "Section: " + hd.text : "Topic page", snippet: snippet };
    });
  }
  CS.search = { search: search, rebuild: () => (index = null) };

  CS.views.search = function (main, arg) {
    const q = arg[0] || "";
    document.title = "CS Revision · Search";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Search</div><h1>Search</h1>' }));
    const input = h("input", { type: "search", value: q, placeholder: "Search every page, key term and tool… (press / anywhere)", style: "margin-bottom:14px;font-size:1.05rem" });
    main.appendChild(input);
    const res = h("div");
    main.appendChild(res);
    const run = () => {
      const v = input.value.trim();
      res.innerHTML = "";
      if (!v) return;
      const results = search(v);
      if (!results.length) {
        res.appendChild(h("p", { class: "muted", text: "No matches. Try a different word (e.g. the mark-scheme term)." }));
        return;
      }
      res.appendChild(h("p", { class: "small muted", text: results.length + " result" + (results.length === 1 ? "" : "s") }));
      results.forEach((r) => res.appendChild(h("a", { class: "search-result", href: r.href, html: '<div class="path">' + U.esc(r.path) + '</div><div style="font-weight:700">' + U.esc(r.title) + '</div><div class="snip">' + r.snippet + "</div>" })));
    };
    input.addEventListener("input", U.debounce(run, 150));
    input.focus();
    run();
  };
})();
