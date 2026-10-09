CS.registerFlashcards("3.2", [
  { front: "Pre-, in- and post-order: the three patterns", back: "Pre: **Node** L R · In: L **Node** R · Post: L R **Node**" },
  { front: "Sausage method: where does the mark go for each traversal?", back: "Pre-order → **left** side · In-order → **underneath** · Post-order → **right** side. Then trace anticlockwise from the left of the root." },
  { front: "Uses of pre-order traversal", back: "Copying a tree (parents created before children) · producing prefix (Polish) notation from an expression tree" },
  { front: "Uses of in-order traversal", back: "Outputting a binary search tree in ascending order · producing infix notation (brackets must be added)" },
  { front: "Uses of post-order traversal", back: "Producing Reverse Polish (postfix) notation · deleting/emptying a tree · evaluating an expression tree" },
  { front: "Are pre/in/post-order depth-first or breadth-first?", back: "All three are **depth-first**. Breadth-first = level-order (uses a queue)." },
  { front: "Time complexity of a tree traversal of n nodes, and its recursion depth", back: "**O(n)** time. Recursion depth = height: ~log₂ n if balanced, up to n if unbalanced." },
  { front: "Class tree A(B(D, E(–, G)), C(–, F)): pre, in, post", back: "Pre **A B D E G C F** · In **D B E G A C F** · Post **D G E B F C A**" },
]);
