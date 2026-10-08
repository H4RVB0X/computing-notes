CS.registerTopic({ id: "5.4", title: "Binary integers and two's complement" }, function () {/*

:::objectives
- Explain the difference between **unsigned** and **signed** binary, and state the unsigned range **0 to 2ⁿ − 1**.
- **Add** two unsigned binary integers, showing the carries, and recognise **overflow**.
- **Multiply** two unsigned binary integers by long multiplication (shifted partial products).
- Represent positive and negative integers in **two's complement**, using both **invert-and-add-1** and the **copy-up-to-the-first-1** shortcut, and convert back to denary.
- **Subtract** by adding the two's complement of the second number, and detect two's complement overflow.
- Calculate the two's complement **range −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1** for any number of bits.
:::

:::quick At a glance
- **Unsigned** binary: only zero and positive values. n bits → **0 to 2ⁿ − 1** (8 bits: 0–255).
- Addition rules: 0+0=0, 0+1=1, 1+1=**0 carry 1**, 1+1+1=**1 carry 1**. Work right to left.
- **Overflow**: the result needs more bits than are available, so the stored answer is wrong.
- Multiplication: one **partial product** per multiplier bit (the multiplicand, shifted left, or zero), then add them.
- **Two's complement**: the MSB has a **negative** place value (−128 in 8 bits). MSB 1 → negative.
- To negate: **invert every bit, then add 1**, or **copy bits from the right up to and including the first 1, then invert the rest**.
- **a − b = a + (−b)**: subtraction is addition of the two's complement; discard any carry out of the MSB.
- Two's complement range: **−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1** (8 bits: −128 to 127).
- Two's complement overflow: **two positives give a negative, or two negatives give a positive**.
:::

:::keyterms
Unsigned binary :: A binary representation that can only represent zero and positive integers; with n bits the range is 0 to 2ⁿ − 1. :: Every bit adds a positive amount.
Signed binary :: A binary representation that can represent both positive and negative integers. :: Has a way to show a minus sign.
Two's complement :: A signed representation in which the most significant bit has a negative place value (−2ⁿ⁻¹) and all other bits are positive. :: The left bit is worth "minus a lot".
Overflow :: When the result of a calculation is too large (or too negative) to be represented in the number of bits available. :: The answer doesn't fit, so what is stored is wrong.
Carry :: A 1 passed into the next (more significant) column when a column's total is 2 or more. :: Same as carrying in denary addition.
Partial product :: In long multiplication, the multiplicand shifted left by the position of a 1 in the multiplier (or zero for a 0 bit). :: One line of the long multiplication.
Most significant bit (MSB) :: The leftmost bit; in two's complement it indicates the sign and has a negative weight. :: The sign bit in two's complement.
Sign extension :: Copying the MSB into new bits on the left when a two's complement number is widened, which keeps its value. :: Pad negatives with 1s and positives with 0s.
:::

## Unsigned and signed binary

So far every bit has had a **positive** place value. That is **unsigned binary**: it can only represent zero and positive integers.

- With n bits, the smallest value is all 0s = **0**.
- The largest is all 1s = 1 + 2 + 4 + … + 2ⁿ⁻¹ = **2ⁿ − 1**.

| Bits | Unsigned range |
|---|---|
| 4 | 0 to 15 |
| 8 | 0 to 255 |
| 16 | 0 to 65 535 |

**Signed binary** must also represent negative numbers. AQA requires **two's complement**, which is what almost every processor uses.

{{spec:4.5.4.1}} *"in unsigned binary the minimum value is 0 and the maximum value for a given number of bits, n, is 2ⁿ − 1"*

## Adding unsigned binary

Line the numbers up and add each column **from right to left**, carrying exactly as in denary.

| Column total | Write | Carry |
|---|---|---|
| 0 + 0 | 0 | 0 |
| 0 + 1 | 1 | 0 |
| 1 + 1 (= 2) | 0 | 1 |
| 1 + 1 + 1 (= 3) | 1 | 1 |

:::example 01010101 + 01100011 (85 + 99)
| | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| A | 0 | 1 | 0 | 1 | 0 | 1 | 0 | 1 |
| B | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 1 |
| carry in | 1 | | | | 1 | 1 | 1 | |
| **sum** | **1** | **0** | **1** | **1** | **1** | **0** | **0** | **0** |

Column by column from the right:
1. 1s: 1 + 1 = 0 carry 1
2. 2s: 0 + 1 + 1 (carry) = 0 carry 1
3. 4s: 1 + 0 + 1 = 0 carry 1
4. 8s: 0 + 0 + 1 = 1
5. 16s: 1 + 0 = 1
6. 32s: 0 + 1 = 1
7. 64s: 1 + 1 = 0 carry 1
8. 128s: 0 + 0 + 1 = 1

Result **10111000₂ = 184**. Check: 85 + 99 = 184 ✓. No carry out of the 128s column, so no overflow.
:::

### Overflow in unsigned addition

If the leftmost column produces a carry, the true answer needs **one more bit** than is available.

:::example 11100110 + 11111011 (230 + 251) in 8 bits
| | carry out | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|---|
| A | | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |
| B | | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 |
| sum | **1** | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 |

The true answer is 111100001₂ = **481**, which needs 9 bits. Only 8 can be stored: 11100001₂ = **225**. That is an **overflow error**: the stored result is wrong.
:::

{{tool:binary-adder}}

## Multiplying unsigned binary

Binary long multiplication is easier than denary, because each digit of the multiplier is 0 or 1:

- multiplier bit **1** → the partial product is the **multiplicand**, shifted left to line up with that bit;
- multiplier bit **0** → the partial product is **zero**.

Then add the partial products.

:::example 1101 × 0101 (13 × 5)
Work through the multiplier 0101 from the right:

| Multiplier bit | Place | Partial product |
|---|---|---|
| 1 | ×1 | `      1101` (13) |
| 0 | ×2 | `     0000 ` (0) |
| 1 | ×4 | `    1101  ` (52) |
| 0 | ×8 | `   0000   ` (0) |

Add the non-zero partial products with carries:

```text
     0001101      (13)
   + 0110100      (52)
     -------
     1000001      (65)
carries go into the 8s, 16s, 32s and 64s columns
```

Columns from the right: 1+0=1; 0+0=0; 1+1=0 c1; 1+0+1=0 c1; 0+1+1=0 c1; 0+1+1=0 c1; 0+0+1=1.

**1101 × 0101 = 1000001₂ = 65.** Check: 13 × 5 = 65 ✓
:::

:::example 1110 × 0111 (14 × 7): three partial products
Partial products: 1110 (×1), 11100 (×2), 111000 (×4).

Add **two at a time** to avoid columns with four 1s:

```text
   0001110   (14)
 + 0011100   (28)
 = 0101010   (42)
 + 0111000   (56)
 = 1100010   (98)
```

**Result 1100010₂ = 98.** Check: 14 × 7 = 98 ✓
:::

:::tip Columns with lots of 1s
If you add all the partial products at once, a column can total 4 (= 100₂): write 0 and carry **1 two columns to the left**. Adding two rows at a time avoids this and is much safer under exam pressure.
:::

:::note Multiplying two n-bit numbers
The product of two n-bit numbers can need up to **2n bits**: 4 bits × 4 bits can need 8 bits (15 × 15 = 225). If the result must fit in n bits, overflow is very likely.
:::

{{trace:5.4-3}}

## Two's complement

### The idea: give the MSB a negative weight

In 8-bit two's complement the place values are:

| −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|

Everything else is normal binary. So:

- If the **MSB is 0**, the number is **positive** (or zero) and reads exactly like unsigned binary.
- If the **MSB is 1**, you start at −128 and add the rest, so the number is **negative**.

In n bits, the MSB is worth **−2ⁿ⁻¹**: −8 for 4 bits, −32 for 6 bits, −128 for 8 bits, −32 768 for 16 bits.

:::figure In 8 bits the patterns wrap round: after 127 comes −128
<svg class="diagram" viewBox="0 0 640 170" role="img" aria-label="Number line showing two's complement patterns from 10000000 = -128 to 01111111 = 127">
  <defs><marker id="arr54" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor">
    <line x1="30" y1="80" x2="610" y2="80" stroke="currentColor" marker-end="url(#arr54)"/>
    <rect x="30" y="60" width="290" height="40" fill="#e07a9b" fill-opacity="0.2"/>
    <rect x="320" y="60" width="280" height="40" fill="#5fc9a8" fill-opacity="0.2"/>
    <line x1="40" y1="70" x2="40" y2="90" stroke="currentColor"/><text x="40" y="118" text-anchor="middle">−128</text><text x="40" y="52" text-anchor="middle" font-family="monospace">10000000</text>
    <line x1="300" y1="70" x2="300" y2="90" stroke="currentColor"/><text x="300" y="118" text-anchor="middle">−1</text><text x="300" y="52" text-anchor="middle" font-family="monospace">11111111</text>
    <line x1="340" y1="70" x2="340" y2="90" stroke="currentColor"/><text x="340" y="118" text-anchor="middle">0</text><text x="355" y="36" text-anchor="middle" font-family="monospace">00000000</text>
    <line x1="590" y1="70" x2="590" y2="90" stroke="currentColor"/><text x="590" y="118" text-anchor="middle">127</text><text x="590" y="52" text-anchor="middle" font-family="monospace">01111111</text>
    <text x="170" y="150" text-anchor="middle">MSB = 1: negative (128 values)</text>
    <text x="465" y="150" text-anchor="middle">MSB = 0: zero and positive (128 values)</text>
  </g>
</svg>
:::

### Two's complement → denary

Add the place values, remembering the MSB is negative.

:::example Convert 10001101 (8-bit two's complement) to denary
| −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 0 | 0 | 0 | 1 | 1 | 0 | 1 |

−128 + 8 + 4 + 1 = **−115**
:::

:::example Convert 10110110 to denary, two ways
**Place values:** −128 + 32 + 16 + 4 + 2 = **−74**.

**Negate it back:** MSB is 1, so it is negative. Invert → 01001001, add 1 → 01001010 = 74. So the original is **−74** ✓
:::

:::tip All 1s is −1
11111111 = −128 + 127 = −1, whatever the width (1111 = −8 + 7 = −1). Handy for checking.
:::

{{trace:5.4-2}}

### Denary → two's complement

**Positive numbers:** exactly as unsigned, but make sure the MSB is **0** (e.g. +72 = **0**1001000).

**Negative numbers:** write the positive version in the full number of bits, then negate it with either method.

:::example −26 in 8 bits. Method 1: invert and add 1
| | −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| +26 | 0 | 0 | 0 | 1 | 1 | 0 | 1 | 0 |
| invert | 1 | 1 | 1 | 0 | 0 | 1 | 0 | 1 |
| add 1 | | | | | | | | 1 |
| **−26** | **1** | **1** | **1** | **0** | **0** | **1** | **1** | **0** |

Check: −128 + 64 + 32 + 4 + 2 = −26 ✓
:::

:::example −26 in 8 bits. Method 2: copy up to the first 1, then invert
Start at the **right** of +26 = 0001101**0**.

1. Copy bits up to **and including** the first 1: the rightmost bits are `10`, so copy `10`.
2. **Invert** every bit to the left of that: 000110 → 111001.

Result: 111001|10 = **11100110** ✓ (same as Method 1).
:::

:::example −48 with the shortcut
+48 = 00110000. The first 1 from the right is in the 16s column: copy `10000`. Invert the rest, 001 → 110.

**−48 = 11010000.** Check: −128 + 64 + 16 = −48 ✓
:::

:::example −122 using place values directly
−128 + ? = −122 → need +6 = 4 + 2. So bits: 1 (−128), then 0000 110 → **10000110**. Check: −128 + 4 + 2 = −122 ✓
:::

:::trap Use the full number of bits *before* negating
To find −5 in 8 bits, start from **00000101**, not 101. Inverting 101 gives 010 + 1 = 011, which is +3 in 3 bits. Always write the positive number at the required width first.
:::

:::trap Don't "invert and add 1" to read a positive number
If the MSB is 0 the number is positive and you read it normally. Only negate when the MSB is 1 (and then remember to put the minus sign back).
:::

{{tool:twos-complement}}

### Why two's complement is used

- There is **only one zero** (00000000). Sign-and-magnitude has +0 and −0.
- **The same adder circuit does addition and subtraction**, because a − b = a + (−b). No separate subtractor is needed.
- Comparing and incrementing work naturally: adding 1 to −1 (11111111) gives 0 (carry discarded).

:::collapse Not on the AQA spec: sign and magnitude, for contrast
In **sign and magnitude** the MSB is just a sign flag (0 = +, 1 = −) and the other bits hold the size: −30 = 1 0011110. Its range is −(2ⁿ⁻¹ − 1) to +(2ⁿ⁻¹ − 1), there are two zeros, and ordinary binary addition gives wrong answers for mixed signs. That is why processors use two's complement.
:::

## Range of two's complement

- Most negative: **1000…0** = −2ⁿ⁻¹ (only the negative MSB is set).
- Most positive: **0111…1** = 2ⁿ⁻¹ − 1 (everything except the MSB).

> **Range in n bits: −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1**

| Bits | Unsigned | Two's complement |
|---|---|---|
| 4 | 0 to 15 | −8 to 7 |
| 8 | 0 to 255 | −128 to 127 |
| 12 | 0 to 4095 | −2048 to 2047 |
| 16 | 0 to 65 535 | −32 768 to 32 767 |

Both representations have exactly **2ⁿ values**; two's complement just slides the range down. It is **lopsided** (one more negative than positive) because zero uses one of the "positive" patterns.

:::trap Watch the signs in the range
One class slide lists the "largest negative value" as 2ⁿ⁻¹. It is **−2ⁿ⁻¹**. And there is no +128 in 8 bits: 10000000 is −128.
:::

## Subtraction using two's complement

> **a − b = a + (−b)**

1. Write a and b in the same number of bits.
2. Find **−b** in two's complement.
3. **Add** a and −b using ordinary binary addition.
4. **Discard** any carry out of the MSB column.

:::example 20 − 13 in 8 bits
| | carry out | −128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|---|
| 20 | | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 0 |
| −13 | | 1 | 1 | 1 | 1 | 0 | 0 | 1 | 1 |
| sum | ~~1~~ | **0** | **0** | **0** | **0** | **0** | **1** | **1** | **1** |

−13: +13 = 00001101 → invert 11110010 → +1 = 11110011.
Adding gives 1 00000111; discard the carry → **00000111 = 7** ✓
:::

:::example 93 − 34 in 8 bits
- 93 = 01011101
- 34 = 00100010 → −34 = 11011110 (copy `10`, invert `001000` → `110111`)

```text
   01011101    (93)
 + 11011110    (−34)
 = 1 00111011  → discard carry → 00111011
```

00111011 = 32 + 16 + 8 + 2 + 1 = **59** ✓ (93 − 34 = 59)
:::

{{trace:5.4-1}}

:::example 13 − 20: a negative answer
- 13 = 00001101, −20 = 11101100

```text
   00001101    (13)
 + 11101100    (−20)
 = 11111001    (no carry out)
```

MSB is 1, so negative: −128 + 64 + 32 + 16 + 8 + 1 = **−7** ✓
:::

:::example 4-bit subtraction from the question sheet: 0111 − 0101
−0101: invert 1010, add 1 → 1011.
0111 + 1011 = 1 0010 → discard carry → **0010 = 2** ✓ (7 − 5 = 2)
:::

## Overflow in two's complement

The carry out of the MSB is **not** the overflow test in two's complement: 93 − 34 produced a carry and the answer was correct. Instead:

- Adding two numbers with **different signs can never overflow**.
- Overflow has happened if **two positives give a negative** result, or **two negatives give a positive** result.

:::example 56 + 87 in 8-bit two's complement
```text
   00111000   (56)
 + 01010111   (87)
 = 10001111   → MSB 1 → −128 + 15 = −113
```
Two positives produced a negative. The true answer 143 is outside the range −128 to 127, so this is **overflow**.
:::

:::example −100 + −100 in 8 bits
10011100 + 10011100 = 1 00111000 → stored 00111000 = **+56**. Two negatives gave a positive: **overflow** (−200 < −128).
:::

:::trap Overflow is about the stored answer being wrong
In an exam, don't just say "there is an extra bit". Say: "the result (143) is **outside the range** that can be represented in 8-bit two's complement (−128 to 127), so the stored result (−113) is incorrect; the sign bit has changed".
:::

## Sign extension

To widen a two's complement number, **copy the MSB** into the new bits:

- +5: 0101 (4 bits) → **0000**0101 (8 bits)
- −5: 1011 (4 bits) → **1111**1011 (8 bits). Check: −128 + 64 + 32 + 16 + 8 + 2 + 1 = −5 ✓

Padding a negative number with 0s would turn it into a large positive number.

## Bitwise operations and shifts

Multiplication by a power of 2 is just a **shift**: each partial product above is the multiplicand shifted left. A **logical shift left** by 1 doubles an unsigned number; a logical shift right by 1 halves it (dropping the remainder). The AND/OR/XOR/NOT operations work on each pair of bits independently. They appear in assembly language ([7.3](#/topic/7.3)) and in the Vernam cipher ([5.8](#/topic/5.8)).

{{tool:bitwise-ops}}

## In code

::::tabs
:::tab Python
```python
def to_twos(value, n):
    """Denary -> n-bit two's complement string."""
    if not -(2 ** (n - 1)) <= value <= 2 ** (n - 1) - 1:
        raise ValueError("out of range")
    return format(value % (2 ** n), "0{}b".format(n))

def from_twos(bits):
    """n-bit two's complement string -> denary (MSB has weight -2^(n-1))."""
    n = len(bits)
    total = -int(bits[0]) * 2 ** (n - 1)
    for i in range(1, n):
        total += int(bits[i]) * 2 ** (n - 1 - i)
    return total

def negate(bits):
    """Invert every bit, then add 1 (discard overflow)."""
    inverted = "".join("1" if b == "0" else "0" for b in bits)
    n = len(bits)
    return format((int(inverted, 2) + 1) % 2 ** n, "0{}b".format(n))

print(to_twos(-26, 8))        # 11100110
print(from_twos("10110110"))  # -74
print(negate("00011010"))     # 11100110
a, b = to_twos(93, 8), negate(to_twos(34, 8))
total = (int(a, 2) + int(b, 2)) % 256      # discard carry out
print(from_twos(format(total, "08b")))     # 59
```
:::
:::tab AQA pseudocode
```pseudocode
# bits is a string such as "10110110"
SUBROUTINE FromTwos(bits)
    n ← LEN(bits)
    total ← 0
    IF bits[0] = "1" THEN
        total ← -(2 ^ (n - 1))
    ENDIF
    FOR i ← 1 TO n - 1
        IF bits[i] = "1" THEN
            total ← total + 2 ^ (n - 1 - i)
        ENDIF
    ENDFOR
    RETURN total
ENDSUBROUTINE
```
:::
::::

:::exam
- **Show working for every calculation.** Write the place-value header (with **−128** for two's complement), the carry row and the check in denary. Method marks are available even when the final bit slips.
- **"Represent −x in 8-bit two's complement" (2 marks):** the positive in 8 bits (or correct method) + the correct answer.
- **"Perform the subtraction a − b using two's complement" (3 marks):** −b correct; addition shown; carry discarded and answer correct.
- **"Explain what has happened" after an addition:** say **overflow**, give the true value, state the range, and say the sign bit has changed (two's complement) or a 9th bit is needed (unsigned).
- **"State the range of n-bit two's complement":** −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1 as numbers, e.g. −128 to 127.
:::

:::challenge
1. Find all 8-bit patterns that represent the same value in both unsigned and two's complement. Explain the pattern.
2. Prove that negating −128 in 8 bits gives −128 again. What does this mean for a program that computes `abs(x)`?
3. Multiply 1011 by 1011 in binary and check in denary. How many bits does the product need?
4. Write a Python function `add_bits(a, b)` that adds two equal-length bit strings column by column with a carry variable (no `int(…, 2)`), and returns the sum and an overflow flag.
:::

:::recap
- Unsigned n bits: **0 to 2ⁿ − 1**. Signed (two's complement): **−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1**.
- Add right to left: 1+1 = 0 carry 1; 1+1+1 = 1 carry 1. A carry out of an unsigned result = overflow.
- Multiply: shifted partial products for each 1 in the multiplier, then add (two rows at a time).
- Two's complement: MSB weight **−2ⁿ⁻¹**. Negate by **invert + 1** or **copy to first 1, invert the rest**.
- a − b = a + (−b); discard the carry out of the MSB.
- Two's complement overflow: same-sign inputs give a result with the other sign.
- Sign-extend by copying the MSB.
:::

:::related
- [5.2 Number bases](#/topic/5.2)
- [5.3 Units of information](#/topic/5.3)
- [5.5 Fixed point and floating point](#/topic/5.5)
- [6.4 Logic gates and circuits](#/topic/6.4)
- [7.3 Assembly language](#/topic/7.3)
:::

*/});
