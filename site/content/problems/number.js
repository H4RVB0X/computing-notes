/* Python coding practice: number bases, binary arithmetic, check digits and number theory
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "denary-to-binary",
    title: "Denary to binary",
    topic: "5.2",
    difficulty: 1,
    task: `Write a program that asks for a whole number that is zero or more (prompt \`Enter a denary number: \`) and outputs it in binary, **with no leading zeros** (so 0 is output as \`0\`).

Do the conversion yourself by repeated division by 2: **do not** use \`bin()\` or \`format()\`. You may assume the input is valid.

\`\`\`text
Enter a denary number: 13
1101
\`\`\``,
    starter: `number = int(input("Enter a denary number: "))
binary = ""
# build up the binary string here

print(binary)
`,
    tests: [
      { name: "example from the question", input: "13\n", expect: "1101" },
      { name: "even number", input: "6\n", expect: "110" },
      { name: "zero", input: "0\n", expect: "0", hidden: true },
      { name: "one", input: "1\n", expect: "1", hidden: true },
      { name: "largest 8-bit value", input: "255\n", expect: "11111111", hidden: true },
      { name: "needs 9 bits", input: "256\n", expect: "100000000", hidden: true }
    ],
    hints: [
      "`number % 2` is the next bit (from the right); `number // 2` moves on to the remaining bits.",
      "Each new bit goes on the **front**: `binary = str(number % 2) + binary`.",
      "The loop `while number > 0` never runs for 0, so handle 0 as a special case."
    ],
    solution: `number = int(input("Enter a denary number: "))
if number == 0:
    binary = "0"
else:
    binary = ""
    while number > 0:
        binary = str(number % 2) + binary
        number = number // 2
print(binary)
`,
    explain: `**Approach.** Repeatedly divide by 2. The remainders are the bits, produced from least significant to most significant, so each one is added to the *front* of the string.

| number | number MOD 2 | number DIV 2 | binary so far |
|---|---|---|---|
| 13 | 1 | 6 | 1 |
| 6 | 0 | 3 | 01 |
| 3 | 1 | 1 | 101 |
| 1 | 1 | 0 | 1101 |

**Common mistakes**
- Adding each bit to the end, which gives the bits reversed (\`1011\`).
- Outputting an empty line for 0.

**Exam note.** \`bin(13)\` returns \`'0b1101'\` — fine in real code, but a question that asks you to implement the conversion would give no marks for it. The tests can't tell which method you used, so be honest with yourself.`
  },
  {
    id: "binary-to-denary",
    title: "Binary to denary with validation",
    topic: "5.2",
    difficulty: 1,
    task: `Write a program that asks for an unsigned binary number (prompt \`Enter a binary number: \`).

- If the input is empty or contains any character other than \`0\` and \`1\`, output \`Invalid binary number\` and ask again, until a valid number is entered.
- Output the denary value.

Do the conversion yourself: **do not** use \`int(text, 2)\`.

\`\`\`text
Enter a binary number: 102
Invalid binary number
Enter a binary number: 1011
11
\`\`\``,
    tests: [
      { name: "example from the question", input: "102\n1011\n", expect: "Invalid binary number\n11" },
      { name: "eight ones", input: "11111111\n", expect: "255" },
      { name: "zero", input: "0\n", expect: "0", hidden: true },
      { name: "leading zeros", input: "00101\n", expect: "5", hidden: true },
      { name: "letters and empty input", input: "abc\n\n1\n", expect: "Invalid binary number\nInvalid binary number\n1", hidden: true },
      { name: "spaces are not allowed", input: "1 0\n10\n", expect: "Invalid binary number\n2", hidden: true }
    ],
    hints: [
      "Validate with a loop over the characters: the input is valid only if it is not empty and every character is `\"0\"` or `\"1\"`.",
      "Convert left to right: `value = value * 2 + int(bit)` for each bit. (Or add place values 1, 2, 4, 8… from the right.)"
    ],
    solution: `def is_binary(text):
    if text == "":
        return False
    for ch in text:
        if ch != "0" and ch != "1":
            return False
    return True


binary = input("Enter a binary number: ")
while not is_binary(binary):
    print("Invalid binary number")
    binary = input("Enter a binary number: ")

value = 0
for bit in binary:
    value = value * 2 + int(bit)
print(value)
`,
    explain: `**Approach.** Validation first (a loop that repeats until valid), then conversion. Reading left to right, each new bit doubles the value so far and adds the bit: \`1011\` → 1 → 2 → 5 → 11. This is Horner's method; adding the place values 8 + 2 + 1 gives the same answer.

**Validation detail.** An empty string must be rejected explicitly, because a loop over its characters finds nothing wrong. A subroutine \`is_binary\` keeps the main program short and readable.

**Common mistakes**
- Validating with \`int(binary)\` inside \`try\`: \`102\` is a valid integer but not valid binary.
- Using \`int(binary, 2)\` — correct output, but not what the question asked for.`
  },
  {
    id: "denary-to-hex",
    title: "Denary to hexadecimal",
    topic: "5.2",
    difficulty: 2,
    task: `Write a program that converts a denary number to hexadecimal.

- Ask for a number (prompt \`Enter a denary number: \`). If it is not a whole number that is 0 or more, output \`Enter a whole number, 0 or more\` and ask again.
- Output the number in hexadecimal using **capital letters** A–F and no leading zeros (\`0\` for zero).

Do the conversion yourself by repeated division by 16: **do not** use \`hex()\` or \`format()\`.

\`\`\`text
Enter a denary number: -5
Enter a whole number, 0 or more
Enter a denary number: 255
FF
\`\`\``,
    tests: [
      { name: "example from the question", input: "-5\n255\n", expect: "Enter a whole number, 0 or more\nFF" },
      { name: "single digit A", input: "10\n", expect: "A" },
      { name: "zero", input: "0\n", expect: "0", hidden: true },
      { name: "power of 16", input: "4096\n", expect: "1000", hidden: true },
      { name: "text and a decimal rejected", input: "ten\n3.5\n171\n", expect: "Enter a whole number, 0 or more\nEnter a whole number, 0 or more\nAB", hidden: true },
      { name: "BEEF", input: "48879\n", expect: "BEEF", hidden: true },
      { name: "15 and 16 boundary", input: "15\n", expect: "F", hidden: true }
    ],
    hints: [
      "Use a string of digits: `DIGITS = \"0123456789ABCDEF\"`. Then `DIGITS[number % 16]` is the next hex digit (from the right).",
      "Put each digit on the front, then `number = number // 16`, until the number is 0.",
      "Validate with `try`/`except ValueError` around `int(...)` and a check for negative numbers, inside a loop."
    ],
    solution: `DIGITS = "0123456789ABCDEF"

number = -1
while number < 0:
    try:
        number = int(input("Enter a denary number: "))
        if number < 0:
            print("Enter a whole number, 0 or more")
    except ValueError:
        print("Enter a whole number, 0 or more")

if number == 0:
    result = "0"
else:
    result = ""
    while number > 0:
        result = DIGITS[number % 16] + result
        number = number // 16
print(result)
`,
    explain: `**Approach.** The same algorithm as denary → binary but dividing by 16. Remainders 10–15 need letters, and indexing into the string \`"0123456789ABCDEF"\` turns a remainder into the right digit with no \`if\` chain.

255 → 255 MOD 16 = 15 (F), 255 DIV 16 = 15 → 15 MOD 16 = 15 (F), DIV → 0. Result \`FF\`.

**Validation.** Two different failures (not a number; negative) give the same message here. Setting \`number = -1\` before the loop guarantees the loop runs at least once — a common way to write a post-condition loop in Python, which has no \`REPEAT … UNTIL\`.

**Common mistakes:** \`chr(remainder)\` (gives a control character, not a digit); lower-case output (\`ff\`) when the question asks for capitals.`
  },
  {
    id: "twos-complement",
    title: "8-bit two's complement",
    topic: "5.4",
    difficulty: 2,
    task: `Write a program that converts a denary integer into **8-bit two's complement** binary.

- Ask for a whole number (prompt \`Enter a number: \`). You may assume a whole number is entered.
- If it is outside the range −128 to 127, output \`Out of range\` and ask again.
- Output the 8-bit pattern (exactly 8 characters, including leading zeros).

Do not use \`bin()\` or \`format()\`.

\`\`\`text
Enter a number: -6
11111010
\`\`\``,
    tests: [
      { name: "example from the question", input: "-6\n", expect: "11111010" },
      { name: "positive number", input: "5\n", expect: "00000101" },
      { name: "minus one", input: "-1\n", expect: "11111111", hidden: true },
      { name: "most negative", input: "-128\n", expect: "10000000", hidden: true },
      { name: "most positive", input: "127\n", expect: "01111111", hidden: true },
      { name: "zero", input: "0\n", expect: "00000000", hidden: true },
      { name: "out of range both ends", input: "128\n-129\n-100\n", expect: "Out of range\nOut of range\n10011100", hidden: true }
    ],
    hints: [
      "For a negative number, the two's complement pattern is the same as the unsigned pattern of `number + 256` (2⁸).",
      "Convert to binary with exactly 8 bits: loop 8 times, taking `n % 2` and `n // 2` each time.",
      "Alternative: write the positive value in binary, invert every bit, then add 1."
    ],
    solution: `number = int(input("Enter a number: "))
while number < -128 or number > 127:
    print("Out of range")
    number = int(input("Enter a number: "))

if number < 0:
    n = number + 256
else:
    n = number

bits = ""
for i in range(8):
    bits = str(n % 2) + bits
    n = n // 2
print(bits)
`,
    explain: `**Approach.** In 8-bit two's complement the most significant bit has place value −128. A negative number −x is stored with the same bit pattern as the unsigned number 256 − x, so add 256 and convert as usual, always producing exactly 8 bits.

**Check −6 the exam way.** +6 = \`00000110\` → invert = \`11111001\` → add 1 = \`11111010\`. And 256 − 6 = 250 = \`11111010\` ✓.

**Range.** With n bits the range is −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1, so −128 to 127 for 8 bits. There is one more negative value than positive because 0 uses a pattern with MSB 0.

**Common mistakes:** dropping leading zeros (\`101\` instead of \`00000101\`); "flip the bits" without adding 1 (that is one's complement).`
  },
  {
    id: "binary-addition",
    title: "8-bit binary addition",
    topic: "5.4",
    difficulty: 3,
    task: `Write a program that adds two **8-bit unsigned binary** numbers column by column, the way you would on paper.

- Ask for the first number (prompt \`First number: \`) and then the second (prompt \`Second number: \`). Each must be exactly 8 characters, all \`0\` or \`1\`; if not, output \`Must be 8 bits\` and ask for **that** number again.
- Add them bit by bit from the right, carrying as needed. **Do not** convert to denary (no \`int(x, 2)\`).
- Output the 8-bit result, then on the next line \`Overflow\` if there was a carry out of the leftmost column, otherwise \`No overflow\`.

\`\`\`text
First number: 00000101
Second number: 00000011
00001000
No overflow
\`\`\``,
    tests: [
      { name: "example from the question", input: "00000101\n00000011\n", expect: "00001000\nNo overflow" },
      { name: "overflow to zero", input: "11111111\n00000001\n", expect: "00000000\nOverflow" },
      { name: "validation of the first number", input: "101\n0000000a\n01010101\n10101010\n", expect: "Must be 8 bits\nMust be 8 bits\n11111111\nNo overflow", hidden: true },
      { name: "validation of the second number", input: "00000001\n1\n00000001\n", expect: "Must be 8 bits\n00000010\nNo overflow", hidden: true },
      { name: "carry into the MSB is not overflow (unsigned)", input: "01111111\n00000001\n", expect: "10000000\nNo overflow", hidden: true },
      { name: "two MSBs overflow", input: "10000000\n10000000\n", expect: "00000000\nOverflow", hidden: true },
      { name: "mixed carries with overflow", input: "11001100\n01101010\n", expect: "00110110\nOverflow", hidden: true },
      { name: "zero plus zero", input: "00000000\n00000000\n", expect: "00000000\nNo overflow", hidden: true }
    ],
    hints: [
      "Write a function `valid(bits)` that returns True when `len(bits) == 8` and every character is `0` or `1`, and use it in a loop for each input.",
      "Loop `for i in range(7, -1, -1):`. Column total = `int(a[i]) + int(b[i]) + carry` (0 to 3). The result bit is `total % 2`, the new carry is `total // 2`.",
      "After the loop, the remaining `carry` tells you whether there was an overflow."
    ],
    solution: `def valid(bits):
    if len(bits) != 8:
        return False
    for ch in bits:
        if ch != "0" and ch != "1":
            return False
    return True


def read_byte(prompt):
    bits = input(prompt)
    while not valid(bits):
        print("Must be 8 bits")
        bits = input(prompt)
    return bits


a = read_byte("First number: ")
b = read_byte("Second number: ")

result = ""
carry = 0
for i in range(7, -1, -1):
    total = int(a[i]) + int(b[i]) + carry
    result = str(total % 2) + result
    carry = total // 2

print(result)
if carry == 1:
    print("Overflow")
else:
    print("No overflow")
`,
    explain: `**Approach.** Each column adds two bits and the carry in, giving 0–3: \`0 → 0 carry 0\`, \`1 → 1 carry 0\`, \`2 → 0 carry 1\`, \`3 → 1 carry 1\`. That is \`total % 2\` and \`total // 2\`. Work from the rightmost column (index 7) to the left.

**Overflow (unsigned).** A carry out of the most significant column means the true answer needs 9 bits, which an 8-bit register can't hold. \`11001100\` (204) + \`01101010\` (106) = 310 > 255.

**Signed vs unsigned.** \`01111111 + 00000001 = 10000000\` is fine unsigned (127 + 1 = 128) but is overflow in two's complement (the sign flips to −128). This program treats the numbers as unsigned, as the question says.

**Good structure.** A \`read_byte(prompt)\` subroutine reused for both inputs avoids duplicating the validation loop — examiners credit sensible use of subroutines.`
  },
  {
    id: "isbn13-check",
    title: "ISBN-13 check digit",
    topic: "5.6",
    difficulty: 2,
    task: `An ISBN-13 has 13 digits. Multiply the first 12 digits alternately by 1 and 3 (first digit × 1, second × 3, third × 1, …) and add the results to get \`total\`. The check digit is \`(10 - total % 10) % 10\`, and it must equal the 13th digit.

Write a program that asks for an ISBN (prompt \`Enter an ISBN: \`), ignoring any hyphens \`-\`, and outputs:

- \`Invalid format\` if, after removing hyphens, it is not exactly 13 digits
- otherwise \`Valid ISBN\` or \`Invalid ISBN\`.

\`\`\`text
Enter an ISBN: 978-0-306-40615-7
Valid ISBN
\`\`\``,
    tests: [
      { name: "example from the question", input: "978-0-306-40615-7\n", expect: "Valid ISBN" },
      { name: "wrong check digit", input: "9780306406158\n", expect: "Invalid ISBN" },
      { name: "another valid ISBN without hyphens", input: "9781861972712\n", expect: "Valid ISBN", hidden: true },
      { name: "check digit of 0 (total ends in 0)", input: "0000000000000\n", expect: "Valid ISBN", hidden: true },
      { name: "too short", input: "97803064061\n", expect: "Invalid format", hidden: true },
      { name: "letter O instead of zero", input: "97803064O6157\n", expect: "Invalid format", hidden: true },
      { name: "empty input", input: "\n", expect: "Invalid format", hidden: true },
      { name: "two digits swapped", input: "9780360406157\n", expect: "Invalid ISBN", hidden: true }
    ],
    hints: [
      "Build `digits = text.replace(\"-\", \"\")`, then check `len(digits) == 13` and `digits.isdigit()`.",
      "For `i` from 0 to 11, the weight is 1 when `i` is even and 3 when `i` is odd.",
      "Don't forget the outer `% 10`: when `total % 10` is 0, the check digit is 0, not 10."
    ],
    solution: `text = input("Enter an ISBN: ")
digits = text.replace("-", "")
if len(digits) != 13 or not digits.isdigit():
    print("Invalid format")
else:
    total = 0
    for i in range(12):
        if i % 2 == 0:
            total = total + int(digits[i])
        else:
            total = total + 3 * int(digits[i])
    check = (10 - total % 10) % 10
    if check == int(digits[12]):
        print("Valid ISBN")
    else:
        print("Invalid ISBN")
`,
    explain: `**Approach.** Clean the input, check the *format* (13 digits), then the *check digit*. These are two different kinds of check: a format check rejects data that can't be an ISBN at all; the check digit catches typing errors in data that looks right.

**Worked example.** 978030640615: 9 + 21 + 8 + 0 + 3 + 0 + 6 + 12 + 0 + 18 + 1 + 15 = 93. 93 MOD 10 = 3, 10 − 3 = 7 = the 13th digit ✓.

**Exam link.** The ISBN-13 check digit detects every single-digit error and most transpositions (two adjacent digits swapped, unless they differ by 5), because swapped digits get different weights. They do not *correct* errors, and they say nothing about whether the ISBN belongs to a real book.

**Common mistake.** Forgetting the final \`% 10\`, so a total ending in 0 needs a "check digit" of 10.`
  },
  {
    id: "prime-factors",
    title: "Prime factors",
    topic: "1.3",
    difficulty: 2,
    task: `Write a program that outputs the prime factorisation of a number.

- Ask for a whole number of 2 or more (prompt \`Enter a number: \`). If the input is not a whole number, or is less than 2, output \`Enter a whole number of 2 or more\` and ask again.
- Output its prime factors in ascending order, separated by \` x \` (space, x, space). A prime number is output on its own.

\`\`\`text
Enter a number: 360
2 x 2 x 2 x 3 x 3 x 5
\`\`\``,
    tests: [
      { name: "example from the question", input: "360\n", expect: "2 x 2 x 2 x 3 x 3 x 5" },
      { name: "small number", input: "12\n", expect: "2 x 2 x 3" },
      { name: "prime number", input: "97\n", expect: "97" },
      { name: "smallest valid input", input: "2\n", expect: "2", hidden: true },
      { name: "validation", input: "1\nabc\n-8\n1001\n", expect: "Enter a whole number of 2 or more\nEnter a whole number of 2 or more\nEnter a whole number of 2 or more\n7 x 11 x 13", hidden: true },
      { name: "power of two", input: "1024\n", expect: "2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2", hidden: true },
      { name: "square of a prime", input: "49\n", expect: "7 x 7", hidden: true }
    ],
    hints: [
      "Start with `divisor = 2`. While the number is bigger than 1: if `number % divisor == 0`, record the divisor and divide; otherwise add 1 to the divisor.",
      "Because you divide out every 2 before trying 3 (and so on), only primes are ever recorded — 4 can never divide what's left.",
      "Store the factors as strings in a list and print `\" x \".join(factors)`."
    ],
    solution: `number = 0
while number < 2:
    try:
        number = int(input("Enter a number: "))
        if number < 2:
            print("Enter a whole number of 2 or more")
    except ValueError:
        print("Enter a whole number of 2 or more")

factors = []
divisor = 2
while number > 1:
    if number % divisor == 0:
        factors.append(str(divisor))
        number = number // divisor
    else:
        divisor = divisor + 1
print(" x ".join(factors))
`,
    explain: `**Approach.** Trial division: keep dividing by the smallest divisor that works. Dividing out every factor of 2 before moving to 3 means no composite divisor (4, 6, 9…) can ever divide what remains, so every recorded divisor is prime and they come out in ascending order.

**Efficiency (extension).** You can stop once \`divisor * divisor > number\`; whatever is left (if more than 1) is itself prime. That makes large primes much faster.

**Common mistakes**
- Moving on to the next divisor straight after a successful division, so 12 gives \`2 x 3\` and misses the repeated factor 2.
- \`/\` instead of \`//\`: the number becomes a float and output shows \`2.0\`.
- Printing \`" x "\` after every factor, leaving a trailing \` x \`.`
  }
]);
