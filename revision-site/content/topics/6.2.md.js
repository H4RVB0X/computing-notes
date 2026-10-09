CS.registerTopic({ id: "6.2", title: "Classification of programming languages" }, function () {/*

:::objectives
- Outline how programming languages developed from machine code to assembly language to high-level languages.
- Classify languages as **low-level** (machine code, assembly language) or **high-level**.
- Describe **machine code** and **assembly language**, including **mnemonics**, **opcodes**, **operands** and the **one-to-one** relationship.
- Explain what an **imperative high-level language** is and how its statements relate to machine code (**one-to-many**).
- Compare low-level and high-level languages: speed, memory, portability, hardware access, ease of writing and maintaining.
:::

:::quick At a glance
- **Low-level languages** are **machine-oriented**: written for one processor's **instruction set**. Two kinds: **machine code** and **assembly language**.
- **Machine code** = binary instructions the processor executes directly (often shown in hex). Each instruction = **opcode** + **operand(s)**.
- **Assembly language** replaces binary opcodes with **mnemonics** (`ADD`, `LDR`, `B`) and allows labels. **One assembly instruction → one machine code instruction**. Needs an **assembler**.
- **High-level languages** are **problem-oriented**: English-like keywords, variables, selection, iteration, subroutines, data structures. **Portable** across processors.
- **Imperative** high-level language: the program is a **sequence of statements (commands)** that say **how** to solve the problem, changing the program's **state** step by step. Python, C, Java, VB.NET.
- **One high-level statement → many machine code instructions**. Must be compiled or interpreted.
- Low-level: fast, compact, direct hardware/register access, but hard to write, debug and maintain, and **not portable**.
:::

:::keyterms
Low-level language :: A language whose instructions correspond closely to the processor's instruction set; machine code and assembly language. :: Close to the hardware.
Machine code :: Binary instructions that the processor can execute directly, without translation. :: Raw 1s and 0s the CPU runs.
Assembly language :: A low-level language that uses mnemonics to represent machine code instructions, each assembly instruction usually translating to exactly one machine code instruction. :: Machine code written with short words.
Mnemonic :: A short, memorable abbreviation used in assembly language to represent an opcode, e.g. ADD, LDR, CMP. :: Nickname for an instruction.
Opcode :: The part of a machine code instruction that specifies the operation to be performed (and, in some formats, the addressing mode). :: What to do.
Operand :: The part of an instruction that holds the data, a register or a memory address the operation will use. :: What to do it to.
Instruction set :: The complete set of machine code instructions that a particular processor (or processor family) can execute. :: The processor's vocabulary.
High-level language :: A problem-oriented programming language using English-like statements and abstractions, independent of any particular processor. :: Languages like Python.
Imperative language :: A high-level language in which a program is a sequence of statements/commands that change the program's state, telling the computer how to solve the problem step by step. :: Do this, then this, then this.
Machine-oriented :: Designed around the architecture of a particular processor rather than the problem to be solved. :: Fits the chip, not the task.
Problem-oriented :: Designed to express the solution to a problem, independent of the hardware. :: Fits the task, not the chip.
Portability :: The ability of a program to run on different hardware platforms with little or no change. :: Works on other machines.
:::

## How programming languages developed

Programming languages are often grouped into **generations**. Each one added a layer of **abstraction** between the programmer and the hardware.

| Generation | Type | Level | Example | What changed |
|---|---|---|---|---|
| 1st (1940s) | **Machine code** | Low | `0011 0000 1011 0100` | Programmers entered binary directly (switches, punched cards) |
| 2nd (1950s) | **Assembly language** | Low | `ADD R0, R1, R2` | Mnemonics and labels replace binary; an assembler translates |
| 3rd (late 1950s on) | **Imperative high-level** | High | FORTRAN, COBOL, C, Pascal, Python, VB.NET, Java | English-like statements, variables, loops, subroutines; compiler/interpreter translates |
| 4th and declarative | **Declarative / domain-specific** | High | SQL, Prolog, Haskell | Describe **what** result you want, not **how** to get it |

:::history
FORTRAN (1957) was the first widely used high-level language, designed for scientific calculation. Its compiler had to prove that compiled code could run almost as fast as hand-written assembly, or nobody would have used it.
:::

:::note Generations are a rough guide
AQA only requires you to classify languages as **low-level** or **high-level** and to explain **imperative** high-level languages. Generation numbers are useful background, but "4th generation" means different things in different books.
:::

## Low-level languages

Low-level languages are **machine-oriented**: they are defined by the **instruction set** of a processor. Code for an ARM processor will not run on an Intel x86 processor.

### Machine code

- The **only** language a processor can execute **directly**, with **no translation**.
- Each instruction is a binary pattern made of an **opcode** (which operation) and one or more **operands** (data, register numbers or memory addresses).
- Humans usually view it in **hexadecimal** because binary is so hard to read. Hex is just a way of *displaying* the binary.

```text
binary:  0011 0000 1011 0100
hex:     30B4
fields:  [ opcode | operand ]   (the split depends on the processor's instruction format)
```

Writing machine code by hand is slow and error-prone: it is easy to mistype one bit, nothing is named, and nobody else can read your program.

### Assembly language

Assembly language gives every machine code operation a **mnemonic** and lets the programmer use **labels** for memory locations and branch targets. An **assembler** translates it into machine code.

- **One-to-one**: each assembly instruction translates into **exactly one** machine code instruction.
- It is still **processor-specific** (one assembly language per instruction set), so still low-level and not portable.
- The programmer works directly with **registers** and **memory addresses**.

Here is a program that adds 1 + 2 + 3 + 4 + 5 using the AQA assembly language ([7.3](#/topic/7.3)):

```asm
        MOV R0, #0
        MOV R1, #1
loop:   ADD R0, R0, R1
        ADD R1, R1, #1
        CMP R1, #6
        BLT loop
        STR R0, 100
        HALT
```

- `R0` holds the running total, `R1` the counter. `#` means an immediate value.
- `CMP` compares R1 with 6 and `BLT loop` branches back while R1 < 6.
- The result, 15, is stored in memory location 100.

<svg class="diagram" viewBox="0 0 600 210" role="img" aria-label="One high-level statement becomes several machine code instructions, but one assembly instruction becomes exactly one machine code instruction">
<g font-family="inherit">
<defs><marker id="arr65" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="10" y="20" font-size="13" text-anchor="start" font-weight="700">High-level → machine code: one to many</text>
<rect x="10" y="30" width="170" height="36" rx="6" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor"/>
<text x="95" y="53" font-size="13" text-anchor="middle" font-family="monospace">total = a + b</text>
<rect x="300" y="30" width="150" height="22" rx="4" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
<text x="375" y="46" font-size="12" text-anchor="middle" font-family="monospace">LDR R1, a</text>
<line x1="180" y1="48" x2="298" y2="41" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr65)"/>
<rect x="300" y="56" width="150" height="22" rx="4" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
<text x="375" y="72" font-size="12" text-anchor="middle" font-family="monospace">LDR R2, b</text>
<line x1="180" y1="48" x2="298" y2="67" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr65)"/>
<rect x="300" y="82" width="150" height="22" rx="4" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
<text x="375" y="98" font-size="12" text-anchor="middle" font-family="monospace">ADD R0, R1, R2</text>
<line x1="180" y1="48" x2="298" y2="93" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr65)"/>
<rect x="300" y="108" width="150" height="22" rx="4" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
<text x="375" y="124" font-size="12" text-anchor="middle" font-family="monospace">STR R0, total</text>
<line x1="180" y1="48" x2="298" y2="119" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr65)"/>
<text x="470" y="70" font-size="12" text-anchor="start" >4 machine code</text>
<text x="470" y="86" font-size="12" text-anchor="start" >instructions</text>
<text x="10" y="160" font-size="13" text-anchor="start" font-weight="700">Assembly → machine code: one to one</text>
<rect x="10" y="170" width="170" height="30" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
<text x="95" y="190" font-size="13" text-anchor="middle" font-family="monospace">ADD R0, R1, R2</text>
<line x1="180" y1="185" x2="298" y2="185" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr65)"/>
<rect x="300" y="170" width="280" height="30" rx="6" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor"/>
<text x="440" y="190" font-size="12" text-anchor="middle" font-family="monospace">one 32-bit machine instruction</text>
</g>
</svg>
## High-level languages and the imperative paradigm

High-level languages are **problem-oriented**. They provide:
- English-like keywords (`IF`, `WHILE`, `print`) and **named variables** instead of registers and addresses.
- **Control structures** (selection, iteration) and **subroutines** with parameters and local variables.
- **Data types and data structures** (strings, arrays, records, lists).
- **Built-in functions and libraries** (e.g. `print`, `len`, `math.sqrt`).

The same summation in an imperative high-level language:

::::tabs
:::tab Python
```python
total = 0
for counter in range(1, 6):
    total = total + counter
print(total)
```
```output
15
```
:::
:::tab AQA pseudocode
```pseudocode
total ← 0
FOR counter ← 1 TO 5
    total ← total + counter
ENDFOR
OUTPUT total
```
:::
::::

Four short lines instead of eight cryptic ones, and it will run on any machine that has a Python interpreter.

### What "imperative" means

:::definition Imperative high-level language
A language in which the program is a **sequence of instructions (statements)** that are executed **in order**, each one **changing the state** of the program (the values in its variables). The programmer states **how** the problem is solved, step by step.
:::

- "Imperative" comes from the grammar of commands: *do this*, *then do that*.
- Python, C, Pascal, BASIC, Java and VB.NET are imperative. **Procedural** languages (built from procedures/subroutines) are a subset of imperative languages, and most object-oriented languages are imperative too.
- The opposite is **declarative**: you state **what** you want and the system works out how. SQL is declarative: `SELECT Name FROM Student WHERE Age > 17` does not say how to search the table.

### Relationship to low-level languages

- Imperative languages are modelled on how the processor works: **variables** are named memory locations, **assignment** is a store to memory, statements run **in sequence** like the fetch-execute cycle.
- So each imperative statement maps to a **sequence of machine code instructions**: the relationship is **one-to-many**.
- High-level code must be **translated** by a **compiler** or **interpreter** before the processor can execute it ([6.3](#/topic/6.3)).

:::trap
- One high-level statement becomes **many** machine code instructions: **one-to-many**. One of the student textbook answers calls this "many-to-one"; that is the wrong way round.
- Assembly language **must be translated** (by an assembler). Only machine code runs without translation.
- Do not write "high-level languages are slower **because they have to be compiled**". Once compiled, the program runs as machine code with no further translation. It may be slower because the compiler's machine code is **less optimised** than code an expert writes by hand, or (if interpreted) because translation happens **every time** it runs.
- "Imperative" does **not** just mean "procedural" in the exam's sense. Give the full meaning: a sequence of commands that change program state / say how to solve the problem.
:::

## Comparing low-level and high-level languages

| Factor | Low-level (machine code / assembly) | High-level (imperative) |
|---|---|---|
| **Execution speed** | Can be faster: programmer controls every instruction and register | Usually slightly slower: compiler output may be less efficient |
| **Memory use** | Compact code, fine control of memory | Larger executables, extra overheads |
| **Hardware access** | Direct access to registers, memory addresses and I/O ports | Restricted, usually goes through the OS or libraries |
| **Portability** | **Not portable**: tied to one instruction set | **Portable**: recompile (or reinterpret) for another platform |
| **Ease of writing** | Hard: many instructions per task, no built-in data structures | Easier: English-like, structured, built-in functions and libraries |
| **Debugging and maintenance** | Hard to read, easy to make errors, hard for others to follow | Easier to read, test and maintain; meaningful identifiers |
| **Development time** | Long | Short |
| **Translation** | Machine code: none; assembly: **assembler** (one-to-one) | **Compiler** or **interpreter** (one-to-many) |
| **Programmer knowledge** | Must understand the processor architecture | Does not need to know the hardware |

### When would you still use a low-level language?

- **Embedded systems** with very limited memory and processing power (a washing machine controller, a smart card).
- **Device drivers** and parts of the **OS kernel** that must access hardware directly.
- **Time-critical code** where every clock cycle matters (signal processing, real-time control).
- Code that must use a **special processor instruction** not available from the high-level language.
- **Reverse engineering** and security research, where only machine code is available.

:::example Choosing a language
**Scenario 1:** a 4 KB microcontroller in a central-heating thermostat must read a temperature sensor every second and switch a relay.
- **Assembly language** is a reasonable choice: memory is tiny, the program is short, it must control I/O ports directly, and portability does not matter because the hardware is fixed.

**Scenario 2:** a sixth-form college wants a system to record attendance on PCs and Macs.
- **High-level language**: it is a large program, must be easy to maintain by other developers, will run on different platforms and does not need direct hardware access.
:::

:::exam
- **"Describe machine code"** (2): binary instructions; executed directly by the processor without translation; specific to a processor's instruction set.
- **"Describe assembly language"** (2): uses mnemonics for opcodes; one-to-one with machine code; needs an assembler; processor-specific.
- **"Explain what is meant by an imperative language"** (2): sequence of statements/commands; executed in order; that change the program state; say how to solve the problem.
- **"Give two advantages of assembly over a high-level language"**: direct register/hardware access; potentially faster/more efficient code; smaller code for limited memory.
- **"Give two disadvantages"**: not portable; harder/slower to write; harder to debug and maintain; programmer must know the architecture.
- Always make **comparative** points: "assembly is **more** efficient **than** ...". A list of features of just one side rarely gets full marks.
:::

:::challenge
1. Why is it reasonable to call C a "high-level language with low-level features"? Research pointers and inline assembly.
2. A compiler sometimes produces faster code than a human assembly programmer. Suggest why, using the idea of optimisation.
3. Hand-trace the assembly program above with a table of R0 and R1. How many times is `CMP` executed?
4. Explain why the same Python program can run on a Raspberry Pi (ARM) and a laptop (x86), but a compiled `.exe` cannot.
:::

:::recap
- Low-level = machine code and assembly: machine-oriented, tied to one instruction set.
- Machine code: binary opcode + operand(s), executed directly, no translation.
- Assembly: mnemonics and labels, **one-to-one** with machine code, translated by an **assembler**.
- High-level: problem-oriented, English-like, portable, built-in functions; translated by compiler or interpreter; **one-to-many**.
- Imperative: a sequence of commands that change program state, saying **how** to solve the problem.
- Low-level wins on speed, size and hardware access; high-level wins on portability, ease, development time and maintenance.
:::

:::related
- [6.3 Program translators](#/topic/6.3)
- [7.3 Instruction sets and assembly language](#/topic/7.3)
- [1.7 Programming paradigms and structured programming](#/topic/1.7)
- [6.1 Hardware, software and the operating system](#/topic/6.1)
:::

*/});
