CS.registerFlashcards("7.4", [
  { front: "Four sources of interrupts (with an example each)", back: "**I/O device** (key pressed, printer out of paper) · **timer** (time slice over) · **software** (system call, divide by zero) · **hardware failure** (power loss, memory error)." },
  { front: "When does the processor check for interrupts?", back: "At the **end of each fetch–execute cycle** (before the next fetch), so the current instruction always completes." },
  { front: "Steps to service an interrupt", back: "1. Finish current cycle\n2. Higher priority? → save **PC, status register, registers** on the **stack**\n3. **PC ← ISR start address** (vector table)\n4. Run ISR\n5. **Restore** registers from stack\n6. Resume program" },
  { front: "Why save the volatile environment?", back: "The ISR **overwrites the registers** (PC, flags, general-purpose). Saving them lets the interrupted program **resume exactly where it stopped** with the same data." },
  { front: "Why use a stack to save registers during interrupts?", back: "Interrupts can be **nested**; the most recent must finish first, so states are restored in **reverse order** — **LIFO**." },
  { front: "What is a vectored interrupt?", back: "Each interrupt type has an entry in an **interrupt vector table** giving the **start address of its ISR**, which is loaded into the PC." },
  { front: "Why don't 4 cores give 4 × the speed?", back: "Some tasks **can't be split** (dependencies); **overheads** of dividing/combining work; cores **share** buses, RAM and cache; software must be **multi-threaded**." },
  { front: "Address bus width vs data bus width", back: "**Address bus** n bits → **2ⁿ addressable locations** (more RAM usable).\n**Data bus** n bits → **n bits per transfer** (fewer transfers)." },
  { front: "How does cache improve performance?", back: "Small, fast memory near the processor holding copies of recently/frequently used data and instructions. **Hits** avoid slow RAM accesses. Works because of **locality** of reference." },
  { front: "Limits of increasing clock speed", back: "More **heat**/power; instructions take **several cycles**; processor may be **waiting for memory**, so extra cycles are wasted." },
]);
