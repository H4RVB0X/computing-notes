CS.registerFlashcards("7.3", [
  { front: "Instruction set", back: "All the machine code instructions a particular processor can execute. **Processor specific**." },
  { front: "Opcode vs operand", back: "**Opcode**: the operation to perform (plus the addressing mode). **Operand**: the value, register or address it operates on." },
  { front: "Immediate addressing", back: "The operand **is** the value. AQA syntax `#n`, e.g. `ADD R1, R1, #10`." },
  { front: "Direct addressing", back: "The operand is the **memory address** of the value, e.g. `LDR R1, 10` loads the contents of address 10." },
  { front: "n bits of operand → how many addresses? Highest address?", back: "2ⁿ addresses, numbered 0 to **2ⁿ − 1**." },
  { front: "Which AQA instructions access memory?", back: "Only **LDR** (load) and **STR** (store). Everything else works on registers or immediate values." },
  { front: "AND / ORR / EOR with a mask", back: "**AND**: keep bits where mask = 1, clear the rest. **ORR**: set bits where mask = 1. **EOR**: flip bits where mask = 1." },
  { front: "LSL / LSR by n places", back: "LSL: × 2ⁿ (overflow if 1s fall off the left). LSR: ÷ 2ⁿ rounded down (unsigned)." },
  { front: "How do you write IF…ELSE in assembly?", back: "CMP, then a conditional branch to the THEN code; ELSE code follows directly and ends with **B** past the THEN code." },
  { front: "Conditional branch mnemonics", back: "BEQ equal · BNE not equal · BGT greater than · BLT less than (all based on the last CMP)." },
]);
