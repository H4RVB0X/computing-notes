CS.registerTopic({ id: "4.8", title: "Turing machines" }, function () {/*

:::objectives
- Describe the structure of a **Turing machine**: finite set of states, finite alphabet, infinite tape, read-write head, start state and halting states.
- Read and write transition rules in the form **δ(state, symbol) = (next state, symbol to write, move)**.
- Convert between a **transition function** and a **state transition diagram** in both directions.
- **Hand-trace** a simple Turing machine, showing the tape, head position and state at every step.
- Explain the importance of Turing machines and the **Universal Turing machine** to computing.
:::

:::quick At a glance
- A **Turing machine (TM)** is an abstract model of computation devised by **Alan Turing in 1936**. It can be viewed as a computer with a **single fixed program**.
- Parts: a **finite set of states** (one **start state**, one or more **halting states**), a **finite alphabet** of symbols (including the blank **□**), an **infinite tape** divided into cells, and a **read-write head** that moves **one cell left or right** per step.
- Rules: **δ(current state, symbol read) = (next state, symbol to write, L/R)**. Each step: read → write → move → change state.
- The same rules can be drawn as a **state transition diagram**: an arrow from the current state to the next, labelled **read/write, move** (e.g. `1/0, R`).
- A **halting state** has **no outgoing transitions**: the machine stops when it enters it.
- A TM is more powerful than an FSM because it can **write** to an **unlimited tape**, so it has unlimited memory.
- The **Universal Turing machine (UTM)** reads a **description of any other TM** plus that machine's input from its tape and **simulates** it, so it can compute anything any TM can. It is the theoretical basis of the **stored-program** computer: programs are just data.
- **Church–Turing thesis**: anything that can be computed by an algorithm can be computed by a TM. So TMs define what is **computable**, and let us prove what **isn't** (the halting problem).
:::

:::keyterms
Turing machine :: A formal model of computation consisting of a finite set of states, a finite alphabet, an infinite tape divided into cells, and a read-write head that moves along the tape one cell at a time according to a transition function. :: A theoretical computer with one fixed program and unlimited tape memory.
Tape :: An infinitely long strip divided into cells, each holding one symbol from the alphabet (or blank); acts as the machine's input, output and memory. :: The machine's endless scrap paper.
Read-write head :: The part of a Turing machine that reads the symbol in the current cell, can overwrite it, and moves one cell left or right. :: The pencil-and-eraser that looks at one square at a time.
Alphabet :: The finite set of symbols that can appear on the tape, including the blank symbol. :: The symbols the machine knows about.
Start state :: The state the machine is in when it begins. :: Where it starts.
Halting state :: A state with no outgoing transitions; when the machine enters it, it stops. :: The "finished" state.
Transition function :: The rules of a Turing machine, written δ(current state, input symbol) = (next state, output symbol, movement). :: The machine's program.
State transition diagram :: A diagram in which states are circles and each transition is an arrow labelled with the symbol read, the symbol written and the direction moved. :: The rules drawn as a picture.
Universal Turing machine :: A Turing machine that can simulate any other Turing machine by reading a description of that machine (its transition rules) and its input from its tape. :: One machine that can run any other machine's program.
Computable :: A problem is computable if a Turing machine (equivalently, an algorithm) exists that solves it in a finite number of steps. :: Some program could solve it.
:::

## Why Turing invented it

In 1936 there were no general-purpose computers. Mathematicians were asking a deep question: **is there a mechanical procedure that can decide any mathematical statement?** To answer it, Alan Turing needed a precise definition of "mechanical procedure". His answer was the **Turing machine**: so simple you could run it with pencil and paper, yet able to carry out **any** algorithm.

Using it, Turing showed that some problems, such as the **halting problem** ([4.7](#/topic/4.7)), can never be solved by any procedure at all.

## The structure of a Turing machine

:::figure A Turing machine: control unit with states, read-write head, infinite tape
<svg class="diagram" viewBox="0 0 620 230" role="img" aria-label="An infinite tape of cells containing blank, 1, 0, 1, 1, blank. A read-write head points at the cell containing 0. Above it a control unit box holds the current state S0 and the transition rules.">
  <defs><marker id="arr48" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <rect x="200" y="14" width="220" height="74" rx="12" fill="#b197fc" fill-opacity="0.25" stroke="currentColor"/>
  <text x="310" y="38" font-size="14" font-weight="700" text-anchor="middle">Control unit</text>
  <text x="310" y="58" font-size="13" text-anchor="middle">current state: S0</text>
  <text x="310" y="76" font-size="12" text-anchor="middle">rules δ(state, symbol) = (…)</text>
  <path d="M310,88 V138" stroke="currentColor" stroke-width="2" marker-end="url(#arr48)"/>
  <text x="322" y="118" font-size="12">read-write head</text>
  <g stroke="currentColor" fill="none"><rect x="100" y="140" width="60" height="50"/><rect x="160" y="140" width="60" height="50"/><rect x="220" y="140" width="60" height="50"/><rect x="280" y="140" width="60" height="50" fill="#ffd43b" fill-opacity="0.35" stroke-width="2.5"/><rect x="340" y="140" width="60" height="50"/><rect x="400" y="140" width="60" height="50"/><rect x="460" y="140" width="60" height="50"/></g>
  <g font-size="20" font-weight="700" text-anchor="middle" font-family="inherit"><text x="130" y="172">□</text><text x="190" y="172">1</text><text x="250" y="172">1</text><text x="310" y="172">0</text><text x="370" y="172">1</text><text x="430" y="172">1</text><text x="490" y="172">□</text></g>
  <text x="70" y="172" font-size="18" text-anchor="middle">…</text><text x="555" y="172" font-size="18" text-anchor="middle">…</text>
  <text x="310" y="218" font-size="12" text-anchor="middle">the tape is infinite in both directions; unused cells are blank (□)</text>
</svg>
:::

| Component | What it is |
|---|---|
| **Finite set of states** | e.g. {S0, S1, S2, H}. Exactly one is the **start state**; states with **no outgoing transitions** are **halting states**. |
| **Finite alphabet** | the symbols allowed on the tape, e.g. {0, 1, □}. The **blank** □ fills every unused cell. |
| **Infinite tape** | cells in a line, unlimited in length: input, output and working memory all in one. |
| **Read-write head** | looks at **one cell**; can overwrite it; moves **one cell left or right** each step. |
| **Transition function δ** | the rules: what to do for each (state, symbol read) pair. This is the machine's **one fixed program**. |

:::trap Marks are lost here
- Your ZigZag slide says a Turing machine "is an example of a finite-state machine". Better: a TM is an **FSM (the control unit) plus an infinite tape it can read and write**. That tape gives it unlimited memory, which is exactly why it is **more powerful** than an FSM (it can recognise aⁿbⁿ, for example).
- The textbook's list of components (tape, head, "ability to move the tape") misses marks. Name **all** of them: finite **states** (with start and halting states), finite **alphabet**, infinite **tape**, **read-write head**, **transition rules**.
- The head moves **one cell at a time**, never jumping.
:::

## Transition rules: δ notation

Each rule says, for **one** combination of current state and symbol read, what to do next:

> **δ(S0, 1) = (S1, 0, R)**
> "If you are in state **S0** and the head reads **1**, then **write 0**, **move right** one cell, and go to state **S1**."

Order inside the brackets: **(next state, symbol written, direction)**. Writing the same symbol back (e.g. read 1, write 1) means "leave it unchanged". In every step the machine **writes first, then moves**.

The machine is **deterministic**: there is at most one rule for each (state, symbol) pair. If it reaches a pair with no rule, or enters a halting state, it **stops**.

### Three ways to show the same machine

A **bit inverter**: flip every bit until the first blank, then halt.

::::columns
**Transition function**

```text
δ(S0, 0) = (S0, 1, R)
δ(S0, 1) = (S0, 0, R)
δ(S0, □) = (H,  □, L)
```

**State table**

| State | Read | Write | Move | Next |
|---|---|---|---|---|
| S0 | 0 | 1 | R | S0 |
| S0 | 1 | 0 | R | S0 |
| S0 | □ | □ | L | H |

|||

**State transition diagram**

<svg class="diagram" viewBox="0 0 340 200" role="img" aria-label="State S0, marked as the start state, has a self-loop labelled 0/1,R and 1/0,R, and an arrow labelled blank/blank,L to the halting state H, drawn as a double circle.">
  <defs><marker id="arr48b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g fill="none" stroke="currentColor" stroke-width="1.8">
    <path d="M30,130 H72" marker-end="url(#arr48b)"/>
    <circle cx="100" cy="130" r="27"/>
    <path d="M88,105 C60,45 140,45 112,105" marker-end="url(#arr48b)"/>
    <path d="M127,130 H243" marker-end="url(#arr48b)"/>
    <circle cx="270" cy="130" r="27"/><circle cx="270" cy="130" r="21"/>
  </g>
  <g font-size="14" text-anchor="middle" font-family="inherit">
    <text x="100" y="135" font-weight="700">S0</text><text x="270" y="135" font-weight="700">H</text>
    <text x="100" y="40">0/1, R</text><text x="100" y="24">1/0, R</text>
    <text x="185" y="120">□/□, L</text>
  </g>
</svg>
::::

Label format on the diagram: **read / write, move**. The start state has an arrow coming in from nowhere; a halting state is often drawn with a double circle (it has no arrows leaving it).

**Converting:** each δ rule becomes **one labelled arrow** from the current state to the next state. Going the other way, each arrow gives one rule. Arrows from a state back to itself are **self-loops**.

## Hand-tracing a Turing machine

Work methodically. At each step note the **state**, the **head position** and the symbol under the head; find the **one** matching rule; **write**, then **move**, then **change state**.

:::example Unary addition: 11 + 1
Unary represents n as n 1s, so `11+1` means 2 + 1. The machine replaces `+` with `1` (giving one 1 too many), runs to the end, steps back and erases the last 1.

```text
δ(S0, 1) = (S0, 1, R)      skip over the first number
δ(S0, +) = (S1, 1, R)      replace + with 1
δ(S1, 1) = (S1, 1, R)      skip over the second number
δ(S1, □) = (S2, □, L)      found the end: step back
δ(S2, 1) = (H,  □, L)      erase the last 1 and halt
```

Start: state **S0**, head on cell 0. `[ ]` marks the head.

| Step | State | Head | Read | Rule applied | Tape after |
|---|---|---|---|---|---|
| 0 | S0 | 0 | 1 | (start) | **[1]**1+1□ |
| 1 | S0 | 0 | 1 | δ(S0, 1) = (S0, 1, R) | 1**[1]**+1□ |
| 2 | S0 | 1 | 1 | δ(S0, 1) = (S0, 1, R) | 11**[+]**1□ |
| 3 | S0 | 2 | + | δ(S0, +) = (S1, 1, R) | 111**[1]**□ |
| 4 | S1 | 3 | 1 | δ(S1, 1) = (S1, 1, R) | 1111**[□]** |
| 5 | S1 | 4 | □ | δ(S1, □) = (S2, □, L) | 111**[1]**□ |
| 6 | S2 | 3 | 1 | δ(S2, 1) = (H, □, L) | 11**[1]**□□ |

The machine is now in **H**, which has no rules, so it **halts**. The tape holds **111** = 3 = 2 + 1. ✓
:::

Run it yourself (the preset tape is `11+111`; type `11+1` and press **Load tape** to match the example):

{{tool:turing-machine preset=add}}

{{trace:4.8-1}}

{{trace:4.8-2}}

:::trap Marks are lost here
- **Write before you move.** If you move first you overwrite the wrong cell.
- Keep the **head position** column: most lost marks come from losing track of where the head is.
- Remember blank cells: the tape doesn't "end"; past the input there are infinitely many □.
- In δ notation the **next state comes first** inside the brackets: (next state, write, move).
:::

## Designing a simple Turing machine

Exam questions sometimes ask you to complete or write a few rules. A good method:

1. Decide what each **state means** ("still reading the first number", "found the end").
2. For each state, decide what to do for **every symbol** it could read.
3. Check with a short trace, including the edge cases (empty input, a single symbol).

:::example Unary increment (add 1)
"Move right over the 1s and write a 1 in the first blank."

```text
δ(S0, 1) = (S0, 1, R)
δ(S0, □) = (H,  1, L)
```

On `111` the head skips three 1s, writes `1` on the blank and halts: `1111` (3 + 1 = 4). On an empty tape it writes a single 1 (0 + 1 = 1).
:::

## Why Turing machines matter

### The Universal Turing machine

Each ordinary TM has **one fixed program** (its δ rules). Turing then realised that the rules of any TM can themselves be **written on a tape** as symbols. A **Universal Turing machine (UTM)**:

1. reads the **description** (encoded transition rules) of any TM **M** from its tape, followed by **M's input**;
2. **simulates** M step by step, producing exactly the output M would produce.

So **one** machine can do the job of **every** Turing machine. It behaves like an **interpreter**: the program is just data on the tape.

:::trap Marks are lost here
The textbook says the UTM "is many Turing machines working together" so it can "combine calculations". **That is wrong.** A UTM is a **single** Turing machine that takes **another machine's description as input** and simulates it. The key idea is that **programs can be treated as data**.
:::

### Its importance to computing

- **Stored-program concept:** the UTM is the theoretical origin of the general-purpose, stored-program computer. Instructions and data sit in the same memory, as in the **von Neumann architecture** ([7.2](#/topic/7.2)). Your laptop is "universal": install new software and it becomes a different machine.
- **Definition of computability:** the **Church–Turing thesis** states that anything that can be computed by an algorithm can be computed by a Turing machine. If no TM can solve a problem, no computer can, however powerful.
- **Proving limits:** because TMs give a precise definition of "algorithm", Turing could **prove** that some problems (the halting problem) are **non-computable**.
- **Hardware-independent model:** TMs let us reason about algorithms and their complexity without worrying about any particular processor or language.

:::exam
- **"Describe the structure of a Turing machine"** (3–4 marks): finite set of states (including a start state and halting state(s)); finite alphabet of symbols; infinite tape divided into cells; read-write head that moves one cell left/right; transition rules.
- **"Write the transition function for this diagram"**: one δ line per arrow, in the order (next state, write, move). Don't forget self-loops.
- **"Draw the state transition diagram"**: a circle per state, the start arrow, a double circle for halting states, every arrow labelled read/write, move.
- **"Trace the machine"** (4–6 marks): show the tape after each step and mark the head position clearly (an arrow or brackets). State the final tape contents and that it halts.
- **"Explain the importance of the UTM"** (2–3 marks): it can simulate any other TM by reading its description from the tape; it shows that programs can be stored and processed as data (stored-program concept / basis of general-purpose computers); it provides a definition of what is computable.
:::

:::challenge
1. Write δ rules for a TM that **erases** its input (replace every symbol with □) and halts.
2. Write a TM that adds a **parity bit** to the end of a binary string so the total number of 1s is **even**. Compare with trace 4.8-2.
3. In the checker above, load the **0ⁿ1ⁿ** preset and trace `0011` by hand first. What does writing X and Y let the machine do that an FSM cannot?
4. Why do we need the tape to be infinite? What would we lose if it were fixed at 1 000 000 cells?
:::

:::recap
- A TM has a **finite set of states** (start + halting), a **finite alphabet** (with □), an **infinite tape** and a **read-write head** moving **one cell** at a time.
- Rules: **δ(state, read) = (next state, write, move)**; each step = write, move, change state.
- The same machine can be shown as a **δ list**, a **state table** or a **state transition diagram** (labels read/write, move).
- A **halting state** has no outgoing transitions; the machine stops there.
- Hand-trace carefully: track **state**, **head position** and **tape** every step.
- **UTM**: one TM that reads another TM's description and simulates it; basis of the **stored-program** computer.
- TMs define what is **computable** (Church–Turing thesis) and allow proofs of what is **not** (the halting problem).
:::

:::related
- [4.2 Finite state machines](#/topic/4.2)
- [4.7 Limits of computation and the halting problem](#/topic/4.7)
- [7.2 The stored program concept and the processor](#/topic/7.2)
:::

*/});
