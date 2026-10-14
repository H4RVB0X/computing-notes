/* Vector playground: u + v, k·u, convex combination, dot product and angle, with AQA notations. */
CS.registerTool({
  id: "vector-tool",
  title: "Vector playground",
  section: "2",
  topic: "2.8",
  icon: "↗️",
  desc: "Draw 2-D vectors, add them head-to-tail, scale them, slide a convex combination and compute the dot product and angle.",
  help:
    "Type the components of **u** and **v**, or **drag the arrow heads** on the grid (they snap to whole numbers).\n\n" +
    "* **u + v** is drawn head-to-tail: v is moved so it starts at the head of u; the sum goes from the origin to the end.\n" +
    "* **k·u** multiplies each component by the scalar k (a negative k reverses the direction).\n" +
    "* **Convex combination** α·u + (1 − α)·v with 0 ≤ α ≤ 1 always lies on the line segment joining the heads of u and v. Move the slider: α = 1 gives u, α = 0 gives v.\n" +
    "* **Dot product** u·v = u₀v₀ + u₁v₁. Since u·v = |u||v| cos θ, the angle is θ = cos⁻¹(u·v ÷ (|u||v|)). A dot product of 0 means the vectors are perpendicular.\n\n" +
    "The notations panel shows the same vector the three ways AQA writes it: a **list** `[x, y]`, a **dictionary** `{0: x, 1: y}` and a **function** from the index set {0, 1} to ℝ.",
  mount(el, params) {
    const h = CS.util.el;
    const st = { ux: 3, uy: 1, vx: 1, vy: 3, k: 2, a: 0.5, showSum: true, showK: true, showC: true };
    const num = (label, key, min, max, stepv) => {
      const i = h("input", { type: "number", min, max, step: stepv || 1, value: st[key], style: "width:64px;min-width:64px", "aria-label": label });
      i.addEventListener("input", () => {
        const v = parseFloat(i.value);
        if (isNaN(v) || v < min || v > max) {
          errBox.textContent = label + " must be a number from " + min + " to " + max + ".";
          return;
        }
        errBox.textContent = "";
        st[key] = v;
        draw();
      });
      inputs[key] = i;
      return i;
    };
    const inputs = {};
    const errBox = h("div", { class: "err", style: "min-height:1.2em" });
    const chk = (label, key) => {
      const c = h("input", { type: "checkbox" });
      c.checked = st[key];
      c.addEventListener("change", () => ((st[key] = c.checked), draw()));
      return h("label", {}, [c, label]);
    };
    const slider = h("input", { type: "range", min: 0, max: 1, step: 0.05, value: st.a, style: "width:130px", "aria-label": "alpha" });
    const aOut = h("span", { class: "mono", text: "0.50" });
    slider.addEventListener("input", () => ((st.a = parseFloat(slider.value)), draw()));
    el.append(
      h("div", { class: "controls" }, [h("label", { style: "color:var(--accent)" }, ["u = [", num("u x-component", "ux", -10, 10), ",", num("u y-component", "uy", -10, 10), "]"]), h("label", { style: "color:var(--ok)" }, ["v = [", num("v x-component", "vx", -10, 10), ",", num("v y-component", "vy", -10, 10), "]"])]),
      h("div", { class: "controls" }, [h("label", {}, ["k =", num("scalar k", "k", -5, 5, 0.5)]), h("label", {}, ["α =", slider, aOut]), chk("u + v", "showSum"), chk("k·u", "showK"), chk("convex comb.", "showC")]),
      errBox
    );
    const canvas = h("canvas", { style: "touch-action:none;cursor:crosshair;display:block;width:100%", "aria-label": "Vector diagram: drag the heads of u and v" });
    const canvasWrap = h("div", { style: "max-width:460px" }, canvas);
    const calc = h("div", { class: "output", style: "font-size:0.84rem" });
    const notes = h("div", { class: "output", style: "font-size:0.84rem;margin-top:10px" });
    el.append(h("div", { class: "two-col" }, [canvasWrap, h("div", {}, [calc, notes])]));
    el.append(h("div", { class: "legend" }, [h("span", { html: "<i style='background:var(--accent)'></i>u" }), h("span", { html: "<i style='background:var(--ok)'></i>v" }), h("span", { html: "<i style='background:var(--warn)'></i>u + v" }), h("span", { html: "<i style='background:var(--bad)'></i>k·u" }), h("span", { html: "<i style='background:var(--text-2)'></i>α·u + (1−α)·v" })]));

    let R = 6; // grid half-range
    let drag = null;
    const f = (x) => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : (Math.round(x * 100) / 100).toString());
    const br = (x) => (x < 0 ? "(" + f(x) + ")" : f(x));

    function draw() {
      try {
        render();
        explain();
      } catch (e) {
        errBox.textContent = "Drawing error: " + e.message;
      }
    }
    function render() {
      const css = getComputedStyle(document.documentElement);
      const C = (n) => css.getPropertyValue(n).trim() || "#888";
      const size = Math.max(240, Math.min(460, canvasWrap.clientWidth || 360));
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.height = size + "px";
      const g = canvas.getContext("2d");
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!drag) {
        const ext = [st.ux, st.uy, st.vx, st.vy, st.ux + st.vx, st.uy + st.vy].concat(st.showK ? [st.k * st.ux, st.k * st.uy] : []);
        R = Math.min(30, Math.max(6, Math.ceil(Math.max(...ext.map(Math.abs))) + 1));
      }
      const s = size / (2 * R);
      const X = (x) => size / 2 + x * s,
        Y = (y) => size / 2 - y * s;
      g.clearRect(0, 0, size, size);
      const tick = R > 15 ? 5 : R > 8 ? 2 : 1;
      g.lineWidth = 1;
      g.strokeStyle = C("--border");
      g.fillStyle = C("--text-3");
      g.font = "10px sans-serif";
      for (let i = -R; i <= R; i++) {
        g.globalAlpha = i % tick === 0 ? 1 : 0.35;
        g.beginPath();
        g.moveTo(X(i), 0);
        g.lineTo(X(i), size);
        g.moveTo(0, Y(i));
        g.lineTo(size, Y(i));
        g.stroke();
        if (i && i % tick === 0) {
          g.globalAlpha = 1;
          g.fillText(String(i), X(i) + 2, Y(0) + 11);
          g.fillText(String(i), X(0) + 3, Y(i) - 2);
        }
      }
      g.globalAlpha = 1;
      g.strokeStyle = C("--text-3");
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(X(-R), Y(0));
      g.lineTo(X(R), Y(0));
      g.moveTo(X(0), Y(-R));
      g.lineTo(X(0), Y(R));
      g.stroke();
      const arrow = (x0, y0, x1, y1, col, label, dash, w) => {
        g.strokeStyle = g.fillStyle = col;
        g.lineWidth = w || 2.5;
        g.setLineDash(dash ? [6, 5] : []);
        g.beginPath();
        g.moveTo(X(x0), Y(y0));
        g.lineTo(X(x1), Y(y1));
        g.stroke();
        g.setLineDash([]);
        const ang = Math.atan2(Y(y1) - Y(y0), X(x1) - X(x0));
        if (Math.hypot(x1 - x0, y1 - y0) > 1e-9) {
          g.beginPath();
          g.moveTo(X(x1), Y(y1));
          g.lineTo(X(x1) - 11 * Math.cos(ang - 0.4), Y(y1) - 11 * Math.sin(ang - 0.4));
          g.lineTo(X(x1) - 11 * Math.cos(ang + 0.4), Y(y1) - 11 * Math.sin(ang + 0.4));
          g.closePath();
          g.fill();
        }
        if (label) {
          g.font = "bold 13px sans-serif";
          g.fillText(label, X(x1) + 6, Y(y1) - 6);
        }
      };
      if (st.showK) arrow(0, 0, st.k * st.ux, st.k * st.uy, C("--bad"), "k·u", false, 4);
      if (st.showSum) {
        arrow(st.ux, st.uy, st.ux + st.vx, st.uy + st.vy, C("--ok"), "", true, 2);
        arrow(0, 0, st.ux + st.vx, st.uy + st.vy, C("--warn"), "u+v");
      }
      if (st.showC) {
        g.strokeStyle = C("--text-2");
        g.setLineDash([2, 4]);
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(X(st.ux), Y(st.uy));
        g.lineTo(X(st.vx), Y(st.vy));
        g.stroke();
        g.setLineDash([]);
      }
      arrow(0, 0, st.ux, st.uy, C("--accent"), "u");
      arrow(0, 0, st.vx, st.vy, C("--ok"), "v");
      if (st.showC) {
        const cx = st.a * st.ux + (1 - st.a) * st.vx,
          cy = st.a * st.uy + (1 - st.a) * st.vy;
        g.fillStyle = C("--text");
        g.beginPath();
        g.arc(X(cx), Y(cy), 6, 0, 7);
        g.fill();
        g.font = "12px sans-serif";
        g.fillText("α·u+(1−α)·v", X(cx) + 8, Y(cy) + 14);
      }
      // drag handles
      [["u", st.ux, st.uy, "--accent"], ["v", st.vx, st.vy, "--ok"]].forEach(([, x, y, c]) => {
        g.strokeStyle = C(c);
        g.lineWidth = 2;
        g.beginPath();
        g.arc(X(x), Y(y), 9, 0, 7);
        g.stroke();
      });
      canvas._map = { s, size };
    }
    function explain() {
      const { ux, uy, vx, vy, k, a } = st;
      aOut.textContent = a.toFixed(2);
      const dot = ux * vx + uy * vy;
      const mu = Math.hypot(ux, uy),
        mv = Math.hypot(vx, vy);
      const cx = a * ux + (1 - a) * vx,
        cy = a * uy + (1 - a) * vy;
      let ang;
      if (mu === 0 || mv === 0) ang = "θ is undefined: a zero vector has no direction.";
      else {
        const c = Math.max(-1, Math.min(1, dot / (mu * mv)));
        const deg = (Math.acos(c) * 180) / Math.PI;
        ang = "cos θ = u·v / (|u| |v|) = " + f(dot) + " / (" + mu.toFixed(3) + " × " + mv.toFixed(3) + ") = " + c.toFixed(4) + "\nθ = cos⁻¹(" + c.toFixed(4) + ") = " + deg.toFixed(1) + "°" + (Math.abs(dot) < 1e-9 ? "  → perpendicular (u·v = 0)" : deg < 90 ? "  (acute: u·v > 0)" : "  (obtuse: u·v < 0)");
      }
      calc.textContent =
        "u + v = [" + f(ux) + " + " + br(vx) + ", " + f(uy) + " + " + br(vy) + "] = [" + f(ux + vx) + ", " + f(uy + vy) + "]\n" +
        "k·u   = " + f(k) + " × [" + f(ux) + ", " + f(uy) + "] = [" + f(k * ux) + ", " + f(k * uy) + "]\n\n" +
        "Convex combination, α = " + f(a) + ":\nα·u + (1 − α)·v = " + f(a) + "·[" + f(ux) + ", " + f(uy) + "] + " + f(1 - a) + "·[" + f(vx) + ", " + f(vy) + "]\n                = [" + f(cx) + ", " + f(cy) + "]\n\n" +
        "Dot product:\nu·v = " + f(ux) + "×" + br(vx) + " + " + f(uy) + "×" + br(vy) + " = " + f(ux * vx) + " + " + br(uy * vy) + " = " + f(dot) + "\n" +
        "|u| = √(" + f(ux) + "² + " + f(uy) + "²) = " + mu.toFixed(3) + "   |v| = √(" + f(vx) + "² + " + f(vy) + "²) = " + mv.toFixed(3) + "\n" + ang;
      notes.textContent =
        "Same vectors, three AQA notations (ℝ² = 2-vector over ℝ):\n" +
        "list:       u = [" + f(ux) + ", " + f(uy) + "]          v = [" + f(vx) + ", " + f(vy) + "]\n" +
        "dictionary: u = {0: " + f(ux) + ", 1: " + f(uy) + "}    v = {0: " + f(vx) + ", 1: " + f(vy) + "}\n" +
        "function:   u: {0,1} → ℝ, 0 ↦ " + f(ux) + ", 1 ↦ " + f(uy) + "\n            v: {0,1} → ℝ, 0 ↦ " + f(vx) + ", 1 ↦ " + f(vy);
    }
    function toWorld(e) {
      const r = canvas.getBoundingClientRect();
      const m = canvas._map;
      const sc = m.size / r.width;
      return [((e.clientX - r.left) * sc - m.size / 2) / m.s, (m.size / 2 - (e.clientY - r.top) * sc) / m.s];
    }
    canvas.addEventListener("pointerdown", (e) => {
      const [x, y] = toWorld(e);
      const du = Math.hypot(x - st.ux, y - st.uy),
        dv = Math.hypot(x - st.vx, y - st.vy);
      const tol = 18 / canvas._map.s;
      if (Math.min(du, dv) > tol) return;
      drag = du <= dv ? "u" : "v";
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!drag) return;
      let [x, y] = toWorld(e);
      x = Math.max(-10, Math.min(10, Math.round(x)));
      y = Math.max(-10, Math.min(10, Math.round(y)));
      st[drag + "x"] = x;
      st[drag + "y"] = y;
      inputs[drag + "x"].value = x;
      inputs[drag + "y"].value = y;
      errBox.textContent = "";
      draw();
    });
    const end = () => {
      if (drag) ((drag = null), draw());
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    const mo = new MutationObserver(() => (canvas.isConnected ? draw() : mo.disconnect()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    let lastW = 0;
    if (window.ResizeObserver)
      new ResizeObserver(() => {
        const w = canvasWrap.clientWidth;
        if (canvas.isConnected && w !== lastW) {
          lastW = w;
          requestAnimationFrame(draw);
        }
      }).observe(canvasWrap);
    draw();
  },
});
