CS.registerTopic({ id: "5.1", title: "Number systems" }, function () {/*

:::objectives
- Define **natural numbers (ℕ)**, **integers (ℤ)**, **rational numbers (ℚ)**, **irrational numbers** and **real numbers (ℝ)**, and give examples of each.
- Explain how the sets **nest inside each other**: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ, with the irrationals filling the rest of ℝ.
- Explain what an **ordinal number** is and how it differs from a **cardinal** (counting) number.
- Choose the right kind of number for a job: **natural numbers for counting**, **real numbers for measurement**.
- Connect each number set to the data types a programmer chooses.
:::

:::quick At a glance
- **ℕ (natural)** = {0, 1, 2, 3, …}. AQA says ℕ **includes zero**. Used for **counting**.
- **ℤ (integers)** = {…, −2, −1, 0, 1, 2, …}: whole numbers, positive, negative or zero.
- **ℚ (rational)**: any number that can be written as **p/q**, with p and q integers and **q ≠ 0**. Every integer is rational (5 = 5/1).
- **Irrational**: a real number that **cannot** be written as p/q; its decimal goes on forever **without repeating** (√2, π).
- **ℝ (real)**: all of the above together, every point on the number line. Used for **measurement**.
- **Ordinal number**: describes **position** in an ordered list (1st, 2nd, 3rd; array index 0, 1, 2).
- Nesting: **ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ**, and ℝ = ℚ ∪ irrationals.
- Recurring decimals such as 0.333… are **rational**, not irrational.
:::

:::keyterms
Natural number :: A non-negative whole number used for counting; the set ℕ = {0, 1, 2, 3, …} (AQA includes zero). :: The numbers you count with, starting at nothing.
Integer :: A whole number that may be positive, negative or zero; the set ℤ = {…, −2, −1, 0, 1, 2, …}. :: Whole numbers, including negatives.
Rational number :: A number that can be written as a fraction p/q where p and q are integers and q ≠ 0; the set ℚ, which includes the integers. :: Anything you can write as one whole number over another.
Irrational number :: A real number that cannot be written as a fraction of two integers; its decimal expansion is infinite and never repeats. :: Numbers like π and √2 that never settle into a pattern.
Real number :: Any number that is a point on the continuous number line; the set ℝ contains ℕ, ℤ, ℚ and the irrational numbers. :: Every possible measurement value.
Ordinal number :: A number that describes the numerical position of an object in an ordered collection (first, second, third…). :: "Which place?" rather than "how many?".
Cardinal number :: A number that states how many items there are in a collection (the size of a set). :: "How many?".
Set :: An unordered collection of distinct values, written in braces, e.g. {2, 3, 5}. :: A bag of different things where order doesn't matter.
:::

## Why a computer scientist cares about number sets

You already know these numbers from maths. The reason they appear in a computing specification is simple: **every number a program stores has to be stored in a particular way**, and the way depends on which kind of number it is.

- A loop counter, a stock level or the number of players only needs **natural numbers**, so an unsigned integer type is perfect.
- A bank balance can go negative, so it needs **integers** (or fixed-point decimals).
- A temperature, a distance or a time needs **real numbers**, so it is stored in **floating point** ([5.5](#/topic/5.5)), which is always an approximation.

:::why
Choosing the wrong set causes real bugs. Store a measurement as an integer and you silently lose the fractional part. Store money as floating point and 0.1 + 0.2 is not exactly 0.3. Knowing which set a value belongs to is the first step in choosing a data type.
:::

## The five sets, one by one

### Natural numbers, ℕ

ℕ = {0, 1, 2, 3, 4, …}

- These are the **counting numbers**. "How many dogs do you have?" always has a natural-number answer.
- The AQA specification says ℕ **includes zero**: having no items is a perfectly sensible count.
- ℕ is infinite: start at 0 and keep adding 1.

:::trap ℕ includes zero
Some maths textbooks (and one of your teacher's slides on sets) define ℕ as starting at 1. **For AQA 7517, ℕ = {0, 1, 2, 3, …}.** If an exam question asks for the smallest natural number, the answer is **0**.
:::

### Integers, ℤ

ℤ = {…, −3, −2, −1, 0, 1, 2, 3, …}

- Whole numbers, **positive, negative or zero**. The letter Z comes from the German *Zahlen*, "numbers".
- Any number with a fractional part (4.5, π) is **not** an integer.
- Every natural number is an integer, so **ℕ ⊂ ℤ**.

### Rational numbers, ℚ

A number is **rational** if it can be written as a **ratio** of two integers:

> p / q, where p ∈ ℤ, q ∈ ℤ and **q ≠ 0**

- Examples: 1/2, −7/4, 0.75 (= 3/4), 0.333… (= 1/3), **5 (= 5/1)**.
- **Every integer is rational**, because any integer n can be written as n/1. So **ℤ ⊂ ℚ**.
- As a decimal, a rational number either **terminates** (0.75) or **recurs** (0.142857142857…).
- The denominator can never be 0. In a program, dividing by zero raises an error such as Python's `ZeroDivisionError`.

### Irrational numbers

An **irrational** number is a real number that **cannot** be written as p/q.

- Its decimal expansion is **infinite and never falls into a repeating pattern**.
- Examples: √2 = 1.41421356…, π = 3.14159265…, e = 2.71828…, √3.
- There is no special letter for this set in the specification. It can be written as **ℝ \ ℚ** ("the reals without the rationals").

:::trap "It goes on forever, so it's irrational" is wrong
Your textbook answer defines an irrational number as one that "cannot be represented as a fraction as it would recur". That is **backwards**. A **recurring** decimal (0.666…) is **rational**: it equals 2/3. An irrational number goes on forever **without repeating**. The mark-scheme phrase is "cannot be expressed as a fraction / ratio of two integers".
:::

### Real numbers, ℝ

ℝ contains **every point on the continuous number line**: all the rationals plus all the irrationals.

- Real numbers are used for **measurement**: length, mass, time, temperature, voltage.
- Between any two real numbers there are infinitely many more, which is exactly what you need for something continuous.

## How the sets fit together

:::figure The number sets nest inside one another. The irrationals are the part of ℝ outside ℚ.
<svg class="diagram" viewBox="0 0 620 320" role="img" aria-label="Nested sets: N inside Z inside Q inside R, with irrational numbers in R outside Q">
  <g font-family="inherit" font-size="14">
    <rect x="10" y="10" width="600" height="300" rx="16" fill="#7c9aff" fill-opacity="0.12" stroke="currentColor"/>
    <text x="28" y="36" font-weight="bold" fill="currentColor">ℝ real numbers</text>
    <rect x="30" y="50" width="400" height="245" rx="14" fill="#5fc9a8" fill-opacity="0.18" stroke="currentColor"/>
    <text x="46" y="74" font-weight="bold" fill="currentColor">ℚ rational</text>
    <rect x="50" y="88" width="270" height="195" rx="12" fill="#f0b45b" fill-opacity="0.22" stroke="currentColor"/>
    <text x="66" y="110" font-weight="bold" fill="currentColor">ℤ integers</text>
    <rect x="70" y="124" width="150" height="145" rx="10" fill="#e07a9b" fill-opacity="0.25" stroke="currentColor"/>
    <text x="86" y="146" font-weight="bold" fill="currentColor">ℕ natural</text>
    <text x="86" y="176" fill="currentColor">0  1  2</text>
    <text x="86" y="200" fill="currentColor">3  42  1000</text>
    <text x="236" y="176" fill="currentColor">−1</text>
    <text x="236" y="206" fill="currentColor">−17</text>
    <text x="340" y="150" fill="currentColor">1/2</text>
    <text x="340" y="180" fill="currentColor">−0.75</text>
    <text x="340" y="210" fill="currentColor">0.333…</text>
    <text x="340" y="240" fill="currentColor">22/7</text>
    <text x="450" y="74" font-weight="bold" fill="currentColor">irrational</text>
    <text x="450" y="104" fill="currentColor">ℝ \ ℚ</text>
    <text x="460" y="150" fill="currentColor">π</text>
    <text x="460" y="180" fill="currentColor">√2</text>
    <text x="460" y="210" fill="currentColor">e</text>
    <text x="460" y="240" fill="currentColor">1.4142135…</text>
  </g>
</svg>
:::

| Number | ℕ | ℤ | ℚ | Irrational | ℝ |
|---|---|---|---|---|---|
| 7 | ✓ | ✓ | ✓ | | ✓ |
| 0 | ✓ | ✓ | ✓ | | ✓ |
| −4 | | ✓ | ✓ | | ✓ |
| 2.5 | | | ✓ | | ✓ |
| 0.1666… (= 1/6) | | | ✓ | | ✓ |
| √9 (= 3) | ✓ | ✓ | ✓ | | ✓ |
| √10 | | | | ✓ | ✓ |
| π | | | | ✓ | ✓ |

:::example Classify each number, showing the reasoning
1. **−12**: a whole number, negative → integer. Not natural (negative). Rational, because −12 = −12/1. Real.
2. **3.75**: not whole → not an integer. 3.75 = 15/4 → rational. Real.
3. **√16**: simplifies to 4 → natural, integer, rational, real. *Always simplify first.*
4. **√5**: 5 is not a perfect square, so √5 = 2.2360679… with no repeating pattern → irrational, real.
5. **0.272727…**: recurring, so rational: 0.2727… = 27/99 = 3/11. Real.
:::

## Ordinal numbers: position, not quantity

There are two different questions you can answer with a number:

| Question | Kind of number | Example |
|---|---|---|
| **How many?** | **Cardinal** (counting) | "There are 8 runners in the race." |
| **Which position?** | **Ordinal** | "Amy finished **3rd**." |

- An **ordinal number** describes the **numerical position** of an object in an ordered collection.
- In computing, **array indices** and string positions are ordinal: `names[2]` means "the item in position 2".
- Characters of the alphabet can be given ordinal values (A = 1st, B = 2nd…). This is called **enumeration**.
- Ordinals are still natural numbers, but they are being *used* for ordering, not for counting.

:::trap Race positions are ordinal, not cardinal
Your textbook answer to "the position of runners as they finish a race" says *cardinal* number. That is wrong. **Position** = **ordinal**. The *number of runners* in the race is cardinal.
:::

:::note Indexing starts at 0
AQA exam papers assume array and string indexing starts at **0** unless a question says otherwise. So in `"Bob"`, the character `o` is at position 1. That is still an ordinal: it names a place.
:::

```python
name = "Bob"
print(name.index("o"))   # 1  -> ordinal: o is in position 1 (0-indexed)
print(len(name))         # 3  -> cardinal: there are 3 characters
```

## Counting versus measuring

The specification makes a neat distinction:

- **Natural numbers are used for counting**: discrete objects that cannot be split. A classroom has 3 computers, never 3½.
- **Real numbers are used for measurement**: continuous quantities. The distance between two points can be 3.2 m, 3.25 m, 3.2501 m, and so on without end.

:::why
We **count** things that are **discrete**; we **measure** things that are **continuous**. Any part of a continuous length, however small, is still a valid length, so we need fractions (and irrationals: the diagonal of a 1 m square is exactly √2 m).
:::

:::note Averages leave ℕ behind
The *average* number of people per household might be 2.4. Each count was a natural number, but once you divide, the result is a real number.
:::

### Where each set appears in programs

| Set | Typical use in a program | Typical data type |
|---|---|---|
| ℕ | loop counters, the program counter, number of items, array lengths, memory addresses | unsigned integer |
| ℤ | temperatures in whole degrees, score changes, offsets that may be negative | signed integer (two's complement, [5.4](#/topic/5.4)) |
| ℚ | exact fractions, money in pence over 100 | integer pairs, fixed point, `Fraction` |
| ℝ | physics simulations, graphics coordinates, sensor readings, robot arm positions | floating point ([5.5](#/topic/5.5)) |
| Ordinal | array/list index, position in a queue, ranking | integer used as an index |

::::tabs
:::tab Python
```python
from fractions import Fraction
import math

count = 3                 # natural number: counting
change = -15              # integer
third = Fraction(1, 3)    # rational, stored exactly as 1/3
print(third * 3)          # 1  (exact)
print(0.1 + 0.2 == 0.3)   # False: floats only approximate reals
print(math.pi)            # 3.141592653589793 (an approximation of an irrational)
```
:::
:::tab AQA pseudocode
```pseudocode
count ← 3
FOR i ← 0 TO count - 1
    OUTPUT "Item in position ", i
ENDFOR
OUTPUT 7 DIV 2      # 3  (integer division keeps us in ℤ)
OUTPUT 7 / 2        # 3.5 (a real result)
```
:::
::::

:::trap Computers cannot store every real number
ℝ is infinite and continuous, but memory is finite. A computer can only store a **finite subset** of the reals. Irrationals such as π are always stored as an **approximation**, and so are many simple rationals such as 0.1 (it recurs in binary). This is the root of the rounding errors in [5.5](#/topic/5.5).
:::

## Set notation you need

| Notation | Meaning | Example |
|---|---|---|
| { } | a set | {1, 3, 5} |
| x ∈ A | x is a member of A | 3 ∈ ℕ |
| x ∉ A | x is not a member of A | −3 ∉ ℕ |
| A ⊂ B | A is a proper subset of B | ℕ ⊂ ℤ |
| A \ B | members of A not in B | ℝ \ ℚ = irrationals |
| … | the set continues forever | {0, 1, 2, …} |

There is more on sets in [4.3 Sets and the maths for regular expressions](#/topic/4.3).

:::exam
- **"Define a rational number" (1–2 marks):** "a number that can be written as a fraction / ratio of two integers" + "where the denominator is not zero". Saying "a fraction" alone is weak.
- **"Define an irrational number":** "a (real) number that cannot be written as a fraction of two integers", optionally "its decimal expansion never terminates or repeats". Give π or √2 as an example if asked.
- **"Give an example of a number that is in ℚ but not in ℤ":** any non-whole fraction, e.g. 1/2. Don't give 4/2 (that equals 2, an integer).
- **"What type of number would be used for…":** count → **natural**; position → **ordinal**; something that can be negative but is whole → **integer**; measurement → **real**.
- **"Explain why ℕ ⊂ ℤ" or "why all integers are rational":** show the inclusion: any integer n = n/1.
:::

:::challenge
1. Prove that 0.4999… (recurring) is rational. What surprising number is it equal to?
2. Is the set of rational numbers between 0 and 1 finite or infinite? Justify your answer.
3. A program stores a person's age in whole years and their height in metres. Which number set does each belong to, and what data type would you choose? Why might "age in years" be stored as an integer even though age is continuous?
4. Python's `Fraction` stores rationals exactly. Why can no data type store every irrational exactly?
:::

:::recap
- **ℕ** = {0, 1, 2, …}: counting numbers, **including 0** for AQA.
- **ℤ** = whole numbers including negatives; **ℚ** = p/q with integers p, q and q ≠ 0; every integer is rational.
- **Irrational** = real but not p/q; infinite, non-repeating decimal (π, √2). Recurring decimals are rational.
- **ℝ** = every point on the number line = rationals ∪ irrationals. **ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ**.
- **Ordinal** = position (1st, index 2); **cardinal** = how many.
- **Natural numbers for counting, real numbers for measurement.**
- Computers can only approximate most reals, which leads to rounding errors.
:::

:::related
- [5.2 Number bases](#/topic/5.2)
- [5.4 Binary integers and two's complement](#/topic/5.4)
- [5.5 Fixed point and floating point](#/topic/5.5)
- [4.3 Sets and the maths for regular expressions](#/topic/4.3)
:::

*/});
