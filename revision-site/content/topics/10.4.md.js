CS.registerTopic({ id: "10.4", title: "SQL" }, function () {/*

:::objectives
- Define a table with **CREATE TABLE**, choosing data types and declaring **PRIMARY KEY** and **FOREIGN KEY … REFERENCES** constraints.
- Add, change and remove data with **INSERT INTO**, **UPDATE … SET … WHERE** and **DELETE FROM … WHERE**.
- Retrieve data with **SELECT … FROM … WHERE … ORDER BY**, using comparison operators, **AND / OR / NOT**, **LIKE**, **IN** and **BETWEEN**.
- Write **multi-table queries** using both a **WHERE join** and **INNER JOIN … ON**.
- Work out the **result table** of a given query, row by row.
:::

:::quick At a glance
- SQL is a **declarative** language: you say **what** data you want, not **how** to find it.
- `SELECT fields FROM tables WHERE condition ORDER BY field ASC|DESC;` — clauses in **that order**.
- Join tables by matching **foreign key = primary key**: `WHERE Pet.OwnerID = Owner.OwnerID` or `INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID`.
- `INSERT INTO Table (fields) VALUES (values);` adds one record.
- `UPDATE Table SET field = value WHERE condition;` changes records. **No WHERE = every record changes.**
- `DELETE FROM Table WHERE condition;` removes records. **No WHERE = every record goes.**
- `CREATE TABLE Name ( field TYPE, …, PRIMARY KEY (field), FOREIGN KEY (field) REFERENCES Other(field) );` — **round brackets**, commas between definitions.
- Strings in **quotes**, numbers **without**. `*` means "all fields".
:::

:::keyterms
SQL :: Structured Query Language: a declarative language used to define, query and manipulate data in a relational database. :: The language you talk to a database in.
Declarative language :: A language in which the programmer states what result is required rather than the steps to produce it. :: Say what you want; the DBMS works out how.
Data definition language (DDL) :: The part of SQL used to create and change the structure of a database, e.g. CREATE TABLE. :: Commands that build tables.
Data manipulation language (DML) :: The part of SQL used to insert, update, delete and retrieve data, e.g. INSERT, UPDATE, DELETE, SELECT. :: Commands that change or read the data.
Query :: A request to retrieve (or change) data from a database, usually written as a SELECT statement. :: A question you ask the database.
Join :: Combining rows from two or more tables where a common attribute (foreign key and primary key) matches. :: Gluing tables together on their link field.
Wildcard :: A symbol that stands for any characters: * for all fields in SELECT; % (any number of characters) and _ (exactly one character) in LIKE patterns. :: A "match anything" symbol.
Constraint :: A rule applied to a field or table that restricts what data can be stored, e.g. PRIMARY KEY, FOREIGN KEY, NOT NULL. :: A rule the DBMS enforces.
:::

## The sample database

Every example on this page uses the vet practice from [10.1](#/topic/10.1). Learn its shape; the trace challenges use it too.

- Owner(<u>OwnerID</u>, Surname, Forename, Town, Phone)
- Pet(<u>PetID</u>, Name, Species, DateOfBirth, OwnerID<sup>FK</sup>)
- Vet(<u>VetID</u>, VetName, Specialism)
- Appointment(<u>ApptID</u>, PetID<sup>FK</sup>, VetID<sup>FK</sup>, ApptDate, Reason, Fee)

::::tabs
:::tab Owner
| OwnerID | Surname | Forename | Town | Phone |
|---|---|---|---|---|
| 1 | Khan | Aisha | Leeds | 0113 496 0123 |
| 2 | Patel | Rohan | York | 01904 496 0456 |
| 3 | Brown | Chloe | Leeds | 0113 496 0789 |
| 4 | Nolan | Sean | Harrogate | 01423 496 0321 |
| 5 | Woods | Emma | York | 01904 496 0654 |
:::
:::tab Pet
| PetID | Name | Species | DateOfBirth | OwnerID |
|---|---|---|---|---|
| 101 | Biscuit | Dog | 2019-03-12 | 1 |
| 102 | Luna | Cat | 2021-07-30 | 1 |
| 103 | Rex | Dog | 2016-11-02 | 2 |
| 104 | Pepper | Rabbit | 2022-05-19 | 3 |
| 105 | Mabel | Cat | 2018-01-25 | 4 |
| 106 | Shadow | Dog | 2020-09-08 | 5 |
| 107 | Nibbles | Hamster | 2023-02-14 | 3 |
:::
:::tab Vet
| VetID | VetName | Specialism |
|---|---|---|
| V1 | Dr Lee | Small animals |
| V2 | Dr Adeyemi | Exotic pets |
| V3 | Dr Marsh | Surgery |
:::
:::tab Appointment
| ApptID | PetID | VetID | ApptDate | Reason | Fee |
|---|---|---|---|---|---|
| 1 | 101 | V1 | 2024-01-15 | Vaccination | 45.00 |
| 2 | 103 | V3 | 2024-01-15 | X-ray | 120.00 |
| 3 | 102 | V1 | 2024-02-02 | Check-up | 30.00 |
| 4 | 104 | V2 | 2024-02-10 | Dental | 55.00 |
| 5 | 101 | V3 | 2024-03-01 | Operation | 250.00 |
| 6 | 106 | V1 | 2024-03-01 | Vaccination | 45.00 |
| 7 | 105 | V1 | 2024-03-14 | Check-up | 30.00 |
| 8 | 107 | V2 | 2024-04-02 | Check-up | 25.00 |
| 9 | 103 | V1 | 2024-04-20 | Vaccination | 45.00 |
:::
::::

Every result table below was produced by running the query in SQLite from Python. Dates are stored as `'YYYY-MM-DD'` text so they sort and compare correctly.

## Defining a table: CREATE TABLE

```sql
CREATE TABLE Owner (
    OwnerID   INTEGER,
    Surname   VARCHAR(30) NOT NULL,
    Forename  VARCHAR(30),
    Town      VARCHAR(30),
    Phone     VARCHAR(15),
    PRIMARY KEY (OwnerID)
);

CREATE TABLE Pet (
    PetID       INTEGER,
    Name        VARCHAR(30),
    Species     VARCHAR(20),
    DateOfBirth DATE,
    OwnerID     INTEGER,
    PRIMARY KEY (PetID),
    FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID)
);

CREATE TABLE Appointment (
    ApptID   INTEGER,
    PetID    INTEGER,
    VetID    CHAR(2),
    ApptDate DATE,
    Reason   VARCHAR(40),
    Fee      DECIMAL(6,2),
    PRIMARY KEY (ApptID),
    FOREIGN KEY (PetID) REFERENCES Pet(PetID),
    FOREIGN KEY (VetID) REFERENCES Vet(VetID)
);
```

Anatomy:

- `CREATE TABLE Name (` … `);` — the whole definition sits inside **round brackets**.
- One line per field: **name, then data type**, separated from the next by a **comma**.
- `PRIMARY KEY (field)` — for a composite key list every part: `PRIMARY KEY (StudentID, CourseID)`.
- `FOREIGN KEY (field) REFERENCES OtherTable(field)` — enforces **referential integrity**. The referenced table must be created first.
- `NOT NULL` — the field must have a value.

| Data type | Use for | Example |
|---|---|---|
| `INTEGER` / `INT` | whole numbers you might calculate with | Quantity, Age |
| `DECIMAL(p,s)` / `FLOAT` / `REAL` | numbers with a fractional part; `DECIMAL(6,2)` = 6 digits, 2 after the point (exact, best for money) | Fee |
| `CHAR(n)` | text of **fixed** length n | VetID `'V1'`, postcode area |
| `VARCHAR(n)` | text of **variable** length up to n | Surname |
| `DATE`, `TIME`, `DATETIME` | dates and times | DateOfBirth |
| `BOOLEAN` | true/false | IsInsured |

:::trap
- **Brackets, not braces.** The class slide writes `CREATE TABLE Customer { … };` — that is **wrong**. SQL uses **round brackets** `( … )`. It also misses the comma before `PRIMARY KEY`; every definition in the list needs a comma after it except the last.
- **Phone numbers are text**, not integers: a number type drops the leading 0 and cannot hold spaces or `+44`.
- In the exam, *any sensible type and length* is accepted, but every field needs **a** type.
- The slide's `DELETE * FROM Customer` is not valid standard SQL. To delete every row write `DELETE FROM Customer;`. To remove the table itself use `DROP TABLE Customer;`.
:::

:::collapse Changing a table that already exists (ALTER TABLE)
```sql
ALTER TABLE Owner ADD Email VARCHAR(60);      -- add a column
ALTER TABLE Owner DROP COLUMN Phone;          -- remove a column
DROP TABLE Owner;                             -- delete the table and all its data
```
Not required by the AQA specification, but useful for your NEA.
:::

## Changing data: INSERT, UPDATE, DELETE

### INSERT INTO

```sql
INSERT INTO Pet (PetID, Name, Species, DateOfBirth, OwnerID)
VALUES (108, 'Ziggy', 'Dog', '2023-10-05', 2);
```

- The field list and the value list must match **in order and number**.
- You may leave out the field list only if you give a value for **every** field in the table's order.
- Text and dates go in quotes; numbers do not.
- With referential integrity on, `OwnerID` 2 must already exist in Owner.

### UPDATE … SET … WHERE

```sql
UPDATE Owner
SET Phone = '01904 496 0999', Town = 'Selby'
WHERE OwnerID = 2;
```

Several fields can change at once, separated by commas. A calculation is allowed:

```sql
UPDATE Appointment
SET Fee = Fee + 5
WHERE Reason = 'Check-up';
```

This adds £5 to **all three** check-ups (ApptID 3 and 7 become 35.00, ApptID 8 becomes 30.00).

### DELETE FROM … WHERE

```sql
DELETE FROM Appointment
WHERE ApptID = 8;
```

:::trap
- **Forgetting WHERE** in UPDATE or DELETE changes or deletes **every record** in the table. Examiners look for the WHERE clause.
- To be sure you affect **one** record, select it by its **primary key** (`WHERE OwnerID = 2`), not by a name.
- `UPDATE` has no `FROM` and `DELETE` has no field list: `DELETE Name FROM Pet` is wrong.
:::

## Retrieving data: SELECT

```sql
SELECT field1, field2      -- which columns (or * for all)
FROM   table               -- which table(s)
WHERE  condition           -- which rows (optional)
ORDER BY field ASC|DESC;   -- sort (optional; ASC is the default)
```

:::example Query 1: a simple filtered, sorted query
```sql
SELECT Name, Species
FROM Pet
WHERE Species = 'Dog'
ORDER BY Name;
```
| Name | Species |
|---|---|
| Biscuit | Dog |
| Rex | Dog |
| Shadow | Dog |

How to work it out by hand: go down Pet, keep rows where Species is Dog (101, 103, 106), keep only the Name and Species columns, then sort by Name A→Z.
:::

### Operators for WHERE

| Operator | Meaning | Example |
|---|---|---|
| `=` | equal to | `Species = 'Cat'` |
| `<>` (also `!=` in many DBMSs) | not equal to | `Species <> 'Dog'` |
| `<` `>` `<=` `>=` | comparisons (numbers, dates, text) | `Fee >= 45` |
| `AND`, `OR`, `NOT` | combine conditions | `Species = 'Dog' AND Fee > 50` |
| `BETWEEN a AND b` | in a range, **inclusive** of both ends | `Fee BETWEEN 40 AND 60` |
| `IN (…)` | matches any value in a list | `Species IN ('Hamster', 'Rabbit')` |
| `LIKE` | pattern match: `%` any characters, `_` exactly one | `Name LIKE 'B%'` |

:::example Query 2: OR and AND with brackets
```sql
SELECT Name
FROM Pet
WHERE Species = 'Dog' AND (OwnerID = 1 OR OwnerID = 5);
```
| Name |
|---|
| Biscuit |
| Shadow |

Without the brackets, `AND` is applied before `OR`, so the query would mean "(dogs owned by 1) or (anything owned by 5)". Use brackets whenever you mix AND and OR.
:::

:::example Query 3: BETWEEN, IN, LIKE and NOT
```sql
SELECT ApptID, Reason, Fee
FROM Appointment
WHERE Fee BETWEEN 40 AND 60;
```
| ApptID | Reason | Fee |
|---|---|---|
| 1 | Vaccination | 45.00 |
| 4 | Dental | 55.00 |
| 6 | Vaccination | 45.00 |
| 9 | Vaccination | 45.00 |

```sql
SELECT Name, Species FROM Pet WHERE Species IN ('Hamster', 'Rabbit');
```
| Name | Species |
|---|---|
| Pepper | Rabbit |
| Nibbles | Hamster |

```sql
SELECT Name FROM Pet WHERE Name LIKE '_e%';
```
| Name |
|---|
| Rex |
| Pepper |

`'_e%'` = any one character, then `e`, then anything. Rex and Pepper have *e* as their second letter.

```sql
SELECT Name, Species FROM Pet WHERE NOT Species = 'Dog';
```
| Name | Species |
|---|---|
| Luna | Cat |
| Pepper | Rabbit |
| Mabel | Cat |
| Nibbles | Hamster |

`WHERE Species <> 'Dog'` gives the same result.
:::

:::example Query 4: sorting on two fields
```sql
SELECT Name, Species
FROM Pet
ORDER BY Species ASC, Name DESC;
```
| Name | Species |
|---|---|
| Mabel | Cat |
| Luna | Cat |
| Shadow | Dog |
| Rex | Dog |
| Biscuit | Dog |
| Nibbles | Hamster |
| Pepper | Rabbit |

Rows are sorted by Species first; **within** each species, by Name Z→A.
:::

:::trap
- `WHERE Species = 'Cat' OR 'Rabbit'` is **wrong**. Repeat the field: `WHERE Species = 'Cat' OR Species = 'Rabbit'` (or use `IN`).
- Clause order is fixed: **SELECT, FROM, WHERE, ORDER BY**. ORDER BY always comes last.
- **No quotes round numbers** (`Fee > 50`), and **no currency symbols** (`Fee > £50` is an error).
- Follow the date format shown in the question. Exam papers may write `#01/06/2019#` or `'01/06/2019'`; both are accepted if consistent with the data given.
:::

## Querying more than one table

To combine tables, you must say **how they link**: the **foreign key equals the primary key**. Prefix ambiguous field names with the table name (`Pet.OwnerID`), and it is good practice to prefix them all.

### Method 1: join in the WHERE clause (the style AQA papers use most)

:::example Query 5: owners in Leeds and their pets
```sql
SELECT Owner.Surname, Pet.Name
FROM Owner, Pet
WHERE Owner.OwnerID = Pet.OwnerID
  AND Owner.Town = 'Leeds'
ORDER BY Owner.Surname, Pet.Name;
```
| Surname | Name |
|---|---|
| Brown | Nibbles |
| Brown | Pepper |
| Khan | Biscuit |
| Khan | Luna |

Working: the join condition pairs each pet with its owner. Only owners 1 (Khan) and 3 (Brown) live in Leeds. Khan has pets 101, 102; Brown has 104, 107. Sort by surname, then pet name.
:::

### Method 2: INNER JOIN … ON

```sql
SELECT Owner.Surname, Pet.Name
FROM Owner
INNER JOIN Pet ON Owner.OwnerID = Pet.OwnerID
WHERE Owner.Town = 'Leeds'
ORDER BY Owner.Surname, Pet.Name;
```

Same four rows. `INNER JOIN` keeps only rows that have a match in **both** tables, so an owner with no pets would not appear in either version.

:::::example Query 6: three tables
"Give the surname of the owner, the pet's name and the date for every vaccination, earliest first."

The path is Owner → Pet → Appointment, so you need **two** join conditions (one per link).

::::tabs
:::tab WHERE join
```sql
SELECT Owner.Surname, Pet.Name, Appointment.ApptDate
FROM Owner, Pet, Appointment
WHERE Owner.OwnerID = Pet.OwnerID
  AND Pet.PetID = Appointment.PetID
  AND Appointment.Reason = 'Vaccination'
ORDER BY Appointment.ApptDate;
```
:::
:::tab INNER JOIN
```sql
SELECT Owner.Surname, Pet.Name, Appointment.ApptDate
FROM Owner
INNER JOIN Pet ON Owner.OwnerID = Pet.OwnerID
INNER JOIN Appointment ON Pet.PetID = Appointment.PetID
WHERE Appointment.Reason = 'Vaccination'
ORDER BY Appointment.ApptDate;
```
:::
::::

| Surname | Name | ApptDate |
|---|---|---|
| Khan | Biscuit | 2024-01-15 |
| Woods | Shadow | 2024-03-01 |
| Patel | Rex | 2024-04-20 |
:::::

:::example Query 7: who do we phone? (the class-slide style question)
"Dr Marsh's surgery was closed on 1 March 2024. List the forename, surname and phone number of every owner with an appointment that day."

```sql
SELECT Owner.Forename, Owner.Surname, Owner.Phone
FROM Owner, Pet, Appointment
WHERE Owner.OwnerID = Pet.OwnerID
  AND Pet.PetID = Appointment.PetID
  AND Appointment.ApptDate = '2024-03-01';
```
| Forename | Surname | Phone |
|---|---|---|
| Aisha | Khan | 0113 496 0123 |
| Emma | Woods | 01904 496 0654 |

Appointments 5 (pet 101 → owner 1) and 6 (pet 106 → owner 5) are on that date.
:::

:::trap
- **Every pair of tables needs a join condition.** With three tables in FROM you need **two** link conditions. Leaving one out produces a *Cartesian product*: every row paired with every row, giving far too many results.
- Listing a table in FROM that you never use (or using a field from a table not listed) loses marks.
- The textbook answer `FROM Download, Customer, Movie WHERE Movie.Genre = "Comedy"` has **no join conditions** and is wrong for that reason.
:::

## Useful extras: aggregates and GROUP BY

Not named in the AQA specification, but handy for questions and essential for the NEA.

| Function | Returns |
|---|---|
| `COUNT(*)` | number of rows |
| `SUM(field)`, `AVG(field)` | total, mean |
| `MAX(field)`, `MIN(field)` | largest, smallest |

```sql
SELECT Species, COUNT(*) AS NumPets
FROM Pet
GROUP BY Species
ORDER BY NumPets DESC, Species;
```
| Species | NumPets |
|---|---|
| Dog | 3 |
| Cat | 2 |
| Hamster | 1 |
| Rabbit | 1 |

```sql
SELECT SUM(Fee) AS Total, AVG(Fee) AS Average
FROM Appointment
WHERE VetID = 'V1';
```
| Total | Average |
|---|---|
| 195.00 | 39.00 |

`GROUP BY` makes one result row per distinct value; `AS` renames a result column; `SELECT DISTINCT Species FROM Pet` lists each species once.

## Running SQL from Python

Your NEA program will send SQL to a database. Python's built-in `sqlite3` module does it in a few lines. Use `?` placeholders for values: never glue user input into the SQL string (that invites SQL injection).

```python Running a join from Python with sqlite3
import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE Owner (OwnerID INTEGER, Surname VARCHAR(30), Town VARCHAR(30),
                    PRIMARY KEY (OwnerID));
CREATE TABLE Pet (PetID INTEGER, Name VARCHAR(30), OwnerID INTEGER,
                  PRIMARY KEY (PetID), FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID));
INSERT INTO Owner VALUES (1, 'Khan', 'Leeds'), (2, 'Patel', 'York'), (3, 'Brown', 'Leeds');
INSERT INTO Pet VALUES (101, 'Biscuit', 1), (102, 'Luna', 1), (103, 'Rex', 2),
                       (104, 'Pepper', 3), (107, 'Nibbles', 3);
""")
town = "Leeds"
rows = db.execute("""SELECT Owner.Surname, Pet.Name
                     FROM Owner INNER JOIN Pet ON Owner.OwnerID = Pet.OwnerID
                     WHERE Owner.Town = ?
                     ORDER BY Owner.Surname, Pet.Name""", (town,)).fetchall()
for surname, pet in rows:
    print(surname, pet)
```

```output
Brown Nibbles
Brown Pepper
Khan Biscuit
Khan Luna
```

## Practise

{{tool:sql-playground}}

Work out the result table yourself before checking:

{{trace:10.4-1}}

{{trace:10.4-2}}

{{trace:10.4-3}}

:::note Dialect differences (briefly)
Everything above is standard SQL. Small differences you may meet: SQLite and MySQL accept double quotes for strings (standard SQL uses single); Access uses `*` and `?` as LIKE wildcards and `#…#` round dates; SQLite displays `45.00` stored in a DECIMAL field as `45`; some systems write `AUTO_INCREMENT` / `AUTOINCREMENT` for generated keys. In the exam, write clear standard SQL and you will be credited.
:::

:::exam
- **SELECT questions** are marked clause by clause: correct field list (1) · correct table(s) in FROM (1) · each join condition (1 each) · each selection condition (1) · ORDER BY with the correct direction (1). Partial credit is available, so always write something for each clause.
- **INSERT** (2 marks): `INSERT INTO table (fields)` · `VALUES (…)` in matching order.
- **UPDATE** (3 marks): `UPDATE table` · `SET field = value` · `WHERE key = value`.
- **DELETE** (2 marks): `DELETE FROM table` · `WHERE key = value`.
- **CREATE TABLE** (3–4 marks): table name and brackets · every field with a sensible data type · `PRIMARY KEY (…)` · `FOREIGN KEY (…) REFERENCES …` where needed.
- Use the **exact** table and field names in the question, spelled the same way.
- Give the field names in the order the question lists them.
:::

:::challenge
1. Write a query listing each vet's name and the number of appointments they have had, most appointments first. (Hint: join Vet and Appointment, `GROUP BY Vet.VetName`.)
2. Write the `CREATE TABLE` for `Enrolment(StudentID, CourseID, TargetGrade)` with a composite primary key and two foreign keys.
3. Explain why `SELECT Name FROM Pet, Owner WHERE Town = 'York';` returns 14 rows rather than 2. How many rows would it return if there were 50 pets?
:::

:::recap
- DDL: `CREATE TABLE T ( field TYPE, …, PRIMARY KEY (f), FOREIGN KEY (f) REFERENCES T2(f) );` — round brackets, commas.
- DML: `INSERT INTO … VALUES …`, `UPDATE … SET … WHERE …`, `DELETE FROM … WHERE …`. Always include WHERE when changing specific records.
- `SELECT … FROM … WHERE … ORDER BY … ASC|DESC`; operators `= <> < > <= >=`, `AND OR NOT`, `BETWEEN`, `IN`, `LIKE` with `%` and `_`.
- Multi-table: one join condition per link, `FK = PK`, either in WHERE or with `INNER JOIN … ON`.
- Strings in quotes, numbers without; prefix fields with table names when tables are joined.
:::

:::related
- [10.1 Data modelling](#/topic/10.1) — where the vet database came from
- [10.2 Relational databases](#/topic/10.2) — primary keys, foreign keys, referential integrity
- [10.5 Client-server databases](#/topic/10.5) — what happens when many users run UPDATE at once
:::

*/});
