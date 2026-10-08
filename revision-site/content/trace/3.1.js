(function () {
  var G2 = '<svg class="diagram" viewBox="0 0 440 240" role="img" aria-label="Graph 2: edges A-C, C-B, A-E, C-D, B-F, E-D, D-F">' +
    '<g stroke="currentColor" stroke-width="2"><line x1="80" y1="60" x2="220" y2="60"/><line x1="220" y1="60" x2="360" y2="60"/><line x1="80" y1="60" x2="80" y2="190"/><line x1="220" y1="60" x2="220" y2="190"/><line x1="360" y1="60" x2="360" y2="190"/><line x1="80" y1="190" x2="220" y2="190"/><line x1="220" y1="190" x2="360" y2="190"/></g>' +
    '<g font-size="16" text-anchor="middle" fill="currentColor">' +
    [["A",80,60],["C",220,60],["B",360,60],["E",80,190],["D",220,190],["F",360,190]].map(function (p) {
      return '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="' + p[1] + '" y="' + (p[2] + 6) + '">' + p[0] + '</text>';
    }).join("") + '</g></svg>';

  CS.registerTrace({
    id: "3.1-1", topic: "3.1", title: "Depth-first search on Graph 2 (start A)", lang: "text",
    intro: G2 + "\n\nNeighbours are taken in **alphabetical order**. Use the hand method: look at the top of the stack; if it has an unvisited neighbour, visit and push the first one; otherwise pop.",
    code: "Adjacency list (alphabetical)\nA: C, E\nB: C, F\nC: A, B, D\nD: C, E, F\nE: A, D\nF: B, D",
    columns: ["Step", "Action", "Stack (bottom→top)", "Visited list"],
    prefill: [["1","","",""],["2","","",""],["3","","",""],["4","","",""],["5","","",""],["6","","",""],["7","","",""],["8","","",""],["9","","",""],["10","","",""],["11","","",""],["12","","",""]],
    rows: [
      ["1", "visit A", "A", "A"],
      ["2", "visit C", "A,C", "A,C"],
      ["3", "visit B", "A,C,B", "A,C,B"],
      ["4", "visit F", "A,C,B,F", "A,C,B,F"],
      ["5", "visit D", "A,C,B,F,D", "A,C,B,F,D"],
      ["6", "visit E", "A,C,B,F,D,E", "A,C,B,F,D,E"],
      ["7", "pop E", "A,C,B,F,D", "A,C,B,F,D,E"],
      ["8", "pop D", "A,C,B,F", "A,C,B,F,D,E"],
      ["9", "pop F", "A,C,B", "A,C,B,F,D,E"],
      ["10", "pop B", "A,C", "A,C,B,F,D,E"],
      ["11", "pop C", "A", "A,C,B,F,D,E"],
      ["12", "pop A", "", "A,C,B,F,D,E"]
    ],
    instructions: "Action: write 'visit X' or 'pop X'. Write the stack and visited list as comma-separated letters with no spaces needed (e.g. A,C,B). Leave the stack blank when it is empty.",
    hint: "From C the unvisited neighbours are B and D: B comes first alphabetically. From B, go to F; from F, D; from D, E. Then E, D, F, B, C and A have nothing left, so they are popped in that order.",
    note: "Depth-first order: **A, C, B, F, D, E**. The traversal reached E (a neighbour of A!) last, because it went as deep as possible first."
  });

  CS.registerTrace({
    id: "3.1-2", topic: "3.1", title: "Breadth-first search on Graph 2 (start A)", lang: "text",
    intro: G2 + "\n\nNeighbours are enqueued in **alphabetical order**. Mark a vertex visited when you enqueue it.",
    code: "Adjacency list (alphabetical)\nA: C, E\nB: C, F\nC: A, B, D\nD: C, E, F\nE: A, D\nF: B, D",
    columns: ["Step", "Dequeued", "Enqueued", "Queue (front→rear)", "Visited list"],
    prefill: [["0","—","A","A","A"],["1","","","",""],["2","","","",""],["3","","","",""],["4","","","",""],["5","","","",""],["6","","","",""]],
    rows: [
      ["0", "—", "A", "A", "A"],
      ["1", "A", "C,E", "C,E", "A,C,E"],
      ["2", "C", "B,D", "E,B,D", "A,C,E,B,D"],
      ["3", "E", "", "B,D", "A,C,E,B,D"],
      ["4", "B", "F", "D,F", "A,C,E,B,D,F"],
      ["5", "D", "", "F", "A,C,E,B,D,F"],
      ["6", "F", "", "", "A,C,E,B,D,F"]
    ],
    instructions: "Write lists comma-separated (e.g. C,E). Leave 'Enqueued' blank if nothing new is added, and leave the queue blank when it is empty.",
    hint: "When C is dequeued its neighbours are A (visited), B and D, so B then D join the rear behind E. E's neighbours A and D are already visited.",
    note: "Breadth-first order: **A, C, E, B, D, F**. Layers: A (0 edges) → C, E (1 edge) → B, D (2 edges) → F (3 edges)."
  });
})();
