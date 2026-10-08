CS.registerTopic({ id: "7.1", title: "Internal hardware components and buses" }, function () {/*

:::objectives
- Name the internal components of a computer (processor, main memory, buses, I/O controllers) and say what each one **does** and **why it is needed**.
- Explain what a **bus** is and describe the role, direction and width of the **address**, **data** and **control** buses.
- Calculate how much memory an address bus can address, and how much data a data bus moves per transfer.
- Explain **addressable memory**, and read a simple memory map written in hexadecimal.
- Compare **von Neumann** and **Harvard** architectures and say where each is typically used.
:::

:::quick At a glance
- **Processor**: fetches, decodes and executes instructions. **Main memory**: holds the instructions and data currently in use. **I/O controllers**: interface between the processor and devices.
- A **bus** is a set of parallel wires that connects components and carries signals between them.
- **Address bus** (one way: processor → memory/I-O): carries the address of the location to read or write. Width *n* → **2ⁿ addressable locations**.
- **Data bus** (two way): carries the data or instruction being transferred. Width = **bits moved per transfer**.
- **Control bus** (two way): carries control and timing signals: memory read, memory write, clock, interrupt request, bus request/grant, reset.
- **Von Neumann**: one memory and one set of buses shared by instructions and data. **Harvard**: separate memories and buses for instructions and data, so both can be fetched at the same time. Harvard is typical in **embedded systems and DSPs**; von Neumann in **general-purpose computers**.
:::

:::keyterms
Processor :: The component that fetches, decodes and executes the instructions of a stored program, performing arithmetic and logical operations on data. :: The bit that actually runs the program.
Main memory :: Memory that the processor can access directly, consisting of addressable locations that store the instructions and data of programs currently being executed. :: The working memory the processor reads instructions and data from.
Bus :: A set of parallel communication lines (wires) that connects components of a computer and transfers signals between them. :: A shared set of wires for sending signals between parts.
Address bus :: A unidirectional bus that carries the address of the memory location or I/O port that is to be read from or written to. :: Says *where* to read or write.
Data bus :: A bidirectional bus that carries data and instructions between the processor, main memory and I/O controllers. :: Carries *what* is being read or written.
Control bus :: A bidirectional bus that carries control and timing signals (e.g. memory read, memory write, clock, interrupt request) between components. :: Says *what kind of operation* is happening, and when.
I/O controller :: An electronic circuit that connects to a system bus and an I/O device, providing the interface between the processor and the device. :: A translator so the processor can talk to a device without knowing how it works inside.
Addressable memory :: Memory organised into locations, each with a unique address, so that any location can be read from or written to by specifying its address. :: Every memory box has its own number.
Word :: A fixed number of bits that the processor treats as a single unit when processing or transferring data. :: The processor's natural chunk size.
Von Neumann architecture :: An architecture in which instructions and data are stored in the same memory and share the same buses. :: One memory, one route for everything.
Harvard architecture :: An architecture in which instructions and data are stored in physically separate memories with separate buses. :: Two memories, two routes, used at the same time.
:::

## The big picture

Every computer has to do four jobs: **input**, **store**, **process** and **output**. Inside the case, a small number of components cooperate to make that happen.

<svg class="diagram" viewBox="0 0 660 320" role="img" aria-label="Processor, main memory and two I/O controllers connected by the address, data and control buses">
  <defs><marker id="arr71" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker>
  <marker id="arr71b" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 z" fill="currentColor"/></marker></defs>
  <g font-size="14" font-family="inherit">
    <rect x="20" y="20" width="150" height="80" rx="10" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/>
    <text x="95" y="55" text-anchor="middle" font-weight="700">Processor</text><text x="95" y="76" text-anchor="middle" font-size="12">ALU · CU · registers · clock</text>
    <rect x="210" y="20" width="140" height="80" rx="10" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/>
    <text x="280" y="55" text-anchor="middle" font-weight="700">Main memory</text><text x="280" y="76" text-anchor="middle" font-size="12">addressable locations</text>
    <rect x="390" y="20" width="120" height="80" rx="10" fill="#ffa94d" fill-opacity="0.25" stroke="currentColor"/>
    <text x="450" y="55" text-anchor="middle" font-weight="700">I/O controller</text><text x="450" y="76" text-anchor="middle" font-size="12">e.g. USB, disk</text>
    <rect x="530" y="20" width="110" height="80" rx="10" fill="#ffa94d" fill-opacity="0.25" stroke="currentColor"/>
    <text x="585" y="55" text-anchor="middle" font-weight="700">I/O controller</text><text x="585" y="76" text-anchor="middle" font-size="12">e.g. display</text>
    <line x1="20" y1="160" x2="640" y2="160" stroke="currentColor" stroke-width="3"/><text x="24" y="152" font-weight="700">Address bus (one way)</text>
    <line x1="20" y1="215" x2="640" y2="215" stroke="currentColor" stroke-width="3"/><text x="24" y="207" font-weight="700">Data bus (two way)</text>
    <line x1="20" y1="270" x2="640" y2="270" stroke="currentColor" stroke-width="3" stroke-dasharray="7 4"/><text x="24" y="262" font-weight="700">Control bus (two way)</text>
    <line x1="80" y1="100" x2="80" y2="157" stroke="currentColor" marker-end="url(#arr71)"/>
    <line x1="280" y1="157" x2="280" y2="103" stroke="currentColor" marker-end="url(#arr71)"/>
    <line x1="450" y1="157" x2="450" y2="103" stroke="currentColor" marker-end="url(#arr71)"/>
    <line x1="585" y1="157" x2="585" y2="103" stroke="currentColor" marker-end="url(#arr71)"/>
    <line x1="110" y1="103" x2="110" y2="212" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="300" y1="103" x2="300" y2="212" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="470" y1="103" x2="470" y2="212" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="605" y1="103" x2="605" y2="212" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="140" y1="103" x2="140" y2="267" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="325" y1="103" x2="325" y2="267" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="495" y1="103" x2="495" y2="267" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <line x1="625" y1="103" x2="625" y2="267" stroke="currentColor" marker-start="url(#arr71b)" marker-end="url(#arr71)"/>
    <text x="330" y="305" text-anchor="middle" font-size="12">The system bus = address bus + data bus + control bus</text>
  </g>
</svg>

| Component | What it does | Why it is needed |
|---|---|---|
| **Processor** | Fetches, decodes and executes instructions; does arithmetic and logic | Something has to carry out the program |
| **Main memory** (RAM, plus ROM) | Stores the instructions and data of programs currently running | The processor can only execute what is in main memory; it cannot run directly from secondary storage |
| **Address bus** | Carries the address of the location being accessed | Memory needs to know *which* location |
| **Data bus** | Carries the instruction or data value being moved | The value itself has to travel |
| **Control bus** | Carries signals that coordinate and time every transfer | Components need to agree *what* is happening and *when* |
| **I/O controllers** | Sit between the system bus and each device | Devices all work differently; the controller hides that |

:::note RAM versus ROM
Main memory is mostly **RAM**: fast, read/write and **volatile** (contents lost when power is off). A small amount of **ROM** is **non-volatile** and holds the start-up (boot) program, because something must run when the power comes on before anything has been loaded into RAM. Neither is "secondary storage" — a hard disk or SSD is **not** main memory.
:::

## Buses

A **bus** is a set of parallel wires. Each wire carries one bit at a time, so a 16-line bus can carry 16 bits simultaneously. The **width** of a bus is the number of lines it has.

### The address bus

- Carries the **address** of the memory location (or I/O port) to be read or written.
- **Unidirectional**: addresses only travel *from the processor* to memory and I/O controllers.
- Its width decides **how many locations can be addressed**: with *n* lines there are 2ⁿ different addresses.

:::example How much memory can be addressed?
A processor has a **24-bit address bus** and each location holds **one byte**.

1. Number of different addresses = 2²⁴ = 16,777,216.
2. Each address identifies one byte, so the maximum memory = 16,777,216 bytes.
3. 2²⁴ B = 2⁴ × 2²⁰ B = 16 MiB.

If each location held a 16-bit word instead, the capacity would be 2²⁴ × 2 bytes = 32 MiB. **Always check what one location holds.**
:::

### The data bus

- Carries the **data** (or **instruction**) being transferred.
- **Bidirectional**: data travels to the processor on a read, and from it on a write.
- Its width decides **how many bits are moved in one transfer**. A 64-bit data bus moves 64 bits per transfer; a 32-bit one needs two transfers to move the same 64-bit value.
- Data-bus width usually matches the processor's **word length**.

### The control bus

- **Bidirectional**: some signals go from the processor (e.g. memory read), others go to it (e.g. an interrupt request from a device).
- Each line is an individual signal rather than part of a number.

| Typical control signal | Purpose |
|---|---|
| Memory read | Tells memory to put the contents of the addressed location on the data bus |
| Memory write | Tells memory to store the value on the data bus at the addressed location |
| Clock | Synchronises the operations of components |
| Interrupt request | A device asks for the processor's attention |
| Bus request / bus grant | A device asks to use the buses, and is given permission |
| Reset | Puts the system back into its initial state |

:::steps How the buses cooperate when the processor reads memory location 2A₁₆
1. The processor puts **2A** on the **address bus**.
2. It puts a **memory read** signal on the **control bus**.
3. Memory decodes the address, finds location 2A, and puts its contents on the **data bus**.
4. The processor copies the value from the data bus into a register (the MBR).
:::

A **write** is the same but in the other direction: address on the address bus, the value on the data bus, then a **memory write** signal on the control bus.

:::trap
- **Do not mix up the widths.** A 16-bit **data** bus moves 16 bits per transfer. A 16-bit **address** bus gives 2¹⁶ = 65,536 addressable locations. Some textbook answers wrongly say "a 16-bit data bus can carry 65,536 bits" — it can't.
- **Direction matters.** Address bus: one way. Data and control buses: two way. "All buses are bidirectional" loses the mark.
- **The data bus carries instructions too.** Instructions are fetched from memory along the data bus, not along the address bus.
- Saying a bus "connects things" is not enough for a "describe" mark. Say **what it carries** and **which direction**.
:::

## I/O controllers

Devices such as keyboards, disks and displays all work in different ways, at different speeds, using different voltages and signals. Connecting each one directly to the processor would be impossible to manage.

An **I/O controller** sits between the system bus and a device. It contains:
- an **interface** to the system bus,
- an interface to the **device**,
- **buffers/registers** to hold data passing between them, and
- **control logic** that handles the device's own protocol.

:::why Why use I/O controllers?
1. **Different devices, one interface.** The processor talks to every controller in the same way over the system bus; the controller deals with the device's specific signals. New devices can be added without redesigning the processor.
2. **Speed mismatch.** Devices are far slower than the processor. The controller buffers data so the processor is not left waiting; it can carry on and be **interrupted** when the device is ready.
3. **Electrical differences.** The controller converts the device's voltages and signal formats.
:::

## Addressable memory

Main memory is organised as a long sequence of **locations**. Each location has a **unique address** and stores a fixed number of bits (usually one byte on modern machines, though exam questions often use a "word").

- To read or write a location, the processor only has to supply its address. Any location can be accessed in the same time: this is what **random access** means.
- Addresses are usually written in **hexadecimal**, because they are long binary numbers.

:::example Reading a memory map
| Address (hex) | Contents | Notes |
|---|---|---|
| 0000 – 0FFF | Boot ROM | 4,096 locations (0x1000 = 4096) |
| 1000 – 7FFF | Operating system | |
| 8000 – EFFF | User programs and data | |
| F000 – FFFF | Memory-mapped I/O | reading/writing here talks to controllers |

The highest address is FFFF₁₆ = 65,535, so this machine has 65,536 = 2¹⁶ addresses: a **16-bit address bus**.
:::

## Von Neumann and Harvard architectures

### Von Neumann

The von Neumann architecture (John von Neumann's team, 1945) stores **both instructions and data in the same memory**, and uses **one set of buses** for both. This is the **stored program concept** in its simplest form (see [7.2](#/topic/7.2)).

### Harvard

The Harvard architecture uses **physically separate memories** — one for instructions and one for data — each with **its own buses**.

<svg class="diagram" viewBox="0 0 640 220" role="img" aria-label="Von Neumann with one shared memory compared with Harvard with separate instruction and data memories">
  <g font-size="13" font-family="inherit">
    <text x="150" y="20" text-anchor="middle" font-weight="700" font-size="15">Von Neumann</text>
    <rect x="90" y="40" width="120" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="150" y="70" text-anchor="middle">Processor</text>
    <rect x="70" y="150" width="160" height="50" rx="8" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/><text x="150" y="172" text-anchor="middle">Memory</text><text x="150" y="190" text-anchor="middle" font-size="11">instructions + data</text>
    <line x1="150" y1="90" x2="150" y2="150" stroke="currentColor" stroke-width="5"/><text x="160" y="125" font-size="11">one shared set of buses</text>
    <text x="480" y="20" text-anchor="middle" font-weight="700" font-size="15">Harvard</text>
    <rect x="420" y="40" width="120" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="480" y="70" text-anchor="middle">Processor</text>
    <rect x="330" y="150" width="130" height="50" rx="8" fill="#ffa94d" fill-opacity="0.25" stroke="currentColor"/><text x="395" y="172" text-anchor="middle">Instruction</text><text x="395" y="190" text-anchor="middle">memory</text>
    <rect x="500" y="150" width="130" height="50" rx="8" fill="#35d4bd" fill-opacity="0.25" stroke="currentColor"/><text x="565" y="172" text-anchor="middle">Data</text><text x="565" y="190" text-anchor="middle">memory</text>
    <line x1="450" y1="90" x2="395" y2="150" stroke="currentColor" stroke-width="5"/>
    <line x1="510" y1="90" x2="565" y2="150" stroke="currentColor" stroke-width="5"/>
    <text x="480" y="132" text-anchor="middle" font-size="11">two separate sets of buses</text>
  </g>
</svg>

| | Von Neumann | Harvard |
|---|---|---|
| Memory | One memory for instructions **and** data | Separate instruction memory and data memory |
| Buses | One shared set | Separate sets for each memory |
| Fetching | Instruction and data cannot be fetched at the same time (the **von Neumann bottleneck**) | Next instruction can be fetched **while** data is read/written: faster |
| Flexibility | Memory can be split however a program needs | Fixed split; unused instruction memory cannot hold data |
| Memory sizes / word lengths | Must be the same | Can differ (e.g. 16-bit instructions in flash, 8-bit data in RAM) |
| Cost / complexity | Simpler, cheaper | More complex, more wiring |
| Typical use | General-purpose computers: PCs, laptops, servers, phones | **Embedded systems**, microcontrollers, **digital signal processors (DSPs)** |

:::why Why is Harvard used in embedded systems and DSPs?
- The program is **fixed** (stored in ROM/flash) and never changes, so a separate, read-only instruction memory makes sense.
- DSPs (e.g. in audio processing or a phone's radio) must handle a stream of data in **real time**; fetching instructions and data simultaneously gives the speed they need.
- Program and data memory can be built from **different technologies** of different sizes, which suits cheap microcontrollers.
:::

:::note Modern processors are a hybrid
A modern PC is von Neumann at the main-memory level (one RAM holds programs and data), but inside the processor it has **separate L1 caches for instructions and data**: Harvard-style. This "modified Harvard" design gets the speed of Harvard with the flexibility of von Neumann. You will not be asked to define it, but it makes a strong evaluative point.
:::

:::trap
- "Harvard is faster because it has more memory" — no. It is faster because instruction and data accesses can happen **at the same time** over **separate buses**.
- Give a **specific use** when asked where each is used: "embedded systems such as a washing machine controller, or a digital signal processor" is better than "small computers".
:::

:::exam
- **State** (1 mark each): the role of a single bus or component. One precise sentence: what it carries/does + direction if it is a bus.
- **Describe** the buses (3–6 marks): for each bus, what it carries **and** its direction; extra marks for linking address-bus width to addressable memory and data-bus width to bits per transfer.
- **Explain** why I/O controllers are needed (2–3 marks): different devices/protocols; processor need not know device details; buffering/speed difference.
- **Compare** von Neumann and Harvard (4 marks): one memory vs two; shared vs separate buses; simultaneous fetch; plus a typical use for each. A comparison must mention **both** sides in each point.
- **Calculate** questions: show 2ⁿ, then convert units carefully (KiB/MiB vs kB/MB — see [5.3](#/topic/5.3)).
:::

:::challenge
1. A processor with a 32-bit address bus is byte-addressable. What is the maximum RAM it can use? Why do 64-bit PCs not actually have 64-bit address buses?
2. Explain why doubling the data bus width does not necessarily double a program's speed.
3. A games console stores its game code in ROM on a cartridge and uses separate RAM for game state. Which architecture is this closer to, and what would be gained?
:::

:::recap
- Internal components: **processor**, **main memory**, **I/O controllers**, connected by the **system bus**.
- **Address bus**: one way, carries addresses; width *n* → 2ⁿ addressable locations.
- **Data bus**: two way, carries data and instructions; width = bits per transfer (usually the word length).
- **Control bus**: two way, carries control/timing signals (memory read/write, clock, interrupt request, bus request/grant).
- **I/O controllers** give a standard interface to very different devices and buffer the speed difference.
- **Addressable memory**: every location has a unique address, often written in hex.
- **Von Neumann**: shared memory and buses (general purpose). **Harvard**: separate instruction/data memory and buses, simultaneous access (embedded, DSP).
:::

:::related
- [7.2 The stored program concept and the processor](#/topic/7.2)
- [7.4 Interrupts and processor performance](#/topic/7.4)
- [5.3 Units of information](#/topic/5.3)
- [5.2 Number bases](#/topic/5.2)
:::

*/});
