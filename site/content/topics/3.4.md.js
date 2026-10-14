CS.registerTopic({ id: "3.4", title: "Searching algorithms" }, function () {/*

:::objectives
- Describe and trace a **linear search**, and derive its time complexity **O(n)**.
- Describe and trace a **binary search** using **low**, **mid** and **high**, and derive its time complexity **O(log n)**.
- Work out the **maximum number of comparisons** a binary search needs for a list of n items.
- Trace a **binary tree search** on a binary search tree and state its complexity: **O(log n)** when balanced, **O(n)** in the worst case.
- Choose the right search for a situation and justify the choice.
:::

:::quick At a glance
- **Linear search**: check each item in turn from the start. Works on **unsorted** data. Best O(1), worst and average **O(n)**.
- **Binary search**: data must be **sorted**. Look at the **middle** item; discard the half that cannot contain the target; repeat. **mid = (low + high) DIV 2**.
- Each binary search comparison **halves** the range, so the worst case is ⌊log₂ n⌋ + 1 comparisons: **O(log n)**. 1,000 items → 10; 1,000,000 → 20.
- **Binary tree search**: start at the root of a BST; go **left** if the target is smaller, **right** if larger.
- Binary tree search is **O(log n)** if the tree is **balanced**, but **O(n)** in the worst case (an unbalanced, stick-like tree).
- Choose linear for small or unsorted or frequently changing data; binary for large sorted arrays; a BST when data is frequently inserted and must stay searchable.
:::

:::keyterms
Linear search :: A search that examines each item of a list in turn, from the first, until the target is found or the end of the list is reached. :: Check every item one by one.
Binary search :: A search of a sorted list that repeatedly compares the target with the middle item of the current range and discards the half that cannot contain it. :: Keep halving a sorted list.
Midpoint (mid) :: The index of the middle item of the current range, calculated as (low + high) DIV 2. :: The item you check each time.
Binary tree search :: A search of a binary search tree that starts at the root and moves to the left or right child depending on whether the target is less than or greater than the current node. :: Go left or right down a BST.
Balanced tree :: A tree in which the depths of the leaves differ by at most a small amount, so its height is about log₂ n. :: Short and bushy, not long and thin.
Time complexity :: How the number of steps an algorithm takes grows as the size of its input grows, usually stated for the worst case in Big-O notation. :: How it slows down as n gets big.
Logarithmic complexity, O(log n) :: Complexity in which doubling the input size adds only a constant amount of extra work. :: Double the data, one more step.
Linear complexity, O(n) :: Complexity in which the work grows in direct proportion to the input size. :: Double the data, double the work.
:::

## Linear search

The only way to find something in an **unordered** list is to look at the items one at a time.

::::tabs
:::tab AQA pseudocode
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
:::
:::tab Python
```python
def linear_search(items, target):
    for i in range(len(items)):
        print(f"compare items[{i}] = {items[i]} with {target}")
        if items[i] == target:
            return i              # stop as soon as it is found
    return -1                     # reached the end: not found

data = [2, 39, 45, 10, 8, 5, 6]
print(linear_search(data, 8))     # 4   (after 5 comparisons)
print(linear_search(data, 16))    # -1  (after 7 comparisons)
```
:::
::::

:::example Class slide exercise: list `2, 39, 45, 10, 8, 5, 6`
| i | items[i] | = 8? |
|---|---|---|
| 0 | 2 | no |
| 1 | 39 | no |
| 2 | 45 | no |
| 3 | 10 | no |
| 4 | 8 | **yes**, return 4 |

Finding 8 takes **5** comparisons. Searching for 16 compares all **7** items and returns −1.
:::

### Complexity of linear search

The basic operation is the comparison `items[i] = target`.

- **Best case**: target is first, **1** comparison → O(1).
- **Worst case**: target is last or absent, **n** comparisons → **O(n)**.
- **Average** (target present, every position equally likely): `(1 + 2 + … + n) / n = (n + 1) / 2` comparisons. Constants are dropped in Big-O, so this is still **O(n)**.

When an exam asks for "the time complexity" give the **worst case: O(n)**.

:::trap
- A `FOR` loop that keeps going after the item is found is still correct but wasteful; its best case is also n comparisons. Use a `WHILE` loop with a `found` flag, or `RETURN` as soon as you find it.
- Linear search does **not** need sorted data. If a question says the data is unsorted, binary search is not an option.
:::

## Binary search

If the data is **sorted**, you can do far better. Compare the target with the **middle** item:
- equal → found;
- middle item **smaller** than target → the target can only be to the right: **low ← mid + 1**;
- middle item **larger** → it can only be to the left: **high ← mid − 1**.

If **low > high** the range is empty and the item is not in the list.

<svg class="diagram" viewBox="0 0 640 300" role="img" aria-label="Binary search for 61 in a list of nine items: the range low..high shrinks from 0..8 to 5..8 to 7..8 to 8..8">
  <g font-size="14" font-family="inherit" text-anchor="middle" fill="currentColor">
    <text x="144" y="22" font-size="12">0</text>
    <text x="196" y="22" font-size="12">1</text>
    <text x="248" y="22" font-size="12">2</text>
    <text x="300" y="22" font-size="12">3</text>
    <text x="352" y="22" font-size="12">4</text>
    <text x="404" y="22" font-size="12">5</text>
    <text x="456" y="22" font-size="12">6</text>
    <text x="508" y="22" font-size="12">7</text>
    <text x="560" y="22" font-size="12">8</text>
    <text x="55" y="60" font-size="13">Step 1</text>
    <rect x="120" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="144" y="59" >5</text>
    <rect x="172" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="196" y="59" >9</text>
    <rect x="224" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="248" y="59" >11</text>
    <rect x="276" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="300" y="59" >15</text>
    <rect x="328" y="34" width="48" height="38" rx="5" fill="#f97316" fill-opacity="0.55" stroke="currentColor"/>
    <text x="352" y="59" >23</text>
    <rect x="380" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="404" y="59" >45</text>
    <rect x="432" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="456" y="59" >54</text>
    <rect x="484" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="508" y="59" >58</text>
    <rect x="536" y="34" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="560" y="59" >61</text>
    <text x="144" y="88" font-size="11">low</text>
    <text x="560" y="88" font-size="11">high</text>
    <text x="352" y="88" font-size="11" dy="0">(mid)</text>
    <text x="55" y="124" font-size="13">Step 2</text>
    <rect x="120" y="98" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="144" y="123" fill-opacity="0.35">5</text>
    <rect x="172" y="98" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="196" y="123" fill-opacity="0.35">9</text>
    <rect x="224" y="98" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="248" y="123" fill-opacity="0.35">11</text>
    <rect x="276" y="98" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="300" y="123" fill-opacity="0.35">15</text>
    <rect x="328" y="98" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="352" y="123" fill-opacity="0.35">23</text>
    <rect x="380" y="98" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="404" y="123" >45</text>
    <rect x="432" y="98" width="48" height="38" rx="5" fill="#f97316" fill-opacity="0.55" stroke="currentColor"/>
    <text x="456" y="123" >54</text>
    <rect x="484" y="98" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="508" y="123" >58</text>
    <rect x="536" y="98" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="560" y="123" >61</text>
    <text x="404" y="152" font-size="11">low</text>
    <text x="560" y="152" font-size="11">high</text>
    <text x="456" y="95" font-size="11">mid</text>
    <text x="55" y="188" font-size="13">Step 3</text>
    <rect x="120" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="144" y="187" fill-opacity="0.35">5</text>
    <rect x="172" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="196" y="187" fill-opacity="0.35">9</text>
    <rect x="224" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="248" y="187" fill-opacity="0.35">11</text>
    <rect x="276" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="300" y="187" fill-opacity="0.35">15</text>
    <rect x="328" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="352" y="187" fill-opacity="0.35">23</text>
    <rect x="380" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="404" y="187" fill-opacity="0.35">45</text>
    <rect x="432" y="162" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="456" y="187" fill-opacity="0.35">54</text>
    <rect x="484" y="162" width="48" height="38" rx="5" fill="#f97316" fill-opacity="0.55" stroke="currentColor"/>
    <text x="508" y="187" >58</text>
    <rect x="536" y="162" width="48" height="38" rx="5" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/>
    <text x="560" y="187" >61</text>
    <text x="508" y="216" font-size="11">low</text>
    <text x="560" y="216" font-size="11">high</text>
    <text x="508" y="159" font-size="11">mid</text>
    <text x="55" y="252" font-size="13">Step 4</text>
    <rect x="120" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="144" y="251" fill-opacity="0.35">5</text>
    <rect x="172" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="196" y="251" fill-opacity="0.35">9</text>
    <rect x="224" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="248" y="251" fill-opacity="0.35">11</text>
    <rect x="276" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="300" y="251" fill-opacity="0.35">15</text>
    <rect x="328" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="352" y="251" fill-opacity="0.35">23</text>
    <rect x="380" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="404" y="251" fill-opacity="0.35">45</text>
    <rect x="432" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="456" y="251" fill-opacity="0.35">54</text>
    <rect x="484" y="226" width="48" height="38" rx="5" fill="none" stroke="currentColor" stroke-opacity="0.3"/>
    <text x="508" y="251" fill-opacity="0.35">58</text>
    <rect x="536" y="226" width="48" height="38" rx="5" fill="#f97316" fill-opacity="0.55" stroke="currentColor"/>
    <text x="560" y="251" >61</text>
    <text x="560" y="280" font-size="11">low</text>
    <text x="560" y="223" font-size="11">mid</text>
  </g>
</svg>

::::tabs
:::tab AQA pseudocode (iterative)
```pseudocode
SUBROUTINE binarySearch(items, target)
    low ← 0
    high ← LEN(items) - 1
    WHILE low ≤ high
        mid ← (low + high) DIV 2
        IF items[mid] = target THEN
            RETURN mid
        ELSE IF items[mid] < target THEN
            low ← mid + 1
        ELSE
            high ← mid - 1
        ENDIF
    ENDWHILE
    RETURN -1
ENDSUBROUTINE
```
:::
:::tab Python (iterative)
```python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2              # DIV 2
        print(f"low={low} high={high} mid={mid} items[mid]={items[mid]}")
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            low = mid + 1                    # discard left half and mid
        else:
            high = mid - 1                   # discard right half and mid
    return -1

data = [5, 9, 11, 15, 23, 45, 54, 58, 61]
print(binary_search(data, 61))   # 8
print(binary_search(data, 16))   # -1
```
:::
:::tab Python (recursive)
```python
def binary_search_rec(items, target, low, high):
    if low > high:                           # base case: empty range
        return -1
    mid = (low + high) // 2
    if items[mid] == target:
        return mid
    elif items[mid] < target:
        return binary_search_rec(items, target, mid + 1, high)
    else:
        return binary_search_rec(items, target, low, mid - 1)

data = [5, 9, 11, 15, 23, 45, 54, 58, 61]
print(binary_search_rec(data, 54, 0, len(data) - 1))   # 6
```
:::
::::

:::example Binary search for 61 in `5, 9, 11, 15, 23, 45, 54, 58, 61`
| Comparison | low | high | mid | items[mid] | Decision |
|---|---|---|---|---|---|
| 1 | 0 | 8 | 4 | 23 | 23 < 61 → low = 5 |
| 2 | 5 | 8 | 6 | 54 | 54 < 61 → low = 7 |
| 3 | 7 | 8 | 7 | 58 | 58 < 61 → low = 8 |
| 4 | 8 | 8 | 8 | 61 | **found** at index 8 |

Searching for **23** in the same list (ZigZag question 2) needs just **1** comparison: it is the first midpoint.
:::

:::example Binary search for 16 (not in the list)
| Comparison | low | high | mid | items[mid] | Decision |
|---|---|---|---|---|---|
| 1 | 0 | 8 | 4 | 23 | 23 > 16 → high = 3 |
| 2 | 0 | 3 | 1 | 9 | 9 < 16 → low = 2 |
| 3 | 2 | 3 | 2 | 11 | 11 < 16 → low = 3 |
| 4 | 3 | 3 | 3 | 15 | 15 < 16 → low = 4 |
| — | 4 | 3 | | | low > high → **not found** |
:::

:::trap
- **mid uses integer division** (DIV). With an even number of items in the range, mid is the **left** of the two middle items. `(0 + 7) DIV 2 = 3`, not 3.5 and not 4.
- Set **low = mid + 1** or **high = mid − 1**, not `mid`. Using `mid` can loop forever when low and high are next to each other.
- The loop condition is **low ≤ high**. The textbook pseudocode answer (`REPEAT … UNTIL record at mid = FindMe`) never stops if the item is missing.
- The Section 3 textbook answer says "the **linear** search is much more efficient as it will halve the amount of records". It means **binary** search.
:::

{{trace:3.4-1}}

### Deriving the complexity of binary search

Each comparison discards half of the remaining range. Starting with n items, after k comparisons about n ÷ 2<sup>k</sup> items remain. The search must stop once one item is left and has been checked, so in the worst case:

**maximum comparisons = ⌊log₂ n⌋ + 1**

| Items n | Max comparisons | Linear search worst case |
|---|---|---|
| 7 | 3 | 7 |
| 10 | 4 | 10 |
| 100 | 7 | 100 |
| 1,000 | 10 | 1,000 |
| 1,024 | **11** | 1,024 |
| 1,000,000 | 20 | 1,000,000 |
| 1,000,000,000 | 30 | 1,000,000,000 |

The +1 is a constant and is dropped, so binary search is **O(log n)**: doubling the data adds only **one** comparison. Best case O(1) (the first midpoint).

:::trap
Your slide says 1,024 items take "at most 10 passes". Halving 1,024 down to 1 takes 10 halvings, but you still have to **compare** that last item, so the worst case is **11** comparisons (⌊log₂ 1024⌋ + 1). For 1,000 items it is 10, because ⌊log₂ 1000⌋ = 9.
:::

## Try it: searching visualiser

Run linear and binary search side by side on the same list and compare the number of comparisons.

{{tool:searching-visualiser}}

## Binary tree search

A **binary search tree (BST)** keeps the binary-search idea but in a linked structure: for every node, smaller values are in its **left** subtree, larger in its **right**. New items can be inserted without re-sorting an array.

:::steps Binary tree search
1. Start at the **root**.
2. If the node holds the target, it is **found**.
3. If the target is **smaller**, move to the **left** child; if **larger**, move to the **right** child.
4. If the child you need does not exist (null), the target is **not in the tree**.
:::

:::figure BST built by inserting 45, 32, 2, 78, 5, 9, 38, 23, 6 (ZigZag question 3). Searching for 23 follows the highlighted path.
<svg class="diagram" viewBox="0 0 560 350" role="img" aria-label="Binary search tree with root 45. Left 32 (left 2, right 38), right 78. 2 has right child 5; 5 right child 9; 9 has children 6 and 23. Path 45, 32, 2, 5, 9, 23 highlighted.">
  <g stroke="currentColor" stroke-width="2">
    <line x1="300" y1="35" x2="180" y2="95" stroke="#f97316" stroke-width="4"/><line x1="300" y1="35" x2="420" y2="95"/>
    <line x1="180" y1="95" x2="110" y2="155" stroke="#f97316" stroke-width="4"/><line x1="180" y1="95" x2="250" y2="155"/>
    <line x1="110" y1="155" x2="170" y2="215" stroke="#f97316" stroke-width="4"/><line x1="170" y1="215" x2="230" y2="270" stroke="#f97316" stroke-width="4"/>
    <line x1="230" y1="270" x2="190" y2="325"/><line x1="230" y1="270" x2="280" y2="325" stroke="#f97316" stroke-width="4"/>
  </g>
  <g font-size="15" font-family="inherit" text-anchor="middle" fill="currentColor">
    <circle cx="300" cy="35" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="300" y="40">45</text>
    <circle cx="180" cy="95" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="180" y="100">32</text>
    <circle cx="420" cy="95" r="19" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="420" y="100">78</text>
    <circle cx="110" cy="155" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="110" y="160">2</text>
    <circle cx="250" cy="155" r="19" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="250" y="160">38</text>
    <circle cx="170" cy="215" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="170" y="220">5</text>
    <circle cx="230" cy="270" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="230" y="275">9</text>
    <circle cx="190" cy="325" r="19" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="190" y="330">6</text>
    <circle cx="280" cy="325" r="19" fill="#f97316" fill-opacity="0.45" stroke="currentColor"/><text x="280" y="330">23</text>
    <text x="440" y="250" font-size="13">Search 23:</text>
    <text x="440" y="270" font-size="13">45 → 32 → 2 → 5 → 9 → 23</text>
    <text x="440" y="290" font-size="13">6 comparisons</text>
  </g>
</svg>
:::

:::example Searches in this tree
| Target | Path | Comparisons | Result |
|---|---|---|---|
| 32 | 45 → 32 | 2 | found (ZigZag Q5) |
| 23 | 45 → 32 → 2 → 5 → 9 → 23 | 6 | found |
| 40 | 45 → 32 → 38 → (right of 38 is empty) | 3 | not found |

For the ZigZag Q4 tree (insert 56, 12, 4, 7, 98, 32, 65, 86, 26, 77), searching for 65 goes 56 → 98 → 65: **3** comparisons (Q6).
:::

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE treeSearch(node, target)
    IF node = Null THEN
        RETURN False
    ELSE IF target = node.data THEN
        RETURN True
    ELSE IF target < node.data THEN
        RETURN treeSearch(node.left, target)
    ELSE
        RETURN treeSearch(node.right, target)
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python
```python
class Node:
    def __init__(self, data):
        self.data, self.left, self.right = data, None, None

def insert(root, value):
    if root is None:
        return Node(value)
    if value < root.data:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root

def tree_search(node, target, path=None):
    path = [] if path is None else path
    if node is None:
        return False, path
    path.append(node.data)
    if target == node.data:
        return True, path
    if target < node.data:
        return tree_search(node.left, target, path)
    return tree_search(node.right, target, path)

root = None
for v in [45, 32, 2, 78, 5, 9, 38, 23, 6]:
    root = insert(root, v)
print(tree_search(root, 23))   # (True, [45, 32, 2, 5, 9, 23])
print(tree_search(root, 40))   # (False, [45, 32, 38])
```
:::
::::

{{trace:3.4-2}}

### Complexity of binary tree search

Each comparison moves **one level down** the tree, so the number of comparisons is at most the tree's **height** (number of levels).

<svg class="diagram" viewBox="0 0 600 230" role="img" aria-label="Left: a balanced BST of seven nodes with height 3. Right: the same values inserted in sorted order, forming a stick of height 7.">
  <g stroke="currentColor" stroke-width="2">
    <line x1="150" y1="40" x2="90" y2="100"/><line x1="150" y1="40" x2="210" y2="100"/>
    <line x1="90" y1="100" x2="60" y2="160"/><line x1="90" y1="100" x2="120" y2="160"/>
    <line x1="210" y1="100" x2="180" y2="160"/><line x1="210" y1="100" x2="240" y2="160"/>
    <line x1="360" y1="25" x2="390" y2="55"/><line x1="390" y1="55" x2="420" y2="85"/><line x1="420" y1="85" x2="450" y2="115"/><line x1="450" y1="115" x2="480" y2="145"/><line x1="480" y1="145" x2="510" y2="175"/><line x1="510" y1="175" x2="540" y2="205"/>
  </g>
  <g font-size="13" font-family="inherit" text-anchor="middle" fill="currentColor">
    <circle cx="150" cy="40" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="150" y="45">4</text>
    <circle cx="90" cy="100" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="90" y="105">2</text>
    <circle cx="210" cy="100" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="210" y="105">6</text>
    <circle cx="60" cy="160" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="60" y="165">1</text>
    <circle cx="120" cy="160" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="120" y="165">3</text>
    <circle cx="180" cy="160" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="180" y="165">5</text>
    <circle cx="240" cy="160" r="15" fill="#22c55e" fill-opacity="0.3" stroke="currentColor"/><text x="240" y="165">7</text>
    <text x="150" y="210">Balanced: height 3 → O(log n)</text>
    <circle cx="360" cy="25" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="360" y="30">1</text>
    <circle cx="390" cy="55" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="390" y="60">2</text>
    <circle cx="420" cy="85" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="420" y="90">3</text>
    <circle cx="450" cy="115" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="450" y="120">4</text>
    <circle cx="480" cy="145" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="480" y="150">5</text>
    <circle cx="510" cy="175" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="510" y="180">6</text>
    <circle cx="540" cy="205" r="13" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="540" y="210">7</text>
    <text x="400" y="200">Inserted in sorted order:</text>
    <text x="400" y="218">height 7 → O(n)</text>
  </g>
</svg>

| Case | Tree shape | Comparisons | Big-O |
|---|---|---|---|
| Best | target at the root | 1 | O(1) |
| Typical / balanced | height ≈ log₂ n | ≈ ⌊log₂ n⌋ + 1 | **O(log n)** |
| Worst | completely **unbalanced** (e.g. data inserted already sorted): a linked list in disguise | n | **O(n)** |

So binary tree search is **O(log n)** for a balanced tree but **O(n)** in the worst case. Self-balancing trees (AVL, red-black: beyond the specification) exist to keep it O(log n).

## Choosing a search

| | Linear | Binary | Binary tree |
|---|---|---|---|
| Data must be | anything, unsorted is fine | **sorted**, in an array (direct access to mid) | stored in a BST |
| Worst-case time | O(n) | O(log n) | O(log n) balanced; O(n) unbalanced |
| Insert new item | O(1) at end | expensive: keep the array sorted (shift items) | follow a path: O(log n) if balanced |
| Good for | small lists; unsorted or rarely searched data; linked lists | large, sorted, rarely changing data | data that changes often and must stay searchable |

:::why Why not always sort and use binary search?
Sorting costs at least O(n log n) (see [3.5](#/topic/3.5)). If you only search once, a single O(n) linear search is cheaper. Sorting pays off when you search the same data **many** times. Binary search also needs **direct access** to the middle item, so it is no good on a linked list.
:::

{{tool:tree-traversal}}

:::exam
- **"Explain how a binary search works"** (3–4 marks): list must be sorted; compare target with middle item; if equal found; if target smaller discard upper half (high = mid − 1), else discard lower half (low = mid + 1); repeat until found or range empty.
- **"How many comparisons…"**: trace it; do not just use the formula unless asked for the maximum.
- **"State the time complexity of…"**: linear O(n); binary O(log n); binary tree search O(log n) if balanced, O(n) worst case. For a mark, add the reason (halving / one level per comparison / every item checked).
- **"Compare"/"evaluate"** questions want **conditions**: sorted? size? how often does the data change? direct access?
:::

:::challenge
1. Modify `binary_search` to count comparisons and test the formula ⌊log₂ n⌋ + 1 for n = 1 to 100.
2. Adapt binary search for a list sorted in **descending** order.
3. Insert the values 10, 20, 30, 40, 50 into a BST in a different order so that the height is as small as possible.
4. Why can't binary search be used directly on a linked list, even a sorted one?
:::

:::recap
- **Linear search**: any order of data; worst/average **O(n)**, best O(1).
- **Binary search**: sorted data; `mid ← (low + high) DIV 2`; `low ← mid + 1` or `high ← mid − 1`; stop when found or low > high.
- Max binary search comparisons = **⌊log₂ n⌋ + 1** → **O(log n)**. 1,000 → 10; 1,024 → 11; 1,000,000 → 20.
- **Binary tree search**: left if smaller, right if larger; comparisons ≤ tree height.
- Balanced BST → **O(log n)**; unbalanced (sorted insertions) → **O(n)**.
:::

:::related
- [2.5 Trees](#/topic/2.5) — binary search trees
- [3.5 Sorting algorithms](#/topic/3.5) — getting data sorted for binary search
- [4.6 Classification of algorithms](#/topic/4.6) — Big-O notation
- [1.6 Recursion](#/topic/1.6)
:::

*/});
