CS.registerTopic({ id: "5.5", title: "Fixed point and floating point" }, function () {/*

:::objectives
- Represent numbers with a fractional part in **fixed point** binary (unsigned and two's complement) and convert both ways.
- Represent numbers in **floating point** binary in the AQA format: **two's complement mantissa** with the binary point after the first bit, **two's complement exponent**; convert both ways, including **negative mantissas** and **negative exponents**.
- **Normalise** a floating point number (positive mantissa starts **01**, negative starts **10**) and explain **why** (maximum precision, unique representation).
- Find the **largest and smallest** values for a given format.
- Calculate **absolute** and **relative** error, and compare their significance for large, small and near-one values.
- Compare fixed and floating point for **range, precision and speed**, and explain **underflow** and **overflow**.
:::

:::quick At a glance
- **Fixed point**: the binary point is in a **fixed** position. Bits after the point are worth ½, ¼, ⅛, 1/16 …
- **Floating point**: value = **mantissa × 2^exponent**. The mantissa holds the significant bits, the exponent says how far the point "floats".
- **AQA format**: both parts in **two's complement**; the binary point is **implied after the first bit of the mantissa** (place values −1 . ½ ¼ ⅛ …).
- Decode: find the exponent → move the point right (positive) or left (negative) → read as fixed point. Fill with **0s** for a positive mantissa, **1s** for a negative one.
- **Normalised**: positive mantissa starts **0.1**, negative starts **1.0**. Normalising gives **maximum precision** and a **unique representation**.
- **Absolute error** = |true − stored|. **Relative error** = absolute ÷ true (a ratio; × 100 for %).
- **Floating point**: bigger **range**, precision adapts to size. **Fixed point**: smaller range, constant precision, **faster** and simpler.
- **Overflow**: too large for the exponent. **Underflow**: a non-zero result too close to 0, stored as 0.
:::

:::keyterms
Fixed point :: A representation of numbers with a fractional part in which the binary point is in a fixed position, with a set number of bits before and after it. :: The point never moves.
Floating point :: A representation in which a number is stored as a mantissa and an exponent, value = mantissa × 2^exponent, so the binary point can move. :: Binary standard form.
Mantissa :: The part of a floating point number that holds its significant digits; in AQA format a two's complement fraction with the point after the first bit. :: The "digits" part.
Exponent :: The part of a floating point number that gives the power of 2 by which the mantissa is multiplied (how far the binary point moves). :: The "how big" part.
Normalisation :: Adjusting the mantissa and exponent so that the first two bits of the mantissa are different (01 for positive, 10 for negative), without changing the value. :: Squeeze out wasted leading bits.
Precision :: The level of detail with which a number can be stored, determined by the number of significant bits (mantissa bits). :: How many significant figures you get.
Range :: The spread between the smallest and largest values that can be represented, mainly determined by the exponent bits. :: How big and how tiny you can go.
Absolute error :: The magnitude of the difference between the true value and the value actually stored. :: How far off you are.
Relative error :: The absolute error divided by the true value (often given as a percentage). :: How far off you are compared with the size of the number.
Overflow :: The result of a calculation is too large in magnitude to be represented with the available bits. :: Too big to fit.
Underflow :: The result of a calculation is too close to zero (too small in magnitude) to be represented, so it is stored as zero. :: Too tiny to tell apart from 0.
Rounding error :: The error introduced when a value is rounded or truncated to fit the available bits. :: What you lose by chopping bits off.
:::

## Fractions in binary

To the right of the binary point the place values **halve** each time, just as decimal places divide by 10.

| 8 | 4 | 2 | 1 | . | ½ | ¼ | ⅛ | 1/16 | 1/32 |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | 0.5 | 0.25 | 0.125 | 0.0625 | 0.03125 |

:::tip Learn these
½ = 0.5, ¼ = 0.25, ⅛ = 0.125, 1/16 = 0.0625, 1/32 = 0.03125, 1/64 = 0.015625, 1/128 = 0.0078125. Each is half the one before.
:::

## Fixed point

In fixed point the position of the binary point is **decided in advance** and never changes. The point is **not stored**; both the program and the hardware just know where it is.

### Fixed point → denary

:::example 1011.1000 (4 bits before, 4 after, unsigned)
| 8 | 4 | 2 | 1 | . | ½ | ¼ | ⅛ | 1/16 |
|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 1 | . | 1 | 0 | 0 | 0 |

8 + 2 + 1 + 0.5 = **11.5**
:::

:::example 1001.1100 (unsigned 4.4)
8 + 1 + 0.5 + 0.25 = **9.75**
:::

### Denary → fixed point

1. Convert the **whole part** with place values.
2. Convert the **fraction**: either make it from ½, ¼, ⅛ … or use the **multiply-by-2** method (the whole-number part of each answer is the next bit).
3. If it does not fit exactly, **truncate** or **round** (and expect an error).

:::example 12.625 in 4.4 fixed point
- 12 = 1100
- 0.625 = 0.5 + 0.125 → .1010
- **1100.1010** ✓ (8 + 4 + 0.5 + 0.125 = 12.625)
:::

:::example 12.8125 with only 5 bits before and 3 after the point
Whole part: 12 = 01100.

Fraction by ×2:

| Fraction | × 2 | Bit |
|---|---|---|
| 0.8125 | 1.625 | 1 |
| 0.625 | 1.25 | 1 |
| 0.25 | 0.5 | 0 |
| 0.5 | 1.0 | 1 |

0.8125 = .1101, but only **3** fractional bits fit:

- **Truncate** → 01100.110 = **12.75**
- **Round** (the first discarded bit is 1, so add 1) → 01100.111 = **12.875**

Either way the stored value is not exactly 12.8125.
:::

### Negative fixed point

Use two's complement for the whole pattern: the MSB is negative.

:::example −5.25 in 8-bit two's complement fixed point (4 bits before, 4 after)
| −8 | 4 | 2 | 1 | . | ½ | ¼ | ⅛ | 1/16 |
|---|---|---|---|---|---|---|---|---|
| 1 | 0 | 1 | 0 | . | 1 | 1 | 0 | 0 |

+5.25 = 0101.0100 → copy up to the first 1 (`0100`), invert the rest (0101 → 1010): **1010.1100**.
Check: −8 + 2 + 0.5 + 0.25 = −5.25 ✓
:::

:::trap Some values can never be exact
0.1₁₀ and 0.6₁₀ **recur** in binary (0.6 = 0.1001 1001 1001…), just as ⅓ recurs in denary. Only fractions whose denominator is a power of 2 terminate. Whatever the format, such values carry a **rounding error**.
:::

## Floating point: the idea

Fixed point forces a trade-off. Lots of bits before the point → big numbers but little detail. Lots after → detail but only small numbers.

**Floating point** lets the point move. It is binary **standard form**:

> value = **mantissa × 2^exponent**

- 9 257 = 9.257 × 10³ in denary standard form.
- 9.75 = 0.100111 × 2⁴ in binary floating point.

### The AQA format

- **Mantissa**: two's complement, with the **binary point between the first and second bits**. Place values: **−1 . ½ ¼ ⅛ 1/16 …**
- **Exponent**: an ordinary two's complement **integer** (4 bits: −8 4 2 1).
- Neither the point nor the base 2 is stored.

:::figure 8-bit mantissa and 4-bit exponent, both in two's complement
<svg class="diagram" viewBox="0 0 660 160" role="img" aria-label="Floating point layout: 8-bit mantissa with place values -1, 1/2 to 1/128 and implied point after the first bit, then 4-bit exponent with place values -8 4 2 1">
  <g font-family="inherit" font-size="13" fill="currentColor">
    <text x="210" y="20" text-anchor="middle" font-weight="bold">Mantissa (8 bits)</text>
    <text x="560" y="20" text-anchor="middle" font-weight="bold">Exponent (4 bits)</text>
    <g font-family="monospace" font-size="15">
      <rect x="20" y="50" width="48" height="40" fill="#e07a9b" fill-opacity="0.25" stroke="currentColor"/>
      <rect x="68" y="50" width="336" height="40" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
      <text x="44" y="76" text-anchor="middle">0</text>
      <text x="92" y="76" text-anchor="middle">1</text><text x="140" y="76" text-anchor="middle">0</text><text x="188" y="76" text-anchor="middle">0</text><text x="236" y="76" text-anchor="middle">1</text><text x="284" y="76" text-anchor="middle">1</text><text x="332" y="76" text-anchor="middle">1</text><text x="380" y="76" text-anchor="middle">0</text>
      <rect x="464" y="50" width="192" height="40" fill="#5fc9a8" fill-opacity="0.25" stroke="currentColor"/>
      <text x="488" y="76" text-anchor="middle">0</text><text x="536" y="76" text-anchor="middle">1</text><text x="584" y="76" text-anchor="middle">0</text><text x="632" y="76" text-anchor="middle">0</text>
    </g>
    <circle cx="68" cy="88" r="4" fill="currentColor"/>
    <text x="44" y="44" text-anchor="middle">−1</text><text x="92" y="44" text-anchor="middle">½</text><text x="140" y="44" text-anchor="middle">¼</text><text x="188" y="44" text-anchor="middle">⅛</text><text x="236" y="44" text-anchor="middle">1/16</text><text x="284" y="44" text-anchor="middle">1/32</text><text x="332" y="44" text-anchor="middle">1/64</text><text x="380" y="44" text-anchor="middle">1/128</text>
    <text x="488" y="44" text-anchor="middle">−8</text><text x="536" y="44" text-anchor="middle">4</text><text x="584" y="44" text-anchor="middle">2</text><text x="632" y="44" text-anchor="middle">1</text>
    <text x="68" y="114" text-anchor="middle">implied binary point</text>
    <text x="330" y="146" text-anchor="middle">0.1001110 × 2⁴ = 01001.110 = 9.75</text>
  </g>
</svg>
:::

## Floating point → denary

:::steps Decoding (8-bit mantissa, 4-bit exponent unless told otherwise)
1. Convert the **exponent** from two's complement to denary.
2. Write the mantissa with the point after the first bit.
3. Move the point **right** by a positive exponent, **left** by a negative one. When moving left, pad on the left with **0s if the mantissa is positive, 1s if it is negative**.
4. Read the result as two's complement fixed point: the leftmost bit is negative.
5. (Alternative) Mantissa value × 2^exponent.
:::

:::example Positive mantissa, positive exponent: 01001110 0100
1. Exponent 0100 = **+4**.
2. Mantissa 0.1001110.
3. Move the point 4 right: **01001.110**.
4. Place values −16 8 4 2 1 . ½ ¼ ⅛ → 8 + 1 + 0.5 + 0.25 = **9.75**.

Check: mantissa = ½ + 1/16 + 1/32 + 1/64 = 0.609375; × 2⁴ = 9.75 ✓
:::

:::example Positive mantissa, negative exponent: 01010000 1111
1. Exponent 1111 = −8 + 4 + 2 + 1 = **−1**.
2. Mantissa 0.1010000.
3. Move the point 1 **left**, padding with 0 (positive): **0.01010000**.
4. ¼ + 1/16 = **0.3125**.
:::

:::example Negative mantissa, positive exponent: 10111100 0011
1. Exponent 0011 = **+3**.
2. Mantissa 1.0111100.
3. Move the point 3 right: **1011.1100**.
4. Place values −8 4 2 1 . ½ ¼ → −8 + 2 + 1 + 0.5 + 0.25 = **−4.25**.

Check: mantissa = −1 + ¼ + ⅛ + 1/16 + 1/32 = −0.53125; × 8 = −4.25 ✓
:::

:::example Negative mantissa, negative exponent: 10100000 1110
1. Exponent 1110 = −8 + 4 + 2 = **−2**.
2. Mantissa 1.0100000.
3. Move the point 2 **left**, padding with **1s** (negative): **1.110100000**.
4. −1 + ½ + ¼ + 1/16 = **−0.1875**.

Check: mantissa = −1 + ¼ = −0.75; × 2⁻² = −0.1875 ✓
:::

:::trap A textbook answer to correct: 101000011111 (7-bit mantissa, 5-bit exponent)
Your textbook gives this as **5/8**. That is wrong.
- Mantissa **1.010000** = −1 + ¼ = **−0.75** (the MSB is 1, so it is negative).
- Exponent **11111** = −16 + 8 + 4 + 2 + 1 = **−1**.
- Value = −0.75 × 2⁻¹ = **−0.375** (= −3/8).

Whenever the first mantissa bit is 1, the answer **must** be negative.
:::

{{trace:5.5-1}}

## Denary → floating point

:::steps Encoding
1. Write the number in **two's complement fixed point** (with a leading 0 for positive values).
2. **Normalise**: move the point so it sits just after the sign bit, i.e. the pattern starts **0.1** (positive) or **1.0** (negative). Drop extra leading 0s (positive) or 1s (negative).
3. Exponent = **the number of places the point moved left** (moving right gives a negative exponent).
4. Pad the mantissa with **0s on the right** to its full width; write the exponent in two's complement.
5. **Check** by decoding.
:::

:::example +9.75 (8-bit mantissa, 4-bit exponent)
1. 9.75 = 01001.11.
2. Move the point 4 places left: 0.100111.
3. Exponent = **+4** = 0100.
4. Mantissa **01001110**, exponent **0100**.
5. Check: 0.1001110 × 2⁴ = 1001.11 = 9.75 ✓
:::

:::example +0.375
1. 0.375 = 0.011.
2. Move the point 1 place **right** → 0.11 (drop a leading 0).
3. Exponent = **−1** = 1111.
4. Mantissa **01100000**, exponent **1111**. Check: 0.75 × ½ = 0.375 ✓
:::

:::example −7.5: and a textbook correction
1. +7.5 = 0111.1. Negate (copy up to the first 1, invert the rest) → **1000.1**. Check: −8 + 0.5 = −7.5 ✓
2. Normalise: the pattern must start 1.0, so move the point 3 left → **1.0001**.
3. Exponent = **+3** = 0011.
4. Mantissa **10001000**, exponent **0011**.
5. Check: mantissa = −1 + 1/16 = −0.9375; × 2³ = **−7.5** ✓

The textbook answer gives mantissa 10011000. Decoding that: 1.0011000 × 2³ = 1001.1 = −8 + 1 + 0.5 = **−6.5**, so it is wrong. The slip is negating 0111.1 as if the point were not there.
:::

:::example −4.5
+4.5 = 0100.1 → −4.5 = 1011.1 (−8 + 3.5). Normalise: 1.0111 × 2³ → mantissa **10111000**, exponent **0011**. Check: (−1 + ¼ + ⅛ + 1/16) × 8 = −0.5625 × 8 = −4.5 ✓
:::

:::example −0.625
+0.625 = 0.101 → −0.625 = 1.011 (−1 + ¼ + ⅛). It already starts 1.0, so the exponent is **0**. Mantissa **10110000**, exponent **0000**.
:::

:::trap Fixed point is not floating point
The textbook answers "13.5 → 1101.1" and "−3.75 → 1100.01" to a floating point question. Those are **fixed point** patterns. In 8-bit mantissa / 4-bit exponent form:
- 13.5 = 01101.1 → 0.11011 × 2⁴ → **01101100 0100**
- −3.75 = 100.01 → 1.0001 × 2² → **10001000 0010** (check: −0.9375 × 4 = −3.75)
:::

## Normalisation

The same value can be written many ways: 0.0100110 × 2⁵ = 0.1001100 × 2⁴ = …

A floating point number is **normalised** when its **first two mantissa bits are different**:

| Sign | Normalised mantissa starts | Not normalised |
|---|---|---|
| Positive | **0.1**… | 0.0… |
| Negative | **1.0**… | 1.1… |

### Why normalise?

1. **Maximum precision.** Leading 0s (or leading 1s on a negative number) carry no information but use up mantissa bits. Removing them leaves room for more significant bits at the right-hand end.
2. **A unique representation.** Each value has exactly one normalised form, so numbers can be compared and tested for equality easily.
3. It also makes the best use of the **range** for a given number of bits.

:::why Why do leading 1s waste space in a negative number?
In two's complement, 1.1101 and 1.101 (with one less place of exponent) are the same value. Extra leading 1s are like writing −0005 in denary: they are just sign extension and add nothing.
:::

### How to normalise

1. Shift the mantissa **left** until it starts 01 or 10, filling with 0s on the right.
2. For **each place shifted left, subtract 1 from the exponent** (shifting left doubles the mantissa, so the exponent must halve the value back).
3. (Rarely, if a mantissa has too many integer bits, shift right and **add** to the exponent.)

:::example Normalise mantissa 0.0001011, exponent 0101
- The first 1 is 3 places in. Shift left 3: **0.1011000**.
- Exponent 5 − 3 = **2** → **0010**.
- Check: 0.0001011 × 2⁵ = 0.00010110 × 32 = 2.75 and 0.1011 × 2² = 10.11 = 2.75 ✓
:::

:::example Normalise mantissa 1.1110010, exponent 0001
- Negative; we need 1.0…. Shift left 3 (lose the three extra leading 1s): **1.0010000**.
- Exponent 1 − 3 = **−2** → **1110**.
- Check: (−1 + ½ + ¼ + ⅛ + 1/64) × 2 = −0.109375 × 2 = −0.21875; and (−1 + ⅛) × ¼ = −0.21875 ✓
:::

{{trace:5.5-2}}

{{tool:floating-point}}

## Largest and smallest values

For an **8-bit mantissa and 4-bit exponent**, normalised:

| Description | Mantissa | Exponent | Value |
|---|---|---|---|
| Largest positive | 0.1111111 | 0111 (+7) | (1 − 1/128) × 2⁷ = **127** |
| Smallest positive (closest to 0) | 0.1000000 | 1000 (−8) | ½ × 2⁻⁸ = **1/512 ≈ 0.00195** |
| Most negative | 1.0000000 | 0111 (+7) | −1 × 2⁷ = **−128** |
| Negative closest to 0 | 1.0111111 | 1000 (−8) | −(½ + 1/128) × 2⁻⁸ ≈ **−0.00198** |

- **Largest magnitude → largest positive exponent.** Closest to zero → most negative exponent.
- The smallest positive uses mantissa **0.1000000**, not 0.0000001, because that would not be normalised.

:::note Compare with fixed point
8-bit two's complement fixed point with 4 bits each side ranges from −8 to 7.9375, in steps of 1/16. The same 12 bits as floating point reach ±128 and get as close to zero as about 0.002.
:::

## Rounding errors: absolute and relative

Both representations have a finite number of bits, so many values are stored **approximately**. Measure how bad that is:

> **Absolute error** = |true value − stored value|
>
> **Relative error** = absolute error ÷ true value (× 100 for a percentage)

:::example 12.67 stored in 8 bits (5 before, 3 after the point)
- Nearest pattern: 01100.101 = **12.625**.
- Absolute error = 12.67 − 12.625 = **0.045**.
- Relative error = 0.045 ÷ 12.67 = **0.00355** (≈ 0.355%).
:::

:::example 0.1 in floating point (8-bit mantissa, 4-bit exponent, truncated)
- 0.1 = 0.000110011001… → normalised 0.1100110 × 2⁻³ = **0.099609375**.
- Absolute error = 0.1 − 0.099609375 = **0.000390625**.
- Relative error = 0.000390625 ÷ 0.1 = **0.0039** (0.39%).
:::

:::example Same absolute error, different impact
An absolute error of **0.5**:

| True value | Relative error | Impact |
|---|---|---|
| 1000 | 0.5 ÷ 1000 = 0.0005 | negligible |
| 2 | 0.5 ÷ 2 = 0.25 | 25%: serious |
| 0.8 (near 1) | 0.5 ÷ 0.8 = 0.625 | 62.5%: very serious |

Relative error shows **how significant** an error is, because it takes the size of the number into account. For a fixed absolute error, the **larger** the number, the **smaller** the relative error.
:::

:::trap Relative error: ratio or percentage?
Your class slides always multiply by 100 and give a percentage; the ZigZag slides give a plain ratio. **AQA accepts either**, but say which you are giving: write "0.00355" or "0.355%", never "0.355" on its own. Always divide by the **true** value, and give the absolute error as a **positive** number.
:::

:::trap Another textbook slip: 011.111010000
The textbook says 011.111010000 = 3.78125. In fact 2 + 1 + ½ + ¼ + ⅛ + 1/32 = **3.90625**. As a representation of 3.9, the absolute error is **0.00625** and the relative error is about **0.0016** (0.16%), not 0.11875 and 0.0304.
:::

### Other sources of error

- **Truncation vs rounding**: truncating simply drops bits (always rounds towards zero for positive values); rounding adds 1 if the first dropped bit is 1. Rounding usually halves the maximum error.
- **Cancellation**: adding a tiny number to a huge one may change nothing, because the tiny one falls off the end of the mantissa when the exponents are aligned.

## Fixed point vs floating point

| | Fixed point | Floating point |
|---|---|---|
| **Range** | Small for a given number of bits | Much larger (exponent bits control it) |
| **Precision** | Same absolute precision everywhere (step = value of the last bit) | Precision relative to size: tiny numbers are very precise, huge ones have bigger gaps; normalisation maximises it |
| **Speed** | **Faster**: integer arithmetic, no point to move | Slower: exponents must be aligned and results normalised (eased by FPU hardware) |
| **Hardware** | Simple, cheap | More complex |
| **Good for** | Money (exact pence), DSP, simple embedded systems | Scientific data, graphics, anything with very large or tiny values |

- More **mantissa** bits → more **precision**. More **exponent** bits → more **range**. For a fixed total, it is a trade-off.

## Overflow and underflow

- **Overflow**: the result is **too large** (in magnitude) to represent. In floating point, the exponent needed is bigger than its largest value (e.g. above +7 with 4 bits). Example: 0.11 × 2⁷ × 0.1 × 2⁴ needs a much larger exponent.
- **Underflow**: the result is **too close to zero** (non-zero, but smaller in magnitude than the smallest representable number), because the exponent needed is more negative than allowed. The result is usually **stored as 0**. Example: dividing a very small number by a very large one, or subtracting two nearly equal numbers.

:::trap Underflow is not "a very negative number"
−1000 overflowing below the range is still **overflow** (too large in magnitude). Underflow is about being **too near zero**.
:::

## In code

::::tabs
:::tab Python
```python
from fractions import Fraction

def twos(bits):
    n = len(bits)
    v = int(bits, 2)
    return v - 2 ** n if bits[0] == "1" else v

def decode(mantissa, exponent):
    """AQA float: two's complement mantissa with point after first bit."""
    m = Fraction(twos(mantissa), 2 ** (len(mantissa) - 1))
    return m * Fraction(2) ** twos(exponent)

print(float(decode("01001110", "0100")))   # 9.75
print(float(decode("10100000", "1110")))   # -0.1875
print(float(decode("1010000", "11111")))   # -0.375 (not 5/8!)
print(float(decode("10001000", "0011")))   # -7.5

true, stored = 12.67, 12.625
abs_err = abs(true - stored)
print(round(abs_err, 3), round(abs_err / true, 5))  # 0.045 0.00355
```
:::
:::tab AQA pseudocode
```pseudocode
# Is a mantissa (string of bits) normalised?
SUBROUTINE IsNormalised(mantissa)
    IF mantissa[0] ≠ mantissa[1] THEN
        RETURN True
    ELSE
        RETURN False
    ENDIF
ENDSUBROUTINE
```
:::
::::

:::exam
- **Conversions (2–3 marks)**: show the exponent in denary, the point moved and the place-value sum. Check the sign matches the first mantissa bit.
- **"Normalise" questions**: say how many places the point moved and adjust the exponent the **opposite** way to the mantissa shift. Give both parts in binary.
- **"Explain why floating point numbers are normalised" (2)**: "to maximise precision (no wasted leading bits)" + "so each number has a unique representation". Accept "maximise range" as an alternative second point.
- **"Calculate the absolute and relative errors" (2)**: show the subtraction and the division; state ratio or %.
- **"Compare fixed and floating point" (4–6)**: cover **range**, **precision** and **speed**, both sides, with a reason each time.
- **Overflow/underflow**: define it and say **when** it happens (exponent too large / too small).
:::

:::challenge
1. With a 6-bit mantissa and 4-bit exponent, what is the smallest positive normalised number? How many different exponents can represent zero?
2. Show that 0.1 + 0.2 cannot equal exactly 0.3 in binary floating point.
3. A system needs to store distances from 0.001 m to 40 000 km with 1% precision. Should it give more bits to the mantissa or the exponent? Justify.
4. Design a 16-bit fixed point format for prices up to £300 to the nearest penny. Is it possible? What goes wrong?
:::

:::recap
- **Fixed point**: point in a fixed place; fractional place values ½, ¼, ⅛…; can be two's complement.
- **Floating point (AQA)**: two's complement mantissa with the point after the first bit × 2^(two's complement exponent).
- Decode: exponent → move the point → read as fixed point (pad with 0s for +, 1s for −).
- **Normalised**: positive 0.1…, negative 1.0… → maximum precision and a unique representation.
- 8/4 format: largest 127, most negative −128, smallest positive 1/512.
- Absolute error = |true − stored|; relative = absolute ÷ true (ratio or %).
- Float: wider range, adaptive precision, slower. Fixed: narrow range, constant precision, faster.
- Overflow = too large; underflow = too close to zero (stored as 0).
:::

:::related
- [5.4 Binary integers and two's complement](#/topic/5.4)
- [5.1 Number systems](#/topic/5.1)
- [5.3 Units of information](#/topic/5.3)
:::

*/});
