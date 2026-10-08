CS.registerFlashcards("2.3", [
  { front: "What are the five stack operations named in the AQA specification?", back: "push, pop, peek (or top), test for empty, test for full" },
  { front: "In pseudocode, what are the steps of **push(item)** on an array-based stack?", back: "1. IF isFull THEN report overflow\n2. top ← top + 1\n3. stack[top] ← item" },
  { front: "In pseudocode, what are the steps of **pop()** on an array-based stack?", back: "1. IF isEmpty THEN report underflow\n2. item ← stack[top]\n3. top ← top − 1\n4. RETURN item" },
  { front: "0-indexed array stack: what value of `top` means empty, and what means full?", back: "Empty: top = −1.  Full: top = MAX − 1." },
  { front: "Give four uses of a stack inside a computer system.", back: "Call stack (return addresses, parameters, locals) for subroutines/recursion · saving registers on an interrupt · evaluating Reverse Polish notation · depth-first search backtracking" },
  { front: "After push(3), push(8), pop(), push(5), what is on the stack (bottom → top)?", back: "3, 5 — the pop removed 8, then 5 was pushed on top of 3." },
  { front: "Why is a stack described as an abstract data type?", back: "Because it is defined by its operations and behaviour (LIFO interface), not by how it is implemented (array or linked list)." },
]);
