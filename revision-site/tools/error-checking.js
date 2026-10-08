/* error-checking: parity, majority voting, checksum, check digits (AQA 4.5.5.3). */
CS.registerTool({
  id: "error-checking",
  title: "Error checking calculators",
  section: "5",
  topic: "5.6",
  icon: "🛡️",
  desc: "Parity bits, majority voting, a simple checksum and check digits (ISBN-13 and modulus 11) — corrupt the data and see what each method catches.",
  help: "Each tab is one AQA error-checking method. Click bits to **corrupt** them in transit and watch what the receiver concludes.\n\n- **Parity**: the sender adds one bit so the total number of 1s is even (even parity) or odd (odd parity). It detects any *odd* number of flipped bits, but not two, and cannot say *which* bit is wrong.\n- **Majority voting**: every bit is sent three times; the receiver takes the majority. It can *correct* one error per triplet, at the cost of tripling the data.\n- **Checksum**: the sender adds the data values together (here MOD 256) and sends the result too; the receiver repeats the sum and compares.\n- **Check digit**: a digit calculated from the others (with weights) and appended. ISBN-13 uses weights 1, 3, 1, 3 …; modulus 11 uses weights 10, 9, 8 … 2 and writes a remainder of 10 as X. A check digit catches mistyped and swapped digits.",
  mount(el, params) {
    const h = CS.util.el, esc = CS.util.esc;
    const b = (s) => "<b>" + s + "</b>";
    const errHtml = (m) => '<p class="err" role="alert">' + esc(m) + "</p>";
    function table(head, rows) {
      return '<div class="table-wrap"><table style="width:auto"><thead><tr>' + head.map((x) => "<th style='text-transform:none'>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td class='mono'>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
    const tabs = h("div", { class: "tabs" }), bar = h("div", { class: "tab-bar", role: "tablist" });
    tabs.appendChild(bar);
    const P = {};
    [["par", "Parity"], ["maj", "Majority voting"], ["sum", "Checksum"], ["cd", "Check digit"]].forEach(([k, t], i) => {
      const btn = h("button", { class: "tab-btn" + (i ? "" : " active"), type: "button", role: "tab", text: t });
      const panel = h("div", { class: "tab-panel" + (i ? "" : " active"), role: "tabpanel" });
      btn.addEventListener("click", () => {
        bar.querySelectorAll(".tab-btn").forEach((x) => x.classList.remove("active"));
        tabs.querySelectorAll(".tab-panel").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active"); panel.classList.add("active");
      });
      bar.appendChild(btn); tabs.appendChild(panel); P[k] = panel;
    });
    el.appendChild(tabs);
    function bitButtons(str, flipped, onFlip, groupEvery) {
      const wrap = h("div", { class: "bits", style: "margin:6px 0" });
      str.split("").forEach((c, i) => {
        const bt = h("button", { type: "button", class: "bit" + (c === "1" ? " on" : ""), text: c, "aria-label": "Bit " + i + " = " + c + ". Click to flip", style: "width:30px;height:34px;" + (flipped[i] ? "outline:3px solid var(--bad);outline-offset:-3px;" : "") + (groupEvery && i % groupEvery === 0 && i ? "margin-left:10px;" : "") });
        bt.addEventListener("click", () => onFlip(i));
        wrap.appendChild(bt);
      });
      return wrap;
    }

    /* ---------- parity ---------- */
    const pData = h("input", { type: "text", value: "1011001", "aria-label": "7-bit data", style: "width:130px;font-family:var(--font-mono)" });
    const pType = h("select", { "aria-label": "Parity type" }, [h("option", { value: "even", text: "even parity" }), h("option", { value: "odd", text: "odd parity" })]);
    const pReset = h("button", { class: "btn sm ghost", type: "button", text: "Undo corruption" });
    const pOut = h("div", { class: "steps-out" });
    P.par.append(h("div", { class: "controls" }, [h("label", {}, ["7-bit data", pData]), pType, pReset]), pOut);
    let pFlip = new Array(8).fill(false);
    function parity() {
      const d = pData.value.replace(/\s/g, "");
      if (!/^[01]{7}$/.test(d)) return (pOut.innerHTML = errHtml("Type exactly 7 bits (e.g. a 7-bit ASCII code)."));
      const ones = (d.match(/1/g) || []).length, even = pType.value === "even";
      const pb = even ? ones % 2 : 1 - (ones % 2);
      const sent = pb + d;
      const recv = sent.split("").map((c, i) => (pFlip[i] ? (c === "1" ? "0" : "1") : c)).join("");
      const rOnes = (recv.match(/1/g) || []).length, ok = even ? rOnes % 2 === 0 : rOnes % 2 === 1;
      const nFlip = pFlip.filter(Boolean).length;
      pOut.innerHTML = "<p>" + b("Sender:") + " the data has " + ones + " one" + (ones === 1 ? "" : "s") + ". For " + pType.value + " parity the total number of 1s must be " + (even ? "even" : "odd") + ", so the parity bit is " + b(pb) + ". It is added as the MSB: sent byte <span class=mono>" + b(sent) + "</span>.</p><p>" + b("In transit") + " — click any bit of the received byte to corrupt it:</p>";
      pOut.appendChild(bitButtons(recv, pFlip, (i) => { pFlip[i] = !pFlip[i]; parity(); }));
      const res = h("div");
      res.innerHTML = "<p>" + b("Receiver:") + " counts the 1s in <span class=mono>" + recv + "</span> = " + rOnes + " (" + (rOnes % 2 ? "odd" : "even") + "). " + (ok ? '<span class="ok-text">Parity is correct → byte accepted.</span>' : '<span class="err">Parity is wrong → error detected; ask for the byte to be re-sent.</span>') + "</p>" +
        (nFlip && ok ? '<p class="err" style="font-weight:400">But ' + nFlip + " bits were flipped! An even number of errors leaves the parity unchanged, so parity cannot detect it.</p>" : "") +
        (nFlip && !ok ? "<p class=small>Parity tells us <i>that</i> an error happened, not <i>which</i> bit — so it cannot correct it.</p>" : "");
      pOut.appendChild(res);
    }
    pData.addEventListener("input", () => { pFlip.fill(false); parity(); });
    pType.addEventListener("change", parity);
    pReset.addEventListener("click", () => { pFlip.fill(false); parity(); });

    /* ---------- majority voting ---------- */
    const mData = h("input", { type: "text", value: "1011", "aria-label": "Data bits", style: "width:130px;font-family:var(--font-mono)" });
    const mOut = h("div", { class: "steps-out" });
    P.maj.append(h("div", { class: "controls" }, [h("label", {}, ["Data bits", mData])]), mOut);
    let mFlip = [];
    function majority() {
      const d = mData.value.replace(/\s/g, "");
      if (!/^[01]{1,12}$/.test(d)) return (mOut.innerHTML = errHtml("Type 1 to 12 data bits."));
      const sent = d.split("").map((c) => c + c + c).join("");
      if (mFlip.length !== sent.length) mFlip = new Array(sent.length).fill(false);
      const recv = sent.split("").map((c, i) => (mFlip[i] ? (c === "1" ? "0" : "1") : c)).join("");
      mOut.innerHTML = "<p>" + b("Sender:") + " each bit is transmitted three times: <span class=mono>" + sent.match(/.{3}/g).join(" ") + "</span> (" + sent.length + " bits to send " + d.length + " bits of data).</p><p>" + b("Received") + " — click bits to corrupt them:</p>";
      mOut.appendChild(bitButtons(recv, mFlip, (i) => { mFlip[i] = !mFlip[i]; majority(); }, 3));
      const rows = [];
      let decoded = "";
      recv.match(/.{3}/g).forEach((t, i) => {
        const ones = (t.match(/1/g) || []).length, v = ones >= 2 ? "1" : "0";
        decoded += v;
        const verdict = v !== d[i] ? '<span class="err">wrong — 2 or more bits flipped</span>' : t[0] === t[1] && t[1] === t[2] ? "all agree" : '<span class="ok-text">corrected</span>';
        rows.push([t, ones + " one" + (ones === 1 ? "" : "s") + ", " + (3 - ones) + " zero" + (3 - ones === 1 ? "" : "s"), b(v), verdict]);
      });
      const res = h("div");
      res.innerHTML = table(["Triplet", "Votes", "Majority", ""], rows) + "<p>Decoded data <span class=mono>" + b(decoded) + "</span> " + (decoded === d ? '<span class="ok-text">= original data</span>' : '<span class="err">≠ original ' + d + "</span>") + "</p>";
      mOut.appendChild(res);
    }
    mData.addEventListener("input", () => { mFlip = []; majority(); });

    /* ---------- checksum ---------- */
    const cSent = h("input", { type: "text", value: "72 101 108 108 111", "aria-label": "Data bytes sent (denary)", style: "width:260px" });
    const cRecv = h("input", { type: "text", value: "72 101 108 108 111", "aria-label": "Data bytes received (denary)", style: "width:260px" });
    const cCorrupt = h("button", { class: "btn sm", type: "button", text: "Corrupt one byte" });
    const cCopy = h("button", { class: "btn sm ghost", type: "button", text: "Received = sent" });
    const cOut = h("div", { class: "steps-out" });
    P.sum.append(h("div", { class: "controls" }, [h("label", {}, ["Bytes sent", cSent])]), h("div", { class: "controls" }, [h("label", {}, ["Bytes received", cRecv]), cCorrupt, cCopy]), cOut);
    const parseBytes = (s) => {
      const parts = s.trim().split(/[\s,]+/).filter(Boolean);
      if (!parts.length || parts.some((p) => !/^\d+$/.test(p) || +p > 255)) return null;
      return parts.map(Number);
    };
    function checksum() {
      const a = parseBytes(cSent.value), r = parseBytes(cRecv.value);
      if (!a) return (cOut.innerHTML = errHtml("Sent bytes: whole numbers 0–255 separated by spaces."));
      if (!r) return (cOut.innerHTML = errHtml("Received bytes: whole numbers 0–255 separated by spaces."));
      const s1 = a.reduce((x, y) => x + y, 0), c1 = s1 % 256, s2 = r.reduce((x, y) => x + y, 0), c2 = s2 % 256;
      const bin8 = (v) => v.toString(2).padStart(8, "0");
      cOut.innerHTML = "<p>" + b("Sender:") + " add the bytes: " + a.join(" + ") + " = " + s1 + ". The checksum must fit in one byte, so take " + s1 + " MOD 256 = " + b(c1) + " (<span class=mono>" + bin8(c1) + "</span>). The checksum is sent after the data.</p>" +
        "<p>" + b("Receiver:") + " adds the received bytes: " + r.join(" + ") + " = " + s2 + "; " + s2 + " MOD 256 = " + b(c2) + ".</p>" +
        (c1 === c2 ? (a.join() === r.join() ? '<p class="ok-text">Checksums match → data accepted.</p>' : '<p class="err">Checksums match, so the data is accepted — but it was changed! Errors that cancel out (or swap the order of bytes) are not detected by a simple sum.</p>') : '<p class="err">Checksums differ (' + c1 + " ≠ " + c2 + ") → error detected; request retransmission.</p>");
    }
    cSent.addEventListener("input", () => { cRecv.value = cSent.value; checksum(); });
    cRecv.addEventListener("input", checksum);
    cCopy.addEventListener("click", () => { cRecv.value = cSent.value; checksum(); });
    cCorrupt.addEventListener("click", () => {
      const r = parseBytes(cRecv.value);
      if (!r) return;
      const i = Math.floor(Math.random() * r.length);
      r[i] = (r[i] + 1 + Math.floor(Math.random() * 20)) % 256;
      cRecv.value = r.join(" ");
      checksum();
    });

    /* ---------- check digits ---------- */
    const isbn = h("input", { type: "text", value: "978030640615", "aria-label": "ISBN-13: 12 digits to calculate or 13 to validate", style: "width:190px;font-family:var(--font-mono)" });
    const m11 = h("input", { type: "text", value: "030640615", "aria-label": "Modulus 11: 9 digits to calculate or 10 to validate", style: "width:170px;font-family:var(--font-mono)" });
    const iOut = h("div", { class: "steps-out" }), mOut2 = h("div", { class: "steps-out", style: "margin-top:10px" });
    P.cd.append(h("div", { class: "controls" }, [h("label", {}, ["ISBN-13", isbn])]), iOut, h("div", { class: "controls", style: "margin-top:12px" }, [h("label", {}, ["Modulus 11", m11])]), mOut2);
    function isbn13() {
      const d = isbn.value.replace(/[\s-]/g, "");
      if (!/^\d{12,13}$/.test(d)) return (iOut.innerHTML = errHtml("Type 12 digits (to calculate the check digit) or 13 digits (to validate). Hyphens are ignored."));
      const digs = d.split("").map(Number), first = digs.slice(0, 12);
      const prods = first.map((x, i) => x * (i % 2 ? 3 : 1));
      const sum = prods.reduce((x, y) => x + y, 0), cd = (10 - (sum % 10)) % 10;
      let html = table(["Digit"].concat(first.map(String)), [["Weight"].concat(first.map((x, i) => (i % 2 ? "3" : "1"))), ["Product"].concat(prods.map(String))]);
      html += "<p>Sum of products = " + b(sum) + ". " + sum + " MOD 10 = " + (sum % 10) + ". Check digit = (10 − " + (sum % 10) + ") MOD 10 = " + b(cd) + ".</p>";
      if (d.length === 12) html += "<p>Full ISBN: <span class=mono>" + b(d + cd) + "</span></p>";
      else {
        const total = sum + digs[12];
        html += "<p>" + b("Validate:") + " add the 13th digit (weight 1): " + sum + " + " + digs[12] + " = " + total + ". " + (total % 10 === 0 ? '<span class="ok-text">' + total + " is a multiple of 10 → valid ISBN.</span>" : '<span class="err">' + total + " is not a multiple of 10 → invalid (check digit should be " + cd + ").</span>") + "</p>";
      }
      iOut.innerHTML = html;
    }
    function mod11() {
      const d = m11.value.replace(/[\s-]/g, "").toUpperCase();
      if (!/^\d{9}$/.test(d) && !/^\d{9}[\dX]$/.test(d)) return (mOut2.innerHTML = errHtml("Type 9 digits (to calculate) or 10 characters ending in a digit or X (to validate)."));
      const first = d.slice(0, 9).split("").map(Number);
      const prods = first.map((x, i) => x * (10 - i));
      const sum = prods.reduce((x, y) => x + y, 0), r = sum % 11, cdv = (11 - r) % 11, cd = cdv === 10 ? "X" : String(cdv);
      let html = table(["Digit"].concat(first.map(String)), [["Weight"].concat(first.map((x, i) => String(10 - i))), ["Product"].concat(prods.map(String))]);
      html += "<p>Sum = " + b(sum) + ". " + sum + " MOD 11 = " + r + ". Check digit = (11 − " + r + ") MOD 11 = " + cdv + (cdv === 10 ? " → written as " + b("X") : " → " + b(cd)) + ".</p>";
      if (d.length === 9) html += "<p>Full number: <span class=mono>" + b(d + cd) + "</span></p>";
      else {
        const last = d[9] === "X" ? 10 : Number(d[9]), total = sum + last;
        html += "<p>" + b("Validate:") + " the check digit has weight 1: " + sum + " + " + last + " = " + total + ". " + (total % 11 === 0 ? '<span class="ok-text">' + total + " MOD 11 = 0 → valid.</span>" : '<span class="err">' + total + " MOD 11 = " + (total % 11) + " ≠ 0 → invalid (check digit should be " + cd + ").</span>") + "</p>";
      }
      mOut2.innerHTML = html;
    }
    isbn.addEventListener("input", isbn13);
    m11.addEventListener("input", mod11);
    parity(); majority(); checksum(); isbn13(); mod11();
  },
});
