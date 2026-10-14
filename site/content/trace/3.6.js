(function () {
  var G = '<svg class="diagram" viewBox="0 0 560 270" role="img" aria-label="Weighted graph: A-B 6, A-C 1, B-C 2, B-D 2, C-E 5, D-E 1, D-F 4, E-F 3">' +
    '<g stroke="currentColor" stroke-width="2"><line x1="70" y1="135" x2="200" y2="50"/><line x1="70" y1="135" x2="200" y2="220"/><line x1="200" y1="50" x2="200" y2="220"/><line x1="200" y1="50" x2="350" y2="50"/><line x1="200" y1="220" x2="350" y2="220"/><line x1="350" y1="50" x2="350" y2="220"/><line x1="350" y1="50" x2="480" y2="135"/><line x1="350" y1="220" x2="480" y2="135"/></g>' +
    '<g font-size="14" text-anchor="middle" fill="currentColor"><text x="125" y="82">6</text><text x="125" y="200">1</text><text x="188" y="140">2</text><text x="275" y="40">2</text><text x="275" y="240">5</text><text x="362" y="140">1</text><text x="425" y="82">4</text><text x="425" y="200">3</text></g>' +
    '<g font-size="16" text-anchor="middle" fill="currentColor">' +
    [["A",70,135],["B",200,50],["C",200,220],["D",350,50],["E",350,220],["F",480,135]].map(function (p) {
      return '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="' + p[1] + '" y="' + (p[2] + 6) + '">' + p[0] + "</text>";
    }).join("") + "</g></svg>";
  var code = "Edges: A–B 6, A–C 1, B–C 2, B–D 2, C–E 5, D–E 1, D–F 4, E–F 3\nStart vertex: A";
  CS.registerTrace({
    id: "3.6-1", topic: "3.6", title: "Dijkstra step by step", lang: "text", intro: G, code: code,
    columns: ["Step", "Vertex visited", "A", "B", "C", "D", "E", "F"],
    prefill: [["1","","","","","","",""],["2","","","","","","",""],["3","","","","","","",""],["4","","","","","","",""],["5","","","","","","",""],["6","","","","","","",""]],
    rows: [
      ["1", "A", "0", "6", "1", "inf", "inf", "inf"],
      ["2", "C", "0", "3", "1", "inf", "6", "inf"],
      ["3", "B", "0", "3", "1", "5", "6", "inf"],
      ["4", "D", "0", "3", "1", "5", "6", "9"],
      ["5", "E", "0", "3", "1", "5", "6", "9"],
      ["6", "F", "0", "3", "1", "5", "6", "9"]
    ],
    instructions: "Each row: which vertex is visited at that step, then every vertex's shortest distance so far **after** its neighbours have been relaxed. Type inf for ∞.",
    hint: "After A, the closest unvisited vertex is C (1). From C: B becomes 1 + 2 = 3 (better than 6) and E becomes 1 + 5 = 6.",
    note: "At step 4, E via D is 5 + 1 = 6: equal to the current 6, so it is **not** updated (previous stays C). At step 5, F via E is 6 + 3 = 9: equal, not updated."
  });
  CS.registerTrace({
    id: "3.6-2", topic: "3.6", title: "Dijkstra: final table and path", lang: "text", intro: G, code: code,
    columns: ["Vertex", "Shortest distance from A", "Previous vertex"],
    prefill: [["A","",""],["B","",""],["C","",""],["D","",""],["E","",""],["F","",""],["Path A to F","—",""]],
    rows: [["A","0",""],["B","3","C"],["C","1","A"],["D","5","B"],["E","6","C"],["F","9","D"],["Path A to F","—","A,C,B,D,F"]],
    instructions: "Leave A's previous vertex blank (or write -). For the last row, write the path as comma-separated vertices from A to F.",
    hint: "Follow previous vertices back from F: F ← D ← B ← C ← A.",
    note: "Shortest path A → C → B → D → F, cost 1 + 2 + 2 + 4 = **9**. The direct-looking A → B route costs 6 just to reach B."
  });
})();
