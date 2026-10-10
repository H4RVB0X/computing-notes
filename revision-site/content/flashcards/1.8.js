CS.registerFlashcards("1.8", [
  { front: "UML visibility symbols.", back: "+ public · − private · # protected" },
  { front: "Inheritance arrow in a class diagram.", back: "Line from the subclass with a hollow triangular head at the superclass." },
  { front: "Hollow vs filled diamond.", back: "Hollow ◇ = association aggregation (parts survive). Filled ◆ = composition aggregation (parts destroyed with container). Diamond at container end." },
  { front: "The three OOP design principles.", back: "Encapsulate what varies · Favour composition over inheritance · Program to interfaces, not implementation" },
  { front: "Polymorphism vs overriding.", back: "Polymorphism: same call, behaviour depends on the object's class. Overriding: subclass redefines an inherited method (same name/parameters) — the usual way polymorphism is achieved." },
  { front: "Python: constructor, private attribute, call parent constructor.", back: "`def __init__(self, ...)` · `self.__x` · `super().__init__(...)`" },
  { front: "Why use OOP? (5)", back: "Models real world · encapsulation protects data · reuse via classes/inheritance · easier maintenance · team development/extensibility" },
  { front: "Drawbacks of OOP.", back: "More design effort; larger/slower programs; inheritance misuse gives odd behaviour; not every problem is object-shaped." },
  { front: "What appears in a subclass box on a class diagram?", back: "Only its new attributes/methods and any overridden methods — inherited members are not repeated." },
  { front: "Static vs abstract vs virtual method.", back: "Static: belongs to the class, callable without an object. Abstract: no body, must be overridden. Virtual: may be overridden." },
]);
