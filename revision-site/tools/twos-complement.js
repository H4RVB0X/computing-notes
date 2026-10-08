/* twos-complement: represent, decode, add/subtract with overflow (AQA 4.5.4.2–4.5.4.3). */
CS.registerTool({
  id: "twos-complement",
  title: "Two's complement workbench",
  section: "5",
  topic: "5.4",
  icon: "➖",
  desc: "Represent negative numbers in two's complement, decode a pattern using the negative MSB, and add or subtract with carries and overflow detection.",
  help: "Pick a **width** (number of bits) first — the range for that width is shown at the top.\n\n- **Denary → two's complement**: for a negative number the tool writes the positive version, **inverts every bit, then adds 1** (carries shown), and also shows the shortcut: *copy the bits from the right up to and including the first 1, then flip the rest*.\n- **Decode a pattern**: the MSB has a **negative** place value (−128 in 8 bits). Add up the place values of the 1s.\n- **Add / subtract**: subtraction is done as *A + (−B)*. Carries are shown column by column. A carry out of the MSB is simply discarded; **overflow** happens when two numbers of the same sign give an answer of the opposite sign (the true answer is outside the range).",
  mount(el, params) {
    const h = CS.util.el;
    const WIDTHS = [4, 6, 8, 12, 16];
    let n = WIDTHS.includes(parseInt(params.bits, 10)) ? parseInt(params.bits, 10) : 8;
    const b = (s) => "<b>" + s + "</b>";
    const lo = () => -(2 ** (n - 1));
    const hi = () => 2 ** (n - 1) - 1;
    const toTC = (v) => (((v % 2 ** n) + 2 ** n) % 2 ** n).toString(2).padStart(n, "0");
    const fromTC = (bs) => parseInt(bs, 2) - (bs[0] === "1" ? 2 ** n : 0);
    const invert = (bs) => bs.replace(/[01]/g, (c) => (c === "1" ? "0" : "1"));

    function table(head, rows) {
      return '<div class="table-wrap"><table><thead><tr>' + head.map((x) => "<th>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
    function placeTable(bs) {
      const heads = [], row = [], terms = [];
      for (let i = 0; i < bs.length; i++) {
        const pv = i === 0 ? -(2 ** (bs.length - 1)) : 2 ** (bs.length - 1 - i);
        heads.push(String(pv));
        row.push(bs[i] === "1" ? b("1") : '<span class="muted">0</span>');
        if (bs[i] === "1") terms.push(pv < 0 ? "(" + pv + ")" : String(pv));
      }
      const total = fromTC(bs);
      return table(heads, [row]) + '<p class="mono">' + (terms.length ? terms.join(" + ") + " = " + b(total) : "no 1s → " + b(0)) + "</p>";
    }
    /* binary addition of two equal-length patterns, column by column */
    function addCols(a, c) {
      const len = a.length, carry = new Array(len + 1).fill(0), sum = new Array(len).fill("0"), log = [];
      for (let i = len - 1; i >= 0; i--) {
        const t = Number(a[i]) + Number(c[i]) + carry[i + 1];
        sum[i] = String(t % 2);
        carry[i] = t >> 1;
        log.push("Column " + (len - 1 - i) + (i === len - 1 ? " (right-most)" : i === 0 ? " (MSB)" : "") + ": " + a[i] + " + " + c[i] + " + carry " + carry[i + 1] + " = " + t + " → write " + sum[i] + ", carry " + carry[i]);
      }
      return { sum: sum.join(""), carry, carryOut: carry[0], log };
    }
    function addTable(a, c, r, labA, labB) {
      const cells = (s, cls) => ["", ...s.split("")].map((x) => '<td class="mono' + (cls || "") + '">' + x + "</td>").join("");
      const carryRow = r.carry.map((x, i) => '<td class="mono" style="color:var(--warn);font-size:0.8em">' + (i === 0 ? (x ? "(" + x + ")" : "") : r.carry[i] ? x : "") + "</td>").join("");
      return '<div class="table-wrap"><table style="width:auto"><tbody>' +
        '<tr><th>Carry</th>' + carryRow + "</tr>" +
        "<tr><th>" + labA + "</th>" + cells(a) + "</tr>" +
        "<tr><th>" + labB + "</th>" + cells(c) + "</tr>" +
        '<tr><th>Result</th><td class="mono muted">' + (r.carryOut ? "<s>1</s>" : "") + "</td>" + r.sum.split("").map((x) => '<td class="mono"><b>' + x + "</b></td>").join("") + "</tr>" +
        "</tbody></table></div>";
    }

    /* ---------- UI ---------- */
    const sel = h("select", { "aria-label": "Number of bits" });
    WIDTHS.forEach((w) => sel.appendChild(h("option", { value: w, text: w + " bits" })));
    sel.value = String(n);
    const range = h("span", { class: "stat-line" });
    el.append(h("div", { class: "controls" }, [h("label", {}, ["Width", sel]), range]));
    const tabs = h("div", { class: "tabs" });
    const bar = h("div", { class: "tab-bar", role: "tablist" });
    tabs.appendChild(bar);
    const panels = [];
    ["Denary → two's complement", "Decode a pattern", "Add / subtract"].forEach((name, i) => {
      const btn = h("button", { class: "tab-btn" + (i ? "" : " active"), type: "button", role: "tab", text: name });
      const panel = h("div", { class: "tab-panel" + (i ? "" : " active"), role: "tabpanel" });
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".tab-btn").forEach((x) => x.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        panel.classList.add("active");
      });
      bar.appendChild(btn);
      tabs.appendChild(panel);
      panels.push(panel);
    });
    el.appendChild(tabs);

    // Tab 1: represent
    const repIn = h("input", { type: "text", value: params.value || "-77", "aria-label": "Denary integer", style: "width:110px" });
    const repOut = h("div", { class: "steps-out" });
    panels[0].append(h("div", { class: "controls" }, [h("label", {}, ["Denary", repIn])]), repOut);
    // Tab 2: decode
    const decIn = h("input", { type: "text", value: "10110011", "aria-label": "Two's complement pattern", style: "width:200px;font-family:var(--font-mono)" });
    const decOut = h("div", { class: "steps-out" });
    panels[1].append(h("div", { class: "controls" }, [h("label", {}, ["Bit pattern", decIn])]), decOut);
    // Tab 3: add/sub
    const aIn = h("input", { type: "text", value: "100", "aria-label": "First number A (denary)", style: "width:90px" });
    const opSel = h("select", { "aria-label": "Operation" }, [h("option", { value: "+", text: "+" }), h("option", { value: "-", text: "−" })]);
    const bIn = h("input", { type: "text", value: "50", "aria-label": "Second number B (denary)", style: "width:90px" });
    const asOut = h("div", { class: "steps-out" });
    panels[2].append(h("div", { class: "controls" }, [h("label", {}, ["A", aIn]), opSel, h("label", {}, ["B", bIn])]), asOut);

    const errHtml = (m) => '<p class="err" role="alert">' + CS.util.esc(m) + "</p>";
    function readInt(s) {
      s = String(s).trim().replace(/−/g, "-");
      return /^[-+]?\d+$/.test(s) ? parseInt(s, 10) : null;
    }

    function represent() {
      const v = readInt(repIn.value);
      if (v === null) return (repOut.innerHTML = errHtml("Enter a whole number, e.g. -77."));
      if (v < lo() || v > hi()) return (repOut.innerHTML = errHtml(v + " is out of range: " + n + "-bit two's complement holds " + lo() + " to " + hi() + "."));
      const pat = toTC(v);
      let html = "";
      if (v >= 0) {
        html += "<p>" + b(v + " is positive") + ", so its two's complement form is just its ordinary binary, padded to " + n + " bits. The MSB is 0, meaning positive.</p>" + placeTable(pat);
      } else if (v === lo()) {
        html += "<p>" + b(v + " is the most negative value") + " for " + n + " bits: only the MSB is set, worth " + lo() + ". (+" + -v + " itself does not fit in " + n + "-bit two's complement, but invert-and-add-one on the unsigned pattern still gives the right answer.)</p>";
        const pos = (-v).toString(2).padStart(n, "0"), inv = invert(pos), r = addCols(inv, "1".padStart(n, "0"));
        html += "<ol><li>Unsigned " + -v + " = <span class=mono>" + pos + "</span></li><li>Invert every bit: <span class=mono>" + inv + "</span></li><li>Add 1: <span class=mono>" + b(r.sum) + "</span></li></ol>" + placeTable(pat);
      } else {
        const pos = toTC(-v), inv = invert(pos), one = "1".padStart(n, "0"), r = addCols(inv, one);
        html += "<p>" + b(v + " is negative") + ", so use " + b("invert and add 1") + ":</p><ol>" +
          "<li>Write the positive value +" + -v + " in " + n + " bits: <span class=mono>" + pos + "</span></li>" +
          "<li>Invert (flip) every bit: <span class=mono>" + inv + "</span></li>" +
          "<li>Add 1, carrying as in ordinary binary addition:" + addTable(inv, one, r, "Inverted", "+1") + "</li></ol>" +
          "<p>Answer: " + v + " = " + b('<span class="mono">' + r.sum + "</span>") + "</p>";
        const k = pos.lastIndexOf("1");
        const sc = pos.split("").map((c, i) => (i >= k ? '<span class="pill ok" title="copied">' + c + "</span>" : '<span class="pill warn" title="flipped">' + (c === "1" ? "0" : "1") + "</span>")).join(" ");
        html += "<p>" + b("Shortcut:") + " starting from the right of <span class=mono>" + pos + "</span>, copy every bit up to and including the first 1 (green), then flip all the bits to its left (amber):</p><p>" + sc + "</p>";
        html += "<p>" + b("Check") + " with place values (the MSB is worth " + lo() + "):</p>" + placeTable(pat);
      }
      repOut.innerHTML = html;
    }

    function decode() {
      const s = decIn.value.replace(/\s/g, "");
      if (!/^[01]+$/.test(s)) return (decOut.innerHTML = errHtml("Type a pattern of 0s and 1s."));
      if (s.length !== n) return (decOut.innerHTML = errHtml("The pattern has " + s.length + " bits but the width is " + n + ". Two's complement needs the full width (the MSB is the sign bit), so pad or change the width."));
      const v = fromTC(s);
      let html = "<p>" + b("Method 1 — place values.") + " In two's complement the MSB has a " + b("negative") + " place value (" + lo() + "); all the others are positive as usual.</p>" + placeTable(s);
      if (s[0] === "1") {
        const inv = invert(s), r = addCols(inv, "1".padStart(n, "0"));
        html += "<p>" + b("Method 2 — invert and add 1.") + " The MSB is 1 so the number is negative. Invert: <span class=mono>" + inv + "</span>, add 1: <span class=mono>" + r.sum + "</span> = " + parseInt(r.sum, 2) + ", so the value is " + b(v) + ".</p>";
      } else html += "<p>The MSB is 0, so the number is positive and reads exactly like unsigned binary.</p>";
      decOut.innerHTML = html;
    }

    function addsub() {
      const A = readInt(aIn.value), B = readInt(bIn.value), op = opSel.value;
      if (A === null || B === null) return (asOut.innerHTML = errHtml("Enter whole numbers for A and B."));
      for (const [nm, x] of [["A", A], ["B", B]]) if (x < lo() || x > hi()) return (asOut.innerHTML = errHtml(nm + " = " + x + " is outside the " + n + "-bit range " + lo() + " to " + hi() + "."));
      const pa = toTC(A), pb = toTC(B);
      let html = "<p>A = " + A + " → <span class=mono>" + pa + "</span>; B = " + B + " → <span class=mono>" + pb + "</span></p>";
      let second = pb, lab = "B";
      if (op === "-") {
        const inv = invert(pb), r1 = addCols(inv, "1".padStart(n, "0"));
        second = r1.sum;
        lab = "−B";
        html += "<p>" + b("Subtraction is done as A + (−B).") + " Find −B by inverting B and adding 1: <span class=mono>" + pb + "</span> → <span class=mono>" + inv + "</span> → <span class=mono>" + b(second) + "</span>" + (B === lo() ? ' <span class="pill warn">+' + -B + " does not fit in " + n + " bits, so −B gives the same pattern back</span>" : "") + "</p>";
      }
      const r = addCols(pa, second);
      const truth = op === "+" ? A + B : A - B;
      const got = fromTC(r.sum);
      html += "<p>" + b("Add column by column, right to left:") + "</p>" + addTable(pa, second, r, "A", lab) + "<ol>" + r.log.map((x) => "<li class=small>" + x + "</li>").join("") + "</ol>";
      html += "<p>Result pattern <span class=mono>" + b(r.sum) + "</span> decodes to " + b(got) + "." + (r.carryOut ? " The carry out of the MSB (shown struck through) is " + b("discarded") + " — in two's complement that alone is not an error." : "") + "</p>";
      if (truth < lo() || truth > hi()) {
        const sa = pa[0], sb = second[0];
        html += '<p class="err">⚠ Overflow! The true answer ' + truth + " is outside the range " + lo() + " to " + hi() + ", so the " + n + "-bit result (" + got + ") is wrong." + (sa === sb && sa !== r.sum[0] ? " You can spot it because two " + (sa === "0" ? "positive" : "negative") + " numbers were added and the result's sign bit is " + r.sum[0] + " (" + (r.sum[0] === "1" ? "negative" : "positive") + ")." : "") + "</p>";
      } else {
        html += '<p class="ok-text">✓ No overflow: ' + A + " " + (op === "+" ? "+" : "−") + " " + B + " = " + truth + ", which fits in the range " + lo() + " to " + hi() + ". (Overflow can only happen when the two numbers being added have the same sign.)</p>";
      }
      asOut.innerHTML = html;
    }

    function all() {
      range.innerHTML = n + "-bit two's complement range: " + b(lo()) + " to " + b(hi()) + " &nbsp;(−2<sup>" + (n - 1) + "</sup> to 2<sup>" + (n - 1) + "</sup> − 1)";
      represent();
      decode();
      addsub();
    }
    repIn.addEventListener("input", represent);
    decIn.addEventListener("input", decode);
    [aIn, bIn].forEach((x) => x.addEventListener("input", addsub));
    opSel.addEventListener("change", addsub);
    sel.addEventListener("change", () => {
      const old = n;
      n = parseInt(sel.value, 10);
      const d = decIn.value.replace(/\s/g, "");
      if (/^[01]+$/.test(d) && d.length === old) {
        const val = parseInt(d, 2) - (d[0] === "1" ? 2 ** old : 0);
        if (val >= lo() && val <= hi()) decIn.value = toTC(val); // sign-extend or shorten, keeping the value
      }
      all();
    });
    all();
  },
});
