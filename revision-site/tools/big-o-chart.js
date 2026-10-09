/* Big-O growth chart (canvas) with curve toggles, value table at chosen n, hover read-out and a snippet quiz. */
CS.registerTool({
  id: "big-o-chart",
  title: "Big-O growth-rate chart",
  section: "4",
  topic: "4.6",
  icon: "📈",
  desc: "Compare O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ) and O(n!) as n grows, then match code to its complexity.",
  help: "Drag **n up to** to change the range and tick curves on or off. Hover (or tap) the chart to read every function's value at that n; the table shows the values at the **n** you choose. Switch the y-axis to **logarithmic** to fit the exponential and factorial curves on the same chart.\n\nWhat to notice:\n- For small n the order can look different (e.g. 2ⁿ < n² for n = 3); Big-O is about what happens as **n grows large**.\n- **Polynomial** (n, n², n³) problems are called *tractable*; **exponential** (2ⁿ) and **factorial** (n!) are *intractable* — even modest n is out of reach.\n- log₂ n grows so slowly that doubling n adds only 1: this is why binary search is so fast.\n\nThe quiz shows six code snippets: pick the time complexity of each.",
  mount(el, params) {
    const h = CS.util.el;
    const F = [
      { k: "1", lab: "O(1)", f: () => 1 },
      { k: "log", lab: "O(log n)", f: (n) => Math.log2(n) },
      { k: "n", lab: "O(n)", f: (n) => n },
      { k: "nlog", lab: "O(n log n)", f: (n) => n * Math.log2(n) },
      { k: "n2", lab: "O(n²)", f: (n) => n * n },
      { k: "n3", lab: "O(n³)", f: (n) => n * n * n },
      { k: "2n", lab: "O(2ⁿ)", f: (n) => Math.pow(2, n) },
      { k: "fact", lab: "O(n!)", f: (n) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; } },
    ];
    // validated categorical palette (light / dark steps)
    const LIGHT = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];
    const DARK = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];
    const on = { 1: true, log: true, n: true, nlog: true, n2: true, n3: false, "2n": false, fact: false };
    let nMax = Math.min(100, Math.max(4, parseInt(params.n || 20, 10) || 20)), logY = false, hoverN = null;

    const nSlider = h("input", { type: "range", min: 4, max: 100, value: nMax, "aria-label": "Largest n shown", style: "width:130px" });
    const nLab = h("span", { class: "pill", text: "n ≤ " + nMax });
    const scaleSel = h("select", { "aria-label": "y-axis scale" });
    [["lin", "y-axis: linear"], ["log", "y-axis: logarithmic"]].forEach(([v, t]) => scaleSel.appendChild(h("option", { value: v, text: t })));
    const row1 = h("div", { class: "controls" }, [h("label", { text: "n up to " }, nSlider), nLab, scaleSel]);
    const toggles = h("div", { class: "controls", role: "group", "aria-label": "Curves to show" });
    const swatches = [];
    F.forEach((c) => {
      const cb = h("input", { type: "checkbox" }); cb.checked = on[c.k];
      cb.addEventListener("change", () => { on[c.k] = cb.checked; draw(); });
      const sw = h("i", { style: "display:inline-block;width:14px;height:4px;border-radius:2px" });
      swatches.push(sw);
      toggles.appendChild(h("label", { style: "font-family:var(--font-mono)" }, [cb, sw, document.createTextNode(c.lab)]));
    });
    const canvas = h("canvas", { height: 320, role: "img", "aria-label": "Line chart of growth rates against n", style: "width:100%;height:320px;display:block;touch-action:none" });
    const readout = h("div", { class: "stat-line", text: "Hover over the chart to read values." });
    const atIn = h("input", { type: "number", min: 1, max: 1000, value: 10, "aria-label": "n for the table", style: "width:80px;min-width:70px" });
    const tableWrap = h("div", { class: "table-wrap" });
    const tblErr = h("div", { class: "err", style: "display:none" });
    const quiz = h("div", { class: "card", style: "margin-top:14px;padding:14px" });
    el.append(row1, toggles, canvas, readout, h("div", { class: "controls", style: "margin-top:10px" }, [h("label", { text: "Values at n = " }, atIn)]), tblErr, tableWrap, quiz);

    function isDark() {
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
      const m = /^#?([0-9a-f]{6})$/i.exec(bg);
      if (!m) return false;
      const v = parseInt(m[1], 16);
      return ((v >> 16) & 255) * 0.299 + ((v >> 8) & 255) * 0.587 + (v & 255) * 0.114 < 128;
    }
    const colours = () => (isDark() ? DARK : LIGHT);
    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    function fmt(v) {
      if (!Number.isFinite(v)) return "∞";
      if (v >= 1e9) { const e = Math.floor(Math.log10(v)); return (v / Math.pow(10, e)).toFixed(2) + "×10^" + e; }
      if (Number.isInteger(v)) return v.toLocaleString("en-GB");
      return v.toFixed(2);
    }

    let geo = null;
    function draw() {
      const col = colours();
      swatches.forEach((s, i) => (s.style.background = col[i]));
      const dpr = window.devicePixelRatio || 1;
      const W = Math.max(280, canvas.clientWidth || 600), H = 320;
      canvas.width = W * dpr; canvas.height = H * dpr;
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const L = 58, R = 92, T = 14, B = 34, pw = W - L - R, ph = H - T - B;
      const vis = F.filter((c) => on[c.k]);
      // y-range: linear → fit polynomial curves, let 2ⁿ and n! run off the top
      let yMax;
      if (logY) yMax = Math.max(10, ...vis.map((c) => c.f(nMax)));
      else {
        const poly = vis.filter((c) => c.k !== "2n" && c.k !== "fact");
        yMax = Math.max(4, ...(poly.length ? poly : vis).map((c) => c.f(poly.length ? nMax : Math.min(nMax, c.k === "fact" ? 8 : 16))));
      }
      const yMaxLog = Math.log10(yMax) || 1;
      const X = (n) => L + ((n - 1) / (nMax - 1)) * pw;
      const Y = (v) => (logY ? T + ph - (Math.log10(Math.max(1, v)) / yMaxLog) * ph : T + ph - (v / yMax) * ph);
      geo = { L, pw, X };
      // grid + axes (recessive)
      g.strokeStyle = css("--border"); g.lineWidth = 1; g.fillStyle = css("--text-3"); g.font = "11px system-ui, sans-serif";
      g.textAlign = "right"; g.textBaseline = "middle";
      let ticks;
      if (logY) { const top = Math.floor(yMaxLog), k = Math.max(1, Math.ceil(top / 8)); ticks = []; for (let e = 0; e <= top; e += k) ticks.push(Math.pow(10, e)); }
      else ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax);
      [...new Set(ticks)].forEach((v) => { const y = Y(v); g.beginPath(); g.moveTo(L, y); g.lineTo(L + pw, y); g.stroke(); g.fillText(fmt(Math.round(v * 100) / 100), L - 6, y); });
      g.textAlign = "center"; g.textBaseline = "top";
      const step = nMax <= 20 ? (nMax <= 10 ? 1 : 2) : nMax <= 50 ? 5 : 10;
      for (let n = 1; n <= nMax; n++) if (n === 1 || n % step === 0) g.fillText(n, X(n), T + ph + 6);
      g.fillText("n (input size)", L + pw / 2, T + ph + 20);
      g.strokeStyle = css("--text-3"); g.beginPath(); g.moveTo(L, T); g.lineTo(L, T + ph); g.lineTo(L + pw, T + ph); g.stroke();
      // curves
      g.save(); g.beginPath(); g.rect(L, T - 2, pw + 2, ph + 4); g.clip();
      vis.forEach((c) => {
        g.strokeStyle = col[F.indexOf(c)]; g.lineWidth = 2; g.beginPath();
        const steps = Math.min(400, (nMax - 1) * 8);
        for (let i = 0; i <= steps; i++) {
          const n = 1 + ((nMax - 1) * i) / steps;
          const v = c.k === "fact" ? gammaFact(n) : c.f(n);
          const y = Math.max(T - 2, Y(v));
          if (i === 0) g.moveTo(X(n), y); else g.lineTo(X(n), y);
          if (y <= T - 2) break;
        }
        g.stroke();
      });
      g.restore();
      // direct labels (text in text ink, coloured tick carries identity)
      g.textAlign = "left"; g.textBaseline = "middle"; g.font = "11px ui-monospace, monospace";
      const lab = vis.map((c) => {
        let x = L + pw + 6, y = Y(c.f(nMax));
        if (y < T) { let n = 1; while (n < nMax && Y(c.f(n + 1)) >= T) n++; x = Math.min(L + pw - 80, X(n) + 4); y = T + 6; }
        return { c, x, y };
      });
      const right = lab.filter((o) => o.x > L + pw).sort((a, b) => a.y - b.y);
      for (let i = 1; i < right.length; i++) right[i].y = Math.max(right[i].y, right[i - 1].y + 12);
      const bottom = T + ph;
      for (let i = right.length - 1; i >= 0; i--) right[i].y = Math.min(right[i].y, i === right.length - 1 ? bottom : right[i + 1].y - 12);
      lab.forEach(({ c, x, y }) => {
        g.fillStyle = col[F.indexOf(c)]; g.fillRect(x, y - 1.5, 8, 3);
        g.fillStyle = css("--text-2"); g.fillText(c.lab, x + 11, y);
      });
      // hover crosshair
      if (hoverN) {
        g.strokeStyle = css("--text-3"); g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(hoverN), T); g.lineTo(X(hoverN), T + ph); g.stroke(); g.setLineDash([]);
        vis.forEach((c) => { const y = Y(c.f(hoverN)); if (y >= T) { g.fillStyle = col[F.indexOf(c)]; g.strokeStyle = css("--bg-2"); g.lineWidth = 2; g.beginPath(); g.arc(X(hoverN), y, 4.5, 0, 7); g.fill(); g.stroke(); } });
        readout.textContent = "n = " + hoverN + ":  " + vis.map((c) => c.lab + " = " + fmt(round(c.f(hoverN)))).join("   ");
      }
    }
    const round = (v) => (Number.isInteger(v) ? v : Math.round(v * 100) / 100);
    function gammaFact(x) { // smooth n! for drawing between integers (linear interpolation in log space)
      const lo = Math.floor(x), fr = x - lo, a = F[7].f(lo), b = F[7].f(lo + 1);
      return Math.exp(Math.log(a) * (1 - fr) + Math.log(b) * fr);
    }
    function table() {
      const n = Number(atIn.value);
      if (!Number.isInteger(n) || n < 1 || n > 1000) { tblErr.textContent = "Choose a whole number n from 1 to 1000."; tblErr.style.display = ""; return; }
      tblErr.style.display = "none";
      const rows = F.map((c) => {
        const v = c.f(n), secs = v / 1e9;
        const time = !Number.isFinite(v) ? "longer than the universe has existed" : secs < 1e-6 ? "< 1 µs" : secs < 1 ? (secs * 1000).toPrecision(3) + " ms" : secs < 3.15e7 ? secs.toPrecision(3) + " s" : (secs / 3.15e7).toPrecision(3) + " years";
        return "<tr><td style='font-family:var(--font-mono)'>" + c.lab + "</td><td style='font-family:var(--font-mono)'>" + fmt(round(v)) + "</td><td>" + time + "</td></tr>";
      }).join("");
      tableWrap.innerHTML = "<table><thead><tr><th>Complexity</th><th>Steps at n = " + n + "</th><th>Time at 10⁹ steps/s</th></tr></thead><tbody>" + rows + "</tbody></table>";
    }
    canvas.addEventListener("pointermove", (e) => {
      if (!geo) return;
      const r = canvas.getBoundingClientRect();
      const n = Math.round(1 + ((e.clientX - r.left - geo.L) / geo.pw) * (nMax - 1));
      const nn = Math.max(1, Math.min(nMax, n));
      if (nn !== hoverN) { hoverN = nn; draw(); }
    });
    canvas.addEventListener("pointerleave", () => { hoverN = null; readout.textContent = "Hover over the chart to read values."; draw(); });
    nSlider.addEventListener("input", () => { nMax = Number(nSlider.value); nLab.textContent = "n ≤ " + nMax; hoverN = null; draw(); });
    scaleSel.addEventListener("change", () => { logY = scaleSel.value === "log"; draw(); });
    atIn.addEventListener("input", table);
    const redraw = () => { if (!el.isConnected) { mo.disconnect(); window.removeEventListener("resize", redraw); return; } draw(); };
    const mo = new MutationObserver(redraw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", redraw);
    if (window.matchMedia) { try { window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw); } catch (e) { /* old browsers */ } }

    /* ---------- "Which is this?" quiz ---------- */
    const Q = [
      { code: "FUNCTION first(a)\n  RETURN a[0]\nENDFUNCTION", ans: "O(1)", why: "One step whatever the size of the list: constant time." },
      { code: "found ← False\nFOR i ← 0 TO LEN(a) - 1\n  IF a[i] = target THEN found ← True ENDIF\nENDFOR", ans: "O(n)", why: "A single loop that visits each of the n items once: linear time." },
      { code: "low ← 0; high ← LEN(a) - 1\nWHILE low ≤ high\n  mid ← (low + high) DIV 2\n  IF a[mid] = t THEN RETURN mid\n  ELSE IF a[mid] < t THEN low ← mid + 1\n  ELSE high ← mid - 1 ENDIF\nENDWHILE", ans: "O(log n)", why: "The search space halves each time round the loop, so about log₂ n iterations (binary search)." },
      { code: "FOR i ← 0 TO n - 1\n  FOR j ← 0 TO n - 1\n    OUTPUT i * j\n  ENDFOR\nENDFOR", ans: "O(n²)", why: "A loop of n inside a loop of n: n × n steps. Bubble sort has this shape too." },
      { code: "FUNCTION mergeSort(a)\n  IF LEN(a) ≤ 1 THEN RETURN a\n  mid ← LEN(a) DIV 2\n  l ← mergeSort(a[0..mid-1])\n  r ← mergeSort(a[mid..])\n  RETURN merge(l, r)   # O(n) work\nENDFUNCTION", ans: "O(n log n)", why: "log₂ n levels of halving, and each level does O(n) merging work." },
      { code: "FUNCTION fib(n)\n  IF n ≤ 1 THEN RETURN n\n  RETURN fib(n - 1) + fib(n - 2)\nENDFUNCTION", ans: "O(2ⁿ)", why: "Each call makes two more calls, so the call tree roughly doubles at every level: exponential." },
    ];
    let qi = 0, score = 0, answered = false;
    function showQ() {
      quiz.innerHTML = "";
      if (qi >= Q.length) {
        quiz.append(h("h4", { text: "Which is this? — done", style: "margin:0 0 6px" }), h("p", { text: "You scored " + score + " / " + Q.length + "." }), h("button", { class: "btn sm primary", type: "button", text: "Try again", onclick: () => { qi = 0; score = 0; showQ(); } }));
        return;
      }
      const q = Q[qi]; answered = false;
      const fb = h("div", { class: "explain", "aria-live": "polite" });
      const opts = h("div", { class: "controls", style: "margin-top:8px" });
      F.forEach((c) => opts.appendChild(h("button", { class: "btn sm", type: "button", text: c.lab, onclick: (e) => {
        if (answered) return;
        answered = true;
        const ok = c.lab === q.ans;
        if (ok) score++;
        e.currentTarget.classList.add(ok ? "ok" : "danger");
        fb.innerHTML = "";
        fb.append(h("span", { class: ok ? "ok-text" : "err", text: ok ? "✓ Correct. " : "✗ It's " + q.ans + ". " }), document.createTextNode(q.why + " "), h("button", { class: "btn sm primary", type: "button", text: qi < Q.length - 1 ? "Next snippet" : "See score", onclick: () => { qi++; showQ(); } }));
      } })));
      quiz.append(h("h4", { text: "Which is this? (" + (qi + 1) + " / " + Q.length + ")", style: "margin:0 0 6px" }), h("pre", { class: "output", text: q.code, style: "margin:0" }), opts, fb);
    }
    showQ();
    table();
    requestAnimationFrame(draw);
    draw();
  },
});
