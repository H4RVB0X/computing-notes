/* sampling-demo: sample an analogue wave — rate, resolution, Nyquist, file size (AQA 4.5.6.6–4.5.6.8). */
CS.registerTool({
  id: "sampling-demo",
  title: "Sound sampling demo",
  section: "5",
  topic: "5.7",
  icon: "🎵",
  desc: "Sample an analogue wave: change the sampling rate and sample resolution, see the quantised reconstruction, aliasing below the Nyquist rate, and the file-size calculation.",
  help: "The blue curve is the **analogue** signal (1 second of a sine wave). The ADC measures it at regular intervals — the **sampling rate** (samples per second, Hz) — and rounds each measurement to the nearest of 2<sup>n</sup> levels, where n is the **sample resolution** (bits per sample). The green line joins the stored (quantised) samples: this is what would be played back.\n\n- Raise the **resolution** and the quantisation levels get closer together, so the stored values are nearer the true ones.\n- Raise the **sampling rate** and the reconstruction follows the curve more closely.\n- **Nyquist's theorem**: you must sample at *at least twice* the highest frequency in the signal. Drop the rate below 2 × frequency and the samples trace out a completely different, lower-frequency wave — **aliasing**.\n\nFile size (bits) = sampling rate × sample resolution × seconds × channels.",
  mount(el, params) {
    const h = CS.util.el;
    const slider = (label, min, max, val) => {
      const inp = h("input", { type: "range", min: String(min), max: String(max), value: String(val), "aria-label": label });
      const out = h("span", { class: "mono", style: "min-width:3.5em", text: String(val) });
      return { inp, out, lab: h("label", {}, [label, inp, out]) };
    };
    const freq = slider("Signal frequency (Hz)", 1, 10, 3);
    const rate = slider("Sampling rate (Hz)", 1, 60, 20);
    const res = slider("Resolution (bits)", 1, 6, 3);
    const stepChk = h("input", { type: "checkbox" });
    el.append(h("div", { class: "controls" }, [freq.lab, rate.lab, res.lab]), h("div", { class: "controls" }, [h("label", {}, [stepChk, "draw reconstruction as steps (sample-and-hold)"])]));
    const canvas = h("canvas", { height: "280", role: "img", "aria-label": "Analogue wave with sample points and quantised reconstruction", style: "width:100%;height:280px;display:block" });
    const warn = h("div", { role: "status" });
    const legend = h("div", { class: "legend" });
    const stats = h("div", { class: "explain" });
    el.append(canvas, legend, warn, stats);

    // file size calculator
    const fRate = h("input", { type: "number", value: "44100", min: "1", "aria-label": "Sampling rate in Hz", style: "width:100px" });
    const fRes = h("input", { type: "number", value: "16", min: "1", "aria-label": "Sample resolution in bits", style: "width:70px" });
    const fSec = h("input", { type: "number", value: "60", min: "0", "aria-label": "Length in seconds", style: "width:80px" });
    const fCh = h("select", { "aria-label": "Channels" }, [h("option", { value: "1", text: "1 (mono)" }), h("option", { value: "2", text: "2 (stereo)" })]);
    fCh.value = "2";
    const fOut = h("div", { class: "steps-out" });
    el.append(h("h4", { text: "File size calculator", style: "margin:16px 0 6px" }), h("div", { class: "controls" }, [h("label", {}, ["Rate (Hz)", fRate]), h("label", {}, ["Resolution (bits)", fRes]), h("label", {}, ["Seconds", fSec]), h("label", {}, ["Channels", fCh])]), fOut);

    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888";
    function draw() {
      const f = +freq.inp.value, r = +rate.inp.value, n = +res.inp.value, L = 2 ** n;
      freq.out.textContent = f; rate.out.textContent = r; res.out.textContent = n;
      const dpr = window.devicePixelRatio || 1, Wc = Math.max(280, canvas.clientWidth || 600), Hc = 280;
      canvas.width = Wc * dpr; canvas.height = Hc * dpr;
      const c = canvas.getContext("2d");
      if (!c) return;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, Wc, Hc);
      const pad = 34, x = (t) => pad + t * (Wc - pad - 10), y = (v) => Hc / 2 - v * (Hc / 2 - 18);
      const text = css("--text"), muted = css("--text-3"), border = css("--border"), accent = css("--accent"), ok = css("--ok"), warnC = css("--warn"), bad = css("--bad");
      const qv = (k) => -1 + (2 * k) / (L - 1);
      // quantisation levels
      c.strokeStyle = border; c.lineWidth = 1; c.font = "10px ui-monospace, monospace"; c.fillStyle = muted;
      for (let k = 0; k < L; k++) {
        c.beginPath(); c.moveTo(pad, y(qv(k))); c.lineTo(Wc - 10, y(qv(k))); c.stroke();
        if (L <= 16) c.fillText(k.toString(2).padStart(n, "0"), 2, y(qv(k)) + 3);
      }
      c.strokeStyle = muted; c.beginPath(); c.moveTo(pad, y(0)); c.lineTo(Wc - 10, y(0)); c.moveTo(pad, 8); c.lineTo(pad, Hc - 8); c.stroke();
      c.fillStyle = muted; c.fillText("time (1 s) →", Wc - 80, Hc - 4);
      // analogue wave
      c.strokeStyle = accent; c.lineWidth = 2; c.beginPath();
      for (let i = 0; i <= 600; i++) { const t = i / 600, X = x(t), Y = y(Math.sin(2 * Math.PI * f * t)); i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
      c.stroke();
      // samples
      const S = [];
      for (let i = 0; i * (1 / r) <= 1 + 1e-9; i++) {
        const t = i / r, v = Math.sin(2 * Math.PI * f * t), k = Math.round(((v + 1) / 2) * (L - 1));
        S.push({ t, v, k, q: qv(k) });
      }
      const recon = r < 2 * f ? bad : ok;
      c.strokeStyle = recon; c.lineWidth = 2; c.beginPath();
      S.forEach((s, i) => {
        if (stepChk.checked) { if (i) c.lineTo(x(s.t), y(S[i - 1].q)); else c.moveTo(x(s.t), y(s.q)); c.lineTo(x(s.t), y(s.q)); }
        else i ? c.lineTo(x(s.t), y(s.q)) : c.moveTo(x(s.t), y(s.q));
      });
      if (stepChk.checked && S.length) c.lineTo(x(1), y(S[S.length - 1].q));
      c.stroke();
      S.forEach((s) => {
        c.strokeStyle = muted; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(x(s.t), y(0)); c.lineTo(x(s.t), y(s.v)); c.stroke(); c.setLineDash([]);
        c.fillStyle = warnC; c.beginPath(); c.arc(x(s.t), y(s.q), 4, 0, 7); c.fill();
        c.strokeStyle = text; c.beginPath(); c.arc(x(s.t), y(s.v), 2.5, 0, 7); c.stroke();
      });
      legend.innerHTML = '<span><i style="background:' + accent + '"></i>analogue signal</span><span><i style="background:' + warnC + '"></i>stored sample (quantised)</span><span><i style="background:' + recon + '"></i>reconstruction</span><span><i style="background:' + border + '"></i>' + L + " quantisation levels</span>";
      const alias = Math.abs(f - r * Math.round(f / r));
      warn.innerHTML = r < 2 * f
        ? '<p class="err">⚠ Nyquist: the sampling rate (' + r + " Hz) is less than 2 × " + f + " Hz = " + 2 * f + " Hz. The samples cannot capture the wave — they trace out " + (alias === 0 ? "a flat line" : "a " + alias + " Hz wave") + " instead (aliasing).</p>"
        : '<p class="ok-text">✓ ' + r + " Hz ≥ 2 × " + f + " Hz = " + 2 * f + " Hz, so the Nyquist condition is met.</p>";
      const errMax = S.reduce((m, s) => Math.max(m, Math.abs(s.v - s.q)), 0);
      stats.innerHTML = "Samples taken in 1 s: " + S.length + " (one every " + +(1000 / r).toFixed(1) + " ms). Each stored as one of 2<sup>" + n + "</sup> = " + L + " levels, so the largest rounding (quantisation) error here is " + errMax.toFixed(3) + " of the amplitude. Data for this 1-second mono clip = " + r + " × " + n + " × 1 × 1 = <b>" + r * n + " bits</b>.";
    }
    function fileSize() {
      const R = +fRate.value, B = +fRes.value, T = +fSec.value, C = +fCh.value;
      if (!(R > 0) || !(B > 0) || !(T >= 0)) return (fOut.innerHTML = '<p class="err">Enter positive numbers.</p>');
      const bits = R * B * T * C, bytes = bits / 8;
      fOut.innerHTML = "<p><b>File size</b> = sampling rate × resolution × seconds × channels = " + R.toLocaleString("en-GB") + " × " + B + " × " + T + " × " + C + " = <b>" + bits.toLocaleString("en-GB") + " bits</b></p><p>÷ 8 = <b>" + bytes.toLocaleString("en-GB") + " bytes</b> = " + +(bytes / 1000).toFixed(2) + " kB = " + +(bytes / 1e6).toFixed(3) + " MB (decimal: 1 kB = 1000 bytes) · " + +(bytes / 2 ** 20).toFixed(3) + " MiB (binary: 1 MiB = 1024 × 1024 bytes).</p>";
    }
    [freq.inp, rate.inp, res.inp].forEach((i) => i.addEventListener("input", draw));
    stepChk.addEventListener("change", draw);
    [fRate, fRes, fSec].forEach((i) => i.addEventListener("input", fileSize));
    fCh.addEventListener("change", fileSize);
    let ro = null, mo = null;
    const watch = () => { if (!el.isConnected) { if (ro) ro.disconnect(); if (mo) mo.disconnect(); return; } draw(); };
    if (window.ResizeObserver) { ro = new ResizeObserver(watch); ro.observe(canvas); }
    if (window.MutationObserver) { mo = new MutationObserver(watch); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] }); }
    draw();
    fileSize();
  },
});
