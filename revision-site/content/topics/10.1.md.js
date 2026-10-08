CS.registerTopic({ id: "10.1", title: "Data modelling and entity relationship diagrams" }, function () {/*

:::objectives
- Read a written scenario and pick out the **entities**, their **attributes** and the **relationships** between them.
- State the **degree** of a relationship: one-to-one (1:1), one-to-many (1:M) or many-to-many (M:N).
- Draw an **entity relationship (ER) diagram** in the AQA style: boxes joined by lines, with a crow's foot on every "many" end.
- **Resolve** a many-to-many relationship by adding a **link entity**.
- Write **entity descriptions** in the exact form `Entity(PrimaryKey, Attribute, ForeignKey)` with the primary key underlined.
:::

:::quick At a glance
- A **data model** describes what data a system stores and how it fits together, *before* any tables are built.
- **Entity** = a thing (object, person, event) we store data about. **Attribute** = a property of that entity.
- **Relationship degree**: **1:1**, **1:M** or **M:N**. Test it with two sentences: "Each A has … B" and "Each B has … A".
- ER diagram: one **rectangle** per entity, a **line** per relationship, a **crow's foot** (three-pronged end) at each **many** end.
- A **M:N** relationship cannot be implemented directly. Replace it with a **link entity** and two **1:M** relationships.
- Entity description: `Pet(`<u>PetID</u>`, Name, Species, OwnerID)` — entity name singular, attributes in brackets, **primary key underlined**.
- The **foreign key** always goes on the **many** side of a 1:M relationship.
:::

:::keyterms
Data model :: An abstract description of the data a system needs to store, the entities involved, their attributes and the relationships between them. :: The plan of the database drawn before building it.
Entity :: A category of object, person, event or thing of interest about which data needs to be recorded. :: A "thing" you keep a table about, e.g. Pet, Owner.
Attribute :: A characteristic or property of an entity. :: One fact about the thing, e.g. a pet's Name. Becomes a field.
Relationship :: An association or link between two entities. :: How two things are connected, e.g. an owner *owns* pets.
Degree of relationship :: Whether a relationship is one-to-one, one-to-many or many-to-many. :: How many of each side can be linked.
Entity relationship diagram :: A diagram showing the entities in a data model as rectangles and the relationships (with their degree) as lines between them. :: Boxes and lines with crow's feet.
Entity description :: A textual description of an entity in the form Entity(Attribute1, Attribute2, …) with the primary key underlined. :: One-line summary of a table's structure.
Link entity :: An entity introduced to resolve a many-to-many relationship into two one-to-many relationships; its primary key is usually a composite of the two original primary keys. :: The "middle" table that breaks up M:N.
Identifier (primary key) :: An attribute, or combination of attributes, that uniquely identifies each instance of an entity. :: The ID that can never repeat.
:::

## What a data model is for

Before anyone types `CREATE TABLE`, the designer has to agree with the client **what** will be stored. The data model is that agreement.

It answers three questions:

1. **Which things** do we need to store data about? (entities)
2. **What facts** about each thing? (attributes)
3. **How are the things connected**? (relationships and their degree)

{{spec:4.10.1.1}} The specification asks you to *produce* a data model "from given data requirements for a simple scenario involving multiple entities". In the exam that means: read a paragraph or a bullet list, then draw the ER diagram and/or write entity descriptions.

:::why
Why bother modelling first? Changing a table after it is full of data is painful. Spotting on paper that "a pet can see many vets and a vet sees many pets" saves you from building a design that cannot store the real situation.
:::

## Entities, attributes and identifiers

| Term | Ask yourself | Example (vet practice) |
|---|---|---|
| **Entity** | Is it a *noun* we need several facts about, and could there be many of them? | Owner, Pet, Vet, Appointment |
| **Attribute** | Is it a single fact *about* one entity? | Pet: Name, Species, DateOfBirth |
| **Identifier / primary key** | What value can never be repeated for two different instances? | PetID, OwnerID, VetID, ApptID |

Rules of thumb:

- Entity names are **singular** (`Pet`, not `Pets`) and usually **nouns**.
- Events count as entities too: an **Appointment**, a **Booking**, a **Loan**, an **Order**.
- A person's name is a poor identifier (two people can share it). Invent an ID if nothing natural is unique.
- If a "fact" has its own facts, it is probably an entity. *Vet* has a name and a specialism, so Vet is an entity, not an attribute of Pet.

:::trap
- **An entity is not a single record.** "Biscuit the dog" is an *instance* (a record); **Pet** is the entity. Defining entity as "a row" or "a table" loses the mark: say "a thing/object/person/event about which data is stored".
- **Do not store a calculated value** (age, total cost) as an attribute when it can be worked out from other attributes (date of birth, quantity × price).
:::

## Relationships and their degree

A relationship is a link between two entities. Its **degree** says how many instances on each side can be linked.

The safe way to work it out is to say **two sentences**, one from each side, about a *single* instance:

| Sentence from side A | Sentence from side B | Degree |
|---|---|---|
| Each **headteacher** runs **one** school | Each **school** has **one** headteacher | **1:1** |
| Each **form** has **many** students | Each **student** is in **one** form | **1:M** (form to student) |
| Each **teacher** teaches **many** pupils | Each **pupil** is taught by **many** teachers | **M:N** |

### Drawing the degree: crow's feet

AQA ER diagrams use **rectangles** for entities and **plain lines** for relationships. The end of a line touching an entity shows how many of *that* entity can be involved:

- **Straight end** = one.
- **Crow's foot** (the line splays into three prongs) = many.

:::figure The three degrees of relationship in AQA notation
@@SVG:degrees@@
:::

Read each diagram from the far side: in the middle row, *one* form is linked to *many* students, so the crow's foot touches **Student**.

:::trap
- The crow's foot goes at the **many** end, next to the entity there can be many of. Putting it on the "one" side reverses the meaning and loses the mark.
- **Do not label lines "1" and "M" instead of drawing crow's feet** unless the question allows it. Draw the feet clearly.
- AQA does not require optionality symbols (circles and bars) and you will not be penalised for leaving them out. Keep diagrams simple.
- Do not draw arrows. A relationship line has no direction arrowhead in AQA ER diagrams.
:::

## Resolving many-to-many relationships

A relational database **cannot implement M:N directly**. To link a pet to many vets you would need a list of VetIDs in one field, which breaks the "one value per field" rule (see [10.3 Normalisation](#/topic/10.3)).

The fix is always the same:

:::steps Resolving M:N
1. Create a **link entity** between the two original entities. Name it after the event or fact that connects them (Appointment, Enrolment, Loan, OrderLine).
2. Give it a **foreign key** to each original entity.
3. Its primary key is usually the **composite** of the two foreign keys (or a new ID if the same pair can occur more than once).
4. Replace the M:N line with **two 1:M lines**, each with the crow's foot at the **link entity**.
5. Put attributes that describe the *pairing* (date enrolled, target grade, quantity ordered) in the link entity.
:::

:::figure Student M:N Course becomes Student 1:M Enrolment M:1 Course
@@SVG:resolve@@
:::

Enrolment(<u>StudentID</u>, <u>CourseID</u>, DateEnrolled, TargetGrade)

The composite key works because a student enrols on a particular course **once**. Each half of the key is also a foreign key.

:::tip
In an ER diagram, a link entity always has **two crow's feet pointing into it**. If you see an entity with two crow's feet touching it from different directions, it is resolving a M:N relationship.
:::

## Entity descriptions: the AQA notation

The specification wants entity descriptions in the form:

> **Entity1(Attribute1, Attribute2, …)**

Conventions to follow every time:

- Entity name first, **singular**, no spaces (`OrderLine`, not `Order Line`).
- Attributes in round **brackets**, separated by commas.
- **Primary key underlined** and normally written first. A **composite** key has **every** part underlined.
- Foreign keys are included as ordinary attributes. On this site they are tagged <sup>FK</sup> so you can spot them; in the exam, underline only the primary key unless the question asks you to identify foreign keys (some mark schemes accept an asterisk or dashed underline for them).

Owner(<u>OwnerID</u>, Surname, Forename, Town, Phone)

Pet(<u>PetID</u>, Name, Species, DateOfBirth, OwnerID<sup>FK</sup>)

Vet(<u>VetID</u>, VetName, Specialism)

Appointment(<u>ApptID</u>, PetID<sup>FK</sup>, VetID<sup>FK</sup>, ApptDate, Reason, Fee)

:::trap
- **Underline** the key. Bold, capitals or "(PK)" do not get the mark if the question says underline.
- If the key is composite, underline **both** attributes. Underlining one of them describes a different (wrong) key.
- The **foreign key goes on the many side**. Owner–Pet is 1:M, so `OwnerID` goes in **Pet**. Putting `PetID` in Owner would need a list of pets per owner.
:::

## Worked scenario 1: a vet practice

:::example Producing a data model from requirements
**Requirements** (the style you get in the exam):

- Each **owner** is given a unique OwnerID; their surname, forename, town and phone number are stored.
- Each **pet** has a unique PetID, a name, species and date of birth. A pet belongs to **one** owner; an owner can have **several** pets.
- Each **vet** has a unique two-character VetID, a name and a specialism.
- Pets are seen by vets at **appointments**. Each appointment is for one pet with one vet on a given date, and records the reason and the fee. A pet can see many different vets over time and a vet sees many pets.

**Step 1 — underline the nouns that have their own facts.** Owner, Pet, Vet, Appointment. ("Fee", "reason" and "date" are facts about an appointment, so they are attributes.)

**Step 2 — list the attributes and choose identifiers.** Given IDs exist for Owner, Pet and Vet. An appointment can repeat the same pet/vet pair on different days, and even the same day, so give it its own `ApptID`.

**Step 3 — say the two sentences for each pair.**

| Pair | Sentence 1 | Sentence 2 | Degree |
|---|---|---|---|
| Owner – Pet | Each owner owns many pets | Each pet has one owner | 1:M |
| Pet – Vet | Each pet sees many vets | Each vet sees many pets | **M:N → resolve** |
| Pet – Appointment | Each pet has many appointments | Each appointment is for one pet | 1:M |
| Vet – Appointment | Each vet takes many appointments | Each appointment is with one vet | 1:M |

**Step 4 — resolve M:N.** Appointment already exists in the scenario and is exactly the link entity between Pet and Vet, so the M:N disappears into two 1:M relationships.

**Step 5 — draw the diagram** (crow's feet at the many ends):

@@SVG:vet@@

**Step 6 — write the entity descriptions** (foreign key on the many side of each 1:M):

Owner(<u>OwnerID</u>, Surname, Forename, Town, Phone)
Pet(<u>PetID</u>, Name, Species, DateOfBirth, OwnerID<sup>FK</sup>)
Vet(<u>VetID</u>, VetName, Specialism)
Appointment(<u>ApptID</u>, PetID<sup>FK</sup>, VetID<sup>FK</sup>, ApptDate, Reason, Fee)

These four tables are used for every SQL example in [10.4 SQL](#/topic/10.4).
:::

## Worked scenario 2: a school library

:::example A scenario with two many-to-many relationships
**Requirements:**

- The library holds **books**, identified by ISBN, with a title and year published.
- A book can have **several authors** and an author can write **several books**. Each author has an AuthorID, forename and surname.
- The library owns one or more physical **copies** of each book. Each copy has a unique barcode (CopyID) and a shelf location.
- **Members** (MemberID, name, tutor group) borrow copies. Each **loan** records the copy, the member, the date out and the date due. A member makes many loans over time and a copy is lent many times.

**Entities:** Book, Author, Copy, Member, Loan, plus a link entity for authorship.

**Relationships:**

| Pair | Degree | Action |
|---|---|---|
| Author – Book | M:N | resolve with link entity **BookAuthor** |
| Book – Copy | 1:M | CopyID's record holds ISBN as foreign key |
| Member – Copy (borrowing) | M:N over time | resolved by **Loan** |
| Member – Loan | 1:M | Loan holds MemberID |
| Copy – Loan | 1:M | Loan holds CopyID |

**Why Book and Copy are separate:** the title and year are the same for all five copies of a book. Storing them once in Book and linking each copy with an ISBN avoids repeating them (the same idea normalisation formalises).

**ER diagram:**

@@SVG:library@@

**Entity descriptions:**

Author(<u>AuthorID</u>, Forename, Surname)
Book(<u>ISBN</u>, Title, YearPublished)
BookAuthor(<u>ISBN</u>, <u>AuthorID</u>)
Copy(<u>CopyID</u>, ISBN<sup>FK</sup>, Shelf)
Member(<u>MemberID</u>, Forename, Surname, TutorGroup)
Loan(<u>CopyID</u>, <u>DateOut</u>, MemberID<sup>FK</sup>, DateDue)

**Choosing Loan's key.** CopyID alone repeats (a copy is lent many times). CopyID + MemberID could repeat (the same member borrows the same copy twice). A copy can only go out once on a given day, so **(CopyID, DateOut)** is unique. A new `LoanID` would also be acceptable; say why your key is unique.
:::

## Going backwards: from entity descriptions to the ER diagram

Exams often give you the entity descriptions and ask for the diagram. Use the **key-matching rules**:

| What you see | Relationship |
|---|---|
| Two entities have the **same** single-attribute primary key | **1:1** |
| A single-attribute primary key of A appears in B as a **non-key attribute or part of a composite key** | **1:M**, crow's foot at **B** |
| Two entities share an attribute that is the primary key of **neither** | an unresolved **M:N** (needs a link entity) |

:::example Hospital (adapted from the textbook question)
Ward(<u>WardName</u>, NurseInCharge, NumberOfBeds)
Patient(<u>PatientNumber</u>, Surname, Forename, Address, DateOfBirth, WardName<sup>FK</sup>)
Condition(<u>ConditionNumber</u>, ConditionName, StandardTreatment)
PatientCondition(<u>PatientNumber</u>, <u>ConditionNumber</u>)

- `WardName` is Ward's key and appears in Patient → Ward 1:M Patient.
- `PatientNumber` is Patient's key and is part of PatientCondition's composite key → Patient 1:M PatientCondition.
- `ConditionNumber` likewise → Condition 1:M PatientCondition.

@@SVG:hospital@@

Note that the textbook answer puts `WardName` into PatientMedicalCondition. Because "a patient can be assigned to only one ward", the ward belongs with the **patient**, not with each condition the patient has.
:::

:::exam
- **"Draw an ER diagram"** (typically 3–5 marks): one mark per correct relationship. Boxes must be named exactly as given; the crow's foot must be on the correct end. Do not draw relationships that are not there (an extra wrong line can cost a mark).
- **"Complete the entity description"**: list *every* attribute mentioned in the scenario for that entity, include the foreign key(s), and underline the primary key (all parts if composite).
- **"Explain why X is needed"** for a link entity: a M:N relationship cannot be implemented in a relational database / each field must hold a single value, so the link entity turns it into two 1:M relationships.
- **"Identify the foreign key"**: name the attribute *and* the table it is in.
- If you add your own primary key (e.g. `LoanID`), say so; examiners accept any key that is genuinely unique.
:::

:::challenge
1. A cinema shows films on several screens; each screening is one film on one screen at a date and time; customers book seats for screenings. Produce the entity descriptions and ER diagram. Which entity resolves which M:N?
2. In the library model, could `Loan` use (CopyID, MemberID, DateOut) as its key? Is it wrong, or just unnecessary?
3. Find a genuine 1:1 relationship in a system you use (e.g. a user account and its settings). Why might a designer still keep them as two tables?
:::

:::recap
- Entity = a thing we store data about; attribute = a fact about it; identifier = attribute(s) unique to each instance.
- Degree: test with two sentences, one from each side. 1:1, 1:M, M:N.
- ER diagram: rectangles, plain lines, crow's foot at every **many** end.
- M:N cannot be implemented: add a **link entity** with a composite key of the two foreign keys, giving two 1:M relationships.
- Entity description: `Entity(`<u>Key</u>`, Attr, …, ForeignKey)`, singular name, **key underlined** (every part if composite).
- The foreign key always sits on the **many** side.
:::

:::related
- [10.2 Relational databases](#/topic/10.2) — keys and referential integrity
- [10.3 Normalisation](#/topic/10.3) — why the link entity and separate tables are the right design
- [10.4 SQL](#/topic/10.4) — building and querying the vet database
:::

*/});
