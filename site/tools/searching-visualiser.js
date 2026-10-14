/* Searching visualiser: linear and binary search, step-through with low/mid/high pointers and comparison counts. */
CS.registerTool({
  id: "searching-visualiser",
  title: "Searching visualiser",
  section: "3",
  topic: "3.4",
  icon: "🔍",
  desc: "Step through linear and binary search with low/mid/high pointers, comparison counts and the not-found path.",
  help: "Type a list (comma separated) and a target, choose the algorithm, then **▶ Step** or **⏩ Run**.\n\n- **Linear search** checks every item in turn from the start. It works on **unsorted** lists. Worst case n comparisons → **O(n)**.\n- **Binary search** needs a **sorted** list. Each step looks at the middle item `mid ← (low + high) DIV 2` and throws away the half that cannot contain the target, so the search space halves each time. Worst case about log₂ n + 1 comparisons → **O(log n)**.\n- Search for a value that is not there to see the *not found* path: binary search stops when `low > high`.\n\nIf you pick binary search on an unsorted list the tool warns you and offers to sort it first: binary search on unsorted data can give the wrong answer.",
  mount(el, params) {
    const h = CS.util.el;
    let algo = params.algo === "linear" ? "linear" : "binary";
    let list = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    let target = 23, frames = [], idx = 0, timer = null;

    const algoSel = h("select", { "aria-label": "Search algorithm" });
    [["linear", "Linear search"], ["binary", "Binary search"]].forEach(([v, t]) => algoSel.appendChild(h("option", { value: v, text: t })));
    algoSel.value = algo;
    const listIn = h("input", { type: "text", value: list.join(", "), "aria-label": "List, comma separated", style: "min-width:200px;flex:1" });
    const tIn = h("input", { type: "number", value: target, "aria-label": "Target value", style: "width:90px;min-width:70px" });
    const goBtn = h("button", { class: "btn sm primary", type: "button", text: "Set" });
    const sortedBtn = h("button", { class: "btn sm", type: "button", text: "Random sorted" });
    const unsortedBtn = h("button", { class: "btn sm", type: "button", text: "Random unsorted" });
    const sortBtn = h("button", { class: "btn sm", type: "button", text: "Sort list" });
    const row1 = h("div", { class: "controls" }, [h("label", { text: "Algorithm " }, algoSel), listIn, h("label", { text: "Target " }, tIn), goBtn]);
    const row1b = h("div", { class: "controls" }, [sortedBtn, unsortedBtn, sortBtn]);
    const stepBtn = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
    const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const speed = h("input", { type: "range", min: 1, max: 10, value: 5, "aria-label": "Speed", style: "width:110px" });
    const row2 = h("div", { class: "controls" }, [stepBtn, runBtn, resetBtn, h("label", { text: "Speed " }, speed)]);
    const err = h("div", { class: "err", style: "display:none" });
    const warn = h("div", { class: "explain", style: "display:none;color:var(--warn);font-weight:600" });
    const view = h("div", { style: "margin:6px 0 10px;overflow-x:auto" });
    const stats = h("div", { class: "stat-line" });
    const narr = h("div", { class: "output", style: "min-height:48px", "aria-live": "polite" });
    const log = h("div", { class: "steps-out", style: "max-height:150px;overflow-y:auto;font-size:0.82rem;margin-top:8px" });
    const legend = h("div", { class: "legend", html: '<span><i style="background:var(--accent)"></i>item being compared</span><span><i style="background:var(--ok)"></i>found</span><span><i style="background:var(--border)"></i>discarded</span>' });
    el.append(row1, row1b, row2, err, warn, view, stats, narr, log, legend);

    function parseList(s) {
      const nums = String(s).split(/[\s,;]+/).filter(Boolean).map(Number);
      return nums.length && nums.every(Number.isFinite) ? nums : null;
    }
    const isSorted = (a) => a.every((v, i) => i === 0 || a[i - 1] <= v);
    function showErr(m) { err.textContent = m; err.style.display = m ? "" : "none"; }

    function recLinear(a, t) {
      const F = []; let comps = 0;
      F.push({ comps, cur: -1, gone: [], msg: "Start at index 0 and check each item in turn until we find " + t + " or run out of items." });
      for (let i = 0; i < a.length; i++) {
        comps++;
        if (a[i] === t) {
          F.push({ comps, cur: i, found: i, gone: range(0, i - 1), msg: "Compare a[" + i + "]=" + a[i] + " with " + t + ": equal → FOUND at index " + i + "." });
          F.push({ comps, cur: -1, found: i, gone: range(0, i - 1), final: true, msg: "Found " + t + " at index " + i + " after " + comps + " comparison" + (comps === 1 ? "" : "s") + ". Linear search is O(n): worst case n = " + a.length + " comparisons." });
          return F;
        }
        F.push({ comps, cur: i, gone: range(0, i - 1), msg: "Compare a[" + i + "]=" + a[i] + " with " + t + ": not equal → move to index " + (i + 1) + "." });
      }
      F.push({ comps, cur: -1, gone: range(0, a.length - 1), final: true, notFound: true, msg: "Reached the end of the list: " + t + " is NOT FOUND (return −1). Every item was checked: " + comps + " comparisons — the worst case. Linear search is O(n)." });
      return F;
    }
    function range(lo, hi) { const r = []; for (let i = lo; i <= hi; i++) r.push(i); return r; }
    function recBinary(a, t) {
      const F = []; let comps = 0, lo = 0, hi = a.length - 1;
      const gone = () => range(0, a.length - 1).filter((i) => i < lo || i > hi);
      F.push({ comps, lo, hi, gone: [], msg: "Start: low ← 0, high ← " + hi + ". The target, if present, lies in a[low...high]." });
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        comps++;
        const size = hi - lo + 1;
        if (a[mid] === t) {
          F.push({ comps, lo, hi, mid, found: mid, gone: gone(), msg: "mid ← (" + lo + " + " + hi + ") DIV 2 = " + mid + ". Compare a[" + mid + "]=" + a[mid] + " with " + t + ": equal → FOUND at index " + mid + "." });
          F.push({ comps, lo, hi, mid, found: mid, gone: gone(), final: true, msg: "Found " + t + " at index " + mid + " after " + comps + " comparison" + (comps === 1 ? "" : "s") + ". Binary search is O(log n): a list of " + a.length + " needs at most " + (Math.floor(Math.log2(a.length)) + 1) + " comparisons." });
          return F;
        }
        if (a[mid] < t) {
          F.push({ comps, lo, hi, mid, gone: gone(), msg: "mid ← (" + lo + " + " + hi + ") DIV 2 = " + mid + ". a[" + mid + "]=" + a[mid] + " < " + t + " → target must be to the right: low ← mid + 1 = " + (mid + 1) + ". Search space " + size + " → " + (hi - mid) + " items." });
          lo = mid + 1;
        } else {
          F.push({ comps, lo, hi, mid, gone: gone(), msg: "mid ← (" + lo + " + " + hi + ") DIV 2 = " + mid + ". a[" + mid + "]=" + a[mid] + " > " + t + " → target must be to the left: high ← mid − 1 = " + (mid - 1) + ". Search space " + size + " → " + (mid - lo) + " items." });
          hi = mid - 1;
        }
        F.push({ comps, lo, hi, gone: gone(), msg: "Now low = " + lo + ", high = " + hi + (lo <= hi ? "." : " → low > high, the search space is empty.") });
      }
      F.push({ comps, lo, hi, gone: range(0, a.length - 1), final: true, notFound: true, msg: "low > high, so " + t + " is NOT FOUND (return −1) after " + comps + " comparisons. Each comparison halved the search space, so binary search is O(log n)." });
      return F;
    }
    function render() {
      const f = frames[idx]; if (!f) return;
      view.innerHTML = "";
      const cells = h("div", { class: "cells", style: "flex-wrap:nowrap" });
      const idxRow = h("div", { style: "display:flex;gap:4px" });
      const ptrRow = h("div", { style: "display:flex;gap:4px" });
      list.forEach((v, i) => {
        let cls = "cell";
        if (f.gone.includes(i)) cls += " dim";
        if (i === f.cur || i === f.mid) cls += " active";
        if (i === f.found) cls += " ok";
        cells.appendChild(h("div", { class: cls, text: v, style: "width:42px;min-width:42px;padding:0;flex:none" }));
        idxRow.appendChild(h("div", { class: "bit-label", text: "[" + i + "]", style: "width:42px;flex:none" }));
        const p = [];
        if (algo === "binary" && !f.final) { if (i === f.lo) p.push("low"); if (i === f.mid) p.push("mid"); if (i === f.hi) p.push("high"); }
        ptrRow.appendChild(h("div", { class: "bit-label", text: p.join("\n"), style: "width:42px;flex:none;white-space:pre;color:var(--accent);font-weight:700" }));
      });
      view.append(cells, idxRow, ptrRow);
      stats.textContent = "step " + idx + "/" + (frames.length - 1) + "   comparisons = " + f.comps + (algo === "binary" ? "   low = " + f.lo + "   high = " + f.hi + (f.mid != null ? "   mid = " + f.mid : "") : "");
      narr.textContent = f.msg;
      narr.className = "output" + (f.final ? (f.notFound ? " err" : " ok-text") : "");
      log.innerHTML = "";
      const ol = h("ol");
      for (let i = 1; i <= idx; i++) ol.appendChild(h("li", { text: frames[i].msg }));
      log.appendChild(ol); log.scrollTop = log.scrollHeight;
      stepBtn.disabled = idx >= frames.length - 1;
    }
    function build() {
      pause();
      warn.style.display = "none";
      if (algo === "binary" && !isSorted(list)) { warn.textContent = "⚠ This list is not sorted. Binary search only works on a sorted list — press “Sort list” first, or the result may be wrong."; warn.style.display = ""; }
      frames = algo === "binary" ? recBinary(list, target) : recLinear(list, target);
      idx = 0; render();
    }
    function step() { if (idx < frames.length - 1) { idx++; render(); } if (idx >= frames.length - 1) pause(); }
    function pause() { if (timer) clearInterval(timer); timer = null; runBtn.textContent = "⏩ Run"; }
    function apply(arr) {
      const t = Number(tIn.value);
      if (!arr) return showErr("Enter numbers separated by commas.");
      if (arr.length < 1 || arr.length > 20) return showErr("Use between 1 and 20 numbers.");
      if (tIn.value.trim() === "" || !Number.isFinite(t)) return showErr("Enter a number to search for.");
      showErr(""); list = arr; target = t; listIn.value = arr.join(", "); build();
    }
    const rnd = (n) => { const s = new Set(); while (s.size < n) s.add(Math.floor(Math.random() * 99) + 1); return [...s]; };
    goBtn.addEventListener("click", () => apply(parseList(listIn.value)));
    [listIn, tIn].forEach((x) => x.addEventListener("keydown", (e) => e.key === "Enter" && goBtn.click()));
    sortedBtn.addEventListener("click", () => apply(rnd(12).sort((a, b) => a - b)));
    unsortedBtn.addEventListener("click", () => apply(rnd(12)));
    sortBtn.addEventListener("click", () => { const a = parseList(listIn.value); apply(a && a.sort((x, y) => x - y)); });
    algoSel.addEventListener("change", () => { algo = algoSel.value; build(); });
    stepBtn.addEventListener("click", () => { pause(); step(); });
    runBtn.addEventListener("click", () => {
      if (timer) return pause();
      if (idx >= frames.length - 1) idx = 0;
      runBtn.textContent = "⏸ Pause"; timer = setInterval(step, 2000 / Number(speed.value));
    });
    resetBtn.addEventListener("click", () => { pause(); idx = 0; render(); });
    build();
  },
});
