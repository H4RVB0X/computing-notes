CS.registerTrace({
  id: "10.4-1", topic: "10.4", title: "SELECT with OR and ORDER BY", lang: "sql",
  intro: "Use the **Pet** table.\n\n| PetID | Name | Species | DateOfBirth | OwnerID |\n|---|---|---|---|---|\n| 101 | Biscuit | Dog | 2019-03-12 | 1 |\n| 102 | Luna | Cat | 2021-07-30 | 1 |\n| 103 | Rex | Dog | 2016-11-02 | 2 |\n| 104 | Pepper | Rabbit | 2022-05-19 | 3 |\n| 105 | Mabel | Cat | 2018-01-25 | 4 |\n| 106 | Shadow | Dog | 2020-09-08 | 5 |\n| 107 | Nibbles | Hamster | 2023-02-14 | 3 |",
  code: "SELECT Name, DateOfBirth\nFROM Pet\nWHERE Species = 'Cat' OR Species = 'Hamster'\nORDER BY DateOfBirth;",
  columns: ["Name", "DateOfBirth"],
  rows: [["Mabel", "2018-01-25"], ["Luna", "2021-07-30"], ["Nibbles", "2023-02-14"]],
  instructions: "Each row of this table is one row of the query's result, in the order the query returns them. Write dates exactly as stored (YYYY-MM-DD).",
  hint: "First pick out the cats and the hamster, then sort them by date of birth, oldest (earliest date) first, because ASC is the default.",
  note: "Three rows match (102, 105, 107). ORDER BY with no direction sorts ascending, so the earliest date comes first.",
});
CS.registerTrace({
  id: "10.4-2", topic: "10.4", title: "Two-table join, sorted descending", lang: "sql",
  intro: "Use the **Owner** and **Pet** tables.\n\n| OwnerID | Surname | Forename | Town |\n|---|---|---|---|\n| 1 | Khan | Aisha | Leeds |\n| 2 | Patel | Rohan | York |\n| 3 | Brown | Chloe | Leeds |\n| 4 | Nolan | Sean | Harrogate |\n| 5 | Woods | Emma | York |\n\n| PetID | Name | Species | OwnerID |\n|---|---|---|---|\n| 101 | Biscuit | Dog | 1 |\n| 102 | Luna | Cat | 1 |\n| 103 | Rex | Dog | 2 |\n| 104 | Pepper | Rabbit | 3 |\n| 105 | Mabel | Cat | 4 |\n| 106 | Shadow | Dog | 5 |\n| 107 | Nibbles | Hamster | 3 |",
  code: "SELECT Owner.Surname, Pet.Name\nFROM Owner, Pet\nWHERE Owner.OwnerID = Pet.OwnerID\n  AND Owner.Town = 'York'\nORDER BY Pet.Name DESC;",
  columns: ["Surname", "Name"],
  rows: [["Woods", "Shadow"], ["Patel", "Rex"]],
  instructions: "Each row of this table is one row of the result, in order.",
  hint: "York owners are 2 (Patel) and 5 (Woods). Find their pets with the join condition, then sort the pet names Z to A.",
  note: "The join pairs each pet with its own owner; the second condition keeps only York owners. DESC puts Shadow before Rex.",
});
CS.registerTrace({
  id: "10.4-3", topic: "10.4", title: "Three-table join", lang: "sql",
  intro: "Use the **Pet** table from the notes plus these two tables.\n\n| VetID | VetName |\n|---|---|\n| V1 | Dr Lee |\n| V2 | Dr Adeyemi |\n| V3 | Dr Marsh |\n\n| ApptID | PetID | VetID | Reason | Fee |\n|---|---|---|---|---|\n| 1 | 101 | V1 | Vaccination | 45.00 |\n| 2 | 103 | V3 | X-ray | 120.00 |\n| 3 | 102 | V1 | Check-up | 30.00 |\n| 4 | 104 | V2 | Dental | 55.00 |\n| 5 | 101 | V3 | Operation | 250.00 |\n| 6 | 106 | V1 | Vaccination | 45.00 |\n| 7 | 105 | V1 | Check-up | 30.00 |\n| 8 | 107 | V2 | Check-up | 25.00 |\n| 9 | 103 | V1 | Vaccination | 45.00 |\n\nPet names: 101 Biscuit, 102 Luna, 103 Rex, 104 Pepper, 105 Mabel, 106 Shadow, 107 Nibbles.",
  code: "SELECT Pet.Name, Vet.VetName, Appointment.Reason\nFROM Pet, Vet, Appointment\nWHERE Pet.PetID = Appointment.PetID\n  AND Vet.VetID = Appointment.VetID\n  AND Appointment.Fee > 50\nORDER BY Pet.Name;",
  columns: ["Name", "VetName", "Reason"],
  rows: [["Biscuit", "Dr Marsh", "Operation"], ["Pepper", "Dr Adeyemi", "Dental"], ["Rex", "Dr Marsh", "X-ray"]],
  instructions: "Each row of this table is one row of the result, in order.",
  hint: "Start from Appointment: which appointments cost more than 50? Then look up each one's pet name and vet name.",
  note: "Appointments 2, 4 and 5 cost more than 50 (45.00 is not > 50). Sorting by pet name gives Biscuit, Pepper, Rex.",
});
