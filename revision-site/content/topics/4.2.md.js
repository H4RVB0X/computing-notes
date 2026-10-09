CS.registerTopic({ id: "4.2", title: "Finite state machines" }, function () {/*

:::objectives
- Describe a **finite state machine (FSM)**: a finite set of states, an input alphabet, transitions, a start state and (for recognisers) accepting states.
- **Draw and interpret state transition diagrams** and **state transition tables**, and convert between them.
- Decide whether an FSM **accepts** or **rejects** a string by tracing it symbol by symbol.
- Design simple FSMs from a written description, including a **trap (dead) state**.
- Draw and interpret **Mealy machines** (FSMs with output), and trace the output string they produce.
:::

:::quick At a glance
- An **FSM** has a **finite** number of **states**. It reads input symbols one at a time and **transitions** to a next state determined only by its **current state** and the **input**.
- **State transition diagram**: circles = states, arrows = transitions labelled with the input, an arrow from nowhere = **start state**, **double circle** = **accepting state**.
- **State transition table**: one row per (current state, input) pair giving the next state (and output, for a Mealy machine).
- An FSM **without output** (a *finite state automaton*) **accepts** a string only if, after **all** of it has been read, it is in an **accepting state**.
- A **Mealy machine** produces an **output on each transition**, labelled `input/output`. Its output depends on the current state **and** the input.
- FSMs have **no memory** apart from which state they are in, so they cannot count without limit (e.g. they cannot check 0ⁿ1ⁿ).
- FSMs recognise exactly the **regular languages**, the ones regular expressions describe ([4.4](#/topic/4.4)).
:::

:::keyterms
Finite state machine (FSM) :: A model of computation consisting of a finite set of states, an input alphabet and a transition function that maps each (state, input) pair to a next state. :: A machine that is always in one of a fixed set of states and changes state on each input.
State :: One of the finite set of conditions an FSM can be in; it is the machine's only memory. :: Where the machine is right now.
Transition :: A change from one state to another (or the same) state caused by an input symbol. :: An arrow in the diagram.
Start state :: The state the FSM is in before any input has been read; shown by an arrow coming from nowhere. :: Where you begin.
Accepting state :: A state which, if the FSM is in it when the input ends, means the input string is accepted; drawn as a double circle. :: A "yes" state.
State transition diagram :: A directed graph showing an FSM's states as circles and transitions as labelled arrows. :: The picture of the FSM.
State transition table :: A table showing, for each current state and input symbol, the next state (and output for a Mealy machine). :: The FSM as a lookup table.
Mealy machine :: An FSM that produces an output on each transition, where the output depends on both the current state and the input. :: An FSM that writes something every time it moves.
Finite state automaton (FSA) :: An FSM with no output, used to decide whether an input string is accepted. :: A yes/no checker.
Trap (dead) state :: A non-accepting state with transitions only back to itself, so once entered the string can never be accepted. :: A dead end.
Alphabet :: The finite set of symbols that may appear in the input. :: The allowed characters.
:::

## What an FSM is

A **finite state machine** is always in exactly **one** of a **finite** number of states. It reads input **one symbol at a time**; each symbol causes a **transition** to a next state. The next state depends only on **(current state, input symbol)**.

That is the whole machine. It has no variables, no stack and no tape. Its **only memory is which state it is in**.

FSMs model:

- **Physical controllers**: traffic lights, vending machines, lifts, washing machines.
- **Recognisers**: checking whether a string is valid (identifiers in a compiler, input validation, network protocols, regular-expression engines).
- **Translators**: Mealy machines that convert one string into another (e.g. binary to two's complement).

## State transition diagrams

| Symbol | Meaning |
|---|---|
| Circle with a name (S0, S1 …) | a **state** |
| Arrow labelled `a` | a **transition** taken when the input is `a` |
| Arrow from nowhere into a state | the **start state** |
| **Double circle** | an **accepting state** |
| Arrow labelled `a/1` (or `a|1`) | Mealy transition: input `a`, output `1` |

:::figure An FSM that accepts binary strings containing an **even number of 0s**. S0 is both the start state and the accepting state.
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Two-state FSM: S0 start and accepting, S1; 0 moves between them, 1 loops on each">
  <defs><marker id="arr42a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="15">
    <line x1="80" y1="120" x2="140" y2="120" stroke="currentColor" marker-end="url(#arr42a)"/><text x="78" y="110" font-size="12">start</text>
    <circle cx="170" cy="120" r="28" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><circle cx="170" cy="120" r="23" fill="none" stroke="currentColor"/>
    <text x="170" y="125" text-anchor="middle">S0</text>
    <circle cx="390" cy="120" r="28" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="390" y="125" text-anchor="middle">S1</text>
    <path d="M 195,106 Q 280,60 365,106" fill="none" stroke="currentColor" marker-end="url(#arr42a)"/><text x="280" y="74" text-anchor="middle">0</text>
    <path d="M 365,134 Q 280,180 195,134" fill="none" stroke="currentColor" marker-end="url(#arr42a)"/><text x="280" y="176" text-anchor="middle">0</text>
    <path d="M 158,95 C 140,40 200,40 182,95" fill="none" stroke="currentColor" marker-end="url(#arr42a)"/><text x="170" y="42" text-anchor="middle">1</text>
    <path d="M 378,95 C 360,40 420,40 402,95" fill="none" stroke="currentColor" marker-end="url(#arr42a)"/><text x="390" y="42" text-anchor="middle">1</text>
    <text x="280" y="203" text-anchor="middle" font-size="12">S0 = "even number of 0s so far"   S1 = "odd number of 0s so far"</text>
  </g>
</svg>
:::

Giving each state a **meaning** ("even so far", "odd so far") is the key to designing and explaining FSMs.

### The same machine as a state transition table

::::tabs
:::tab List form (one row per transition)
| Current state | Input | Next state |
|---|---|---|
| S0 | 0 | S1 |
| S0 | 1 | S0 |
| S1 | 0 | S0 |
| S1 | 1 | S1 |
:::
:::tab Grid form (states × inputs)
| Current state | Input 0 | Input 1 |
|---|---|---|
| → **S0** (accepting) | S1 | S0 |
| S1 | S0 | S1 |
:::
::::

Both forms hold identical information. Exams use either, so practise converting both ways: **every arrow in the diagram is exactly one entry in the table.**

## Accepting or rejecting a string

:::definition The rule
Start in the start state. Read the input **one symbol at a time**, following the matching transition each time. When the input is **finished**, the string is **accepted** if the machine is in an **accepting state**, otherwise it is **rejected**. If there is no transition for a symbol, the string is rejected.
:::

:::figure An FSM over {a, b} that accepts strings **ending in ab**. S2 is the only accepting state.
<svg class="diagram" viewBox="0 0 600 250" role="img" aria-label="Three-state FSM S0, S1, S2 accepting strings ending in ab">
  <defs><marker id="arr42b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="15">
    <line x1="30" y1="120" x2="90" y2="120" stroke="currentColor" marker-end="url(#arr42b)"/>
    <circle cx="120" cy="120" r="28" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="120" y="125" text-anchor="middle">S0</text>
    <circle cx="300" cy="120" r="28" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="300" y="125" text-anchor="middle">S1</text>
    <circle cx="480" cy="120" r="28" fill="#5fd3a0" fill-opacity="0.3" stroke="currentColor"/><circle cx="480" cy="120" r="23" fill="none" stroke="currentColor"/><text x="480" y="125" text-anchor="middle">S2</text>
    <line x1="148" y1="120" x2="270" y2="120" stroke="currentColor" marker-end="url(#arr42b)"/><text x="210" y="112" text-anchor="middle">a</text>
    <path d="M 324,106 Q 390,70 456,106" fill="none" stroke="currentColor" marker-end="url(#arr42b)"/><text x="390" y="80" text-anchor="middle">b</text>
    <path d="M 456,134 Q 390,170 324,134" fill="none" stroke="currentColor" marker-end="url(#arr42b)"/><text x="390" y="166" text-anchor="middle">a</text>
    <path d="M 468,146 Q 300,265 132,146" fill="none" stroke="currentColor" marker-end="url(#arr42b)"/><text x="300" y="218" text-anchor="middle">b</text>
    <path d="M 108,95 C 90,40 150,40 132,95" fill="none" stroke="currentColor" marker-end="url(#arr42b)"/><text x="120" y="42" text-anchor="middle">b</text>
    <path d="M 288,95 C 270,40 330,40 312,95" fill="none" stroke="currentColor" marker-end="url(#arr42b)"/><text x="300" y="42" text-anchor="middle">a</text>
    <text x="120" y="172" text-anchor="middle" font-size="11">no progress</text>
    <text x="300" y="172" text-anchor="middle" font-size="11">just read a</text>
    <text x="480" y="172" text-anchor="middle" font-size="11">just read ab</text>
  </g>
</svg>
:::

:::example Tracing "abbab" and "abba"
| Step | Current state | Input | Next state |
|---|---|---|---|
| 1 | S0 | a | S1 |
| 2 | S1 | b | S2 |
| 3 | S2 | b | S0 |
| 4 | S0 | a | S1 |
| 5 | S1 | b | **S2** |

"abbab" ends in S2 (accepting) → **accepted**. Note it *passed through* S2 at step 2 as well; that doesn't matter, only the **final** state counts.

"abba": S0 → S1 → S2 → S0 → **S1**. S1 is not accepting → **rejected**.
:::

{{trace:4.2-1}}

:::trap
- **Only the final state counts.** Passing through an accepting state halfway does not accept the string.
- The **whole** input must be read. You can't stop early because you've "reached" the accepting state.
- If the start state is also accepting (as in the even-0s machine), the **empty string** is accepted.
- One of the documents in your notes says that if the machine "is in state S3 when the input string is exhausted, the machine outputs a NO", where S3 is the accepting state. That is backwards: finishing in an **accepting** state means **YES**.
- In a table, write **every** (state, input) pair. A missing transition means the string is rejected, so a complete answer shows them all (or a trap state).
:::

## Designing an FSM

:::steps Method
1. Decide what the machine needs to **remember** at each point. Each distinct thing to remember becomes a **state**, so give each state a meaning.
2. Mark the **start** state and the **accepting** state(s).
3. For **every** state, add a transition for **every** symbol in the alphabet.
4. Add a **trap state** if some prefix makes acceptance impossible.
5. Test with strings that should be accepted, strings that should be rejected, and the empty string.
:::

:::example Binary strings of the form 1 followed by any number of 0s (1, 10, 100, …)
States: **S0** = nothing read yet (start); **S1** = "1 then only 0s so far" (accepting); **Trap** = the string has already gone wrong.

| Current state | Input 0 | Input 1 |
|---|---|---|
| → S0 | Trap | S1 |
| S1 (accepting) | S1 | Trap |
| Trap | Trap | Trap |

"100" → S0, S1, S1, S1: accepted. "0" → Trap: rejected. "101" → S1, S1, Trap: rejected. The regular expression for the same language is `10*`.
:::

Here is a short simulator. It is just a dictionary lookup in a loop, which shows how simple an FSM really is:

```python FSA simulator
def accepts(table, start, accepting, string):
    state = start
    for symbol in string:
        if (state, symbol) not in table:   # no transition: reject
            return False
        state = table[(state, symbol)]
    return state in accepting

ends_ab = {("S0", "a"): "S1", ("S0", "b"): "S0",
           ("S1", "a"): "S1", ("S1", "b"): "S2",
           ("S2", "a"): "S1", ("S2", "b"): "S0"}

for w in ["ab", "abbab", "abba", "bbab", ""]:
    print(repr(w), accepts(ends_ab, "S0", {"S2"}, w))
# 'ab' True / 'abbab' True / 'abba' False / 'bbab' True / '' False
```

{{tool:fsm-simulator preset=endsAB}}

## FSMs with output: Mealy machines

A **Mealy machine** produces an **output symbol on every transition**. The label `1/0` means "if the input is 1, output 0 and follow this arrow". Because the output is on the arrow, it depends on **both the current state and the input**. Mealy machines usually have **no accepting states**: their job is to produce an output string, not to say yes or no.

:::figure A Mealy machine that outputs 1 whenever the input bit **differs** from the previous bit (the first bit is compared with 0).
<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="Mealy machine with states L0 and L1; transitions 0/0, 1/1, 0/1, 1/0">
  <defs><marker id="arr42c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="15">
    <line x1="80" y1="120" x2="140" y2="120" stroke="currentColor" marker-end="url(#arr42c)"/>
    <circle cx="170" cy="120" r="28" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="170" y="125" text-anchor="middle">L0</text>
    <circle cx="390" cy="120" r="28" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="390" y="125" text-anchor="middle">L1</text>
    <path d="M 195,106 Q 280,60 365,106" fill="none" stroke="currentColor" marker-end="url(#arr42c)"/><text x="280" y="74" text-anchor="middle">1/1</text>
    <path d="M 365,134 Q 280,180 195,134" fill="none" stroke="currentColor" marker-end="url(#arr42c)"/><text x="280" y="176" text-anchor="middle">0/1</text>
    <path d="M 158,95 C 140,40 200,40 182,95" fill="none" stroke="currentColor" marker-end="url(#arr42c)"/><text x="170" y="42" text-anchor="middle">0/0</text>
    <path d="M 378,95 C 360,40 420,40 402,95" fill="none" stroke="currentColor" marker-end="url(#arr42c)"/><text x="390" y="42" text-anchor="middle">1/0</text>
    <text x="280" y="203" text-anchor="middle" font-size="12">L0 = "last bit was 0"   L1 = "last bit was 1"</text>
  </g>
</svg>
:::

| Current state | Input | Output | Next state |
|---|---|---|---|
| L0 | 0 | 0 | L0 |
| L0 | 1 | 1 | L1 |
| L1 | 0 | 1 | L0 |
| L1 | 1 | 0 | L1 |

:::example Input 0110
| Step | State | Input | Output | Next state |
|---|---|---|---|---|
| 1 | L0 | 0 | 0 | L0 |
| 2 | L0 | 1 | 1 | L1 |
| 3 | L1 | 1 | 0 | L1 |
| 4 | L1 | 0 | 1 | L0 |

Output string: **0101**. One output symbol per input symbol, written in order.
:::

{{trace:4.2-2}}

:::note Another classic Mealy machine: two's complement
Read a binary number **from the least significant bit**. Copy bits up to and including the first 1 (state S0), then **flip** every later bit (state S1). Transitions: S0: `0/0 → S0`, `1/1 → S1`; S1: `0/1 → S1`, `1/0 → S1`. For 010100 (20) the bits are fed in as 0,0,1,0,1,0 and the outputs 0,0,1,1,0,1 read back to front give **101100** (−20). See [5.4](#/topic/5.4).
:::

```python Mealy machine simulator
def run_mealy(table, start, string):
    state, output = start, ""
    for symbol in string:
        state, out = table[(state, symbol)]
        output += out
    return output

change = {("L0", "0"): ("L0", "0"), ("L0", "1"): ("L1", "1"),
          ("L1", "0"): ("L0", "1"), ("L1", "1"): ("L1", "0")}
print(run_mealy(change, "L0", "0110"))     # 0101
print(run_mealy(change, "L0", "011010"))   # 010111
```

{{tool:fsm-simulator preset=inverter}}

:::trap Mealy machines
- The output goes on the **transition** (`input/output`), not inside the state. (A machine with outputs in the states is a **Moore** machine, which is **not** on the AQA spec.)
- Produce **exactly one output per input symbol**.
- Mealy machines normally have **no accepting states**. Don't add double circles unless the question asks for them.
- Some diagrams write `input|output` instead of `input/output`. The meaning is the same.
:::

### Deterministic machines

All the machines on this page are **deterministic**: for each (state, input) pair there is **exactly one** next state. A non-deterministic machine could have several arrows with the same label leaving a state. The AQA spec only needs deterministic FSMs.

### What FSMs cannot do

An FSM can only "remember" by being in a state, and it has a **finite** number of them. So it **cannot count without limit**. No FSM accepts exactly the strings 0ⁿ1ⁿ (n 0s then the same number of 1s) for all n: it would need a separate state for every possible count. Checking matched brackets fails for the same reason. That is why we need **BNF** ([4.5](#/topic/4.5)) and **Turing machines** ([4.8](#/topic/4.8)).

:::exam
- **Complete a transition table** (2–4 marks): one entry per arrow; check you have (number of states × number of input symbols) rows.
- **"Which of these strings are accepted?"**: trace each one; write the sequence of states (S0 → S1 → S2) as your working.
- **"Describe the language this FSM accepts"**: give a precise rule ("all strings over {a, b} that end in ab"), not an example.
- **Mealy output**: write the output for every input symbol, in order. Show the state sequence as working.
- **Draw an FSM**: start arrow, double circle(s) for accepting states, every arrow labelled, every state has an arrow for every symbol (or a trap state).
:::

:::challenge
1. Design an FSM over {0, 1} that accepts strings containing **at least two 1s**. How many states does it need?
2. Design an FSM that accepts binary numbers that are **multiples of 3** (hint: three states for remainder 0, 1, 2; reading bit b changes remainder r to (2r + b) MOD 3).
3. Draw a Mealy machine that outputs 1 each time it reads the second of two consecutive 1s, and 0 otherwise. What does it output for 01110?
4. Explain, in terms of states, why no FSM can accept every string of the form (ⁿ)ⁿ.
:::

:::recap
- FSM = finite states + input alphabet + transitions; next state depends only on (current state, input).
- Diagram: circles, labelled arrows, start arrow, double circle = accepting.
- Table: one row per (state, input) → next state (+ output for Mealy).
- **Accept** only if the machine is in an accepting state after **all** the input is read.
- Design by giving each state a meaning; add a trap state for impossible prefixes.
- **Mealy**: `input/output` on transitions; one output per input; output depends on state and input.
- FSMs have no memory beyond the current state, so they can't count without limit.
:::

:::related
- [4.4 Regular expressions and regular languages](#/topic/4.4) — the same languages, written as expressions
- [4.8 Turing machines](#/topic/4.8) — an FSM plus an infinite tape
- [2.4 Graphs](#/topic/2.4) — a transition diagram is a directed graph
- [5.4 Binary integers and two's complement](#/topic/5.4)
:::

*/});
