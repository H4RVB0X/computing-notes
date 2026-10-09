CS.registerTopic({ id: "6.4", title: "Logic gates and circuits" }, function () {/*

:::objectives
- Draw the symbol and write the truth table for **NOT, AND, OR, XOR, NAND and NOR**.
- Complete a truth table for a logic circuit, using columns for the intermediate signals.
- Write a **Boolean expression** for a circuit, and draw a circuit for a Boolean expression.
- Trace and explain the **half adder** and **full adder**, and construct a half adder.
- Explain how an **edge-triggered D-type flip-flop** stores one bit and why it is used as a memory unit.
:::

:::quick At a glance
- Logic gates take binary inputs (1 = high voltage/true, 0 = low/false) and produce one output.
- AQA notation: **A.B** (AND), **A + B** (OR), **<span style='text-decoration:overline'>A</span>** or **¬A** (NOT), **A ⊕ B** (XOR), **<span style='text-decoration:overline'>A.B</span>** (NAND), **<span style='text-decoration:overline'>A + B</span>** (NOR).
- AND = 1 only if **all** inputs are 1. OR = 1 if **at least one** is 1. XOR = 1 if the inputs **differ**. NAND/NOR = AND/OR followed by NOT.
- A truth table with **n** inputs has **2<sup>n</sup>** rows; list inputs in binary counting order.
- Precedence: **brackets, NOT, AND, OR**. Build circuits from the innermost bracket outwards.
- **Half adder**: S = A ⊕ B, C = A.B (adds two bits). **Full adder**: two half adders + an OR gate (adds two bits plus a carry-in).
- **D-type flip-flop**: on the **rising edge** of the clock, Q takes the value of D; at all other times Q **holds** its value. One flip-flop = one bit of memory; groups of them make **registers**.
:::

:::keyterms
Logic gate :: An electronic component that performs a Boolean operation on one or more binary inputs to produce a single binary output. :: A tiny decision-maker on 1s and 0s.
Truth table :: A table listing every possible combination of inputs to a gate or circuit with the corresponding output(s). :: Every input pattern and what comes out.
Boolean expression :: An expression using Boolean variables and the operators AND, OR, NOT (and XOR) that describes the logic of a circuit. :: The circuit written as algebra.
Logic circuit :: A combination of connected logic gates that produces outputs from inputs. :: Gates wired together.
Combinational circuit :: A logic circuit whose outputs depend only on its current inputs. :: No memory.
Sequential circuit :: A logic circuit whose outputs depend on its current inputs and on its previous state (it has memory). :: Remembers what happened before.
Half adder :: A circuit that adds two bits, producing a sum bit (A ⊕ B) and a carry bit (A.B). :: Adds 2 bits, no carry in.
Full adder :: A circuit that adds two bits and a carry-in bit, producing a sum and a carry-out; it can be built from two half adders and an OR gate. :: Adds 3 bits, so adders can be chained.
Flip-flop :: A sequential circuit that can be in one of two stable states, so it stores a single bit. :: One bit of memory.
Edge-triggered D-type flip-flop :: A flip-flop with a data input D and a clock input whose output Q takes the value of D only at the rising (or falling) edge of the clock signal, and holds that value otherwise. :: Copies D into memory at each clock tick, then remembers it.
Clock signal :: A regular sequence of pulses alternating between 0 and 1, used to synchronise changes in a circuit. :: The heartbeat that says "now".
Rising edge :: The instant at which a clock signal changes from 0 to 1. :: The moment the clock goes up.
Universal gate :: A gate (NAND or NOR) from which every other logic gate can be built. :: One gate type can make all the others.
:::

## The six gates

Inside a processor, bits are voltages: high = **1** (true), low = **0** (false). A **logic gate** combines input bits to produce an output bit. Millions of them, wired together, make the ALU, registers, memory and control unit.

<svg class="diagram" viewBox="0 0 690 295" role="img" aria-label="The six logic gate symbols in ANSI distinctive-shape form: NOT, AND, OR, XOR, NAND and NOR">
<g font-family="inherit">
<rect x="10" y="10" width="215" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<text x="117" y="32" font-size="15" text-anchor="middle" font-weight="700">NOT</text>
<g transform="translate(90,48)"><path d="M0,4 L34,20 L0,36 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="38" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g>
<path d="M40,68 L90,68" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="30" y="73" font-size="13" text-anchor="middle" >A</text>
<path d="M132,68 L185,68" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="195" y="73" font-size="13" text-anchor="middle" >Q</text>
<text x="117" y="112" font-size="13" text-anchor="middle" font-family="monospace">Q = ¬A  (Ā)</text>
<text x="117" y="130" font-size="11" text-anchor="middle" >Q is 1 when A is 0</text>
<rect x="235" y="10" width="215" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<text x="342" y="32" font-size="15" text-anchor="middle" font-weight="700">AND</text>
<g transform="translate(315,48)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M265,58 L315,58" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M265,78 L315,78" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="255" y="63" font-size="13" text-anchor="middle" >A</text>
<text x="255" y="83" font-size="13" text-anchor="middle" >B</text>
<path d="M363,68 L410,68" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="420" y="73" font-size="13" text-anchor="middle" >Q</text>
<text x="342" y="112" font-size="13" text-anchor="middle" font-family="monospace">Q = A.B</text>
<text x="342" y="130" font-size="11" text-anchor="middle" >1 only if both inputs are 1</text>
<rect x="460" y="10" width="215" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<text x="567" y="32" font-size="15" text-anchor="middle" font-weight="700">OR</text>
<g transform="translate(540,48)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M490,58 L547,58" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M490,78 L547,78" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="480" y="63" font-size="13" text-anchor="middle" >A</text>
<text x="480" y="83" font-size="13" text-anchor="middle" >B</text>
<path d="M592,68 L635,68" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="645" y="73" font-size="13" text-anchor="middle" >Q</text>
<text x="567" y="112" font-size="13" text-anchor="middle" font-family="monospace">Q = A + B</text>
<text x="567" y="130" font-size="11" text-anchor="middle" >1 if at least one input is 1</text>
<rect x="10" y="150" width="215" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<text x="117" y="172" font-size="15" text-anchor="middle" font-weight="700">XOR</text>
<g transform="translate(90,188)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><path d="M-8,0 Q10,20 -8,40" fill="none" stroke="currentColor" stroke-width="2"/></g>
<path d="M40,198 L97,198" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M40,218 L97,218" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="30" y="203" font-size="13" text-anchor="middle" >A</text>
<text x="30" y="223" font-size="13" text-anchor="middle" >B</text>
<path d="M142,208 L185,208" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="195" y="213" font-size="13" text-anchor="middle" >Q</text>
<text x="117" y="252" font-size="13" text-anchor="middle" font-family="monospace">Q = A ⊕ B</text>
<text x="117" y="270" font-size="11" text-anchor="middle" >1 if the inputs differ</text>
<rect x="235" y="150" width="215" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<text x="342" y="172" font-size="15" text-anchor="middle" font-weight="700">NAND</text>
<g transform="translate(315,188)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="52" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g>
<path d="M265,198 L315,198" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M265,218 L315,218" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="255" y="203" font-size="13" text-anchor="middle" >A</text>
<text x="255" y="223" font-size="13" text-anchor="middle" >B</text>
<path d="M371,208 L410,208" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="420" y="213" font-size="13" text-anchor="middle" >Q</text>
<text x="342" y="252" font-size="13" text-anchor="middle" font-family="monospace">Q = ¬(A.B)</text>
<text x="342" y="270" font-size="11" text-anchor="middle" >AND then NOT</text>
<rect x="460" y="150" width="215" height="130" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.35"/>
<text x="567" y="172" font-size="15" text-anchor="middle" font-weight="700">NOR</text>
<g transform="translate(540,188)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="56" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g>
<path d="M490,198 L547,198" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M490,218 L547,218" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="480" y="203" font-size="13" text-anchor="middle" >A</text>
<text x="480" y="223" font-size="13" text-anchor="middle" >B</text>
<path d="M600,208 L635,208" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="645" y="213" font-size="13" text-anchor="middle" >Q</text>
<text x="567" y="252" font-size="13" text-anchor="middle" font-family="monospace">Q = ¬(A + B)</text>
<text x="567" y="270" font-size="11" text-anchor="middle" >OR then NOT</text>
</g>
</svg>
AQA uses the **ANSI distinctive-shape** symbols shown above. Learn to draw them by hand:
- **AND**: flat back, round "D" front.
- **OR**: curved back, pointed front.
- **XOR**: OR symbol with an **extra curved line** behind the back.
- **NOT**: triangle with a **bubble** (small circle) on the output.
- **NAND / NOR**: AND / OR with a **bubble** on the output. The bubble always means "invert here".

### Truth tables for all six

| A | B | A.B (AND) | A + B (OR) | A ⊕ B (XOR) | <span style='text-decoration:overline'>A.B</span> (NAND) | <span style='text-decoration:overline'>A + B</span> (NOR) |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

| A | <span style='text-decoration:overline'>A</span> (NOT) |
|---|---|
| 0 | 1 |
| 1 | 0 |

:::tip Patterns that save time
- **AND** has a single 1 (bottom row). **NAND** is the opposite: a single 0.
- **OR** has a single 0 (top row). **NOR** is the opposite: a single 1.
- **XOR** = "different?" Output 1 when the inputs are not equal. It is also a **controlled inverter**: A ⊕ 1 = <span style='text-decoration:overline'>A</span>, A ⊕ 0 = A.
:::

### Notation

| Operation | AQA notation | Also seen | In words |
|---|---|---|---|
| NOT | <span style='text-decoration:overline'>A</span> | ¬A, A′, NOT A | invert A |
| AND | A.B | A ∧ B, AB | A and B |
| OR | A + B | A ∨ B | A or B (or both) |
| XOR | A ⊕ B | A ⊻ B | A or B but not both |
| NAND | <span style='text-decoration:overline'>A.B</span> | ¬(A.B) | not (A and B) |
| NOR | <span style='text-decoration:overline'>A + B</span> | ¬(A + B) | not (A or B) |

On this site you will see the overbar (as in exam papers) and the ¬ symbol (easier to type). They mean the same. **The length of the bar matters**: a bar over a whole expression acts like brackets.

:::trap
- **<span style='text-decoration:overline'>A.B</span> is not <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>.** NAND is "not (A and B)": a bar over the whole term. <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> (separate bars) is actually NOR (De Morgan, [6.5](#/topic/6.5)). One textbook answer describes NAND as "NOT A AND B"; that wording means <span style='text-decoration:overline'>A</span>.B, which is wrong.
- **XOR is not OR.** For inputs 1, 1: OR gives 1, XOR gives 0.
- Drawing NAND as an AND gate followed by a separate NOT gate is logically correct, but if asked for "a NAND gate" draw the single symbol with the bubble.
- Missing the extra back curve turns your XOR into an OR and loses the mark.
:::

## Building truth tables

### How many rows?

Each input can be 0 or 1, so **n inputs give 2<sup>n</sup> rows**: 2 inputs → 4 rows, 3 inputs → 8 rows, 4 inputs → 16 rows.

Fill the input columns by **counting in binary** from 0 to 2<sup>n</sup> − 1. For three inputs, the rightmost column alternates 0,1,0,1…, the middle column alternates in pairs 0,0,1,1…, the left column in fours 0,0,0,0,1,1,1,1. This guarantees no row is missed or repeated.

### Use intermediate columns

Never try to work out the final output in your head. Label the output of every gate on the diagram, give each a column, and fill the table **one column at a time** from left to right.

:::example Circuit → truth table → Boolean expression
<svg class="diagram" viewBox="0 0 440 175" role="img" aria-label="Circuit: A AND B feeds an OR gate, B also goes through a NOT gate into the same OR gate; output Q">
<g font-family="inherit">
<text x="20" y="65" font-size="14" text-anchor="start" >A</text>
<text x="20" y="135" font-size="14" text-anchor="start" >B</text>
<g transform="translate(150,50)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="174" y="45" font-size="11" text-anchor="middle">A.B</text>
<g transform="translate(150,110)"><path d="M0,4 L34,20 L0,36 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="38" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g><text x="162" y="106" font-size="11" text-anchor="middle">¬B</text>
<g transform="translate(300,80)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M35,60 L150,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M35,130 L150,130" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="100" cy="130" r="3.2" fill="currentColor"/>
<path d="M100,130 L100,80 L150,80" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M198,70 L260,70 L260,90 L307,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M192,130 L260,130 L260,110 L307,110" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M352,100 L400,100" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="408" y="105" font-size="14" text-anchor="start" >Q</text>
<text x="215" y="160" font-size="13" text-anchor="middle" font-family="monospace">Q = A.B + ¬B</text>
</g>
</svg>
**Step 1: label each gate's output.** The AND gate outputs **A.B**. The NOT gate outputs **<span style='text-decoration:overline'>B</span>**. The OR gate combines them: **Q = A.B + <span style='text-decoration:overline'>B</span>**.

**Step 2: draw the table** with a column for every input and every gate output.

| A | B | A.B | <span style='text-decoration:overline'>B</span> | Q = A.B + <span style='text-decoration:overline'>B</span> |
|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 1 |

**Step 3: check.** Q is 0 only when A = 0 and B = 1. That pattern is the same as **A + <span style='text-decoration:overline'>B</span>**, a simpler circuit with two gates instead of three. Spotting and proving simplifications like this is [6.5 Boolean algebra](#/topic/6.5).
:::

## Expression → circuit

Operator precedence, highest first:

1. **Brackets** (and anything under a long bar)
2. **NOT**
3. **AND** (and NAND)
4. **OR**, XOR (and NOR)

So **A.B + C** means **(A.B) + C**: the AND is done first, then the OR. Draw the gate for the **last** operation evaluated **next to the output**, then work backwards towards the inputs.

:::example Draw the circuit for Q = (A + <span style='text-decoration:overline'>B</span>).(B ⊕ C)
1. The last operation is the **AND** joining the two brackets. Draw an AND gate next to Q.
2. Its first input is **A + <span style='text-decoration:overline'>B</span>**: an OR gate, fed by A and a **NOT** gate on B.
3. Its second input is **B ⊕ C**: an XOR gate fed by B and C.
4. B is needed twice, so branch the B line with a **dot** (a junction). Lines that cross without a dot are not connected.

<svg class="diagram" viewBox="0 0 490 195" role="img" aria-label="Circuit for Q = (A + NOT B).(B XOR C): A and NOT B into an OR gate, B and C into an XOR gate, both into a final AND gate">
<g font-family="inherit">
<text x="15" y="45" font-size="14" text-anchor="start" >A</text>
<text x="15" y="105" font-size="14" text-anchor="start" >B</text>
<text x="15" y="165" font-size="14" text-anchor="start" >C</text>
<g transform="translate(110,70)"><path d="M0,4 L34,20 L0,36 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="38" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g><text x="122" y="66" font-size="11" text-anchor="middle">¬B</text>
<g transform="translate(210,30)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="234" y="25" font-size="11" text-anchor="middle">A + ¬B</text>
<g transform="translate(210,130)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><path d="M-8,0 Q10,20 -8,40" fill="none" stroke="currentColor" stroke-width="2"/></g><text x="234" y="125" font-size="11" text-anchor="middle">B ⊕ C</text>
<g transform="translate(360,80)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M30,40 L217,40" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M30,100 L80,100" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="80" cy="100" r="3.2" fill="currentColor"/>
<path d="M80,100 L80,90 L110,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M80,100 L80,140 L217,140" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M152,90 L180,90 L180,60 L217,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M30,160 L217,160" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M262,50 L320,50 L320,90 L360,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M262,150 L320,150 L320,110 L360,110" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M408,100 L450,100" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="458" y="105" font-size="14" text-anchor="start" >Q</text>
</g>
</svg>
Truth table (check your circuit by tracing each row):

| A | B | C | <span style='text-decoration:overline'>B</span> | A + <span style='text-decoration:overline'>B</span> | B ⊕ C | Q |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 1 | 1 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 | 1 | 1 |
| 0 | 1 | 0 | 0 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 1 | 1 |
| 1 | 1 | 1 | 0 | 1 | 0 | 0 |
:::

### Your turn: trace a circuit

<svg class="diagram" viewBox="0 0 470 170" role="img" aria-label="Circuit: A OR B, and NOT (B AND C), both feed a final AND gate giving Q">
<g font-family="inherit">
<text x="15" y="45" font-size="14" text-anchor="start" >A</text>
<text x="15" y="95" font-size="14" text-anchor="start" >B</text>
<text x="15" y="155" font-size="14" text-anchor="start" >C</text>
<g transform="translate(150,30)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="174" y="25" font-size="11" text-anchor="middle">A + B</text>
<g transform="translate(150,120)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="174" y="115" font-size="11" text-anchor="middle">B.C</text>
<g transform="translate(230,120)"><path d="M0,4 L34,20 L0,36 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><circle cx="38" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/></g>
<g transform="translate(340,75)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g>
<path d="M30,40 L157,40" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M30,90 L100,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="100" cy="90" r="3.2" fill="currentColor"/>
<path d="M100,90 L100,60 L157,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M100,90 L100,130 L150,130" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M30,150 L150,150" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M198,140 L230,140" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="290" y="132" font-size="11" text-anchor="middle" >¬(B.C)</text>
<path d="M202,50 L310,50 L310,85 L340,85" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M272,140 L320,140 L320,105 L340,105" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M388,95 L430,95" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="438" y="100" font-size="14" text-anchor="start" >Q</text>
</g>
</svg>
{{trace:6.4-1}}

### Try it: logic gate simulator

Type an expression, toggle the inputs and watch each gate's output. Try the half adder, full adder and D-type presets too.

{{tool:logic-gate-sim}}

## From a problem or truth table to an expression

### From a problem statement

:::example Greenhouse alarm
An alarm **Q** sounds if the greenhouse is too hot (**T** = 1) **and** the window is closed (**W** = 1 means open), **or** if the door is open (**D** = 1).

- "too hot and window closed" → **T.<span style='text-decoration:overline'>W</span>**
- "or door open" → **+ D**
- **Q = T.<span style='text-decoration:overline'>W</span> + D**. Because AND has higher precedence than OR, no brackets are needed, but writing (T.<span style='text-decoration:overline'>W</span>) + D does no harm.
:::

### From a truth table (sum of products)

Look **only at the rows where the output is 1**. Write each as an AND of the inputs (inverting any input that is 0), then OR them together.

:::example Truth table → expression
| A | B | C | Q |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 0 |

Rows with Q = 1: 001, 011, 101.

- Q = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>.C + <span style='text-decoration:overline'>A</span>.B.C + A.<span style='text-decoration:overline'>B</span>.C
- Spot the pattern: **C must be 1**, and A and B must **not both** be 1.
- So **Q = C.<span style='text-decoration:overline'>A.B</span>**: an AND gate fed by C and a NAND gate on A and B. (Proving this with algebra: see [6.5](#/topic/6.5).)
:::

## NAND and NOR: universal gates

Every gate can be built from **only NAND gates** (or **only NOR gates**). Manufacturers like this: a chip made of one gate type is cheaper and simpler to produce, and NAND gates are very cheap to make in silicon (NAND flash memory is named after them).

| Gate | Using only NAND | Using only NOR |
|---|---|---|
| NOT A | <span style='text-decoration:overline'>A.A</span> (both inputs = A) | <span style='text-decoration:overline'>A + A</span> |
| A.B | (A NAND B) NAND (A NAND B), i.e. NAND then invert | ¬(¬A + ¬B): NOT each input, then NOR |
| A + B | ¬(¬A.¬B): NOT each input, then NAND | (A NOR B) NOR (A NOR B), i.e. NOR then invert |

:::why
Why does NOT each input then NAND give OR? Because of De Morgan's law: ¬(¬A.¬B) = ¬¬A + ¬¬B = A + B. See [6.5](#/topic/6.5).
:::

## Adders

Adders live in the **ALU**. Binary addition of single bits gives: 0 + 0 = 0, 0 + 1 = 1, 1 + 0 = 1, **1 + 1 = 10** (0 carry 1). So adding two bits needs **two outputs**: a **sum** and a **carry**.

### Half adder

<svg class="diagram" viewBox="0 0 470 180" role="img" aria-label="Half adder: inputs A and B both feed an XOR gate giving the sum S and an AND gate giving the carry C">
<g font-family="inherit">
<text x="15" y="55" font-size="14" text-anchor="start" >A</text>
<text x="15" y="95" font-size="14" text-anchor="start" >B</text>
<g transform="translate(170,40)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><path d="M-8,0 Q10,20 -8,40" fill="none" stroke="currentColor" stroke-width="2"/></g><text x="194" y="35" font-size="11" text-anchor="middle">XOR</text>
<g transform="translate(170,120)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="194" y="115" font-size="11" text-anchor="middle">AND</text>
<path d="M30,50 L177,50" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M30,90 L110,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="80" cy="50" r="3.2" fill="currentColor"/>
<path d="M80,50 L80,130 L170,130" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="110" cy="90" r="3.2" fill="currentColor"/>
<path d="M110,90 L110,70 L177,70" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M110,90 L110,150 L170,150" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M222,60 L300,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="308" y="65" font-size="14" text-anchor="start" >S (sum) = A ⊕ B</text>
<path d="M218,140 L300,140" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="308" y="145" font-size="14" text-anchor="start" >C (carry) = A.B</text>
</g>
</svg>
| A | B | C (carry) | S (sum) |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 |

- **S** is 1 when exactly one input is 1: that is **XOR**, so **S = A ⊕ B**.
- **C** is 1 only when both are 1: that is **AND**, so **C = A.B**.
- It is called a **half** adder because it cannot accept a **carry in** from a previous column, so it can only add the least significant bits.

:::trap
- In a half adder, the **sum is XOR**, not OR. With OR, 1 + 1 would give sum 1, which is wrong.
- Make sure both gates receive **both** inputs: branch A and B with junction dots.
:::

### Full adder

To add multi-bit numbers, each column must add **A, B and the carry from the column to its right**. A **full adder** has three inputs (A, B, C<sub>in</sub>) and two outputs (S, C<sub>out</sub>).

It is built from **two half adders and an OR gate**:
1. Half adder 1 adds A and B → partial sum **S1 = A ⊕ B** and carry **C1 = A.B**.
2. Half adder 2 adds S1 and C<sub>in</sub> → final sum **S = S1 ⊕ C<sub>in</sub>** and carry **C2 = S1.C<sub>in</sub>**.
3. An OR gate combines the carries: **C<sub>out</sub> = C1 + C2**. (Both carries can never be 1 at the same time, so OR is enough.)

<svg class="diagram" viewBox="0 0 620 275" role="img" aria-label="Full adder built from two half adders: XOR 1 and AND 1 add A and B; XOR 2 and AND 2 add the carry-in; an OR gate combines the two carries into Cout">
<g font-family="inherit">
<text x="12" y="65" font-size="14" text-anchor="start" >A</text>
<text x="12" y="85" font-size="14" text-anchor="start" >B</text>
<text x="5" y="225" font-size="14" text-anchor="start" >Cin</text>
<g transform="translate(140,50)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><path d="M-8,0 Q10,20 -8,40" fill="none" stroke="currentColor" stroke-width="2"/></g><text x="164" y="45" font-size="11" text-anchor="middle">XOR 1</text>
<g transform="translate(140,130)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="164" y="125" font-size="11" text-anchor="middle">AND 1</text>
<g transform="translate(290,60)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/><path d="M-8,0 Q10,20 -8,40" fill="none" stroke="currentColor" stroke-width="2"/></g><text x="314" y="55" font-size="11" text-anchor="middle">XOR 2</text>
<g transform="translate(320,190)"><path d="M0,0 H28 A20,20 0 0 1 28,40 H0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="344" y="185" font-size="11" text-anchor="middle">AND 2</text>
<g transform="translate(460,150)"><path d="M0,0 Q18,20 0,40 Q34,40 52,20 Q34,0 0,0 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/></g><text x="484" y="145" font-size="11" text-anchor="middle">OR</text>
<path d="M30,60 L147,60" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="90" cy="60" r="3.2" fill="currentColor"/>
<path d="M90,60 L90,140 L140,140" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M30,80 L147,80" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="110" cy="80" r="3.2" fill="currentColor"/>
<path d="M110,80 L110,160 L140,160" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M192,70 L297,70" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="230" cy="70" r="3.2" fill="currentColor"/>
<path d="M230,70 L230,200 L320,200" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="205" y="64" font-size="12" text-anchor="middle" >S1</text>
<path d="M32,220 L320,220" fill="none" stroke="currentColor" stroke-width="1.6"/>
<circle cx="255" cy="220" r="3.2" fill="currentColor"/>
<path d="M255,220 L255,90 L297,90" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M342,80 L560,80" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="568" y="85" font-size="14" text-anchor="start" >S</text>
<path d="M188,150 L200,150 L200,260 L440,260 L440,180 L467,180" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="212" y="165" font-size="12" text-anchor="start" >C1</text>
<path d="M368,210 L420,210 L420,160 L467,160" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="380" y="228" font-size="12" text-anchor="start" >C2</text>
<path d="M512,170 L560,170" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="568" y="175" font-size="14" text-anchor="start" >Cout</text>
</g>
</svg>
| A | B | C<sub>in</sub> | S1 = A ⊕ B | C1 = A.B | S = S1 ⊕ C<sub>in</sub> | C2 = S1.C<sub>in</sub> | C<sub>out</sub> = C1 + C2 |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 0 | 1 | 0 | 0 |
| 0 | 1 | 0 | 1 | 0 | 1 | 0 | 0 |
| 0 | 1 | 1 | 1 | 0 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| 1 | 0 | 1 | 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 | 1 | 1 | 0 | 1 |

Quick check: S is 1 when an **odd** number of inputs are 1; C<sub>out</sub> is 1 when **two or more** are 1. Equivalent expressions: S = A ⊕ B ⊕ C<sub>in</sub>, C<sub>out</sub> = A.B + C<sub>in</sub>.(A ⊕ B).

:::example Trace one row: A = 1, B = 0, C<sub>in</sub> = 1
1. XOR 1: S1 = 1 ⊕ 0 = **1**. AND 1: C1 = 1.0 = **0**.
2. XOR 2: S = S1 ⊕ C<sub>in</sub> = 1 ⊕ 1 = **0**. AND 2: C2 = S1.C<sub>in</sub> = 1.1 = **1**.
3. OR: C<sub>out</sub> = C1 + C2 = 0 + 1 = **1**.
4. Check: 1 + 0 + 1 = 2 = 10<sub>2</sub>, so sum 0, carry 1. ✓
:::

{{trace:6.4-2}}

### Chaining full adders

Connect the C<sub>out</sub> of each column to the C<sub>in</sub> of the next. Four full adders make a **4-bit adder** (the rightmost can be a half adder because there is no carry into it). The final carry out signals **overflow** for unsigned numbers.

:::example 0101 + 0011 with a chain of adders (5 + 3)
| Column | A | B | C<sub>in</sub> | S | C<sub>out</sub> |
|---|---|---|---|---|---|
| bit 0 (rightmost) | 1 | 1 | 0 | 0 | 1 |
| bit 1 | 0 | 1 | 1 | 0 | 1 |
| bit 2 | 1 | 0 | 1 | 0 | 1 |
| bit 3 | 0 | 0 | 1 | 1 | 0 |

Result: **1000** = 8 ✓ and final carry 0, so no overflow. The carry "ripples" through each adder in turn, which is why this is called a **ripple-carry adder**.
:::

## The edge-triggered D-type flip-flop

### Why we need memory circuits

Every circuit so far is **combinational**: change the inputs and the outputs change; nothing is remembered. A computer also needs to **store** bits (registers, cache, the program counter). That needs **sequential** circuits, whose output depends on their **previous state**. The basic storage element is the **flip-flop**: it has two stable states, so it stores **one bit**.

### What a D-type flip-flop does

<svg class="diagram" viewBox="0 0 500 150" role="img" aria-label="D-type flip-flop block: data input D, clock input marked with a triangle for edge triggering, outputs Q and not Q">
<g font-family="inherit">
<rect x="150" y="20" width="130" height="120" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
<text x="215" y="15" font-size="12" text-anchor="middle" >D-type flip-flop</text>
<path d="M70,50 L150,50" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="60" y="55" font-size="14" text-anchor="end" >D</text>
<text x="160" y="55" font-size="13" text-anchor="start" >D</text>
<path d="M70,110 L150,110" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="60" y="115" font-size="14" text-anchor="end" >Clock</text>
<path d="M150,100 L164,110 L150,120" fill="none" stroke="currentColor" stroke-width="2"/>
<text x="170" y="115" font-size="11" text-anchor="start" >CLK</text>
<path d="M280,50 L360,50" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="270" y="55" font-size="13" text-anchor="end" >Q</text>
<text x="368" y="55" font-size="14" text-anchor="start" >Q (stored bit)</text>
<path d="M280,110 L360,110" fill="none" stroke="currentColor" stroke-width="1.6"/>
<text x="270" y="115" font-size="13" text-anchor="end" >¬Q</text>
<text x="368" y="115" font-size="14" text-anchor="start" >¬Q (inverse)</text>
</g>
</svg>
- Two inputs: **D** (data) and **Clock**. Outputs: **Q** (the stored bit) and **<span style='text-decoration:overline'>Q</span>** (its inverse).
- **Edge-triggered**: Q only changes at the **rising edge** of the clock (the instant it goes from 0 to 1). At that instant, **Q takes whatever value D has**.
- At **every other time**, Q **holds** its value, no matter how D changes. The small triangle on the clock input in the symbol shows edge triggering.

| Clock | D | Q after |
|---|---|---|
| rising edge (0 → 1) | 0 | 0 |
| rising edge (0 → 1) | 1 | 1 |
| no rising edge (steady 0, steady 1 or falling) | 0 or 1 | unchanged: holds previous Q |

### Timing diagram

<svg class="diagram" viewBox="0 0 580 222" role="img" aria-label="Timing diagram: Q only changes at rising clock edges, taking the value of D at that instant; changes to D between edges are ignored">
<g font-family="inherit">
<path d="M70,40 L105.0,40 L105.0,10 L140,10 L140,40 L140,40 L175.0,40 L175.0,10 L210,10 L210,40 L210,40 L245.0,40 L245.0,10 L280,10 L280,40 L280,40 L315.0,40 L315.0,10 L350,10 L350,40 L350,40 L385.0,40 L385.0,10 L420,10 L420,40 L420,40 L455.0,40 L455.0,10 L490,10 L490,40 L490,40 L525.0,40 L525.0,10 L560,10 L560,40" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M70,110 L165,110 L165,80 L165,80 L250,80 L250,110 L250,110 L285,110 L285,80 L285,80 L400,80 L400,110 L400,110 L430,110 L430,80 L430,80 L465,80 L465,110 L465,110 L560,110" fill="none" stroke="currentColor" stroke-width="1.6"/>
<path d="M70,180 L175.0,180 L175.0,150 L175.0,150 L525.0,150 L525.0,180 L525.0,180 L560,180" fill="none" stroke="currentColor" stroke-width="1.6"/>
<line x1="105.0" y1="0" x2="105.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M100.0,30.0 L105.0,22.0 L110.0,30.0" fill="currentColor"/>
<line x1="175.0" y1="0" x2="175.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M170.0,30.0 L175.0,22.0 L180.0,30.0" fill="currentColor"/>
<line x1="245.0" y1="0" x2="245.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M240.0,30.0 L245.0,22.0 L250.0,30.0" fill="currentColor"/>
<line x1="315.0" y1="0" x2="315.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M310.0,30.0 L315.0,22.0 L320.0,30.0" fill="currentColor"/>
<line x1="385.0" y1="0" x2="385.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M380.0,30.0 L385.0,22.0 L390.0,30.0" fill="currentColor"/>
<line x1="455.0" y1="0" x2="455.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M450.0,30.0 L455.0,22.0 L460.0,30.0" fill="currentColor"/>
<line x1="525.0" y1="0" x2="525.0" y2="195" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>
<path d="M520.0,30.0 L525.0,22.0 L530.0,30.0" fill="currentColor"/>
<text x="10" y="30" font-size="13" text-anchor="start" >Clock</text>
<text x="10" y="100" font-size="13" text-anchor="start" >D</text>
<text x="10" y="170" font-size="13" text-anchor="start" >Q</text>
<text x="105.0" y="212" font-size="10" text-anchor="middle" >edge 1: Q←0</text>
<text x="175.0" y="212" font-size="10" text-anchor="middle" >edge 2: Q←1</text>
<text x="245.0" y="212" font-size="10" text-anchor="middle" >edge 3: Q←1</text>
<text x="315.0" y="212" font-size="10" text-anchor="middle" >edge 4: Q←1</text>
<text x="385.0" y="212" font-size="10" text-anchor="middle" >edge 5: Q←1</text>
<text x="455.0" y="212" font-size="10" text-anchor="middle" >edge 6: Q←1</text>
<text x="525.0" y="212" font-size="10" text-anchor="middle" >edge 7: Q←0</text>
</g>
</svg>
Read it edge by edge: at each dashed line Q copies D. D drops to 0 between edges 2 and 3, but no rising edge happens then, so Q ignores it. Q only falls at edge 7, when D is 0 at the moment of the edge.

### Why it is a memory unit

- It **stores one bit**: after the edge, the value of D is kept on Q until the next rising edge, even if D changes.
- Because changes happen only at the clock edge, every flip-flop in the processor updates **at the same moment**, keeping the system **synchronised**.
- **Registers**: n D-type flip-flops sharing one clock store an n-bit word (e.g. 64 flip-flops = a 64-bit register). All bits are loaded together on the edge.
- Chains of flip-flops form **shift registers** and **counters**; static RAM and cache are built from similar bistable circuits.
- The output effectively follows D **delayed until the next clock edge**, which is why it is sometimes described as delaying data by one clock pulse.

:::trap Edge-triggered does not mean "changes every pulse"
- The class notes say "on each clock pulse the flip-flop will change". Not quite: on each **rising edge** Q is **set to D**. If D already equals Q, nothing visibly changes.
- Q does **not** follow D while the clock is high. That would be a level-triggered latch. Edge-triggered means it samples D only at the **edge**.
- A flip-flop stores **one bit**, not one byte.
- In an exam, use the words **rising edge**, **takes the value of D**, **stores/holds**, **one bit** and **register**.
:::

:::collapse Optional: how is a flip-flop built? (not examined)
A simple **SR latch** uses two cross-coupled NOR gates: each gate's output feeds back into the other's input, so the circuit "remembers" its state. An edge-triggered D-type is commonly made from two latches in series (a **master–slave** arrangement): the first latch is open while the clock is low, the second while it is high, so data passes through only at the moment of the rising edge. AQA only requires you to know how the D-type **behaves** and what it is **used for**.
:::

:::exam
- **"Draw the symbol"**: neat ANSI shape; bubble for NOT/NAND/NOR; double back line for XOR; label inputs and output.
- **"Complete the truth table"** (typically 1 mark per correct column or per two rows): use intermediate columns even if the table given does not have them; write them in the margin.
- **"Write a Boolean expression for the circuit"**: work from the inputs to the output, writing each gate's output on its wire; use brackets generously; a long bar must cover exactly the right part.
- **"Draw a circuit for the expression"**: start from the last operation; use junction dots where an input branches; do not simplify unless asked ("draw a circuit **for** this expression" means that exact expression).
- **"Construct a half adder"**: XOR for sum, AND for carry, both fed by A and B, outputs labelled S and C.
- **"Explain how the D-type flip-flop can be used as memory"** (2–3): on the rising edge of the clock Q takes the value of D; otherwise Q stays the same, so it stores one bit; several used together form a register.
:::

:::challenge
1. Using only NAND gates, draw an XOR gate. (Hint: it needs four NAND gates.)
2. Design a circuit for a 2-bit **equality checker**: output 1 when A1A0 = B1B0. Use XOR and NOR/NOT gates.
3. Why is the ripple-carry adder slow for 64-bit numbers? Research **carry-lookahead** adders.
4. Draw a timing diagram for a D-type flip-flop where D changes **exactly** on a rising edge. Why do real circuits need a "set-up time"?
:::

:::recap
- Six gates: NOT, AND, OR, XOR, NAND, NOR. Know their symbols, truth tables and notation (A.B, A + B, <span style='text-decoration:overline'>A</span>, A ⊕ B).
- n inputs → 2<sup>n</sup> rows; count in binary; add a column for every gate output.
- Precedence: brackets, NOT, AND, OR. Draw circuits from the output backwards; label every wire.
- Truth table → expression: OR together the rows that give 1, then simplify.
- NAND and NOR are universal gates.
- Half adder: S = A ⊕ B, C = A.B. Full adder: two half adders + OR; S = A ⊕ B ⊕ C<sub>in</sub>.
- D-type flip-flop: Q takes D on the rising clock edge and holds it otherwise; stores 1 bit; used to build registers.
:::

:::related
- [6.5 Boolean algebra](#/topic/6.5)
- [R.2 Boolean algebra and logic reference](#/topic/R.2)
- [5.4 Binary integers and two's complement](#/topic/5.4) — binary addition the adders implement
- [7.2 The stored program concept and the processor](#/topic/7.2) — registers and the ALU
- [1.3 Arithmetic, relational and Boolean operators](#/topic/1.3)
:::

*/});
