CS.registerFlashcards("2.6", [
  { front: "Hash the key `A5RD` into a table of 97 slots using an ASCII sum.", back: "65 + 53 + 82 + 68 = 268; 268 MOD 97 = **74**." },
  { front: "What is the folding method of hashing?", back: "Split the key into equal parts, add the parts together, then MOD by the table size. E.g. 46378215 → 46+37+82+15 = 180 → MOD 50 = 30." },
  { front: "Steps to search a hash table that uses linear probing.", back: "Hash the key → check that slot → match = found; empty = not present; otherwise move to (i + 1) MOD size and repeat." },
  { front: "Why can't you just empty a slot when deleting from a linear-probing hash table?", back: "A later search could stop at that empty slot and miss items that were placed beyond it after a collision. Use a 'deleted' marker that searches skip over." },
  { front: "Formula for load factor, and a sensible maximum.", back: "Items stored ÷ number of slots. Keep it below about 0.7 (no more than about two-thirds full)." },
  { front: "Four properties of a good hash function.", back: "Always gives the same value for the same key · spreads values uniformly over the table · minimises collisions/clustering · fast to compute (and stays in range)." },
  { front: "Linear probing vs chaining: one advantage of each.", back: "Probing: no extra pointer memory, everything in one array.\nChaining: table never 'fills'; no clustering; deletion is simple." },
  { front: "Give four uses of hash tables.", back: "Database indexes · caches · compiler symbol tables · implementing dictionaries/sets · hash files on disk" },
  { front: "Why are collisions unavoidable?", back: "There are many more possible keys than slots (pigeonhole principle), so some different keys must share a hash value." },
]);
