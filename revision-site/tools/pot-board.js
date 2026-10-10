/* Piles O' Tiles: game1 board explorer, LoadGame pile-line tracer and __GetIndex calculator. */
(function () {
  const GAME1 = [
    "2,A,1,E,1,H,3,J,2", "0,E,1,Q,4,K,4,J,2,J,2", "0,O,1,E,1,H,3", "0,O,1,E,1,H,3",
    "0,A,1,E,1,H,3", "0,A,1,H,1,H,3", "0,E,1,E,1,H,3", "0,A,1,Q,4,F,3",
    "0,U,1,E,1,H,3", "0,A,1,E,1,H,3", "4,U,5,E,1,K,4", "2,A,1,K,4,H,3",
    "0,A,1,E,1,K,1", "0,R,1,K,3,H,3", "0,R,1,F,3,K,7", "0,A,1,E,1,H,3",
  ];

  /* Mirror of LoadGame's pile loop. Returns {bonus, max, tiles (top first), steps, error}. */
  function tracePile(line) {
    const items = line.split(",");
    const out = { items, steps: [], tiles: [] };
    out.max = Math.floor(items.length / 2);
    const b = items[0].trim();
    if (!/^[+-]?\d+$/.test(b)) { out.error = "int(Items[0]) fails: '" + items[0] + "' is not a whole number → except → \"File not loaded\""; return out; }
    out.bonus = parseInt(b, 10);
    for (let k = items.length - 2; k > -1; k -= 2) {
      if (k + 1 >= items.length) { out.error = "Items[" + (k + 1) + "] does not exist → IndexError → except → \"File not loaded\""; return out; }
      const p = items[k + 1].trim();
      if (!/^[+-]?\d+$/.test(p)) { out.error = "int(Items[" + (k + 1) + "]) fails on '" + items[k + 1] + "' → ValueError → except → \"File not loaded\""; return out; }
      const added = out.tiles.length < out.max;
      if (added) out.tiles.unshift([items[k], parseInt(p, 10)]);
      out.steps.push({ k, sym: items[k], pts: p, added, after: out.tiles.map((t) => t[0] + t[1]) });
    }
    return out;
  }

  CS.registerTool({
    id: "pot-board",
    title: "Piles O' Tiles board explorer",
    section: "P",
    topic: "P.2",
    icon: "🀄",
    desc: "Click a pile of game1 to see its tiles, its line in the file and exactly how LoadGame builds it. Trace any pile line of your own, and convert coordinates to list indices.",
    help: "The board is game1 as `__DisplayBoard` shows it: each cell is the number of tiles in that pile, (1,1) is bottom-left. The small number in the corner is the pile's index in `__Board`; a `+n` badge is the pile's (unused) bonus. Click a pile to see the `LoadGame` trace. Type your own pile line to test edge cases such as an odd number of items. The calculator uses `index = x - 1 + (y - 1) * GridSize` and shows what Python does with out-of-range values.",
    mount(el) {
      const h = CS.util.el;
      const g = 4;
      let sel = 0;
      const top = h("div", { class: "two-col" });
      const boardBox = h("div");
      const pileBox = h("div");
      top.append(boardBox, pileBox);
      const traceBox = h("div", { style: "margin-top:12px;overflow-x:auto" });
      const custom = h("div", { style: "margin-top:16px" });
      const lineIn = h("input", { type: "text", "aria-label": "Pile line to trace", value: "0,R,1,F,3,K,7", style: "width:100%;font-family:var(--font-mono)" });
      custom.append(h("div", { class: "stat-line", text: "Trace your own pile line (bonus, then symbol,points pairs, top tile first):" }), lineIn);
      const calc = h("div", { style: "margin-top:16px" });
      const cx = h("input", { type: "number", value: "3", "aria-label": "x", style: "width:70px" });
      const cy = h("input", { type: "number", value: "2", "aria-label": "y", style: "width:70px" });
      const cg = h("select", { "aria-label": "Grid size" });
      [["4", "4 (game1)"], ["6", "6 (default game)"], ["3", "3"], ["5", "5"]].forEach(([v, t]) => cg.appendChild(h("option", { value: v, text: t })));
      const calcOut = h("div", { class: "output", style: "margin-top:8px" });
      const calcRow = h("div", { class: "controls" }, [h("label", {}, ["x ", cx]), h("label", {}, ["y ", cy]), h("label", {}, ["GridSize ", cg])]);
      calc.append(h("div", { class: "stat-line", text: "__GetIndex calculator" }), calcRow, calcOut);
      el.append(top, traceBox, custom, calc);

      function drawBoard() {
        boardBox.innerHTML = "";
        const grid = h("div", { style: "display:grid;grid-template-columns:24px repeat(4,minmax(44px,1fr));gap:4px;max-width:300px" });
        for (let y = g; y >= 1; y--) {
          grid.appendChild(h("div", { class: "bit-label", style: "align-self:center", text: String(y) }));
          for (let x = 1; x <= g; x++) {
            const i = x - 1 + (y - 1) * g;
            const t = tracePile(GAME1[i]);
            const b = h("button", { type: "button", class: "cell" + (i === sel ? " active" : ""), style: "position:relative;cursor:pointer;width:100%", "aria-label": "Pile (" + x + "," + y + "), " + t.tiles.length + " tiles", "aria-pressed": String(i === sel) });
            b.append(h("span", { text: String(t.tiles.length) }), h("span", { style: "position:absolute;left:4px;bottom:1px;font-size:0.6rem;color:var(--text-3)", text: String(i) }));
            if (t.bonus) b.appendChild(h("span", { style: "position:absolute;right:3px;top:1px;font-size:0.6rem;color:var(--warn)", text: "+" + t.bonus }));
            b.addEventListener("click", () => { sel = i; drawBoard(); drawPile(); });
            grid.appendChild(b);
          }
        }
        grid.appendChild(h("div"));
        for (let x = 1; x <= g; x++) grid.appendChild(h("div", { class: "bit-label", text: String(x) }));
        boardBox.append(grid, h("div", { class: "explain", text: "(1,1) is bottom-left. The file lists piles bottom row first, left to right, so file line = index + 2." }));
      }
      function traceTable(t) {
        if (!t.items) return h("div");
        const tbl = h("table");
        let html = "<thead><tr><th>Step</th><th>TileNo</th><th>Items[TileNo]</th><th>Items[TileNo+1]</th><th>_Tiles after insert(0, …)</th></tr></thead><tbody>";
        html += '<tr><td colspan="5">Items has ' + t.items.length + " elements → PileSize = " + t.items.length + " // 2 = " + t.max + " · bonus = int(Items[0])" + (t.bonus !== undefined ? " = " + t.bonus : "") + " · range(" + (t.items.length - 2) + ", -1, -2)</td></tr>";
        t.steps.forEach((s, n) => {
          html += "<tr><td>" + (n + 1) + "</td><td>" + s.k + "</td><td>" + CS.util.esc(s.sym) + "</td><td>" + CS.util.esc(s.pts) + "</td><td>" + (s.added ? "[" + s.after.join(", ") + "]" : "ignored: pile full (Add does nothing)") + "</td></tr>";
        });
        if (t.error) html += '<tr><td colspan="5" class="err">' + CS.util.esc(t.error) + "</td></tr>";
        tbl.innerHTML = html + "</tbody>";
        return tbl;
      }
      function stackView(t) {
        const col = h("div", { style: "display:flex;flex-direction:column;gap:4px;margin-top:6px" });
        t.tiles.forEach((tile, i) => col.appendChild(h("div", { class: "cell" + (i === 0 ? " hl" : ""), style: "justify-content:start;display:flex;gap:10px;height:auto;padding:6px 10px" }, [h("b", { text: tile[0] }), h("span", { text: tile[1] + " pt" + (tile[1] === 1 ? "" : "s") }), h("span", { class: "bit-label", style: "margin-left:auto", text: "_Tiles[" + i + "]" + (i === 0 ? " · top" : "") })])));
        return col;
      }
      function drawPile() {
        const t = tracePile(GAME1[sel]);
        const x = (sel % g) + 1, y = Math.floor(sel / g) + 1;
        pileBox.innerHTML = "";
        pileBox.append(
          h("div", { class: "stat-line", text: "Pile (" + x + ", " + y + ") · index " + sel + " · file line " + (sel + 2) }),
          h("code", { text: GAME1[sel] }),
          h("div", { class: "explain", text: "Bonus " + t.bonus + " · Max " + t.max + " · " + t.tiles.length + " tiles · top tile first:" }),
          stackView(t)
        );
        traceBox.innerHTML = "";
        traceBox.append(h("div", { class: "stat-line", text: "How LoadGame reads this line (the loop runs backwards because Add inserts at index 0):" }), traceTable(t));
      }
      const customOut = h("div", { style: "margin-top:8px;overflow-x:auto" });
      custom.appendChild(customOut);
      function drawCustom() {
        const t = tracePile(lineIn.value.replace(/\n$/, ""));
        customOut.innerHTML = "";
        customOut.append(traceTable(t));
        if (!t.error) customOut.append(h("div", { class: "explain", text: "Result: _Tiles = [" + t.tiles.map((x) => x[0] + x[1]).join(", ") + "] (top first), _Max = " + t.max + ", _Bonus = " + t.bonus + "." }));
      }
      function drawCalc() {
        const x = parseInt(cx.value, 10), y = parseInt(cy.value, 10), gs = parseInt(cg.value, 10);
        if ([x, y].some(Number.isNaN)) { calcOut.textContent = "Enter whole numbers. (In the skeleton, a non-number crashes with ValueError.)"; return; }
        const i = x - 1 + (y - 1) * gs, n = gs * gs;
        let msg = x + " - 1 + (" + y + " - 1) × " + gs + " = " + i + "\n";
        const pos = (k) => "pile (" + ((k % gs) + 1) + ", " + (Math.floor(k / gs) + 1) + ")";
        if (x >= 1 && x <= gs && y >= 1 && y <= gs) msg += "✔ valid: " + pos(i);
        else if (i < 0 && i >= -n) msg += "⚠ negative index: Python counts from the end, so this is index " + (n + i) + " = " + pos(n + i) + ". No crash, wrong pile.";
        else if (i < 0 || i >= n) msg += "✖ IndexError: outside a " + n + "-pile board. Crashes when the pile is used.";
        else msg += "⚠ silent wrap: x is outside the grid but the index is still on the board, so it picks " + pos(i) + ".";
        msg += "\nReverse: x = index % GridSize + 1, y = index // GridSize + 1";
        calcOut.textContent = msg;
      }
      lineIn.addEventListener("input", drawCustom);
      [cx, cy, cg].forEach((e) => e.addEventListener("input", drawCalc));
      cg.addEventListener("change", drawCalc);
      drawBoard(); drawPile(); drawCustom(); drawCalc();
    },
  });
})();
