CS.registerFlashcards("12.1", [
  { front: "(f ∘ g)(x) = ?  Which function is applied first?", back: "**f(g(x))**. g is applied first, then f. Read ∘ as \"after\"." },
  { front: "f(x) = x³, g(x) = x + 3. Give (f ∘ g)(x) and (g ∘ f)(x).", back: "(f ∘ g)(x) = (x + 3)³.  (g ∘ f)(x) = x³ + 3." },
  { front: "What is the difference between co-domain and range?", back: "Co-domain: the set outputs are chosen from (part of the function type). Range: the outputs actually produced. Range ⊆ co-domain." },
  { front: "`add: integer → integer → integer`. Type of `add 3`?", back: "`integer → integer`: a function that adds 3 to its argument." },
  { front: "`f: A → B → C → D`. Types of `f a` and `f a b`?", back: "`f a : B → C → D`;  `f a b : C → D`;  `f a b c : D`." },
  { front: "What four things can a first-class object do? (EVAC)", back: "Appear in **E**xpressions, be assigned to **V**ariables, be passed as **A**rguments, be returned from function **C**alls." },
  { front: "Haskell syntax for composition and application?", back: "Composition: `(f . g) x`. Application: `f x y` (spaces, no brackets/commas), which means `(f x) y`." },
  { front: "When is f ∘ g a valid composition?", back: "When the co-domain of g matches (is within) the domain of f. Then f ∘ g : domain of g → co-domain of f." },
  { front: "Python equivalent of partial application `add 4`?", back: "`functools.partial(add, 4)` or `lambda y: add(4, y)`." },
]);
