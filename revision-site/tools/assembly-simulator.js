/* AQA assembly language simulator. Also defines CS.asmEngine, which the fde-stepper tool reuses. */
(function () {
  const ARITH = ["ADD", "SUB", "AND", "ORR", "EOR", "LSL", "LSR"];
  const BRANCH = ["B", "BEQ", "BNE", "BGT", "BLT"];
  const ALL = ["LDR", "STR", "MOV", "MVN", "CMP", "HALT"].concat(ARITH, BRANCH);

  function parse(src) {
    const out = { ins: [], labels: {}, errors: [] };
    const pending = [];
    src.split("\n").forEach((raw, i) => {
      const lineNo = i + 1;
      let l = raw.split(";")[0].trim();
      if (!l) return;
      const m = l.match(/^([A-Za-z_]\w*)\s*:\s*(.*)$/);
      if (m) {
        if (out.labels[m[1]] !== undefined || pending.includes(m[1])) out.errors.push("Line " + lineNo + ": label '" + m[1] + "' is defined twice.");
        pending.push(m[1]);
        l = m[2].trim();
        if (!l) return;
      }
      pending.forEach((lab) => (out.labels[lab] = out.ins.length));
      pending.length = 0;
      const sp = l.search(/\s/);
      const op = (sp < 0 ? l : l.slice(0, sp)).toUpperCase();
      const args = sp < 0 ? [] : l.slice(sp).split(",").map((s) => s.trim()).filter((s) => s !== "");
      const err = check(op, args);
      if (err) out.errors.push("Line " + lineNo + ": " + err);
      out.ins.push({ op, args, text: l.replace(/\s+/g, " ").replace(/\s*,\s*/g, ", "), line: lineNo });
    });
    pending.forEach((lab) => (out.labels[lab] = out.ins.length));
    out.ins.forEach((ins) => {
      if (BRANCH.includes(ins.op) && ins.args[0] && out.labels[ins.args[0]] === undefined) out.errors.push("Line " + ins.line + ": label '" + ins.args[0] + "' is not defined.");
    });
    return out;
  }
  const isReg = (s) => /^R(1[0-2]|[0-9])$/i.test(s);
  const isImm = (s) => /^#-?\d+$/.test(s);
  const isAddr = (s) => /^\d+$/.test(s);
  function check(op, a) {
    if (!ALL.includes(op)) return "unknown instruction '" + op + "'. AQA instructions are " + ALL.join(", ") + ".";
    const need = (n) => (a.length !== n ? op + " needs " + n + " operand" + (n === 1 ? "" : "s") + ", found " + a.length + "." : "");
    const op2 = (s) => (isReg(s) || isImm(s) ? "" : "'" + s + "' must be a register (Rn) or an immediate value (#n).");
    if (op === "HALT") return need(0);
    if (op === "LDR" || op === "STR") {
      if (need(2)) return need(2);
      if (!isReg(a[0])) return "first operand must be a register R0–R12.";
      if (isImm(a[1])) return op + " uses direct addressing: give a memory address (e.g. 100), not #" + a[1].slice(1) + ". Use MOV to load a constant.";
      if (!isAddr(a[1])) return "'" + a[1] + "' must be a memory address (a whole number).";
      return "";
    }
    if (op === "MOV" || op === "MVN" || op === "CMP") {
      if (need(2)) return need(2);
      if (!isReg(a[0])) return "first operand must be a register R0–R12.";
      return op2(a[1]);
    }
    if (ARITH.includes(op)) {
      if (need(3)) return need(3);
      if (!isReg(a[0]) || !isReg(a[1])) return "the first two operands must be registers.";
      if (isAddr(a[2])) return "operand2 '" + a[2] + "' looks like a memory address. Arithmetic works on registers or #immediate values only — LDR the value first.";
      return op2(a[2]);
    }
    if (BRANCH.includes(op)) return need(1);
    return "";
  }

  function Machine(prog, mem, bits) {
    this.prog = prog;
    this.bits = bits || 8;
    this.mask = this.bits >= 32 ? 0xffffffff : (1 << this.bits) - 1;
    this.R = new Array(13).fill(0);
    this.mem = Object.assign({}, mem || {});
    this.pc = 0;
    this.cmp = null; // -1, 0, 1 from the last CMP
    this.halted = false;
    this.steps = 0;
  }
  Machine.prototype.val = function (s) {
    return isImm(s) ? parseInt(s.slice(1), 10) : this.R[parseInt(s.slice(1), 10)];
  };
  /* Execute one instruction. Returns {ins, msg, changed:{reg?, addr?}, branch?} */
  Machine.prototype.step = function () {
    if (this.halted) return null;
    if (this.pc >= this.prog.ins.length) { this.halted = true; return { ins: null, msg: "Ran off the end of the program (no HALT).", changed: {} }; }
    const ins = this.prog.ins[this.pc];
    this.pc++;
    this.steps++;
    const a = ins.args, R = this.R, rn = (s) => parseInt(s.slice(1), 10);
    const d = a[0] ? rn(a[0]) : 0;
    const res = { ins, changed: {}, msg: "" };
    const setR = (v, why) => { R[d] = v; res.changed.reg = d; res.msg = "R" + d + " ← " + why + " = " + v; };
    const m = this.mask, u = (v) => v & m;
    switch (ins.op) {
      case "HALT": this.halted = true; res.msg = "HALT: execution stops."; break;
      case "LDR": { const ad = +a[1]; const v = this.mem[ad] || 0; setR(v, "memory[" + ad + "]"); res.changed.read = ad; break; }
      case "STR": { const ad = +a[1]; this.mem[ad] = R[d]; res.changed.addr = ad; res.msg = "memory[" + ad + "] ← R" + d + " = " + R[d]; break; }
      case "MOV": setR(this.val(a[1]), a[1]); break;
      case "MVN": { const v = u(~this.val(a[1])); setR(v, "NOT " + a[1] + " (" + this.bits + "-bit: " + bin(v, this.bits) + ")"); break; }
      case "ADD": setR(R[rn(a[1])] + this.val(a[2]), a[1] + " + " + a[2]); break;
      case "SUB": setR(R[rn(a[1])] - this.val(a[2]), a[1] + " − " + a[2]); break;
      case "AND": setR(u(R[rn(a[1])] & this.val(a[2])), a[1] + " AND " + a[2]); break;
      case "ORR": setR(u(R[rn(a[1])] | this.val(a[2])), a[1] + " OR " + a[2]); break;
      case "EOR": setR(u(R[rn(a[1])] ^ this.val(a[2])), a[1] + " XOR " + a[2]); break;
      case "LSL": { const before = u(R[rn(a[1])]), n = this.val(a[2]); const v = u(before * Math.pow(2, n)); setR(v, a[1] + " shifted left " + n); if (before * Math.pow(2, n) > m) res.msg += "  ⚠ a 1 was shifted out: overflow"; break; }
      case "LSR": { const n = this.val(a[2]); setR(Math.floor(u(R[rn(a[1])]) / Math.pow(2, n)), a[1] + " shifted right " + n); break; }
      case "CMP": {
        const x = R[d], y = this.val(a[1]);
        this.cmp = x > y ? 1 : x < y ? -1 : 0;
        res.msg = "Compare R" + d + " (" + x + ") with " + y + ": " + (this.cmp === 0 ? "EQUAL" : this.cmp > 0 ? "GREATER THAN" : "LESS THAN") + ". Only the flags change.";
        break;
      }
      default: {
        const c = this.cmp;
        const take = ins.op === "B" || (c !== null && ((ins.op === "BEQ" && c === 0) || (ins.op === "BNE" && c !== 0) || (ins.op === "BGT" && c === 1) || (ins.op === "BLT" && c === -1)));
        if (ins.op !== "B" && c === null) res.msg = ins.op + ": no CMP has been executed yet, so the condition is false. ";
        if (take) { this.pc = this.prog.labels[a[0]]; res.branch = true; res.msg += ins.op + " " + a[0] + ": branch TAKEN → PC ← " + this.pc + " (" + a[0] + ")"; }
        else res.msg += ins.op + " " + a[0] + ": condition false → branch not taken, carry on to the next instruction";
      }
    }
    if (this.pc >= this.prog.ins.length && !this.halted) { /* will report on next step */ }
    return res;
  };
  function bin(v, bits) {
    const s = ((v >>> 0) & (bits >= 32 ? 0xffffffff : (1 << bits) - 1)).toString(2).padStart(bits, "0");
    return s.replace(/(.{4})(?=.)/g, "$1 ");
  }
  function parseMem(txt) {
    const mem = {}, errs = [];
    (txt || "").split(/[,;\n]/).map((s) => s.trim()).filter(Boolean).forEach((p) => {
      const m = p.match(/^\[?(\d+)\]?\s*[=:]\s*(-?\d+)$/);
      if (m) mem[+m[1]] = +m[2];
      else errs.push("Could not read '" + p + "' — write it as address=value, e.g. 100=12");
    });
    return { mem, errs };
  }
  CS.asmEngine = { parse, Machine, bin, parseMem };

  const EXAMPLES = [
    { name: "Add two values in memory", data: "100=12, 101=30", code: "        LDR R0, 100      ; R0 ← memory[100]\n        LDR R1, 101      ; R1 ← memory[101]\n        ADD R2, R0, R1   ; R2 ← R0 + R1\n        STR R2, 102      ; memory[102] ← R2\n        HALT" },
    { name: "IF…ELSE: store the larger", data: "100=7, 101=3", code: "        LDR R0, 100\n        LDR R1, 101\n        CMP R0, R1\n        BGT bigger        ; if R0 > R1 jump\n        STR R1, 102       ; ELSE part\n        B done\nbigger: STR R0, 102       ; THEN part\ndone:   HALT" },
    { name: "Loop: total of 1 to 10", data: "", code: "        MOV R0, #1        ; count\n        MOV R1, #0        ; total\nloop:   ADD R1, R1, R0\n        ADD R0, R0, #1\n        CMP R0, #11\n        BLT loop\n        STR R1, 200\n        HALT" },
    { name: "Multiply by 10 with shifts", data: "100=13", code: "        LDR R0, 100\n        LSL R1, R0, #3    ; 8x\n        LSL R2, R0, #1    ; 2x\n        ADD R1, R1, R2    ; 8x + 2x = 10x\n        STR R1, 101\n        HALT" },
    { name: "Odd or even (AND mask)", data: "100=45", code: "        LDR R0, 100\n        AND R1, R0, #1    ; keep only the last bit\n        CMP R1, #1\n        BEQ odd\n        MOV R2, #0\n        B done\nodd:    MOV R2, #1\ndone:   STR R2, 101       ; 1 = odd, 0 = even\n        HALT" },
    { name: "Count the 1 bits", data: "", code: "        MOV R0, #13       ; 1101\n        MOV R1, #0\nloop:   AND R2, R0, #1\n        ADD R1, R1, R2\n        LSR R0, R0, #1\n        CMP R0, #0\n        BNE loop\n        STR R1, 21\n        HALT" },
    { name: "Bitwise masks", data: "", code: "        MOV R0, #77       ; 0100 1101\n        AND R1, R0, #15   ; clear top 4 bits\n        ORR R2, R0, #128  ; set bit 7\n        EOR R3, R0, #255  ; flip every bit\n        MVN R4, #15       ; NOT 0000 1111\n        HALT" },
    { name: "Bug hunt: missing B", data: "100=2, 101=9", code: "; Should store the larger value at 102.\n; Run it with 100=2, 101=9 — why is the answer wrong?\n        LDR R0, 100\n        LDR R1, 101\n        CMP R0, R1\n        BGT bigger\n        STR R1, 102\nbigger: STR R0, 102\n        HALT" },
  ];

  CS.registerTool({
    id: "assembly-simulator",
    title: "AQA assembly simulator",
    section: "7",
    topic: "7.3",
    icon: "⚙️",
    desc: "Write, step through and run programs in the AQA assembly language. Watch registers, memory, comparisons and branches change line by line.",
    help: "Pick an example or type your own program using the **AQA instruction set** (LDR, STR, ADD, SUB, MOV, CMP, B, BEQ, BNE, BGT, BLT, AND, ORR, EOR, MVN, LSL, LSR, HALT). Set starting memory as `address=value` pairs. **Step** runs one instruction and explains it; **Run** goes to the end. Syntax errors are reported with line numbers — including common exam slips like `LDR R0, #5`. Logical instructions work on the chosen word size.",
    mount(el, params) {
      const h = CS.util.el;
      const controls = h("div", { class: "controls" });
      const exSel = h("select", { "aria-label": "Example program" });
      EXAMPLES.forEach((e, i) => exSel.appendChild(h("option", { value: i, text: e.name })));
      const bitsSel = h("select", { "aria-label": "Word size" });
      [8, 16, 32].forEach((b) => bitsSel.appendChild(h("option", { value: b, text: b + "-bit" })));
      const stepBtn = h("button", { class: "btn sm primary", type: "button", text: "Step" });
      const runBtn = h("button", { class: "btn sm", type: "button", text: "Run" });
      const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "Reset" });
      controls.append(exSel, bitsSel, stepBtn, runBtn, resetBtn);
      const code = h("textarea", { spellcheck: "false", "aria-label": "Assembly program", style: "font-family:var(--font-mono);min-height:220px;font-size:0.88rem" });
      const dataIn = h("input", { type: "text", "aria-label": "Starting memory", placeholder: "e.g. 100=12, 101=30", style: "width:100%" });
      const left = h("div");
      left.append(code, h("label", { class: "stat-line", text: "Starting memory (address=value):" }), dataIn);
      const listing = h("div", { class: "output", style: "min-height:120px;max-height:280px;overflow:auto" });
      const right = h("div");
      right.append(listing);
      const top = h("div", { class: "two-col" });
      top.append(left, right);
      const state = h("div", { class: "two-col", style: "margin-top:12px" });
      const regBox = h("div");
      const memBox = h("div");
      state.append(regBox, memBox);
      const log = h("div", { class: "output", style: "margin-top:12px;min-height:80px;max-height:220px;overflow:auto" });
      el.append(controls, top, state, log);

      let prog = null, M = null, lastRes = null, logLines = [];
      function load() {
        prog = CS.asmEngine.parse(code.value);
        const pm = CS.asmEngine.parseMem(dataIn.value);
        M = new CS.asmEngine.Machine(prog, pm.mem, parseInt(bitsSel.value, 10));
        lastRes = null;
        logLines = [];
        const errs = prog.errors.concat(pm.errs);
        if (errs.length) logLines.push("✖ " + errs.join("\n✖ "));
        else logLines.push("Program assembled: " + prog.ins.length + " instructions. PC = 0. Press Step or Run.");
        draw();
      }
      function draw() {
        listing.innerHTML = "";
        const labelAt = {};
        Object.keys(prog.labels).forEach((k) => (labelAt[prog.labels[k]] = (labelAt[prog.labels[k]] ? labelAt[prog.labels[k]] + " " : "") + k + ":"));
        prog.ins.forEach((ins, i) => {
          const cur = M && !M.halted && i === M.pc;
          const row = h("div", { style: "display:flex;gap:10px;padding:1px 6px;border-radius:6px;" + (cur ? "background:var(--accent-soft);font-weight:700" : lastRes && lastRes.ins === ins ? "background:var(--warn-soft)" : "") });
          row.append(h("span", { style: "color:var(--text-3);min-width:2ch;text-align:right", text: String(i) }), h("span", { style: "min-width:7ch;color:var(--text-2)", text: labelAt[i] || "" }), h("span", { text: (cur ? "▶ " : "  ") + ins.text }));
          listing.appendChild(row);
        });
        if (!prog.ins.length) listing.textContent = "(no instructions)";
        // registers
        regBox.innerHTML = "";
        const used = new Set([0, 1, 2, 3]);
        prog.ins.forEach((ins) => ins.args.forEach((s) => /^R\d+$/i.test(s) && used.add(parseInt(s.slice(1), 10))));
        const t = h("table");
        t.innerHTML = "<thead><tr><th>Register</th><th>Denary</th><th>Binary (" + M.bits + "-bit)</th></tr></thead>";
        const tb = h("tbody");
        [...used].sort((a, b) => a - b).forEach((r) => {
          const tr = h("tr", { style: lastRes && lastRes.changed.reg === r ? "background:var(--warn-soft)" : "" });
          tr.append(h("td", { text: "R" + r }), h("td", { text: String(M.R[r]) }), h("td", { style: "font-family:var(--font-mono)", text: CS.asmEngine.bin(M.R[r], M.bits) }));
          tb.appendChild(tr);
        });
        t.appendChild(tb);
        regBox.append(t, h("div", { class: "stat-line", text: "PC = " + M.pc + " · last CMP: " + (M.cmp === null ? "none" : M.cmp === 0 ? "EQ" : M.cmp > 0 ? "GT" : "LT") + " · steps: " + M.steps + (M.halted ? " · HALTED" : "") }));
        // memory
        memBox.innerHTML = "";
        const addrs = new Set(Object.keys(M.mem).map(Number));
        prog.ins.forEach((ins) => (ins.op === "LDR" || ins.op === "STR") && /^\d+$/.test(ins.args[1] || "") && addrs.add(+ins.args[1]));
        const mt = h("table");
        mt.innerHTML = "<thead><tr><th>Address</th><th>Contents</th></tr></thead>";
        const mb = h("tbody");
        [...addrs].sort((a, b) => a - b).forEach((ad) => {
          const hl = lastRes && (lastRes.changed.addr === ad ? "background:var(--ok-soft)" : lastRes.changed.read === ad ? "background:var(--accent-soft)" : "");
          const tr = h("tr", { style: hl || "" });
          tr.append(h("td", { text: String(ad) }), h("td", { text: M.mem[ad] === undefined ? "–" : String(M.mem[ad]) }));
          mb.appendChild(tr);
        });
        mt.appendChild(mb);
        memBox.append(addrs.size ? mt : h("div", { class: "explain", text: "No memory locations used yet." }));
        log.textContent = logLines.slice().reverse().join("\n");
      }
      function doStep() {
        if (prog.errors.length) return;
        if (M.halted) { logLines.push("Program has halted. Press Reset to start again."); draw(); return; }
        const res = M.step();
        lastRes = res;
        logLines.push((res.ins ? "[" + (M.steps) + "] " + res.ins.text + "  →  " : "") + res.msg);
        draw();
      }
      stepBtn.addEventListener("click", doStep);
      runBtn.addEventListener("click", () => {
        if (prog.errors.length) return;
        let n = 0;
        while (!M.halted && n < 5000) { const r = M.step(); lastRes = r; n++; if (n <= 200) logLines.push((r.ins ? "[" + M.steps + "] " + r.ins.text + "  →  " : "") + r.msg); }
        if (n > 200) logLines.push("… " + (n - 200) + " more steps not listed.");
        if (!M.halted) logLines.push("⚠ Stopped after 5000 steps — is there an infinite loop? Check your branch conditions.");
        draw();
      });
      resetBtn.addEventListener("click", load);
      bitsSel.addEventListener("change", load);
      exSel.addEventListener("change", () => { const e = EXAMPLES[+exSel.value]; code.value = e.code; dataIn.value = e.data; load(); });
      code.addEventListener("input", CS.util.debounce(load, 400));
      dataIn.addEventListener("input", CS.util.debounce(load, 400));
      const start = EXAMPLES[Math.min(EXAMPLES.length - 1, parseInt(params.example || 0, 10) || 0)];
      exSel.value = String(EXAMPLES.indexOf(start));
      code.value = params.code ? params.code.replace(/\\n/g, "\n") : start.code;
      dataIn.value = params.data || start.data;
      load();
    },
  });
})();
