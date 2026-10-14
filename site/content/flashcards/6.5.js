CS.registerFlashcards("6.5", [
  { front: "De Morgan's laws?", back: "<span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>  and  <span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span>. Break the bar, change the operator." },
  { front: "Absorption laws?", back: "A + A.B = A  and  A.(A + B) = A" },
  { front: "Both distributive laws?", back: "A.(B + C) = A.B + A.C  and  A + B.C = (A + B).(A + C)" },
  { front: "Simplify A + ¬A.B", back: "A + B  (distributive, complement, identity)" },
  { front: "Simplify A.(¬A + B)", back: "A.B  (distributive, complement, identity)" },
  { front: "Null (annulment) and identity laws?", back: "Null: A.0 = 0, A + 1 = 1. Identity: A.1 = A, A + 0 = A." },
  { front: "XOR as AND/OR/NOT?", back: "A ⊕ B = A.<span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>A</span>.B" },
  { front: "Simplification strategy (5 steps)?", back: "De Morgan to remove long bars → expand brackets → tidy (complement/idempotent/identity) → factorise → absorb. Then check with a truth table." },
  { front: "Apply De Morgan to ¬(A + B.C)", back: "¬A.(¬B + ¬C) — keep the brackets." },
  { front: "Why simplify a Boolean expression?", back: "Fewer gates → cheaper, smaller, less power and heat, faster (less propagation delay)." },
]);
