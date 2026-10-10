/* Boolean simplifier: truth table, identity / De Morgan steps, minimal sum of products (Quine–McCluskey), K-map, equivalence check. */
CS.registerTool({
  id: "boolean-simplifier",
  title: "Boolean expression simplifier",
  section: "6",
  topic: "6.5",
  icon: "🧮",
  desc: "Enter a Boolean expression: get its truth table, step-by-step identity and De Morgan rewrites, the minimal sum of products and a Karnaugh map. Check two expressions are equivalent.",
  help:
    "Type an expression and press **Simplify**. Variables are single letters A–Z.\n\n" +
    "* AND: `A.B`, `A·B`, `AB`, `A AND B`  •  OR: `A + B`, `A OR B`  •  NOT: `¬A`, `~A`, `NOT A`, `A'`  •  XOR: `A ⊕ B`, `A XOR B`  •  also `NAND`, `NOR`, brackets and the constants `0`, `1`.\n\n" +
    "The **steps** apply the AQA identities one at a time – De Morgan's laws, double negation, the distributive law, idempotent, complement, identity, annulment and absorption laws, and the rule `X.Y + X.¬Y = X` – and finish with the **minimal sum of products** found by the Quine–McCluskey method. Every step is checked by truth table.\n\n" +
    "The **K-map** (for up to 4 variables) uses Gray-code order so neighbouring cells differ by one variable; each coloured group is one product term. Groups may wrap round the edges.\n\n" +
    "Type a second expression in **Compare with** to test whether two expressions are equivalent; if not, a row where they differ is shown.",
  mount(el, params) {
    const h = CS.util.el;
    const esc = CS.util.esc;
    class BErr extends Error {}
    const fail = (m) => {
      throw new BErr(m);
    };
    // ---------- parser ----------
    const V = (n) => ({ t: "var", n }),
      C = (v) => ({ t: "const", v }),
      NOT = (a) => ({ t: "not", a }),
      AND = (args) => ({ t: "and", args }),
      OR = (args) => ({ t: "or", args }),
      XOR = (args) => ({ t: "xor", args });
    function parse(src) {
      const toks = [];
      const re = /\s*(?:(AND|OR|NOT|XOR|NAND|NOR)\b|([A-Za-z])|([01])|([().·*&+|¬~!'’⊕^]))/iy;
      let p = 0;
      src = src.replace(/\s+$/, "");
      while (p < src.length) {
        re.lastIndex = p;
        const m = re.exec(src);
        if (!m) fail("I don't understand '" + src.slice(p).trim()[0] + "'. Use letters, 0/1, brackets, . + ¬ ' ⊕ or AND OR NOT XOR NAND NOR.");
        p = re.lastIndex;
        if (m[1]) toks.push({ k: "op", v: m[1].toUpperCase() });
        else if (m[2]) toks.push({ k: "var", v: m[2].toUpperCase() });
        else if (m[3]) toks.push({ k: "const", v: +m[3] });
        else toks.push({ k: "op", v: { "·": "AND", ".": "AND", "*": "AND", "&": "AND", "+": "OR", "|": "OR", "¬": "NOT", "~": "NOT", "!": "NOT", "⊕": "XOR", "^": "XOR", "'": "'", "’": "'", "(": "(", ")": ")" }[m[4]] });
      }
      if (!toks.length) fail("Type an expression first.");
      let i = 0;
      const pk = () => toks[i];
      const isOp = (v) => pk() && pk().k === "op" && pk().v === v;
      function unary() {
        if (isOp("NOT")) return i++, NOT(unary());
        let e;
        if (isOp("(")) {
          i++;
          e = orE();
          if (!isOp(")")) fail("A closing bracket ')' is missing.");
          i++;
        } else if (pk() && pk().k === "var") e = V(toks[i++].v);
        else if (pk() && pk().k === "const") e = C(toks[i++].v);
        else fail(pk() ? "Unexpected '" + pk().v + "'." : "The expression ended too early.");
        while (isOp("'")) (i++, (e = NOT(e)));
        return e;
      }
      function andE() {
        let l = unary();
        for (;;) {
          if (isOp("AND")) (i++, (l = AND([l, unary()])));
          else if (isOp("NAND")) (i++, (l = NOT(AND([l, unary()]))));
          else if (pk() && (pk().k === "var" || pk().k === "const" || isOp("(") || isOp("NOT"))) l = AND([l, unary()]);
          else return l;
        }
      }
      function xorE() {
        let l = andE();
        while (isOp("XOR")) (i++, (l = XOR([l, andE()])));
        return l;
      }
      function orE() {
        let l = xorE();
        for (;;) {
          if (isOp("OR")) (i++, (l = OR([l, xorE()])));
          else if (isOp("NOR")) (i++, (l = NOT(OR([l, xorE()]))));
          else return l;
        }
      }
      const e = orE();
      if (i < toks.length) fail("Unexpected '" + toks[i].v + "' – check the brackets.");
      return e;
    }
    const varsOf = (e, s = new Set()) => (e.t === "var" ? s.add(e.n) : e.t === "not" ? varsOf(e.a, s) : e.args && e.args.forEach((a) => varsOf(a, s)), s);
    function ev(e, env) {
      switch (e.t) {
        case "var": return env[e.n];
        case "const": return e.v;
        case "not": return ev(e.a, env) ? 0 : 1;
        case "and": return e.args.every((a) => ev(a, env)) ? 1 : 0;
        case "or": return e.args.some((a) => ev(a, env)) ? 1 : 0;
        case "xor": return e.args.reduce((x, a) => x ^ ev(a, env), 0);
      }
    }
    const envOf = (vars, r) => Object.fromEntries(vars.map((v, k) => [v, (r >> (vars.length - 1 - k)) & 1]));
    const table = (e, vars) => Array.from({ length: 1 << vars.length }, (_, r) => ev(e, envOf(vars, r)));

    // ---------- printer ----------
    let notation = "bar";
    function show(e, ctx) {
      const p = (s, need) => (need ? "(" + s + ")" : s);
      switch (e.t) {
        case "var": return esc(e.n);
        case "const": return String(e.v);
        case "not": {
          const inner = e.a;
          if (notation === "bar") return "<span class='ob'>" + show(inner, "bar") + "</span>";
          const s = show(inner, "not");
          const simple = inner.t === "var" || inner.t === "const" || inner.t === "not";
          return notation === "neg" ? "¬" + p(s, !simple) : p(s, !simple) + "'";
        }
        case "and": return p(e.args.map((a) => show(a, "and")).join("."), ctx === "not" || ctx === "xor");
        case "or": return p(e.args.map((a) => show(a, "or")).join(" + "), ctx === "and" || ctx === "not" || ctx === "xor");
        case "xor": return p(e.args.map((a) => show(a, "xor")).join(" ⊕ "), ctx === "and" || ctx === "not");
      }
    }
    // ---------- algebraic steps ----------
    const key = (e) => (e.t === "var" ? e.n : e.t === "const" ? "#" + e.v : e.t === "not" ? "¬" + key(e.a) : e.t + "(" + e.args.map(key).join(",") + ")");
    const flat = (e) => {
      if (e.t === "not") return NOT(flat(e.a));
      if (e.t === "and" || e.t === "or") {
        const args = e.args.map(flat).flatMap((a) => (a.t === e.t ? a.args : [a]));
        return args.length === 1 ? args[0] : { t: e.t, args };
      }
      if (e.t === "xor") return XOR(e.args.map(flat));
      return e;
    };
    // rewrite the first (outermost, leftmost) node where f returns a replacement
    function rewrite(e, f) {
      const r = f(e);
      if (r) return r;
      if (e.t === "not") {
        const a = rewrite(e.a, f);
        return a && NOT(a);
      }
      if (e.args)
        for (let k = 0; k < e.args.length; k++) {
          const a = rewrite(e.args[k], f);
          if (a) {
            const args = e.args.slice();
            args[k] = a;
            return { t: e.t, args };
          }
        }
      return null;
    }
    const lit = (x) => (x.t === "var" ? x.n : x.t === "not" && x.a.t === "var" ? "¬" + x.a.n : null);
    const negKey = (k) => (k.startsWith("¬") ? k.slice(1) : "¬" + k);
    function algebra(e0) {
      const steps = [];
      let e = flat(e0);
      const push = (ne, law) => {
        ne = flat(ne);
        if (key(ne) === key(e)) return false;
        e = ne;
        steps.push({ e, law });
        return true;
      };
      const RULES = [
        ["XOR definition: A ⊕ B = A.¬B + ¬A.B", (x) => x.t === "xor" && OR([AND([x.args[0], NOT(x.args[1])]), AND([NOT(x.args[0]), x.args[1]])])],
        ["Double negation: ¬¬A = A", (x) => x.t === "not" && x.a.t === "not" && x.a.a],
        ["De Morgan's law: ¬(A.B) = ¬A + ¬B", (x) => x.t === "not" && x.a.t === "and" && OR(x.a.args.map(NOT))],
        ["De Morgan's law: ¬(A + B) = ¬A.¬B", (x) => x.t === "not" && x.a.t === "or" && AND(x.a.args.map(NOT))],
        ["¬0 = 1 and ¬1 = 0", (x) => x.t === "not" && x.a.t === "const" && C(1 - x.a.v)],
        ["Distributive law: A.(B + C) = A.B + A.C", (x) => {
          if (x.t !== "and") return null;
          const k = x.args.findIndex((a) => a.t === "or");
          if (k < 0) return null;
          const rest = x.args.filter((a, j) => j !== k);
          return OR(x.args[k].args.map((t) => AND([...rest.slice(0, k), t, ...rest.slice(k)])));
        }],
      ];
      for (let guard = 0; guard < 40; guard++) {
        let done = false;
        for (const [law, f] of RULES) {
          const r = rewrite(e, (x) => f(x) || null);
          if (r) {
            push(r, law);
            done = true;
            break;
          }
        }
        if (!done) break;
        if (countTerms(e) > 40) return { steps, tooBig: true };
      }
      // now e is a sum of products of literals/constants
      const terms = (e.t === "or" ? e.args : [e]).map((t) => (t.t === "and" ? t.args : [t]));
      const toExpr = (ts) => (ts.length ? flat(OR(ts.map((t) => (t.length ? AND(t) : C(1))))) : C(0));
      let ts = terms;
      const apply = (law, fn) => {
        const nt = fn(ts);
        if (nt) {
          const before = key(e);
          ts = nt;
          push(toExpr(ts), law);
          if (key(e) === before) return false;
          return true;
        }
        return false;
      };
      const tk = (t) => t.map(key).sort().join(".");
      apply("Annulment: A.0 = 0", (T) => (T.some((t) => t.some((x) => key(x) === "#0")) ? T.filter((t) => !t.some((x) => key(x) === "#0")) : null));
      apply("Identity: A.1 = A", (T) => (T.some((t) => t.length > 1 && t.some((x) => key(x) === "#1")) ? T.map((t) => (t.length > 1 ? t.filter((x) => key(x) !== "#1") : t)) : null));
      apply("Complement: A.¬A = 0, and identity X + 0 = X", (T) => (T.some((t) => t.some((x) => t.some((y) => key(y) === negKey(key(x))))) ? T.filter((t) => !t.some((x) => t.some((y) => key(y) === negKey(key(x))))) : null));
      apply("Idempotent law: A.A = A", (T) => (T.some((t) => new Set(t.map(key)).size < t.length) ? T.map((t) => t.filter((x, j) => t.findIndex((y) => key(y) === key(x)) === j)) : null));
      apply("Annulment: A + 1 = 1", (T) => (T.length > 1 && T.some((t) => t.length === 1 && key(t[0]) === "#1") ? [[C(1)]] : null));
      apply("Idempotent law: A + A = A", (T) => (new Set(T.map(tk)).size < T.length ? T.filter((t, j) => T.findIndex((u) => tk(u) === tk(t)) === j) : null));
      const absorb = (T) => {
        const sets = T.map((t) => new Set(t.map(key)));
        const keep = T.filter((t, j) => !sets.some((s, k) => k !== j && s.size < sets[j].size && [...s].every((x) => sets[j].has(x))));
        return keep.length < T.length ? keep : null;
      };
      apply("Absorption law: A + A.B = A", absorb);
      for (let g = 0; g < 12; g++) {
        // combining rule X.Y + X.¬Y = X
        const merged = ((T) => {
          for (let a = 0; a < T.length; a++)
            for (let b = a + 1; b < T.length; b++) {
              const A = T[a].map(key),
                B = T[b].map(key);
              if (A.length !== B.length) continue;
              const onlyA = A.filter((x) => !B.includes(x)),
                onlyB = B.filter((x) => !A.includes(x));
              if (onlyA.length === 1 && onlyB.length === 1 && onlyB[0] === negKey(onlyA[0])) {
                const nt = T[a].filter((x) => key(x) !== onlyA[0]);
                return T.filter((t, j) => j !== a && j !== b).concat([nt.length ? nt : [C(1)]]);
              }
            }
          return null;
        })(ts);
        if (!merged) break;
        ts = merged;
        push(toExpr(ts), "Combine: X.Y + X.¬Y = X.(Y + ¬Y) = X.1 = X");
        apply("Absorption law: A + A.B = A", absorb);
        apply("Idempotent law: A + A = A", (T) => (new Set(T.map(tk)).size < T.length ? T.filter((t, j) => T.findIndex((u) => tk(u) === tk(t)) === j) : null));
      }
      return { steps, last: e };
    }
    const countTerms = (e) => (e.t === "or" ? e.args.length : 1);
    const litCount = (e) => (e.t === "var" ? 1 : e.t === "const" ? 0 : e.t === "not" ? litCount(e.a) : e.args.reduce((s, a) => s + litCount(a), 0));

    // ---------- Quine–McCluskey ----------
    function qm(n, ones) {
      if (!ones.length) return [];
      let groups = ones.map((m) => ({ bits: m.toString(2).padStart(n, "0"), ms: [m] }));
      const primes = [];
      while (groups.length) {
        const next = new Map(),
          used = new Set();
        for (let a = 0; a < groups.length; a++)
          for (let b = a + 1; b < groups.length; b++) {
            const x = groups[a].bits,
              y = groups[b].bits;
            let diff = -1,
              cnt = 0;
            for (let k = 0; k < n; k++) if (x[k] !== y[k]) (cnt++, (diff = k));
            if (cnt === 1 && x[diff] !== "-" && y[diff] !== "-") {
              const bits = x.slice(0, diff) + "-" + x.slice(diff + 1);
              used.add(a).add(b);
              if (!next.has(bits)) next.set(bits, { bits, ms: [...new Set(groups[a].ms.concat(groups[b].ms))].sort((p, q) => p - q) });
            }
          }
        groups.forEach((g, k) => !used.has(k) && !primes.some((p) => p.bits === g.bits) && primes.push(g));
        groups = [...next.values()];
      }
      // cover: essentials then exhaustive minimum
      const lits = (p) => [...p.bits].filter((c) => c !== "-").length;
      const chosen = [];
      let left = new Set(ones);
      primes.forEach((p) => {
        p.essential = ones.some((m) => p.ms.includes(m) && primes.filter((q) => q.ms.includes(m)).length === 1);
        if (p.essential) (chosen.push(p), p.ms.forEach((m) => left.delete(m)));
      });
      const rest = primes.filter((p) => !p.essential);
      let best = null;
      const search = (k, pick, need) => {
        if (!need.size) {
          const cost = [pick.length, pick.reduce((s, p) => s + lits(p), 0)];
          if (!best || cost[0] < best.c[0] || (cost[0] === best.c[0] && cost[1] < best.c[1])) best = { pick: pick.slice(), c: cost };
          return;
        }
        if (k >= rest.length || (best && pick.length >= best.c[0])) return;
        const p = rest[k];
        if (p.ms.some((m) => need.has(m))) {
          const nn = new Set([...need].filter((m) => !p.ms.includes(m)));
          search(k + 1, pick.concat([p]), nn);
        }
        search(k + 1, pick, need);
      };
      search(0, [], left);
      return { primes, cover: chosen.concat(best ? best.pick : []) };
    }
    const termExpr = (p, vars) => {
      const ls = [...p.bits].map((c, k) => (c === "1" ? V(vars[k]) : c === "0" ? NOT(V(vars[k])) : null)).filter(Boolean);
      return ls.length === 0 ? C(1) : ls.length === 1 ? ls[0] : AND(ls);
    };
    const sopExpr = (cover, vars) => (!cover.length ? C(0) : cover.length === 1 ? termExpr(cover[0], vars) : OR(cover.map((p) => termExpr(p, vars))));

    // ---------- UI ----------
    const EX = ["A.B + A.¬B", "¬(A + B)", "¬(A.B) + A", "A + A.B", "(A + B).(A + C)", "A.B.C + A.B.¬C + A.¬B.C", "¬A.¬B.¬C + ¬A.B.¬C + A.¬B.¬C + A.B.¬C", "¬(¬A + B)", "A ⊕ B", "A NAND B", "A.B + ¬A.C + B.C", "¬A.¬B.C.D + ¬A.B.C.D + A.B.C.D + A.¬B.C.D + A.B.¬C.D"];
    const input = h("input", { type: "text", value: params.expr || "¬(A.B) + A.¬B", style: "flex:1;min-width:200px;font-family:var(--font-mono)", "aria-label": "Boolean expression", spellcheck: "false" });
    const cmpIn = h("input", { type: "text", placeholder: "optional: compare with…", style: "flex:1;min-width:200px;font-family:var(--font-mono)", "aria-label": "Second expression to compare" });
    const goBtn = h("button", { class: "btn sm primary", type: "button", text: "Simplify" });
    const notSel = h("select", { "aria-label": "NOT notation" }, [h("option", { value: "bar", text: "NOT as overbar Ā" }), h("option", { value: "neg", text: "NOT as ¬A" }), h("option", { value: "prime", text: "NOT as A'" })]);
    const exRow = h("div", { class: "controls", style: "gap:5px" }, [h("span", { class: "bit-label", text: "Examples:" })]);
    EX.forEach((x) => exRow.appendChild(h("button", { class: "btn sm", type: "button", style: "font-family:var(--font-mono);font-weight:500", text: x, onclick: () => ((input.value = x), run()) })));
    const errBox = h("div", { class: "err", style: "min-height:1.2em" });
    const result = h("div", { class: "card", style: "padding:12px 14px;margin-bottom:10px" });
    const stepsBox = h("div", { class: "steps-out" });
    const kmapBox = h("div");
    const ttBox = h("div");
    const style = h("style", { text: ".tool .ob{text-decoration:overline;text-decoration-thickness:1.5px}.tool .kmap td{width:46px;height:40px;text-align:center;font-family:var(--font-mono);font-weight:700;border:1px solid var(--border-2)}.tool .kmap th{text-transform:none;letter-spacing:0;font-family:var(--font-mono)}" });
    el.append(style, h("div", { class: "controls" }, [input, goBtn, notSel]), h("div", { class: "controls" }, [cmpIn]), exRow, errBox, result, h("div", { class: "two-col" }, [h("div", {}, [h("h4", { text: "Truth table", style: "margin:6px 0" }), ttBox]), h("div", {}, [h("h4", { text: "Karnaugh map", style: "margin:6px 0" }), kmapBox])]), h("h4", { text: "Step-by-step simplification", style: "margin:12px 0 6px" }), stepsBox);
    const COLORS = ["var(--accent)", "var(--ok)", "var(--warn)", "var(--bad)", "#a855f7", "#14b8a6", "#ec4899", "#64748b"];

    function run() {
      errBox.textContent = "";
      [result, stepsBox, kmapBox, ttBox].forEach((x) => (x.innerHTML = ""));
      let e;
      try {
        e = parse(input.value);
      } catch (err) {
        errBox.textContent = err instanceof BErr ? err.message : "Sorry – I couldn't read that expression.";
        return;
      }
      const vars = [...varsOf(e)].sort();
      if (vars.length > 6) return (errBox.textContent = "Use at most 6 different variables.");
      const tt = table(e, vars);
      const ones = tt.map((v, r) => (v ? r : -1)).filter((r) => r >= 0);
      const Q = qm(vars.length, ones);
      const cover = Q.cover || [];
      const simp = sopExpr(cover, vars);
      const ok = JSON.stringify(table(simp, vars)) === JSON.stringify(tt);
      result.innerHTML =
        "<div class='bit-label' style='text-align:left'>Original</div><div class='mono' style='font-size:1.05rem'>" + show(flat(e)) + "</div>" +
        "<div class='bit-label' style='text-align:left;margin-top:8px'>Minimal sum of products</div><div class='mono simplified' style='font-size:1.25rem;font-weight:700;color:var(--accent)'>" + show(simp) + "</div>" +
        "<div class='" + (ok ? "ok-text" : "err") + " verify' style='margin-top:6px'>" + (ok ? "✓ Verified: same truth table as the original for all " + (1 << vars.length) + " rows." : "✗ Internal check failed.") + "</div>" +
        (simp.t === "const" ? "<div class='explain'>" + (simp.v ? "The expression is always 1 (a tautology)." : "The expression is always 0 (a contradiction).") + "</div>" : "") +
        (Q.primes ? "<div class='explain'>Prime implicants: " + Q.primes.map((p) => show(termExpr(p, vars)) + " (m" + p.ms.join(",") + ")" + (p.essential ? " <b>essential</b>" : "")).join("; ") + "</div>" : "");
      // compare
      if (cmpIn.value.trim()) {
        try {
          const e2 = parse(cmpIn.value);
          const all = [...new Set([...vars, ...varsOf(e2)])].sort();
          if (all.length > 8) fail("Too many variables to compare.");
          const t1 = table(e, all),
            t2 = table(e2, all);
          const diff = t1.findIndex((v, r) => v !== t2[r]);
          result.appendChild(h("div", { class: (diff < 0 ? "ok-text" : "err") + " compare", style: "margin-top:8px", html: diff < 0 ? "✓ Equivalent: " + show(flat(e)) + " ≡ " + show(flat(e2)) + " (identical truth tables)." : "✗ Not equivalent. For " + all.map((v, k) => v + " = " + ((diff >> (all.length - 1 - k)) & 1)).join(", ") + " the first gives " + t1[diff] + " but the second gives " + t2[diff] + "." }));
        } catch (err) {
          result.appendChild(h("div", { class: "err", text: "Compare with: " + (err instanceof BErr ? err.message : "couldn't read it.") }));
        }
      }
      // truth table
      const tw = h("div", { class: "table-wrap" });
      let html = "<table class='tt' style='border-collapse:collapse'><thead><tr><th style='text-transform:none'>row</th>" + vars.map((v) => "<th style='text-transform:none'>" + v + "</th>").join("") + "<th style='text-transform:none;color:var(--accent)'>Q</th></tr></thead><tbody>";
      tt.forEach((q, r) => (html += "<tr" + (q ? " style='background:var(--ok-soft)'" : "") + "><td class='mono' style='color:var(--text-3)'>m" + r + "</td>" + vars.map((v, k) => "<td class='mono'>" + ((r >> (vars.length - 1 - k)) & 1) + "</td>").join("") + "<td class='mono' style='font-weight:700'>" + q + "</td></tr>"));
      tw.innerHTML = html + "</tbody></table>";
      ttBox.appendChild(tw);
      // K-map
      drawKmap(vars, tt, cover);
      // steps
      let A;
      try {
        A = algebra(e);
      } catch (err) {
        A = { steps: [], tooBig: true };
      }
      const valid = A.steps.every((s) => JSON.stringify(table(s.e, vars)) === JSON.stringify(tt));
      const ol = h("ol", { style: "margin:0;padding-left:1.4em" });
      ol.appendChild(h("li", { html: "<span class='mono'>" + show(flat(e)) + "</span> <span class='explain'>– start</span>" }));
      if (valid) A.steps.forEach((s) => ol.appendChild(h("li", { html: "<span class='mono'>= " + show(s.e) + "</span><div class='explain' style='margin:0 0 4px'>" + esc(s.law) + "</div>" })));
      const lastE = valid && A.steps.length ? A.steps[A.steps.length - 1].e : flat(e);
      if (A.tooBig) ol.appendChild(h("li", { html: "<span class='explain'>Expanding further by hand gets very long – the minimal form below comes from the K-map / Quine–McCluskey method.</span>" }));
      const minimal = litCount(simp) < litCount(lastE) || (simp.t === "const" && lastE.t !== "const");
      if (minimal || A.tooBig || !valid) ol.appendChild(h("li", { html: "<span class='mono'>= " + show(simp) + "</span><div class='explain' style='margin:0 0 4px'>Minimal form: group the 1s (K-map / Quine–McCluskey). Grouping adjacent minterms is repeated use of X.Y + X.¬Y = X" + (cover.length > 1 ? "; the consensus theorem X.Y + ¬X.Z + Y.Z = X.Y + ¬X.Z removes redundant terms" : "") + ".</div>" }));
      else ol.appendChild(h("li", { html: "<span class='ok-text'>This is already the minimal sum of products.</span>" }));
      stepsBox.appendChild(ol);
    }
    function drawKmap(vars, tt, cover) {
      const n = vars.length;
      if (n === 0 || n > 4) {
        kmapBox.appendChild(h("p", { class: "explain", text: n === 0 ? "No variables – the expression is a constant." : "K-maps are drawn for up to 4 variables (AQA uses 2–4). The simplification still works." }));
        return;
      }
      const gray = (k) => (k === 1 ? ["0", "1"] : ["00", "01", "11", "10"]);
      const rv = n <= 2 ? 1 : n === 3 ? 1 : 2,
        cv = n - rv;
      const rows = n === 1 ? [""] : gray(rv),
        cols = gray(n === 1 ? 1 : cv);
      const rName = n === 1 ? "" : vars.slice(0, rv).join(""),
        cName = n === 1 ? vars[0] : vars.slice(rv).join("");
      const tbl = h("table", { class: "kmap", style: "border-collapse:collapse;width:auto" });
      const head = h("tr", {}, [h("th", { text: (rName ? rName + " \\ " : "") + cName })].concat(cols.map((c) => h("th", { text: c }))));
      tbl.appendChild(h("thead", {}, head));
      const tb = h("tbody");
      rows.forEach((rb) => {
        const tr = h("tr", {}, h("th", { text: rb }));
        cols.forEach((cb) => {
          const bits = rb + cb;
          const m = parseInt(bits, 2);
          const gs = cover.map((p, gi) => ([...p.bits].every((c, k) => c === "-" || c === bits[k]) ? gi : -1)).filter((g) => g >= 0);
          const shadow = gs.map((g, j) => "inset 0 0 0 " + (3 + j * 3) + "px " + COLORS[g % COLORS.length]).join(",");
          tr.appendChild(h("td", { text: String(tt[m]), title: "m" + m + (gs.length ? " – group " + gs.map((g) => g + 1).join(", ") : ""), style: (shadow ? "box-shadow:" + shadow + ";" : "") + (tt[m] ? "" : "color:var(--text-3)"), "data-m": m }));
        });
        tb.appendChild(tr);
      });
      tbl.appendChild(tb);
      kmapBox.appendChild(h("div", { style: "overflow-x:auto" }, tbl));
      const leg = h("div", { class: "legend" });
      cover.forEach((p, gi) => leg.appendChild(h("span", { html: "<i style='background:" + COLORS[gi % COLORS.length] + "'></i>group " + (gi + 1) + ": <span class='mono'>" + show(termExpr(p, vars)) + "</span> (" + p.ms.length + " cell" + (p.ms.length > 1 ? "s" : "") + ")" })));
      if (!cover.length) leg.appendChild(h("span", { text: "No 1s to group – Q = 0." }));
      kmapBox.appendChild(leg);
    }
    goBtn.addEventListener("click", run);
    [input, cmpIn].forEach((x) => x.addEventListener("keydown", (ev2) => ev2.key === "Enter" && run()));
    notSel.addEventListener("change", () => ((notation = notSel.value), run()));
    run();
  },
});
