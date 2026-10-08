/* Call stack visualiser: step through recursive and nested subroutine calls, showing stack frames. */
CS.registerTool({
  id: "call-stack-visualiser",
  title: "Call stack visualiser",
  section: "1",
  topic: "1.6",
  icon: "📚",
  desc: "Step through factorial, Fibonacci, a recursive list sum or a chain of subroutine calls and watch stack frames being pushed and popped.",
  help:
    "Choose a program and its input, then press **▶ Step** (or **⏩ Run**). The highlighted line is the one being executed.\n\n" +
    "Each **stack frame** holds the subroutine's **return address** (the line to go back to in the caller), its **parameters** and its **local variables**. A call *pushes* a frame; a `RETURN` *pops* it and passes the **return value** back to the caller, which carries on from the return address.\n\n" +
    "Things to notice:\n\n" +
    "* Recursion needs a **base case**; each recursive call must move *towards* it. Tick **remove base case** on factorial to see what happens without one.\n" +
    "* The stack in this simulator holds at most **12 frames**. Ask for factorial(15) or a long list and the program fails with a **stack overflow** – a real call stack is bigger, but still finite.\n" +
    "* Fibonacci makes two recursive calls per frame: the **total calls** counter grows much faster than the **maximum depth**.",
  mount(el, params) {
    const h = CS.util.el;
    const LIMIT = 12;
    const PROGS = {
      fact: {
        name: "factorial(n)",
        input: "4",
        code: (broken) => ["FUNCTION factorial(n)", broken ? "  // base case removed!" : "  IF n = 0 THEN", broken ? "" : "    RETURN 1", broken ? "" : "  ELSE", "    RETURN n * factorial(n - 1)", broken ? "" : "  ENDIF", "ENDFUNCTION", "", "answer ← factorial(N)", "OUTPUT answer"],
      },
      fib: { name: "fibonacci(n)", input: "4", code: () => ["FUNCTION fib(n)", "  IF n <= 1 THEN", "    RETURN n", "  ENDIF", "  a ← fib(n - 1)", "  b ← fib(n - 2)", "  RETURN a + b", "ENDFUNCTION", "", "answer ← fib(N)", "OUTPUT answer"] },
      sum: { name: "sum of list (recursive)", input: "3, 5, 2", code: () => ["FUNCTION sumList(items, i)", "  IF i = LEN(items) THEN", "    RETURN 0", "  ENDIF", "  rest ← sumList(items, i + 1)", "  RETURN items[i] + rest", "ENDFUNCTION", "", "total ← sumList(LIST, 0)", "OUTPUT total"] },
      chain: { name: "main → a → b (no recursion)", input: "5", code: () => ["SUBROUTINE b(z)", "  w ← z * 2", "  RETURN w", "ENDSUBROUTINE", "SUBROUTINE a(x)", "  y ← x + 1", "  r ← b(y)", "  RETURN r + 10", "ENDSUBROUTINE", "", "result ← a(X)", "OUTPUT result"] },
    };

    // ---------- UI ----------
    const progSel = h("select", { "aria-label": "Program" });
    Object.keys(PROGS).forEach((k) => progSel.appendChild(h("option", { value: k, text: PROGS[k].name })));
    progSel.value = PROGS[params.program] ? params.program : "fact";
    const inp = h("input", { type: "text", style: "width:100px", "aria-label": "Input value" });
    const inpLbl = h("label", {}, ["n =", inp]);
    const brokenChk = h("input", { type: "checkbox" });
    const brokenLbl = h("label", {}, [brokenChk, "remove base case"]);
    const loadBtn = h("button", { class: "btn sm primary", type: "button", text: "Load" });
    const backBtn = h("button", { class: "btn sm", type: "button", text: "◀ Back" });
    const stepBtn = h("button", { class: "btn sm", type: "button", text: "▶ Step" });
    const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const speed = h("input", { type: "range", min: 1, max: 6, value: 3, style: "width:80px", "aria-label": "Run speed" });
    el.append(h("div", { class: "controls" }, [progSel, inpLbl, brokenLbl, loadBtn]), h("div", { class: "controls" }, [backBtn, stepBtn, runBtn, resetBtn, h("label", {}, ["speed", speed])]));
    const errBox = h("div", { class: "err", style: "min-height:1.2em" });
    const stat = h("div", { class: "stat-line" });
    const codeBox = h("div", { class: "output", style: "padding:8px 0;white-space:normal" });
    const stackBox = h("div", { style: "display:flex;flex-direction:column;gap:6px" });
    const msg = h("div", { class: "output", style: "margin-top:10px;min-height:3em;border-color:var(--accent)" });
    const outBox = h("div", { class: "stat-line" });
    el.append(errBox, stat, h("div", { class: "two-col" }, [h("div", {}, [h("div", { class: "bit-label", style: "text-align:left", text: "Source code" }), codeBox]), h("div", {}, [h("div", { class: "bit-label", style: "text-align:left", text: "Call stack (top of stack first) – limit " + LIMIT + " frames" }), stackBox])]), msg, outBox);

    let steps = [],
      idx = 0,
      timer = null,
      codeLines = [];

    // ---------- tracing engine (pre-computes every step) ----------
    function trace(prog, input, broken) {
      const S = [];
      const frames = [{ name: "main program", params: {}, locals: {}, ret: "—" }];
      let maxDepth = 1,
        calls = 0,
        output = "";
      const OVER = {};
      const copy = () => frames.map((f) => ({ name: f.name, params: Object.assign({}, f.params), locals: Object.assign({}, f.locals), ret: f.ret }));
      const snap = (line, text, popped) => {
        if (S.length > 3000) throw new Error("too many steps");
        S.push({ line, text, frames: copy(), popped, maxDepth, calls, output });
      };
      const sig = (name, p) => name + "(" + Object.keys(p).map((k) => k + " = " + fmt(p[k])).join(", ") + ")";
      const push = (name, p, locals, retLine) => {
        if (frames.length >= LIMIT) {
          snap(retLine, "STACK OVERFLOW! Calling " + sig(name, p) + " needs a new stack frame, but the stack already holds " + LIMIT + " frames (its limit). The program crashes." + (broken ? " With no base case the recursion never stops, so this always happens." : " The recursion is too deep for the space available."));
          throw OVER;
        }
        frames.push({ name, params: p, locals: Object.assign({}, locals), ret: retLine });
        calls++;
        maxDepth = Math.max(maxDepth, frames.length);
        snap(1 + (codeLines.findIndex((l) => l.includes(" " + name + "(")) || 0), "CALL " + sig(name, p) + ": push a new stack frame holding return address = line " + retLine + ", parameters " + Object.keys(p).map((k) => k + " = " + fmt(p[k])).join(", ") + (Object.keys(locals).length ? " and space for local variables " + Object.keys(locals).join(", ") : "") + ". Depth = " + frames.length + ".");
      };
      const pop = (val, line) => {
        const f = frames.pop();
        snap(f.ret, "RETURN " + fmt(val) + " (line " + line + "): pop the frame " + sig(f.name, f.params) + " off the stack; jump back to its return address, line " + f.ret + ", passing back " + fmt(val) + ".", { name: f.name, params: f.params, locals: f.locals, ret: f.ret, value: val });
        return val;
      };
      const top = () => frames[frames.length - 1];
      try {
        if (prog === "fact") {
          const fact = (n, ret) => {
            push("factorial", { n }, {}, ret);
            if (!broken) {
              snap(2, "IF n = 0 → " + n + " = 0 is " + (n === 0 ? "TRUE (base case)" : "FALSE (general case)"));
              if (n === 0) return snap(3, "RETURN 1"), pop(1, 3);
            }
            snap(5, "Evaluate n * factorial(n − 1): first call factorial(" + (n - 1) + "), so this frame waits at line 5.");
            const r = fact(n - 1, 5);
            snap(5, "Back in factorial(n = " + n + "): factorial(" + (n - 1) + ") returned " + r + " → n * " + r + " = " + n + " × " + r + " = " + n * r);
            return pop(n * r, 5);
          };
          snap(9, "Program starts: the main program's frame is at the bottom of the stack.");
          const r = fact(input, 9);
          top().locals.answer = r;
          snap(9, "answer ← " + r);
          output = String(r);
          snap(10, "OUTPUT answer → " + r + ". Program ends.");
        } else if (prog === "fib") {
          const fib = (n, ret) => {
            push("fib", { n }, { a: undefined, b: undefined }, ret);
            snap(2, "IF n <= 1 → " + n + " <= 1 is " + (n <= 1 ? "TRUE (base case)" : "FALSE"));
            if (n <= 1) return snap(3, "RETURN n = " + n), pop(n, 3);
            snap(5, "a ← fib(n − 1): call fib(" + (n - 1) + ")");
            const a = fib(n - 1, 5);
            top().locals.a = a;
            snap(5, "Back in fib(n = " + n + "): a ← " + a);
            snap(6, "b ← fib(n − 2): call fib(" + (n - 2) + ")");
            const b = fib(n - 2, 6);
            top().locals.b = b;
            snap(6, "Back in fib(n = " + n + "): b ← " + b);
            snap(7, "RETURN a + b = " + a + " + " + b + " = " + (a + b));
            return pop(a + b, 7);
          };
          snap(10, "Program starts: the main program's frame is at the bottom of the stack.");
          const r = fib(input, 10);
          top().locals.answer = r;
          snap(10, "answer ← " + r);
          output = String(r);
          snap(11, "OUTPUT answer → " + r + ". Program ends. Total calls: " + calls + ".");
        } else if (prog === "sum") {
          const L = input;
          const sum = (i, ret) => {
            push("sumList", { items: L, i }, { rest: undefined }, ret);
            snap(2, "IF i = LEN(items) → " + i + " = " + L.length + " is " + (i === L.length ? "TRUE (base case: nothing left to add)" : "FALSE"));
            if (i === L.length) return snap(3, "RETURN 0"), pop(0, 3);
            snap(5, "rest ← sumList(items, i + 1): call sumList(items, " + (i + 1) + ")");
            const r = sum(i + 1, 5);
            top().locals.rest = r;
            snap(5, "Back in sumList(i = " + i + "): rest ← " + r);
            snap(6, "RETURN items[i] + rest = items[" + i + "] + " + r + " = " + L[i] + " + " + r + " = " + (L[i] + r));
            return pop(L[i] + r, 6);
          };
          snap(9, "Program starts: the main program's frame is at the bottom of the stack.");
          const r = sum(0, 9);
          top().locals.total = r;
          snap(9, "total ← " + r);
          output = String(r);
          snap(10, "OUTPUT total → " + r + ". Program ends.");
        } else {
          snap(11, "Program starts: the main program's frame is at the bottom of the stack.");
          push("a", { x: input }, { y: undefined, r: undefined }, 11);
          top().locals.y = input + 1;
          snap(6, "y ← x + 1 = " + input + " + 1 = " + (input + 1) + " (local variable in a's frame)");
          snap(7, "r ← b(y): call b(" + (input + 1) + "); a's frame stays on the stack, waiting at line 7");
          push("b", { z: input + 1 }, { w: undefined }, 7);
          const w = (input + 1) * 2;
          top().locals.w = w;
          snap(2, "w ← z * 2 = " + (input + 1) + " × 2 = " + w + " (local to b – a cannot see it)");
          snap(3, "RETURN w = " + w);
          pop(w, 3);
          top().locals.r = w;
          snap(7, "Back in a at line 7: r ← " + w);
          snap(8, "RETURN r + 10 = " + w + " + 10 = " + (w + 10));
          pop(w + 10, 8);
          top().locals.result = w + 10;
          snap(11, "result ← " + (w + 10));
          output = String(w + 10);
          snap(12, "OUTPUT result → " + (w + 10) + ". Program ends.");
        }
      } catch (e) {
        if (e !== OVER) throw e;
        S[S.length - 1].overflow = true;
      }
      return S;
    }
    function fmt(v) {
      return v === undefined ? "?" : Array.isArray(v) ? "[" + v.join(", ") + "]" : String(v);
    }

    // ---------- load / validate ----------
    function load() {
      stop();
      errBox.textContent = "";
      const prog = progSel.value;
      const raw = inp.value.trim();
      let input;
      if (prog === "sum") {
        const parts = raw === "" ? [] : raw.split(/[\s,]+/).filter(Boolean);
        if (parts.some((p) => !/^-?\d+$/.test(p))) return fail("Enter whole numbers separated by commas, e.g. 3, 5, 2");
        if (parts.length > 20) return fail("Use at most 20 numbers.");
        input = parts.map(Number);
      } else {
        if (!/^-?\d+$/.test(raw)) return fail("Enter a whole number.");
        input = parseInt(raw, 10);
        if (prog === "fact" && (input < 0 || input > 20)) return fail("Use n from 0 to 20 (factorial is not defined for negative n).");
        if (prog === "fib" && (input < 0 || input > 8)) return fail("Use n from 0 to 8 – fib(n) makes so many calls that larger n gives thousands of steps.");
        if (prog === "chain" && Math.abs(input) > 1000) return fail("Use a number between −1000 and 1000.");
      }
      codeLines = PROGS[prog].code(brokenChk.checked && prog === "fact");
      codeLines = codeLines.map((l) => l.replace("(N)", "(" + input + ")").replace("(X)", "(" + input + ")").replace("LIST", "[" + (Array.isArray(input) ? input.join(", ") : "") + "]"));
      try {
        steps = trace(prog, input, brokenChk.checked && prog === "fact");
      } catch (e) {
        return fail("Could not trace this program: " + e.message);
      }
      idx = 0;
      render();
    }
    function fail(t) {
      errBox.textContent = t;
      steps = [];
      render();
    }

    // ---------- rendering ----------
    function render() {
      const s = steps[idx];
      codeBox.innerHTML = "";
      codeLines.forEach((line, i) => {
        const cur = s && s.line === i + 1;
        codeBox.appendChild(h("div", { style: "padding:0 10px;white-space:pre;" + (cur ? "background:" + (s.overflow ? "var(--bad-soft)" : "var(--accent-soft)") + ";font-weight:700;border-left:4px solid " + (s.overflow ? "var(--bad)" : "var(--accent)") : "border-left:4px solid transparent") }, [h("span", { style: "display:inline-block;width:2.2em;color:var(--text-3)", text: String(i + 1) }), line]));
      });
      stackBox.innerHTML = "";
      if (!s) {
        stat.textContent = "";
        msg.textContent = "Choose a program and press Load.";
        outBox.textContent = "";
        return;
      }
      if (s.popped) stackBox.appendChild(frameBox(s.popped, "popped"));
      for (let i = s.frames.length - 1; i >= 0; i--) stackBox.appendChild(frameBox(s.frames[i], i === s.frames.length - 1 ? "top" : ""));
      if (s.overflow) stackBox.prepend(h("div", { class: "cell bad", style: "height:auto;padding:6px", text: "✖ no room for another frame – STACK OVERFLOW" }));
      stat.textContent = "step " + (idx + 1) + "/" + steps.length + "   depth = " + s.frames.length + "   max depth = " + s.maxDepth + "   total calls = " + s.calls;
      msg.textContent = s.text;
      msg.style.borderColor = s.overflow ? "var(--bad)" : "var(--accent)";
      outBox.textContent = "Output: " + (s.output || "—");
      backBtn.disabled = idx === 0;
      stepBtn.disabled = runBtn.disabled = idx >= steps.length - 1 && !timer;
    }
    function frameBox(f, kind) {
      const isTop = kind === "top",
        isPop = kind === "popped";
      const box = h("div", { style: "border:2px " + (isPop ? "dashed var(--ok)" : "solid " + (isTop ? "var(--accent)" : "var(--border-2)")) + ";border-radius:8px;padding:6px 10px;font-family:var(--font-mono);font-size:0.8rem;background:" + (isPop ? "var(--ok-soft)" : isTop ? "var(--accent-soft)" : "var(--surface)") + (isPop ? ";opacity:.85" : "") });
      const ps = Object.keys(f.params).map((k) => k + " = " + fmt(f.params[k])).join(", ");
      box.appendChild(h("div", { style: "font-weight:700", text: f.name + (f.name === "main program" ? "" : "(" + ps + ")") + (isTop ? "   ← top" : "") + (isPop ? "   ↑ popped" : "") }));
      if (f.name !== "main program") box.appendChild(h("div", { text: "return address: line " + f.ret }));
      const ls = Object.keys(f.locals).map((k) => k + " = " + fmt(f.locals[k])).join(", ");
      if (ls) box.appendChild(h("div", { text: "locals: " + ls }));
      if (isPop) box.appendChild(h("div", { style: "color:var(--ok);font-weight:700", text: "return value: " + fmt(f.value) }));
      return box;
    }

    // ---------- controls ----------
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      runBtn.textContent = "⏩ Run";
    }
    function step() {
      if (idx < steps.length - 1) idx++;
      else stop();
      render();
    }
    stepBtn.addEventListener("click", () => (stop(), step()));
    backBtn.addEventListener("click", () => {
      stop();
      if (idx > 0) idx--;
      render();
    });
    runBtn.addEventListener("click", () => {
      if (timer) return stop(), render();
      if (!steps.length) return;
      runBtn.textContent = "⏸ Pause";
      timer = setInterval(() => {
        step();
        if (idx >= steps.length - 1) stop(), render();
      }, 1400 / parseInt(speed.value, 10));
    });
    resetBtn.addEventListener("click", () => {
      stop();
      idx = 0;
      render();
    });
    loadBtn.addEventListener("click", load);
    inp.addEventListener("keydown", (e) => e.key === "Enter" && load());
    brokenChk.addEventListener("change", load);
    progSel.addEventListener("change", () => {
      inp.value = PROGS[progSel.value].input;
      inpLbl.firstChild.textContent = progSel.value === "sum" ? "list =" : progSel.value === "chain" ? "a(x), x =" : "n =";
      brokenLbl.style.display = progSel.value === "fact" ? "" : "none";
      brokenChk.checked = false;
      load();
    });
    progSel.dispatchEvent(new Event("change"));
  },
});
