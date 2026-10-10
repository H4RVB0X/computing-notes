CS.registerFlashcards("R.1", [
  { front: "`FOR i ← 1 TO n` in Python?", back: "`for i in range(1, n + 1):` (range stop is exclusive)" },
  { front: "`REPEAT … UNTIL cond` in Python?", back: "`while True:` … body … `if cond: break` (runs at least once, stops when cond is True)" },
  { front: "AQA `DIV` and `MOD` in Python?", back: "`//` and `%`" },
  { front: "`SUBSTRING(start, end, s)` in Python?", back: "`s[start:end + 1]` (AQA end index is included)" },
  { front: "The six AQA conversion functions and their Python equivalents?", back: "STRING_TO_INT → int · STRING_TO_REAL → float · INT_TO_STRING / REAL_TO_STRING → str · CHAR_TO_CODE → ord · CODE_TO_CHAR → chr" },
  { front: "`POSITION(s, c)` in Python?", back: "`s.find(c)`: index of the first occurrence (−1 if absent in Python)" },
  { front: "`RANDOM_INT(a, b)` in Python?", back: "`random.randint(a, b)`: both ends inclusive" },
  { front: "Last element of array `a` in AQA pseudocode?", back: "`a[LEN(a) - 1]` (0-indexed)" },
  { front: "WHILE vs REPEAT: minimum number of iterations?", back: "WHILE: 0 (condition checked first). REPEAT: 1 (condition checked after the body)." },
  { front: "How do AQA papers show inheritance in a class definition?", back: "`Dog = Class (Animal)`: the parent class in brackets after Class." },
]);
