(function () {
  const o = (s) => "<span style='text-decoration:overline'>" + s + "</span>";
  CS.registerExam("R.2", [
    { marks: 3, q: "Complete a truth table for Q = A ⊕ B and Q = " + o("A + B") + " for all combinations of A and B.", scheme: ["All four input rows listed correctly (00, 01, 10, 11)", "A ⊕ B column: 0, 1, 1, 0", "NOR column: 1, 0, 0, 0"] },
    { marks: 3, q: "Using Boolean algebra, simplify A.B + A." + o("B") + " + " + o("A") + ".B. Show your working.", scheme: ["A.(B + " + o("B") + ") + " + o("A") + ".B = A + " + o("A") + ".B", "= (A + " + o("A") + ").(A + B)", "= A + B"], model: "A.B + A." + o("B") + " = A.(B + " + o("B") + ") = A.1 = A. Then A + " + o("A") + ".B = (A + " + o("A") + ").(A + B) = 1.(A + B) = **A + B**." },
    { marks: 3, q: "Using De Morgan's laws, show that " + o("A.B + C") + " = (" + o("A") + " + " + o("B") + ")." + o("C") + ".", scheme: ["Applies De Morgan to the OR: " + o("A.B") + "." + o("C"), "Applies De Morgan to " + o("A.B") + ": " + o("A") + " + " + o("B"), "Correct final form (" + o("A") + " + " + o("B") + ")." + o("C")] },
    { marks: 4, q: "Describe the purpose of a full adder, and write Boolean expressions for its outputs.", scheme: ["Adds three bits: A, B and a carry-in", "Produces a sum bit and a carry-out bit / can be chained to add multi-bit numbers", "S = A ⊕ B ⊕ C<sub>in</sub>", "C<sub>out</sub> = A.B + C<sub>in</sub>.(A ⊕ B)"] },
    { marks: 3, q: "Explain how an edge-triggered D-type flip-flop operates and give one use.", scheme: ["Output Q only changes on the rising (or falling) edge of the clock", "At the edge Q takes the value of the D input; otherwise Q holds its value", "Stores one bit, e.g. used to build registers / memory / frequency dividers"] },
    { marks: 4, q: "Using Boolean algebra, simplify (A + B).(A + " + o("B") + "). Name the law used at each step.", scheme: ["Expands: A.A + A." + o("B") + " + B.A + B." + o("B") + " (distributive)", "A.A = A (idempotent) and B." + o("B") + " = 0 (complement)", "A + A." + o("B") + " + A.B (identity: + 0)", "= A (absorption)"] },
  ]);
})();
