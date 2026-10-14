CS.registerFlashcards("10.3", [
  { front: "1NF, 2NF, 3NF in one line each", back: "1NF: primary key, atomic data, no repeating groups · 2NF: 1NF + no partial dependencies · 3NF: 2NF + no non-key (transitive) dependencies" },
  { front: "\"The key, the whole key and nothing but the key\" — which part is which normal form?", back: "The key → 1NF · the whole key → 2NF · nothing but the key → 3NF" },
  { front: "Name and define the three anomalies normalisation prevents.", back: "**Update**: duplicated data changed in some places not others · **Insertion**: cannot add a fact without another unrelated fact · **Deletion**: deleting one fact loses another" },
  { front: "Which tables need checking for 2NF?", back: "Only those with a **composite** primary key. A 1NF table with a single-attribute key is already 2NF." },
  { front: "How do you fix a partial dependency?", back: "Move the attributes that depend on part of the key into a new table whose key is that part. The part stays in the original table." },
  { front: "How do you fix a transitive (non-key) dependency?", back: "Move the dependent attributes into a new table keyed on the attribute they depend on; leave that attribute in the original table as a foreign key." },
  { front: "Two ways of reaching 1NF from a repeating group?", back: "1) Move the repeating group to a new table with a copy of the original key; or 2) flatten to one row per item with a composite key. Both end at the same 3NF design." },
  { front: "Four reasons for normalising a database", back: "Minimise redundancy · maintain consistency/integrity · avoid update/insert/delete anomalies · flexible tables and easier complex queries" },
]);
