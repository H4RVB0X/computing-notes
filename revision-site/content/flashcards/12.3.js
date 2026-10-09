CS.registerFlashcards("12.3", [
  { front: "The seven AQA list operations and their Haskell syntax?", back: "Return head `head xs` · return tail `tail xs` · test for empty `null xs` · return length `length xs` · construct empty `[]` · prepend `x : xs` · append `xs ++ [x]`" },
  { front: "head [4,5,6] and tail [4,5,6]?", back: "head → `4` (an element). tail → `[5,6]` (a list)." },
  { front: "What is tail [x]? What is head []?", back: "tail [x] = [] (empty list). head [] is a run-time error." },
  { front: "Write [1,2,3] using only : and [].", back: "`1 : (2 : (3 : []))`" },
  { front: "Recursive length in Haskell?", back: "```haskell\nmyLength :: [a] -> Int\nmyLength []     = 0\nmyLength (x:xs) = 1 + myLength xs\n```" },
  { front: "Recursive reverse in Haskell?", back: "```haskell\nmyReverse :: [a] -> [a]\nmyReverse []     = []\nmyReverse (x:xs) = myReverse xs ++ [x]\n```" },
  { front: "Python equivalents of head, tail, null, prepend, append?", back: "xs[0] · xs[1:] · len(xs) == 0 · [x] + xs · xs + [x]" },
  { front: "Why is `[1,2] ++ 3` an error?", back: "`++` joins two lists; 3 is not a list. Use `[1,2] ++ [3]`." },
  { front: "Why is prepending cheaper than appending?", back: "Prepend makes one new cell pointing at the existing (shared, immutable) list. Append must copy every cell of the left-hand list." },
]);
