CS.registerTopic({ id: "2.2", title: "Queues" }, function () {/*

:::objectives
- Describe a queue as a **first in, first out (FIFO)** abstract data type and give real uses.
- Apply **add (enqueue)**, **remove (dequeue)**, **test for empty** and **test for full** to **linear**, **circular** and **priority** queues.
- Write the algorithms for each operation in AQA pseudocode and Python using **front** and **rear** pointers and a **size** counter.
- Trace a sequence of queue operations, including **wrap-around** in a circular queue and the "false full" problem of a linear queue.
- Explain how a priority queue orders items and compare its two array implementations.
:::

:::quick At a glance
- A **queue** is **FIFO**: items join at the **rear** and leave from the **front**, so they leave in arrival order.
- An array queue needs a **front pointer**, a **rear pointer** and usually a **size** counter.
- **Linear queue**: pointers only move forwards. Freed slots at the start are never reused, so it can report **full** while space is free (unless items are shuffled forward on every remove, which is slow).
- **Circular queue**: pointers **wrap around** with `pointer ← (pointer + 1) MOD MAX`, reusing freed slots. Empty when `size = 0`, full when `size = MAX`.
- **Priority queue**: each item has a priority; the **highest priority leaves first**, items of equal priority leave in FIFO order.
- Always **test for full before adding** and **test for empty before removing**.
- Uses: print spooling, keyboard buffer, process scheduling, network packet buffers, breadth-first search, simulations.
:::

:::keyterms
Queue :: A first in, first out (FIFO) abstract data type in which items are added at the rear and removed from the front. :: A line at a till: first to arrive is first served.
FIFO :: First in, first out: items are removed in the same order in which they were added. :: Fair queuing.
Enqueue (add) :: The operation that adds an item to the rear of a queue. :: Join the back of the line.
Dequeue (remove) :: The operation that removes and returns the item at the front of a queue. :: The person at the front is served and leaves.
Front pointer :: A variable holding the index of the item at the front of the queue (the next to be removed). :: Who is served next.
Rear pointer :: A variable holding the index of the item most recently added, at the rear of the queue. :: Who joined last.
Linear queue :: A queue in which the front and rear pointers only move forward through the array, so space freed at the front is not reused. :: A one-way conveyor belt.
Circular queue :: A queue implemented in a fixed-size array in which the pointers wrap around from the last position to the first, so freed space is reused. :: The array behaves as if its ends were joined in a ring.
Priority queue :: A queue in which each item has a priority; items are removed in priority order, and items of equal priority in FIFO order. :: A&E: the most urgent patient is seen first.
Buffer :: An area of memory used to hold data temporarily while it waits to be processed, usually organised as a queue. :: A waiting room for data.
:::

## What a queue is

A queue is the fair one. Whoever arrives first is served first: **first in, first out (FIFO)**. New items join at the **rear**; items are removed from the **front**. Nothing ever joins in the middle (except in a priority queue, which we'll come to).

Compare with a [stack](#/topic/2.3), which uses only one end and is LIFO.

<svg class="diagram" viewBox="0 0 640 150" role="img" aria-label="A queue of four items with the front on the left where items leave and the rear on the right where items join">
  <defs><marker id="arr22" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <g stroke="currentColor" fill="#7c9aff" fill-opacity="0.25">
      <rect x="170" y="50" width="70" height="44" rx="6"/><rect x="250" y="50" width="70" height="44" rx="6"/><rect x="330" y="50" width="70" height="44" rx="6"/><rect x="410" y="50" width="70" height="44" rx="6"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="205" y="77">Steven</text><text x="285" y="77">Susan</text><text x="365" y="77">Barbara</text><text x="445" y="77">Ian</text>
    </g>
    <line x1="165" y1="72" x2="90" y2="72" stroke="currentColor" marker-end="url(#arr22)"/>
    <text x="40" y="66" font-size="13">leaves</text><text x="40" y="84" font-size="12">(dequeue)</text>
    <line x1="580" y1="72" x2="488" y2="72" stroke="currentColor" marker-end="url(#arr22)"/>
    <text x="545" y="60" font-size="13">joins (enqueue)</text>
    <text x="205" y="120" text-anchor="middle" font-size="13">front</text>
    <text x="445" y="120" text-anchor="middle" font-size="13">rear</text>
    <text x="320" y="30" text-anchor="middle" font-size="12">Steven arrived first, so Steven leaves first</text>
  </g>
</svg>

:::trap FIFO, not "FIFO (LIFO)"
The student textbook answer says *"a queue is a first in first out (LIFO) structure"*. That bracket is a typo. A queue is **FIFO**; a stack is **LIFO**. Writing both, or the wrong one, in an exam loses the mark.
:::

### The four operations

| Operation | What it does | Must check first |
|---|---|---|
| **add(item)** / enqueue | puts `item` at the rear | queue not full |
| **remove()** / dequeue | removes **and returns** the front item | queue not empty |
| **isEmpty()** | True if there are no items | — |
| **isFull()** | True if no more items fit (array implementation) | — |

Many languages also give **peek** (look at the front item without removing it), but the spec's four are add, remove, test for empty and test for full.

### Where queues are used

- **Print spooling**: documents print in the order they were sent.
- **Keyboard buffer**: keys are processed in the order you pressed them.
- **Process scheduling**: processes waiting for the CPU (round robin uses a circular queue).
- **Network buffers**: packets waiting at a router or network card.
- **Breadth-first search** of a graph visits vertices in the order they were discovered. See [3.1](#/topic/3.1).
- **Simulations**: modelling customers at a checkout or cars at traffic lights.

## Linear queues

The simplest array implementation. Initialise `front ← 0`, `rear ← -1`, `size ← 0`. Adding moves `rear` forward; removing moves `front` forward. Neither pointer ever goes back.

::::tabs
:::tab AQA pseudocode
```pseudocode
q ← array of size MAX
front ← 0
rear ← -1
size ← 0

SUBROUTINE isEmpty()
    RETURN size = 0
ENDSUBROUTINE

SUBROUTINE isFull()
    RETURN rear = MAX - 1        # rear has reached the end of the array
ENDSUBROUTINE

SUBROUTINE add(item)
    IF isFull() THEN
        OUTPUT "Error: queue full"
    ELSE
        rear ← rear + 1
        q[rear] ← item
        size ← size + 1
    ENDIF
ENDSUBROUTINE

SUBROUTINE remove()
    IF isEmpty() THEN
        OUTPUT "Error: queue empty"
    ELSE
        item ← q[front]
        front ← front + 1
        size ← size - 1
        RETURN item
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python
```python
class LinearQueue:
    def __init__(self, max_size):
        self.q = [None] * max_size
        self.max = max_size
        self.front, self.rear, self.size = 0, -1, 0

    def is_empty(self):
        return self.size == 0

    def is_full(self):
        return self.rear == self.max - 1

    def add(self, item):
        if self.is_full():
            return "full"
        self.rear += 1
        self.q[self.rear] = item
        self.size += 1

    def remove(self):
        if self.is_empty():
            return "empty"
        item = self.q[self.front]
        self.front += 1
        self.size -= 1
        return item

lq = LinearQueue(4)
for x in "PQ": lq.add(x)
print(lq.remove())              # P
for x in "RS": lq.add(x)
print(lq.add("T"), lq.size)     # full 3  <- only 3 items, yet "full"!
```
:::
::::

### The problem: false "full"

Every remove leaves an empty slot at the **start** of the array that a linear queue never reuses. Eventually `rear` reaches the end and the queue reports full even though slots are free. Look at the Python output above: three items in a four-slot array, yet "full".

There are two fixes:

1. **Shuffle forward**: on every remove, move every remaining item one place towards index 0 so `front` is always 0. Simple, but each remove now costs time proportional to the number of items (O(n)). Fine for small queues only.
2. **Make it circular**: let the pointers wrap round to index 0. Every operation stays O(1). This is the usual answer.

{{trace:2.2-2}}

## Circular queues

A **circular queue** treats the array as if its two ends were joined. When `rear` is at the last index and there is space, the next item goes into index 0. The wrap-around is done with **MOD**:

> `pointer ← (pointer + 1) MOD MAX`

With MAX = 5: (0+1) MOD 5 = 1, …, (3+1) MOD 5 = 4, **(4+1) MOD 5 = 0**.

<svg class="diagram" viewBox="0 0 640 260" role="img" aria-label="A circular queue of five slots drawn as a ring. Slots 3, 4, 0 and 1 hold D, E, F, G. Front points to slot 3 and rear points to slot 1, showing wrap-around">
  <g font-family="inherit" font-size="14">
    <g stroke="currentColor">
      <path d="M200,40 A90,90 0 0,1 285.6,102.2 L247.6,114.6 A50,50 0 0,0 200,80 Z" fill="#7c9aff" fill-opacity="0.3"/>
      <path d="M285.6,102.2 A90,90 0 0,1 252.9,202.8 L229.4,170.5 A50,50 0 0,0 247.6,114.6 Z" fill="#7c9aff" fill-opacity="0.3"/>
      <path d="M252.9,202.8 A90,90 0 0,1 147.1,202.8 L170.6,170.5 A50,50 0 0,0 229.4,170.5 Z" fill="none"/>
      <path d="M147.1,202.8 A90,90 0 0,1 114.4,102.2 L152.4,114.6 A50,50 0 0,0 170.6,170.5 Z" fill="#7c9aff" fill-opacity="0.3"/>
      <path d="M114.4,102.2 A90,90 0 0,1 200,40 L200,80 A50,50 0 0,0 152.4,114.6 Z" fill="#7c9aff" fill-opacity="0.3"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="228" y="83">F</text><text x="252" y="152">G</text><text x="200" y="196">·</text><text x="148" y="152">D</text><text x="172" y="83">E</text>
      <text x="236" y="38" font-size="11">[0]</text><text x="300" y="166" font-size="11">[1]</text><text x="200" y="250" font-size="11">[2]</text><text x="100" y="166" font-size="11">[3]</text><text x="164" y="38" font-size="11">[4]</text>
    </g>
    <text x="40" y="200" font-size="13">front = 3</text>
    <line x1="70" y1="188" x2="128" y2="160" stroke="currentColor" marker-end="url(#arr22)"/>
    <text x="320" y="225" font-size="13">rear = 1</text>
    <line x1="340" y1="212" x2="275" y2="162" stroke="currentColor" marker-end="url(#arr22)"/>
    <g font-size="13">
      <text x="400" y="60">Queue (front → rear): D, E, F, G</text>
      <text x="400" y="90">size = 4, MAX = 5</text>
      <text x="400" y="120">rear wrapped: (4 + 1) MOD 5 = 0</text>
      <text x="400" y="150">Next add goes in</text>
      <text x="400" y="170">(1 + 1) MOD 5 = 2</text>
      <text x="400" y="200">Then size = 5 → full</text>
    </g>
  </g>
</svg>

::::tabs
:::tab AQA pseudocode
```pseudocode
q ← array of size MAX
front ← 0
rear ← -1
size ← 0

SUBROUTINE isEmpty()
    RETURN size = 0
ENDSUBROUTINE

SUBROUTINE isFull()
    RETURN size = MAX
ENDSUBROUTINE

SUBROUTINE add(item)
    IF isFull() THEN
        OUTPUT "Error: queue full"
    ELSE
        rear ← (rear + 1) MOD MAX
        q[rear] ← item
        size ← size + 1
    ENDIF
ENDSUBROUTINE

SUBROUTINE remove()
    IF isEmpty() THEN
        OUTPUT "Error: queue empty"
    ELSE
        item ← q[front]
        front ← (front + 1) MOD MAX
        size ← size - 1
        RETURN item
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python
```python
class CircularQueue:
    def __init__(self, max_size):
        self.q = [None] * max_size
        self.max = max_size
        self.front, self.rear, self.size = 0, -1, 0

    def is_empty(self):
        return self.size == 0

    def is_full(self):
        return self.size == self.max

    def add(self, item):
        if self.is_full():
            return "full"
        self.rear = (self.rear + 1) % self.max
        self.q[self.rear] = item
        self.size += 1

    def remove(self):
        if self.is_empty():
            return "empty"
        item = self.q[self.front]
        self.front = (self.front + 1) % self.max
        self.size -= 1
        return item

cq = CircularQueue(5)
for x in "ABC": cq.add(x)
print(cq.remove(), cq.remove())     # A B
for x in "DEFG": cq.add(x)          # F and G wrap round to slots 0 and 1
print(cq.front, cq.rear, cq.size)   # 2 1 5
print(cq.add("H"))                  # full
print(cq.remove())                  # C
print(cq.q)                         # ['F', 'G', 'C', 'D', 'E']  (C is stale data)
```
:::
::::

:::why Why keep a size counter?
In a full circular queue *and* in an empty one, `rear` sits just behind `front`, so the pointers alone cannot tell the two states apart. A **size** counter settles it: empty is `size = 0`, full is `size = MAX`. Without a counter you must either leave one slot always unused (full when `(rear + 1) MOD MAX = front`) or reset both pointers to −1 when the last item leaves. All three methods are accepted; the counter is the clearest.
:::

:::example Worked trace with wrap-around (MAX = 5)
Start: `front = 0`, `rear = -1`, `size = 0`.

| Step | Operation | Check | Working | front | rear | size | Array [0..4] | Output |
|---|---|---|---|---|---|---|---|---|
| 1 | add(A) | size 0 ≠ 5 ✓ | rear ← (−1+1) MOD 5 = 0 | 0 | 0 | 1 | A · · · · | |
| 2 | add(B) | ✓ | rear ← 1 | 0 | 1 | 2 | A B · · · | |
| 3 | add(C) | ✓ | rear ← 2 | 0 | 2 | 3 | A B C · · | |
| 4 | remove() | size 3 ≠ 0 ✓ | item ← q[0]; front ← 1 | 1 | 2 | 2 | A B C · · | A |
| 5 | remove() | ✓ | item ← q[1]; front ← 2 | 2 | 2 | 1 | A B C · · | B |
| 6 | add(D) | ✓ | rear ← 3 | 2 | 3 | 2 | A B C D · | |
| 7 | add(E) | ✓ | rear ← 4 | 2 | 4 | 3 | A B C D E | |
| 8 | add(F) | ✓ | rear ← (4+1) MOD 5 = **0** | 2 | 0 | 4 | **F** B C D E | |
| 9 | add(G) | ✓ | rear ← 1 | 2 | 1 | 5 | F **G** C D E | |
| 10 | add(H) | size = 5 **✗** | rejected, nothing changes | 2 | 1 | 5 | F G C D E | "queue full" |
| 11 | remove() | ✓ | item ← q[2]; front ← 3 | 3 | 1 | 4 | F G C D E | C |

After step 11 the queue (front → rear) is **D, E, F, G**. The array still physically contains A, B and C at times; removing an item just moves `front`, and the old value is overwritten later. In an exam you may show removed slots as blank: both are accepted.
:::

{{trace:2.2-1}}

### Try it: interactive queues

{{tool:queue-demo}}

:::trap
- Use **MOD MAX**, not MOD (MAX − 1). With MAX = 5 the indices are 0–4, so the wrap is (4 + 1) MOD 5 = 0.
- Increment **then** store in add; read **then** increment in remove. Same off-by-one danger as the stack.
- A circular queue is **full** when it holds MAX items, not when `rear = MAX − 1`. That test belongs to the linear queue.
- "Remove" must **return** the item. Saying "the front pointer moves" alone loses a mark.
:::

## Priority queues

In a **priority queue** each item carries a **priority**. The item with the highest priority is always removed first; items with **equal** priority leave in **FIFO** order. Think of an A&E department, or an operating system choosing which process to run.

There are two ways to build one in an array:

| Method | add | remove | Comment |
|---|---|---|---|
| **1. Keep it ordered on add** | search from the rear for the correct place, shuffle lower-priority items back, insert | take the front item, as normal | removing is fast; adding is slow |
| **2. Add at the rear, search on remove** | add at the rear, as normal | scan the whole queue for the highest priority (first one found if tied), remove it and close the gap | adding is fast; removing is slow |

A third, dynamic, option is a **linked list** kept in priority order: insertion is just a pointer change once the place is found (see [2.1](#/topic/2.1)).

:::example Priority queue, method 1 (higher number = higher priority)
Add, in order: Ian (2), Barbara (2), Susan (3), Steven (1).

| After | Queue, front → rear | Why |
|---|---|---|
| add Ian (2) | Ian2 | empty queue |
| add Barbara (2) | Ian2, Barbara2 | equal priority: goes **behind** Ian (FIFO) |
| add Susan (3) | **Susan3**, Ian2, Barbara2 | higher than everyone: jumps to the front |
| add Steven (1) | Susan3, Ian2, Barbara2, Steven1 | lowest: stays at the rear |

Removes now return Susan, Ian, Barbara, Steven.
:::

::::tabs
:::tab AQA pseudocode (method 1)
```pseudocode
SUBROUTINE add(item, priority)
    IF size = MAX THEN
        OUTPUT "Error: queue full"
    ELSE
        i ← size - 1
        # shuffle back every item with LOWER priority
        WHILE i >= 0 AND q[i].priority < priority
            q[i + 1] ← q[i]
            i ← i - 1
        ENDWHILE
        q[i + 1] ← (item, priority)
        size ← size + 1
    ENDIF
ENDSUBROUTINE

SUBROUTINE remove()
    IF size = 0 THEN
        OUTPUT "Error: queue empty"
    ELSE
        item ← q[0]
        FOR i ← 1 TO size - 1
            q[i - 1] ← q[i]       # close the gap
        ENDFOR
        size ← size - 1
        RETURN item
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python
```python
class PriorityQueue:
    def __init__(self, max_size):
        self.q = []                 # list of (item, priority), front at index 0
        self.max = max_size

    def is_empty(self):
        return len(self.q) == 0

    def is_full(self):
        return len(self.q) == self.max

    def add(self, item, priority):
        if self.is_full():
            return "full"
        i = len(self.q)
        # move left past every item with LOWER priority; stop at equal (FIFO)
        while i > 0 and self.q[i - 1][1] < priority:
            i -= 1
        self.q.insert(i, (item, priority))

    def remove(self):
        if self.is_empty():
            return "empty"
        return self.q.pop(0)[0]

pq = PriorityQueue(10)
for name, p in [("Ian", 2), ("Barbara", 2), ("Susan", 3), ("Steven", 1)]:
    pq.add(name, p)
print([n for n, _ in pq.q])    # ['Susan', 'Ian', 'Barbara', 'Steven']
print(pq.remove())             # Susan
```
:::
::::

:::trap
- Use **strictly less than** (`<`) when shuffling: equal-priority items must stay **in front** of the newcomer, or you break FIFO within a priority.
- Say which way round priorities go. "Higher number = higher priority" is common, but some questions use 1 = most urgent. Read the question.
- A priority queue is still a queue: you **always remove from the front**. Only the position where items are *inserted* changes (method 1).
:::

## Linked-list (dynamic) queues

A queue can also be a linked list with a **front** pointer to the first node and a **rear** pointer to the last. Add: create a node, set the old rear node's pointer to it, move `rear`. Remove: take the front node's data, move `front` to the next node. There is no fixed size, so it is never full (until the heap runs out), but each node needs extra memory for its pointer.

:::exam
- **"Describe a queue" (2 marks)**: FIFO **and** items added at the rear, removed from the front.
- **Algorithm questions (4–6 marks)** for add or remove: test full/empty (1), update the pointer with MOD for circular (1), store/read the item in the right order (1), update size (1), return the item for remove (1).
- **Trace questions**: draw the array, write `front`, `rear` (and `size`) after **every** operation, mark rejected operations clearly and do not change anything for them.
- **"Explain why a circular queue is better than a linear queue" (2–3 marks)**: a linear queue cannot reuse space freed by removals, so it fills up even when slots are empty; shuffling items fixes it but is slow; a circular queue wraps the pointers round to reuse the space with O(1) operations.
- **Priority queue (3–4 marks)**: each item has a priority, highest removed first, equal priorities FIFO; describe *where* an item is inserted.
:::

:::challenge
1. Rewrite the circular queue **without** a size counter, keeping one slot permanently empty. What are the new `isEmpty` and `isFull` tests, and how many items can a 10-slot array now hold?
2. Implement priority queue method 2 (add at rear, search on remove). Trace it with the Ian/Barbara/Susan/Steven data and check it removes in the same order.
3. Build a queue from **two stacks** and work out the worst-case cost of a single remove.
4. A round-robin scheduler gives each process 10 ms then sends it to the back of the queue. Simulate three processes needing 25, 10 and 30 ms and list the order in which they finish.
:::

:::recap
- Queue = **FIFO**: add at the **rear**, remove from the **front**; track `front`, `rear` and `size`.
- **Linear**: pointers only move forward; freed space is wasted, so it can be "full" while slots are free (shuffling fixes it slowly).
- **Circular**: `pointer ← (pointer + 1) MOD MAX`; empty when `size = 0`, full when `size = MAX`.
- **Priority**: highest priority leaves first, equal priorities FIFO; keep ordered on add, or search on remove.
- Check full before add, empty before remove; remove **returns** the item.
- Uses: print spooler, keyboard buffer, scheduling, packet buffers, BFS, simulations.
:::

:::related
- [2.3 Stacks](#/topic/2.3) — the LIFO counterpart
- [2.1 Data structures](#/topic/2.1) — static vs dynamic, linked lists
- [3.1 Graph traversal](#/topic/3.1) — breadth-first search uses a queue
- [3.6 Dijkstra's algorithm](#/topic/3.6) — driven by a priority queue
:::

*/});
