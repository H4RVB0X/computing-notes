CS.registerTrace({
  id: "2.5-1",
  topic: "2.5",
  title: "Inserting into a binary search tree stored in three arrays",
  lang: "pseudocode",
  code: "# before the calls:\n# index: 0    1    2\n# data:  M    D    T\n# left:  1   -1   -1\n# right: 2   -1   -1\n# free = 3\ninsert(\"P\")\ninsert(\"B\")\ninsert(\"R\")",
  intro: "Use the `insert` algorithm on this page. For each call, list the **indices** of the nodes compared (starting at the root, index 0), the index of the node whose pointer is changed, whether its **L**eft or **R**ight pointer is set, and the value of `free` afterwards.",
  columns: ["item", "indices compared", "parent index", "L or R", "free after"],
  prefill: [
    ["P", "", "", "", ""],
    ["B", "", "", "", ""],
    ["R", "", "", "", ""],
  ],
  rows: [
    ["P", "0,2", "2", "L", "4"],
    ["B", "0,1", "1", "L", "5"],
    ["R", "0,2,3", "3", "R", "6"],
  ],
  instructions: "Write the indices compared as a comma-separated list, e.g. 0,2.",
  hint: "P > M so go right to index 2 (T). P < T and left[2] = −1, so left[2] ← 3. For R, remember P is now at index 3.",
  note: "Final arrays: data = M, D, T, P, B, R · left = 1, 4, 3, −1, −1, −1 · right = 2, −1, −1, 5, −1, −1. In-order traversal gives B, D, M, P, R, T.",
});
