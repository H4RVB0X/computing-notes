CS.registerTopic({ id: "5.2", title: "Number bases: binary and hexadecimal" }, function () {/*

:::objectives
- Explain what a **number base** is and how **place values** work in base 10, base 2 and base 16.
- Convert **binary → denary** and **denary → binary** (place-value subtraction and repeated division by 2).
- Convert **hexadecimal ↔ denary** and **hexadecimal ↔ binary** (via nibbles).
- Explain **why hexadecimal is used as shorthand for binary**, and give real places where it is used.
- Write the base as a subscript (101₂, 5₁₀, 5₁₆) and check every conversion.
:::

:::quick At a glance
- A **number base** is how many different digits a system uses. Each place is worth **base × the place to its right**.
- **Denary/decimal (base 10)**: digits 0–9, place values 1, 10, 100, 1000…
- **Binary (base 2)**: digits 0–1, place values 1, 2, 4, 8, 16, 32, 64, 128…
- **Hexadecimal (base 16)**: digits 0–9 then **A=10, B=11, C=12, D=13, E=14, F=15**; place values 1, 16, 256, 4096…
- **One hex digit = exactly four bits (a nibble)**, because 16 = 2⁴. So 1 byte = 2 hex digits.
- Binary → hex: split into nibbles **from the right**, convert each. Hex → binary: each digit → 4 bits (keep leading 0s).
- Hex is used because it is **shorter, easier to read and less error-prone than binary**, yet converts to binary instantly (unlike denary).
:::

:::keyterms
Number base :: The number of different digits (including zero) used by a place-value number system; each place is worth the base times the place to its right. :: How many symbols you count with before carrying.
Denary (decimal) :: The base-10 number system, using the digits 0–9. :: Everyday numbers.
Binary :: The base-2 number system, using only the digits 0 and 1. :: What the hardware actually stores: off/on.
Hexadecimal :: The base-16 number system, using the digits 0–9 and the letters A–F to represent 10–15. :: A compact way to write binary, 4 bits per digit.
Place value :: The value a digit position represents; in base b the positions are b⁰, b¹, b², … from the right. :: What each column is "worth".
Most significant bit (MSB) :: The leftmost bit of a binary number, with the largest place value. :: The bit that matters most.
Least significant bit (LSB) :: The rightmost bit of a binary number, with place value 1. :: The units bit.
Nibble :: A group of four bits; it can be written as exactly one hexadecimal digit. :: Half a byte.
:::

## What a number base is

Every number system you will meet in this course is a **place-value** system. The value of a digit depends on **where** it is.

In denary, 456 means 4 hundreds, 5 tens and 6 units:

> 456₁₀ = (4 × 10²) + (5 × 10¹) + (6 × 10⁰) = 400 + 50 + 6

Binary and hexadecimal work in exactly the same way. Only the **base** changes, so the column values change.

| Base | Digits used | Place values (right → left) |
|---|---|---|
| 10 (denary) | 0 1 2 3 4 5 6 7 8 9 | 1, 10, 100, 1000 … (10ⁿ) |
| 2 (binary) | 0 1 | 1, 2, 4, 8, 16, 32, 64, 128 … (2ⁿ) |
| 16 (hexadecimal) | 0–9, A B C D E F | 1, 16, 256, 4096 … (16ⁿ) |

:::why
**Why do computers use binary?** Their circuits are built from switches (transistors) that are reliably either **off or on**. Two states map perfectly onto the two binary digits 0 and 1. Distinguishing ten voltage levels reliably would be far harder and more error-prone.
:::

### Writing the base

Because `10` could mean ten, two or sixteen, we write the base as a **subscript**: 10₂ = 2₁₀, 10₁₆ = 16₁₀. If a question uses subscripts, so should your answer.

### The table you must know by heart

| Denary | Binary | Hex | | Denary | Binary | Hex |
|---|---|---|---|---|---|---|
| 0 | 0000 | 0 | | 8 | 1000 | 8 |
| 1 | 0001 | 1 | | 9 | 1001 | 9 |
| 2 | 0010 | 2 | | 10 | 1010 | A |
| 3 | 0011 | 3 | | 11 | 1011 | B |
| 4 | 0100 | 4 | | 12 | 1100 | C |
| 5 | 0101 | 5 | | 13 | 1101 | D |
| 6 | 0110 | 6 | | 14 | 1110 | E |
| 7 | 0111 | 7 | | 15 | 1111 | F |

:::tip Rebuild the table in seconds
Remember **A = 10** and **F = 15**, and that **8 = 1000**. Everything else follows by counting.
:::

## Binary → denary

Write the place values above the bits, then **add the place values wherever there is a 1**.

:::example Convert 11000110₂ to denary
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 0 | 0 | 0 | 1 | 1 | 0 |

128 + 64 + 4 + 2 = **198₁₀**
:::

:::example Convert 01100101₂ to denary
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 0 | 1 | 1 | 0 | 0 | 1 | 0 | 1 |

64 + 32 + 4 + 1 = **101₁₀**
:::

## Denary → binary

There are two reliable methods. Use whichever you make fewer mistakes with, then **check by converting back**.

### Method 1: subtract place values (left to right)

1. Write the place values (128, 64, 32 … 1).
2. Starting from the left, if the place value **fits** into what is left, write 1 and subtract it. Otherwise write 0.
3. Carry on until you reach the units column.

:::example Convert 230₁₀ to 8-bit binary
| Place | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|
| Remaining before | 230 | 102 | 38 | 6 | 6 | 6 | 2 | 0 |
| Fits? | yes | yes | yes | no | no | yes | yes | no |
| Bit | 1 | 1 | 1 | 0 | 0 | 1 | 1 | 0 |

230 − 128 = 102 → 102 − 64 = 38 → 38 − 32 = 6 → 6 − 4 = 2 → 2 − 2 = 0.

**230₁₀ = 11100110₂.** Check: 128 + 64 + 32 + 4 + 2 = 230 ✓
:::

:::example Convert 34₁₀ to 8-bit binary
34 − 32 = 2, 2 − 2 = 0. So the 32 and 2 columns hold 1s.

| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 1 | 0 | 0 | 0 | 1 | 0 |

**34₁₀ = 00100010₂.** Check: 32 + 2 = 34 ✓
:::

:::trap Check your answer by converting back
One of your class slides concludes "Denary value **32** = 00100010" after converting 34. The binary is right; the label is wrong: 00100010₂ = **34**. A two-second check (32 + 2) catches slips like this every time.
:::

### Method 2: repeated division by 2

Divide by 2, write down the remainder, repeat with the quotient until it reaches 0. **Read the remainders from bottom to top.**

:::example Convert 45₁₀ to binary by repeated division
| Division | Quotient | Remainder |
|---|---|---|
| 45 ÷ 2 | 22 | **1** ← LSB |
| 22 ÷ 2 | 11 | **0** |
| 11 ÷ 2 | 5 | **1** |
| 5 ÷ 2 | 2 | **1** |
| 2 ÷ 2 | 1 | **0** |
| 1 ÷ 2 | 0 | **1** ← MSB |

Reading upwards: 101101. As 8 bits: **00101101₂**. Check: 32 + 8 + 4 + 1 = 45 ✓
:::

{{trace:5.2-1}}

## Hexadecimal

Hex uses sixteen digits, so after 9 we need six more symbols: **A, B, C, D, E, F** (10–15). Place values are powers of 16.

| 16³ = 4096 | 16² = 256 | 16¹ = 16 | 16⁰ = 1 |
|---|---|---|---|

### Hex → denary

Multiply each digit by its place value and add.

:::example Convert B6₁₆ and ABC₁₆ to denary
- **B6**: (11 × 16) + (6 × 1) = 176 + 6 = **182₁₀**
- **ABC**: (10 × 256) + (11 × 16) + (12 × 1) = 2560 + 176 + 12 = **2748₁₀**
:::

### Denary → hex

Either convert to binary first and then to hex (often easiest), or use **repeated division by 16** and read the remainders upwards.

:::example Convert 2468₁₀ to hexadecimal by repeated division
| Division | Quotient | Remainder | Hex digit |
|---|---|---|---|
| 2468 ÷ 16 | 154 | 4 | 4 ← least significant |
| 154 ÷ 16 | 9 | 10 | **A** |
| 9 ÷ 16 | 0 | 9 | 9 ← most significant |

Reading upwards: **9A4₁₆**. Check: 9 × 256 + 10 × 16 + 4 = 2304 + 160 + 4 = 2468 ✓

(The original slide starts this example "2400 ÷ 16 = 154". That is a typo: it should read **2468** ÷ 16 = 154 remainder 4.)
:::

:::example Convert 165₁₀ to hex via binary
165 − 128 = 37, 37 − 32 = 5, 5 − 4 = 1, 1 − 1 = 0 → **1010 0101₂**.
Split into nibbles: 1010 = 10 = **A**, 0101 = 5 → **A5₁₆**. Check: 10 × 16 + 5 = 165 ✓
:::

## Hex ↔ binary: the reason hex exists

Because **16 = 2⁴**, every hex digit corresponds to **exactly four bits**. Converting is just a lookup, digit by digit. No arithmetic needed.

:::figure One hex digit is one nibble, so one byte is two hex digits
<svg class="diagram" viewBox="0 0 560 170" role="img" aria-label="The byte 10011101 split into two nibbles 1001 and 1101 which map to hex 9 and D">
  <defs><marker id="arr52" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="16">
    <rect x="60" y="20" width="200" height="44" rx="8" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <rect x="300" y="20" width="200" height="44" rx="8" fill="#5fc9a8" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="48" text-anchor="middle" font-family="monospace" fill="currentColor">1 0 0 1</text>
    <text x="400" y="48" text-anchor="middle" font-family="monospace" fill="currentColor">1 1 0 1</text>
    <text x="160" y="14" text-anchor="middle" font-size="12" fill="currentColor">8 4 2 1</text>
    <text x="400" y="14" text-anchor="middle" font-size="12" fill="currentColor">8 4 2 1</text>
    <line x1="160" y1="66" x2="160" y2="108" stroke="currentColor" marker-end="url(#arr52)"/>
    <line x1="400" y1="66" x2="400" y2="108" stroke="currentColor" marker-end="url(#arr52)"/>
    <text x="160" y="134" text-anchor="middle" fill="currentColor">8 + 1 = 9 → 9</text>
    <text x="400" y="134" text-anchor="middle" fill="currentColor">8 + 4 + 1 = 13 → D</text>
    <text x="280" y="162" text-anchor="middle" font-weight="bold" fill="currentColor">10011101₂ = 9D₁₆</text>
  </g>
</svg>
:::

:::steps Binary → hex
1. Starting from the **right** (the LSB), split the bits into groups of four.
2. If the leftmost group has fewer than four bits, pad it with **leading zeros**.
3. Convert each nibble to one hex digit.
:::

:::example Convert 1001101₂ to hex (only 7 bits)
Group from the right: 100 | 1101 → pad: **0100 | 1101** → 4 | D → **4D₁₆**.
Grouping from the left (1001 | 101) would give the wrong answer, 9 and 5 → 95, which is not equal.
:::

:::steps Hex → binary
1. Convert each hex digit to its denary value.
2. Write each as **exactly four bits**, keeping leading zeros.
3. Join the groups.
:::

:::example Convert 9B₁₆, B03₁₆ and 19A₁₆ to binary
- **9B**: 9 = 1001, B = 1011 → **10011011₂**
- **B03**: B = 1011, 0 = 0000, 3 = 0011 → **1011 0000 0011₂** (the middle 0000 must stay)
- **19A**: 1 = 0001, 9 = 1001, A = 1010 → **0001 1001 1010₂** = 110011010₂
:::

:::trap Each hex digit is **four** bits, always
Writing 3 as `11` instead of `0011` in the middle of a number shifts every bit to its left and changes the value. Only leading zeros at the very front of the whole number may be dropped.
:::

{{tool:base-converter}}

## Why hexadecimal is used as shorthand for binary

Computers never *store* hex: memory holds binary. Hex is purely for **humans** reading and writing binary values.

| Reason | Explanation |
|---|---|
| **Shorter** | One hex digit replaces four bits, so a 32-bit value is 8 hex digits instead of 32 bits. |
| **Easier to read and remember** | `FFA500` is much easier to recognise than `111111111010010100000000`. |
| **Fewer errors** | Copying long strings of 0s and 1s by hand is very error-prone. |
| **Trivial conversion** | Each digit maps directly to 4 bits, unlike denary, which needs repeated division. |

Places you will see hex:

- **Memory addresses** in debuggers and error messages (`0x7FFE0010`).
- **Colour codes** in HTML/CSS: `#FFA500` is orange, two hex digits each for red, green and blue.
- **MAC addresses**: `b4:f7:a1:8c:8e:d3` (12 hex digits = 48 bits).
- **IPv6 addresses**: `2001:0db8:85a3::8a2e:0370:7334`.
- Machine code and file dumps (hex editors), Unicode code points (`U+1F600`).

:::trap "Hex takes up less memory" is wrong
Hex does **not** save storage: the computer still stores the same bits. The mark is for "easier **for humans** to read/write/remember, fewer transcription errors, shorter to display".
:::

## Doing it in code

::::tabs
:::tab Python
```python
def to_binary(n):
    """Repeated division by 2 (n >= 0)."""
    if n == 0:
        return "0"
    bits = ""
    while n > 0:
        bits = str(n % 2) + bits   # remainder becomes the next bit on the LEFT
        n = n // 2
    return bits

print(to_binary(45))           # 101101
print(int("101101", 2))        # 45  (binary -> denary)
print(format(2468, "X"))       # 9A4 (denary -> hex)
print(int("B6", 16))           # 182 (hex -> denary)
print(format(0x9B, "08b"))     # 10011011 (hex -> 8-bit binary)
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE ToBinary(n)
    IF n = 0 THEN
        RETURN "0"
    ENDIF
    bits ← ""
    WHILE n > 0
        bits ← INT_TO_STRING(n MOD 2) + bits
        n ← n DIV 2
    ENDWHILE
    RETURN bits
ENDSUBROUTINE
```
:::
::::

:::exam
- **Conversion questions (1–2 marks):** show working (a place-value table or division table). A correct answer earns the marks, but working can earn a method mark if you slip.
- **Use the bit width you are given.** "Represent 45 as an 8-bit binary number" wants **00101101**, not 101101.
- **"Explain why hexadecimal is often used instead of binary" (2 marks):** "shorter / fewer digits so easier for humans to read and remember" + "less likely to make errors when copying/typing" (+ "easy to convert since one hex digit = 4 bits"). Never claim it uses less memory.
- **"Give an example of where hex is used":** memory addresses, colour codes, MAC addresses, error codes. Name one specific use.
:::

:::challenge
1. Convert 1F3E25₁₆ to binary. What is the place value of the F?
2. How many bits are in a MAC address shown as six pairs of hex digits? Explain.
3. Octal (base 8) groups bits in threes. Convert 11011010₂ to octal and to hex. Why did hex win over octal for 8-bit bytes?
4. Write a Python function that converts denary to hex using repeated division by 16, without using `format` or `hex`.
:::

:::recap
- In base b each place is worth b × the place to its right. Binary: 1, 2, 4, 8…; hex: 1, 16, 256, 4096…
- Binary → denary: add the place values under the 1s.
- Denary → binary: subtract place values left to right, **or** divide by 2 and read the remainders **upwards**.
- Hex digits: 0–9, A = 10 … F = 15. Hex → denary: digit × place value, then add.
- **1 hex digit = 4 bits**. Group bits in fours **from the right**; keep inner zeros.
- Hex is a **human** shorthand: shorter, easier to read, fewer errors, instant conversion to binary. It does not save memory.
- Always check by converting back.
:::

:::related
- [5.3 Units of information](#/topic/5.3)
- [5.4 Binary integers and two's complement](#/topic/5.4)
- [5.6 Character coding](#/topic/5.6)
- [9.6 IP addressing and subnets](#/topic/9.6)
:::

*/});
