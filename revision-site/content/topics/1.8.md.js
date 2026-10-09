CS.registerTopic({ id: "1.8", title: "Object-oriented programming" }, function () {/*

:::objectives
- Define and use **class, object, instantiation, encapsulation, inheritance, aggregation (association and composition), polymorphism and overriding**.
- Write object-oriented programs in Python: constructors, private attributes, getters/setters, subclasses with `super()`, overridden methods and abstract classes.
- **Draw and interpret class diagrams** using UML notation: `+` public, `−` private, `#` protected, inheritance arrows and aggregation/composition diamonds.
- Explain the difference between **association aggregation** and **composition aggregation**.
- Explain and apply the three design principles: **encapsulate what varies**, **favour composition over inheritance**, **program to interfaces, not implementation**.
- Explain **why** the object-oriented paradigm is used.
:::

:::quick At a glance
- A **class** is a blueprint defining **attributes** (data) and **methods** (behaviour). An **object** is an **instance** of a class; creating it is **instantiation**, done by the **constructor**.
- **Encapsulation**: attributes and methods are bundled in the object; attributes are **private** and accessed only through **public methods** (getters/setters), protecting the data.
- **Inheritance**: a **subclass** ("is-a") gets all the attributes and methods of its **superclass** and can add or **override** them.
- **Polymorphism**: objects of different classes respond to the **same method call** in their own way. **Overriding**: a subclass redefines an inherited method with the same name and parameters.
- **Aggregation** ("has-a"): an object contains other objects. **Association aggregation** (hollow ◇): the parts can exist **independently** of the container. **Composition aggregation** (filled ◆): the parts are **destroyed with** the container.
- Class diagrams: three compartments (name / attributes / methods); `+` public, `−` private, `#` protected; hollow-headed arrow from **subclass to superclass**; diamond at the **container** end.
- Design principles: **encapsulate what varies**, **favour composition over inheritance**, **program to interfaces, not implementation**.
:::

:::keyterms
Class :: A blueprint or template that defines the attributes and methods that all objects of that type will have. :: The cookie cutter.
Object :: An instance of a class, with its own values for the attributes defined by the class. :: One cookie.
Instantiation :: The process of creating an object from a class, which calls the class's constructor. :: Using the cutter to make a cookie.
Constructor :: A special method that is called automatically when an object is instantiated, normally used to set the initial values of its attributes. :: The set-up routine (`__init__` in Python, `New` in VB).
Attribute :: A data item (property) belonging to an object or class. :: What it knows.
Method :: A subroutine (procedure or function) that belongs to a class and defines the behaviour of its objects. :: What it can do.
Encapsulation :: The bundling of an object's attributes and methods together, with the attributes hidden (private) and accessed only through the object's public methods. :: Data and code in one capsule, with the data locked inside.
Inheritance :: A relationship in which a subclass acquires the attributes and methods of a superclass, and may add new ones or override inherited ones; an "is-a" relationship. :: A Dog is an Animal, so it gets everything Animal has.
Aggregation :: A relationship in which one object contains or is made up of other objects; a "has-a" relationship. :: A Team has Players.
Association aggregation :: An aggregation in which the contained objects can exist independently of the containing object; if the container is destroyed, the contained objects continue to exist. Shown with a hollow diamond. :: Delete the team, the players still exist.
Composition aggregation :: An aggregation in which the contained objects are part of the containing object and cannot exist without it; if the container is destroyed, so are they. Shown with a filled diamond. :: Delete the house, its rooms go too.
Polymorphism :: The ability of objects of different classes to respond to the same method call, each in its own way. :: One message, many behaviours.
Overriding :: Redefining, in a subclass, a method inherited from a superclass, using the same name and parameters, so the subclass's version is used. :: The child's version replaces the parent's.
Abstract method :: A method declared in a class without an implementation, which every concrete subclass must implement. :: A promise: "every subclass will have this".
Interface :: A set of method signatures (names, parameters, return types) that a class promises to implement, without specifying how. :: The plug shape; anything with that plug fits.
:::

## Classes and objects

A **class** describes what every object of a type **knows** (attributes) and **can do** (methods). An **object** is one concrete **instance** with its own attribute values. You can make as many objects from one class as you like.

<svg class="diagram" viewBox="0 0 660 200" role="img" aria-label="Class Pet on the left with attributes name, species, hunger and methods; two objects rex and tom on the right, each with its own attribute values, instantiated from the class">
  <defs><marker id="arr18a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="20" y="20" width="220" height="160" rx="4" fill="#7c9aff" fill-opacity="0.2"/>
    <text x="130" y="40" text-anchor="middle" stroke="none" font-weight="bold">Pet (class)</text>
    <line x1="20" y1="48" x2="240" y2="48"/>
    <g stroke="none" font-family="monospace" font-size="12">
      <text x="30" y="66">- name: String</text><text x="30" y="84">- species: String</text><text x="30" y="102">- hunger: Integer</text>
    </g>
    <line x1="20" y1="112" x2="240" y2="112"/>
    <g stroke="none" font-family="monospace" font-size="12">
      <text x="30" y="130">+ Pet(name, species)</text><text x="30" y="148">+ getName(): String</text><text x="30" y="166">+ feed(amount)</text>
    </g>
    <line x1="245" y1="80" x2="395" y2="50" marker-end="url(#arr18a)"/>
    <line x1="245" y1="120" x2="395" y2="140" marker-end="url(#arr18a)"/>
    <text x="320" y="100" text-anchor="middle" stroke="none" font-size="12">instantiation</text>
    <rect x="400" y="15" width="230" height="72" rx="10" fill="#f0b429" fill-opacity="0.3"/>
    <g stroke="none" font-size="12"><text x="412" y="34" font-weight="bold">rex : Pet</text><text x="412" y="54" font-family="monospace">name = "Rex", species = "dog"</text><text x="412" y="72" font-family="monospace">hunger = 2</text></g>
    <rect x="400" y="105" width="230" height="72" rx="10" fill="#f0b429" fill-opacity="0.3"/>
    <g stroke="none" font-size="12"><text x="412" y="124" font-weight="bold">tom : Pet</text><text x="412" y="144" font-family="monospace">name = "Tom", species = "cat"</text><text x="412" y="162" font-family="monospace">hunger = 5</text></g>
  </g>
</svg>

```python Defining a class and instantiating objects
class Pet:
    def __init__(self, name, species):     # constructor
        self.__name = name                 # private attributes (double underscore)
        self.__species = species
        self.__hunger = 5

    def get_name(self):                    # getter (accessor)
        return self.__name

    def get_hunger(self):
        return self.__hunger

    def feed(self, amount):                # method that changes state, with a rule
        self.__hunger = max(0, self.__hunger - amount)

rex = Pet("Rex", "dog")      # instantiation: constructor runs, rex refers to the new object
tom = Pet("Tom", "cat")
rex.feed(3)
print(rex.get_name(), rex.get_hunger())    # Rex 2
print(tom.get_name(), tom.get_hunger())    # Tom 5  (each object has its own attributes)
```

The variable `rex` is a **reference** to the object (it holds where the object is in memory, on the heap), just like the Python names in [1.1](#/topic/1.1). `self` inside a method is a reference to **the object the method was called on**.

:::trap
- **Class ≠ object.** "Pet" is a class; "rex" is an object (an instance of Pet). Writing "an object is a blueprint" loses the mark.
- Instantiation always goes through the class's constructor. One textbook answer says objects can also be instantiated "by aggregating existing objects"; that is muddled. Aggregation is a **relationship** between objects that were each instantiated in the normal way.
:::

## Encapsulation

**Encapsulation** bundles an object's **attributes and the methods that operate on them** into one unit, and **hides** the attributes so they can only be read or changed through the object's **public methods**.

- **Getters** (accessors) return attribute values; **setters** (mutators) change them, **after checking** the new value is valid.
- Because nothing outside can touch the data directly, **the object guarantees its own rules** (e.g. hunger never below 0, balance never negative).
- The internal representation can be changed later without affecting any code that uses the class: callers only depend on the public methods. This is **information hiding**.

```python Private data can only change through methods
class Thermostat:
    def __init__(self):
        self.__target = 20

    def get_target(self):
        return self.__target

    def set_target(self, value):          # setter with validation
        if 5 <= value <= 30:
            self.__target = value
            return True
        return False

t = Thermostat()
print(t.set_target(22), t.get_target())   # True 22
print(t.set_target(99), t.get_target())   # False 22   (invalid value rejected)
try:
    print(t.__target)
except AttributeError:
    print("No direct access to a private attribute")
```

| Symbol | Access modifier | Accessible from |
|---|---|---|
| `+` | **public** | anywhere |
| `−` | **private** | only methods of the same class |
| `#` | **protected** | the class **and its subclasses** |

:::note Python's privacy is a convention
Python has no `private` keyword. A double underscore (`__name`) triggers **name mangling** so outside code cannot accidentally use it; a single underscore (`_name`) is the convention for **protected**. VB.NET, Java and C# enforce `Private`/`Protected`/`Public` in the compiler.
:::

## Inheritance

**Inheritance** lets a **subclass** (child, derived class) take on all the attributes and methods of a **superclass** (parent, base class), then **add** its own and **override** any it needs to change. Use it when there is a genuine **"is-a"** relationship: a Dog **is an** Animal.

```python Inheritance, super() and overriding
class Animal:
    def __init__(self, name):
        self._name = name                 # protected (#): visible to subclasses

    def get_name(self):
        return self._name

    def speak(self):
        return "..."

    def describe(self):
        return f"{self._name} says {self.speak()}"

class Dog(Animal):                        # Dog inherits from Animal
    def __init__(self, name, breed):
        super().__init__(name)            # run the superclass constructor first
        self.__breed = breed              # then the extra attribute

    def speak(self):                      # OVERRIDES Animal.speak
        return "Woof"

    def fetch(self):                      # new method only Dogs have
        return f"{self._name} fetches the ball"

class Cat(Animal):
    def speak(self):                      # overrides too
        return "Meow"

    def describe(self):                   # override that EXTENDS the parent's version
        return super().describe() + " (and ignores you)"

rex = Dog("Rex", "collie")
print(rex.get_name())          # Rex   <- inherited, not rewritten
print(rex.describe())          # Rex says Woof
print(Cat("Tom").describe())   # Tom says Meow (and ignores you)
print(rex.fetch())             # Rex fetches the ball
print(isinstance(rex, Animal)) # True: a Dog IS an Animal
```

Benefits: common code is written **once** in the superclass (less duplication, one place to fix), and new kinds of object can be added by writing only what is different.

:::trap
- Inheritance goes **one way**: a Dog has everything an Animal has, but an Animal does **not** have `fetch`.
- A subclass cannot directly use the superclass's **private** (`−`) attributes, only **protected** (`#`) and public ones. That is why `_name` above is protected.
- When a subclass has its own constructor it must **call the superclass constructor** (`super().__init__(...)`), or the inherited attributes are never set up.
:::

## Polymorphism and overriding

**Polymorphism** ("many forms") means the **same method call** produces **different behaviour depending on the class of the object** it is called on. The caller does not need to know which class it has; **the object knows which version to run**.

**Overriding** is how this usually happens: a subclass provides its own implementation of an inherited method with the **same name and parameters**.

```python One call, many behaviours
class Shape:
    def area(self):
        return 0
    def describe(self):
        return f"{type(self).__name__} with area {self.area()}"

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h
    def area(self):                       # override
        return self.w * self.h

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):                       # override
        return round(3.14159 * self.r ** 2, 2)

shapes = [Rectangle(3, 4), Circle(1), Rectangle(2, 5)]
for s in shapes:
    print(s.describe())                   # the SAME call works for every shape
print(sum(s.area() for s in shapes))      # 25.14
```
```output
Rectangle with area 12
Circle with area 3.14
Rectangle with area 10
25.14
```

Notice `describe()` is written **once**, in `Shape`, yet calls the correct `area()` for each object. Adding a `Triangle` class later needs **no change** to the loop or to `describe`.

:::example Which method runs? Trace it.
```python
class A:
    def who(self):
        return "A"
    def hello(self):
        return "hello from " + self.who()

class B(A):
    def who(self):
        return "B"

class C(B):
    pass

for obj in [A(), B(), C()]:
    print(obj.hello())
```
| Object | `hello` found in | `self.who()` found in | Output |
|---|---|---|---|
| A() | A | A | hello from A |
| B() | A (inherited) | **B** (overridden) | hello from B |
| C() | A (inherited via B) | B (inherited) | hello from B |

Rule: start at the object's **own class** and search **up** the inheritance chain for the first class that defines the method.
:::

{{trace:1.8-1}}

### Abstract classes and interfaces

An **abstract method** has no implementation in the superclass; every concrete subclass **must** provide one. A class with abstract methods cannot be instantiated. An **interface** is a set of method signatures that a class promises to implement.

```python Abstract base class as an interface
from abc import ABC, abstractmethod

class Shape2D(ABC):
    @abstractmethod
    def area(self):
        pass

class Square(Shape2D):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

print(Square(4).area())       # 16
try:
    Shape2D()
except TypeError:
    print("An abstract class cannot be instantiated")
```

:::collapse Static, virtual and abstract methods (textbook terms)
- **Virtual** method: defined in the base class and **may** be overridden by a subclass (VB `Overridable`; in Python every method is effectively virtual).
- **Abstract** method: declared in the base class with **no body**; it **must** be overridden (VB `MustOverride`).
- **Static** (class) method: belongs to the **class itself**, not an object, so it can be called **without instantiating** an object (VB `Shared`; Python `@staticmethod`), e.g. `Maths.max(a, b)`.
:::

## Aggregation: association and composition

Objects often **contain** other objects: a **"has-a"** relationship. AQA calls this **aggregation** and distinguishes two kinds by **lifetime**.

| | Association aggregation | Composition aggregation |
|---|---|---|
| Relationship | "has-a"; the parts are **shared/used** by the container | "is part of"; the parts **belong** to the container |
| Lifetime of the parts | parts **exist independently**; destroying the container **does not** destroy them | parts are **destroyed with** the container |
| Who creates the parts? | usually created **outside** and passed in | usually created **inside** the container |
| UML symbol | **hollow** diamond ◇ at the container end | **filled** diamond ◆ at the container end |
| Examples | Team ◇— Player; Hand ◇— Card; Department ◇— Teacher | House ◆— Room; Car ◆— Engine (in a racing game); Order ◆— OrderLine |

<svg class="diagram" viewBox="0 0 680 210" role="img" aria-label="Two UML relationships: Team with a hollow diamond at its end linked to Player, labelled association aggregation, multiplicity 1 to 1 or more; House with a filled diamond linked to Room, labelled composition aggregation">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="30" y="30" width="130" height="50" rx="3" fill="#7c9aff" fill-opacity="0.25"/><text x="95" y="60" text-anchor="middle" stroke="none" font-weight="bold">Team</text>
    <polygon points="160,55 178,46 196,55 178,64" style="fill: var(--surface, #fff)" stroke-width="1.5"/>
    <line x1="196" y1="55" x2="360" y2="55" stroke-width="1.5"/>
    <rect x="360" y="30" width="130" height="50" rx="3" fill="#7c9aff" fill-opacity="0.25"/><text x="425" y="60" text-anchor="middle" stroke="none" font-weight="bold">Player</text>
    <text x="205" y="45" stroke="none" font-size="12">1</text><text x="335" y="45" stroke="none" font-size="12">1..*</text>
    <text x="510" y="50" stroke="none" font-size="12">association aggregation</text>
    <text x="510" y="68" stroke="none" font-size="12">hollow diamond: players</text>
    <text x="510" y="84" stroke="none" font-size="12">survive if the team is deleted</text>

    <rect x="30" y="130" width="130" height="50" rx="3" fill="#7c9aff" fill-opacity="0.25"/><text x="95" y="160" text-anchor="middle" stroke="none" font-weight="bold">House</text>
    <polygon points="160,155 178,146 196,155 178,164" fill="currentColor" stroke-width="1.5"/>
    <line x1="196" y1="155" x2="360" y2="155" stroke-width="1.5"/>
    <rect x="360" y="130" width="130" height="50" rx="3" fill="#7c9aff" fill-opacity="0.25"/><text x="425" y="160" text-anchor="middle" stroke="none" font-weight="bold">Room</text>
    <text x="205" y="145" stroke="none" font-size="12">1</text><text x="335" y="145" stroke="none" font-size="12">1..*</text>
    <text x="510" y="150" stroke="none" font-size="12">composition aggregation</text>
    <text x="510" y="168" stroke="none" font-size="12">filled diamond: rooms are</text>
    <text x="510" y="184" stroke="none" font-size="12">destroyed with the house</text>
  </g>
</svg>

```python Association aggregation vs composition in code
class Player:
    def __init__(self, name):
        self.name = name

class Team:                                # ASSOCIATION aggregation
    def __init__(self, name):
        self.name = name
        self.players = []
    def add_player(self, player):          # players are created elsewhere and passed in
        self.players.append(player)

class Room:
    def __init__(self, name):
        self.name = name

class House:                               # COMPOSITION aggregation
    def __init__(self, room_names):
        self.rooms = [Room(n) for n in room_names]   # the house creates its own rooms

ali, bea = Player("Ali"), Player("Bea")
reds = Team("Reds")
reds.add_player(ali)
reds.add_player(bea)
del reds                                   # the team object is gone...
print(ali.name, bea.name)                  # ...the players still exist: Ali Bea

home = House(["Kitchen", "Lounge"])
print([r.name for r in home.rooms])        # ['Kitchen', 'Lounge']
# No other variable refers to the rooms, so when home goes, they go too.
```

:::trap
- **Hollow ◇ = association aggregation; filled ◆ = composition.** The diamond goes at the **container** ("whole") end, not the part end.
- Get the **direction of dependence** right. In composition the **parts depend on the whole** (rooms can't exist without the house). One textbook answer says the composed object "is entirely dependent on those objects for its own existence"; that has it **backwards**.
- Whether a relationship is aggregation or composition depends on **the system being modelled**: a car and engine are separate in a garage's stock system (aggregation) but probably composition in a racing game.
- Inheritance is **"is-a"**; aggregation is **"has-a"**. A Car is not an Engine.
:::

## Class diagrams

A **class diagram** shows each class as a box with **three compartments**, and the relationships between classes.

- Top: **class name**. Middle: **attributes** `visibility name: Type`. Bottom: **methods** `visibility name(parameters): ReturnType`.
- `+` public, `−` private, `#` protected.
- **Inheritance**: a line with a **hollow triangular arrowhead pointing from the subclass to the superclass**. Only **new or overridden** members are listed in the subclass.
- **Aggregation**: line with a **diamond at the container end** (hollow = association, filled = composition), optionally with multiplicities (1, 0..*, 1..*).

:::figure Class diagram combining inheritance and aggregation
<svg class="diagram" viewBox="0 0 690 400" role="img" aria-label="Class diagram. Animal superclass with protected name, private age, public constructor, getName and speak. Dog and Cat subclasses with hollow triangle arrows pointing up to Animal; Dog adds private breed and fetch and overrides speak; Cat overrides speak. Zoo has an association aggregation hollow diamond to Animal with multiplicity 0 to many. Zoo has composition filled diamond to Enclosure 1 to many.">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="230" y="10" width="220" height="150" rx="3" fill="#7c9aff" fill-opacity="0.2"/>
    <text x="340" y="30" text-anchor="middle" stroke="none" font-weight="bold">Animal</text>
    <line x1="230" y1="38" x2="450" y2="38"/>
    <g stroke="none" font-family="monospace" font-size="12"><text x="240" y="56"># name: String</text><text x="240" y="74">- age: Integer</text></g>
    <line x1="230" y1="84" x2="450" y2="84"/>
    <g stroke="none" font-family="monospace" font-size="12"><text x="240" y="102">+ Animal(name, age)</text><text x="240" y="120">+ getName(): String</text><text x="240" y="138">+ getAge(): Integer</text><text x="240" y="156">+ speak(): String</text></g>

    <rect x="120" y="240" width="200" height="130" rx="3" fill="#7c9aff" fill-opacity="0.2"/>
    <text x="220" y="260" text-anchor="middle" stroke="none" font-weight="bold">Dog</text>
    <line x1="120" y1="268" x2="320" y2="268"/>
    <g stroke="none" font-family="monospace" font-size="12"><text x="130" y="286">- breed: String</text></g>
    <line x1="120" y1="296" x2="320" y2="296"/>
    <g stroke="none" font-family="monospace" font-size="12"><text x="130" y="314">+ Dog(name, age, breed)</text><text x="130" y="332">+ speak(): String</text><text x="130" y="350">+ fetch(): String</text></g>

    <rect x="360" y="240" width="180" height="100" rx="3" fill="#7c9aff" fill-opacity="0.2"/>
    <text x="450" y="260" text-anchor="middle" stroke="none" font-weight="bold">Cat</text>
    <line x1="360" y1="268" x2="540" y2="268"/>
    <line x1="360" y1="282" x2="540" y2="282"/>
    <g stroke="none" font-family="monospace" font-size="12"><text x="370" y="302">+ speak(): String</text></g>

    <line x1="220" y1="240" x2="220" y2="205" stroke-width="1.5"/><line x1="450" y1="240" x2="450" y2="205" stroke-width="1.5"/>
    <line x1="220" y1="205" x2="450" y2="205" stroke-width="1.5"/><line x1="340" y1="205" x2="340" y2="178" stroke-width="1.5"/>
    <polygon points="340,161 330,178 350,178" style="fill: var(--surface, #fff)" stroke-width="1.5"/>
    <text x="355" y="196" stroke="none" font-size="11">inheritance ("is-a")</text>

    <rect x="560" y="20" width="110" height="60" rx="3" fill="#f0b429" fill-opacity="0.3"/>
    <text x="615" y="45" text-anchor="middle" stroke="none" font-weight="bold">Zoo</text>
    <line x1="560" y1="53" x2="670" y2="53"/>
    <g stroke="none" font-family="monospace" font-size="11"><text x="566" y="70">+ add(a: Animal)</text></g>
    <polygon points="560,50 545,44 530,50 545,56" style="fill: var(--surface, #fff)" stroke-width="1.5"/>
    <line x1="530" y1="50" x2="452" y2="50" stroke-width="1.5"/>
    <text x="458" y="44" stroke="none" font-size="11">0..*</text>
    <text x="490" y="68" stroke="none" font-size="11">◇ association</text>

    <rect x="560" y="170" width="110" height="44" rx="3" fill="#f0b429" fill-opacity="0.3"/>
    <text x="615" y="197" text-anchor="middle" stroke="none" font-weight="bold">Enclosure</text>
    <polygon points="615,80 609,95 615,110 621,95" fill="currentColor" stroke-width="1.5"/>
    <line x1="615" y1="110" x2="615" y2="170" stroke-width="1.5"/>
    <text x="622" y="164" stroke="none" font-size="11">1..*</text>
    <text x="622" y="135" stroke="none" font-size="11">◆ composition</text>
  </g>
</svg>
:::

Reading the diagram:

- `Dog` and `Cat` **inherit** from `Animal`; both **override** `speak()`; `Dog` adds `breed` and `fetch()`. They also inherit `getName()` and `getAge()` without restating them.
- `name` is **protected** (`#`) so subclasses can use it; `age` is **private** (`−`) so subclasses must use `getAge()`.
- A `Zoo` **has** zero or more animals by **association aggregation**: animals can be moved to another zoo and still exist.
- A `Zoo` is **composed** of one or more enclosures: delete the zoo object and its enclosures go too.

:::exam
**Drawing class diagrams in the exam**: three-part boxes; use `+ − #` consistently; give data types; in a subclass list **only** new attributes/methods and **overridden** ones; arrowhead (hollow triangle) **at the superclass**; diamond **at the container**. Marks usually go for: correct boxes and names, correct inheritance arrows, correct members in the subclass, correct access modifiers.
:::

## The three design principles

AQA expects you to know three principles of good object-oriented design and be able to apply them.

### 1. Encapsulate what varies

Identify the parts of a program that are **likely to change** and **separate them** from the parts that stay the same, hiding each varying part behind its own class. Then a change affects only one small class.

```python Ticket pricing rules change often, so they get their own classes
class StandardPricing:
    def price(self, base):
        return base

class StudentPricing:
    def price(self, base):
        return round(base * 0.8, 2)

class PeakPricing:
    def price(self, base):
        return round(base * 1.5, 2)

class Ticket:
    def __init__(self, base, pricing):
        self.__base = base
        self.__pricing = pricing          # the varying part, held separately

    def cost(self):
        return self.__pricing.price(self.__base)

print(Ticket(10, StandardPricing()).cost())   # 10
print(Ticket(10, StudentPricing()).cost())    # 8.0
print(Ticket(10, PeakPricing()).cost())       # 15.0
```

Without the principle, `Ticket.cost()` would be a growing chain of `if ticket_type == ...` statements that has to be edited (and retested) every time marketing invents a new discount. Now a new rule is **one new class**; `Ticket` never changes.

### 2. Favour composition over inheritance

Build objects by **combining** (aggregating) other objects that provide behaviour, rather than by creating deep inheritance hierarchies. Inheritance **fixes** behaviour at design time and **tightly couples** the subclass to its superclass; composition lets behaviour be **mixed, shared and swapped at run time**.

The classic problem: put `fly()` in a `Duck` superclass and suddenly `RubberDuck` can fly. Override it to do nothing and every non-flying duck needs the same override; add quacking variations and the number of subclasses explodes (`FlyingQuackingDuck`, `NonFlyingSqueakingDuck`…).

```python A duck HAS-A flying behaviour instead of IS-A flying duck
class FlyWithWings:
    def fly(self):
        return "flaps its wings"

class CannotFly:
    def fly(self):
        return "stays on the ground"

class Duck:
    def __init__(self, name, fly_behaviour):
        self.name = name
        self.fly_behaviour = fly_behaviour    # composition: behaviour is an object it holds

    def perform_fly(self):
        return f"{self.name} {self.fly_behaviour.fly()}"

mallard = Duck("Mallard", FlyWithWings())
rubber = Duck("Rubber duck", CannotFly())
print(mallard.perform_fly())      # Mallard flaps its wings
print(rubber.perform_fly())       # Rubber duck stays on the ground
mallard.fly_behaviour = CannotFly()   # injured: behaviour swapped at run time
print(mallard.perform_fly())      # Mallard stays on the ground
```

Inheritance is still right for a true, stable **"is-a"** relationship. The principle says **favour**, not **always use**, composition.

### 3. Program to interfaces, not implementation

Write code that depends on **what an object can do** (its interface: the methods it promises) rather than on **which specific class** it is. Then any class that implements the interface can be substituted without changing the code that uses it.

```python checkout() only knows about the PaymentMethod interface
from abc import ABC, abstractmethod

class PaymentMethod(ABC):                 # the interface
    @abstractmethod
    def pay(self, amount):
        pass

class CardPayment(PaymentMethod):
    def pay(self, amount):
        return f"Charged £{amount:.2f} to card"

class VoucherPayment(PaymentMethod):
    def __init__(self, balance):
        self.__balance = balance
    def pay(self, amount):
        if amount > self.__balance:
            return "Voucher balance too low"
        self.__balance -= amount
        return f"Paid £{amount:.2f} by voucher"

def checkout(total, method):              # depends on the interface only
    return method.pay(total)

print(checkout(25, CardPayment()))        # Charged £25.00 to card
print(checkout(25, VoucherPayment(20)))   # Voucher balance too low
print(checkout(15, VoucherPayment(20)))   # Paid £15.00 by voucher
```

Adding mobile payments later means writing `MobilePayment(PaymentMethod)`; `checkout` and everything that calls it stay exactly as they are. This also makes testing easier: pass in a fake payment object.

:::example The three principles together
| Principle | In one sentence | Benefit | Example above |
|---|---|---|---|
| Encapsulate what varies | Put the changeable part in its own class behind a stable interface | Changes are localised to one class | pricing rules |
| Favour composition over inheritance | Give objects behaviour by holding other objects, not by subclassing | Flexible, behaviour can change at run time, avoids class explosion and tight coupling | duck flying |
| Program to interfaces, not implementation | Depend on what an object can do, not what class it is | New implementations can be plugged in without changing client code | payment methods |
:::

## Why use the object-oriented paradigm?

| Advantage | Why |
|---|---|
| **Models the real world** | systems are naturally described as interacting objects (customers, orders, sprites) |
| **Encapsulation protects data** | attributes changed only through methods that enforce the rules; fewer side effects |
| **Reuse** | classes can be reused in other programs and extended through inheritance or composition; libraries of classes |
| **Maintainability** | changes are localised to one class; implementation can change without affecting users of its interface |
| **Team development** | classes with clear interfaces can be developed and tested independently by different programmers |
| **Extensibility** | polymorphism lets new subclasses be added without changing existing code |

Drawbacks: more **design effort** up front; programs can be **larger and slower** (many objects and method calls use more memory/time); deep inheritance can have **unintended consequences** (objects inheriting behaviour that makes no sense); not every problem is naturally object-shaped.

:::exam
- **Definitions** (1–2 marks each): learn the key terms box word for word, especially **encapsulation** (bundling data with methods **and** restricting access to the data), **polymorphism** (same call, different behaviour depending on class), **overriding** (subclass redefines an inherited method with the same name).
- **"Explain the difference between association aggregation and composition aggregation"** (2 marks): in both, one object contains others (1); in association, contained objects **continue to exist** if the container is destroyed, in composition they are **destroyed with it** (1).
- **Class diagram drawing**: see the box under the diagram above.
- **Design principles** (2–3 marks): name the principle and explain it **with reference to the scenario** in the question.
- **Writing OOP code** (Paper 1 Section D): private attributes, constructor calling the parent constructor, overriding methods with the same signature, getters returning values. Always use the class and method names given.
:::

:::challenge
1. Draw a class diagram for a school system: `Person` superclass, `Student` and `Teacher` subclasses, a `Form` that aggregates students, and a `School` composed of `Department`s. Choose access modifiers and justify each diamond.
2. Implement `Vehicle`, `Car` and `Bicycle` with an overridden `travel_time(distance)` and loop through a list of mixed vehicles. Which line demonstrates polymorphism?
3. Refactor a class hierarchy `Employee → Manager → SalesManager` so that bonus rules are composed rather than inherited. Which design principles have you applied?
4. Explain why `rex = Dog(...)` followed by `pet = rex` and `pet.feed(2)` changes `rex` too.
:::

:::recap
- **Class** = blueprint; **object** = instance; **instantiation** calls the **constructor**.
- **Encapsulation**: data + methods bundled; private attributes; public getters/setters enforce rules.
- **Inheritance** ("is-a"): subclass gets superclass members, adds/overrides; `super()` calls the parent.
- **Polymorphism**: same call, behaviour depends on the object's class; **overriding** = redefining an inherited method.
- **Association aggregation** ◇: parts survive the container. **Composition aggregation** ◆: parts die with it. Diamond at container end.
- Class diagrams: name / attributes / methods; `+ − #`; hollow triangle from subclass to superclass.
- Principles: **encapsulate what varies**, **favour composition over inheritance**, **program to interfaces, not implementation**.
- OOP gives data protection, reuse, maintainability, teamwork and extensibility at the cost of design effort and overhead.
:::

:::related
- [1.7 Programming paradigms and structured programming](#/topic/1.7)
- [1.1 Data types, variables and constants](#/topic/1.1) — references
- [1.5 Subroutines, parameters and scope](#/topic/1.5)
- [2.1 Data structures, arrays, records, files and lists](#/topic/2.1)
:::

*/});
