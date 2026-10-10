CS.registerFlashcards("4.2", [
  { front: "When does an FSM (with no output) accept a string?", back: "When, after **every** symbol has been read, it is in an **accepting state**. Passing through one earlier doesn't count." },
  { front: "Symbols on a state transition diagram?", back: "Circle = state; labelled arrow = transition; arrow from nowhere = start state; double circle = accepting state; `in/out` label = Mealy transition." },
  { front: "FSM for 'even number of 0s' as a table?", back: "S0 (start, accepting): 0 → S1, 1 → S0.  S1: 0 → S0, 1 → S1." },
  { front: "What is a Mealy machine?", back: "An FSM with output on each transition (`input/output`); output depends on the current state and the input. One output per input. Usually no accepting states." },
  { front: "Method for designing an FSM?", back: "Give each state a meaning (what it remembers) → mark start and accepting states → a transition for every symbol from every state → trap state if needed → test accept/reject/empty strings." },
  { front: "Why can't an FSM check 0ⁿ1ⁿ or nested brackets?", back: "Its only memory is its current state, and it has finitely many. Unbounded counting needs unboundedly many states." },
  { front: "Trace 'abbab' through the 'ends in ab' FSM.", back: "S0 –a→ S1 –b→ S2 –b→ S0 –a→ S1 –b→ S2. Accepted." },
  { front: "How many transitions does a complete deterministic FSM with s states and k input symbols have?", back: "s × k (one for every state/input pair)." },
]);
