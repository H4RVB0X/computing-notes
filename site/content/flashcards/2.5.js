CS.registerFlashcards("2.5", [
  { front: "AQA definition of a tree.", back: "A connected, undirected graph with no cycles." },
  { front: "How many edges does a tree with n vertices have?", back: "n − 1." },
  { front: "Define a rooted tree.", back: "A tree with one vertex designated as the root, with every edge directed away from the root, giving parent–child relationships. The root is the only node with no parent." },
  { front: "Define a binary tree.", back: "A rooted tree in which each node has **at most** two children." },
  { front: "BST built from C, D, B, A, F, G: give pre-, in- and post-order.", back: "Pre: C B A D F G\nIn: A B C D F G\nPost: A B G F D C" },
  { front: "Give five typical uses of rooted trees.", back: "File systems · binary search trees · syntax/parse trees in compilers · expression trees · Huffman coding · decision/game trees · DOM/XML" },
  { front: "Three-array binary tree: what are the arrays and what marks 'no child'?", back: "data, left, right; left[i]/right[i] hold the index of each child; −1 (or 0 with 1-based arrays) = null." },
  { front: "Steps to insert into a BST.", back: "Start at the root; if new < node go left else go right; repeat until the chosen child pointer is null; attach the new node there." },
  { front: "Why can a BST become as slow as a linked list?", back: "If items arrive already sorted, every node goes the same side, height becomes n − 1 and search is linear." },
]);
