/* =====================================================================
   markdown.js — small Markdown renderer with site-specific directives.
   Supported:
     # headings, paragraphs, **bold**, *italic*, `code`, [links](url)
     - lists / 1. lists (nested by 2-space indent), > quotes, --- rules
     | tables |, ```fenced code``` (with language), raw HTML blocks
     :::type Title ... :::  directive blocks (nesting by colon count)
         objectives, quick, keyterms, definition, example, trap, tip,
         challenge, exam, recap, note, related, collapse, tabs/tab, steps
     {{tool:id key=value}}  {{trace:id}}  {{spec:4.1.1.1}}
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const esc = (s) => CS.util.esc(s);

  const BLOCK_TAGS = ["svg", "div", "figure", "table", "details", "section", "pre", "p", "ul", "ol", "blockquote", "canvas", "iframe", "img", "hr", "br", "video", "audio", "math"];

  /* ---------------- inline ---------------- */
  function inline(text, ctx) {
    if (!text) return "";
    // protect code spans
    const codes = [];
    text = text.replace(/`([^`]+)`/g, (m, c) => {
      codes.push('<code>' + esc(c) + "</code>");
      return "\u0000" + (codes.length - 1) + "\u0000";
    });
    // escape: & not part of entity, < not starting a tag
    text = text.replace(/&(?![a-zA-Z#][a-zA-Z0-9]*;)/g, "&amp;");
    text = text.replace(/<(?!\/?[a-zA-Z][a-zA-Z0-9-]*(\s[^<>]*)?\/?>)/g, "&lt;");
    // spec badges
    text = text.replace(/\{\{spec:([^}]+)\}\}/g, (m, s) => '<span class="spec-badge" title="AQA specification reference">' + esc(s.trim()) + "</span>");
    // key term reference {{term:Name}}
    text = text.replace(/\{\{term:([^}]+)\}\}/g, (m, s) => '<span class="term-ref">' + esc(s.trim()) + "</span>");
    // links
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => {
      const external = /^https?:/i.test(url);
      return '<a href="' + esc(url) + '"' + (external ? ' target="_blank" rel="noopener"' : "") + ">" + label + "</a>";
    });
    // bold / italic / strike
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>");
    text = text.replace(/~~([^~]+)~~/g, "<del>$1</del>");
    // arrows & symbols sugar
    text = text.replace(/-->/g, "→").replace(/<--/g, "←");
    // restore code
    text = text.replace(/\u0000(\d+)\u0000/g, (m, i) => codes[+i]);
    return text;
  }

  /* ---------------- block parsing ---------------- */
  function parse(md, ctx) {
    ctx = ctx || {};
    ctx.toc = ctx.toc || [];
    ctx.keyterms = ctx.keyterms || [];
    ctx.ids = ctx.ids || {};
    const lines = md.replace(/\r\n?/g, "\n").split("\n");
    return parseBlocks(lines, ctx);
  }

  function uniqueId(ctx, base) {
    let id = base || "s";
    let n = 2;
    while (ctx.ids[id]) id = base + "-" + n++;
    ctx.ids[id] = true;
    return id;
  }

  function parseBlocks(lines, ctx) {
    let out = [];
    let i = 0;
    const n = lines.length;
    while (i < n) {
      let line = lines[i];
      const trimmed = line.trim();

      // blank
      if (trimmed === "") {
        i++;
        continue;
      }

      // fenced code
      let m = /^(`{3,}|~{3,})\s*([\w+#-]*)\s*(.*)$/.exec(trimmed);
      if (m) {
        const fence = m[1][0];
        const lang = (m[2] || "text").toLowerCase();
        const title = m[3] || "";
        const buf = [];
        i++;
        while (i < n && !new RegExp("^\\s*" + fence + "{3,}\\s*$").test(lines[i])) buf.push(lines[i++]);
        i++; // closing fence
        out.push(renderCode(buf.join("\n"), lang, title));
        continue;
      }

      // directive block  :::name title
      m = /^(:{3,})\s*([a-zA-Z][\w-]*)\s*(.*)$/.exec(trimmed);
      if (m) {
        const colons = m[1];
        const type = m[2].toLowerCase();
        const title = m[3].trim();
        const buf = [];
        i++;
        const closeRe = new RegExp("^\\s*" + colons + "\\s*$");
        while (i < n && !closeRe.test(lines[i])) buf.push(lines[i++]);
        i++;
        out.push(renderDirective(type, title, buf, ctx));
        continue;
      }

      // heading
      m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(trimmed);
      if (m) {
        const level = m[1].length;
        const text = inline(m[2], ctx);
        const id = uniqueId(ctx, CS.util.slug(m[2]));
        if (level === 2 || level === 3) ctx.toc.push({ level: level, id: id, text: m[2].replace(/[*`_]/g, "") });
        out.push('<h' + level + ' id="' + id + '">' + text + '<a class="anchor" href="#' + id + '" aria-label="link to section">#</a></h' + level + ">");
        i++;
        continue;
      }

      // horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        out.push("<hr>");
        i++;
        continue;
      }

      // shortcodes on their own line
      m = /^\{\{(tool|trace|quiz|exam|flashcards|image):([^\s}]+)\s*([^}]*)\}\}$/.exec(trimmed);
      if (m) {
        out.push(renderShortcode(m[1], m[2], m[3]));
        i++;
        continue;
      }

      // raw html block
      m = /^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(trimmed);
      if (m && BLOCK_TAGS.includes(m[1].toLowerCase())) {
        const tag = m[1].toLowerCase();
        const buf = [line];
        const selfClosing = /\/>\s*$/.test(trimmed) || ["hr", "br", "img"].includes(tag) || new RegExp("</" + tag + ">\\s*$", "i").test(trimmed);
        i++;
        if (!selfClosing) {
          let depth = countTags(line, tag);
          while (i < n && depth > 0) {
            buf.push(lines[i]);
            depth += countTags(lines[i], tag);
            i++;
          }
        }
        out.push(buf.join("\n"));
        continue;
      }

      // table
      if (trimmed.indexOf("|") !== -1 && i + 1 < n && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1]) && lines[i + 1].indexOf("|") !== -1) {
        const header = splitRow(line);
        const aligns = splitRow(lines[i + 1]).map((c) => (/^:-+:$/.test(c) ? "center" : /-+:$/.test(c) ? "right" : /^:-+/.test(c) ? "left" : ""));
        i += 2;
        const rows = [];
        while (i < n && lines[i].trim() !== "" && lines[i].indexOf("|") !== -1) rows.push(splitRow(lines[i++]));
        let html = '<div class="table-wrap"><table><thead><tr>';
        header.forEach((h, k) => (html += "<th" + (aligns[k] ? ' style="text-align:' + aligns[k] + '"' : "") + ">" + inline(h, ctx) + "</th>"));
        html += "</tr></thead><tbody>";
        rows.forEach((r) => {
          html += "<tr>";
          header.forEach((h, k) => (html += "<td" + (aligns[k] ? ' style="text-align:' + aligns[k] + '"' : "") + ' data-label="' + esc(h.replace(/[*`]/g, "")) + '">' + inline(r[k] == null ? "" : r[k], ctx) + "</td>"));
          html += "</tr>";
        });
        html += "</tbody></table></div>";
        out.push(html);
        continue;
      }

      // blockquote
      if (/^>\s?/.test(trimmed)) {
        const buf = [];
        while (i < n && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ""));
        out.push("<blockquote>" + parseBlocks(buf, ctx) + "</blockquote>");
        continue;
      }

      // list
      if (/^(\s*)([-*+]|\d+[.)])\s+/.test(line)) {
        const res = parseList(lines, i, ctx);
        out.push(res.html);
        i = res.next;
        continue;
      }

      // paragraph: gather until blank or a block-start
      const buf = [line];
      i++;
      while (i < n && lines[i].trim() !== "" && !isBlockStart(lines[i])) buf.push(lines[i++]);
      out.push("<p>" + inline(buf.join("\n").replace(/\n/g, " "), ctx) + "</p>");
    }
    return out.join("\n");
  }

  function isBlockStart(line) {
    const t = line.trim();
    return /^(#{1,6}\s|`{3}|~{3}|:{3,}\s*\w|>\s?|[-*+]\s+|\d+[.)]\s+|\{\{(tool|trace|quiz|exam|flashcards|image):|<(svg|div|figure|table|details|section|pre|canvas)\b|(-{3,}|\*{3,})$)/.test(t) || (t.indexOf("|") === 0);
  }

  function countTags(line, tag) {
    const open = (line.match(new RegExp("<" + tag + "(\\s|>)", "gi")) || []).length;
    const close = (line.match(new RegExp("</" + tag + ">", "gi")) || []).length;
    const self = (line.match(new RegExp("<" + tag + "[^>]*/>", "gi")) || []).length;
    return open - close - self;
  }

  function splitRow(line) {
    let s = line.trim();
    if (s.startsWith("|")) s = s.slice(1);
    if (s.endsWith("|")) s = s.slice(0, -1);
    // split on | not inside code spans
    const cells = [];
    let cur = "",
      inCode = false;
    for (let k = 0; k < s.length; k++) {
      const ch = s[k];
      if (ch === "`") inCode = !inCode;
      if (ch === "|" && !inCode && s[k - 1] !== "\\") {
        cells.push(cur.trim());
        cur = "";
      } else cur += ch;
    }
    cells.push(cur.trim());
    return cells.map((c) => c.replace(/\\\|/g, "|"));
  }

  function parseList(lines, start, ctx) {
    // Build nested lists based on indentation.
    const items = []; // {indent, ordered, text, children(lines)}
    let i = start;
    const n = lines.length;
    const first = /^(\s*)([-*+]|\d+[.)])\s+/.exec(lines[i]);
    const baseIndent = first[1].length;
    const ordered = /\d/.test(first[2]);
    let html = ordered ? "<ol>" : "<ul>";
    while (i < n) {
      const line = lines[i];
      if (line.trim() === "") {
        // blank: continue only if next non-blank line is still part of this list (indented or list marker at base indent)
        let j = i + 1;
        while (j < n && lines[j].trim() === "") j++;
        if (j < n && (/^(\s*)([-*+]|\d+[.)])\s+/.test(lines[j]) && /^(\s*)/.exec(lines[j])[1].length >= baseIndent || /^\s{2,}\S/.test(lines[j]) && /^(\s*)/.exec(lines[j])[1].length > baseIndent)) {
          i = j;
          continue;
        }
        break;
      }
      const m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
      if (m && m[1].length === baseIndent) {
        // new item at this level: collect its continuation / nested lines
        let text = m[3];
        const nested = [];
        i++;
        while (i < n) {
          const l2 = lines[i];
          if (l2.trim() === "") {
            // look ahead
            let j = i + 1;
            while (j < n && lines[j].trim() === "") j++;
            if (j < n && /^(\s*)/.exec(lines[j])[1].length > baseIndent) {
              nested.push("");
              i++;
              continue;
            }
            break;
          }
          const ind = /^(\s*)/.exec(l2)[1].length;
          if (ind > baseIndent) {
            nested.push(l2.slice(Math.min(ind, baseIndent + 2)));
            i++;
          } else break;
        }
        let inner = "";
        if (nested.length) {
          // if nested starts with a list marker, parse as blocks; else treat as continuation paragraphs
          const nonEmpty = nested.filter((x) => x.trim() !== "");
          const startsList = nonEmpty.length && /^\s*([-*+]|\d+[.)])\s+/.test(nonEmpty[0]);
          if (startsList) inner = parseBlocks(nested, ctx);
          else {
            // continuation text + possibly nested lists later
            inner = parseBlocks(nested, ctx);
            if (/^<p>/.test(inner)) {
              // merge the first paragraph into item text
              const endP = inner.indexOf("</p>");
              text += " " + inner.slice(3, endP);
              inner = inner.slice(endP + 4);
            }
          }
        }
        // task list syntax
        let cls = "";
        const task = /^\[([ xX])\]\s+(.*)$/.exec(text);
        if (task) {
          cls = ' class="task' + (task[1] !== " " ? " done" : "") + '"';
          text = '<span class="task-box">' + (task[1] !== " " ? "✓" : "") + "</span> " + task[2];
        }
        html += "<li" + cls + ">" + inline(text, ctx) + inner + "</li>";
      } else if (m && m[1].length < baseIndent) break;
      else break;
    }
    html += ordered ? "</ol>" : "</ul>";
    return { html: html, next: i };
  }

  /* ---------------- code ---------------- */
  const LANG_LABEL = { python: "Python", pseudocode: "AQA pseudocode", haskell: "Haskell", sql: "SQL", asm: "Assembly", assembly: "Assembly", text: "", js: "JavaScript", javascript: "JavaScript", bnf: "BNF", regex: "Regex", vb: "VB.NET", c: "C", json: "JSON", xml: "XML", bash: "Shell", output: "Output" };
  function renderCode(code, lang, title) {
    const hl = CS.highlight ? CS.highlight(code, lang) : esc(code);
    const label = title || LANG_LABEL[lang] || lang;
    const lineCount = code.split("\n").length;
    const numbered = lineCount > 3 && lang !== "output" && lang !== "text";
    return '<figure class="code' + (numbered ? " numbered" : "") + '" data-lang="' + esc(lang) + '"><figcaption><span class="code-lang">' + esc(label) + '</span><button class="copy-btn" type="button" title="Copy code">Copy</button></figcaption><pre><code class="lang-' + esc(lang) + '">' + hl + "</code></pre></figure>";
  }

  /* ---------------- directives ---------------- */
  const CALLOUTS = {
    definition: { icon: "📘", label: "Definition" },
    example: { icon: "🧮", label: "Worked example" },
    trap: { icon: "⚠️", label: "Marks are lost here" },
    tip: { icon: "💡", label: "Tip" },
    challenge: { icon: "🎯", label: "Challenge" },
    exam: { icon: "📝", label: "Exam technique" },
    note: { icon: "ℹ️", label: "Note" },
    warning: { icon: "⚠️", label: "Careful" },
    why: { icon: "🤔", label: "Why?" },
    history: { icon: "🕰️", label: "Background" },
    link: { icon: "🔗", label: "Connection" },
    maths: { icon: "∑", label: "Maths link" },
  };

  function renderDirective(type, title, buf, ctx) {
    switch (type) {
      case "quick": {
        return '<div class="quick-block" data-quick="1"><div class="quick-head"><span class="quick-icon">⚡</span><span>' + esc(title || "Quick view") + '</span></div><div class="quick-body">' + parseBlocks(buf, ctx) + "</div></div>";
      }
      case "objectives": {
        const inner = parseBlocks(buf, ctx).replace(/<ul>/g, '<ul class="objectives-list">');
        return '<section class="objectives" data-quick="1"><h2 id="' + uniqueId(ctx, "learning-objectives") + '">' + esc(title || "What you need to be able to do") + "</h2>" + inner + "</section>";
      }
      case "recap": {
        const inner = parseBlocks(buf, ctx);
        return '<section class="recap" data-quick="1"><h2 id="' + uniqueId(ctx, "quick-recap") + '">' + esc(title || "Quick recap") + "</h2>" + inner + "</section>";
      }
      case "keyterms": {
        const terms = [];
        buf.forEach((l) => {
          const t = l.trim();
          if (!t) return;
          const parts = t.split("::").map((x) => x.trim());
          if (parts.length >= 2) {
            const term = parts[0].replace(/^[-*]\s*/, "");
            terms.push({ term: term, formal: parts[1], plain: parts[2] || "" });
          }
        });
        ctx.keyterms.push(...terms);
        let html = '<section class="keyterms" data-quick="1"><h2 id="' + uniqueId(ctx, "key-terms") + '">' + esc(title || "Key terms") + '</h2><p class="keyterms-hint">Left column = mark-scheme wording. Right column = what it actually means.</p><div class="term-grid">';
        terms.forEach((t) => {
          html += '<div class="term"><div class="term-name">' + inline(t.term, ctx) + '</div><div class="term-formal">' + inline(t.formal, ctx) + "</div>" + (t.plain ? '<div class="term-plain">' + inline(t.plain, ctx) + "</div>" : "") + "</div>";
        });
        html += "</div></section>";
        return html;
      }
      case "related": {
        return '<section class="related"><h2 id="' + uniqueId(ctx, "related-topics") + '">' + esc(title || "Related topics") + "</h2>" + parseBlocks(buf, ctx) + "</section>";
      }
      case "collapse": {
        return '<details class="collapse"><summary>' + inline(title || "Show more", ctx) + '</summary><div class="collapse-body">' + parseBlocks(buf, ctx) + "</div></details>";
      }
      case "tabs": {
        // split buf into :::tab blocks (any colon count less than container)
        const tabs = [];
        let cur = null;
        buf.forEach((l) => {
          const m = /^(:{3,})\s*tab\s+(.*)$/.exec(l.trim());
          const close = /^(:{3,})\s*$/.test(l.trim());
          if (m) {
            cur = { title: m[2].trim(), lines: [] };
            tabs.push(cur);
          } else if (close && cur) {
            cur = null;
          } else if (cur) cur.lines.push(l);
        });
        const id = uniqueId(ctx, "tabs");
        let html = '<div class="tabs" id="' + id + '"><div class="tab-bar" role="tablist">';
        tabs.forEach((t, k) => (html += '<button role="tab" class="tab-btn' + (k === 0 ? " active" : "") + '" aria-selected="' + (k === 0) + '" data-tab="' + k + '">' + inline(t.title, ctx) + "</button>"));
        html += "</div>";
        tabs.forEach((t, k) => (html += '<div class="tab-panel' + (k === 0 ? " active" : "") + '" role="tabpanel" data-tab="' + k + '">' + parseBlocks(t.lines, ctx) + "</div>"));
        html += "</div>";
        return html;
      }
      case "steps": {
        const inner = parseBlocks(buf, ctx).replace(/<ol>/g, '<ol class="steps-list">');
        return '<div class="steps">' + (title ? '<div class="steps-title">' + inline(title, ctx) + "</div>" : "") + inner + "</div>";
      }
      case "columns": {
        // split on a line that is exactly "|||"
        const cols = [[]];
        buf.forEach((l) => (l.trim() === "|||" ? cols.push([]) : cols[cols.length - 1].push(l)));
        return '<div class="columns">' + cols.map((c) => '<div class="col">' + parseBlocks(c, ctx) + "</div>").join("") + "</div>";
      }
      case "figure": {
        return '<figure class="fig">' + parseBlocks(buf, ctx) + (title ? "<figcaption>" + inline(title, ctx) + "</figcaption>" : "") + "</figure>";
      }
      case "spec": {
        return '<div class="spec-box"><div class="spec-box-title">AQA spec says</div>' + parseBlocks(buf, ctx) + "</div>";
      }
      default: {
        const c = CALLOUTS[type] || { icon: "•", label: type };
        return '<aside class="callout callout-' + esc(type) + '"><div class="callout-head"><span class="callout-icon" aria-hidden="true">' + c.icon + '</span><span class="callout-label">' + (title ? inline(title, ctx) : esc(c.label)) + '</span></div><div class="callout-body">' + parseBlocks(buf, ctx) + "</div></aside>";
      }
    }
  }

  function renderShortcode(kind, id, params) {
    const p = {};
    (params || "").trim().split(/\s+/).forEach((kv) => {
      if (!kv) return;
      const eq = kv.indexOf("=");
      if (eq === -1) p[kv] = true;
      else p[kv.slice(0, eq)] = kv.slice(eq + 1);
    });
    const data = esc(JSON.stringify(p));
    if (kind === "tool") return '<div class="tool-embed" data-tool="' + esc(id) + "\" data-params='" + data + "'></div>";
    if (kind === "trace") return '<div class="trace-embed" data-trace="' + esc(id) + '"></div>';
    if (kind === "quiz") return '<div class="quiz-embed" data-quiz="' + esc(id) + '"></div>';
    if (kind === "exam") return '<div class="exam-embed" data-exam="' + esc(id) + '"></div>';
    if (kind === "flashcards") return '<div class="flash-embed" data-flash="' + esc(id) + '"></div>';
    if (kind === "image") return '<figure class="fig"><img src="' + esc(id) + '" alt="' + esc(p.alt || "") + '">' + (p.caption ? "<figcaption>" + esc(p.caption) + "</figcaption>" : "") + "</figure>";
    return "";
  }

  CS.markdown = { render: parse, inline: inline };
})();
