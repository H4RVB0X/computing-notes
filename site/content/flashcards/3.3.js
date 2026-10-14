CS.registerFlashcards("3.3", [
  { front: "Algorithm to evaluate RPN with a stack", back: "Left to right. Operand → push. Operator → pop right, pop left, push `left op right`. End → pop the answer." },
  { front: "Shunting-yard rules (infix → RPN)", back: "Operand → output · `(` → push · `)` → pop to output until `(`, discard it · operator → pop higher-or-equal precedence first, then push · end → pop all" },
  { front: "Give three reasons RPN is used", back: "No brackets · no precedence rules · evaluated left to right with a stack in one pass · maps onto stack-based machine code/bytecode" },
  { front: "Where is RPN used?", back: "Compilers/interpreters generating code for expressions; stack machines (JVM bytecode); PostScript, Forth; HP calculators" },
  { front: "Convert `((300 + 23) * (43 - 21)) / (84 + 21)` to RPN", back: "`300 23 + 43 21 - * 84 21 + /`" },
  { front: "Quick check that an infix ↔ RPN conversion is right", back: "Operands must be in the **same order**; with binary operators there is exactly **one more operand than operators**; evaluate both with numbers." },
  { front: "`3 + 4 * 2` and `(3 + 4) * 2` in RPN", back: "`3 4 2 * +` (= 11) and `3 4 + 2 *` (= 14)" },
]);
