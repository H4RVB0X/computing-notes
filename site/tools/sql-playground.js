/* SQL playground: a small in-browser SQL engine (no libraries) over sample databases. */
CS.registerTool({
  id: "sql-playground",
  title: "SQL playground",
  section: "10",
  topic: "10.4",
  icon: "🗃️",
  desc: "Run SELECT, INSERT, UPDATE, DELETE and CREATE TABLE on a sample database, including joins, LIKE/IN/BETWEEN and GROUP BY.",
  help:
    "Type SQL (or pick an **example**) and press **Run** (or Ctrl+Enter). Several statements separated by `;` run in order. **Reset database** puts the sample data back.\n\n" +
    "**Supported:** `SELECT [DISTINCT] … FROM … WHERE … GROUP BY … HAVING … ORDER BY … ASC/DESC`, joins written as `FROM A, B WHERE A.x = B.x` or `INNER JOIN … ON …`, comparisons `= <> < > <= >=`, `AND / OR / NOT`, `LIKE` (`%` any characters, `_` exactly one), `BETWEEN … AND …`, `IN (…)`, `IS NULL`, arithmetic, `COUNT(*) COUNT SUM AVG MIN MAX`; `INSERT INTO … VALUES`, `UPDATE … SET … WHERE`, `DELETE FROM … WHERE`, `CREATE TABLE` (data types, `PRIMARY KEY`, `NOT NULL`, `FOREIGN KEY … REFERENCES`), `ALTER TABLE … ADD / DROP COLUMN` and `DROP TABLE`.\n\n" +
    "This engine **enforces referential integrity** (like SQLite with foreign keys switched on): you cannot add a Pet for an owner who does not exist, or delete an owner who still has pets. Primary keys must be unique and not null.\n\n" +
    "Things to notice: forgetting the join condition in `FROM Owner, Pet` gives every combination of rows (a Cartesian product); an `UPDATE` or `DELETE` without `WHERE` changes **every** row; text values need quotes, numbers do not.",
  mount(el, params) {
    const h = CS.util.el;
    // ---- SEEDS:BEGIN ----
    const SEEDS = {
      vet: `CREATE TABLE Owner (OwnerID INTEGER, Surname VARCHAR(30) NOT NULL, Forename VARCHAR(30), Town VARCHAR(30), Phone VARCHAR(15), PRIMARY KEY (OwnerID));
INSERT INTO Owner VALUES (1,'Khan','Aisha','Leeds','0113 496 0123'),(2,'Patel','Rohan','York','01904 496 0456'),(3,'Brown','Chloe','Leeds','0113 496 0789'),(4,'Nolan','Sean','Harrogate','01423 496 0321'),(5,'Woods','Emma','York','01904 496 0654');
CREATE TABLE Pet (PetID INTEGER, Name VARCHAR(30), Species VARCHAR(20), DateOfBirth DATE, OwnerID INTEGER, PRIMARY KEY (PetID), FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID));
INSERT INTO Pet VALUES (101,'Biscuit','Dog','2019-03-12',1),(102,'Luna','Cat','2021-07-30',1),(103,'Rex','Dog','2016-11-02',2),(104,'Pepper','Rabbit','2022-05-19',3),(105,'Mabel','Cat','2018-01-25',4),(106,'Shadow','Dog','2020-09-08',5),(107,'Nibbles','Hamster','2023-02-14',3);
CREATE TABLE Vet (VetID CHAR(2), VetName VARCHAR(30), Specialism VARCHAR(30), PRIMARY KEY (VetID));
INSERT INTO Vet VALUES ('V1','Dr Lee','Small animals'),('V2','Dr Adeyemi','Exotic pets'),('V3','Dr Marsh','Surgery');
CREATE TABLE Appointment (ApptID INTEGER, PetID INTEGER, VetID CHAR(2), ApptDate DATE, Reason VARCHAR(40), Fee DECIMAL(6,2), PRIMARY KEY (ApptID), FOREIGN KEY (PetID) REFERENCES Pet(PetID), FOREIGN KEY (VetID) REFERENCES Vet(VetID));
INSERT INTO Appointment VALUES (1,101,'V1','2024-01-15','Vaccination',45.00),(2,103,'V3','2024-01-15','X-ray',120.00),(3,102,'V1','2024-02-02','Check-up',30.00),(4,104,'V2','2024-02-10','Dental',55.00),(5,101,'V3','2024-03-01','Operation',250.00),(6,106,'V1','2024-03-01','Vaccination',45.00),(7,105,'V1','2024-03-14','Check-up',30.00),(8,107,'V2','2024-04-02','Check-up',25.00),(9,103,'V1','2024-04-20','Vaccination',45.00);`,
      school: `CREATE TABLE Student (StudentID INTEGER, Forename VARCHAR(20), Surname VARCHAR(20), YearGroup INTEGER, Tutor VARCHAR(20), PRIMARY KEY (StudentID));
INSERT INTO Student VALUES (1,'Amir','Shah',12,'Mr Cole'),(2,'Beth','Jones',13,'Ms Hart'),(3,'Cara','Lewis',12,'Mr Cole'),(4,'Dan','Okafor',13,'Ms Hart'),(5,'Ella','Price',12,'Mrs Ito');
CREATE TABLE Course (CourseID CHAR(2), Title VARCHAR(30), Teacher VARCHAR(20), Room VARCHAR(4), PRIMARY KEY (CourseID));
INSERT INTO Course VALUES ('CS','Computer Science','Mr Bell','B12'),('MA','Maths','Ms Reed','A04'),('PH','Physics','Dr Khan','C01'),('EN','English','Mr Ford','A10');
CREATE TABLE Enrolment (StudentID INTEGER, CourseID CHAR(2), Grade CHAR(1), PRIMARY KEY (StudentID, CourseID), FOREIGN KEY (StudentID) REFERENCES Student(StudentID), FOREIGN KEY (CourseID) REFERENCES Course(CourseID));
INSERT INTO Enrolment VALUES (1,'CS','A'),(1,'MA','B'),(2,'CS','C'),(2,'PH','A'),(3,'MA','A'),(3,'EN','B'),(4,'CS','B'),(4,'MA','C'),(5,'PH','B');`,
    };
    // ---- SEEDS:END ----
    const EXAMPLES = {
      vet: [
        ["All pets", "SELECT * FROM Pet;"],
        ["WHERE + ORDER BY", "SELECT Name, Species, DateOfBirth\nFROM Pet\nWHERE Species = 'Dog'\nORDER BY DateOfBirth DESC;"],
        ["AND / OR / NOT", "SELECT Surname, Town FROM Owner\nWHERE (Town = 'Leeds' OR Town = 'York') AND NOT Surname = 'Khan';"],
        ["LIKE wildcards", "SELECT Name FROM Pet WHERE Name LIKE '_e%';"],
        ["BETWEEN and IN", "SELECT ApptID, Reason, Fee FROM Appointment\nWHERE Fee BETWEEN 30 AND 60 AND VetID IN ('V1', 'V2');"],
        ["Join with WHERE", "SELECT Owner.Surname, Pet.Name\nFROM Owner, Pet\nWHERE Owner.OwnerID = Pet.OwnerID AND Owner.Town = 'Leeds'\nORDER BY Owner.Surname, Pet.Name;"],
        ["INNER JOIN … ON", "SELECT Owner.Surname, Pet.Name\nFROM Owner\nINNER JOIN Pet ON Owner.OwnerID = Pet.OwnerID\nWHERE Owner.Town = 'Leeds'\nORDER BY Owner.Surname, Pet.Name;"],
        ["Three-table join", "SELECT Pet.Name, Vet.VetName, Appointment.ApptDate, Appointment.Fee\nFROM Pet, Appointment, Vet\nWHERE Pet.PetID = Appointment.PetID AND Vet.VetID = Appointment.VetID\nORDER BY Appointment.ApptDate;"],
        ["GROUP BY + COUNT", "SELECT Species, COUNT(*) AS NumPets\nFROM Pet\nGROUP BY Species\nORDER BY NumPets DESC, Species;"],
        ["SUM / AVG / MAX", "SELECT VetID, COUNT(*), SUM(Fee), AVG(Fee), MAX(Fee)\nFROM Appointment\nGROUP BY VetID;"],
        ["Cartesian product (missing join!)", "SELECT Owner.Surname, Pet.Name FROM Owner, Pet;"],
        ["INSERT INTO", "INSERT INTO Pet (PetID, Name, Species, DateOfBirth, OwnerID)\nVALUES (108, 'Ziggy', 'Cat', '2024-06-01', 2);"],
        ["INSERT breaking a foreign key", "INSERT INTO Pet VALUES (109, 'Ghost', 'Dog', '2024-01-01', 99);"],
        ["UPDATE … SET … WHERE", "UPDATE Appointment\nSET Fee = Fee * 1.1\nWHERE Reason = 'Vaccination';"],
        ["DELETE FROM … WHERE", "DELETE FROM Appointment WHERE ApptDate < '2024-02-01';"],
        ["CREATE TABLE", "CREATE TABLE Medicine (\n  MedID INTEGER,\n  MedName VARCHAR(40) NOT NULL,\n  Price DECIMAL(5,2),\n  PRIMARY KEY (MedID)\n);\nINSERT INTO Medicine VALUES (1, 'Wormer', 8.50);\nSELECT * FROM Medicine;"],
      ],
      school: [
        ["All students", "SELECT * FROM Student;"],
        ["Year 12, sorted", "SELECT Forename, Surname FROM Student\nWHERE YearGroup = 12\nORDER BY Surname ASC;"],
        ["Join: who takes CS?", "SELECT Student.Forename, Student.Surname, Enrolment.Grade\nFROM Student\nINNER JOIN Enrolment ON Student.StudentID = Enrolment.StudentID\nWHERE Enrolment.CourseID = 'CS';"],
        ["Three-table join", "SELECT Student.Forename, Course.Title, Enrolment.Grade\nFROM Student, Enrolment, Course\nWHERE Student.StudentID = Enrolment.StudentID AND Course.CourseID = Enrolment.CourseID\nORDER BY Student.Forename, Course.Title;"],
        ["Students per course", "SELECT Course.Title, COUNT(*) AS Students\nFROM Course INNER JOIN Enrolment ON Course.CourseID = Enrolment.CourseID\nGROUP BY Course.Title\nORDER BY Students DESC, Course.Title;"],
        ["HAVING", "SELECT StudentID, COUNT(*) AS Courses FROM Enrolment\nGROUP BY StudentID HAVING COUNT(*) >= 2;"],
        ["LIKE + IN", "SELECT * FROM Course WHERE Teacher LIKE 'M%' OR Room IN ('C01', 'A10');"],
        ["Composite key clash", "INSERT INTO Enrolment VALUES (1, 'CS', 'B');"],
        ["UPDATE a grade", "UPDATE Enrolment SET Grade = 'A' WHERE StudentID = 2 AND CourseID = 'CS';"],
      ],
    };
    const KW = new Set("SELECT DISTINCT FROM WHERE GROUP BY HAVING ORDER ASC DESC LIMIT JOIN INNER LEFT RIGHT FULL OUTER CROSS ON AS AND OR NOT LIKE IN BETWEEN IS NULL INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE PRIMARY KEY FOREIGN REFERENCES DROP ALTER ADD COLUMN UNION".split(" "));
    const TYPES = { INTEGER: "INTEGER", INT: "INTEGER", SMALLINT: "INTEGER", REAL: "REAL", FLOAT: "REAL", DOUBLE: "REAL", DECIMAL: "DECIMAL", NUMERIC: "DECIMAL", CURRENCY: "DECIMAL", VARCHAR: "VARCHAR", CHAR: "CHAR", TEXT: "TEXT", STRING: "TEXT", DATE: "DATE", TIME: "TIME", DATETIME: "DATETIME", BOOLEAN: "BOOLEAN" };
    const NUMT = new Set(["INTEGER", "REAL", "DECIMAL"]);
    class SqlErr extends Error {}
    const fail = (m) => {
      throw new SqlErr(m);
    };
    let dbName = SEEDS[params.db] ? params.db : "vet";
    let db = {};

    // ---------- tokenizer ----------
    function tokenize(src) {
      const toks = [];
      const re = /\s+|--[^\n]*|(\d+\.\d*|\.\d+|\d+)|([A-Za-z_][A-Za-z0-9_]*)|('(?:[^']|'')*'|"(?:[^"]|"")*")|(<>|!=|<=|>=|[=<>(),;.*+\-\/])/y;
      let p = 0;
      while (p < src.length) {
        re.lastIndex = p;
        const m = re.exec(src);
        if (!m) {
          const c = src[p];
          if (c === "'" || c === '"') fail("A text value is missing its closing quote.");
          fail("Unexpected character '" + c + "'.");
        }
        if (m[1]) toks.push({ k: "num", v: parseFloat(m[1]), int: !/\./.test(m[1]), s: p, e: re.lastIndex });
        else if (m[2]) toks.push({ k: "id", v: m[2], u: m[2].toUpperCase(), s: p, e: re.lastIndex });
        else if (m[3]) toks.push({ k: "str", v: m[3].slice(1, -1).replace(/''/g, "'").replace(/""/g, '"'), s: p, e: re.lastIndex });
        else if (m[4]) toks.push({ k: "op", v: m[4] === "!=" ? "<>" : m[4], s: p, e: re.lastIndex });
        p = re.lastIndex;
      }
      return toks;
    }

    // ---------- parser ----------
    function parseScript(src) {
      const toks = tokenize(src);
      let i = 0;
      const pk = (o) => toks[i + (o || 0)];
      const isKw = (w, o) => pk(o) && pk(o).k === "id" && pk(o).u === w;
      const isOp = (v, o) => pk(o) && pk(o).k === "op" && pk(o).v === v;
      const acceptKw = (w) => (isKw(w) ? (i++, true) : false);
      const acceptOp = (v) => (isOp(v) ? (i++, true) : false);
      const near = () => (pk() ? " near '" + src.slice(pk().s, pk().e) + "'" : " at the end");
      const expectKw = (w) => acceptKw(w) || fail("Expected " + w + near() + ".");
      const expectOp = (v) => acceptOp(v) || fail("Expected '" + v + "'" + near() + ".");
      const ident = (what) => {
        const t = pk();
        if (!t || t.k !== "id") fail("Expected " + what + near() + ".");
        if (KW.has(t.u)) fail("'" + t.v + "' is an SQL keyword, but a " + what + " was expected here.");
        i++;
        return t.v;
      };
      const textFrom = (s) => src.slice(toks[s].s, toks[i - 1].e).replace(/\s+/g, " ");
      // expressions
      function expr() {
        let l = andE();
        while (acceptKw("OR")) l = { t: "bin", op: "OR", l, r: andE() };
        return l;
      }
      function andE() {
        let l = notE();
        while (acceptKw("AND")) l = { t: "bin", op: "AND", l, r: notE() };
        return l;
      }
      function notE() {
        return acceptKw("NOT") ? { t: "not", e: notE() } : cmpE();
      }
      function cmpE() {
        const s = i;
        const l = addE();
        let node = l;
        const t = pk();
        if (t && t.k === "op" && ["=", "<>", "<", ">", "<=", ">="].includes(t.v)) {
          i++;
          node = { t: "bin", op: t.v, l, r: addE() };
        } else {
          const neg = isKw("NOT") && (isKw("LIKE", 1) || isKw("IN", 1) || isKw("BETWEEN", 1)) ? (i++, true) : false;
          if (acceptKw("LIKE")) node = { t: "like", e: l, pat: addE(), neg };
          else if (acceptKw("BETWEEN")) {
            const lo = addE();
            expectKw("AND");
            node = { t: "between", e: l, lo, hi: addE(), neg };
          } else if (acceptKw("IN")) {
            expectOp("(");
            if (isKw("SELECT")) fail("Sub-queries inside IN ( … ) aren't supported here – list the values instead.");
            const list = [expr()];
            while (acceptOp(",")) list.push(expr());
            expectOp(")");
            node = { t: "in", e: l, list, neg };
          } else if (acceptKw("IS")) {
            const n = acceptKw("NOT");
            expectKw("NULL");
            node = { t: "isnull", e: l, neg: n };
          }
        }
        node.text = textFrom(s);
        return node;
      }
      function addE() {
        let l = mulE();
        while (isOp("+") || isOp("-")) l = { t: "bin", op: toks[i++].v, l, r: mulE() };
        return l;
      }
      function mulE() {
        let l = unE();
        while (isOp("*") || isOp("/")) l = { t: "bin", op: toks[i++].v, l, r: unE() };
        return l;
      }
      function unE() {
        if (acceptOp("-")) return { t: "neg", e: unE() };
        return prim();
      }
      function prim() {
        const s = i;
        const t = pk();
        if (!t) fail("The statement ended too early.");
        let n;
        if (t.k === "num") (i++, (n = { t: "lit", v: t.v }));
        else if (t.k === "str") (i++, (n = { t: "lit", v: t.v }));
        else if (isOp("(")) {
          i++;
          if (isKw("SELECT")) fail("Sub-queries aren't supported in this playground.");
          n = expr();
          expectOp(")");
        } else if (isKw("NULL")) (i++, (n = { t: "lit", v: null }));
        else if (t.k === "id") {
          if (isOp("(", 1)) {
            const fn = t.u;
            i += 2;
            if (!["COUNT", "SUM", "AVG", "MIN", "MAX"].includes(fn)) fail("The function " + t.v + "() isn't supported. Aggregates: COUNT, SUM, AVG, MIN, MAX.");
            const distinct = acceptKw("DISTINCT");
            let arg = null;
            if (fn === "COUNT" && acceptOp("*")) arg = null;
            else arg = expr();
            expectOp(")");
            n = { t: "agg", fn, arg, distinct };
          } else {
            if (KW.has(t.u)) fail("Unexpected keyword " + t.u + near() + ".");
            i++;
            if (acceptOp(".")) n = { t: "col", tbl: t.v, name: ident("column name") };
            else n = { t: "col", tbl: null, name: t.v };
          }
        } else fail("Unexpected '" + t.v + "'" + near() + ".");
        n.text = textFrom(s);
        return n;
      }
      // statements
      function select() {
        expectKw("SELECT");
        const q = { type: "select", distinct: acceptKw("DISTINCT"), items: [], from: [], where: null, group: [], having: null, order: [], limit: null };
        do {
          if (acceptOp("*")) q.items.push({ star: true });
          else if (pk() && pk().k === "id" && isOp(".", 1) && isOp("*", 2)) (q.items.push({ star: true, tbl: pk().v }), (i += 3));
          else {
            const e = expr();
            let alias = null;
            if (acceptKw("AS")) alias = ident("column alias");
            else if (pk() && pk().k === "id" && !KW.has(pk().u)) alias = ident("alias");
            else if (pk() && pk().k === "str") alias = toks[i++].v;
            q.items.push({ e, alias });
          }
        } while (acceptOp(","));
        if (!acceptKw("FROM")) fail(pk() ? "Expected FROM" + near() + " – check for a missing comma between column names." : "A SELECT needs a FROM clause naming the table.");
        const tref = (on) => {
          const name = ident("table name");
          let alias = null;
          if (acceptKw("AS")) alias = ident("table alias");
          else if (pk() && pk().k === "id" && !KW.has(pk().u)) alias = ident("table alias");
          return { name, alias, on };
        };
        q.from.push(tref(null));
        for (;;) {
          if (acceptOp(",")) q.from.push(tref(null));
          else if (isKw("LEFT") || isKw("RIGHT") || isKw("FULL") || isKw("OUTER") || isKw("CROSS")) fail("Only INNER JOIN is supported (that's the join AQA expects).");
          else if (isKw("INNER") || isKw("JOIN")) {
            acceptKw("INNER");
            expectKw("JOIN");
            const r = tref(null);
            expectKw("ON");
            r.on = expr();
            q.from.push(r);
          } else break;
        }
        if (acceptKw("WHERE")) q.where = expr();
        if (acceptKw("GROUP")) {
          expectKw("BY");
          do q.group.push(expr());
          while (acceptOp(","));
        }
        if (acceptKw("HAVING")) q.having = expr();
        if (acceptKw("ORDER")) {
          expectKw("BY");
          do {
            const e = expr();
            q.order.push({ e, desc: acceptKw("DESC") ? true : (acceptKw("ASC"), false) });
          } while (acceptOp(","));
        }
        if (acceptKw("LIMIT")) {
          const t = pk();
          if (!t || t.k !== "num") fail("LIMIT needs a number.");
          i++;
          q.limit = t.v;
        }
        return q;
      }
      function colDef() {
        const name = ident("column name");
        const t = pk();
        if (!t || t.k !== "id") fail("Column " + name + " needs a data type, e.g. " + name + " VARCHAR(30).");
        if (!TYPES[t.u]) fail("Unknown data type '" + t.v + "'. Try INTEGER, REAL, DECIMAL(6,2), VARCHAR(n), CHAR(n), TEXT, DATE, TIME or BOOLEAN.");
        i++;
        let typeText = t.u;
        const base = TYPES[t.u];
        let scale = null;
        if (acceptOp("(")) {
          const a = pk();
          if (!a || a.k !== "num") fail("Expected a size in brackets after " + t.u + ".");
          i++;
          typeText += "(" + a.v;
          if (acceptOp(",")) {
            const b = pk();
            if (!b || b.k !== "num") fail("Expected a number of decimal places.");
            i++;
            typeText += "," + b.v;
            scale = b.v;
          }
          typeText += ")";
          expectOp(")");
        }
        const c = { name, type: typeText, base, scale: base === "DECIMAL" ? (scale == null ? 2 : scale) : null, pk: false, notnull: false, fk: null };
        for (;;) {
          if (acceptKw("PRIMARY")) (expectKw("KEY"), (c.pk = true));
          else if (acceptKw("NOT")) (expectKw("NULL"), (c.notnull = true));
          else if (acceptKw("REFERENCES")) {
            const rt = ident("table name");
            expectOp("(");
            c.fk = { table: rt, col: ident("column name") };
            expectOp(")");
          } else if (isKw("UNIQUE")) i++;
          else break;
        }
        return c;
      }
      function statement() {
        if (isKw("SELECT")) return select();
        if (acceptKw("INSERT")) {
          expectKw("INTO");
          const q = { type: "insert", table: ident("table name"), cols: null, rows: [] };
          if (acceptOp("(")) {
            q.cols = [ident("column name")];
            while (acceptOp(",")) q.cols.push(ident("column name"));
            expectOp(")");
          }
          if (isKw("SELECT")) fail("INSERT … SELECT isn't supported – use VALUES ( … ).");
          expectKw("VALUES");
          do {
            expectOp("(");
            const r = [expr()];
            while (acceptOp(",")) r.push(expr());
            expectOp(")");
            q.rows.push(r);
          } while (acceptOp(","));
          return q;
        }
        if (acceptKw("UPDATE")) {
          const q = { type: "update", table: ident("table name"), sets: [], where: null };
          expectKw("SET");
          do {
            const c = ident("column name");
            expectOp("=");
            q.sets.push({ col: c, e: expr() });
          } while (acceptOp(","));
          if (acceptKw("WHERE")) q.where = expr();
          return q;
        }
        if (acceptKw("DELETE")) {
          if (acceptOp("*")) fail("Write DELETE FROM Table WHERE …  (no * after DELETE).");
          expectKw("FROM");
          const q = { type: "delete", table: ident("table name"), where: null };
          if (acceptKw("WHERE")) q.where = expr();
          return q;
        }
        if (acceptKw("CREATE")) {
          expectKw("TABLE");
          const q = { type: "create", table: ident("table name"), cols: [], pk: [], fks: [] };
          expectOp("(");
          do {
            if (acceptKw("PRIMARY")) {
              expectKw("KEY");
              expectOp("(");
              do q.pk.push(ident("column name"));
              while (acceptOp(","));
              expectOp(")");
            } else if (acceptKw("FOREIGN")) {
              expectKw("KEY");
              expectOp("(");
              const col = ident("column name");
              expectOp(")");
              expectKw("REFERENCES");
              const table = ident("table name");
              expectOp("(");
              q.fks.push({ col, table, refCol: ident("column name") });
              expectOp(")");
            } else q.cols.push(colDef());
          } while (acceptOp(","));
          expectOp(")");
          return q;
        }
        if (acceptKw("DROP")) {
          expectKw("TABLE");
          return { type: "drop", table: ident("table name") };
        }
        if (acceptKw("ALTER")) {
          expectKw("TABLE");
          const table = ident("table name");
          if (acceptKw("ADD")) {
            acceptKw("COLUMN");
            return { type: "addcol", table, col: colDef() };
          }
          if (acceptKw("DROP")) {
            acceptKw("COLUMN");
            return { type: "dropcol", table, col: ident("column name") };
          }
          fail("Use ALTER TABLE … ADD column type, or ALTER TABLE … DROP COLUMN column.");
        }
        fail("Statements must start with SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER or DROP" + near() + ".");
      }
      const out = [];
      while (i < toks.length) {
        if (acceptOp(";")) continue;
        const s = toks[i].s;
        const st = statement();
        if (i < toks.length && !isOp(";")) fail("Unexpected text" + near() + " – is a comma, quote or keyword missing?");
        st.src = src.slice(s, toks[i - 1].e);
        out.push(st);
      }
      if (!out.length) fail("Type an SQL statement first.");
      return out;
    }

    // ---------- evaluation ----------
    const getTable = (name) => db[name.toLowerCase()] || fail("There is no table called '" + name + "'. Tables: " + Object.values(db).map((t) => t.name).join(", ") + ".");
    const colIdx = (t, c) => {
      const k = t.cols.findIndex((x) => x.name.toLowerCase() === c.toLowerCase());
      if (k < 0) fail("Table " + t.name + " has no column '" + c + "'. Its columns are " + t.cols.map((x) => x.name).join(", ") + ".");
      return k;
    };
    function resolve(srcs, n) {
      if (n.tbl) {
        const s = srcs.findIndex((x) => (x.alias || x.t.name).toLowerCase() === n.tbl.toLowerCase() || x.t.name.toLowerCase() === n.tbl.toLowerCase());
        if (s < 0) fail("'" + n.tbl + "." + n.name + "': table " + n.tbl + " is not in the FROM clause.");
        return [s, colIdx(srcs[s].t, n.name)];
      }
      const hits = [];
      srcs.forEach((x, s) => x.t.cols.forEach((c, k) => c.name.toLowerCase() === n.name.toLowerCase() && hits.push([s, k])));
      if (hits.length > 1) fail("Column name '" + n.name + "' is ambiguous – it is in more than one table. Write Table." + n.name + ".");
      if (!hits.length) fail("No column called '" + n.name + "'." + (/^[A-Z]/.test(n.name) && !srcs.some((x) => x.t.name === n.name) ? " If you meant the text value " + n.name + ", put it in quotes: '" + n.name + "'." : ""));
      return hits[0];
    }
    const num = (v) => (typeof v === "number" ? v : parseFloat(v) || 0);
    function cmp(a, b) {
      if (typeof a === "number" && typeof b === "number") return a - b;
      if (typeof a === "number") return -1;
      if (typeof b === "number") return 1;
      return a < b ? -1 : a > b ? 1 : 0;
    }
    const truth = (v) => (v == null ? null : typeof v === "number" ? v !== 0 : !!v);
    function ev(n, ctx) {
      switch (n.t) {
        case "lit":
          return n.v;
        case "col": {
          if (!ctx.srcs) fail("Column names can't be used here – only values.");
          const [s, k] = resolve(ctx.srcs, n);
          return ctx.rows[s][k];
        }
        case "neg": {
          const v = ev(n.e, ctx);
          return v == null ? null : -num(v);
        }
        case "not": {
          const v = truth(ev(n.e, ctx));
          return v == null ? null : !v;
        }
        case "bin": {
          if (n.op === "AND" || n.op === "OR") {
            const a = truth(ev(n.l, ctx)),
              b = truth(ev(n.r, ctx));
            if (n.op === "AND") return a === false || b === false ? false : a == null || b == null ? null : true;
            return a === true || b === true ? true : a == null || b == null ? null : false;
          }
          const a = ev(n.l, ctx),
            b = ev(n.r, ctx);
          if (a == null || b == null) return null;
          switch (n.op) {
            case "=": return cmp(a, b) === 0;
            case "<>": return cmp(a, b) !== 0;
            case "<": return cmp(a, b) < 0;
            case ">": return cmp(a, b) > 0;
            case "<=": return cmp(a, b) <= 0;
            case ">=": return cmp(a, b) >= 0;
            case "+": return num(a) + num(b);
            case "-": return num(a) - num(b);
            case "*": return num(a) * num(b);
            case "/": {
              if (num(b) === 0) return null;
              const q = num(a) / num(b);
              return Number.isInteger(num(a)) && Number.isInteger(num(b)) ? Math.trunc(q) : q;
            }
          }
          break;
        }
        case "like": {
          const v = ev(n.e, ctx),
            p = ev(n.pat, ctx);
          if (v == null || p == null) return null;
          const re = new RegExp("^" + String(p).replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/%/g, ".*").replace(/_/g, ".") + "$", "is");
          return re.test(String(v)) !== n.neg;
        }
        case "between": {
          const v = ev(n.e, ctx),
            lo = ev(n.lo, ctx),
            hi = ev(n.hi, ctx);
          if (v == null || lo == null || hi == null) return null;
          return (cmp(v, lo) >= 0 && cmp(v, hi) <= 0) !== n.neg;
        }
        case "in": {
          const v = ev(n.e, ctx);
          if (v == null) return null;
          return n.list.some((x) => {
            const w = ev(x, ctx);
            return w != null && cmp(v, w) === 0;
          }) !== n.neg;
        }
        case "isnull":
          return (ev(n.e, ctx) == null) !== n.neg;
        case "agg": {
          if (!ctx.group) fail(n.fn + "() can't be used in WHERE. To filter on an aggregate, use GROUP BY … HAVING " + n.fn + "(…) …");
          if (n.fn === "COUNT" && !n.arg) return ctx.group.length;
          let vals = ctx.group.map((r) => ev(n.arg, { srcs: ctx.srcs, rows: r })).filter((v) => v != null);
          if (n.distinct) vals = vals.filter((v, j) => vals.findIndex((w) => cmp(v, w) === 0) === j);
          if (n.fn === "COUNT") return vals.length;
          if (!vals.length) return null;
          if (n.fn === "SUM") return vals.reduce((a, b) => a + num(b), 0);
          if (n.fn === "AVG") return vals.reduce((a, b) => a + num(b), 0) / vals.length;
          return vals.reduce((a, b) => ((n.fn === "MIN" ? cmp(b, a) < 0 : cmp(b, a) > 0) ? b : a));
        }
      }
      fail("Can't evaluate " + (n.text || "expression"));
    }
    const hasAgg = (n) => !!n && typeof n === "object" && (n.t === "agg" || ["l", "r", "e", "pat", "lo", "hi"].some((k) => hasAgg(n[k])) || (n.list || []).some(hasAgg));

    function runSelect(q) {
      const srcs = q.from.map((f) => ({ t: getTable(f.name), alias: f.alias }));
      let combos = [[]];
      q.from.forEach((f, s) => {
        const next = [];
        const part = srcs.slice(0, s + 1);
        combos.forEach((c) =>
          srcs[s].t.rows.forEach((r) => {
            const rows = c.concat([r]);
            if (!f.on || truth(ev(f.on, { srcs: part, rows })) === true) next.push(rows);
          })
        );
        combos = next;
      });
      if (q.where) {
        if (hasAgg(q.where)) fail("Aggregate functions can't go in WHERE – use GROUP BY … HAVING instead.");
        combos = combos.filter((rows) => truth(ev(q.where, { srcs, rows })) === true);
      }
      // output columns
      const cols = [];
      q.items.forEach((it) => {
        if (it.star) {
          srcs.forEach((x, s) => {
            if (it.tbl && (x.alias || x.t.name).toLowerCase() !== it.tbl.toLowerCase() && x.t.name.toLowerCase() !== it.tbl.toLowerCase()) return;
            x.t.cols.forEach((c, k) => cols.push({ name: c.name, get: (ctx) => ctx.rows[s][k], scale: c.scale }));
          });
          if (it.tbl && !srcs.some((x) => (x.alias || x.t.name).toLowerCase() === it.tbl.toLowerCase() || x.t.name.toLowerCase() === it.tbl.toLowerCase())) fail(it.tbl + ".* – that table is not in the FROM clause.");
        } else {
          let scale = null;
          if (it.e.t === "col") {
            const [s, k] = resolve(srcs, it.e);
            scale = srcs[s].t.cols[k].scale;
          } else if (it.e.t === "agg" && it.e.arg && it.e.arg.t === "col" && ["SUM", "MIN", "MAX"].includes(it.e.fn)) {
            const [s, k] = resolve(srcs, it.e.arg);
            scale = srcs[s].t.cols[k].scale;
          }
          cols.push({ name: it.alias || (it.e.t === "col" ? it.e.name : it.e.text), get: (ctx) => ev(it.e, ctx), scale });
        }
      });
      const grouped = q.group.length || q.having || q.items.some((it) => !it.star && hasAgg(it.e));
      let ctxs;
      if (grouped) {
        const map = new Map();
        combos.forEach((rows) => {
          const key = JSON.stringify(q.group.map((g) => ev(g, { srcs, rows })));
          if (!map.has(key)) map.set(key, { key: q.group.map((g) => ev(g, { srcs, rows })), rows: [] });
          map.get(key).rows.push(rows);
        });
        let groups = [...map.values()];
        if (!q.group.length && !groups.length) groups = [{ key: [], rows: [] }];
        groups.sort((a, b) => {
          for (let j = 0; j < a.key.length; j++) {
            const c = a.key[j] == null ? (b.key[j] == null ? 0 : -1) : b.key[j] == null ? 1 : cmp(a.key[j], b.key[j]);
            if (c) return c;
          }
          return 0;
        });
        ctxs = groups.map((g) => ({ srcs, group: g.rows, rows: g.rows[g.rows.length - 1] || srcs.map((x) => x.t.cols.map(() => null)) }));
        if (q.having) ctxs = ctxs.filter((c) => truth(ev(q.having, c)) === true);
      } else ctxs = combos.map((rows) => ({ srcs, rows }));
      let out = ctxs.map((c) => ({ c, vals: cols.map((col) => col.get(c)) }));
      if (q.distinct) {
        const seen = new Set();
        out = out.filter((r) => {
          const k = JSON.stringify(r.vals);
          return seen.has(k) ? false : (seen.add(k), true);
        });
      }
      if (q.order.length) {
        const keyFns = q.order.map((o) => {
          if (o.e.t === "lit" && typeof o.e.v === "number") {
            const k = o.e.v - 1;
            if (k < 0 || k >= cols.length) fail("ORDER BY " + o.e.v + ": there is no column number " + o.e.v + " in the result.");
            return (r) => r.vals[k];
          }
          if (o.e.t === "col" && !o.e.tbl) {
            const k = cols.findIndex((c) => c.name.toLowerCase() === o.e.name.toLowerCase());
            const isAlias = q.items.some((it) => it.alias && it.alias.toLowerCase() === o.e.name.toLowerCase());
            if (k >= 0 && isAlias) return (r) => r.vals[k];
          }
          return (r) => ev(o.e, r.c);
        });
        const keyed = out.map((r) => ({ r, k: keyFns.map((f) => f(r)) }));
        keyed.sort((x, y) => {
          for (let j = 0; j < keyFns.length; j++) {
            const a = x.k[j],
              b = y.k[j];
            let c = a == null ? (b == null ? 0 : -1) : b == null ? 1 : cmp(a, b);
            if (q.order[j].desc) c = -c;
            if (c) return c;
          }
          return 0;
        });
        out = keyed.map((x) => x.r);
      }
      if (q.limit != null) out = out.slice(0, q.limit);
      return { cols, rows: out.map((r) => r.vals), msg: out.length + " row" + (out.length === 1 ? "" : "s") + " selected." + (q.from.length > 1 && !q.where && q.from.every((f) => !f.on) ? " ⚠ No join condition: this is a Cartesian product (every row paired with every row)." : "") };
    }
    function coerce(c, v) {
      if (v != null && NUMT.has(c.base) && typeof v === "string" && v.trim() !== "" && !isNaN(+v)) return +v;
      return v;
    }
    function checkRow(t, row, skipIdx) {
      t.cols.forEach((c, k) => {
        if ((c.notnull || t.pk.includes(c.name)) && row[k] == null) fail("Column " + t.name + "." + c.name + " can't be NULL" + (t.pk.includes(c.name) ? " – it is (part of) the primary key." : " – it is NOT NULL."));
      });
      if (t.pk.length) {
        const pki = t.pk.map((p) => colIdx(t, p));
        const clash = t.rows.findIndex((r, j) => j !== skipIdx && pki.every((k) => cmp(r[k], row[k]) === 0));
        if (clash >= 0) fail("Primary key violation: " + t.name + " already has a row with " + t.pk.map((p, j) => p + " = " + fmtV(row[pki[j]])).join(", ") + ". Primary key values must be unique.");
      }
      t.fks.forEach((f) => {
        const v = row[colIdx(t, f.col)];
        if (v == null) return;
        const rt = getTable(f.table),
          rk = colIdx(rt, f.refCol);
        if (!rt.rows.some((r) => cmp(r[rk], v) === 0)) fail("Referential integrity: " + t.name + "." + f.col + " = " + fmtV(v) + " but there is no " + rt.name + " with " + f.refCol + " = " + fmtV(v) + ". Add that " + rt.name + " first.");
      });
    }
    function referencedBy(t, rows) {
      Object.values(db).forEach((o) =>
        o.fks.forEach((f) => {
          if (f.table.toLowerCase() !== t.name.toLowerCase()) return;
          const rk = colIdx(t, f.refCol),
            ok = colIdx(o, f.col);
          rows.forEach((r) => {
            if (o.rows.some((x) => cmp(x[ok], r[rk]) === 0)) fail("Referential integrity: " + o.name + " still has rows whose " + f.col + " = " + fmtV(r[rk]) + ", so that " + t.name + " row can't be removed or changed. Delete or change those " + o.name + " rows first.");
          });
        })
      );
    }
    const fmtV = (v) => (v == null ? "NULL" : typeof v === "string" ? "'" + v + "'" : String(v));
    const tableView = (t, hl) => ({ cols: t.cols.map((c) => ({ name: c.name, scale: c.scale })), rows: t.rows.map((r) => r.slice()), hl, title: t.name });
    function exec(q) {
      if (q.type === "select") return runSelect(q);
      if (q.type === "insert") {
        const t = getTable(q.table);
        const idx = q.cols ? q.cols.map((c) => colIdx(t, c)) : t.cols.map((c, k) => k);
        const added = [];
        q.rows.forEach((vals) => {
          if (vals.length !== idx.length) fail("INSERT gives " + vals.length + " value" + (vals.length === 1 ? "" : "s") + " but " + (q.cols ? "lists " : t.name + " has ") + idx.length + " column" + (idx.length === 1 ? "" : "s") + ".");
          const row = t.cols.map(() => null);
          vals.forEach((e, j) => (row[idx[j]] = coerce(t.cols[idx[j]], ev(e, {}))));
          checkRow(t, row, -1);
          t.rows.push(row);
          added.push(t.rows.length - 1);
        });
        return Object.assign(tableView(t, added), { msg: added.length + " row" + (added.length === 1 ? "" : "s") + " inserted into " + t.name + "." });
      }
      if (q.type === "update" || q.type === "delete") {
        const t = getTable(q.table);
        const srcs = [{ t, alias: null }];
        if (q.where && hasAgg(q.where)) fail("Aggregates can't be used in WHERE.");
        const hit = t.rows.map((r, j) => (!q.where || truth(ev(q.where, { srcs, rows: [r] })) === true ? j : -1)).filter((j) => j >= 0);
        if (q.type === "delete") {
          referencedBy(t, hit.map((j) => t.rows[j]));
          t.rows = t.rows.filter((r, j) => !hit.includes(j));
          return Object.assign(tableView(t, []), { msg: hit.length + " row" + (hit.length === 1 ? "" : "s") + " deleted from " + t.name + "." + (!q.where ? " ⚠ No WHERE clause, so every row was deleted!" : "") });
        }
        const before = t.rows.map((r) => r.slice());
        const sets = q.sets.map((s) => ({ k: colIdx(t, s.col), e: s.e }));
        try {
          hit.forEach((j) => {
            const nv = sets.map((s) => coerce(t.cols[s.k], ev(s.e, { srcs, rows: [before[j]] })));
            const row = t.rows[j].slice();
            sets.forEach((s, m) => (row[s.k] = nv[m]));
            const pkChanged = t.pk.some((p) => cmp(row[colIdx(t, p)], before[j][colIdx(t, p)]) !== 0);
            if (pkChanged) referencedBy(t, [before[j]]);
            checkRow(t, row, j);
            t.rows[j] = row;
          });
        } catch (e) {
          t.rows = before;
          throw e;
        }
        return Object.assign(tableView(t, hit), { msg: hit.length + " row" + (hit.length === 1 ? "" : "s") + " updated in " + t.name + "." + (!q.where ? " ⚠ No WHERE clause, so every row was changed!" : "") });
      }
      if (q.type === "create") {
        if (db[q.table.toLowerCase()]) fail("A table called " + q.table + " already exists. DROP TABLE it first if you want to recreate it.");
        if (!q.cols.length) fail("A table needs at least one column.");
        const t = { name: q.table, cols: q.cols, pk: q.cols.filter((c) => c.pk).map((c) => c.name).concat(q.pk), fks: q.cols.filter((c) => c.fk).map((c) => ({ col: c.name, table: c.fk.table, refCol: c.fk.col })).concat(q.fks), rows: [] };
        t.pk.forEach((p) => colIdx(t, p));
        t.fks.forEach((f) => {
          colIdx(t, f.col);
          const rt = db[f.table.toLowerCase()];
          if (!rt && f.table.toLowerCase() !== q.table.toLowerCase()) fail("FOREIGN KEY (" + f.col + ") REFERENCES " + f.table + ": that table doesn't exist yet – create it first.");
          if (rt) colIdx(rt, f.refCol);
        });
        t.cols.forEach((c) => (c.pk = t.pk.includes(c.name)));
        db[q.table.toLowerCase()] = t;
        return schemaView(t, "Table " + t.name + " created." + (t.pk.length ? "" : " ⚠ It has no primary key."));
      }
      if (q.type === "drop") {
        const t = getTable(q.table);
        Object.values(db).forEach((o) => o !== t && o.fks.forEach((f) => f.table.toLowerCase() === t.name.toLowerCase() && fail("Can't drop " + t.name + ": table " + o.name + " has a foreign key referencing it.")));
        delete db[t.name.toLowerCase()];
        return { msg: "Table " + t.name + " dropped (structure and all its data deleted)." };
      }
      if (q.type === "addcol") {
        const t = getTable(q.table);
        if (t.cols.some((c) => c.name.toLowerCase() === q.col.name.toLowerCase())) fail(t.name + " already has a column " + q.col.name + ".");
        if (q.col.notnull && t.rows.length) fail("Can't add a NOT NULL column to a table that has rows (they would all be NULL).");
        t.cols.push(q.col);
        t.rows.forEach((r) => r.push(null));
        return Object.assign(tableView(t, []), { msg: "Column " + q.col.name + " " + q.col.type + " added to " + t.name + " (NULL in existing rows)." });
      }
      if (q.type === "dropcol") {
        const t = getTable(q.table);
        const k = colIdx(t, q.col);
        if (t.pk.some((p) => p.toLowerCase() === q.col.toLowerCase())) fail("Can't drop " + q.col + ": it is part of the primary key.");
        if (t.fks.some((f) => f.col.toLowerCase() === q.col.toLowerCase())) fail("Can't drop " + q.col + ": it is a foreign key.");
        t.cols.splice(k, 1);
        t.rows.forEach((r) => r.splice(k, 1));
        return Object.assign(tableView(t, []), { msg: "Column " + q.col + " dropped from " + t.name + "." });
      }
    }
    function schemaView(t, msg) {
      return { msg, title: t.name + " (structure)", cols: [{ name: "Field" }, { name: "Data type" }, { name: "Key" }, { name: "Constraints" }], rows: t.cols.map((c) => { const fk = t.fks.find((f) => f.col.toLowerCase() === c.name.toLowerCase()); return [c.name, c.type, (c.pk ? "PRIMARY KEY" : "") + (c.pk && fk ? ", " : "") + (fk ? "FOREIGN KEY → " + fk.table + "(" + fk.refCol + ")" : ""), c.notnull ? "NOT NULL" : ""]; }) };
    }
    function runScript(src) {
      const stmts = parseScript(src);
      let last = null;
      const msgs = [];
      for (const s of stmts) {
        last = exec(s);
        msgs.push(last.msg);
      }
      return { last, msgs };
    }
    function reset() {
      db = {};
      runScript(SEEDS[dbName]);
    }

    // ---------- UI ----------
    const dbSel = h("select", { "aria-label": "Sample database" }, [h("option", { value: "vet", text: "Vet practice database" }), h("option", { value: "school", text: "School database" })]);
    dbSel.value = dbName;
    const exSel = h("select", { "aria-label": "Example queries", style: "max-width:100%" });
    const ta = h("textarea", { rows: 6, spellcheck: "false", "aria-label": "SQL statement", style: "font-family:var(--font-mono);font-size:0.9rem;width:100%;resize:vertical" });
    const runBtn = h("button", { class: "btn sm primary", type: "button", text: "▶ Run" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset database" });
    const schema = h("div", { class: "controls", style: "gap:6px;margin:8px 0" });
    const msgBox = h("div", { style: "min-height:1.4em;margin:8px 0" });
    const resBox = h("div");
    el.append(h("div", { class: "controls" }, [dbSel, exSel]), ta, h("div", { class: "controls", style: "margin-top:8px" }, [runBtn, resetBtn, h("span", { class: "bit-label", text: "Ctrl+Enter runs" })]), schema, msgBox, resBox);

    function fillExamples() {
      exSel.innerHTML = "";
      exSel.appendChild(h("option", { value: "", text: "Example queries…" }));
      EXAMPLES[dbName].forEach(([t], j) => exSel.appendChild(h("option", { value: j, text: t })));
    }
    function drawSchema() {
      schema.innerHTML = "";
      schema.appendChild(h("span", { class: "bit-label", text: "Tables:" }));
      Object.values(db).forEach((t) => {
        const b = h("button", { class: "btn sm", type: "button", title: "SELECT * FROM " + t.name, style: "font-weight:500;white-space:normal;text-align:left;max-width:100%;display:inline-block" });
        b.innerHTML = "<b>" + CS.util.esc(t.name) + "</b>(" + t.cols.map((c) => { const fk = t.fks.some((f) => f.col.toLowerCase() === c.name.toLowerCase()); const s = CS.util.esc(c.name); return (c.pk ? "<u>" + s + "</u>" : s) + (fk ? "<sup>FK</sup>" : ""); }).join(", ") + ")";
        b.addEventListener("click", () => {
          ta.value = "SELECT * FROM " + t.name + ";";
          run();
        });
        schema.appendChild(b);
      });
    }
    const fmtCell = (v, scale) => (v == null ? "NULL" : typeof v === "boolean" ? (v ? "1" : "0") : typeof v === "number" ? (scale != null ? v.toFixed(scale) : Number.isInteger(v) ? String(v) : String(Math.round(v * 1e4) / 1e4)) : String(v));
    function drawResult(r) {
      resBox.innerHTML = "";
      if (!r || !r.cols) return;
      if (r.title) resBox.appendChild(h("div", { class: "bit-label", style: "text-align:left;margin-bottom:4px", text: r.title }));
      const wrap = h("div", { class: "table-wrap" });
      const tbl = h("table", { class: "sql-result", style: "width:100%;border-collapse:collapse" });
      tbl.appendChild(h("thead", {}, h("tr", {}, r.cols.map((c) => h("th", { text: c.name, style: "text-transform:none;letter-spacing:0" })))));
      const tb = h("tbody");
      r.rows.forEach((row, j) => tb.appendChild(h("tr", { style: r.hl && r.hl.includes(j) ? "background:var(--warn-soft)" : "" }, row.map((v, k) => h("td", { text: fmtCell(v, r.cols[k].scale), class: "mono", style: v == null ? "color:var(--text-3)" : "" })))));
      if (!r.rows.length) tb.appendChild(h("tr", {}, h("td", { colspan: r.cols.length, text: "(no rows)", style: "color:var(--text-3)" })));
      tbl.appendChild(tb);
      wrap.appendChild(tbl);
      resBox.appendChild(wrap);
    }
    function run() {
      msgBox.innerHTML = "";
      let res;
      const snapshot = JSON.stringify(db);
      try {
        res = runScript(ta.value);
      } catch (e) {
        db = JSON.parse(snapshot);
        drawSchema();
        resBox.innerHTML = "";
        msgBox.appendChild(h("div", { class: "err", text: e instanceof SqlErr ? "Error: " + e.message : "Sorry – that query was too complex for this mini engine (" + e.message + ")." }));
        return;
      }
      res.msgs.forEach((m) => msgBox.appendChild(h("div", { class: "ok-text", text: "✓ " + m })));
      drawResult(res.last);
      drawSchema();
    }
    runBtn.addEventListener("click", run);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
      }
    });
    exSel.addEventListener("change", () => {
      if (exSel.value === "") return;
      ta.value = EXAMPLES[dbName][+exSel.value][1];
      run();
    });
    resetBtn.addEventListener("click", () => {
      reset();
      drawSchema();
      resBox.innerHTML = "";
      msgBox.innerHTML = "";
      msgBox.appendChild(h("div", { class: "ok-text", text: "✓ Database reset to the sample data." }));
    });
    dbSel.addEventListener("change", () => {
      dbName = dbSel.value;
      reset();
      fillExamples();
      ta.value = EXAMPLES[dbName][0][1];
      run();
    });
    try {
      reset();
    } catch (e) {
      msgBox.appendChild(h("div", { class: "err", text: "Could not build the sample database: " + e.message }));
    }
    fillExamples();
    ta.value = params.query || EXAMPLES[dbName][1][1];
    run();
  },
});
