/* Set calculator: union, intersection, difference, Cartesian product, subsets, membership, Venn diagram, set-comprehension helper. */
(function () {
  let uid = 0;

  /* ---------- tiny safe expression evaluator for set comprehension ---------- */
  function tokenise(src) {
    const toks = [];
    const re = /\s*(\d+(?:\.\d+)?|x|DIV|MOD|AND|OR|NOT|<=|>=|<>|!=|==|≤|≥|≠|∧|∨|¬|²|³|[-+*\/^()<>=×÷])/iy;
    let i = 0;
    src = src.replace(/\s+$/, "");
    while (i < src.length) {
      re.lastIndex = i;
      const m = re.exec(src);
      if (!m) throw new Error("I don't understand “" + src.slice(i).trim().slice(0, 8) + "”");
      toks.push(/^[a-z]+$/i.test(m[1]) ? m[1].toUpperCase().replace(/^X$/, "x") : m[1]);
      i = re.lastIndex;
    }
    return toks;
  }
  function compileExpr(src) {
    const t = tokenise(src);
    let i = 0;
    const peek = () => t[i], next = () => t[i++];
    const expect = (s) => {
      if (t[i] !== s) throw new Error("Expected “" + s + "”");
      i++;
    };
    const CMP = { "<": (a, b) => a < b, ">": (a, b) => a > b, "<=": (a, b) => a <= b, "≤": (a, b) => a <= b, ">=": (a, b) => a >= b, "≥": (a, b) => a >= b, "=": (a, b) => a === b, "==": (a, b) => a === b, "≠": (a, b) => a !== b, "!=": (a, b) => a !== b, "<>": (a, b) => a !== b };
    function or() {
      let l = and();
      while (peek() === "OR" || peek() === "∨") {
        next();
        const a = l, b = and();
        l = (x) => !!(a(x) || b(x));
      }
      return l;
    }
    function and() {
      let l = not();
      while (peek() === "AND" || peek() === "∧") {
        next();
        const a = l, b = not();
        l = (x) => !!(a(x) && b(x));
      }
      return l;
    }
    function not() {
      if (peek() === "NOT" || peek() === "¬") {
        next();
        const a = not();
        return (x) => !a(x);
      }
      return cmp();
    }
    function cmp() {
      const l = add();
      if (CMP[peek()]) {
        const f = CMP[next()], r = add();
        return (x) => f(l(x), r(x));
      }
      return l;
    }
    function add() {
      let l = mul();
      while (peek() === "+" || peek() === "-") {
        const op = next(), a = l, b = mul();
        l = op === "+" ? (x) => a(x) + b(x) : (x) => a(x) - b(x);
      }
      return l;
    }
    function mul() {
      let l = unary();
      for (;;) {
        const op = peek();
        if (["*", "×", "/", "÷", "DIV", "MOD"].includes(op)) {
          next();
          const a = l, b = unary();
          if (op === "*" || op === "×") l = (x) => a(x) * b(x);
          else if (op === "/" || op === "÷") l = (x) => a(x) / b(x);
          else if (op === "DIV") l = (x) => Math.floor(a(x) / b(x));
          else l = (x) => a(x) - b(x) * Math.floor(a(x) / b(x));
        } else if (op === "x" || op === "(") {
          const a = l, b = unary(); // implicit multiplication: 2x, 3(x+1)
          l = (x) => a(x) * b(x);
        } else break;
      }
      return l;
    }
    function unary() {
      if (peek() === "-") {
        next();
        const a = unary();
        return (x) => -a(x);
      }
      return power();
    }
    function power() {
      let b = atom();
      for (;;) {
        if (peek() === "^") {
          next();
          const base = b, e = unary();
          b = (x) => Math.pow(base(x), e(x));
        } else if (peek() === "²" || peek() === "³") {
          const p = next() === "²" ? 2 : 3, base = b;
          b = (x) => Math.pow(base(x), p);
        } else return b;
      }
    }
    function atom() {
      const tk = next();
      if (tk === undefined) throw new Error("Expression ends too soon");
      if (tk === "x") return (x) => x;
      if (/^\d/.test(tk)) {
        const v = parseFloat(tk);
        return () => v;
      }
      if (tk === "(") {
        const e = or();
        expect(")");
        return e;
      }
      throw new Error("Unexpected “" + tk + "”");
    }
    const f = or();
    if (i < t.length) throw new Error("Unexpected “" + t[i] + "”");
    return f;
  }

  /* ---------- set helpers ---------- */
  function parseSet(text) {
    let s = text.trim();
    if (s === "Ø" || s === "∅") s = "";
    s = s.replace(/^\{/, "").replace(/\}$/, "");
    const raw = s.split(",").map((x) => x.trim()).filter((x) => x !== "");
    const out = [];
    let dup = false;
    raw.forEach((x) => {
      const v = /^-?\d+(\.\d+)?$/.test(x) ? String(Number(x)) : x;
      if (out.includes(v)) dup = true;
      else out.push(v);
    });
    return { items: out, dup };
  }
  const allNum = (arr) => arr.every((x) => /^-?\d+(\.\d+)?$/.test(x));
  function sorted(arr) {
    return allNum(arr) ? arr.slice().sort((a, b) => a - b) : arr;
  }
  function fmt(arr) {
    return arr.length ? "{" + sorted(arr).join(", ") + "}" : "Ø";
  }

  CS.registerTool({
    id: "set-calculator",
    title: "Set calculator",
    section: "4",
    topic: "4.3",
    icon: "⭕",
    desc: "Union, intersection, difference, Cartesian product, cardinality and subsets, with a Venn diagram and a set-comprehension helper.",
    help: "Type two sets, comma separated (braces optional; elements can be numbers or words; `Ø` or nothing is the empty set). Duplicates are removed because a set holds each element once — and order does not matter.\n\nPick an operation to shade it on the Venn diagram. Remember: **A \\ B** (difference) is *in A but not in B*; **A × B** (Cartesian product) is every ordered pair (a, b), so |A × B| = |A| × |B|; **A ⊂ B** (proper subset) needs A ⊆ B *and* A ≠ B.\n\nThe **set comprehension** helper lists the first few elements of {expression | x ∈ ℕ ∧ condition}. AQA takes ℕ = {0, 1, 2, 3, …}. Use `MOD`, `DIV`, `AND`, `OR`, `NOT`, `<`, `≤` / `<=`, `=`, `≠` / `<>`, and write `2x` for 2 × x and `x^2` or `x²` for powers.",
    mount(el, params) {
      const h = CS.util.el;
      const esc = CS.util.esc;
      const svgNS = "http://www.w3.org/2000/svg";
      const myId = "setc" + ++uid;
      const aIn = h("input", { type: "text", "aria-label": "Set A", style: "flex:1;min-width:160px;font-family:var(--font-mono)" });
      const bIn = h("input", { type: "text", "aria-label": "Set B", style: "flex:1;min-width:160px;font-family:var(--font-mono)" });
      aIn.value = params.a || "1, 2, 3";
      bIn.value = params.b || "3, 4";
      const opSel = h("select", { "aria-label": "Operation to shade" });
      [["union", "A ∪ B"], ["inter", "A ∩ B"], ["adiff", "A \\ B"], ["bdiff", "B \\ A"], ["a", "A"], ["b", "B"]].forEach(([v, t]) => opSel.appendChild(h("option", { value: v, text: t })));
      const nSel = h("select", { "aria-label": "Pairs to list" });
      [10, 25, 100].forEach((n) => nSel.appendChild(h("option", { value: n, text: "first " + n + " pairs" })));
      const memIn = h("input", { type: "text", "aria-label": "Element to test", style: "width:90px;font-family:var(--font-mono)", placeholder: "e.g. 3" });
      const err = h("div", { class: "err", style: "display:none" });
      const notes = h("div", { class: "explain", style: "margin-top:0" });
      const out = h("div", { class: "table-wrap" });
      const venn = h("div");
      const memOut = h("div", { class: "stat-line" });
      el.append(
        h("div", { class: "controls" }, [h("label", { text: "A =" }), aIn]),
        h("div", { class: "controls" }, [h("label", { text: "B =" }), bIn]),
        err,
        notes,
        h("div", { class: "two-col" }, [out, h("div", {}, [h("div", { class: "controls" }, [h("label", { text: "Shade " }, opSel)]), venn])]),
        h("div", { class: "controls", style: "margin-top:10px" }, [h("label", { text: "Is x a member? x =" }, memIn), h("label", { text: "Cartesian product: " }, nSel)]),
        memOut
      );

      let A = [], B = [];
      function compute() {
        const pa = parseSet(aIn.value), pb = parseSet(bIn.value);
        A = pa.items;
        B = pb.items;
        err.style.display = "none";
        if (A.length > 200 || B.length > 200) {
          err.textContent = "Keep each set to 200 elements or fewer.";
          err.style.display = "";
          return;
        }
        notes.textContent = pa.dup || pb.dup ? "Note: repeated elements were removed — a set contains each element only once." : "";
        const union = A.concat(B.filter((x) => !A.includes(x)));
        const inter = A.filter((x) => B.includes(x));
        const aDiff = A.filter((x) => !B.includes(x));
        const bDiff = B.filter((x) => !A.includes(x));
        const aSubB = A.every((x) => B.includes(x)), bSubA = B.every((x) => A.includes(x));
        const n = parseInt(nSel.value, 10);
        const pairs = [];
        for (const a of sorted(A)) for (const b of sorted(B)) if (pairs.length < n) pairs.push("(" + a + ", " + b + ")");
        const total = A.length * B.length;
        const rows = [
          ["A", fmt(A), "|A| = " + A.length],
          ["B", fmt(B), "|B| = " + B.length],
          ["A ∪ B", fmt(union), "in A or B (or both); |A ∪ B| = " + union.length],
          ["A ∩ B", fmt(inter), "in both A and B; |A ∩ B| = " + inter.length],
          ["A \\ B", fmt(aDiff), "in A but not in B; |A \\ B| = " + aDiff.length],
          ["B \\ A", fmt(bDiff), "in B but not in A; |B \\ A| = " + bDiff.length],
          ["A × B", total ? "{" + pairs.join(", ") + (total > pairs.length ? ", … (" + (total - pairs.length) + " more)" : "") + "}" : "Ø", "ordered pairs (a, b); |A × B| = " + A.length + " × " + B.length + " = " + total],
          ["A ⊆ B", aSubB ? "TRUE" : "FALSE", aSubB ? "every element of A is in B" : "not every element of A is in B (e.g. " + aDiff[0] + ")"],
          ["A ⊂ B", aSubB && A.length < B.length ? "TRUE" : "FALSE", aSubB ? (A.length < B.length ? "A ⊆ B and A ≠ B" : "A = B, so not a PROPER subset") : "A is not even a subset of B"],
          ["B ⊆ A", bSubA ? "TRUE" : "FALSE", bSubA ? "every element of B is in A" : "not every element of B is in A (e.g. " + bDiff[0] + ")"],
          ["B ⊂ A", bSubA && B.length < A.length ? "TRUE" : "FALSE", bSubA ? (B.length < A.length ? "B ⊆ A and B ≠ A" : "B = A, so not a PROPER subset") : "B is not even a subset of A"],
          ["A = B", aSubB && bSubA ? "TRUE" : "FALSE", "equal sets have exactly the same elements (order irrelevant)"],
        ];
        const tb = h("table", {});
        tb.appendChild(h("tr", {}, ["Set", "Result", "Why"].map((x) => h("th", { text: x }))));
        rows.forEach((r) => tb.appendChild(h("tr", { "data-op": r[0] }, [h("td", { style: "white-space:nowrap;font-weight:700", text: r[0] }), h("td", { style: "font-family:var(--font-mono);word-break:break-word", text: r[1] }), h("td", { class: "small", text: r[2] })])));
        out.innerHTML = "";
        out.appendChild(tb);
        drawVenn(aDiff, inter, bDiff);
        member();
      }
      function member() {
        const raw = memIn.value.trim();
        if (!raw) {
          memOut.textContent = "Type an element to test membership (∈ / ∉).";
          return;
        }
        const v = /^-?\d+(\.\d+)?$/.test(raw) ? String(Number(raw)) : raw;
        memOut.textContent = v + (A.includes(v) ? " ∈ A" : " ∉ A") + "    " + v + (B.includes(v) ? " ∈ B" : " ∉ B") + "    " + v + (A.includes(v) || B.includes(v) ? " ∈ A ∪ B" : " ∉ A ∪ B") + "    " + v + (A.includes(v) && B.includes(v) ? " ∈ A ∩ B" : " ∉ A ∩ B");
      }
      function sv(tag, a) {
        const e = document.createElementNS(svgNS, tag);
        for (const k in a) e.setAttribute(k, a[k]);
        return e;
      }
      function drawVenn(onlyA, both, onlyB) {
        const op = opSel.value;
        const shade = { union: [1, 1, 1], inter: [0, 1, 0], adiff: [1, 0, 0], bdiff: [0, 0, 1], a: [1, 1, 0], b: [0, 1, 1] }[op];
        const svg = sv("svg", { viewBox: "0 0 360 230", role: "img", "aria-label": "Venn diagram shading " + opSel.options[opSel.selectedIndex].text, style: "width:100%;max-width:420px;display:block;color:var(--text);font-family:inherit" });
        const defs = sv("defs", {});
        const mA = sv("mask", { id: myId + "nA" }), mB = sv("mask", { id: myId + "nB" }), cB = sv("clipPath", { id: myId + "cB" });
        mA.append(sv("rect", { x: 0, y: 0, width: 360, height: 230, fill: "#fff" }), sv("circle", { cx: 135, cy: 120, r: 85, fill: "#000" }));
        mB.append(sv("rect", { x: 0, y: 0, width: 360, height: 230, fill: "#fff" }), sv("circle", { cx: 225, cy: 120, r: 85, fill: "#000" }));
        cB.appendChild(sv("circle", { cx: 225, cy: 120, r: 85 }));
        defs.append(mA, mB, cB);
        svg.appendChild(defs);
        svg.appendChild(sv("rect", { x: 4, y: 4, width: 352, height: 222, rx: 8, fill: "none", stroke: "currentColor", "stroke-opacity": "0.4" }));
        const ut = sv("text", { x: 14, y: 22, "font-size": "13", fill: "currentColor", "fill-opacity": "0.7" });
        ut.textContent = "ξ";
        svg.appendChild(ut);
        const fill = { fill: "var(--accent)", "fill-opacity": "0.35" };
        if (shade[0]) svg.appendChild(sv("circle", Object.assign({ cx: 135, cy: 120, r: 85, mask: "url(#" + myId + "nB)" }, fill)));
        if (shade[1]) svg.appendChild(sv("circle", Object.assign({ cx: 135, cy: 120, r: 85, "clip-path": "url(#" + myId + "cB)" }, fill)));
        if (shade[2]) svg.appendChild(sv("circle", Object.assign({ cx: 225, cy: 120, r: 85, mask: "url(#" + myId + "nA)" }, fill)));
        svg.append(sv("circle", { cx: 135, cy: 120, r: 85, fill: "none", stroke: "currentColor", "stroke-width": 2 }), sv("circle", { cx: 225, cy: 120, r: 85, fill: "none", stroke: "currentColor", "stroke-width": 2 }));
        [["A", 75, 40], ["B", 285, 40]].forEach(([l, x, y]) => {
          const t = sv("text", { x, y, "font-size": "16", "font-weight": "700", fill: "currentColor", "text-anchor": "middle" });
          t.textContent = l;
          svg.appendChild(t);
        });
        [[onlyA, 100], [both, 180], [onlyB, 260]].forEach(([items, x]) => {
          const list = sorted(items), max = 6, shown = list.slice(0, list.length > max ? max - 1 : max).map(String);
          if (list.length > max) shown.push("+" + (list.length - max + 1) + " more");
          shown.forEach((s, i) => {
            const t = sv("text", { x, y: 120 + (i - (shown.length - 1) / 2) * 17, "font-size": "13", "font-family": "var(--font-mono)", fill: "currentColor", "text-anchor": "middle", "dominant-baseline": "middle" });
            t.textContent = s.length > 9 ? s.slice(0, 8) + "…" : s;
            svg.appendChild(t);
          });
        });
        venn.innerHTML = "";
        venn.appendChild(svg);
      }
      [aIn, bIn].forEach((i) => i.addEventListener("input", compute));
      opSel.addEventListener("change", compute);
      nSel.addEventListener("change", compute);
      memIn.addEventListener("input", member);

      /* ----- set comprehension ----- */
      const exprIn = h("input", { type: "text", "aria-label": "Output expression", value: "2x", style: "width:90px;font-family:var(--font-mono)" });
      const condIn = h("input", { type: "text", "aria-label": "Condition", value: "x ≥ 1", style: "flex:1;min-width:150px;font-family:var(--font-mono)" });
      const cnt = h("select", { "aria-label": "How many elements" });
      [10, 20, 50].forEach((n) => cnt.appendChild(h("option", { value: n, text: "first " + n })));
      const goBtn = h("button", { class: "btn sm primary", type: "button", text: "List elements" });
      const compOut = h("div", { class: "output" });
      const presets = h("div", { class: "controls" });
      [["2x", "x ≥ 1"], ["x", "x MOD 2 = 0"], ["x", "x < 10"], ["x²", "x ≥ 0"], ["x", "x MOD 3 = 0 AND x > 0"], ["2x + 1", "x < 5"]].forEach(([e, c]) => {
        const b = h("button", { class: "btn sm ghost", type: "button", text: "{" + e + " | x ∈ ℕ ∧ " + c + "}" });
        b.addEventListener("click", () => {
          exprIn.value = e;
          condIn.value = c;
          comprehend();
        });
        presets.appendChild(b);
      });
      el.append(
        h("h4", { style: "margin:18px 0 6px", text: "Set comprehension helper" }),
        h("div", { class: "controls" }, [h("span", { style: "font-family:var(--font-mono);font-size:1.1rem", text: "{" }), exprIn, h("span", { style: "font-family:var(--font-mono)", text: "| x ∈ ℕ ∧" }), condIn, h("span", { style: "font-family:var(--font-mono);font-size:1.1rem", text: "}" }), cnt, goBtn]),
        presets,
        compOut
      );
      function comprehend() {
        let fe, fc;
        try {
          fe = compileExpr(exprIn.value);
          fc = condIn.value.trim() ? compileExpr(condIn.value) : () => true;
        } catch (e) {
          compOut.innerHTML = '<span class="err">' + esc(e.message) + "</span>";
          return;
        }
        const want = parseInt(cnt.value, 10), LIMIT = 100000, res = [], used = [];
        let x = 0;
        for (; x <= LIMIT && res.length <= want; x++) { // collect one extra to tell "exactly want elements" from "more follow"
          const c = fc(x);
          if (typeof c !== "boolean") {
            compOut.innerHTML = '<span class="err">The condition must be true/false (e.g. x &lt; 10), not a number.</span>';
            return;
          }
          if (!c) continue;
          let v = fe(x);
          if (typeof v === "boolean" || !isFinite(v)) {
            compOut.innerHTML = '<span class="err">The expression before | must give a number (got ' + esc(String(v)) + " for x = " + x + ").</span>";
            return;
          }
          v = Math.round(v * 1e9) / 1e9;
          if (!res.includes(v)) {
            res.push(v);
            used.push(x);
          }
        }
        const finite = res.length <= want;
        if (!finite) {
          res.pop();
          used.pop();
        }
        compOut.textContent =
          "{" + exprIn.value + " | x ∈ ℕ ∧ " + (condIn.value || "true") + "}\n= {" + res.join(", ") + (finite ? "}" : ", …}") +
          "\n\nx values used: " + used.slice(0, 12).join(", ") + (used.length > 12 ? ", …" : "") +
          (finite ? "\nChecked every x from 0 to " + LIMIT + ": only " + res.length + " element" + (res.length === 1 ? "" : "s") + " found, so this looks like a FINITE set, cardinality " + res.length + "." : "\nShowing the first " + want + " elements — the set continues (it appears to be infinite but countable).");
      }
      goBtn.addEventListener("click", comprehend);
      [exprIn, condIn].forEach((i) => i.addEventListener("keydown", (e) => e.key === "Enter" && comprehend()));
      cnt.addEventListener("change", comprehend);
      compute();
      comprehend();
    },
  });
})();
