/* Haskell list lab: a tiny step-by-step evaluator for a subset of Haskell (lists, map/filter/folds, sections, lambdas, composition). */
CS.registerTool({
  id: "haskell-list-lab",
  title: "Haskell list lab",
  section: "12",
  topic: "12.2",
  icon: "λ",
  desc: "Type a Haskell list expression (map, filter, foldl, foldr, head, tail, ++, :) and watch it reduce step by step.",
  help:
    "Type an expression, or click an example, then press **Evaluate** (all steps) or **▶ Step** (one rewrite at a time).\n\n" +
    "**Supported:** whole numbers, `True`/`False`, lists `[1,2,3]`, `[]`, ranges `[1..10]`, `x : xs`, `xs ++ ys`, arithmetic `+ - *` `` `div` `` `` `mod` ``, comparisons `== /= < > <= >=`, `&&`, `||`, `$`; " +
    "functions `head tail null length map filter foldl foldr sum product reverse even odd not`, and `add` (pre-defined as `add x y = x + y`).\n\n" +
    "Functions can be **sections** `(*2)` `(+1)` `(>3)` `(==4)` `(2*)`, **operators as functions** `(+)` `(:)`, **lambdas** `\\x -> x*2` or `\\acc x -> acc + x`, **compositions** `(+1) . (*2)` and **partial applications** `add 1` or `map (*2)`.\n\n" +
    "Things to notice: `map` builds a new list (the original is never changed – no side effects); `filter` keeps the elements whose predicate is `True`; `foldl` brackets from the left `((0+1)+2)+3` and `foldr` from the right `1+(2+(3+0))`; `head []` is a run-time error.",
  mount(el, params) {
    const h = CS.util.el;
    const EXAMPLES = ["head [5,8,2]", "tail [5,8,2]", "null []", "length [4,7,1,9]", "3 : [4,5]", "[1,2] ++ [3,4]", "map (*2) [1,2,3]", "filter even [1..10]", "filter (>3) [1,5,2,7]", "foldl (+) 0 [1,2,3]", "foldr (+) 0 [1,2,3]", "map (\\x -> x*x + 1) [1,2,3]", "map ((+1) . (*2)) [1,2,3]", "map (add 1) [10,20]", "foldl (\\acc x -> acc*10 + x) 0 [1,2,3]", "head (filter odd (map (*3) [2,4,5]))", "foldr (:) [] [1,2,3]", "head []"];
    const ARITY = { head: 1, tail: 1, null: 1, length: 1, map: 2, filter: 2, foldl: 3, foldr: 3, even: 1, odd: 1, add: 2, sum: 1, product: 1, reverse: 1, not: 1 };
    const OPS = { ".": [9, "r"], "*": [7, "l"], "`div`": [7, "l"], "`mod`": [7, "l"], "+": [6, "l"], "-": [6, "l"], ":": [5, "r"], "++": [5, "r"], "==": [4, "n"], "/=": [4, "n"], "<": [4, "n"], ">": [4, "n"], "<=": [4, "n"], ">=": [4, "n"], "&&": [3, "r"], "||": [2, "r"], $: [0, "r"] };
    const ARITH = new Set(["+", "-", "*", "`div`", "`mod`", "==", "/=", "<", ">", "<=", ">=", "&&", "||"]);
    const TIGHT = new Set(["+", "-", "*"]);
    class HErr extends Error {}
    const fail = (m) => {
      throw new HErr(m);
    };

    // ---------- AST constructors ----------
    const Num = (n) => ({ t: "num", n }),
      Bool = (b) => ({ t: "bool", b }),
      List = (items) => ({ t: "list", items }),
      Var = (name) => ({ t: "var", name }),
      App = (f, a) => ({ t: "app", f, a }),
      Bin = (op, l, r) => ({ t: "bin", op, l, r }),
      Sec = (op, l, r) => ({ t: "sec", op, l, r }),
      OpFn = (op) => ({ t: "opfn", op }),
      Lam = (params, body) => ({ t: "lam", params, body });
    const mkApp = (f, args) => args.reduce((acc, a) => App(acc, a), f);

    // ---------- tokenizer ----------
    function tokenize(src) {
      const out = [];
      const re = /\s*(?:(\d+)|([A-Za-z_][A-Za-z0-9_']*)|(`[A-Za-z]+`)|(\.\.|->|\+\+|==|\/=|<=|>=|&&|\|\||[-+*<>:.\\()\[\],$]))/y;
      let pos = 0;
      src = src.replace(/\s+$/, "");
      while (pos < src.length) {
        re.lastIndex = pos;
        const m = re.exec(src);
        if (!m) {
          const c = src.slice(pos).trim()[0];
          if (c === '"' || c === "'") fail("Strings and characters aren't supported here – use lists of numbers.");
          if (c === "|") fail("List comprehensions and guards ( | ) aren't supported – use map and filter instead.");
          if (c === "=") fail("Definitions with = aren't supported: type an expression to evaluate (add is already defined: add x y = x + y).");
          if (c === "/") fail("Use `div` for whole-number division, e.g. 7 `div` 2.");
          fail("I don't understand the character '" + c + "'.");
        }
        pos = re.lastIndex;
        if (m[1]) out.push({ k: "num", v: m[1] });
        else if (m[2]) {
          if (["let", "where", "if", "then", "else", "case", "of", "in", "do"].includes(m[2])) fail("'" + m[2] + "' isn't supported in this lab – stick to single expressions using map, filter, folds, sections and lambdas.");
          out.push({ k: "id", v: m[2] });
        } else if (m[3]) {
          if (!OPS[m[3]]) fail("Only `div` and `mod` can be used in backticks here.");
          out.push({ k: "op", v: m[3] });
        } else out.push({ k: "op", v: m[4] });
      }
      return out;
    }

    // ---------- parser ----------
    function parse(src) {
      const toks = tokenize(src);
      if (!toks.length) fail("Type an expression first.");
      let i = 0;
      const peek = (o) => toks[i + (o || 0)];
      const isOp = (t, v) => t && t.k === "op" && t.v === v;
      const isBin = (t) => !!(t && t.k === "op" && OPS[t.v]);
      const expect = (v) => {
        if (!isOp(peek(), v)) fail("Expected '" + v + "'" + (peek() ? " but found '" + peek().v + "'" : " but the expression ended") + ".");
        i++;
      };
      function expr(minP) {
        let left = unary();
        for (;;) {
          const t = peek();
          if (!isBin(t) || isOp(peek(1), ")")) break;
          const [p, assoc] = OPS[t.v];
          if (p < minP) break;
          i++;
          const right = expr(assoc === "r" ? p : p + 1);
          left = t.v === "$" ? App(left, right) : Bin(t.v, left, right);
        }
        return left;
      }
      function unary() {
        if (isOp(peek(), "\\")) {
          i++;
          const ps = [];
          while (peek() && peek().k === "id") ps.push(peek().v), i++;
          if (!ps.length) fail("A lambda needs a parameter name, e.g. \\x -> x*2");
          if (ps.some((p) => ARITY[p] || p === "True" || p === "False")) fail("Pick a parameter name that isn't a built-in function.");
          expect("->");
          return Lam(ps, expr(0));
        }
        if (isOp(peek(), "-")) {
          i++;
          if (!peek() || peek().k !== "num") fail("Write negative numbers as (-3) or -3 in a list; unary minus on expressions isn't supported.");
          return Num(-parseInt(toks[i++].v, 10));
        }
        let f = atom();
        while (peek() && (peek().k === "num" || peek().k === "id" || isOp(peek(), "(") || isOp(peek(), "["))) f = App(f, atom());
        return f;
      }
      function atom() {
        const t = peek();
        if (!t) fail("The expression ended too early.");
        i++;
        if (t.k === "num") return Num(parseInt(t.v, 10));
        if (t.k === "id") return t.v === "True" ? Bool(true) : t.v === "False" ? Bool(false) : Var(t.v);
        if (t.v === "(") {
          const n = peek();
          if (isOp(n, "-") && peek(1) && peek(1).k === "num" && isOp(peek(2), ")")) return (i += 3), Num(-parseInt(peek(-2).v, 10));
          if (isBin(n) && n.v !== "$") {
            i++;
            if (isOp(peek(), ")")) return i++, OpFn(n.v);
            if (n.v === "-") fail("(- x) is not a section in Haskell. Use a lambda instead, e.g. (\\x -> x - 1).");
            const r = expr(0);
            expect(")");
            return Sec(n.v, null, r);
          }
          const e = expr(0);
          if (isBin(peek()) && isOp(peek(1), ")")) {
            const op = peek().v;
            i += 2;
            return Sec(op, e, null);
          }
          if (isOp(peek(), ",")) fail("Tuples aren't supported in this lab.");
          expect(")");
          return e;
        }
        if (t.v === "[") {
          if (isOp(peek(), "]")) return i++, List([]);
          const first = expr(0);
          if (isOp(peek(), "..")) {
            i++;
            if (isOp(peek(), "]")) fail("Infinite lists like [1..] can't be shown – give an end value, e.g. [1..10].");
            const last = expr(0);
            expect("]");
            if (first.t !== "num" || last.t !== "num") fail("Ranges need two numbers, e.g. [1..10].");
            if (last.n - first.n > 200) fail("Keep ranges to at most 200 elements.");
            const a = [];
            for (let k = first.n; k <= last.n; k++) a.push(Num(k));
            return List(a);
          }
          const items = [first];
          while (isOp(peek(), ",")) i++, items.push(expr(0));
          if (isOp(peek(), "|")) fail("List comprehensions aren't supported.");
          expect("]");
          return List(items);
        }
        fail("Unexpected '" + t.v + "'.");
      }
      const e = expr(0);
      if (i < toks.length) fail("I couldn't make sense of the expression from '" + toks[i].v + "' onwards.");
      checkNames(e, new Set());
      return e;
    }
    function checkNames(e, bound) {
      if (e.t === "var" && !bound.has(e.name) && !ARITY[e.name]) fail("Unknown name '" + e.name + "'. Built-ins: " + Object.keys(ARITY).join(", ") + ".");
      if (e.t === "lam") return checkNames(e.body, new Set([...bound, ...e.params]));
      ["f", "a", "l", "r", "body"].forEach((k) => e[k] && checkNames(e[k], bound));
      if (e.items) e.items.forEach((x) => checkNames(x, bound));
    }

    // ---------- printer ----------
    function opText(op) {
      return TIGHT.has(op) ? op : " " + op + " ";
    }
    function show(e, pos) {
      pos = pos || "top";
      switch (e.t) {
        case "num":
          return e.n < 0 && pos !== "top" && pos !== "list" ? "(" + e.n + ")" : String(e.n);
        case "bool":
          return e.b ? "True" : "False";
        case "list":
          return "[" + e.items.map((x) => show(x, "list")).join(",") + "]";
        case "var":
          return e.name;
        case "opfn":
          return "(" + e.op + ")";
        case "sec":
          return "(" + (e.l ? show(e.l, "op") + opText(e.op).trimEnd() : opText(e.op).trimStart() + show(e.r, "op")) + ")";
        case "lam": {
          const s = "\\" + e.params.join(" ") + " -> " + show(e.body);
          return pos === "top" || pos === "list" ? s : "(" + s + ")";
        }
        case "app": {
          const s = show(e.f, "fn") + " " + show(e.a, "arg");
          return pos === "arg" ? "(" + s + ")" : s;
        }
        case "bin": {
          const s = child(e, e.l, "l") + opText(e.op) + child(e, e.r, "r");
          return pos === "arg" || pos === "fn" ? "(" + s + ")" : s;
        }
      }
      return "?";
    }
    function child(parent, c, side) {
      if (c.t === "lam") return "(" + show(c) + ")";
      if (c.t === "app" && TIGHT.has(parent.op)) return "(" + show(c) + ")";
      if (c.t !== "bin") return show(c, "op");
      let paren;
      if (ARITH.has(parent.op) && ARITH.has(c.op) && TIGHT.has(parent.op)) paren = true; // always bracket nested arithmetic
      else {
        const [pp, pa] = OPS[parent.op],
          [cp] = OPS[c.op];
        paren = cp < pp || (cp === pp && !((pa === "l" && side === "l") || (pa === "r" && side === "r")));
      }
      const s = show(c, "op");
      return paren ? "(" + s + ")" : s;
    }

    // ---------- evaluator (one rewrite per call) ----------
    function subst(e, env) {
      switch (e.t) {
        case "var":
          return env.hasOwnProperty(e.name) ? env[e.name] : e;
        case "lam": {
          const inner = Object.assign({}, env);
          e.params.forEach((p) => delete inner[p]);
          return Lam(e.params, subst(e.body, inner));
        }
        case "app":
          return App(subst(e.f, env), subst(e.a, env));
        case "bin":
          return Bin(e.op, subst(e.l, env), subst(e.r, env));
        case "sec":
          return Sec(e.op, e.l && subst(e.l, env), e.r && subst(e.r, env));
        case "list":
          return List(e.items.map((x) => subst(x, env)));
      }
      return e;
    }
    function applyFn(f, args) {
      if (f.t === "sec") return mkApp(f.l ? Bin(f.op, f.l, args[0]) : Bin(f.op, args[0], f.r), args.slice(1));
      if (f.t === "opfn" && args.length >= 2) return mkApp(Bin(f.op, args[0], args[1]), args.slice(2));
      if (f.t === "lam") {
        const k = Math.min(f.params.length, args.length),
          env = {};
        for (let j = 0; j < k; j++) env[f.params[j]] = args[j];
        const body = subst(f.body, env);
        return mkApp(k < f.params.length ? Lam(f.params.slice(k), body) : body, args.slice(k));
      }
      return mkApp(f, args);
    }
    const isArith = (e) => e.t === "num" || e.t === "bool" || (e.t === "bin" && ARITH.has(e.op) && isArith(e.l) && isArith(e.r));
    function arith(e) {
      if (e.t !== "bin") return e;
      const a = arith(e.l),
        b = arith(e.r),
        op = e.op;
      const nums = () => (a.t === "num" && b.t === "num") || fail("'" + op.replace(/`/g, "") + "' needs two numbers, but got " + show(a) + " and " + show(b) + ".");
      switch (op) {
        case "+": return nums(), Num(a.n + b.n);
        case "-": return nums(), Num(a.n - b.n);
        case "*": return nums(), Num(a.n * b.n);
        case "`div`": return nums(), b.n === 0 && fail("Divide by zero!"), Num(Math.floor(a.n / b.n));
        case "`mod`": return nums(), b.n === 0 && fail("Divide by zero (mod 0)!"), Num(((a.n % b.n) + b.n) % b.n);
        case "<": return nums(), Bool(a.n < b.n);
        case ">": return nums(), Bool(a.n > b.n);
        case "<=": return nums(), Bool(a.n <= b.n);
        case ">=": return nums(), Bool(a.n >= b.n);
        case "==": case "/=": {
          if (a.t !== b.t) fail("Can't compare " + show(a) + " with " + show(b) + ": different types.");
          const eq = a.t === "num" ? a.n === b.n : a.b === b.b;
          return Bool(op === "==" ? eq : !eq);
        }
        default:
          if (a.t !== "bool" || b.t !== "bool") fail("'" + op + "' needs True/False values.");
          return Bool(op === "&&" ? a.b && b.b : a.b || b.b);
      }
    }
    function step(e) {
      switch (e.t) {
        case "list": {
          let changed = false,
            note;
          const items = e.items.map((x) => {
            const s = step(x);
            if (!s) return x;
            changed = true;
            note = note || s.note;
            return s.e;
          });
          return changed ? { e: List(items), note: note && note !== "arithmetic" ? note : "evaluate each element" } : null;
        }
        case "bin": {
          if (e.op === ".") return null;
          if (isArith(e)) return { e: arith(e), note: "arithmetic" };
          let s = step(e.l);
          if (s) return { e: Bin(e.op, s.e, e.r), note: s.note };
          s = step(e.r);
          if (s) return { e: Bin(e.op, e.l, s.e), note: s.note };
          if (e.op === ":") return e.r.t === "list" ? { e: List([e.l].concat(e.r.items)), note: "(:) puts " + show(e.l) + " on the front of the list" } : fail("(:) needs a list on its right, e.g. 1 : [2,3] – got " + show(e.r) + ".");
          if (e.op === "++") return e.l.t === "list" && e.r.t === "list" ? { e: List(e.l.items.concat(e.r.items)), note: "(++) joins two lists" } : fail("(++) joins two lists, e.g. [1,2] ++ [3] – got " + show(e.l) + " and " + show(e.r) + ".");
          return fail("'" + e.op.replace(/`/g, "") + "' can't be used on " + show(e.l) + " and " + show(e.r) + ". Did you mean (:) or (++) for lists?");
        }
        case "app": {
          const args = [];
          let hd = e;
          while (hd.t === "app") args.unshift(hd.a), (hd = hd.f);
          if (hd.t === "lam") return { e: applyFn(hd, args), note: "substitute " + hd.params.slice(0, args.length).map((p, j) => p + " = " + show(args[j], "op")).join(", ") + " into the lambda body" };
          if (hd.t === "sec") return { e: applyFn(hd, args), note: "apply the section " + show(hd) + " to " + show(args[0], "op") };
          if (hd.t === "opfn") return args.length < 2 ? null : { e: applyFn(hd, args), note: "use " + show(hd) + " as an infix operator" };
          if (hd.t === "bin" && hd.op === ".") return { e: mkApp(App(hd.l, App(hd.r, args[0])), args.slice(1)), note: "composition: (f . g) x = f (g x)" };
          if (hd.t === "var") {
            const n = ARITY[hd.name];
            if (args.length < n) return null; // partial application is a value
            const r = builtin(hd.name, args.slice(0, n));
            if (r.args) return { e: mkApp(hd, r.args.concat(args.slice(n))), note: r.note };
            return { e: mkApp(r.e, args.slice(n)), note: r.note };
          }
          const s = step(hd);
          if (s) return { e: mkApp(s.e, args), note: s.note };
          return fail(show(hd) + " is not a function, so it can't be applied to " + show(args[0], "arg") + ".");
        }
      }
      return null;
    }
    function builtin(name, a) {
      const force = (i, kind) => {
        const s = step(a[i]);
        if (s) {
          const na = a.slice();
          na[i] = s.e;
          return { args: na, note: s.note };
        }
        if (kind === "list" && a[i].t !== "list") fail(name + " expects a list, but got " + show(a[i]) + ".");
        if (kind === "num" && a[i].t !== "num") fail(name + " expects a number, but got " + show(a[i]) + ".");
        if (kind === "bool" && a[i].t !== "bool") fail(name + " expects True or False, but got " + show(a[i]) + ".");
        return null;
      };
      const li = { head: 0, tail: 0, null: 0, length: 0, sum: 0, product: 0, reverse: 0, map: 1, filter: 1, foldl: 2, foldr: 2 }[name];
      if (li != null) {
        const f = force(li, "list");
        if (f) return f;
      }
      const xs = li != null ? a[li].items : null;
      switch (name) {
        case "head": return xs.length ? { e: xs[0], note: "head returns the first element" } : fail("head [] is a run-time error: the empty list has no head (*** Exception: Prelude.head: empty list).");
        case "tail": return xs.length ? { e: List(xs.slice(1)), note: "tail returns the list without its first element" } : fail("tail [] is a run-time error: the empty list has no tail.");
        case "null": return { e: Bool(!xs.length), note: "null tests whether the list is empty" };
        case "length": return { e: Num(xs.length), note: "length counts the elements" };
        case "reverse": return { e: List(xs.slice().reverse()), note: "reverse" };
        case "sum": case "product": {
          if (!xs.length) return { e: Num(name === "sum" ? 0 : 1), note: name + " of [] is " + (name === "sum" ? 0 : 1) };
          return { e: xs.slice(1).reduce((acc, x) => Bin(name === "sum" ? "+" : "*", acc, x), xs[0]), note: name + " combines all the elements" };
        }
        case "map": return { e: List(xs.map((x) => applyFn(a[0], [x]))), note: "map applies " + show(a[0], "op") + " to every element" };
        case "filter": {
          const tests = [];
          const kept = xs.filter((x) => {
            const r = evalFull(applyFn(a[0], [x]));
            if (r.t !== "bool") fail("The filter predicate must give True or False, but " + show(applyFn(a[0], [x])) + " gave " + show(r) + ".");
            tests.push(show(applyFn(a[0], [x])) + " → " + (r.b ? "True ✓" : "False ✗"));
            return r.b;
          });
          return { e: List(kept), note: "filter keeps elements where the predicate is True: " + (tests.join("; ") || "nothing to test") };
        }
        case "foldl":
          return { e: xs.reduce((acc, x) => applyFn(a[0], [acc, x]), a[1]), note: xs.length ? "foldl combines from the LEFT, starting with " + show(a[1], "op") : "foldl f z [] = z" };
        case "foldr":
          return { e: xs.reduceRight((acc, x) => applyFn(a[0], [x, acc]), a[1]), note: xs.length ? "foldr combines from the RIGHT, ending with " + show(a[1], "op") : "foldr f z [] = z" };
        case "even": case "odd": {
          const f = force(0, "num");
          if (f) return f;
          const ev = ((a[0].n % 2) + 2) % 2 === 0;
          return { e: Bool(name === "even" ? ev : !ev), note: a[0].n + " `mod` 2 = " + (ev ? 0 : 1) };
        }
        case "not": {
          const f = force(0, "bool");
          return f || { e: Bool(!a[0].b), note: "not" };
        }
        case "add": return { e: Bin("+", a[0], a[1]), note: "add x y = x + y" };
      }
      return fail("Unknown function " + name);
    }
    function evalFull(e) {
      for (let k = 0; k < 400; k++) {
        const s = step(e);
        if (!s) return e;
        e = s.e;
      }
      fail("Evaluation took too many steps.");
    }

    // ---------- UI ----------
    const input = h("input", { type: "text", value: params.expr || "map (*2) [1,2,3]", style: "flex:1;min-width:200px;font-family:var(--font-mono)", "aria-label": "Haskell expression", spellcheck: "false", autocomplete: "off" });
    const evalBtn = h("button", { class: "btn sm primary", type: "button", text: "Evaluate" });
    const stepBtn = h("button", { class: "btn sm", type: "button", text: "▶ Step" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const exWrap = h("div", { class: "controls", style: "gap:5px" }, [h("span", { class: "bit-label", text: "Examples:" })]);
    EXAMPLES.forEach((x) =>
      exWrap.appendChild(
        h("button", {
          class: "btn sm",
          type: "button",
          style: "font-family:var(--font-mono);font-weight:500",
          text: x,
          onclick: () => {
            input.value = x;
            run(true);
          },
        })
      )
    );
    const errBox = h("div", { class: "err", style: "min-height:1.2em" });
    const out = h("div", { class: "steps-out", style: "font-family:var(--font-mono);font-size:0.88rem;overflow-x:auto" });
    const result = h("div", { class: "stat-line", style: "font-size:1rem" });
    el.append(h("div", { class: "controls" }, [input, evalBtn, stepBtn, resetBtn]), exWrap, errBox, out, result);

    let trace = null,
      shown = 0,
      traceSrc = "";
    function build() {
      const src = input.value.trim();
      const T = { src, steps: [], error: null };
      try {
        let e = parse(src);
        T.steps.push({ text: show(e) });
        for (let k = 0; k < 80; k++) {
          const s = step(e);
          if (!s) break;
          e = s.e;
          const text = show(e);
          if (text.length > 1500) fail("The expression grew too large to display – try a shorter list.");
          T.steps.push({ text, note: s.note });
          if (k === 79) fail("Stopped after 80 steps.");
        }
        T.final = e;
      } catch (err) {
        if (!(err instanceof HErr) && !(err instanceof RangeError)) console.warn(err);
        T.error = err instanceof HErr ? err.message : "Sorry – that expression is too complicated for this little evaluator.";
      }
      return T;
    }
    function render() {
      out.innerHTML = "";
      errBox.textContent = "";
      result.textContent = "";
      if (!trace) return;
      const ol = h("ol", { style: "list-style:none;padding-left:0;margin:0" });
      trace.steps.slice(0, shown).forEach((s, k) => {
        const li = h("li", { style: "padding:3px 0;border-bottom:1px dashed var(--border)" }, [h("span", { style: "color:var(--text-3);display:inline-block;width:1.6em", text: k ? "→" : "" }), h("span", { style: "white-space:pre-wrap", text: s.text })]);
        if (s.note) li.appendChild(h("div", { style: "color:var(--text-3);font-size:0.78rem;padding-left:1.6em;font-family:var(--font-body)", text: "-- " + s.note }));
        ol.appendChild(li);
      });
      out.appendChild(ol);
      const done = shown >= trace.steps.length;
      if (done && trace.error) errBox.textContent = trace.error;
      else if (done && trace.final) {
        const f = trace.final;
        const isVal = f.t === "num" || f.t === "bool" || f.t === "list";
        result.innerHTML = isVal ? "Result: <b class='ok-text'>" + CS.util.esc(show(f)) + "</b>   (" + (trace.steps.length - 1) + " step" + (trace.steps.length === 2 ? "" : "s") + ")" : "This is a <b>function</b> (e.g. a partial application) – give it more arguments to get a value, e.g. (" + CS.util.esc(show(f)) + ") 5";
      } else result.textContent = "step " + shown + " of " + trace.steps.length + " – press ▶ Step";
    }
    function run(all) {
      if (!trace || traceSrc !== input.value.trim()) {
        trace = build();
        traceSrc = trace.src;
        shown = all ? trace.steps.length : 1;
      } else shown = all ? trace.steps.length : Math.min(trace.steps.length, shown + 1);
      if (all) shown = trace.steps.length;
      render();
    }
    evalBtn.addEventListener("click", () => {
      trace = null;
      run(true);
    });
    stepBtn.addEventListener("click", () => run(false));
    resetBtn.addEventListener("click", () => {
      trace = null;
      out.innerHTML = "";
      result.textContent = "";
      errBox.textContent = "";
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        trace = null;
        run(true);
      }
    });
    run(true);
  },
});
