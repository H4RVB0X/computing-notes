CS.registerTopic({ id: "P.6", title: "Section B: writing a new program" }, function () {/*

:::objectives
- Know what Section B (Q07, 13 marks) asks for and how it is marked: **07.1** your program, **07.2** a screenshot of a specified test.
- Turn a written specification into a working Python program step by step: **exact prompts**, **validation loops**, **core logic**, **output in the required format**.
- Write robust validation with `while` loops and `try/except`.
- Practise on ten Section B-style programs, each with a hint, a model answer, a verified sample run and a runnable test of the core logic.
:::

:::quick At a glance
- Section B is **one** standalone program, **not** connected to the skeleton. ~13 marks, so about **20 minutes**.
- Marks are per feature: **input with the given prompt**, **validation loop**, **each part of the processing**, **output in the stated format**, plus the **test screenshot**.
- Copy prompts and messages **exactly** from the question.
- **Validation = a loop** that repeats until the input is valid. Use `try/except ValueError` around `int(input(...))`.
- **Build in steps and run after each one**: a program that runs but is half done scores more than a complete one that crashes.
- The screenshot must show the **inputs the question names, in order**, and the outputs.
:::

:::keyterms
Specification :: The written description of what a program must do, including its inputs, processing, outputs and any validation. :: The question text.
Validation :: Checking that input is sensible and of the correct type/range before it is processed, and re-requesting it if not. :: Reject rubbish input.
Presence check :: A validation check that some data has been entered. :: Not empty.
Range check :: A validation check that a value lies between given limits. :: 1 to 25 only.
Type check :: A validation check that data is of the expected data type, e.g. an integer. :: Must be a whole number.
Format check :: A validation check that data matches a required pattern, e.g. 13 digits only. :: Right shape.
Test data :: Inputs chosen to check a program: normal, boundary and erroneous values. :: What you type in to prove it works.
:::

## How Section B is marked

| Part | What you submit | Typical marks |
|---|---|---|
| **07.1** | the program code (paste all of it) | ~10–11: one mark per feature (prompt, validation loop, each processing step, output format, structure) |
| **07.2** | screenshot of the test run the question describes | ~2: correct inputs visible **and** correct outputs visible |

A typical mark scheme looks like this (for the Collatz program below):

| Mark | Feature |
|---|---|
| 1 | prompt and input of a number, converted to an integer |
| 2 | validation loop that repeats until the number is positive |
| 3 | handles non-integer input without crashing |
| 4 | loop that continues until the number is 1 |
| 5 | correct halving for even numbers (`// 2`) |
| 6 | correct `3n + 1` for odd numbers |
| 7 | counts the steps correctly |
| 8 | outputs the sequence |
| 9 | outputs the step count in the required format |
| 10–11 | screenshot with the specified inputs and correct output |

:::trap
- **Using `/` instead of `//`** turns integers into reals (`3.0`), which changes the output format and can break later `%` tests.
- **Validation with a single `if`** checks once and then carries on with bad data. It must be a **loop**.
- **Changing the prompt text** ("Enter number" instead of "Enter a positive whole number: ") can lose the input mark. Copy it exactly.
- **Off-by-one ranges**: `range(1, Limit)` stops at `Limit − 1`. "Up to and including" needs `Limit + 1`.
- **Not converting**: `input()` returns a string. `"5" * 2` is `"55"`.
:::

## Technique

<svg class="diagram" viewBox="0 0 660 170" role="img" aria-label="Shape of every Section B program: input, then a validation check that loops back to input when invalid, then processing, then output in the required format">
  <defs><marker id="arrP6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="20" y="50" width="120" height="44" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="80" y="70" text-anchor="middle" stroke="none">Input</text><text x="80" y="86" text-anchor="middle" stroke="none" font-size="11">exact prompt</text>
    <line x1="140" y1="72" x2="183" y2="72" marker-end="url(#arrP6)"/>
    <polygon points="245,30 305,72 245,114 185,72" fill="#f0b429" fill-opacity="0.35"/><text x="245" y="76" text-anchor="middle" stroke="none">valid?</text>
    <path d="M245,114 L245,140 L80,140 L80,96" fill="none" marker-end="url(#arrP6)"/><text x="165" y="158" text-anchor="middle" stroke="none" font-size="12">no: message, ask again (loop)</text>
    <line x1="305" y1="72" x2="353" y2="72" marker-end="url(#arrP6)"/><text x="322" y="64" stroke="none" font-size="12">yes</text>
    <rect x="355" y="50" width="130" height="44" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="420" y="70" text-anchor="middle" stroke="none">Process</text><text x="420" y="86" text-anchor="middle" stroke="none" font-size="11">one rule at a time</text>
    <line x1="485" y1="72" x2="518" y2="72" marker-end="url(#arrP6)"/>
    <rect x="520" y="50" width="125" height="44" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="582" y="70" text-anchor="middle" stroke="none">Output</text><text x="582" y="86" text-anchor="middle" stroke="none" font-size="11">exact format</text>
    <text x="330" y="20" text-anchor="middle" stroke="none" font-size="12">Every Section B program has this shape: each box is worth marks on its own</text>
  </g>
</svg>

:::steps Writing a Section B program in about 20 minutes
1. **Read the specification twice.** Underline every prompt, every message, every rule, and the test in 07.2.
2. **Input + validation first.** Write the prompt exactly, add the validation loop, and print the value. Run it with good and bad input.
3. **Core processing next**, one rule at a time. Run after each rule with a value you can check by hand.
4. **Output in the exact format** the question shows (spacing, wording, separators).
5. **Run the 07.2 test** with the stated inputs; screenshot the whole run.
6. Paste all the code into 07.1.
:::

### Validation patterns you will reuse

::::tabs
:::tab Integer in a range
```python nocheck
Number = 0
while Number < 1 or Number > 25:
    try:
        Number = int(input("Enter a shift (1-25): "))
    except ValueError:
        Number = 0                      # forces another pass of the loop
    if Number < 1 or Number > 25:
        print("Please enter a whole number from 1 to 25")
```
:::
:::tab Flag-controlled
```python nocheck
Valid = False
while not Valid:
    try:
        Number = int(input("Enter a positive whole number: "))
        if Number > 0:
            Valid = True
        else:
            print("The number must be greater than 0")
    except ValueError:
        print("That is not a whole number")
```
:::
:::tab String format
```python nocheck
ISBN = input("Enter a 13-digit ISBN: ")
while len(ISBN) != 13 or not ISBN.isdigit():
    ISBN = input("An ISBN must be exactly 13 digits: ")
```
:::
:::tab Menu letter
```python nocheck
Choice = input("Convert (B)inary to denary or (D)enary to binary? ").upper()
while Choice not in ["B", "D"]:
    Choice = input("Please enter B or D: ").upper()
```
:::
::::

Useful string checks: `s.isdigit()` (all digits, not empty), `s.isalpha()` (all letters, not empty), `s.isupper()`, `s.strip("01") == ""` (only 0s and 1s), `s.replace(" ", "")` (ignore spaces).

:::example Building the Collatz program in steps
1. **Input and validation**: write the flag-controlled loop above; run with `six`, `-4`, `6`. You should see two different messages, then the loop ends.
2. **Core loop**: `while Number != 1:` with the even/odd rule, printing `Number` each time. Run with 6: you should see 3 10 5 16 8 4 2 1.
3. **Counting**: add `Steps += 1` inside the loop. Check by hand: 6 takes 8 steps.
4. **Output format**: build the sequence into one string (start it with the original number) and print "It took 8 steps to reach 1".
5. **Edge case**: run with 1: the loop never runs, so the output is "1" and "It took 0 steps to reach 1". Good.

Each step was a working program, so a crash at step 4 would still leave marks for steps 1–3.
:::

## Practice programs

For each one: write it yourself first, open the hint only if stuck, then compare with the model answer. The **sample run** was produced by running the model answer with exactly those inputs. The **core-logic test** is a version without `input()` that you can run anywhere to check your logic.

### 1. Run-length encoding (prep)

*Section B style · ~13 marks · from your prep page*

Ask the user for a string of capital letters (re-prompt until valid). Output the run-length encoding, e.g. `AAABBCAAAA` → `3A2B1C4A`.

:::collapse Hint
Keep a `Count` of the current run. When the next character differs (or you reach the end), add `str(Count) + letter` to the result and reset the count to 1. Looping to `len(Text)` inclusive with an `i < len(Text)` guard handles the final run.
:::

:::collapse Model answer
```python nocheck
Text = input("Enter a string of capital letters: ")
while Text == "" or not Text.isalpha() or not Text.isupper():
    Text = input("Invalid - enter capital letters only: ")
Encoded = ""
Count = 1
for i in range(1, len(Text) + 1):
    if i < len(Text) and Text[i] == Text[i - 1]:
        Count += 1
    else:
        Encoded += str(Count) + Text[i - 1]
        Count = 1
print(Encoded)
```

**Sample run** (verified):

```output
Enter a string of capital letters: ab1
Invalid - enter capital letters only: AAABBCAAAA
3A2B1C4A
```

**Core-logic test** (runnable, no input needed):

```python
def Encode(Text):
    Encoded = ""
    Count = 1
    for i in range(1, len(Text) + 1):
        if i < len(Text) and Text[i] == Text[i - 1]:
            Count += 1
        else:
            Encoded += str(Count) + Text[i - 1]
            Count = 1
    return Encoded

for Test in ["AAABBCAAAA", "A", "ABC", "ZZZZZZZZZZZZ"]:
    print(Test, "->", Encode(Test))
```

```output
AAABBCAAAA -> 3A2B1C4A
A -> 1A
ABC -> 1A1B1C
ZZZZZZZZZZZZ -> 12Z
```
:::

### 2. ISBN-13 check digit (prep)

*Section B style · ~13 marks · from your prep page*

Ask for a 13-digit ISBN (re-prompt until it is exactly 13 digits). Multiply the digits alternately by 1 and 3, add them up, and output "Valid ISBN" if the total is divisible by 10, otherwise "Invalid ISBN".

:::collapse Hint
`ISBN.isdigit()` and `len(ISBN) == 13` together make the validation condition. Index `i` is even for the ×1 digits (the first digit has index 0).
:::

:::collapse Model answer
```python nocheck
ISBN = input("Enter a 13-digit ISBN: ")
while len(ISBN) != 13 or not ISBN.isdigit():
    ISBN = input("An ISBN must be exactly 13 digits: ")
Total = 0
for i in range(13):
    if i % 2 == 0:
        Total += int(ISBN[i])
    else:
        Total += int(ISBN[i]) * 3
if Total % 10 == 0:
    print("Valid ISBN")
else:
    print("Invalid ISBN")
```

**Sample run** (verified):

```output
Enter a 13-digit ISBN: 978030640615
An ISBN must be exactly 13 digits: 9780306406157
Valid ISBN
```

```output
Enter a 13-digit ISBN: 9780306406158
Invalid ISBN
```

**Core-logic test** (runnable, no input needed):

```python
def IsValidISBN(ISBN):
    Total = 0
    for i in range(13):
        if i % 2 == 0:
            Total += int(ISBN[i])
        else:
            Total += int(ISBN[i]) * 3
    return Total % 10 == 0

for Test in ["9780306406157", "9780306406158", "9781786467683"]:
    print(Test, IsValidISBN(Test))
```

```output
9780306406157 True
9780306406158 False
9781786467683 True
```
:::

### 3. Collatz sequence

*Section B style · ~13 marks · new*

Ask the user to "Enter a positive whole number: " and keep asking until they do. Then repeatedly apply the rule (even → halve, odd → 3n + 1) until the number is 1, printing every number on one line separated by spaces. Finally output "It took N steps to reach 1".

:::collapse Hint
Validate with a `while True` loop around `int(input(...))` inside `try/except ValueError`, and `break` only when the value is greater than 0. Count a step each time the rule is applied, not each number printed.
:::

:::collapse Model answer
```python nocheck
Valid = False
while not Valid:
    try:
        Number = int(input("Enter a positive whole number: "))
        if Number > 0:
            Valid = True
        else:
            print("The number must be greater than 0")
    except ValueError:
        print("That is not a whole number")
Steps = 0
Sequence = str(Number)
while Number != 1:
    if Number % 2 == 0:
        Number = Number // 2
    else:
        Number = 3 * Number + 1
    Steps += 1
    Sequence += " " + str(Number)
print(Sequence)
print(f"It took {Steps} steps to reach 1")
```

**Sample run** (verified):

```output
Enter a positive whole number: six
That is not a whole number
Enter a positive whole number: -4
The number must be greater than 0
Enter a positive whole number: 6
6 3 10 5 16 8 4 2 1
It took 8 steps to reach 1
```

```output
Enter a positive whole number: 1
1
It took 0 steps to reach 1
```

**Core-logic test** (runnable, no input needed):

```python
def Collatz(Number):
    Sequence = [Number]
    while Number != 1:
        if Number % 2 == 0:
            Number = Number // 2
        else:
            Number = 3 * Number + 1
        Sequence.append(Number)
    return Sequence

for Start in [6, 1, 7, 27]:
    S = Collatz(Start)
    print(Start, "steps:", len(S) - 1, "max:", max(S))
```

```output
6 steps: 8 max: 16
1 steps: 0 max: 1
7 steps: 16 max: 52
27 steps: 111 max: 9232
```
:::

### 4. Prime factorisation

*Section B style · ~13 marks · new*

Ask the user to "Enter a whole number greater than 1: " (re-prompt until valid). Output its prime factorisation in the form `60 = 2 x 2 x 3 x 5`. A prime number is shown as e.g. `13 = 13`.

:::collapse Hint
Start with `Divisor = 2`. While the number is greater than 1: if it divides exactly, record the divisor and divide; otherwise increase the divisor by 1. You never need to test whether the divisor is prime: composite divisors can't divide any more by the time you reach them.
:::

:::collapse Model answer
```python nocheck
Valid = False
while not Valid:
    try:
        Number = int(input("Enter a whole number greater than 1: "))
        Valid = Number > 1
        if not Valid:
            print("The number must be greater than 1")
    except ValueError:
        print("That is not a whole number")
Original = Number
Factors = []
Divisor = 2
while Number > 1:
    if Number % Divisor == 0:
        Factors.append(str(Divisor))
        Number = Number // Divisor
    else:
        Divisor += 1
print(f"{Original} = {' x '.join(Factors)}")
```

**Sample run** (verified):

```output
Enter a whole number greater than 1: 1
The number must be greater than 1
Enter a whole number greater than 1: 60
60 = 2 x 2 x 3 x 5
```

```output
Enter a whole number greater than 1: 13
13 = 13
```

**Core-logic test** (runnable, no input needed):

```python
def PrimeFactors(Number):
    Factors = []
    Divisor = 2
    while Number > 1:
        if Number % Divisor == 0:
            Factors.append(Divisor)
            Number = Number // Divisor
        else:
            Divisor += 1
    return Factors

for N in [60, 13, 1001, 1024, 9973]:
    print(N, "=", " x ".join(str(F) for F in PrimeFactors(N)))
```

```output
60 = 2 x 2 x 3 x 5
13 = 13
1001 = 7 x 11 x 13
1024 = 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2 x 2
9973 = 9973
```
:::

### 5. Luhn check for a card number

*Section B style · ~13 marks · new*

Ask the user to "Enter a card number: ". Spaces are allowed and ignored; anything else that is not a digit, or fewer than 2 digits, gives "Invalid input" and asks again. Apply the Luhn algorithm: starting from the **rightmost** digit, double every second digit; if a doubled value is over 9, subtract 9; add all the digits. Output "Valid" if the total is divisible by 10, otherwise "Invalid".

:::collapse Hint
Remove spaces with `.replace(" ", "")`. Loop over the digits from the right: `for i in range(len(Digits) - 1, -1, -1)`, with a counter (or Boolean) that says whether this digit is doubled.
:::

:::collapse Model answer
```python nocheck
Digits = input("Enter a card number: ").replace(" ", "")
while len(Digits) < 2 or not Digits.isdigit():
    print("Invalid input")
    Digits = input("Enter a card number: ").replace(" ", "")
Total = 0
Double = False
for i in range(len(Digits) - 1, -1, -1):
    Value = int(Digits[i])
    if Double:
        Value = Value * 2
        if Value > 9:
            Value = Value - 9
    Total += Value
    Double = not Double
if Total % 10 == 0:
    print("Valid")
else:
    print("Invalid")
```

**Sample run** (verified):

```output
Enter a card number: 4539 14x8
Invalid input
Enter a card number: 4539 1488 0343 6467
Valid
```

```output
Enter a card number: 4539 1488 0343 6468
Invalid
```

**Core-logic test** (runnable, no input needed):

```python
def LuhnValid(Digits):
    Total = 0
    Double = False
    for i in range(len(Digits) - 1, -1, -1):
        Value = int(Digits[i])
        if Double:
            Value = Value * 2
            if Value > 9:
                Value = Value - 9
        Total += Value
        Double = not Double
    return Total % 10 == 0

for Card in ["4539148803436467", "4539148803436468", "79927398713", "79927398710"]:
    print(Card, LuhnValid(Card))
```

```output
4539148803436467 True
4539148803436468 False
79927398713 True
79927398710 False
```
:::

### 6. Harshad numbers

*Section B style · ~13 marks · new*

A Harshad number is divisible by the sum of its own digits (e.g. 18: 1 + 8 = 9 and 18 MOD 9 = 0). Ask the user to "Enter an upper limit (1-1000): " (re-prompt until valid). Output every Harshad number from 1 to the limit on one line, then "There are N Harshad numbers up to L". Do not convert the number to a string to find its digits.

:::collapse Hint
Write a function `DigitSum(N)` that uses `N % 10` to get the last digit and `N // 10` to remove it, until N is 0. Then test `Number % DigitSum(Number) == 0`.
:::

:::collapse Model answer
```python nocheck
def DigitSum(N):
    Total = 0
    while N > 0:
        Total += N % 10
        N = N // 10
    return Total

Limit = 0
while Limit < 1 or Limit > 1000:
    try:
        Limit = int(input("Enter an upper limit (1-1000): "))
    except ValueError:
        Limit = 0
    if Limit < 1 or Limit > 1000:
        print("Please enter a whole number from 1 to 1000")
Harshad = []
for Number in range(1, Limit + 1):
    if Number % DigitSum(Number) == 0:
        Harshad.append(str(Number))
print(" ".join(Harshad))
print(f"There are {len(Harshad)} Harshad numbers up to {Limit}")
```

**Sample run** (verified):

```output
Enter an upper limit (1-1000): 0
Please enter a whole number from 1 to 1000
Enter an upper limit (1-1000): 50
1 2 3 4 5 6 7 8 9 10 12 18 20 21 24 27 30 36 40 42 45 48 50
There are 23 Harshad numbers up to 50
```

```output
Enter an upper limit (1-1000): 100
1 2 3 4 5 6 7 8 9 10 12 18 20 21 24 27 30 36 40 42 45 48 50 54 60 63 70 72 80 81 84 90 100
There are 33 Harshad numbers up to 100
```

**Core-logic test** (runnable, no input needed):

```python
def DigitSum(N):
    Total = 0
    while N > 0:
        Total += N % 10
        N = N // 10
    return Total

print([N for N in range(1, 31) if N % DigitSum(N) == 0])
print(sum(1 for N in range(1, 1001) if N % DigitSum(N) == 0), "Harshad numbers up to 1000")
```

```output
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 20, 21, 24, 27, 30]
213 Harshad numbers up to 1000
```
:::

### 7. Anagram check

*Section B style · ~13 marks · new*

Ask for two words with the prompts "Enter the first word: " and "Enter the second word: ". Each must contain letters only (re-prompt with "Letters only, please"). Ignoring capitals, output "X and Y are anagrams" or "X and Y are not anagrams". Use a dictionary of letter counts rather than sorting.

:::collapse Hint
Write a function that returns a dictionary letter → count for a word (convert to lower case first). Two words are anagrams exactly when their dictionaries are equal (`==` compares dictionaries key by key).
:::

:::collapse Model answer
```python nocheck
def GetWord(Prompt):
    Word = input(Prompt)
    while Word == "" or not Word.isalpha():
        print("Letters only, please")
        Word = input(Prompt)
    return Word

def LetterCounts(Word):
    Counts = {}
    for Letter in Word.lower():
        if Letter in Counts:
            Counts[Letter] += 1
        else:
            Counts[Letter] = 1
    return Counts

Word1 = GetWord("Enter the first word: ")
Word2 = GetWord("Enter the second word: ")
if LetterCounts(Word1) == LetterCounts(Word2):
    print(f"{Word1} and {Word2} are anagrams")
else:
    print(f"{Word1} and {Word2} are not anagrams")
```

**Sample run** (verified):

```output
Enter the first word: Listen
Enter the second word: sil3nt
Letters only, please
Enter the second word: Silent
Listen and Silent are anagrams
```

```output
Enter the first word: apple
Enter the second word: paper
apple and paper are not anagrams
```

**Core-logic test** (runnable, no input needed):

```python
def LetterCounts(Word):
    Counts = {}
    for Letter in Word.lower():
        if Letter in Counts:
            Counts[Letter] += 1
        else:
            Counts[Letter] = 1
    return Counts

for A, B in [("Listen", "Silent"), ("apple", "paper"), ("Dormitory", "dirtyroom"), ("aab", "abb")]:
    print(A, B, LetterCounts(A) == LetterCounts(B))
```

```output
Listen Silent True
apple paper False
Dormitory dirtyroom True
aab abb False
```
:::

### 8. Binary ↔ denary without built-ins

*Section B style · ~13 marks · new*

Ask "Convert (B)inary to denary or (D)enary to binary? " and accept B or D in either case (re-prompt otherwise). For B, ask "Enter a binary number: " (only 0s and 1s, re-prompt) and output its denary value. For D, ask "Enter a denary number (0-255): " (re-prompt until valid) and output the 8-bit binary. Do not use `int(x, 2)`, `bin()` or `format()`.

:::collapse Hint
Binary → denary: work left to right, `Value = Value * 2 + bit` (or add place values from the right). Denary → 8-bit binary: eight times, put `Number % 2` on the **front** of a string and do `Number = Number // 2`.
:::

:::collapse Model answer
```python nocheck
Choice = input("Convert (B)inary to denary or (D)enary to binary? ").upper()
while Choice not in ["B", "D"]:
    Choice = input("Please enter B or D: ").upper()
if Choice == "B":
    Bits = input("Enter a binary number: ")
    while Bits == "" or Bits.strip("01") != "":
        Bits = input("Only 0s and 1s, please: ")
    Value = 0
    for Bit in Bits:
        Value = Value * 2 + int(Bit)
    print(f"{Bits} in denary is {Value}")
else:
    Number = -1
    while Number < 0 or Number > 255:
        try:
            Number = int(input("Enter a denary number (0-255): "))
        except ValueError:
            Number = -1
    Original = Number
    Bits = ""
    for i in range(8):
        Bits = str(Number % 2) + Bits
        Number = Number // 2
    print(f"{Original} in binary is {Bits}")
```

**Sample run** (verified):

```output
Convert (B)inary to denary or (D)enary to binary? x
Please enter B or D: b
Enter a binary number: 1021
Only 0s and 1s, please: 101101
101101 in denary is 45
```

```output
Convert (B)inary to denary or (D)enary to binary? D
Enter a denary number (0-255): 300
Enter a denary number (0-255): 77
77 in binary is 01001101
```

**Core-logic test** (runnable, no input needed):

```python
def ToDenary(Bits):
    Value = 0
    for Bit in Bits:
        Value = Value * 2 + int(Bit)
    return Value

def ToBinary(Number):
    Bits = ""
    for i in range(8):
        Bits = str(Number % 2) + Bits
        Number = Number // 2
    return Bits

print(ToDenary("101101"), ToDenary("11111111"), ToDenary("0"))
print(ToBinary(77), ToBinary(255), ToBinary(0))
print(all(ToDenary(ToBinary(n)) == n for n in range(256)))   # round trip check
```

```output
45 255 0
01001101 11111111 00000000
True
```
:::

### 9. Caesar cipher with validation

*Section B style · ~13 marks · new*

Ask "Enter a message: " (letters and spaces only, not empty; re-prompt) and "Enter a shift (1-25): " (whole number in range; re-prompt). Output the encrypted message: each letter is shifted forward through the alphabet by the shift, wrapping from Z to A, keeping upper or lower case; spaces are unchanged.

:::collapse Hint
`ord` and `chr` with the base `ord("A")` or `ord("a")`: `chr((ord(Ch) - Base + Shift) % 26 + Base)`. Validate the message with a loop over its characters, or `Message.replace(" ", "").isalpha()`.
:::

:::collapse Model answer
```python nocheck
Message = input("Enter a message: ")
while Message.replace(" ", "") == "" or not Message.replace(" ", "").isalpha():
    print("Use letters and spaces only")
    Message = input("Enter a message: ")
Shift = 0
while Shift < 1 or Shift > 25:
    try:
        Shift = int(input("Enter a shift (1-25): "))
    except ValueError:
        Shift = 0
Result = ""
for Ch in Message:
    if Ch == " ":
        Result += " "
    else:
        if Ch.isupper():
            Base = ord("A")
        else:
            Base = ord("a")
        Result += chr((ord(Ch) - Base + Shift) % 26 + Base)
print(Result)
```

**Sample run** (verified):

```output
Enter a message: Hello 2
Use letters and spaces only
Enter a message: Hello World
Enter a shift (1-25): 30
Enter a shift (1-25): x
Enter a shift (1-25): 3
Khoor Zruog
```

```output
Enter a message: Zebra zoo
Enter a shift (1-25): 1
Afcsb app
```

**Core-logic test** (runnable, no input needed):

```python
def Encrypt(Message, Shift):
    Result = ""
    for Ch in Message:
        if Ch == " ":
            Result += " "
        else:
            if Ch.isupper():
                Base = ord("A")
            else:
                Base = ord("a")
            Result += chr((ord(Ch) - Base + Shift) % 26 + Base)
    return Result

print(Encrypt("Hello World", 3))
print(Encrypt("Zebra zoo", 1))
print(Encrypt(Encrypt("Round Trip", 7), 26 - 7))   # decrypting = shifting by 26 - k
```

```output
Khoor Zruog
Afcsb app
Round Trip
```
:::

### 10. Denary to Roman numerals

*Section B style · ~13 marks · new*

Ask "Enter a number from 1 to 3999: " (re-prompt until valid) and output it in Roman numerals, e.g. 1994 → MCMXCIV.

:::collapse Hint
Use two parallel lists from largest to smallest, **including the subtractive pairs**: 1000 M, 900 CM, 500 D, 400 CD, 100 C, 90 XC, 50 L, 40 XL, 10 X, 9 IX, 5 V, 4 IV, 1 I. For each value, while the number is at least that value, add the symbol and subtract.
:::

:::collapse Model answer
```python nocheck
Values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
Symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
Number = 0
while Number < 1 or Number > 3999:
    try:
        Number = int(input("Enter a number from 1 to 3999: "))
    except ValueError:
        Number = 0
Original = Number
Roman = ""
for i in range(len(Values)):
    while Number >= Values[i]:
        Roman += Symbols[i]
        Number -= Values[i]
print(f"{Original} in Roman numerals is {Roman}")
```

**Sample run** (verified):

```output
Enter a number from 1 to 3999: 0
Enter a number from 1 to 3999: MMX
Enter a number from 1 to 3999: 1994
1994 in Roman numerals is MCMXCIV
```

```output
Enter a number from 1 to 3999: 2027
2027 in Roman numerals is MMXXVII
```

**Core-logic test** (runnable, no input needed):

```python
def ToRoman(Number):
    Values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    Symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    Roman = ""
    for i in range(len(Values)):
        while Number >= Values[i]:
            Roman += Symbols[i]
            Number -= Values[i]
    return Roman

for N in [4, 9, 14, 40, 90, 400, 1994, 2027, 3999]:
    print(N, ToRoman(N))
```

```output
4 IV
9 IX
14 XIV
40 XL
90 XC
400 CD
1994 MCMXCIV
2027 MMXXVII
3999 MMMCMXCIX
```
:::


:::exam
- **Prompts and messages** are worth marks only if they match the question. Copy them.
- **Every validation** in the spec needs its own loop; if the spec says "re-prompt", the program must ask again, not stop.
- **Format matters**: `60 = 2 x 2 x 3 x 5` is not the same as `[2, 2, 3, 5]`.
- **Test screenshot**: run exactly the inputs given in 07.2, in order, including the invalid ones, so the validation messages are visible.
- If you run out of time, make sure what you have **runs**. Comment out an unfinished section rather than leave a syntax error.
:::

:::challenge
1. Extend the Roman numerals program to convert **Roman → denary** as well, with validation that rejects strings like `IIII` or `VX`.
2. Write a program that reads words until the user enters a blank line, then prints each word and how often it appeared, most frequent first (dictionary + your own sort).
3. Write the Caesar program's **decrypt** option, and a "crack" option that prints all 25 possible shifts.
4. Find the starting number below 1000 with the longest Collatz sequence. How many steps does it take?
:::

:::recap
- Section B: one standalone program (07.1) + a test screenshot (07.2), about 13 marks.
- Marks per feature: exact prompts, validation **loops**, each processing rule, exact output format, test evidence.
- Build and run in steps; keep it running.
- Patterns: `while` + `try/except ValueError` for numbers; `isdigit`/`isalpha`/`len` for formats; `.upper()` and `in [...]` for menu letters.
- DIV/MOD (`//`, `%`) do most of the digit work: digit sums, base conversion, Luhn, factors.
:::

:::related
- [P.5 Section D: practice modifications](#/topic/P.5)
- [1.2 Sequence, selection and iteration](#/topic/1.2)
- [1.3 Arithmetic, relational and Boolean operators](#/topic/1.3)
- [1.4 Strings, random numbers and exception handling](#/topic/1.4)
:::

*/});
