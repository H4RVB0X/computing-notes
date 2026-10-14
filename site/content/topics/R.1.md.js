CS.registerTopic({ id: "R.1", title: "AQA pseudocode and Python reference" }, function () {/*

:::objectives
- Read every pseudocode construct that appears in AQA exam questions without hesitation.
- Write clear AQA-style pseudocode for assignment, selection, iteration, subroutines, arrays, records, strings, files, exceptions and classes.
- Translate between AQA pseudocode and Python in both directions.
- Avoid the classic translation traps: inclusive `FOR` vs exclusive `range`, `DIV`/`MOD` with negatives, inclusive `SUBSTRING` vs exclusive slices, `REPEAT … UNTIL` vs `while`.
:::

:::quick At a glance
- **Assignment** uses `←`; **equality** uses `=`. `x ← x + 1` is assignment, `IF x = 1` is a comparison.
- **Every block has an END**: `ENDIF`, `ENDWHILE`, `ENDFOR`, `ENDSUBROUTINE`, `UNTIL` closes `REPEAT`.
- `FOR i ← 1 TO 5` runs **1, 2, 3, 4, 5** (inclusive). Python `range(1, 6)` (stop is **exclusive**).
- `REPEAT … UNTIL condition` runs **at least once** and stops when the condition is **True**. Python: `while True:` … `if condition: break`.
- `DIV` = integer division (`//`), `MOD` = remainder (`%`), `/` = real division.
- Arrays are **0-indexed** unless the question says otherwise. `LEN(a)` is the number of elements.
- `SUBSTRING(start, end, s)` **includes** `end`; Python `s[start:end + 1]`. `POSITION(s, c)` ≈ `s.find(c)`.
- Conversions: `STRING_TO_INT`, `STRING_TO_REAL`, `INT_TO_STRING`, `REAL_TO_STRING`, `CHAR_TO_CODE`, `CODE_TO_CHAR` ↔ `int`, `float`, `str`, `str`, `ord`, `chr`.
- In the exam, **any clear, unambiguous pseudocode** is accepted unless a question specifies otherwise. Clarity beats exact keywords.
:::

:::keyterms
Pseudocode :: A structured, language-independent way of writing an algorithm using programming constructs and plain English, intended to be read by people rather than executed. :: Code-shaped English for planning and exams.
Assignment :: Giving a variable a value; in AQA pseudocode written with ←. :: Put a value in a box.
Constant :: A named value that cannot be changed while the program runs. :: A fixed value with a name.
Selection :: A construct that chooses which statements to execute based on a condition (IF, CASE). :: Making a decision.
Definite iteration :: A loop that repeats a number of times known before it starts (FOR). :: Repeat exactly n times.
Indefinite iteration :: A loop that repeats until a condition changes, so the number of repetitions is not known in advance (WHILE, REPEAT). :: Repeat until something happens.
Subroutine :: A named, self-contained block of code that performs a task and can be called from elsewhere; a function returns a value, a procedure does not. :: A reusable mini-program.
Parameter :: A variable in a subroutine's definition that receives a value (an argument) when the subroutine is called. :: The input slot of a subroutine.
Integer division (DIV) :: Division that gives only the whole-number part of the quotient. :: How many whole times it goes in.
Modulus (MOD) :: The remainder after integer division. :: What is left over.
Casting :: Converting a value from one data type to another, e.g. string to integer. :: Changing the type.
Exception :: An error event during execution that disrupts the normal flow, which can be caught and handled. :: A run-time error you can catch.
:::

:::note How strict is AQA pseudocode?
AQA uses a consistent pseudocode style in question papers, and this page follows it. **You are not marked on exact keywords**: mark schemes accept any pseudocode or program code that is clear and unambiguous, unless the question asks for a specific language. What loses marks is **ambiguity** (missing ENDs, unclear indentation, `=` used for both assignment and comparison) and **logic errors**. Where AQA has no fixed form (files, exceptions, classes) this page uses common readable forms; check the current AQA pseudocode guidance for any update.
:::

## 1. Basics: comments, assignment, constants, input and output

| Construct | AQA pseudocode | Python | Notes |
|---|---|---|---|
| Comment | `# this is a comment` | `# this is a comment` | Same in both |
| Assignment | `score ← 0` | `score = 0` | Never write `score = 0` in pseudocode; `=` means "is equal to" |
| Constant | `CONSTANT VAT ← 0.2` | `VAT = 0.2` | Python has no true constants; UPPER_CASE name is the convention |
| Output | `OUTPUT "Total: ", total` | `print("Total:", total)` | |
| Input | `name ← USERINPUT` | `name = input()` | Python `input()` **always returns a string** |
| Input a number | `age ← STRING_TO_INT(USERINPUT)` | `age = int(input())` | Cast before doing arithmetic |

::::tabs
:::tab AQA pseudocode
```pseudocode
CONSTANT VAT ← 0.2
OUTPUT "Enter the price"
price ← STRING_TO_REAL(USERINPUT)
total ← price + price * VAT
OUTPUT "Total: ", total
```
:::
:::tab Python
```python nocheck
VAT = 0.2
print("Enter the price")
price = float(input())
total = price + price * VAT
print("Total:", total)
```
:::
::::

## 2. Operators

| Kind | AQA pseudocode | Python | Example → result |
|---|---|---|---|
| Add, subtract, multiply | `+  -  *` | `+  -  *` | `7 * 3` → 21 |
| Real division | `/` | `/` | `7 / 2` → 3.5 |
| Integer division | `DIV` | `//` | `7 DIV 2` → 3 |
| Remainder | `MOD` | `%` | `7 MOD 2` → 1 |
| Exponent | `^` (where used) | `**` | `2 ^ 3` → 8 |
| Equal / not equal | `=  ≠` | `==  !=` | `5 ≠ 4` → True |
| Less / greater | `<  >  ≤  ≥` | `<  >  <=  >=` | `3 ≤ 3` → True |
| Boolean | `AND  OR  NOT` | `and  or  not` | `NOT (3 > 4)` → True |
| Exclusive or | `XOR` | `!=` on Booleans, `^` on integers bitwise | `True XOR True` → False |
| String join | `+` | `+` | `"ab" + "c"` → "abc" |

```python
print(7 / 2, 7 // 2, 7 % 2)      # 3.5 3 1
print(2 ** 3)                    # 8
print(-7 // 2, -7 % 2)           # -4 1   (Python floors towards minus infinity)
print(int(-7 / 2))               # -3     (truncates towards zero)
a, b = True, False
print(a != b)                    # True   (XOR of two Booleans)
print(0b1100 ^ 0b1010)           # 6      (bitwise XOR: 0110)
```

:::trap DIV, MOD and negative numbers
- Python `//` **floors**: `-7 // 2` is **−4**, and `-7 % 2` is **1**. Many other languages (and many people) **truncate**: −3 remainder −1.
- Exam questions almost always use positive numbers. If a question uses negatives, follow the definition it gives.
- `/` always gives a **real** result in Python 3, even `6 / 3` → `2.0`.
:::

## 3. Selection

::::tabs
:::tab AQA pseudocode
```pseudocode
IF mark ≥ 70 THEN
    grade ← "A"
ELSE IF mark ≥ 50 THEN
    grade ← "B"
ELSE
    grade ← "U"
ENDIF
```
:::
:::tab Python
```python
mark = 64
if mark >= 70:
    grade = "A"
elif mark >= 50:
    grade = "B"
else:
    grade = "U"
print(grade)   # B
```
:::
::::

**CASE-style selection** compares one value against fixed options. AQA papers rarely use it, but it is clear pseudocode if you need it.

::::tabs
:::tab Pseudocode
```pseudocode
CASE option OF
    1: OUTPUT "New game"
    2: OUTPUT "Load game"
    OTHERWISE: OUTPUT "Invalid option"
ENDCASE
```
:::
:::tab Python 3.10+
```python
option = 2
match option:
    case 1:
        print("New game")
    case 2:
        print("Load game")
    case _:
        print("Invalid option")
# Load game
```
:::
::::

:::trap
- `IF x = 5` compares; `x ← 5` assigns. Using `=` for both in pseudocode makes the answer ambiguous.
- Every `IF` needs `ENDIF`. Nested IFs need one `ENDIF` each.
- Order matters in an `ELSE IF` ladder: test `≥ 70` before `≥ 50`, or every A becomes a B.
:::

## 4. Iteration

| Loop | AQA pseudocode | Python | Runs |
|---|---|---|---|
| Count up | `FOR i ← 1 TO 5` … `ENDFOR` | `for i in range(1, 6):` | 1,2,3,4,5 |
| Count from 0 | `FOR i ← 0 TO n - 1` | `for i in range(n):` | 0 … n−1 |
| Step | `FOR i ← 0 TO 10 STEP 2` | `for i in range(0, 11, 2):` | 0,2,4,6,8,10 |
| Count down | `FOR i ← 5 TO 1 STEP -1` | `for i in range(5, 0, -1):` | 5,4,3,2,1 |
| Each item | `FOR item IN list` … `ENDFOR` | `for item in items:` | every element |
| Pre-condition | `WHILE cond` … `ENDWHILE` | `while cond:` | 0 or more times |
| Post-condition | `REPEAT` … `UNTIL cond` | `while True:` … `if cond: break` | 1 or more times |

::::tabs
:::tab AQA pseudocode
```pseudocode
total ← 0
FOR i ← 1 TO 5
    total ← total + i
ENDFOR
OUTPUT total

count ← 10
WHILE count > 0
    count ← count - 3
ENDWHILE
OUTPUT count

guess ← 0
REPEAT
    guess ← guess + 4
UNTIL guess > 10
OUTPUT guess
```
:::
:::tab Python
```python
total = 0
for i in range(1, 6):        # stop value is EXCLUSIVE, so 6 not 5
    total = total + i
print(total)                 # 15

count = 10
while count > 0:
    count = count - 3
print(count)                 # -2

guess = 0
while True:                  # REPEAT
    guess = guess + 4
    if guess > 10:           # UNTIL guess > 10
        break
print(guess)                 # 12
```
:::
::::

:::trap The two biggest translation errors
- **Off-by-one with `range`**: `FOR i ← 1 TO 10` is `range(1, 11)`, **not** `range(1, 10)`.
- **Reversed condition**: `REPEAT … UNTIL x > 10` stops when `x > 10` is **True**. The equivalent `WHILE` loop continues while it is **False**: `while not (x > 10)`, i.e. `while x <= 10`, but only after running the body once.
- `WHILE` may run **zero** times; `REPEAT` always runs **at least once**. Exam questions on validation loops often hinge on this.
:::

## 5. Subroutines

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE showLine(n)          # procedure: no RETURN value
    line ← ""
    FOR i ← 1 TO n
        line ← line + "-"      # + concatenates strings
    ENDFOR
    OUTPUT line
ENDSUBROUTINE

SUBROUTINE area(width, height)  # function: returns a value
    RETURN width * height
ENDSUBROUTINE

showLine(10)
a ← area(3, 4)
OUTPUT a
```
:::
:::tab Python
```python
def show_line(n):            # procedure
    print("-" * n)

def area(width, height):     # function
    return width * height

show_line(10)                # ----------
a = area(3, 4)
print(a)                     # 12
```
:::
::::

- A **function** returns a value and is used in an expression; a **procedure** is called as a statement.
- **Parameters** are the names in the definition (`width, height`); **arguments** are the values passed in the call (`3, 4`).
- Variables created inside a subroutine are **local**: they exist only while it runs. See [1.5](#/topic/1.5).

## 6. Arrays (1D and 2D)

| Operation | AQA pseudocode | Python |
|---|---|---|
| Create with values | `nums ← [5, 3, 8]` | `nums = [5, 3, 8]` |
| Create empty of size 10 | `nums ← array of 10 integers` (describe it) | `nums = [0] * 10` |
| Access / change | `nums[0]`, `nums[2] ← 9` | `nums[0]`, `nums[2] = 9` |
| Length | `LEN(nums)` | `len(nums)` |
| Last element | `nums[LEN(nums) - 1]` | `nums[len(nums) - 1]` or `nums[-1]` |
| 2D create | `grid ← [[1, 2, 3], [4, 5, 6]]` | `grid = [[1, 2, 3], [4, 5, 6]]` |
| 2D access (row, column) | `grid[1][2]` | `grid[1][2]` → 6 |

::::tabs
:::tab AQA pseudocode
```pseudocode
grid ← [[1, 2, 3], [4, 5, 6]]
total ← 0
FOR row ← 0 TO LEN(grid) - 1
    FOR col ← 0 TO LEN(grid[row]) - 1
        total ← total + grid[row][col]
    ENDFOR
ENDFOR
OUTPUT total
```
:::
:::tab Python
```python
grid = [[1, 2, 3], [4, 5, 6]]
total = 0
for row in range(len(grid)):
    for col in range(len(grid[row])):
        total = total + grid[row][col]
print(total)                  # 21

# Pitfall: [[0] * 3] * 2 makes two references to the SAME row
bad = [[0] * 3] * 2
bad[0][0] = 9
print(bad)                    # [[9, 0, 0], [9, 0, 0]]
good = [[0] * 3 for _ in range(2)]
good[0][0] = 9
print(good)                   # [[9, 0, 0], [0, 0, 0]]
```
:::
::::

:::trap
- **Index base**: AQA uses 0-based arrays, but some questions define arrays from 1. **Read the question** and stay consistent.
- The last index is `LEN − 1`, so loops run `FOR i ← 0 TO LEN(a) - 1`. Writing `TO LEN(a)` goes one past the end.
- Python `a[-1]` is valid Python but has no AQA equivalent: write `a[LEN(a) - 1]` in pseudocode.
:::

## 7. Records

::::tabs
:::tab AQA pseudocode
```pseudocode
RECORD Student
    name : String
    age : Integer
    predicted : Character
ENDRECORD

s ← Student("Amira", 17, 'A')
OUTPUT s.name
s.age ← 18
```
:::
:::tab Python
```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    age: int
    predicted: str

s = Student("Amira", 17, "A")
print(s.name)      # Amira
s.age = 18
print(s)           # Student(name='Amira', age=18, predicted='A')
```
:::
::::

A record groups **related fields of different types** under one name. Access a field with a dot: `s.name`.

## 8. Strings

:::figure Inclusive AQA SUBSTRING vs exclusive Python slice
<svg class="diagram" viewBox="0 0 600 170" role="img" aria-label="The string COMPUTER with indices 0 to 7; characters 2 to 5 highlighted as SUBSTRING(2, 5, s) which equals Python s[2:6]">
  <g font-family="inherit" font-size="16">
    <rect x="40" y="40" width="60" height="44" fill="none" stroke="currentColor"/><text x="70" y="68" text-anchor="middle" fill="currentColor">C</text><text x="70" y="32" text-anchor="middle" font-size="12" fill="currentColor">0</text>
    <rect x="100" y="40" width="60" height="44" fill="none" stroke="currentColor"/><text x="130" y="68" text-anchor="middle" fill="currentColor">O</text><text x="130" y="32" text-anchor="middle" font-size="12" fill="currentColor">1</text>
    <rect x="160" y="40" width="60" height="44" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="190" y="68" text-anchor="middle" fill="currentColor">M</text><text x="190" y="32" text-anchor="middle" font-size="12" fill="currentColor">2</text>
    <rect x="220" y="40" width="60" height="44" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="250" y="68" text-anchor="middle" fill="currentColor">P</text><text x="250" y="32" text-anchor="middle" font-size="12" fill="currentColor">3</text>
    <rect x="280" y="40" width="60" height="44" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="310" y="68" text-anchor="middle" fill="currentColor">U</text><text x="310" y="32" text-anchor="middle" font-size="12" fill="currentColor">4</text>
    <rect x="340" y="40" width="60" height="44" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="370" y="68" text-anchor="middle" fill="currentColor">T</text><text x="370" y="32" text-anchor="middle" font-size="12" fill="currentColor">5</text>
    <rect x="400" y="40" width="60" height="44" fill="none" stroke="currentColor"/><text x="430" y="68" text-anchor="middle" fill="currentColor">E</text><text x="430" y="32" text-anchor="middle" font-size="12" fill="currentColor">6</text>
    <rect x="460" y="40" width="60" height="44" fill="none" stroke="currentColor"/><text x="490" y="68" text-anchor="middle" fill="currentColor">R</text><text x="490" y="32" text-anchor="middle" font-size="12" fill="currentColor">7</text>
    <path d="M160 92 V102 H400 V92" fill="none" stroke="currentColor"/>
    <text x="280" y="124" text-anchor="middle" fill="currentColor">SUBSTRING(2, 5, s) = "MPUT"  (end index 5 included)</text>
    <text x="280" y="150" text-anchor="middle" fill="currentColor">Python: s[2:6]  (stop index 6 excluded)</text>
  </g>
</svg>
:::

String `s ← "Computer Science"` (indices 0 to 15):

| Operation | AQA pseudocode | Result | Python |
|---|---|---|---|
| Length | `LEN(s)` | 16 | `len(s)` |
| Position of a character | `POSITION(s, 'e')` | 6 (first occurrence) | `s.find("e")` (−1 if absent) |
| Substring (inclusive end) | `SUBSTRING(0, 3, s)` | "Comp" | `s[0:4]` |
| Single character | `SUBSTRING(4, 4, s)` or `s[4]` | "u" | `s[4]` |
| Join | `"Comp" + "uter"` | "Computer" | `"Comp" + "uter"` |
| String → integer | `STRING_TO_INT("42")` | 42 | `int("42")` |
| String → real | `STRING_TO_REAL("3.5")` | 3.5 | `float("3.5")` |
| Integer → string | `INT_TO_STRING(42)` | "42" | `str(42)` |
| Real → string | `REAL_TO_STRING(3.5)` | "3.5" | `str(3.5)` |
| Character → code | `CHAR_TO_CODE('A')` | 65 | `ord("A")` |
| Code → character | `CODE_TO_CHAR(98)` | 'b' | `chr(98)` |

```python
s = "Computer Science"
print(len(s), s.find("e"), s[0:4], s[4])      # 16 6 Comp u
start, end = 2, 9
print(s[start:end + 1])                        # mputer S  (= SUBSTRING(2, 9, s))
print(int("42") + 1, float("3.5") * 2)         # 43 7.0
print(str(42) + "!", ord("A"), chr(98))        # 42! 65 b

# Caesar shift by 3 using character codes
word, shifted = "CAT", ""
for ch in word:
    shifted = shifted + chr((ord(ch) - ord("A") + 3) % 26 + ord("A"))
print(shifted)                                 # FDW
```

:::trap Substrings
- AQA `SUBSTRING(start, end, s)` **includes** the character at `end`. Python `s[start:end]` **excludes** it, so use `s[start:end + 1]`.
- Some exam questions define their own substring function, e.g. with a *length* as the second argument (as in VB.NET). **Use the definition in the question.**
- `"7" + "3"` is `"73"`; `7 + 3` is `10`. Cast before adding numbers read as text.
:::

## 9. Random numbers

::::tabs
:::tab AQA pseudocode
```pseudocode
dice ← RANDOM_INT(1, 6)        # 1 to 6 inclusive
OUTPUT dice
```
:::
:::tab Python
```python
import random
random.seed(1)                     # fixed seed so the output is repeatable
dice = random.randint(1, 6)        # BOTH ends inclusive, like RANDOM_INT
print(1 <= dice <= 6)              # True
r = random.random()                # real in [0.0, 1.0)
print(0 <= r < 1)                  # True
print(random.randrange(0, 10) < 10)   # randrange stop is EXCLUSIVE -> True
```
:::
::::

## 10. Files

AQA does not fix one syntax for files. Any clear form is accepted; this is a common one.

::::tabs
:::tab Pseudocode
```pseudocode
file ← OPEN("scores.txt", WRITE)
WRITELINE(file, "Aisha,72")
WRITELINE(file, "Ben,65")
CLOSE(file)

file ← OPEN("scores.txt", READ)
total ← 0
WHILE NOT ENDOFFILE(file)
    line ← READLINE(file)
    fields ← SPLIT(line, ",")
    total ← total + STRING_TO_INT(fields[1])
ENDWHILE
CLOSE(file)
OUTPUT total
```
:::
:::tab Python
```python
import os, tempfile
path = os.path.join(tempfile.gettempdir(), "scores_r1.txt")

with open(path, "w") as f:           # "w" overwrites, "a" appends
    f.write("Aisha,72\n")
    f.write("Ben,65\n")

total = 0
with open(path, "r") as f:           # with ... closes the file automatically
    for line in f:
        fields = line.strip().split(",")
        total = total + int(fields[1])
print(total)                         # 137
os.remove(path)
```
:::
::::

- Always **close** the file (Python's `with` does it for you).
- Opening for **write** creates the file or **overwrites** it; **append** adds to the end.
- Text read from a file is a **string**: strip the newline and cast before arithmetic.

## 11. Exceptions

::::tabs
:::tab Pseudocode
```pseudocode
TRY
    age ← STRING_TO_INT(USERINPUT)
CATCH
    OUTPUT "That is not a whole number"
ENDTRY
```
:::
:::tab Python
```python
def to_int(text):
    try:
        return int(text)
    except ValueError:               # catch a specific exception type
        print(f"'{text}' is not a whole number")
        return None

print(to_int("17"))     # 17
print(to_int("abc"))    # prints the message, then None
```
:::
::::

Catch **specific** exceptions where you can; a bare `except:` hides bugs. See [1.4](#/topic/1.4).

## 12. Classes and objects

AQA exam papers usually describe classes with a **class definition** in this style, then use dot notation:

::::tabs
:::tab AQA-style class definition
```pseudocode
Animal = Class
    Public
        Procedure Create(n)        # constructor
        Function GetName
        Procedure Speak
    Private
        Name : String
End

Dog = Class (Animal)               # Dog inherits from Animal
    Public
        Procedure Speak            # overrides Animal.Speak
End

pet ← Dog.Create("Rex")
pet.Speak
```
:::
:::tab Python
```python
class Animal:
    def __init__(self, name):        # constructor
        self.__name = name           # private attribute (name mangling)

    def get_name(self):              # getter: controlled access
        return self.__name

    def speak(self):
        return "..."

class Dog(Animal):                   # inheritance
    def speak(self):                 # overriding = polymorphism
        return self.get_name() + " says woof"

for pet in [Animal("Generic"), Dog("Rex")]:
    print(pet.speak())
# ...
# Rex says woof
```
:::
::::

- **Private** attributes are accessed only through public methods (**encapsulation**).
- A subclass **inherits** attributes and methods, and can **override** them (**polymorphism**). See [1.8](#/topic/1.8).

## Worked example: translating a whole algorithm

:::example Linear search, pseudocode → Python, line by line
```pseudocode
SUBROUTINE linearSearch(items, target)
    i ← 0
    found ← False
    WHILE i < LEN(items) AND found = False
        IF items[i] = target THEN
            found ← True
        ELSE
            i ← i + 1
        ENDIF
    ENDWHILE
    IF found THEN
        RETURN i
    ELSE
        RETURN -1
    ENDIF
ENDSUBROUTINE
```

| Pseudocode | Python | What changed |
|---|---|---|
| `SUBROUTINE linearSearch(items, target)` | `def linear_search(items, target):` | `def`, colon, snake_case |
| `i ← 0` | `i = 0` | `←` becomes `=` |
| `found ← False` | `found = False` | |
| `WHILE i < LEN(items) AND found = False` | `while i < len(items) and not found:` | `AND` → `and`, `= False` → `not` |
| `IF items[i] = target THEN` | `if items[i] == target:` | comparison `=` → `==` |
| `ENDIF`, `ENDWHILE`, `ENDSUBROUTINE` | (indentation ends the block) | no END keywords in Python |

```python
def linear_search(items, target):
    i = 0
    found = False
    while i < len(items) and not found:
        if items[i] == target:
            found = True
        else:
            i = i + 1
    if found:
        return i
    else:
        return -1

print(linear_search([4, 9, 2, 7], 2))   # 2
print(linear_search([4, 9, 2, 7], 5))   # -1
```
:::

:::exam
- **"Write an algorithm"** questions are marked on **logic**, not syntax: one mark per correct step (initialise, loop with correct condition, correct comparison, update, output/return). Any clear pseudocode or code earns them.
- **Initialise** every variable before using it (`total ← 0`). Missing initialisation is the most common lost mark.
- Use **indentation and END keywords** so the examiner can see exactly where each block ends.
- Follow **names and definitions given in the question** (e.g. use `Names` if the question calls the array `Names`, and use its index base).
- In **Paper 1** you write real code in your chosen language; in written questions, pseudocode is usually fine.
- See [R.3 Exam technique](#/topic/R.3) for command words.
:::

:::challenge
1. Translate a `REPEAT … UNTIL` validation loop (keep asking until the input is 1–10) into Python **without** `break`.
2. Write `SUBSTRING(start, end, s)` as a Python function using a loop, without slicing.
3. Convert the Python list comprehension `[x * x for x in range(1, 6) if x % 2 == 1]` into AQA pseudocode using a FOR loop and an array.
:::

:::recap
- `←` assigns, `=` compares; every block has an END (`ENDIF`, `ENDWHILE`, `ENDFOR`, `ENDSUBROUTINE`; `REPEAT … UNTIL`).
- `FOR i ← a TO b` is inclusive → `range(a, b + 1)`. `REPEAT … UNTIL c` → `while True:` … `if c: break`.
- `DIV` → `//`, `MOD` → `%`, `/` → real division. Beware negatives in Python.
- Arrays are 0-indexed; last index `LEN(a) − 1`. 2D: `grid[row][col]`.
- `SUBSTRING(s, e, str)` includes `e` → `str[s:e + 1]`; `POSITION` → `find`; casts: `int`, `float`, `str`, `ord`, `chr`.
- Records: fields with dot notation. Classes: Public/Private, `Class (Parent)` for inheritance.
- Exams accept any clear pseudocode; follow definitions in the question.
:::

:::related
- [1.2 Sequence, selection and iteration](#/topic/1.2)
- [1.4 Strings, random numbers and exception handling](#/topic/1.4)
- [1.5 Subroutines, parameters and scope](#/topic/1.5)
- [2.1 Arrays, records and files](#/topic/2.1)
- [1.8 Object-oriented programming](#/topic/1.8)
- [R.3 Exam technique and command words](#/topic/R.3)
:::

*/});
