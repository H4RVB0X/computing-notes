CS.registerTopic({ id: "2.1", title: "Data structures, arrays, records, files and lists" }, function () {/*

:::objectives
- Explain what a **data structure** is and why we choose different structures for different jobs.
- Declare, fill and process **one-dimensional** and **multi-dimensional arrays**, including nested loops over a 2-D array.
- Use a **record** (fields of different types) and an array of records to model real data.
- Read from and write to **text files** and **binary files** in Python, choosing the right open mode.
- Distinguish **static** from **dynamic** data structures, name where each gets its memory (fixed allocation vs the **heap**) and compare their advantages and disadvantages.
- Describe the **list** ADT and how a **linked list** implements it with nodes and pointers, including insertion and deletion.
- Recognise every structure in the AQA family (queue, stack, list, graph, tree, hash table, dictionary, vector) and say what each is for.
:::

:::quick At a glance
- A **data structure** is an organised way of storing related data so it can be processed efficiently. An **abstract data type (ADT)** is defined by its *operations*, not by how it is built.
- **Array**: fixed number of items of the **same type**, stored **contiguously**, accessed **directly by index** (0-based). A **2-D array** needs two indices: `grid[row][col]`.
- **Record**: one item made of named **fields** of **different types** (e.g. name: string, age: integer).
- **Text file**: human-readable characters, one line at a time. **Binary file**: raw bytes, exactly as stored in memory (images, audio, executables, numbers packed compactly).
- Open modes: `"r"` read, `"w"` write (overwrites), `"a"` append; add `b` for binary (`"rb"`, `"wb"`). Always **close** the file (or use `with`).
- **Static** structure: size fixed at compile time, memory contiguous, fast, may waste space or overflow. **Dynamic** structure: grows and shrinks at run time using memory from the **heap**, linked by **pointers**, no overflow until memory runs out, slower access.
- **Linked list**: nodes holding **data + pointer to next**; insert/delete by rewiring pointers, no shuffling; no direct index access.
:::

:::keyterms
Data structure :: A collection of data items organised in a particular way so that they can be stored and processed efficiently. :: A container with rules about how things go in and come out.
Abstract data type (ADT) :: A data type defined by the operations that can be performed on it, independent of how it is implemented. :: The "what it does" contract, not the wiring.
Array :: A static data structure holding a fixed number of items of the same data type in contiguous memory locations, each accessed by an index. :: A numbered row of same-type boxes.
Multi-dimensional array :: An array in which each element is itself identified by two or more indices, e.g. a 2-D array of rows and columns. :: A table (2-D) or a cube (3-D) of boxes.
Record :: A data structure consisting of a fixed number of named fields, each of which can have a different data type. :: One row of a table: name, age, email…
Field :: One named item of data within a record. :: A single column value.
Text file :: A file containing human-readable characters encoded as, e.g., ASCII or Unicode, usually organised in lines. :: Something Notepad can open sensibly.
Binary file :: A file containing data stored as raw bytes in the same form as it is held in memory; not human-readable. :: Images, sound, executables, packed numbers.
Static data structure :: A structure whose size is fixed when the program is compiled and cannot change while it runs, e.g. an array. :: Size decided up front, never changes.
Dynamic data structure :: A structure that can grow and shrink at run time, with memory allocated from the heap as needed, e.g. a linked list. :: Takes and gives back memory while running.
Heap :: A pool of free memory from which dynamic data structures are allocated space at run time. :: The computer's spare-memory cupboard.
Pointer :: A variable that holds the memory address of another item of data. :: An arrow saying "the next bit is over there".
List :: An abstract data type holding an ordered sequence of items that can be inserted, deleted and accessed, which may be static (array) or dynamic (linked list). :: An ordered collection you can add to and remove from anywhere.
Linked list :: A dynamic implementation of a list in which each node holds a data item and a pointer to the next node; the last node's pointer is null. :: A chain of boxes, each pointing to the next.
Null pointer :: A pointer value that points to nothing, used to mark the end of a linked structure. :: The "stop here" sign.
:::

## Why data structures exist

A single variable holds one value. Real programs need thousands: all the pupils in a school, every pixel in a photo, each packet waiting at a router. A **data structure** is a way of grouping related data so the program can **store** it, **find** it and **update** it efficiently.

The spec wants you to know a family of structures and, crucially, *when each is the right choice*. The choice is always a trade-off between **speed of access**, **memory used** and **how easily the structure changes size**.

:::definition Data type vs data structure vs ADT
- A **primitive data type** holds one value: integer, real, Boolean, character (and usually string).
- A **composite data type** is built from primitives: a record, a class.
- A **data structure** organises many values for efficient processing: an array, a linked list, a tree.
- An **abstract data type (ADT)** describes a structure purely by its operations (e.g. a stack: push, pop, peek). How it is implemented underneath (array or linked list) is hidden. This is **abstraction** and **information hiding** in action.
:::

:::why
Why bother with the ADT idea? Because code that only uses `push` and `pop` never breaks when you swap an array stack for a linked-list stack. The interface stays the same. Examiners love the phrase "**independent of implementation**".
:::

## Arrays

An **array** is the simplest data structure: a fixed number of elements of the **same data type**, stored **contiguously** (next to each other) in memory, each identified by an **index**.

- Indexing starts at **0** in AQA pseudocode and Python. An array of size 10 has indices 0 to 9.
- Because the elements are contiguous and the same size, the address of element *i* is `base address + i × element size`. That is why access is **direct** and takes constant time, whatever the index.
- A "pure" array is **static**: its size is set when it is declared and cannot change. Python's `list` is dynamic and can hold mixed types, but we *use* it like an array.

<svg class="diagram" viewBox="0 0 640 150" role="img" aria-label="A one-dimensional array of six integers with indices 0 to 5 shown above each cell and the base address below">
  <defs><marker id="arr21" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <text x="40" y="30" font-size="13">index</text>
    <text x="40" y="75" font-size="13">scores</text>
    <g>
      <text x="150" y="30" text-anchor="middle" font-family="monospace">0</text>
      <text x="230" y="30" text-anchor="middle" font-family="monospace">1</text>
      <text x="310" y="30" text-anchor="middle" font-family="monospace">2</text>
      <text x="390" y="30" text-anchor="middle" font-family="monospace">3</text>
      <text x="470" y="30" text-anchor="middle" font-family="monospace">4</text>
      <text x="550" y="30" text-anchor="middle" font-family="monospace">5</text>
    </g>
    <g stroke="currentColor" fill="#7c9aff" fill-opacity="0.25">
      <rect x="110" y="50" width="80" height="40"/><rect x="190" y="50" width="80" height="40"/><rect x="270" y="50" width="80" height="40"/>
      <rect x="350" y="50" width="80" height="40"/><rect x="430" y="50" width="80" height="40"/><rect x="510" y="50" width="80" height="40"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="150" y="76">72</text><text x="230" y="76">65</text><text x="310" y="76">88</text><text x="390" y="76">91</text><text x="470" y="76">54</text><text x="550" y="76">77</text>
    </g>
    <line x1="150" y1="130" x2="150" y2="95" stroke="currentColor" marker-end="url(#arr21)"/>
    <text x="150" y="145" text-anchor="middle" font-size="12">base address, e.g. 1000</text>
    <line x1="390" y1="130" x2="390" y2="95" stroke="currentColor" marker-end="url(#arr21)"/>
    <text x="390" y="145" text-anchor="middle" font-size="12">scores[3] lives at 1000 + 3 × 4 = 1012</text>
  </g>
</svg>

::::tabs
:::tab AQA pseudocode
```pseudocode
scores ← [72, 65, 88, 91, 54, 77]
OUTPUT scores[2]            # 88
scores[4] ← 60              # overwrite one element

total ← 0
FOR i ← 0 TO LEN(scores) - 1
    total ← total + scores[i]
ENDFOR
OUTPUT total / LEN(scores)  # mean
```
:::
:::tab Python
```python
scores = [72, 65, 88, 91, 54, 77]
print(scores[2])         # 88
scores[4] = 60           # overwrite one element

total = 0
for i in range(len(scores)):
    total = total + scores[i]
print(total / len(scores))   # 75.5

# Python idiom: loop over the values directly
print(max(scores), min(scores))   # 91 60
```
:::
::::

### Two-dimensional arrays

A **2-D array** is an array of arrays: think of a table with **rows** and **columns**. You need **two indices** to pick an element. AQA writes `grid[row][col]`; some languages write `grid[row, col]`.

<svg class="diagram" viewBox="0 0 520 210" role="img" aria-label="A two-dimensional array with 3 rows and 4 columns; element at row 1 column 2 is highlighted">
  <g font-family="inherit" font-size="14">
    <text x="120" y="22" text-anchor="middle" font-size="12">col 0</text>
    <text x="200" y="22" text-anchor="middle" font-size="12">col 1</text>
    <text x="280" y="22" text-anchor="middle" font-size="12">col 2</text>
    <text x="360" y="22" text-anchor="middle" font-size="12">col 3</text>
    <text x="40" y="60" font-size="12">row 0</text>
    <text x="40" y="110" font-size="12">row 1</text>
    <text x="40" y="160" font-size="12">row 2</text>
    <g stroke="currentColor" fill="none">
      <rect x="80" y="35" width="80" height="45"/><rect x="160" y="35" width="80" height="45"/><rect x="240" y="35" width="80" height="45"/><rect x="320" y="35" width="80" height="45"/>
      <rect x="80" y="85" width="80" height="45"/><rect x="160" y="85" width="80" height="45"/><rect x="320" y="85" width="80" height="45"/>
      <rect x="80" y="135" width="80" height="45"/><rect x="160" y="135" width="80" height="45"/><rect x="240" y="135" width="80" height="45"/><rect x="320" y="135" width="80" height="45"/>
    </g>
    <rect x="240" y="85" width="80" height="45" stroke="currentColor" fill="#7c9aff" fill-opacity="0.45"/>
    <g text-anchor="middle" fill="currentColor">
      <text x="120" y="63">11</text><text x="200" y="63">12</text><text x="280" y="63">5</text><text x="360" y="63">2</text>
      <text x="120" y="113">15</text><text x="200" y="113">6</text><text x="280" y="113">10</text><text x="360" y="113">5</text>
      <text x="120" y="163">10</text><text x="200" y="163">8</text><text x="280" y="163">12</text><text x="360" y="163">5</text>
    </g>
    <text x="430" y="113" font-family="monospace" font-size="13">grid[1][2] = 10</text>
    <text x="260" y="202" text-anchor="middle" font-size="12">First index = row, second = column. Be consistent.</text>
  </g>
</svg>

To visit every element you use a **nested loop**: the outer loop walks the rows, the inner loop walks the columns of that row.

::::tabs
:::tab AQA pseudocode
```pseudocode
grid ← [[11, 12, 5, 2],
        [15, 6, 10, 5],
        [10, 8, 12, 5]]

FOR row ← 0 TO 2
    rowTotal ← 0
    FOR col ← 0 TO 3
        rowTotal ← rowTotal + grid[row][col]
    ENDFOR
    OUTPUT "Row ", row, " total ", rowTotal
ENDFOR
```
:::
:::tab Python
```python
grid = [[11, 12, 5, 2],
        [15, 6, 10, 5],
        [10, 8, 12, 5]]

for row in range(3):
    row_total = 0
    for col in range(4):
        row_total = row_total + grid[row][col]
    print("Row", row, "total", row_total)
# Row 0 total 30
# Row 1 total 36
# Row 2 total 35

# Column totals: swap the loop order
for col in range(4):
    print(sum(grid[row][col] for row in range(3)), end=" ")
print()   # 36 26 27 12

# Building an empty 2-D array of zeros (5 rows x 3 cols)
board = [[0] * 3 for _ in range(5)]
print(len(board), len(board[0]))   # 5 3
```
:::
::::

:::trap
- `grid[1][2]` is **row 1, column 2**, i.e. the *second* row and *third* column. Students lose marks by reading it as (x, y). Decide which index is which and stick to it.
- Loop bounds: an array of size *n* runs from `0` to `n - 1`. Writing `FOR i ← 1 TO n` skips the first element and crashes on the last.
- `board = [[0] * 3] * 5` in Python makes five references to the **same** inner list, so changing one row changes them all. Use the comprehension shown above.
:::

{{trace:2.1-1}}

## Records

An array holds items of **one** type. A **record** holds **several named fields of different types** that belong together, e.g. a pupil's name (string), form (string), age (integer) and whether they have paid for a trip (Boolean).

::::tabs
:::tab AQA pseudocode
```pseudocode
RECORD Pupil
    name : String
    form : String
    age : Integer
    paid : Boolean
ENDRECORD

p ← Pupil("Aisha", "12B", 17, True)
OUTPUT p.name       # Aisha
p.paid ← False
```
:::
:::tab Python (class as a record)
```python
class Pupil:
    def __init__(self, name, form, age, paid):
        self.name = name
        self.form = form
        self.age = age
        self.paid = paid

p = Pupil("Aisha", "12B", 17, True)
print(p.name)        # Aisha
p.paid = False
print(p.paid)        # False
```
:::
:::tab Python (dictionary as a record)
```python
p = {"name": "Aisha", "form": "12B", "age": 17, "paid": True}
print(p["name"])     # Aisha
p["paid"] = False
print(p)
```
:::
::::

### Array of records

Combining the two gives a table: each element of the array is one record. This is how a **file of records** is modelled in memory.

```python
class Pupil:
    def __init__(self, name, form, age, paid):
        self.name, self.form, self.age, self.paid = name, form, age, paid

pupils = [Pupil("Aisha", "12B", 17, True),
          Pupil("Ben", "12A", 16, False),
          Pupil("Chloe", "12B", 17, True)]

# Everyone in 12B who has paid
for p in pupils:
    if p.form == "12B" and p.paid:
        print(p.name)
# Aisha
# Chloe
```

:::tip
Exam questions often give you a record definition and ask you to **declare an array of 30 of them** and **access one field**. Answer in the form: `pupils ← array of 30 Pupil` then `pupils[4].age`.
:::

## Files

Data in variables disappears when the program ends. A **file** on secondary storage keeps it. The spec requires you to read and write both **text** and **binary** files.

| | Text file | Binary file |
|---|---|---|
| Contents | characters (ASCII/Unicode), usually in lines ending `\n` | raw bytes, exactly as the data is held in memory |
| Readable in an editor? | yes | no (looks like garbage) |
| Size of the integer 70000 | 5 characters = 5 bytes (plus a newline) | 4 bytes as a 32-bit integer |
| Typical uses | CSV exports, config files, logs, source code | images, audio, video, executables, databases, saved game state |
| Python mode | `"r"`, `"w"`, `"a"` | `"rb"`, `"wb"`, `"ab"` |
| Python reads/writes | `str` | `bytes` |

### Open modes and closing

- `"r"` **read**: file must exist; reading starts at the beginning.
- `"w"` **write**: creates the file if missing, **wipes it if it exists**, then writes from the start.
- `"a"` **append**: creates if missing, otherwise adds to the **end**; existing data is kept.
- Add `"b"` for binary. Add `"+"` to allow both reading and writing.
- A file must be **closed** when you finish so the operating system flushes buffered data to disk and releases the lock. `with open(...) as f:` closes it automatically, even if an error occurs.

:::trap
- Opening with `"w"` when you meant `"a"` **destroys the existing contents**. This is the classic file-handling mistake.
- Everything read from a text file is a **string**. `"72"` is not `72`; convert with `int()` before doing arithmetic.
- Each line read keeps its trailing newline `\n`. Call `.strip()` before splitting or comparing.
- Forgetting to close (or not using `with`) can leave the last writes unsaved.
:::

### Text files in Python

The example creates a file in a temporary folder, writes three lines, then reads them back line by line and processes each one. Run it: it works anywhere.

```python
import os, tempfile

folder = tempfile.mkdtemp()                 # a scratch folder we are allowed to write in
path = os.path.join(folder, "scores.txt")

# --- write (mode "w" creates/overwrites) ---
with open(path, "w") as f:
    f.write("Aisha,72\n")
    f.write("Ben,65\n")
    f.write("Chloe,88\n")

# --- append (mode "a" keeps existing lines) ---
with open(path, "a") as f:
    f.write("Dev,91\n")

# --- read line by line ---
total = 0
with open(path, "r") as f:
    for line in f:
        name, score = line.strip().split(",")   # strip the newline, split the fields
        total = total + int(score)              # text -> integer
        print(name, "scored", score)
print("Mean:", total / 4)        # Mean: 79.0

# --- other ways to read ---
with open(path) as f:
    whole = f.read()             # one big string
print(whole.count("\n"))         # 4 lines
with open(path) as f:
    lines = f.readlines()        # list of strings, newlines kept
print(lines[0])                  # 'Aisha,72\n'
```

```pseudocode AQA-style pseudocode for the same read loop
file ← OPEN("scores.txt", READ)
total ← 0
WHILE NOT ENDOFFILE(file)
    line ← READLINE(file)
    fields ← SPLIT(line, ",")
    total ← total + INT(fields[1])
ENDWHILE
CLOSE(file)
```

### Binary files in Python

Binary files hold **bytes**. You write a `bytes` object (or `bytearray`) and read bytes back. To pack numbers larger than 255, or reals, you use the `struct` module to turn them into a fixed number of bytes.

```python
import os, tempfile, struct

path = os.path.join(tempfile.mkdtemp(), "data.bin")

# --- write ---
with open(path, "wb") as f:
    f.write(bytes([5, 10, 15, 200]))        # four single bytes (0-255 each)
    f.write(struct.pack("<i", 70000))        # one 32-bit signed integer, little-endian = 4 bytes
    f.write(struct.pack("<d", 3.25))         # one 64-bit real = 8 bytes

print(os.path.getsize(path))                 # 16 bytes in total

# --- read ---
with open(path, "rb") as f:
    data = f.read()                          # a bytes object
print(list(data[:4]))                        # [5, 10, 15, 200]
print(struct.unpack("<i", data[4:8])[0])     # 70000
print(struct.unpack("<d", data[8:16])[0])    # 3.25

# Compare: the same integer as TEXT takes 5 bytes
print(len("70000".encode("ascii")))          # 5
```

:::why Why have binary files at all?
- **Compact**: 70000 is 4 bytes in binary, 5 as text; a million reals as text might be 20 MB, as binary 8 MB.
- **Exact**: a real written as text may be rounded; binary keeps the exact bit pattern.
- **Fast**: no conversion between characters and numbers on every read.
- **Necessary**: images, sound and executables *are* bytes. There is no sensible text version.
The cost is that you must know the **format** (what each byte means) to read it back.
:::

:::example Saving an array of records to a binary file
Each `Pupil` record is packed into a fixed-size block: a 10-byte name padded with spaces, then a 1-byte age, then a 1-byte Boolean. Fixed-size blocks mean record *n* is always at byte `n × 12`, so it can be read **directly** without reading the earlier records.
```python
import os, tempfile, struct
path = os.path.join(tempfile.mkdtemp(), "pupils.bin")
pupils = [("Aisha", 17, True), ("Ben", 16, False), ("Chloe", 17, True)]
fmt = "<10sB?"                       # 10-char string, unsigned byte, Boolean = 12 bytes
with open(path, "wb") as f:
    for name, age, paid in pupils:
        f.write(struct.pack(fmt, name.ljust(10).encode("ascii"), age, paid))

size = struct.calcsize(fmt)          # 12
with open(path, "rb") as f:
    f.seek(1 * size)                 # jump straight to record 1 (Ben)
    name, age, paid = struct.unpack(fmt, f.read(size))
print(name.decode("ascii").strip(), age, paid)    # Ben 16 False
```
:::

## Static versus dynamic data structures

This distinction runs through the whole of Section 2, so learn it properly.

| | Static | Dynamic |
|---|---|---|
| Size | fixed when declared / at compile time | grows and shrinks at run time |
| Memory comes from | a block reserved in advance | the **heap**, allocated and freed as needed |
| Layout | **contiguous** (one block) | nodes can be anywhere; linked by **pointers** |
| Access | **direct** by index, very fast | usually **sequential**, following pointers |
| Can it overflow? | yes, when full | only when the heap is exhausted |
| Wasted memory | yes, if you reserve more than you use | none, but each node needs extra space for its pointer(s) |
| Examples | array, record, array-based stack/queue | linked list, linked-list stack/queue, tree, most Python lists/dicts |

:::definition The heap
The **heap** is a region of memory set aside for data whose size is not known until the program runs. When a dynamic structure needs a new node it requests memory from the heap; when a node is deleted the memory is returned (in Python this happens automatically through garbage collection). The structure's nodes are joined by **pointers**: variables holding memory addresses.
:::

:::trap
- "A dynamic structure is bigger" is wrong. Say it **changes size at run time** and takes memory **from the heap**.
- The textbook's claim that stacks and queues *are* dynamic structures is a simplification. Any ADT can be implemented either way: an **array-based stack is static**, a **linked-list stack is dynamic**. Say which implementation you mean.
- Advantage/disadvantage questions need **both sides**: static is fast and predictable but wastes memory or overflows; dynamic is memory-efficient and never "full" but slower and needs pointer storage.
:::

## Lists and linked lists

A **list** is an ADT: an ordered collection in which you can **insert**, **delete**, **find** and **traverse** items. It can be implemented statically (an array with a count of used slots) or dynamically (a **linked list**).

In an array-based list, inserting in the middle means **shuffling every later element along** by one, and deleting means shuffling them back. A linked list avoids all of that: each **node** stores its data plus a **pointer** to the next node, and the list is held together by a **head pointer**. Insert or delete = **change two pointers**.

<svg class="diagram" viewBox="0 0 640 110" role="img" aria-label="A linked list: head pointer to node 12, which points to node 7, which points to node 30, whose pointer is null">
  <g font-family="inherit" font-size="14">
    <text x="20" y="52" font-weight="bold">head</text>
    <line x1="62" y1="48" x2="108" y2="48" stroke="currentColor" marker-end="url(#arr21)"/>
    <g stroke="currentColor" fill="#7c9aff" fill-opacity="0.25">
      <rect x="110" y="28" width="60" height="40"/><rect x="170" y="28" width="40" height="40"/>
      <rect x="290" y="28" width="60" height="40"/><rect x="350" y="28" width="40" height="40"/>
      <rect x="470" y="28" width="60" height="40"/><rect x="530" y="28" width="40" height="40"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="140" y="53">12</text><text x="320" y="53">7</text><text x="500" y="53">30</text>
      <text x="550" y="53">∅</text>
    </g>
    <line x1="190" y1="48" x2="288" y2="48" stroke="currentColor" marker-end="url(#arr21)"/>
    <line x1="370" y1="48" x2="468" y2="48" stroke="currentColor" marker-end="url(#arr21)"/>
    <text x="140" y="92" text-anchor="middle" font-size="12">data</text>
    <text x="190" y="92" text-anchor="middle" font-size="12">next</text>
    <text x="550" y="92" text-anchor="middle" font-size="12">null = end</text>
  </g>
</svg>

### Inserting a node

To insert `19` after the node holding `7`:

1. Create the new node on the heap and store `19` in it.
2. Point the new node's `next` at whatever `7` currently points to (`30`).
3. Point `7`'s `next` at the new node.

Do step 2 **before** step 3, or you lose the rest of the list.

<svg class="diagram" viewBox="0 0 640 190" role="img" aria-label="Inserting 19 after 7: the new node points to 30, then 7 is re-pointed to the new node; the old link from 7 to 30 is crossed out">
  <g font-family="inherit" font-size="14">
    <text x="20" y="52" font-weight="bold">head</text>
    <line x1="62" y1="48" x2="108" y2="48" stroke="currentColor" marker-end="url(#arr21)"/>
    <g stroke="currentColor" fill="#7c9aff" fill-opacity="0.25">
      <rect x="110" y="28" width="60" height="40"/><rect x="170" y="28" width="40" height="40"/>
      <rect x="290" y="28" width="60" height="40"/><rect x="350" y="28" width="40" height="40"/>
      <rect x="470" y="28" width="60" height="40"/><rect x="530" y="28" width="40" height="40"/>
    </g>
    <g stroke="currentColor" fill="#5ec27a" fill-opacity="0.35">
      <rect x="380" y="130" width="60" height="40"/><rect x="440" y="130" width="40" height="40"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="140" y="53">12</text><text x="320" y="53">7</text><text x="500" y="53">30</text><text x="550" y="53">∅</text>
      <text x="410" y="155">19</text>
    </g>
    <line x1="190" y1="48" x2="288" y2="48" stroke="currentColor" marker-end="url(#arr21)"/>
    <line x1="370" y1="48" x2="468" y2="48" stroke="currentColor" stroke-dasharray="5,4" opacity="0.5"/>
    <line x1="405" y1="36" x2="433" y2="60" stroke="currentColor" stroke-width="2"/>
    <line x1="433" y1="36" x2="405" y2="60" stroke="currentColor" stroke-width="2"/>
    <path d="M370,56 Q375,150 378,150" fill="none" stroke="currentColor" marker-end="url(#arr21)"/>
    <path d="M460,130 Q470,90 495,72" fill="none" stroke="currentColor" marker-end="url(#arr21)"/>
    <text x="250" y="150" font-size="12">③ 7.next ← new</text>
    <text x="500" y="110" font-size="12">② new.next ← 30</text>
    <text x="330" y="182" font-size="12">① create node 19 on the heap</text>
  </g>
</svg>

### Deleting a node

To delete the node holding `7`: find the node **before** it (`12`) and set `12.next ← 7.next`. Nothing else moves; the memory for `7` is returned to the heap. If the node to delete is the first one, move `head` instead.

<svg class="diagram" viewBox="0 0 640 120" role="img" aria-label="Deleting node 7: node 12's pointer is redirected straight to node 30, bypassing 7">
  <g font-family="inherit" font-size="14">
    <text x="20" y="52" font-weight="bold">head</text>
    <line x1="62" y1="48" x2="108" y2="48" stroke="currentColor" marker-end="url(#arr21)"/>
    <g stroke="currentColor" fill="#7c9aff" fill-opacity="0.25">
      <rect x="110" y="28" width="60" height="40"/><rect x="170" y="28" width="40" height="40"/>
      <rect x="470" y="28" width="60" height="40"/><rect x="530" y="28" width="40" height="40"/>
    </g>
    <g stroke="currentColor" fill="#e06c75" fill-opacity="0.25" stroke-dasharray="4,3">
      <rect x="290" y="28" width="60" height="40"/><rect x="350" y="28" width="40" height="40"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="140" y="53">12</text><text x="320" y="53">7</text><text x="500" y="53">30</text><text x="550" y="53">∅</text>
    </g>
    <line x1="190" y1="48" x2="288" y2="48" stroke="currentColor" stroke-dasharray="5,4" opacity="0.4"/>
    <line x1="370" y1="48" x2="468" y2="48" stroke="currentColor" stroke-dasharray="5,4" opacity="0.4"/>
    <path d="M190,40 Q330,-10 468,40" fill="none" stroke="currentColor" stroke-width="2" marker-end="url(#arr21)"/>
    <text x="320" y="105" text-anchor="middle" font-size="12">12.next ← 7.next   (node 7 is unreachable and its memory is freed)</text>
  </g>
</svg>

::::tabs
:::tab Python linked list
```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None          # null pointer

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_front(self, data):
        node = Node(data)
        node.next = self.head
        self.head = node

    def insert_after(self, target, data):
        p = self.head
        while p is not None and p.data != target:
            p = p.next
        if p is None:
            return False          # target not found
        node = Node(data)
        node.next = p.next        # step 2 first!
        p.next = node             # step 3
        return True

    def delete(self, target):
        if self.head is None:
            return False
        if self.head.data == target:
            self.head = self.head.next
            return True
        prev = self.head
        while prev.next is not None and prev.next.data != target:
            prev = prev.next
        if prev.next is None:
            return False
        prev.next = prev.next.next    # bypass the node
        return True

    def traverse(self):
        items, p = [], self.head
        while p is not None:
            items.append(p.data)
            p = p.next
        return items

lst = LinkedList()
for v in (30, 7, 12):
    lst.insert_front(v)
print(lst.traverse())            # [12, 7, 30]
lst.insert_after(7, 19)
print(lst.traverse())            # [12, 7, 19, 30]
lst.delete(7)
print(lst.traverse())            # [12, 19, 30]
```
:::
:::tab Pseudocode: traverse and insert
```pseudocode
# traverse
p ← head
WHILE p ≠ NULL
    OUTPUT p.data
    p ← p.next
ENDWHILE

# insert newNode after node p
newNode.next ← p.next
p.next ← newNode

# delete the node after prev
prev.next ← prev.next.next
```
:::
:::tab Linked list in arrays (exam favourite)
```pseudocode
# Three parallel arrays model a linked list without real pointers.
data ← [12, 7, 30, 19]
next ← [2, -1, 3, 1]     # -1 means null
head ← 0

p ← head
WHILE p ≠ -1
    OUTPUT data[p]
    p ← next[p]
ENDWHILE
# outputs 12, 30, 19, 7 — follow the next[] values, not the array order
```
:::
::::

{{trace:2.1-2}}

### Try it: linked list visualiser

{{tool:linked-list-demo}}

:::trap Array list vs linked list: say *why*
| Operation | Array (static list) | Linked list (dynamic) |
|---|---|---|
| Access item *n* | direct, constant time | must walk from head: linear time |
| Insert/delete in middle | shuffle all later items | change two pointers |
| Memory | fixed, contiguous, may waste or overflow | per-node pointer overhead, from the heap |
| Search (unsorted) | linear search | linear search |
| Binary search possible? | yes, if sorted | no (no direct access) |
A linked list is **not** "faster". It is faster at *insert/delete* and slower at *access by position*.
:::

## The AQA family of structures

Spec point 4.2.1.4 asks you to know the **concept and uses** of all of these. Each has its own page; this table is the map.

| Structure | One-line concept | Typical uses | Page |
|---|---|---|---|
| **Queue** | FIFO: add at rear, remove from front | print spooling, keyboard buffer, process scheduling, BFS | [2.2](#/topic/2.2) |
| **Stack** | LIFO: push and pop at the top | call stack and recursion, undo, RPN evaluation, DFS, interrupts | [2.3](#/topic/2.3) |
| **List** | ordered sequence with insert/delete anywhere | general collections, playlists, implementing other ADTs | this page |
| **Graph** | vertices joined by edges (directed/undirected, weighted) | maps and routing, social networks, the Internet, dependencies | [2.4](#/topic/2.4) |
| **Tree** | connected graph with no cycles; rooted trees have parent/child | file systems, binary search trees, syntax trees, expression trees | [2.5](#/topic/2.5) |
| **Hash table** | hash function maps a key straight to an array index | fast lookup, database indexes, caches, compiler symbol tables | [2.6](#/topic/2.6) |
| **Dictionary** | key → value pairs (ADT usually built on a hash table) | information retrieval, counting, JSON-style records | [2.7](#/topic/2.7) |
| **Vector** | ordered list of numbers from one field, e.g. ℝ<sup>3</sup> | geometry, physics in games, machine learning, graphics | [2.8](#/topic/2.8) |

:::spec
4.2.1.4 also says: *describe the creation and maintenance of data within queues (linear, circular, priority), stacks and hash tables*. "Creation and maintenance" means: how the structure is set up (array + pointers/counters), how items are **added**, **removed** and **found**, and what checks (empty/full/collision) protect it. The full algorithms are on the [queues](#/topic/2.2), [stacks](#/topic/2.3) and [hash tables](#/topic/2.6) pages.
:::

:::exam
- **State / describe a data structure (2 marks)**: give the defining property **and** one distinguishing feature. Array: same type + index. Record: different types + named fields. Linked list: nodes with data + pointer to next.
- **Compare static and dynamic (4–6 marks)**: one mark per *paired* point: size fixed vs run-time; contiguous vs heap/pointers; fast direct access vs sequential; may overflow/waste vs memory-efficient but pointer overhead. Pure lists of one side's features cap you at half marks.
- **Write code to read a file (4–6 marks)**: open with the right mode (1), loop until end of file (1), read a line (1), process/convert the data (1), close the file (1). The same marks exist in pseudocode.
- **Text vs binary (2–4 marks)**: characters vs raw bytes; human-readable vs not; conversion needed vs none; typical uses of each.
- **2-D array code**: show nested loops with the correct bounds and `grid[row][col]`. Say which index is which.
- Never write "a list is a type of array" or "a linked list is faster". Be precise about *which operation* is faster.
:::

:::challenge
1. Write a Python function that reads `scores.txt` (name,score lines) and writes a new text file containing only the pupils who scored 70 or more. Then rewrite it to produce a binary file where each record is a 10-byte name and a 1-byte score.
2. Implement `insert_sorted(value)` for the `LinkedList` class so the list stays in ascending order. Draw the pointer diagram for inserting into an empty list, at the front, in the middle and at the end.
3. A 3-D array `temps[day][hour][sensor]` holds readings for 7 days × 24 hours × 4 sensors. Write nested loops to find the hottest reading and output its day, hour and sensor.
4. Explain why a binary search cannot be run on a linked list even if its data is sorted.
:::

:::recap
- A **data structure** organises many data items; an **ADT** is defined by its operations, hiding the implementation.
- **Arrays**: same type, contiguous, direct access by 0-based index; 2-D arrays need two indices and nested loops.
- **Records** group named fields of different types; an **array of records** models a table.
- **Text files** store characters in lines (convert with `int()`); **binary files** store raw bytes (use `struct`); modes `r`/`w`/`a` plus `b`; always close.
- **Static**: fixed size, fast, may waste or overflow. **Dynamic**: run-time size from the **heap**, linked by **pointers**, slower access.
- A **linked list** implements the list ADT dynamically: insert = set new node's next, then re-point the previous node; delete = bypass the node.
- Know the one-line concept and uses of queue, stack, list, graph, tree, hash table, dictionary and vector.
:::

:::related
- [2.2 Queues](#/topic/2.2) and [2.3 Stacks](#/topic/2.3) — linear ADTs built on arrays or linked lists
- [2.6 Hash tables](#/topic/2.6) and [2.7 Dictionaries](#/topic/2.7) — key-based access
- [1.1 Data types, variables and constants](#/topic/1.1) — primitive vs composite types
- [1.8 Object-oriented programming](#/topic/1.8) — classes as records with methods
- [3.4 Searching algorithms](#/topic/3.4) — why direct access matters for binary search
:::

*/});
