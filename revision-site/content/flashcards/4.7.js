CS.registerFlashcards("4.7", [
  { front: "Tractable vs intractable?", back: "Tractable: a polynomial (or better) time solution exists. Intractable: no polynomial-time solution; solvable only for small inputs in practice." },
  { front: "Intractable vs non-computable?", back: "Intractable: an algorithm exists but is too slow (exponential+). Non-computable: **no algorithm can exist** (e.g. the halting problem)." },
  { front: "What is a heuristic? Give one for TSP.", back: "A rule of thumb giving a good-enough answer in reasonable time, not guaranteed optimal. Nearest neighbour: always travel to the closest unvisited town." },
  { front: "State the halting problem.", back: "Is there an algorithm that can determine, for **any** program and input, whether the program will eventually halt? Turing (1936): **no**." },
  { front: "Significance of the halting problem?", back: "Some problems cannot be solved algorithmically: there are limits to computation that no hardware can overcome." },
  { front: "Outline Turing's proof idea.", back: "Assume halts(P, I) exists. Build trouble(P): if halts(P, P) then loop forever, else halt. trouble(trouble) contradicts whatever halts predicts, so halts can't exist." },
  { front: "Number of distinct TSP routes for n towns (fixed start, direction ignored)?", back: "(n − 1)!/2. E.g. 5 towns → 12, 6 towns → 60." },
  { front: "Effect of a 1000× faster computer on O(n²) vs O(2ⁿ)?", back: "O(n²): about 32× larger input (√1000). O(2ⁿ): only about 10 more items (2¹⁰ ≈ 1000)." },
]);
