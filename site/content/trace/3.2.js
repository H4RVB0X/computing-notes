(function () {
  function node(p) { return '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="18" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="' + p[1] + '" y="' + (p[2] + 6) + '">' + p[0] + "</text>"; }
  function line(a, b) { return '<line x1="' + a[1] + '" y1="' + a[2] + '" x2="' + b[1] + '" y2="' + b[2] + '"/>'; }
  function tree(label, nodes, edges, w, h) {
    var idx = {}; nodes.forEach(function (n) { idx[n[0]] = n; });
    return '<svg class="diagram" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + label + '"><g stroke="currentColor" stroke-width="2">' +
      edges.map(function (e) { return line(idx[e[0]], idx[e[1]]); }).join("") + '</g><g font-size="16" text-anchor="middle" fill="currentColor">' + nodes.map(node).join("") + "</g></svg>";
  }
  var T1 = tree("Binary tree: M root; H left (D, K with children J and L); R right (P, T with right child W)",
    [["M",260,30],["H",140,90],["R",380,90],["D",80,155],["K",200,155],["P",330,155],["T",430,155],["J",160,220],["L",240,220],["W",470,220]],
    [["M","H"],["M","R"],["H","D"],["H","K"],["K","J"],["K","L"],["R","P"],["R","T"],["T","W"]], 540, 250);
  CS.registerTrace({
    id: "3.2-1", topic: "3.2", title: "Pre-, in- and post-order of a binary tree", lang: "pseudocode",
    intro: T1 + "\n\nT has a **right** child W only. Use the sausage method to check each answer.",
    code: "SUBROUTINE preOrder(node)\n    IF node ≠ Null THEN\n        OUTPUT node.data\n        preOrder(node.left)\n        preOrder(node.right)\n    ENDIF\nENDSUBROUTINE",
    columns: ["Traversal", "Output order"],
    prefill: [["Pre-order", ""], ["In-order", ""], ["Post-order", ""], ["Level-order (breadth-first)", ""]],
    rows: [["Pre-order", "MHDKJLRPTW"], ["In-order", "DHJKLMPRTW"], ["Post-order", "DJLKHPWTRM"], ["Level-order (breadth-first)", "MHRDKPTJLW"]],
    instructions: "Type the letters in order, separated by spaces or nothing (no commas), e.g. M H D …",
    hint: "Pre-order starts with the root M; post-order ends with M. This tree is a BST (alphabetical), so the in-order output is in alphabetical order. Level-order reads each row left to right.",
    note: "Pre: **M H D K J L R P T W** · In: **D H J K L M P R T W** · Post: **D J L K H P W T R M** · Level-order: **M H R D K P T J L W**. Only the last one is breadth-first."
  });
  var T2 = tree("Expression tree: root minus; left child times with children 7 and plus (2, 3); right child 4",
    [["−",230,30],["×",140,90],["4",320,90],["7",80,155],["+",200,155],["2",160,220],["3",240,220]],
    [["−","×"],["−","4"],["×","7"],["×","+"],["+","2"],["+","3"]], 400, 250);
  CS.registerTrace({
    id: "3.2-2", topic: "3.2", title: "Traversing an expression tree", lang: "text",
    intro: T2 + "\n\nThis expression tree represents `7 * (2 + 3) - 4`. Use `*` for × and `-` for −.",
    code: "pre-order  : Node, Left, Right\nin-order   : Left, Node, Right\npost-order : Left, Right, Node",
    columns: ["Question", "Answer"],
    prefill: [["Pre-order (prefix)", ""], ["In-order (infix, no brackets)", ""], ["Post-order (RPN)", ""], ["Value of the expression", ""]],
    rows: [["Pre-order (prefix)", "-*7+234"], ["In-order (infix, no brackets)", "7*2+3-4"], ["Post-order (RPN)", "723+*4-"], ["Value of the expression", "31"]],
    instructions: "Type tokens separated by spaces (spaces are ignored when checking).",
    hint: "Post-order puts each operator after both of its operands: 2 3 + first, then 7 (2 3 +) *, then 4 −.",
    note: "Pre: `- * 7 + 2 3 4` · In: `7 * 2 + 3 - 4` (needs brackets to keep its meaning) · Post: `7 2 3 + * 4 -` · Value: 7 × 5 − 4 = **31**."
  });
})();
