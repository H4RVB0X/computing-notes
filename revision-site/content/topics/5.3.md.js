CS.registerTopic({ id: "5.3", title: "Units of information" }, function () {/*

:::objectives
- State that the **bit** is the fundamental unit of information and that a **byte** is a group of **8 bits**.
- Use the rule **n bits give 2ⁿ different values** in both directions: values from bits, and bits needed for a number of values.
- Distinguish **decimal prefixes** (kilo, mega, giga, tera: powers of 10) from **binary prefixes** (kibi, mebi, gibi, tebi: powers of 2).
- Convert between bits, bytes and the prefixed units accurately, and explain why a "1 TB" drive shows as about 931 GiB.
:::

:::quick At a glance
- **Bit** (binary digit, 0 or 1) = the **fundamental unit of information**. **Byte = 8 bits**. (A nibble = 4 bits.)
- **n bits → 2ⁿ different bit patterns.** 1 bit → 2, 4 bits → 16, 8 bits → 256, 16 bits → 65 536.
- Largest **unsigned** value in n bits = **2ⁿ − 1** (one less, because 0 uses a pattern).
- Bits needed for v different values = the smallest n with **2ⁿ ≥ v**.
- **Decimal (SI) prefixes**: kilo k = 10³, mega M = 10⁶, giga G = 10⁹, tera T = 10¹².
- **Binary (IEC) prefixes**: kibi Ki = 2¹⁰ = 1024, mebi Mi = 2²⁰, gibi Gi = 2³⁰, tebi Ti = 2⁴⁰.
- 1 KiB is 2.4% bigger than 1 kB; the gap grows to about 10% at tebi/tera.
- **b** = bit, **B** = byte: 8 Mb (megabits) = 1 MB (megabyte).
:::

:::keyterms
Bit :: A binary digit, 0 or 1; the fundamental unit of information. :: The smallest piece of data: one on/off.
Byte :: A group of 8 bits. :: Enough for one ASCII character.
Nibble :: A group of 4 bits; half a byte; one hexadecimal digit. :: Half a byte.
Decimal prefix :: A prefix that multiplies by a power of 10: kilo (10³), mega (10⁶), giga (10⁹), tera (10¹²). :: The "metric" thousands.
Binary prefix :: A prefix that multiplies by a power of 2: kibi (2¹⁰), mebi (2²⁰), gibi (2³⁰), tebi (2⁴⁰). :: The "1024" family, names with "bi" in them.
Kibibyte (KiB) :: 2¹⁰ = 1024 bytes. :: The old-fashioned "kilobyte" done properly.
Kilobyte (kB) :: 10³ = 1000 bytes. :: Exactly a thousand bytes.
:::

## Bits and bytes

Everything a computer stores (numbers, text, images, sound, instructions) is ultimately a pattern of **bits**.

- A **bit** is one binary digit: 0 or 1. It is the **fundamental unit of information**, because it is the smallest possible choice: one of two possibilities.
- A **byte** is a group of **8 bits**. Memory is usually *addressed* in bytes, so the byte is the unit you meet most often.
- A **nibble** is 4 bits (one hex digit, [5.2](#/topic/5.2)). It is not an AQA requirement but is handy.

:::trap Lower-case b versus upper-case B
**b = bit, B = byte.** Network speeds are quoted in bits per second (Mbps); file sizes in bytes (MB). A 40 Mbps connection moves at most 5 MB per second. Your textbook writes an image size as "2.36Mb" when it means **MB** (megabytes); in an exam that would be a factor-of-8 mistake.
:::

## How many values can n bits represent?

Each extra bit **doubles** the number of possible patterns: the new bit can be 0 *or* 1 in front of every old pattern.

:::figure Each extra bit doubles the number of patterns
<svg class="diagram" viewBox="0 0 600 190" role="img" aria-label="1 bit gives 2 patterns, 2 bits give 4, 3 bits give 8">
  <g font-family="monospace" font-size="15" fill="currentColor">
    <text x="60" y="24" text-anchor="middle" font-family="inherit" font-weight="bold">1 bit: 2</text>
    <text x="60" y="56" text-anchor="middle">0</text><text x="60" y="80" text-anchor="middle">1</text>
    <text x="230" y="24" text-anchor="middle" font-family="inherit" font-weight="bold">2 bits: 4</text>
    <text x="230" y="56" text-anchor="middle">00</text><text x="230" y="80" text-anchor="middle">01</text><text x="230" y="104" text-anchor="middle">10</text><text x="230" y="128" text-anchor="middle">11</text>
    <text x="440" y="24" text-anchor="middle" font-family="inherit" font-weight="bold">3 bits: 8</text>
    <text x="400" y="56" text-anchor="middle">000</text><text x="400" y="80" text-anchor="middle">001</text><text x="400" y="104" text-anchor="middle">010</text><text x="400" y="128" text-anchor="middle">011</text>
    <text x="480" y="56" text-anchor="middle">100</text><text x="480" y="80" text-anchor="middle">101</text><text x="480" y="104" text-anchor="middle">110</text><text x="480" y="128" text-anchor="middle">111</text>
    <rect x="370" y="40" width="60" height="96" rx="6" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/>
    <rect x="450" y="40" width="60" height="96" rx="6" fill="#5fc9a8" fill-opacity="0.2" stroke="currentColor"/>
    <text x="300" y="172" text-anchor="middle" font-family="inherit">the 2-bit list with a 0 in front, then again with a 1 in front</text>
  </g>
</svg>
:::

> **n bits can represent 2ⁿ different values.**

| n bits | 2ⁿ patterns | largest unsigned value (2ⁿ − 1) | typical use |
|---|---|---|---|
| 1 | 2 | 1 | true/false |
| 4 | 16 | 15 | one hex digit |
| 7 | 128 | 127 | standard ASCII |
| 8 | 256 | 255 | a byte; one colour channel |
| 10 | 1 024 | 1 023 | ≈ "a thousand" |
| 16 | 65 536 | 65 535 | CD sample resolution, UTF-16 unit |
| 24 | 16 777 216 | 16 777 215 | "true colour" (about 16.7 million colours) |
| 32 | 4 294 967 296 | 4 294 967 295 | IPv4 addresses |

:::trap Number of values versus largest value
With 8 bits there are **256** different values but the largest unsigned value is **255**, because one pattern (00000000) is used for zero. Read the question: "how many different values" → 2ⁿ; "largest number" → 2ⁿ − 1. The textbook's "65355 / 65356" for 16 bits is a typo: the correct figures are **65 535** and **65 536**. Similarly 2²⁴ is 16 777 216, not "1677216".
:::

### Working backwards: how many bits do I need?

Find the smallest n so that 2ⁿ is **at least** the number of values required.

:::example How many bits to give each of 300 students a unique ID?
- 2⁸ = 256 → **too few** (256 < 300).
- 2⁹ = 512 → enough (512 ≥ 300).
- So **9 bits** are needed. There is no such thing as 8.2 bits: always round **up**.
:::

:::example Colours and colour depth
A palette has 52 colours. 2⁵ = 32 is too few; 2⁶ = 64 is enough. **Colour depth = 6 bits.** (More on this in [5.7](#/topic/5.7).)
:::

## Decimal prefixes and binary prefixes

Historically "kilobyte" was used loosely for both 1000 and 1024 bytes. To remove the confusion, the IEC introduced separate **binary prefixes** in 1998. AQA expects you to know both families.

| Decimal (SI) | Symbol | Power of 10 | Bytes | | Binary (IEC) | Symbol | Power of 2 | Bytes |
|---|---|---|---|---|---|---|---|---|
| kilobyte | kB | 10³ | 1 000 | | kibibyte | KiB | 2¹⁰ | 1 024 |
| megabyte | MB | 10⁶ | 1 000 000 | | mebibyte | MiB | 2²⁰ | 1 048 576 |
| gigabyte | GB | 10⁹ | 1 000 000 000 | | gibibyte | GiB | 2³⁰ | 1 073 741 824 |
| terabyte | TB | 10¹² | 1 000 000 000 000 | | tebibyte | TiB | 2⁴⁰ | 1 099 511 627 776 |

- Each **decimal** step multiplies by **1000**. Each **binary** step multiplies by **1024**.
- Binary names always contain **"bi"** (kibi = kilo-binary) and the symbols contain an **i** (KiB, MiB).
- Notice the capital **K** in KiB but lower-case **k** in kB.

:::why
Why do binary prefixes exist at all? Memory sizes come naturally in powers of 2: an address bus with 20 lines can address exactly 2²⁰ locations. 2¹⁰ = 1024 is close to 1000, so people borrowed "kilo". The error is 2.4% at kilo, 4.9% at mega, 7.4% at giga and 10% at tera, which is big enough to matter.
:::

:::example Why does my "1 TB" drive show only 931 GB?
The manufacturer uses the **decimal** prefix: 1 TB = 10¹² bytes.
The operating system divides by **2³⁰** but labels the result "GB" (it means GiB):

10¹² ÷ 1 073 741 824 = **931.3 GiB**.

No bytes are missing. Two different units are being used.
:::

:::example Convert 3 MiB to bytes and to MB
- 3 MiB = 3 × 2²⁰ = 3 × 1 048 576 = **3 145 728 bytes**.
- In MB: 3 145 728 ÷ 10⁶ = **3.145728 MB**.
:::

:::example A 4 GiB memory module in GB
4 × 2³⁰ = 4 294 967 296 bytes ÷ 10⁹ = **4.29 GB** (to 3 s.f.).
:::

:::steps Converting between units safely
1. Convert everything to **bytes** (or bits) first.
2. Multiply/divide by **8** to move between bits and bytes.
3. Divide by the right power: 10³, 10⁶, 10⁹, 10¹² for kB/MB/GB/TB; 2¹⁰, 2²⁰, 2³⁰, 2⁴⁰ for KiB/MiB/GiB/TiB.
4. Keep the units on every line of working.
:::

::::tabs
:::tab Python
```python
import math

def bits_needed(values):
    """Smallest n with 2**n >= values (values >= 2)."""
    return math.ceil(math.log2(values))

print(bits_needed(300))          # 9
print(2 ** 16, 2 ** 16 - 1)      # 65536 65535

tb = 10 ** 12                    # a "1 TB" drive in bytes
print(round(tb / 2 ** 30, 1))    # 931.3  (GiB)
print(3 * 2 ** 20)               # 3145728 bytes in 3 MiB
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE BitsNeeded(values)
    n ← 0
    WHILE 2 ^ n < values
        n ← n + 1
    ENDWHILE
    RETURN n
ENDSUBROUTINE

OUTPUT BitsNeeded(300)    # 9
```
:::
::::

:::note Which prefix should I use in calculations?
If a question states a convention (for example "assume 1 kB = 1000 bytes"), follow it exactly. If it uses KiB/MiB, use powers of 2. AQA mark schemes for file-size questions usually accept either 1000 or 1024 **when the question does not specify**, provided you are consistent and say which you used.
:::

:::exam
- **"State the number of bits in a byte" (1):** 8.
- **"How many different values can be represented using 12 bits?" (1):** 2¹² = **4096**. Give the number, not just "2¹²", unless the question allows it.
- **"Explain the difference between a kilobyte and a kibibyte" (2):** kilobyte = 1000 (10³) bytes, decimal prefix; kibibyte = 1024 (2¹⁰) bytes, binary prefix.
- **"Minimum number of bits for v values":** show that 2ⁿ⁻¹ < v ≤ 2ⁿ (e.g. 2⁸ = 256 < 300 ≤ 512 = 2⁹).
- Calculation answers: show units on every line and say which prefix convention you used.
:::

:::challenge
1. A 16 GB memory card (decimal) is formatted. How many GiB will the operating system report?
2. Prove that the largest unsigned value in n bits is 2ⁿ − 1 by adding 1 + 2 + 4 + … + 2ⁿ⁻¹.
3. IPv6 uses 128-bit addresses. Roughly how many addresses is that, written as a power of 10?
4. Why do you think storage manufacturers prefer decimal prefixes while RAM is sold in binary sizes?
:::

:::recap
- **Bit** = fundamental unit of information; **byte** = 8 bits; b = bit, B = byte.
- **n bits → 2ⁿ values**; largest unsigned value **2ⁿ − 1**; bits for v values: smallest n with 2ⁿ ≥ v.
- **Decimal prefixes**: kilo 10³, mega 10⁶, giga 10⁹, tera 10¹² (×1000 each step).
- **Binary prefixes**: kibi 2¹⁰, mebi 2²⁰, gibi 2³⁰, tebi 2⁴⁰ (×1024 each step).
- 1 TB = 10¹² bytes ≈ 931 GiB: different units, not missing space.
- Convert to bytes first, then divide by the correct power.
:::

:::related
- [5.2 Number bases](#/topic/5.2)
- [5.4 Binary integers and two's complement](#/topic/5.4)
- [5.7 Images and sound](#/topic/5.7)
:::

*/});
