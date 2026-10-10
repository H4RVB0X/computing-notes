CS.registerTopic({ id: "1.3", title: "Arithmetic, relational and Boolean operators" }, function () {/*

:::objectives
- Use the arithmetic operations: **addition, subtraction, multiplication, real division, integer division (DIV), remainder (MOD), exponentiation, rounding and truncation**.
- Apply **operator precedence** correctly and use brackets to make intent clear.
- Use the six **relational operators** and know how they behave on numbers, characters and strings.
- Use the Boolean operators **NOT, AND, OR, XOR**, write their truth tables and combine them into conditions.
- Solve typical exam problems with DIV and MOD (time conversion, digit extraction, even/odd tests).
:::

:::quick At a glance
- **Real division** `/` always gives a real: `7 / 2 = 3.5`. **Integer division** `DIV` discards the remainder: `7 DIV 2 = 3`. **MOD** gives the remainder: `7 MOD 2 = 1`.
- Python: `//` is DIV, `%` is MOD, `**` is exponentiation. VB.NET: `\`, `Mod`, `^`.
- **Rounding** goes to the **nearest** value (3.7 → 4); **truncation** **chops off** the fractional part (3.7 → 3).
- Precedence: **brackets → exponent → × / DIV MOD → + −**, left to right within a level.
- Relational: `=  ≠  <  >  ≤  ≥` (Python `== != < > <= >=`). Every comparison evaluates to **True or False**.
- Boolean: **NOT** inverts; **AND** True only if both True; **OR** True if at least one True; **XOR** True if **exactly one** is True.
- Boolean precedence: **NOT, then AND, then OR**. Use brackets anyway.
:::

:::keyterms
Operator :: A symbol or keyword that performs an operation on one or more operands, e.g. +, MOD, AND. :: The action in an expression.
Operand :: A value or variable that an operator acts on. :: The things being worked on.
Real division :: Division that returns a real (floating-point) result including any fractional part. :: 7 / 2 = 3.5.
Integer division (DIV) :: Division that returns only the whole-number part of the quotient, discarding the remainder. :: How many whole times it goes in: 17 DIV 5 = 3.
Modulo (MOD) :: An operation that returns the remainder after integer division. :: What is left over: 17 MOD 5 = 2.
Exponentiation :: Raising a number to a power, i.e. repeated multiplication. :: 2 to the power 5 = 32.
Rounding :: Replacing a number with the nearest value to a given number of decimal places or significant figures. :: 3.67 → 3.7.
Truncation :: Removing digits beyond a certain position without rounding, i.e. cutting off the fractional part. :: 3.67 → 3.6 (1 d.p.) or 3.
Relational operator :: An operator that compares two values and returns a Boolean result: =, ≠, <, >, ≤, ≥. :: A comparison.
Boolean operator :: An operator (NOT, AND, OR, XOR) that combines or inverts Boolean values to produce a Boolean result. :: Logic glue for conditions.
XOR :: Exclusive OR: True when exactly one of its two operands is True. :: One or the other but not both.
Operator precedence :: The rules that decide the order in which operators in an expression are evaluated. :: BIDMAS for programs.
:::

## Arithmetic operators

| Operation | AQA pseudocode | Python | VB.NET | Example | Result |
|---|---|---|---|---|---|
| Addition | `+` | `+` | `+` | `7 + 2` | 9 |
| Subtraction | `-` | `-` | `-` | `7 - 2` | 5 |
| Multiplication | `*` | `*` | `*` | `7 * 2` | 14 |
| Real division | `/` | `/` | `/` | `7 / 2` | 3.5 |
| Integer division | `DIV` | `//` | `\` | `17 DIV 5` | 3 |
| Remainder | `MOD` | `%` | `Mod` | `17 MOD 5` | 2 |
| Exponentiation | `^` | `**` | `^` | `2 ^ 10` | 1024 |

```python Python arithmetic
print(7 / 2)      # 3.5   real division always gives a float
print(8 / 2)      # 4.0   ...even when it divides exactly
print(17 // 5)    # 3     integer division
print(17 % 5)     # 2     remainder
print(2 ** 10)    # 1024  exponentiation
```

:::trap
- **`/` gives a real even when the answer is whole.** `8 / 2` is `4.0`, not `4`. If you then use it as an array index in Python you get a `TypeError`. Use `DIV` / `//` when you need an integer.
- In Python `^` is **XOR**, not power. `2 ^ 3` is `1`. Use `**` for powers.
- `DIV` and `MOD` are a pair: for positive numbers, `a = (a DIV b) * b + (a MOD b)`. Check your answer with this.
:::

### DIV and MOD: the exam favourites

DIV and MOD turn up in almost every Paper 1. Learn these patterns.

| Task | Expression | Example |
|---|---|---|
| Is n even? | `n MOD 2 = 0` | 14 MOD 2 = 0 → even |
| Is n a multiple of k? | `n MOD k = 0` | 45 MOD 9 = 0 → yes |
| Last digit of n | `n MOD 10` | 4072 MOD 10 = 2 |
| Remove last digit | `n DIV 10` | 4072 DIV 10 = 407 |
| Minutes → hours and minutes | `m DIV 60`, `m MOD 60` | 135 → 2 h 15 min |
| Wrap an index round a circular array | `(i + 1) MOD size` | (7 + 1) MOD 8 = 0 |
| Seconds → h:m:s | `s DIV 3600`, `(s MOD 3600) DIV 60`, `s MOD 60` | 3725 → 1:02:05 |

:::example Convert 3725 seconds to hours, minutes and seconds
1. Hours: `3725 DIV 3600` = **1** (3600 goes into 3725 once).
2. Seconds left after the hours: `3725 MOD 3600` = 125.
3. Minutes: `125 DIV 60` = **2**.
4. Seconds: `125 MOD 60` = **5** (or directly `3725 MOD 60` = 5, because 3725 = 62 × 60 + 5).
5. Answer: **1:02:05**. Check: 1 × 3600 + 2 × 60 + 5 = 3725 ✓

```python
s = 3725
h = s // 3600
m = (s % 3600) // 60
sec = s % 60
print(f"{h}:{m:02d}:{sec:02d}")   # 1:02:05
```
:::

:::collapse Negative numbers: languages disagree (A* detail)
For negative operands, Python's `//` **floors** (rounds down) while VB.NET's `\` and C's `/` on integers **truncate towards zero**. MOD follows suit.

| Expression | Python | VB.NET |
|---|---|---|
| −7 DIV 2 | `-7 // 2` → **−4** | `-7 \ 2` → **−3** |
| −7 MOD 2 | `-7 % 2` → **1** | `-7 Mod 2` → **−1** |

AQA exam questions almost always use non-negative values, but if one doesn't, state which convention you are using.
:::

### Rounding and truncation

- **Rounding** replaces a number by the **nearest** value at the required precision. 12.345 rounded to 1 d.p. is 12.3; 3.7 rounded to an integer is 4.
- **Truncation** simply **discards** the digits beyond a position. 12.345 truncated to 1 d.p. is 12.3; 3.7 truncated to an integer is **3**; −3.7 truncated is **−3**.

<svg class="diagram" viewBox="0 0 640 170" role="img" aria-label="Number line from minus 5 to plus 5 showing that truncating 3.7 gives 3, rounding gives 4, and truncating minus 3.7 gives minus 3 while floor gives minus 4">
  <defs><marker id="arr13" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <line x1="20" y1="90" x2="620" y2="90"/>
    <g font-size="12" stroke="none" text-anchor="middle">
      <text x="70" y="110">−5</text><text x="130" y="110">−4</text><text x="190" y="110">−3</text><text x="250" y="110">−2</text><text x="310" y="110">−1</text><text x="320" y="110"></text>
      <text x="370" y="110">0</text><text x="430" y="110">1</text><text x="490" y="110">2</text><text x="550" y="110">3</text><text x="610" y="110">4</text>
    </g>
    <g><line x1="70" y1="85" x2="70" y2="95"/><line x1="130" y1="85" x2="130" y2="95"/><line x1="190" y1="85" x2="190" y2="95"/><line x1="250" y1="85" x2="250" y2="95"/><line x1="310" y1="85" x2="310" y2="95"/><line x1="370" y1="85" x2="370" y2="95"/><line x1="430" y1="85" x2="430" y2="95"/><line x1="490" y1="85" x2="490" y2="95"/><line x1="550" y1="85" x2="550" y2="95"/><line x1="610" y1="85" x2="610" y2="95"/></g>
    <circle cx="592" cy="90" r="5" fill="#f0b429" fill-opacity="0.8"/><text x="592" y="75" text-anchor="middle" stroke="none">3.7</text>
    <path d="M588,60 Q570,40 554,60" fill="none" marker-end="url(#arr13)"/><text x="560" y="34" text-anchor="middle" stroke="none" font-size="12">truncate → 3</text>
    <path d="M598,60 Q606,48 610,62" fill="none" marker-end="url(#arr13)"/><text x="615" y="20" text-anchor="end" stroke="none" font-size="12">round → 4</text>
    <circle cx="148" cy="90" r="5" fill="#7c9aff" fill-opacity="0.8"/><text x="148" y="75" text-anchor="middle" stroke="none">−3.7</text>
    <path d="M152,125 Q170,145 188,128" fill="none" marker-end="url(#arr13)"/><text x="215" y="160" text-anchor="middle" stroke="none" font-size="12">truncate → −3 (towards 0)</text>
    <path d="M144,125 Q138,140 132,128" fill="none" marker-end="url(#arr13)"/><text x="60" y="160" text-anchor="middle" stroke="none" font-size="12">round / floor → −4</text>
  </g>
</svg>

```python Rounding and truncation in Python
import math
print(round(3.7))          # 4
print(round(12.345, 1))    # 12.3
print(math.trunc(3.7))     # 3
print(int(-3.7))           # -3   int() truncates towards zero
print(math.floor(-3.7))    # -4   floor rounds DOWN
print(round(2.5), round(3.5))   # 2 4   <- banker's rounding!
```

:::trap
- **Python's `round()` (and VB's `Math.Round`) use "round half to even"** (banker's rounding): `round(2.5)` is **2**, `round(3.5)` is 4. In an exam answer, use normal "round half up" unless the question is about a specific language, but know why your program may disagree.
- Truncation is **not** the same as rounding down for negative numbers: truncate(−3.7) = −3, floor(−3.7) = −4.
- "Truncate 5.76747 to 2 d.p." is **5.76**, not 5.77. Rounding would give 5.77.
:::

### Precedence

Without brackets, operators are applied in this order (highest first), left to right within the same level:

1. Brackets
2. Exponentiation
3. Multiplication, real division, DIV, MOD
4. Addition, subtraction

:::example Evaluate `10 - 2 + 2 * 3 ^ 2`
1. Exponent first: `3 ^ 2 = 9` → `10 - 2 + 2 * 9`
2. Multiplication: `2 * 9 = 18` → `10 - 2 + 18`
3. Left to right for + and −: `10 - 2 = 8`, then `8 + 18 = 26`.

Answer **26**. If in doubt in your own code, **add brackets**: they cost nothing and make intent obvious.
:::

## Relational operators

A relational operator compares two values and produces a **Boolean**.

| Meaning | AQA pseudocode | Python | VB.NET | True example | False example |
|---|---|---|---|---|---|
| equal to | `=` | `==` | `=` | `4 = 4` | `4 = 5` |
| not equal to | `≠` | `!=` | `<>` | `4 ≠ 5` | `4 ≠ 4` |
| less than | `<` | `<` | `<` | `3 < 8` | `8 < 3` |
| greater than | `>` | `>` | `>` | `0.5 > 0.2` | `−3 > 2` |
| less than or equal to | `≤` | `<=` | `<=` | `4 ≤ 4` | `5 ≤ 4` |
| greater than or equal to | `≥` | `>=` | `>=` | `2 ≥ −2` | `39 ≥ 40` |

### Comparing strings and characters

Characters are compared by their **character codes**. Strings are compared **character by character from the left** (lexicographically) until two characters differ.

- `"apple" < "banana"` is True because 'a' (97) < 'b' (98).
- `"Zebra" < "apple"` is **True** because 'Z' (90) < 'a' (97): **all upper-case letters come before lower-case** in ASCII.
- `"apple" < "apples"` is True: a prefix is smaller.
- `"10" < "9"` is **True** as strings ('1' < '9'), even though 10 > 9 as numbers.

```python
print("Zebra" < "apple")   # True  (uppercase codes are smaller)
print("10" < "9")          # True  (string comparison!)
print(10 < 9)              # False (numeric comparison)
```

:::trap
- **Boundary errors** are the commonest relational mistake. "Ages 18 and over" is `age >= 18`, not `age > 18`. Test the boundary value (18) in your head every time.
- Never test a real for exact equality after arithmetic: `0.1 + 0.2 = 0.3` is **False** in most languages. Compare with a tolerance: `ABS(a - b) < 0.000001`.
- In Python `=` assigns and `==` compares. In AQA pseudocode `←` assigns and `=` compares.
:::

## Boolean operators

Boolean operators combine conditions. Learn these truth tables cold.

| A | B | NOT A | A AND B | A OR B | A XOR B |
|---|---|---|---|---|---|
| False | False | True | False | False | False |
| False | True | True | False | True | True |
| True | False | False | False | True | True |
| True | True | False | True | True | **False** |

- **NOT**: inverts.
- **AND**: True only when **both** are True.
- **OR**: True when **at least one** is True (including both).
- **XOR** (exclusive OR): True when **exactly one** is True; False when they are the same.

::::tabs
:::tab AQA pseudocode
```pseudocode
age ← 16
hasTicket ← True
IF age >= 12 AND hasTicket THEN
    OUTPUT "Enter"
ENDIF

IF NOT (day = "Sat" OR day = "Sun") THEN
    OUTPUT "Weekday"
ENDIF

IF teaChosen XOR coffeeChosen THEN
    OUTPUT "Order accepted"
ENDIF
```
:::
:::tab Python
```python
age = 16
has_ticket = True
if age >= 12 and has_ticket:
    print("Enter")

day = "Tue"
if not (day == "Sat" or day == "Sun"):
    print("Weekday")

tea_chosen, coffee_chosen = False, True
if tea_chosen != coffee_chosen:      # XOR for Booleans (or use ^)
    print("Order accepted")
```
```output
Enter
Weekday
Order accepted
```
:::
::::

### Precedence and brackets

Without brackets: **NOT** first, then **AND**, then **OR**. So `A OR B AND C` means `A OR (B AND C)`.

:::example Evaluate with `score = 55`, `name = "Ali"`, `over = False`
Expression: `NOT over AND score > 60 OR name = "Ali"`

1. Relational parts: `score > 60` → False; `name = "Ali"` → True.
2. NOT first: `NOT over` → True. Expression: `True AND False OR True`.
3. AND next: `True AND False` → False. Expression: `False OR True`.
4. OR last: **True**.

With brackets `NOT over AND (score > 60 OR name = "Ali")` the result is `True AND True` = True, the same here, but the two versions differ when `over` is True and name is "Ali". Brackets make the meaning certain.
:::

:::collapse De Morgan's laws for conditions
Useful when you need to turn a WHILE condition into an UNTIL condition:

- `NOT (A AND B)` = `NOT A OR NOT B`
- `NOT (A OR B)` = `NOT A AND NOT B`

So `WHILE NOT (guess = target OR tries = 10)` is the same as `WHILE guess ≠ target AND tries ≠ 10`, and the matching REPEAT version is `UNTIL guess = target OR tries = 10`. Full Boolean algebra is in [6.5](#/topic/6.5).
:::

:::example Leap year: combining operators
A year is a leap year if it is divisible by 4 **and** not divisible by 100, **or** it is divisible by 400.

```python
def is_leap(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0

for y in [2024, 1900, 2000, 2023]:
    print(y, is_leap(y))
```
```output
2024 True
1900 False
2000 True
2023 False
```
| year | MOD 4 = 0 | MOD 100 ≠ 0 | AND | MOD 400 = 0 | OR |
|---|---|---|---|---|---|
| 2024 | T | T | T | F | **T** |
| 1900 | T | F | F | F | **F** |
| 2000 | T | F | F | T | **T** |
| 2023 | F | T | F | F | **F** |
:::

{{trace:1.3-1}}

{{tool:bitwise-ops}}

:::note Logical vs bitwise
The tool above applies AND/OR/XOR/NOT to **each bit** of a binary number (bitwise). In conditions you apply them to whole True/False values (logical). Python's `and`/`or`/`not` are logical; `&`, `|`, `^`, `~` are bitwise.
:::

:::exam
- **Calculation questions** ("What is 47 DIV 6? 47 MOD 6?"): show the working `6 × 7 = 42, remainder 5`; answers **7** and **5**.
- **"Explain the difference between rounding and truncation"**: rounding gives the **nearest** value; truncation **removes** digits beyond a point without considering them. Give an example where they differ (3.7 → 4 vs 3).
- **"Explain the difference between OR and XOR"**: both True if exactly one input is True; **OR is also True when both are True, XOR is False**.
- When writing conditions in an algorithm, use **brackets** around each relational part and around mixed AND/OR groups. Examiners won't deduct for extra brackets, but they will for wrong logic.
- **Boundaries**: if the question says "between 1 and 10 inclusive", write `n >= 1 AND n <= 10`.
:::

:::challenge
1. Write a function that takes a number of pence and returns the minimum number of £2, £1, 50p, 20p, 10p, 5p, 2p and 1p coins using only DIV and MOD.
2. Explain why `n MOD 2 = 1` fails to detect odd negative numbers in VB.NET (where `-7 Mod 2` is −1) although it works in Python, whereas `n MOD 2 ≠ 0` works in every language.
3. Using only NOT, AND and OR, write an expression equivalent to `A XOR B`. Prove it with a truth table.
4. Find a pair of strings where Python's `<` gives a different answer from alphabetical order in a dictionary. Explain why.
:::

:::recap
- `/` real division (always real); `DIV` whole part; `MOD` remainder. Python `//`, `%`, `**`.
- Rounding → nearest; truncation → chop off. Python `round` uses round-half-to-even.
- Precedence: brackets, exponent, × / DIV MOD, + −; left to right within a level.
- Relational operators return Booleans; strings compare character-by-character by code ("Z" < "a").
- NOT, AND, OR, XOR truth tables; XOR = exactly one True. Boolean precedence NOT → AND → OR.
- DIV/MOD patterns: even test, digit extraction, time conversion, circular wrap-around.
:::

:::related
- [1.2 Sequence, selection and iteration](#/topic/1.2) — conditions in action
- [1.4 Strings, random numbers and exception handling](#/topic/1.4)
- [5.4 Binary arithmetic](#/topic/5.4)
- [6.5 Boolean algebra](#/topic/6.5)
:::

*/});
