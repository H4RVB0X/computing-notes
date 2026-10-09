CS.registerFlashcards("7.1", [
  { front: "Which bus is one-way and which are two-way?", back: "Address bus: unidirectional (processor → memory/I-O). Data bus and control bus: bidirectional." },
  { front: "Address bus width n → how many addressable locations?", back: "2ⁿ locations." },
  { front: "What does data bus width determine?", back: "The number of bits transferred in one operation (usually the word length)." },
  { front: "Name four signals carried on the control bus.", back: "Memory read, memory write, clock, interrupt request (also bus request, bus grant, reset)." },
  { front: "Steps of a memory read in terms of buses", back: "Address on address bus → memory-read signal on control bus → memory puts contents on data bus → processor copies into a register (MBR)." },
  { front: "Give three reasons for using I/O controllers.", back: "Devices have different signals/protocols; standard interface to the system bus so the processor needn't know device details; buffering because devices are slower than the processor." },
  { front: "Von Neumann vs Harvard in one line each", back: "Von Neumann: one memory + shared buses for instructions and data. Harvard: separate instruction and data memories + separate buses, so both can be accessed at once." },
  { front: "Typical uses of Harvard architecture", back: "Embedded systems / microcontrollers and digital signal processors (DSPs)." },
  { front: "What is the von Neumann bottleneck?", back: "Instructions and data share one bus, so they cannot be transferred at the same time, limiting throughput." },
]);
