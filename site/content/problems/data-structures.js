/* Python coding practice: queues, stacks, hash tables and dictionaries
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "print-queue",
    title: "Printer queue",
    topic: "2.2",
    difficulty: 1,
    task: `Write a program that simulates a printer queue holding at most **5** documents. Repeatedly ask for a command (prompt \`Command: \`) until \`END\` is entered:

| Command | Action and output |
|---|---|
| \`ADD <name>\` | add the document to the back of the queue and output \`Added <name>\`; if the queue already has 5 documents output \`Queue is full\` |
| \`PRINT\` | remove the document at the front and output \`Printing <name>\`; if the queue is empty output \`Queue is empty\` |
| \`SHOW\` | output \`Queue: \` followed by the documents from front to back separated by \`, \`, or \`Queue: empty\` |
| \`END\` | stop |

Commands are in capitals. A document name can contain spaces but can't be empty. Anything else: output \`Unknown command\`.

\`\`\`text
Command: ADD report
Added report
Command: ADD photo
Added photo
Command: PRINT
Printing report
Command: SHOW
Queue: photo
Command: END
\`\`\``,
    tests: [
      { name: "example from the question", input: "ADD report\nADD photo\nPRINT\nSHOW\nEND\n", expect: "Added report\nAdded photo\nPrinting report\nQueue: photo" },
      { name: "empty queue", input: "PRINT\nSHOW\nEND\n", expect: "Queue is empty\nQueue: empty" },
      { name: "queue full", input: "ADD a\nADD b\nADD c\nADD d\nADD e\nADD f\nSHOW\nPRINT\nADD f\nSHOW\nEND\n", expect: "Added a\nAdded b\nAdded c\nAdded d\nAdded e\nQueue is full\nQueue: a, b, c, d, e\nPrinting a\nAdded f\nQueue: b, c, d, e, f", hidden: true },
      { name: "unknown commands and names with spaces", input: "add x\nHELLO\nADD\nADD my essay\nSHOW\nEND\n", expect: "Unknown command\nUnknown command\nUnknown command\nAdded my essay\nQueue: my essay", hidden: true },
      { name: "first in, first out", input: "ADD one\nADD two\nADD three\nPRINT\nPRINT\nPRINT\nPRINT\nEND\n", expect: "Added one\nAdded two\nAdded three\nPrinting one\nPrinting two\nPrinting three\nQueue is empty", hidden: true }
    ],
    hints: [
      "A Python list works as a queue: `queue.append(name)` adds to the back and `queue.pop(0)` removes from the front.",
      "Check `command.startswith(\"ADD \")` and take the name with `command[4:]`. An empty name is not allowed."
    ],
    solution: `MAX_SIZE = 5
queue = []
command = input("Command: ")
while command != "END":
    if command.startswith("ADD ") and len(command) > 4:
        if len(queue) == MAX_SIZE:
            print("Queue is full")
        else:
            name = command[4:]
            queue.append(name)
            print("Added " + name)
    elif command == "PRINT":
        if len(queue) == 0:
            print("Queue is empty")
        else:
            print("Printing " + queue.pop(0))
    elif command == "SHOW":
        if len(queue) == 0:
            print("Queue: empty")
        else:
            print("Queue: " + ", ".join(queue))
    else:
        print("Unknown command")
    command = input("Command: ")
`,
    explain: `**FIFO.** A queue is *first in, first out*: documents are printed in the order they were added. Adding happens at the **rear**, removing at the **front**.

**Test for empty and full** before removing or adding. Those are two of the four queue operations the spec names (add, remove, test for empty, test for full); a fixed maximum size models a queue held in a static array.

**Efficiency note.** \`pop(0)\` shifts every remaining item along one place, O(n). A linear queue in an array avoids shifting by moving a *front pointer* instead, but then wastes the space at the start — which is what a circular queue fixes (see *Circular queue class*).

**Common mistakes:** \`queue.pop()\` (removes from the *back*, making it a stack); accepting \`ADD\` with no name.`
  },
  {
    id: "stack-class",
    title: "Stack class with a top pointer",
    topic: "2.3",
    difficulty: 2,
    task: `Write a class \`Stack\` that implements a stack in a **fixed-size array**, the way AQA describes it.

- \`Stack(max_size)\` creates an attribute \`items\`, a list of \`max_size\` slots all set to \`None\`, and an attribute \`top\`, the index of the top item, which is \`-1\` when the stack is empty.
- \`push(item)\`: if the stack is full return \`False\`; otherwise add 1 to \`top\`, store the item at \`items[top]\` and return \`True\`.
- \`pop()\`: if the stack is empty return \`None\`; otherwise return the top item and subtract 1 from \`top\`.
- \`peek()\`: return the top item without removing it (\`None\` if empty).
- \`is_empty()\`, \`is_full()\` return Booleans; \`size()\` returns the number of items.

**Don't** use \`append\` or \`pop\` on the list: the list never changes length.

\`\`\`python
s = Stack(3)
s.push("a")
s.push("b")
print(s.pop())      # b
print(s.peek())     # a
print(s.top)        # 0
\`\`\``,
    tests: [
      { name: "example from the question", code: "s = Stack(3)\ns.push(\"a\")\ns.push(\"b\")\nprint(s.pop())\nprint(s.peek())\nprint(s.top)", expect: "b\na\n0" },
      { name: "new stack", code: "s = Stack(4)\nprint(s.is_empty(), s.is_full(), s.top, s.size(), s.items)", expect: "True False -1 0 [None, None, None, None]" },
      { name: "pushing onto a full stack", code: "s = Stack(2)\nprint(s.push(1))\nprint(s.push(2))\nprint(s.push(3))\nprint(s.is_full(), s.size(), len(s.items))", expect: "True\nTrue\nFalse\nTrue 2 2", hidden: true },
      { name: "popping an empty stack", code: "s = Stack(2)\nprint(s.pop())\nprint(s.peek())\nprint(s.top)", expect: "None\nNone\n-1", hidden: true },
      { name: "last in, first out", code: "s = Stack(5)\nfor n in [1, 2, 3]:\n    s.push(n)\nprint(s.pop(), s.pop(), s.pop(), s.pop())", expect: "3 2 1 None", hidden: true },
      { name: "the array never changes size", code: "s = Stack(5)\ns.push(\"x\")\ns.push(\"y\")\ns.push(\"z\")\nprint(len(s.items))\ns.pop()\nprint(len(s.items))\nprint(s.size())", expect: "5\n5\n2", hidden: true }
    ],
    hints: [
      "In `__init__`: `self.items = [None] * max_size` and `self.top = -1`.",
      "Empty means `self.top == -1`; full means `self.top == len(self.items) - 1`; size is `self.top + 1`.",
      "In `pop`, read `item = self.items[self.top]` **before** decreasing `top`."
    ],
    solution: `class Stack:
    def __init__(self, max_size):
        self.items = [None] * max_size
        self.top = -1

    def is_empty(self):
        return self.top == -1

    def is_full(self):
        return self.top == len(self.items) - 1

    def size(self):
        return self.top + 1

    def push(self, item):
        if self.is_full():
            return False
        self.top = self.top + 1
        self.items[self.top] = item
        return True

    def pop(self):
        if self.is_empty():
            return None
        item = self.items[self.top]
        self.top = self.top - 1
        return item

    def peek(self):
        if self.is_empty():
            return None
        return self.items[self.top]
`,
    explain: `**LIFO with a pointer.** A stack is *last in, first out*. In a static array you don't move data; you move the **top pointer**. Push: check full, increment \`top\`, store. Pop: check empty, read, decrement \`top\`.

**Popped items stay in the array.** After a pop, the old value is still in \`items\` but is beyond \`top\`, so it's treated as free space and will be overwritten by the next push. That's normal (and a favourite exam trace question).

**Overflow and underflow.** Pushing onto a full stack is *stack overflow*; popping an empty one is *stack underflow*. Returning \`False\`/\`None\` handles both without crashing.

**Uses (exam).** Subroutine call stacks (return addresses, local variables), undo, evaluating RPN, backtracking in depth-first search.`
  },
  {
    id: "bracket-matching",
    title: "Balanced brackets",
    topic: "2.3",
    difficulty: 2,
    task: `Write a program that uses a **stack** to check whether the brackets in some text are balanced.

- Ask for the text (prompt \`Enter some text: \`).
- The brackets are \`()\`, \`[]\` and \`{}\`. Every opening bracket must be closed by the matching closing bracket, in the right order. Other characters are ignored.
- Output \`Balanced\` or \`Not balanced\`.

\`\`\`text
Enter some text: print(x[0])
Balanced
\`\`\``,
    tests: [
      { name: "example from the question", input: "print(x[0])\n", expect: "Balanced" },
      { name: "wrong type of closing bracket", input: "(]\n", expect: "Not balanced" },
      { name: "nested brackets", input: "{[()()]}\n", expect: "Balanced" },
      { name: "interleaved brackets", input: "([)]\n", expect: "Not balanced", hidden: true },
      { name: "no brackets at all", input: "\n", expect: "Balanced", hidden: true },
      { name: "left unclosed", input: "((a)\n", expect: "Not balanced", hidden: true },
      { name: "closing bracket with nothing open", input: "a)(b\n", expect: "Not balanced", hidden: true },
      { name: "code-like text", input: "if (a[i] > b[j]) { c = {1: (2, 3)} }\n", expect: "Balanced", hidden: true }
    ],
    hints: [
      "Push every opening bracket on to a stack (a list with `append`).",
      "On a closing bracket: if the stack is empty, or the popped opening bracket isn't its partner, it's not balanced.",
      "At the end the stack must be empty. A dictionary like `{\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}` gives each closing bracket's partner."
    ],
    solution: `PAIRS = {")": "(", "]": "[", "}": "{"}

text = input("Enter some text: ")
stack = []
balanced = True
for ch in text:
    if ch in "([{":
        stack.append(ch)
    elif ch in ")]}":
        if len(stack) == 0 or stack.pop() != PAIRS[ch]:
            balanced = False
if len(stack) != 0:
    balanced = False

if balanced:
    print("Balanced")
else:
    print("Not balanced")
`,
    explain: `**Why a stack?** The most recently opened bracket must be the first one closed: last in, first out. When a closing bracket arrives, the top of the stack must be its partner.

**Three ways to fail**
1. A closing bracket arrives when the stack is empty (\`a)(b\`).
2. It doesn't match the top of the stack (\`([)]\`).
3. Brackets are still open at the end (\`((a)\`).

Counting brackets is **not** enough: \`([)]\` has equal numbers of each type but is wrongly nested. The hidden tests check all three failures.

**Real use.** Compilers and editors do exactly this when parsing code — it's part of syntax analysis.`
  },
  {
    id: "circular-queue",
    title: "Circular queue class",
    topic: "2.2",
    difficulty: 3,
    task: `Write a class \`CircularQueue\` that stores a queue in a fixed-size array with **front and rear pointers that wrap round**.

- \`CircularQueue(max_size)\` creates these attributes: \`items\`, a list of \`max_size\` slots set to \`None\`; \`front = 0\`; \`rear = -1\`; \`size = 0\`.
- \`enqueue(item)\`: if full return \`False\`. Otherwise move \`rear\` on one place, **wrapping round to 0 after the last slot**, store the item there, add 1 to \`size\` and return \`True\`.
- \`dequeue()\`: if empty return \`None\`. Otherwise take the item at \`front\`, move \`front\` on one place (wrapping round), subtract 1 from \`size\` and return the item.
- \`is_empty()\` and \`is_full()\` return Booleans.

The list must never change length (no \`append\`, \`pop\` or \`insert\`).

\`\`\`python
q = CircularQueue(3)
q.enqueue("a"); q.enqueue("b"); q.enqueue("c")
print(q.dequeue())               # a
print(q.enqueue("d"))            # True
print(q.items)                   # ['d', 'b', 'c']
print(q.front, q.rear, q.size)   # 1 0 3
\`\`\``,
    tests: [
      { name: "example from the question", code: "q = CircularQueue(3)\nq.enqueue(\"a\"); q.enqueue(\"b\"); q.enqueue(\"c\")\nprint(q.dequeue())\nprint(q.enqueue(\"d\"))\nprint(q.items)\nprint(q.front, q.rear, q.size)", expect: "a\nTrue\n['d', 'b', 'c']\n1 0 3" },
      { name: "new queue", code: "q = CircularQueue(4)\nprint(q.is_empty(), q.is_full(), q.front, q.rear, q.size, q.items)", expect: "True False 0 -1 0 [None, None, None, None]" },
      { name: "enqueue when full", code: "q = CircularQueue(2)\nprint(q.enqueue(1), q.enqueue(2), q.enqueue(3), q.is_full())", expect: "True True False True", hidden: true },
      { name: "dequeue until empty", code: "q = CircularQueue(3)\nfor x in \"abc\":\n    q.enqueue(x)\nq.dequeue()\nq.enqueue(\"d\")\nprint(q.dequeue(), q.dequeue(), q.dequeue(), q.dequeue(), q.is_empty())", expect: "b c d None True", hidden: true },
      { name: "wraps round many times", code: "q = CircularQueue(2)\nout = []\nfor i in range(10):\n    q.enqueue(i)\n    out.append(str(q.dequeue()))\nprint(\" \".join(out))\nprint(q.front, q.rear, q.size)", expect: "0 1 2 3 4 5 6 7 8 9\n0 1 0", hidden: true },
      { name: "the array never changes size", code: "q = CircularQueue(3)\nfor i in range(5):\n    q.enqueue(i)\na = len(q.items)\nq.dequeue()\nprint(a, len(q.items))", expect: "3 3", hidden: true }
    ],
    hints: [
      "Wrapping round: `self.rear = (self.rear + 1) % len(self.items)`, and the same for `front`.",
      "Use `size` for the tests: empty is `self.size == 0`, full is `self.size == len(self.items)`.",
      "In `dequeue`, read `self.items[self.front]` before moving `front`."
    ],
    solution: `class CircularQueue:
    def __init__(self, max_size):
        self.items = [None] * max_size
        self.front = 0
        self.rear = -1
        self.size = 0

    def is_empty(self):
        return self.size == 0

    def is_full(self):
        return self.size == len(self.items)

    def enqueue(self, item):
        if self.is_full():
            return False
        self.rear = (self.rear + 1) % len(self.items)
        self.items[self.rear] = item
        self.size = self.size + 1
        return True

    def dequeue(self):
        if self.is_empty():
            return None
        item = self.items[self.front]
        self.front = (self.front + 1) % len(self.items)
        self.size = self.size - 1
        return item
`,
    explain: `**The problem it solves.** In a linear queue in an array, the front pointer creeps along as items are removed, and the space behind it can never be reused. A circular queue treats the array as a ring: after the last slot, the pointers go back to slot 0.

**\`MOD\` does the wrapping.** \`(rear + 1) % max_size\` goes 0, 1, 2, 0, 1, 2… The AQA pseudocode version is often written \`IF Rear = MaxSize - 1 THEN Rear ← 0 ELSE Rear ← Rear + 1\`.

**Why keep \`size\`?** With only two pointers, "full" and "empty" can look the same (\`front\` one place after \`rear\` in both cases). A count removes the ambiguity. (The alternative is to always leave one slot empty.)

**Exam trace.** After enqueue a, b, c, dequeue, enqueue d: \`items = ['d', 'b', 'c']\`, front = 1 (pointing at b), rear = 0 (pointing at d). The old \`a\` was simply overwritten.

**Uses:** keyboard and network buffers, round-robin process scheduling, streaming audio/video.`
  },
  {
    id: "hash-table-probing",
    title: "Hash table with linear probing",
    topic: "2.6",
    difficulty: 3,
    task: `Write a class \`HashTable\` that stores key–value pairs in a fixed-size list, using **open addressing with linear probing** to handle collisions.

- \`HashTable(size=11)\` creates a list of \`size\` slots, all \`None\`.
- \`hash(key)\` returns the sum of the character codes (\`ord\`) of the characters in the string \`key\`, **MOD** the table size.
- \`insert(key, value)\` starts at the slot \`hash(key)\`. If that slot is empty it stores the pair there; if it holds the **same key** it replaces the value; otherwise it tries the next slot (wrapping round to 0 after the last). It returns the index used, or \`-1\` if every slot is full of other keys.
- \`get(key)\` probes in the same way and returns the value, or \`None\` if it reaches an empty slot or has checked every slot without finding the key.

Your code should only define the class.

\`\`\`python
t = HashTable()
print(t.hash("cat"))          # 4   (99 + 97 + 116 = 312, 312 MOD 11 = 4)
print(t.insert("cat", 1))     # 4
print(t.insert("act", 2))     # 5   (collision at 4, so the next slot)
print(t.get("act"))           # 2
\`\`\``,
    tests: [
      { name: "example from the question", code: "t = HashTable()\nprint(t.hash(\"cat\"))\nprint(t.insert(\"cat\", 1))\nprint(t.insert(\"act\", 2))\nprint(t.get(\"act\"))", expect: "4\n4\n5\n2" },
      { name: "a chain of collisions", code: "t = HashTable()\nt.insert(\"cat\", 1)\nt.insert(\"act\", 2)\nprint(t.insert(\"tac\", 3))\nprint(t.insert(\"dog\", 4))\nprint(t.get(\"dog\"))\nprint(t.get(\"god\"))", expect: "6\n7\n4\nNone" },
      { name: "updating an existing key", code: "t = HashTable()\nt.insert(\"cat\", 1)\nt.insert(\"act\", 2)\nprint(t.insert(\"cat\", 99))\nprint(t.get(\"cat\"))\nprint(t.hash(\"act\"))", expect: "4\n99\n4", hidden: true },
      { name: "probing wraps round", code: "t = HashTable(5)\nprint(t.insert(\"c\", \"C\"))\nprint(t.insert(\"h\", \"H\"))\nprint(t.insert(\"m\", \"M\"))\nprint(t.get(\"m\"))\nprint(t.get(\"r\"))", expect: "4\n0\n1\nM\nNone", hidden: true },
      { name: "full table", code: "t = HashTable(2)\nprint(t.insert(\"a\", \"A\"))\nprint(t.insert(\"b\", \"B\"))\nprint(t.insert(\"c\", \"C\"))\nprint(t.get(\"c\"))\nprint(t.get(\"a\"))", expect: "1\n0\n-1\nNone\nA", hidden: true },
      { name: "empty table and empty key", code: "t = HashTable()\nprint(t.get(\"x\"))\nprint(t.hash(\"\"))\nprint(t.insert(\"\", \"blank\"))", expect: "None\n0\n0", hidden: true }
    ],
    hints: [
      "Store each pair as a list `[key, value]` in the slot. `self.slots = [None] * size`.",
      "Probe with a counter so you never check more than `size` slots: `index = (start + i) % size` for `i` in `range(size)`.",
      "In `get`, stop with `None` as soon as you hit an empty slot: the key would have been put there if it existed."
    ],
    solution: `class HashTable:
    def __init__(self, size=11):
        self.size = size
        self.slots = [None] * size

    def hash(self, key):
        total = 0
        for ch in key:
            total = total + ord(ch)
        return total % self.size

    def insert(self, key, value):
        start = self.hash(key)
        for i in range(self.size):
            index = (start + i) % self.size
            if self.slots[index] is None:
                self.slots[index] = [key, value]
                return index
            if self.slots[index][0] == key:
                self.slots[index][1] = value
                return index
        return -1

    def get(self, key):
        start = self.hash(key)
        for i in range(self.size):
            index = (start + i) % self.size
            if self.slots[index] is None:
                return None
            if self.slots[index][0] == key:
                return self.slots[index][1]
        return None
`,
    explain: `**Hashing.** The hash function turns a key straight into an index, so a lookup usually takes one step, O(1), instead of a search. This hash (sum of character codes MOD size) is simple but weak: anagrams like \`cat\`, \`act\`, \`tac\` always collide.

**Collisions and linear probing.** When the home slot is taken, try the next one, wrapping round. \`get\` must follow the *same* probe sequence, and can stop at an empty slot because the key would have been placed there.

**Clustering.** Linear probing makes runs of filled slots that grow and slow everything down. A good table keeps its *load factor* low (often below 0.7) and is **rehashed** into a bigger table when it fills. Using a prime table size (11) spreads keys better.

**Watch out for full tables.** Without a limit of \`size\` probes, \`get\` on a full table loops forever — the hidden test checks this.

**Alternative.** *Chaining* stores a list at each slot and puts every colliding key in that list.`
  },
  {
    id: "word-frequency",
    title: "Word frequency (dictionary)",
    topic: "2.7",
    difficulty: 2,
    task: `Write a program that counts how often each word appears in a sentence, using a **dictionary**.

- Ask for a sentence (prompt \`Enter a sentence: \`).
- Convert it to lower case and remove these punctuation characters: \`. , ! ? ; :\`. Words are separated by spaces.
- If there are no words, output \`No words\`.
- Otherwise output each different word with its count as \`<word>: <count>\`, **in the order the words first appear**, then \`Most common: <word>\`. If several words share the highest count, choose the one that appeared first.

\`\`\`text
Enter a sentence: The cat and the hat.
the: 2
cat: 1
and: 1
hat: 1
Most common: the
\`\`\``,
    tests: [
      { name: "example from the question", input: "The cat and the hat.\n", expect: "the: 2\ncat: 1\nand: 1\nhat: 1\nMost common: the" },
      { name: "one word", input: "Hello\n", expect: "hello: 1\nMost common: hello" },
      { name: "tie goes to the first word", input: "a b b a c\n", expect: "a: 2\nb: 2\nc: 1\nMost common: a", hidden: true },
      { name: "punctuation, capitals and extra spaces", input: "Yes, yes; YES!  no\n", expect: "yes: 3\nno: 1\nMost common: yes", hidden: true },
      { name: "empty input", input: "\n", expect: "No words", hidden: true },
      { name: "only punctuation", input: "!!! ?\n", expect: "No words", hidden: true },
      { name: "later word wins outright", input: "To be, or not to be: be!\n", expect: "to: 2\nbe: 3\nor: 1\nnot: 1\nMost common: be", hidden: true }
    ],
    hints: [
      "Remove punctuation by building a new string that skips those characters (or use `replace` for each one), then `split()` on whitespace.",
      "`counts = {}`; for each word: `if word in counts: counts[word] += 1` else `counts[word] = 1`. Python dictionaries remember insertion order.",
      "For the most common word, loop over the dictionary keeping the best so far, replacing it only when a count is strictly greater."
    ],
    solution: `sentence = input("Enter a sentence: ").lower()
cleaned = ""
for ch in sentence:
    if ch not in ".,!?;:":
        cleaned = cleaned + ch

counts = {}
for word in cleaned.split():
    if word in counts:
        counts[word] = counts[word] + 1
    else:
        counts[word] = 1

if len(counts) == 0:
    print("No words")
else:
    best = None
    for word in counts:
        print(word + ": " + str(counts[word]))
        if best is None or counts[word] > counts[best]:
            best = word
    print("Most common: " + best)
`,
    explain: `**Approach.** A dictionary maps each word (the **key**) to its count (the **value**). Looking up or updating a key is O(1) on average, because Python dictionaries are hash tables underneath.

**Order.** Since Python 3.7, dictionaries keep keys in insertion order, so looping over \`counts\` gives first-appearance order. In AQA terms a dictionary is an unordered collection of key–value pairs, so don't rely on order in pseudocode answers.

**\`split()\` vs \`split(" ")\`.** \`split()\` with no argument splits on any run of whitespace and never produces empty strings; \`split(" ")\` would turn the double space into an empty "word".

**Exam link.** This is the spec's own example of a dictionary application: counting word frequencies in a document. It's also the first step of dictionary-based compression and of building a Huffman tree.`
  }
]);
