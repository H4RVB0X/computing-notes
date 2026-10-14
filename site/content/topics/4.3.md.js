CS.registerTopic({ id: "4.3", title: "Sets and the maths for regular expressions" }, function () {/*

:::objectives
- Use set notation correctly: `A = {1, 2, 3}`, `∈`, `∉`, the empty set `{}` or `Ø`, and the standard sets ℕ, ℤ, ℚ and ℝ.
- Read and write **set comprehension**, e.g. `{x | x ∈ ℕ ∧ x ≥ 1}`, and the **compact representation** `{0ⁿ1ⁿ | n ≥ 1}`.
- Classify sets as **finite**, **infinite**, **countably infinite** or **countable**, and state the **cardinality** of a finite set.
- Form the **Cartesian product** of two sets and give its cardinality.
- Use **subset** (⊆), **proper subset** (⊂), **membership**, **union** (∪), **intersection** (∩) and **difference** (\).
:::

:::quick At a glance
- A **set** is an **unordered** collection of **distinct** values: `{3, 1, 2}` = `{1, 2, 3}`, and `{1, 1, 2}` is just `{1, 2}`.
- **ℕ = {0, 1, 2, 3, …}**: AQA's natural numbers **include 0**. ℤ = integers, ℚ = rationals, ℝ = reals.
- **Empty set**: `{}` or `Ø`. It is **not** the same as `{0}`.
- **Set comprehension**: `{x | x ∈ ℕ ∧ x ≥ 1}` reads "the set of x such that x is a natural number **and** x ≥ 1" = {1, 2, 3, …}.
- **Compact representation**: `{0ⁿ1ⁿ | n ≥ 1}` = {01, 0011, 000111, …}: n 0s **followed by** n 1s.
- **Cardinality** `|A|` = number of elements in a finite set. **Countably infinite** = infinite but can be listed (matched one-to-one with ℕ). **Countable** = finite or countably infinite.
- **Cartesian product** `A × B` = all **ordered pairs** (a, b); `|A × B| = |A| × |B|`.
- **A ⊆ B**: every element of A is in B. **A ⊂ B** (proper subset): A ⊆ B **and** A ≠ B.
- **A ∪ B**: in A or B (or both). **A ∩ B**: in both. **A \ B**: in A **but not** in B.
:::

:::keyterms
Set :: An unordered collection of values in which each value occurs at most once. :: A bag of distinct things; order and repeats don't matter.
Empty set :: The set with no elements, written {} or Ø. :: A set with nothing in it.
Set comprehension :: Defining a set by stating the properties its members must have, e.g. {x | x ∈ ℕ ∧ x ≥ 1}. :: A rule that generates the set.
Compact representation :: A concise notation for a set of strings, e.g. {0ⁿ1ⁿ | n ≥ 1}, where 0ⁿ means n 0s. :: Shorthand for patterns of strings.
Finite set :: A set whose elements can be counted off by natural numbers up to a particular number. :: It ends.
Infinite set :: A set that is not finite. :: It goes on for ever.
Countably infinite set :: An infinite set whose elements can be put into a one-to-one correspondence with the natural numbers. :: Infinite, but you could list them one by one.
Countable set :: A set with the same cardinality as some subset of the natural numbers: either finite or countably infinite. :: Can be counted, even if the count never ends.
Cardinality :: The number of elements in a finite set, written |A|. :: How many things are in it.
Cartesian product :: A × B is the set of all ordered pairs (a, b) where a ∈ A and b ∈ B. :: Every pairing of one from A with one from B.
Subset :: A ⊆ B if every element of A is also an element of B. :: A fits inside B.
Proper subset :: A ⊂ B if A ⊆ B and A ≠ B, so B has at least one element not in A. :: A fits inside B and is smaller.
Union :: A ∪ B is the set of elements in A, in B, or in both. :: Everything from both.
Intersection :: A ∩ B is the set of elements in both A and B. :: Only what they share.
Difference :: A \ B (also written A − B) is the set of elements in A that are not in B. :: A with B's elements removed.
:::

## Why sets in a computing course?

A **regular expression** is "a way of describing a set": the set of strings it matches. A **language** is just a set of strings. To talk precisely about regular expressions ([4.4](#/topic/4.4)), BNF ([4.5](#/topic/4.5)) and FSMs ([4.2](#/topic/4.2)), you need the vocabulary of sets. Sets also turn up in databases (SQL `UNION`, `INTERSECT`) and in Python's `set` type.

## Set notation

```text
A = {1, 2, 3, 4}        A is the set containing 1, 2, 3 and 4
3 ∈ A                   3 is an element (member) of A
7 ∉ A                   7 is not an element of A
{} or Ø                 the empty set
```

A set is **unordered** and has **no duplicates**: `{4, 1, 1, 2}` is the same set as `{1, 2, 4}`.

### The standard number sets

| Symbol | Name | Elements |
|---|---|---|
| **ℕ** | natural numbers | {0, 1, 2, 3, …} |
| **ℤ** | integers | {…, −2, −1, 0, 1, 2, …} |
| **ℚ** | rational numbers | numbers that can be written as a fraction p/q with p, q ∈ ℤ and q ≠ 0 |
| **ℝ** | real numbers | all points on the number line, including irrationals such as √2 and π |

Each is contained in the next: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ.

:::trap ℕ includes 0
The AQA specification defines ℕ = {0, 1, 2, 3, …}. Your school slides say the natural numbers are "whole numbers **excluding 0**"; some maths courses use that convention, but **in this exam 0 ∈ ℕ**. So `{x | x ∈ ℕ ∧ x < 3}` = {0, 1, 2}, not {1, 2}.
:::

:::trap The empty set is not zero
`Ø` has **no elements**, so |Ø| = 0. `{0}` has **one** element (the number 0), and `{Ø}` also has one element (a set). Don't write `Ø = 0` or `{Ø}` for the empty set.
:::

## Set comprehension

Set comprehension defines a set by a **rule** instead of a list. Read `|` as "such that", `∈` as "is a member of" and `∧` as "and".

:::example Reading set comprehensions
| Comprehension | Read as | Set |
|---|---|---|
| `{x | x ∈ ℕ ∧ x ≥ 1}` | x such that x is natural and at least 1 | {1, 2, 3, …} |
| `{2x | x ∈ ℕ}` | 2x for every natural x | {0, 2, 4, 6, …} (even numbers, **including 0**) |
| `{x² | x ∈ ℕ ∧ x < 5}` | x² for natural x below 5 | {0, 1, 4, 9, 16} |
| `{x | x ∈ ℤ ∧ x < 0}` | negative integers | {−1, −2, −3, …} |
| `{x | x ∈ ℝ ∧ x > 0}` | positive reals | infinitely many, can't be listed |
:::

The part **before** the `|` is what goes in the set; the part **after** says where x comes from and what conditions it must meet. Python's set comprehensions follow the same shape:

```python Set comprehension in Python
N = range(0, 20)                                   # a finite slice of ℕ
evens = {2 * x for x in range(6)}                  # {2x | x ∈ ℕ ∧ x < 6}
squares = {x * x for x in N if x < 5}              # {x² | x ∈ ℕ ∧ x < 5}
print(sorted(evens))     # [0, 2, 4, 6, 8, 10]
print(sorted(squares))   # [0, 1, 4, 9, 16]
```

:::trap Comprehensions from your textbook that would lose marks
- "All real numbers greater than zero: `{x | x ∧ x ≥ 1}`." Wrong: it never says x ∈ ℝ, `x ∧` is meaningless, and ≥ 1 excludes 0.5. Correct: **`{x | x ∈ ℝ ∧ x > 0}`**.
- "Negative integers: `{x | x ∧ x < 0}`." Correct: **`{x | x ∈ ℤ ∧ x < 0}`**.
- "Cubes of natural numbers: `{x | x = x³}`." That set is just {−1, 0, 1} (the numbers equal to their own cube). Correct: **`{x³ | x ∈ ℕ}`**.
- Always say **which set x is drawn from** (`x ∈ ℕ`), and use `∧` for "and", not `^`.
:::

## Compact representation of sets of strings

A superscript means **repetition**: 0³ = 000, aⁿ = n a's.

:::example {0ⁿ1ⁿ | n ≥ 1}
- n = 1: **01**
- n = 2: **0011**
- n = 3: **000111**
- n = 4: **00001111**

So the set is {01, 0011, 000111, 00001111, …}: **n 0s followed by the same number n of 1s**.
:::

:::trap Not "equal numbers of 0s and 1s"
The ZigZag slide describes {0ⁿ1ⁿ | n ≥ 1} as "strings with an equal number of 0s and 1s". That is too loose: **0101** and **10** have equal numbers but are **not** in the set, because all the 0s must come **first**. The same slide also lists the set as {01, 0011, 00001111, …}, missing out **000111**.
:::

Another example: `{aⁿbᵐ | n ≥ 0 ∧ m ≥ 1}` = any number of a's (possibly none) followed by at least one b: {b, bb, ab, abb, aab, …}. That set can be described by the regular expression `a*b+`. The set {0ⁿ1ⁿ} **cannot** be described by any regular expression, because it needs counting. That is why BNF is needed ([4.5](#/topic/4.5)).

## Finite, infinite and countable sets

| Kind | Meaning | Examples |
|---|---|---|
| **Finite** | elements can be counted off up to some natural number | {1, 2, 3}; the set of ASCII characters |
| **Infinite** | not finite | ℕ, ℤ, ℝ |
| **Countably infinite** | infinite, but can be matched **one-to-one with ℕ** (listed in an order that eventually reaches every element) | ℕ, ℤ, even numbers, ℚ |
| **Countable** | finite **or** countably infinite | all of the above except ℝ |

**Cardinality** `|A|` is the number of elements of a **finite** set: |{a, b, c}| = 3, |Ø| = 0.

:::why Why is ℤ countable?
It looks "twice as big" as ℕ, but you can list it so every integer appears at a definite position: 0, 1, −1, 2, −2, 3, −3, … That pairs ℕ position 0, 1, 2, 3, … with ℤ one-to-one. The real numbers ℝ **cannot** be listed like this (they are **uncountable**), but you only need to know that ℝ is infinite and not countable, not the proof.
:::

## Cartesian product

:::definition Cartesian product
`A × B = {(a, b) | a ∈ A ∧ b ∈ B}`: the set of **all ordered pairs** whose first element comes from A and second from B.
:::

:::example X = {x, y, z}, Y = {1, 2}
X × Y = {(x, 1), (x, 2), (y, 1), (y, 2), (z, 1), (z, 2)}
|X × Y| = |X| × |Y| = 3 × 2 = **6**
:::

- Pairs are **ordered**: (x, 1) ≠ (1, x), so X × Y ≠ Y × X in general.
- A **chessboard** is {a, …, h} × {1, …, 8}: 8 × 8 = 64 squares. A relational **table** is a subset of the Cartesian product of its attributes' domains.
- If A has 8 elements and B has 9, |A × B| = **72**.

:::trap Write pairs in brackets
The textbook answer writes the product as {x1, x2, y1, …}. Write **ordered pairs**: `(x, 1)`. Without brackets you lose the idea that each element is a pair.
:::

## Subsets and proper subsets

| Notation | Meaning | Example |
|---|---|---|
| `A ⊆ B` | **subset**: every element of A is in B (A may equal B) | {1, 2} ⊆ {1, 2, 3}; {1, 2, 3} ⊆ {1, 2, 3} |
| `A ⊂ B` | **proper subset**: A ⊆ B **and** A ≠ B | {1, 2} ⊂ {1, 2, 3}, but {1, 2, 3} ⊄ {1, 2, 3} |

Every set is a subset of itself, and **Ø is a subset of every set**. ℕ ⊂ ℤ: every natural number is an integer, but −1 is an integer that isn't natural.

## Set operations

:::figure Shaded regions for the three operations on the specification.
<svg class="diagram" viewBox="0 0 660 200" role="img" aria-label="Three Venn diagrams shading A union B, A intersection B and A minus B">
  <defs>
    <clipPath id="clip43a"><circle cx="295" cy="95" r="55"/></clipPath>
    <mask id="mask43b"><rect x="440" y="0" width="220" height="200" fill="#ffffff"/><circle cx="575" cy="95" r="55" fill="#000000"/></mask>
  </defs>
  <g font-family="inherit" font-size="14">
    <circle cx="75" cy="95" r="55" fill="#7c9aff" fill-opacity="0.45"/><circle cx="145" cy="95" r="55" fill="#7c9aff" fill-opacity="0.45"/>
    <circle cx="75" cy="95" r="55" fill="none" stroke="currentColor"/><circle cx="145" cy="95" r="55" fill="none" stroke="currentColor"/>
    <text x="55" y="100" text-anchor="middle">A</text><text x="165" y="100" text-anchor="middle">B</text>
    <text x="110" y="185" text-anchor="middle" font-weight="bold">A ∪ B</text>
    <circle cx="365" cy="95" r="55" fill="#5fd3a0" fill-opacity="0.6" clip-path="url(#clip43a)"/>
    <circle cx="295" cy="95" r="55" fill="none" stroke="currentColor"/><circle cx="365" cy="95" r="55" fill="none" stroke="currentColor"/>
    <text x="275" y="100" text-anchor="middle">A</text><text x="385" y="100" text-anchor="middle">B</text>
    <text x="330" y="185" text-anchor="middle" font-weight="bold">A ∩ B</text>
    <circle cx="505" cy="95" r="55" fill="#ffb86b" fill-opacity="0.6" mask="url(#mask43b)"/>
    <circle cx="505" cy="95" r="55" fill="none" stroke="currentColor"/><circle cx="575" cy="95" r="55" fill="none" stroke="currentColor"/>
    <text x="485" y="100" text-anchor="middle">A</text><text x="595" y="100" text-anchor="middle">B</text>
    <text x="540" y="185" text-anchor="middle" font-weight="bold">A \ B</text>
  </g>
</svg>
:::

:::example A = {1, 2, 3, 4}, B = {3, 4, 5, 6}
| Operation | Meaning | Result |
|---|---|---|
| **A ∪ B** (union) | in A or B or both | {1, 2, 3, 4, 5, 6} |
| **A ∩ B** (intersection) | in both | {3, 4} |
| **A \ B** (difference) | in A but not in B | **{1, 2}** |
| **B \ A** | in B but not in A | {5, 6} |
| membership | is 5 ∈ A? | no: 5 ∉ A |
:::

:::trap Difference is not symmetric difference
Your school slides define "difference" as "items that are in either set but not in both" and give **A Θ B = {1, 2, 5, 6}**. That operation is the **symmetric difference** (usually written A Δ B), which is **not** on the AQA spec. AQA **difference** is **A \ B = {1, 2}**: only the elements of **A** that are not in B. Note that A \ B ≠ B \ A.
:::

```python Set operations in Python
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}
print(A | B)          # union         {1, 2, 3, 4, 5, 6}
print(A & B)          # intersection  {3, 4}
print(A - B)          # difference    {1, 2}
print(B - A)          # difference    {5, 6}
print(5 in A)         # membership    False
print({1, 2} <= A)    # subset        True
print(A < A)          # proper subset False
print(len(A))         # cardinality   4

from itertools import product
pairs = set(product({"x", "y", "z"}, {1, 2}))   # Cartesian product
print(len(pairs))     # 6
```

{{tool:set-calculator a=1,2,3,4 b=3,4,5,6}}

:::exam
- **Notation is marked exactly**: curly braces for sets, round brackets for ordered pairs, `|` for "such that", `∈` for membership, `∧` for "and".
- **"Describe the set {x | x ∈ ℕ ∧ x < 4}"**: list it ({0, 1, 2, 3}) or describe it in words, remembering 0 ∈ ℕ.
- **"Explain why ℤ is countably infinite"**: infinite, but its elements can be put in one-to-one correspondence with ℕ (listed 0, 1, −1, 2, −2, …).
- **Cartesian product**: list every pair systematically (all with the first a, then the next…), then check the count equals |A| × |B|.
- **Proper subset**: two conditions: A ⊆ B **and** A ≠ B.
:::

:::challenge
1. List the first five elements of {3x + 1 | x ∈ ℕ} and {x | x ∈ ℕ ∧ x MOD 4 = 1}. Are they the same set?
2. A = {a, b}. Write out A × A × A. What is its cardinality, and how does it relate to 3-bit binary strings?
3. Give a set comprehension for the set of all odd integers (positive and negative).
4. How many subsets does {1, 2, 3} have? How many are proper subsets? Generalise to a set of n elements.
:::

:::recap
- Sets are unordered, no duplicates. ℕ = {0, 1, 2, …} **includes 0**. Ø = {} has no elements.
- Comprehension `{x | x ∈ ℕ ∧ condition}`; compact `{0ⁿ1ⁿ | n ≥ 1}` = 01, 0011, 000111, …
- Finite (has cardinality |A|), infinite, countably infinite (one-to-one with ℕ), countable (finite or countably infinite). ℝ is not countable.
- `A × B` = all ordered pairs; `|A × B| = |A| × |B|`.
- `A ⊆ B` subset; `A ⊂ B` proper subset (and A ≠ B).
- `∪` either, `∩` both, `A \ B` in A not B (not symmetric difference).
:::

:::related
- [4.4 Regular expressions and regular languages](#/topic/4.4) — a regex describes a set
- [4.5 Backus-Naur Form](#/topic/4.5) — for sets like {0ⁿ1ⁿ} that regex can't describe
- [5.1 Number systems](#/topic/5.1) — ℕ, ℤ, ℚ, ℝ
- [10.4 SQL](#/topic/10.4) — joins and set operations on tables
:::

*/});
