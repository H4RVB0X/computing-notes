CS.registerFlashcards("12.2", [
  { front: "foldl (-) 10 [1,2,3] = ?", back: "((10 − 1) − 2) − 3 = **4**" },
  { front: "foldr (-) 10 [1,2,3] = ?", back: "1 − (2 − (3 − 10)) = 1 − 9 = **−8**" },
  { front: "Bracket shape of foldl and foldr with start s on [a,b,c]?", back: "foldl: ((s ⊕ a) ⊕ b) ⊕ c\nfoldr: a ⊕ (b ⊕ (c ⊕ s))" },
  { front: "foldl1 vs foldl?", back: "foldl1 uses the first element as the starting value (no start argument) and fails on an empty list. foldr1 uses the last element." },
  { front: "Types of map and filter?", back: "map :: (a -> b) -> [a] -> [b]\nfilter :: (a -> Bool) -> [a] -> [a]" },
  { front: "Python equivalents of map, filter and foldl?", back: "list(map(f, xs)) or [f(x) for x in xs];  list(filter(p, xs)) or [x for x in xs if p(x)];  functools.reduce(f, xs, start)" },
  { front: "Write a Haskell guard-based function `sign` for an Int.", back: "```haskell\nsign :: Int -> Int\nsign n\n  | n > 0     = 1\n  | n < 0     = -1\n  | otherwise = 0\n```" },
  { front: "Why is `map (-1) xs` an error, and what is the fix?", back: "(-1) is the number minus one, not a function. Use `map (subtract 1) xs` or `map (\\x -> x - 1) xs`." },
  { front: "sum (map (^2) (filter odd [1..10])) = ?", back: "filter → [1,3,5,7,9]; map → [1,9,25,49,81]; sum → **165**" },
  { front: "GHCi: load a file, reload, show a type, quit?", back: ":l file.hs   :r   :t expr   :q" },
]);
