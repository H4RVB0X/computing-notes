CS.registerTopic({ id: "3.2", title: "Tree traversal" }, function () {/*

:::objectives
- Trace **pre-order**, **in-order** and **post-order** traversals of a binary tree, quickly and reliably.
- Use the **"sausage" (outline) method** to check a traversal by drawing.
- Write the three recursive traversal algorithms in AQA pseudocode and Python.
- Explain why all three are **depth-first** traversals and how they differ from a breadth-first (level-order) traversal.
- Describe the **uses** of each traversal: copying a tree, prefix/infix/postfix expressions, sorted output from a binary search tree, deleting a tree.
- State the time complexity of a tree traversal.
:::

:::quick At a glance
- **Traversal** = visit every node exactly once. Trees have **no cycles**, so no visited list is needed.
- The three orders differ only in **when the node itself is visited** (output) relative to its two subtrees.
- **Pre-order**: **Node**, Left, Right. **In-order**: Left, **Node**, Right. **Post-order**: Left, Right, **Node**.
- All three are **depth-first** (they go down one subtree completely before the other).
- Sausage method: draw a line anticlockwise round the tree starting left of the root; output a node when you pass its **left** side (pre), **underneath** (in) or **right** side (post).
- Uses: **pre** → copy a tree / prefix (Polish) expression; **in** → BST in ascending order / infix; **post** → Reverse Polish (postfix), delete or free a tree, evaluate an expression tree.
- Each traversal is **O(n)**: every node is visited once.
:::

:::keyterms
Tree traversal :: The process of visiting (processing) each node in a tree exactly once in a systematic order. :: Going round every node in a fixed order.
Pre-order traversal :: A depth-first traversal that visits the node, then traverses its left subtree, then its right subtree. :: Me first, then my children.
In-order traversal :: A depth-first traversal that traverses the left subtree, visits the node, then traverses the right subtree. :: Left, me, right: gives a BST in sorted order.
Post-order traversal :: A depth-first traversal that traverses the left subtree, then the right subtree, then visits the node. :: Children first, me last.
Binary tree :: A rooted tree in which each node has at most two children (a left child and a right child). :: Every node has 0, 1 or 2 children.
Binary search tree (BST) :: A binary tree in which, for every node, all values in its left subtree are less than the node and all values in its right subtree are greater. :: Smaller goes left, bigger goes right.
Expression tree :: A binary tree in which leaves hold operands and internal nodes hold operators. :: A calculation drawn as a tree.
Leaf :: A node with no children. :: The end of a branch.
Subtree :: A node together with all of its descendants. :: A smaller tree hanging off a node.
:::

## What "visit" means

During any of the three traversals your pencil passes **every node three times**: on the way down to its left subtree, between its left and right subtrees, and on the way back up after its right subtree. The **traversal name** says on which of those three passes the node is **visited** (output, printed, processed).

| Traversal | Order | Visit the node… |
|---|---|---|
| **Pre**-order | Node → Left → Right | **before** both subtrees |
| **In**-order | Left → Node → Right | **in between** the subtrees |
| **Post**-order | Left → Right → Node | **after** both subtrees |

> Memory hook: the prefix tells you where the **node** goes. *Pre* = first, *in* = in the middle, *post* = last. Left always comes before right.

## The sausage (outline) method

This is the fastest reliable way to trace by hand, and the way most teachers mark it.

:::steps Sausage method
1. Put a **mark** on every node: on its **left** side for pre-order, **underneath** it for in-order, or on its **right** side for post-order.
2. Starting at the left of the root, draw one continuous line **anticlockwise** round the outside of the whole tree, hugging every node and branch like a sausage skin.
3. Write a node down **each time the line passes its mark**. That list is the traversal.
:::

:::figure The tree from your class slides with the outline drawn. Pre-order marks (left side) shown in blue, in-order (underneath) in green, post-order (right side) in orange.
<svg class="diagram" viewBox="0 0 600 310" role="img" aria-label="Binary tree A with children B and C; B has children D and E; E has right child G; C has right child F. A dashed outline runs anticlockwise round the tree.">
  <g stroke="currentColor" stroke-width="2">
    <line x1="300" y1="40" x2="170" y2="110"/><line x1="300" y1="40" x2="430" y2="110"/>
    <line x1="170" y1="110" x2="100" y2="190"/><line x1="170" y1="110" x2="240" y2="190"/>
    <line x1="240" y1="190" x2="300" y2="260"/><line x1="430" y1="110" x2="500" y2="190"/>
  </g>
  <path d="M272,40 L142,108 L70,190 L100,222 L130,192 L170,140 L210,190 L268,262 L300,292 L332,262 L268,186 L198,108 L300,72 L402,108 L430,140 L470,190 L500,222 L530,190 L458,108 L328,40" fill="none" stroke="currentColor" stroke-dasharray="6 5" stroke-opacity="0.6"/>
  <g font-size="16" font-family="inherit" text-anchor="middle" fill="currentColor">
    <circle cx="300" cy="40" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="300" y="46">A</text>
    <circle cx="170" cy="110" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="170" y="116">B</text>
    <circle cx="430" cy="110" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="430" y="116">C</text>
    <circle cx="100" cy="190" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="100" y="196">D</text>
    <circle cx="240" cy="190" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="240" y="196">E</text>
    <circle cx="500" cy="190" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="500" y="196">F</text>
    <circle cx="300" cy="260" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="300" y="266">G</text>
  </g>
  <g stroke="none">
    <circle cx="278" cy="40" r="4" fill="#3b82f6"/><circle cx="148" cy="110" r="4" fill="#3b82f6"/><circle cx="408" cy="110" r="4" fill="#3b82f6"/><circle cx="78" cy="190" r="4" fill="#3b82f6"/><circle cx="218" cy="190" r="4" fill="#3b82f6"/><circle cx="478" cy="190" r="4" fill="#3b82f6"/><circle cx="278" cy="260" r="4" fill="#3b82f6"/>
    <circle cx="300" cy="62" r="4" fill="#22c55e"/><circle cx="170" cy="132" r="4" fill="#22c55e"/><circle cx="430" cy="132" r="4" fill="#22c55e"/><circle cx="100" cy="212" r="4" fill="#22c55e"/><circle cx="240" cy="212" r="4" fill="#22c55e"/><circle cx="500" cy="212" r="4" fill="#22c55e"/><circle cx="300" cy="282" r="4" fill="#22c55e"/>
    <circle cx="322" cy="40" r="4" fill="#f97316"/><circle cx="192" cy="110" r="4" fill="#f97316"/><circle cx="452" cy="110" r="4" fill="#f97316"/><circle cx="122" cy="190" r="4" fill="#f97316"/><circle cx="262" cy="190" r="4" fill="#f97316"/><circle cx="522" cy="190" r="4" fill="#f97316"/><circle cx="322" cy="260" r="4" fill="#f97316"/>
  </g>
  <g font-size="13" font-family="inherit" fill="currentColor">
    <text x="20" y="270">Pre:  A B D E G C F</text>
    <text x="20" y="288">In:   D B E G A C F</text>
    <text x="20" y="306">Post: D G E B F C A</text>
  </g>
</svg>
:::

:::example Tracing the class-slide tree step by step
Tree: A has left child B and right child C. B has children D (left) and E (right). E has only a right child, G. C has only a right child, F.

**Pre-order (N L R)**
1. Visit A. Go left to B's subtree.
2. Visit B. Go left: visit D (a leaf, nothing below).
3. Back at B, go right: visit E. E has no left child; go right: visit G.
4. B's subtree done. Back at A, go right: visit C. No left child; go right: visit F.

Output: **A B D E G C F**

**In-order (L N R)**: D (leftmost), then B, then E's subtree: E has no left, so E, then G. Then A. Then C's subtree: C (no left), then F.

Output: **D B E G A C F**

**Post-order (L R N)**: D, then E's subtree: G then E, then B. Then C's subtree: F then C. Finally A.

Output: **D G E B F C A** (the root is always last in post-order and first in pre-order).
:::

:::trap All three are depth-first
Your ZigZag slide says post-order is "a type of **breadth-first** traversal". That is **wrong**. Pre-order, in-order and post-order are **all depth-first**: each finishes one whole subtree before starting the other. The only difference is when the node is output.

A **breadth-first** (level-order) traversal of the same tree would be **A B C D E F G**, visiting level by level using a queue. It is not one of the three named traversals.
:::

:::trap More slips that cost marks
- **Missing children are skipped, not swapped.** E has only a *right* child G. In in-order, E is output *before* G (there is nothing on its left). Do not move G to the left.
- The same ZigZag deck labels the uses the wrong way round: "post-order is used for a binary search tree" and "in-order is used for RPN and emptying a tree". It is the other way: **in-order** gives a BST's sorted order; **post-order** gives RPN and is used to delete a tree.
- An answer in your Section 2 textbook notes gives the post-order of the BST built from C, D, B, A, F, G as "A, B, D, F, G, A" (A twice, C missing). The correct post-order is **A B G F D C**.
- The RPN textbook answer for a pre-order traversal of `(5 + 6) * 3` is given as "+ 5 6 * 3". The correct pre-order is **`* + 5 6 3`** (the root `*` comes first).
:::

{{trace:3.2-1}}

## The algorithms

Each traversal is a short **recursive** procedure. The base case is an empty subtree (a null pointer). Only the position of the `OUTPUT` line changes.

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE preOrder(node)
    IF node ≠ Null THEN
        OUTPUT node.data
        preOrder(node.left)
        preOrder(node.right)
    ENDIF
ENDSUBROUTINE

SUBROUTINE inOrder(node)
    IF node ≠ Null THEN
        inOrder(node.left)
        OUTPUT node.data
        inOrder(node.right)
    ENDIF
ENDSUBROUTINE

SUBROUTINE postOrder(node)
    IF node ≠ Null THEN
        postOrder(node.left)
        postOrder(node.right)
        OUTPUT node.data
    ENDIF
ENDSUBROUTINE
```
:::
:::tab Python
```python
class Node:
    def __init__(self, data, left=None, right=None):
        self.data, self.left, self.right = data, left, right

def pre_order(node, out):
    if node is not None:
        out.append(node.data)            # Node
        pre_order(node.left, out)        # Left
        pre_order(node.right, out)       # Right

def in_order(node, out):
    if node is not None:
        in_order(node.left, out)
        out.append(node.data)
        in_order(node.right, out)

def post_order(node, out):
    if node is not None:
        post_order(node.left, out)
        post_order(node.right, out)
        out.append(node.data)

# The class-slide tree
root = Node("A", Node("B", Node("D"), Node("E", None, Node("G"))),
                 Node("C", None, Node("F")))
for f in (pre_order, in_order, post_order):
    out = []
    f(root, out)
    print(f.__name__, " ".join(out))
# pre_order A B D E G C F
# in_order D B E G A C F
# post_order D G E B F C A
```
:::
:::tab Array implementation
```python
# Many exam questions store a tree in three arrays: data, left pointer, right pointer.
# -1 means "no child". Index 0 is the root.
data  = ["F", "B", "G", "A", "D", "I", "C", "E", "H"]
left  = [ 1,   3,  -1,  -1,   6,   8,  -1,  -1,  -1]
right = [ 2,   4,   5,  -1,   7,  -1,  -1,  -1,  -1]

def in_order(i, out):
    if i != -1:
        in_order(left[i], out)
        out.append(data[i])
        in_order(right[i], out)

result = []
in_order(0, result)
print(" ".join(result))   # A B C D E F G H I  (a BST, so in-order is sorted)
```
:::
::::

:::note How the recursion produces the order
Each call is pushed onto the **call stack**. When `inOrder(D)` finds D has no left child, it outputs D and returns, popping back to the frame for B, which then outputs B. The call stack is doing the backtracking, exactly as in [depth-first graph search](#/topic/3.1).
:::

### Time complexity

Every node is visited exactly once and a constant amount of work is done per visit, so each traversal is **O(n)** for a tree of n nodes. You cannot do better: to output every node you must at least look at every node.

The extra **memory** is the depth of recursion, i.e. the **height** of the tree: about log₂ n for a balanced tree, but up to n for a completely unbalanced ("stick-like") tree.

## Try it: animated traversals

Build a binary search tree by inserting values, then animate pre-order, in-order and post-order. Predict the output before you press play.

{{tool:tree-traversal}}

## Uses of each traversal

| Traversal | Typical use | Why it works |
|---|---|---|
| **Pre-order** | **Copying (cloning) a tree**; saving a tree to a file so it can be rebuilt in the same shape | a parent is created before its children, so each child has somewhere to attach |
| **Pre-order** | producing **prefix (Polish) notation** from an expression tree | the operator is output before its operands |
| **In-order** | outputting the contents of a **binary search tree in ascending order** | everything smaller (left) comes out before the node, everything larger after |
| **In-order** | producing **infix** notation from an expression tree | operator between its operands (add brackets to keep precedence) |
| **Post-order** | producing **Reverse Polish (postfix) notation** from an expression tree | operands come before their operator, exactly what a stack evaluator needs |
| **Post-order** | **deleting / emptying a tree** (freeing memory) | children are deleted before their parent, so no pointer is lost |
| **Post-order** | **evaluating** an expression tree | both operand values are known before the operator is applied |

:::example Expression tree for `(a + b) * (c - d)`
<svg class="diagram" viewBox="0 0 420 200" role="img" aria-label="Expression tree: root * with left child + (a, b) and right child - (c, d)">
  <g stroke="currentColor" stroke-width="2">
    <line x1="210" y1="35" x2="120" y2="100"/><line x1="210" y1="35" x2="300" y2="100"/>
    <line x1="120" y1="100" x2="70" y2="165"/><line x1="120" y1="100" x2="170" y2="165"/>
    <line x1="300" y1="100" x2="250" y2="165"/><line x1="300" y1="100" x2="350" y2="165"/>
  </g>
  <g font-size="17" font-family="inherit" text-anchor="middle" fill="currentColor">
    <circle cx="210" cy="35" r="19" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="210" y="41">×</text>
    <circle cx="120" cy="100" r="19" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="120" y="106">+</text>
    <circle cx="300" cy="100" r="19" fill="#f97316" fill-opacity="0.3" stroke="currentColor"/><text x="300" y="106">−</text>
    <circle cx="70" cy="165" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="70" y="171">a</text>
    <circle cx="170" cy="165" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="170" y="171">b</text>
    <circle cx="250" cy="165" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="250" y="171">c</text>
    <circle cx="350" cy="165" r="19" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/><text x="350" y="171">d</text>
  </g>
</svg>

| Traversal | Output | Name of notation |
|---|---|---|
| Pre-order | `* + a b - c d` | prefix (Polish) |
| In-order | `a + b * c - d` | infix, **brackets lost**: you must add them back as `(a + b) * (c - d)` |
| Post-order | `a b + c d - *` | postfix (Reverse Polish). See [3.3](#/topic/3.3) |

The in-order output shows why in-order alone is not enough for expressions: without brackets, `a + b * c - d` means something different. Post-order needs no brackets at all.
:::

{{trace:3.2-2}}

:::exam
- **"Write the order in which nodes are visited"** (1 mark each): a single correct list. One wrong letter = 0, so check with the sausage method.
- **"Describe a use of post-order traversal"** (2 marks): name the use **and** give the reason, e.g. "deleting a tree, because a node's children are deleted before the node so no subtree becomes unreachable".
- **"Explain why an in-order traversal of a BST outputs the data in order"**: all values in the left subtree are smaller and are output first; then the node; then the larger right subtree; this applies recursively at every node.
- If asked to **complete** a recursive traversal algorithm, the marks are for: the base case / null check, the two recursive calls with `left` and `right`, and the output in the correct position.
:::

:::challenge
1. Given only the pre-order **F B A D C E G I H** and the in-order **A B C D E F G H I**, rebuild the tree. (Hint: the first pre-order item is the root; find it in the in-order list to split left and right.)
2. Write a **right-to-left** in-order traversal. What does it output for a BST?
3. Write a recursive function `height(node)` and a function that counts leaves. Which traversal order does each use?
4. Write a **level-order** (breadth-first) traversal of a binary tree using a queue.
:::

:::recap
- Pre = **N L R**, In = **L N R**, Post = **L R N**. Left always before right.
- All three are **depth-first** (the ZigZag "post-order is breadth-first" is wrong). Level-order is the breadth-first one.
- Sausage method: anticlockwise outline; marks on the **left** (pre), **bottom** (in), **right** (post).
- Class tree: pre **A B D E G C F**, in **D B E G A C F**, post **D G E B F C A**.
- Recursive algorithms differ only in where `OUTPUT` sits; each is **O(n)**.
- Uses: pre → copy a tree, prefix; in → BST sorted output, infix; post → RPN, delete a tree, evaluate an expression tree.
:::

:::related
- [2.5 Trees](#/topic/2.5) — rooted trees, binary trees and BSTs
- [3.1 Graph traversal](#/topic/3.1) — depth-first and breadth-first on graphs
- [3.3 Reverse Polish notation](#/topic/3.3) — post-order of an expression tree
- [3.4 Searching algorithms](#/topic/3.4) — binary tree search
- [1.6 Recursion](#/topic/1.6)
:::

*/});
