CS.registerTopic({ id: "1.1", title: "Data types, variables and constants" }, function () {/*

:::objectives
- Explain what a **data type** is and why a language needs them.
- Choose the right built-in type for a value: **integer, real/float, Boolean, character, string, date/time, pointer/reference, record, array**, and justify the choice in exam wording.
- Define and use **user-defined data types** (records, enumerated types) built from the built-in ones.
- Explain what a **pointer/reference** is and how Python variables are really references to objects.
- Combine the six statement types — **variable declaration, constant declaration, assignment, iteration, selection, subroutine** — in one program.
- Explain the difference between a **variable** and a **constant**, and give the advantages of named constants.
:::

:::quick At a glance
- A **data type** tells the computer **what kind of value** is stored, **how much memory** it needs and **which operations** are allowed on it.
- Built-in types you must know: **integer** (whole), **real/float** (fractional), **Boolean** (True/False), **character** (one symbol), **string** (text), **date/time**, **pointer/reference** (an address), **record** (fields of different types), **array** (same type, indexed from **0**).
- A **user-defined type** is built by the programmer from built-in types, e.g. a **record** (`Student` with name, age, grade) or an **enumerated type** (`Suit = CLUBS, DIAMONDS, HEARTS, SPADES`).
- A **pointer/reference** stores the **memory address** of another value. In Python every variable is a reference: `b = a` makes two names for **one** object.
- A **variable** is a named memory location whose value **can change**; a **constant** is named but its value **cannot change** after it is set.
- Named constants make code **readable**, let you **change a value in one place**, and **stop accidental changes**.
- Six statement types: **declaration**, **constant declaration**, **assignment**, **selection**, **iteration**, **subroutine call**.
:::

:::keyterms
Data type :: A classification that determines the kind of value a variable can hold, the operations that can be performed on it and the amount of memory it occupies. :: What sort of thing is in the box, and what you are allowed to do with it.
Integer :: A whole number, positive, negative or zero, with no fractional part. :: 0, 7, −42.
Real / float :: A number that can have a fractional part, stored as a floating-point value. :: 3.14, −0.5, 2.0.
Boolean :: A data type with exactly two values, True and False. :: A yes/no switch.
Character :: A single symbol from a character set such as ASCII or Unicode, e.g. 'A', '7', '£'. :: One key on the keyboard.
String :: A sequence of characters, e.g. "Hello 123". :: Text; even "007" is a string, not a number.
Date/time :: A data type that stores a calendar date and/or clock time so that date arithmetic and formatting can be done on it. :: Stores 25/12/2026 as a date, not as text.
Pointer / reference :: A data type whose value is the memory address of another data item or object. :: A signpost that says "the real thing is over there".
Record :: A data structure made up of a fixed number of fields, which may be of different data types, grouped under one identifier. :: One row of a table: name, age, grade together.
Array :: A finite, ordered collection of items of the same data type stored under one identifier and accessed by an index, starting at 0. :: A numbered row of identical boxes.
User-defined data type :: A data type defined by the programmer, built from the built-in types, e.g. a record or an enumerated type. :: You design the box shape yourself.
Enumerated type :: A user-defined type whose values are a fixed list of named constants, e.g. Day = {MON, TUE, …}. :: A drop-down list of allowed values.
Variable :: A named location in memory that holds a value which can change while the program runs. :: A labelled box whose contents you can swap.
Constant :: A named value that is set once and cannot be changed while the program runs. :: A labelled box that is glued shut.
Identifier :: The name given to a variable, constant, subroutine, class or type. :: The label on the box.
Declaration :: A statement that introduces an identifier and (in many languages) its data type, reserving memory for it. :: "There will be a box called `total` for integers."
Assignment :: A statement that stores a value in a variable, written `total ← 0` in pseudocode and `total = 0` in Python. :: Put this value in that box.
:::

## Why data types exist

A computer's memory is just bits. The bit pattern `01000001` could mean the integer 65, the character `'A'`, part of a real number or a Boolean. The **data type** is what tells the processor and the compiler how to interpret the pattern.

Data types matter for three reasons:

| Reason | What it means | Example |
|---|---|---|
| **Operations** | The type decides which operations are valid | You can divide two integers; you cannot divide two strings |
| **Memory** | The type decides how many bytes to reserve | A Boolean needs 1 byte (really 1 bit); a 64-bit real needs 8 bytes |
| **Error checking** | The translator can reject nonsense before it runs | `"5" + 3` is a type error in Python |

:::why
Why does `"5" + 3` fail in Python but `"5" + "3"` give `"53"`? Because `+` means **concatenation** for strings and **addition** for numbers. The data type selects which meaning of `+` applies. Languages that do this checking stop whole classes of bugs before the program runs.
:::

## The built-in data types

The specification lists nine types. Learn the **name**, a **definition**, an **example value** and **when to use it**.

| Type | Definition (mark-scheme style) | Example | Use it for | Python |
|---|---|---|---|---|
| **Integer** | Whole number, positive or negative | 42, −7, 0 | counts, indexes, IDs | `int` |
| **Real / float** | Number with a fractional part | 3.75, −0.01 | measurements, money (with care), averages | `float` |
| **Boolean** | True or False only | True | flags, results of comparisons | `bool` |
| **Character** | A single symbol | 'Q', ' ', '9' | one keypress, a grade letter | `str` of length 1 |
| **String** | A sequence of characters | "Hi 2U!" | names, postcodes, phone numbers | `str` |
| **Date/time** | A calendar date and/or clock time | 2026-10-08 09:30 | birthdays, timestamps, deadlines | `datetime` |
| **Pointer/reference** | The memory address of another item | 0x7F3A | linked structures, objects | every name is one |
| **Record** | Fixed set of named fields of possibly different types | {name, age, grade} | one entity with several properties | `dataclass`, `dict` |
| **Array** | Ordered set of items of the **same** type, indexed from 0 | [3, 8, 1] | lists of similar things, tables | `list` |

:::trap
- **A phone number is a string.** "07700 900123" has a leading zero and a space. Stored as an integer it becomes 7700900123 and you can never dial it. Any "number" that you never do arithmetic on (phone numbers, postcodes, account numbers) is a **string**.
- **Character ≠ string.** `'7'` as a character is **not** the number 7. Its ASCII code is 55. To get the number you must convert it (see [1.4](#/topic/1.4)).
- **Money is awkward.** Reals cannot store 0.1 exactly, so £0.10 + £0.20 may not equal £0.30. Exam answer: store pence as an **integer**, or use a decimal type.
- Do not write "number" as a data type. The examiner wants **integer** or **real**.
:::

### Choosing a type: how the examiner thinks

A typical 1-mark-per-item question gives you a scenario and asks for a type **and a reason**. The reason is the mark.

:::example Choose and justify a data type for each item
| Item | Type | Justification (this is what gets the mark) |
|---|---|---|
| Number of pets in a household | Integer | Can only be a whole number |
| Average number of children per household | Real | The average may have a fractional part, e.g. 1.8 |
| Whether the house has central heating | Boolean | Only two possible values, yes or no |
| A telephone number | String | Leading zeros and spaces must be kept; never used in calculations |
| The first letter of a surname | Character | Exactly one symbol is stored |
| Date of birth | Date/time | Allows age to be calculated and dates compared |
| A student's name, age and grade together | Record | Several fields of different types describe one entity |
| The marks of 30 students | Array (of integers) | Many values of the same type, accessed by index |
:::

:::collapse VB.NET equivalents (your school's language)
| AQA type | VB.NET keyword | Python |
|---|---|---|
| Integer | `Integer` (32-bit), `Long` (64-bit) | `int` (unlimited size) |
| Real | `Single`, `Double`, `Decimal` | `float` |
| Boolean | `Boolean` | `bool` |
| Character | `Char` | `str` of length 1 |
| String | `String` | `str` |
| Date/time | `Date` | `datetime.datetime` |
| Record | `Structure … End Structure` | `@dataclass` |
| Array | `Dim a(9) As Integer` | `list` |

Watch out: in VB `Long` is a **64-bit integer**, not a real. `Dim x As Long = 1.123` would be rounded to 1.
:::

## Pointers and references

A **pointer** (or **reference**) is a variable whose value is **the address of another item in memory**, not the item itself. Following the pointer to reach the data is called **dereferencing**.

<svg class="diagram" viewBox="0 0 620 200" role="img" aria-label="A pointer variable p holding address 2F4, with an arrow to memory location 2F4 which holds the value 42">
  <defs><marker id="arr11" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14" fill="currentColor">
    <text x="40" y="30">Variable</text>
    <rect x="40" y="40" width="150" height="50" rx="6" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/>
    <text x="55" y="60" font-size="12">p (a pointer)</text>
    <text x="55" y="80" font-family="monospace">value: 2F4</text>
    <text x="380" y="30">Main memory</text>
    <g font-family="monospace" font-size="13">
      <rect x="380" y="40" width="200" height="28" fill="none" stroke="currentColor"/><text x="390" y="59">2F0</text><text x="470" y="59">"cat"</text>
      <rect x="380" y="68" width="200" height="28" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="390" y="87">2F4</text><text x="470" y="87">42</text>
      <rect x="380" y="96" width="200" height="28" fill="none" stroke="currentColor"/><text x="390" y="115">2F8</text><text x="470" y="115">True</text>
      <rect x="380" y="124" width="200" height="28" fill="none" stroke="currentColor"/><text x="390" y="143">2FC</text><text x="470" y="143">3.5</text>
    </g>
    <line x1="190" y1="65" x2="372" y2="82" stroke="currentColor" stroke-width="1.5" marker-end="url(#arr11)"/>
    <text x="230" y="110" font-size="12">"the value is at address 2F4"</text>
    <text x="40" y="180" font-size="12">Dereferencing p gives 42. Changing p to 2FC would make it point at 3.5 instead.</text>
  </g>
</svg>

Pointers are what make **dynamic data structures** possible: a linked list node stores a pointer to the next node, a tree node stores pointers to its children, and an object variable stores a reference to the object on the **heap**. See [2.1](#/topic/2.1) and [1.8](#/topic/1.8).

### Python: every name is a reference

Python has no explicit pointer syntax, but **every variable is a reference to an object**. Assignment copies the **reference**, not the object. This matters enormously for lists and objects.

```python Two names, one list
a = [1, 2, 3]
b = a            # b now refers to the SAME list object as a
b.append(4)
print(a)         # [1, 2, 3, 4]  <- a changed too!
print(a is b)    # True: same object

c = a.copy()     # a NEW list with the same contents
c.append(5)
print(a)         # [1, 2, 3, 4]
print(c)         # [1, 2, 3, 4, 5]
print(a is c)    # False
```

```python Why integers behave differently
x = 10
y = x            # y refers to the same int object 10
y = y + 1        # creates a NEW int object 11 and rebinds y
print(x, y)      # 10 11  (integers are immutable, so x is untouched)
```

:::trap
"Copying" a list with `b = a` does **not** copy it. If you then change `b`, `a` changes as well because both names point at one object. This is the single most common cause of "my array changed by itself" bugs. Use `a.copy()`, `a[:]` or `list(a)` when you need a separate copy.
:::

## Records and arrays

### Records

A **record** groups a **fixed number of fields** under one identifier. The fields can be **different types**, and you access them by **name**.

::::tabs
:::tab AQA pseudocode
```pseudocode
RECORD Student
    name : String
    age : Integer
    grade : Character
    enrolled : Boolean
ENDRECORD

s ← Student("Amira", 17, 'A', True)
OUTPUT s.name
s.age ← s.age + 1
```
:::
:::tab Python (dataclass)
```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    age: int
    grade: str
    enrolled: bool = True      # default value

s = Student("Amira", 17, "A")
print(s.name)      # Amira
s.age += 1
print(s)           # Student(name='Amira', age=18, grade='A', enrolled=True)
```
:::
:::tab Python (dictionary)
```python
# A dictionary can play the role of a record when you want flexibility
s = {"name": "Amira", "age": 17, "grade": "A"}
print(s["name"])   # Amira
s["age"] += 1
print(s["age"])    # 18
```
:::
::::

### Arrays

An **array** holds many values of the **same type**, accessed by an integer **index**. AQA pseudocode arrays, like Python lists, are **indexed from 0**: the first element of `marks` is `marks[0]`, and an array of length n has last index `n − 1`.

::::tabs
:::tab AQA pseudocode
```pseudocode
marks ← [67, 82, 45, 91]
OUTPUT marks[0]            # 67
marks[2] ← 50
FOR i ← 0 TO LEN(marks) - 1
    OUTPUT marks[i]
ENDFOR

# two-dimensional array: grid[row][column]
grid ← [[1, 2, 3], [4, 5, 6]]
OUTPUT grid[1][2]          # 6
```
:::
:::tab Python
```python
marks = [67, 82, 45, 91]
print(marks[0])            # 67
marks[2] = 50
for i in range(len(marks)):
    print(marks[i])

grid = [[1, 2, 3], [4, 5, 6]]
print(grid[1][2])          # 6
print(len(grid), len(grid[0]))   # 2 rows, 3 columns -> 2 3
```
:::
::::

:::trap
Some older slides say "pseudocode in exams indexes arrays from 1". **For AQA 7517 this is wrong**: AQA pseudocode and the exam papers index arrays from **0** unless the question explicitly says otherwise. If a question says "the array `A` has indexes 1 to 10", follow the question; if it says nothing, assume 0.
:::

| | Record | Array |
|---|---|---|
| Field/element types | may differ | all the same |
| Accessed by | field **name** (`s.age`) | integer **index** (`marks[2]`) |
| Size | fixed number of fields | fixed length (static) or growable (dynamic list) |
| Typical use | one entity with several properties | a collection of similar items |

Combine them: an **array of records** is a table, e.g. `students[3].name`.

## User-defined data types

The built-in types are not always expressive enough. A **user-defined data type** is one the programmer defines, **built from the built-in types**. The two you must know are **records** (above) and **enumerated types**; subrange and set types exist in some languages too.

### Enumerated types

An **enumerated type** lists every value the type is allowed to take. Internally each name is an integer, but the program uses the names.

::::tabs
:::tab Python
```python
from enum import Enum

class Suit(Enum):
    CLUBS = 1
    DIAMONDS = 2
    HEARTS = 3
    SPADES = 4

card_suit = Suit.HEARTS
print(card_suit)            # Suit.HEARTS
print(card_suit.value)      # 3
print(card_suit == Suit.HEARTS)   # True
print([s.name for s in Suit])     # ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES']
```
:::
:::tab Pseudocode / other languages
```pseudocode
# Pascal-style declaration
TYPE Suit = (CLUBS, DIAMONDS, HEARTS, SPADES)
cardSuit ← HEARTS
IF cardSuit = SPADES THEN ...
```
VB.NET uses `Enum Suit … End Enum`.
:::
::::

### Why bother defining your own types?

- **Readability**: `Suit.HEARTS` says more than `3`.
- **Validation**: a variable of type `Suit` cannot be given the value 7; the translator rejects it.
- **Grouping**: a record keeps related data together and travels as one unit through a subroutine's parameters.
- **Maintainability**: change the type definition once; every use updates.

:::exam
"**Explain what is meant by a user-defined data type**" (2 marks) wants: *a data type defined by the programmer* (1) *constructed from built-in / existing data types* (1). Add an example (a record combining a string and two integers) if there is a third mark.
:::

## Variables and constants

### Variables

A **variable** is a **named memory location** whose value **can change** during execution. Three separate ideas:

1. **Declaration** introduces the name (and, in typed languages, the type): VB `Dim total As Integer`; pseudocode may just start using it.
2. **Initialisation** gives the first value: `total ← 0`.
3. **Assignment** stores a (new) value: `total ← total + mark`.

The right-hand side of an assignment is evaluated **first**, then stored. So `count ← count + 1` reads the old value, adds 1, writes the new value back.

:::trap
`count ← count + 1` is **not** an equation (it would be false as maths). The arrow (or `=` in Python) means **"becomes"**. Read it as "count becomes count plus one". Never write `count + 1 ← count`.
:::

### Constants

A **constant** is a **named value that cannot change** while the program runs. It is set when declared.

::::tabs
:::tab AQA pseudocode
```pseudocode
CONSTANT VAT_RATE ← 0.2
CONSTANT MAX_PLAYERS ← 4

price ← 50
total ← price * (1 + VAT_RATE)
OUTPUT total                 # 60.0
```
:::
:::tab Python
```python
# Python has no true constants: by convention UPPER_CASE names are treated as constants
VAT_RATE = 0.2
MAX_PLAYERS = 4

price = 50
total = price * (1 + VAT_RATE)
print(total)                  # 60.0
```
:::
:::tab VB.NET
```text
Const VAT_RATE As Decimal = 0.2
Const MAX_PLAYERS As Integer = 4
' Any later assignment to VAT_RATE is a compile-time error
```
:::
::::

| | Variable | Constant |
|---|---|---|
| Value can change at run time? | Yes | No |
| When is the value set? | Any time, as often as needed | Once, when declared |
| Typical identifier style | `total`, `playerName` | `VAT_RATE`, `MAX_SIZE` |
| Example | current score | number of days in a week |

### Advantages of named constants (learn all four)

1. **Readability**: `area ← PI * r * r` is clearer than `area ← 3.14159 * r * r`; the name says what the value means.
2. **One place to change**: if VAT changes from 20% to 22%, edit the declaration, not 30 scattered literals, so no occurrence is missed.
3. **Protection**: the translator **prevents accidental modification**; a line like `VAT_RATE ← 0` is rejected.
4. **Consistency and fewer typos**: every use is guaranteed to be the same value (no 3.14 here and 3.142 there), and the compiler can substitute the value at compile time for efficiency.

:::note Python constants are a convention
Python lets you reassign `PI = 3`. The capital letters are a signal to other programmers, not a rule the interpreter enforces. In an exam, say "a constant **cannot** be changed" (true in VB, C#, Java) and, if asked about Python, note that it relies on convention.
:::

## The six statement types, combined

The spec wants you to **use and combine**: variable declaration, constant declaration, assignment, iteration, selection and subroutine statements. Here is one program that uses all six.

::::tabs
:::tab AQA pseudocode
```pseudocode
CONSTANT PASS_MARK ← 40                    # constant declaration

SUBROUTINE grade(mark)                     # subroutine definition
    IF mark >= PASS_MARK THEN              # selection
        RETURN "Pass"
    ELSE
        RETURN "Fail"
    ENDIF
ENDSUBROUTINE

marks ← [67, 23, 40, 91]                   # variable declaration + assignment
passes ← 0
FOR i ← 0 TO LEN(marks) - 1                # iteration
    result ← grade(marks[i])               # subroutine call + assignment
    OUTPUT marks[i], result
    IF result = "Pass" THEN
        passes ← passes + 1
    ENDIF
ENDFOR
OUTPUT passes, "passed"
```
:::
:::tab Python
```python
PASS_MARK = 40                      # constant (by convention)

def grade(mark):                    # subroutine definition
    if mark >= PASS_MARK:           # selection
        return "Pass"
    else:
        return "Fail"

marks = [67, 23, 40, 91]            # variable + assignment
passes = 0
for i in range(len(marks)):         # iteration
    result = grade(marks[i])        # subroutine call + assignment
    print(marks[i], result)
    if result == "Pass":
        passes += 1
print(passes, "passed")
```
```output
67 Pass
23 Fail
40 Pass
91 Pass
3 passed
```
:::
::::

:::example Trace the program above
| i | marks[i] | result | passes | OUTPUT |
|---|---|---|---|---|
| | | | 0 | |
| 0 | 67 | Pass | 1 | 67 Pass |
| 1 | 23 | Fail | 1 | 23 Fail |
| 2 | 40 | Pass | 2 | 40 Pass |
| 3 | 91 | Pass | 3 | 91 Pass |
| | | | | 3 passed |

Note the boundary: 40 is **not** less than 40, so `40 >= PASS_MARK` is True and it passes. Boundary values are where examiners set traps.
:::

:::exam
- **"State the most appropriate data type for …"**: give the type **and** a reason. "Integer because the value is always a whole number" scores; "integer" alone may not.
- **"Explain the difference between a variable and a constant"** (2 marks): variable's value **can change** during execution (1); constant's value **cannot change** once set / is fixed at compile time (1).
- **"Give two advantages of using a named constant"**: pick from readability, change in one place, cannot be accidentally altered, consistency. Write each as a full sentence with a consequence ("…so the programmer only has to change one line").
- **"Describe what is meant by a record"**: a data structure of **several fields**, **possibly of different types**, grouped under **one identifier**.
- When a question shows code and asks you to **identify** an assignment / selection / iteration / constant, quote the **line number** and the statement.
:::

:::challenge
1. Write a Python `@dataclass` called `Book` with fields `title`, `author`, `pages` and `on_loan`. Create an array (list) of three books and print the titles of the ones not on loan.
2. Explain, with a diagram, what happens in memory when a Python program runs `a = [5, 6]`, `b = a`, `a = [7, 8]`. Does `b` change? Why not?
3. A program stores prices as reals and sums 100 items of £0.10. Predict whether the total is exactly 10.0 and test it. Propose a better data type.
4. Define an enumerated type for traffic-light states and write a function that returns the next state.
:::

:::recap
- A **data type** fixes what a value can be, how much memory it needs and which operations are valid.
- Nine built-in types: integer, real/float, Boolean, character, string, date/time, pointer/reference, record, array.
- **Record** = fields of different types by name; **array** = same type by index, **from 0**.
- **User-defined types** (records, enumerated types) are built from built-in types for readability and validation.
- A **pointer/reference** holds an address. In Python, `b = a` makes two names for one object; copy explicitly when you need a separate one.
- **Variable** can change; **constant** cannot. Named constants: readable, one place to change, cannot be accidentally altered, consistent.
- Six statement types: declaration, constant declaration, assignment, selection, iteration, subroutine.
:::

:::related
- [1.2 Sequence, selection and iteration](#/topic/1.2)
- [1.4 Strings, random numbers and exception handling](#/topic/1.4) — converting between types
- [2.1 Data structures, arrays, records, files and lists](#/topic/2.1)
- [5.1 Number systems](#/topic/5.1) — how integers and reals are actually stored
:::

*/});
