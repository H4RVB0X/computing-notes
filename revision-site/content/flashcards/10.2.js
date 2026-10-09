CS.registerFlashcards("10.2", [
  { front: "Match the formal and everyday terms: relation, tuple, attribute.", back: "Relation = table · Tuple = row/record · Attribute = column/field" },
  { front: "Three properties of a good primary key?", back: "Unique for every record · never empty (not null) · stable (does not need to change)" },
  { front: "What does referential integrity stop the DBMS from doing?", back: "Inserting a foreign key value that does not exist as a primary key; deleting (or changing the key of) a parent record that still has linked child records, unless cascading is set up." },
  { front: "Give four benefits of a relational database over a flat file.", back: "Less redundancy · consistent data / integrity · no update, insertion or deletion anomalies · flexible queries across tables (plus central security and multi-user access)" },
  { front: "Why should you not say a relational database 'saves storage space'?", back: "Indexes, keys and metadata take space too; the creditworthy point is that it **reduces redundant / duplicated data**." },
  { front: "Can a foreign key be part of a primary key? Example?", back: "Yes. In Result(<u>ExamID</u>, <u>StudentID</u>, Grade), each part of the composite key is also a foreign key." },
  { front: "Is a foreign key unique in its own table?", back: "No. Many pets can share OwnerID 1. Only the primary key it refers to is unique." },
]);
