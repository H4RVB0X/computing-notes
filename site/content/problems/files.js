/* Python coding practice: reading and writing text files
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "visitor-log",
    title: "Visitor log file",
    topic: "2.1",
    difficulty: 1,
    task: `The text file \`visitors.txt\` holds one visitor name per line (each line ends with a newline). At the start it contains:

\`\`\`text
Ana
Ben
\`\`\`

Write a program that:

1. asks for the visitor's name (prompt \`Enter your name: \`); if nothing is entered, output \`Name cannot be blank\` and ask again
2. **appends** the name to the end of \`visitors.txt\` on a new line (keep the existing names)
3. reads the whole file back and outputs every name numbered from 1, as \`<n>. <name>\`
4. outputs \`Visitors: <count>\`.

\`\`\`text
Enter your name: Cara
1. Ana
2. Ben
3. Cara
Visitors: 3
\`\`\``,
    files: {
      "visitors.txt": "Ana\nBen\n"
    },
    tests: [
      { name: "example from the question", input: "Cara\n", expect: "1. Ana\n2. Ben\n3. Cara\nVisitors: 3" },
      { name: "name with a space after a blank entry", input: "\nDev Patel\n", expect: "Name cannot be blank\n1. Ana\n2. Ben\n3. Dev Patel\nVisitors: 3" },
      { name: "the file itself is updated correctly", input: "Eve\n", code: "print(\"--- file ---\")\nprint(open(\"visitors.txt\").read(), end=\"\")", expect: "1. Ana\n2. Ben\n3. Eve\nVisitors: 3\n--- file ---\nAna\nBen\nEve", hidden: true },
      { name: "two blank entries", input: "\n\nZed\n", expect: "Name cannot be blank\nName cannot be blank\n1. Ana\n2. Ben\n3. Zed\nVisitors: 3", hidden: true }
    ],
    hints: [
      "Open the file in append mode: `with open(\"visitors.txt\", \"a\") as f:` then `f.write(name + \"\\n\")`.",
      "Then open it again in read mode (`\"r\"`) and loop over the lines. Use `line.strip()` to remove the newline before printing."
    ],
    solution: `name = input("Enter your name: ")
while name == "":
    print("Name cannot be blank")
    name = input("Enter your name: ")

with open("visitors.txt", "a") as f:
    f.write(name + "\\n")

count = 0
with open("visitors.txt", "r") as f:
    for line in f:
        count = count + 1
        print(str(count) + ". " + line.strip())
print("Visitors: " + str(count))
`,
    explain: `**Approach.** Two file operations: **append** (\`"a"\`) adds to the end without destroying the existing contents, then **read** (\`"r"\`) goes through the file line by line. Opening with \`"w"\` would *overwrite* the file, leaving only the new name.

**Newlines.** Each line read from a file still ends in \`"\\n"\`, so \`print(line)\` would print blank lines between names. \`strip()\` removes it. When writing, *you* must add the \`"\\n"\`, otherwise the next name would join on to this one.

**\`with\` blocks** close the file automatically, which also makes sure the appended name is actually saved before you read the file again.

The hidden test reads \`visitors.txt\` after your program finishes, to check the file itself was written correctly.`
  },
  {
    id: "high-scores-file",
    title: "High scores from a file",
    topic: "2.1",
    difficulty: 2,
    task: `The file \`scores.txt\` holds one player per line in the form \`name,score\`:

\`\`\`text
Ana,12
Ben,9
Cara,31
Dev,31
Eve,0
\`\`\`

Write a program that reads the file into a list of records and then:

1. outputs \`Highest: <name> with <score>\` — if several players share the top score, use the one that appears **first** in the file
2. outputs \`Average: <mean>\`, the mean score rounded with \`round(mean, 1)\`
3. repeatedly asks for a name to look up (prompt \`Search for a player: \`) until a blank line is entered. Matching ignores upper/lower case. Output \`<name> scored <score>\` using the name as it appears in the file, or \`<what was typed> was not found\`.

Your program must read the file: don't copy the data into your code.

\`\`\`text
Highest: Cara with 31
Average: 16.6
Search for a player: dev
Dev scored 31
Search for a player: Zoe
Zoe was not found
Search for a player: 
\`\`\``,
    files: {
      "scores.txt": "Ana,12\nBen,9\nCara,31\nDev,31\nEve,0\n"
    },
    tests: [
      { name: "example from the question", input: "dev\nZoe\n\n", expect: "Highest: Cara with 31\nAverage: 16.6\nDev scored 31\nZoe was not found" },
      { name: "no searches", input: "\n", expect: "Highest: Cara with 31\nAverage: 16.6" },
      { name: "capitals and a zero score", input: "EVE\nben\nana scored...\n\n", expect: "Highest: Cara with 31\nAverage: 16.6\nEve scored 0\nBen scored 9\nana scored... was not found", hidden: true },
      { name: "first and last players", input: "Ana\neve\nANA\n\n", expect: "Highest: Cara with 31\nAverage: 16.6\nAna scored 12\nEve scored 0\nAna scored 12", hidden: true }
    ],
    hints: [
      "Read each line, `strip()` it, then `split(\",\")` into a name and a score; store `[name, int(score)]` in a list.",
      "For the highest, only replace the current best when a score is **strictly** greater (`>`), so the earlier player wins a tie.",
      "For the search, compare `record[0].lower() == search.lower()`. Use a `found` flag so you know whether to print *not found*."
    ],
    solution: `players = []
with open("scores.txt", "r") as f:
    for line in f:
        line = line.strip()
        if line != "":
            parts = line.split(",")
            players.append([parts[0], int(parts[1])])

best = players[0]
total = 0
for p in players:
    if p[1] > best[1]:
        best = p
    total = total + p[1]
print("Highest: " + best[0] + " with " + str(best[1]))
print("Average: " + str(round(total / len(players), 1)))

search = input("Search for a player: ")
while search != "":
    found = False
    for p in players:
        if p[0].lower() == search.lower():
            print(p[0] + " scored " + str(p[1]))
            found = True
    if not found:
        print(search + " was not found")
    search = input("Search for a player: ")
`,
    explain: `**Approach.** Load the file once into a list of records (\`[name, score]\`), then work with the list. Reading the file again for every search would work but is slower and harder to follow.

**Parsing lines.** \`line.strip()\` removes the newline; \`split(",")\` separates the fields; \`int()\` converts the score so you can compare and add numbers (as strings, \`"9" > "31"\` is True!).

**Ties.** Using \`>\` keeps the first player with the top score; \`>=\` would give \`Dev\`.

**Common mistakes**
- Comparing names case-sensitively, so \`dev\` is not found.
- Printing *not found* inside the loop for every non-matching player.
- Skipping blank lines isn't needed for this file, but checking for them makes your program robust to a trailing blank line.`
  },
  {
    id: "csv-form-filter",
    title: "Filter a CSV file",
    topic: "2.1",
    difficulty: 2,
    task: `The file \`students.csv\` has a header line followed by one student per line:

\`\`\`text
name,form,mark
Ana,12A,72
Ben,12B,45
Cara,12A,49
...
\`\`\`

Write a program that asks for a form (prompt \`Enter a form: \`), converts it to upper case, and then:

- if no student is in that form, outputs \`No students in form <FORM>\`
- otherwise outputs, in file order, each student in that form with a mark of **50 or more** as \`<name> (<mark>)\`, followed by \`Passed: <p> of <n>\`, where \`n\` is the number of students in the form.

The header line is not a student. The file may contain other students than the ones shown.

\`\`\`text
Enter a form: 12a
Ana (72)
Dev (50)
Passed: 2 of 3
\`\`\``,
    files: {
      "students.csv": "name,form,mark\nAna,12A,72\nBen,12B,45\nCara,12A,49\nDev,12A,50\nEve,12B,88\nFinn,13C,30\nGus,13C,12\n"
    },
    tests: [
      { name: "example from the question", input: "12a\n", expect: "Ana (72)\nDev (50)\nPassed: 2 of 3" },
      { name: "another form", input: "12B\n", expect: "Eve (88)\nPassed: 1 of 2" },
      { name: "nobody passed", input: "13C\n", expect: "Passed: 0 of 2", hidden: true },
      { name: "form that doesn't exist", input: "12z\n", expect: "No students in form 12Z", hidden: true },
      { name: "header line is not a student", input: "form\n", expect: "No students in form FORM", hidden: true },
      { name: "empty input", input: "\n", expect: "No students in form ", hidden: true }
    ],
    hints: [
      "Read the first line with `f.readline()` (and ignore it) before looping over the rest, or skip the line where the index is 0.",
      "For each line: `name, form, mark = line.strip().split(\",\")`. Compare `form == wanted` and `int(mark) >= 50`.",
      "Keep two counters: students in the form, and students who passed."
    ],
    solution: `wanted = input("Enter a form: ").upper()
in_form = 0
passed = 0
with open("students.csv", "r") as f:
    f.readline()
    for line in f:
        line = line.strip()
        if line != "":
            name, form, mark = line.split(",")
            if form == wanted:
                in_form = in_form + 1
                if int(mark) >= 50:
                    passed = passed + 1
                    print(name + " (" + mark + ")")

if in_form == 0:
    print("No students in form " + wanted)
else:
    print("Passed: " + str(passed) + " of " + str(in_form))
`,
    explain: `**Approach.** Skip the header, then split each line into fields and filter. This is the same idea as an SQL query: \`SELECT name, mark FROM Students WHERE form = '12A' AND mark >= 50\`.

**Why does the header matter?** If you don't skip it, typing \`form\` matches the header row, and \`int("mark")\` crashes. The hidden test checks this.

**Boundary.** "50 or more" is \`>= 50\`: Dev (50) passes and Cara (49) doesn't.

**Common mistakes:** comparing the mark as a string (\`"9" >= "50"\` is True); forgetting to convert the form to upper case; printing \`No students\` before the whole file has been read.`
  },
  {
    id: "stock-update-file",
    title: "Update a stock file",
    topic: "2.1",
    difficulty: 3,
    task: `The file \`stock.txt\` holds the stock level of each item as \`item,quantity\`, one per line:

\`\`\`text
pens,40
pencils,25
rulers,0
erasers,12
\`\`\`

Write a program that updates the stock of one item.

1. Ask for the item name (prompt \`Item: \`) and the change in stock (prompt \`Change: \`), a whole number that may be negative. If the change is not a whole number, output \`Enter a whole number\` and ask for it again.
2. If the item isn't in the file (exact match), output \`Item not found\`.
3. If the change would make the quantity negative, output \`Not enough stock\`.
4. Otherwise output \`<item> now <new quantity>\` and **rewrite** \`stock.txt\` with the new quantity, keeping every line in the same order and format.

In cases 2 and 3 the file must not change. The tests read \`stock.txt\` after your program has finished.

\`\`\`text
Item: pens
Change: -15
pens now 25
\`\`\``,
    files: {
      "stock.txt": "pens,40\npencils,25\nrulers,0\nerasers,12\n"
    },
    tests: [
      { name: "example from the question", input: "pens\n-15\n", code: "print(\"--- file ---\")\nprint(open(\"stock.txt\").read(), end=\"\")", expect: "pens now 25\n--- file ---\npens,25\npencils,25\nrulers,0\nerasers,12" },
      { name: "restock an item with 0", input: "rulers\n10\n", code: "print(\"--- file ---\")\nprint(open(\"stock.txt\").read(), end=\"\")", expect: "rulers now 10\n--- file ---\npens,40\npencils,25\nrulers,10\nerasers,12" },
      { name: "item not found", input: "staplers\n5\n", code: "print(\"--- file ---\")\nprint(open(\"stock.txt\").read(), end=\"\")", expect: "Item not found\n--- file ---\npens,40\npencils,25\nrulers,0\nerasers,12", hidden: true },
      { name: "not enough stock", input: "erasers\n-13\n", code: "print(\"--- file ---\")\nprint(open(\"stock.txt\").read(), end=\"\")", expect: "Not enough stock\n--- file ---\npens,40\npencils,25\nrulers,0\nerasers,12", hidden: true },
      { name: "exactly enough stock", input: "erasers\n-12\n", code: "print(\"--- file ---\")\nprint(open(\"stock.txt\").read(), end=\"\")", expect: "erasers now 0\n--- file ---\npens,40\npencils,25\nrulers,0\nerasers,0", hidden: true },
      { name: "change must be a whole number", input: "pencils\nlots\n2.5\n5\n", code: "print(\"--- file ---\")\nprint(open(\"stock.txt\").read(), end=\"\")", expect: "Enter a whole number\nEnter a whole number\npencils now 30\n--- file ---\npens,40\npencils,30\nrulers,0\nerasers,12", hidden: true }
    ],
    hints: [
      "You can't easily change one line in the middle of a text file. Read **all** the lines into a list, change the list, then write the whole list back with mode `\"w\"`.",
      "Store each record as `[item, quantity]`. Find the index of the matching item (or -1 if there isn't one).",
      "Only open the file for writing when the update is valid, so the file is untouched otherwise. Write each record as `item + \",\" + str(qty) + \"\\n\"`."
    ],
    solution: `records = []
with open("stock.txt", "r") as f:
    for line in f:
        line = line.strip()
        if line != "":
            item, qty = line.split(",")
            records.append([item, int(qty)])

wanted = input("Item: ")
change = None
while change is None:
    try:
        change = int(input("Change: "))
    except ValueError:
        print("Enter a whole number")

index = -1
for i in range(len(records)):
    if records[i][0] == wanted:
        index = i

if index == -1:
    print("Item not found")
elif records[index][1] + change < 0:
    print("Not enough stock")
else:
    records[index][1] = records[index][1] + change
    with open("stock.txt", "w") as f:
        for item, qty in records:
            f.write(item + "," + str(qty) + "\\n")
    print(wanted + " now " + str(records[index][1]))
`,
    explain: `**Approach.** The classic *read → modify → write back* pattern for text files: load every record into a list, change the one record in memory, then overwrite the file with all the records. Text files are sequential, so you can't just replace one line in place.

**Keep the file safe.** Validate everything (item exists, enough stock) *before* opening the file with \`"w"\`: opening for writing empties the file immediately, so an error afterwards would lose all the data.

**Boundaries.** Taking 12 from 12 leaves 0, which is allowed; 13 is not. The hidden tests check both.

**Exam link.** For large files, real systems avoid rewriting everything by using fixed-length records in a binary/random-access file, or a database (\`UPDATE Stock SET qty = qty - 15 WHERE item = 'pens'\`).`
  }
]);
