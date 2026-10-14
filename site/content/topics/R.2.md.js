CS.registerTopic({ id: "R.2", title: "Boolean algebra and logic reference" }, function () {/*

:::objectives
- Recall the symbol, Boolean expression and truth table of **AND, OR, NOT, NAND, NOR and XOR**.
- Recall every Boolean identity and **De Morgan's laws**, and name the law used at each step of a simplification.
- Simplify Boolean expressions step by step and **check the result with a truth table**.
- Recall the logic and purpose of the **half adder**, **full adder** and **edge-triggered D-type flip-flop**.
:::

:::quick At a glance
- Notation: **A.B** = AND, **A + B** = OR, **<span style='text-decoration:overline'>A</span>** = NOT A, **A ⊕ B** = XOR. NAND = <span style='text-decoration:overline'>A.B</span>, NOR = <span style='text-decoration:overline'>A + B</span>.
- **AND** is 1 only if all inputs are 1. **OR** is 1 if any input is 1. **XOR** is 1 if the inputs differ.
- **Identities**: A.0 = 0, A.1 = A, A + 0 = A, A + 1 = 1, A.A = A, A + A = A, A.<span style='text-decoration:overline'>A</span> = 0, A + <span style='text-decoration:overline'>A</span> = 1, <span style='text-decoration:overline'><span style='text-decoration:overline'>A</span></span> = A.
- **Absorption**: A + A.B = A and A.(A + B) = A. Also A + <span style='text-decoration:overline'>A</span>.B = A + B.
- **De Morgan**: <span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span> and <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>. "Break the bar, change the sign."
- **Half adder**: S = A ⊕ B, C = A.B. **Full adder**: S = A ⊕ B ⊕ C<sub>in</sub>, C<sub>out</sub> = A.B + C<sub>in</sub>.(A ⊕ B).
- **D-type flip-flop**: on the rising clock edge, Q takes the value of D; otherwise Q holds. It stores **one bit**.
:::

:::keyterms
Truth table :: A table showing the output of a logic circuit or Boolean expression for every possible combination of inputs. :: Every input combination and what comes out.
Logic gate :: An electronic component that performs a Boolean operation on one or more binary inputs to produce a binary output. :: A tiny circuit that does AND, OR, NOT and so on.
NAND gate :: A gate whose output is the negation of AND: 0 only when all inputs are 1. :: AND then flip.
NOR gate :: A gate whose output is the negation of OR: 1 only when all inputs are 0. :: OR then flip.
XOR gate :: Exclusive OR: output is 1 when exactly one of its two inputs is 1 (the inputs differ). :: One or the other, not both.
De Morgan's laws :: <span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span> and <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>. :: Break the bar and swap AND with OR.
Absorption law :: A + A.B = A and A.(A + B) = A. :: The bigger term swallows the smaller one.
Half adder :: A circuit that adds two bits, producing a sum (A ⊕ B) and a carry (A.B). :: Adds two bits.
Full adder :: A circuit that adds two bits and a carry-in, producing a sum and a carry-out; full adders can be chained to add binary numbers. :: Adds two bits plus a carry.
Edge-triggered D-type flip-flop :: A memory unit whose output Q changes to the value of the data input D only on the rising (or falling) edge of the clock signal, and otherwise holds its value. :: A one-bit memory that updates on the clock tick.
Universal gate :: A gate type from which every other logic function can be built (NAND or NOR). :: One gate to build them all.
:::

## Gate symbols and notation

:::figure The six gates on the AQA specification (ANSI symbols)
<svg class="diagram" viewBox="0 0 680 300" role="img" aria-label="Logic gate symbols: AND, OR, NOT, NAND, NOR and XOR with their Boolean expressions">
  <g font-family="inherit" font-size="14" fill="currentColor">
    <line x1="40" y1="40" x2="70" y2="40" stroke="currentColor" stroke-width="2"/><line x1="40" y1="70" x2="70" y2="70" stroke="currentColor" stroke-width="2"/><text x="36" y="44" text-anchor="end">A</text><text x="36" y="74" text-anchor="end">B</text>
    <path d="M70 25 H100 A30 30 0 0 1 100 85 H70 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
    <line x1="130" y1="55" x2="165" y2="55" stroke="currentColor" stroke-width="2"/><text x="170" y="60">Q</text>
    <text x="102" y="112" text-anchor="middle" font-weight="bold">AND</text><text x="102" y="132" text-anchor="middle">Q = A.B</text>
    <line x1="270" y1="40" x2="302" y2="40" stroke="currentColor" stroke-width="2"/><line x1="270" y1="70" x2="302" y2="70" stroke="currentColor" stroke-width="2"/><text x="266" y="44" text-anchor="end">A</text><text x="266" y="74" text-anchor="end">B</text>
    <path d="M295 25 Q315 55 295 85 Q340 85 365 55 Q340 25 295 25 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
    <line x1="365" y1="55" x2="395" y2="55" stroke="currentColor" stroke-width="2"/><text x="400" y="60">Q</text>
    <text x="332" y="112" text-anchor="middle" font-weight="bold">OR</text><text x="332" y="132" text-anchor="middle">Q = A + B</text>
    <line x1="500" y1="55" x2="530" y2="55" stroke="currentColor" stroke-width="2"/><text x="496" y="59" text-anchor="end">A</text>
    <path d="M530 28 L580 55 L530 82 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
    <circle cx="585" cy="55" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="590" y1="55" x2="625" y2="55" stroke="currentColor" stroke-width="2"/><text x="630" y="60">Q</text>
    <text x="562" y="112" text-anchor="middle" font-weight="bold">NOT</text><text x="562" y="132" text-anchor="middle">Q = <tspan text-decoration="overline">A</tspan></text>
    <line x1="40" y1="185" x2="70" y2="185" stroke="currentColor" stroke-width="2"/><line x1="40" y1="215" x2="70" y2="215" stroke="currentColor" stroke-width="2"/><text x="36" y="189" text-anchor="end">A</text><text x="36" y="219" text-anchor="end">B</text>
    <path d="M70 170 H100 A30 30 0 0 1 100 230 H70 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
    <circle cx="135" cy="200" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="140" y1="200" x2="165" y2="200" stroke="currentColor" stroke-width="2"/><text x="170" y="205">Q</text>
    <text x="102" y="257" text-anchor="middle" font-weight="bold">NAND</text><text x="102" y="277" text-anchor="middle">Q = <tspan text-decoration="overline">A.B</tspan></text>
    <line x1="270" y1="185" x2="302" y2="185" stroke="currentColor" stroke-width="2"/><line x1="270" y1="215" x2="302" y2="215" stroke="currentColor" stroke-width="2"/><text x="266" y="189" text-anchor="end">A</text><text x="266" y="219" text-anchor="end">B</text>
    <path d="M295 170 Q315 200 295 230 Q340 230 365 200 Q340 170 295 170 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
    <circle cx="370" cy="200" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="375" y1="200" x2="395" y2="200" stroke="currentColor" stroke-width="2"/><text x="400" y="205">Q</text>
    <text x="332" y="257" text-anchor="middle" font-weight="bold">NOR</text><text x="332" y="277" text-anchor="middle">Q = <tspan text-decoration="overline">A + B</tspan></text>
    <line x1="500" y1="185" x2="522" y2="185" stroke="currentColor" stroke-width="2"/><line x1="500" y1="215" x2="522" y2="215" stroke="currentColor" stroke-width="2"/><text x="496" y="189" text-anchor="end">A</text><text x="496" y="219" text-anchor="end">B</text>
    <path d="M515 170 Q535 200 515 230" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M525 170 Q545 200 525 230 Q570 230 595 200 Q570 170 525 170 Z" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
    <line x1="595" y1="200" x2="625" y2="200" stroke="currentColor" stroke-width="2"/><text x="630" y="205">Q</text>
    <text x="562" y="257" text-anchor="middle" font-weight="bold">XOR</text><text x="562" y="277" text-anchor="middle">Q = A ⊕ B</text>
  </g>
</svg>
:::

| Gate | AQA Boolean notation | Other notation you may see | Python (on 0/1 ints) |
|---|---|---|---|
| AND | A.B | A ∧ B, AB | `a & b` |
| OR | A + B | A ∨ B | `a | b` |
| NOT | <span style='text-decoration:overline'>A</span> | ¬A, A′ | `1 - a` |
| NAND | <span style='text-decoration:overline'>A.B</span> | ¬(A ∧ B) | `1 - (a & b)` |
| NOR | <span style='text-decoration:overline'>A + B</span> | ¬(A ∨ B) | `1 - (a | b)` |
| XOR | A ⊕ B | A ⊻ B | `a ^ b` |

**Order of precedence**: brackets, then NOT, then AND, then OR. So A + B.C means A + (B.C).

## Truth tables for every gate

| A | B | A.B (AND) | A + B (OR) | <span style='text-decoration:overline'>A.B</span> (NAND) | <span style='text-decoration:overline'>A + B</span> (NOR) | A ⊕ B (XOR) |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 1 | 0 | 1 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

NOT: A = 0 → <span style='text-decoration:overline'>A</span> = 1; A = 1 → <span style='text-decoration:overline'>A</span> = 0.

:::tip Memory hooks
- AND: "all", OR: "any", XOR: "odd number of 1s" (for two inputs: "different").
- NAND and NOR are AND and OR with the output column **flipped**.
- With *n* inputs a truth table has **2<sup>n</sup> rows**: 2 inputs → 4 rows, 3 inputs → 8 rows. List them in binary counting order (000, 001, 010, …) so none is missed.
:::

{{tool:logic-gate-sim}}

## All the Boolean identities

| Law | AND form | OR form |
|---|---|---|
| **Identity** | A.1 = A | A + 0 = A |
| **Null (annulment)** | A.0 = 0 | A + 1 = 1 |
| **Idempotent** | A.A = A | A + A = A |
| **Complement (inverse)** | A.<span style='text-decoration:overline'>A</span> = 0 | A + <span style='text-decoration:overline'>A</span> = 1 |
| **Double negation (involution)** | <span style='text-decoration:overline'><span style='text-decoration:overline'>A</span></span> = A | |
| **Commutative** | A.B = B.A | A + B = B + A |
| **Associative** | (A.B).C = A.(B.C) | (A + B) + C = A + (B + C) |
| **Distributive** | A.(B + C) = A.B + A.C | A + B.C = (A + B).(A + C) |
| **Absorption** | A.(A + B) = A | A + A.B = A |
| **Redundancy (useful extra)** | A.(<span style='text-decoration:overline'>A</span> + B) = A.B | A + <span style='text-decoration:overline'>A</span>.B = A + B |
| **De Morgan** | <span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span> | <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> |

:::why Why absorption works
A + A.B: if A = 1 the whole thing is 1, and if A = 0 then A.B is also 0, so the result always equals A. Algebraically: A + A.B = A.1 + A.B = A.(1 + B) = A.1 = A.
:::

:::trap
- The second distributive law, **A + B.C = (A + B).(A + C)**, has no equivalent in ordinary arithmetic. Students often "simplify" (A + B).(A + C) wrongly. Expand it: A.A + A.C + B.A + B.C = A + A.C + A.B + B.C = A + B.C.
- <span style='text-decoration:overline'>A.B</span> is **not** <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>. The bar over a whole term is different from bars over each letter. Use De Morgan.
- A + 1 = 1, not A + 1 = A (that would be A.1).
:::

## De Morgan's laws

1. **<span style='text-decoration:overline'>A.B</span> = <span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span>**: "not (A and B)" is the same as "not A or not B".
2. **<span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span>**: "not (A or B)" is the same as "not A and not B".

**Recipe: break the bar, change the sign.** Split the bar over the whole term into bars over each part, and swap . with + (or + with .).

:::example Prove <span style='text-decoration:overline'>A + B</span> = <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> with a truth table
| A | B | A + B | <span style='text-decoration:overline'>A + B</span> | <span style='text-decoration:overline'>A</span> | <span style='text-decoration:overline'>B</span> | <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | **1** | 1 | 1 | **1** |
| 0 | 1 | 1 | **0** | 1 | 0 | **0** |
| 1 | 0 | 1 | **0** | 0 | 1 | **0** |
| 1 | 1 | 1 | **0** | 0 | 0 | **0** |

The two bold columns are identical for every input, so the expressions are equivalent.
:::

:::example De Morgan on a three-variable expression: <span style='text-decoration:overline'>A.B + <span style='text-decoration:overline'>C</span></span>
1. The bar covers the whole OR, so break it and change + to . : <span style='text-decoration:overline'>A.B</span>.<span style='text-decoration:overline'><span style='text-decoration:overline'>C</span></span>
2. Double negation: <span style='text-decoration:overline'><span style='text-decoration:overline'>C</span></span> = C, giving <span style='text-decoration:overline'>A.B</span>.C
3. De Morgan again on <span style='text-decoration:overline'>A.B</span>: (<span style='text-decoration:overline'>A</span> + <span style='text-decoration:overline'>B</span>).C
4. Optionally distribute: <span style='text-decoration:overline'>A</span>.C + <span style='text-decoration:overline'>B</span>.C
:::

## Worked simplifications

Name the law at every step: examiners award marks for correct intermediate steps.

:::example 1. Simplify A.B + A.<span style='text-decoration:overline'>B</span>
1. A.B + A.<span style='text-decoration:overline'>B</span> = A.(B + <span style='text-decoration:overline'>B</span>) — distributive (factorise A)
2. = A.1 — complement: B + <span style='text-decoration:overline'>B</span> = 1
3. = **A** — identity
:::

:::example 2. Simplify <span style='text-decoration:overline'>A</span>.<span style='text-decoration:overline'>B</span> + <span style='text-decoration:overline'>A</span>.B + A.B
1. = <span style='text-decoration:overline'>A</span>.(<span style='text-decoration:overline'>B</span> + B) + A.B — distributive
2. = <span style='text-decoration:overline'>A</span>.1 + A.B = <span style='text-decoration:overline'>A</span> + A.B — complement, identity
3. = (<span style='text-decoration:overline'>A</span> + A).(<span style='text-decoration:overline'>A</span> + B) — distributive (second law: X + Y.Z = (X + Y).(X + Z))
4. = 1.(<span style='text-decoration:overline'>A</span> + B) = **<span style='text-decoration:overline'>A</span> + B** — complement, identity
:::

:::example 3. Simplify <span style='text-decoration:overline'><span style='text-decoration:overline'>A</span> + B</span> + A.B
1. <span style='text-decoration:overline'><span style='text-decoration:overline'>A</span> + B</span> = <span style='text-decoration:overline'><span style='text-decoration:overline'>A</span></span>.<span style='text-decoration:overline'>B</span> = A.<span style='text-decoration:overline'>B</span> — De Morgan, then double negation
2. So the expression is A.<span style='text-decoration:overline'>B</span> + A.B = A.(<span style='text-decoration:overline'>B</span> + B) — distributive
3. = A.1 = **A** — complement, identity
:::

:::example 4. Simplify A.B.C + A.B.<span style='text-decoration:overline'>C</span> + <span style='text-decoration:overline'>A</span>.B
1. = A.B.(C + <span style='text-decoration:overline'>C</span>) + <span style='text-decoration:overline'>A</span>.B — distributive
2. = A.B + <span style='text-decoration:overline'>A</span>.B — complement, identity
3. = B.(A + <span style='text-decoration:overline'>A</span>) = B.1 = **B** — distributive, complement, identity
:::

:::example 5. Simplify (A + B).(A + <span style='text-decoration:overline'>B</span>)
1. Expand: A.A + A.<span style='text-decoration:overline'>B</span> + B.A + B.<span style='text-decoration:overline'>B</span> — distributive
2. = A + A.<span style='text-decoration:overline'>B</span> + A.B + 0 — idempotent, commutative, complement
3. = A + A.<span style='text-decoration:overline'>B</span> + A.B — identity
4. = **A** — absorption (A + A.X = A, twice)
:::

Check every answer by brute force: compare the original and simplified expressions for all inputs.

```python
from itertools import product

def NOT(x): return 1 - x

checks = {
    "1. A.B + A.~B = A":
        (lambda A, B, C: (A & B) | (A & NOT(B)), lambda A, B, C: A),
    "2. ~A.~B + ~A.B + A.B = ~A + B":
        (lambda A, B, C: (NOT(A) & NOT(B)) | (NOT(A) & B) | (A & B), lambda A, B, C: NOT(A) | B),
    "3. ~(~A + B) + A.B = A":
        (lambda A, B, C: NOT(NOT(A) | B) | (A & B), lambda A, B, C: A),
    "4. A.B.C + A.B.~C + ~A.B = B":
        (lambda A, B, C: (A & B & C) | (A & B & NOT(C)) | (NOT(A) & B), lambda A, B, C: B),
    "5. (A + B).(A + ~B) = A":
        (lambda A, B, C: (A | B) & (A | NOT(B)), lambda A, B, C: A),
    "De Morgan: ~(A.B + ~C) = (~A + ~B).C":
        (lambda A, B, C: NOT((A & B) | NOT(C)), lambda A, B, C: (NOT(A) | NOT(B)) & C),
}
for name, (original, simplified) in checks.items():
    same = all(original(*v) == simplified(*v) for v in product((0, 1), repeat=3))
    print(name, "->", "equivalent" if same else "NOT equivalent")
```

```output
1. A.B + A.~B = A -> equivalent
2. ~A.~B + ~A.B + A.B = ~A + B -> equivalent
3. ~(~A + B) + A.B = A -> equivalent
4. A.B.C + A.B.~C + ~A.B = B -> equivalent
5. (A + B).(A + ~B) = A -> equivalent
De Morgan: ~(A.B + ~C) = (~A + ~B).C -> equivalent
```

{{tool:boolean-simplifier}}

:::trap Simplification marks lost here
- Skipping steps: in a "show that" question, each line should apply **one** law.
- Writing the answer from a truth table without algebra when the question says "**using Boolean algebra**".
- Losing a bar while copying a line: keep bars over the right letters and check with a truth table at the end.
:::

## Adders

### Half adder

Adds two bits A and B. Sum **S = A ⊕ B**, carry **C = A.B** (one XOR gate and one AND gate).

| A | B | C (carry) | S (sum) |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 0 |

### Full adder

Adds A, B and a carry-in C<sub>in</sub>. Built from **two half adders and an OR gate**.

- **S = A ⊕ B ⊕ C<sub>in</sub>**
- **C<sub>out</sub> = A.B + C<sub>in</sub>.(A ⊕ B)**

| A | B | C<sub>in</sub> | C<sub>out</sub> | S |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 0 | 1 |
| 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 0 | 1 |
| 1 | 0 | 1 | 1 | 0 |
| 1 | 1 | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 1 |

Chaining *n* full adders, each carry-out feeding the next carry-in, adds two *n*-bit numbers (a **ripple-carry adder**). See [6.4](#/topic/6.4).

```python
def full_adder(a, b, c_in):
    s = a ^ b ^ c_in
    c_out = (a & b) | (c_in & (a ^ b))
    return c_out, s

def add_bits(x, y):
    """Add two equal-length bit strings with a chain of full adders."""
    carry, result = 0, ""
    for a, b in zip(reversed(x), reversed(y)):
        carry, s = full_adder(int(a), int(b), carry)
        result = str(s) + result
    return str(carry) + result

print(add_bits("0110", "0111"))   # 01101  (6 + 7 = 13)
```

## Edge-triggered D-type flip-flop

- A **flip-flop** is a memory unit that stores **one bit**.
- Inputs: **D** (data) and **clock**. Output: **Q** (and often <span style='text-decoration:overline'>Q</span>).
- **On the rising edge** of the clock (the moment it changes from 0 to 1), Q takes the current value of D.
- At **all other times** Q holds its value, even if D changes.
- Uses: **registers** and memory built from many flip-flops; frequency division; synchronising signals to a clock.

| Clock | D | Q after |
|---|---|---|
| rising edge ↑ | 0 | 0 |
| rising edge ↑ | 1 | 1 |
| no edge (high, low or falling) | X (any) | Q unchanged |

:::trap
- The D-type is **edge-triggered**: it samples D at the clock edge only. Saying "Q copies D whenever the clock is 1" describes a level-triggered latch and loses the mark.
- You do not need to know the internal gate structure of a flip-flop for AQA 7517, only its behaviour and use.
:::

## Karnaugh maps: a note

**Karnaugh maps are not on the AQA 7517 specification.** Your teacher's notes may include them; they are a useful way to *check* a simplification for 3–4 variables, but in the exam use Boolean identities when asked to simplify "using Boolean algebra".

:::exam
- **"Complete the truth table"**: list inputs in binary order; add intermediate columns (e.g. A.B, <span style='text-decoration:overline'>C</span>) to avoid errors.
- **"Write a Boolean expression for this circuit"**: work from the inputs to the output, writing the expression at each gate's output.
- **"Simplify using Boolean algebra"** (typically 3–4 marks): one law per line, show every step, finish with the simplest form. Marks are usually for intermediate steps and the final answer.
- **"Draw a circuit for…"**: use the standard symbols, label inputs and output, and do not add gates not needed.
- For adders and the D-type, learn the **expressions**, the **truth tables** and **what each is used for**.
:::

:::challenge
1. Show that NAND is universal by building NOT, AND and OR from NAND gates only. Write each as an expression.
2. Simplify <span style='text-decoration:overline'>A + B</span> + <span style='text-decoration:overline'>A + <span style='text-decoration:overline'>B</span></span> using Boolean algebra, then check it with the Python checker above.
3. A 3-input majority circuit outputs 1 when at least two inputs are 1. Write its expression and simplify it.
:::

:::recap
- AND = all, OR = any, NOT = invert, NAND/NOR = AND/OR inverted, XOR = inputs differ.
- 2<sup>n</sup> rows for *n* inputs; precedence: NOT, then AND, then OR.
- Identities: identity, null, idempotent, complement, double negation, commutative, associative, distributive (both forms), absorption.
- De Morgan: break the bar, change the sign.
- Half adder: S = A ⊕ B, C = A.B. Full adder: S = A ⊕ B ⊕ C<sub>in</sub>, C<sub>out</sub> = A.B + C<sub>in</sub>.(A ⊕ B).
- D-type flip-flop: Q ← D on the rising clock edge; stores one bit.
:::

:::related
- [6.4 Logic gates and circuits](#/topic/6.4)
- [6.5 Boolean algebra](#/topic/6.5)
- [5.4 Binary integers and two's complement](#/topic/5.4)
- [7.3 Instruction sets and assembly language](#/topic/7.3)
:::

*/});
