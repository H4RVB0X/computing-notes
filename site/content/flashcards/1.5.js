CS.registerFlashcards("1.5", [
  { front: "Spec definition of a subroutine.", back: "A named 'out of line' block of code that may be executed (called) by simply writing its name in a program statement." },
  { front: "Parameter vs argument.", back: "Parameter: variable in the subroutine **definition**. Argument: actual value passed in the **call**." },
  { front: "Two properties of a local variable (spec wording).", back: "Exists only while the subroutine is executing; accessible only within the subroutine." },
  { front: "Four reasons locals are good practice.", back: "No side effects/accidental changes · subroutine self-contained & testable/reusable · names can be reused · memory released on return" },
  { front: "Six advantages of subroutines.", back: "Reuse · decomposition · independent testing · team working · readability/maintenance · libraries" },
  { front: "By value vs by reference.", back: "By value: a copy is passed; caller's variable can't change. By reference: address passed; subroutine can change caller's variable." },
  { front: "What is a subroutine interface?", back: "Its identifier, parameters (number, order, types) and return value(s)." },
  { front: "How does Python change a global from inside a function?", back: "Declare `global name` in the function first; otherwise assignment creates a new local." },
]);
