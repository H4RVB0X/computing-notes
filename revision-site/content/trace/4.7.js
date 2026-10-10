CS.registerTrace({
  id: "4.7-1",
  topic: "4.7",
  title: "Nearest-neighbour heuristic from town C",
  lang: "text",
  code: "     A   B   C   D   E\nA    -   2   9  10   7\nB    2   -   6   4   3\nC    9   6   -   8   5\nD   10   4   8   -   9\nE    7   3   5   9   -\n\nStart at C. Repeatedly move to the nearest town not yet visited.\nWhen every town has been visited, return to C.",
  intro: "Apply the **nearest neighbour** heuristic to the five-town table, starting from **C** this time.",
  columns: ["Step", "Current town", "Next town", "Distance", "Running total"],
  prefill: [["1", "C", "", "", ""], ["2", "", "", "", ""], ["3", "", "", "", ""], ["4", "", "", "", ""], ["5 (return)", "", "C", "", ""]],
  rows: [["1", "C", "E", "5", "5"], ["2", "E", "B", "3", "8"], ["3", "B", "A", "2", "10"], ["4", "A", "D", "10", "20"], ["5 (return)", "D", "C", "8", "28"]],
  instructions: "For each step write the town you're in, the nearest unvisited town, the distance and the running total.",
  hint: "From B the unvisited towns are A (2) and D (4).",
  note: "Route C E B A D C, length **28**. The optimal tour is 26 (e.g. C D B A E C), so the heuristic is quick but not guaranteed optimal. Notice the forced long hop A → D (10) near the end: a typical weakness of greedy heuristics.",
});
