CS.registerTrace({
  "id": "6.5-1",
  "topic": "6.5",
  "title": "Prove De Morgan's second law: ¬(A.B) = ¬A + ¬B",
  "lang": "text",
  "code": "Prove:  ¬(A.B)  =  ¬A + ¬B",
  "intro": "Complete the truth table. If the columns ¬(A.B) and ¬A + ¬B are identical in every row, the law is proved.",
  "columns": [
    "A",
    "B",
    "A.B",
    "¬(A.B)",
    "¬A",
    "¬B",
    "¬A + ¬B"
  ],
  "rows": [
    [
      "0",
      "0",
      "0",
      "1",
      "1",
      "1",
      "1"
    ],
    [
      "0",
      "1",
      "0",
      "1",
      "1",
      "0",
      "1"
    ],
    [
      "1",
      "0",
      "0",
      "1",
      "0",
      "1",
      "1"
    ],
    [
      "1",
      "1",
      "1",
      "0",
      "0",
      "0",
      "0"
    ]
  ],
  "prefill": [
    [
      "0",
      "0",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "0",
      "1",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "0",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "1",
      "",
      "",
      "",
      "",
      ""
    ]
  ],
  "hint": "¬(A.B) is the NAND column: 0 only when both inputs are 1.",
  "note": "Both columns read 1, 1, 1, 0, so the expressions are equivalent: a NAND gate is the same as an OR gate with inverted inputs.",
  "instructions": "Fill in every empty cell with 0 or 1. Work one column at a time, left to right; each column only needs values from columns to its left."
});

CS.registerTrace({
  "id": "6.5-2",
  "topic": "6.5",
  "title": "Check (A + B).(¬A + C) = A.C + ¬A.B",
  "lang": "text",
  "code": "Q   = (A + B).(¬A + C)\nQ'  = A.C + ¬A.B      (claimed simplification)",
  "intro": "Worked example 11 claims these are equivalent. Prove it: the last two columns must match on all 8 rows.",
  "columns": [
    "A",
    "B",
    "C",
    "A + B",
    "¬A",
    "¬A + C",
    "Q",
    "A.C + ¬A.B"
  ],
  "rows": [
    [
      "0",
      "0",
      "0",
      "0",
      "1",
      "1",
      "0",
      "0"
    ],
    [
      "0",
      "0",
      "1",
      "0",
      "1",
      "1",
      "0",
      "0"
    ],
    [
      "0",
      "1",
      "0",
      "1",
      "1",
      "1",
      "1",
      "1"
    ],
    [
      "0",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1",
      "1"
    ],
    [
      "1",
      "0",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0"
    ],
    [
      "1",
      "0",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1"
    ],
    [
      "1",
      "1",
      "0",
      "1",
      "0",
      "0",
      "0",
      "0"
    ],
    [
      "1",
      "1",
      "1",
      "1",
      "0",
      "1",
      "1",
      "1"
    ]
  ],
  "prefill": [
    [
      "0",
      "0",
      "0",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "0",
      "0",
      "1",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "0",
      "1",
      "0",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "0",
      "1",
      "1",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "0",
      "0",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "0",
      "1",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "1",
      "0",
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "1",
      "1",
      "",
      "",
      "",
      "",
      ""
    ]
  ],
  "hint": "When A = 0 the expression reduces to B; when A = 1 it reduces to C. Use that to check your Q column.",
  "note": "The Q column and the simplified column are both 0,0,1,1,0,1,0,1 — the simplification is correct.",
  "instructions": "Fill in every empty cell with 0 or 1. Work one column at a time, left to right; each column only needs values from columns to its left."
});

CS.registerTrace({
  "id": "6.5-3",
  "topic": "6.5",
  "title": "Absorption check: A + ¬A.B = A + B",
  "lang": "text",
  "code": "Q  = A + ¬A.B\nQ' = A + B",
  "intro": "Show with a truth table that A + ¬A.B simplifies to A + B (and not to B, as one textbook answer claims).",
  "columns": [
    "A",
    "B",
    "¬A",
    "¬A.B",
    "A + ¬A.B",
    "A + B"
  ],
  "rows": [
    [
      "0",
      "0",
      "1",
      "0",
      "0",
      "0"
    ],
    [
      "0",
      "1",
      "1",
      "1",
      "1",
      "1"
    ],
    [
      "1",
      "0",
      "0",
      "0",
      "1",
      "1"
    ],
    [
      "1",
      "1",
      "0",
      "0",
      "1",
      "1"
    ]
  ],
  "prefill": [
    [
      "0",
      "0",
      "",
      "",
      "",
      ""
    ],
    [
      "0",
      "1",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "0",
      "",
      "",
      "",
      ""
    ],
    [
      "1",
      "1",
      "",
      "",
      "",
      ""
    ]
  ],
  "hint": "Look at the row A = 1, B = 0. What does B alone give there?",
  "note": "The two final columns match (0, 1, 1, 1). B alone would give 0 in row A = 1, B = 0, so 'B' is wrong.",
  "instructions": "Fill in every empty cell with 0 or 1. Work one column at a time, left to right; each column only needs values from columns to its left."
});
