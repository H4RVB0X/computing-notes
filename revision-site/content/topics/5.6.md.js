CS.registerTopic({ id: "5.6", title: "Character coding and error checking" }, function () {/*

:::objectives
- Explain the difference between the **character code** of a digit and its **pure binary** value (the character '5' versus the number 5).
- Describe **ASCII** (7-bit, 128 characters; extended 8-bit) and **Unicode** (UTF-8, UTF-16, UTF-32), and explain **why Unicode was introduced**.
- Describe and apply **parity bits** (odd and even), **majority voting**, **checksums** and **check digits**.
- Explain what each error-checking method **can and cannot** detect or correct.
- Calculate parity bits, majority-voted bits, simple checksums and ISBN-13 / modulo-11 check digits.
:::

:::quick At a glance
- Text is stored as **character codes**: each character in a **character set** has a unique binary code.
- **'5'** (a character) is ASCII **53 = 0110101**; the **number 5** is pure binary **101**. Different patterns, different meanings.
- **ASCII**: 7 bits → **128** characters (English letters, digits, punctuation, control codes). **Extended ASCII**: 8 bits → 256.
- **Unicode**: a code for every character in every writing system plus symbols and emoji (over a million possible code points). First 128 codes = ASCII. Encoded as **UTF-8** (1–4 bytes), **UTF-16** (2 or 4 bytes), **UTF-32** (4 bytes).
- **Parity bit**: makes the number of 1s even (or odd). Detects any **odd** number of flipped bits; misses an **even** number; cannot say **which** bit.
- **Majority voting**: send each bit 3 (an odd number of) times; take the majority. **Corrects** single errors but **triples** the data.
- **Checksum**: a value calculated from a block of data and sent with it; the receiver recalculates and compares.
- **Check digit**: an extra digit calculated from the other digits (ISBN, barcodes); catches typing errors such as wrong or swapped digits.
:::

:::keyterms
Character set :: A defined list of characters recognised by a computer, each with a unique binary character code. :: The lookup table between characters and numbers.
Character code :: The binary number used to represent a particular character in a character set. :: The number standing for a letter or symbol.
ASCII :: American Standard Code for Information Interchange: a 7-bit character set representing 128 characters. :: The original English-only character set.
Unicode :: A character set designed to represent the characters of all the world's writing systems (plus symbols and emoji); its first 128 codes match ASCII. :: One code for every character on Earth.
Parity bit :: An extra bit added to a group of bits so that the total number of 1s is even (even parity) or odd (odd parity). :: A one-bit "is the count of 1s still right?" check.
Majority voting :: An error-correction method in which each bit is transmitted an odd number of times and the receiver takes the value that occurs most often. :: Send everything three times and trust the majority.
Checksum :: A value calculated from a block of data using an algorithm and transmitted with it; the receiver recalculates it and compares to detect errors. :: A summary number that should still match on arrival.
Check digit :: An extra digit calculated from the other digits of a number and appended to it, used to detect data-entry errors. :: The last digit of an ISBN that proves the rest was typed correctly.
:::

## Characters are numbers too

A computer can only store bits, so every character is given a **numeric code**. A **character set** is the agreed table that maps characters to codes. Sender and receiver must use the **same** character set, or text turns into gibberish.

Characters include:
- upper- and lower-case letters (they have **different** codes),
- digits 0–9 (as characters),
- punctuation and symbols,
- **control characters** such as line feed, carriage return, tab and delete, which are not printed.

## Character code vs pure binary

This distinction is a favourite exam question.

| | The **number** 5 | The **character** '5' |
|---|---|---|
| Meaning | a quantity you can do arithmetic with | a symbol to be displayed or printed |
| Representation | pure binary **101** (00000101 in a byte) | ASCII code 53 = **0110101** (00110101 in a byte) |

:::example The number 35 vs the text "35"
- As an integer: 35 = **00100011** (one byte).
- As text: '3' = 51 = **00110011**, '5' = 53 = **00110101** → two bytes: 00110011 00110101.

The bit patterns are completely different, and adding two pieces of text ("3" + "5") gives "35", not 8.
:::

:::tip The digit trick
The ASCII code of a digit is **48 + its value** (in binary, 011 followed by the 4-bit value). So '7' = 48 + 7 = 55 = 0110111. To turn a digit character into its value, subtract 48: that is what `int()` or `STRING_TO_INT` does for you.
:::

```python
print(ord("5"), format(ord("5"), "07b"))   # 53 0110101  (character code)
print(5, format(5, "b"))                   # 5 101       (pure binary)
print("3" + "5", 3 + 5)                    # 35 8
print(ord("7") - ord("0"))                 # 7  (char -> value)
```

## ASCII

- **7 bits** per character → 2⁷ = **128** codes (0–127).
- Codes 0–31 and 127 are control characters; 32 is space.
- Letters and digits are in **order**, so their codes are easy to work out:

| Character | Denary | 7-bit binary |
|---|---|---|
| '0' | 48 | 011 0000 |
| '9' | 57 | 011 1001 |
| 'A' | 65 | 100 0001 |
| 'Z' | 90 | 101 1010 |
| 'a' | 97 | 110 0001 |
| 'z' | 122 | 111 1010 |

- Lower case = upper case **+ 32**: only one bit differs (A = 1000001, a = 1100001).
- Stored in a byte, ASCII uses a leading 0 (or historically used the 8th bit as a **parity bit**).

:::example If 'F' is 01000110, what is 'G'? What is 'f'?
- 'G' is the next character: 01000110 + 1 = **01000111** (71).
- 'f' = 'F' + 32: 70 + 32 = 102 = **01100110**.
:::

### Extended ASCII

**8 bits** → 256 codes. The extra 128 codes held accented letters, box-drawing symbols and so on. But there were **many different** extended versions (code pages) for different countries, so the same code could mean different characters on different machines.

## Unicode

### Why Unicode was introduced

- ASCII has only **128** characters (256 extended): enough for English, but not for the world's languages. Chinese alone uses tens of thousands of characters.
- Different countries used **incompatible** extended-ASCII code pages, so text exchanged between systems was often garbled.
- The **Internet and World Wide Web** made global exchange of text normal; a single **universal** standard was needed.
- Users also wanted mathematical symbols, arrows, currency signs and **emoji**.

### What Unicode is

- Every character in every writing system gets a unique **code point**, written U+hex (e.g. U+0041 'A', U+20AC '€', U+1F600 😀).
- There is room for over **a million** code points (U+0000 to U+10FFFF).
- The **first 128 code points are the same as ASCII**, so ASCII text is also valid Unicode.

### Encodings

| Encoding | Bytes per character | Notes |
|---|---|---|
| **UTF-8** | **1 to 4** (variable) | ASCII characters use 1 byte, so English text is compact and backwards compatible. Most common on the web. |
| **UTF-16** | 2 or 4 (variable) | Most common characters in 2 bytes. |
| **UTF-32** | always 4 (fixed) | Simple to index (character n is at byte 4n) but uses the most space. |

```python
for ch in "A€😀":
    print(ch, hex(ord(ch)), len(ch.encode("utf-8")), "bytes in UTF-8")
# A 0x41 1 bytes in UTF-8
# € 0x20ac 3 bytes in UTF-8
# 😀 0x1f600 4 bytes in UTF-8
```

:::trap Unicode is not "16-bit ASCII"
Unicode is a **character set** (code points). UTF-8/16/32 are different ways of **encoding** those code points in bits. Don't say "Unicode uses 16 bits": UTF-8 uses 1–4 bytes and UTF-32 uses 4. The mark is for "represents many more characters, including those of all languages / symbols / emoji".
:::

:::trap Disadvantage of Unicode
If asked for a drawback: characters may need **more bytes** than ASCII (UTF-32 uses 4 bytes even for 'A'), so files can be larger.
:::

## Why errors happen

Data sent along a wire or through the air can be corrupted by **interference (noise)**: a 1 is read as a 0 or vice versa. Storage media can also decay. We add **redundant** information so the receiver can **detect** (and sometimes **correct**) errors.

{{tool:error-checking}}

## Parity bits

An extra bit is added to each group of bits (often 7-bit ASCII + 1 parity bit = 1 byte).

- **Even parity**: the parity bit makes the total number of **1s even**.
- **Odd parity**: the parity bit makes the total number of **1s odd**.

The sender and receiver must agree which type is used (and where the parity bit goes: AQA examples usually put it at the **MSB**).

:::example Add a parity bit (as the MSB) to 1011011
The data has **five** 1s.
- **Even parity**: we need an even total, so the parity bit is **1** → **1**1011011 (six 1s).
- **Odd parity**: five is already odd, so the parity bit is **0** → **0**1011011.
:::

:::example Which of these was received with an error? (even parity)
| Received | Number of 1s | Verdict |
|---|---|---|
| 10010101 | 4 | even ✓ |
| 10111011 | 6 | even ✓ |
| 01001111 | 5 | **odd → error** |
:::

**Limitations of parity:**
- If **two** (or any even number of) bits flip, the count stays even/odd, so the error is **not detected**.
- It can **detect** a single error but **not locate or correct** it: the data must be re-sent.

:::trap Count the 1s, not the bits
One of the class slides says "the number of bits is odd". Parity is about the number of **1s** (the total number of bits is always the same). Also, a parity check that "passes" does not prove the data is correct, only that no odd number of bits changed.
:::

## Majority voting

Each bit is sent **three times** (an **odd** number, so there is always a majority). The receiver takes the value that appears most often in each group.

:::example Decode received groups
| Received | Majority | Accepted bit |
|---|---|---|
| 111 | three 1s | 1 |
| 110 | two 1s | **1** |
| 010 | two 0s | **0** |
| 100 | two 0s | **0** |
| 001 | two 0s | 0 |

So 110 010 100 was most likely sent as 111 000 000 and decodes to **1 0 0**.
:::

- **Advantage:** it can **correct** errors (not just detect them), so nothing needs re-sending: good for one-way links such as space probes.
- **Disadvantages:** the amount of data sent is **tripled**; if **two** of the three copies are corrupted, the wrong value is chosen.

:::note Why not send each bit twice?
With two copies, "10" is a tie: you know there is an error but cannot tell which value is right. An odd number of copies avoids ties.
:::

{{trace:5.6-2}}

## Checksums

1. The sender splits the data into a **block** (e.g. a packet) and runs a **checksum algorithm** on it, e.g. adds all the bytes together, keeping only the last 8 bits.
2. The checksum is **sent with** the data.
3. The receiver runs the **same algorithm** on the data it received and compares. If the two checksums differ, an error occurred and the block is re-requested.

:::example Simple additive checksum (sum of bytes mod 256)
| Byte | Binary | Denary |
|---|---|---|
| 1 | 00110011 | 51 |
| 2 | 10100000 | 160 |
| 3 | 11101000 | 232 |
| **Sum** | | 443 |

443 mod 256 = 443 − 256 = **187 = 10111011** → checksum sent with the block.

If byte 3 arrives as 11101100 (236), the receiver gets 447 mod 256 = 191 ≠ 187 → **error detected**.
:::

- **Limitations:** errors that cancel out (one byte up by 4 and another down by 4) or **bytes arriving in the wrong order** give the same sum, so they are missed. A checksum detects, but cannot correct.
- Real protocols use stronger algorithms (e.g. CRC, cryptographic hashes) built on the same idea.

## Check digits

A **check digit** is an extra digit on the end of an identification number, calculated from the other digits. It catches **human data-entry errors**: a mistyped digit or two **swapped (transposed)** digits. Examples: **ISBNs**, product **barcodes** (EAN-13), bank card numbers, IBANs.

### ISBN-13 (modulo 10, weights 1 and 3)

:::steps Calculating an ISBN-13 check digit
1. Take the first 12 digits.
2. Multiply them alternately by **1, 3, 1, 3, …** (starting from the left).
3. Add the results.
4. Check digit = (10 − (total MOD 10)) MOD 10.
:::

:::example Check digit for 978-0-306-40615-?
| Digit | 9 | 7 | 8 | 0 | 3 | 0 | 6 | 4 | 0 | 6 | 1 | 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Weight | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 |
| Product | 9 | 21 | 8 | 0 | 3 | 0 | 6 | 12 | 0 | 18 | 1 | 15 |

Total = 93. 93 MOD 10 = 3. 10 − 3 = **7**. The full ISBN is **978-0-306-40615-7**.

**To verify**, weight all 13 digits the same way: 93 + 7 × 1 = 100, and 100 MOD 10 = 0 → valid.
:::

{{trace:5.6-1}}

### Modulo 11 (the method in your class notes)

:::example Check digit for 4836173
Weights go **8, 7, 6, 5, 4, 3, 2** from left to right (so the rightmost data digit has weight **2**; the check digit itself will have weight 1).

| Digit | 4 | 8 | 3 | 6 | 1 | 7 | 3 |
|---|---|---|---|---|---|---|---|
| Weight | 8 | 7 | 6 | 5 | 4 | 3 | 2 |
| Product | 32 | 56 | 18 | 30 | 4 | 21 | 6 |

Total = **167**. 167 MOD 11 = 2 (11 × 15 = 165). Check digit = 11 − 2 = **9** → **48361739**.

**Verify**: weights 8 … 1 including the check digit: 167 + 9 = 176, and 176 MOD 11 = **0** → valid. (A remainder of 0 gives check digit 0; a check digit of 10 is written **X**.)
:::

:::trap Two slips in the class slide
The mod-11 slide says the weights "start at 2 working **left to right**". They start at 2 at the **right-hand** end and increase leftwards. Its verification line reads "167/11 = 16 remainder 0": it should be **176** ÷ 11 = 16 remainder 0.
:::

::::tabs
:::tab Python
```python
def even_parity_bit(bits):
    return str(bits.count("1") % 2)        # 1 if the count of 1s is odd

def majority(group):
    return "1" if group.count("1") > len(group) // 2 else "0"

def isbn13_check(first12):
    total = 0
    for i, d in enumerate(first12):
        weight = 1 if i % 2 == 0 else 3
        total += int(d) * weight
    return (10 - total % 10) % 10

print(even_parity_bit("1011011"))   # 1
print(majority("110"), majority("010"))  # 1 0
print(isbn13_check("978030640615"))      # 7
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE ISBN13Check(digits)
    total ← 0
    FOR i ← 0 TO 11
        IF i MOD 2 = 0 THEN
            weight ← 1
        ELSE
            weight ← 3
        ENDIF
        total ← total + STRING_TO_INT(digits[i]) * weight
    ENDFOR
    RETURN (10 - total MOD 10) MOD 10
ENDSUBROUTINE
```
:::
::::

## Comparing the methods

| Method | Detects | Corrects? | Overhead | Misses |
|---|---|---|---|---|
| Parity bit | any odd number of bit errors | no | 1 bit per byte | an even number of errors; which bit |
| Majority voting | single error per group | **yes** | ×3 data | 2+ errors in one group |
| Checksum | most errors in a block | no | a few bytes per block | errors that cancel out, reordering (for simple sums) |
| Check digit | mistyped / swapped digits | no | 1 digit | some multiple errors |

:::exam
- **"Explain the difference between the character code and pure binary representation of a digit" (2):** pure binary represents the **value** (5 = 101) and can be used in arithmetic; the character code represents the **symbol** (ASCII '5' = 0110101 / 53) for display/text.
- **"Explain why Unicode was introduced" (2–3):** ASCII has too few characters (128/256); cannot represent other languages/alphabets (e.g. Chinese); needed for global communication on the web; incompatible extended-ASCII versions.
- **"Describe how a parity bit is used" (3):** sender and receiver agree odd/even; sender sets the bit so the count of 1s is even/odd; receiver counts 1s; mismatch → error, request re-send.
- **"Why might an error go undetected?"**: two bits changed (parity); two of three copies wrong (majority); errors cancel (checksum).
- **Majority voting vs parity**: majority **corrects** but sends three times as much data.
:::

:::challenge
1. Find a pair of different 8-bit patterns with the same even-parity bit that differ in exactly two places. What does this show?
2. Show that swapping two adjacent digits of an ISBN-13 is always detected unless the two digits differ by 5.
3. Python's `"€".encode("utf-16")` returns 4 bytes, not 2. Find out why (hint: the BOM).
4. Design a 2D parity scheme (a parity bit for every row and every column of a 4 × 4 block) and show how it can **locate and correct** a single-bit error.
:::

:::recap
- Character code ≠ pure binary: '5' = 0110101 (ASCII 53) but 5 = 101.
- ASCII: 7 bits, 128 characters; extended ASCII 8 bits, 256; letters/digits in order; 'a' = 'A' + 32.
- Unicode: every language + symbols + emoji; first 128 = ASCII; UTF-8 (1–4 bytes), UTF-16 (2/4), UTF-32 (4).
- Parity: count of 1s even/odd; misses even numbers of errors; cannot locate.
- Majority voting: send each bit 3 times; corrects single errors; triples data.
- Checksum: calculated from the block, sent with it, recalculated and compared.
- Check digit: catches data-entry errors; ISBN-13 uses weights 1,3 mod 10; mod-11 uses descending weights.
:::

:::related
- [5.2 Number bases](#/topic/5.2)
- [5.8 Compression and encryption](#/topic/5.8)
- [9.1 Communication](#/topic/9.1)
:::

*/});
