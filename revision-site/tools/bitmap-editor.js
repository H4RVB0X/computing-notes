/* bitmap-editor: paint a tiny bitmap and see its bits, colour depth and file size (AQA 4.5.6.3–4.5.6.5). */
CS.registerTool({
  id: "bitmap-editor",
  title: "Bitmap editor",
  section: "5",
  topic: "5.7",
  icon: "🎨",
  desc: "Paint a tiny bitmap, change the colour depth and resolution, and see the bit pattern of every row and the file-size calculation.",
  help: "Pick a colour from the palette and click (or drag across) pixels to paint them.\n\n- **Colour depth** = the number of bits used to store each pixel. n bits give 2<sup>n</sup> possible colours: 1 bit → 2, 2 bits → 4, 4 bits → 16, 8 bits → 256.\n- **Resolution** = width × height in pixels.\n- The bit pattern for each row is shown underneath: each pixel is replaced by the binary code of its colour.\n- **File size (bits) = width × height × colour depth**; divide by 8 for bytes. Real files also store **metadata** (width, height, colour depth…) — tick the box to add it.\n\nNotice what happens when you *reduce* the colour depth: colours that no longer exist are replaced by the nearest one left in the palette.",
  mount(el, params) {
    const h = CS.util.el;
    let W = 8, H = 8, depth = 1, cur = 1, painting = false;
    const pal = (d) => {
      if (d === 1) return ["#ffffff", "#000000"];
      if (d === 2) return ["#ffffff", "#aaaaaa", "#555555", "#000000"];
      if (d === 4) return ["#000000", "#0000aa", "#00aa00", "#00aaaa", "#aa0000", "#aa00aa", "#aa5500", "#aaaaaa", "#555555", "#5555ff", "#55ff55", "#55ffff", "#ff5555", "#ff55ff", "#ffff55", "#ffffff"];
      const out = [];
      for (let i = 0; i < 256; i++) {
        const r = Math.round((((i >> 5) & 7) * 255) / 7), g = Math.round((((i >> 2) & 7) * 255) / 7), bl = Math.round(((i & 3) * 255) / 3);
        out.push("#" + [r, g, bl].map((x) => x.toString(16).padStart(2, "0")).join(""));
      }
      return out;
    };
    let palette = pal(1);
    const smile = ["00111100", "01000010", "10100101", "10000001", "10100101", "10011001", "01000010", "00111100"];
    let px = smile.map((r) => r.split("").map(Number));

    const sizeW = h("select", { "aria-label": "Width in pixels" }), sizeH = h("select", { "aria-label": "Height in pixels" });
    [4, 6, 8, 10, 12, 16].forEach((n) => { sizeW.appendChild(h("option", { value: n, text: n })); sizeH.appendChild(h("option", { value: n, text: n })); });
    sizeW.value = sizeH.value = "8";
    const depthSel = h("select", { "aria-label": "Colour depth" });
    [1, 2, 4, 8].forEach((d) => depthSel.appendChild(h("option", { value: d, text: d + "-bit (" + 2 ** d + " colours)" })));
    const clearB = h("button", { class: "btn sm ghost", type: "button", text: "Clear" });
    const fillB = h("button", { class: "btn sm ghost", type: "button", text: "Fill with colour" });
    const metaChk = h("input", { type: "checkbox" });
    const metaIn = h("input", { type: "number", min: "0", max: "100000", value: "54", "aria-label": "Metadata size in bytes", style: "width:80px" });
    el.append(
      h("div", { class: "controls" }, [h("label", {}, ["Width", sizeW]), h("label", {}, ["Height", sizeH]), h("label", {}, ["Colour depth", depthSel]), clearB, fillB]),
      h("div", { class: "controls" }, [h("label", {}, [metaChk, "Include metadata of", metaIn, "bytes"])])
    );
    const palWrap = h("div", { style: "display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px;max-width:420px", role: "group", "aria-label": "Palette" });
    const curLine = h("div", { class: "stat-line" });
    const gridWrap = h("div", { style: "display:grid;gap:1px;background:var(--border-2);border:1px solid var(--border-2);width:100%;touch-action:none;user-select:none" });
    const bitsOut = h("div", { class: "output", style: "font-size:0.8rem" });
    const sizeOut = h("div", { class: "steps-out" });
    const left = h("div", {}, [palWrap, curLine, gridWrap]);
    const right = h("div", {}, [h("div", { class: "small muted", text: "Bit pattern, row by row (each pixel = its colour code):" }), bitsOut]);
    el.append(h("div", { class: "two-col" }, [left, right]), sizeOut);

    function drawPalette() {
      palWrap.innerHTML = "";
      const sw = depth === 8 ? 14 : 26;
      palWrap.style.maxWidth = depth === 8 ? 16 * (sw + 3) + "px" : "420px";
      palette.forEach((c, i) => {
        const bt = h("button", { type: "button", title: "Colour " + i + " = " + i.toString(2).padStart(depth, "0"), "aria-label": "Colour " + i + ", code " + i.toString(2).padStart(depth, "0"), "aria-pressed": String(i === cur), style: "width:" + sw + "px;height:" + sw + "px;padding:0;border-radius:4px;background:" + c + ";border:" + (i === cur ? "3px solid var(--accent)" : "1px solid var(--border-2)") });
        bt.addEventListener("click", () => { cur = i; drawPalette(); });
        palWrap.appendChild(bt);
      });
      curLine.innerHTML = "Painting with colour " + cur + " → code <b>" + cur.toString(2).padStart(depth, "0") + "</b>";
    }
    function paint(r, c, cell) {
      if (px[r][c] === cur) return;
      px[r][c] = cur;
      cell.style.background = palette[cur];
      cell.setAttribute("aria-label", "Pixel row " + r + " column " + c + ", colour " + cur);
      info();
    }
    function drawGrid() {
      gridWrap.innerHTML = "";
      gridWrap.style.gridTemplateColumns = "repeat(" + W + ", 1fr)";
      gridWrap.style.maxWidth = W * 28 + "px";
      for (let r = 0; r < H; r++)
        for (let c = 0; c < W; c++) {
          const cell = h("button", { type: "button", "aria-label": "Pixel row " + r + " column " + c + ", colour " + px[r][c], style: "aspect-ratio:1;min-width:0;padding:0;border:0;border-radius:0;background:" + palette[px[r][c]] });
          cell.addEventListener("pointerdown", (ev) => { painting = true; ev.preventDefault(); paint(r, c, cell); });
          cell.addEventListener("pointerenter", () => { if (painting) paint(r, c, cell); });
          cell.addEventListener("click", (ev) => { if (ev.detail === 0) paint(r, c, cell); }); // keyboard activation
          gridWrap.appendChild(cell);
        }
    }
    const stopPaint = () => { painting = false; };
    window.addEventListener("pointerup", stopPaint);
    window.addEventListener("pointercancel", stopPaint);
    function info() {
      bitsOut.textContent = px.map((row, r) => "row " + String(r).padStart(2, " ") + ": " + row.map((v) => v.toString(2).padStart(depth, "0")).join(" ")).join("\n");
      const bits = W * H * depth, bytes = bits / 8, meta = metaChk.checked ? Math.max(0, parseInt(metaIn.value, 10) || 0) : 0;
      let html = "<p><b>File size</b> = width × height × colour depth = " + W + " × " + H + " × " + depth + " = <b>" + bits + " bits</b> = " + bits + " ÷ 8 = <b>" + bytes + " bytes</b>.</p>";
      if (meta) html += "<p>Plus metadata (" + meta + " bytes, e.g. width, height, colour depth): total = " + bytes + " + " + meta + " = <b>" + (bytes + meta) + " bytes</b>. For a tiny image the metadata can be bigger than the pixel data!</p>";
      html += "<p class=small>Resolution " + W + " × " + H + " = " + W * H + " pixels. Colour depth " + depth + " bit" + (depth === 1 ? "" : "s") + " → 2<sup>" + depth + "</sup> = " + 2 ** depth + " colours. Doubling the colour depth doubles the file size; doubling both width and height quadruples it.</p>";
      sizeOut.innerHTML = html;
    }
    function hexRgb(c) { return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); }
    function nearest(c, p) {
      const a = hexRgb(c);
      let best = 0, bd = Infinity;
      p.forEach((x, i) => { const q = hexRgb(x), d = (a[0] - q[0]) ** 2 + (a[1] - q[1]) ** 2 + (a[2] - q[2]) ** 2; if (d < bd) { bd = d; best = i; } });
      return best;
    }
    depthSel.addEventListener("change", () => {
      const nd = parseInt(depthSel.value, 10), np = pal(nd);
      px = px.map((row) => row.map((v) => nearest(palette[v], np)));
      cur = nearest(palette[cur], np);
      depth = nd; palette = np;
      drawPalette(); drawGrid(); info();
    });
    function resize() {
      const nw = parseInt(sizeW.value, 10), nh = parseInt(sizeH.value, 10);
      const bg = depth === 4 ? 15 : 0;
      px = Array.from({ length: nh }, (_, r) => Array.from({ length: nw }, (_, c) => (px[r] && px[r][c] != null ? px[r][c] : bg)));
      W = nw; H = nh;
      drawGrid(); info();
    }
    sizeW.addEventListener("change", resize);
    sizeH.addEventListener("change", resize);
    clearB.addEventListener("click", () => { const bg = depth === 4 ? 15 : 0; px = px.map((r) => r.map(() => bg)); drawGrid(); info(); });
    fillB.addEventListener("click", () => { px = px.map((r) => r.map(() => cur)); drawGrid(); info(); });
    metaChk.addEventListener("change", info);
    metaIn.addEventListener("input", info);
    drawPalette(); drawGrid(); info();
  },
});
