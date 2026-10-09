/* Fetch–decode–execute stepper. Uses CS.asmEngine (defined in assembly-simulator.js) for parsing and execution. */
(function () {
  const PROGRAMS = [
    { name: "Load, add, store (from 7.2)", data: "20=37", code: "LDR R0, 20\nADD R0, R0, #5\nSTR R0, 21\nHALT" },
    { name: "Trace challenge program", data: "10=20", code: "LDR R1, 10\nSUB R1, R1, #3\nSTR R1, 11\nHALT" },
    { name: "Compare and branch", data: "30=4", code: "LDR R0, 30\nCMP R0, #5\nBLT small\nMOV R1, #0\nB end\nsmall: MOV R1, #1\nend: HALT" },
    { name: "Short loop", data: "", code: "MOV R0, #3\nloop: SUB R0, R0, #1\nCMP R0, #0\nBNE loop\nHALT" },
  ];

  CS.registerTool({
    id: "fde-stepper",
    title: "Fetch–decode–execute stepper",
    section: "7",
    topic: "7.2",
    icon: "🔁",
    desc: "Step through the fetch–decode–execute cycle one register transfer at a time. Watch the PC, MAR, MBR, CIR, status flags and the three buses.",
    help: "The program is stored in memory from address 0, with data at the addresses you choose. Press **Next** to carry out one register transfer (written in register transfer notation), or **Whole instruction** to finish the current cycle. **Back** undoes a step. Highlighted registers changed on the last step. The bus panel shows what the address, data and control buses carry at that moment.",
    mount(el, params) {
      const h = CS.util.el;
      if (!CS.asmEngine) { el.appendChild(h("div", { class: "err", text: "Assembly engine not loaded." })); return; }
      const controls = h("div", { class: "controls" });
      const sel = h("select", { "aria-label": "Program" });
      PROGRAMS.forEach((p, i) => sel.appendChild(h("option", { value: i, text: p.name })));
      const back = h("button", { class: "btn sm", type: "button", text: "◀ Back" });
      const next = h("button", { class: "btn sm primary", type: "button", text: "Next ▶" });
      const whole = h("button", { class: "btn sm", type: "button", text: "Whole instruction" });
      const reset = h("button", { class: "btn sm ghost", type: "button", text: "Reset" });
      const editBtn = h("button", { class: "btn sm ghost", type: "button", text: "Edit program" });
      controls.append(sel, back, next, whole, reset, editBtn);
      const editor = h("div", { style: "display:none;margin-bottom:12px" });
      const code = h("textarea", { spellcheck: "false", "aria-label": "Program", style: "font-family:var(--font-mono);min-height:120px" });
      const data = h("input", { type: "text", "aria-label": "Data memory", placeholder: "address=value, e.g. 20=37", style: "width:100%;margin-top:6px" });
      const apply = h("button", { class: "btn sm primary", type: "button", text: "Load program", style: "margin-top:6px" });
      const editErr = h("div", { class: "err" });
      editor.append(code, data, apply, editErr);
      const stage = h("div", { style: "margin-bottom:10px" });
      const desc = h("div", { class: "output", style: "margin-bottom:12px" });
      const grid = h("div", { class: "two-col" });
      const regsBox = h("div");
      const memBox = h("div");
      grid.append(regsBox, memBox);
      const busBox = h("div", { style: "margin-top:12px" });
      el.append(controls, editor, stage, desc, grid, busBox);

      let snaps = [], idx = 0, prog, M;

      function build(src, memTxt) {
        prog = CS.asmEngine.parse(src);
        const pm = CS.asmEngine.parseMem(memTxt);
        const errs = prog.errors.concat(pm.errs);
        prog.ins.forEach((_, i) => { if (pm.mem[i] !== undefined) errs.push("Data address " + i + " overlaps the program, which is stored from address 0. Use higher addresses."); });
        if (errs.length) { editErr.textContent = errs.join(" · "); return false; }
        editErr.textContent = "";
        M = new CS.asmEngine.Machine(prog, pm.mem, 8);
        const memory = {};
        prog.ins.forEach((ins, i) => (memory[i] = ins.text));
        Object.keys(pm.mem).forEach((k) => (memory[k] = pm.mem[k]));
        let s = { stage: "Ready", rtn: "", text: "Program loaded at addresses 0–" + (prog.ins.length - 1) + ". The PC starts at 0. Press Next to begin the first fetch.", PC: 0, MAR: "", MBR: "", CIR: "", R: M.R.slice(), Z: 0, N: 0, mem: memory, bus: {}, changed: [], memHl: null, done: false };
        snaps = [s];
        let guard = 0;
        while (!s.done && guard++ < 400) s = cycle(s);
        idx = 0;
        draw();
        return true;
      }
      function push(prev, patch) {
        const s = Object.assign({}, prev, { bus: {}, changed: [], memHl: null }, patch);
        s.R = (patch.R || prev.R).slice();
        s.mem = Object.assign({}, patch.mem || prev.mem);
        snaps.push(s);
        return s;
      }
      function cycle(s) {
        const pc = s.PC;
        if (pc >= prog.ins.length) return push(s, { stage: "Stopped", text: "The PC points past the end of the program, so there is no instruction to fetch.", done: true });
        const ins = prog.ins[pc];
        s = push(s, { stage: "Fetch", rtn: "MAR ← [PC]", text: "The address of the next instruction (" + pc + ") is copied from the PC into the MAR. The MAR puts it on the address bus.", MAR: pc, changed: ["MAR"], bus: { addr: pc } });
        s = push(s, { stage: "Fetch", rtn: "PC ← [PC] + 1", text: "The PC is incremented so it points at the next instruction. This can happen while memory is being read.", PC: pc + 1, changed: ["PC"] });
        s = push(s, { stage: "Fetch", rtn: "MBR ← [Memory]addressed", text: "A memory-read signal goes along the control bus. The instruction at address " + pc + " travels along the data bus into the MBR.", MBR: ins.text, changed: ["MBR"], memHl: pc, bus: { addr: pc, data: ins.text, ctrl: "memory read" } });
        s = push(s, { stage: "Fetch", rtn: "CIR ← [MBR]", text: "The instruction is copied from the MBR into the CIR, ready to be decoded.", CIR: ins.text, changed: ["CIR"] });
        s = push(s, { stage: "Decode", rtn: "", text: decodeText(ins), changed: [] });
        // execute using the engine, so the semantics match the assembly simulator
        M.pc = pc;
        const before = M.R.slice();
        const res = M.step();
        const R = M.R.slice();
        const a = ins.args;
        switch (ins.op) {
          case "LDR": {
            const ad = +a[1];
            s = push(s, { stage: "Execute", rtn: "MAR ← " + ad, text: "The operand " + ad + " is a direct address, so it is copied into the MAR and sent on the address bus.", MAR: ad, changed: ["MAR"], bus: { addr: ad } });
            s = push(s, { stage: "Execute", rtn: "MBR ← [" + ad + "]", text: "Memory read: the value at address " + ad + " (" + (s.mem[ad] === undefined ? 0 : s.mem[ad]) + ") comes back along the data bus into the MBR.", MBR: s.mem[ad] === undefined ? 0 : s.mem[ad], changed: ["MBR"], memHl: ad, bus: { addr: ad, data: s.mem[ad] === undefined ? 0 : s.mem[ad], ctrl: "memory read" } });
            s = push(s, { stage: "Execute", rtn: a[0].toUpperCase() + " ← [MBR]", text: "The value is copied from the MBR into " + a[0].toUpperCase() + ".", R, changed: [a[0].toUpperCase()] });
            break;
          }
          case "STR": {
            const ad = +a[1], v = before[parseInt(a[0].slice(1), 10)];
            s = push(s, { stage: "Execute", rtn: "MAR ← " + ad, text: "The destination address " + ad + " is copied into the MAR and sent on the address bus.", MAR: ad, changed: ["MAR"], bus: { addr: ad } });
            s = push(s, { stage: "Execute", rtn: "MBR ← [" + a[0].toUpperCase() + "]", text: "The value in " + a[0].toUpperCase() + " (" + v + ") is copied into the MBR.", MBR: v, changed: ["MBR"] });
            const mem = Object.assign({}, s.mem); mem[ad] = v;
            s = push(s, { stage: "Execute", rtn: "[" + ad + "] ← [MBR]", text: "A memory-write signal goes along the control bus and the MBR's contents travel along the data bus into address " + ad + ".", mem, memHl: ad, bus: { addr: ad, data: v, ctrl: "memory write" } });
            break;
          }
          case "CMP": {
            const x = before[parseInt(a[0].slice(1), 10)], y = M.val(a[1]);
            s = push(s, { stage: "Execute", rtn: "ALU: " + x + " − " + y, text: "The ALU subtracts to compare " + x + " with " + y + ". The result is not stored — only the status register flags change.", Z: x === y ? 1 : 0, N: x < y ? 1 : 0, changed: ["SR"] });
            break;
          }
          case "B": case "BEQ": case "BNE": case "BGT": case "BLT": {
            if (res.branch) s = push(s, { stage: "Execute", rtn: "PC ← " + M.pc, text: (ins.op === "B" ? "Unconditional branch" : "The condition " + ins.op.slice(1) + " is true (checked using the flags)") + ", so the address of '" + a[0] + "' (" + M.pc + ") is copied into the PC. The next fetch will come from there.", PC: M.pc, changed: ["PC"] });
            else s = push(s, { stage: "Execute", rtn: "(PC unchanged)", text: "The condition " + ins.op.slice(1) + " is false, so nothing happens. The PC already points to the next instruction.", changed: [] });
            break;
          }
          case "HALT":
            return push(s, { stage: "Execute", rtn: "HALT", text: "HALT: the processor stops fetching instructions.", done: true });
          default: {
            const d = a[0].toUpperCase();
            s = push(s, { stage: "Execute", rtn: d + " ← " + res.msg.split("← ")[1], text: "The control unit sends the operands to the ALU, which " + verb(ins.op) + ". The result goes into " + d + ".", R, changed: [d] });
          }
        }
        return push(s, { stage: "Interrupt check", rtn: "", text: "End of the cycle: the processor checks whether an interrupt has been raised (none here), then starts the next fetch.", changed: [] });
      }
      function verb(op) {
        return { ADD: "adds", SUB: "subtracts", AND: "does a bitwise AND", ORR: "does a bitwise OR", EOR: "does a bitwise XOR", LSL: "shifts left", LSR: "shifts right", MOV: "passes the value through", MVN: "inverts every bit" }[op] || "processes the data";
      }
      function decodeText(ins) {
        const a = ins.args;
        const ops = { LDR: "load", STR: "store", ADD: "add", SUB: "subtract", MOV: "move", MVN: "move NOT", CMP: "compare", B: "branch always", BEQ: "branch if equal", BNE: "branch if not equal", BGT: "branch if greater than", BLT: "branch if less than", AND: "bitwise AND", ORR: "bitwise OR", EOR: "bitwise XOR", LSL: "logical shift left", LSR: "logical shift right", HALT: "halt" };
        let t = "The control unit decodes the CIR. Opcode: " + ins.op + " (" + ops[ins.op] + ").";
        if (a.length) t += " Operand(s): " + a.join(", ") + ".";
        const last = a[a.length - 1] || "";
        if (ins.op === "LDR" || ins.op === "STR") t += " Addressing mode: direct — " + last + " is a memory address.";
        else if (/^#/.test(last)) t += " Addressing mode: immediate — " + last + " is the value itself.";
        else if (/^R/i.test(last)) t += " The last operand is a register.";
        return t;
      }
      function draw() {
        const s = snaps[idx];
        const prevSnap = snaps[idx - 1];
        stage.innerHTML = "";
        ["Fetch", "Decode", "Execute", "Interrupt check"].forEach((st) => stage.appendChild(h("span", { class: "pill" + (s.stage === st ? " accent" : ""), style: "margin-right:6px", text: st })));
        stage.appendChild(h("span", { class: "stat-line", style: "margin-left:8px", text: "step " + idx + " of " + (snaps.length - 1) }));
        desc.textContent = (s.rtn ? s.rtn + "\n" : "") + s.text;
        regsBox.innerHTML = "";
        const regs = [["PC", s.PC], ["MAR", s.MAR], ["MBR", s.MBR], ["CIR", s.CIR], ["SR", "Z=" + s.Z + " N=" + s.N]];
        const used = new Set();
        prog.ins.forEach((ins) => ins.args.forEach((x) => /^R\d+$/i.test(x) && used.add(parseInt(x.slice(1), 10))));
        [...used].sort((x, y) => x - y).forEach((r) => regs.push(["R" + r, s.R[r]]));
        const wrap = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px" });
        regs.forEach(([name, v]) => {
          const box = h("div", { class: "cell" + (s.changed.includes(name) ? " hl" : ""), style: "height:auto;padding:6px 8px;display:block;text-align:left" });
          box.append(h("div", { class: "bit-label", style: "text-align:left", text: name }), h("div", { style: "font-size:0.9rem;word-break:break-word", text: v === "" || v === undefined ? "—" : String(v) }));
          wrap.appendChild(box);
        });
        regsBox.append(wrap);
        memBox.innerHTML = "";
        const t = h("table");
        t.innerHTML = "<thead><tr><th>Address</th><th>Contents</th></tr></thead>";
        const tb = h("tbody");
        Object.keys(s.mem).map(Number).sort((x, y) => x - y).forEach((ad) => {
          const hl = s.memHl === ad ? "background:var(--warn-soft)" : ad === s.PC && !s.done ? "background:var(--accent-soft)" : "";
          const tr = h("tr", { style: hl });
          tr.append(h("td", { text: String(ad) + (ad === s.PC && ad < prog.ins.length ? " ← PC" : "") }), h("td", { style: "font-family:var(--font-mono)", text: String(s.mem[ad]) }));
          tb.appendChild(tr);
        });
        t.appendChild(tb);
        memBox.appendChild(t);
        busBox.innerHTML = "";
        const bus = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px" });
        [["Address bus", s.bus.addr], ["Data bus", s.bus.data], ["Control bus", s.bus.ctrl]].forEach(([n, v]) => {
          const on = v !== undefined;
          bus.appendChild(h("div", { class: "cell" + (on ? " active" : " dim"), style: "height:auto;padding:6px 10px;display:block;text-align:left" }, [h("div", { class: "bit-label", style: "text-align:left", text: n }), h("div", { text: on ? String(v) : "idle" })]));
        });
        busBox.appendChild(bus);
        back.disabled = idx === 0;
        next.disabled = whole.disabled = idx === snaps.length - 1;
        void prevSnap;
      }
      next.addEventListener("click", () => { if (idx < snaps.length - 1) { idx++; draw(); } });
      back.addEventListener("click", () => { if (idx > 0) { idx--; draw(); } });
      whole.addEventListener("click", () => {
        do { idx++; } while (idx < snaps.length - 1 && snaps[idx].stage !== "Interrupt check" && !snaps[idx].done);
        draw();
      });
      reset.addEventListener("click", () => { idx = 0; draw(); });
      editBtn.addEventListener("click", () => { editor.style.display = editor.style.display === "none" ? "" : "none"; });
      apply.addEventListener("click", () => build(code.value, data.value));
      sel.addEventListener("change", () => { const p = PROGRAMS[+sel.value]; code.value = p.code; data.value = p.data; build(p.code, p.data); });
      const p = PROGRAMS[Math.min(PROGRAMS.length - 1, parseInt(params.program || 0, 10) || 0)];
      sel.value = String(PROGRAMS.indexOf(p));
      code.value = p.code; data.value = p.data;
      build(p.code, p.data);
    },
  });
})();
