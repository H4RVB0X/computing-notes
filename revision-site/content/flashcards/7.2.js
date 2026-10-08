CS.registerFlashcards("7.2", [
  { front: "AQA definition of the stored program concept", back: "Machine code instructions stored in main memory are fetched and executed serially by a processor that performs arithmetic and logical operations." },
  { front: "Fetch stage in register transfer notation", back: "MAR ← [PC]\nPC ← [PC] + 1\nMBR ← [[MAR]]\nCIR ← [MBR]" },
  { front: "PC vs CIR", back: "PC: **address** of the next instruction. CIR: the **instruction** currently being decoded/executed." },
  { front: "MAR vs MBR", back: "MAR: an **address** (connected to the address bus). MBR/MDR: **data or an instruction** moving to/from memory (connected to the data bus)." },
  { front: "Four things the ALU does", back: "Arithmetic (add, subtract), logic (AND, OR, NOT, XOR), comparisons (setting flags), shifts." },
  { front: "What does the decode stage do?", back: "The control unit splits the instruction in the CIR into opcode and operand(s) and works out what to do and which addressing mode is used." },
  { front: "How does a branch instruction change the flow of the program?", back: "During execute it overwrites the PC with the target address, so the next fetch comes from there." },
  { front: "Name four flags that may be in the status register.", back: "Zero (Z), Negative (N), Carry (C), Overflow (V) — and Interrupt enable (I)." },
]);
