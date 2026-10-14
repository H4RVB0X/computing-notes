CS.registerTopic({ id: "10.2", title: "Relational databases" }, function () {/*

:::objectives
- Explain the concept of a **relational database** and why it beats a flat file.
- Use the vocabulary correctly: **relation/table**, **tuple/record**, **attribute/field**.
- Define **primary key**, **composite primary key** and **foreign key** in mark-scheme wording, and pick them out of a set of tables.
- Explain how a primary key–foreign key pair **links** two tables, and what **referential integrity** enforces.
- Choose a sensible primary key and justify why other candidates would fail.
:::

:::quick At a glance
- A **relational database** stores data in **separate tables (relations)**, one per **entity**, linked by **common attributes** (primary key in one table = foreign key in another).
- **Row** = **record** = **tuple**. **Column** = **field** = **attribute**.
- **Primary key**: an attribute that **uniquely identifies** each record in a table.
- **Composite primary key**: a primary key made of **two or more attributes** that together are unique.
- **Foreign key**: an attribute in one table that is the **primary key of another table**, used to **link** them.
- **Referential integrity**: every foreign key value must **match an existing primary key** value (no orphan records).
- Benefits over a flat file: **less redundancy**, **consistency**, no update/insert/delete anomalies, flexible queries.
:::

:::keyterms
Relational database :: A database in which data is held in a number of tables (relations), each about one entity, linked together through common attributes (primary key/foreign key pairs). :: Lots of small linked tables instead of one big one.
Relation (table) :: A set of tuples (records) about one entity, organised into named attributes (columns). :: A table.
Tuple (record) :: A single row of a table holding the data about one instance of the entity. :: One row, e.g. one pet.
Attribute (field) :: A property of an entity; one column of a table, holding one item of data for each record. :: One column, e.g. Species.
Primary key :: An attribute (or set of attributes) that uniquely identifies each record (tuple) in a table. :: The value that is never repeated.
Composite primary key :: A primary key made up of two or more attributes which together uniquely identify each record. :: Two columns that are only unique as a pair.
Foreign key :: An attribute in one table that is the primary key of another table, used to link (create a relationship between) the two tables. :: A copy of another table's ID used as a link.
Referential integrity :: The rule that a foreign key value must always match an existing primary key value in the related table, so no record refers to a record that does not exist. :: No links pointing at nothing.
Flat file database :: A database consisting of a single table (or file) with no links to others. :: One big spreadsheet.
Data redundancy :: Unnecessary repetition of the same data in more than one place. :: Storing the same fact twice.
DBMS :: Database management system: software that creates, maintains and controls access to a database, hiding how data is physically stored. :: The program that runs the database, e.g. MySQL, SQLite.
:::

## From flat file to relational

A **flat file** keeps everything in one table. It is easy to start, but look what happens with a vet practice:

| PetName | Species | OwnerName | OwnerPhone | Vet | ApptDate |
|---|---|---|---|---|---|
| Biscuit | Dog | Aisha Khan | 0113 496 0123 | Dr Lee | 2024-01-15 |
| Biscuit | Dog | Aisha Khan | 0113 496 0123 | Dr Marsh | 2024-03-01 |
| Luna | Cat | Aisha Khan | 0113 469 0123 | Dr Lee | 2024-02-02 |

- Aisha's phone number is stored **three times** (redundancy), and one copy has been typed wrongly (**inconsistency**).
- You cannot add a new vet until they have an appointment (**insertion anomaly**).
- Delete Luna's only appointment and you lose the fact that Luna exists (**deletion anomaly**).
- Change Aisha's number and you must find every row (**update anomaly**).

A **relational database** splits the data into one table per **entity** and links them by storing **keys**, not copies of the data.

:::definition Relational database (mark-scheme wording)
Data is stored in **separate tables (relations)**, each describing **one entity**. Tables are **linked** by **common attributes**: the **primary key** of one table appears as a **foreign key** in another. Each fact is stored **once**.
:::

:::history
The relational model was proposed by **Edgar F. Codd** at IBM in 1970. "Relation" is the mathematical word for a table, which is why the formal vocabulary (relation, tuple, attribute) differs from the everyday one (table, row, column). Exams accept either.
:::

## The anatomy of a table

<svg class="diagram" viewBox="0 0 640 230" role="img" aria-label="The Pet table with the primary key column, a record row and the foreign key column labelled">
  <defs><marker id="arr102" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit" fill="currentColor">
    <rect x="60" y="50" width="80" height="120" fill="#ffb84d" fill-opacity="0.25" stroke="none"/>
    <rect x="60" y="104" width="520" height="27" fill="#7c9aff" fill-opacity="0.25" stroke="none"/>
    <rect x="490" y="50" width="90" height="120" fill="#4dd4a0" fill-opacity="0.22" stroke="none"/>
    <g stroke="currentColor" fill="none"><rect x="60" y="50" width="520" height="120"/><line x1="60" y1="77" x2="580" y2="77"/><line x1="60" y1="104" x2="580" y2="104"/><line x1="60" y1="131" x2="580" y2="131"/><line x1="140" y1="50" x2="140" y2="170"/><line x1="240" y1="50" x2="240" y2="170"/><line x1="330" y1="50" x2="330" y2="170"/><line x1="490" y1="50" x2="490" y2="170"/></g>
    <g font-weight="600"><text x="100" y="68" text-anchor="middle" text-decoration="underline">PetID</text><text x="190" y="68" text-anchor="middle">Name</text><text x="285" y="68" text-anchor="middle">Species</text><text x="410" y="68" text-anchor="middle">DateOfBirth</text><text x="535" y="68" text-anchor="middle">OwnerID</text></g>
    <text x="100" y="95" text-anchor="middle">101</text><text x="190" y="95" text-anchor="middle">Biscuit</text><text x="285" y="95" text-anchor="middle">Dog</text><text x="410" y="95" text-anchor="middle">2019-03-12</text><text x="535" y="95" text-anchor="middle">1</text>
    <text x="100" y="122" text-anchor="middle">102</text><text x="190" y="122" text-anchor="middle">Luna</text><text x="285" y="122" text-anchor="middle">Cat</text><text x="410" y="122" text-anchor="middle">2021-07-30</text><text x="535" y="122" text-anchor="middle">1</text>
    <text x="100" y="149" text-anchor="middle">103</text><text x="190" y="149" text-anchor="middle">Rex</text><text x="285" y="149" text-anchor="middle">Dog</text><text x="410" y="149" text-anchor="middle">2016-11-02</text><text x="535" y="149" text-anchor="middle">2</text>
    <text x="100" y="30" text-anchor="middle">primary key</text>
    <line x1="100" y1="35" x2="100" y2="48" stroke="currentColor" marker-end="url(#arr102)"/>
    <text x="535" y="30" text-anchor="middle">foreign key → Owner</text>
    <line x1="535" y1="35" x2="535" y2="48" stroke="currentColor" marker-end="url(#arr102)"/>
    <text x="20" y="122" text-anchor="middle">record</text>
    <line x1="40" y1="118" x2="58" y2="118" stroke="currentColor" marker-end="url(#arr102)"/>
    <text x="285" y="200" text-anchor="middle">each column is a field (attribute); the whole grid is the Pet table (relation)</text>
  </g>
</svg>

| Everyday term | Formal term | Meaning |
|---|---|---|
| Table | **Relation** | everything stored about one entity |
| Row / record | **Tuple** | one instance, e.g. Biscuit |
| Column / field | **Attribute** | one property, e.g. Species |

:::note
Because a table is formally a **set** of tuples, no two records can be identical. The primary key is what guarantees that.
:::

## Primary keys

A **primary key** is an attribute that **uniquely identifies each record** in a table. It must be:

- **unique**: no two records share a value;
- **never empty** (not null): every record must have one;
- ideally **stable**: it should not need to change over time.

### Choosing one

Ask the killer question: *"Could two different records ever have the same value here?"*

| Candidate for Owner | Unique? | Verdict |
|---|---|---|
| Surname | No: two Khans | ✗ |
| Phone | No: a household shares a landline; numbers change | ✗ |
| Email | Usually, but people share and change emails | ✗ (risky) |
| **OwnerID** (allocated number) | Yes, by design | ✓ |

Natural keys exist sometimes (a vehicle **registration number**, a book's **ISBN**). Otherwise the designer invents an ID, often auto-incremented by the DBMS.

## Composite primary keys

Sometimes no single attribute is unique, but a **combination** is.

| <u>StudentID</u> | <u>CourseID</u> | TargetGrade |
|---|---|---|
| 12345 | CS | B |
| 12345 | PH | A |
| 23135 | CS | C |

- StudentID repeats (a student takes several courses).
- CourseID repeats (a course has many students).
- **The pair** (StudentID, CourseID) never repeats, because a student enrols on a course once.

:::definition Composite primary key
A primary key consisting of **two or more attributes** that **together** uniquely identify each record. Neither attribute is unique on its own.
:::

Composite keys are typical of **link tables** that resolve a many-to-many relationship (see [10.1](#/topic/10.1)). Each part of the composite key is usually **also a foreign key**.

:::trap
- "A composite key is two primary keys" is **wrong**. A table has exactly **one** primary key; a composite key is **one key made of several attributes**.
- Some textbooks (and the ZigZag slides in your notes) call it a **compound key**. AQA's wording is **composite primary key**; use that.
- When writing it in notation, **underline every part**: Enrolment(<u>StudentID</u>, <u>CourseID</u>, TargetGrade).
:::

## Foreign keys: how tables are linked

A **foreign key** is an attribute in one table that is the **primary key of another table**. It creates the link (relationship) between them.

<svg class="diagram" viewBox="0 0 640 200" role="img" aria-label="The OwnerID foreign key in Pet points at the OwnerID primary key in Owner">
  <defs><marker id="arr102b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit" fill="currentColor">
    <text x="130" y="22" text-anchor="middle" font-weight="600">Owner</text>
    <g stroke="currentColor" fill="none"><rect x="30" y="30" width="200" height="104"/><line x1="30" y1="56" x2="230" y2="56"/><line x1="100" y1="30" x2="100" y2="134"/></g>
    <rect x="30" y="30" width="70" height="104" fill="#ffb84d" fill-opacity="0.25"/>
    <text x="65" y="48" text-anchor="middle" text-decoration="underline" font-weight="600">OwnerID</text><text x="165" y="48" text-anchor="middle" font-weight="600">Surname</text>
    <text x="65" y="76" text-anchor="middle">1</text><text x="165" y="76" text-anchor="middle">Khan</text>
    <text x="65" y="100" text-anchor="middle">2</text><text x="165" y="100" text-anchor="middle">Patel</text>
    <text x="65" y="124" text-anchor="middle">3</text><text x="165" y="124" text-anchor="middle">Brown</text>
    <text x="490" y="22" text-anchor="middle" font-weight="600">Pet</text>
    <g stroke="currentColor" fill="none"><rect x="360" y="30" width="260" height="104"/><line x1="360" y1="56" x2="620" y2="56"/><line x1="430" y1="30" x2="430" y2="134"/><line x1="530" y1="30" x2="530" y2="134"/></g>
    <rect x="530" y="30" width="90" height="104" fill="#4dd4a0" fill-opacity="0.22"/>
    <text x="395" y="48" text-anchor="middle" text-decoration="underline" font-weight="600">PetID</text><text x="480" y="48" text-anchor="middle" font-weight="600">Name</text><text x="575" y="48" text-anchor="middle" font-weight="600">OwnerID</text>
    <text x="395" y="76" text-anchor="middle">101</text><text x="480" y="76" text-anchor="middle">Biscuit</text><text x="575" y="76" text-anchor="middle">1</text>
    <text x="395" y="100" text-anchor="middle">102</text><text x="480" y="100" text-anchor="middle">Luna</text><text x="575" y="100" text-anchor="middle">1</text>
    <text x="395" y="124" text-anchor="middle">103</text><text x="480" y="124" text-anchor="middle">Rex</text><text x="575" y="124" text-anchor="middle">2</text>
    <path d="M575,138 C575,175 65,175 65,138" fill="none" stroke="currentColor" stroke-dasharray="5 4" marker-end="url(#arr102b)"/>
    <text x="320" y="192" text-anchor="middle">foreign key value 1 must exist as a primary key value in Owner</text>
  </g>
</svg>

To find Biscuit's owner, the DBMS takes Biscuit's `OwnerID` (1) and looks it up in Owner's primary key: Khan. The owner's details are stored **once**, however many pets they have.

Key facts:

- The foreign key sits on the **many** side of a 1:M relationship (many pets → one owner).
- A foreign key value **can repeat** (Owner 1 has two pets). It is not unique in its own table.
- The foreign key and the primary key it refers to must have the **same data type** (and usually the same name).

:::trap
- "A foreign key is a key from a foreign table" is not a definition. Say: **an attribute in one table that is the primary key in another table, used to link the tables.**
- Do not say a foreign key must be unique. It is the **primary key** that is unique.
:::

## Referential integrity

**Referential integrity** means the database will not allow a foreign key to refer to a record that does not exist.

With referential integrity enforced, the DBMS will:

- **reject inserting** a Pet with `OwnerID = 99` if there is no owner 99;
- **reject deleting** an owner who still has pets (or, if set up with a cascade option, delete their pets too);
- **reject changing** an owner's ID while pets still refer to the old value (or cascade the change).

The checks below were run in SQLite (which enforces foreign keys once `PRAGMA foreign_keys = ON` is set):

```python Referential integrity in action
import sqlite3
db = sqlite3.connect(":memory:", isolation_level=None)
db.execute("PRAGMA foreign_keys = ON")
db.execute("""CREATE TABLE Owner (OwnerID INTEGER, Surname VARCHAR(30),
              PRIMARY KEY (OwnerID))""")
db.execute("""CREATE TABLE Pet (PetID INTEGER, Name VARCHAR(30), OwnerID INTEGER,
              PRIMARY KEY (PetID),
              FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID))""")
db.execute("INSERT INTO Owner VALUES (1, 'Khan')")
db.execute("INSERT INTO Pet VALUES (101, 'Biscuit', 1)")      # fine: owner 1 exists

for sql in ["INSERT INTO Pet VALUES (109, 'Ghost', 99)",       # no owner 99
            "DELETE FROM Owner WHERE OwnerID = 1",              # owner 1 still has a pet
            "INSERT INTO Owner VALUES (1, 'Duplicate')"]:       # primary key repeated
    try:
        db.execute(sql)
        print("accepted:", sql)
    except sqlite3.IntegrityError as e:
        print("rejected:", e)
```

```output
rejected: FOREIGN KEY constraint failed
rejected: FOREIGN KEY constraint failed
rejected: UNIQUE constraint failed: Owner.OwnerID
```

:::why
Why does it matter? An appointment for pet 999 that does not exist is meaningless: you cannot invoice it, contact the owner or report on it. Referential integrity keeps the links **accurate and consistent**, which is part of **data integrity**.
:::

## Why use a relational database?

| Benefit | Explanation |
|---|---|
| Reduced **data redundancy** | each fact (an owner's phone) is stored once |
| Improved **consistency / integrity** | one copy cannot disagree with another |
| No **update anomaly** | change a value in one place and every query sees it |
| No **insertion anomaly** | a vet can be added before they have appointments |
| No **deletion anomaly** | deleting an appointment does not delete the pet |
| Flexible **queries** | SQL can join any tables through their keys |
| Shared, multi-user access with **security** | the DBMS controls who sees and changes what |

:::tip
Do **not** claim "a database always saves storage space". Indexes, keys and metadata take space too. Say "**reduces redundant (duplicated) data**" instead.
:::

:::example Identifying keys in an exam-board database
- Student(<u>StudentID</u>, Forename, Surname, School, Gender, DateOfBirth)
- Exam(<u>ExamID</u>, ExamName, Subject, Level)
- Result(<u>ExamID</u>, <u>StudentID</u>, RawMark, Grade)

1. **Primary keys:** StudentID; ExamID; and the composite (ExamID, StudentID) in Result, since a student sits each exam once.
2. **Foreign keys:** in Result, ExamID (links to Exam) and StudentID (links to Student). They are both part of the composite key **and** foreign keys.
3. **Relationships:** Student 1:M Result; Exam 1:M Result. Result resolves the M:N "students sit many exams; each exam is sat by many students".
4. **Which part holds all the data about one student?** A **record** (tuple) in the Student table.
:::

:::exam
- **Define** questions (1–2 marks each): use the precise wording: "uniquely identifies each record"; "two or more attributes that together uniquely identify"; "attribute that is the primary key of another table, used to link tables".
- **"Explain the concept of a relational database"** (2–3 marks): separate tables per entity · linked by common attributes / primary-foreign key pairs · reduces redundancy so data is stored once.
- **"Why is X not a suitable primary key?"**: give a *concrete* case where it repeats or is missing (two owners with the same surname).
- **"Explain referential integrity"**: foreign key value must match an existing primary key value · prevents orphan records / records referring to non-existent records · e.g. cannot delete an owner who still has pets.
:::

:::challenge
1. A `Result` table uses (ExamID, StudentID) as its key. What must change if students are allowed to resit an exam? Suggest two different fixes.
2. Why might a school *not* want referential integrity to cascade-delete a student's results when the student leaves? What would you store instead?
3. Can a foreign key ever be part of the primary key of its own table? Give an example from this page.
:::

:::recap
- Relational database: **tables per entity**, linked by **primary key/foreign key** pairs; facts stored once.
- Table = relation; row = record = tuple; column = field = attribute.
- **Primary key**: uniquely identifies each record. **Composite**: two or more attributes that together are unique.
- **Foreign key**: attribute that is the primary key of another table; sits on the many side; can repeat.
- **Referential integrity**: every foreign key value must exist as a primary key value in the linked table.
- Benefits: less redundancy, consistency, no anomalies, flexible queries.
:::

:::related
- [10.1 Data modelling and ER diagrams](#/topic/10.1)
- [10.3 Normalisation](#/topic/10.3)
- [10.4 SQL](#/topic/10.4) — `PRIMARY KEY` and `FOREIGN KEY … REFERENCES` in `CREATE TABLE`
:::

*/});
