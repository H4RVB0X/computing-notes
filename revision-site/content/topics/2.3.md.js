CS.registerTopic({ id: "2.3", title: "Stacks" }, function () {/*

:::objectives
- Describe a stack as a **last in, first out (LIFO)** abstract data type and give real uses of it.
- Apply the operations **push**, **pop**, **peek (top)**, **is empty** and **is full**, and say exactly what happens to the stack pointer each time.
- Write the algorithms for each operation in pseudocode (array implementation) and in Python.
- Trace a sequence of stack operations in a table, including what happens on underflow and overflow.
- Explain where stacks are used inside a computer: the **call stack**, **interrupts**, **reverse Polish evaluation** and **depth-first search**.
:::

:::quick At a glance
- A **stack** stores items so that the **last item added is the first removed** (LIFO).
- Only one end is used, the **top**. A **stack pointer** records the index of the top item.
- **push(x)**: check full → increment pointer → store x. **pop()**: check empty → read top → decrement pointer.
- **peek** reads the top without removing it. **isEmpty** is `top = -1` (0-indexed array). **isFull** is `top = size - 1`.
- Pop on an empty stack = **underflow**; push on a full stack = **overflow**. Always test first.
- Used for: subroutine return addresses (call stack), undo, back buttons, RPN evaluation, DFS, interrupts.
:::

:::keyterms
Stack :: A last in, first out (LIFO) abstract data type in which items are added to and removed from the same end, the top. :: A pile: you can only add to or take from the top.
Push :: The operation that adds an item to the top of a stack. :: Put something on the pile.
Pop :: The operation that removes and returns the item at the top of a stack. :: Take the top thing off.
Peek (top) :: The operation that returns the item at the top of the stack without removing it. :: Look at the top thing but leave it there.
Stack pointer :: A variable holding the position (array index) of the item currently at the top of the stack. :: The bookmark that says where the top is.
Stack underflow :: The error that occurs when pop or peek is attempted on an empty stack. :: Taking from an empty pile.
Stack overflow :: The error that occurs when push is attempted on a stack that is already full (static implementation). :: The pile has hit the ceiling.
Static data structure :: A structure whose maximum size is fixed when it is created, e.g. an array-based stack. :: Size decided up front.
Dynamic data structure :: A structure that can grow and shrink at run time, taking memory from the heap, e.g. a linked-list stack. :: Size changes as you go.
:::

## What a stack is and why it exists

A stack is the simplest useful data structure after the array, and it turns up *everywhere* inside a computer. The rule is strict:

> **Items leave in the reverse order they arrived.** The last thing pushed is the first thing popped.

That is why it is called a **LIFO** (last in, first out) structure. The opposite, first in first out, is a [queue](#/topic/2.2).

Think of a stack of plates. You add a plate on top, you take a plate from the top, and you never pull one out of the middle. The only plate you can see is the top one.

<svg class="diagram" viewBox="0 0 520 230" role="img" aria-label="A stack drawn as a pile of boxes with a pointer to the top">
  <defs><marker id="arr23" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="14" font-family="inherit">
    <rect x="200" y="40" width="120" height="36" rx="6" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/>
    <text x="260" y="63" text-anchor="middle">42  ← top</text>
    <rect x="200" y="80" width="120" height="36" rx="6" fill="none" stroke="currentColor"/><text x="260" y="103" text-anchor="middle">17</text>
    <rect x="200" y="120" width="120" height="36" rx="6" fill="none" stroke="currentColor"/><text x="260" y="143" text-anchor="middle">8</text>
    <rect x="200" y="160" width="120" height="36" rx="6" fill="none" stroke="currentColor"/><text x="260" y="183" text-anchor="middle">3  ← bottom</text>
    <line x1="330" y1="58" x2="400" y2="30" stroke="currentColor" marker-end="url(#arr23)"/>
    <text x="405" y="28">push adds here</text>
    <line x1="330" y1="66" x2="400" y2="95" stroke="currentColor" marker-end="url(#arr23)"/>
    <text x="405" y="100">pop removes here</text>
    <text x="60" y="63" text-anchor="middle" font-family="monospace">top = 3</text>
    <text x="60" y="183" text-anchor="middle" font-family="monospace">index 0</text>
    <text x="260" y="220" text-anchor="middle" font-size="12">Only the top is ever touched</text>
  </g>
</svg>

:::why
Why not just use an array and remember where the end is? That is *exactly* what a stack is: an array (or list) plus a strict discipline about which end you use, plus a pointer. The point of naming it as an **abstract data type (ADT)** is that the *interface* (push, pop, peek, isEmpty, isFull) is what matters. The caller never needs to know whether there is an array or a linked list underneath.
:::

## The five operations

The specification names five operations. Learn their names and their preconditions.

| Operation | What it does | Must check first | Effect on pointer |
|---|---|---|---|
| **push(item)** | adds `item` to the top | stack not full | `top ← top + 1` |
| **pop()** | removes and returns the top item | stack not empty | `top ← top − 1` |
| **peek()** / **top()** | returns the top item, leaves it in place | stack not empty | unchanged |
| **isEmpty()** | returns True if there are no items | — | unchanged |
| **isFull()** | returns True if no more items fit (static stack) | — | unchanged |

:::trap
- **Pop returns a value.** Write "the item is removed *and returned*". Saying only "removed" loses a mark.
- **Peek does not change the stack.** Students regularly say peek "removes the top item". It does not.
- **Check before you act.** In an algorithm question the first line of `pop` must test for an empty stack (underflow) and the first line of `push` must test for a full stack (overflow). Missing the check is the most common lost mark.
- Do not describe a stack as "a list". The examiner wants **LIFO**, **top**, **push/pop**.
:::

## Implementing a stack with an array

A **static** stack uses a fixed-size array and an integer stack pointer. With 0-based indexing, an empty stack has `top = -1`.

::::tabs
:::tab AQA pseudocode
```pseudocode
stack ← array of size MAX
top ← -1

SUBROUTINE isEmpty()
    RETURN top = -1
ENDSUBROUTINE

SUBROUTINE isFull()
    RETURN top = MAX - 1
ENDSUBROUTINE

SUBROUTINE push(item)
    IF isFull() THEN
        OUTPUT "Error: stack overflow"
    ELSE
        top ← top + 1
        stack[top] ← item
    ENDIF
ENDSUBROUTINE

SUBROUTINE pop()
    IF isEmpty() THEN
        OUTPUT "Error: stack underflow"
    ELSE
        item ← stack[top]
        top ← top - 1
        RETURN item
    ENDIF
ENDSUBROUTINE

SUBROUTINE peek()
    IF isEmpty() THEN
        OUTPUT "Error: stack empty"
    ELSE
        RETURN stack[top]
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python (array style)
```python
class Stack:
    def __init__(self, max_size):
        self.items = [None] * max_size   # fixed-size "array"
        self.max_size = max_size
        self.top = -1                    # index of top item; -1 = empty

    def is_empty(self):
        return self.top == -1

    def is_full(self):
        return self.top == self.max_size - 1

    def push(self, item):
        if self.is_full():
            raise OverflowError("stack overflow")
        self.top += 1
        self.items[self.top] = item

    def pop(self):
        if self.is_empty():
            raise IndexError("stack underflow")
        item = self.items[self.top]
        self.top -= 1
        return item

    def peek(self):
        if self.is_empty():
            raise IndexError("stack empty")
        return self.items[self.top]


s = Stack(3)
s.push(3); s.push(8); s.push(17)
print(s.is_full())   # True
print(s.pop())       # 17
print(s.peek())      # 8
print(s.pop(), s.pop())  # 8 3
print(s.is_empty())  # True
```
:::
:::tab Python (dynamic list)
```python
# Python lists grow as needed, so this is a *dynamic* stack:
# there is no "full" state and no need for a separate pointer.
stack = []
stack.append(3)      # push
stack.append(8)
print(stack[-1])     # peek -> 8
print(stack.pop())   # pop  -> 8
print(len(stack) == 0)  # is empty? -> False
```
:::
::::

:::note Order of the two steps in push and pop
In `push`, the pointer moves **first** and then the item is stored (because the pointer points at the *current* top, which is occupied). In `pop`, the item is read **first** and then the pointer moves. Get these the wrong way round and your trace will be off by one.
:::

### Try it: interactive stack

{{tool:stack-demo}}

## Worked example: tracing a sequence of operations

:::example Trace the operations on a stack of size 4
Operations: `push(5)`, `push(9)`, `pop()`, `push(2)`, `push(7)`, `peek()`, `push(1)`, `push(4)`, `pop()`.

| Step | Operation | Check | Stack (bottom → top) | top | Returned / output |
|---|---|---|---|---|---|
| 0 | start | | (empty) | −1 | |
| 1 | push(5) | not full ✓ | 5 | 0 | |
| 2 | push(9) | not full ✓ | 5, 9 | 1 | |
| 3 | pop() | not empty ✓ | 5 | 0 | 9 |
| 4 | push(2) | not full ✓ | 5, 2 | 1 | |
| 5 | push(7) | not full ✓ | 5, 2, 7 | 2 | |
| 6 | peek() | not empty ✓ | 5, 2, 7 | 2 | 7 |
| 7 | push(1) | not full ✓ | 5, 2, 7, 1 | 3 | |
| 8 | push(4) | **full ✗** | 5, 2, 7, 1 | 3 | "stack overflow" |
| 9 | pop() | not empty ✓ | 5, 2, 7 | 2 | 1 |

Notice step 8: the push is **rejected** and nothing changes. In an exam, write the error and leave the stack as it was.
:::

{{trace:2.3-1}}

## Where stacks are used

:::columns
**Inside the computer**
- **Call stack / stack frames**: every subroutine call pushes a stack frame holding the return address, parameters and local variables; returning pops it. This is how [recursion](#/topic/1.6) works.
- **Interrupts**: the processor pushes the contents of its registers (the *volatile environment*) so it can resume after the interrupt service routine. See [7.4](#/topic/7.4).
- **Evaluating Reverse Polish notation**: operands are pushed; an operator pops two, computes, pushes the result. See [3.3](#/topic/3.3).
- **Depth-first search** of a graph keeps the path on a stack so it can backtrack. See [3.1](#/topic/3.1).
|||
**In software you use**
- **Undo / redo**: each action is pushed; undo pops the most recent.
- **Browser back button**: visited pages are pushed; back pops.
- **Bracket matching** in a compiler or editor: push on `(`, pop on `)`; unmatched if the stack is empty when you need to pop, or non-empty at the end.
- **Reversing a sequence**: push every character, then pop them all.
:::

:::example Bracket checking with a stack
```python
def balanced(expr):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in expr:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return len(stack) == 0

print(balanced("(a + [b * c])"))   # True
print(balanced("(a + b]"))         # False
print(balanced("((a)"))            # False
```
The stack is empty at the end only if every opener was matched by a closer of the same type in the right order.
:::

## Static versus dynamic stacks

| | Static (array) | Dynamic (linked list / resizable list) |
|---|---|---|
| Size | fixed at creation | grows and shrinks at run time |
| Memory | may be wasted if under-used | only what is needed, plus pointer overhead |
| Can be full? | yes → overflow possible | no (until the heap runs out) |
| Speed | very fast, contiguous memory | slightly slower, memory may be fragmented |
| Typical exam phrase | "memory allocated at compile time" | "memory taken from the heap at run time" |

:::exam
- A **2-mark "describe"** on a stack wants: LIFO + one named operation (push/pop) + "top".
- A **4-mark algorithm** for pop wants: test for empty (1), read item at top (1), decrement pointer (1), return the item (1).
- When asked to **compare** a stack with a queue, say *where items are added and removed* (stack: same end; queue: rear in, front out) and name LIFO vs FIFO.
- "**State the purpose of the stack pointer**": it stores the position (index/address) of the item at the top of the stack.
:::

:::challenge
1. Modify the Python `Stack` class so that `pop` on an empty stack returns `None` instead of raising an error. Which behaviour is safer in a large program, and why?
2. Using *two* stacks, implement a queue (enqueue and dequeue). Hint: one stack for incoming items, one for outgoing.
3. Why does deep recursion crash with a "maximum recursion depth exceeded" error in Python? Relate your answer to stack overflow.
:::

:::recap
- Stack = **LIFO**; one end only, the **top**; tracked by the **stack pointer**.
- push: check full → `top ← top + 1` → store. pop: check empty → read → `top ← top − 1` → return. peek: read only.
- Empty when `top = -1`; full when `top = MAX - 1` (0-indexed).
- Underflow = pop/peek on empty; overflow = push on full. Always test first.
- Uses: call stack and recursion, interrupts, RPN evaluation, DFS, undo, back button, bracket matching.
:::

:::related
- [2.2 Queues](#/topic/2.2) — the FIFO counterpart
- [1.6 Stack frames and recursion](#/topic/1.6)
- [3.3 Reverse Polish notation](#/topic/3.3)
- [3.1 Graph traversal](#/topic/3.1)
- [7.4 Interrupts](#/topic/7.4)
:::

*/});
