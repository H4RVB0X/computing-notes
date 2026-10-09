/* Normalisation walkthrough: UNF → 1NF → 2NF → 3NF, step by step, with keys marked and a self-check per step. */
CS.registerTool({
  id: "normalisation-walkthrough",
  title: "Normalisation walkthrough",
  section: "10",
  topic: "10.3",
  icon: "🧩",
  desc: "Step an unnormalised table through 1NF, 2NF and 3NF, seeing which dependencies are removed at each stage, with a quick question per step.",
  help:
    "Choose a **scenario**, then use **Next ▶** (or click a stage) to move from the unnormalised form to third normal form. At each stage read the explanation, look at the dependency list and answer the self-check question.\n\n" +
    "**Key:** <u>underlined</u> attributes form the **primary key**; attributes marked FK are **foreign keys**; shaded columns in UNF are a **repeating group**.\n\n" +
    "* **1NF** – no repeating groups; every field holds one atomic value; there is a primary key (often composite).\n" +
    "* **2NF** – 1NF and **no partial dependencies**: no non-key attribute depends on only *part* of a composite key.\n" +
    "* **3NF** – 2NF and **no transitive (non-key) dependencies**: no non-key attribute depends on another non-key attribute.\n\n" +
    "Exam slogan: every non-key attribute depends on *the key, the whole key and nothing but the key*.",
  mount(el, params) {
    const h = CS.util.el;
    const esc = CS.util.esc;
    // column spec: *Name = primary key part, Name^ = foreign key, ~Name = repeating group
    const T = (name, spec, rows, isNew) => ({ name, cols: spec.split(",").map((s) => s.trim()).map((s) => ({ n: s.replace(/^[*~]+|\^$/g, ""), pk: s.includes("*"), fk: s.endsWith("^"), rg: s.startsWith("~") })), rows, isNew });
    const SCEN = {
      school: {
        title: "School: students and courses",
        story: "A school keeps a paper record for each student listing the courses they take, who teaches each course and the grade achieved.",
        stages: [
          {
            nf: "UNF",
            tables: [T("StudentCourses", "*StudentID, StudentName, TutorGroup, TutorName, ~CourseID, ~CourseTitle, ~TeacherID, ~TeacherName, ~Grade", [[1, "Amir Shah", "12C", "Mr Cole", ["CS", "MA"], ["Computer Science", "Maths"], ["T1", "T2"], ["Mr Bell", "Ms Reed"], ["A", "B"]], [2, "Beth Jones", "13H", "Ms Hart", ["CS", "PH"], ["Computer Science", "Physics"], ["T1", "T3"], ["Mr Bell", "Dr Khan"], ["C", "A"]], [3, "Cara Lewis", "12C", "Mr Cole", ["MA"], ["Maths"], ["T2"], ["Ms Reed"], ["A"]]])],
            fds: [["StudentID → StudentName, TutorGroup"], ["TutorGroup → TutorName"], ["CourseID → CourseTitle, TeacherID"], ["TeacherID → TeacherName"], ["StudentID, CourseID → Grade"]],
            explain: "This is **unnormalised**: each student has a **repeating group** of course details (shaded), so one cell holds several values. A cell is not *atomic*, and StudentID alone cannot identify a single course result.",
            q: ["Why is StudentCourses not in first normal form?", ["It contains a repeating group, so some fields are not atomic", "It has no foreign key", "TutorName depends on TutorGroup", "Two students share a tutor group"], 0, "1NF needs atomic values and no repeating groups. The other facts are about 2NF/3NF or are not problems."],
          },
          {
            nf: "1NF",
            tables: [T("StudentCourse", "*StudentID, *CourseID, StudentName, TutorGroup, TutorName, CourseTitle, TeacherID, TeacherName, Grade", [[1, "CS", "Amir Shah", "12C", "Mr Cole", "Computer Science", "T1", "Mr Bell", "A"], [1, "MA", "Amir Shah", "12C", "Mr Cole", "Maths", "T2", "Ms Reed", "B"], [2, "CS", "Beth Jones", "13H", "Ms Hart", "Computer Science", "T1", "Mr Bell", "C"], [2, "PH", "Beth Jones", "13H", "Ms Hart", "Physics", "T3", "Dr Khan", "A"], [3, "MA", "Cara Lewis", "12C", "Mr Cole", "Maths", "T2", "Ms Reed", "A"]], true)],
            fds: [["StudentID → StudentName, TutorGroup, TutorName", "partial"], ["CourseID → CourseTitle, TeacherID, TeacherName", "partial"], ["StudentID, CourseID → Grade"], ["TutorGroup → TutorName"], ["TeacherID → TeacherName"]],
            explain: "Remove the repeating group by giving each student–course pair its **own row**. Neither StudentID nor CourseID is unique on its own, so the primary key is the **composite key (StudentID, CourseID)**. Every value is now atomic, so the table is in **1NF** – but look at the redundancy: Amir's name, tutor group and tutor are stored twice, and 'Computer Science' is stored twice. Changing one copy and not the other is an **update anomaly**.",
            q: ["What is the primary key of the 1NF table?", ["StudentID", "CourseID", "(StudentID, CourseID)", "(StudentID, Grade)"], 2, "A student takes many courses and a course has many students, so you need both attributes together to identify one row."],
          },
          {
            nf: "2NF",
            tables: [T("Student", "*StudentID, StudentName, TutorGroup, TutorName", [[1, "Amir Shah", "12C", "Mr Cole"], [2, "Beth Jones", "13H", "Ms Hart"], [3, "Cara Lewis", "12C", "Mr Cole"]], true), T("Course", "*CourseID, CourseTitle, TeacherID, TeacherName", [["CS", "Computer Science", "T1", "Mr Bell"], ["MA", "Maths", "T2", "Ms Reed"], ["PH", "Physics", "T3", "Dr Khan"]], true), T("Enrolment", "*StudentID^, *CourseID^, Grade", [[1, "CS", "A"], [1, "MA", "B"], [2, "CS", "C"], [2, "PH", "A"], [3, "MA", "A"]], true)],
            fds: [["StudentID → StudentName, TutorGroup, TutorName"], ["CourseID → CourseTitle, TeacherID, TeacherName"], ["StudentID, CourseID → Grade"], ["TutorGroup → TutorName", "transitive"], ["TeacherID → TeacherName", "transitive"]],
            explain: "The 1NF table had **partial dependencies**: StudentName, TutorGroup and TutorName depend on only *part* of the key (StudentID); CourseTitle, TeacherID and TeacherName depend only on CourseID. Move each group into its own table with that part of the key as its primary key. Only **Grade** depends on the **whole** key, so it stays in Enrolment, whose key parts are now also **foreign keys**. Every table is in **2NF**.",
            q: ["Which attribute depends on the WHOLE composite key (StudentID, CourseID)?", ["StudentName", "CourseTitle", "Grade", "TeacherName"], 2, "A grade belongs to one student on one course. The others depend on just one part of the key – partial dependencies."],
          },
          {
            nf: "3NF",
            tables: [T("Student", "*StudentID, StudentName, TutorGroup^", [[1, "Amir Shah", "12C"], [2, "Beth Jones", "13H"], [3, "Cara Lewis", "12C"]]), T("TutorGroup", "*TutorGroup, TutorName", [["12C", "Mr Cole"], ["13H", "Ms Hart"]], true), T("Course", "*CourseID, CourseTitle, TeacherID^", [["CS", "Computer Science", "T1"], ["MA", "Maths", "T2"], ["PH", "Physics", "T3"]]), T("Teacher", "*TeacherID, TeacherName", [["T1", "Mr Bell"], ["T2", "Ms Reed"], ["T3", "Dr Khan"]], true), T("Enrolment", "*StudentID^, *CourseID^, Grade", [[1, "CS", "A"], [1, "MA", "B"], [2, "CS", "C"], [2, "PH", "A"], [3, "MA", "A"]])],
            fds: [["StudentID → StudentName, TutorGroup"], ["TutorGroup → TutorName"], ["CourseID → CourseTitle, TeacherID"], ["TeacherID → TeacherName"], ["StudentID, CourseID → Grade"]],
            explain: "Student still had a **transitive dependency**: StudentID → TutorGroup → TutorName, so TutorName depends on a **non-key** attribute. Likewise CourseID → TeacherID → TeacherName. Move TutorName out with TutorGroup as the key, and TeacherName out with TeacherID as the key; TutorGroup and TeacherID stay behind as **foreign keys**. Now every non-key attribute depends on *the key, the whole key and nothing but the key*: the database is in **3NF**, and each fact is stored exactly once.",
            q: ["Why was TutorName moved out of the Student table?", ["It depended on TutorGroup, a non-key attribute (a transitive dependency)", "It depended on only part of a composite key", "It was a repeating group", "Names always need their own table"], 0, "That is the definition of a transitive (non-key) dependency, which 3NF removes."],
          },
        ],
      },
      orders: {
        title: "Shop: customer orders",
        story: "An online shop's order form shows the order number and date, the customer, and a list of products ordered with their price and quantity.",
        stages: [
          {
            nf: "UNF",
            tables: [T("Order", "*OrderNo, OrderDate, CustomerID, CustomerName, CustomerTown, ~ProductID, ~Description, ~UnitPrice, ~Quantity", [[1001, "2024-03-01", "C7", "Gill Ray", "Leeds", ["P1", "P4"], ["USB cable", "Mouse"], ["4.99", "12.50"], [2, 1]], [1002, "2024-03-02", "C9", "Tom Ash", "York", ["P4"], ["Mouse"], ["12.50"], [3]], [1003, "2024-03-02", "C7", "Gill Ray", "Leeds", ["P2", "P1", "P3"], ["Keyboard", "USB cable", "Monitor"], ["24.00", "4.99", "119.00"], [1, 4, 1]]])],
            fds: [["OrderNo → OrderDate, CustomerID"], ["CustomerID → CustomerName, CustomerTown"], ["ProductID → Description, UnitPrice"], ["OrderNo, ProductID → Quantity"]],
            explain: "One order contains **many products**, so the product details form a **repeating group** (shaded). The order form is unnormalised.",
            q: ["When the repeating group is removed (one row per order line), how many rows will the 1NF table have?", ["3", "5", "6", "9"], 2, "Count the order lines: order 1001 has 2 products, 1002 has 1 and 1003 has 3 – six rows."],
          },
          {
            nf: "1NF",
            tables: [T("OrderLine", "*OrderNo, *ProductID, OrderDate, CustomerID, CustomerName, CustomerTown, Description, UnitPrice, Quantity", [[1001, "P1", "2024-03-01", "C7", "Gill Ray", "Leeds", "USB cable", "4.99", 2], [1001, "P4", "2024-03-01", "C7", "Gill Ray", "Leeds", "Mouse", "12.50", 1], [1002, "P4", "2024-03-02", "C9", "Tom Ash", "York", "Mouse", "12.50", 3], [1003, "P2", "2024-03-02", "C7", "Gill Ray", "Leeds", "Keyboard", "24.00", 1], [1003, "P1", "2024-03-02", "C7", "Gill Ray", "Leeds", "USB cable", "4.99", 4], [1003, "P3", "2024-03-02", "C7", "Gill Ray", "Leeds", "Monitor", "119.00", 1]], true)],
            fds: [["OrderNo → OrderDate, CustomerID, CustomerName, CustomerTown", "partial"], ["ProductID → Description, UnitPrice", "partial"], ["OrderNo, ProductID → Quantity"], ["CustomerID → CustomerName, CustomerTown"]],
            explain: "Each order line is now a separate row with atomic values, identified by the **composite key (OrderNo, ProductID)**. It is in **1NF**, but the price of a USB cable and Gill Ray's details are repeated – a recipe for **update**, **insertion** (can't add a product nobody has ordered) and **deletion** (deleting order 1002 loses Tom Ash) **anomalies**.",
            q: ["Which of these is an update anomaly in the 1NF table?", ["Changing the price of a USB cable means changing it in several rows", "Every row has an OrderNo", "Quantity is stored as a number", "Order 1002 contains only one product"], 0, "If one copy of the price is missed, the data becomes inconsistent – an update anomaly."],
          },
          {
            nf: "2NF",
            tables: [T("Order", "*OrderNo, OrderDate, CustomerID, CustomerName, CustomerTown", [[1001, "2024-03-01", "C7", "Gill Ray", "Leeds"], [1002, "2024-03-02", "C9", "Tom Ash", "York"], [1003, "2024-03-02", "C7", "Gill Ray", "Leeds"]], true), T("Product", "*ProductID, Description, UnitPrice", [["P1", "USB cable", "4.99"], ["P2", "Keyboard", "24.00"], ["P3", "Monitor", "119.00"], ["P4", "Mouse", "12.50"]], true), T("OrderLine", "*OrderNo^, *ProductID^, Quantity", [[1001, "P1", 2], [1001, "P4", 1], [1002, "P4", 3], [1003, "P2", 1], [1003, "P1", 4], [1003, "P3", 1]], true)],
            fds: [["OrderNo → OrderDate, CustomerID"], ["CustomerID → CustomerName, CustomerTown", "transitive"], ["ProductID → Description, UnitPrice"], ["OrderNo, ProductID → Quantity"]],
            explain: "Remove the **partial dependencies**: the order details depend only on OrderNo and the product details only on ProductID, so each moves to its own table. **Quantity** depends on the whole key and stays in OrderLine. All three tables are in **2NF**.",
            q: ["Description depends on ProductID only, which is part of the key (OrderNo, ProductID). This is called a…", ["partial dependency", "transitive dependency", "repeating group", "composite key"], 0, "A non-key attribute depending on part of a composite key is a partial dependency – removed in 2NF."],
          },
          {
            nf: "3NF",
            tables: [T("Order", "*OrderNo, OrderDate, CustomerID^", [[1001, "2024-03-01", "C7"], [1002, "2024-03-02", "C9"], [1003, "2024-03-02", "C7"]]), T("Customer", "*CustomerID, CustomerName, CustomerTown", [["C7", "Gill Ray", "Leeds"], ["C9", "Tom Ash", "York"]], true), T("Product", "*ProductID, Description, UnitPrice", [["P1", "USB cable", "4.99"], ["P2", "Keyboard", "24.00"], ["P3", "Monitor", "119.00"], ["P4", "Mouse", "12.50"]]), T("OrderLine", "*OrderNo^, *ProductID^, Quantity", [[1001, "P1", 2], [1001, "P4", 1], [1002, "P4", 3], [1003, "P2", 1], [1003, "P1", 4], [1003, "P3", 1]])],
            fds: [["OrderNo → OrderDate, CustomerID"], ["CustomerID → CustomerName, CustomerTown"], ["ProductID → Description, UnitPrice"], ["OrderNo, ProductID → Quantity"]],
            explain: "Order had a **transitive dependency**: OrderNo → CustomerID → CustomerName, CustomerTown. The customer details depend on CustomerID, a non-key attribute, so they move to a **Customer** table and CustomerID stays in Order as a **foreign key**. All four tables are now in **3NF**.",
            q: ["In the 2NF Order table, which dependency was transitive?", ["OrderNo → CustomerID → CustomerName", "OrderNo → OrderDate", "(OrderNo, ProductID) → Quantity", "ProductID → UnitPrice"], 0, "CustomerName depends on CustomerID, which is not the key of Order."],
          },
        ],
      },
      vet: {
        title: "Vet practice: pet visits",
        story: "A vet's paper card for each pet records the owner and a list of appointments: date, vet, reason and fee. (This leads to the database used on the SQL page.)",
        stages: [
          {
            nf: "UNF",
            tables: [T("PetCard", "*PetID, PetName, Species, OwnerID, OwnerSurname, OwnerTown, ~ApptDate, ~VetID, ~VetName, ~Reason, ~Fee", [[101, "Biscuit", "Dog", 1, "Khan", "Leeds", ["2024-01-15", "2024-03-01"], ["V1", "V3"], ["Dr Lee", "Dr Marsh"], ["Vaccination", "Operation"], ["45.00", "250.00"]], [103, "Rex", "Dog", 2, "Patel", "York", ["2024-01-15", "2024-04-20"], ["V3", "V1"], ["Dr Marsh", "Dr Lee"], ["X-ray", "Vaccination"], ["120.00", "45.00"]], [102, "Luna", "Cat", 1, "Khan", "Leeds", ["2024-02-02"], ["V1"], ["Dr Lee"], ["Check-up"], ["30.00"]]])],
            fds: [["PetID → PetName, Species, OwnerID"], ["OwnerID → OwnerSurname, OwnerTown"], ["VetID → VetName"], ["PetID, ApptDate → VetID, Reason, Fee"]],
            explain: "Each pet card has a **repeating group** of appointments (shaded). Assume a pet is seen at most once per day, so an appointment is identified by the pet and the date.",
            q: ["Which attributes form the repeating group?", ["ApptDate, VetID, VetName, Reason, Fee", "PetID, PetName, Species", "OwnerID, OwnerSurname, OwnerTown", "PetID and OwnerID"], 0, "These five values occur once per appointment, i.e. several times per pet."],
          },
          {
            nf: "1NF",
            tables: [T("Visit", "*PetID, *ApptDate, PetName, Species, OwnerID, OwnerSurname, OwnerTown, VetID, VetName, Reason, Fee", [[101, "2024-01-15", "Biscuit", "Dog", 1, "Khan", "Leeds", "V1", "Dr Lee", "Vaccination", "45.00"], [101, "2024-03-01", "Biscuit", "Dog", 1, "Khan", "Leeds", "V3", "Dr Marsh", "Operation", "250.00"], [103, "2024-01-15", "Rex", "Dog", 2, "Patel", "York", "V3", "Dr Marsh", "X-ray", "120.00"], [103, "2024-04-20", "Rex", "Dog", 2, "Patel", "York", "V1", "Dr Lee", "Vaccination", "45.00"], [102, "2024-02-02", "Luna", "Cat", 1, "Khan", "Leeds", "V1", "Dr Lee", "Check-up", "30.00"]], true)],
            fds: [["PetID → PetName, Species, OwnerID, OwnerSurname, OwnerTown", "partial"], ["PetID, ApptDate → VetID, VetName, Reason, Fee"], ["OwnerID → OwnerSurname, OwnerTown"], ["VetID → VetName"]],
            explain: "One row per appointment, with the **composite key (PetID, ApptDate)**. The table is in **1NF**.",
            q: ["Which attributes are only partially dependent on the key (PetID, ApptDate)?", ["PetName, Species, OwnerID, OwnerSurname, OwnerTown", "Reason and Fee", "VetID and VetName", "None – the table is already in 2NF"], 0, "The pet and owner details depend on PetID alone."],
          },
          {
            nf: "2NF",
            tables: [T("Pet", "*PetID, PetName, Species, OwnerID, OwnerSurname, OwnerTown", [[101, "Biscuit", "Dog", 1, "Khan", "Leeds"], [102, "Luna", "Cat", 1, "Khan", "Leeds"], [103, "Rex", "Dog", 2, "Patel", "York"]], true), T("Appointment", "*PetID^, *ApptDate, VetID, VetName, Reason, Fee", [[101, "2024-01-15", "V1", "Dr Lee", "Vaccination", "45.00"], [101, "2024-03-01", "V3", "Dr Marsh", "Operation", "250.00"], [103, "2024-01-15", "V3", "Dr Marsh", "X-ray", "120.00"], [103, "2024-04-20", "V1", "Dr Lee", "Vaccination", "45.00"], [102, "2024-02-02", "V1", "Dr Lee", "Check-up", "30.00"]], true)],
            fds: [["PetID → PetName, Species, OwnerID"], ["OwnerID → OwnerSurname, OwnerTown", "transitive"], ["PetID, ApptDate → VetID, Reason, Fee"], ["VetID → VetName", "transitive"]],
            explain: "The pet and owner details moved to **Pet** (key PetID). Appointment keeps the attributes that depend on the **whole** key. Both tables are in **2NF**, but there are still **two transitive dependencies** (highlighted).",
            q: ["Which is a transitive dependency in the Appointment table?", ["(PetID, ApptDate) → VetID → VetName", "(PetID, ApptDate) → Fee", "PetID → PetName", "ApptDate → Reason"], 0, "VetName depends on VetID, a non-key attribute."],
          },
          {
            nf: "3NF",
            tables: [T("Owner", "*OwnerID, OwnerSurname, OwnerTown", [[1, "Khan", "Leeds"], [2, "Patel", "York"]], true), T("Pet", "*PetID, PetName, Species, OwnerID^", [[101, "Biscuit", "Dog", 1], [102, "Luna", "Cat", 1], [103, "Rex", "Dog", 2]]), T("Vet", "*VetID, VetName", [["V1", "Dr Lee"], ["V3", "Dr Marsh"]], true), T("Appointment", "*PetID^, *ApptDate, VetID^, Reason, Fee", [[101, "2024-01-15", "V1", "Vaccination", "45.00"], [101, "2024-03-01", "V3", "Operation", "250.00"], [103, "2024-01-15", "V3", "X-ray", "120.00"], [103, "2024-04-20", "V1", "Vaccination", "45.00"], [102, "2024-02-02", "V1", "Check-up", "30.00"]])],
            fds: [["OwnerID → OwnerSurname, OwnerTown"], ["PetID → PetName, Species, OwnerID"], ["VetID → VetName"], ["PetID, ApptDate → VetID, Reason, Fee"]],
            explain: "Owner details move to **Owner** and VetName moves to **Vet**; OwnerID and VetID remain as **foreign keys**. The result is in **3NF** and matches the vet database on the SQL page (which adds a simple surrogate key, ApptID, to Appointment).",
            q: ["After normalising to 3NF, how many times is Dr Lee's name stored?", ["Once", "Twice", "Three times", "Once per appointment"], 0, "In 3NF each fact is stored once: VetName appears only in the Vet table."],
          },
        ],
      },
    };
    const NFS = ["UNF", "1NF", "2NF", "3NF"];
    let scen = SCEN[params.scenario] ? params.scenario : "school",
      stage = 0;
    const answers = {};

    const scenSel = h("select", { "aria-label": "Scenario" });
    Object.keys(SCEN).forEach((k) => scenSel.appendChild(h("option", { value: k, text: SCEN[k].title })));
    scenSel.value = scen;
    const prevBtn = h("button", { class: "btn sm", type: "button", text: "◀ Previous" });
    const nextBtn = h("button", { class: "btn sm primary", type: "button", text: "Next ▶" });
    const pills = h("div", { class: "controls", style: "gap:4px" });
    const score = h("span", { class: "pill" });
    const story = h("p", { class: "explain", style: "margin-top:0" });
    const explain = h("div", { class: "explain", style: "font-size:0.92rem;color:var(--text);background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:10px 14px" });
    const fdBox = h("div", { style: "margin-top:10px" });
    const tablesBox = h("div", { style: "margin-top:12px" });
    const quiz = h("div", { class: "card", style: "margin-top:12px;padding:12px 14px" });
    el.append(h("div", { class: "controls" }, [scenSel, prevBtn, nextBtn, score]), pills, story, explain, fdBox, tablesBox, quiz, h("div", { class: "legend" }, [h("span", { html: "<u><b>Key</b></u> primary key" }), h("span", { html: "<i>Attr</i><sup>FK</sup> foreign key" }), h("span", { html: "<i style='background:var(--warn-soft);border:1px solid var(--warn)'></i>repeating group" }), h("span", { html: "<i style='background:var(--accent-soft);border:1px solid var(--accent)'></i>new table at this step" })]));

    const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
    function colHead(c) {
      const t = esc(c.n);
      return (c.pk ? "<u><b>" + t + "</b></u>" : c.fk ? "<i>" + t + "</i>" : t) + (c.fk ? "<sup>FK</sup>" : "");
    }
    function render() {
      const S = SCEN[scen],
        st = S.stages[stage];
      pills.innerHTML = "";
      NFS.forEach((nf, k) => {
        const b = h("button", { class: "btn sm" + (k === stage ? " primary" : ""), type: "button", text: nf + (answers[scen + k] != null ? (answers[scen + k] ? " ✓" : " ✗") : ""), "aria-current": k === stage ? "step" : null });
        b.addEventListener("click", () => ((stage = k), render()));
        pills.appendChild(b);
        if (k < 3) pills.appendChild(h("span", { "aria-hidden": "true", style: "color:var(--text-3)", text: "→" }));
      });
      prevBtn.disabled = stage === 0;
      nextBtn.disabled = stage === 3;
      story.textContent = S.story;
      explain.innerHTML = "<b>" + st.nf + ":</b> " + md(st.explain);
      // dependencies
      fdBox.innerHTML = "<div class='bit-label' style='text-align:left'>Functional dependencies (A → B means A determines B)</div>";
      const ul = h("ul", { style: "margin:4px 0;padding-left:1.2em;font-family:var(--font-mono);font-size:0.85rem" });
      st.fds.forEach(([fd, kind]) => ul.appendChild(h("li", { html: esc(fd) + (kind ? " <span class='pill " + (kind === "partial" ? "warn" : "bad") + "'>" + kind + " dependency – removed in " + (kind === "partial" ? "2NF" : "3NF") + "</span>" : "") })));
      fdBox.appendChild(ul);
      // tables
      tablesBox.innerHTML = "";
      tablesBox.appendChild(h("div", { class: "bit-label", style: "text-align:left", text: st.tables.length + " table" + (st.tables.length > 1 ? "s" : "") + " in " + st.nf + ": " + st.tables.map((t) => t.name + "(" + t.cols.map((c) => (c.pk ? "_" + c.n + "_" : c.n) + (c.fk ? "*" : "")).join(", ") + ")").join("  ") }));
      st.tables.forEach((t) => {
        const box = h("div", { class: "norm-table", style: "margin:8px 0 12px;" + (t.isNew && stage > 0 ? "border-left:4px solid var(--accent);padding-left:8px" : "") });
        box.appendChild(h("div", { style: "font-weight:700;margin-bottom:4px", html: esc(t.name) + (t.isNew && stage > 0 ? " <span class='pill' style='background:var(--accent-soft);color:var(--accent)'>new</span>" : "") + " <span class='mono' style='font-weight:400;font-size:0.82rem;color:var(--text-2)'>(" + t.cols.map(colHead).join(", ") + ")</span>" }));
        const wrap = h("div", { class: "table-wrap", style: "margin:0" });
        const rgStyle = "background:var(--warn-soft)";
        let html = "<table style='width:100%;border-collapse:collapse'><thead><tr>" + t.cols.map((c) => "<th style='text-transform:none;letter-spacing:0;" + (c.rg ? rgStyle : "") + "'>" + colHead(c) + "</th>").join("") + "</tr></thead><tbody>";
        t.rows.forEach((r) => (html += "<tr>" + r.map((v, k) => "<td class='mono' style='white-space:nowrap;vertical-align:top;" + (t.cols[k].rg ? rgStyle : "") + "'>" + (Array.isArray(v) ? v.map(esc).join("<br>") : esc(v)) + "</td>").join("") + "</tr>"));
        wrap.innerHTML = html + "</tbody></table>";
        box.appendChild(wrap);
        tablesBox.appendChild(box);
      });
      // quiz
      const [qt, opts, ans, why] = st.q;
      quiz.innerHTML = "";
      quiz.appendChild(h("div", { style: "font-weight:700;margin-bottom:6px", text: "Quick check: " + qt }));
      const fb = h("div", { style: "margin-top:6px;min-height:1.2em" });
      const prev = answers[scen + stage];
      opts.forEach((o, k) => {
        const b = h("button", { class: "btn sm", type: "button", text: o, style: "display:flex;width:100%;white-space:normal;text-align:left;margin:4px 0;justify-content:flex-start" });
        b.addEventListener("click", () => {
          answers[scen + stage] = k === ans;
          Array.from(quiz.querySelectorAll("button")).forEach((x, j) => {
            x.disabled = true;
            x.style.borderColor = j === ans ? "var(--ok)" : j === k ? "var(--bad)" : "";
          });
          fb.className = k === ans ? "ok-text" : "err";
          fb.textContent = (k === ans ? "✓ Correct. " : "✗ Not quite. ") + why;
          updateScore();
          render.pills && render.pills();
          pills.querySelectorAll("button")[stage].textContent = NFS[stage] + (k === ans ? " ✓" : " ✗");
        });
        quiz.appendChild(b);
      });
      quiz.appendChild(fb);
      if (prev != null) {
        Array.from(quiz.querySelectorAll("button")).forEach((x, j) => ((x.disabled = true), (x.style.borderColor = j === ans ? "var(--ok)" : "")));
        fb.className = prev ? "ok-text" : "err";
        fb.textContent = (prev ? "✓ You answered this correctly. " : "✗ You got this one wrong. ") + why;
      }
      updateScore();
    }
    function updateScore() {
      let c = 0,
        n = 0;
      for (let k = 0; k < 4; k++)
        if (answers[scen + k] != null) {
          n++;
          if (answers[scen + k]) c++;
        }
      score.textContent = "Self-check: " + c + "/" + n + " correct";
    }
    prevBtn.addEventListener("click", () => stage > 0 && (stage--, render()));
    nextBtn.addEventListener("click", () => stage < 3 && (stage++, render()));
    scenSel.addEventListener("change", () => {
      scen = scenSel.value;
      stage = 0;
      render();
    });
    render();
  },
});
