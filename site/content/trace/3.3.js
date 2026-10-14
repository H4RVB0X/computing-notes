CS.registerTrace({
  id: "3.3-1", topic: "3.3", title: "Infix → RPN with an operator stack", lang: "text",
  intro: "Convert `(a + b) * c - d / e` using the shunting-yard rules. Precedence: `*` `/` higher than `+` `-`. An arriving operator first pops any operator of **higher or equal** precedence.",
  code: "Expression: ( a + b ) * c - d / e",
  columns: ["Token", "Operator stack (bottom→top)", "Output so far"],
  prefill: [["(", "", ""], ["a", "", ""], ["+", "", ""], ["b", "", ""], [")", "", ""], ["*", "", ""], ["c", "", ""], ["-", "", ""], ["d", "", ""], ["/", "", ""], ["e", "", ""], ["end", "", ""]],
  rows: [["(", "(", ""], ["a", "(", "a"], ["+", "(+", "a"], ["b", "(+", "ab"], [")", "", "ab+"], ["*", "*", "ab+"], ["c", "*", "ab+c"], ["-", "-", "ab+c*"], ["d", "-", "ab+c*d"], ["/", "-/", "ab+c*d"], ["e", "-/", "ab+c*de"], ["end", "", "ab+c*de/-"]],
  instructions: "Type stack and output tokens with spaces between them (spaces are ignored when checking). Leave the stack blank when it is empty.",
  hint: "When `-` arrives the top of the stack is `*`, which has higher precedence, so `*` goes to the output first. When `/` arrives the top is `-` (lower), so `/` is simply pushed.",
  note: "Result: **`a b + c * d e / -`**. Check: the operands a b c d e are still in their original order."
});
CS.registerTrace({
  id: "3.3-2", topic: "3.3", title: "Evaluating RPN with a stack", lang: "text",
  intro: "Evaluate `6 2 3 + - 3 8 2 / + *`. Remember: the **first** value popped is the **right** operand.",
  code: "6 2 3 + - 3 8 2 / + *",
  columns: ["Token", "Stack after token (bottom→top)"],
  prefill: [["6", ""], ["2", ""], ["3", ""], ["+", ""], ["-", ""], ["3", ""], ["8", ""], ["2", ""], ["/", ""], ["+", ""], ["*", ""]],
  rows: [["6", "6"], ["2", "6,2"], ["3", "6,2,3"], ["+", "6,5"], ["-", "1"], ["3", "1,3"], ["8", "1,3,8"], ["2", "1,3,8,2"], ["/", "1,3,4"], ["+", "1,7"], ["*", "7"]],
  instructions: "Write the stack as comma-separated values from bottom to top, e.g. 6,2,3.",
  hint: "At `-` the stack is 6,5: pop 5 (right), pop 6 (left), push 6 − 5 = 1.",
  note: "Result **7**. Infix: `(6 - (2 + 3)) * (3 + 8 / 2)`."
});
