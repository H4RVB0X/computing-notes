/* compression-tool: run length encoding, dictionary-based compression, Huffman coding (AQA 4.5.6.9). */
CS.registerTool({
  id: "compression-tool",
  title: "Compression lab",
  section: "5",
  topic: "5.8",
  icon: "🗜️",
  desc: "Run length encoding, dictionary-based compression and a step-by-step Huffman tree builder, each with the bits saved.",
  help: "Three **lossless** methods — the original can be rebuilt exactly.\n\n- **RLE** replaces a *run* of identical values with a (count, value) pair. Great for images with big blocks of one colour; it can make data with few repeats *bigger*. Click the pixel row to draw runs.\n- **Dictionary**: each different word is stored once in a dictionary, and the text becomes a list of dictionary indices (the token stream). It only pays off when words repeat.\n- **Huffman**: count the frequency of each character; repeatedly take the **two nodes with the lowest frequencies**, join them under a new node whose frequency is their sum, and put it back — until one tree remains. Label left branches 0 and right 1. Frequent characters end up near the root with **short codes**. Use **▶ Step** to build the tree one merge at a time.\n\nTie-breaks (equal frequencies) can be done either way, so your tree may look different from a mark scheme's but the total number of bits will be the same.",
  mount(el, params) {
    const h = CS.util.el, esc = CS.util.esc;
    const b = (s) => "<b>" + s + "</b>";
    const show = (c) => (c === " " ? "␣" : c === "\n" ? "↵" : c);
    function table(head, rows) {
      return '<div class="table-wrap"><table style="width:auto"><thead><tr>' + head.map((x) => "<th style='text-transform:none'>" + x + "</th>").join("") + "</tr></thead><tbody>" + rows.map((r) => "<tr>" + r.map((c) => "<td class='mono'>" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
    }
    const tabs = h("div", { class: "tabs" }), bar = h("div", { class: "tab-bar", role: "tablist" });
    tabs.appendChild(bar);
    const P = {};
    [["rle", "Run length encoding"], ["dict", "Dictionary"], ["huff", "Huffman"]].forEach(([k, t], i) => {
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
    const pct = (a, c) => +((100 * (a - c)) / a).toFixed(1);

    /* ---------- RLE ---------- */
    const rIn = h("input", { type: "text", value: "WWWWWWBBBWWWWWWWWBBWWWWW", "aria-label": "Data to run-length encode", style: "width:100%;max-width:420px;font-family:var(--font-mono)" });
    const row = h("div", { style: "display:flex;flex-wrap:wrap;gap:2px;margin:6px 0", role: "group", "aria-label": "Pixel row (click to toggle black/white)" });
    const rOut = h("div", { class: "steps-out" });
    P.rle.append(h("div", { class: "controls" }, [h("label", { style: "flex:1" }, ["Data", rIn])]), h("div", { class: "small muted", text: "…or click this pixel row (W = white, B = black):" }), row, rOut);
    function rle() {
      const s = rIn.value;
      row.innerHTML = "";
      if (/^[WB]{1,40}$/.test(s)) s.split("").forEach((c, i) => {
        const bt = h("button", { type: "button", "aria-label": "Pixel " + i + " " + (c === "W" ? "white" : "black"), style: "width:16px;height:22px;padding:0;border:1px solid var(--border-2);border-radius:2px;background:" + (c === "W" ? "#fff" : "#111") });
        bt.addEventListener("click", () => { rIn.value = s.slice(0, i) + (c === "W" ? "B" : "W") + s.slice(i + 1); rle(); });
        row.appendChild(bt);
      });
      if (!s.length) return (rOut.innerHTML = '<p class="err">Type some data.</p>');
      const runs = [];
      for (let i = 0; i < s.length; ) {
        let j = i;
        while (j < s.length && s[j] === s[i] && j - i < 255) j++;
        runs.push([j - i, s[i]]);
        i = j;
      }
      const orig = s.length, comp = runs.length * 2;
      rOut.innerHTML = "<p>Scan left to right, counting how many times each value repeats in a row:</p>" + table(["Run", "Value", "Count"], runs.map((r, i) => [i + 1, esc(show(r[1])), r[0]])) +
        "<p>Encoded as (count, value) pairs: <span class=mono>" + b(runs.map((r) => r[0] + esc(show(r[1]))).join(" ")) + "</span></p>" +
        "<p>Original: " + orig + " values × 1 byte = " + b(orig + " bytes") + ". RLE: " + runs.length + " pairs × 2 bytes (count + value) = " + b(comp + " bytes") + ".</p>" +
        (comp < orig ? '<p class="ok-text">Compression ratio ' + orig + " : " + comp + " ≈ " + (orig / comp).toFixed(2) + " : 1 → saves " + pct(orig, comp) + "%.</p>" : '<p class="bad-text" style="color:var(--bad);font-weight:600">RLE made it ' + (comp === orig ? "no smaller" : "bigger (" + comp + " > " + orig + ")") + ": there are too few long runs. RLE suits data with long runs of repeated values.</p>");
    }
    rIn.addEventListener("input", rle);

    /* ---------- Dictionary ---------- */
    const dIn = h("textarea", { "aria-label": "Text to compress with a dictionary", style: "min-height:70px;font-family:var(--font-mono)" });
    dIn.value = "the cat sat on the mat and the dog sat on the cat";
    const dOut = h("div", { class: "steps-out" });
    P.dict.append(h("label", { class: "small", text: "Text (words are separated by spaces):" }), dIn, dOut);
    function dict() {
      const words = dIn.value.trim().split(/\s+/).filter(Boolean);
      if (!words.length) return (dOut.innerHTML = '<p class="err">Type some text.</p>');
      const index = new Map(), count = new Map();
      words.forEach((w) => { if (!index.has(w)) index.set(w, index.size); count.set(w, (count.get(w) || 0) + 1); });
      const tokens = words.map((w) => index.get(w));
      const N = index.size, bitsPer = Math.max(1, Math.ceil(Math.log2(N)));
      const origBits = words.join(" ").length * 8;
      const dictBits = Array.from(index.keys()).reduce((s, w) => s + (w.length + 1) * 8, 0);
      const tokBits = tokens.length * bitsPer;
      const comp = dictBits + tokBits;
      dOut.innerHTML = "<p>" + b("1. Build the dictionary") + ": each different word gets the next index the first time it appears.</p>" +
        table(["Index", "Binary", "Word", "Uses"], Array.from(index.keys()).map((w) => [index.get(w), index.get(w).toString(2).padStart(bitsPer, "0"), esc(w), count.get(w)])) +
        "<p>" + b("2. Token stream") + " (the text written as indices): <span class=mono>" + b(tokens.join(" ")) + "</span></p>" +
        "<p>" + b("3. Size") + ": original = " + words.join(" ").length + " characters × 8 bits = " + b(origBits + " bits") + ". " +
        N + " dictionary entries need ⌈log₂ " + N + "⌉ = " + bitsPer + " bits per index. Compressed = dictionary (" + dictBits + " bits: each word's characters + 1 separator, 8 bits each) + tokens (" + tokens.length + " × " + bitsPer + " = " + tokBits + " bits) = " + b(comp + " bits") + ".</p>" +
        (comp < origBits ? '<p class="ok-text">Saves ' + (origBits - comp) + " bits (" + pct(origBits, comp) + "%).</p>" : '<p class="bad-text" style="color:var(--bad);font-weight:600">No saving: not enough repeated words to pay for storing the dictionary. Longer texts with lots of repetition compress well.</p>') +
        "<p class=small>Decompression looks up each index in the dictionary and puts spaces between the words. Real dictionary methods (e.g. LZ77/LZW used in ZIP, PNG and GIF) build the dictionary from repeated <i>sequences of characters</i> as they go.</p>";
    }
    dIn.addEventListener("input", dict);

    /* ---------- Huffman ---------- */
    const hIn = h("input", { type: "text", value: params.text || "BEEKEEPER BEES", "aria-label": "Text for Huffman coding", style: "width:100%;max-width:340px;font-family:var(--font-mono)" });
    const hReset = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const hStep = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
    const hRun = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const hSpeed = h("input", { type: "range", min: "1", max: "5", value: "3", "aria-label": "Animation speed" });
    const hStat = h("div", { class: "stat-line" });
    const svgWrap = h("div", { style: "overflow-x:auto;border:1px solid var(--border);border-radius:10px;background:var(--bg-2);padding:6px" });
    const hLog = h("div", { class: "output", style: "min-height:60px;max-height:180px;overflow:auto" });
    const hOut = h("div", { class: "steps-out", style: "margin-top:10px" });
    P.huff.append(h("div", { class: "controls" }, [h("label", { style: "flex:1" }, ["Text", hIn])]), h("div", { class: "controls" }, [hReset, hStep, hRun, h("label", {}, ["Speed", hSpeed])]), hStat, svgWrap, hLog, hOut);
    let frames = [], fi = 0, timer = null, text = "";
    function buildHuff() {
      text = hIn.value;
      frames = [];
      if (!text.length) return;
      const freq = new Map();
      for (const c of text) freq.set(c, (freq.get(c) || 0) + 1);
      let order = 0;
      let q = Array.from(freq.entries()).sort((a, c) => a[1] - c[1] || (a[0] < c[0] ? -1 : 1)).map(([c, f]) => ({ ch: c, f, ord: order++ }));
      const sortQ = () => q.sort((a, c) => a.f - c.f || a.ord - c.ord);
      sortQ();
      const logs = ["Count the frequency of each character and list them in order, lowest first: " + q.map((n) => "'" + show(n.ch) + "' " + n.f).join(", ")];
      frames.push({ q: q.slice(), log: logs.slice(), merges: 0 });
      let merges = 0;
      while (q.length > 1) {
        const l = q.shift(), r = q.shift();
        const node = { f: l.f + r.f, left: l, right: r, ord: order++ };
        q.push(node);
        sortQ();
        merges++;
        logs.push("Merge " + merges + ": take the two lowest, " + label(l) + " and " + label(r) + "; join them under a new node of frequency " + l.f + " + " + r.f + " = " + node.f + " and put it back in the list.");
        frames.push({ q: q.slice(), log: logs.slice(), merges });
      }
      logs.push("Only one node is left: it is the root. Label every left branch 0 and every right branch 1; a character's code is the path from the root to it.");
      frames.push({ q: q.slice(), log: logs.slice(), merges, done: true });
      fi = 0;
    }
    function label(n) { return n.ch != null ? "'" + show(n.ch) + "' (" + n.f + ")" : "node (" + n.f + ")"; }
    function codes(root) {
      const out = {};
      (function walk(n, p) { if (n.ch != null) out[n.ch] = p || "0"; else { walk(n.left, p + "0"); walk(n.right, p + "1"); } })(root, "");
      return out;
    }
    function drawForest(q) {
      const pos = new Map();
      let leafX = 0, maxD = 0;
      const lay = (n, d) => {
        maxD = Math.max(maxD, d);
        if (n.ch != null) { pos.set(n, { x: leafX++ * 46 + 26, y: d }); return; }
        lay(n.left, d + 1); lay(n.right, d + 1);
        pos.set(n, { x: (pos.get(n.left).x + pos.get(n.right).x) / 2, y: d });
      };
      q.forEach((root) => { lay(root, 0); leafX += 0.4; });
      const Wd = Math.max(200, leafX * 46 + 10), Ht = maxD * 62 + 56, Y = (d) => 24 + d * 62;
      let s = '<svg viewBox="0 0 ' + Wd + " " + Ht + '" style="width:' + Wd + 'px;max-width:none;display:block;color:var(--text)" role="img" aria-label="Huffman forest" font-family="inherit">';
      const edges = (n) => {
        if (n.ch != null) return;
        [[n.left, "0"], [n.right, "1"]].forEach(([c, lab]) => {
          const a = pos.get(n), z = pos.get(c);
          s += '<line x1="' + a.x + '" y1="' + Y(a.y) + '" x2="' + z.x + '" y2="' + Y(z.y) + '" stroke="currentColor" stroke-opacity="0.6"/>';
          s += '<text x="' + ((a.x + z.x) / 2 + (lab === "0" ? -8 : 8)) + '" y="' + ((Y(a.y) + Y(z.y)) / 2) + '" font-size="12" fill="var(--accent)" text-anchor="middle" font-weight="700">' + lab + "</text>";
          edges(c);
        });
      };
      q.forEach(edges);
      pos.forEach((p, n) => {
        const leaf = n.ch != null;
        s += leaf
          ? '<rect x="' + (p.x - 19) + '" y="' + (Y(p.y) - 16) + '" width="38" height="32" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="' + p.x + '" y="' + (Y(p.y) - 1) + '" font-size="13" text-anchor="middle" fill="currentColor" font-weight="700">' + esc(show(n.ch)) + '</text><text x="' + p.x + '" y="' + (Y(p.y) + 12) + '" font-size="10" text-anchor="middle" fill="currentColor">' + n.f + "</text>"
          : '<circle cx="' + p.x + '" cy="' + Y(p.y) + '" r="15" fill="#f5b74a" fill-opacity="0.3" stroke="currentColor"/><text x="' + p.x + '" y="' + (Y(p.y) + 4) + '" font-size="12" text-anchor="middle" fill="currentColor" font-weight="700">' + n.f + "</text>";
      });
      return s + "</svg>";
    }
    function drawHuff() {
      if (!frames.length) { svgWrap.innerHTML = ""; hLog.textContent = ""; hOut.innerHTML = '<p class="err">Type some text.</p>'; hStat.textContent = ""; return; }
      const fr = frames[fi];
      svgWrap.innerHTML = drawForest(fr.q);
      hLog.textContent = fr.log.join("\n");
      hLog.scrollTop = hLog.scrollHeight;
      const total = frames[frames.length - 1].merges;
      hStat.textContent = "Merges: " + fr.merges + " / " + total + " · nodes in the list: " + fr.q.length;
      hStep.disabled = fi >= frames.length - 1;
      if (!fr.done) { hOut.innerHTML = "<p class=muted>Keep stepping — the codes appear when the tree is complete.</p>"; return; }
      const cd = codes(fr.q[0]), freq = {};
      for (const c of text) freq[c] = (freq[c] || 0) + 1;
      const chars = Object.keys(freq).sort((a, c) => freq[c] - freq[a] || (a < c ? -1 : 1));
      const hb = chars.reduce((s, c) => s + freq[c] * cd[c].length, 0), ab = text.length * 8;
      hOut.innerHTML = table(["Char", "Frequency", "Code", "Bits used"], chars.map((c) => [esc(show(c)), freq[c], b(cd[c]), freq[c] + " × " + cd[c].length + " = " + freq[c] * cd[c].length])) +
        "<p>Huffman total = " + b(hb + " bits") + ". 8-bit ASCII = " + text.length + " × 8 = " + b(ab + " bits") + ". Saving = " + b(ab - hb + " bits") + " (" + pct(ab, hb) + "%).</p>" +
        "<p class=small>No code is the prefix of another (every character is a leaf), so the bit stream can be decoded unambiguously. Encoded: <span class=mono>" + esc(Array.from(text).slice(0, 40).map((c) => cd[c]).join(" ")) + (text.length > 40 ? " …" : "") + "</span>. The tree (or code table) must be stored with the data so it can be decoded.</p>";
    }
    function stopH() { if (timer) clearInterval(timer); timer = null; hRun.textContent = "⏩ Run"; }
    function stepH() { if (fi < frames.length - 1) { fi++; drawHuff(); } if (fi >= frames.length - 1) stopH(); }
    hStep.addEventListener("click", () => { stopH(); stepH(); });
    hReset.addEventListener("click", () => { stopH(); fi = 0; drawHuff(); });
    hRun.addEventListener("click", () => {
      if (timer) return stopH();
      if (fi >= frames.length - 1) fi = 0;
      hRun.textContent = "⏸ Pause";
      timer = setInterval(() => { if (!el.isConnected) return stopH(); stepH(); }, 1600 / +hSpeed.value);
    });
    hIn.addEventListener("input", () => {
      stopH();
      if (hIn.value.length > 60) hIn.value = hIn.value.slice(0, 60);
      buildHuff(); drawHuff();
    });
    rle(); dict(); buildHuff(); drawHuff();
  },
});
