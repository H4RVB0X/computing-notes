CS.registerTopic({ id: "4.6", title: "Big-O notation and classification of algorithms" }, function () {/*

:::objectives
- Explain why algorithms are compared using **complexity** as a function of **problem size n**, in terms of **time** and **space**.
- Describe a **function** as a mapping from a **domain** to a **co-domain**, and recognise **linear, polynomial, exponential and logarithmic** functions.
- Calculate the number of **permutations** of n distinct objects (**n!**).
- Use Big-O notation for **constant, logarithmic, linear, polynomial, exponential** (and factorial) time, and put them in order.
- **Derive** the time complexity of an algorithm from its code.
:::

:::quick At a glance
- **Time complexity**: how the number of steps grows as the input size **n** grows. **Space complexity**: how the memory needed grows.
- **Big-O** keeps only the **dominant term** and drops constants: 3n² + 5n + 7 is **O(n²)**.
- Order, best to worst: **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)**.
- **Sequence**: add the costs and keep the biggest. **Loop**: multiply the body's cost by the iterations. **Nested loops over n**: multiply → O(n²).
- A loop that **halves** (or doubles) its variable runs about **log₂ n** times → O(log n).
- Standard results: linear search O(n), binary search O(log n), bubble/insertion sort O(n²), merge sort O(n log n).
- A **function** maps each element of its **domain** to exactly one element of its **co-domain**, e.g. f: ℕ → ℕ.
- n distinct objects can be arranged in **n! = n × (n−1) × … × 1** ways. 5! = 120, 10! = 3 628 800.
:::

:::keyterms
Time complexity :: How the time (number of steps) an algorithm needs grows in relation to the size of its input. :: How much slower it gets as the data grows.
Space complexity :: How the amount of memory an algorithm needs grows in relation to the size of its input. :: How much more memory it needs as the data grows.
Big-O notation :: A notation that expresses the order of growth of an algorithm's time or space requirements as a function of input size n, keeping only the dominant term and ignoring constants; normally quoted for the worst case. :: A label like O(n²) describing the growth rate.
Problem size (n) :: The size of the input to an algorithm, e.g. the number of items in a list to be sorted. :: How much data there is.
Function :: A mapping from one set of values, the domain, to another set of values drawn from the co-domain; every input maps to exactly one output. :: A rule turning each input into one output.
Domain :: The set of all possible inputs of a function. :: What you are allowed to put in.
Co-domain :: The set from which a function's outputs are drawn (not every member need be produced). :: The set the answers come from.
Permutation :: An ordered arrangement of a set of objects; n distinct objects have n! permutations. :: A different order of the same things.
Factorial (n!) :: The product of all positive integers from 1 to n, with 0! = 1. :: n × (n−1) × … × 1.
Logarithm :: The inverse of exponentiation: log₂ n is the power to which 2 must be raised to give n. :: How many times you can halve n before you reach 1.
:::

## Why compare algorithms this way?

Timing a program with a stopwatch tells you about **that computer**, **that language** and **that data**. Change any of them and the time changes. Computer scientists want a measure of the **algorithm itself**, so they ask:

> As the problem size **n** grows, how fast does the work grow?

- **Time complexity**: count the **basic operations** (comparisons, assignments, swaps) as a function of n.
- **Space complexity**: how much **extra memory** is needed as a function of n.

Two algorithms can solve the same problem with very different efficiency. Linear search checks up to n items; binary search on sorted data checks at most about log₂ n. For a million items that is 1 000 000 comparisons against **20**.

Sometimes there is a **trade-off**: merge sort is faster than bubble sort (O(n log n) vs O(n²)) but needs O(n) **extra memory** for the merged lists, while bubble sort sorts **in place** using O(1) extra memory.

## Functions and their growth

The spec expects you to know the maths behind the labels.

### Function, domain and co-domain

A **function** is a mapping from one set of values, the **domain**, to another set, the **co-domain**. Every member of the domain maps to **exactly one** member of the co-domain. We write f: A → B, e.g. **f: ℕ → ℕ** where f(x) = x².

:::figure f(x) = x² with domain {1, 2, 3, 4} and co-domain ℕ
<svg class="diagram" viewBox="0 0 520 230" role="img" aria-label="Arrows map 1 to 1, 2 to 4, 3 to 9 and 4 to 16 inside the co-domain of natural numbers; other natural numbers such as 0, 2, 3 and 5 are not mapped to">
  <defs><marker id="arr46" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <ellipse cx="110" cy="120" rx="70" ry="90" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
  <ellipse cx="390" cy="120" rx="110" ry="100" fill="#35d4bd" fill-opacity="0.15" stroke="currentColor"/>
  <text x="110" y="22" text-anchor="middle" font-weight="700" font-size="14">Domain</text>
  <text x="390" y="14" text-anchor="middle" font-weight="700" font-size="14">Co-domain ℕ</text>
  <g font-size="16" text-anchor="middle" font-family="inherit">
    <text x="110" y="65">1</text><text x="110" y="105">2</text><text x="110" y="145">3</text><text x="110" y="185">4</text>
    <text x="360" y="65" font-weight="700">1</text><text x="360" y="105" font-weight="700">4</text><text x="360" y="145" font-weight="700">9</text><text x="360" y="185" font-weight="700">16</text>
    <text x="430" y="70" opacity="0.6">0</text><text x="455" y="105" opacity="0.6">2</text><text x="435" y="140" opacity="0.6">3</text><text x="455" y="175" opacity="0.6">5</text><text x="420" y="205" opacity="0.6">…</text>
  </g>
  <g stroke="currentColor" stroke-width="1.5" marker-end="url(#arr46)">
    <line x1="122" y1="60" x2="345" y2="60"/><line x1="122" y1="100" x2="345" y2="100"/><line x1="122" y1="140" x2="345" y2="140"/><line x1="122" y1="180" x2="340" y2="180"/>
  </g>
</svg>
:::

The outputs actually produced, {1, 4, 9, 16}, are called the **range** (or image). They are a **subset** of the co-domain: 0, 2, 3, 5 … are in the co-domain but never produced.

:::trap Marks are lost here
The textbook answer in your notes says "the codomain is the subset" and gives co-domain = {1, …, 6} for cubing 1 to 6. That is muddled. For f(x) = x³ on {1, 2, 3, 4, 5, 6}: **domain** = {1, 2, 3, 4, 5, 6}; **co-domain** = ℕ (the set outputs are drawn from); **range** = {1, 8, 27, 64, 125, 216} (the outputs actually produced, a subset of the co-domain).
:::

### Four kinds of function

| Function | General form | Example | Grows… |
|---|---|---|---|
| **Linear** | y = ax + b | y = 2x + 3 | at a constant rate (straight line) |
| **Polynomial** | y = axᵏ + … (k a constant) | y = x², y = x³ | faster and faster, but "tamely" |
| **Exponential** | y = aˣ (a > 1) | y = 2ˣ | by multiplying: each +1 to x **doubles** y |
| **Logarithmic** | y = logₐ x | y = log₂ x | ever more slowly: doubling x adds just 1 |

:::trap Marks are lost here
The Isaac page in your notes says a polynomial graph is always a "symmetrical curve". Only some are (y = x² is symmetrical about the y-axis). y = x³ − x² is a polynomial with no symmetry at all. What matters here is the **growth rate**: a polynomial's highest power k fixes how fast it grows.
:::

**log₂ n** is "how many times can I halve n before I reach 1?". log₂ 8 = 3 because 2³ = 8; log₂ 1024 = 10. Logarithms are the **inverse** of exponentials, which is why halving algorithms are logarithmic.

### Permutations and n!

How many ways can you arrange **A, B, C**? ABC, ACB, BAC, BCA, CAB, CBA: **6**. There are 3 choices for the first place, then 2, then 1: 3 × 2 × 1 = **3! = 6**.

In general, **n distinct objects have n! permutations**: n × (n − 1) × … × 2 × 1.

| n | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| n! | 1 | 2 | 6 | 24 | 120 | 720 | 40 320 | 3 628 800 | ≈ 2.4 × 10¹⁸ |

This is why **brute-force** solutions that try every ordering, like checking every route in the travelling salesman problem, explode: see [4.7](#/topic/4.7).

## Big-O notation

Suppose counting operations gives **T(n) = 3n² + 5n + 7**. As n grows, the n² term **dominates**:

| n | 3n² | 5n | 7 | T(n) | share from 3n² |
|---|---|---|---|---|---|
| 10 | 300 | 50 | 7 | 357 | 84% |
| 100 | 30 000 | 500 | 7 | 30 507 | 98.3% |
| 1000 | 3 000 000 | 5 000 | 7 | 3 005 007 | 99.8% |

Big-O keeps **only the dominant term** and drops its **constant multiplier**, because constants depend on the machine, not the algorithm:

**3n² + 5n + 7 is O(n²)**

Rules:

1. Keep the fastest-growing term; drop the rest. (n³ + 1000n² → O(n³).)
2. Drop constant multipliers. (5n → O(n); n/2 → O(n).)
3. A fixed number of steps, however large, is **O(1)**. (1000 steps → O(1).)
4. The base of a logarithm doesn't matter (log₂ n and log₁₀ n differ by a constant factor), so write **O(log n)**.

Big-O describes an **upper bound** on growth and is normally quoted for the **worst case**. Linear search is O(n) even though it sometimes finds the item first time.

### The complexity classes, best to worst

| Big-O | Name | Typical example | What doubling n does |
|---|---|---|---|
| **O(1)** | constant | access `a[i]`; test if n is odd; push onto a stack | nothing |
| **O(log n)** | logarithmic | binary search; search a balanced BST | adds one step |
| **O(n)** | linear | linear search; sum a list; traverse a tree | doubles the time |
| **O(n log n)** | linearithmic | merge sort | slightly more than doubles |
| **O(n²)** | polynomial (quadratic) | bubble sort, insertion sort; nested loops | ×4 |
| **O(n³)** | polynomial (cubic) | three nested loops, e.g. naive matrix multiplication | ×8 |
| **O(2ⁿ)** | exponential | all subsets of n items; naive recursive Fibonacci | **squares** the time (adding just 1 to n doubles it) |
| **O(n!)** | factorial | brute-force travelling salesman (every route) | astronomically worse |

O(n²), O(n³) and every O(nᵏ) are **polynomial**. O(2ⁿ) and every O(kⁿ) with k > 1 are **exponential**. O(n!) grows faster still.

:::figure How the number of steps grows (n from 1 to 10, steps capped at 100)
<svg class="diagram" viewBox="0 0 640 330" role="img" aria-label="Line chart: O(1) and O(log n) stay near the bottom, O(n) and O(n log n) rise gently, O(n squared) reaches 100 at n equals 10, while O(2 to the n) leaves the chart at about n equals 6.6 and O(n factorial) at about n equals 5">
  <g stroke="currentColor" stroke-opacity="0.35">
    <line x1="60" y1="290" x2="560" y2="290"/><line x1="60" y1="30" x2="60" y2="290"/>
    <line x1="60" y1="160" x2="560" y2="160" stroke-dasharray="4 4"/><line x1="60" y1="30" x2="560" y2="30" stroke-dasharray="4 4"/>
  </g>
  <g font-size="12" fill="currentColor">
    <text x="52" y="294" text-anchor="end">0</text><text x="52" y="164" text-anchor="end">50</text><text x="52" y="34" text-anchor="end">100</text>
    <text x="60" y="308" text-anchor="middle">1</text><text x="282" y="308" text-anchor="middle">5</text><text x="560" y="308" text-anchor="middle">10</text>
    <text x="310" y="325" text-anchor="middle">n (problem size)</text>
    <text x="16" y="160" text-anchor="middle" transform="rotate(-90 16 160)">steps</text>
  </g>
  <polyline points="60,287.4 74,287.4 88,287.4 102,287.4 116,287.4 129,287.4 143,287.4 157,287.4 171,287.4 185,287.4 199,287.4 213,287.4 227,287.4 241,287.4 254,287.4 268,287.4 282,287.4 296,287.4 310,287.4 324,287.4 338,287.4 352,287.4 366,287.4 379,287.4 393,287.4 407,287.4 421,287.4 435,287.4 449,287.4 463,287.4 477,287.4 491,287.4 504,287.4 518,287.4 532,287.4 546,287.4 560,287.4" fill="none" stroke="#868e96" stroke-width="2.5"/>
  <text x="566" y="288" font-size="12" fill="#868e96" font-weight="700">O(1)</text>
  <polyline points="60,290.0 74,289.2 88,288.5 102,287.9 116,287.4 129,287.0 143,286.6 157,286.2 171,285.9 185,285.6 199,285.3 213,285.0 227,284.8 241,284.6 254,284.4 268,284.2 282,284.0 296,283.8 310,283.6 324,283.4 338,283.3 352,283.1 366,283.0 379,282.8 393,282.7 407,282.6 421,282.4 435,282.3 449,282.2 463,282.1 477,282.0 491,281.9 504,281.8 518,281.7 532,281.6 546,281.5 560,281.4" fill="none" stroke="#12b886" stroke-width="2.5"/>
  <text x="566" y="274" font-size="12" fill="#12b886" font-weight="700">O(log n)</text>
  <polyline points="60,287.4 74,286.8 88,286.1 102,285.4 116,284.8 129,284.1 143,283.5 157,282.9 171,282.2 185,281.6 199,280.9 213,280.2 227,279.6 241,278.9 254,278.3 268,277.6 282,277.0 296,276.4 310,275.7 324,275.1 338,274.4 352,273.8 366,273.1 379,272.4 393,271.8 407,271.1 421,270.5 435,269.9 449,269.2 463,268.6 477,267.9 491,267.2 504,266.6 518,265.9 532,265.3 546,264.6 560,264.0" fill="none" stroke="#4f74ff" stroke-width="2.5"/>
  <text x="566" y="260" font-size="12" fill="#4f74ff" font-weight="700">O(n)</text>
  <polyline points="60,290.0 74,289.0 88,287.7 102,286.3 116,284.8 129,283.2 143,281.4 157,279.6 171,277.6 185,275.6 199,273.6 213,271.4 227,269.2 241,266.9 254,264.6 268,262.2 282,259.8 296,257.3 310,254.8 324,252.3 338,249.7 352,247.0 366,244.4 379,241.7 393,238.9 407,236.1 421,233.3 435,230.5 449,227.6 463,224.7 477,221.8 491,218.8 504,215.8 518,212.8 532,209.8 546,206.7 560,203.6" fill="none" stroke="#f59f00" stroke-width="2.5"/>
  <text x="566" y="204" font-size="12" fill="#f59f00" font-weight="700">O(n log n)</text>
  <polyline points="60,287.4 74,285.9 88,284.1 102,282.0 116,279.6 129,276.8 143,273.8 157,270.3 171,266.6 185,262.5 199,258.1 213,253.4 227,248.4 241,243.0 254,237.3 268,231.3 282,225.0 296,218.3 310,211.4 324,204.0 338,196.4 352,188.4 366,180.2 379,171.5 393,162.6 407,153.3 421,143.8 435,133.8 449,123.6 463,113.0 477,102.2 491,90.9 504,79.4 518,67.5 532,55.3 546,42.8 560,30.0" fill="none" stroke="#e8590c" stroke-width="2.5"/>
  <text x="566" y="34" font-size="12" fill="#e8590c" font-weight="700">O(n²)</text>
  <polyline points="60,284.8 74,283.8 88,282.6 102,281.3 116,279.6 129,277.6 143,275.3 157,272.5 171,269.2 185,265.3 199,260.6 213,255.0 227,248.4 241,240.5 254,231.2 268,220.0 282,206.8 296,191.1 310,172.3 324,150.1 338,123.6 352,92.1 366,54.7 374,30.0" fill="none" stroke="#e03131" stroke-width="2.5"/>
  <text x="378" y="26" font-size="12" fill="#e03131" font-weight="700">O(2ⁿ)</text>
  <polyline points="60,287.4 74,287.1 88,286.5 102,285.8 116,284.8 129,283.4 143,281.4 157,278.5 171,274.4 185,268.5 199,259.8 213,246.9 227,227.6 241,198.4 254,153.9 268,85.2 276,30.0" fill="none" stroke="#ae3ec9" stroke-width="2.5"/>
  <text x="280" y="26" font-size="12" fill="#ae3ec9" font-weight="700">O(n!)</text>
</svg>
:::

Play with bigger n here; switch on the log scale to see the gaps between the classes:

{{tool:big-o-chart}}

### The grains of rice (why exponential is hopeless)

Your slides tell the story of a warlord paid in rice: 1 grain on the first square of a chessboard, 2 on the second, 4 on the third, doubling each time. Square k holds 2ᵏ⁻¹ grains.

| Row of the board | Squares | Grains on that row |
|---|---|---|
| 1 | 1–8 | 2⁸ − 1 = **255** |
| 2 | 9–16 | 2¹⁶ − 2⁸ = **65 280** |
| 3 | 17–24 | 2²⁴ − 2¹⁶ = **16 711 680** |
| whole board | 1–64 | 2⁶⁴ − 1 ≈ **1.8 × 10¹⁹** |

:::note
The slide's figure of 963 040 grains for row 3 is wrong; the correct total is **16 711 680**. Rows 1 and 2 on the slide are correct.
:::

## Deriving the time complexity of code

Count how many times the **most frequent** operation runs, as a function of n, then take the Big-O.

| Code shape | Cost |
|---|---|
| statements in **sequence** | **add** them, keep the biggest: O(n) then O(n²) → O(n²) |
| a loop running **n** times | n × (cost of body) |
| a loop running a **fixed** number of times (e.g. 10) | 10 × body = O(body), no n factor |
| **nested** loops, each over n | n × n → O(n²) |
| a loop whose variable **halves/doubles** each time | about log₂ n iterations → O(log n) |
| **recursion** | count the calls: one call per level (n levels) → O(n); two calls per level → O(2ⁿ); halving per call → O(log n) |

:::example Deriving complexity line by line
```pseudocode
total ← 0                          # 1 operation
FOR i ← 1 TO n                     # outer loop: n times
  FOR j ← 1 TO n                   # inner loop: n times per outer pass
    total ← total + i * j          # runs n × n = n² times
  ENDFOR
ENDFOR
OUTPUT total                       # 1 operation
```
1. The assignment and the OUTPUT run once each: **2** operations.
2. The inner body runs **n** times for each of the **n** outer passes: **n²** times.
3. T(n) = n² + 2. The dominant term is n², so the algorithm is **O(n²)**.
:::

:::example A triangle-shaped nested loop is still O(n²)
```pseudocode
count ← 0
FOR i ← 1 TO n
  FOR j ← i TO n
    count ← count + 1
  ENDFOR
ENDFOR
```
The inner loop runs n times, then n − 1, …, then 1. Total = n + (n−1) + … + 1 = **n(n + 1)/2** = ½n² + ½n. Drop the ½ and the lower term: **O(n²)**. For n = 4: 4 + 3 + 2 + 1 = 10 = 4 × 5 / 2. ✓
:::

{{trace:4.6-1}}

:::example A halving loop is O(log n)
```pseudocode
steps ← 0
WHILE n > 1
  n ← n DIV 2
  steps ← steps + 1
ENDWHILE
```
For n = 16: 16 → 8 → 4 → 2 → 1, so **4** iterations = log₂ 16. Doubling n to 32 adds only **one** more iteration. This is why binary search, which halves the part of the list still to be searched, is **O(log n)**.
:::

{{trace:4.6-2}}

:::trap Marks are lost here
- "Nested loops ⇒ O(n²)" only if **both** loops depend on n. `FOR i ← 1 TO n` containing `FOR j ← 1 TO 10` is 10n → **O(n)**.
- Your slides say a recursive algorithm "could have O(aⁿ)". Recursion is **not** automatically exponential: recursive factorial makes n calls → O(n); recursive binary search → O(log n). It is exponential only when each call makes **two or more** calls on a problem that shrinks by a constant, like naive Fibonacci.
- Don't keep constants or lower terms: write O(n²), not O(3n² + 2n).
- The textbook answer says the least efficient class is O(2ⁿ). **O(n!) is worse** than O(2ⁿ).
- Big-O compares **growth**, not actual speed. For small n an O(n²) algorithm can beat an O(n log n) one.
:::

### Seeing it in code

::::tabs
:::tab Python
```python Counting operations as n grows
def halving_steps(n):            # O(log n)
    steps = 0
    while n > 1:
        n = n // 2
        steps += 1
    return steps

def bubble_comparisons(n):       # O(n^2): n(n-1)/2 comparisons
    count = 0
    for i in range(n - 1):
        for j in range(n - 1 - i):
            count += 1
    return count

def fib_calls(n):                # naive recursive Fibonacci: O(2^n) calls
    if n < 2:
        return 1
    return 1 + fib_calls(n - 1) + fib_calls(n - 2)

for n in [10, 20, 40]:
    print(n, halving_steps(n), bubble_comparisons(n))
for n in [10, 20, 25]:
    print("fib calls", n, fib_calls(n))
```
```output
10 3 45
20 4 190
40 5 780
fib calls 10 177
fib calls 20 21891
fib calls 25 242785
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE linearSearch(items, target)      # O(n)
  FOR i ← 0 TO LEN(items) - 1
    IF items[i] = target THEN
      RETURN i
    ENDIF
  ENDFOR
  RETURN -1
ENDSUBROUTINE

SUBROUTINE isOdd(n)                         # O(1)
  RETURN n MOD 2 = 1
ENDSUBROUTINE
```
:::
::::

Doubling n from 20 to 40 adds **one** halving step but multiplies the bubble-sort comparisons by about **4**. Adding just 5 to n multiplies the Fibonacci calls by about **11**.

### Standard algorithms to know

| Algorithm | Best | Worst (quote this) | Why |
|---|---|---|---|
| Linear search | O(1) | **O(n)** | may check every item |
| Binary search | O(1) | **O(log n)** | halves the search space each comparison |
| Binary search tree search | O(1) | O(log n) if balanced, **O(n)** if it degenerates into a line | depth of the tree |
| Bubble sort | O(n) with a swap flag | **O(n²)** | up to n − 1 passes of up to n − 1 comparisons |
| Insertion sort | O(n) | **O(n²)** | each item may shift past all earlier ones |
| Merge sort | O(n log n) | **O(n log n)** | log n levels of splitting, n work to merge each level |
| Tree traversal / BFS / DFS | — | **O(n)** (nodes + edges) | each visited once |

Try them in [3.4](#/topic/3.4) and [3.5](#/topic/3.5) and watch the comparison counters:

{{tool:sorting-visualiser}}

:::exam
- **"State the time complexity of …"** (1 mark): give the Big-O of the **worst case** unless told otherwise, e.g. "O(n²)".
- **"Derive / explain the time complexity"** (2–3 marks): say **how many times** the key operation runs and **why** ("the outer loop runs n times and for each pass the inner loop runs n times, so the comparison is made n² times → O(n²)").
- **"Order these by efficiency"**: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), O(n!).
- **"Why is binary search more efficient than linear search?"**: it halves the data still to be searched with each comparison, O(log n) instead of O(n); but it needs the data to be **sorted**.
- **Domain / co-domain questions**: the domain is the set of inputs; the co-domain is the set outputs are drawn from. f: ℕ → ℕ means both are the natural numbers.
- **Permutations**: n distinct items → n!; show the multiplication (5 × 4 × 3 × 2 × 1 = 120).
:::

:::challenge
1. Find T(n) and the Big-O for a loop `FOR i ← 1 TO n` containing two separate (not nested) loops, each `FOR j ← 1 TO n`.
2. What is the complexity of `i ← 1; WHILE i < n: i ← i * 3`? Does the base of the logarithm matter?
3. An algorithm takes 2 seconds for n = 1000. Estimate the time for n = 2000 if it is O(n), O(n²) and O(2ⁿ). Why is the last one a silly question?
4. How many different 4-letter arrangements can be made from the letters of WORD? From LOOK (careful: the letters are not all distinct)?
:::

:::recap
- Complexity = how **time or space** grows with problem size **n**; it measures the algorithm, not the machine.
- Big-O: keep the **dominant term**, drop constants; quote the **worst case**.
- **O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)**.
- Loops multiply, sequences add (keep the max), halving gives log n, recursion: count the calls.
- A **function** maps each **domain** element to one **co-domain** element; the range is the subset actually produced.
- Linear, polynomial, exponential and logarithmic functions grow at very different rates; exponentials double, logarithms creep.
- n distinct objects have **n!** permutations.
:::

:::related
- [4.7 Limits of computation and the halting problem](#/topic/4.7)
- [3.4 Searching algorithms](#/topic/3.4)
- [3.5 Sorting algorithms](#/topic/3.5)
- [4.3 Sets and the maths for regular expressions](#/topic/4.3)
:::

*/});
