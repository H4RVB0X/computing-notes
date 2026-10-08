/* Sorting visualiser: bubble (swap flag + shrinking boundary), insertion, merge (levels), quick (pivot). */
CS.registerTool({
  id: "sorting-visualiser",
  title: "Sorting visualiser",
  section: "3",
  topic: "3.5",
  icon: "🔀",
  desc: "Step through bubble, insertion, merge and quick sort on your own list, counting comparisons and swaps.",
  help: "Pick an algorithm and a list (type numbers separated by commas, or use a preset). **▶ Step** performs one comparison/swap at a time; **⏩ Run** animates at the chosen speed. The narration says exactly what the algorithm just did in the words a trace question wants.\n\nThings to notice:\n- **Bubble sort**: the largest unsorted value *bubbles* to the right end on each pass, so the unsorted boundary shrinks by one. Try the *Nearly sorted* preset: the **swap flag** stops the algorithm early when a pass makes no swaps (best case O(n)).\n- **Insertion sort** shifts larger items right to open a gap for the key.\n- **Merge sort** splits until lists are of length 1, then merges pairs: the number of levels is log₂ n, and each level costs O(n), giving O(n log n) *every* time.\n- **Quick sort** partitions around a pivot (here the last item of the section); the pivot ends in its final place. A sorted or reversed list gives the worst case O(n²).",
  mount(el, params) {
    const h = CS.util.el;
    const MAXN = 16;
    let algo = (params.algo || "bubble").toLowerCase();
    let list = parseList(params.list || "5, 3, 8, 1, 9, 2, 7, 4");
    let frames = [], idx = 0, timer = null;

    /* ---------- UI ---------- */
    const algoSel = h("select", { "aria-label": "Sorting algorithm" });
    [["bubble", "Bubble sort"], ["insertion", "Insertion sort"], ["merge", "Merge sort"], ["quick", "Quick sort"]].forEach(([v, t]) => algoSel.appendChild(h("option", { value: v, text: t })));
    if (!["bubble", "insertion", "merge", "quick"].includes(algo)) algo = "bubble";
    algoSel.value = algo;
    const listIn = h("input", { type: "text", value: list.join(", "), "aria-label": "List of numbers, comma separated", style: "min-width:200px;flex:1" });
    const setBtn = h("button", { class: "btn sm primary", type: "button", text: "Set list" });
    const randBtn = h("button", { class: "btn sm", type: "button", text: "Random" });
    const nearBtn = h("button", { class: "btn sm", type: "button", text: "Nearly sorted" });
    const revBtn = h("button", { class: "btn sm", type: "button", text: "Reversed" });
    const row1 = h("div", { class: "controls" }, [h("label", { text: "Algorithm " }, algoSel), listIn, setBtn, randBtn, nearBtn, revBtn]);
    const stepBtn = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
    const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const endBtn = h("button", { class: "btn sm", type: "button", text: "⏭ Finish" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const speed = h("input", { type: "range", min: 1, max: 10, value: 5, "aria-label": "Speed", style: "width:110px" });
    const row2 = h("div", { class: "controls" }, [stepBtn, runBtn, endBtn, resetBtn, h("label", { text: "Speed " }, speed)]);
    const err = h("div", { class: "err", style: "display:none" });
    const view = h("div", { style: "margin:6px 0 10px" });
    const stats = h("div", { class: "stat-line" });
    const narr = h("div", { class: "output", style: "min-height:52px", "aria-live": "polite" });
    const log = h("div", { class: "steps-out", style: "max-height:150px;overflow-y:auto;font-size:0.82rem;margin-top:8px" });
    const legend = h("div", { class: "legend", html: '<span><i style="background:var(--accent)"></i>comparing</span><span><i style="background:var(--warn)"></i>swapped / pivot / key</span><span><i style="background:var(--ok)"></i>in final place</span><span><i style="background:var(--border)"></i>outside current section</span>' });
    el.append(row1, row2, err, view, stats, narr, log, legend);

    /* ---------- helpers ---------- */
    function parseList(s) {
      const parts = String(s).split(/[\s,;]+/).filter(Boolean);
      const nums = parts.map(Number);
      if (!nums.length || nums.some((n) => !Number.isFinite(n))) return null;
      return nums;
    }
    function showErr(msg) { err.textContent = msg; err.style.display = msg ? "" : "none"; }
    function snapshot(a, extra) { return Object.assign({ a: a.slice(), cmp: [], hot: [], done: [], range: null, labels: {} }, extra); }

    /* ---------- recorders: each returns an array of frames ---------- */
    function recBubble(a) {
      const F = [], n = a.length; let comps = 0, swaps = 0, passes = 0; const done = [];
      const push = (x) => F.push(snapshot(a, Object.assign({ comps, swaps, passes, done: done.slice() }, x)));
      push({ msg: "Start. swapped flag and pass counter ready. Unsorted section = a[0..." + (n - 1) + "]." });
      let p;
      for (p = 0; p < n - 1; p++) {
        passes++;
        let swapped = false;
        push({ msg: "Pass " + passes + ": swapped ← FALSE. Compare neighbours in a[0..." + (n - 1 - p) + "].", range: [0, n - 1 - p] });
        for (let i = 0; i < n - 1 - p; i++) {
          comps++;
          const gt = a[i] > a[i + 1];
          push({ cmp: [i, i + 1], range: [0, n - 1 - p], msg: "Compare a[" + i + "]=" + a[i] + " with a[" + (i + 1) + "]=" + a[i + 1] + ": " + a[i] + (gt ? " > " + a[i + 1] + " → swap, swapped ← TRUE" : " ≤ " + a[i + 1] + " → no swap") });
          if (gt) { [a[i], a[i + 1]] = [a[i + 1], a[i]]; swaps++; swapped = true; push({ hot: [i, i + 1], range: [0, n - 1 - p], msg: "Swapped → a[" + i + "]=" + a[i] + ", a[" + (i + 1) + "]=" + a[i + 1] }); }
        }
        done.unshift(n - 1 - p);
        if (!swapped) { for (let k = n - 2 - p; k >= 0; k--) done.push(k); push({ msg: "End of pass " + passes + ": swapped = FALSE → no swaps were needed, so the list is already sorted. Stop early (this is what the swap flag is for).", range: null }); break; }
        push({ msg: "End of pass " + passes + ": swapped = TRUE. " + a[n - 1 - p] + " has bubbled to its final place at a[" + (n - 1 - p) + "]; the unsorted boundary shrinks to a[0..." + (n - 2 - p) + "].", range: [0, n - 2 - p] });
      }
      if (p === n - 1) { done.push(0); }
      push({ msg: "Finished: sorted in " + passes + " pass" + (passes === 1 ? "" : "es") + " with " + comps + " comparisons and " + swaps + " swaps. Bubble sort is O(n²) in the worst and average case; with the swap flag the best case (already sorted) is O(n).", final: true });
      return F;
    }
    function recInsertion(a) {
      const F = [], n = a.length; let comps = 0, swaps = 0; const done = [0];
      const push = (x) => F.push(snapshot(a, Object.assign({ comps, swaps, done: done.slice() }, x)));
      push({ msg: "Start. a[0] on its own counts as a sorted section of length 1." });
      for (let i = 1; i < n; i++) {
        const key = a[i]; let j = i - 1;
        push({ hot: [i], labels: { [i]: "key" }, msg: "Take key ← a[" + i + "] = " + key + ". Find where it belongs in the sorted section a[0..." + (i - 1) + "]." });
        while (j >= 0) {
          comps++;
          if (a[j] > key) {
            push({ cmp: [j], hot: [i], labels: { [j]: "j", [i]: "key" }, msg: "Compare a[" + j + "]=" + a[j] + " with key " + key + ": " + a[j] + " > " + key + " → shift " + a[j] + " one place right" });
            a[j + 1] = a[j]; swaps++; j--;
            push({ hot: [j + 1], msg: "Shifted: a[" + (j + 2) + "] ← " + a[j + 2] + ". Gap is now at a[" + (j + 1) + "]." });
          } else { push({ cmp: [j], labels: { [j]: "j" }, msg: "Compare a[" + j + "]=" + a[j] + " with key " + key + ": " + a[j] + " ≤ " + key + " → stop shifting" }); break; }
        }
        a[j + 1] = key; done.push(i);
        push({ hot: [j + 1], msg: "Insert key " + key + " at a[" + (j + 1) + "]. Sorted section is now a[0..." + i + "]." });
      }
      push({ msg: "Finished: " + comps + " comparisons and " + swaps + " shifts. Insertion sort is O(n²) worst/average; best case O(n) when the list is already sorted (one comparison per item).", final: true });
      return F;
    }
    function recMerge(a) {
      const F = [], nodes = []; let comps = 0, swaps = 0;
      const fmt = (x) => "[" + x.join(", ") + "]";
      const push = (msg, extra) => F.push(Object.assign({ a: a.slice(), comps, swaps, msg, tree: nodes.map((nd) => Object.assign({}, nd, { vals: nd.vals.slice() })) }, extra));
      push("Start. Merge sort splits the list in half repeatedly, then merges the halves back in order.");
      function ms(lo, hi, depth) {
        const node = { lo, hi, depth, vals: a.slice(lo, hi + 1), state: "split", hl: [] };
        nodes.push(node);
        if (lo === hi) { node.state = "merged"; push("A list of one item (" + fmt(node.vals) + ") is already sorted."); return node.vals; }
        const mid = Math.floor((lo + hi) / 2);
        push("Split " + fmt(node.vals) + " into " + fmt(a.slice(lo, mid + 1)) + " and " + fmt(a.slice(mid + 1, hi + 1)) + " (level " + (depth + 1) + ").");
        const L = ms(lo, mid, depth + 1), R = ms(mid + 1, hi, depth + 1);
        node.state = "merging"; node.vals = []; let i = 0, j = 0;
        nodes.filter((x) => x.depth === depth + 1 && x.lo >= lo && x.hi <= hi).forEach((x) => (x.state = "src"));
        push("Merge " + fmt(L) + " with " + fmt(R) + ": repeatedly compare the front items and copy the smaller.");
        while (i < L.length && j < R.length) {
          comps++;
          const takeL = L[i] <= R[j];
          node.vals.push(takeL ? L[i] : R[j]); swaps++;
          push("Compare " + L[i] + " (left) with " + R[j] + " (right): " + (takeL ? L[i] + " ≤ " + R[j] + " → copy " + L[i] : R[j] + " < " + L[i] + " → copy " + R[j]));
          if (takeL) i++; else j++;
        }
        if (i < L.length) { node.vals.push(...L.slice(i)); swaps += L.length - i; push("Right list is empty → copy the rest of the left list " + fmt(L.slice(i)) + " (no comparisons needed)."); }
        if (j < R.length) { node.vals.push(...R.slice(j)); swaps += R.length - j; push("Left list is empty → copy the rest of the right list " + fmt(R.slice(j)) + " (no comparisons needed)."); }
        node.state = "merged";
        for (let k = 0; k < node.vals.length; k++) a[lo + k] = node.vals[k];
        push("Merged → " + fmt(node.vals) + " (sorted section a[" + lo + "..." + hi + "]).");
        return node.vals;
      }
      ms(0, a.length - 1, 0);
      const levels = Math.max(...nodes.map((n) => n.depth)) + 1;
      push("Finished: " + comps + " comparisons, " + swaps + " copies, " + levels + " levels (≈ log₂ n + 1). Each level does O(n) work, so merge sort is O(n log n) in every case; it needs O(n) extra space.", { final: true });
      return F;
    }
    function recQuick(a) {
      const F = [], n = a.length; let comps = 0, swaps = 0; const done = [];
      const push = (x) => F.push(snapshot(a, Object.assign({ comps, swaps, done: done.slice() }, x)));
      push({ msg: "Start. Quick sort picks a pivot, partitions the section so smaller items are left of it, then sorts each side." });
      function qs(lo, hi) {
        if (lo > hi) return;
        if (lo === hi) { done.push(lo); push({ range: [lo, hi], msg: "Section a[" + lo + "..." + hi + "] has one item (" + a[lo] + ") → already in place." }); return; }
        const pv = a[hi]; let i = lo;
        push({ range: [lo, hi], hot: [hi], labels: { [hi]: "pivot" }, msg: "Partition a[" + lo + "..." + hi + "]: pivot ← a[" + hi + "] = " + pv + ". i ← " + lo + " marks where the next item smaller than the pivot goes." });
        for (let j = lo; j < hi; j++) {
          comps++;
          const lt = a[j] < pv;
          push({ range: [lo, hi], cmp: [j], hot: [hi], labels: { [j]: "j", [i]: "i", [hi]: "pivot" }, msg: "Compare a[" + j + "]=" + a[j] + " with pivot " + pv + ": " + a[j] + (lt ? " < " + pv + " → belongs on the left" + (i !== j ? ", swap a[" + i + "] and a[" + j + "]" : " (already there)") + ", i ← " + (i + 1) : " ≥ " + pv + " → stays on the right") });
          if (lt) { if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; swaps++; push({ range: [lo, hi], hot: [i, j, hi], labels: { [hi]: "pivot" }, msg: "Swapped → a[" + i + "]=" + a[i] + ", a[" + j + "]=" + a[j] }); } i++; }
        }
        if (i !== hi) { [a[i], a[hi]] = [a[hi], a[i]]; swaps++; }
        done.push(i);
        push({ range: [lo, hi], hot: [i], msg: "Swap pivot into a[" + i + "]: " + pv + " is now in its final place (everything left of it is smaller, everything right is ≥)." + (i !== hi ? "" : " (It was already there.)") });
        qs(lo, i - 1); qs(i + 1, hi);
      }
      qs(0, n - 1);
      push({ msg: "Finished: " + comps + " comparisons and " + swaps + " swaps. Quick sort is O(n log n) on average but O(n²) in the worst case (pivot always the largest/smallest, e.g. an already sorted list with this pivot choice).", final: true });
      return F;
    }

    /* ---------- rendering ---------- */
    function cellsRow(f) {
      const a = f.a, n = a.length, small = n > 10;
      const wrap = h("div");
      const cells = h("div", { class: "cells", style: "flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px" });
      const labs = h("div", { style: "display:flex;gap:4px;margin-top:2px" });
      const cw = small ? 30 : 40;
      for (let i = 0; i < n; i++) {
        let cls = "cell";
        if (f.range && (i < f.range[0] || i > f.range[1])) cls += " dim";
        if (f.done.includes(i)) cls += " ok";
        if (f.hot.includes(i)) cls += " hl";
        if (f.cmp.includes(i)) cls += " active";
        cells.appendChild(h("div", { class: cls, text: a[i], style: "min-width:" + cw + "px;width:" + cw + "px;padding:0;flex:none;font-size:" + (small ? "0.78rem" : "0.95rem") }));
        labs.appendChild(h("div", { class: "bit-label", text: f.labels[i] || (f.cmp.includes(i) ? "▲" : ""), style: "width:" + cw + "px;flex:none;color:var(--accent)" }));
      }
      wrap.append(cells, labs);
      return wrap;
    }
    function mergeView(f) {
      const n = f.a.length, grid = h("div", { style: "display:grid;grid-template-columns:repeat(" + n + ",1fr);gap:6px 3px;align-items:stretch" });
      f.tree.forEach((nd) => {
        const colour = nd.state === "merged" ? "var(--ok)" : nd.state === "merging" ? "var(--warn)" : nd.state === "src" ? "var(--border-2)" : "var(--accent)";
        const box = h("div", { style: "grid-row:" + (nd.depth + 1) + ";grid-column:" + (nd.lo + 1) + "/" + (nd.hi + 2) + ";display:flex;gap:2px;border:2px solid " + colour + ";border-radius:8px;padding:3px;min-height:34px;opacity:" + (nd.state === "src" ? 0.55 : 1) });
        const vals = nd.vals.length ? nd.vals : [];
        const size = nd.hi - nd.lo + 1;
        for (let k = 0; k < size; k++) box.appendChild(h("div", { class: "cell" + (k < vals.length ? (nd.state === "merged" ? " ok" : "") : " dim"), text: k < vals.length ? vals[k] : "", style: "min-width:0;flex:1;height:30px;padding:0;font-size:0.8rem;border-width:1px" }));
        grid.appendChild(box);
      });
      return grid;
    }
    function render() {
      const f = frames[idx];
      if (!f) return;
      view.innerHTML = "";
      view.appendChild(algo === "merge" ? mergeView(f) : cellsRow(f));
      const second = algo === "insertion" ? "shifts" : algo === "merge" ? "copies" : "swaps";
      stats.textContent = "step " + idx + "/" + (frames.length - 1) + "   comparisons = " + f.comps + "   " + second + " = " + f.swaps + (algo === "bubble" ? "   passes = " + f.passes : "");
      narr.textContent = f.msg;
      narr.className = "output" + (f.final ? " ok-text" : "");
      log.innerHTML = "";
      const ol = h("ol", { start: 1 });
      for (let i = 1; i <= idx; i++) ol.appendChild(h("li", { text: frames[i].msg, style: i === idx ? "font-weight:700" : "" }));
      log.appendChild(ol);
      log.scrollTop = log.scrollHeight;
      stepBtn.disabled = endBtn.disabled = idx >= frames.length - 1;
      runBtn.disabled = idx >= frames.length - 1 && !timer;
    }
    function build() {
      pause();
      const rec = { bubble: recBubble, insertion: recInsertion, merge: recMerge, quick: recQuick }[algo];
      frames = rec(list.slice());
      idx = 0;
      render();
    }
    function step() { if (idx < frames.length - 1) { idx++; render(); } if (idx >= frames.length - 1) pause(); }
    function pause() { if (timer) { clearInterval(timer); timer = null; } runBtn.textContent = "⏩ Run"; }
    function run() {
      if (timer) { pause(); return; }
      if (idx >= frames.length - 1) idx = 0;
      runBtn.textContent = "⏸ Pause";
      timer = setInterval(step, 1600 / Number(speed.value));
    }
    function applyList(arr, text) {
      if (!arr) { showErr("Enter numbers separated by commas, e.g. 5, 3, 8, 1"); return; }
      if (arr.length < 2) { showErr("Enter at least two numbers."); return; }
      if (arr.length > MAXN) { showErr("Up to " + MAXN + " numbers please (so the cells stay readable)."); return; }
      showErr("");
      list = arr;
      listIn.value = text != null ? text : arr.join(", ");
      build();
    }
    const rnd = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    setBtn.addEventListener("click", () => applyList(parseList(listIn.value), listIn.value));
    listIn.addEventListener("keydown", (e) => e.key === "Enter" && setBtn.click());
    randBtn.addEventListener("click", () => applyList(rnd(8)));
    nearBtn.addEventListener("click", () => { const a = rnd(8).sort((x, y) => x - y); [a[3], a[4]] = [a[4], a[3]]; applyList(a); });
    revBtn.addEventListener("click", () => applyList(rnd(8).sort((x, y) => y - x)));
    algoSel.addEventListener("change", () => { algo = algoSel.value; build(); });
    stepBtn.addEventListener("click", () => { pause(); step(); });
    runBtn.addEventListener("click", run);
    endBtn.addEventListener("click", () => { pause(); idx = frames.length - 1; render(); });
    resetBtn.addEventListener("click", () => { pause(); idx = 0; render(); });
    speed.addEventListener("input", () => { if (timer) { clearInterval(timer); timer = setInterval(step, 1600 / Number(speed.value)); } });
    if (!list) list = [5, 3, 8, 1, 9, 2, 7, 4];
    build();
  },
});
