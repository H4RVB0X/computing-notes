CS.registerFlashcards("6.1", [
  { front: "What are the **four** types of system software?", back: "Operating system · utility programs · libraries · translators (assembler, compiler, interpreter)" },
  { front: "What are the two main roles of the operating system (AQA wording)?", back: "1. Hide the complexity of the hardware from the user and programs (provide a **virtual machine**).\n2. **Resource management**: allocate processors, memory and I/O devices among competing processes." },
  { front: "How does one processor core appear to run several programs at once?", back: "The scheduler gives each process a short **time slice** in turn (e.g. round robin) and switches between them very quickly." },
  { front: "Give three jobs of OS **memory management**.", back: "Allocate memory to processes (and free it) · keep track of which locations each process uses · stop processes accessing each other's memory · (use virtual memory when RAM is full)" },
  { front: "Give four OS functions other than resource management.", back: "File/secondary storage management · user interface · security (accounts, passwords, permissions) · interrupt handling" },
  { front: "Name four utility programs and what each does.", back: "Backup (copies data for recovery) · compression (reduces file size) · antivirus (detects/removes malware) · disk defragmenter (makes file blocks contiguous on a HDD)" },
  { front: "Why do programmers use libraries?", back: "Saves time · code already tested so reliable · written by experts · only need to know the interface" },
  { front: "Static linking vs DLL: which gives smaller executables and why?", back: "DLL: the library is linked at load/run time and shared, so its code is not copied into each executable." },
  { front: "Give one disadvantage of DLLs.", back: "The program fails if the DLL is missing or an incompatible version is installed (\"DLL hell\")." },
  { front: "Off-the-shelf vs bespoke software: one advantage of each.", back: "Off-the-shelf: cheaper, widely tested, support available.\nBespoke: meets the organisation's exact requirements." },
]);
