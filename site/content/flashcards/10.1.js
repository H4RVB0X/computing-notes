CS.registerFlashcards("10.1", [
  { front: "How do you test the degree of a relationship between A and B?", back: "Say two sentences about a single instance: \"Each A has one/many B\" and \"Each B has one/many A\". One/one = 1:1, one/many = 1:M, many/many = M:N." },
  { front: "Where does the crow's foot go on an AQA ER diagram?", back: "At the **many** end: touching the entity there can be many of." },
  { front: "How do you resolve a many-to-many relationship?", back: "Add a **link entity** holding both primary keys as foreign keys (usually as a composite primary key). The M:N becomes two 1:M relationships with crow's feet at the link entity." },
  { front: "In a 1:M relationship, which entity holds the foreign key?", back: "The entity on the **many** side (e.g. Pet holds OwnerID)." },
  { front: "Write the AQA entity description for a pet table.", back: "Pet(<u>PetID</u>, Name, Species, DateOfBirth, OwnerID): singular name, attributes in round brackets, primary key underlined." },
  { front: "From entity descriptions, how do you spot a 1:M relationship?", back: "A single-attribute primary key of one entity appears in another entity as a non-key attribute or as part of a composite key; the crow's foot goes at the second entity." },
  { front: "Give three examples of link entities and what they link.", back: "Enrolment (Student–Course) · OrderLine (Order–Product) · Appointment (Pet–Vet) · Loan (Member–Copy) · BookAuthor (Book–Author)" },
  { front: "Give an example of a one-to-one relationship.", back: "Headteacher–School: each headteacher runs one school; each school has one headteacher." },
]);
