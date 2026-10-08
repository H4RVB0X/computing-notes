/* BNF checker: parse production rules, test strings with a memoised derivation search, show leftmost derivation + parse tree, or the point of failure. */
(function () {
  const DIGITS = "<digit> ::= 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9";
  const LETTERS = "<letter> ::= " + "abcdefghijklmnopqrstuvwxyz".split("").join(" | ");
  const PRESETS = {
    integer: { label: "Unsigned integers", g: "<integer> ::= <digit> | <digit><integer>\n" + DIGITS, tests: "123\n12a\n0\n007\n\n-5" },
    signed: { label: "Signed integers", g: "<signed_integer> ::= <sign><integer> | <integer>\n<sign> ::= + | -\n<integer> ::= <digit> | <digit><integer>\n" + DIGITS, tests: "-42\n+7\n42\n+-3\n4-2\n-" },
    ident: { label: "Identifiers (left-recursive rule)", g: "<identifier> ::= <letter> | <identifier><letter> | <identifier><digit>\n" + LETTERS + "\n" + DIGITS, tests: "x\ncount2\ntotal\n2fast\nmy_var\na1b2" },
    expr: { label: "Expressions with brackets (beyond regex)", g: "<expr> ::= <term> | <term> + <expr> | <term> - <expr>\n<term> ::= <factor> | <factor> * <term>\n<factor> ::= <digit> | ( <expr> )\n" + DIGITS, tests: "1+2*3\n(1+2)*3\n((4))\n(1+2\n1+*2\n()" },
  };
  const MAXLEN = 60;

  function parseGrammar(text) {
    const rules = {}, order = [], errors = [], warnings = [];
    let last = null;
    text.split("\n").forEach((raw, ln) => {
      const line = raw.trim();
      if (!line || line.startsWith("#") || line.startsWith("//")) return;
      let lhs, rhs;
      const m = /^<([^<>]+)>\s*::=\s*(.*)$/.exec(line);
      if (m) {
        lhs = m[1].trim();
        rhs = m[2];
      } else if (line.startsWith("|") && last) {
        lhs = last; // continuation of the previous rule
        rhs = line.slice(1);
      } else {
        errors.push("Line " + (ln + 1) + ": expected  <name> ::= …  (got “" + line + "”)");
        return;
      }
      last = lhs;
      if (!rules[lhs]) {
        rules[lhs] = [];
        order.push(lhs);
      }
      const alts = [[]];
      const toks = rhs.match(/\s+|<[^<>|"']+>|"[^"]*"|'[^']*'|\||[^\s<|"']+|./g) || [];
      toks.forEach((tk) => {
        if (/^\s+$/.test(tk)) return;
        if (tk === "|") return alts.push([]);
        if (/^<[^<>|"']+>$/.test(tk)) return alts[alts.length - 1].push({ nt: tk.slice(1, -1).trim() });
        if (/^(".*"|'.*')$/.test(tk) && tk.length >= 2) {
          if (tk.length > 2) alts[alts.length - 1].push({ t: tk.slice(1, -1) });
          return;
        }
        if (tk === "ε") return;
        if (tk === "..." || tk === "…") errors.push("Line " + (ln + 1) + ": write every alternative out in full — “…” is not BNF.");
        alts[alts.length - 1].push({ t: tk });
      });
      alts.forEach((a) => rules[lhs].push(a));
    });
    order.forEach((A) =>
      rules[A].forEach((alt) =>
        alt.forEach((s) => {
          if (s.nt && !rules[s.nt]) {
            const msg = "<" + s.nt + "> is used in <" + A + "> but never defined.";
            if (!errors.includes(msg)) errors.push(msg);
          }
        })
      )
    );
    return { rules, order, errors, warnings };
  }

  function analyse(G) {
    const { rules, order } = G;
    // nullable
    const nullable = new Set();
    let ch = true;
    while (ch) {
      ch = false;
      order.forEach((A) => {
        if (!nullable.has(A) && rules[A].some((alt) => alt.every((s) => (s.nt ? nullable.has(s.nt) : s.t === "")))) {
          nullable.add(A);
          ch = true;
        }
      });
    }
    // productive
    const prod = new Set();
    ch = true;
    while (ch) {
      ch = false;
      order.forEach((A) => {
        if (!prod.has(A) && rules[A].some((alt) => alt.every((s) => !s.nt || prod.has(s.nt)))) {
          prod.add(A);
          ch = true;
        }
      });
    }
    // left-corner graph
    const edges = {};
    order.forEach((A) => {
      edges[A] = new Set();
      rules[A].forEach((alt) => {
        for (const s of alt) {
          if (!s.nt) break;
          edges[A].add(s.nt);
          if (!nullable.has(s.nt)) break;
        }
      });
    });
    const leftRec = order.filter((A) => {
      const seen = new Set(), st = [...edges[A]];
      while (st.length) {
        const x = st.pop();
        if (x === A) return true;
        if (seen.has(x) || !edges[x]) continue;
        seen.add(x);
        edges[x].forEach((y) => st.push(y));
      }
      return false;
    });
    return { nullable, prod, leftRec };
  }

  /** Memoised (tabled) recogniser: M["A@p"] = Map(end -> {alt, kids}). Works for left recursion too. */
  function recognise(G, input) {
    const { rules, order } = G, n = input.length, M = {};
    order.forEach((A) => {
      for (let p = 0; p <= n; p++) M[A + "@" + p] = new Map();
    });
    function seqEnds(alt, p) {
      let fr = new Map([[p, []]]);
      for (const s of alt) {
        const nx = new Map();
        fr.forEach((kids, q) => {
          if (!s.nt) {
            if (input.startsWith(s.t, q) && !nx.has(q + s.t.length)) nx.set(q + s.t.length, kids.concat([{ t: s.t }]));
          } else
            M[s.nt + "@" + q].forEach((_, e) => {
              if (!nx.has(e)) nx.set(e, kids.concat([{ nt: s.nt, p: q, e }]));
            });
        });
        fr = nx;
        if (!fr.size) break;
      }
      return fr;
    }
    let changed = true, guard = 0;
    while (changed && guard++ < 5000) {
      changed = false;
      for (let p = n; p >= 0; p--)
        order.forEach((A) => {
          const cell = M[A + "@" + p];
          rules[A].forEach((alt, ai) => {
            seqEnds(alt, p).forEach((kids, e) => {
              if (!cell.has(e)) {
                cell.set(e, { alt: ai, kids });
                changed = true;
              }
            });
          });
        });
    }
    // viable-prefix table: P["A@p"] = furthest e such that input[p..e) can begin a string derived from A
    const P = {};
    order.forEach((A) => {
      for (let p = 0; p <= n; p++) P[A + "@" + p] = p;
    });
    changed = true;
    guard = 0;
    while (changed && guard++ < 5000) {
      changed = false;
      for (let p = n; p >= 0; p--)
        order.forEach((A) => {
          let best = P[A + "@" + p];
          rules[A].forEach((alt) => {
            let fr = new Set([p]);
            for (const s of alt) {
              const nx = new Set();
              fr.forEach((q) => {
                if (!s.nt) {
                  let k = 0;
                  while (k < s.t.length && q + k < n && input[q + k] === s.t[k]) k++;
                  best = Math.max(best, q + k);
                  if (k === s.t.length) nx.add(q + k);
                } else {
                  best = Math.max(best, P[s.nt + "@" + q]);
                  M[s.nt + "@" + q].forEach((_, e) => nx.add(e));
                }
              });
              fr = nx;
              if (!fr.size) break;
            }
          });
          if (best > P[A + "@" + p]) {
            P[A + "@" + p] = best;
            changed = true;
          }
        });
    }
    return { M, P };
  }

  function buildTree(M, A, p, e) {
    const c = M[A + "@" + p].get(e);
    return { nt: A, kids: c.kids.map((k) => (k.nt ? buildTree(M, k.nt, k.p, k.e) : { t: k.t })) };
  }
  function derivation(tree) {
    let form = [tree];
    const show = (f) => f.map((x) => (x.nt ? "<" + x.nt + ">" : x.t)).join("") || "ε";
    const steps = [show(form)];
    for (let guard = 0; guard < 400; guard++) {
      const i = form.findIndex((x) => x.nt);
      if (i < 0) break;
      form = form.slice(0, i).concat(form[i].kids.length ? form[i].kids : [], form.slice(i + 1));
      steps.push(show(form));
    }
    return steps;
  }

  CS.registerTool({
    id: "bnf-checker",
    title: "BNF syntax checker",
    section: "4",
    topic: "4.5",
    icon: "🧾",
    desc: "Type BNF production rules, test strings against them, and see the derivation and parse tree — or exactly where a string fails.",
    help: "Write one rule per line: `<name> ::= alternative | alternative`. Inside an alternative, `<name>` is a **non-terminal** and anything else is a **terminal** (spaces just separate symbols; put a terminal space or `|` in quotes, e.g. `\" \"`). A line starting with `|` continues the previous rule; `ε` means the empty string.\n\nPick the **start symbol**, type test strings (one per line) and press **Check**. A valid string shows its **leftmost derivation** (replace the leftmost non-terminal each step) and its **parse tree**. An invalid string shows the longest valid beginning and the character where it breaks.\n\n**Left recursion** (e.g. `<integer> ::= <integer><digit>`) is legal BNF, but a simple recursive-descent parser would call `<integer>` forever without reading anything. This checker uses a memoised (tabled) search so it still gets the right answer, and warns you so you know to rewrite it as right recursion when coding a parser by hand.\n\nTry the bracket expression preset: matching nested brackets need recursion, which BNF has and regular expressions do not.",
    mount(el, params) {
      const h = CS.util.el;
      const esc = CS.util.esc;
      const svgNS = "http://www.w3.org/2000/svg";
      const presetSel = h("select", { "aria-label": "Preset grammar" });
      Object.keys(PRESETS).forEach((k) => presetSel.appendChild(h("option", { value: k, text: PRESETS[k].label })));
      const gIn = h("textarea", { "aria-label": "BNF production rules", style: "font-family:var(--font-mono);min-height:140px", spellcheck: "false" });
      const startSel = h("select", { "aria-label": "Start symbol" });
      const tIn = h("textarea", { "aria-label": "Test strings, one per line", style: "font-family:var(--font-mono);min-height:120px", spellcheck: "false" });
      const ignoreSp = h("input", { type: "checkbox", "aria-label": "Ignore spaces in test strings" });
      const checkBtn = h("button", { class: "btn sm primary", type: "button", text: "Check" });
      const msgs = h("div", { style: "margin:8px 0" });
      const results = h("div", { class: "table-wrap" });
      const detail = h("div");
      el.append(
        h("div", { class: "controls" }, [h("label", { text: "Preset " }, presetSel)]),
        h("div", { class: "small muted", text: "Production rules" }),
        gIn,
        msgs,
        h("div", { class: "controls", style: "margin-top:8px" }, [h("label", { text: "Start symbol " }, startSel), h("label", {}, [ignoreSp, document.createTextNode("ignore spaces in test strings")]), checkBtn]),
        h("div", { class: "two-col" }, [h("div", {}, [h("div", { class: "small muted", text: "Test strings (one per line; an empty line tests ε)" }), tIn]), h("div", {}, [h("div", { class: "small muted", text: "Results" }), results])]),
        detail
      );
      let G = null, A = null;

      function refreshGrammar() {
        G = parseGrammar(gIn.value);
        const prev = startSel.value;
        startSel.innerHTML = "";
        G.order.forEach((n) => startSel.appendChild(h("option", { value: n, text: "<" + n + ">" })));
        if (G.order.includes(prev)) startSel.value = prev;
        msgs.innerHTML = "";
        if (G.errors.length) {
          msgs.appendChild(h("div", { class: "err", html: G.errors.map((e) => "• " + esc(e)).join("<br>") }));
          return false;
        }
        if (!G.order.length) {
          msgs.appendChild(h("div", { class: "err", text: "Enter at least one rule." }));
          return false;
        }
        A = analyse(G);
        const notes = [];
        if (A.leftRec.length)
          notes.push("⚠️ Left recursion in " + A.leftRec.map((x) => "<" + x + ">").join(", ") + ": a rule can start by calling itself without consuming input (e.g. " + G.rules[A.leftRec[0]].filter((alt) => alt.length && alt[0].nt).map((alt) => "<" + A.leftRec[0] + "> ::= " + alt.map((s) => (s.nt ? "<" + s.nt + ">" : s.t)).join("")).slice(0, 1).join("") + "). A naive recursive-descent parser would loop forever here. The language is still well defined, and this checker’s tabled search handles it — but to code a parser by hand, rewrite it as right recursion.");
        const unprod = G.order.filter((x) => !A.prod.has(x));
        if (unprod.length) notes.push("⚠️ " + unprod.map((x) => "<" + x + ">").join(", ") + " can never finish (every alternative mentions itself with no way out), so it generates no strings.");
        notes.forEach((t) => msgs.appendChild(h("div", { class: "explain", style: "color:var(--warn);margin-top:4px", text: t })));
        return true;
      }

      function test(str) {
        const s = ignoreSp.checked ? str.replace(/\s+/g, "") : str;
        if (s.length > MAXLEN) return { s, ok: false, tooLong: true };
        const start = startSel.value;
        const { M, P } = recognise(G, s);
        const ok = M[start + "@0"].has(s.length);
        return { s, ok, M, P, start, furthest: P[start + "@0"] };
      }

      function expected(s, k, start) {
        const alpha = new Set();
        G.order.forEach((x) => G.rules[x].forEach((alt) => alt.forEach((sy) => sy.t && sy.t.split("").forEach((c) => alpha.add(c)))));
        const pre = s.slice(0, k), out = [];
        alpha.forEach((c) => {
          if (recognise(G, pre + c).P[start + "@0"] >= k + 1) out.push(c);
        });
        return out.sort();
      }

      function drawTree(tree) {
        let leaves = 0;
        const nodes = [];
        (function lay(t, d) {
          const node = { label: t.nt ? "<" + t.nt + ">" : t.t, nt: !!t.nt, d, kids: [] };
          nodes.push(node);
          if (t.nt && t.kids.length) {
            node.kids = t.kids.map((k) => lay(k, d + 1));
            node.x = (node.kids[0].x + node.kids[node.kids.length - 1].x) / 2;
          } else if (t.nt) {
            const e = { label: "ε", nt: false, d: d + 1, kids: [], x: leaves++ };
            nodes.push(e);
            node.kids = [e];
            node.x = e.x;
          } else node.x = leaves++;
          return node;
        })(tree, 0);
        const maxD = Math.max(...nodes.map((n) => n.d));
        const maxLab = Math.max(...nodes.map((n) => n.label.length));
        const dx = Math.max(30, Math.min(80, maxLab * 7 + 6)), dy = 48, W = Math.max(1, leaves) * dx + 20, H = (maxD + 1) * dy + 10;
        const sv = (tag, a) => {
          const e = document.createElementNS(svgNS, tag);
          for (const k in a) e.setAttribute(k, a[k]);
          return e;
        };
        const svg = sv("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Parse tree", style: "width:" + Math.min(W, 1400) + "px;max-width:none;color:var(--text);display:block" });
        const X = (n) => 10 + n.x * dx + dx / 2, Y = (n) => 18 + n.d * dy;
        nodes.forEach((n) => n.kids.forEach((k) => svg.appendChild(sv("line", { x1: X(n), y1: Y(n) + 8, x2: X(k), y2: Y(k) - 10, stroke: "currentColor", "stroke-opacity": "0.5" }))));
        nodes.forEach((n) => {
          const t = sv("text", { x: X(n), y: Y(n), "text-anchor": "middle", "dominant-baseline": "middle", "font-size": "12", "font-family": "var(--font-mono)", "font-weight": n.nt ? "400" : "700", fill: n.nt ? "var(--accent)" : "currentColor" });
          t.textContent = n.label;
          svg.appendChild(t);
        });
        return h("div", { style: "overflow-x:auto;border:1px solid var(--border);border-radius:10px;padding:6px;background:var(--bg-2)" }, svg);
      }

      function showDetail(r) {
        detail.innerHTML = "";
        const shown = r.s === "" ? "ε (empty string)" : "“" + r.s + "”";
        if (r.tooLong) {
          detail.appendChild(h("div", { class: "err", text: "Strings longer than " + MAXLEN + " characters are not checked." }));
          return;
        }
        if (r.ok) {
          const tree = buildTree(r.M, r.start, 0, r.s.length);
          const steps = derivation(tree);
          detail.append(
            h("h4", { style: "margin:14px 0 4px", html: '<span class="ok-text">✓ ' + esc(shown) + " is a valid &lt;" + esc(r.start) + "&gt;</span>" }),
            h("div", { class: "small muted", text: "Leftmost derivation (" + (steps.length - 1) + " steps — each line replaces the leftmost non-terminal using one rule):" }),
            h("div", { class: "output", style: "max-height:260px;overflow-y:auto", text: steps.map((x, i) => (i ? "⇒ " : "   ") + x).join("\n") }),
            h("div", { class: "small muted", style: "margin-top:8px", text: "Parse tree (non-terminals in blue, terminals in bold):" }),
            drawTree(tree)
          );
        } else {
          const k = r.furthest, n = r.s.length;
          let why;
          if (k >= n) why = n === 0 ? "The empty string cannot be derived from <" + r.start + "> — no rule produces ε." : "Every character is fine so far — “" + r.s + "” is a valid beginning of a <" + r.start + ">, but the string ends too early: more symbols are needed.";
          else {
            const exp = expected(r.s, k, r.start);
            why = (k === 0 ? "No <" + r.start + "> can start with “" + r.s[0] + "”." : "“" + r.s.slice(0, k) + "” can begin a <" + r.start + ">, but no rule allows “" + r.s[k] + "” at position " + (k + 1) + ".") + (exp.length ? " Allowed there: " + exp.map((c) => "“" + c + "”").join(" ") + (k > 0 && r.M && r.M[r.start + "@0"].has(k) ? " — or the string could stop just before it." : ".") : "");
          }
          const marked = k < n ? esc(r.s.slice(0, k)) + '<mark style="background:var(--bad-soft);color:var(--bad);font-weight:700">' + esc(r.s.slice(k, k + 1)) + "</mark>" + esc(r.s.slice(k + 1)) : esc(r.s) + '<span style="color:var(--bad)">▮</span>';
          detail.append(h("h4", { style: "margin:14px 0 4px", html: '<span style="color:var(--bad);font-weight:600">✗ ' + esc(shown) + " is NOT a valid &lt;" + esc(r.start) + "&gt;</span>" }), h("div", { class: "output", html: "Point of failure: " + marked + "\n" + esc(why) }));
        }
      }

      function runAll() {
        results.innerHTML = "";
        detail.innerHTML = "";
        if (!refreshGrammar()) return;
        const lines = tIn.value.split("\n");
        if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
        const tb = h("table", {});
        tb.appendChild(h("tr", {}, [h("th", { text: "String" }), h("th", { text: "Valid?" }), h("th", { text: "" })]));
        let first = null;
        lines.slice(0, 40).forEach((line) => {
          const r = test(line);
          const btn = h("button", { class: "btn sm ghost", type: "button", text: "Show working" });
          btn.addEventListener("click", () => showDetail(r));
          const tr = h("tr", { "data-valid": r.ok ? "1" : "0" }, [h("td", { style: "font-family:var(--font-mono)", html: r.s === "" ? '<span class="muted">ε</span>' : esc(r.s) }), h("td", { html: r.ok ? '<span class="ok-text">✓ valid</span>' : '<span style="color:var(--bad);font-weight:600">✗ invalid</span>' }), h("td", {}, btn)]);
          tb.appendChild(tr);
          if (!first) first = r;
        });
        results.appendChild(tb);
        if (first) showDetail(first);
      }

      presetSel.addEventListener("change", () => {
        const p = PRESETS[presetSel.value];
        gIn.value = p.g;
        tIn.value = p.tests;
        startSel.innerHTML = "";
        runAll();
      });
      checkBtn.addEventListener("click", runAll);
      gIn.addEventListener("change", runAll);
      startSel.addEventListener("change", runAll);
      ignoreSp.addEventListener("change", runAll);
      const key = params.preset && PRESETS[params.preset] ? params.preset : "integer";
      presetSel.value = key;
      gIn.value = PRESETS[key].g;
      tIn.value = PRESETS[key].tests;
      runAll();
    },
  });
})();
