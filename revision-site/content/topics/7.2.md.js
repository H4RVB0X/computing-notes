CS.registerTopic({ id: "7.2", title: "The stored program concept and the processor" }, function () {/*

:::objectives
- Describe the **stored program concept** in the AQA wording and explain why it was such a big step.
- Explain the role of the **ALU**, **control unit**, **clock** and **general-purpose registers**.
- Explain what each dedicated register holds: **PC**, **CIR**, **MAR**, **MBR** and **status register**.
- Describe the **fetch–decode–execute cycle** step by step, using register transfer notation, and say which bus is used at each step.
- Trace the contents of the registers through a short program.
:::

:::quick At a glance
- **Stored program concept**: machine code instructions stored in main memory are **fetched and executed serially** by a processor that performs arithmetic and logical operations.
- **ALU** does arithmetic, logic, comparisons and shifts. **Control unit** decodes instructions and sends control signals. **Clock** sends regular pulses to synchronise everything.
- **PC** = address of the **next** instruction. **MAR** = address about to be read/written. **MBR** = data/instruction just read or about to be written. **CIR** = instruction being decoded/executed. **Status register** = flags (zero, negative, carry, overflow, interrupt).
- **Fetch**: MAR ← [PC] · PC ← [PC] + 1 · MBR ← [Memory]_addressed · CIR ← [MBR]. **Decode**: CU splits CIR into opcode and operand. **Execute**: carry it out, maybe updating ACC/registers, memory, flags or the PC (branch).
:::

:::keyterms
Stored program concept :: Machine code instructions stored in main memory are fetched and executed serially by a processor that performs arithmetic and logical operations. :: Programs live in memory as data, and the processor runs them one instruction after another.
Arithmetic logic unit (ALU) :: The part of the processor that performs arithmetic operations (e.g. add, subtract), logical operations (e.g. AND, OR, NOT, XOR), comparisons and shifts. :: The calculator inside the processor.
Control unit (CU) :: The part of the processor that decodes instructions and sends control signals to coordinate the other components and the movement of data. :: The conductor telling everything else what to do and when.
Clock :: A component that generates a continuous sequence of regular electrical pulses used to synchronise the operation of the processor's components. :: The metronome everything keeps time with.
Register :: A small, very fast storage location inside the processor. :: A scratchpad slot on the processor itself.
General-purpose register :: A register that can be used by programs to hold any data temporarily, such as operands and intermediate results. :: A register you can use for whatever you need.
Program counter (PC) :: A register that holds the memory address of the next instruction to be fetched. :: Where to look next.
Current instruction register (CIR) :: A register that holds the instruction currently being decoded and executed. :: The instruction being worked on right now.
Memory address register (MAR) :: A register that holds the address of the memory location that is about to be read from or written to. :: The address the processor is about to use.
Memory buffer register (MBR) :: A register that holds data or an instruction that has just been read from memory or is about to be written to memory. Also called the memory data register (MDR). :: The waiting area for anything going to or from memory.
Status register :: A register containing individual bits (flags) that record conditions resulting from operations, such as zero, negative, carry and overflow, and whether interrupts are enabled. :: A row of yes/no lights describing the last result.
Opcode :: The part of a machine code instruction that specifies the operation to be performed. :: *What* to do.
Operand :: The part of a machine code instruction that holds the data, or the address/register of the data, the operation acts on. :: *What to do it to.*
:::

## The stored program concept

The earliest computers (such as Colossus, 1943–45) were "programmed" by setting switches and plugging cables. Changing the task meant physically rewiring the machine.

The **stored program concept** changed that. Its AQA definition is:

> Machine code instructions stored in main memory are fetched and executed serially by a processor that performs arithmetic and logical operations.

Unpack the definition — each phrase earns credit:

| Phrase | Meaning |
|---|---|
| **machine code instructions** | the program is a sequence of binary instructions |
| **stored in main memory** | the program sits in memory alongside data, so it can be loaded and changed like data |
| **fetched and executed** | each instruction is copied into the processor and then carried out |
| **serially** | one instruction after another, in sequence (unless a branch changes the order) |
| **performs arithmetic and logical operations** | the processor (ALU) does the actual computation |

:::why Why was it such a big deal?
- **Versatility**: the same hardware can run any program — load a different program into memory and the machine does something completely different. This is what makes a *general-purpose* computer.
- **Speed**: instructions are read from electronic memory, not set by hand.
- **Programs as data**: because instructions are just bit patterns in memory, programs can load, generate or even modify other programs. Compilers, operating systems and loaders all depend on this.

The first electronic stored-program computer was the **Manchester Baby** (1948).
:::

## Inside the processor

<svg class="diagram" viewBox="0 0 680 360" role="img" aria-label="Processor containing control unit, ALU, clock and registers, connected to main memory by address, data and control buses">
  <defs><marker id="arr72" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit">
    <rect x="10" y="10" width="460" height="340" rx="14" fill="none" stroke="currentColor" stroke-width="2"/>
    <text x="24" y="32" font-weight="700" font-size="15">Processor</text>
    <rect x="30" y="50" width="130" height="60" rx="8" fill="#b197fc" fill-opacity="0.3" stroke="currentColor"/><text x="95" y="78" text-anchor="middle" font-weight="700">Control unit</text><text x="95" y="96" text-anchor="middle" font-size="11">decodes, controls</text>
    <rect x="30" y="130" width="130" height="60" rx="8" fill="#ff7a7a" fill-opacity="0.25" stroke="currentColor"/><text x="95" y="158" text-anchor="middle" font-weight="700">ALU</text><text x="95" y="176" text-anchor="middle" font-size="11">arithmetic + logic</text>
    <rect x="30" y="210" width="130" height="40" rx="8" fill="#ffd43b" fill-opacity="0.3" stroke="currentColor"/><text x="95" y="235" text-anchor="middle" font-weight="700">Clock</text>
    <rect x="30" y="270" width="130" height="60" rx="8" fill="none" stroke="currentColor"/><text x="95" y="294" text-anchor="middle" font-weight="700">General-purpose</text><text x="95" y="312" text-anchor="middle" font-weight="700">registers R0…Rn</text>
    <g>
      <rect x="200" y="50" width="110" height="40" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="255" y="75" text-anchor="middle" font-weight="700">PC</text>
      <rect x="200" y="105" width="110" height="40" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="255" y="130" text-anchor="middle" font-weight="700">CIR</text>
      <rect x="330" y="50" width="110" height="40" rx="6" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/><text x="385" y="75" text-anchor="middle" font-weight="700">MAR</text>
      <rect x="330" y="105" width="110" height="40" rx="6" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/><text x="385" y="130" text-anchor="middle" font-weight="700">MBR (MDR)</text>
      <rect x="200" y="160" width="240" height="40" rx="6" fill="none" stroke="currentColor"/><text x="320" y="185" text-anchor="middle" font-weight="700">Status register (flags Z N C V I)</text>
      <rect x="200" y="215" width="240" height="40" rx="6" fill="none" stroke="currentColor"/><text x="320" y="240" text-anchor="middle" font-weight="700">Accumulator / result register</text>
    </g>
    <rect x="540" y="60" width="130" height="250" rx="12" fill="#35d4bd" fill-opacity="0.15" stroke="currentColor"/>
    <text x="605" y="88" text-anchor="middle" font-weight="700">Main memory</text>
    <text x="555" y="120" font-family="monospace" font-size="12">0 | LDR R0,20</text>
    <text x="555" y="142" font-family="monospace" font-size="12">1 | ADD R0,R0,#5</text>
    <text x="555" y="164" font-family="monospace" font-size="12">2 | STR R0,21</text>
    <text x="555" y="186" font-family="monospace" font-size="12">3 | HALT</text>
    <text x="555" y="208" font-family="monospace" font-size="12">…</text>
    <text x="555" y="230" font-family="monospace" font-size="12">20 | 37</text>
    <text x="555" y="252" font-family="monospace" font-size="12">21 | 0</text>
    <line x1="440" y1="70" x2="537" y2="70" stroke="currentColor" stroke-width="2" marker-end="url(#arr72)"/><text x="488" y="64" text-anchor="middle" font-size="11">address bus</text>
    <line x1="440" y1="125" x2="537" y2="125" stroke="currentColor" stroke-width="2" marker-end="url(#arr72)"/>
    <line x1="537" y1="133" x2="440" y2="133" stroke="currentColor" stroke-width="2" marker-end="url(#arr72)"/><text x="488" y="150" text-anchor="middle" font-size="11">data bus</text>
    <line x1="160" y1="80" x2="537" y2="290" stroke="currentColor" stroke-dasharray="6 4" marker-end="url(#arr72)"/><text x="400" y="292" font-size="11">control bus</text>
  </g>
</svg>

### The four main parts

- **Control unit (CU)**
  - **Decodes** each instruction in the CIR to work out the operation and operands.
  - Sends **control signals** to the other components (and along the control bus) to make the right data move at the right time.
  - Coordinates the sequence of micro-steps that make up each instruction.
- **Arithmetic logic unit (ALU)**
  - **Arithmetic**: add, subtract (and on many processors multiply, divide).
  - **Logic**: bitwise AND, OR, NOT, XOR.
  - **Comparisons** (setting the status flags) and **shifts**.
- **Clock**
  - Generates regular pulses. Each pulse triggers the next step, so every component works in **step** (synchronised).
  - **Clock speed** = pulses per second (e.g. 3.5 GHz = 3.5 billion per second). See [7.4](#/topic/7.4) for how this affects performance.
- **Registers**: tiny, extremely fast memory **inside** the processor. They are much faster than main memory, so the processor keeps what it is working on in registers.

### General-purpose versus dedicated registers

**General-purpose registers** (e.g. R0–R12 in the AQA assembly language) hold whatever the program needs: operands, intermediate results, loop counters. Using them avoids slow trips to main memory.

**Dedicated (special-purpose) registers** each have one job in the fetch–execute cycle:

| Register | Holds | Used when |
|---|---|---|
| **PC** — program counter | the **address** of the **next** instruction to fetch | start of every fetch; incremented during fetch; overwritten by a branch |
| **MAR** — memory address register | the **address** of the location about to be read or written | every memory access; connected to the **address bus** |
| **MBR** — memory buffer register (MDR) | the **data or instruction** just read from memory, or about to be written | every memory access; connected to the **data bus** |
| **CIR** — current instruction register | the **instruction** currently being decoded and executed | from the end of fetch until the instruction finishes |
| **Status register** (SR) | **flags**: e.g. **Z** zero, **N** negative, **C** carry, **V** overflow, **I** interrupt enable | set by the ALU after operations; tested by conditional branches |
| Accumulator (ACC) | the result of the last ALU operation (on single-accumulator machines) | many simple exam CPUs |

:::trap
- **PC holds an address, not an instruction.** "The PC stores the next instruction" is wrong. It stores the **address** of the next instruction.
- **MAR = address, MBR = data.** Swap them and you lose the mark. Memory hook: **A**ddress register, **B**uffer for the **B**its of data.
- **CIR holds the current instruction, not its address.**
- The PC is incremented **during the fetch**, not after execution. So while an instruction executes, the PC already points to the *next* one.
:::

## The fetch–decode–execute cycle

The processor repeats the same cycle billions of times a second. AQA expects it described in **register transfer notation**, where `[X]` means "the contents of X" and `←` means "is copied into".

### Fetch

:::steps Fetch stage
1. **MAR ← [PC]** — the address of the next instruction is copied from the PC to the MAR. It goes out on the **address bus**.
2. **PC ← [PC] + 1** — the PC is incremented so it points at the following instruction. (Done now so it can happen in parallel with the memory read.)
3. A **memory read** signal is sent on the **control bus**.
4. **MBR ← [Memory]addressed** — written `MBR ← [[MAR]]`: the instruction in the addressed location travels along the **data bus** into the MBR.
5. **CIR ← [MBR]** — the instruction is copied into the CIR ready to decode.
:::

### Decode

- The **control unit** splits the instruction in the CIR into its **opcode** and **operand(s)**.
- It works out what the instruction is (load, add, branch…) and the **addressing mode** (immediate or direct — see [7.3](#/topic/7.3)).
- If the operand is an address of data, that address may be copied to the MAR ready to fetch the data.

### Execute

What happens depends on the instruction:

| Instruction type | Execute stage |
|---|---|
| **Load** (`LDR R0, 20`) | MAR ← 20; memory read; MBR ← [20]; R0 ← [MBR] |
| **Store** (`STR R0, 21`) | MAR ← 21; MBR ← [R0]; memory write: memory location 21 ← [MBR] |
| **Arithmetic/logic** (`ADD R0, R0, #5`) | ALU adds R0 and 5; result into R0; status flags updated |
| **Compare** (`CMP R0, #0`) | ALU subtracts and sets flags only; no register changes |
| **Branch** (`B loop`, `BEQ end`) | if the condition is met, **PC ← address of the label**, so the next fetch comes from there |
| **HALT** | stops the cycle |

At the end of execute the processor **checks for interrupts** (see [7.4](#/topic/7.4)), then starts the next fetch.

{{tool:fde-stepper}}

:::example Full worked trace
Memory holds this program (AQA assembly), with location 20 holding **37**:

```asm
0: LDR R0, 20      ; load the value at address 20 into R0
1: ADD R0, R0, #5  ; add 5
2: STR R0, 21      ; store R0 at address 21
3: HALT
```

The PC starts at 0. Each row shows the registers **after** that step.

| Step | RTN | PC | MAR | MBR | CIR | R0 |
|---|---|---|---|---|---|---|
| Fetch 1 | MAR ← [PC] | 0 | 0 | | | |
| | PC ← [PC]+1 | 1 | 0 | | | |
| | MBR ← [[MAR]] | 1 | 0 | LDR R0,20 | | |
| | CIR ← [MBR] | 1 | 0 | LDR R0,20 | LDR R0,20 | |
| Exec 1 | MAR ← 20; MBR ← [20]; R0 ← [MBR] | 1 | 20 | 37 | LDR R0,20 | 37 |
| Fetch 2 | (as above) | 2 | 1 | ADD R0,R0,#5 | ADD R0,R0,#5 | 37 |
| Exec 2 | R0 ← [R0] + 5 (ALU) | 2 | 1 | ADD R0,R0,#5 | ADD R0,R0,#5 | 42 |
| Fetch 3 | | 3 | 2 | STR R0,21 | STR R0,21 | 42 |
| Exec 3 | MAR ← 21; MBR ← [R0]; [21] ← [MBR] | 3 | 21 | 42 | STR R0,21 | 42 |
| Fetch 4 | | 4 | 3 | HALT | HALT | 42 |

Memory location 21 now holds **42**. Notice that the MAR and MBR are used for **data** as well as instructions, and that the PC is always one ahead of the instruction being executed.
:::

{{trace:7.2-1}}

:::exam
- "**Describe the fetch stage**" (typically 4 marks): use register transfer notation *and* words. Four creditworthy points: address in PC copied to MAR; PC incremented; instruction at the addressed location copied (via data bus) to MBR; contents of MBR copied to CIR.
- "**Explain the role of the PC/MAR/MBR/CIR**": state what it **holds** plus **when** it is used.
- "**Describe the stored program concept**": quote the definition; three marks usually come from *instructions stored in main memory*, *fetched and executed one at a time / serially*, *processor performs arithmetic and logic operations*.
- If asked which **bus** is used, say address bus for MAR → memory and data bus for memory → MBR (or the reverse on a write), with a memory read/write signal on the control bus.
:::

:::challenge
1. Why can the PC be incremented at the same time as the memory read in the fetch stage? What would go wrong if the PC were only incremented at the end of the execute stage of a branch instruction?
2. A processor checks for interrupts at the end of every cycle rather than in the middle. Why?
3. In the worked trace, how many separate memory accesses did the program need? How would cache memory change things?
:::

:::recap
- Stored program concept: **instructions stored in main memory are fetched and executed serially by a processor that performs arithmetic and logical operations**.
- **CU** decodes and controls; **ALU** calculates, compares, shifts; **clock** synchronises; **registers** are fast storage inside the processor.
- **PC** = address of next instruction; **MAR** = address to access; **MBR** = data/instruction moving to/from memory; **CIR** = current instruction; **SR** = flags.
- Fetch: **MAR ← [PC]; PC ← [PC]+1; MBR ← [[MAR]]; CIR ← [MBR]**. Decode: CU splits opcode/operand. Execute: depends on instruction; branches overwrite the PC.
:::

:::related
- [7.1 Internal hardware components and buses](#/topic/7.1)
- [7.3 Instruction sets and assembly language](#/topic/7.3)
- [7.4 Interrupts and processor performance](#/topic/7.4)
- [6.2 Classification of programming languages](#/topic/6.2)
:::

*/});
