CS.registerTopic({ id: "6.3", title: "Program translators" }, function () {/*

:::objectives
- Explain why programs must be translated, and the difference between **source code** and **object (executable) code**.
- Describe the role of an **assembler**, a **compiler** and an **interpreter**.
- Compare compilation and interpretation and choose the right one for a given situation.
- Explain why some compilers produce **intermediate code (bytecode)** and how it is then executed by a **virtual machine**, including **JIT compilation**.
:::

:::quick At a glance
- The processor only executes **machine code**, so all other code must be **translated**.
- **Source code** = the program as written by the programmer (human-readable). **Object code** = the translated machine code produced by a compiler or assembler.
- **Assembler**: assembly language → machine code, **one-to-one**.
- **Compiler**: translates the **whole** high-level program **once** into object code; reports errors after analysing the whole program; executable runs fast with no translator present; source code stays private; executable is **platform-specific**.
- **Interpreter**: analyses and executes the source code **statement by statement**, **every time** it runs; stops at the first error; **no object code**; slower; the interpreter and the source must be on the user's machine.
- **Bytecode**: some compilers output an intermediate code that a **virtual machine** executes. Compile once, **run on any platform** with a VM (Java, Python, C#).
- **JIT compiler**: the VM compiles frequently-used bytecode into native machine code while the program runs, for speed.
:::

:::keyterms
Translator :: A program that converts source code into a form (usually machine code) that can be executed. :: Turns your code into something the CPU understands.
Source code :: The program as written by the programmer in a programming language, before translation. :: The code you type.
Object code :: The machine code output of a compiler or assembler, which can be executed (possibly after linking) without the source code. :: The translated, runnable version.
Assembler :: A translator that converts assembly language into machine code, each instruction translating to one machine code instruction. :: Translator for assembly.
Compiler :: A translator that converts the whole of a high-level program into object code in one go, before the program is run. :: Translates everything first, runs later.
Interpreter :: A translator that analyses and executes a high-level program one statement at a time, without producing object code. :: Translates and runs as it goes.
Executable :: A file containing object code ready to be loaded and run by the operating system. :: The .exe.
Intermediate code (bytecode) :: A low-level, platform-independent code produced by some compilers, which is executed by a virtual machine rather than directly by the processor. :: Halfway between source and machine code.
Virtual machine (bytecode sense) :: Software that executes intermediate code/bytecode on a particular platform, by interpreting it or compiling it to native machine code. :: A pretend processor written in software.
Just-in-time (JIT) compilation :: Compiling bytecode into native machine code during execution, typically for code that runs often, so later executions are faster. :: Compiling at the last minute.
Linker :: A program that combines object code files and library routines into a single executable. :: Glues compiled pieces together.
Syntax error :: An error where the code breaks the grammar rules of the language, so it cannot be translated. :: A typo the translator rejects.
:::

## Why translate at all?

A processor can only execute **machine code** in its own **instruction set**. Programmers write in assembly or high-level languages because they are far easier to work with ([6.2](#/topic/6.2)). So a **translator** must convert the program before (or while) it runs.

### Source code and object code

| | Source code | Object code |
|---|---|---|
| Written by | The programmer | The translator (compiler/assembler) |
| Language | High-level or assembly language | Machine code (binary) |
| Readable by humans? | Yes (comments, identifiers, indentation) | Not realistically |
| Executable by the processor? | No, must be translated | Yes (once linked into an executable) |
| Portable? | Yes, if high-level | No, specific to one instruction set and usually one OS |
| Can be edited? | Yes, then re-translated | Not sensibly |

:::trap
- **Object code** is the **output** of a compiler or assembler. An interpreter does **not** produce object code.
- Do not define source code as "code in an IDE". Define it as **the program written by the programmer, before translation**.
:::

## The three translators

### Assembler

- Translates **assembly language** into **machine code**.
- Each mnemonic is looked up and replaced by its binary opcode: **one-to-one**.
- Also replaces **labels** (e.g. `loop:`) with real memory addresses, converts numbers into binary and strips out comments.
- Because assembly is processor-specific, so is the assembler.

### Compiler

A compiler translates the **entire** high-level program into object code **before** it is run.

:::steps Stages of compilation (awareness only)
1. **Lexical analysis**: removes whitespace and comments, splits the code into **tokens** (keywords, identifiers, operators), builds a symbol table.
2. **Syntax analysis**: checks the tokens obey the language's grammar; reports syntax errors.
3. **Semantic analysis**: checks meaning, e.g. type compatibility, variables declared.
4. **Code generation**: produces object code.
5. **Optimisation**: rewrites the code to run faster or use less memory.
:::

- **All the errors it finds are reported together** after it has analysed the program. Object code is only produced once **all** syntax errors are fixed.
- The resulting **executable** runs without the compiler or the source code being present.
- The executable is fast: **no translation happens at run time**.
- It is **platform-specific**: an executable compiled for Windows on x86 will not run on macOS on ARM; it must be recompiled.

### Interpreter

An interpreter takes the source code and, **one statement at a time**, analyses it and **immediately executes** it (by calling its own pre-written routines). Then it moves to the next statement.

- **No object code** is produced. Every time the program runs, it is translated again.
- It **stops at the first error** it reaches, so the programmer can fix it and continue. Statements before the error have already run.
- Code inside a loop is re-translated **every time round the loop**, which is why interpretation is slow.
- The **interpreter must be installed** on every computer that runs the program, and the **source code must be distributed**.
- The same source runs on any platform that has an interpreter: good **portability**.

<svg class="diagram" viewBox="0 0 640 192" role="img" aria-label="Compiler translates whole source to object code once; interpreter translates and executes each statement every run">
<g font-family="inherit">
<defs><marker id="arr63" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<text x="10" y="22" font-size="13" text-anchor="start" font-weight="700">Compiler: translate once, run many times</text>
<rect x="10" y="35" width="120" height="46" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="70.0" y="55.0" font-size="12" text-anchor="middle" font-weight="600">Source code</text><text x="70.0" y="72.0" font-size="11" text-anchor="middle" >whole program</text>
<line x1="130" y1="58" x2="165" y2="58" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr63)"/>
<rect x="167" y="35" width="110" height="46" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="222.0" y="55.0" font-size="12" text-anchor="middle" font-weight="600">Compiler</text><text x="222.0" y="72.0" font-size="11" text-anchor="middle" >errors listed at end</text>
<line x1="277" y1="58" x2="312" y2="58" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr63)"/>
<rect x="314" y="35" width="130" height="46" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="379.0" y="55.0" font-size="12" text-anchor="middle" font-weight="600">Object code</text><text x="379.0" y="72.0" font-size="11" text-anchor="middle" >executable file</text>
<line x1="444" y1="58" x2="479" y2="58" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr63)"/>
<rect x="481" y="35" width="150" height="46" rx="8" fill="#888" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><text x="556.0" y="55.0" font-size="12" text-anchor="middle" font-weight="600">Runs on CPU</text><text x="556.0" y="72.0" font-size="11" text-anchor="middle" >no translator needed</text>
<text x="10" y="122" font-size="13" text-anchor="start" font-weight="700">Interpreter: translate and run each statement, every time</text>
<rect x="10" y="135" width="120" height="46" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="70.0" y="155.0" font-size="12" text-anchor="middle" font-weight="600">Source code</text><text x="70.0" y="172.0" font-size="11" text-anchor="middle" >statement by statement</text>
<line x1="130" y1="158" x2="165" y2="158" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr63)"/>
<rect x="167" y="135" width="200" height="46" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="267.0" y="155.0" font-size="12" text-anchor="middle" font-weight="600">Interpreter</text><text x="267.0" y="172.0" font-size="11" text-anchor="middle" >analyse → execute → next line</text>
<line x1="367" y1="158" x2="402" y2="158" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr63)"/>
<rect x="404" y="135" width="227" height="46" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="517.5" y="155.0" font-size="12" text-anchor="middle" font-weight="600">Output as it goes</text><text x="517.5" y="172.0" font-size="11" text-anchor="middle" >stops at first error; no object code</text>
</g>
</svg>
## Compiler versus interpreter

| Feature | Compiler | Interpreter |
|---|---|---|
| **When translation happens** | Once, before the program is run | Every time the program runs, statement by statement |
| **Output** | Object code / executable file | No object code; program is executed directly |
| **Execution speed** | Fast: no translation at run time; code can be optimised | Slow: each statement analysed as it runs (and repeatedly in loops) |
| **Error reporting** | All errors listed after analysing the whole program; no executable until all fixed | Stops at the first error encountered; earlier lines have already run |
| **Testing and debugging** | Slower cycle: edit → recompile whole program → run | Quick: run straight away, test small parts, inspect variables when it stops |
| **What the user needs** | Just the executable | The interpreter **and** the source code |
| **Source code protection** | Source kept private; executable is hard to reverse-engineer | Source must be given out, so it can be read, copied and modified |
| **Portability** | Executable tied to one platform; recompile for each | Same source runs anywhere with an interpreter |
| **Memory** | Compiler not needed at run time | Interpreter must be in memory alongside the program |

### When is each appropriate?

| Situation | Best choice | Why |
|---|---|---|
| Selling a finished commercial game | Compiler | Fast execution; source code protected; customer needs nothing extra |
| Learning to program / prototyping | Interpreter | Run instantly, errors located immediately, test small sections |
| Script that runs on many unknown platforms (e.g. JavaScript in a browser) | Interpreter (or bytecode + VM) | Same source works everywhere a browser runs |
| Real-time control or heavy number crunching | Compiler | Every bit of speed matters |
| Small utility run once by its developer | Either; interpreter is convenient | Speed hardly matters |

:::trap
- "A compiler **runs** the program" is wrong. A compiler only **translates**; the OS later loads and runs the executable.
- "An interpreter translates the program into machine code line by line **and saves it**" is wrong. It produces **no object code**; it executes each statement and moves on.
- "Interpreted programs are guaranteed to work on any machine" (from the class notes) overstates it: they work on any machine **that has the right interpreter installed**, and can still hit run-time errors.
- "Compiled code has no errors" is wrong: a compiler detects **syntax** errors, but **logic** and many **run-time** errors survive compilation.
:::

## Intermediate code: bytecode and virtual machines

Some compilers do not produce machine code for a real processor. They produce **intermediate code**, usually called **bytecode**: compact, low-level instructions for an imaginary processor.

<svg class="diagram" viewBox="0 0 640 176" role="img" aria-label="Source code is compiled once to bytecode, which runs on a virtual machine on any platform">
<g font-family="inherit">
<defs><marker id="arr64" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<rect x="10" y="60" width="110" height="50" rx="8" fill="#ffb86b" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="65.0" y="82.0" font-size="12" text-anchor="middle" font-weight="600">Source code</text><text x="65.0" y="99.0" font-size="11" text-anchor="middle" >.java / .py</text>
<line x1="120" y1="85" x2="150" y2="85" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr64)"/>
<rect x="152" y="60" width="100" height="50" rx="8" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="202.0" y="82.0" font-size="12" text-anchor="middle" font-weight="600">Compiler</text><text x="202.0" y="99.0" font-size="11" text-anchor="middle" >once, by developer</text>
<line x1="252" y1="85" x2="282" y2="85" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr64)"/>
<rect x="284" y="60" width="110" height="50" rx="8" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"/><text x="339.0" y="82.0" font-size="12" text-anchor="middle" font-weight="600">Bytecode</text><text x="339.0" y="99.0" font-size="11" text-anchor="middle" >same file for all</text>
<line x1="394" y1="85" x2="430" y2="33" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr64)"/>
<rect x="432" y="10" width="200" height="46" rx="8" fill="#888" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><text x="532.0" y="30.0" font-size="12" text-anchor="middle" font-weight="600">VM on Windows/x86</text><text x="532.0" y="47.0" font-size="11" text-anchor="middle" >interprets or JIT-compiles</text>
<line x1="394" y1="85" x2="430" y2="88" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr64)"/>
<rect x="432" y="65" width="200" height="46" rx="8" fill="#888" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><text x="532.0" y="85.0" font-size="12" text-anchor="middle" font-weight="600">VM on macOS/ARM</text><text x="532.0" y="102.0" font-size="11" text-anchor="middle" >interprets or JIT-compiles</text>
<line x1="394" y1="85" x2="430" y2="143" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr64)"/>
<rect x="432" y="120" width="200" height="46" rx="8" fill="#888" fill-opacity="0.2" stroke="currentColor" stroke-width="1.5"/><text x="532.0" y="140.0" font-size="12" text-anchor="middle" font-weight="600">VM on Android/ARM</text><text x="532.0" y="157.0" font-size="11" text-anchor="middle" >interprets or JIT-compiles</text>
</g>
</svg>
### How it is used

1. The developer **compiles** the source code **once** into bytecode (Java: `javac` turns `.java` into `.class` files; Python turns `.py` into `.pyc`).
2. The bytecode is distributed.
3. On each user's computer a **virtual machine** for that platform (the **Java Virtual Machine**, the **Python VM**, .NET's CLR) **executes** the bytecode:
   - by **interpreting** it, instruction by instruction, or
   - by **just-in-time (JIT) compiling** the most frequently run parts into native machine code for that processor, then running that directly.

### Why produce bytecode?

- **Portability: "compile once, run anywhere"**. One bytecode file runs on any platform that has a VM. The developer does not need to compile separately for every processor/OS combination.
- **Faster than interpreting source code**: lexical and syntax analysis have already been done, and bytecode is simple to execute. JIT compilation can approach compiled speed.
- **Source code is not distributed**, giving some protection (though bytecode is easier to decompile than native code).
- **Security**: the VM can run code in a **sandbox**, checking it before execution and limiting what it can access.
- **Smaller downloads**: bytecode is compact.

:::example See Python's own bytecode
Python compiles every function to bytecode before running it. The `dis` module shows it:

```python
import dis

def add_up(n):
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total

print(add_up(5))
dis.dis(add_up)        # list the bytecode instructions the Python VM executes
```

You will see instructions such as `LOAD_FAST`, `BINARY_OP` (or `BINARY_ADD` in older versions), `STORE_FAST` and `RETURN_VALUE`. The exact list depends on the Python version, which is the point: it is code for the **Python virtual machine**, not for your processor. Notice how much it looks like assembly: one simple operation per instruction.
:::

:::trap Bytecode is not machine code
Bytecode **cannot be executed directly by the processor**. It needs a virtual machine. And the "virtual machine" here is a program that runs bytecode, which is a different meaning from the OS "virtual machine" in [6.1](#/topic/6.1).
:::

## Worked exam-style answer

:::example "A company is developing a program that will be sold to customers who use Windows, macOS and Linux. Discuss whether they should use a compiler, an interpreter or a compiler that produces bytecode."
**Compiler to native code**
- Fast executables; source code protected, important for a commercial product.
- But they must compile, test and distribute **three separate versions**, one per platform.

**Interpreter**
- One version of the source runs on all three platforms; easy for developers to test.
- But customers need the interpreter installed, the **source code is exposed** (competitors could copy it) and execution is slower.

**Bytecode + virtual machine (e.g. Java)**
- Compile **once**; the same bytecode runs on all three platforms via each platform's VM.
- Source code is not distributed; JIT compilation gives speed close to native code.
- Customers need the VM installed (or it is bundled), and bytecode is easier to decompile than native code.

**Conclusion:** bytecode is the best balance of portability, speed and protection for this scenario, unless maximum performance is critical, in which case native compilation per platform is worth the extra effort.
:::

:::exam
- **"Explain the difference between a compiler and an interpreter"** (4): compiler translates whole program before execution / interpreter translates and executes statement by statement; compiler produces object code / interpreter does not; compiled program runs faster / interpreted re-translated each run; compiler reports all errors after translation / interpreter stops at first error.
- **"Describe a situation where an interpreter is more appropriate"**: during development/debugging, or when the program must run on many platforms; justify with the feature.
- **"Explain why some compilers produce bytecode and how it is used"** (3–4): bytecode is platform-independent; executed by a virtual machine on the target; the VM interprets it or JIT-compiles it; so the same compiled program runs on any platform with a VM.
- **"Explain the difference between source and object code"** (2): source = written by programmer in HLL/assembly, must be translated; object = machine code produced by the translator, can be executed.
- Discussion questions (6–9 marks): structure your answer by translator, give advantages **and** disadvantages, tie every point to the scenario, and finish with a justified conclusion.
:::

:::challenge
1. JavaScript was originally purely interpreted, but modern browsers use JIT compilers. Explain why this change happened.
2. Why might a compiled program still need some libraries (DLLs) on the user's machine? Relate to the **linker**.
3. An interpreter stops at a run-time error on line 200. A compiler accepted the same program without complaint. How can both be true?
4. Python and Java both use bytecode, yet Python is usually described as "interpreted" and Java as "compiled". Argue for and against these labels.
:::

:::recap
- Only machine code can be executed, so everything else needs a translator.
- Source code (programmer-written) → object code (machine code from compiler/assembler).
- Assembler: assembly → machine code, one-to-one, replaces labels with addresses.
- Compiler: whole program once; executable is fast, source protected, platform-specific; all errors reported together.
- Interpreter: statement by statement every run; no object code; stops at first error; slower; needs interpreter + source on the target.
- Bytecode: platform-independent intermediate code, executed by a virtual machine (interpreted or JIT-compiled); compile once, run anywhere.
:::

:::related
- [6.2 Classification of programming languages](#/topic/6.2)
- [6.1 Hardware, software and the operating system](#/topic/6.1)
- [7.3 Instruction sets and assembly language](#/topic/7.3)
- [4.5 Backus-Naur Form and syntax diagrams](#/topic/4.5) — how syntax analysis defines the grammar
:::

*/});
