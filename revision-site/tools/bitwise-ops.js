/* bitwise-ops: AND / OR / XOR / NOT and logical shifts, with masks (AQA 4.5.4, 4.7.3.5). */
CS.registerTool({
  id: "bitwise-ops",
  title: "Bitwise operations and shifts",
  section: "5",
  topic: "5.4",
  icon: "🧮",
  desc: "Apply AND, OR, XOR, NOT and logical shifts to bit patterns, see which bits a mask keeps, clears, sets or toggles, and what a shift does in denary.",
  help: "Click the bits of **A** and **B** (or type them), then choose an operation.\n\n- **AND** with a mask *keeps* the bits where the mask is 1 and *clears* the rest — used to test or isolate bits.\n- **OR** with a mask *sets* the bits where the mask is 1.\n- **XOR** with a mask *toggles* (flips) the bits where the mask is 1. XOR-ing twice with the same mask gets the original back.\n- **NOT** flips every bit of A.\n- **Logical shift left** by n moves every bit n places left; bits fall off the left and **0s fill in on the right**. Each place multiplies by 2 (as long as no 1s fall off).\n- **Logical shift right** by n moves bits right; bits fall off the right, 0s fill on the left. Each place is an integer division by 2 (the remainder is lost).\n\nThese are exactly the AQA assembly instructions AND, ORR, EOR, MVN, LSL and LSR.",
  mount(el, params) {
    const h = CS.util.el;
    let n = [4, 8, 16].includes(parseInt(params.bits, 10)) ? parseInt(params.bits, 10) : 8;
    let A = 0b10110110, B = 0b00001111, op = params.op || "AND", sh = 2;
    const mask = () => 2 ** n - 1;
    const bin = (v) => (v >>> 0).toString(2).padStart(n, "0").slice(-n);

    const wSel = h("select", { "aria-label": "Bit width" });
    [4, 8, 16].forEach((w) => wSel.appendChild(h("option", { value: w, text: w + "-bit" })));
    wSel.value = String(n);
    const aIn = h("input", { type: "text", "aria-label": "Pattern A", style: "width:190px;font-family:var(--font-mono)" });
    const bIn = h("input", { type: "text", "aria-label": "Pattern B (mask)", style: "width:190px;font-family:var(--font-mono)" });
    const shIn = h("input", { type: "number", min: "0", max: "16", value: String(sh), "aria-label": "Shift places", style: "width:70px" });
    el.append(h("div", { class: "controls" }, [h("label", {}, ["Width", wSel]), h("label", {}, ["A", aIn]), h("label", {}, ["B / mask", bIn])]));
    const opBar = h("div", { class: "controls", role: "group", "aria-label": "Operation" });
    const OPS = [["AND", "A AND B"], ["OR", "A OR B"], ["XOR", "A XOR B"], ["NOT", "NOT A"], ["LSL", "Shift left"], ["LSR", "Shift right"]];
    const opBtns = {};
    OPS.forEach(([k, t]) => {
      const bt = h("button", { class: "btn sm", type: "button", text: t, "aria-pressed": "false" });
      bt.addEventListener("click", () => { op = k; render(); });
      opBtns[k] = bt;
      opBar.appendChild(bt);
    });
    opBar.appendChild(h("label", {}, ["by", shIn, "places"]));
    el.appendChild(opBar);
    const err = h("div", { class: "err", role: "alert", style: "display:none" });
    const view = h("div", { class: "table-wrap", style: "padding:10px" });
    const explain = h("div", { class: "steps-out" });
    el.append(err, view, explain);

    function bitRow(label, v, opts) {
      opts = opts || {};
      const row = h("div", { style: "display:flex;gap:8px;align-items:center;margin:4px 0;flex-wrap:nowrap" });
      row.appendChild(h("div", { class: "mono small", style: "min-width:78px;text-align:right", text: label }));
      const bits = h("div", { class: "bits", style: "flex-wrap:nowrap" });
      const s = typeof v === "string" ? v : bin(v);
      for (let i = 0; i < s.length; i++) {
        const cls = "bit" + (s[i] === "1" ? " on" : "");
        const st = (opts.styles && opts.styles[i]) || "";
        const attrs = { class: cls, style: "width:30px;height:34px;" + st, text: s[i] };
        let node;
        if (opts.toggle) {
          node = h("button", Object.assign(attrs, { type: "button", "aria-label": label + " bit " + (n - 1 - i) + " = " + s[i] }));
          node.addEventListener("click", () => opts.toggle(n - 1 - i));
        } else node = h("div", attrs);
        bits.appendChild(node);
      }
      row.appendChild(bits);
      if (opts.right) row.appendChild(h("div", { class: "mono small", html: opts.right }));
      return row;
    }
    const hiStyle = "outline:3px solid var(--warn);outline-offset:-3px;";
    const lostStyle = "background:var(--bad-soft);color:var(--bad);border-color:var(--bad);text-decoration:line-through;";
    const fillStyle = "background:var(--ok-soft);color:var(--ok);border-color:var(--ok);";

    function readBits(s) {
      s = s.replace(/\s/g, "");
      if (!/^[01]+$/.test(s)) return null;
      if (s.length > n) return undefined;
      return parseInt(s, 2);
    }
    function render() {
      Object.keys(opBtns).forEach((k) => { opBtns[k].classList.toggle("primary", k === op); opBtns[k].setAttribute("aria-pressed", String(k === op)); });
      shIn.parentElement.style.display = op === "LSL" || op === "LSR" ? "" : "none";
      bIn.parentElement.style.display = ["AND", "OR", "XOR"].includes(op) ? "" : "none";
      if (document.activeElement !== aIn) aIn.value = bin(A);
      if (document.activeElement !== bIn) bIn.value = bin(B);
      view.innerHTML = "";
      const tA = (i) => { A ^= 1 << i; render(); };
      const tB = (i) => { B ^= 1 << i; render(); };
      const sa = bin(A), sb = bin(B);
      let html = "";
      if (["AND", "OR", "XOR"].includes(op)) {
        const r = op === "AND" ? A & B : op === "OR" ? A | B : A ^ B;
        const sr = bin(r);
        view.append(bitRow("A", A, { toggle: tA, right: "= " + A }), bitRow(op === "AND" ? "AND B" : op === "OR" ? "OR B" : "XOR B", B, { toggle: tB, right: "= " + B }), h("hr", { style: "margin:4px 0" }), bitRow("Result", r, { styles: sr.split("").map((c, i) => (c !== sa[i] ? hiStyle : "")), right: "= " + r }));
        const rule = { AND: "1 only when <b>both</b> bits are 1", OR: "1 when <b>either or both</b> bits are 1", XOR: "1 when the bits are <b>different</b>" }[op];
        html += "<p><b>" + op + "</b> works on each column separately: the result bit is " + rule + ".</p>";
        const keep = [], other = [];
        for (let i = 0; i < n; i++) {
          const pos = n - 1 - i;
          if (sb[i] === "1") keep.push(pos); else other.push(pos);
        }
        const list = (a) => (a.length ? a.join(", ") : "none");
        html += "<p><b>As a mask:</b> treat B as a mask over A (bit positions numbered from 0 on the right).</p><ul>";
        if (op === "AND") html += "<li>Mask bits = 1 at positions " + list(keep) + " → those bits of A are <b>kept</b> (copied through).</li><li>Mask bits = 0 at positions " + list(other) + " → those bits are <b>cleared</b> to 0.</li><li>Use: isolate bits, e.g. AND 00001111 keeps the low nibble; test a bit by AND-ing with a mask that has just that bit set and checking for non-zero.</li>";
        if (op === "OR") html += "<li>Mask bits = 1 at positions " + list(keep) + " → those bits are <b>set</b> to 1.</li><li>Mask bits = 0 at positions " + list(other) + " → A's bits pass through unchanged.</li><li>Use: switch particular bits (flags) on without touching the others.</li>";
        if (op === "XOR") html += "<li>Mask bits = 1 at positions " + list(keep) + " → those bits are <b>toggled</b> (flipped).</li><li>Mask bits = 0 at positions " + list(other) + " → unchanged.</li><li>XOR the result with the same mask again and you get A back (" + bin(r ^ B) + ") — the idea behind the Vernam cipher.</li>";
        html += "</ul><p class=small>Amber outline = bits of the result that differ from A.</p>";
      } else if (op === "NOT") {
        const r = ~A & mask();
        view.append(bitRow("A", A, { toggle: tA, right: "= " + A }), h("hr", { style: "margin:4px 0" }), bitRow("NOT A", r, { right: "= " + r }));
        html += "<p><b>NOT</b> (AQA assembly <span class=mono>MVN</span>) inverts every bit: 1 → 0 and 0 → 1. As unsigned values, NOT A = " + mask() + " − A = " + r + ". (In two's complement, NOT A = −A − 1, which is why two's complement negation is \"invert then add 1\".)</p>";
      } else {
        let s = parseInt(shIn.value, 10);
        if (isNaN(s) || s < 0 || s > n) {
          err.textContent = "Shift by 0 to " + n + " places.";
          err.style.display = "";
          explain.innerHTML = "";
          return;
        }
        sh = s;
        const left = op === "LSL";
        const r = left ? (A << s) & mask() : A >>> s;
        const sr = bin(r);
        const lost = left ? sa.slice(0, s) : sa.slice(n - s);
        const aStyles = sa.split("").map((c, i) => ((left ? i < s : i >= n - s) ? lostStyle : ""));
        const rStyles = sr.split("").map((c, i) => ((left ? i >= n - s : i < s) ? fillStyle : ""));
        view.append(bitRow("A", A, { toggle: tA, styles: aStyles, right: "= " + A }), h("div", { class: "small muted", style: "margin-left:86px", text: (left ? "← every bit moves " : "every bit moves → ") + s + " place" + (s === 1 ? "" : "s") }), bitRow((left ? "LSL " : "LSR ") + s, r, { styles: rStyles, right: "= " + r }));
        const lostOnes = lost.includes("1");
        html += "<p><b>Logical shift " + (left ? "left" : "right") + " by " + s + "</b>: every bit moves " + s + " place" + (s === 1 ? "" : "s") + " " + (left ? "left" : "right") + ". The " + s + " bit" + (s === 1 ? "" : "s") + " pushed off the " + (left ? "left" : "right") + " end <span style='color:var(--bad)'>(red, struck through: " + (lost || "none") + ")</span> are lost, and " + s + " zero" + (s === 1 ? "" : "s") + " <span style='color:var(--ok)'>(green)</span> fill in on the " + (left ? "right" : "left") + ".</p>";
        if (left) {
          html += lostOnes
            ? "<p class=bad-text style="color:var(--bad);font-weight:600">A 1 fell off the left, so the result is <b>not</b> " + A + " × 2<sup>" + s + "</sup> = " + A * 2 ** s + " (it does not fit in " + n + " bits). The " + n + "-bit result is " + r + " = " + A * 2 ** s + " MOD " + 2 ** n + ".</p>"
            : "<p class=ok-text>Shifting left " + s + " place" + (s === 1 ? "" : "s") + " multiplies by 2<sup>" + s + "</sup> = " + 2 ** s + ": " + A + " × " + 2 ** s + " = " + r + ".</p>";
        } else {
          html += "<p class=ok-text>Shifting right " + s + " place" + (s === 1 ? "" : "s") + " divides by 2<sup>" + s + "</sup> = " + 2 ** s + " and discards the remainder: " + A + " DIV " + 2 ** s + " = " + r + (lostOnes ? " (remainder " + (A % 2 ** s) + " lost — the bits that fell off)" : " (exact — only 0s fell off)") + ".</p>";
        }
        html += "<p class=small>A logical shift always fills with 0. (An arithmetic shift right would copy the sign bit instead — not needed for AQA.)</p>";
      }
      err.style.display = "none";
      explain.innerHTML = html;
    }
    aIn.addEventListener("input", () => {
      const v = readBits(aIn.value);
      if (v == null) { err.textContent = v === undefined ? "A has more than " + n + " bits." : "A must contain only 0s and 1s."; err.style.display = ""; return; }
      A = v; render();
    });
    bIn.addEventListener("input", () => {
      const v = readBits(bIn.value);
      if (v == null) { err.textContent = v === undefined ? "B has more than " + n + " bits." : "B must contain only 0s and 1s."; err.style.display = ""; return; }
      B = v; render();
    });
    shIn.addEventListener("input", render);
    wSel.addEventListener("change", () => { n = parseInt(wSel.value, 10); A &= mask(); B &= mask(); shIn.max = String(n); render(); });
    if (params.a && /^[01]+$/.test(params.a)) A = parseInt(params.a, 2) & mask();
    if (params.b && /^[01]+$/.test(params.b)) B = parseInt(params.b, 2) & mask();
    if (!opBtns[op]) op = "AND";
    render();
  },
});
