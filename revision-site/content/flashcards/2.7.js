CS.registerFlashcards("2.7", [
  { front: "List the standard dictionary operations.", back: "Add a pair · retrieve the value for a key · update a value · delete a pair · test whether a key exists · iterate over pairs" },
  { front: "What happens if you add a key that already exists in a dictionary?", back: "Its value is replaced (updated). Keys are unique, so no second entry is created." },
  { front: "How are dictionaries usually implemented, and why?", back: "As hash tables: the key is hashed to an index, so look-up, insertion and deletion are about O(1)." },
  { front: "Python: safely get a value that may be missing.", back: "`d.get(key, default)` — or check `if key in d:` first. `d[key]` raises KeyError if absent." },
  { front: "What is an inverted index?", back: "A dictionary mapping each word to the set of documents containing it — used by search engines for information retrieval." },
  { front: "Give five applications of dictionaries.", back: "Information retrieval/word counts · translation · contacts/phone book · DNS look-up · caching/memoisation · JSON/config · sparse vectors · dictionary compression" },
  { front: "Dictionary vs array: how are items accessed?", back: "Array: by integer position (index). Dictionary: by a unique key, which can be a string or other immutable value." },
]);
