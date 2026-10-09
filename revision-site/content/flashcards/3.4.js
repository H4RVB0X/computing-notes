CS.registerFlashcards("3.4", [
  { front: "Binary search: update rules", back: "mid ← (low + high) DIV 2. If items[mid] < target: low ← mid + 1. If >: high ← mid − 1. Stop when equal or low > high." },
  { front: "Maximum comparisons for a binary search of n items", back: "**⌊log₂ n⌋ + 1** → O(log n). 7 → 3; 1,000 → 10; 1,024 → 11; 1,000,000 → 20." },
  { front: "Linear search: best, average and worst case", back: "Best 1 → O(1); average (n + 1)/2 → O(n); worst n → **O(n)**." },
  { front: "Binary tree search complexity", back: "Best O(1) (root). Balanced: **O(log n)**. Worst (unbalanced, e.g. sorted insertions): **O(n)**." },
  { front: "When is linear search preferable to binary search?", back: "Small lists; unsorted data; data that changes often; searched only once; stored in a linked list (no direct access to mid)." },
  { front: "Why use a BST instead of a sorted array?", back: "New items can be inserted without shifting/re-sorting; search stays O(log n) if the tree is balanced." },
  { front: "Binary tree search steps", back: "Start at root. Equal → found. Smaller → go left. Larger → go right. Null child → not found." },
]);
