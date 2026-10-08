/* base-converter: denary ↔ binary ↔ hexadecimal with step-by-step working (AQA 4.5.2). */
CS.registerTool({
  id: "base-converter",
  title: "Denary / binary / hex converter",
  section: "5",
  topic: "5.2",
  icon: "🔢",
  desc: "Type in any box — denary, binary or hex — and the other two update live, with the working set out the way an exam answer should be.",
  help: "Type a number in **any** of the three boxes; the other two follow. The working underneath changes depending on which box you typed in:\n\n- **Denary → binary** is shown both ways AQA accept: *repeated subtraction* of place values (128, 64, 32 …) and *repeated division by 2* (read the remainders from the bottom up).\n- **Binary → denary** uses a place-value table: add up the headings of the columns that hold a 1.\n- **Binary ↔ hex** groups the bits into nibbles (4 bits = 1 hex digit). Pad on the left with zeros first.\n- **Denary → hex** uses repeated division by 16; **hex → denary** multiplies each digit by its place value (16, 1).\n\nChange the **width** to see when a number no longer fits — an 8-bit unsigned register holds 0–255 only.",
  mount(el, params) {
    const h = CS.util.el;
    const WIDTHS = [4, 8, 16];
    let bits = WIDTHS.includes(parseInt(params.bits, 10)) ? parseInt(params.bits, 10) : 8;
    let src = "den";

    const den = h("input", { type: "text", inputmode: "numeric", "aria-label": "Denary value", placeholder: "e.g. 173", style: "width:110px" });
    const bin = h("input", { type: "text", inputmode: "numeric", "aria-label": "Binary value", placeholder: "e.g. 10101101", style: "width:190px;font-family:var(--font-mono)" });
    const hex = h("input", { type: "text", "aria-label": "Hexadecimal value", placeholder: "e.g. AD", style: "width:90px;font-family:var(--font-mono)" });
    const sel = h("select", { "aria-label": "Bit width" });
    WIDTHS.forEach((w) => sel.appendChild(h("option", { value: w, text: w + "-bit" })));
    sel.value = String(bits);
    const controls = h("div", { class: "controls" }, [
      h("label", {}, ["Denary", den]),
      h("label", {}, ["Binary", bin]),
      h("label", {}, ["Hex", hex]),
      h("label", {}, ["Width", sel]),
    ]);
    const err = h("div", { class: "err", style: "display:none", role: "alert" });
    const summary = h("div", { class: "stat-line" });
    const work = h("div", { class: "steps-out" });
    el.append(controls, err, summary, work);

    const HEX = "0123456789ABCDEF";
    const b = (s) => "<b>" + s + "</b>";
    function table(head, rows) {
      return '<div class="table-wrap"><table><thead><tr>' + head.map((x) => "<th>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
    function group4(s) {
      return s.replace(/(.{4})(?=.)/g, "$1 ");
    }

    /* ---------- working generators (all return HTML strings) ---------- */
    function placeValueTable(bs) {
      const n = bs.length, heads = [], row = [], terms = [];
      for (let i = 0; i < n; i++) {
        const pv = 2 ** (n - 1 - i);
        heads.push(String(pv));
        row.push(bs[i] === "1" ? b("1") : '<span class="muted">0</span>');
        if (bs[i] === "1") terms.push(String(pv));
      }
      const total = terms.reduce((a, t) => a + Number(t), 0);
      return "<p>" + b("Binary → denary (place-value table).") + " Write the place values (doubling from 1 on the right) above each bit, then add the headings of every column that holds a 1.</p>" + table(heads, [row]) + '<p class="mono">' + (terms.length ? terms.join(" + ") + " = " + b(total) : "no column holds a 1 → " + b("0")) + "</p>";
    }
    function repeatedSubtraction(v, n) {
      const rows = [];
      let rem = v, out = "";
      for (let i = n - 1; i >= 0; i--) {
        const pv = 2 ** i;
        if (pv <= rem) {
          rows.push([pv, rem + " ≥ " + pv + " → fits", b("1"), rem + " − " + pv + " = " + (rem - pv)]);
          rem -= pv;
          out += "1";
        } else {
          rows.push([pv, rem + " < " + pv + " → does not fit", "0", String(rem)]);
          out += "0";
        }
      }
      return "<p>" + b("Method 1 — repeated subtraction.") + " Start at the biggest place value. If it fits, write a 1 and subtract it; if not, write a 0.</p>" + table(["Place value", "Does it fit?", "Bit", "Left over"], rows) + "<p>Read the bits top to bottom: " + b(group4(out)) + " (left over is 0, so the conversion is complete).</p>";
    }
    function repeatedDivision(v, base) {
      const rows = [], digits = [];
      let q = v;
      if (v === 0) {
        rows.push(["0 ÷ " + base, "0", "0"]);
        digits.push("0");
      }
      while (q > 0) {
        const r = q % base, nq = Math.floor(q / base);
        rows.push([q + " ÷ " + base, String(nq), r + (base === 16 && r > 9 ? " = " + HEX[r] : "")]);
        digits.push(base === 16 ? HEX[r] : String(r));
        q = nq;
      }
      const read = digits.slice().reverse().join("");
      return "<p>" + b((base === 2 ? "Method 2 — repeated division by 2." : "Denary → hex: repeated division by 16.")) + " Divide by " + base + ", write down the remainder, repeat with the quotient until it reaches 0.</p>" + table(["Division", "Quotient", "Remainder"], rows) + "<p>Read the remainders from the " + b("bottom up") + ": " + b(base === 2 ? group4(read) : read) + (base === 2 ? ". Pad on the left with zeros to fill the register." : "") + "</p>";
    }
    function nibbleGrouping(bs) {
      const padded = bs.padStart(Math.ceil(bs.length / 4) * 4, "0");
      const groups = padded.match(/.{4}/g);
      const rows = groups.map((g) => {
        const v = parseInt(g, 2);
        const terms = [];
        for (let i = 0; i < 4; i++) if (g[i] === "1") terms.push(String(2 ** (3 - i)));
        return [g, (terms.length ? terms.join(" + ") : "0") + " = " + v, b(HEX[v])];
      });
      return "<p>" + b("Binary → hex (nibble grouping).") + " Split the bits into groups of 4 from the right (each group is one hex digit, 0–F). Pad the left-most group with zeros if needed.</p>" + table(["Nibble (8 4 2 1)", "Value", "Hex digit"], rows) + "<p>Hex: " + b(groups.map((g) => HEX[parseInt(g, 2)]).join("")) + "</p>";
    }
    function hexToBinary(hs) {
      const rows = hs.split("").map((d) => [d, String(HEX.indexOf(d)), b(HEX.indexOf(d).toString(2).padStart(4, "0"))]);
      return "<p>" + b("Hex → binary.") + " Each hex digit becomes exactly one nibble (4 bits). Keep leading zeros inside each nibble.</p>" + table(["Hex digit", "Denary", "Nibble"], rows) + "<p>Binary: " + b(rows.map((r) => r[2]).join(" ")) + "</p>";
    }
    function hexPlaceValues(hs) {
      const n = hs.length, heads = [], row = [], terms = [], parts = [];
      for (let i = 0; i < n; i++) {
        const pv = 16 ** (n - 1 - i), d = HEX.indexOf(hs[i]);
        heads.push("16<sup>" + (n - 1 - i) + "</sup> = " + pv);
        row.push(hs[i] + " (" + d + ")");
        terms.push(d + " × " + pv);
        parts.push(String(d * pv));
      }
      const total = parts.reduce((a, t) => a + Number(t), 0);
      return "<p>" + b("Hex → denary (place values).") + " Each column is worth 16 times the one to its right. Multiply each digit's value by its place value and add.</p>" + table(heads, [row]) + '<p class="mono">' + terms.join(" + ") + " = " + parts.join(" + ") + " = " + b(total) + "</p>";
    }

    /* ---------- validation + live update ---------- */
    function fail(msg) {
      err.textContent = msg;
      err.style.display = "";
      summary.textContent = "";
      work.innerHTML = '<p class="muted">Fix the input above to see the working.</p>';
    }
    function update() {
      const max = 2 ** bits - 1;
      let v;
      try {
        if (src === "den") {
          const s = den.value.trim().replace(/[\s,]/g, "");
          if (s === "") return fail("Type a denary number (0 to " + max + ").");
          if (!/^\d+$/.test(s)) return fail("Denary must be whole-number digits only (no sign, no decimal point).");
          v = parseInt(s, 10);
          if (v > max) return fail(s + " needs more than " + bits + " bits: the largest unsigned " + bits + "-bit value is 2^" + bits + " − 1 = " + max + ". Increase the width.");
        } else if (src === "bin") {
          const s = bin.value.replace(/\s/g, "");
          if (s === "") return fail("Type a binary pattern (0s and 1s).");
          if (!/^[01]+$/.test(s)) return fail("Binary may only contain 0 and 1.");
          if (s.length > bits) return fail("That pattern is " + s.length + " bits long but the width is " + bits + ". Increase the width or remove bits.");
          v = parseInt(s, 2);
        } else {
          const s = hex.value.replace(/\s/g, "").replace(/^0x/i, "").toUpperCase();
          if (s === "") return fail("Type a hex number (digits 0–9 and letters A–F).");
          if (!/^[0-9A-F]+$/.test(s)) return fail("Hex may only contain 0–9 and A–F.");
          if (s.length > bits / 4) return fail("That is " + s.length + " hex digits = " + s.length * 4 + " bits, more than the " + bits + "-bit width.");
          v = parseInt(s, 16);
        }
      } catch (e) {
        return fail("Could not read that input.");
      }
      err.style.display = "none";
      const bs = v.toString(2).padStart(bits, "0");
      const hs = v.toString(16).toUpperCase().padStart(bits / 4, "0");
      if (src !== "den") den.value = String(v);
      if (src !== "bin") bin.value = group4(bs);
      if (src !== "hex") hex.value = hs;
      summary.innerHTML = b(v) + "<sub>10</sub> = " + b(group4(bs)) + "<sub>2</sub> = " + b(hs) + "<sub>16</sub> &nbsp;(" + bits + "-bit, unsigned)";
      let html = "";
      if (src === "den") html = repeatedSubtraction(v, bits) + repeatedDivision(v, 2) + "<hr>" + repeatedDivision(v, 16) + "<p>Check via the nibbles of the binary answer:</p>" + nibbleGrouping(bs);
      else if (src === "bin") html = placeValueTable(bs) + "<hr>" + nibbleGrouping(bs);
      else html = hexToBinary(hs) + "<hr>" + hexPlaceValues(hs) + "<p>Check via the place values of the binary pattern:</p>" + placeValueTable(bs);
      work.innerHTML = html;
    }
    den.addEventListener("input", () => { src = "den"; update(); });
    bin.addEventListener("input", () => { src = "bin"; update(); });
    hex.addEventListener("input", () => { src = "hex"; update(); });
    sel.addEventListener("change", () => { bits = parseInt(sel.value, 10); update(); });
    den.value = String(params.value != null && /^\d+$/.test(String(params.value)) ? params.value : 173);
    update();
  },
});
