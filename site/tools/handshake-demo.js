/* Encryption, digital signatures, certificates and a TLS-style handshake, with real (toy-sized) RSA arithmetic. */
(function () {
  const BOB = { p: 61, q: 53, n: 3233, phi: 3120, e: 17, d: 2753 };   // server / receiver
  const ALICE = { p: 43, q: 59, n: 2537, phi: 2436, e: 5, d: 1949 };  // signer
  const CA = { p: 71, q: 89, n: 6319, phi: 6160, e: 13, d: 3317 };    // certificate authority
  const XKEY = 90;
  function modPow(b, e, m) { let r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e = Math.floor(e / 2); } return r; }
  function toyHash(s, m) { let x = 0; for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) % m; return x; }
  const esc = (s) => CS.util.esc(s);
  const BADCSS = ".tool .bad-text{color:var(--bad);font-weight:600}";
  const b8 = (n) => n.toString(2).padStart(8, "0");
  const table = (head, rows) => "<div class='table-wrap'><table><thead><tr>" + head.map((x) => "<th>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td><code>" + c + "</code></td>").join("") + "</tr>").join("") + "</tbody></table></div>";
  const keyLine = (k, who) => who + " public key (e, n) = (" + k.e + ", " + k.n + "); private key (d, n) = (" + k.d + ", " + k.n + ")";

  function symSteps(msg) {
    const codes = [...msg].map((c) => c.charCodeAt(0)), enc = codes.map((c) => c ^ XKEY);
    const cipherHex = enc.map((c) => c.toString(16).toUpperCase().padStart(2, "0")).join(" ");
    return [
      { t: "Symmetric: one shared secret key", a: "Message: <code>" + esc(msg) + "</code><br>Shared key K = " + XKEY + " (" + b8(XKEY) + ")", w: "", b: "Has the same key K = " + XKEY, x: "In **symmetric** encryption the **same key** is used to encrypt and decrypt. Here each character code is XORed with the key byte." },
      { t: "Alice encrypts with K", a: table(["char", "code", "binary", "⊕ K", "cipher"], codes.map((c, i) => [esc(msg[i]), c, b8(c), b8(XKEY), b8(enc[i])])), w: "", b: "", x: "Each bit of the character is XORed with the matching bit of the key. Symmetric algorithms (e.g. AES) are **fast**, so they are used for bulk data." },
      { t: "Ciphertext sent", a: "", w: "Eve sees: <code class='sym-cipher'>" + cipherHex + "</code>", b: "", x: "Without the key, Eve cannot read the message." },
      { t: "Bob decrypts with the same K", a: "", w: "", b: table(["cipher", "⊕ K", "code", "char"], enc.map((c, i) => [b8(c), b8(XKEY), codes[i], esc(msg[i])])), x: "XORing again with the same key restores the original: (m ⊕ K) ⊕ K = m." },
      { t: "The key distribution problem", a: "How did Bob get K?", w: "If K was ever sent over the network, Eve could have copied it.", b: "", x: "Both sides must already share the key, but sending it is risky: anyone who intercepts it can decrypt everything. **Asymmetric encryption solves this** (next mode, and the TLS handshake)." },
    ];
  }
  function asymSteps(msg) {
    const codes = [...msg].map((c) => c.charCodeAt(0)), enc = codes.map((m) => modPow(m, BOB.e, BOB.n));
    return [
      { t: "Bob makes a key pair", a: "", w: "Bob publishes his public key (" + BOB.e + ", " + BOB.n + ")", b: "p = 61, q = 53<br>n = p × q = 3233<br>φ = (p−1)(q−1) = 3120<br>e = 17 (public)<br>d = 2753 (private) because 17 × 2753 = 46801 = 15 × 3120 + 1", x: "In **asymmetric** encryption each person has a **public key** (shared with anyone) and a mathematically related **private key** (never shared). " + keyLine(BOB, "Bob's") + "." },
      { t: "Alice encrypts with Bob's PUBLIC key", a: table(["char", "m", "c = m^17 mod 3233"], codes.map((m, i) => [esc(msg[i]), m, enc[i]])), w: "", b: "", x: "Anyone can encrypt a message for Bob using his public key. Real RSA uses keys of 2048 bits or more; these numbers are tiny so you can see the arithmetic." },
      { t: "Ciphertext sent", a: "", w: "Eve sees: <code class='asym-cipher'>" + enc.join(" ") + "</code><br>and the public key (17, 3233)", b: "", x: "Knowing the public key does not let Eve decrypt. She would need d, which requires factorising n into p × q. Easy for 3233, computationally infeasible for a 2048-bit n." },
      { t: "Bob decrypts with his PRIVATE key", a: "", w: "", b: table(["c", "m = c^2753 mod 3233", "char"], enc.map((c, i) => [c, modPow(c, BOB.d, BOB.n), esc(String.fromCharCode(modPow(c, BOB.d, BOB.n)))])), x: "Only the matching private key reverses the encryption, so only Bob can read the message. No secret key ever had to be sent." },
      { t: "Why not use asymmetric for everything?", a: "", w: "", b: "", x: "Asymmetric encryption is **much slower** than symmetric. In practice it is used to **exchange a symmetric session key** securely, and the data itself is then encrypted symmetrically (see the TLS mode)." },
    ];
  }
  function tamperOf(msg) { let t = msg.replace(/\d/, (d) => String((+d + 8) % 10)); if (t === msg) t = msg + "!"; while (toyHash(t, ALICE.n) === toyHash(msg, ALICE.n)) t += "!"; return t; }
  function sigSteps(msg, tamper) {
    const H = toyHash(msg, ALICE.n), S = modPow(H, ALICE.d, ALICE.n), recv = tamper ? tamperOf(msg) : msg, HA = modPow(S, ALICE.e, ALICE.n), HB = toyHash(recv, ALICE.n), ok = HA === HB;
    return [
      { t: "Alice's key pair", a: keyLine(ALICE, "Alice's").replace("; ", "<br>") + "<br>(p = 43, q = 59, φ = 2436, 5 × 1949 = 9745 = 4 × 2436 + 1)", w: "Alice's public key is published", b: "", x: "A **digital signature** proves **who** sent a message (authentication) and that it **was not changed** (integrity)." },
      { t: "Alice hashes the message", a: "Message: <code>" + esc(msg) + "</code><br>Hash H = <b class='sig-hash'>" + H + "</b>", w: "", b: "", x: "A **hash function** turns the message into a short fixed-size **digest**. Here: h ← (h × 31 + character code) MOD 2537 for each character (a toy hash; real systems use SHA-256). Any change to the message changes the hash." },
      { t: "Alice encrypts the hash with her PRIVATE key", a: "S = H^1949 mod 2537 = " + H + "^1949 mod 2537 = <b class='sig-value'>" + S + "</b>", w: "", b: "", x: "The encrypted hash is the **digital signature**. Only Alice has her private key, so only she could have produced it." },
      { t: "Message + signature sent", a: "", w: "Message: <code>" + esc(recv) + "</code><br>Signature: " + S + (tamper ? "<br><b>Eve changed the message!</b> (original: <code>" + esc(msg) + "</code>)" : ""), b: "", x: tamper ? "Eve can change the message, but she cannot make a new valid signature without Alice's private key." : "The signature is appended to the message. (The whole thing can also be encrypted with Bob's public key for confidentiality.)" },
      { t: "Bob decrypts the signature with Alice's PUBLIC key", a: "", w: "", b: "S^5 mod 2537 = " + S + "^5 mod 2537 = <b>" + HA + "</b> (hash Alice signed)", x: "Bob uses **Alice's public key** to recover the hash that Alice signed." },
      { t: "Bob hashes what he received and compares", a: "", w: "", b: "Hash of received message = <b>" + HB + "</b><br>" + HA + (ok ? " = " : " ≠ ") + HB + "<br><b class='" + (ok ? "ok-text" : "bad-text") + " sig-verdict'>" + (ok ? "MATCH: genuinely from Alice and unaltered" : "NO MATCH: altered in transit or not from Alice") + "</b>", x: ok ? "The hashes match, so the message must have been signed with Alice's private key and has not been changed." : "The hashes differ, so Bob rejects the message. Either it was altered or the signature was not made with Alice's private key." },
    ];
  }
  function certSteps(kind) {
    const y = new Date().getFullYear(), domain = "www.mybank.co.uk";
    const subject = kind === "domain" ? "www.mybank-secure.co.uk" : domain, to = kind === "expired" ? (y - 1) + "-06-30" : (y + 1) + "-12-31", from = (y - 1) + "-01-01";
    const fields = (key) => "subject=" + subject + "; public key=(" + key + "); valid " + from + " to " + to + "; issuer=Toy Root CA; serial=4521";
    const signedText = fields(BOB.e + ", " + BOB.n);
    const H = toyHash(signedText, CA.n), sig = modPow(H, CA.d, CA.n);
    const received = kind === "forged" ? fields(ALICE.e + ", " + ALICE.n) : signedText;
    const HA = modPow(sig, CA.e, CA.n), HB = toyHash(received, CA.n), sigOk = HA === HB, domOk = subject === domain, dateOk = new Date(to + "T23:59:59") >= new Date();
    const all = sigOk && domOk && dateOk;
    return [
      { t: "The server applies for a certificate", a: "", w: "Certificate signing request: name " + subject + ", public key (17, 3233)", b: "The bank generated its key pair (" + BOB.e + ", " + BOB.n + ") / (" + BOB.d + ", " + BOB.n + ") and keeps the private key secret.", x: "A **certificate authority (CA)** checks the applicant really controls the domain (and for higher-assurance certificates, who the organisation is)." },
      { t: "The CA signs the certificate", a: "CA key pair: public (13, 6319), private (3317, 6319)", w: "", b: "Certificate fields:<br><code>" + esc(signedText) + "</code><br>hash = " + H + "<br>CA signature = " + H + "^3317 mod 6319 = <b>" + sig + "</b>", x: "The CA hashes the certificate's contents and **encrypts the hash with the CA's private key**. That is the CA's digital signature on the certificate." },
      { t: "The browser receives the certificate", a: "Browser wants " + domain, w: "Certificate received:<br><code>" + esc(received) + "</code><br>CA signature: " + sig + (kind === "forged" ? "<br><b>An attacker has swapped in their own public key.</b>" : ""), b: "", x: "The server sends its certificate when the browser connects." },
      { t: "Check the CA's signature", a: "Trusted CA public key (13, 6319) is built into the browser.<br>" + sig + "^13 mod 6319 = <b>" + HA + "</b><br>hash of fields received = <b>" + HB + "</b><br><b class='" + (sigOk ? "ok-text" : "bad-text") + "'>" + (sigOk ? "signature valid" : "signature INVALID") + "</b>", w: "", b: "", x: "The browser decrypts the signature with the **CA's public key** and compares it with its own hash of the certificate. A mismatch means the certificate was altered or not issued by that CA." },
      { t: "Check the name and dates", a: "Domain: " + subject + " " + (domOk ? "✓ matches" : "✗ does not match " + domain) + "<br>Valid to " + to + " " + (dateOk ? "✓ in date" : "✗ expired"), w: "", b: "", x: "The certificate must be for the exact domain requested, within its validity dates, and not revoked." },
      { t: "Verdict", a: "<b class='" + (all ? "ok-text" : "bad-text") + " cert-verdict'>" + (all ? "Certificate trusted: padlock shown, this really is the bank's public key" : "Certificate rejected: the browser shows a security warning") + "</b>", w: "", b: "", x: all ? "The browser can now trust that the public key (17, 3233) belongs to " + domain + "." : "Never click through a certificate warning: an attacker could be impersonating the site (a man-in-the-middle attack)." },
    ];
  }
  function tlsSteps(K) {
    const C = modPow(K, BOB.e, BOB.n), K2 = modPow(C, BOB.d, BOB.n), req = "GET /account", kb = K % 256;
    const encHex = [...req].map((c) => (c.charCodeAt(0) ^ kb).toString(16).toUpperCase().padStart(2, "0")).join(" ");
    return [
      { t: "1. Client hello", a: "Sends: supported TLS versions and cipher suites, client random 7391", w: "Eve sees the hello (not secret)", b: "", x: "The browser opens a TCP connection to port 443 and starts the handshake." },
      { t: "2. Server hello + certificate", a: "", w: "Eve sees the certificate (it is public)", b: "Chooses a cipher suite, sends server random 2048 and its **digital certificate** containing its public key (17, 3233)", x: "The certificate lets the client check it is talking to the real server." },
      { t: "3. Client verifies the certificate", a: "Checks the CA's signature with the CA's public key, the domain name and the dates ✓", w: "", b: "", x: "See the Certificate mode for the full check." },
      { t: "4. Client sends a session key, encrypted", a: "Picks a random symmetric session key K = <b>" + K + "</b><br>C = K^17 mod 3233 = <b class='tls-c'>" + C + "</b>", w: "Eve sees C = " + C, b: "", x: "The session key is encrypted with the **server's public key**, so only the server can recover it." },
      { t: "5. Server decrypts the session key", a: "", w: "", b: "K = C^2753 mod 3233 = " + C + "^2753 mod 3233 = <b class='tls-k'>" + K2 + "</b>", x: "Only the server's **private key** can decrypt C. Both sides now share K, and it was never sent in plain form." },
      { t: "6. Switch to symmetric encryption", a: "Encrypts <code>" + req + "</code> with the session key (here: XOR with K mod 256 = " + kb + ")", w: "Eve sees: <code>" + encHex + "</code>", b: "Decrypts with the same K", x: "The rest of the session uses fast **symmetric** encryption with K. Asymmetric encryption was only needed to share the key safely." },
      { t: "Summary", a: "", w: "Eve saw: the hellos, the certificate and C. Without the server's private key she cannot find K.", b: "", x: "Real TLS 1.3 uses ephemeral **Diffie–Hellman key exchange** instead of encrypting the key with RSA, so even a later leak of the server's private key does not expose past sessions; the idea of using asymmetric methods to agree a symmetric key is the same." },
    ];
  }

  CS.registerTool({
    id: "handshake-demo",
    title: "Encryption, signatures, certificates and TLS",
    section: "9",
    topic: "9.4",
    icon: "🔐",
    desc: "Step through symmetric v asymmetric encryption, digital signatures, certificate checks and a TLS-style handshake using real toy RSA numbers.",
    help: "Pick a mode and press **Next**. The three columns show the sender, what an eavesdropper (Eve) can see on the network, and the receiver. All RSA arithmetic is real but uses tiny keys: the server/Bob has p = 61, q = 53 → public key (17, 3233), private key (2753, 3233). Remember: **encrypt with the receiver's public key** for confidentiality; **sign with your own private key**, and others **verify with your public key**.",
    mount(el, params) {
      const h = CS.util.el;
      el.appendChild(h("style", { text: BADCSS }));
      const MODES = [["sym", "Symmetric encryption"], ["asym", "Asymmetric encryption"], ["sig", "Digital signature"], ["cert", "Certificate check"], ["tls", "TLS-style handshake"]];
      const controls = h("div", { class: "controls" });
      const modeSel = h("select", { "aria-label": "Mode" });
      MODES.forEach(([v, t]) => modeSel.appendChild(h("option", { value: v, text: t })));
      modeSel.value = MODES.some((m) => m[0] === params.mode) ? params.mode : "sym";
      const msgIn = h("input", { type: "text", value: "HI BOB 5", maxlength: "10", "aria-label": "Message", style: "width:120px" });
      const msgL = h("label", null, ["Message", msgIn]);
      const tamper = h("input", { type: "checkbox" });
      const tamperL = h("label", null, [tamper, "Eve alters message"]);
      const certSel = h("select", { "aria-label": "Certificate scenario" });
      [["valid", "valid certificate"], ["forged", "forged public key"], ["domain", "wrong domain"], ["expired", "expired"]].forEach(([v, t]) => certSel.appendChild(h("option", { value: v, text: t })));
      const newK = h("button", { class: "btn sm ghost", type: "button", text: "New session key" });
      controls.append(modeSel, msgL, tamperL, certSel, newK);
      const nav = h("div", { class: "controls" });
      const back = h("button", { class: "btn sm", type: "button", text: "◀ Back" });
      const next = h("button", { class: "btn sm primary", type: "button", text: "Next ▶" });
      const all = h("button", { class: "btn sm ghost", type: "button", text: "Show all steps" });
      nav.append(back, next, all);
      const err = h("div", { class: "err" });
      const stat = h("div", { class: "stat-line" });
      const view = h("div");
      el.append(controls, nav, err, stat, view);
      let steps = [], idx = 0, showAll = false, K = parseInt(params.key, 10) || 1234;

      function rebuild(keepIdx) {
        const m = modeSel.value, msg = msgIn.value;
        msgL.style.display = ["sym", "asym", "sig"].includes(m) ? "" : "none";
        tamperL.style.display = m === "sig" ? "" : "none";
        certSel.style.display = m === "cert" ? "" : "none";
        newK.style.display = m === "tls" ? "" : "none";
        if (["sym", "asym", "sig"].includes(m) && (!msg || /[^\x20-\x7e]/.test(msg))) { err.textContent = "Type a short message using ordinary keyboard characters."; steps = []; view.innerHTML = ""; return; }
        err.textContent = "";
        steps = m === "sym" ? symSteps(msg) : m === "asym" ? asymSteps(msg) : m === "sig" ? sigSteps(msg, tamper.checked) : m === "cert" ? certSteps(certSel.value) : tlsSteps(K);
        if (!keepIdx) idx = 0;
        idx = Math.min(idx, steps.length - 1);
        render();
      }
      function card(s, n) {
        const wrap = h("div", { style: "border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:10px;background:var(--surface)" });
        wrap.appendChild(h("div", { style: "font-weight:700;margin-bottom:6px", text: (showAll ? n + 1 + ". " : "") + s.t }));
        const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px" });
        const isTls = modeSel.value === "tls" || modeSel.value === "cert";
        [[isTls ? (modeSel.value === "cert" ? "Browser / CA" : "Client (browser)") : "Alice (sender)", s.a, "accent"], ["Network: what Eve sees", s.w, "warn"], [isTls ? (modeSel.value === "cert" ? "Server / CA" : "Server") : "Bob (receiver)", s.b, "ok"]].forEach(([title, body, c]) => {
          const col = h("div", { style: "border-top:3px solid var(--" + c + ");background:var(--bg-2);border-radius:6px;padding:6px 8px;min-width:0;overflow-wrap:anywhere;font-size:0.88rem" });
          col.appendChild(h("div", { class: "bit-label", style: "text-align:left;font-weight:700", text: title }));
          col.appendChild(h("div", { html: body || "<span style='color:var(--text-3)'>—</span>" }));
          grid.appendChild(col);
        });
        wrap.appendChild(grid);
        wrap.appendChild(h("div", { class: "explain", html: CS.markdown.inline(s.x) }));
        return wrap;
      }
      function render() {
        view.innerHTML = "";
        if (!steps.length) return;
        if (showAll) steps.forEach((s, i) => view.appendChild(card(s, i)));
        else view.appendChild(card(steps[idx], idx));
        stat.textContent = showAll ? "All " + steps.length + " steps" : "Step " + (idx + 1) + " of " + steps.length;
        back.disabled = showAll || idx === 0; next.disabled = showAll || idx === steps.length - 1;
        all.textContent = showAll ? "One step at a time" : "Show all steps";
      }
      back.addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
      next.addEventListener("click", () => { if (idx < steps.length - 1) { idx++; render(); } });
      all.addEventListener("click", () => { showAll = !showAll; render(); });
      modeSel.addEventListener("change", () => rebuild(false));
      certSel.addEventListener("change", () => rebuild(false));
      tamper.addEventListener("change", () => rebuild(true));
      msgIn.addEventListener("input", () => rebuild(true));
      newK.addEventListener("click", () => { K = 2 + Math.floor(Math.random() * 3200); rebuild(true); });
      rebuild(false);
    },
  });
})();
