CS.registerFlashcards("6.4", [
  { front: "Output columns (AB = 00, 01, 10, 11) for AND, OR, XOR, NAND, NOR?", back: "AND 0001 · OR 0111 · XOR 0110 · NAND 1110 · NOR 1000" },
  { front: "How many rows in a truth table with n inputs?", back: "2<sup>n</sup> (e.g. 3 inputs → 8 rows)" },
  { front: "Boolean operator precedence?", back: "Brackets (and bars) → NOT → AND → OR/XOR" },
  { front: "Half adder expressions?", back: "S = A ⊕ B, C = A.B" },
  { front: "How is a full adder built?", back: "Two half adders and an OR gate: S1 = A ⊕ B, C1 = A.B; S = S1 ⊕ Cin, C2 = S1.Cin; Cout = C1 + C2." },
  { front: "Quick rule for full adder outputs?", back: "S = 1 if an **odd** number of inputs are 1. Cout = 1 if **two or more** inputs are 1." },
  { front: "What does an edge-triggered D-type flip-flop do?", back: "On the **rising edge** of the clock, Q takes the value of D; at all other times Q holds its value. It stores 1 bit." },
  { front: "Uses of D-type flip-flops?", back: "Storing a bit · registers (n flip-flops sharing a clock) · shift registers and counters · synchronising data to the clock" },
  { front: "Make NOT, AND and OR from NAND gates only.", back: "NOT A = A NAND A · AND = NAND then NOT (NAND) · OR = NOT each input (NAND), then NAND" },
  { front: "Combinational vs sequential circuit?", back: "Combinational: output depends only on current inputs (adders). Sequential: output also depends on previous state (flip-flops)." },
]);
