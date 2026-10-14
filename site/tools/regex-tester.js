/* Regex tester: own parser + Thompson NFA for the AQA subset, plain-English breakdown, highlight matches, reverse-mode quiz. */
(function () {
  /* ---------- parser: regex text -> AST (each node keeps its source slice) ---------- */
  function parse(src) {
    let i = 0;
    const fail = (msg) => {
      throw new Error(msg + " (at position " + (i + 1) + ")");
    };
    function alt() {
      const s = i, opts = [concat()];
      while (src[i] === "|") {
        i++;
        opts.push(concat());
      }
      return opts.length === 1 ? opts[0] : { t: "alt", opts, src: src.slice(s, i) };
    }
    function concat() {
      const s = i, items = [];
      while (i < src.length && src[i] !== "|" && src[i] !== ")") items.push(repeat());
      if (!items.length) return { t: "empty", src: "" };
      return items.length === 1 ? items[0] : { t: "cat", items, src: src.slice(s, i) };
    }
    function repeat() {
      const s = i;
      let node = atom();
      for (;;) {
        const c = src[i];
        if (c === "*" || c === "+" || c === "?") {
          if (node.t === "bol" || node.t === "eol") fail("An anchor cannot be repeated");
          i++;
          node = { t: c === "*" ? "star" : c === "+" ? "plus" : "opt", x: node, src: src.slice(s, i) };
        } else if (c === "{") {
          const m = /^\{(\d+)(,(\d*))?\}/.exec(src.slice(i));
          if (!m) fail("Badly formed {n,m} repetition");
          i += m[0].length;
          const lo = +m[1], hi = m[2] ? (m[3] === "" ? Infinity : +m[3]) : lo;
          if (hi < lo || lo > 20 || (hi !== Infinity && hi > 20)) fail("Repetition counts must satisfy n ≤ m ≤ 20");
          node = { t: "rep", x: node, lo, hi, src: src.slice(s, i) };
        } else break;
      }
      return node;
    }
    function atom() {
      const s = i, c = src[i];
      if (c === "(") {
        i++;
        const inner = alt();
        if (src[i] !== ")") fail("Missing closing bracket )");
        i++;
        return { t: "group", x: inner, src: src.slice(s, i) };
      }
      if (c === "[") return cls();
      if (c === "*" || c === "+" || c === "?" || c === "{") fail("“" + c + "” has nothing before it to repeat");
      if (c === "]" || c === "}") fail("Unexpected “" + c + "”");
      i++;
      if (c === "^") return { t: "bol", src: "^" };
      if (c === "$") return { t: "eol", src: "$" };
      if (c === ".") return { t: "chr", test: () => true, desc: "any single character", src: "." };
      if (c === "\\") {
        const e = src[i++];
        if (e === undefined) fail("A \\ must be followed by a character");
        if (e === "d") return { t: "chr", test: (ch) => /[0-9]/.test(ch), desc: "any digit 0–9", src: "\\d" };
        if (e === "w") return { t: "chr", test: (ch) => /\w/.test(ch), desc: "any letter, digit or _", src: "\\w" };
        if (e === "s") return { t: "chr", test: (ch) => /\s/.test(ch), desc: "a space", src: "\\s" };
        return { t: "chr", test: (ch) => ch === e, desc: "the character “" + e + "” (escaped)", src: "\\" + e };
      }
      return { t: "chr", test: (ch) => ch === c, desc: "the character “" + c + "”", lit: c, src: c };
    }
    function cls() {
      const s = i;
      i++;
      let neg = false;
      if (src[i] === "^") {
        neg = true;
        i++;
      }
      const parts = [];
      while (i < src.length && src[i] !== "]") {
        let a = src[i++];
        if (a === "\\") a = src[i++];
        if (src[i] === "-" && src[i + 1] !== undefined && src[i + 1] !== "]") {
          i++;
          let b = src[i++];
          if (b === "\\") b = src[i++];
          if (b < a) fail("Range " + a + "-" + b + " is backwards");
          parts.push([a, b]);
        } else parts.push([a, a]);
      }
      if (src[i] !== "]") fail("Missing closing ]");
      i++;
      if (!parts.length) fail("Empty character class []");
      const txt = parts.map((p) => (p[0] === p[1] ? p[0] : p[0] + " to " + p[1])).join(", ");
      return { t: "chr", test: (ch) => parts.some((p) => ch >= p[0] && ch <= p[1]) !== neg, desc: (neg ? "any ONE character except " : "any ONE of: ") + txt, src: src.slice(s, i) };
    }
    const tree = alt();
    if (i < src.length) fail("Unmatched closing bracket )");
    return tree;
  }

  /* ---------- Thompson NFA ---------- */
  function compile(ast) {
    const st = [];
    const ns = (o) => (st.push(Object.assign({ eps: [] }, o)), st.length - 1);
    function build(n) {
      // returns {s, e}: start and end state; end has no outgoing edges yet
      switch (n.t) {
        case "empty": { const a = ns({}); return { s: a, e: a }; }
        case "chr": { const e = ns({}); const s = ns({ test: n.test, to: e }); return { s, e }; }
        case "bol": case "eol": { const e = ns({}); const s = ns({ assert: n.t, to: e }); return { s, e }; }
        case "group": return build(n.x);
        case "cat": {
          let f = build(n.items[0]);
          for (let k = 1; k < n.items.length; k++) {
            const g = build(n.items[k]);
            st[f.e].eps.push(g.s);
            f = { s: f.s, e: g.e };
          }
          return f;
        }
        case "alt": {
          const s = ns({}), e = ns({});
          n.opts.forEach((o) => {
            const f = build(o);
            st[s].eps.push(f.s);
            st[f.e].eps.push(e);
          });
          return { s, e };
        }
        case "star": case "plus": case "opt": {
          const f = build(n.x), s = ns({}), e = ns({});
          st[s].eps.push(f.s);
          if (n.t !== "plus") st[s].eps.push(e);
          st[f.e].eps.push(e);
          if (n.t !== "opt") st[f.e].eps.push(f.s);
          return { s, e };
        }
        case "rep": {
          const seq = [];
          for (let k = 0; k < n.lo; k++) seq.push(n.x);
          if (n.hi === Infinity) seq.push({ t: "star", x: n.x });
          else for (let k = n.lo; k < n.hi; k++) seq.push({ t: "opt", x: n.x });
          return build(seq.length ? { t: "cat", items: seq } : { t: "empty" });
        }
      }
      throw new Error("unknown node");
    }
    const f = build(ast);
    return { st, start: f.s, accept: f.e };
  }
  function closure(nfa, set, pos, len) {
    const out = new Set(), stack = [...set];
    while (stack.length) {
      const q = stack.pop();
      if (out.has(q)) continue;
      out.add(q);
      const s = nfa.st[q];
      s.eps.forEach((p) => stack.push(p));
      if (s.assert === "bol" && pos === 0) stack.push(s.to);
      if (s.assert === "eol" && pos === len) stack.push(s.to);
    }
    return out;
  }
  /** returns array of end positions e such that str[from..e) is matched */
  function matchEnds(nfa, str, from) {
    const ends = [];
    let cur = closure(nfa, [nfa.start], from, str.length);
    for (let p = from; ; p++) {
      if (cur.has(nfa.accept)) ends.push(p);
      if (p >= str.length || !cur.size) break;
      const nxt = [];
      cur.forEach((q) => {
        const s = nfa.st[q];
        if (s.test && s.test(str[p])) nxt.push(s.to);
      });
      cur = closure(nfa, nxt, p + 1, str.length);
    }
    return ends;
  }
  function fullMatch(nfa, str) {
    const e = matchEnds(nfa, str, 0);
    return e.includes(str.length);
  }
  /** leftmost-longest, non-empty preferred */
  function firstMatch(nfa, str) {
    let emptyAt = -1;
    for (let s = 0; s <= str.length; s++) {
      const e = matchEnds(nfa, str, s);
      if (!e.length) continue;
      const mx = Math.max(...e);
      if (mx > s) return { s, e: mx };
      if (emptyAt < 0) emptyAt = s;
    }
    return emptyAt >= 0 ? { s: emptyAt, e: emptyAt } : null;
  }

  /* ---------- plain-English breakdown ---------- */
  function describe(n, depth, lines) {
    const pad = "  ".repeat(depth);
    const say = (txt) => lines.push(pad + n.src + "   :  " + txt);
    const what = (x) => (x.t === "chr" ? x.desc : x.t === "group" ? "the group " + x.src : "“" + x.src + "”");
    switch (n.t) {
      case "empty": lines.push(pad + "(nothing)   :  the empty string ε"); break;
      case "chr": say(n.desc); break;
      case "bol": say("anchor — match must start at the beginning of the string"); break;
      case "eol": say("anchor — match must finish at the end of the string"); break;
      case "group": say("brackets group this part so an operator can apply to all of it"); describe(n.x, depth + 1, lines); break;
      case "cat": if (depth === 0) lines.push("The pattern is these parts one after another:"); n.items.forEach((x) => describe(x, depth === 0 ? 1 : depth, lines)); break;
      case "alt": say("EITHER " + n.opts.map((o) => "“" + (o.src || "ε") + "”").join(" OR ")); n.opts.forEach((o) => describe(o, depth + 1, lines)); break;
      case "star": say("zero or more of " + what(n.x)); if (n.x.t !== "chr") describe(n.x, depth + 1, lines); break;
      case "plus": say("one or more of " + what(n.x)); if (n.x.t !== "chr") describe(n.x, depth + 1, lines); break;
      case "opt": say("zero or one of " + what(n.x) + " (optional)"); if (n.x.t !== "chr") describe(n.x, depth + 1, lines); break;
      case "rep": say("between " + n.lo + " and " + (n.hi === Infinity ? "any number" : n.hi) + " of " + what(n.x) + "  (not on the AQA spec)"); if (n.x.t !== "chr") describe(n.x, depth + 1, lines); break;
    }
    return lines;
  }

  const PRESETS = {
    even0: { label: "Binary strings with an even number of 0s", re: "1*(01*01*)*", tests: "\n1\n0\n00\n1010\n100\n0110\n000\n2" },
    postcode: { label: "UK postcode-ish", re: "[A-Z][A-Z]?[0-9][0-9]? [0-9][A-Z][A-Z]", tests: "SW1 1AA\nB33 8TH\nCR2 6XH\nM1 1AE\nsw1 1aa\nSW1A 1AA\nW 1AA\nDN55 1PT" },
    ident: { label: "Identifier (letter then letters/digits/_)", re: "[a-zA-Z][a-zA-Z0-9_]*", tests: "total\nx1\n_temp\n9lives\nmy_var\nmy var\nA" },
    abc: { label: "a(b|c)*d", re: "a(b|c)*d", tests: "ad\nabd\nabcbcd\nabdd\nacb\nxabdx" },
  };
  const ROUNDS = [
    { re: "a(b|c)*", opts: ["a", "abcb", "ac", "b", "abd", "accc"] },
    { re: "0*1+", opts: ["1", "0011", "000", "0111", "10", "011"] },
    { re: "(ab)+", opts: ["ab", "abab", "aba", "", "ba", "ababab"] },
    { re: "[a-c]+d?", opts: ["abc", "abcd", "d", "cad", "add", "bb"] },
    { re: "1(0|1)*0", opts: ["10", "110", "1", "0", "1010", "1011"] },
    { re: "(a|b)*abb", opts: ["abb", "aabb", "babb", "ab", "abba", "bbabb"] },
  ];

  CS.registerTool({
    id: "regex-tester",
    title: "Regular expression tester",
    section: "4",
    topic: "4.4",
    icon: "🔎",
    desc: "Test strings against a regular expression, see which match, and read the expression in plain English.",
    help: "Type a regular expression and some test strings (one per line — an empty line tests the empty string ε). Each string is marked **✓ full match** if the *whole* string is in the language the expression describes (this is what AQA means by “matches”), or **contains** if only part of it matches (the matched part is highlighted).\n\nSupported: literals, `*` (zero or more), `+` (one or more), `?` (zero or one), `|` (or), `( )` grouping, character classes `[abc]` and `[a-z]`, anchors `^` and `$`. Extras not needed for AQA: `.`, `\\d`, `[^…]`, `{n,m}`.\n\n**Reverse mode** shows you an expression and asks which strings are in its language — six rounds to practise the exam skill.",
    mount(el, params) {
      const h = CS.util.el;
      const esc = CS.util.esc;
      const modeBar = h("div", { class: "controls" });
      const tBtn = h("button", { class: "btn sm primary", type: "button", text: "Tester" });
      const rBtn = h("button", { class: "btn sm", type: "button", text: "Reverse mode (quiz)" });
      modeBar.append(tBtn, rBtn);
      const tester = h("div");
      const reverse = h("div", { style: "display:none" });
      el.append(modeBar, tester, reverse);
      tBtn.addEventListener("click", () => setMode(false));
      rBtn.addEventListener("click", () => setMode(true));
      function setMode(rev) {
        tester.style.display = rev ? "none" : "";
        reverse.style.display = rev ? "" : "none";
        tBtn.className = "btn sm" + (rev ? "" : " primary");
        rBtn.className = "btn sm" + (rev ? " primary" : "");
      }

      /* ----- tester ----- */
      const presetSel = h("select", { "aria-label": "Preset" });
      presetSel.appendChild(h("option", { value: "", text: "— choose a preset —" }));
      Object.keys(PRESETS).forEach((k) => presetSel.appendChild(h("option", { value: k, text: PRESETS[k].label })));
      const reIn = h("input", { type: "text", "aria-label": "Regular expression", style: "flex:1;min-width:200px;font-family:var(--font-mono)" });
      const testIn = h("textarea", { "aria-label": "Test strings, one per line", style: "font-family:var(--font-mono);min-height:150px" });
      const err = h("div", { class: "err", style: "display:none;margin:6px 0" });
      const results = h("div", { class: "table-wrap" });
      const breakdown = h("div", { class: "output", style: "margin-top:4px" });
      tester.append(
        h("div", { class: "controls" }, [h("label", { text: "Preset " }, presetSel)]),
        h("div", { class: "controls" }, [h("label", { text: "Regex", style: "font-weight:600" }), reIn]),
        err,
        h("div", { class: "two-col" }, [h("div", { style: "min-width:0" }, [h("div", { class: "small muted", text: "Test strings (one per line)" }), testIn]), h("div", { style: "min-width:0" }, [h("div", { class: "small muted", text: "Results" }), results])]),
        h("div", { class: "small muted", style: "margin-top:10px", text: "Plain-English breakdown" }),
        breakdown
      );
      function showStr(s) {
        return s === "" ? '<span class="muted">ε (empty)</span>' : esc(s).replace(/ /g, "␣");
      }
      function update() {
        let nfa, ast;
        try {
          ast = parse(reIn.value);
          nfa = compile(ast);
          err.style.display = "none";
        } catch (e) {
          err.textContent = "Invalid expression: " + e.message;
          err.style.display = "";
          results.innerHTML = "";
          breakdown.textContent = "";
          return;
        }
        breakdown.textContent = (reIn.value === "" ? "(empty pattern: matches only ε)" : describe(ast, 0, []).join("\n")) + "\n\nA string is in the language only if the WHOLE string can be generated by this pattern.";
        const lines = testIn.value.split("\n");
        if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
        const tb = h("table", {});
        tb.appendChild(h("tr", {}, [h("th", { text: "String" }), h("th", { text: "Result" })]));
        lines.slice(0, 60).forEach((s) => {
          const full = fullMatch(nfa, s);
          const m = full ? { s: 0, e: s.length } : firstMatch(nfa, s);
          let shown = showStr(s);
          if (!full && m && m.e > m.s) shown = esc(s.slice(0, m.s)).replace(/ /g, "␣") + '<mark style="background:var(--warn-soft);color:var(--warn);font-weight:700">' + esc(s.slice(m.s, m.e)).replace(/ /g, "␣") + "</mark>" + esc(s.slice(m.e)).replace(/ /g, "␣");
          if (full && s !== "") shown = '<mark style="background:var(--ok-soft);color:var(--ok);font-weight:700">' + shown + "</mark>";
          const verdict = full ? '<span class="ok-text">✓ full match</span>' : m && m.e > m.s ? '<span style="color:var(--warn);font-weight:600">contains a match (not full)</span>' : '<span style="color:var(--bad);font-weight:600">✗ no match</span>';
          const tr = h("tr", {});
          tr.innerHTML = '<td style="font-family:var(--font-mono)">' + shown + "</td><td>" + verdict + "</td>";
          tr.setAttribute("data-full", full ? "1" : "0");
          tr.setAttribute("data-contains", m && m.e > m.s ? "1" : "0");
          tb.appendChild(tr);
        });
        results.innerHTML = "";
        results.appendChild(tb);
      }
      presetSel.addEventListener("change", () => {
        const p = PRESETS[presetSel.value];
        if (!p) return;
        reIn.value = p.re;
        testIn.value = p.tests;
        update();
      });
      reIn.addEventListener("input", update);
      testIn.addEventListener("input", update);
      reIn.value = params.regex || PRESETS.even0.re;
      testIn.value = PRESETS.even0.tests;
      presetSel.value = params.regex ? "" : "even0";
      update();

      /* ----- reverse mode ----- */
      let round = 0, score = 0, answered = false;
      const rHead = h("div", { class: "stat-line" });
      const rRe = h("div", { style: "font-family:var(--font-mono);font-size:1.4rem;font-weight:700;margin:6px 0 10px" });
      const rOpts = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px" });
      const rCheck = h("button", { class: "btn sm primary", type: "button", text: "Check" });
      const rNext = h("button", { class: "btn sm", type: "button", text: "Next round →" });
      const rFb = h("div", { class: "explain" });
      reverse.append(h("div", { class: "explain", style: "margin-top:0", text: "Tick every string that is in the language of this regular expression (the whole string must match)." }), rHead, rRe, rOpts, h("div", { class: "controls", style: "margin-top:10px" }, [rCheck, rNext]), rFb);
      let boxes = [];
      function showRound() {
        answered = false;
        const r = ROUNDS[round];
        rHead.textContent = "Round " + (round + 1) + " of " + ROUNDS.length + "   score: " + score;
        rRe.textContent = r.re;
        rOpts.innerHTML = "";
        rFb.textContent = "";
        boxes = r.opts.map((o) => {
          const cb = h("input", { type: "checkbox" });
          const lab = h("label", { class: "cell", style: "justify-content:flex-start;display:flex;gap:6px;cursor:pointer;height:auto;padding:6px 8px" }, [cb, h("span", { html: showStr(o) })]);
          rOpts.appendChild(lab);
          return { cb, lab, s: o };
        });
        rNext.textContent = round === ROUNDS.length - 1 ? "Restart" : "Next round →";
      }
      rCheck.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const nfa = compile(parse(ROUNDS[round].re));
        let allRight = true;
        boxes.forEach((b) => {
          const ok = fullMatch(nfa, b.s);
          const right = ok === b.cb.checked;
          if (!right) allRight = false;
          b.lab.className = "cell " + (right ? "ok" : "bad");
          b.lab.title = ok ? "in the language" : "not in the language";
          b.lab.appendChild(h("span", { class: "small", text: ok ? " ✓ in" : " ✗ out" }));
        });
        if (allRight) score++;
        rHead.textContent = "Round " + (round + 1) + " of " + ROUNDS.length + "   score: " + score;
        rFb.innerHTML = (allRight ? '<span class="ok-text">All correct.</span> ' : '<span style="color:var(--bad);font-weight:600">Not quite — red boxes were wrong.</span> ') + "Breakdown:<br><code>" + describe(parse(ROUNDS[round].re), 0, []).map(esc).join("<br>").replace(/ {2}/g, "&nbsp;&nbsp;") + "</code>";
      });
      rNext.addEventListener("click", () => {
        if (round === ROUNDS.length - 1) {
          round = 0;
          score = 0;
        } else round++;
        showRound();
      });
      showRound();
    },
  });
})();
