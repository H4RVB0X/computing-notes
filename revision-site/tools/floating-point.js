/* floating-point: AQA two's complement mantissa + exponent, normalisation, errors, range; fixed point (AQA 4.5.4.4–4.5.4.9). */
CS.registerTool({
  id: "floating-point",
  title: "Floating point and fixed point explorer",
  section: "5",
  topic: "5.5",
  icon: "🎈",
  desc: "Convert between denary and AQA floating point (two's complement mantissa and exponent), normalise patterns, find absolute and relative errors and the range — plus fixed point.",
  help: "AQA floating point = a **two's complement mantissa** with the binary point **after the first bit**, followed by a **two's complement exponent**. Value = mantissa × 2<sup>exponent</sup>.\n\n- **Decode**: work out the exponent, then move the binary point that many places (right if positive, left if negative — copy the sign bit in on the left), then add up the place values. The left-most bit always has a **negative** place value.\n- **Encode**: write the magnitude in binary, move the point so it starts 0.1, the number of places moved is the exponent; for a negative number take the two's complement of the mantissa (and if it then starts 11, shift left once more and subtract 1 from the exponent).\n- **Normalise**: a normalised mantissa starts **01** (positive) or **10** (negative). Shift the mantissa left and subtract 1 from the exponent for each place until it does. This gives maximum precision for the bits available.\n- **Error**: absolute error = |true value − stored value|; relative error = absolute error ÷ |true value|.\n- **Range**: more exponent bits → bigger range; more mantissa bits → more precision.\n\nYou can type a whole pattern (mantissa and exponent together) into the mantissa box — it is split automatically.",
  mount(el, params) {
    const h = CS.util.el;
    const esc = CS.util.esc;
    let m = 8, e = 4;
    const b = (s) => "<b>" + s + "</b>";
    const tcVal = (s) => parseInt(s, 2) - (s[0] === "1" ? 2 ** s.length : 0);
    const toTC = (v, w) => (((v % 2 ** w) + 2 ** w) % 2 ** w).toString(2).padStart(w, "0");
    const Emin = () => -(2 ** (e - 1));
    const Emax = () => 2 ** (e - 1) - 1;
    const mantVal = (s) => tcVal(s) / 2 ** (s.length - 1);
    const isNorm = (s) => s.slice(0, 2) === "01" || s.slice(0, 2) === "10";
    const fmt = (v) => (Math.abs(v) < 1e-4 && v !== 0 ? v.toExponential(6).replace(/\.?0+e/, "e") : String(+v.toPrecision(12)));
    const pv = (k) => (k >= 0 ? String(2 ** k) : -k <= 4 ? "1/" + 2 ** -k : "2<sup>" + k + "</sup>");
    const point = (ms) => ms[0] + "." + ms.slice(1);
    const errHtml = (msg) => '<p class="err" role="alert">' + esc(msg) + "</p>";
    const invert = (s) => s.replace(/[01]/g, (c) => (c === "1" ? "0" : "1"));

    function table(head, rows) {
      return '<div class="table-wrap"><table style="width:auto"><thead><tr>' + head.map((x) => "<th style='text-transform:none'>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td class='mono'>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
    /* place-value table for a two's complement fixed-point string with intBits bits before the point */
    function fixedTable(bits, intBits, signed) {
      const heads = [], row = [], terms = [];
      let total = 0;
      for (let i = 0; i < bits.length; i++) {
        const k = intBits - 1 - i;
        const neg = signed && i === 0;
        const w = (neg ? -1 : 1) * 2 ** k;
        heads.push((neg ? "−" : "") + pv(k) + (i === intBits - 1 && i < bits.length - 1 ? " ." : ""));
        row.push(bits[i] === "1" ? b("1") : '<span class="muted">0</span>');
        if (bits[i] === "1") { total += w; terms.push(neg ? "(−" + fmt(2 ** k) + ")" : fmt(w)); }
      }
      return { html: table(heads, [row]) + '<p class="mono">' + (terms.length ? terms.join(" + ") + " = " + b(fmt(total)) : "no 1s → 0") + "</p>", total };
    }

    /* ---------- encode denary → normalised floating point ---------- */
    function encode(x) {
      const r = { steps: [] };
      if (x === 0) { r.ms = "0".repeat(m); r.es = "0".repeat(e); r.value = 0; r.steps.push("Zero is stored as all 0s. It cannot be normalised (there is no 1 to bring next to the point)."); return r; }
      const mag = Math.abs(x);
      const ip = Math.floor(mag);
      let fr = mag - ip, fb = "";
      for (let i = 0; i < m + 8 && fr > 0; i++) { fr *= 2; fb += fr >= 1 ? "1" : "0"; if (fr >= 1) fr -= 1; }
      const fixedStr = ip.toString(2) + "." + (fb || "0") + (fr > 0 ? "…" : "");
      r.steps.push("Write the magnitude " + fmt(mag) + " in fixed-point binary: <span class=mono>" + fixedStr + "</span>" + (fr > 0 ? " (does not terminate within the bits available)" : ""));
      let E = 0;
      while (mag / 2 ** E >= 1) E++;
      while (mag / 2 ** E < 0.5) E--;
      const f = mag / 2 ** E;
      r.steps.push("Move the binary point " + Math.abs(E) + " place" + (Math.abs(E) === 1 ? "" : "s") + " " + (E >= 0 ? "left" : "right") + " so the number starts <span class=mono>0.1</span>: " + fmt(mag) + " = " + fmt(f) + " × 2<sup>" + E + "</sup>, so the exponent is " + b(E) + ".");
      let k = Math.round(f * 2 ** (m - 1));
      if (Math.abs(f * 2 ** (m - 1) - k) > 1e-9) r.steps.push("The mantissa only has " + (m - 1) + " bits after the point, so " + fmt(f) + " is rounded to the nearest " + pv(-(m - 1)).replace(/<[^>]+>/g, "") + ": the value " + b("cannot be stored exactly") + ".");
      if (k === 2 ** (m - 1)) { k = 2 ** (m - 2); E += 1; r.steps.push("Rounding carried into the sign bit, so re-normalise: mantissa 0.1000…, exponent becomes " + E + "."); }
      let ms = k.toString(2).padStart(m, "0");
      r.steps.push("Positive mantissa (" + m + " bits, point after the first bit): <span class=mono>" + point(ms) + "</span>");
      if (x < 0) {
        const inv = invert(ms);
        const neg = toTC(-k, m);
        r.steps.push("The number is negative, so take the two's complement of the mantissa: invert <span class=mono>" + point(inv) + "</span>, add 1 → <span class=mono>" + b(point(neg)) + "</span>");
        ms = neg;
        if (ms.slice(0, 2) === "11") {
          ms = ms.slice(1) + "0";
          E -= 1;
          r.steps.push("It now starts 11, which is not normalised: shift the mantissa left one place (<span class=mono>" + point(ms) + "</span>) and subtract 1 from the exponent → " + E + ".");
        }
      }
      if (E > Emax()) { r.err = "Overflow: the exponent needed (" + E + ") is bigger than the largest " + e + "-bit exponent (" + Emax() + "). The number is too large for this format."; return r; }
      if (E < Emin()) { r.err = "Underflow: the exponent needed (" + E + ") is smaller than the smallest " + e + "-bit exponent (" + Emin() + "). The number is too close to zero to normalise in this format."; return r; }
      r.ms = ms;
      r.es = toTC(E, e);
      r.steps.push("Write the exponent " + E + " in " + e + "-bit two's complement: <span class=mono>" + r.es + "</span>");
      r.value = mantVal(ms) * 2 ** E;
      return r;
    }

    /* ---------- UI: widths + tabs ---------- */
    const mSel = h("select", { "aria-label": "Mantissa bits" });
    for (let i = 4; i <= 16; i++) mSel.appendChild(h("option", { value: i, text: i }));
    const eSel = h("select", { "aria-label": "Exponent bits" });
    for (let i = 3; i <= 8; i++) eSel.appendChild(h("option", { value: i, text: i }));
    const preset = h("select", { "aria-label": "Preset formats" }, [["8/4", "8 + 4"], ["10/6", "10 + 6"], ["7/5", "7 + 5"], ["12/4", "12 + 4"], ["", "custom"]].map(([v, t]) => h("option", { value: v, text: t })));
    const rangeLine = h("div", { class: "stat-line" });
    el.append(h("div", { class: "controls" }, [h("label", {}, ["Format", preset]), h("label", {}, ["Mantissa bits", mSel]), h("label", {}, ["Exponent bits", eSel])]), rangeLine);
    const tabs = h("div", { class: "tabs" }), bar = h("div", { class: "tab-bar", role: "tablist" });
    tabs.appendChild(bar);
    const P = {};
    [["dec", "Pattern → denary"], ["enc", "Denary → pattern"], ["norm", "Normalise"], ["err", "Errors"], ["range", "Range"], ["fixed", "Fixed point"]].forEach(([k, t], i) => {
      const btn = h("button", { class: "tab-btn" + (i ? "" : " active"), type: "button", role: "tab", text: t });
      const panel = h("div", { class: "tab-panel" + (i ? "" : " active"), role: "tabpanel" });
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".tab-btn").forEach((x) => x.classList.remove("active"));
        tabs.querySelectorAll(".tab-panel").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        panel.classList.add("active");
      });
      bar.appendChild(btn);
      tabs.appendChild(panel);
      P[k] = panel;
    });
    el.appendChild(tabs);
    const mono = "font-family:var(--font-mono);width:190px";
    const dM = h("input", { type: "text", value: "01011000", "aria-label": "Mantissa bits (or whole pattern)", style: mono });
    const dE = h("input", { type: "text", value: "0011", "aria-label": "Exponent bits", style: mono.replace("190", "110") });
    const dOut = h("div", { class: "steps-out" });
    P.dec.append(h("div", { class: "controls" }, [h("label", {}, ["Mantissa", dM]), h("label", {}, ["Exponent", dE])]), dOut);
    const xIn = h("input", { type: "text", value: "-7.5", "aria-label": "Denary number to encode", style: "width:130px" });
    const xOut = h("div", { class: "steps-out" });
    P.enc.append(h("div", { class: "controls" }, [h("label", {}, ["Denary", xIn])]), xOut);
    const nM = h("input", { type: "text", value: "00010110", "aria-label": "Un-normalised mantissa", style: mono });
    const nE = h("input", { type: "text", value: "0101", "aria-label": "Exponent", style: mono.replace("190", "110") });
    const nOut = h("div", { class: "steps-out" });
    P.norm.append(h("div", { class: "controls" }, [h("label", {}, ["Mantissa", nM]), h("label", {}, ["Exponent", nE])]), nOut);
    const eIn = h("input", { type: "text", value: "0.1", "aria-label": "Denary value for error calculation", style: "width:130px" });
    const eOut = h("div", { class: "steps-out" });
    P.err.append(h("div", { class: "controls" }, [h("label", {}, ["True value", eIn])]), eOut);
    const rOut = h("div", { class: "steps-out" });
    P.range.append(rOut);
    // fixed point
    const fI = h("select", { "aria-label": "Integer bits" }), fF = h("select", { "aria-label": "Fraction bits" });
    for (let i = 1; i <= 12; i++) fI.appendChild(h("option", { value: i, text: i }));
    for (let i = 0; i <= 12; i++) fF.appendChild(h("option", { value: i, text: i }));
    fI.value = "4"; fF.value = "4";
    const fSigned = h("input", { type: "checkbox" });
    const fPat = h("input", { type: "text", value: "01101100", "aria-label": "Fixed-point pattern", style: mono });
    const fDen = h("input", { type: "text", value: "6.8", "aria-label": "Denary value for fixed point", style: "width:110px" });
    const fOut = h("div", { class: "steps-out" });
    P.fixed.append(h("div", { class: "controls" }, [h("label", {}, ["Integer bits", fI]), h("label", {}, ["Fraction bits", fF]), h("label", {}, [fSigned, "two's complement (signed)"])]), h("div", { class: "controls" }, [h("label", {}, ["Pattern", fPat]), h("label", {}, ["Denary", fDen])]), fOut);

    function readPair(mi, ei) {
      let ms = mi.value.replace(/[\s.]/g, ""), es = ei.value.replace(/[\s.]/g, "");
      if (ms.length === m + e && !es) { es = ms.slice(m); ms = ms.slice(0, m); }
      else if (ms.length === m + e && es === ms.slice(m)) ms = ms.slice(0, m);
      if (!/^[01]+$/.test(ms) || !/^[01]+$/.test(es)) return { err: "Mantissa and exponent must be 0s and 1s." };
      if (ms.length !== m) return { err: "The mantissa must be exactly " + m + " bits (it has " + ms.length + ")." };
      if (es.length !== e) return { err: "The exponent must be exactly " + e + " bits (it has " + es.length + ")." };
      return { ms, es };
    }
    function readNum(s) {
      s = String(s).trim().replace(/−/g, "-");
      return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : null;
    }
    function expWorking(es) {
      const t = fixedTable(es, es.length, true);
      return "<p>" + b("1. Exponent") + " (two's complement integer, MSB worth −" + 2 ** (e - 1) + "):</p>" + t.html;
    }

    function doDecode() {
      const p = readPair(dM, dE);
      if (p.err) return (dOut.innerHTML = errHtml(p.err));
      const E = tcVal(p.es), M = mantVal(p.ms);
      let html = expWorking(p.es);
      html += "<p>" + b("2. Mantissa") + " <span class=mono>" + point(p.ms) + "</span> — " + (p.ms[0] === "1" ? "starts with 1, so it is " + b("negative") : "starts with 0, so it is positive") + " (place values −1 . ½ ¼ ⅛ …):</p>" + fixedTable(p.ms, 1, true).html;
      let bits, intBits;
      if (E >= 0) { bits = p.ms.padEnd(Math.max(m, E + 1), "0"); intBits = E + 1; }
      else { bits = p.ms[0].repeat(-E) + p.ms; intBits = 1; }
      const shifted = bits.slice(0, intBits) + "." + (bits.slice(intBits) || "0");
      html += "<p>" + b("3. Move the binary point") + " " + Math.abs(E) + " place" + (Math.abs(E) === 1 ? "" : "s") + " " + (E > 0 ? "to the " + b("right") + " (exponent is positive)" : E < 0 ? "to the " + b("left") + " (exponent is negative) — copy the sign bit (" + p.ms[0] + ") in on the left" : "(exponent is 0, so it stays put)") + ": <span class=mono>" + point(p.ms) + "</span> → <span class=mono>" + b(shifted) + "</span></p>";
      if (bits.length <= 40) html += "<p>" + b("4. Add the place values") + " — the left-most bit keeps its negative weight:</p>" + fixedTable(bits, intBits, true).html;
      const val = M * 2 ** E;
      html += "<p>Check: " + fmt(M) + " × 2<sup>" + E + "</sup> = " + b(fmt(val)) + "</p>";
      html += isNorm(p.ms) ? '<p class="ok-text">✓ Normalised: the mantissa starts ' + p.ms.slice(0, 2) + ".</p>" : '<p class="err" style="font-weight:400">Not normalised: the mantissa starts ' + p.ms.slice(0, 2) + " (normalised starts 01 or 10). Try the Normalise tab.</p>";
      dOut.innerHTML = html;
    }
    function doEncode() {
      const x = readNum(xIn.value);
      if (x === null) return (xOut.innerHTML = errHtml("Enter a decimal number such as -7.5 or 0.1."));
      const r = encode(x);
      let html = "<ol>" + r.steps.map((s) => "<li>" + s + "</li>").join("") + "</ol>";
      if (r.err) html += errHtml(r.err);
      else html += "<p>Answer: mantissa <span class=mono>" + b(r.ms) + "</span> exponent <span class=mono>" + b(r.es) + "</span> → stored value " + b(fmt(r.value)) + (r.value !== x ? ' <span class="pill warn">not exact: true value ' + fmt(x) + "</span>" : ' <span class="pill ok">exact</span>') + "</p>";
      xOut.innerHTML = html;
    }
    function doNormalise() {
      const p = readPair(nM, nE);
      if (p.err) return (nOut.innerHTML = errHtml(p.err));
      let ms = p.ms, E = tcVal(p.es);
      const rows = [["start", point(ms), E, toTC(E, e), fmt(mantVal(ms) * 2 ** E)]];
      if (/^0+$/.test(ms)) return (nOut.innerHTML = "<p>The mantissa is all zeros: the value is 0, which cannot be normalised.</p>");
      let html = "<p>Normalised means the mantissa starts " + b("01") + " (positive) or " + b("10") + " (negative). While the first two bits are the same, shift the mantissa " + b("left") + " one place (a 0 enters on the right) and " + b("subtract 1") + " from the exponent so the value does not change.</p>";
      let n = 0, stuck = false;
      while (ms[0] === ms[1]) {
        if (E - 1 < Emin()) { stuck = true; break; }
        ms = ms.slice(1) + "0";
        E -= 1;
        n++;
        rows.push(["shift " + n, point(ms), E, toTC(E, e), fmt(mantVal(ms) * 2 ** E)]);
      }
      html += table(["Step", "Mantissa", "Exponent", "Exponent bits", "Value"], rows);
      if (stuck) html += errHtml("The exponent cannot go below " + Emin() + " in " + e + " bits, so this pattern cannot be fully normalised.");
      else if (n === 0) html += '<p class="ok-text">Already normalised — nothing to do.</p>';
      else html += "<p>Shifted " + n + " place" + (n === 1 ? "" : "s") + ". Normalised: mantissa <span class=mono>" + b(ms) + "</span> exponent <span class=mono>" + b(toTC(E, e)) + "</span>. The value is unchanged, but " + n + " more bit" + (n === 1 ? " is" : "s are") + " now free for precision.</p>";
      nOut.innerHTML = html;
    }
    function doError() {
      const x = readNum(eIn.value);
      if (x === null) return (eOut.innerHTML = errHtml("Enter a decimal number such as 0.1 or 3.3."));
      const r = encode(x);
      if (r.err) return (eOut.innerHTML = errHtml(r.err));
      const abs = Math.abs(x - r.value);
      let html = "<p>Nearest normalised value in " + m + "-bit mantissa / " + e + "-bit exponent: <span class=mono>" + r.ms + " " + r.es + "</span> = " + b(fmt(r.value)) + "</p>";
      html += "<p>" + b("Absolute error") + " = |true value − stored value| = |" + fmt(x) + " − " + fmt(r.value) + "| = " + b(fmt(abs)) + "</p>";
      if (x !== 0) html += "<p>" + b("Relative error") + " = absolute error ÷ |true value| = " + fmt(abs) + " ÷ " + fmt(Math.abs(x)) + " = " + b(fmt(abs / Math.abs(x))) + " (" + (+(100 * abs / Math.abs(x)).toPrecision(4)) + "%)</p>";
      html += "<p class=small>" + (abs === 0 ? "This value is stored exactly." : "Relative error is the fairer comparison: an absolute error of " + fmt(abs) + " matters far more when the true value is tiny than when it is huge.") + " More mantissa bits → smaller rounding errors (better precision).</p>";
      eOut.innerHTML = html;
    }
    function doRange() {
      const big = [["Largest positive", "0" + "1".repeat(m - 1), Emax()], ["Smallest positive (normalised)", "01" + "0".repeat(m - 2), Emin()], ["Most negative", "1" + "0".repeat(m - 1), Emax()], ["Least negative / closest to zero (normalised)", "10" + "1".repeat(m - 2), Emin()]];
      const rows = big.map(([name, ms, E]) => [name, point(ms) + " " + toTC(E, e), fmt(mantVal(ms)) + " × 2<sup>" + E + "</sup>", b(fmt(mantVal(ms) * 2 ** E))]);
      rOut.innerHTML = table(["", "Pattern", "Working", "Value"], rows) + "<ul><li>Largest exponent = 0" + "1".repeat(e - 1) + " = " + Emax() + "; smallest = 1" + "0".repeat(e - 1) + " = " + Emin() + ".</li><li>Largest mantissa 0." + "1".repeat(m - 1) + " = 1 − 2<sup>−" + (m - 1) + "</sup>; most negative mantissa 1.000… = −1.</li><li>Adding exponent bits increases the " + b("range") + "; adding mantissa bits increases the " + b("precision") + ". For a fixed total, it is a trade-off.</li></ul>";
    }
    function doFixed() {
      const I = parseInt(fI.value, 10), F = parseInt(fF.value, 10), W = I + F, sg = fSigned.checked;
      const lo = sg ? -(2 ** (W - 1)) / 2 ** F : 0, hi = (sg ? 2 ** (W - 1) - 1 : 2 ** W - 1) / 2 ** F;
      let html = "<p>" + I + " integer bits + " + F + " fraction bits (binary point fixed between them). Range " + b(fmt(lo)) + " to " + b(fmt(hi)) + ", precision (smallest step) 2<sup>−" + F + "</sup> = " + b(fmt(2 ** -F)) + ".</p>";
      const s = fPat.value.replace(/[\s.]/g, "");
      if (!/^[01]+$/.test(s) || s.length !== W) html += errHtml("Pattern → denary: type exactly " + W + " bits.");
      else html += "<p>" + b("Pattern → denary:") + " <span class=mono>" + s.slice(0, I) + "." + s.slice(I) + "</span></p>" + fixedTable(s, I, sg).html;
      const x = readNum(fDen.value);
      if (x === null) html += errHtml("Denary → pattern: enter a decimal number.");
      else {
        const k = Math.round(x * 2 ** F), stored = k / 2 ** F;
        if (stored < lo || stored > hi) html += errHtml("Denary → pattern: " + x + " is outside the range " + fmt(lo) + " to " + fmt(hi) + ".");
        else {
          const pat = toTC(k, W);
          html += "<p>" + b("Denary → pattern:") + " multiply by 2<sup>" + F + "</sup> = " + 2 ** F + " to make a whole number: " + fmt(x) + " × " + 2 ** F + " = " + fmt(x * 2 ** F) + (k !== x * 2 ** F ? " → round to " + k : "") + ". Write " + k + " in " + W + "-bit " + (sg ? "two's complement" : "binary") + (k < 0 ? " (invert-and-add-1 of " + (-k).toString(2).padStart(W, "0") + ")" : "") + " and put the point " + F + " places from the right: <span class=mono>" + b(pat.slice(0, I) + "." + pat.slice(I)) + "</span>";
          html += stored === x ? ' <span class="pill ok">exact</span></p>' : ' <span class="pill warn">stored ' + fmt(stored) + ", absolute error " + fmt(Math.abs(x - stored)) + "</span></p>";
          if (x >= 0 && F > 0) {
            let fr = x - Math.floor(x);
            const rows = [];
            for (let i = 0; i < F; i++) { const t = fr * 2; rows.push([fmt(fr) + " × 2", fmt(t), t >= 1 ? "1" : "0"]); fr = t >= 1 ? t - 1 : t; }
            html += "<p>Alternative for the fraction part: repeatedly multiply by 2 and take the whole-number part (reads top to bottom; this truncates rather than rounds):</p>" + table(["Fraction", "Result", "Bit"], rows);
          }
        }
      }
      fOut.innerHTML = html;
    }
    function all() {
      rangeLine.innerHTML = "Mantissa " + m + " bits (two's complement, point after the first bit) · exponent " + e + " bits (two's complement, " + Emin() + " to " + Emax() + ")";
      doDecode(); doEncode(); doNormalise(); doError(); doRange(); doFixed();
    }
    function setWidths(mm, ee) {
      m = mm; e = ee;
      mSel.value = String(m); eSel.value = String(e);
      preset.value = [["8/4"], ["10/6"], ["7/5"], ["12/4"]].map((x) => x[0]).includes(m + "/" + e) ? m + "/" + e : "";
      // keep example patterns valid: re-encode sample values in the new format
      const ex = encode(5.5);
      if (!ex.err) { dM.value = ex.ms; dE.value = ex.es; }
      nM.value = "000" + "1".repeat(Math.max(1, m - 5)) + "0".repeat(Math.max(0, m - 3 - Math.max(1, m - 5)));
      nM.value = nM.value.slice(0, m).padEnd(m, "0");
      nE.value = toTC(Math.min(Emax(), 3), e);
      all();
    }
    mSel.addEventListener("change", () => setWidths(parseInt(mSel.value, 10), e));
    eSel.addEventListener("change", () => setWidths(m, parseInt(eSel.value, 10)));
    preset.addEventListener("change", () => { if (preset.value) { const [a, c] = preset.value.split("/").map(Number); setWidths(a, c); } });
    [dM, dE].forEach((x) => x.addEventListener("input", doDecode));
    xIn.addEventListener("input", doEncode);
    [nM, nE].forEach((x) => x.addEventListener("input", doNormalise));
    eIn.addEventListener("input", doError);
    [fI, fF, fSigned, fPat, fDen].forEach((x) => x.addEventListener(x.tagName === "INPUT" && x.type === "text" ? "input" : "change", doFixed));
    mSel.value = "8"; eSel.value = "4"; preset.value = "8/4";
    all();
  },
});
