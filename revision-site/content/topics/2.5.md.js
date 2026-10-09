CS.registerTopic({ id: "2.5", title: "Trees" }, function () {/*

:::objectives
- State the AQA definition of a **tree**: a **connected, undirected graph with no cycles**.
- Explain what a **rooted tree** is (one vertex designated the **root**, every edge directed away from it, parent–child relationships) and what a **binary tree** is (each node has at most two children).
- Use tree vocabulary: root, parent, child, leaf, subtree, branch, height.
- Describe typical **uses** of rooted trees, including **binary search trees**, file systems, syntax trees and expression trees.
- Implement a binary tree with **three arrays** (data, left pointer, right pointer) and with **node objects**, and insert into a binary search tree.
:::

:::quick At a glance
- **Tree** = a **connected, undirected graph with no cycles**. So there is exactly **one path** between any two vertices, and n vertices have **n − 1 edges**.
- **Rooted tree**: one vertex is the **root**; every edge is directed **away** from it. Every other node has exactly one **parent**; nodes with no children are **leaves**.
- **Binary tree**: a rooted tree in which each node has **at most two children** (left and right).
- **Binary search tree (BST)**: a binary tree where everything in a node's **left** subtree is **smaller** and everything in its **right** subtree is **larger**. Search halves the remaining tree at each step when balanced.
- Uses: file/folder hierarchies, BSTs for fast search, **syntax (parse) trees** in compilers, **expression trees**, decision trees, Huffman coding, routing tables.
- Array implementation: three parallel arrays **data / left / right**, with −1 (or 0) as the null pointer.
:::

:::keyterms
Tree :: A connected, undirected graph with no cycles. :: Everything joined up, no loops.
Rooted tree :: A tree in which one vertex has been designated as the root and every edge is directed away from the root. :: A tree with a top, hanging downwards.
Root :: The single node in a rooted tree that has no parent. :: The top node.
Parent :: In a rooted tree, the node directly above a given node on the path from the root. :: The node one level up.
Child :: A node directly below another node (its parent) in a rooted tree. :: A node one level down.
Leaf :: A node with no children. :: A dead end at the bottom.
Subtree :: A node together with all of its descendants. :: A branch you could snip off as its own tree.
Binary tree :: A rooted tree in which each node has at most two children. :: Every node has a left slot and a right slot.
Binary search tree :: A binary tree in which, for every node, all values in its left subtree are less than it and all values in its right subtree are greater than it. :: Smaller goes left, bigger goes right.
Height (depth) :: The number of edges on the longest path from the root to a leaf. :: How many levels down the tree goes.
:::

## What a tree is

A **tree** is a special kind of [graph](#/topic/2.4). The AQA definition has three parts, and you need all three:

> A tree is a **connected**, **undirected** graph with **no cycles**.

- **Connected**: there is a path from every vertex to every other vertex.
- **Undirected**: edges have no direction.
- **No cycles**: you cannot walk round a loop and return to where you started.

Two consequences follow, and both are useful in exams:

1. There is **exactly one path** between any two vertices.
2. A tree with **n vertices has exactly n − 1 edges**. Add one more edge and you create a cycle; remove one and it is no longer connected.

<svg class="diagram" viewBox="0 0 660 260" role="img" aria-label="Left: a graph with six vertices containing the cycle 1-2-4-3-1. Right: the same vertices with edge 3-4 removed, which is a tree with five edges and no cycles">
<g>
  <g font-family="inherit" font-size="14">
    <line x1="75.7" y1="46.9" x2="144.3" y2="33.1" stroke="currentColor" stroke-width="1.6"/>
    <line x1="68.5" y1="63.6" x2="101.5" y2="116.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="168.9" y1="43.3" x2="211.1" y2="106.7" stroke="currentColor" stroke-width="1.6"/>
    <line x1="125.9" y1="128.6" x2="204.1" y2="121.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="99.8" y1="142.3" x2="70.2" y2="177.7" stroke="currentColor" stroke-width="1.6"/>
    <line x1="225.6" y1="135.0" x2="244.4" y2="185.0" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="60" cy="50" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="60" y="55" text-anchor="middle">1</text>
    <circle cx="160" cy="30" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="35" text-anchor="middle">2</text>
    <circle cx="110" cy="130" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="110" y="135" text-anchor="middle">3</text>
    <circle cx="220" cy="120" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="220" y="125" text-anchor="middle">4</text>
    <circle cx="60" cy="190" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="60" y="195" text-anchor="middle">5</text>
    <circle cx="250" cy="200" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="250" y="205" text-anchor="middle">6</text>
  </g>
</g>
<g transform="translate(340,0)">
  <g font-family="inherit" font-size="14">
    <line x1="75.7" y1="46.9" x2="144.3" y2="33.1" stroke="currentColor" stroke-width="1.6"/>
    <line x1="68.5" y1="63.6" x2="101.5" y2="116.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="168.9" y1="43.3" x2="211.1" y2="106.7" stroke="currentColor" stroke-width="1.6"/>
    <line x1="99.8" y1="142.3" x2="70.2" y2="177.7" stroke="currentColor" stroke-width="1.6"/>
    <line x1="225.6" y1="135.0" x2="244.4" y2="185.0" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="60" cy="50" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="60" y="55" text-anchor="middle">1</text>
    <circle cx="160" cy="30" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="35" text-anchor="middle">2</text>
    <circle cx="110" cy="130" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="110" y="135" text-anchor="middle">3</text>
    <circle cx="220" cy="120" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="220" y="125" text-anchor="middle">4</text>
    <circle cx="60" cy="190" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="60" y="195" text-anchor="middle">5</text>
    <circle cx="250" cy="200" r="16" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="250" y="205" text-anchor="middle">6</text>
  </g>
</g>
  <g font-family="inherit" font-size="13"><text x="150" y="250" text-anchor="middle">Graph: has a cycle 1–2–4–3–1</text><text x="490" y="250" text-anchor="middle">Tree: connected, no cycles, 6 vertices, 5 edges</text></g>
</svg>

:::trap
- Do not define a tree as "a graph that looks like a tree" or "a hierarchical structure". The mark is for **connected, undirected, no cycles**.
- The basic AQA definition of a tree has **no root**. A root only appears in a **rooted tree**.
- "Explain why this graph is not a tree": **name a cycle** (e.g. A → C → D → A), or show it is not connected.
:::

## Rooted trees

Most trees in computing are **rooted**: one vertex is chosen as the **root**, and every edge is thought of as pointing **away** from it. This gives **parent–child** relationships:

- the **root** is the only node with **no parent**;
- every other node has **exactly one parent**;
- a node may have any number of **children**;
- a node with no children is a **leaf**;
- all other nodes are **descendants** of the root.

A file system is the classic example: folders contain folders and files, and every item lives in exactly one folder.

<svg class="diagram" viewBox="0 0 600 280" role="img" aria-label="A rooted tree representing a file system: root slash with children home, etc and bin; home contains amy and raj; amy contains cv.doc; etc contains hosts; bin contains ls">
  <g font-family="inherit" font-size="14">
    <line x1="276.4" y1="41.0" x2="173.6" y2="89.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="300.0" y1="56.0" x2="300.0" y2="74.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="323.6" y1="41.0" x2="426.4" y2="89.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="132.3" y1="119.0" x2="97.7" y2="156.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="167.7" y1="119.0" x2="202.3" y2="156.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="300.0" y1="126.0" x2="300.0" y2="149.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="80.0" y1="201.0" x2="80.0" y2="219.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="450.0" y1="126.0" x2="450.0" y2="149.0" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="300" cy="30" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="300" y="35" text-anchor="middle">/</text>
    <circle cx="150" cy="100" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="150" y="105" text-anchor="middle">home</text>
    <circle cx="300" cy="100" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="300" y="105" text-anchor="middle">etc</text>
    <circle cx="450" cy="100" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="450" y="105" text-anchor="middle">bin</text>
    <circle cx="80" cy="175" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="80" y="180" text-anchor="middle">amy</text>
    <circle cx="220" cy="175" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="220" y="180" text-anchor="middle">raj</text>
    <circle cx="300" cy="175" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="300" y="180" text-anchor="middle">hosts</text>
    <circle cx="80" cy="245" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="80" y="250" text-anchor="middle">cv.doc</text>
    <circle cx="450" cy="175" r="26" fill="#5ec27a" fill-opacity="0.3" stroke="currentColor"/>
    <text x="450" y="180" text-anchor="middle">ls</text>
  </g>
</svg>

### Typical uses of rooted trees

| Use | What the tree represents |
|---|---|
| **File systems** | folders as internal nodes, files as leaves; the path `/home/amy/cv.doc` is the unique route from the root |
| **Binary search trees** | data kept in order so it can be searched, inserted and deleted quickly (see [3.4](#/topic/3.4)) |
| **Syntax / parse trees** | compilers break a statement into its grammatical parts during syntax analysis (see [4.5](#/topic/4.5), [6.3](#/topic/6.3)) |
| **Expression trees** | operators at internal nodes, operands at leaves; traversals give infix, prefix or Reverse Polish forms (see [3.3](#/topic/3.3)) |
| **Huffman trees** | variable-length codes for compression (see [5.8](#/topic/5.8)) |
| **Decision trees / game trees** | each node a decision or game position; AI searches the tree of possible moves |
| **Organisation charts, family trees, the DOM of a web page, XML/JSON documents** | hierarchical data |
| **Routing tables** | some routers store address prefixes in a tree for fast look-up |

## Binary trees

A **binary tree** is a rooted tree in which every node has **at most two** children, called the **left child** and **right child**. Each child is itself the root of a **left subtree** or **right subtree**.

### Binary search trees

A **binary search tree (BST)** adds an ordering rule: for every node, values in its left subtree are **smaller**, values in its right subtree are **larger**. To **insert**, start at the root and go left if the new value is smaller, right if larger, until you reach an empty slot.

<svg class="diagram" viewBox="0 0 700 260" role="img" aria-label="Binary search tree with root F; F has children B and G; B has children A and D; D has children C and E; G has right child I; I has left child H">
  <g font-family="inherit" font-size="14">
    <line x1="283.7" y1="37.6" x2="176.3" y2="87.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="316.3" y1="37.6" x2="423.7" y2="87.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="147.3" y1="107.7" x2="102.7" y2="152.3" stroke="currentColor" stroke-width="1.6"/>
    <line x1="172.7" y1="107.7" x2="217.3" y2="152.3" stroke="currentColor" stroke-width="1.6"/>
    <line x1="452.7" y1="107.7" x2="497.3" y2="152.3" stroke="currentColor" stroke-width="1.6"/>
    <line x1="219.5" y1="179.6" x2="190.5" y2="220.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="240.5" y1="179.6" x2="269.5" y2="220.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="499.5" y1="179.6" x2="470.5" y2="220.4" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="300" cy="30" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="300" y="35" text-anchor="middle">F</text>
    <circle cx="160" cy="95" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="100" text-anchor="middle">B</text>
    <circle cx="440" cy="95" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="440" y="100" text-anchor="middle">G</text>
    <circle cx="90" cy="165" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="90" y="170" text-anchor="middle">A</text>
    <circle cx="230" cy="165" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="230" y="170" text-anchor="middle">D</text>
    <circle cx="510" cy="165" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="510" y="170" text-anchor="middle">I</text>
    <circle cx="180" cy="235" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="180" y="240" text-anchor="middle">C</text>
    <circle cx="280" cy="235" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="280" y="240" text-anchor="middle">E</text>
    <circle cx="460" cy="235" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="460" y="240" text-anchor="middle">H</text>
    <text x="300" y="12" text-anchor="middle" font-size="12">root</text>
    <text x="40" y="200" font-size="12">leaf</text>
    <text x="560" y="130" font-size="12">G is the parent of I</text>
    <text x="560" y="150" font-size="12">C, E, A, H are leaves</text>
  </g>
</svg>

:::example Building a BST from F, B, G, A, D, I, C, E, H
1. **F** becomes the root.
2. **B** < F → left of F.
3. **G** > F → right of F.
4. **A** < F → go left to B; A < B → left of B.
5. **D** < F → B; D > B → right of B.
6. **I** > F → G; I > G → right of G.
7. **C** < F → B; C > B → D; C < D → left of D.
8. **E** < F → B; E > B → D; E > D → right of D.
9. **H** > F → G; H > G → I; H < I → left of I.

To **search** for E: F (go left) → B (go right) → D (go right) → E found in 4 comparisons instead of up to 9 in a list.
:::

:::why Why are BSTs fast?
Each comparison discards one whole subtree. In a **balanced** BST of n items the height is about log<sub>2</sub> n, so a search of 1,000,000 items takes about 20 comparisons. If items are inserted already in order (A, B, C, D…) every node goes to the right and the tree degenerates into a list: search becomes linear. Complexity is covered in [3.4](#/topic/3.4).
:::

### Traversals in one paragraph

Visiting every node of a binary tree is done by one of three **depth-first** traversals (full detail and practice in [3.2 Tree traversal](#/topic/3.2)):

- **Pre-order**: node, then left subtree, then right subtree. Used to copy a tree or produce prefix notation.
- **In-order**: left, node, right. On a BST this outputs the values **in sorted order**.
- **Post-order**: left, right, node. Used to delete a tree or produce Reverse Polish notation.

<svg class="diagram" viewBox="0 0 480 270" role="img" aria-label="Binary search tree built from C, D, B, A, F, G: root C, left child B with left child A, right child D with right child F with right child G">
  <g font-family="inherit" font-size="14">
    <line x1="185.8" y1="41.1" x2="124.2" y2="88.9" stroke="currentColor" stroke-width="1.6"/>
    <line x1="214.2" y1="41.1" x2="275.8" y2="88.9" stroke="currentColor" stroke-width="1.6"/>
    <line x1="99.5" y1="114.6" x2="70.5" y2="155.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="301.7" y1="113.7" x2="338.3" y2="156.3" stroke="currentColor" stroke-width="1.6"/>
    <line x1="361.7" y1="183.7" x2="398.3" y2="226.3" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="200" cy="30" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="200" y="35" text-anchor="middle">C</text>
    <circle cx="110" cy="100" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="110" y="105" text-anchor="middle">B</text>
    <circle cx="290" cy="100" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="290" y="105" text-anchor="middle">D</text>
    <circle cx="60" cy="170" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="60" y="175" text-anchor="middle">A</text>
    <circle cx="350" cy="170" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="350" y="175" text-anchor="middle">F</text>
    <circle cx="410" cy="240" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="410" y="245" text-anchor="middle">G</text>
  </g>
</svg>

:::trap Correcting the textbook answer
The textbook builds a BST from **C, D, B, A, F, G** (drawn above) and gives the post-order traversal as "A, B, D, F, G, A". That is **wrong**: A appears twice and C is missing. The correct traversals are:

- **Post-order: A, B, G, F, D, C** (C, the root, always comes **last** in post-order).
- **Pre-order: C, B, A, D, F, G** (the textbook's "C, A, B, D, F, G" is also wrong: after C you must visit B before its child A).
- **In-order: A, B, C, D, F, G** (sorted, as expected for a BST).

Quick check: pre-order always **starts** with the root; post-order always **ends** with the root; in-order of a BST is always sorted.
:::

{{tool:tree-traversal}}

## Implementing a binary tree

### Method 1: three arrays

A tree can be stored in three parallel 1-D arrays (or one array of records): **data**, **left** and **right**. `left[i]` and `right[i]` hold the **index** of node i's children, with **−1** meaning "no child" (some textbooks use 1-based arrays and 0 for null). The root is at index 0, and a `free` variable says where the next node goes.

The BST above, stored in arrays:

| Index | data | left | right |
|---|---|---|---|
| 0 | F | 1 | 2 |
| 1 | B | 3 | 4 |
| 2 | G | −1 | 5 |
| 3 | A | −1 | −1 |
| 4 | D | 6 | 7 |
| 5 | I | 8 | −1 |
| 6 | C | −1 | −1 |
| 7 | E | −1 | −1 |
| 8 | H | −1 | −1 |

Nodes are stored in the **order they were inserted**, not in tree order. The pointers carry the structure.

::::tabs
:::tab AQA pseudocode
```pseudocode
# data, left, right are arrays of size MAX; root is index 0
SUBROUTINE insert(item)
    IF free = MAX THEN
        OUTPUT "Tree full"
    ELSE
        data[free] ← item
        left[free] ← -1
        right[free] ← -1
        IF free > 0 THEN              # not the first node
            current ← 0
            placed ← False
            WHILE NOT placed
                IF item < data[current] THEN
                    IF left[current] = -1 THEN
                        left[current] ← free
                        placed ← True
                    ELSE
                        current ← left[current]
                    ENDIF
                ELSE
                    IF right[current] = -1 THEN
                        right[current] ← free
                        placed ← True
                    ELSE
                        current ← right[current]
                    ENDIF
                ENDIF
            ENDWHILE
        ENDIF
        free ← free + 1
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python (three arrays)
```python
MAX = 10
data  = [None] * MAX
left  = [-1] * MAX
right = [-1] * MAX
free = 0

def insert(item):
    global free
    if free == MAX:
        return "full"
    data[free] = item
    if free > 0:
        current = 0
        while True:
            if item < data[current]:
                if left[current] == -1:
                    left[current] = free
                    break
                current = left[current]
            else:
                if right[current] == -1:
                    right[current] = free
                    break
                current = right[current]
    free += 1

def in_order(i):
    if i == -1:
        return []
    return in_order(left[i]) + [data[i]] + in_order(right[i])

for ch in "FBGADICEH":
    insert(ch)
for i in range(free):
    print(i, data[i], left[i], right[i])
print(in_order(0))   # ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
```
:::
::::

{{trace:2.5-1}}

### Method 2: node objects (dynamic)

In an object-oriented language each node is an object holding its data and **references (pointers)** to its left and right children, created on the heap as needed. This is a **dynamic** structure: no fixed size, no `free` index.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None      # null pointer
        self.right = None

def insert(root, data):
    if root is None:
        return Node(data)
    if data < root.data:
        root.left = insert(root.left, data)
    else:
        root.right = insert(root.right, data)
    return root

def search(root, target):
    steps = 0
    while root is not None:
        steps += 1
        if target == root.data:
            return steps
        root = root.left if target < root.data else root.right
    return -1          # not found

def post_order(n):
    return [] if n is None else post_order(n.left) + post_order(n.right) + [n.data]

root = None
for ch in "CDBAFG":
    root = insert(root, ch)
print(post_order(root))      # ['A', 'B', 'G', 'F', 'D', 'C']
print(search(root, "G"))     # 4 comparisons: C, D, F, G
print(search(root, "Z"))     # -1
```

:::exam
- **Define a tree (1–2 marks)**: "connected, undirected graph with no cycles". All three words count.
- **Define a rooted / binary tree**: rooted = one vertex designated the root, edges directed away from it, parent–child relationships; binary = rooted tree where each node has **at most** two children ("exactly two" is wrong).
- **"Give uses of trees" (2–3 marks)**: name the use **and** what the tree does there (e.g. "BST — allows data to be searched efficiently"; "syntax tree — used by a compiler to check the structure of a statement").
- **Array questions**: you may be asked to complete left/right pointer columns after insertions, or to draw the tree from the arrays. Follow the pointers, not the row order.
- **Graph vs tree**: a tree is a graph, but a graph is a tree only if connected with no cycles; trees have n − 1 edges.
:::

:::challenge
1. Insert the months JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC (alphabetical comparison) into an empty BST. What is its height? What order would make the height as large as possible?
2. Write `delete(value)` for the node-object BST. Handle three cases: a leaf, a node with one child, a node with two children (replace with its in-order successor).
3. Draw the expression tree for `(7 + 3) * ((23 + 7) - 5)` and write its post-order traversal. Check it against [3.3 Reverse Polish notation](#/topic/3.3).
4. Prove that a tree with n vertices has n − 1 edges (hint: repeatedly remove a leaf).
:::

:::recap
- **Tree** = connected, undirected graph with **no cycles**; one path between any two vertices; n − 1 edges.
- **Rooted tree**: a designated root, edges directed away; parent, child, leaf, subtree.
- **Binary tree**: at most two children per node. **BST**: left smaller, right larger.
- Uses: file systems, BST search, syntax trees, expression trees, Huffman, decision/game trees.
- Arrays implementation: **data / left / right** with −1 as null; nodes stored in insertion order.
- Object implementation: node objects with left/right references, created dynamically on the heap.
- Post-order ends with the root: for C, D, B, A, F, G it is **A, B, G, F, D, C**.
:::

:::related
- [2.4 Graphs](#/topic/2.4) — trees are graphs without cycles
- [3.2 Tree traversal](#/topic/3.2) — pre-, in- and post-order in detail
- [3.4 Searching algorithms](#/topic/3.4) — binary tree search and its complexity
- [3.3 Reverse Polish notation](#/topic/3.3) — expression trees and post-order
:::

*/});
