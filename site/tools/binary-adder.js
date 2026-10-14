/* binary-adder: unsigned binary addition and long multiplication, step by step (AQA 4.5.4.1). */
CS.registerTool({
  id: "binary-adder",
  title: "Binary addition and multiplication",
  section: "5",
  topic: "5.4",
  icon: "➕",
  desc: "Step through unsigned binary addition with a carry row, and long multiplication with partial products laid out as in an exam answer.",
  help: "Choose **Addition** or **Multiplication**, type two unsigned binary numbers and press **▶ Step** to work one column (or one partial product) at a time, or **⏩ Run** to animate.\n\n- **Addition** follows the four rules: 0+0 = 0, 0+1 = 1, 1+1 = 0 carry 1, 1+1+1 = 1 carry 1. Write the carries in a row *above* the numbers. If there is a carry out of the left-most column the answer needs more bits than the register has: **overflow**.\n- **Multiplication**: for each bit of the multiplier (right to left) write a partial product — a copy of the multiplicand shifted left by that bit's position if the bit is 1, or zeros if it is 0 — then add the partial products. A column can produce a carry bigger than 1 when several 1s line up.\n\nAlways check your answer in denary.",
  mount(el, params) {
    const h = CS.util.el;
    let mode = params.mode === "mul" ? "mul" : "add";
    let width = 8;
    let frames = [], idx = 0, timer = null, colCount = 0;

    const modeSel = h("select", { "aria-label": "Operation" }, [h("option", { value: "add", text: "Addition" }), h("option", { value: "mul", text: "Multiplication" })]);
    modeSel.value = mode;
    const aIn = h("input", { type: "text", "aria-label": "First binary number", style: "width:150px;font-family:var(--font-mono)" });
    const bIn = h("input", { type: "text", "aria-label": "Second binary number", style: "width:150px;font-family:var(--font-mono)" });
    const wSel = h("select", { "aria-label": "Register width" });
    [4, 8, 12, 16].forEach((w) => wSel.appendChild(h("option", { value: w, text: w + "-bit register" })));
    wSel.value = "8";
    const wLab = h("label", {}, ["Width", wSel]);
    const resetB = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const stepB = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
    const runB = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const speed = h("input", { type: "range", min: "1", max: "5", value: "3", "aria-label": "Animation speed" });
    el.append(
      h("div", { class: "controls" }, [h("label", {}, ["Operation", modeSel]), h("label", {}, ["A", aIn]), h("label", {}, ["B", bIn]), wLab]),
      h("div", { class: "controls" }, [resetB, stepB, runB, h("label", {}, ["Speed", speed])])
    );
    const err = h("div", { class: "err", role: "alert", style: "display:none" });
    const stat = h("div", { class: "stat-line" });
    const grid = h("div", { class: "table-wrap" });
    const log = h("div", { class: "output", style: "min-height:90px", "aria-live": "polite" });
    el.append(err, stat, grid, log);

    function setDefaults() {
      if (mode === "add") { aIn.value = "01101101"; bIn.value = "00111011"; }
      else { aIn.value = "1011"; bIn.value = "1101"; }
    }

    /* Build the list of frames. Each frame: { rows:[{label, cells[], cls}], hl: col index or -1, log: [] } */
    function buildAdd(a, c) {
      const n = width, A = a.padStart(n, "0"), B = c.padStart(n, "0"), W = n + 1;
      const carry = new Array(n + 1).fill(""), sum = new Array(n).fill("");
      const out = [], logs = [];
      const snap = (hl) => ({
        rows: [
          { label: "Carry", cells: carry.map((x, i) => (i === 0 ? (x === 1 ? "1" : "") : x === 1 ? "1" : "")), cls: "carry" },
          { label: "A", cells: [""].concat(A.split("")) },
          { label: "+ B", cells: [""].concat(B.split("")) },
          { label: "Sum", cells: [carry[0] === 1 ? "1" : ""].concat(sum), cls: "sum" },
        ], hl, log: logs.slice(), W,
      });
      out.push(snap(-1));
      logs.push("Line up the numbers by their right-hand (least significant) bit. Start at the right.");
      out[0].log = logs.slice();
      let cin = 0;
      for (let i = n - 1; i >= 0; i--) {
        const t = Number(A[i]) + Number(B[i]) + cin;
        sum[i] = String(t % 2);
        const co = t >> 1;
        carry[i] = co;
        logs.push("Column " + (n - 1 - i) + ": " + A[i] + " + " + B[i] + (cin ? " + carry 1" : "") + " = " + t + " (" + t.toString(2) + "₂) → write " + sum[i] + (co ? ", carry 1 into the next column" : ""));
        out.push(Object.assign(snap(i + 1), { column: true }));
        cin = co;
      }
      const res = parseInt(A, 2) + parseInt(B, 2);
      if (cin) logs.push("⚠ Carry out of the MSB: the answer " + res + " needs " + (n + 1) + " bits but the register holds " + n + " bits (max " + (2 ** n - 1) + ") → OVERFLOW. The " + n + "-bit result would be " + sum.join("") + " = " + (res - 2 ** n) + ".");
      else logs.push("✓ Done: " + A + " + " + B + " = " + sum.join("") + ". Check: " + parseInt(A, 2) + " + " + parseInt(B, 2) + " = " + res + ". No carry out, so no overflow.");
      out.push(snap(-1));
      return out;
    }

    function buildMul(a, c) {
      const la = a.length, lb = c.length, P = la + lb, W = P;
      const rows = [
        { label: "Multiplicand", cells: a.padStart(W, " ").split("").map((x) => x.trim()) },
        { label: "× Multiplier", cells: c.padStart(W, " ").split("").map((x) => x.trim()), cls: "under" },
      ];
      const out = [], logs = ["Multiply " + a + " (" + parseInt(a, 2) + ") by " + c + " (" + parseInt(c, 2) + "). One partial product per bit of the multiplier, working right to left."];
      const snap = (hl, extra) => ({ rows: rows.concat(extra || []), hl, log: logs.slice(), W });
      out.push(snap(-1));
      const partials = [];
      for (let i = 0; i < lb; i++) {
        const bit = c[lb - 1 - i];
        const pp = (bit === "1" ? a : "0".repeat(la)) + "0".repeat(i);
        partials.push(pp.padStart(W, "0"));
        rows.push({ label: "Partial " + (i + 1), cells: pp.padStart(W, " ").split("").map((x, k) => (x === " " ? "" : x)), shift: i });
        logs.push("Multiplier bit " + i + " (worth " + 2 ** i + ") is " + bit + " → partial product " + (bit === "1" ? "= multiplicand shifted left " + i + " place" + (i === 1 ? "" : "s") : "= all zeros") + ": " + pp);
        out.push(snap(W - 1 - i));
      }
      const carry = new Array(W + 1).fill(0), sum = new Array(W).fill("");
      const cRow = { label: "Carry", cells: new Array(W).fill(""), cls: "carry" };
      const sRow = { label: "Product", cells: sum, cls: "sum" };
      logs.push("Now add the partial products column by column, right to left.");
      let cin = 0;
      for (let j = W - 1; j >= 0; j--) {
        const ones = partials.reduce((s, p) => s + Number(p[j]), 0);
        const t = ones + cin;
        sum[j] = String(t % 2);
        const co = Math.floor(t / 2);
        if (j > 0 && co) cRow.cells[j - 1] = String(co);
        logs.push("Column " + (W - 1 - j) + ": " + ones + " one" + (ones === 1 ? "" : "s") + (cin ? " + carry " + cin : "") + " = " + t + " → write " + sum[j] + (co ? ", carry " + co : ""));
        cin = co;
        out.push(Object.assign(snap(j, [Object.assign({}, cRow, { cells: cRow.cells.slice() }), Object.assign({}, sRow, { cells: sum.slice() })]), { column: true }));
      }
      const prod = parseInt(a, 2) * parseInt(c, 2);
      logs.push("✓ Product = " + sum.join("") + " = " + prod + ". Check: " + parseInt(a, 2) + " × " + parseInt(c, 2) + " = " + prod + ". (An n-bit × m-bit product needs at most n + m bits.)");
      out.push(snap(-1, [cRow, sRow]));
      return out;
    }

    function draw() {
      const f = frames[idx];
      if (!f) return;
      let html = '<table style="width:auto"><tbody>';
      f.rows.forEach((r) => {
        const style = r.cls === "carry" ? "color:var(--warn);font-size:0.8em" : r.cls === "sum" ? "font-weight:700;color:var(--accent)" : "";
        const top = r.cls === "sum" ? "border-top:2px solid var(--text);" : "";
        html += "<tr><th>" + r.label + "</th>" + r.cells.map((x, i) => '<td class="mono" style="padding:6px 8px;text-align:center;' + top + style + (i === f.hl ? ";background:var(--accent-soft)" : "") + '">' + (x === "" ? "&nbsp;" : x) + "</td>").join("") + "</tr>";
      });
      grid.innerHTML = html + "</tbody></table>";
      colCount = frames.slice(0, idx + 1).filter((x) => x.column).length;
      stat.textContent = "Step " + idx + " / " + (frames.length - 1) + " · columns added: " + colCount;
      log.textContent = f.log.join("\n");
      log.scrollTop = log.scrollHeight;
      stepB.disabled = idx >= frames.length - 1;
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      runB.textContent = "⏩ Run";
    }
    function rebuild() {
      stop();
      wLab.style.display = mode === "add" ? "" : "none";
      const a = aIn.value.replace(/\s/g, ""), c = bIn.value.replace(/\s/g, "");
      const bad = (m) => { err.textContent = m; err.style.display = ""; frames = []; grid.innerHTML = ""; log.textContent = ""; stat.textContent = ""; };
      if (!/^[01]+$/.test(a) || !/^[01]+$/.test(c)) return bad("A and B must be binary (only 0s and 1s).");
      if (mode === "add" && (a.length > width || c.length > width)) return bad("Each number must fit in the " + width + "-bit register. Increase the width or shorten the numbers.");
      if (mode === "mul" && (a.length > 8 || c.length > 8)) return bad("For multiplication keep each number to 8 bits or fewer.");
      err.style.display = "none";
      frames = mode === "add" ? buildAdd(a, c) : buildMul(a, c);
      idx = 0;
      draw();
    }
    function step() {
      if (idx < frames.length - 1) { idx++; draw(); }
      if (idx >= frames.length - 1) stop();
    }
    stepB.addEventListener("click", () => { stop(); step(); });
    resetB.addEventListener("click", rebuild);
    runB.addEventListener("click", () => {
      if (timer) return stop();
      if (idx >= frames.length - 1) { idx = 0; draw(); }
      runB.textContent = "⏸ Pause";
      timer = setInterval(() => { if (!el.isConnected) return stop(); step(); }, 1500 / Number(speed.value));
    });
    speed.addEventListener("change", () => { if (timer) { stop(); runB.click(); } });
    modeSel.addEventListener("change", () => { mode = modeSel.value; setDefaults(); rebuild(); });
    wSel.addEventListener("change", () => { width = parseInt(wSel.value, 10); rebuild(); });
    [aIn, bIn].forEach((x) => x.addEventListener("input", rebuild));
    setDefaults();
    if (params.a && /^[01]+$/.test(params.a)) aIn.value = params.a;
    if (params.b && /^[01]+$/.test(params.b)) bIn.value = params.b;
    rebuild();
  },
});
