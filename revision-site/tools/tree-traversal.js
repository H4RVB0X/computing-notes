/* Binary search tree: insert, delete, search step-through, pre/in/post-order traversals animated. */
CS.registerTool({
  id: "tree-traversal",
  title: "Binary search tree & traversals",
  section: "3",
  topic: "3.2",
  icon: "🌳",
  desc: "Build a binary search tree, search and delete, and animate pre-order, in-order and post-order traversals.",
  help: "Type one or more numbers and press **Insert**: each value goes **left if smaller, right if larger**, starting at the root. **Search** steps through the comparisons along the path; **Delete** removes a node (leaf: just remove; one child: the child takes its place; two children: replace it with its **in-order successor**, the smallest value in the right subtree).\n\n**Traversals** — imagine running your finger round the outside of the tree, starting left of the root:\n- **Pre-order**: output a node when your finger passes its **left** side (dot on the left). Used to copy a tree / produce prefix notation.\n- **In-order**: output when your finger passes **under** the node (dot underneath). On a BST this outputs the values **in sorted order**.\n- **Post-order**: output when your finger passes the **right** side (dot on the right). Used to delete a tree / produce RPN from an expression tree.\n\nThe tree is **balanced** here if, at every node, the heights of the left and right subtrees differ by at most 1. Insert sorted data (try the *Sorted* preset) to see a BST degrade into a list, making search O(n) instead of O(log n).",
  mount(el, params) {
    const h = CS.util.el, NS = "http://www.w3.org/2000/svg";
    let root = null, frames = [], idx = 0, timer = null, mode = "idle", order = "in", output = [];
    const input = h("input", { type: "text", placeholder: "e.g. 45 or 12, 7, 30", "aria-label": "Values", style: "width:160px" });
    const insBtn = h("button", { class: "btn sm primary", type: "button", text: "Insert" });
    const findBtn = h("button", { class: "btn sm", type: "button", text: "Search" });
    const delBtn = h("button", { class: "btn sm", type: "button", text: "Delete" });
    const presetSel = h("select", { "aria-label": "Preset tree" });
    [["", "Preset…"], ["50,30,70,20,40,60,80,35", "Exam-style BST"], ["M,F,T,C,H,P,W", "Letters"], ["10,20,30,40,50", "Sorted input (unbalanced)"], ["", "Empty tree"]].forEach(([v, t], i) => presetSel.appendChild(h("option", { value: i ? v || "clear" : "", text: t })));
    const row1 = h("div", { class: "controls" }, [input, insBtn, findBtn, delBtn, presetSel]);
    const preBtn = h("button", { class: "btn sm", type: "button", text: "Pre-order" });
    const inBtn = h("button", { class: "btn sm", type: "button", text: "In-order" });
    const postBtn = h("button", { class: "btn sm", type: "button", text: "Post-order" });
    const stepBtn = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
    const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const row2 = h("div", { class: "controls" }, [h("span", { class: "muted", text: "Traverse:", style: "font-size:0.85rem" }), preBtn, inBtn, postBtn, stepBtn, runBtn, resetBtn]);
    const err = h("div", { class: "err", style: "display:none" });
    const svgWrap = h("div", { style: "overflow-x:auto;border:1px solid var(--border);border-radius:10px;background:var(--bg-2)" });
    const stats = h("div", { class: "stat-line" });
    const outLine = h("div", { class: "output", style: "min-height:24px" });
    const narr = h("div", { class: "explain", "aria-live": "polite" });
    el.append(row1, row2, err, svgWrap, stats, outLine, narr);

    const showErr = (m) => { err.textContent = m; err.style.display = m ? "" : "none"; };
    let numeric = true;
    const cmp = (a, b) => (numeric ? a - b : a < b ? -1 : a > b ? 1 : 0);
    function parseVals(s) {
      const parts = String(s).split(/[\s,;]+/).filter(Boolean);
      if (!parts.length) return null;
      const allNum = parts.every((p) => Number.isFinite(Number(p)));
      if (root && allNum !== numeric) return "mix";
      if (!root) numeric = allNum;
      return parts.map((p) => (allNum ? Number(p) : p.toUpperCase()));
    }
    function insert(v) {
      if (!root) { root = { v, l: null, r: null }; return "Tree empty → " + v + " becomes the root."; }
      let n = root; const path = [];
      for (;;) {
        if (cmp(v, n.v) === 0) return v + " is already in the tree (duplicates are not inserted here).";
        const go = cmp(v, n.v) < 0 ? "l" : "r";
        path.push(v + (go === "l" ? " < " : " > ") + n.v + " → " + (go === "l" ? "left" : "right"));
        if (!n[go]) { n[go] = { v, l: null, r: null }; return "Insert " + v + ": " + path.join("; ") + " → empty, place it here."; }
        n = n[go];
      }
    }
    function remove(v) {
      let parent = null, n = root;
      while (n && cmp(v, n.v) !== 0) { parent = n; n = cmp(v, n.v) < 0 ? n.l : n.r; }
      if (!n) return [false, v + " is not in the tree, so nothing is deleted."];
      let msg;
      const relink = (child) => { if (!parent) root = child; else if (parent.l === n) parent.l = child; else parent.r = child; };
      if (!n.l && !n.r) { relink(null); msg = v + " is a leaf → simply remove it (its parent's pointer becomes null)."; }
      else if (!n.l || !n.r) { const c = n.l || n.r; relink(c); msg = v + " has one child (" + c.v + ") → the child takes its place."; }
      else {
        let sp = n, s = n.r; while (s.l) { sp = s; s = s.l; }
        msg = v + " has two children → replace it with its in-order successor " + s.v + " (smallest value in the right subtree), then remove " + s.v + " from its old position.";
        n.v = s.v; if (sp === n) sp.r = s.r; else sp.l = s.r;
      }
      return [true, msg];
    }
    const height = (n) => (n ? 1 + Math.max(height(n.l), height(n.r)) : 0); // levels
    const balanced = (n) => !n || (Math.abs(height(n.l) - height(n.r)) <= 1 && balanced(n.l) && balanced(n.r));
    const count = (n) => (n ? 1 + count(n.l) + count(n.r) : 0);

    function layout() {
      const pos = new Map(); let i = 0;
      (function walk(n, d) { if (!n) return; walk(n.l, d + 1); pos.set(n, { x: 30 + i++ * 48, y: 30 + d * 62, d }); walk(n.r, d + 1); })(root, 0);
      return pos;
    }
    function svgEl(tag, attrs, text) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }
    function draw(f) {
      f = f || {};
      svgWrap.innerHTML = "";
      const pos = layout(), n = count(root);
      const W = Math.max(300, 60 + Math.max(0, n - 1) * 48), H = 60 + Math.max(0, height(root) - 1) * 62 + 20;
      const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, width: W, height: H, role: "img", "aria-label": "Binary search tree diagram", style: "display:block;max-width:none;color:var(--text);font-family:inherit" });
      if (!root) svg.appendChild(svgEl("text", { x: W / 2, y: H / 2 + 5, "text-anchor": "middle", fill: "currentColor", "font-size": 14 }, "Empty tree — insert some values"));
      pos.forEach((p, nd) => ["l", "r"].forEach((s) => { if (nd[s]) { const q = pos.get(nd[s]); svg.appendChild(svgEl("line", { x1: p.x, y1: p.y, x2: q.x, y2: q.y, stroke: f.path && f.path.includes(nd) && f.path.includes(nd[s]) ? "var(--accent)" : "currentColor", "stroke-width": f.path && f.path.includes(nd[s]) && f.path.includes(nd) ? 3 : 1.5, "stroke-opacity": 0.8 })); } }));
      pos.forEach((p, nd) => {
        let fill = "var(--surface)", stroke = "currentColor";
        if (f.visited && f.visited.includes(nd)) { fill = "var(--ok-soft)"; stroke = "var(--ok)"; }
        if (f.path && f.path.includes(nd)) { fill = "var(--accent-soft)"; stroke = "var(--accent)"; }
        if (f.cur === nd) { fill = f.found ? "var(--ok-soft)" : "var(--warn-soft)"; stroke = f.found ? "var(--ok)" : "var(--warn)"; }
        svg.appendChild(svgEl("circle", { cx: p.x, cy: p.y, r: 18, fill, stroke, "stroke-width": f.cur === nd ? 3 : 2 }));
        svg.appendChild(svgEl("text", { x: p.x, y: p.y + 5, "text-anchor": "middle", fill: "currentColor", "font-size": String(nd.v).length > 3 ? 10 : 13, "font-weight": 700 }, nd.v));
        if (mode === "trav") {
          const off = { pre: [-22, 0], in: [0, 22], post: [22, 0] }[order];
          const done = f.visited && f.visited.includes(nd);
          svg.appendChild(svgEl("circle", { cx: p.x + off[0], cy: p.y + off[1], r: 4, fill: done ? "var(--ok)" : "none", stroke: done ? "var(--ok)" : "currentColor", "stroke-opacity": 0.7 }));
        }
      });
      svgWrap.appendChild(svg);
      const ht = height(root);
      stats.textContent = "nodes = " + n + "   height = " + Math.max(0, ht - 1) + " edges (" + ht + " level" + (ht === 1 ? "" : "s") + ")   " + (root ? (balanced(root) ? "balanced ✓" : "NOT balanced ✗") : "");
    }
    function setFrames(fs, m) { pause(); frames = fs; idx = 0; mode = m; show(); }
    function show() {
      const f = frames[idx] || {};
      draw(f);
      if (mode === "trav") outLine.textContent = { pre: "Pre-order", in: "In-order", post: "Post-order" }[order] + " output: " + (f.out || []).join(", ");
      narr.textContent = f.msg || "";
      stepBtn.disabled = idx >= frames.length - 1;
    }
    function step() { if (idx < frames.length - 1) { idx++; show(); } if (idx >= frames.length - 1) pause(); }
    function pause() { if (timer) clearInterval(timer); timer = null; runBtn.textContent = "⏩ Run"; }

    function traverse(kind) {
      if (!root) return showErr("Insert some values first.");
      showErr(""); order = kind;
      const seq = [];
      (function walk(n) { if (!n) return; if (kind === "pre") seq.push(n); walk(n.l); if (kind === "in") seq.push(n); walk(n.r); if (kind === "post") seq.push(n); })(root);
      const where = { pre: "left side", in: "underneath", post: "right side" }[kind];
      const rule = { pre: "visit node, then left subtree, then right subtree", in: "left subtree, then visit node, then right subtree", post: "left subtree, then right subtree, then visit node" }[kind];
      const fs = [{ visited: [], out: [], msg: "Rule: " + rule + ". Finger trick: trace round the tree anticlockwise from the root's left; output a node as your finger passes its " + where + " (the small dots)." }];
      seq.forEach((n, i) => fs.push({ cur: n, visited: seq.slice(0, i + 1), out: seq.slice(0, i + 1).map((x) => x.v), msg: "Finger passes the " + where + " of " + n.v + " → output " + n.v + "." }));
      fs.push({ visited: seq, out: seq.map((x) => x.v), msg: "Done: " + seq.map((x) => x.v).join(", ") + (kind === "in" ? " — in-order on a BST gives the values in sorted order." : kind === "pre" ? " — pre-order is used to copy a tree (and gives prefix/Polish notation from an expression tree)." : " — post-order is used to delete a tree safely and gives Reverse Polish notation from an expression tree.") });
      setFrames(fs, "trav");
    }
    function search() {
      const vals = parseVals(input.value);
      if (!vals || vals === "mix" || vals.length !== 1) return showErr("Type one value to search for.");
      if (!root) return showErr("The tree is empty.");
      showErr(""); const v = vals[0];
      const fs = [{ msg: "Search for " + v + ": start at the root." }], path = [];
      let n = root, c = 0;
      while (n) {
        c++; path.push(n);
        const r = cmp(v, n.v);
        if (r === 0) { fs.push({ cur: n, path: path.slice(), found: true, msg: "Compare " + v + " with " + n.v + ": equal → FOUND after " + c + " comparison" + (c > 1 ? "s" : "") + "." }); break; }
        const go = r < 0 ? "l" : "r";
        fs.push({ cur: n, path: path.slice(), msg: "Compare " + v + " with " + n.v + ": " + v + (r < 0 ? " < " : " > ") + n.v + " → go " + (r < 0 ? "left" : "right") + (n[go] ? "." : ", but there is no " + (r < 0 ? "left" : "right") + " child.") });
        n = n[go];
      }
      if (!n) fs.push({ path: path.slice(), msg: "Reached a null pointer → " + v + " is NOT in the tree (" + c + " comparisons). A balanced BST search is O(log n); a degenerate (list-shaped) one is O(n)." });
      else fs.push({ cur: n, path: path.slice(), found: true, msg: "Found " + v + " with " + c + " comparisons — at most the tree's number of levels (" + height(root) + "). Balanced BST search is O(log n)." });
      setFrames(fs, "search");
    }
    function doInsert(text) {
      const vals = parseVals(text);
      if (vals === "mix") return showErr("Don't mix numbers and letters in one tree — choose Empty tree first.");
      if (!vals) return showErr("Type a value (or several, separated by commas).");
      if (count(root) + vals.length > 31) return showErr("Keep the tree to 31 nodes or fewer.");
      showErr("");
      const msgs = vals.map(insert);
      input.value = "";
      setFrames([{ msg: msgs.join("\n") }], "idle");
      narr.style.whiteSpace = "pre-line";
    }
    insBtn.addEventListener("click", () => doInsert(input.value));
    input.addEventListener("keydown", (e) => e.key === "Enter" && insBtn.click());
    findBtn.addEventListener("click", search);
    delBtn.addEventListener("click", () => {
      const vals = parseVals(input.value);
      if (!vals || vals === "mix" || vals.length !== 1) return showErr("Type one value to delete.");
      showErr(""); const [, msg] = remove(vals[0]); input.value = "";
      setFrames([{ msg }], "idle");
    });
    presetSel.addEventListener("change", () => {
      const v = presetSel.value; presetSel.value = "";
      if (!v) return;
      root = null;
      if (v === "clear") { setFrames([{ msg: "Tree cleared." }], "idle"); return; }
      doInsert(v);
    });
    preBtn.addEventListener("click", () => traverse("pre"));
    inBtn.addEventListener("click", () => traverse("in"));
    postBtn.addEventListener("click", () => traverse("post"));
    stepBtn.addEventListener("click", () => { pause(); step(); });
    runBtn.addEventListener("click", () => { if (timer) return pause(); if (idx >= frames.length - 1) idx = 0; runBtn.textContent = "⏸ Pause"; timer = setInterval(step, 900); });
    resetBtn.addEventListener("click", () => { pause(); idx = 0; show(); });
    doInsert(params.values || "50,30,70,20,40,60,80,35");
  },
});
