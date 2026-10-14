/* Logic gate simulator: preset circuits or a circuit built from a Boolean expression; toggle inputs, live outputs, truth table, D-type flip-flop. */
CS.registerTool({
  id: "logic-gate-sim",
  title: "Logic gate simulator",
  section: "6",
  topic: "6.4",
  icon: "🔌",
  desc: "Toggle the inputs of logic circuits (half adder, full adder, NAND-only gates, D-type flip-flop…) or build one from a Boolean expression; see live outputs and the truth table.",
  help:
    "Pick a **preset** or choose *Build from expression* and type one, e.g. `NOT (A AND B) OR C`, `A.B + ¬C`, `(A + B)'`, `A XOR B`, `A NAND B`. Variables are single letters A–Z; `.` `AND` mean AND, `+` `OR` mean OR, `¬` `NOT` `~` or a trailing `'` mean NOT, `⊕` `XOR` mean XOR.\n\n" +
    "Click an **input button** (or a row of the truth table) to change the inputs. Wires carrying **1** are drawn thick and green; each gate shows its output. The **truth table** is generated from the circuit, and the Boolean expression for every output is written underneath.\n\n" +
    "The **D-type flip-flop** preset is different: it has memory. Q only changes on a **rising edge** of the clock (CLK going 0 → 1), when it copies D. Change D while the clock is steady and Q *holds* its value. The timing diagram records what happened.",
  mount(el, params) {
    const h = CS.util.el;
    const esc = CS.util.esc;
    class GErr extends Error {}
    const G = (id, type, ins) => ({ id, type, ins });
    const PRESETS = {
      half: { name: "Half adder", inputs: ["A", "B"], gates: [G("g1", "XOR", ["A", "B"]), G("g2", "AND", ["A", "B"])], outputs: [["S", "g1"], ["C", "g2"]], note: "S (sum) = A XOR B and C (carry) = A AND B: adds two bits." },
      full: { name: "Full adder", inputs: ["A", "B", "Cin"], gates: [G("x1", "XOR", ["A", "B"]), G("x2", "XOR", ["x1", "Cin"]), G("a1", "AND", ["A", "B"]), G("a2", "AND", ["x1", "Cin"]), G("o1", "OR", ["a1", "a2"])], outputs: [["S", "x2"], ["Cout", "o1"]], note: "Two half adders and an OR gate: adds A, B and a carry in. Chain full adders to add binary numbers." },
      dff: { name: "D-type flip-flop (edge-triggered)", dff: true },
      nandnot: { name: "NOT from NAND only", inputs: ["A"], gates: [G("n1", "NAND", ["A", "A"])], outputs: [["Q", "n1"]], note: "Tie both NAND inputs together: ¬(A.A) = ¬A." },
      nandand: { name: "AND from NAND only", inputs: ["A", "B"], gates: [G("n1", "NAND", ["A", "B"]), G("n2", "NAND", ["n1", "n1"])], outputs: [["Q", "n2"]], note: "NAND followed by a NAND-as-NOT: ¬¬(A.B) = A.B." },
      nandor: { name: "OR from NAND only", inputs: ["A", "B"], gates: [G("n1", "NAND", ["A", "A"]), G("n2", "NAND", ["B", "B"]), G("n3", "NAND", ["n1", "n2"])], outputs: [["Q", "n3"]], note: "De Morgan: ¬(¬A.¬B) = A + B." },
      xor3: { name: "XOR from AND, OR, NOT", inputs: ["A", "B"], gates: [G("na", "NOT", ["A"]), G("nb", "NOT", ["B"]), G("a1", "AND", ["A", "nb"]), G("a2", "AND", ["na", "B"]), G("o1", "OR", ["a1", "a2"])], outputs: [["Q", "o1"]], note: "A ⊕ B = A.¬B + ¬A.B." },
      major: { name: "Majority voter (exam style)", inputs: ["A", "B", "C"], gates: [G("a1", "AND", ["A", "B"]), G("a2", "AND", ["B", "C"]), G("a3", "AND", ["A", "C"]), G("o1", "OR", ["a1", "a2", "a3"])], outputs: [["Q", "o1"]], note: "Output is 1 when at least two of the three inputs are 1." },
      exam1: { name: "Exam circuit: ¬(A.B) + C", inputs: ["A", "B", "C"], gates: [G("n1", "NAND", ["A", "B"]), G("o1", "OR", ["n1", "C"])], outputs: [["Q", "o1"]], note: "A NAND gate feeding an OR gate." },
      exam2: { name: "Exam circuit: (A + B).¬C", inputs: ["A", "B", "C"], gates: [G("o1", "OR", ["A", "B"]), G("n1", "NOT", ["C"]), G("a1", "AND", ["o1", "n1"])], outputs: [["Q", "a1"]], note: "An alarm sounds (Q = 1) if door A or window B is open and the system is not disarmed (C = 0)." },
      expr: { name: "Build from expression…", expr: true },
    };
    const FN = { AND: (a) => a.every(Boolean), OR: (a) => a.some(Boolean), NOT: (a) => !a[0], NAND: (a) => !a.every(Boolean), NOR: (a) => !a.some(Boolean), XOR: (a) => a.reduce((x, y) => x !== !!y, false) };

    // ---------- expression parser → netlist ----------
    function parseExpr(src) {
      const toks = [];
      const re = /\s*(?:(AND|OR|NOT|XOR|NAND|NOR)\b|([A-Za-z])|([().·*&+|¬~!'⊕^]))/iy;
      let p = 0;
      src = src.replace(/\s+$/, "");
      while (p < src.length) {
        re.lastIndex = p;
        const m = re.exec(src);
        if (!m) throw new GErr("I don't understand '" + src.slice(p).trim()[0] + "'. Use letters A–Z, brackets and AND/OR/NOT/XOR/NAND/NOR (or . + ¬ ⊕).");
        p = re.lastIndex;
        if (m[1]) toks.push({ k: "op", v: m[1].toUpperCase() });
        else if (m[2]) toks.push({ k: "var", v: m[2].toUpperCase() });
        else toks.push({ k: "op", v: { "·": "AND", ".": "AND", "*": "AND", "&": "AND", "+": "OR", "|": "OR", "¬": "NOT", "~": "NOT", "!": "NOT", "⊕": "XOR", "^": "XOR", "'": "'", "(": "(", ")": ")" }[m[3]] });
      }
      if (!toks.length) throw new GErr("Type an expression first, e.g. A.B + ¬C");
      let i = 0;
      const peek = () => toks[i];
      const isOp = (v) => peek() && peek().k === "op" && peek().v === v;
      const bin = (next, ops) => () => {
        let l = next();
        while (peek() && peek().k === "op" && ops.includes(peek().v)) {
          const op = toks[i++].v;
          l = { op, args: [l, next()] };
        }
        return l;
      };
      const unary = () => {
        let e;
        if (isOp("NOT")) {
          i++;
          e = { op: "NOT", args: [unary()] };
          return e;
        }
        if (isOp("(")) {
          i++;
          e = orE();
          if (!isOp(")")) throw new GErr("A bracket is missing: expected ')'.");
          i++;
        } else if (peek() && peek().k === "var") e = { v: toks[i++].v };
        else throw new GErr(peek() ? "Unexpected '" + peek().v + "'." : "The expression ended too early.");
        while (isOp("'")) (i++, (e = { op: "NOT", args: [e] }));
        return e;
      };
      const andE = () => {
        let l = unary();
        for (;;) {
          if (isOp("AND") || isOp("NAND")) {
            const op = toks[i++].v;
            l = { op, args: [l, unary()] };
          } else if (peek() && (peek().k === "var" || isOp("(") || isOp("NOT"))) l = { op: "AND", args: [l, unary()] };
          else return l;
        }
      };
      const xorE = bin(andE, ["XOR"]);
      const orE = bin(xorE, ["OR", "NOR"]);
      const e = orE();
      if (i < toks.length) throw new GErr("Unexpected '" + toks[i].v + "' – check the brackets.");
      return e;
    }
    function netFromExpr(ast) {
      const vars = new Set();
      const gates = [];
      const memo = {};
      const key = (e) => (e.v ? e.v : e.op + "(" + e.args.map(key).join(",") + ")");
      const flat = (e) => (["AND", "OR"].includes(e.op) ? e.args.flatMap((a) => (a.op === e.op ? flat(a) : [a])) : e.args);
      function build(e) {
        if (e.v) return vars.add(e.v), e.v;
        const k = key(e);
        if (memo[k]) return memo[k];
        let args = flat(e);
        if (args.length > 4) args = e.args;
        const ins = args.map(build);
        const id = "g" + (gates.length + 1);
        gates.push(G(id, e.op, ins));
        return (memo[k] = id);
      }
      const out = build(ast);
      if (vars.size > 6) throw new GErr("Use at most 6 different input letters.");
      if (gates.length > 24) throw new GErr("That expression needs too many gates to draw – keep it to about 20 gates.");
      return { name: "Expression", inputs: [...vars].sort(), gates, outputs: [["Q", out]], note: "" };
    }

    // ---------- UI ----------
    const presetSel = h("select", { "aria-label": "Circuit" });
    Object.keys(PRESETS).forEach((k) => presetSel.appendChild(h("option", { value: k, text: PRESETS[k].name })));
    const exprIn = h("input", { type: "text", value: params.expr || "NOT (A AND B) OR C", style: "min-width:200px;flex:1;font-family:var(--font-mono)", "aria-label": "Boolean expression" });
    const buildBtn = h("button", { class: "btn sm primary", type: "button", text: "Build circuit" });
    const exprRow = h("div", { class: "controls" }, [exprIn, buildBtn]);
    const toggles = h("div", { class: "controls" });
    const errBox = h("div", { class: "err", style: "min-height:1.2em" });
    const svgWrap = h("div", { style: "overflow-x:auto;border:1px solid var(--border);border-radius:10px;background:var(--bg-2);padding:4px" });
    const exprBox = h("div", { class: "stat-line", style: "font-size:0.95rem" });
    const note = h("div", { class: "explain" });
    const side = h("div");
    el.append(h("div", { class: "controls" }, [presetSel]), exprRow, toggles, errBox, svgWrap, exprBox, note, side);

    let circ = null,
      vals = {},
      dff = null;

    function evaluate(c, inp) {
      const v = Object.assign({}, inp);
      c.gates.forEach((g) => (v[g.id] = FN[g.type](g.ins.map((s) => v[s])) ? 1 : 0));
      return v;
    }
    function exprOf(c, id, top) {
      if (c.inputs.includes(id)) return esc(id);
      const g = c.gates.find((x) => x.id === id);
      const sub = (s) => {
        const sg = c.gates.find((x) => x.id === s);
        const t = exprOf(c, s);
        return sg && !["NOT", "NAND", "NOR"].includes(sg.type) && sg.type !== g.type ? "(" + t + ")" : t;
      };
      const over = (t) => "<span style='text-decoration:overline' data-not='1'>" + t + "</span>";
      if (g.type === "NOT") return over(exprOf(c, g.ins[0]));
      if (g.type === "NAND" && g.ins.every((s) => s === g.ins[0])) return over(exprOf(c, g.ins[0]));
      const sym = { AND: ".", NAND: ".", OR: " + ", NOR: " + ", XOR: " ⊕ " }[g.type];
      const body = g.ins.map(sub).join(sym);
      return g.type === "NAND" || g.type === "NOR" ? over(body) : body;
    }

    // ---------- drawing ----------
    const SVG = "http://www.w3.org/2000/svg";
    const sv = (tag, a, txt) => {
      const e = document.createElementNS(SVG, tag);
      for (const k in a) e.setAttribute(k, a[k]);
      if (txt != null) e.textContent = txt;
      return e;
    };
    function layout(c) {
      const lvl = {};
      c.inputs.forEach((x) => (lvl[x] = 0));
      c.gates.forEach((g) => (lvl[g.id] = 1 + Math.max(...g.ins.map((s) => lvl[s]))));
      const maxL = Math.max(1, ...c.gates.map((g) => lvl[g.id]));
      const busX = (k) => 26 + k * 18;
      const x0 = busX(c.inputs.length) + 40;
      const pos = {};
      const gh = (g) => Math.max(34, g.ins.length * 14 + 6);
      // input y positions: initial guess
      let y = 40;
      for (let L = 1; L <= maxL; L++) {
        const col = c.gates.filter((g) => lvl[g.id] === L);
        const want = col.map((g, k) => {
          const ys = g.ins.filter((s) => pos[s]).map((s) => pos[s].y);
          return { g, d: ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 40 + k * 60 };
        });
        want.sort((a, b) => a.d - b.d);
        let last = -1e9;
        want.forEach((w) => {
          const yy = Math.max(w.d, last + gh(w.g) + 22, 40);
          pos[w.g.id] = { x: x0 + (L - 1) * 120, y: yy, h: gh(w.g) };
          last = yy;
        });
        y = Math.max(y, last);
      }
      const H = y + 50;
      return { lvl, pos, busX, H, W: x0 + maxL * 120 + 70 };
    }
    function gateShape(g, p, on) {
      const W = 46,
        x = p.x,
        top = p.y - p.h / 2,
        bot = p.y + p.h / 2,
        cy = p.y;
      const stroke = "var(--text)",
        fill = on ? "var(--ok-soft)" : "var(--surface)";
      const grp = sv("g", {});
      const base = g.type.replace(/^N(AND|OR)$/, "$1");
      let d;
      if (g.type === "NOT") d = "M" + x + " " + (cy - 15) + " L" + (x + W - 10) + " " + cy + " L" + x + " " + (cy + 15) + " Z";
      else if (base === "AND") d = "M" + x + " " + top + " L" + (x + W - p.h / 2) + " " + top + " A" + p.h / 2 + " " + p.h / 2 + " 0 0 1 " + (x + W - p.h / 2) + " " + bot + " L" + x + " " + bot + " Z";
      else {
        const xs = base === "XOR" ? x + 6 : x;
        d = "M" + xs + " " + top + " Q" + (xs + 0.6 * W) + " " + top + " " + (x + W) + " " + cy + " Q" + (xs + 0.6 * W) + " " + bot + " " + xs + " " + bot + " Q" + (xs + 12) + " " + cy + " " + xs + " " + top + " Z";
        if (base === "XOR") grp.appendChild(sv("path", { d: "M" + x + " " + top + " Q" + (x + 12) + " " + cy + " " + x + " " + bot, fill: "none", stroke, "stroke-width": 2 }));
      }
      grp.appendChild(sv("path", { d, fill, stroke, "stroke-width": 2 }));
      const bubble = g.type === "NOT" || g.type === "NAND" || g.type === "NOR";
      if (bubble) grp.appendChild(sv("circle", { cx: x + W + (g.type === "NOT" ? -6 : 4), cy, r: 4, fill: "var(--surface)", stroke, "stroke-width": 2 }));
      grp.appendChild(sv("text", { x: x + W / 2 - 4, y: bot + 13, "text-anchor": "middle", "font-size": 9, fill: "var(--text-3)" }, g.type));
      const outX = x + W + (bubble && g.type !== "NOT" ? 8 : g.type === "NOT" ? -2 : 0);
      const pins = g.ins.map((s, k) => (g.type === "NOT" ? cy : top + ((k + 1) * p.h) / (g.ins.length + 1)));
      const backX = base === "AND" || g.type === "NOT" ? x : (base === "XOR" ? x + 6 : x) + 6;
      return { grp, outX, pins, backX };
    }
    function draw() {
      const c = circ;
      const L = layout(c);
      const v = vals;
      const svg = sv("svg", { width: L.W, height: L.H, viewBox: "0 0 " + L.W + " " + L.H, style: "display:block;max-width:none;font-family:var(--font-mono);font-size:12px", role: "img", "aria-label": "Logic circuit diagram" });
      const wire = (d, on) => svg.appendChild(sv("path", { d, fill: "none", stroke: on ? "var(--ok)" : "var(--text-3)", "stroke-width": on ? 3 : 1.5 }));
      // input buses
      c.inputs.forEach((name, k) => {
        const bx = L.busX(k);
        const on = v[name];
        wire("M" + bx + " 24 L" + bx + " " + (L.H - 10), on);
        const lab = sv("g", { style: "cursor:pointer" });
        lab.appendChild(sv("rect", { x: bx - 9, y: 4, width: 18, height: 18, rx: 4, fill: on ? "var(--ok)" : "var(--surface)", stroke: "var(--border-2)" }));
        lab.appendChild(sv("text", { x: bx, y: 17, "text-anchor": "middle", fill: on ? "#fff" : "var(--text)", "font-weight": 700, "font-size": 11 }, name.length > 2 ? name[0] : name));
        lab.addEventListener("click", () => toggle(name));
        svg.appendChild(lab);
      });
      const outPts = {};
      c.inputs.forEach((name, k) => (outPts[name] = { x: L.busX(k), bus: true }));
      const shapes = {};
      c.gates.forEach((g) => {
        const s = gateShape(g, L.pos[g.id], v[g.id]);
        shapes[g.id] = s;
        outPts[g.id] = { x: s.outX, y: L.pos[g.id].y };
      });
      c.gates.forEach((g) => {
        const s = shapes[g.id];
        g.ins.forEach((src, k) => {
          const py = s.pins[k],
            on = v[src];
          const o = outPts[src];
          if (o.bus) {
            wire("M" + o.x + " " + py + " L" + s.backX + " " + py, on);
            svg.appendChild(sv("circle", { cx: o.x, cy: py, r: 3, fill: on ? "var(--ok)" : "var(--text-3)" }));
          } else {
            const mx = L.pos[g.id].x - 14 - k * 5;
            wire("M" + o.x + " " + o.y + " L" + mx + " " + o.y + " L" + mx + " " + py + " L" + s.backX + " " + py, on);
          }
        });
      });
      c.gates.forEach((g) => {
        svg.appendChild(shapes[g.id].grp);
        const p = L.pos[g.id];
        svg.appendChild(sv("text", { x: shapes[g.id].outX + 3, y: p.y - 6, fill: v[g.id] ? "var(--ok)" : "var(--text-3)", "font-weight": 700, "font-size": 11 }, String(v[g.id])));
      });
      const ox = L.W - 50;
      c.outputs.forEach(([name, src]) => {
        const o = outPts[src];
        const on = v[src];
        const y = o.bus ? 40 : o.y;
        wire("M" + o.x + " " + y + " L" + ox + " " + y, on);
        svg.appendChild(sv("rect", { x: ox, y: y - 11, width: 44, height: 22, rx: 11, fill: on ? "var(--ok)" : "var(--surface)", stroke: "var(--border-2)" }));
        svg.appendChild(sv("text", { x: ox + 22, y: y + 4, "text-anchor": "middle", fill: on ? "#fff" : "var(--text)", "font-weight": 700, class: "out-" + name }, name + "=" + on));
      });
      svgWrap.innerHTML = "";
      svgWrap.appendChild(svg);
    }
    function renderToggles(names) {
      toggles.innerHTML = "";
      names.forEach((n) => {
        const b = h("button", { class: "btn sm" + (vals[n] ? " ok" : ""), type: "button", text: n + " = " + (vals[n] || 0), "aria-pressed": vals[n] ? "true" : "false", "data-input": n });
        b.addEventListener("click", () => toggle(n));
        toggles.appendChild(b);
      });
    }
    function toggle(n) {
      vals[n] = vals[n] ? 0 : 1;
      refresh();
    }
    function truthTable() {
      const c = circ,
        n = c.inputs.length;
      const wrap = h("div", { class: "table-wrap", style: "margin-top:10px" });
      const tbl = h("table", { class: "truth", style: "border-collapse:collapse;width:auto;min-width:200px" });
      tbl.appendChild(h("thead", {}, h("tr", {}, c.inputs.map((x) => h("th", { text: x, style: "text-transform:none" })).concat(c.outputs.map(([o]) => h("th", { text: o, style: "text-transform:none;color:var(--accent)" }))))));
      const tb = h("tbody");
      for (let r = 0; r < 1 << n; r++) {
        const inp = {};
        c.inputs.forEach((x, k) => (inp[x] = (r >> (n - 1 - k)) & 1));
        const res = evaluate(c, inp);
        const cur = c.inputs.every((x) => inp[x] === (vals[x] || 0));
        const tr = h("tr", { tabindex: "0", style: "cursor:pointer;" + (cur ? "background:var(--accent-soft);font-weight:700" : ""), title: "Set the inputs to this row" }, c.inputs.map((x) => h("td", { class: "mono", text: String(inp[x]) })).concat(c.outputs.map(([o, s]) => h("td", { class: "mono", text: String(res[s]), style: "color:" + (res[s] ? "var(--ok)" : "inherit") }))));
        const set = () => (Object.assign(vals, inp), refresh());
        tr.addEventListener("click", set);
        tr.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), set()));
        tb.appendChild(tr);
      }
      tbl.appendChild(tb);
      wrap.appendChild(tbl);
      return wrap;
    }
    function refresh() {
      errBox.textContent = "";
      if (dff) return refreshDff();
      vals = evaluate(circ, Object.fromEntries(circ.inputs.map((x) => [x, vals[x] || 0])));
      renderToggles(circ.inputs);
      draw();
      exprBox.innerHTML = circ.outputs.map(([o, s]) => "<span class='expr-out'>" + esc(o) + " = " + exprOf(circ, s, true) + "</span>").join("<br>");
      side.innerHTML = "";
      side.appendChild(h("div", { class: "bit-label", style: "text-align:left;margin-top:8px", text: "Truth table (current inputs highlighted – click a row to set them)" }));
      side.appendChild(truthTable());
    }

    // ---------- D-type flip-flop ----------
    function refreshDff() {
      renderToggles(["D", "CLK"]);
      const pulse = h("button", { class: "btn sm primary", type: "button", text: "⏫ Clock pulse (0→1→0)" });
      pulse.addEventListener("click", () => {
        if (vals.CLK) {
          vals.CLK = 0;
          dffStep("CLK");
        }
        vals.CLK = 1;
        dffStep("CLK");
        vals.CLK = 0;
        dffStep("CLK");
        refreshDff();
      });
      const clr = h("button", { class: "btn sm ghost", type: "button", text: "Clear history" });
      clr.addEventListener("click", () => {
        dff.hist = [{ D: vals.D, CLK: vals.CLK, Q: dff.Q }];
        dff.log = [];
        refreshDff();
      });
      toggles.append(pulse, clr);
      // block symbol
      const q = dff.Q;
      const svg = sv("svg", { width: 320, height: 150, viewBox: "0 0 320 150", style: "display:block;max-width:100%;font-family:var(--font-mono);font-size:13px", role: "img", "aria-label": "D-type flip-flop" });
      const wire = (d, on) => svg.appendChild(sv("path", { d, fill: "none", stroke: on ? "var(--ok)" : "var(--text-3)", "stroke-width": on ? 3 : 1.5 }));
      wire("M30 50 L110 50", vals.D);
      wire("M30 110 L110 110", vals.CLK);
      wire("M210 50 L280 50", q);
      wire("M210 110 L280 110", !q);
      svg.appendChild(sv("rect", { x: 110, y: 20, width: 100, height: 115, rx: 6, fill: "var(--surface)", stroke: "var(--text)", "stroke-width": 2 }));
      svg.appendChild(sv("path", { d: "M110 100 L124 110 L110 120", fill: "none", stroke: "var(--text)", "stroke-width": 2 }));
      [["D", 118, 55], ["CLK", 128, 115], ["Q", 192, 55]].forEach(([t, x, y]) => svg.appendChild(sv("text", { x, y, fill: "var(--text)" }, t)));
      svg.appendChild(sv("text", { x: 192, y: 115, fill: "var(--text)", "text-decoration": "overline" }, "Q"));
      [["D=" + vals.D, 4, 46], ["CLK=" + vals.CLK, 4, 106], ["Q=" + q, 250, 44], ["Q̄=" + (q ? 0 : 1), 250, 104]].forEach(([t, x, y]) => svg.appendChild(sv("text", { x, y, fill: "var(--text-2)", "font-weight": 700, class: t[0] === "Q" && t[1] === "=" ? "out-Q" : "" }, t)));
      svgWrap.innerHTML = "";
      svgWrap.appendChild(svg);
      exprBox.innerHTML = "Stored bit <b class='dff-q'>Q = " + q + "</b>";
      // timing diagram
      side.innerHTML = "";
      side.appendChild(h("div", { class: "bit-label", style: "text-align:left;margin-top:8px", text: "Timing diagram (each column is one change; ↑ marks a rising clock edge)" }));
      const hs = dff.hist.slice(-24);
      const W = Math.max(300, hs.length * 22 + 60);
      const t = sv("svg", { width: W, height: 130, viewBox: "0 0 " + W + " 130", style: "display:block;max-width:none;font-family:var(--font-mono);font-size:11px" });
      ["D", "CLK", "Q"].forEach((sig, r) => {
        const base = 30 + r * 40;
        t.appendChild(sv("text", { x: 4, y: base, fill: "var(--text-2)" }, sig));
        let d = "";
        hs.forEach((s, k) => {
          const x = 40 + k * 22,
            y = base - s[sig] * 18;
          d += (k ? " L" + x + " " + y : "M" + x + " " + y) + " L" + (x + 22) + " " + y;
          if (sig === "CLK" && k && s.CLK && !hs[k - 1].CLK) t.appendChild(sv("text", { x: x - 4, y: base + 12, fill: "var(--accent)", "font-weight": 700 }, "↑"));
        });
        t.appendChild(sv("path", { d, fill: "none", stroke: sig === "Q" ? "var(--ok)" : "var(--accent)", "stroke-width": 2 }));
      });
      const tw = h("div", { style: "overflow-x:auto" }, t);
      side.appendChild(tw);
      side.appendChild(h("div", { class: "output", style: "max-height:160px;overflow:auto;margin-top:8px", text: dff.log.length ? dff.log.slice().reverse().join("\n") : "Toggle D, then give the clock a rising edge (CLK 0 → 1)." }));
    }
    function dffStep(changed) {
      const prev = dff.hist[dff.hist.length - 1];
      let msg;
      if (changed === "CLK" && prev.CLK === 0 && vals.CLK === 1) {
        dff.Q = vals.D;
        msg = "↑ Rising edge: Q ← D = " + vals.D + (prev.Q === vals.D ? " (no change)" : "");
      } else if (changed === "CLK" && vals.CLK === 0) msg = "↓ Falling edge: nothing happens – Q holds " + dff.Q + ".";
      else msg = "D changed to " + vals.D + " but there is no rising clock edge, so Q holds " + dff.Q + ".";
      dff.hist.push({ D: vals.D, CLK: vals.CLK, Q: dff.Q });
      dff.log.push(msg);
    }

    // ---------- wiring ----------
    function load() {
      const p = PRESETS[presetSel.value];
      exprRow.style.display = p.expr ? "" : "none";
      errBox.textContent = "";
      if (p.dff) {
        circ = null;
        vals = { D: 0, CLK: 0 };
        dff = { Q: 0, hist: [{ D: 0, CLK: 0, Q: 0 }], log: [] };
        note.textContent = "Edge-triggered D-type flip-flop: on the rising edge of the clock Q takes the value of D; at all other times Q holds its value. One flip-flop stores one bit; a register is a group of them sharing a clock.";
        return refreshDff();
      }
      dff = null;
      if (p.expr) return buildExpr();
      circ = p;
      vals = {};
      note.textContent = p.note;
      refresh();
    }
    function buildExpr() {
      try {
        circ = netFromExpr(parseExpr(exprIn.value));
      } catch (e) {
        if (!(e instanceof GErr)) console.warn(e);
        errBox.textContent = e instanceof GErr ? e.message : "Sorry – I couldn't build that circuit.";
        return;
      }
      vals = {};
      note.textContent = "Circuit built with " + circ.gates.length + " gate" + (circ.gates.length === 1 ? "" : "s") + " for " + circ.inputs.length + " input" + (circ.inputs.length === 1 ? "" : "s") + ".";
      refresh();
    }
    const origToggle = toggle;
    toggle = function (n) {
      if (dff) {
        vals[n] = vals[n] ? 0 : 1;
        dffStep(n);
        return refreshDff();
      }
      origToggle(n);
    };
    presetSel.addEventListener("change", load);
    buildBtn.addEventListener("click", buildExpr);
    exprIn.addEventListener("keydown", (e) => e.key === "Enter" && buildExpr());
    presetSel.value = PRESETS[params.preset] ? params.preset : "half";
    load();
  },
});
