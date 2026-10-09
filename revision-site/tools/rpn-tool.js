/* RPN tool: infix → RPN via shunting-yard (step table), RPN evaluation with a stack, RPN → infix. */
CS.registerTool({
  id: "rpn-tool",
  title: "Reverse Polish notation tool",
  section: "3",
  topic: "3.3",
  icon: "🧮",
  desc: "Convert infix to RPN with the shunting-yard algorithm, evaluate RPN with a stack, and turn RPN back into infix.",
  help: "**Infix → RPN** uses the shunting-yard algorithm. Operands go straight to the output; operators wait on a stack. Before pushing an operator, pop any operator on the stack with **higher precedence** (or equal precedence, if the new operator is left-associative). `(` is pushed; `)` pops everything back to the matching `(`. Precedence: `^` (highest, right-associative) > `* /` > `+ −`.\n\n**Evaluate RPN**: read left to right; push numbers; for an operator pop two values — the *first* pop is the **right** operand — apply it and push the result. One value left = the answer.\n\n**RPN → infix** works the same way but pushes bracketed strings instead of values.\n\nWhy RPN? No brackets or precedence rules are needed, and it is evaluated with a single stack, which suits interpreters and stack-based machines (e.g. bytecode, PostScript, old HP calculators).",
  mount(el, params) {
    const h = CS.util.el;
    const PREC = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
    const NAME = { "+": "+", "-": "−", "*": "×", "/": "÷", "^": "^" };
    const examples = [
      ["infix", "3 + 4 * 2"], ["infix", "(3 + 4) * 2"], ["infix", "(a + b) * (c - d)"], ["infix", "2 ^ 3 ^ 2"], ["infix", "a + b * c - d / e"],
      ["rpn", "5 1 2 + 4 * + 3 -"], ["rpn", "8 3 - 2 -"], ["rpn", "a b + c d - *"],
    ];
    const modeSel = h("select", { "aria-label": "Conversion mode" });
    [["infix", "Infix → RPN (shunting-yard)"], ["eval", "Evaluate RPN"], ["toinfix", "RPN → infix"]].forEach(([v, t]) => modeSel.appendChild(h("option", { value: v, text: t })));
    const input = h("input", { type: "text", value: params.expr || "3 + 4 * 2", "aria-label": "Expression", style: "min-width:220px;flex:1;font-family:var(--font-mono)" });
    const goBtn = h("button", { class: "btn sm primary", type: "button", text: "Convert" });
    const row1 = h("div", { class: "controls" }, [modeSel, input, goBtn]);
    const exRow = h("div", { class: "controls" }, [h("span", { class: "muted", text: "Worked examples:", style: "font-size:0.85rem" })]);
    examples.forEach(([m, e]) => exRow.appendChild(h("button", { class: "btn sm ghost", type: "button", text: e, onclick: () => { modeSel.value = m === "infix" ? "infix" : /[a-z]/i.test(e) ? "toinfix" : "eval"; input.value = e; go(); } })));
    const stepBtn = h("button", { class: "btn sm", type: "button", text: "▶ Step" });
    const allBtn = h("button", { class: "btn sm", type: "button", text: "⏭ Show all" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const row2 = h("div", { class: "controls" }, [stepBtn, allBtn, resetBtn]);
    const err = h("div", { class: "err", style: "display:none" });
    const tableWrap = h("div", { class: "table-wrap" });
    const result = h("div", { class: "output", "aria-live": "polite" });
    el.append(row1, exRow, row2, err, tableWrap, result);
    let rows = [], cols = [], shown = 0, finalMsg = "";

    function tokenize(s) {
      s = s.replace(/[−–]/g, "-").replace(/×/g, "*").replace(/÷/g, "/");
      const out = []; let i = 0;
      while (i < s.length) {
        const c = s[i];
        if (/\s/.test(c)) { i++; continue; }
        if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; const t = s.slice(i, j); if (isNaN(Number(t))) throw new Error("“" + t + "” is not a valid number."); out.push(t); i = j; continue; }
        if (/[A-Za-z]/.test(c)) { let j = i; while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++; out.push(s.slice(i, j)); i = j; continue; }
        if ("+-*/^()".includes(c)) { out.push(c); i++; continue; }
        throw new Error("Unexpected character “" + c + "”. Use numbers, letters, + − * / ^ and brackets.");
      }
      if (!out.length) throw new Error("Type an expression first.");
      return out;
    }
    const isOp = (t) => t in PREC;
    const isOperand = (t) => !isOp(t) && t !== "(" && t !== ")";
    const disp = (arr) => arr.map((t) => NAME[t] || t).join(" ");

    function shunting(tokens) {
      const out = [], st = [], R = [];
      let prev = null;
      const row = (tok, action) => R.push([tok, action, disp(st) || "(empty)", disp(out)]);
      tokens.forEach((t) => {
        if (isOperand(t)) {
          if (prev && (isOperand(prev) || prev === ")")) throw new Error("Missing operator before “" + t + "”.");
          out.push(t); row(t, "Operand → append to output");
        } else if (t === "(") { st.push(t); row(t, "Left bracket → push onto stack"); }
        else if (t === ")") {
          const popped = [];
          while (st.length && st[st.length - 1] !== "(") { const o = st.pop(); out.push(o); popped.push(NAME[o]); }
          if (!st.length) throw new Error("Unmatched “)” — there is no matching “(”.");
          st.pop();
          row(t, (popped.length ? "Pop " + popped.join(", ") + " to output until “(”; " : "") + "discard the brackets");
        } else {
          if (!prev || isOp(prev) || prev === "(") throw new Error("Operator “" + NAME[t] + "” is missing a left operand (unary minus is not used in RPN questions — write 0 − x).");
          const popped = [];
          while (st.length && st[st.length - 1] !== "(") {
            const top = st[st.length - 1];
            if (PREC[top] > PREC[t] || (PREC[top] === PREC[t] && t !== "^")) { out.push(st.pop()); popped.push(NAME[top]); } else break;
          }
          st.push(t);
          const why = popped.length ? "Pop " + popped.join(", ") + " (higher or equal precedence) to output, then push " + NAME[t] : st.length > 1 && st[st.length - 2] !== "(" ? "Top of stack " + NAME[st[st.length - 2]] + " has lower precedence" + (t === "^" && st[st.length - 2] === "^" ? " / ^ is right-associative" : "") + " → push " + NAME[t] : "Push " + NAME[t] + " onto stack";
          row(NAME[t], why);
        }
        prev = t;
      });
      if (prev && (isOp(prev) || prev === "(")) throw new Error("The expression ends with an operator or “(”.");
      if (st.length) {
        const popped = [];
        while (st.length) { const o = st.pop(); if (o === "(") throw new Error("Unmatched “(” — a closing bracket is missing."); out.push(o); popped.push(NAME[o]); }
        R.push(["end", "End of input → pop " + popped.join(", ") + " to output", "(empty)", disp(out)]);
      }
      return { rows: R, out };
    }
    function evalRPN(tokens) {
      const st = [], R = [];
      const fmt = (v) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 1e6) / 1e6));
      tokens.forEach((t) => {
        if (t === "(" || t === ")") throw new Error("RPN never contains brackets.");
        if (isOperand(t)) {
          if (isNaN(Number(t))) throw new Error("“" + t + "” is a variable — evaluation needs numbers. Use RPN → infix for letters.");
          st.push(Number(t)); R.push([t, "Number → push", st.map(fmt).join(" ")]);
        } else {
          if (st.length < 2) throw new Error("Operator “" + NAME[t] + "” needs two values but the stack has " + st.length + ". The RPN is not valid.");
          const b = st.pop(), a = st.pop();
          if (t === "/" && b === 0) throw new Error("Division by zero.");
          const v = { "+": a + b, "-": a - b, "*": a * b, "/": a / b, "^": Math.pow(a, b) }[t];
          st.push(v);
          R.push([NAME[t], "Pop " + fmt(b) + " (right), pop " + fmt(a) + " (left); " + fmt(a) + " " + NAME[t] + " " + fmt(b) + " = " + fmt(v) + " → push", st.map(fmt).join(" ")]);
        }
      });
      if (st.length !== 1) throw new Error("The stack ends with " + st.length + " values, not 1 — too " + (st.length > 1 ? "few operators." : "many operators."));
      return { rows: R, value: fmt(st[0]) };
    }
    function toInfix(tokens) {
      const st = [], R = [];
      tokens.forEach((t) => {
        if (t === "(" || t === ")") throw new Error("RPN never contains brackets.");
        if (isOperand(t)) { st.push(t); R.push([t, "Operand → push", st.join("  |  ")]); }
        else {
          if (st.length < 2) throw new Error("Operator “" + NAME[t] + "” needs two operands but the stack has " + st.length + ".");
          const b = st.pop(), a = st.pop(), s = "(" + a + " " + NAME[t] + " " + b + ")";
          st.push(s); R.push([NAME[t], "Pop " + b + " (right), pop " + a + " (left) → push " + s, st.join("  |  ")]);
        }
      });
      if (st.length !== 1) throw new Error("The RPN leaves " + st.length + " items on the stack instead of 1.");
      let r = st[0];
      if (r.startsWith("(") && r.endsWith(")")) r = r.slice(1, -1);
      return { rows: R, value: r };
    }
    function draw() {
      tableWrap.innerHTML = "";
      const t = h("table"), thead = h("thead"), tr = h("tr");
      cols.forEach((c) => tr.appendChild(h("th", { text: c })));
      thead.appendChild(tr); t.appendChild(thead);
      const tb = h("tbody");
      rows.slice(0, shown).forEach((r, i) => { const row = h("tr"); r.forEach((c, j) => row.appendChild(h("td", { text: c, style: (j === 1 ? "" : "font-family:var(--font-mono);white-space:nowrap;") + (i === shown - 1 ? "font-weight:700" : "") }))); tb.appendChild(row); });
      t.appendChild(tb); tableWrap.appendChild(t);
      result.textContent = shown >= rows.length ? finalMsg : "Step " + shown + " of " + rows.length + " — press ▶ Step to process the next token.";
      result.className = "output" + (shown >= rows.length ? " ok-text" : "");
      stepBtn.disabled = allBtn.disabled = shown >= rows.length;
    }
    function go() {
      err.style.display = "none";
      try {
        const tokens = tokenize(input.value);
        const mode = modeSel.value;
        if (mode === "infix") {
          const r = shunting(tokens);
          rows = r.rows; cols = ["Token", "Action", "Operator stack (top →)", "Output"];
          finalMsg = "RPN: " + disp(r.out);
          if (r.out.every((x) => isOp(x) || !isNaN(Number(x)))) { try { finalMsg += "\nValue: " + evalRPN(r.out).value; } catch (e) { /* e.g. division by zero */ } }
        } else if (mode === "eval") {
          const r = evalRPN(tokens);
          rows = r.rows; cols = ["Token", "Action", "Stack (top →)"]; finalMsg = "Result: " + r.value + "  (the single value left on the stack)";
        } else {
          const r = toInfix(tokens);
          rows = r.rows; cols = ["Token", "Action", "Stack (top →)"]; finalMsg = "Infix: " + r.value;
        }
        shown = 0; draw();
      } catch (e) {
        rows = []; shown = 0; tableWrap.innerHTML = ""; result.textContent = "";
        err.textContent = e.message; err.style.display = "";
      }
    }
    goBtn.addEventListener("click", go);
    input.addEventListener("keydown", (e) => e.key === "Enter" && go());
    modeSel.addEventListener("change", () => { input.value = modeSel.value === "infix" ? "3 + 4 * 2" : modeSel.value === "eval" ? "5 1 2 + 4 * + 3 -" : "a b + c d - *"; go(); });
    stepBtn.addEventListener("click", () => { if (shown < rows.length) shown++; draw(); });
    allBtn.addEventListener("click", () => { shown = rows.length; draw(); });
    resetBtn.addEventListener("click", () => { shown = 0; draw(); });
    if (params.mode && ["infix", "eval", "toinfix"].includes(params.mode)) modeSel.value = params.mode;
    go();
  },
});
