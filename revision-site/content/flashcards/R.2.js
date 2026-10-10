(function () {
  const o = (s) => "<span style='text-decoration:overline'>" + s + "</span>";
  CS.registerFlashcards("R.2", [
    { front: "Truth table outputs (rows 00, 01, 10, 11) for AND, OR, XOR, NAND, NOR?", back: "AND 0001 · OR 0111 · XOR 0110 · NAND 1110 · NOR 1000" },
    { front: "De Morgan's laws?", back: o("A.B") + " = " + o("A") + " + " + o("B") + " and " + o("A + B") + " = " + o("A") + "." + o("B") + ". Break the bar, change the sign." },
    { front: "Absorption laws?", back: "A + A.B = A and A.(A + B) = A" },
    { front: "Both distributive laws?", back: "A.(B + C) = A.B + A.C and A + B.C = (A + B).(A + C)" },
    { front: "Identity, null, idempotent and complement laws?", back: "A.1 = A, A + 0 = A · A.0 = 0, A + 1 = 1 · A.A = A, A + A = A · A." + o("A") + " = 0, A + " + o("A") + " = 1" },
    { front: "Half adder outputs?", back: "S = A ⊕ B, C = A.B" },
    { front: "Full adder outputs?", back: "S = A ⊕ B ⊕ C<sub>in</sub>, C<sub>out</sub> = A.B + C<sub>in</sub>.(A ⊕ B). Built from two half adders and an OR gate." },
    { front: "What does an edge-triggered D-type flip-flop do?", back: "On the rising clock edge Q takes the value of D; at all other times Q holds. Stores 1 bit; used in registers and memory." },
    { front: "A + " + o("A") + ".B simplifies to?", back: "A + B" },
    { front: "Order of precedence in Boolean expressions?", back: "Brackets, NOT, AND, OR" },
  ]);
})();
