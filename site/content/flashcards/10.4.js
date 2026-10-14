CS.registerFlashcards("10.4", [
  { front: "Template: SELECT query", back: "SELECT fields\nFROM tables\nWHERE conditions\nORDER BY field ASC|DESC;" },
  { front: "Template: INSERT, UPDATE, DELETE", back: "INSERT INTO T (f1, f2) VALUES (v1, v2);\nUPDATE T SET f = v WHERE key = x;\nDELETE FROM T WHERE key = x;" },
  { front: "Template: CREATE TABLE with keys", back: "CREATE TABLE T (\n  f1 INTEGER,\n  f2 VARCHAR(30),\n  PRIMARY KEY (f1),\n  FOREIGN KEY (f2) REFERENCES T2(f2)\n);" },
  { front: "Two ways to join Pet and Owner", back: "FROM Pet, Owner WHERE Pet.OwnerID = Owner.OwnerID\nor\nFROM Pet INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID" },
  { front: "LIKE wildcards: % and _", back: "% = any number of characters (including none) · _ = exactly one character. 'B%' starts with B; '_e%' has e as the second letter." },
  { front: "What happens if you leave WHERE off UPDATE or DELETE?", back: "Every record in the table is updated or deleted." },
  { front: "How many join conditions for a query over three linked tables?", back: "Two: one for each link (FK = PK). Missing one gives a Cartesian product." },
  { front: "Which is inclusive: BETWEEN 40 AND 60?", back: "Both ends: 40 and 60 are included." },
  { front: "Two errors in the class slide's CREATE TABLE", back: "It uses braces { } instead of round brackets ( ), and it is missing the comma before PRIMARY KEY. (Also DELETE * FROM is not standard SQL.)" },
]);
