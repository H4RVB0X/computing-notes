CS.registerTrace({
  id: "3.4-1", topic: "3.4", title: "Binary search for an item that is not there", lang: "pseudocode",
  intro: "items = `[5, 9, 11, 15, 23, 45, 54, 58, 61]` (indexes 0 to 8). Search for **16**.",
  code: "low ← 0\nhigh ← LEN(items) - 1\nWHILE low ≤ high\n    mid ← (low + high) DIV 2\n    IF items[mid] = target THEN\n        RETURN mid\n    ELSE IF items[mid] < target THEN\n        low ← mid + 1\n    ELSE\n        high ← mid - 1\n    ENDIF\nENDWHILE\nRETURN -1",
  columns: ["low", "high", "mid", "items[mid]", "items[mid] compared with 16"],
  rows: [["0", "8", "4", "23", "greater"], ["0", "3", "1", "9", "less"], ["2", "3", "2", "11", "less"], ["3", "3", "3", "15", "less"], ["4", "3", "", "", "stop"]],
  instructions: "One row per iteration, showing low and high at the start of the iteration. In the last column write greater, less or equal. The final row shows low and high when the loop ends; write stop in the last column and leave mid blank.",
  hint: "(0 + 8) DIV 2 = 4. 23 is greater than 16, so high becomes 3. Then (0 + 3) DIV 2 = 1.",
  note: "Four comparisons, then low (4) > high (3) so the function returns −1. The maximum for 9 items is ⌊log₂ 9⌋ + 1 = 4."
});
CS.registerTrace({
  id: "3.4-2", topic: "3.4", title: "Binary tree search", lang: "pseudocode",
  intro: "The BST was built by inserting **45, 32, 2, 78, 5, 9, 38, 23, 6** in that order (draw it first). Search for **23**.",
  code: "SUBROUTINE treeSearch(node, target)\n    IF node = Null THEN\n        RETURN False\n    ELSE IF target = node.data THEN\n        RETURN True\n    ELSE IF target < node.data THEN\n        RETURN treeSearch(node.left, target)\n    ELSE\n        RETURN treeSearch(node.right, target)\n    ENDIF\nENDSUBROUTINE",
  columns: ["Comparison", "node.data", "target vs node.data", "Next move"],
  prefill: [["1", "", "", ""], ["2", "", "", ""], ["3", "", "", ""], ["4", "", "", ""], ["5", "", "", ""], ["6", "", "", ""]],
  rows: [["1", "45", "less", "left"], ["2", "32", "less", "left"], ["3", "2", "greater", "right"], ["4", "5", "greater", "right"], ["5", "9", "greater", "right"], ["6", "23", "equal", "found"]],
  instructions: "Third column: less, greater or equal. Fourth column: left, right or found.",
  hint: "2 has no left child; 5 is its right child, 9 is 5's right child, and 9 has children 6 (left) and 23 (right).",
  note: "Six comparisons: this branch of the tree is long because 2, 5, 9 were inserted in increasing order. A balanced tree of 9 nodes would need at most 4."
});
