CS.registerTopic({ id: "10.3", title: "Normalisation" }, function () {/*

:::objectives
- Explain **why** databases are normalised: less redundancy, consistency, no **update**, **insertion** or **deletion anomalies**.
- State the rules for **1NF**, **2NF** and **3NF** in AQA wording, and the "**the key, the whole key and nothing but the key**" test.
- Spot **repeating groups**, **non-atomic** data, **partial dependencies** and **non-key (transitive) dependencies** in a table.
- Normalise an unnormalised table to **3NF**, showing every table at every stage in entity-description form.
- Recognise which normal form a given table is already in.
:::

:::quick At a glance
- **Normalisation** = organising data into tables so that each fact is stored **once**, giving the best relational design.
- **Why**: removes **redundancy**, keeps data **consistent**, avoids **update / insertion / deletion anomalies**, makes queries flexible.
- **1NF**: **no repeating groups** of attributes; all data **atomic**; each record has a **primary key**.
- **2NF**: 1NF **and no partial dependencies** — no non-key attribute depends on only **part** of a **composite** key.
- **3NF**: 2NF **and no non-key (transitive) dependencies** — no non-key attribute depends on another non-key attribute.
- Test: every non-key attribute depends on **the key** (1NF), **the whole key** (2NF) and **nothing but the key** (3NF).
- A table with a **single-attribute** primary key that is in 1NF is **automatically in 2NF**.
:::

:::keyterms
Normalisation :: The process of organising the attributes of a database into tables so that redundancy is minimised and each non-key attribute depends on the key, the whole key and nothing but the key. :: Splitting data into the right tables so every fact lives in one place.
Unnormalised form (UNF) :: A table that contains repeating groups of attributes and/or non-atomic values. :: The raw, messy data.
Atomic data :: A value that cannot sensibly be broken down further; each field holds a single value. :: One value per cell, e.g. FirstName and Surname rather than FullName.
Repeating group :: An attribute or group of attributes that can occur several times for one value of the key. :: The bit of a record that has a list of things.
First normal form (1NF) :: A table is in 1NF if it has a primary key, contains only atomic values and has no repeating groups of attributes. :: One value per cell, no lists, every row identifiable.
Partial dependency :: A non-key attribute that depends on only part of a composite primary key. :: A fact about just one half of a two-part key.
Second normal form (2NF) :: A table is in 2NF if it is in 1NF and contains no partial dependencies. :: Every non-key attribute needs the whole key.
Non-key (transitive) dependency :: A non-key attribute that depends on another non-key attribute rather than on the primary key. :: A fact about something else that is not the key.
Third normal form (3NF) :: A table is in 3NF if it is in 2NF and contains no non-key (transitive) dependencies. :: Every non-key attribute depends on the key, the whole key and nothing but the key.
Update anomaly :: An inconsistency that arises when duplicated data is changed in some places but not others. :: Changed it here, forgot it there.
Insertion anomaly :: Being unable to store a fact without also storing an unrelated fact (e.g. a new course cannot be added until a student enrols). :: Can't add X until Y exists.
Deletion anomaly :: Unintentionally losing a fact when another fact is deleted. :: Deleting one thing wipes out another.
:::

## Why normalise?

Here is a college's data in one unnormalised table. Each student row carries a **list** of courses.

| StudentNo | StudentName | DOB | CourseNo | CourseName | LecturerNo | LecturerName | TargetGrade |
|---|---|---|---|---|---|---|---|
| 9124 | Chris Holland | 05/05/2008 | Comp, Span | Computing, Spanish | JRA, AGG | J. Adey, A. Gomez | A, B |
| 8014 | Charlie Chambers | 04/05/2008 | Econ, IT, Comp | Economics, IT, Computing | RJV, SEW, JRA | R. Vale, S. Westwood, J. Adey | B, A, C |
| 9100 | Cameron Barry-Cooper | 12/12/2008 | Comp, Art | Computing, Art | JRA, JLB | J. Adey, J. Brown | A, A |

Problems:

- **Redundancy**: "Computing, JRA, J. Adey" is stored three times.
- **Update anomaly**: if J. Adey changes name, every copy must be found; miss one and the data is **inconsistent**.
- **Insertion anomaly**: a new course (say Music) cannot be recorded until a student takes it.
- **Deletion anomaly**: if Cameron leaves, the only record that **Art is taught by J. Brown** disappears.
- **Querying** is awkward: "list all Computing students" means searching inside lists.

:::definition Why databases are normalised (mark-scheme points)
- to **minimise data redundancy** (duplication);
- so data is **consistent** / **data integrity** is maintained;
- so **update, insertion and deletion anomalies** cannot occur;
- so each table holds data about **one entity**, records can hold as many or as few related items as needed, and complex **queries** across tables are easy.
:::

:::trap
- "Normalisation makes the database smaller" is a weak answer and is not always true. Say it **reduces redundant / duplicated data**.
- "Normalisation makes it faster" is not a creditworthy reason either. Joins across many tables can make some queries **slower**.
:::

## Dependency: the idea behind every rule

Attribute B **depends on** attribute A if knowing A tells you exactly one value of B. Write it **A → B**.

- `CourseNo → CourseName` (Comp always means Computing).
- `LecturerNo → LecturerName` (JRA always means J. Adey).
- `(StudentNo, CourseNo) → TargetGrade` (a grade belongs to one student **on one course**).

Normalisation is just: **put each attribute in the table whose key it depends on.**

## The three normal forms

| Form | Rule (AQA wording) | How you fix a breach |
|---|---|---|
| **1NF** | A primary key exists; data is **atomic**; **no repeating groups** of attributes | split non-atomic fields; move the repeating group into its own table with a copy of the key (or flatten to one row per item with a composite key) |
| **2NF** | 1NF **and no partial dependencies** (no non-key attribute depends on only *part* of a composite key) | move the partially dependent attributes to a new table keyed on the part they depend on |
| **3NF** | 2NF **and no non-key (transitive) dependencies** (no non-key attribute depends on another non-key attribute) | move the dependent attributes to a new table keyed on the attribute they depend on; leave that attribute behind as a foreign key |

:::tip The key, the whole key and nothing but the key
Every non-key attribute must depend on **the key** (1NF: there is a key, no repeating groups), **the whole key** (2NF: not just part of it), **and nothing but the key** (3NF: not on another non-key attribute).
:::

<svg class="diagram" viewBox="0 0 640 210" role="img" aria-label="Dependency diagram: in OrderLine, Qty depends on the whole key; Description and Price depend only on StockID (partial); in CustOrder, CustomerName depends on CustomerID (transitive)">
  <defs><marker id="arr103" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit" fill="currentColor">
    <text x="20" y="22" font-weight="600">Partial dependency (breaks 2NF)</text>
    <rect x="20" y="60" width="90" height="30" fill="#ffb84d" fill-opacity="0.3" stroke="currentColor"/><text x="65" y="80" text-anchor="middle" text-decoration="underline">OrderNo</text>
    <rect x="110" y="60" width="90" height="30" fill="#ffb84d" fill-opacity="0.3" stroke="currentColor"/><text x="155" y="80" text-anchor="middle" text-decoration="underline">StockID</text>
    <rect x="200" y="60" width="60" height="30" fill="none" stroke="currentColor"/><text x="230" y="80" text-anchor="middle">Qty</text>
    <rect x="260" y="60" width="90" height="30" fill="none" stroke="currentColor"/><text x="305" y="80" text-anchor="middle">Description</text>
    <rect x="350" y="60" width="60" height="30" fill="none" stroke="currentColor"/><text x="380" y="80" text-anchor="middle">Price</text>
    <path d="M110,92 L110,115 L230,115 L230,94" fill="none" stroke="currentColor" marker-end="url(#arr103)"/>
    <text x="170" y="130" text-anchor="middle" font-size="12">whole key → Qty ✓</text>
    <path d="M155,58 L155,40 L305,40 L305,56" fill="none" stroke="#e0533d" stroke-width="1.6" marker-end="url(#arr103)"/>
    <path d="M305,40 L380,40 L380,56" fill="none" stroke="#e0533d" stroke-width="1.6" marker-end="url(#arr103)"/>
    <text x="345" y="34" font-size="12">part of key → ✗</text>
    <text x="440" y="22" font-weight="600">Non-key dependency (breaks 3NF)</text>
    <rect x="440" y="60" width="70" height="30" fill="#ffb84d" fill-opacity="0.3" stroke="currentColor"/><text x="475" y="80" text-anchor="middle" text-decoration="underline">OrderNo</text>
    <rect x="510" y="60" width="50" height="30" fill="none" stroke="currentColor"/><text x="535" y="80" text-anchor="middle">CustID</text>
    <rect x="560" y="60" width="70" height="30" fill="none" stroke="currentColor"/><text x="595" y="80" text-anchor="middle">CustName</text>
    <path d="M535,92 L535,115 L595,115 L595,94" fill="none" stroke="#e0533d" stroke-width="1.6" marker-end="url(#arr103)"/>
    <text x="565" y="132" text-anchor="middle" font-size="12">non-key → non-key ✗</text>
    <text x="320" y="180" text-anchor="middle" font-size="12">Highlighted boxes are the primary key. Red arrows show the dependencies normalisation removes.</text>
  </g>
</svg>

## Worked normalisation 1: the college (repeating group method)

:::example From UNF to 3NF, every stage shown
**UNF.** The table above. Entity description, with the repeating group in an inner bracket:

- Student(<u>StudentNo</u>, StudentName, DOB, (CourseNo, CourseName, LecturerNo, LecturerName, TargetGrade))

**Step 1 → 1NF.**

- *Atomic?* `StudentName` holds two values (first name and surname), so split it into `FirstName`, `Surname`.
- *Repeating group?* Yes: CourseNo, CourseName, LecturerNo, LecturerName, TargetGrade repeat for each course.
- *Fix:* move the repeating group to a new table and take a **copy of the original key** with it so each row still knows whose it is. The new table needs a key: `StudentNo` repeats and `CourseNo` repeats, but the **pair** is unique, so the key is **composite**.

1NF tables:

- Student(<u>StudentNo</u>, FirstName, Surname, DOB)
- StudentCourse(<u>StudentNo</u>, <u>CourseNo</u>, CourseName, LecturerNo, LecturerName, TargetGrade)

| <u>StudentNo</u> | FirstName | Surname | DOB |
|---|---|---|---|
| 9124 | Chris | Holland | 05/05/2008 |
| 8014 | Charlie | Chambers | 04/05/2008 |
| 9100 | Cameron | Barry-Cooper | 12/12/2008 |

| <u>StudentNo</u> | <u>CourseNo</u> | CourseName | LecturerNo | LecturerName | TargetGrade |
|---|---|---|---|---|---|
| 9124 | Comp | Computing | JRA | J. Adey | A |
| 9124 | Span | Spanish | AGG | A. Gomez | B |
| 8014 | Econ | Economics | RJV | R. Vale | B |
| 8014 | IT | IT | SEW | S. Westwood | A |
| 8014 | Comp | Computing | JRA | J. Adey | C |
| 9100 | Comp | Computing | JRA | J. Adey | A |
| 9100 | Art | Art | JLB | J. Brown | A |

**Step 2 → 2NF.** Only tables with a **composite** key can have partial dependencies.

- Student has a single-attribute key → already 2NF.
- StudentCourse: check each non-key attribute against each part of the key.

| Attribute | Depends on | Partial? |
|---|---|---|
| CourseName | CourseNo only | **yes** |
| LecturerNo | CourseNo only (each course has one lecturer) | **yes** |
| LecturerName | CourseNo only (via LecturerNo) | **yes** |
| TargetGrade | StudentNo **and** CourseNo | no |

Move the partially dependent attributes into a new table keyed on `CourseNo`. `CourseNo` stays behind in the link table as a foreign key.

2NF tables:

- Student(<u>StudentNo</u>, FirstName, Surname, DOB)
- Enrolment(<u>StudentNo</u>, <u>CourseNo</u>, TargetGrade)
- Course(<u>CourseNo</u>, CourseName, LecturerNo, LecturerName)

| <u>StudentNo</u> | <u>CourseNo</u> | TargetGrade |
|---|---|---|
| 9124 | Comp | A |
| 9124 | Span | B |
| 8014 | Econ | B |
| 8014 | IT | A |
| 8014 | Comp | C |
| 9100 | Comp | A |
| 9100 | Art | A |

| <u>CourseNo</u> | CourseName | LecturerNo | LecturerName |
|---|---|---|---|
| Comp | Computing | JRA | J. Adey |
| Span | Spanish | AGG | A. Gomez |
| Econ | Economics | RJV | R. Vale |
| IT | IT | SEW | S. Westwood |
| Art | Art | JLB | J. Brown |

Computing now appears **once**, not three times.

**Step 3 → 3NF.** Look for a non-key attribute that determines another non-key attribute.

- Student: FirstName, Surname, DOB all depend only on StudentNo → 3NF.
- Enrolment: only one non-key attribute → 3NF.
- Course: **LecturerNo → LecturerName**. LecturerName depends on a **non-key** attribute: a transitive dependency (CourseNo → LecturerNo → LecturerName).

Move `LecturerName` to a Lecturer table keyed on `LecturerNo`; leave `LecturerNo` in Course as a **foreign key**.

**3NF tables (final design):**

- Student(<u>StudentNo</u>, FirstName, Surname, DOB)
- Enrolment(<u>StudentNo</u>, <u>CourseNo</u>, TargetGrade)
- Course(<u>CourseNo</u>, CourseName, LecturerNo<sup>FK</sup>)
- Lecturer(<u>LecturerNo</u>, LecturerName)

| <u>CourseNo</u> | CourseName | LecturerNo |
|---|---|---|
| Comp | Computing | JRA |
| Span | Spanish | AGG |
| Econ | Economics | RJV |
| IT | IT | SEW |
| Art | Art | JLB |

| <u>LecturerNo</u> | LecturerName |
|---|---|
| JRA | J. Adey |
| AGG | A. Gomez |
| RJV | R. Vale |
| SEW | S. Westwood |
| JLB | J. Brown |

<svg class="diagram" viewBox="0 0 640 200" role="img" aria-label="ER diagram of the 3NF college design: Student and Course linked by Enrolment, Lecturer one-to-many Course">
  <g font-size="14" font-family="inherit" stroke-width="1.6">
    <rect x="20" y="30" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="85" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">Student</text>
    <rect x="250" y="30" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="315" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">Enrolment</text>
    <rect x="480" y="30" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="545" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">Course</text>
    <rect x="480" y="140" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="545" y="167" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">Lecturer</text>
    <line x1="150" y1="52" x2="250" y2="52" stroke="currentColor"/>
    <line x1="234" y1="52" x2="250" y2="43" stroke="currentColor"/><line x1="234" y1="52" x2="250" y2="52" stroke="currentColor"/><line x1="234" y1="52" x2="250" y2="61" stroke="currentColor"/>
    <line x1="480" y1="52" x2="380" y2="52" stroke="currentColor"/>
    <line x1="396" y1="52" x2="380" y2="61" stroke="currentColor"/><line x1="396" y1="52" x2="380" y2="52" stroke="currentColor"/><line x1="396" y1="52" x2="380" y2="43" stroke="currentColor"/>
    <line x1="545" y1="140" x2="545" y2="74" stroke="currentColor"/>
    <line x1="545" y1="90" x2="536" y2="74" stroke="currentColor"/><line x1="545" y1="90" x2="545" y2="74" stroke="currentColor"/><line x1="545" y1="90" x2="554" y2="74" stroke="currentColor"/>
    <text x="553" y="111" text-anchor="start" font-size="12" fill="currentColor" stroke="none">teaches</text>
  </g>
</svg>

**Check the anomalies have gone:** Music can be added to Course before anyone enrols (no insertion anomaly); Cameron can be deleted without losing Art or J. Brown (no deletion anomaly); J. Adey's name is stored once (no update anomaly).
:::

:::trap Spot the slip in the class slides
In the slides' final 3NF Course table, Spanish is shown with lecturer **JRA**, but earlier it was taught by **AGG (A. Gomez)**, and AGG is missing from the Lecturer table. Normalisation must never change the facts: every value in the UNF data must still be recoverable from the 3NF tables. Always check your final tables against the original data.
:::

## Worked normalisation 2: shop orders (flattening method)

This time 1NF is reached by **flattening**: one row per item, repeating the order details on each row. Both methods are accepted by AQA and both end at the same 3NF design.

:::example A computer shop's orders, UNF to 3NF
**UNF** (one row per order; the items form a repeating group):

| OrderNo | OrderDate | CustomerID | CustomerName | StockID | Description | Price | Qty |
|---|---|---|---|---|---|---|---|
| 001 | 12/07/2024 | C17 | Jo Hart | 4692, 5723, 7789 | Keyboard, Mouse, Scanner | 9.99, 4.99, 69.90 | 3, 3, 1 |
| 002 | 29/07/2024 | C23 | Sam Iqbal | 0134 | Laser printer | 124.00 | 1 |
| 003 | 30/07/2024 | C17 | Jo Hart | 4692, 5723, 9834 | Keyboard, Mouse, External hard drive | 9.99, 4.99, 59.99 | 1, 1, 1 |

- CustOrder(<u>OrderNo</u>, OrderDate, CustomerID, CustomerName, (StockID, Description, Price, Qty))

A line total (Price × Qty) is **not** stored: it is **derived** and can be calculated.

**Step 1 → 1NF.** Give each item its own row. `OrderNo` now repeats, so the key becomes the composite (OrderNo, StockID): an item appears once per order.

- OrderLine(<u>OrderNo</u>, <u>StockID</u>, OrderDate, CustomerID, CustomerName, Description, Price, Qty)

| <u>OrderNo</u> | <u>StockID</u> | OrderDate | CustomerID | CustomerName | Description | Price | Qty |
|---|---|---|---|---|---|---|---|
| 001 | 4692 | 12/07/2024 | C17 | Jo Hart | Keyboard | 9.99 | 3 |
| 001 | 5723 | 12/07/2024 | C17 | Jo Hart | Mouse | 4.99 | 3 |
| 001 | 7789 | 12/07/2024 | C17 | Jo Hart | Scanner | 69.90 | 1 |
| 002 | 0134 | 29/07/2024 | C23 | Sam Iqbal | Laser printer | 124.00 | 1 |
| 003 | 4692 | 30/07/2024 | C17 | Jo Hart | Keyboard | 9.99 | 1 |
| 003 | 5723 | 30/07/2024 | C17 | Jo Hart | Mouse | 4.99 | 1 |
| 003 | 9834 | 30/07/2024 | C17 | Jo Hart | External hard drive | 59.99 | 1 |

Atomic, no repeating groups, has a key: **1NF**. But the redundancy is now obvious.

**Step 2 → 2NF.** Test each non-key attribute against each half of the key:

| Attribute | Depends on | Result |
|---|---|---|
| OrderDate, CustomerID, CustomerName | OrderNo only | partial → move to **CustOrder** |
| Description, Price | StockID only | partial → move to **Stock** |
| Qty | OrderNo **and** StockID | stays in OrderLine |

2NF tables:

- CustOrder(<u>OrderNo</u>, OrderDate, CustomerID, CustomerName)
- OrderLine(<u>OrderNo</u>, <u>StockID</u>, Qty)
- Stock(<u>StockID</u>, Description, Price)

| <u>OrderNo</u> | OrderDate | CustomerID | CustomerName |
|---|---|---|---|
| 001 | 12/07/2024 | C17 | Jo Hart |
| 002 | 29/07/2024 | C23 | Sam Iqbal |
| 003 | 30/07/2024 | C17 | Jo Hart |

| <u>OrderNo</u> | <u>StockID</u> | Qty |
|---|---|---|
| 001 | 4692 | 3 |
| 001 | 5723 | 3 |
| 001 | 7789 | 1 |
| 002 | 0134 | 1 |
| 003 | 4692 | 1 |
| 003 | 5723 | 1 |
| 003 | 9834 | 1 |

| <u>StockID</u> | Description | Price |
|---|---|---|
| 4692 | Keyboard | 9.99 |
| 5723 | Mouse | 4.99 |
| 7789 | Scanner | 69.90 |
| 0134 | Laser printer | 124.00 |
| 9834 | External hard drive | 59.99 |

**Step 3 → 3NF.** In CustOrder, **CustomerID → CustomerName**: a non-key dependency (Jo Hart is still stored twice). Move CustomerName to a Customer table; CustomerID stays in CustOrder as a foreign key. OrderLine and Stock have no non-key dependencies.

**3NF tables (final design):**

- Customer(<u>CustomerID</u>, CustomerName)
- CustOrder(<u>OrderNo</u>, OrderDate, CustomerID<sup>FK</sup>)
- OrderLine(<u>OrderNo</u>, <u>StockID</u>, Qty)
- Stock(<u>StockID</u>, Description, Price)

| <u>CustomerID</u> | CustomerName |
|---|---|
| C17 | Jo Hart |
| C23 | Sam Iqbal |

| <u>OrderNo</u> | OrderDate | CustomerID |
|---|---|---|
| 001 | 12/07/2024 | C17 |
| 002 | 29/07/2024 | C23 |
| 003 | 30/07/2024 | C17 |

<svg class="diagram" viewBox="0 0 640 200" role="img" aria-label="ER diagram of the 3NF shop design: Customer one-to-many CustOrder, CustOrder one-to-many OrderLine, Stock one-to-many OrderLine">
  <g font-size="14" font-family="inherit" stroke-width="1.6">
    <rect x="20" y="30" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="85" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">Customer</text>
    <rect x="250" y="30" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="315" y="57" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">CustOrder</text>
    <rect x="250" y="140" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="315" y="167" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">OrderLine</text>
    <rect x="480" y="140" width="130" height="44" rx="4" fill="#7c9aff" fill-opacity="0.18" stroke="currentColor"/>
    <text x="545" y="167" text-anchor="middle" fill="currentColor" stroke="none" font-weight="600">Stock</text>
    <line x1="150" y1="52" x2="250" y2="52" stroke="currentColor"/>
    <line x1="234" y1="52" x2="250" y2="43" stroke="currentColor"/><line x1="234" y1="52" x2="250" y2="52" stroke="currentColor"/><line x1="234" y1="52" x2="250" y2="61" stroke="currentColor"/>
    <text x="200" y="44" text-anchor="middle" font-size="12" fill="currentColor" stroke="none">places</text>
    <line x1="315" y1="74" x2="315" y2="140" stroke="currentColor"/>
    <line x1="315" y1="124" x2="324" y2="140" stroke="currentColor"/><line x1="315" y1="124" x2="315" y2="140" stroke="currentColor"/><line x1="315" y1="124" x2="306" y2="140" stroke="currentColor"/>
    <text x="323" y="111" text-anchor="start" font-size="12" fill="currentColor" stroke="none">contains</text>
    <line x1="480" y1="162" x2="380" y2="162" stroke="currentColor"/>
    <line x1="396" y1="162" x2="380" y2="171" stroke="currentColor"/><line x1="396" y1="162" x2="380" y2="162" stroke="currentColor"/><line x1="396" y1="162" x2="380" y2="153" stroke="currentColor"/>
    <text x="430" y="154" text-anchor="middle" font-size="12" fill="currentColor" stroke="none">appears on</text>
  </g>
</svg>

The table is called `CustOrder` because **ORDER is an SQL keyword**; a table named `Order` causes errors in many DBMSs.
:::

:::note Price history
If prices change, `Stock.Price` holds today's price, so old orders would appear to cost the new price. Real systems copy the **price paid** into OrderLine (it then depends on the whole key, so it is still 3NF). Mention this if a question asks you to evaluate a design.
:::

## Try it yourself

{{tool:normalisation-walkthrough}}

## Recognising the normal form in an exam

:::steps Diagnose any table
1. **Is there a primary key, are all values atomic, and are there no repeating groups or repeated columns** (Email1, Email2…)? If not → **UNF**.
2. **Is the key composite?** If not, a 1NF table is **already 2NF** → jump to step 4.
3. **Does any non-key attribute depend on only part of the key?** If yes → **1NF only**.
4. **Does any non-key attribute depend on another non-key attribute?** If yes → **2NF only**. If no → **3NF**.
:::

| Example | Normal form | Reason |
|---|---|---|
| Member(<u>MemberID</u>, Name, Phone1, Phone2) | UNF | repeating attribute (Phone1, Phone2) |
| Lesson(<u>LessonID</u>, Details) where Details = "Computing Tuesday 12:30" | UNF | not atomic: split into Subject, Day, Time |
| Flight(<u>FlightID</u>, <u>DestinationID</u>, DestinationCountry, DepartureTime) | 1NF | DestinationCountry depends only on DestinationID (partial) |
| Employee(<u>EmpID</u>, Name, DeptNo, DeptName) | 2NF | DeptNo → DeptName (non-key dependency) |
| Enrolment(<u>StudentNo</u>, <u>CourseNo</u>, TargetGrade) | 3NF | only attribute depends on the whole key |

:::trap
- **2NF only concerns composite keys.** Saying "this table is not in 2NF" when its key is a single attribute is a contradiction.
- **Keep the link.** When you move attributes out, the attribute they depended on **stays** in the original table as a **foreign key**. Students often move it and break the relationship.
- **Partial vs non-key**: a partial dependency is on **part of the key**; a non-key dependency is on an attribute that is **not in the key at all**. Name the right one.
- In 1NF answers, do not forget to say the table needs a **primary key**: it is part of the AQA definition.
- **Do not store derived data** (totals, ages). It is redundant and can become inconsistent.
:::

:::exam
- **"Explain why databases are normalised"** (2–4 marks): minimise redundancy · ensure consistency/integrity · avoid update anomalies (data changed in one place but not another) · avoid insertion/deletion anomalies. Give an example from the scenario if possible.
- **"State the conditions for 3NF"**: in 2NF (and so 1NF) · no non-key/transitive dependencies · every non-key attribute depends on the key, the whole key and nothing but the key.
- **"Is this table in 3NF? Justify"** (2–3 marks): name the **specific** dependency that breaks it (e.g. "TeacherName depends on TeacherID, which is not the primary key").
- **"Normalise to 3NF"** (5–8 marks): write the final tables as entity descriptions, underline every key (all parts of composite keys), include every original attribute exactly once except foreign keys, and keep the foreign-key links. Marks are awarded per correct table.
- Working is rarely required, but writing 1NF and 2NF stages helps you avoid losing attributes.
:::

:::challenge
1. Normalise the dog-show entries to 3NF: EntryNo, Handler, Address, Dog, Class, ClassDescription, where each handler has many dogs and each dog enters up to three classes. What should the key of the entry table be?
2. A table is `Booking(`<u>RoomNo</u>`, `<u>Date</u>`, GuestID, GuestName, RoomType, Rate)`, where Rate depends on RoomType. Identify every dependency and normalise.
3. Explain why a 1NF table with a single-attribute primary key cannot contain a partial dependency.
:::

:::recap
- Normalise to **remove redundancy**, keep data **consistent**, and avoid **update, insertion and deletion anomalies**.
- **1NF**: primary key, atomic values, no repeating groups.
- **2NF**: 1NF + **no partial dependencies** on a composite key.
- **3NF**: 2NF + **no non-key (transitive) dependencies**.
- "The **key**, the **whole key** and **nothing but the key**."
- Each fix moves attributes to a new table keyed on what they depend on and leaves that attribute behind as a **foreign key**.
:::

:::related
- [10.1 Data modelling and ER diagrams](#/topic/10.1)
- [10.2 Relational databases](#/topic/10.2) — keys and anomalies
- [10.4 SQL](#/topic/10.4) — querying the normalised tables with joins
:::

*/});
