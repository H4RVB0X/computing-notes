CS.registerFlashcards("4.8", [
  { front: "Five components of a Turing machine?", back: "Finite set of states (start + halting), finite alphabet (with blank □), infinite tape, read-write head (moves one cell L/R), transition rules (δ)." },
  { front: "Format of a TM transition rule?", back: "δ(current state, symbol read) = (next state, symbol written, move L/R)" },
  { front: "Diagram label for δ(S0, 1) = (S1, 0, R)?", back: "An arrow from S0 to S1 labelled **1/0, R** (read/write, move)." },
  { front: "Order of actions in one TM step?", back: "Read → find the matching rule → write → move one cell → change state. Always write before moving." },
  { front: "How do you recognise a halting state?", back: "It has no outgoing transitions (no rules start from it); entering it stops the machine." },
  { front: "Why is a TM more powerful than an FSM?", back: "Its infinite read-write tape gives unlimited memory (e.g. it can match 0ⁿ1ⁿ); an FSM has only finitely many states." },
  { front: "What is a Universal Turing machine?", back: "One TM that reads another TM's description (rules) and input from its tape and simulates it: an interpreter. NOT many machines working together." },
  { front: "Why do TMs and the UTM matter?", back: "UTM → stored-program / general-purpose computers (programs are data). TMs define what is computable (Church–Turing thesis) and let us prove limits such as the halting problem." },
  { front: "Bit inverter rules?", back: "δ(S0,0)=(S0,1,R); δ(S0,1)=(S0,0,R); δ(S0,□)=(H,□,L)" },
]);
