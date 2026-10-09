CS.registerTopic({ id: "7.4", title: "Interrupts and processor performance" }, function () {/*

:::objectives
- Explain what an **interrupt** is, list typical **sources**, and say why interrupts beat constantly checking (polling) every device.
- Describe how the processor **checks for interrupts at the end of each fetch–execute cycle** and what happens when one is found.
- Explain the role of an **interrupt service routine (ISR)**, **priorities** and the **vectored interrupt** mechanism.
- Explain **why** and **how** the **volatile environment** is saved and restored, using a stack.
- Explain the effect on performance of **multiple cores**, **cache memory**, **clock speed**, **word length**, **address bus width** and **data bus width**, including their limits.
- Calculate **addressable memory** from an address bus width, and transfers needed from a data bus width.
:::

:::quick At a glance
- An **interrupt** is a **signal** to the processor that a device or program **needs attention**. Sources: **hardware/I-O** (key pressed, printer out of paper, data arrived), **timer**, **software** (system call, divide by zero), **hardware failure** (power loss).
- The processor **checks for interrupts at the end of every fetch–execute cycle**, so the current instruction always finishes first.
- If an interrupt of **higher priority** than the current task is waiting: **save the volatile environment** (PC, status register, general-purpose registers) **onto the system stack** → load the **address of the ISR** into the PC → run the **ISR** → **restore** the registers from the stack → carry on exactly where it left off.
- **Why save?** The ISR uses the same registers. Without saving them, the interrupted program could not resume correctly.
- **Performance**: more **cores** (parallel work, but **not** a linear speed-up), bigger/more **cache** (fewer slow RAM accesses), faster **clock** (more cycles per second), longer **word length** (more bits processed at once), wider **address bus** (2ⁿ addressable locations → more RAM usable), wider **data bus** (more bits per transfer).
:::

:::keyterms
Interrupt :: A signal sent to the processor by a hardware device or program to indicate that it requires the processor's attention. :: A tap on the processor's shoulder saying "deal with me".
Interrupt service routine (ISR) :: A program/subroutine that is executed in response to a particular type of interrupt in order to deal with it. :: The specific bit of code that handles one kind of interrupt.
Volatile environment :: The contents of the processor's registers (including the PC and status register) at the moment an interrupt is serviced, which must be saved so the interrupted program can resume. :: A snapshot of exactly where the processor had got to.
Interrupt priority :: A level assigned to each type of interrupt so that more urgent interrupts are serviced first and can interrupt less urgent ISRs. :: A ranking so a fire alarm beats a doorbell.
Interrupt register :: A register in which each bit signals that a particular type of interrupt is waiting to be serviced. :: The waiting list of interrupts.
Vectored interrupt :: A mechanism in which each interrupt type has an entry in an interrupt vector table holding the start address of its ISR. :: A lookup table that says where each handler lives.
Stack (system stack) :: A LIFO area of main memory used to save return addresses and register contents, e.g. when servicing interrupts. :: The pile of saved snapshots; the last one saved is restored first.
Multi-core processor :: A processor with two or more independent processing units (cores), each able to fetch and execute instructions at the same time as the others. :: Several processors on one chip working in parallel.
Cache memory :: A small amount of very fast memory, on or close to the processor, that holds copies of frequently or recently used instructions and data. :: A tiny super-fast store of the things you're probably about to need.
Cache hit / cache miss :: A hit is when the required data is found in the cache; a miss is when it is not and must be fetched from a slower level or main memory. :: Hit = found it nearby; miss = go the long way round.
Clock speed :: The number of clock cycles (pulses) the processor's clock generates per second, measured in hertz (e.g. 3.5 GHz). :: How fast the processor's metronome ticks.
Word length :: The number of bits that the processor can process as a single unit (typically the size of its registers). :: How big a "chunk" the processor handles in one go.
Address bus width :: The number of lines (bits) in the address bus; determines the number of memory locations that can be addressed (2ⁿ for n lines). :: More address wires → more memory you can point at.
Data bus width :: The number of lines (bits) in the data bus; determines how many bits can be transferred in a single operation. :: More data wires → more bits moved at once.
:::

## Why interrupts?

A processor runs one instruction after another, billions per second. Meanwhile devices need attention at **unpredictable** times: you press a key, a network packet arrives, the printer runs out of paper.

There are two ways the processor could find out:

| | **Polling** | **Interrupts** |
|---|---|---|
| How | The processor repeatedly asks each device "do you need me?" | The device sends a **signal** when it needs attention |
| Processor time | Wasted on checks that usually find nothing | Only spent when something has actually happened |
| Response | Delayed until that device's turn comes round | Fast: dealt with at the end of the current cycle |

:::why Why not just poll?
Most of the time devices **don't** need anything. Polling 20 devices thousands of times a second burns processor time for nothing, and if you poll less often, urgent events (a power failure!) wait too long. Interrupts let the processor get on with useful work and respond only when needed.
:::

### Sources of interrupts

| Source | Examples |
|---|---|
| **Hardware / I/O device** | key pressed, mouse moved, data arrived from the network, disk transfer finished, printer out of paper |
| **Timer (clock)** | the OS's time slice for a process has run out, so the scheduler can switch to another process |
| **Software / program** | a program requests an OS service (a system call), or an error occurs: division by zero, illegal instruction, accessing memory it doesn't own |
| **Hardware failure** | power failure detected, memory parity error, overheating |

:::tip
Exam questions often ask for "**two sources** of interrupts" — give a *type* **and** an *example*: "an I/O device, e.g. the printer signals it is out of paper".
:::

## Interrupts and the fetch–execute cycle

The processor has an **interrupt register**: each bit is set when a particular interrupt is waiting. At the **end of each fetch–decode–execute cycle** (before the next fetch) the processor checks it.

- **No interrupt waiting** (or interrupts are disabled/masked) → fetch the next instruction as normal.
- **Interrupt waiting** → compare its **priority** with the current task. If it is higher, service it now; if not, leave it pending.

:::why Why check only at the end of a cycle?
If the processor stopped halfway through an instruction, registers would be half-updated (e.g. the MBR loaded but the result not yet stored). Finishing the instruction first means the saved state is **consistent**: the PC already points to the **next** instruction, so the program can resume cleanly.
:::

:::figure The fetch–execute cycle with an interrupt check
<svg class="diagram" viewBox="0 0 680 400" role="img" aria-label="Flowchart: fetch, decode, execute, then check for interrupts. If none, fetch again. If one is waiting with higher priority, save the volatile environment on the stack, load the ISR address into the PC, run the ISR, restore registers and continue.">
  <defs><marker id="arr74" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit">
    <rect x="30" y="20" width="140" height="44" rx="10" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="100" y="47" text-anchor="middle" font-weight="700">Fetch</text>
    <rect x="30" y="90" width="140" height="44" rx="10" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="100" y="117" text-anchor="middle" font-weight="700">Decode</text>
    <rect x="30" y="160" width="140" height="44" rx="10" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="100" y="187" text-anchor="middle" font-weight="700">Execute</text>
    <polygon points="100,228 185,268 100,308 15,268" fill="#ffd43b" fill-opacity="0.3" stroke="currentColor"/><text x="100" y="264" text-anchor="middle" font-weight="700">Interrupt</text><text x="100" y="281" text-anchor="middle" font-weight="700">waiting?</text>
    <line x1="100" y1="64" x2="100" y2="88" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/>
    <line x1="100" y1="134" x2="100" y2="158" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/>
    <line x1="100" y1="204" x2="100" y2="226" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/>
    <path d="M15,268 L4,268 L4,42 L28,42" fill="none" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/><text x="10" y="330" font-size="12">No (or lower priority)</text>
    <line x1="185" y1="268" x2="240" y2="268" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/><text x="190" y="258" font-size="12">Yes</text>
    <rect x="242" y="246" width="200" height="44" rx="10" fill="#ff7a7a" fill-opacity="0.22" stroke="currentColor"/><text x="342" y="265" text-anchor="middle" font-weight="700">1. Save volatile environment</text><text x="342" y="282" text-anchor="middle" font-size="11">PC, status reg, registers → stack</text>
    <rect x="470" y="246" width="200" height="44" rx="10" fill="#ff7a7a" fill-opacity="0.22" stroke="currentColor"/><text x="570" y="265" text-anchor="middle" font-weight="700">2. Identify source</text><text x="570" y="282" text-anchor="middle" font-size="11">PC ← ISR address (vector table)</text>
    <rect x="470" y="150" width="200" height="44" rx="10" fill="#35d4bd" fill-opacity="0.22" stroke="currentColor"/><text x="570" y="169" text-anchor="middle" font-weight="700">3. Run the ISR</text><text x="570" y="186" text-anchor="middle" font-size="11">its own fetch–execute cycles</text>
    <rect x="470" y="54" width="200" height="44" rx="10" fill="#35d4bd" fill-opacity="0.22" stroke="currentColor"/><text x="570" y="73" text-anchor="middle" font-weight="700">4. Restore registers</text><text x="570" y="90" text-anchor="middle" font-size="11">pop from stack (PC last)</text>
    <line x1="442" y1="268" x2="468" y2="268" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/>
    <line x1="570" y1="246" x2="570" y2="196" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/>
    <line x1="570" y1="150" x2="570" y2="100" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/>
    <path d="M470,76 L330,76 L330,42 L172,42" fill="none" stroke="currentColor" stroke-width="2" marker-end="url(#arr74)"/><text x="250" y="36" font-size="12">resume interrupted program</text>
    <text x="242" y="330" font-size="12">Lower-priority interrupts stay pending (or are disabled)</text>
    <text x="242" y="348" font-size="12">while the ISR runs; a higher-priority one can interrupt it.</text>
  </g>
</svg>
:::

### Servicing an interrupt, step by step

:::steps What happens when an interrupt is serviced
1. The processor **finishes the current fetch–execute cycle**.
2. It checks the interrupt register, finds an interrupt **of higher priority** than the current task.
3. The **volatile environment** (the **PC**, the **status register** and the **general-purpose registers**) is **pushed onto the system stack** in main memory.
4. The **source** of the interrupt is identified, and the **start address of the matching ISR** is loaded into the **PC** (looked up in the **interrupt vector table**).
5. Interrupts of the **same or lower priority are disabled** (masked), so they wait.
6. The **ISR runs**, using ordinary fetch–execute cycles. Its last instruction is a "return from interrupt".
7. The saved values are **popped off the stack** back into the registers — the PC is restored last, so the next fetch is the instruction that was due before the interrupt.
8. Lower-priority interrupts are **re-enabled**; the interrupted program **continues** as if nothing had happened.
:::

### The interrupt service routine (ISR)

Each **type** of interrupt has its **own ISR**: one for the keyboard, one for the timer, one for a power failure, and so on. ISRs are part of the operating system or are supplied by **device drivers**.

Example: when a key is pressed, the keyboard ISR reads which key it was and puts the character into the **keyboard buffer**, ready for the program that is waiting for input.

**Vectored interrupts.** Rather than one big routine that checks every possible cause, each interrupt type has a number. The processor uses that number to look up the ISR's **start address** in an **interrupt vector table** (a table of addresses in memory) and loads it straight into the PC. This is faster and makes adding a new device's handler easy.

### Priorities

Not all interrupts are equally urgent. A **power failure** must be handled before a key press; a **timer** interrupt before a "print job finished" message.

- An interrupt is serviced at once only if its priority is **higher** than whatever is running now.
- A higher-priority interrupt **can interrupt an ISR** that is already running (a **nested** interrupt). Its environment is pushed on top of the stack.
- Lower-priority interrupts are **held** until the processor returns to a lower priority level.

:::trap
- **"Lower number = higher priority"** is just one convention (your slides use it). Some systems number the other way round. In an exam, say "higher **priority**", not "higher number", unless the question defines it.
- The processor does **not** stop mid-instruction. It **completes the current fetch–execute cycle** first. "The processor stops immediately" loses the mark.
- The ISR does **not** "take the data in the CIR and put it on a stack" (a muddle in the slides). The **processor/OS saves the registers** — at least the **PC** and **status register**, plus the general-purpose registers — **before** the ISR's own work can overwrite them.
:::

## Saving the volatile environment

The **volatile environment** is everything in the processor that describes "where the program had got to":

- the **program counter** — the address of the **next** instruction to execute (already incremented during the fetch);
- the **status register** — flags such as zero, negative, carry and overflow, which a following conditional branch may depend on;
- the **general-purpose registers** (and accumulator) — the program's working values.

:::why Why must it be saved?
The ISR is just another program. It **uses the same registers**: it will load values, do arithmetic (changing the flags) and, crucially, put its own addresses in the PC. If the old values weren't saved first, they would be **overwritten**, and when the ISR finished the interrupted program would continue with the wrong data, the wrong flags or from the wrong place — it would crash or give wrong results.
:::

### Why a stack?

The registers are saved on the **system stack** (a LIFO area of main memory).

- **Nested interrupts** happen: a high-priority interrupt can arrive while a low-priority ISR is running. That needs a *second* snapshot saved on top of the first.
- Interrupts are always finished in the **reverse order** they started — the most recent one finishes first. That is exactly **last in, first out**, so a stack restores the snapshots in the right order automatically.

:::example Nested interrupts: what's on the stack?
A user program is running when:
1. a **printer** interrupt (low priority) arrives → the printer ISR starts;
2. while the printer ISR runs, a **power-failure** interrupt (high priority) arrives;
3. a **keyboard** interrupt (medium priority) arrives while the power-failure ISR runs.

| Time | Event | Running | Stack (bottom → top) |
|---|---|---|---|
| t0 | normal running | user program | *(empty)* |
| t1 | printer interrupt; higher priority than the program → service | printer ISR | program's registers |
| t2 | power-failure interrupt; higher than printer ISR → service | power ISR | program's, printer ISR's |
| t3 | keyboard interrupt; **lower** than power ISR → **held pending** | power ISR | program's, printer ISR's |
| t4 | power ISR ends → its "return from interrupt" pops the printer ISR's registers; the pending keyboard interrupt (medium) beats the printer ISR (low), so they are pushed again and the keyboard ISR starts | keyboard ISR | program's, printer ISR's |
| t5 | keyboard ISR ends → pop | printer ISR | program's |
| t6 | printer ISR ends → pop | user program | *(empty)* |

The key point: **each snapshot is restored in reverse order of saving** — LIFO.
:::

{{trace:7.4-1}}

## Processor performance

Six factors are on the specification. For each, an exam answer needs **what it is**, **why it helps**, and (for the top marks) **its limits**.

### Clock speed

- The **clock** sends regular pulses; each pulse lets the processor move on one step. **Clock speed** = cycles per second, e.g. **3.5 GHz = 3.5 × 10⁹ cycles per second**.
- A faster clock → each step happens sooner → **more instructions executed per second**.

**Limits**
- Many instructions take **several** clock cycles, so 3.5 GHz ≠ 3.5 billion instructions per second.
- Faster clocks produce **more heat** and use more power; chips are limited by cooling (overclocking risks instability).
- If the processor is waiting for data from **slow main memory**, a faster clock just means more cycles spent waiting.

### Multiple cores

A **core** is a complete processing unit (its own ALU, CU and registers). A quad-core processor can run **four instruction streams at the same time** (true parallel processing).

- Different programs (or **threads** of one program) can run on different cores simultaneously.
- Great for multitasking, video encoding, games, servers handling many users.

:::why Why doesn't 4 cores mean 4 × as fast?
- **Not every task can be split.** If step 2 needs the result of step 1, the steps must run one after another; the extra cores sit idle.
- **Overheads**: the OS/program must divide the work, hand it out and combine the results; cores must keep shared data consistent.
- **Shared resources**: cores share the buses, main memory and usually the L3 cache, so they can hold each other up.
- **Software** must be written to use multiple threads. A single-threaded program uses just one core.
:::

:::maths Amdahl's law (extension)
If a fraction *p* of a program can run in parallel on *n* cores, the best possible speed-up is 1 ÷ ((1 − p) + p ÷ n).
With p = 0.8 and 4 cores: 1 ÷ (0.2 + 0.2) = **2.5 ×**, not 4 ×. Even with infinitely many cores it can't beat 1 ÷ 0.2 = 5 ×.
:::

```python Amdahl's law: speed-up from extra cores
def speed_up(p, n):
    """p = fraction that can run in parallel, n = number of cores"""
    return 1 / ((1 - p) + p / n)

for cores in [1, 2, 4, 8, 64]:
    print(cores, "cores:", round(speed_up(0.8, cores), 2), "x")
```

```output
1 cores: 1.0 x
2 cores: 1.67 x
4 cores: 2.5 x
8 cores: 3.33 x
64 cores: 4.85 x
```

### Cache memory

Main memory (RAM) is **much slower** than the processor: one RAM access can cost the time of ~100 clock cycles. **Cache** is a small amount of very fast memory **on (or very near) the processor** that holds **copies** of instructions and data that have been used recently or are likely to be used soon.

- **Cache hit**: what's needed is in the cache → fetched very quickly.
- **Cache miss**: not in the cache → fetched from the next level or RAM (slow), and a copy is placed in the cache for next time.

It works because programs show **locality**: they reuse the same instructions (loops) and data (variables) again and again (*temporal locality*), and access nearby addresses next (arrays, the next instruction — *spatial locality*).

| Level | Where | Size (typical) | Speed |
|---|---|---|---|
| **L1** | inside each core (often split instruction/data) | tens of KB | fastest |
| **L2** | per core (or shared by a pair) | hundreds of KB – a few MB | fast |
| **L3** | shared by all cores on the chip | several MB – tens of MB | slower, but far faster than RAM |
| RAM | separate chips | GBs | slow by comparison |

The processor looks in L1, then L2, then L3, then RAM.

**Why it helps**: more hits → fewer slow RAM accesses → the processor spends less time waiting.

**Limits**: cache is **expensive** per byte and takes chip space; a bigger cache is also slightly slower to search, so there are **diminishing returns**. That's why there are several small fast levels rather than one big one.

:::example Average access time with a cache
A cache takes **1 ns**; main memory takes **60 ns**. The hit rate is **95 %**. On a miss we check the cache (1 ns) then go to RAM (60 ns).

1. Hits: 0.95 × 1 = 0.95 ns
2. Misses: 0.05 × (1 + 60) = 3.05 ns
3. Average = 0.95 + 3.05 = **4.0 ns**

Without the cache every access costs **60 ns** — the cache makes memory access **15 × faster** on average. Raise the hit rate to 98 % and the average becomes 0.98 + 0.02 × 61 = **2.2 ns**.
:::

```python Effective memory access time
def average_time(hit_rate, cache_ns, ram_ns):
    return hit_rate * cache_ns + (1 - hit_rate) * (cache_ns + ram_ns)

print(round(average_time(0.95, 1, 60), 2))  # 4.0
print(round(average_time(0.98, 1, 60), 2))  # 2.2
```

### Word length

The **word length** is the number of bits the processor handles **as one unit**: the size of its registers and what the ALU can process in one operation (e.g. 32-bit or 64-bit).

- A longer word means **more bits are processed in one instruction**. Adding two 64-bit numbers is one ADD on a 64-bit processor, but needs several instructions (add low halves, then high halves with carry) on a 32-bit one.
- Larger ranges of integers and more precise real numbers can be handled directly.
- Each fetch brings a bigger instruction/data item, so fewer fetches are needed.

**Limits**: software must be compiled for the longer word to benefit; if a program only uses small numbers, little changes.

### Address bus width

The address bus carries the address of the memory location being read or written. With **n** address lines, there are **2ⁿ** different addresses.

:::example Addressable memory
| Address bus | Addressable locations | If each location is 1 byte |
|---|---|---|
| 16 bits | 2¹⁶ = **65,536** | 64 KiB |
| 24 bits | 2²⁴ = **16,777,216** | 16 MiB |
| 32 bits | 2³² = **4,294,967,296** | 4 GiB |

Working for 32 bits: 2³² = 2² × 2³⁰ = 4 × 1,073,741,824 = 4,294,967,296 locations = 4 GiB if byte-addressable. That's why 32-bit PCs could only use about 4 GB of RAM.

Going from 16 to 17 address lines **doubles** the addressable memory (each extra line doubles it).
:::

**Why it helps**: a wider address bus means **more main memory can be installed and used**, so more programs and data can be held in RAM at once and the computer relies less on slow **virtual memory** (paging to disk).

**Limits**: it only helps if the computer actually **has** (and needs) that much RAM. If everything already fits in memory, widening the address bus changes nothing.

### Data bus width

The data bus carries the data (or instruction) being transferred. With **n** data lines, **n bits** move in **one** transfer.

- Wider data bus → **more bits per transfer** → **fewer transfers** to move the same data → less time waiting for memory.
- It is usually the same as the word length, so a whole word arrives in one go.

:::example Number of transfers
Fetching one 64-bit value:
- 16-bit data bus → 64 ÷ 16 = **4 transfers**
- 32-bit data bus → **2 transfers**
- 64-bit data bus → **1 transfer**
:::

:::trap
- **A 16-bit data bus transfers 16 bits at once — not 2¹⁶ = 65,536 bits.** (Your textbook answer says "65356 bits": wrong twice — wrong idea *and* a typo for 65,536.)
- 2ⁿ belongs to the **address** bus: it counts **locations**. The **data** bus width is simply **how many bits move per transfer**.
- Don't say a wider address bus makes each memory access **faster**. It increases how **much** memory can be addressed. Any speed gain comes from needing less virtual memory.
- Clock speed in GHz is **cycles** per second, not instructions per second.
:::

### Summary table

| Factor | Increase it… | Why faster | Limitation |
|---|---|---|---|
| Clock speed | more cycles per second | each step happens sooner | heat/power; instructions take several cycles; memory bottleneck |
| Cores | more parallel processing units | several instructions/threads at once | task must be parallelisable; overheads; shared memory/bus; software must be multi-threaded |
| Cache | more/faster cache, more levels | more hits, fewer slow RAM accesses | expensive; bigger cache slightly slower; diminishing returns |
| Word length | more bits per operation | bigger values in one instruction, fewer instructions | software must be built for it |
| Address bus | more lines → 2ⁿ locations | more RAM usable, less paging to disk | only helps if more RAM is fitted and needed |
| Data bus | more bits per transfer | fewer transfers per item | only helps if the processor can use the extra bits (word length) |

{{tool:fde-stepper}}

:::exam
- **Interrupts (4–6 marks)**: hit these points in order — completes current FDE cycle → checks for interrupt (priority higher?) → **saves volatile environment (PC, status register, registers) on the stack** → loads **ISR start address into the PC** (vectored) → ISR executes → **restores** registers from the stack → resumes the interrupted program. "Explain **why** the volatile environment is saved" needs *the ISR will overwrite the registers* **and** *so the original program can resume from where it stopped with the same data*.
- **Performance (6–9 marks, levelled)**: these are "**Explain** / **Discuss**" questions. For each factor give *what it is → how it improves performance → a limit*. A top-band answer covers **several** factors in depth, uses correct terms (cache hit, parallel, 2ⁿ locations), and reaches a judgement, e.g. "adding cores only helps if the software is multi-threaded; for this single-threaded program a faster clock and more cache would help more".
- **Calculations**: addressable locations = 2ⁿ for an n-bit **address** bus; transfers = item size ÷ **data** bus width (round up).
- **State** questions ("State two sources of interrupts") want short, precise answers — a type plus an example.
:::

:::challenge
1. A program spends 30 % of its time in code that must run sequentially. What is the maximum speed-up on 8 cores? On a million cores?
2. Why might an interrupt be **disabled** (masked) during a critical section of the operating system? What could go wrong if it weren't?
3. A processor has a 20-bit address bus and is word-addressable with 16-bit words. How many bytes of memory can it address?
4. Explain why doubling the clock speed of a processor might give much less than double the performance for a program that processes a huge array stored in RAM.
:::

:::recap
- **Interrupt** = signal requesting the processor's attention; sources: **I/O devices, timer, software (system call/error), hardware failure**.
- The processor **checks for interrupts at the end of every fetch–execute cycle**; only **higher-priority** interrupts are serviced immediately.
- Servicing: **save volatile environment (PC, status register, registers) on the stack → PC ← ISR address → run ISR → restore → resume**.
- Saved because the **ISR overwrites the registers**; a **stack** handles **nested** interrupts in the right (LIFO) order.
- **Cores**: parallel work, but not a linear speed-up. **Cache**: fewer slow RAM accesses (hits). **Clock**: more cycles per second, limited by heat.
- **Word length**: bits processed as a unit. **Address bus**: n lines → **2ⁿ locations**. **Data bus**: n lines → **n bits per transfer**.
:::

:::related
- [7.1 Internal hardware components and buses](#/topic/7.1)
- [7.2 The stored program concept and the processor](#/topic/7.2)
- [6.1 Hardware, software and the operating system](#/topic/6.1)
- [2.3 Stacks](#/topic/2.3)
- [7.5 External hardware devices](#/topic/7.5)
:::

*/});
