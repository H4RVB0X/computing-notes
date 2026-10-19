/* Python coding practice: object-oriented programming (classes, encapsulation, inheritance)
   Format and test semantics: see scripts/check_problems.py (run it after editing). */
CS.registerProblems([
  {
    id: "oop-rectangle",
    title: "Rectangle class",
    topic: "1.8",
    difficulty: 1,
    task: `Write a class \`Rectangle\`:

- the constructor takes \`width\` and \`height\` (whole numbers) and stores them as attributes \`width\` and \`height\`
- method \`area()\` returns the area
- method \`perimeter()\` returns the perimeter
- method \`is_square()\` returns \`True\` if the width and height are equal, otherwise \`False\`.

Your code should only define the class. The tests create objects and call the methods, for example:

\`\`\`python
r = Rectangle(3, 4)
print(r.area())        # 12
print(r.perimeter())   # 14
print(r.is_square())   # False
\`\`\``,
    starter: `class Rectangle:
    def __init__(self, width, height):
        pass

    def area(self):
        pass

    def perimeter(self):
        pass

    def is_square(self):
        pass
`,
    tests: [
      { name: "example from the question", code: "r = Rectangle(3, 4)\nprint(r.area())\nprint(r.perimeter())\nprint(r.is_square())", expect: "12\n14\nFalse" },
      { name: "a square", code: "s = Rectangle(5, 5)\nprint(s.area())\nprint(s.perimeter())\nprint(s.is_square())", expect: "25\n20\nTrue" },
      { name: "attributes are stored", code: "r = Rectangle(7, 2)\nprint(r.width, r.height)", expect: "7 2", hidden: true },
      { name: "two objects are independent", code: "a = Rectangle(2, 3)\nb = Rectangle(10, 10)\nprint(a.area())\nprint(b.area())", expect: "6\n100", hidden: true },
      { name: "zero width", code: "z = Rectangle(0, 1)\nprint(z.area())\nprint(z.perimeter())\nprint(z.is_square())", expect: "0\n2\nFalse", hidden: true }
    ],
    hints: [
      "In the constructor: `self.width = width` and `self.height = height`.",
      "Methods use the object's attributes through `self`: `return self.width * self.height`.",
      "`is_square` can simply `return self.width == self.height`."
    ],
    solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height
`,
    explain: `**Class vs object.** \`Rectangle\` is the *class*, a blueprint. \`Rectangle(3, 4)\` *instantiates* an *object* with its own attribute values. Two objects never share their \`width\`, as the hidden test checks.

**\`self\`.** Every method receives the object it was called on as \`self\`; \`self.width\` means "this object's width". Forgetting \`self.\` in the constructor (\`width = width\`) only creates a local variable that disappears when the constructor ends.

**Return, don't print.** The methods return values so the caller decides what to do with them. \`is_square\` returns the Boolean expression directly; \`if … return True else return False\` works but is longer.`
  },
  {
    id: "oop-bank-account",
    title: "Bank account class",
    topic: "1.8",
    difficulty: 2,
    task: `Write a class \`BankAccount\` that **encapsulates** a balance, in whole pounds.

- \`BankAccount(owner)\` creates an account with a balance of 0. Store the balance in a **private** attribute (\`self.__balance\`).
- \`get_owner()\` and \`get_balance()\` return the owner's name and the balance.
- \`deposit(amount)\`: if \`amount\` is more than 0, add it and return \`True\`; otherwise return \`False\` and change nothing.
- \`withdraw(amount)\`: if \`amount\` is more than 0 and no more than the balance, subtract it and return \`True\`; otherwise return \`False\` and change nothing.
- \`transfer(amount, other)\`: move \`amount\` from this account to the \`BankAccount\` object \`other\`, following the same rules as \`withdraw\`. Return \`True\` or \`False\`.

Your code should only define the class.

\`\`\`python
a = BankAccount("Ana")
print(a.deposit(50))      # True
print(a.withdraw(80))     # False
print(a.get_balance())    # 50
\`\`\``,
    tests: [
      { name: "example from the question", code: "a = BankAccount(\"Ana\")\nprint(a.deposit(50))\nprint(a.withdraw(80))\nprint(a.get_balance())", expect: "True\nFalse\n50" },
      { name: "owner and starting balance", code: "b = BankAccount(\"Ben\")\nprint(b.get_owner(), b.get_balance())", expect: "Ben 0" },
      { name: "invalid deposits", code: "a = BankAccount(\"Ana\")\nprint(a.deposit(0))\nprint(a.deposit(-10))\nprint(a.get_balance())", expect: "False\nFalse\n0", hidden: true },
      { name: "withdraw the exact balance", code: "a = BankAccount(\"Ana\")\na.deposit(30)\nprint(a.withdraw(30))\nprint(a.get_balance())\nprint(a.withdraw(-5))", expect: "True\n0\nFalse", hidden: true },
      { name: "transfer between accounts", code: "a = BankAccount(\"Ana\")\nb = BankAccount(\"Ben\")\na.deposit(100)\nprint(a.transfer(40, b))\nprint(a.get_balance(), b.get_balance())\nprint(a.transfer(61, b))\nprint(a.get_balance(), b.get_balance())", expect: "True\n60 40\nFalse\n60 40", hidden: true },
      { name: "balance is private", code: "a = BankAccount(\"Ana\")\na.deposit(5)\nprint(\"public balance attribute found\" if hasattr(a, \"balance\") else \"no public balance attribute\")", expect: "no public balance attribute", hidden: true }
    ],
    hints: [
      "In `__init__`: `self.__owner = owner` and `self.__balance = 0`. The double underscore makes the attribute private.",
      "Validate first, then change the balance: `if amount <= 0 or amount > self.__balance: return False`.",
      "`transfer` can reuse your methods: `if self.withdraw(amount): other.deposit(amount); return True`."
    ],
    solution: `class BankAccount:
    def __init__(self, owner):
        self.__owner = owner
        self.__balance = 0

    def get_owner(self):
        return self.__owner

    def get_balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            return False
        self.__balance = self.__balance + amount
        return True

    def withdraw(self, amount):
        if amount <= 0 or amount > self.__balance:
            return False
        self.__balance = self.__balance - amount
        return True

    def transfer(self, amount, other):
        if self.withdraw(amount):
            other.deposit(amount)
            return True
        return False
`,
    explain: `**Encapsulation.** The balance is private, so code outside the class can only change it through \`deposit\`, \`withdraw\` and \`transfer\`, which enforce the rules (no negative deposits, no overdraft). That's the point: the object protects its own data. \`get_balance\` is a *getter*; there is deliberately no setter.

**Reuse.** \`transfer\` calls \`self.withdraw\` and \`other.deposit\` rather than repeating their checks. If the rules change, they change in one place.

**Python detail.** Python's "private" (\`__balance\`) uses *name mangling* to \`_BankAccount__balance\`; it discourages access rather than making it impossible. In AQA class diagrams private members are shown with \`-\` and public with \`+\`.

**Common mistakes:** changing the balance before validating; returning nothing (so the caller gets \`None\`); in \`transfer\`, depositing even when the withdrawal failed.`
  },
  {
    id: "oop-employee-inheritance",
    title: "Employees and managers (inheritance)",
    topic: "1.8",
    difficulty: 2,
    task: `Write two classes.

**\`Employee\`**
- \`Employee(name, hourly_rate)\` stores both values.
- \`get_name()\` returns the name.
- \`pay(hours)\` returns the pay for that many hours: the hourly rate for each of the first 40 hours, and **double** the hourly rate for every hour over 40.

**\`Manager\`** — a subclass of \`Employee\` (it must **inherit** from it).
- \`Manager(name, hourly_rate, bonus)\` also stores a weekly bonus. Use \`super().__init__(...)\` for the shared attributes.
- \`pay(hours)\` **overrides** the parent method: it returns the normal employee pay plus the bonus. Call the parent's \`pay\` with \`super()\` rather than repeating the overtime rule.

Your code should only define the classes. All amounts are whole numbers.

\`\`\`python
staff = [Employee("Ann", 12), Manager("Raj", 20, 100)]
for person in staff:
    print(person.get_name(), person.pay(10))
# Ann 120
# Raj 300
\`\`\``,
    tests: [
      { name: "example from the question", code: "staff = [Employee(\"Ann\", 12), Manager(\"Raj\", 20, 100)]\nfor person in staff:\n    print(person.get_name(), person.pay(10))", expect: "Ann 120\nRaj 300" },
      { name: "overtime for an employee", code: "print(Employee(\"Tom\", 10).pay(45))", expect: "500" },
      { name: "exactly 40 hours", code: "print(Employee(\"Tom\", 10).pay(40))", expect: "400", hidden: true },
      { name: "manager overtime plus bonus", code: "m = Manager(\"Sue\", 20, 50)\nprint(m.pay(45))\nprint(m.pay(0))", expect: "1050\n50", hidden: true },
      { name: "Manager inherits from Employee", code: "m = Manager(\"Sue\", 20, 50)\nprint(isinstance(m, Employee))\nprint(issubclass(Manager, Employee))\nprint(m.get_name())", expect: "True\nTrue\nSue", hidden: true },
      { name: "Manager does not redefine get_name", code: "print(\"inherited\" if \"get_name\" not in Manager.__dict__ else \"get_name was copied into Manager\")", expect: "inherited", hidden: true }
    ],
    hints: [
      "`class Manager(Employee):` makes Manager a subclass. Its constructor starts with `super().__init__(name, hourly_rate)`.",
      "Employee pay: if `hours <= 40` it's `hours * rate`; otherwise `40 * rate + (hours - 40) * rate * 2`.",
      "Manager pay: `return super().pay(hours) + self.bonus`."
    ],
    solution: `class Employee:
    def __init__(self, name, hourly_rate):
        self.name = name
        self.hourly_rate = hourly_rate

    def get_name(self):
        return self.name

    def pay(self, hours):
        if hours <= 40:
            return hours * self.hourly_rate
        return 40 * self.hourly_rate + (hours - 40) * self.hourly_rate * 2


class Manager(Employee):
    def __init__(self, name, hourly_rate, bonus):
        super().__init__(name, hourly_rate)
        self.bonus = bonus

    def pay(self, hours):
        return super().pay(hours) + self.bonus
`,
    explain: `**Inheritance.** \`Manager\` *is a* kind of \`Employee\`: it inherits \`get_name\` and the attributes without rewriting them, adds a \`bonus\` attribute, and **overrides** \`pay\`. The hidden tests check \`Manager\` really is a subclass and doesn't copy \`get_name\`.

**Polymorphism.** The loop calls \`person.pay(10)\` without knowing which class each object belongs to; Python runs the right version for each object. That's what lets new kinds of staff be added without changing the loop.

**\`super()\`.** Calling the parent's \`pay\` means the overtime rule exists in one place only. Copying the formula into \`Manager\` would work today but would go wrong as soon as the rule changed.

**Exam link.** In an inheritance diagram the arrow points from the subclass (\`Manager\`) to the base class (\`Employee\`). Be ready to explain *overriding* (same method name, new behaviour in the subclass).`
  },
  {
    id: "oop-library",
    title: "Library system (aggregation)",
    topic: "1.8",
    difficulty: 3,
    task: `Write three classes for a small library.

**\`Book(title, author)\`** — attributes \`title\`, \`author\` and \`on_loan\` (starts \`False\`).

**\`Member(name)\`** — attributes \`name\` and \`books\`, a list of the titles they currently have (starts empty).

**\`Library()\`** — holds lists of \`Book\` and \`Member\` objects, with methods:

| Method | Returns |
|---|---|
| \`add_book(book)\` | nothing (adds the \`Book\` object) |
| \`add_member(member)\` | nothing (adds the \`Member\` object) |
| \`lend(title, name)\` | a message string (see below) |
| \`return_book(title)\` | \`"Returned <title>"\`, or \`"<title> was not on loan"\`, or \`"No such book"\` |
| \`available()\` | a list of the titles not on loan, in the order the books were added |

\`lend\` checks in this order and returns the first message that applies:
\`"No such book"\`, \`"No such member"\`, \`"<title> is already on loan"\`, \`"<name> has too many books"\` (a member may have at most **3**), otherwise it lends the book and returns \`"Lent <title> to <name>"\`.

When a book is returned, remove it from the member who had it. Your code should only define the classes.

\`\`\`python
lib = Library()
lib.add_book(Book("Dune", "Herbert"))
lib.add_member(Member("Ana"))
print(lib.lend("Dune", "Ana"))    # Lent Dune to Ana
print(lib.lend("Dune", "Ana"))    # Dune is already on loan
print(lib.available())            # []
\`\`\``,
    tests: [
      { name: "example from the question", code: "lib = Library()\nlib.add_book(Book(\"Dune\", \"Herbert\"))\nlib.add_member(Member(\"Ana\"))\nprint(lib.lend(\"Dune\", \"Ana\"))\nprint(lib.lend(\"Dune\", \"Ana\"))\nprint(lib.available())", expect: "Lent Dune to Ana\nDune is already on loan\n[]" },
      { name: "missing book or member", code: "lib = Library()\nlib.add_book(Book(\"Emma\", \"Austen\"))\nlib.add_member(Member(\"Ben\"))\nprint(lib.lend(\"Persuasion\", \"Ben\"))\nprint(lib.lend(\"Emma\", \"Zoe\"))\nprint(lib.lend(\"Persuasion\", \"Zoe\"))", expect: "No such book\nNo such member\nNo such book" },
      { name: "return a book", code: "lib = Library()\nlib.add_book(Book(\"Dune\", \"Herbert\"))\nana = Member(\"Ana\")\nlib.add_member(ana)\nlib.lend(\"Dune\", \"Ana\")\nprint(lib.return_book(\"Dune\"))\nprint(lib.return_book(\"Dune\"))\nprint(lib.return_book(\"Ulysses\"))\nprint(lib.available())\nprint(ana.books)", expect: "Returned Dune\nDune was not on loan\nNo such book\n['Dune']\n[]", hidden: true },
      { name: "limit of three books", code: "lib = Library()\nfor t in [\"A\", \"B\", \"C\", \"D\"]:\n    lib.add_book(Book(t, \"X\"))\ncy = Member(\"Cy\")\nlib.add_member(cy)\nfor t in [\"A\", \"B\", \"C\", \"D\"]:\n    print(lib.lend(t, \"Cy\"))\nprint(cy.books)\nprint(lib.available())\nprint(lib.return_book(\"B\"))\nprint(lib.lend(\"D\", \"Cy\"))\nprint(cy.books)", expect: "Lent A to Cy\nLent B to Cy\nLent C to Cy\nCy has too many books\n['A', 'B', 'C']\n['D']\nReturned B\nLent D to Cy\n['A', 'C', 'D']", hidden: true },
      { name: "check order: on loan before too many", code: "lib = Library()\nfor t in [\"A\", \"B\", \"C\", \"D\"]:\n    lib.add_book(Book(t, \"X\"))\nlib.add_member(Member(\"Cy\"))\nlib.add_member(Member(\"Di\"))\nlib.lend(\"D\", \"Di\")\nfor t in [\"A\", \"B\", \"C\"]:\n    lib.lend(t, \"Cy\")\nprint(lib.lend(\"D\", \"Cy\"))", expect: "D is already on loan", hidden: true },
      { name: "returned book goes back to the right member", code: "lib = Library()\nx = Book(\"X\", \"P\")\nlib.add_book(x)\ny = Book(\"Y\", \"Q\")\nlib.add_book(y)\na = Member(\"A\")\nb = Member(\"B\")\nlib.add_member(a)\nlib.add_member(b)\nlib.lend(\"X\", \"A\")\nlib.lend(\"Y\", \"B\")\nlib.return_book(\"X\")\nprint(b.books)\nprint(a.books)\nprint(y.on_loan, x.on_loan)", expect: "['Y']\n[]\nTrue False", hidden: true }
    ],
    hints: [
      "Give `Library` two helper methods: `find_book(title)` and `find_member(name)`, each returning the matching object or `None`.",
      "In `lend`, check each condition in the order given and `return` the message straight away.",
      "For `return_book`, loop over the members and remove the title from whichever member's `books` list contains it."
    ],
    solution: `class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
        self.on_loan = False


class Member:
    def __init__(self, name):
        self.name = name
        self.books = []


class Library:
    MAX_BOOKS = 3

    def __init__(self):
        self.books = []
        self.members = []

    def add_book(self, book):
        self.books.append(book)

    def add_member(self, member):
        self.members.append(member)

    def find_book(self, title):
        for book in self.books:
            if book.title == title:
                return book
        return None

    def find_member(self, name):
        for member in self.members:
            if member.name == name:
                return member
        return None

    def lend(self, title, name):
        book = self.find_book(title)
        if book is None:
            return "No such book"
        member = self.find_member(name)
        if member is None:
            return "No such member"
        if book.on_loan:
            return title + " is already on loan"
        if len(member.books) >= Library.MAX_BOOKS:
            return name + " has too many books"
        book.on_loan = True
        member.books.append(title)
        return "Lent " + title + " to " + name

    def return_book(self, title):
        book = self.find_book(title)
        if book is None:
            return "No such book"
        if not book.on_loan:
            return title + " was not on loan"
        book.on_loan = False
        for member in self.members:
            if title in member.books:
                member.books.remove(title)
        return "Returned " + title

    def available(self):
        titles = []
        for book in self.books:
            if not book.on_loan:
                titles.append(book.title)
        return titles
`,
    explain: `**Aggregation.** A \`Library\` *has* books and members, but they exist independently: they're created outside and passed in with \`add_book\`/\`add_member\`. (In composition, the container would create and own them, and they would be destroyed with it.) In a class diagram aggregation is drawn with a hollow diamond, composition with a filled one.

**Decomposition inside the class.** \`find_book\` and \`find_member\` stop \`lend\` and \`return_book\` from repeating search loops. A class constant \`MAX_BOOKS\` avoids a magic number.

**Order of checks.** The question specifies which message wins when several apply; returning as soon as one applies (a *guard clause*) makes the order obvious. One hidden test has a member with 3 books asking for a book that is on loan: the answer must be *already on loan*.

**Common mistakes:** forgetting to update **both** objects (the book's \`on_loan\` and the member's list); returning a list of \`Book\` objects from \`available()\` instead of titles.`
  }
]);
