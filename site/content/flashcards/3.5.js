CS.registerFlashcards("3.5", [
  { front: "Bubble sort: what happens in one pass?", back: "Compare each adjacent pair from the start; swap if the left is bigger. The largest unsorted item ends up at the end." },
  { front: "Two improvements to bubble sort", back: "1. **Swap flag**: stop after a pass with no swaps. 2. **Shrink**: each pass stops one place earlier (the end is already sorted)." },
  { front: "Bubble sort complexities", back: "Worst/average **O(n²)** (n(n−1)/2 comparisons); best **O(n)** with flag; space **O(1)**." },
  { front: "Merge sort complexities", back: "Time **O(n log n)** best, average and worst; space **O(n)**." },
  { front: "How do you merge two sorted lists?", back: "Compare the front items, move the smaller to the result, repeat; when one list is empty copy the rest of the other." },
  { front: "Why is merge sort O(n log n)?", back: "log₂ n levels of halving × about n operations to merge each level." },
  { front: "Applications of merge sort", back: "Large data sets · linked lists · external sorting of files too big for RAM · when stability and guaranteed speed matter (basis of Python's Timsort)" },
  { front: "When is bubble sort acceptable?", back: "Small or nearly sorted lists; very limited memory (in place); checking whether a list is already sorted." },
]);
