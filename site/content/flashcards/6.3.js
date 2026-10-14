CS.registerFlashcards("6.3", [
  { front: "Compiler vs interpreter: when does translation happen?", back: "Compiler: once, before running (whole program). Interpreter: every run, statement by statement." },
  { front: "Compiler vs interpreter: error reporting?", back: "Compiler: lists all errors after analysing the whole program; no executable until fixed. Interpreter: stops at the first error it reaches." },
  { front: "Give three advantages of compiling.", back: "Fast execution · source code kept private · user needs no translator" },
  { front: "Give three advantages of interpreting.", back: "Quick to test/debug during development · errors located immediately · same source runs on any platform with an interpreter" },
  { front: "What is bytecode and what executes it?", back: "Platform-independent intermediate code produced by some compilers; executed by a **virtual machine** (interpreted or JIT-compiled)." },
  { front: "Why produce bytecode?", back: "Compile once, run on any platform with a VM (portability) · faster than interpreting source · source not distributed · VM can sandbox code" },
  { front: "What does a JIT compiler do?", back: "Compiles frequently run bytecode into native machine code during execution, so it runs faster." },
  { front: "Three things an assembler does besides translating mnemonics.", back: "Replaces labels with addresses · converts numbers to binary · removes comments" },
  { front: "Name the stages of compilation (awareness).", back: "Lexical analysis → syntax analysis → semantic analysis → code generation → optimisation" },
]);
