/* Graph explorer: editable graph (SVG), adjacency matrix/list, BFS, DFS, Dijkstra and A* step-through. */
CS.registerTool({
  id: "graph-explorer",
  title: "Graph explorer",
  section: "3",
  topic: "3.1",
  icon: "🕸️",
  desc: "Draw a graph, see its adjacency matrix and list, and step through BFS, DFS, Dijkstra and A*.",
  help: "**Editing.** Choose a mode: *Move* (drag vertices), *Add vertex* (click empty space), *Edge* (click two vertices to add an edge, or to remove it if it already exists), *Delete vertex*. You can also add/remove edges with the keyboard using the From/To boxes. Tick **Directed** or **Weighted**; new edges use the weight in the *weight* box.\n\n**Algorithms.** Neighbours are always taken in **alphabetical order**, as in AQA mark schemes.\n- **Breadth-first**: uses a **queue**. The answer is the order vertices are *dequeued* (visited). Finds the shortest path by number of edges in an unweighted graph.\n- **Depth-first**: recursive, so it uses a **stack** (shown bottom → top). Go as deep as possible, **backtrack** when a vertex has no unvisited neighbours. Answer = order visited.\n- **Dijkstra**: repeatedly choose the **unvisited vertex with the smallest tentative distance**, mark it visited, and update its unvisited neighbours if *distance via it* is smaller. The table matches exam questions; the final shortest path is traced back using *previous vertex*.\n- **A\\***: like Dijkstra but chooses the open vertex with the smallest **f = g + h**, where g is the distance so far and h is a heuristic (here: straight-line distance scaled so it never overestimates). It stops when the goal is chosen, so it usually examines fewer vertices.",
  mount(el, params) {
    const h = CS.util.el, NS = "http://www.w3.org/2000/svg", uid = "ge" + Math.random().toString(36).slice(2, 8);
    const W = 700, H = 380, R = 20;
    const PRESETS = {
      traversal: { name: "BFS / DFS example", directed: false, weighted: false, v: { A: [110, 90], B: [330, 70], C: [560, 90], D: [130, 300], E: [340, 280], F: [580, 290] }, e: "A-B A-D B-C B-E C-F D-E E-F", start: "A" },
      dijkstra: { name: "Weighted (Dijkstra / A*)", directed: false, weighted: true, v: { A: [80, 190], B: [230, 80], C: [220, 300], D: [410, 90], E: [430, 300], F: [630, 190], G: [60, 330] }, e: "A-B:5 A-C:5 A-G:4 B-C:6 B-D:5 C-E:8 C-D:8 D-E:6 D-F:7 E-F:6 C-G:5", start: "A", goal: "F" },
      directed: { name: "Directed graph", directed: true, weighted: false, v: { A: [100, 190], B: [280, 80], C: [280, 300], D: [470, 190], E: [630, 100] }, e: "A-B A-C C-B B-D C-D D-E E-B", start: "A" },
    };
    let V = [], E = [], directed = false, weighted = false, mode = "move", pendingEdge = null, drag = null;
    let frames = [], idx = 0, timer = null, algoDone = false;

    /* ---------- UI ---------- */
    const presetSel = h("select", { "aria-label": "Preset graph" });
    presetSel.appendChild(h("option", { value: "", text: "Preset…" }));
    Object.keys(PRESETS).forEach((k) => presetSel.appendChild(h("option", { value: k, text: PRESETS[k].name })));
    presetSel.appendChild(h("option", { value: "clear", text: "Empty graph" }));
    const modeBtns = {};
    const modeGroup = h("div", { role: "group", "aria-label": "Edit mode", style: "display:inline-flex;gap:4px;flex-wrap:wrap" });
    [["move", "✋ Move"], ["vertex", "＋ Add vertex"], ["edge", "／ Edge"], ["delete", "✕ Delete vertex"]].forEach(([m, t]) => { modeBtns[m] = h("button", { class: "btn sm", type: "button", text: t, onclick: () => setMode(m) }); modeGroup.appendChild(modeBtns[m]); });
    const dirCb = h("input", { type: "checkbox" }), wCb = h("input", { type: "checkbox" });
    const wIn = h("input", { type: "number", value: 1, min: 0, "aria-label": "Weight for new edges", style: "width:64px;min-width:56px" });
    const row1 = h("div", { class: "controls" }, [presetSel, modeGroup, h("label", {}, [dirCb, document.createTextNode("Directed")]), h("label", {}, [wCb, document.createTextNode("Weighted")]), h("label", { text: "weight " }, wIn)]);
    const fromSel = h("select", { "aria-label": "Edge from" }), toSel = h("select", { "aria-label": "Edge to" });
    const edgeBtn = h("button", { class: "btn sm", type: "button", text: "Add / remove edge" });
    const addVBtn = h("button", { class: "btn sm", type: "button", text: "Add vertex" });
    const row1b = h("div", { class: "controls" }, [h("label", { text: "From " }, fromSel), h("label", { text: "to " }, toSel), edgeBtn, addVBtn]);
    const algoSel = h("select", { "aria-label": "Algorithm" });
    [["bfs", "Breadth-first search"], ["dfs", "Depth-first search"], ["dijkstra", "Dijkstra"], ["astar", "A* search"]].forEach(([v, t]) => algoSel.appendChild(h("option", { value: v, text: t })));
    const startSel = h("select", { "aria-label": "Start vertex" }), goalSel = h("select", { "aria-label": "Goal vertex" });
    const goBtn = h("button", { class: "btn sm primary", type: "button", text: "Start" });
    const stepBtn = h("button", { class: "btn sm", type: "button", text: "▶ Step" });
    const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
    const speed = h("input", { type: "range", min: 1, max: 10, value: 5, "aria-label": "Speed", style: "width:90px" });
    const row2 = h("div", { class: "controls" }, [algoSel, h("label", { text: "start " }, startSel), h("label", { text: "goal " }, goalSel), goBtn, stepBtn, runBtn, resetBtn, h("label", { text: "speed " }, speed)]);
    const err = h("div", { class: "err", style: "display:none" });
    const hint = h("div", { class: "explain", style: "margin:0 0 6px" });
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Graph diagram");
    svg.setAttribute("style", "width:100%;height:auto;display:block;border:1px solid var(--border);border-radius:10px;background:var(--bg-2);color:var(--text);touch-action:none;user-select:none");
    const narr = h("div", { class: "output", style: "min-height:44px;margin-top:8px", "aria-live": "polite" });
    const state = h("div");
    const matrixWrap = h("div"), listWrap = h("div", { class: "output", style: "font-size:0.85rem" });
    const panels = h("div", { class: "two-col", style: "margin-top:10px" }, [h("div", {}, [h("div", { class: "stat-line", text: "Algorithm state" }), state]), h("div", {}, [h("div", { class: "stat-line", text: "Adjacency matrix" }), matrixWrap, h("div", { class: "stat-line", text: "Adjacency list" }), listWrap])]);
    el.append(row1, row1b, row2, err, hint, svg, narr, panels);

    /* ---------- graph model ---------- */
    const byId = (id) => V.find((v) => v.id === id);
    const names = () => V.map((v) => v.id).sort();
    const findEdge = (a, b) => E.find((e) => (e.u === a && e.v === b) || (!directed && e.u === b && e.v === a));
    function nbrs(id) {
      const out = [];
      E.forEach((e) => { if (e.u === id) out.push({ to: e.v, w: e.w }); else if (!directed && e.v === id) out.push({ to: e.u, w: e.w }); });
      return out.sort((a, b) => (a.to < b.to ? -1 : 1));
    }
    const showErr = (m) => { err.textContent = m; err.style.display = m ? "" : "none"; };
    function load(key) {
      const p = PRESETS[key];
      directed = p.directed; weighted = p.weighted;
      V = Object.keys(p.v).map((id) => ({ id, x: p.v[id][0], y: p.v[id][1] }));
      E = p.e.split(" ").map((s) => { const [uv, w] = s.split(":"); const [u, v] = uv.split("-"); return { u, v, w: w ? Number(w) : 1 }; });
      dirCb.checked = directed; wCb.checked = weighted;
      changed();
      startSel.value = p.start; goalSel.value = p.goal || p.start;
      if (p.goal) goalSel.value = p.goal; else goalSel.value = names()[names().length - 1];
    }
    function nextName() { for (let i = 0; i < 26; i++) { const c = String.fromCharCode(65 + i); if (!byId(c)) return c; } return null; }
    function addVertex(x, y) {
      const id = nextName();
      if (!id) return showErr("Maximum of 26 vertices (A–Z).");
      V.push({ id, x: Math.max(R, Math.min(W - R, x)), y: Math.max(R, Math.min(H - R, y)) });
      changed("Added vertex " + id + ".");
    }
    function toggleEdge(a, b) {
      if (a === b) return showErr("An edge needs two different vertices (loops are not used here).");
      const ex = findEdge(a, b);
      if (ex) { E.splice(E.indexOf(ex), 1); return changed("Removed edge " + a + (directed ? " → " : " – ") + b + "."); }
      const w = weighted ? Number(wIn.value) : 1;
      if (weighted && (!Number.isFinite(w) || w < 0)) return showErr("Weights must be numbers ≥ 0 (Dijkstra cannot handle negative weights).");
      E.push({ u: a, v: b, w });
      changed("Added edge " + a + (directed ? " → " : " – ") + b + (weighted ? " with weight " + w : "") + ".");
    }
    function changed(msg) {
      stopAlgo();
      showErr("");
      const keep = [startSel.value, goalSel.value, fromSel.value, toSel.value];
      [startSel, goalSel, fromSel, toSel].forEach((s, i) => { s.innerHTML = ""; names().forEach((n) => s.appendChild(h("option", { value: n, text: n }))); if (byId(keep[i])) s.value = keep[i]; });
      if (!byId(keep[3]) && names().length > 1) toSel.value = names()[1];
      narr.textContent = msg || "Edit the graph or choose an algorithm and press Start.";
      drawPanels(); draw();
    }

    /* ---------- drawing ---------- */
    function sv(tag, attrs, text) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }
    function draw(f) {
      f = f || {};
      svg.innerHTML = "";
      const defs = sv("defs", {});
      const mk = sv("marker", { id: uid + "a", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
      mk.appendChild(sv("path", { d: "M0,0 L10,5 L0,10 z", fill: "currentColor" }));
      const mk2 = mk.cloneNode(true); mk2.setAttribute("id", uid + "b"); mk2.firstChild.setAttribute("fill", "var(--accent)");
      defs.append(mk, mk2); svg.appendChild(defs);
      const hot = (a, b) => (f.edges || []).some(([x, y]) => (x === a && y === b) || (!directed && x === b && y === a));
      E.forEach((e) => {
        const a = byId(e.u), b = byId(e.v); if (!a || !b) return;
        const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
        const both = directed && E.some((o) => o.u === e.v && o.v === e.u);
        const off = both ? 10 : 0, nx = -uy * off, ny = ux * off;
        const x1 = a.x + ux * R + nx, y1 = a.y + uy * R + ny, x2 = b.x - ux * (R + 2) + nx, y2 = b.y - uy * (R + 2) + ny;
        const isHot = hot(e.u, e.v);
        svg.appendChild(sv("line", { x1, y1, x2, y2, stroke: isHot ? "var(--accent)" : "currentColor", "stroke-opacity": isHot ? 1 : 0.6, "stroke-width": isHot ? 4 : 2, "marker-end": directed ? "url(#" + uid + (isHot ? "b" : "a") + ")" : "" }));
        if (weighted) {
          const mx = (x1 + x2) / 2 + nx * 0.8, my = (y1 + y2) / 2 + ny * 0.8, t = String(e.w);
          svg.appendChild(sv("rect", { x: mx - 6 - t.length * 4, y: my - 10, width: 12 + t.length * 8, height: 20, rx: 5, fill: "var(--bg-2)", stroke: "var(--border-2)" }));
          svg.appendChild(sv("text", { x: mx, y: my + 5, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: "currentColor" }, t));
        }
      });
      V.forEach((v) => {
        let fill = "var(--surface)", stroke = "currentColor";
        if ((f.seen || []).includes(v.id)) { fill = "var(--accent-soft)"; stroke = "var(--accent)"; }
        if ((f.done || []).includes(v.id)) { fill = "var(--ok-soft)"; stroke = "var(--ok)"; }
        if (f.cur === v.id || pendingEdge === v.id) { fill = "var(--warn-soft)"; stroke = "var(--warn)"; }
        const g = sv("g", { "data-v": v.id, style: "cursor:" + (mode === "move" ? "grab" : "pointer") });
        g.appendChild(sv("circle", { cx: v.x, cy: v.y, r: R, fill, stroke, "stroke-width": f.cur === v.id ? 4 : 2 }));
        g.appendChild(sv("text", { x: v.x, y: v.y + 6, "text-anchor": "middle", "font-size": 17, "font-weight": 700, fill: "currentColor", "pointer-events": "none" }, v.id));
        if (f.labels && f.labels[v.id] != null) g.appendChild(sv("text", { x: v.x, y: v.y - R - 6, "text-anchor": "middle", "font-size": 13, fill: "var(--accent)", "font-weight": 700, "pointer-events": "none" }, f.labels[v.id]));
        svg.appendChild(g);
      });
      if (!V.length) svg.appendChild(sv("text", { x: W / 2, y: H / 2, "text-anchor": "middle", fill: "currentColor", "font-size": 16 }, "Empty graph — choose “Add vertex” and click here"));
    }
    function drawPanels() {
      const ns = names();
      if (!ns.length) { matrixWrap.innerHTML = "<div class='muted'>No vertices.</div>"; listWrap.textContent = "(empty)"; return; }
      let t = "<div class='table-wrap'><table><thead><tr><th></th>" + ns.map((n) => "<th>" + n + "</th>").join("") + "</tr></thead><tbody>";
      ns.forEach((a) => {
        t += "<tr><th>" + a + "</th>" + ns.map((b) => { const e = E.find((x) => (x.u === a && x.v === b) || (!directed && x.u === b && x.v === a)); return "<td style='text-align:center;font-family:var(--font-mono)'>" + (e ? (weighted ? e.w : 1) : weighted ? "–" : 0) + "</td>"; }).join("") + "</tr>";
      });
      matrixWrap.innerHTML = t + "</tbody></table></div>";
      listWrap.textContent = ns.map((a) => a + " → " + (nbrs(a).map((x) => x.to + (weighted ? "(" + x.w + ")" : "")).join(", ") || "∅")).join("\n");
    }

    /* ---------- pointer editing ---------- */
    function svgPoint(e) { const m = svg.getScreenCTM(); if (!m) return { x: 0, y: 0 }; const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return { x: p.x, y: p.y }; }
    svg.addEventListener("pointerdown", (e) => {
      const g = e.target.closest && e.target.closest("g[data-v]");
      const id = g && g.getAttribute("data-v");
      const p = svgPoint(e);
      if (mode === "move" && id) { drag = { id, dx: byId(id).x - p.x, dy: byId(id).y - p.y }; try { svg.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } }
      else if (mode === "vertex" && !id) addVertex(p.x, p.y);
      else if (mode === "edge" && id) { if (!pendingEdge) { pendingEdge = id; hint.textContent = "Edge from " + id + ": now click the second vertex."; draw(frames[idx]); } else { const a = pendingEdge; pendingEdge = null; hint.textContent = modeHint(); toggleEdge(a, id); } }
      else if (mode === "delete" && id) { V = V.filter((v) => v.id !== id); E = E.filter((x) => x.u !== id && x.v !== id); changed("Deleted vertex " + id + " and its edges."); }
    });
    svg.addEventListener("pointermove", (e) => { if (!drag) return; const p = svgPoint(e), v = byId(drag.id); v.x = Math.max(R, Math.min(W - R, p.x + drag.dx)); v.y = Math.max(R, Math.min(H - R, p.y + drag.dy)); draw(algoDone || frames.length ? frames[idx] : null); });
    svg.addEventListener("pointerup", () => { drag = null; });
    function modeHint() { return { move: "Move mode: drag a vertex to reposition it.", vertex: "Add vertex mode: click an empty spot.", edge: "Edge mode: click two vertices to add (or remove) the edge between them.", delete: "Delete mode: click a vertex to remove it and its edges." }[mode]; }
    function setMode(m) { mode = m; pendingEdge = null; Object.keys(modeBtns).forEach((k) => { modeBtns[k].classList.toggle("primary", k === m); modeBtns[k].setAttribute("aria-pressed", k === m); }); hint.textContent = modeHint(); draw(frames[idx]); }

    /* ---------- algorithms → frames ---------- */
    function bfs(s) {
      const F = [], seen = [s], done = [], q = [s], edges = [];
      const snap = (msg, cur) => F.push({ cur, seen: seen.slice(), done: done.slice(), edges: edges.slice(), msg, info: [["Queue (front → rear)", q.join(", ") || "empty"], ["Visited order", done.join(", ") || "—"]] });
      snap("Enqueue the start vertex " + s + " and mark it as discovered.");
      while (q.length) {
        const v = q.shift(); done.push(v);
        snap("Dequeue " + v + " → visit it. Now look at its neighbours in alphabetical order: " + (nbrs(v).map((x) => x.to).join(", ") || "none") + ".", v);
        nbrs(v).forEach(({ to }) => {
          if (!seen.includes(to)) { seen.push(to); q.push(to); edges.push([v, to]); snap("Neighbour " + to + " not yet discovered → mark it and enqueue it.", v); }
          else snap("Neighbour " + to + " already discovered → ignore.", v);
        });
      }
      F.push(Object.assign({}, F[F.length - 1], { cur: null, final: true, msg: "Queue empty → finished. Breadth-first order: " + done.join(", ") + "." + (done.length < V.length ? " (Vertices " + names().filter((n) => !done.includes(n)).join(", ") + " cannot be reached from " + s + ".)" : "") }));
      return F;
    }
    function dfs(s) {
      const F = [], done = [], stack = [], edges = [];
      const snap = (msg, cur) => F.push({ cur, seen: stack.slice(), done: done.slice(), edges: edges.slice(), msg, info: [["Stack (bottom → top)", stack.join(", ") || "empty"], ["Visited order", done.join(", ") || "—"]] });
      function visit(v, from) {
        done.push(v); stack.push(v); if (from) edges.push([from, v]);
        snap((from ? "Go from " + from + " to " + v : "Start at " + s) + ": mark " + v + " visited and push it onto the stack. Neighbours (alphabetical): " + (nbrs(v).map((x) => x.to).join(", ") || "none") + ".", v);
        nbrs(v).forEach(({ to }) => {
          if (!done.includes(to)) visit(to, v);
          else snap("At " + v + ": neighbour " + to + " already visited → skip.", v);
        });
        stack.pop();
        snap(v + " has no unvisited neighbours left → pop it and backtrack" + (stack.length ? " to " + stack[stack.length - 1] + "." : "; the stack is empty."), stack[stack.length - 1] || null);
      }
      visit(s, null);
      F.push(Object.assign({}, F[F.length - 1], { cur: null, final: true, msg: "Finished. Depth-first order: " + done.join(", ") + "." + (done.length < V.length ? " (Not reachable: " + names().filter((n) => !done.includes(n)).join(", ") + ".)" : "") }));
      return F;
    }
    const fmt = (d) => (d === Infinity ? "∞" : String(Math.round(d * 100) / 100));
    function pathTo(prev, g) { const p = []; let x = g; while (x) { p.unshift(x); x = prev[x]; } return p; }
    function dijkstra(s, goal) {
      const F = [], ns = names(), dist = {}, prev = {}, vis = [];
      ns.forEach((n) => { dist[n] = Infinity; prev[n] = null; }); dist[s] = 0;
      const table = () => ["table", ["Vertex", "Distance", "Previous", "Visited"], ns.map((n) => [n, fmt(dist[n]), prev[n] || "—", vis.includes(n) ? "✓" : ""])];
      const labels = () => { const o = {}; ns.forEach((n) => (o[n] = fmt(dist[n]))); return o; };
      const treeEdges = () => ns.filter((n) => prev[n]).map((n) => [prev[n], n]);
      const snap = (msg, cur, extra) => F.push(Object.assign({ cur, done: vis.slice(), seen: ns.filter((n) => dist[n] < Infinity), edges: treeEdges(), labels: labels(), info: [table()], msg }, extra));
      snap("Set every tentative distance to ∞ and the start " + s + " to 0. No vertex is visited yet.");
      while (vis.length < ns.length) {
        const un = ns.filter((n) => !vis.includes(n));
        const u = un.reduce((b, n) => (dist[n] < dist[b] ? n : b), un[0]);
        if (dist[u] === Infinity) { snap("Every unvisited vertex has distance ∞ → they cannot be reached. Stop.", null); break; }
        vis.push(u);
        snap("Choose the unvisited vertex with the smallest tentative distance: " + u + " (" + fmt(dist[u]) + "). Mark it visited — its distance is now final.", u);
        nbrs(u).filter((x) => !vis.includes(x.to)).forEach(({ to, w }) => {
          const nd = dist[u] + w;
          if (nd < dist[to]) { const old = dist[to]; dist[to] = nd; prev[to] = u; snap("Neighbour " + to + ": " + fmt(dist[u]) + " + " + w + " = " + fmt(nd) + " < " + fmt(old) + " → update distance to " + fmt(nd) + ", previous ← " + u + ".", u); }
          else snap("Neighbour " + to + ": " + fmt(dist[u]) + " + " + w + " = " + fmt(nd) + " ≥ " + fmt(dist[to]) + " → no change.", u);
        });
      }
      const p = dist[goal] < Infinity ? pathTo(prev, goal) : null;
      const pe = p ? p.slice(1).map((x, i) => [p[i], x]) : [];
      snap(p ? "Finished. Shortest path " + s + " → " + goal + " = " + p.join(" → ") + ", total weight " + fmt(dist[goal]) + " (traced back from " + goal + " using the Previous column). Visit order: " + vis.join(", ") + "." : "Finished. " + goal + " cannot be reached from " + s + ".", null, { edges: pe, final: true });
      return F;
    }
    function astar(s, goal) {
      const F = [], ns = names(), gS = {}, prev = {}, open = [s], closed = [];
      let k = Infinity;
      E.forEach((e) => { const a = byId(e.u), b = byId(e.v), len = Math.hypot(a.x - b.x, a.y - b.y); if (len > 0) k = Math.min(k, e.w / len); });
      if (!Number.isFinite(k)) k = 0;
      const gv = byId(goal), hv = {};
      ns.forEach((n) => { const v = byId(n); hv[n] = Math.floor(k * Math.hypot(v.x - gv.x, v.y - gv.y) * 10) / 10; gS[n] = Infinity; prev[n] = null; });
      gS[s] = 0;
      const fv = (n) => gS[n] + hv[n];
      const table = () => ["table", ["Vertex", "g", "h", "f = g + h", "Previous", "State"], ns.map((n) => [n, fmt(gS[n]), fmt(hv[n]), gS[n] === Infinity ? "∞" : fmt(fv(n)), prev[n] || "—", closed.includes(n) ? "closed" : open.includes(n) ? "open" : ""])];
      const labels = () => { const o = {}; ns.forEach((n) => (o[n] = "h=" + fmt(hv[n]))); return o; };
      const snap = (msg, cur, extra) => F.push(Object.assign({ cur, done: closed.slice(), seen: open.slice(), edges: ns.filter((n) => prev[n]).map((n) => [prev[n], n]), labels: labels(), info: [table()], msg }, extra));
      snap("h(v) = straight-line distance from v to " + goal + " × " + (Math.round(k * 10000) / 10000) + " (scaled so h never overestimates the real cost). Put " + s + " in the open set with g = 0, f = " + fmt(fv(s)) + ".");
      let found = false;
      while (open.length) {
        const u = open.reduce((b, n) => (fv(n) < fv(b) || (fv(n) === fv(b) && n < b) ? n : b), open[0]);
        open.splice(open.indexOf(u), 1); closed.push(u);
        if (u === goal) { found = true; snap("Choose the open vertex with the smallest f: " + u + " (f = " + fmt(fv(u)) + "). It is the goal → stop.", u); break; }
        snap("Choose the open vertex with the smallest f = g + h: " + u + " (f = " + fmt(gS[u]) + " + " + fmt(hv[u]) + " = " + fmt(fv(u)) + "). Close it.", u);
        nbrs(u).filter((x) => !closed.includes(x.to)).forEach(({ to, w }) => {
          const ng = gS[u] + w;
          if (ng < gS[to]) { gS[to] = ng; prev[to] = u; if (!open.includes(to)) open.push(to); snap("Neighbour " + to + ": g = " + fmt(gS[u]) + " + " + w + " = " + fmt(ng) + ", f = " + fmt(ng) + " + " + fmt(hv[to]) + " = " + fmt(fv(to)) + " → add/update in open set, previous ← " + u + ".", u); }
          else snap("Neighbour " + to + ": g via " + u + " = " + fmt(ng) + " is not better than " + fmt(gS[to]) + " → no change.", u);
        });
      }
      const p = found ? pathTo(prev, goal) : null;
      snap(p ? "Finished. Path " + p.join(" → ") + ", cost " + fmt(gS[goal]) + ". A* closed " + closed.length + " of " + ns.length + " vertices (" + closed.join(", ") + "); Dijkstra would visit every vertex closer than the goal." : "Open set empty → " + goal + " cannot be reached.", null, { edges: p ? p.slice(1).map((x, i) => [p[i], x]) : [], final: true });
      return F;
    }

    /* ---------- player ---------- */
    function renderFrame() {
      const f = frames[idx];
      if (!f) return;
      draw(f);
      narr.textContent = "Step " + idx + "/" + (frames.length - 1) + ": " + f.msg;
      narr.className = "output" + (f.final ? " ok-text" : "");
      state.innerHTML = "";
      f.info.forEach((it) => {
        if (it[0] === "table") {
          const t = h("table"), tr = h("tr");
          it[1].forEach((c) => tr.appendChild(h("th", { text: c })));
          t.appendChild(h("thead", {}, tr));
          const tb = h("tbody");
          it[2].forEach((r) => { const row = h("tr", { style: r[0] === f.cur ? "outline:2px solid var(--warn)" : "" }); r.forEach((c) => row.appendChild(h("td", { text: c, style: "font-family:var(--font-mono)" }))); tb.appendChild(row); });
          t.appendChild(tb); state.appendChild(h("div", { class: "table-wrap" }, t));
        } else state.appendChild(h("div", { class: "output", style: "margin-bottom:6px" }, [h("b", { text: it[0] + ": " }), document.createTextNode(it[1])]));
      });
      stepBtn.disabled = idx >= frames.length - 1;
    }
    function startAlgo() {
      pauseRun();
      if (!V.length) return showErr("Add some vertices first.");
      const s = startSel.value, g = goalSel.value, a = algoSel.value;
      if ((a === "dijkstra" || a === "astar") && E.some((e) => e.w < 0)) return showErr("Dijkstra and A* need non-negative weights.");
      if (a === "astar" && !weighted) return showErr("A* needs a weighted graph: tick Weighted or load the weighted preset.");
      showErr("");
      frames = a === "bfs" ? bfs(s) : a === "dfs" ? dfs(s) : a === "dijkstra" ? dijkstra(s, g) : astar(s, g);
      if (a === "dijkstra" && !weighted) frames[0].msg += " (Unweighted graph: every edge counts as 1.)";
      idx = 0; algoDone = true; renderFrame();
    }
    function stopAlgo() { pauseRun(); frames = []; idx = 0; algoDone = false; state.innerHTML = "<div class='muted'>Press Start to run the chosen algorithm.</div>"; stepBtn.disabled = true; }
    function step() { if (idx < frames.length - 1) { idx++; renderFrame(); } if (idx >= frames.length - 1) pauseRun(); }
    function pauseRun() { if (timer) clearInterval(timer); timer = null; runBtn.textContent = "⏩ Run"; }

    presetSel.addEventListener("change", () => { const v = presetSel.value; presetSel.value = ""; if (v === "clear") { V = []; E = []; changed("Graph cleared."); } else if (v) load(v); });
    dirCb.addEventListener("change", () => {
      directed = dirCb.checked;
      if (!directed) { const seen = []; E = E.filter((e) => { const k = [e.u, e.v].sort().join(); if (seen.includes(k)) return false; seen.push(k); return true; }); }
      changed(directed ? "Now directed: each edge goes from the first vertex to the second (arrow). The matrix may no longer be symmetrical." : "Now undirected: the adjacency matrix is symmetrical.");
    });
    wCb.addEventListener("change", () => { weighted = wCb.checked; changed(weighted ? "Weighted: new edges use the weight box." : "Unweighted: the matrix shows 1 for an edge, 0 for none."); });
    edgeBtn.addEventListener("click", () => { if (!fromSel.value || !toSel.value) return showErr("Add vertices first."); toggleEdge(fromSel.value, toSel.value); });
    addVBtn.addEventListener("click", () => { const n = V.length; addVertex(60 + ((n * 137) % 580), 50 + ((n * 89) % 280)); });
    goBtn.addEventListener("click", startAlgo);
    stepBtn.addEventListener("click", () => { pauseRun(); if (!frames.length) startAlgo(); else step(); });
    runBtn.addEventListener("click", () => {
      if (timer) return pauseRun();
      if (!frames.length) startAlgo();
      if (!frames.length) return;
      if (idx >= frames.length - 1) idx = 0;
      runBtn.textContent = "⏸ Pause"; timer = setInterval(step, 2400 / Number(speed.value));
    });
    resetBtn.addEventListener("click", () => { stopAlgo(); narr.textContent = "Reset. Press Start or ▶ Step."; draw(); });
    speed.addEventListener("input", () => { if (timer) { clearInterval(timer); timer = setInterval(step, 2400 / Number(speed.value)); } });
    algoSel.addEventListener("change", () => { if (["dijkstra", "astar"].includes(algoSel.value) && !weighted && PRESETS.dijkstra) load("dijkstra"); else stopAlgo(); });

    const initial = PRESETS[params.preset] ? params.preset : params.algo === "dijkstra" || params.algo === "astar" ? "dijkstra" : "traversal";
    if (params.algo && ["bfs", "dfs", "dijkstra", "astar"].includes(params.algo)) algoSel.value = params.algo;
    load(initial);
    setMode("move");
  },
});
