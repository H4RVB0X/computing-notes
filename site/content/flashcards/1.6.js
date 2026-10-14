CS.registerFlashcards("1.6", [
  { front: "Three things stored in a stack frame (AQA).", back: "Return address · parameters · local variables" },
  { front: "What happens to the call stack on a subroutine call and on return?", back: "Call: a frame is pushed. Return: the frame is popped, the value passed back, execution resumes at the return address." },
  { front: "Two essential features of a recursive subroutine.", back: "A base case (no recursive call, ends it) and a general case that calls itself on a smaller problem moving towards the base case." },
  { front: "Recursive factorial in pseudocode.", back: "IF n <= 1 THEN RETURN 1 ELSE RETURN n * factorial(n − 1)" },
  { front: "Recursive Fibonacci: calls made by fib(4)? max stack depth?", back: "9 calls; maximum depth 4 frames." },
  { front: "Why does recursion use more memory than iteration?", back: "Every active call has its own stack frame on the call stack until it returns." },
  { front: "Cause of stack overflow in recursion.", back: "No base case, or a base case that is never reached, so frames keep being pushed until the stack is full." },
  { front: "Advantages / disadvantages of recursion.", back: "+ concise, natural for trees/divide-and-conquer/Hanoi.\n− more memory, slower, stack overflow risk, harder to trace." },
  { front: "Output before vs after the recursive call?", back: "Before → happens on the way down (n, n−1, …). After → happens while unwinding (reverse order)." },
]);
