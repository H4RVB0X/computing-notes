CS.registerTopic({ id: "6.1", title: "Hardware, software and the operating system" }, function () {/*

:::objectives
- Define **hardware** and **software** and explain why each is useless without the other.
- Classify software as **system software** or **application software**, giving examples and explaining the need for each type.
- Describe the functions of an **operating system**, including **resource management** (processor, memory, I/O) and **file management**, **user interface** and **security**.
- Explain what is meant by the OS providing a **virtual machine** that hides the complexity of the hardware.
- Describe the purpose of **utility programs**, **libraries** (including DLLs) and **translators**, with examples.
:::

:::quick At a glance
- **Hardware** = the physical components of a computer system. **Software** = the programs (sequences of instructions) that run on it.
- Hardware needs software to tell it what to do; software needs hardware to execute on.
- **System software** runs and manages the computer: **operating system**, **utility programs**, **libraries**, **translators**.
- **Application software** lets the user do a useful task: word processor, browser, game, payroll system.
- The OS provides a **virtual machine**: it **hides the complexity of the hardware** from users and programs behind a simpler interface.
- The OS does **resource management**: allocates **processor time** (scheduling), **memory** and **I/O devices** among **competing processes**.
- It also manages **files and secondary storage**, provides the **user interface** and enforces **security** (accounts, permissions).
- **Utilities** maintain and optimise the system: backup, compression, antivirus, disk defragmenter, encryption.
- **Libraries** are pre-written, pre-tested subroutines that programs can call; a **DLL** is a library linked at run time and shared between programs.
:::

:::keyterms
Hardware :: The physical, tangible components of a computer system. :: The bits you can touch: processor, RAM, disks, keyboard.
Software :: A set of instructions (programs) and associated data that tell the hardware what to do. :: The programs.
System software :: Software that manages and controls the hardware and provides a platform on which application software can run. :: Software that runs the computer, not the user's task.
Application software :: Software designed to let the user perform a specific useful task. :: Software that does a job for you.
Operating system (OS) :: A collection of programs that manages the hardware resources, provides an interface for the user and a platform for application software. :: The boss program that runs everything else.
Virtual machine (OS sense) :: The simplified view of the computer that the OS presents, hiding the complexities of the hardware from users and application programs. :: You see "files" and "windows", not disk sectors and memory addresses.
Resource management :: Allocating and scheduling the hardware resources (processors, memory, I/O devices) among competing processes. :: Sharing out the hardware fairly and efficiently.
Process :: A program that is currently being executed (loaded into memory and scheduled). :: A running program.
Scheduling :: The OS function that decides which process uses the processor and for how long. :: Deciding whose turn it is.
Memory management :: The OS function that allocates main memory to processes, keeps track of which locations each process uses and stops processes accessing each other's memory. :: Handing out and policing RAM.
Device driver :: A program that lets the OS communicate with a specific hardware device by translating general OS requests into device-specific commands. :: The translator between the OS and one particular gadget.
Utility program :: System software that performs a specific task to maintain, configure or optimise the computer system. :: A housekeeping tool.
Library :: A collection of pre-written, pre-compiled and tested subroutines that programmers can use in their own programs. :: Code someone already wrote and tested for you.
Dynamic link library (DLL) :: A library that is linked to a program when it is loaded or run, rather than copied into the executable, so one copy can be shared by many programs. :: A shared library loaded at run time.
Translator :: A program that converts program code from one language into another, e.g. assembler, compiler, interpreter. :: Turns code humans write into code the processor runs.
:::

## Hardware and software: two halves of one system

:::definition
- **Hardware** is the physical, tangible parts of a computer system: processor, main memory, buses, secondary storage, input and output devices.
- **Software** is the set of instructions (programs), plus any associated data and documentation, that tells the hardware what to do.
:::

The relationship is one of total dependence:

- **Hardware without software** does nothing useful. A processor only executes instructions; with no instructions it just sits there.
- **Software without hardware** cannot run. A program is a list of instructions that must be loaded into memory and executed by a processor.
- Software is written for particular hardware. Ultimately every program becomes **machine code** for a specific **instruction set** (see [6.2](#/topic/6.2)).

:::why
Why is the distinction useful? Because the same hardware can do completely different jobs just by loading different software. That is the core idea of the **stored program concept** ([7.2](#/topic/7.2)): a general-purpose machine that is reprogrammed by changing what is in memory.
:::

## Classifying software

<svg class="diagram" viewBox="0 0 700 230" role="img" aria-label="Software splits into system software (operating system, utilities, libraries, translators) and application software">
<g font-family="inherit">
<rect x="250" y="10" width="160" height="40" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="330.0" y="35.0" font-size="13" text-anchor="middle" font-weight="600">Software</text>
<rect x="70" y="90" width="180" height="40" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="160.0" y="115.0" font-size="13" text-anchor="middle" font-weight="600">System software</text>
<rect x="420" y="90" width="180" height="40" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="510.0" y="115.0" font-size="13" text-anchor="middle" font-weight="600">Application software</text>
<path d="M330,50 L330,70 L160,70 L160,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M330,70 L510,70 L510,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="5" y="170" width="100" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="55.0" y="192.0" font-size="11" text-anchor="middle" font-weight="600">Operating system</text><text x="55.0" y="209.0" font-size="11" text-anchor="middle" >Windows, Linux</text>
<path d="M160,130 L160,150 L55,150 L55,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="109" y="170" width="100" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="159.0" y="192.0" font-size="11" text-anchor="middle" font-weight="600">Utility programs</text><text x="159.0" y="209.0" font-size="11" text-anchor="middle" >backup, antivirus</text>
<path d="M160,130 L160,150 L159,150 L159,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="213" y="170" width="100" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="263.0" y="192.0" font-size="11" text-anchor="middle" font-weight="600">Libraries</text><text x="263.0" y="209.0" font-size="11" text-anchor="middle" >DLLs, maths, I/O</text>
<path d="M160,130 L160,150 L263,150 L263,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="317" y="170" width="100" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="367.0" y="192.0" font-size="11" text-anchor="middle" font-weight="600">Translators</text><text x="367.0" y="209.0" font-size="11" text-anchor="middle" >compilers etc.</text>
<path d="M160,130 L160,150 L367,150 L367,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="428" y="170" width="86" height="50" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="471.0" y="192.0" font-size="10" text-anchor="middle" font-weight="600">General purpose</text><text x="471.0" y="209.0" font-size="11" text-anchor="middle" >word processor</text>
<path d="M510,130 L510,150 L471,150 L471,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="518" y="170" width="86" height="50" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="561.0" y="192.0" font-size="10" text-anchor="middle" font-weight="600">Special purpose</text><text x="561.0" y="209.0" font-size="11" text-anchor="middle" >payroll, CAD</text>
<path d="M510,130 L510,150 L561,150 L561,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<rect x="608" y="170" width="86" height="50" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="651.0" y="192.0" font-size="10" text-anchor="middle" font-weight="600">Bespoke</text><text x="651.0" y="209.0" font-size="11" text-anchor="middle" >written to order</text>
<path d="M510,130 L510,150 L651,150 L651,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
</g>
</svg>
| | System software | Application software |
|---|---|---|
| **Purpose** | Runs, manages and maintains the computer itself | Lets the user carry out a real-world task |
| **Who it serves** | The hardware, other programs and the user | The end user |
| **Examples** | Windows, Linux, Android; antivirus; disk defragmenter; compilers; a maths library | Word processor, spreadsheet, web browser, game, payroll system, CAD package |
| **Can the computer work without it?** | No (at least the OS is needed) | Yes, but it would be pointless |

### Why system software is needed
- Without an OS, **every application would need its own code** to drive the disk, the screen, the network card and the keyboard. That is wasteful and every program would have to be rewritten for every hardware combination.
- System software provides these common services **once**, so application programmers can concentrate on the task.

### Types of application software (attributes)

| Type | Attributes | Example |
|---|---|---|
| **General-purpose** (off-the-shelf) | Cheap per user, widely tested, lots of support and training, may contain features you don't need or lack ones you do | Word processor, spreadsheet |
| **Special-purpose** | Does one specific type of task well, bought off the shelf | Payroll, route-planning, accounting |
| **Bespoke** (custom-written) | Written to the exact requirements of one organisation; expensive and slow to develop; fewer users means less testing; organisation may own the code | A hospital's patient booking system |

:::trap
- Do not say "system software is the operating system". The OS is **one type** of system software; utilities, libraries and translators are system software too.
- "Software is the programs on a computer" is weak. Say **a set of instructions** that **tells the hardware what to do**.
- An antivirus program is **system software** (a utility), even though you install it like an app.
:::

## The operating system

The **operating system** is the most important piece of system software. It sits between the user (and their applications) and the hardware.

<svg class="diagram" viewBox="0 0 650 258" role="img" aria-label="Layers: the user uses application software, which asks the operating system, which controls the hardware">
<g font-family="inherit">
<defs><marker id="arr61" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="150" y="10" width="300" height="40" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="300.0" y="35.0" font-size="13" text-anchor="middle" font-weight="600">User</text>
<rect x="150" y="70" width="300" height="46" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="300.0" y="90.0" font-size="13" text-anchor="middle" font-weight="600">Application software</text><text x="300.0" y="107.0" font-size="11" text-anchor="middle" >word processor, browser, game</text>
<rect x="150" y="136" width="300" height="46" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="300.0" y="156.0" font-size="13" text-anchor="middle" font-weight="600">Operating system</text><text x="300.0" y="173.0" font-size="11" text-anchor="middle" >virtual machine: hides the hardware</text>
<rect x="150" y="202" width="300" height="46" rx="8" fill="#888" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><text x="300.0" y="222.0" font-size="13" text-anchor="middle" font-weight="600">Hardware</text><text x="300.0" y="239.0" font-size="11" text-anchor="middle" >processor, memory, disks, I/O devices</text>
<line x1="280" y1="50" x2="280" y2="70" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr61)"/>
<line x1="320" y1="70" x2="320" y2="50" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr61)"/>
<line x1="280" y1="116" x2="280" y2="136" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr61)"/>
<line x1="320" y1="136" x2="320" y2="116" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr61)"/>
<line x1="280" y1="182" x2="280" y2="202" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr61)"/>
<line x1="320" y1="202" x2="320" y2="182" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr61)"/>
<text x="470" y="98" font-size="12" text-anchor="start" >asks the OS: "save this file"</text>
<text x="470" y="164" font-size="12" text-anchor="start" >turns that into disk</text>
<text x="470" y="178" font-size="12" text-anchor="start" >tracks, sectors, drivers</text>
<text x="130" y="98" font-size="12" text-anchor="end" >system calls</text>
<text x="130" y="164" font-size="12" text-anchor="end" >device drivers</text>
</g>
</svg>
It has two big roles that the specification names directly:

1. **Hide the complexity of the hardware** by presenting a **virtual machine**.
2. **Manage the hardware resources** (processors, memory, I/O devices) among **competing processes**.

### The OS as a virtual machine

When you save a file, you click "Save" and choose a folder. You never say "write these 37 blocks to track 1024, sector 12 of platter 2, then update the file allocation table". The OS does that for you.

:::definition The virtual machine idea
The OS presents the user and application programs with a **simplified, idealised machine** that is easy to use, **hiding the complexities of the real hardware**. Users see files, folders, windows and a print button; programs see simple **system calls** like "open file" or "allocate memory".
:::

Examples of complexity hidden by the OS:
- **Files** hide where the data actually is on the disk (it may be scattered in non-contiguous blocks).
- **Memory management** hides where a program really sits in RAM; each program can behave as if it has the memory to itself.
- **Device drivers** hide the differences between thousands of printer and graphics card models.
- **Scheduling** makes one processor core look like many programs running at once.

:::trap Two different "virtual machines"
- **This page:** the OS *is* a virtual machine in the sense of **hiding hardware complexity** behind a simple interface. This is what an exam question on the OS wants.
- **[6.3](#/topic/6.3):** a *process virtual machine* such as the **Java Virtual Machine** is software that **executes bytecode**.
- There is also *virtualisation software* (e.g. running Linux inside Windows). Not what AQA means here.

Read the context of the question and use the right meaning.
:::

### Resource management

A **process** is a program in execution. A modern computer has dozens of processes competing for a small number of processor cores, a fixed amount of RAM and shared devices. The OS must share these out **fairly and efficiently**.

#### 1. Processor scheduling

With one processor core, only **one process can execute at any instant**. The OS **scheduler** gives each process a short **time slice** (a few milliseconds) and switches between them so quickly that they *appear* to run simultaneously. This is **multitasking**.

<svg class="diagram" viewBox="0 0 600 100" role="img" aria-label="Round robin scheduling: processes A, B and C take turns in fixed time slices">
<g font-family="inherit">
<rect x="20" y="30" width="58" height="36" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="49.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">A</text>
<rect x="82" y="30" width="58" height="36" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="111.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">B</text>
<rect x="144" y="30" width="58" height="36" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="173.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">C</text>
<rect x="206" y="30" width="58" height="36" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="235.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">A</text>
<rect x="268" y="30" width="58" height="36" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="297.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">B</text>
<rect x="330" y="30" width="58" height="36" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="359.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">C</text>
<rect x="392" y="30" width="58" height="36" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="421.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">A</text>
<rect x="454" y="30" width="58" height="36" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="483.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">C</text>
<rect x="516" y="30" width="58" height="36" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="545.0" y="53.0" font-size="14" text-anchor="middle" font-weight="600">C</text>
<text x="20" y="20" font-size="12" text-anchor="start" >time slices on one processor core →</text>
<text x="20" y="90" font-size="12" text-anchor="start" >B finishes after its 2nd slice; A after its 3rd; C keeps the processor alone at the end.</text>
</g>
</svg>
- The simplest fair method is **round robin**: processes take turns in a queue, each getting one time slice, then going to the back of the queue if unfinished.
- Other policies exist (first come first served, priority-based, shortest job first). You do not need their names for AQA, but you should know that the OS **decides the order** and **how long** each process runs.
- When the OS switches process, it saves the current process's register values and restores the next one's (similar to handling an [interrupt](#/topic/7.4)).

:::example Simulate round robin
Three processes need 3, 2 and 4 time slices. The scheduler uses a [queue](#/topic/2.2): take the front process, run it for one slice, put it at the back if it still needs time.

```python
from collections import deque

needs = {"A": 3, "B": 2, "C": 4}      # time slices each process needs
ready = deque(["A", "B", "C"])         # ready queue
timeline = []
while ready:
    p = ready.popleft()                # front of the queue gets the processor
    timeline.append(p)
    needs[p] -= 1                      # one time slice used
    if needs[p] > 0:
        ready.append(p)                # unfinished: back of the queue
print(" ".join(timeline))
```
```output
A B C A B C A C C
```
Notice that B finishes after slice 5, A after slice 7, C last. No process waits for another to finish completely, which keeps every program responsive.
:::

#### 2. Memory management

- Instructions and data must be in **main memory** before the processor can fetch them, so every process needs RAM.
- The OS **allocates** memory to each process when it starts and **frees** it when it ends.
- It **keeps track** of which locations belong to which process. A process's memory need not be contiguous.
- It **protects** processes from each other: one program must not overwrite another's data (or the OS itself).
- When RAM is full, it can use **virtual memory**: part of secondary storage acts as an overflow, and pages are swapped in and out. This lets more programs run, at the cost of speed.

#### 3. Input/output (I/O) device management

- Programs request I/O through the OS rather than talking to devices directly.
- The OS uses **device drivers** to communicate with each specific device.
- It handles **interrupts** from devices (e.g. "key pressed", "printer ready for more data").
- It **queues and buffers** requests when several processes want the same device. A print queue (spooling) lets you keep working while a long document prints block by block.

### Other functions of the OS

| Function | What the OS does |
|---|---|
| **File (secondary storage) management** | Organises files in a **hierarchical directory** (folder) structure; tracks where each file's blocks are stored and which space is free; handles create/open/save/delete; enforces access permissions. Two files can share a name if their **paths** differ. |
| **User interface** | Provides a GUI or command-line interface so the user can launch programs, manage files and change settings. |
| **Security** | User accounts and passwords, **access rights/permissions** on files and resources, separating users' data, logging activity, applying updates. |
| **Interrupt handling** | Responds to interrupts from hardware and software, running the correct interrupt service routine. |

:::trap
- "The OS manages memory" is too vague for a mark. Say **what it does**: allocates memory to processes, keeps track of which locations are in use, prevents processes accessing each other's memory.
- "Programs run at the same time" on one core is wrong. They **appear** to run at the same time because the scheduler **switches rapidly** between them using **time slices**.
- **Resource management** (processor, memory, I/O) and **file management** are separate functions. One textbook answer muddles them; keep them apart.
:::

## Utility programs

A **utility program** is system software that does one specific job to **maintain, configure, protect or optimise** the computer. Some come with the OS; others are installed separately.

| Utility | What it does | Why it is needed |
|---|---|---|
| **Backup** | Copies files to another device or location, often on a schedule; full or incremental | Data can be restored after hardware failure, deletion, ransomware or fire |
| **Compression** | Reduces file size using lossless (zip) or lossy methods | Saves storage space and transmission time ([5.8](#/topic/5.8)) |
| **Antivirus / anti-malware** | Scans files and memory, compares against signatures and suspicious behaviour, quarantines threats | Protects data and system from malware |
| **Disk defragmenter** | Moves the scattered blocks of each file on a **magnetic hard disk** so they are contiguous, and groups free space together | Fewer head movements, so files load faster |
| **Encryption** | Encrypts files or whole drives | Data is unreadable if a device is stolen |
| **Disk clean-up** | Removes temporary and duplicate files | Recovers storage space |
| **File manager** | Lets the user browse, copy, move and rename files | Easy file organisation |
| **Diagnostic/monitoring** | Reports on CPU temperature, disk health, memory use | Spots problems early |

:::trap
- Defragmenting helps **magnetic hard disks** because the read/write head has to move to each fragment. **Do not** recommend defragmenting an SSD: access time does not depend on location and extra writes shorten its life.
- A utility is not "a small application". It **maintains or optimises the computer**, not the user's real-world task.
:::

## Libraries

A **library** is a collection of **pre-written, pre-compiled, tested subroutines** (and sometimes data such as constants or classes) that programmers can call from their own programs.

```python
import math, random, statistics    # three standard library modules

print(math.sqrt(2))                # someone else wrote and tested sqrt
random.seed(1)
print(random.randint(1, 6))        # pseudo-random number
print(statistics.mean([4, 8, 15, 16, 23, 42]))
```
```output
1.4142135623730951
2
18
```

### Why use libraries?
- **Saves development time**: no need to write common routines (file handling, maths, graphics, networking) again.
- **Reliable**: library code has been widely used and **thoroughly tested**, so it is less likely to contain bugs.
- **Expertise**: routines may be written by specialists (e.g. encryption or fast maths) and be better optimised than code you could write.
- **Consistency**: programs that use the same library behave consistently (e.g. the same dialog boxes in every Windows program).
- **Abstraction**: the programmer only needs to know the **interface** (name, parameters, return value), not how it works.

### Static linking versus dynamic link libraries (DLLs)

| | Static linking | Dynamic linking (DLL / shared library) |
|---|---|---|
| When joined to the program | By the **linker** at compile time; library code is **copied into the executable** | When the program is **loaded or run**; executable just holds a reference |
| Executable size | Larger | Smaller |
| Memory | Each program has its own copy | **One copy in memory shared** by many programs |
| Updates | Program must be re-linked to get a fixed library | Update the DLL once and every program using it benefits |
| Risk | Self-contained, always works | Program fails if the DLL is missing or an incompatible version is installed ("DLL hell") |

:::note File names
Windows DLLs end in `.dll`; Linux shared libraries end in `.so`; macOS uses `.dylib`. Your VB.NET `Imports System.IO` uses classes from a .NET library assembly that is loaded at run time.
:::

## Translators (overview)

Programs are written in a programming language but the processor can only execute **machine code**. A **translator** converts source code into a form that can be executed. Full detail is in [6.3 Program translators](#/topic/6.3).

| Translator | Translates | How |
|---|---|---|
| **Assembler** | Assembly language → machine code | Each mnemonic → one machine code instruction |
| **Compiler** | High-level source code → object (machine) code | Whole program at once, produces an executable |
| **Interpreter** | High-level source code | Analyses and executes it statement by statement each time it runs; no object code produced |

## Worked examples

:::example Classify the software
| Program | Type | Reason |
|---|---|---|
| Linux | System (OS) | Manages hardware, provides platform for applications |
| Google Chrome | Application | Lets the user browse the web, a user task |
| 7-Zip | System (utility) | Compresses files to save storage space |
| Python's `math` module | System (library) | Pre-written routines called by other programs |
| GCC (C compiler) | System (translator) | Translates source code to machine code |
| School's bespoke timetabling program | Application (bespoke) | Performs a user task, written for one organisation |
| Printer driver | System (part of the OS / device management) | Lets the OS talk to one model of printer |
:::

:::example Model answer: "Explain how the OS allows a word processor and a music player to appear to run at the same time on a single-core computer." (3 marks)
1. Both programs are **processes** loaded into **main memory**; the OS has **allocated memory** to each and keeps them separate.
2. The OS **scheduler** gives each process a short **time slice** of processor time in turn (e.g. round robin).
3. When a slice ends the OS saves the state of the current process and switches to the next; the switching is **so fast** that both appear to run simultaneously.
:::

:::exam
- **"Define hardware/software"** (1 mark each): hardware = physical components; software = instructions/programs that tell the hardware what to do.
- **"Explain the role of the OS"**: always cover both **hiding complexity (virtual machine)** and **resource management**. Name the resources: **processor, memory, I/O devices**.
- **"Describe resource management"** (4–6 marks): one point each for **scheduling/time slicing**, **memory allocation and protection**, **I/O via drivers/interrupts/queues**, and give a concrete example (print queue, two programs open).
- **"State two utility programs"**: name *and* give the purpose (e.g. "backup: copies data so it can be restored if lost").
- **"Explain why programmers use libraries"**: saves time, tested so reliable, written by experts, programmer needs only the interface.
- **"Explain the advantage of a DLL"**: smaller executables, one copy shared in memory, update the library without recompiling the programs.
:::

:::challenge
1. A smartphone has 8 cores but runs hundreds of processes. Explain why scheduling is still needed and what extra job the OS has on a multi-core processor.
2. Why does a program that uses lots of memory slow down dramatically when RAM is nearly full? Use the term **virtual memory** in your answer.
3. Explain why an operating system on a washing machine controller would be far simpler than Windows. Which OS functions could it drop?
4. Two programs need different, incompatible versions of the same DLL. Suggest two ways an OS or developer could solve this.
:::

:::recap
- Hardware = physical components; software = instructions that tell the hardware what to do. Each is useless without the other.
- System software (OS, utilities, libraries, translators) runs the computer; application software does a user's task.
- The OS provides a **virtual machine**, hiding hardware complexity behind files, windows and system calls.
- **Resource management**: scheduling processor time (time slices, round robin), allocating and protecting memory, managing I/O devices with drivers, interrupts and queues.
- The OS also does file management, the user interface and security.
- Utilities: backup, compression, antivirus, defragmenter (HDD only), encryption, clean-up.
- Libraries: pre-written, tested routines; DLLs are linked at run time and shared, keeping executables small.
:::

:::related
- [6.2 Classification of programming languages](#/topic/6.2)
- [6.3 Program translators](#/topic/6.3)
- [7.1 Internal hardware components and buses](#/topic/7.1)
- [7.4 Interrupts and processor performance](#/topic/7.4)
- [2.2 Queues](#/topic/2.2) — used by the scheduler and print spooler
:::

*/});
