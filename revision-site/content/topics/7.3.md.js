CS.registerTopic({ id: "7.3", title: "Instruction sets and assembly language" }, function () {/*

:::objectives
- Explain what a **processor instruction set** is and why it is **processor specific**.
- Describe the format of a machine code instruction as an **opcode** and one or more **operands**, and work out how many instructions or addresses a given number of bits allows.
- Distinguish between **immediate** and **direct** addressing and spot which one an instruction uses.
- Read, trace and write programs in the **AQA assembly language**: load, store, add, subtract, move, compare, branch, AND, ORR, EOR, MVN, LSL, LSR and HALT.
- Translate simple selection and iteration from pseudocode into assembly.
:::

:::quick At a glance
- **Instruction set** = every machine code instruction a particular processor can execute. It is **processor specific**: code for one family will not run on another.
- Each instruction = **opcode** (what to do, plus the addressing mode) + **operand(s)** (what to do it to).
- **Immediate addressing**: the operand **is** the value (`#5`). **Direct addressing**: the operand is the **address** where the value is stored (`LDR R0, 100`).
- AQA instructions: `LDR` load · `STR` store · `ADD` · `SUB` · `MOV` · `CMP` · `B` / `BEQ` / `BNE` / `BGT` / `BLT` · `AND` · `ORR` · `EOR` · `MVN` · `LSL` · `LSR` · `HALT`.
- Selection = `CMP` then a **conditional branch** past the code you want to skip. Iteration = a **label** at the top and a branch back to it.
- `LSL` by *n* multiplies by 2ⁿ; `LSR` by *n* divides by 2ⁿ (integer). `AND` clears/tests bits, `ORR` sets bits, `EOR` toggles bits.
:::

:::keyterms
Instruction set :: The set of all the machine code instructions that a particular processor (or processor family) is designed to execute. :: The complete list of commands a processor understands.
Opcode :: The part of a machine code instruction that specifies the operation to be performed (and may include the addressing mode). :: The "verb" — what to do.
Operand :: The part of an instruction that holds the data to be operated on, or a reference to where the data (or a register) is. :: The "object" — what to do it to.
Addressing mode :: Specifies how the operand should be interpreted, e.g. as a value or as an address. :: Tells the CPU whether the operand is the actual number or where to find it.
Immediate addressing :: The operand is the actual data value to be used. :: "Use this number."
Direct addressing :: The operand is the memory address of the data to be used. :: "Go to this address and use what is there."
Assembly language :: A low-level language that uses mnemonics to represent machine code instructions; each assembly instruction usually corresponds to one machine code instruction. :: Human-readable machine code.
Mnemonic :: A short abbreviation for an opcode, such as LDR or ADD. :: The memorable name of an instruction.
Label :: A name given to a line of assembly code so that branch instructions can refer to it. :: A bookmark you can jump to.
:::

## Instruction sets

Every processor is built to understand a fixed list of operations — its **instruction set**. Each operation has a binary code. When the control unit decodes an instruction (see [7.2](#/topic/7.2)) it looks at that code and triggers the right circuitry.

:::why Why is an instruction set processor specific?
The instruction set is wired into the control unit and ALU. Different processor families (e.g. ARM in phones, x86 in most laptops) use **different binary codes, different numbers of registers and different instructions**. So a machine code program compiled for x86 is meaningless to an ARM chip. That is why software is compiled separately for each platform, and why an **emulator** or translation layer is needed to run code built for another processor.
:::

### Opcode and operand

A machine code instruction is split into fields. A typical exam format is:

<svg class="diagram" viewBox="0 0 640 190" role="img" aria-label="A 16-bit instruction split into a 4-bit opcode, a 1-bit addressing mode and an 11-bit operand">
  <g font-size="14" font-family="inherit">
    <rect x="20" y="40" width="160" height="56" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
    <text x="100" y="66" text-anchor="middle" font-weight="700">Basic operation</text><text x="100" y="86" text-anchor="middle" font-size="12">4 bits → 2⁴ = 16 operations</text>
    <rect x="180" y="40" width="110" height="56" rx="6" fill="#ffa94d" fill-opacity="0.25" stroke="currentColor"/>
    <text x="235" y="66" text-anchor="middle" font-weight="700">Mode</text><text x="235" y="86" text-anchor="middle" font-size="12">1 bit: 0 imm / 1 dir</text>
    <rect x="290" y="40" width="330" height="56" rx="6" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/>
    <text x="455" y="66" text-anchor="middle" font-weight="700">Operand</text><text x="455" y="86" text-anchor="middle" font-size="12">11 bits → values 0–2047 or addresses 0–2047</text>
    <line x1="20" y1="120" x2="290" y2="120" stroke="currentColor"/><line x1="20" y1="114" x2="20" y2="126" stroke="currentColor"/><line x1="290" y1="114" x2="290" y2="126" stroke="currentColor"/>
    <text x="155" y="142" text-anchor="middle" font-weight="700">Opcode (5 bits)</text>
    <line x1="290" y1="120" x2="620" y2="120" stroke="currentColor"/><line x1="620" y1="114" x2="620" y2="126" stroke="currentColor"/>
    <text x="455" y="142" text-anchor="middle" font-weight="700">Operand (11 bits)</text>
    <text x="320" y="178" text-anchor="middle" font-size="12">A 16-bit instruction. AQA counts the addressing-mode bit as part of the opcode.</text>
    <text x="320" y="24" text-anchor="middle" font-size="12">e.g. 0010 1 00000110010 = "ADD (direct) the value at address 50"</text>
  </g>
</svg>

- The **opcode** says what to do. AQA treats the **addressing mode** bits as part of the opcode.
- The **operand** is either a value, a register, or a memory address.
- More bits for the basic operation → **more distinct instructions**. More bits for the operand → **larger values / more addressable memory locations**. With a fixed instruction length you trade one off against the other.

:::example Bits in an instruction format
A processor uses **16-bit** instructions: a **6-bit opcode** (of which 1 bit is the addressing mode) and a **10-bit operand**.

1. Basic operation bits = 6 − 1 = **5**, so the maximum number of different operations is 2⁵ = **32**.
2. With direct addressing, the operand is an address, so 2¹⁰ = **1024** memory locations (addresses 0 to 1023) can be referenced.
3. With immediate addressing and the operand as an **unsigned** integer, the largest value is 2¹⁰ − 1 = **1023**. As **two's complement**, the range is −512 to +511.

**Why it matters:** questions often ask "how many different instructions" (use the opcode bits *without* the mode bit if the question separates them) or "what is the largest address" (2ⁿ − 1, not 2ⁿ).
:::

## Addressing modes

| Mode | AQA syntax | Operand means… | Example | Effect |
|---|---|---|---|---|
| **Immediate** | `#n` | the value itself | `ADD R1, R1, #10` | R1 ← R1 + 10 |
| **Direct** | a plain number in `LDR`/`STR` | the memory address of the value | `LDR R1, 10` | R1 ← contents of address 10 |
| Register | `Rn` | the value in register *n* | `ADD R1, R1, R2` | R1 ← R1 + R2 |

:::example Same number, different meaning
Memory location 10 holds **75**.

- `MOV R0, #10` → R0 = **10** (immediate: use the number 10).
- `LDR R0, 10` → R0 = **75** (direct: go to address 10 and fetch what is there).

The `#` is the only difference on the page — and it changes the answer completely.
:::

:::why Why have two modes?
- **Immediate** is **faster**: no extra memory access is needed because the value arrives inside the instruction. But the value is fixed when the program is written and limited by the operand size.
- **Direct** lets the program work with **variables** — values that change at run time or are too big for the operand field — at the cost of an extra memory read.
:::

:::trap
- **`#` means immediate.** `LDR R0, #5` is not valid AQA — `LDR` and `STR` always use a memory address. To put a constant into a register use `MOV R0, #5`.
- A **direct** address is **not** the data. If you see `LDR R2, 40`, R2 gets *whatever is at* address 40, not 40.
- For "largest address/value", it is **2ⁿ − 1**, but "**number** of addresses" is **2ⁿ**.
:::

## The AQA assembly language

In the exam you are given this instruction set on the paper — but you are expected to use it fluently. `<operand2>` can be **`#n`** (immediate) or **`Rm`** (a register). `<memory ref>` is a **direct** address.

| Instruction | Meaning |
|---|---|
| `LDR Rd, <memory ref>` | **Load** the value at the memory location into register *d* |
| `STR Rd, <memory ref>` | **Store** the value in register *d* into the memory location |
| `ADD Rd, Rn, <operand2>` | Rd ← Rn + operand2 |
| `SUB Rd, Rn, <operand2>` | Rd ← Rn − operand2 |
| `MOV Rd, <operand2>` | Copy operand2 into Rd |
| `CMP Rn, <operand2>` | **Compare** Rn with operand2 (sets the flags only) |
| `B <label>` | **Always** branch to the label |
| `B<condition> <label>` | Branch if the last comparison was: `EQ` equal, `NE` not equal, `GT` greater than, `LT` less than |
| `AND Rd, Rn, <operand2>` | Bitwise AND |
| `ORR Rd, Rn, <operand2>` | Bitwise OR |
| `EOR Rd, Rn, <operand2>` | Bitwise XOR (exclusive OR) |
| `MVN Rd, <operand2>` | Bitwise NOT of operand2 into Rd |
| `LSL Rd, Rn, <operand2>` | Logical shift **left** Rn by operand2 places → Rd |
| `LSR Rd, Rn, <operand2>` | Logical shift **right** Rn by operand2 places → Rd |
| `HALT` | Stop execution |

Labels are written at the start of a line followed by a colon, e.g. `loop:`. Anything after `;` is a comment.

:::note Notice the pattern
Only **`LDR` and `STR` touch memory**. Every calculation happens **between registers** (or a register and an immediate value). This is called a **load/store architecture**. To add two numbers in memory you must load both, add, then store the result.
:::

### Sequence: add two values in memory

```asm
        LDR R0, 100      ; R0 ← value at address 100
        LDR R1, 101      ; R1 ← value at address 101
        ADD R2, R0, R1   ; R2 ← R0 + R1
        STR R2, 102      ; store the total at address 102
        HALT
```

With 12 at address 100 and 30 at address 101, address 102 ends up holding **42**.

### Selection: IF … ELSE

The trick is to **branch past** the code you do not want to run. Here the larger of two numbers is stored at address 102.

::::tabs
:::tab Pseudocode
```pseudocode
a ← memory[100]
b ← memory[101]
IF a > b THEN
  memory[102] ← a
ELSE
  memory[102] ← b
ENDIF
```
:::
:::tab Python
```python
memory = {100: 7, 101: 3}
a, b = memory[100], memory[101]
if a > b:
    memory[102] = a
else:
    memory[102] = b
print(memory[102])   # 7
```
:::
:::tab Assembly
```asm
        LDR R0, 100
        LDR R1, 101
        CMP R0, R1
        BGT bigger        ; if R0 > R1 jump to bigger
        STR R1, 102       ; ELSE branch: store R1
        B done            ; skip over the THEN part
bigger: STR R0, 102       ; THEN branch: store R0
done:   HALT
```
:::
::::

:::steps How to translate any IF into assembly
1. Load the values you need into registers.
2. `CMP` the two things being compared.
3. Use a conditional branch to jump to the code for one outcome.
4. Write the code for the **other** outcome straight after the branch, ending with `B` to a label after the whole IF (otherwise it falls through into the first outcome's code).
5. Put the label for the first outcome, its code, then the "end" label.
:::

Tested: inputs (7, 3) → 7; (2, 9) → 9; (5, 5) → 5 (equal values take the ELSE route, which is still correct).

### Iteration: a loop

Add up the integers 1 to 10.

::::tabs
:::tab Pseudocode
```pseudocode
count ← 1
total ← 0
REPEAT
  total ← total + count
  count ← count + 1
UNTIL count = 11
memory[200] ← total
```
:::
:::tab Python
```python
count, total = 1, 0
while True:
    total += count
    count += 1
    if not count < 11:
        break
print(total)   # 55
```
:::
:::tab Assembly
```asm
        MOV R0, #1        ; count
        MOV R1, #0        ; total
loop:   ADD R1, R1, R0    ; total ← total + count
        ADD R0, R0, #1    ; count ← count + 1
        CMP R0, #11
        BLT loop          ; repeat while count < 11
        STR R1, 200       ; address 200 ← 55
        HALT
```
:::
::::

:::why Why does the branch go backwards?
A loop is just a branch to an **earlier** address. When `BLT loop` is taken, the control unit overwrites the PC with the address of `loop`, so the next fetch repeats the body. When the condition fails, the PC simply carries on to the next line.
:::

{{tool:assembly-simulator}}

## Logical (bitwise) instructions

Bitwise instructions work on **each bit position independently**. They are mostly used with a **mask** — a binary pattern chosen to pick out, set or flip particular bits.

| Want to… | Use | Mask has… | Example (R0 = 0100 1101 = 77) |
|---|---|---|---|
| **Clear** bits / keep only some | `AND` | 1s in the bits to **keep** | `AND R1, R0, #15` → 0000 1101 = **13** |
| **Set** bits to 1 | `ORR` | 1s in the bits to **set** | `ORR R2, R0, #128` → 1100 1101 = **205** |
| **Toggle** (flip) bits | `EOR` | 1s in the bits to **flip** | `EOR R3, R0, #255` → 1011 0010 = **178** |
| Invert **every** bit | `MVN` | — | `MVN R4, #15` (8-bit) → 1111 0000 = **240** |

:::example Is a number odd?
The least significant bit of an odd number is 1. `AND` with 1 keeps only that bit.

```asm
        LDR R0, 100
        AND R1, R0, #1    ; R1 = 1 if odd, 0 if even
        CMP R1, #1
        BEQ odd
        MOV R2, #0
        B done
odd:    MOV R2, #1
done:   STR R2, 101       ; 1 = odd, 0 = even
        HALT
```

With 45 (0010 1101) at address 100: `AND` gives 1, so address 101 holds **1**.
:::

{{tool:bitwise-ops}}

## Shifts

A **logical shift** moves every bit left or right; the gap is filled with **0** and the bit pushed off the end is lost (on real processors it often lands in the **carry** flag).

- `LSL` by 1 = **× 2**; by *n* = × 2ⁿ (as long as no 1s fall off the left — that would be overflow).
- `LSR` by 1 = **÷ 2** rounded down; by *n* = ÷ 2ⁿ (integer division for unsigned numbers).

:::example Multiply by 10 without a multiply instruction
10*x* = 8*x* + 2*x*, and both are shifts.

| Step | Instruction | Working (x = 13) | Result |
|---|---|---|---|
| 1 | `LDR R0, 100` | load 13 = 0000 1101 | R0 = 13 |
| 2 | `LSL R1, R0, #3` | 0000 1101 → 0110 1000 | R1 = 104 (= 8 × 13) |
| 3 | `LSL R2, R0, #1` | 0000 1101 → 0001 1010 | R2 = 26 (= 2 × 13) |
| 4 | `ADD R1, R1, R2` | 104 + 26 | R1 = 130 |
| 5 | `STR R1, 101` | | address 101 = **130** |

**Why do this?** Shifts are among the fastest ALU operations, and early processors had no multiply instruction at all.
:::

:::trap
- **LSR is not a safe ÷2 for negative two's complement numbers**: it puts a 0 in the sign bit, so the number becomes positive. (That needs an *arithmetic* shift, which is not in the AQA set.)
- `LSL` can **overflow**: in 8 bits, 1000 0001 shifted left once gives 0000 0010, not 258.
- `CMP` changes **only the flags**. It does not store a result anywhere — beginners often expect `CMP R0, #5` to change R0.
- After `B<cond>`, if the condition is **false** the program **falls through** to the next line. Forgetting the `B done` in an IF/ELSE makes both branches run.
:::

## Tracing assembly programs

Exam questions often give a program and ask you to complete a **trace table** of registers and memory. Work line by line; only write a value in a column when it **changes**; and keep track of which branch was taken.

:::example Worked trace: count the 1 bits
```asm
        MOV R0, #13       ; 13 = 1101
        MOV R1, #0        ; R1 counts the 1 bits
loop:   AND R2, R0, #1    ; R2 = rightmost bit
        ADD R1, R1, R2
        LSR R0, R0, #1    ; shift right, dropping the bit just counted
        CMP R0, #0
        BNE loop
        STR R1, 21
        HALT
```

| Pass | R2 (after AND) | R1 (after ADD) | R0 (after LSR) | Branch taken? |
|---|---|---|---|---|
| start | | 0 | 13 | |
| 1 | 1 | 1 | 6 | yes (6 ≠ 0) |
| 2 | 0 | 1 | 3 | yes |
| 3 | 1 | 2 | 1 | yes |
| 4 | 1 | 3 | 0 | no — falls through |

Address 21 ends up holding **3**, the number of 1s in 1101. The loop runs once per bit, because each `LSR` drops one bit off the right.
:::

{{trace:7.3-1}}

:::exam
- "**Write an assembly program**" (typically 4–7 marks): marks are for **loading** the inputs, the **comparison**, **correct branches** (conditional and unconditional), **correct arithmetic**, **storing** the result and **HALT**. Use the exact syntax given on the paper and add comments — examiners give credit for clear logic even when one detail slips.
- "**Explain the difference between immediate and direct addressing**" (2 marks): one mark for each mode, said precisely — the operand *is the value* vs *is the address of the value*. An example of each helps.
- "**State the purpose of the instruction**" questions: describe the effect in terms of registers/memory, e.g. "loads the contents of memory address 100 into register 0".
- "**What is the result of `LSL R1, R0, #2` if R0 = …**": show the binary before and after, then give the denary.
:::

:::challenge
1. Write an AQA assembly program that loads a number from address 50 and stores **1** at address 51 if it is a multiple of 4, otherwise **0**. (Hint: which two bits must be 0?)
2. Rewrite the 1-to-10 loop so it counts **down** from 10 to 1. Which condition do you branch on now?
3. A 24-bit instruction has an 8-bit opcode including 2 addressing-mode bits. How many basic operations and how many addressing modes can it have? What is the highest directly addressable memory location?
4. Why can't a program written for one processor family be run directly on another?
:::

:::recap
- **Instruction set**: all the machine code instructions a processor can execute; **processor specific**.
- Instruction = **opcode** (operation + addressing mode) + **operand(s)**. n bits → 2ⁿ possibilities; largest value 2ⁿ − 1.
- **Immediate** (`#n`): operand is the value. **Direct**: operand is the address of the value.
- Only `LDR`/`STR` access memory. `CMP` sets flags; `B`, `BEQ`, `BNE`, `BGT`, `BLT` act on them.
- IF = compare + branch past code (+ `B` over the other branch). Loop = label + branch back.
- `AND` clear/test · `ORR` set · `EOR` toggle · `MVN` invert · `LSL` ×2ⁿ · `LSR` ÷2ⁿ.
:::

:::related
- [7.2 The stored program concept and the processor](#/topic/7.2)
- [5.4 Binary integers and two's complement](#/topic/5.4)
- [6.2 Classification of programming languages](#/topic/6.2)
- [7.4 Interrupts and processor performance](#/topic/7.4)
:::

*/});
