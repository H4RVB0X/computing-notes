CS.registerFlashcards("4.5", [
  { front: "The three BNF metasymbols and their meanings?", back: "`::=` is defined as · `< >` encloses a non-terminal · `|` or. Writing symbols next to each other means \"followed by\"." },
  { front: "BNF rule for an integer of one or more digits?", back: "`<integer> ::= <digit> | <digit><integer>`  (base case: one digit; general case: a digit followed by an integer)" },
  { front: "BNF for aⁿbⁿ (ab, aabb, aaabbb…)?", back: "`<s> ::= ab | a<s>b`. No regular expression can do this." },
  { front: "Why can't a regex/FSM recognise balanced brackets?", back: "It has a **finite number of states**, so it cannot remember an unlimited count of open brackets. BNF can, using recursion." },
  { front: "Syntax diagram shapes?", back: "Rectangle = non-terminal · rounded box/ellipse = terminal · fork = alternatives · loop back = repetition · bypass = optional." },
  { front: "How do you write an optional item in pure BNF?", back: "As an extra alternative without it, e.g. `<num> ::= <sign><integer> | <integer>`. `{ }` and `[ ]` are EBNF, not BNF." },
  { front: "What is a leftmost derivation?", back: "Starting from the start symbol, replace the **leftmost** non-terminal using one rule per step until only terminals remain." },
  { front: "Relationship between regular and context-free languages?", back: "Every regular language is context-free; some context-free languages (aⁿbⁿ, nested brackets) are not regular." },
  { front: "In a parse tree, what are the leaves and what do they spell?", back: "The leaves are terminals; read left to right they spell the string being parsed. Internal nodes are non-terminals." },
]);
