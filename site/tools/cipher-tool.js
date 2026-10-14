/* cipher-tool: Caesar + frequency analysis, Vernam (XOR and mod 26), tiny RSA walkthrough (AQA 4.5.6.10, 4.9.3.2). */
CS.registerTool({
  id: "cipher-tool",
  title: "Cipher workbench",
  section: "5",
  topic: "5.8",
  icon: "🔐",
  desc: "Encrypt and crack a Caesar cipher with frequency analysis, apply a Vernam one-time pad bit by bit, and walk through public-key (RSA) encryption with small primes.",
  help: "- **Caesar**: each letter is shifted k places: C = (P + k) MOD 26. Only 25 useful keys, so it falls to **brute force** — and **frequency analysis** finds the key quickly because E, T, A … are the commonest English letters. Compare the two bar charts.\n- **Vernam (one-time pad)**: each bit of the plaintext is XOR-ed with the matching bit of the key; XOR-ing the ciphertext with the same key gives the plaintext back. With a key that is **truly random, at least as long as the message and never reused**, it is **perfectly secure** — every plaintext of that length is equally possible, so there is nothing for frequency analysis to find.\n- **Public key (RSA)**: pick two primes, publish (e, n), keep d secret. Anyone can encrypt with the public key; only the holder of the private key can decrypt. Real keys use primes hundreds of digits long.",
  mount(el, params) {
    const h = CS.util.el, esc = CS.util.esc;
    const b = (s) => "<b>" + s + "</b>";
    const errHtml = (m) => '<p class="err" role="alert">' + esc(m) + "</p>";
    const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const ENG = [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.15, 0.77, 4.0, 2.4, 6.7, 7.5, 1.9, 0.095, 6.0, 6.3, 9.1, 2.8, 0.98, 2.4, 0.15, 2.0, 0.074];
    function table(head, rows) {
      return '<div class="table-wrap"><table style="width:auto"><thead><tr>' + head.map((x) => "<th style='text-transform:none'>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td class='mono'>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
    const tabs = h("div", { class: "tabs" }), bar = h("div", { class: "tab-bar", role: "tablist" });
    tabs.appendChild(bar);
    const P = {};
    [["caesar", "Caesar"], ["vernam", "Vernam / one-time pad"], ["rsa", "Public key (RSA)"]].forEach(([k, t], i) => {
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
    const shiftCh = (c, k) => {
      const up = c.toUpperCase(), i = A.indexOf(up);
      if (i < 0) return c;
      const o = A[(((i + k) % 26) + 26) % 26];
      return c === up ? o : o.toLowerCase();
    };
    const caesar = (s, k) => Array.from(s).map((c) => shiftCh(c, k)).join("");
    const counts = (s) => { const f = new Array(26).fill(0); for (const c of s.toUpperCase()) { const i = A.indexOf(c); if (i >= 0) f[i]++; } return f; };
    const chi = (s) => { const f = counts(s), n = f.reduce((x, y) => x + y, 0) || 1; return f.reduce((t, o, i) => { const e = (ENG[i] / 100) * n; return t + (o - e) ** 2 / e; }, 0); };

    /* ---------- Caesar ---------- */
    const cText = h("textarea", { "aria-label": "Caesar input text", style: "min-height:60px;font-family:var(--font-mono)" });
    cText.value = "Meet me at the train station at seven this evening and bring the secret documents";
    const cShift = h("input", { type: "number", min: "0", max: "25", value: "3", "aria-label": "Shift key", style: "width:70px" });
    const cMode = h("select", { "aria-label": "Encrypt or decrypt" }, [h("option", { value: "enc", text: "Encrypt" }), h("option", { value: "dec", text: "Decrypt" })]);
    const cOut = h("div", { class: "steps-out" }), chart = h("div"), brute = h("div");
    P.caesar.append(cText, h("div", { class: "controls", style: "margin-top:8px" }, [cMode, h("label", {}, ["Shift k", cShift])]), cOut, h("h4", { text: "Frequency analysis of the ciphertext", style: "margin:14px 0 4px" }), chart, h("h4", { text: "Brute force: all 25 shifts", style: "margin:14px 0 4px" }), brute);
    function drawChart(ct) {
      const f = counts(ct), n = f.reduce((x, y) => x + y, 0) || 1;
      const pc = f.map((x) => (100 * x) / n), max = Math.max(13, ...pc), W = 26 * 22 + 30, H = 170, y = (v) => 140 - (v / max) * 125;
      let s = '<svg viewBox="0 0 ' + W + " " + H + '" style="width:100%;max-width:640px;display:block;color:var(--text)" role="img" aria-label="Letter frequency of ciphertext compared with English" font-family="inherit">';
      s += '<line x1="24" y1="140" x2="' + (W - 4) + '" y2="140" stroke="currentColor" stroke-opacity="0.5"/>';
      for (let i = 0; i < 26; i++) {
        const x = 28 + i * 22;
        s += '<rect x="' + x + '" y="' + y(pc[i]) + '" width="9" height="' + (140 - y(pc[i])) + '" fill="var(--accent)"><title>' + A[i] + " ciphertext " + pc[i].toFixed(1) + "%</title></rect>";
        s += '<rect x="' + (x + 9) + '" y="' + y(ENG[i]) + '" width="9" height="' + (140 - y(ENG[i])) + '" fill="var(--warn)" fill-opacity="0.75"><title>' + A[i] + " English " + ENG[i] + "%</title></rect>";
        s += '<text x="' + (x + 9) + '" y="156" font-size="11" text-anchor="middle" fill="currentColor">' + A[i] + "</text>";
      }
      s += '<text x="2" y="' + (y(10) + 4) + '" font-size="9" fill="currentColor">10%</text><line x1="24" y1="' + y(10) + '" x2="' + (W - 4) + '" y2="' + y(10) + '" stroke="currentColor" stroke-opacity="0.15"/></svg>';
      const top = pc.indexOf(Math.max(...pc));
      chart.innerHTML = s + '<div class="legend"><span><i style="background:var(--accent)"></i>ciphertext</span><span><i style="background:var(--warn)"></i>typical English</span></div><p class=small>The commonest ciphertext letter is ' + b(A[top]) + ". If it stands for E, the shift is (" + A[top] + " − E) MOD 26 = " + b(((top - 4 + 26) % 26)) + ".</p>";
    }
    function doCaesar() {
      const k = parseInt(cShift.value, 10);
      if (isNaN(k) || k < 0 || k > 25) return (cOut.innerHTML = errHtml("Shift must be 0–25."));
      const enc = cMode.value === "enc", s = cText.value, out = caesar(s, enc ? k : -k);
      const sample = Array.from(s).filter((c) => A.includes(c.toUpperCase())).slice(0, 8);
      const rows = sample.map((c) => { const i = A.indexOf(c.toUpperCase()), j = (((i + (enc ? k : -k)) % 26) + 26) % 26; return [c.toUpperCase(), i, enc ? "(" + i + " + " + k + ") MOD 26 = " + j : "(" + i + " − " + k + ") MOD 26 = " + j, b(A[j])]; });
      cOut.innerHTML = "<p>" + (enc ? "C = (P + k) MOD 26" : "P = (C − k) MOD 26") + " with A = 0 … Z = 25. Non-letters are left unchanged.</p>" + table([enc ? "Plain" : "Cipher", "Index", "Working", enc ? "Cipher" : "Plain"], rows) + "<p>" + (enc ? "Ciphertext" : "Plaintext") + ": <span class=mono>" + b(esc(out)) + "</span></p>";
      const ct = enc ? out : s;
      drawChart(ct);
      const cands = [];
      for (let t = 1; t <= 25; t++) { const p = caesar(ct, -t); cands.push({ t, p, score: chi(p) }); }
      const best = cands.reduce((x, y) => (y.score < x.score ? y : x));
      brute.innerHTML = '<div class="output" style="max-height:220px;overflow:auto;font-size:0.8rem">' + cands.map((c) => (c === best ? "<b style='color:var(--ok)'>" : "") + "k=" + String(c.t).padStart(2, " ") + ": " + esc(c.p.slice(0, 60)) + (c === best ? "  ← most English-like</b>" : "")).join("\n") + "</div><p class=small>Only 25 keys to try, so a computer (or a patient person) can read every one. The tool picks the shift whose letter frequencies are closest to English (lowest χ² score): " + b("k = " + best.t) + ".</p>";
    }
    [cText, cShift].forEach((x) => x.addEventListener("input", doCaesar));
    cMode.addEventListener("change", doCaesar);

    /* ---------- Vernam ---------- */
    const vMode = h("select", { "aria-label": "Vernam variant" }, [h("option", { value: "xor", text: "ASCII bits, XOR" }), h("option", { value: "mod", text: "Letters, (P + K) MOD 26" })]);
    const vP = h("input", { type: "text", value: "HELLO", "aria-label": "Plaintext", style: "width:200px;font-family:var(--font-mono)" });
    const vK = h("input", { type: "text", value: "XMCKL", "aria-label": "Key", style: "width:200px;font-family:var(--font-mono)" });
    const vRand = h("button", { class: "btn sm", type: "button", text: "Random key" });
    const vOut = h("div", { class: "steps-out" });
    P.vernam.append(h("div", { class: "controls" }, [h("label", {}, ["Variant", vMode]), h("label", {}, ["Plaintext", vP]), h("label", {}, ["Key", vK]), vRand]), vOut);
    function doVernam() {
      const xor = vMode.value === "xor";
      let p = vP.value, k = vK.value;
      if (!xor) { p = p.toUpperCase().replace(/[^A-Z]/g, ""); k = k.toUpperCase().replace(/[^A-Z]/g, ""); }
      if (!p.length) return (vOut.innerHTML = errHtml(xor ? "Type a plaintext." : "Type a plaintext containing letters."));
      if (xor && /[^\x20-\x7e]/.test(p + k)) return (vOut.innerHTML = errHtml("Use printable ASCII characters only."));
      if (k.length < p.length) return (vOut.innerHTML = errHtml("The key (" + k.length + " characters) must be at least as long as the plaintext (" + p.length + "). A one-time pad key is never shorter than the message and never reused."));
      let html = "";
      if (xor) {
        const bin = (n) => n.toString(2).padStart(8, "0");
        const rows = [], cipher = [], back = [];
        for (let i = 0; i < p.length; i++) {
          const pc = p.charCodeAt(i), kc = k.charCodeAt(i), c = pc ^ kc;
          cipher.push(c);
          back.push(String.fromCharCode(c ^ kc));
          rows.push([esc(p[i]) + " (" + pc + ")", bin(pc), esc(k[i]) + " (" + kc + ")", bin(kc), b(bin(c)), c.toString(16).toUpperCase().padStart(2, "0")]);
        }
        html += "<p>" + b("Encrypt:") + " convert each character to its 8-bit ASCII code and XOR it with the matching key character, bit by bit (1 XOR 1 = 0, 1 XOR 0 = 1, 0 XOR 0 = 0).</p>" + table(["Plain", "Plain bits", "Key", "Key bits", "Plain ⊕ key", "Hex"], rows) + "<p>Ciphertext (hex): <span class=mono>" + b(cipher.map((c) => c.toString(16).toUpperCase().padStart(2, "0")).join(" ")) + "</span> — often not printable characters at all.</p>";
        html += "<p>" + b("Decrypt:") + " XOR the ciphertext with the same key: (P ⊕ K) ⊕ K = P. E.g. " + cipher[0].toString(2).padStart(8, "0") + " ⊕ " + k.charCodeAt(0).toString(2).padStart(8, "0") + " = " + p.charCodeAt(0).toString(2).padStart(8, "0") + " = '" + esc(p[0]) + "'. Recovered plaintext: <span class=mono>" + b(esc(back.join(""))) + "</span></p>";
      } else {
        const rows = [], c = [], back = [];
        for (let i = 0; i < p.length; i++) {
          const pi = A.indexOf(p[i]), ki = A.indexOf(k[i]), ci = (pi + ki) % 26;
          c.push(A[ci]); back.push(A[(ci - ki + 26) % 26]);
          rows.push([p[i] + " (" + pi + ")", k[i] + " (" + ki + ")", "(" + pi + " + " + ki + ") MOD 26 = " + ci, b(A[ci])]);
        }
        html += "<p>" + b("Encrypt:") + " A = 0 … Z = 25; C = (P + K) MOD 26 for each letter.</p>" + table(["Plain", "Key", "Working", "Cipher"], rows) + "<p>Ciphertext: <span class=mono>" + b(c.join("")) + "</span></p><p>" + b("Decrypt:") + " P = (C − K) MOD 26 → <span class=mono>" + b(back.join("")) + "</span></p>";
      }
      html += "<p class=small>" + b("Why it is unbreakable:") + " because the key is random and as long as the message, any ciphertext could decrypt to <i>any</i> plaintext of the same length with some key — so the ciphertext reveals nothing (no frequency patterns). It is only secure if the key is truly random, used once, and exchanged securely; reusing a key lets an attacker XOR two ciphertexts together and cancel the key out.</p>";
      vOut.innerHTML = html;
    }
    vRand.addEventListener("click", () => {
      const n = vMode.value === "xor" ? vP.value.length : vP.value.replace(/[^A-Za-z]/g, "").length;
      const buf = new Uint8Array(Math.max(1, n));
      try { crypto.getRandomValues(buf); } catch (e) { for (let i = 0; i < buf.length; i++) buf[i] = Math.floor(Math.random() * 256); }
      vK.value = Array.from(buf).map((x) => A[x % 26]).join("");
      doVernam();
    });
    [vP, vK].forEach((x) => x.addEventListener("input", doVernam));
    vMode.addEventListener("change", doVernam);

    /* ---------- RSA ---------- */
    const rp = h("input", { type: "number", value: "61", "aria-label": "Prime p", style: "width:80px" });
    const rq = h("input", { type: "number", value: "53", "aria-label": "Prime q", style: "width:80px" });
    const re = h("input", { type: "number", value: "17", "aria-label": "Public exponent e", style: "width:80px" });
    const rm = h("input", { type: "number", value: "65", "aria-label": "Message number m", style: "width:90px" });
    const rOut = h("div", { class: "steps-out" });
    P.rsa.append(h("div", { class: "controls" }, [h("label", {}, ["p", rp]), h("label", {}, ["q", rq]), h("label", {}, ["e", re]), h("label", {}, ["message m", rm])]), rOut);
    const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
    const gcd = (a, c) => (c ? gcd(c, a % c) : a);
    const modpow = (base, ex, mod) => { let r = 1n, x = BigInt(base) % BigInt(mod), k = BigInt(ex); const M = BigInt(mod); while (k > 0n) { if (k & 1n) r = (r * x) % M; x = (x * x) % M; k >>= 1n; } return Number(r); };
    function modinv(e, phi) {
      let [r0, r1, t0, t1] = [phi, e, 0, 1];
      while (r1) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [t0, t1] = [t1, t0 - q * t1]; }
      return ((t0 % phi) + phi) % phi;
    }
    function doRSA() {
      const p = +rp.value, q = +rq.value, e = +re.value, m = +rm.value;
      if (![p, q, e, m].every(Number.isInteger)) return (rOut.innerHTML = errHtml("All values must be whole numbers."));
      if (!isPrime(p) || !isPrime(q)) return (rOut.innerHTML = errHtml("p and q must both be prime (e.g. 61 and 53)."));
      if (p === q) return (rOut.innerHTML = errHtml("p and q must be different primes."));
      if (p > 997 || q > 997) return (rOut.innerHTML = errHtml("Keep p and q below 1000 for this demo."));
      const n = p * q, phi = (p - 1) * (q - 1);
      if (e <= 1 || e >= phi || gcd(e, phi) !== 1) {
        const sugg = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 65537].filter((x) => x < phi && gcd(x, phi) === 1).slice(0, 4);
        return (rOut.innerHTML = "<p>n = p × q = " + n + ", φ(n) = (p − 1)(q − 1) = " + phi + ".</p>" + errHtml("e must be between 1 and " + phi + " and share no factor with φ(n) = " + phi + " (gcd(e, φ) = 1). Try " + sugg.join(", ") + "."));
      }
      if (m < 0 || m >= n) return (rOut.innerHTML = errHtml("The message number m must be between 0 and n − 1 = " + (n - 1) + "."));
      const d = modinv(e, phi), c = modpow(m, e, n), back = modpow(c, d, n);
      rOut.innerHTML = "<ol>" +
        "<li>Choose two primes: p = " + p + ", q = " + q + " (kept " + b("secret") + ").</li>" +
        "<li>n = p × q = " + b(n) + ". φ(n) = (p − 1)(q − 1) = " + (p - 1) + " × " + (q - 1) + " = " + b(phi) + ".</li>" +
        "<li>Choose e = " + b(e) + ": it shares no factors with " + phi + " (gcd = 1).</li>" +
        "<li>Find d so that e × d MOD φ(n) = 1: d = " + b(d) + " (check: " + e + " × " + d + " = " + e * d + " = " + Math.floor((e * d) / phi) + " × " + phi + " + 1).</li>" +
        "<li>" + b("Public key") + " = (e, n) = (" + e + ", " + n + ") — published for anyone. " + b("Private key") + " = (d, n) = (" + d + ", " + n + ") — never shared.</li>" +
        "<li>" + b("Encrypt") + " with the recipient's public key: c = m<sup>e</sup> MOD n = " + m + "<sup>" + e + "</sup> MOD " + n + " = " + b(c) + ".</li>" +
        "<li>" + b("Decrypt") + " with the private key: m = c<sup>d</sup> MOD n = " + c + "<sup>" + d + "</sup> MOD " + n + " = " + b(back) + (back === m ? ' <span class="pill ok">original message recovered</span>' : "") + ".</li></ol>" +
        "<div class=explain><p>" + b("Why the public key can be shared:") + " encrypting is easy for anyone with (e, n), but decrypting needs d — and working out d needs φ(n), which needs p and q. Finding p and q means " + b("factorising n") + ". For n = " + n + " that is instant, but real keys use an n with over 600 decimal digits, which would take longer than the age of the universe to factorise with known methods. So the public key reveals nothing useful, and no secret key ever has to be sent across the network (unlike a symmetric key or a one-time pad).</p>" +
        "<p>Used the other way round — encrypt a hash with your " + b("private") + " key — anyone can check it with your public key: that is a " + b("digital signature") + ". In practice asymmetric encryption is slow, so it is used to exchange a symmetric session key (as in HTTPS).</p></div>";
    }
    [rp, rq, re, rm].forEach((x) => x.addEventListener("input", doRSA));
    doCaesar(); doVernam(); doRSA();
  },
});
