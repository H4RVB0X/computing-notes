CS.registerFlashcards("4.6", [
  { front: "Big-O classes from best to worst?", back: "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)" },
  { front: "How do you turn T(n) = 4n³ + 2n² + 9 into Big-O?", back: "Keep the dominant term, drop constants: **O(n³)**." },
  { front: "Rules for deriving complexity from code?", back: "Sequence → add, keep the biggest. Loop over n → multiply body by n. Nested loops over n → n². Halving/doubling loop → log n. Recursion → count the calls." },
  { front: "Worst-case complexities: linear search, binary search, bubble sort, insertion sort, merge sort?", back: "O(n), O(log n), O(n²), O(n²), O(n log n)" },
  { front: "Domain vs co-domain vs range?", back: "Domain = inputs. Co-domain = set outputs are drawn from (e.g. ℕ). Range = outputs actually produced (a subset of the co-domain)." },
  { front: "Number of permutations of n distinct objects?", back: "n! = n × (n−1) × … × 1. E.g. 4! = 24, 5! = 120." },
  { front: "log₂ n in plain English?", back: "How many times you can halve n before reaching 1 (the power of 2 that gives n). log₂ 1024 = 10." },
  { front: "Effect of doubling n on O(n), O(n²), O(log n) and O(2ⁿ)?", back: "O(n): ×2. O(n²): ×4. O(log n): +1 step. O(2ⁿ): the time is squared (each +1 to n doubles it)." },
  { front: "Time vs space complexity trade-off example?", back: "Merge sort: O(n log n) time but O(n) extra memory. Bubble sort: O(n²) time but O(1) extra memory (in place)." },
]);
