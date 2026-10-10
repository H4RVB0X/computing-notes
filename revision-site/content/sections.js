/* =====================================================================
   sections.js — the site map: every section, page and AQA 7517 spec point.
   Spec point ids follow the AQA specification numbering (4.x.y.z). Where a
   spec sub-section has several bullet points, they are split into separate
   rows with a letter suffix (e.g. 4.1.1.2a) so the checklist is granular.
   ===================================================================== */
window.CS = window.CS || {};
CS.sections = [
  {
    id: "1", spec: "4.1", title: "Fundamentals of programming", short: "Programming",
    blurb: "Data types, program constructs, subroutines, recursion and the procedural and object-oriented paradigms. Paper 1.",
    topics: [
      { id: "1.1", title: "Data types, variables and constants", spec: ["4.1.1.1", "4.1.1.2", "4.1.1.6"], specPoints: [
        { id: "4.1.1.1a", text: "Understand the concept of a data type" },
        { id: "4.1.1.1b", text: "Understand and use integer, real/float, Boolean, character, string, date/time, pointer/reference, records and arrays appropriately" },
        { id: "4.1.1.1c", text: "Define and use user-defined data types based on built-in types" },
        { id: "4.1.1.2a", text: "Use and combine variable declaration, constant declaration, assignment, iteration, selection and subroutine statements" },
        { id: "4.1.1.6a", text: "Explain the differences between a variable and a constant" },
        { id: "4.1.1.6b", text: "Explain the advantages of using named constants" } ] },
      { id: "1.2", title: "Sequence, selection and iteration", spec: ["4.1.1.2"], specPoints: [
        { id: "4.1.1.2b", text: "Use definite and indefinite iteration, including indefinite iteration with the condition at the start or the end of the loop" },
        { id: "4.1.1.2c", text: "Use nested selection and nested iteration structures" },
        { id: "4.1.1.2d", text: "Use meaningful identifier names and know why it is important to use them" } ] },
      { id: "1.3", title: "Arithmetic, relational and Boolean operators", spec: ["4.1.1.3", "4.1.1.4", "4.1.1.5"], specPoints: [
        { id: "4.1.1.3", text: "Use addition, subtraction, multiplication, real division, integer division including remainders, exponentiation, rounding and truncation" },
        { id: "4.1.1.4", text: "Use equal to, not equal to, less than, greater than, less than or equal to, greater than or equal to" },
        { id: "4.1.1.5", text: "Use NOT, AND, OR and XOR" } ] },
      { id: "1.4", title: "Strings, random numbers and exception handling", spec: ["4.1.1.7", "4.1.1.8", "4.1.1.9"], specPoints: [
        { id: "4.1.1.7", text: "Use length, position, substring, concatenation, character ↔ character code and string conversion operations" },
        { id: "4.1.1.8", text: "Be familiar with, and be able to use, random number generation" },
        { id: "4.1.1.9a", text: "Be familiar with the concept of exception handling" },
        { id: "4.1.1.9b", text: "Know how to use exception handling in a programming language" } ] },
      { id: "1.5", title: "Subroutines, parameters and scope", spec: ["4.1.1.10", "4.1.1.11", "4.1.1.12", "4.1.1.13", "4.1.1.14"], specPoints: [
        { id: "4.1.1.10a", text: "Know that a subroutine is a named 'out of line' block of code called by writing its name" },
        { id: "4.1.1.10b", text: "Explain the advantages of using subroutines in programs" },
        { id: "4.1.1.11", text: "Describe the use of parameters to pass data within programs and use subroutines with interfaces" },
        { id: "4.1.1.12", text: "Use subroutines that return values to the calling routine" },
        { id: "4.1.1.13", text: "Know that local variables exist only while the subroutine executes and are accessible only within it; explain why using them is good practice" },
        { id: "4.1.1.14", text: "Contrast local variables with global variables" } ] },
      { id: "1.6", title: "Stack frames and recursion", spec: ["4.1.1.15", "4.1.1.16"], specPoints: [
        { id: "4.1.1.15", text: "Explain how a stack frame is used with subroutine calls to store return addresses, parameters and local variables" },
        { id: "4.1.1.16a", text: "Be familiar with recursive techniques: general and base cases and the mechanism for implementation" },
        { id: "4.1.1.16b", text: "Solve simple problems using recursion" } ] },
      { id: "1.7", title: "Programming paradigms and structured programming", spec: ["4.1.2.1", "4.1.2.2"], specPoints: [
        { id: "4.1.2.1", text: "Understand the characteristics of the procedural and object-oriented paradigms and have experience of programming in each" },
        { id: "4.1.2.2a", text: "Understand the structured approach to program design and construction" },
        { id: "4.1.2.2b", text: "Construct and use hierarchy charts when designing programs" },
        { id: "4.1.2.2c", text: "Explain the advantages of the structured approach" } ] },
      { id: "1.8", title: "Object-oriented programming", spec: ["4.1.2.3"], specPoints: [
        { id: "4.1.2.3a", text: "Be familiar with class, object, instantiation, encapsulation, inheritance, aggregation, association aggregation, composition aggregation, polymorphism and overriding" },
        { id: "4.1.2.3b", text: "Know why the object-oriented paradigm is used" },
        { id: "4.1.2.3c", text: "Be aware of the design principles: encapsulate what varies, favour composition over inheritance, program to interfaces not implementation" },
        { id: "4.1.2.3d", text: "Write object-oriented programs" },
        { id: "4.1.2.3e", text: "Draw and interpret class diagrams" } ] },
    ],
  },
  {
    id: "2", spec: "4.2", title: "Fundamentals of data structures", short: "Data structures",
    blurb: "Arrays, files, queues, stacks, graphs, trees, hash tables, dictionaries and vectors. Paper 1.",
    topics: [
      { id: "2.1", title: "Data structures, arrays, records, files and lists", spec: ["4.2.1.1", "4.2.1.2", "4.2.1.3", "4.2.1.4"], specPoints: [
        { id: "4.2.1.1", text: "Be familiar with the concept of data structures" },
        { id: "4.2.1.2", text: "Use single- and multi-dimensional arrays (or equivalent) in the design of solutions to simple problems" },
        { id: "4.2.1.3a", text: "Read/write from/to a text file" },
        { id: "4.2.1.3b", text: "Read/write data from/to a binary (non-text) file" },
        { id: "4.2.1.4a", text: "Be familiar with the concept and uses of queue, stack, list, graph, tree, hash table, dictionary and vector" },
        { id: "4.2.1.4b", text: "Distinguish between static and dynamic structures, compare their uses and explain the advantages and disadvantages of each" },
        { id: "4.2.1.4c", text: "Describe the creation and maintenance of data within queues (linear, circular, priority), stacks and hash tables" } ] },
      { id: "2.2", title: "Queues", spec: ["4.2.2.1"], specPoints: [
        { id: "4.2.2.1", text: "Describe and apply add, remove, test for empty and test for full to linear, circular and priority queues" } ] },
      { id: "2.3", title: "Stacks", spec: ["4.2.3.1"], specPoints: [
        { id: "4.2.3.1", text: "Describe and apply push, pop, peek/top, test for empty and test for full on a stack" } ] },
      { id: "2.4", title: "Graphs", spec: ["4.2.4.1"], specPoints: [
        { id: "4.2.4.1a", text: "Be aware of a graph as a data structure used to represent more complex relationships and be familiar with typical uses" },
        { id: "4.2.4.1b", text: "Explain the terms graph, weighted graph, vertex/node, edge/arc, undirected graph and directed graph" },
        { id: "4.2.4.1c", text: "Know how an adjacency matrix and an adjacency list represent a graph, and compare them" } ] },
      { id: "2.5", title: "Trees", spec: ["4.2.5.1"], specPoints: [
        { id: "4.2.5.1a", text: "Know that a tree is a connected, undirected graph with no cycles" },
        { id: "4.2.5.1b", text: "Know that a rooted tree has a designated root with every edge directed away from it; know what a binary tree is" },
        { id: "4.2.5.1c", text: "Be familiar with typical uses for rooted trees" } ] },
      { id: "2.6", title: "Hash tables", spec: ["4.2.6.1"], specPoints: [
        { id: "4.2.6.1a", text: "Be familiar with the concept of a hash table and its uses" },
        { id: "4.2.6.1b", text: "Apply simple hashing algorithms" },
        { id: "4.2.6.1c", text: "Know what a collision is and how collisions are handled using rehashing" } ] },
      { id: "2.7", title: "Dictionaries", spec: ["4.2.7.1"], specPoints: [
        { id: "4.2.7.1", text: "Be familiar with the concept of a dictionary, its applications (e.g. information retrieval) and using one in a programming language" } ] },
      { id: "2.8", title: "Vectors", spec: ["4.2.8.1"], specPoints: [
        { id: "4.2.8.1a", text: "Be familiar with the concept of a vector and the notations: list, n-vector over ℝ, function interpretation (0 ↦ 2.0 …); entries drawn from the same field" },
        { id: "4.2.8.1b", text: "Dictionary, list and 1-D array representations of a vector; visualising a vector as an arrow" },
        { id: "4.2.8.1c", text: "Vector addition, scalar-vector multiplication and convex combination of two vectors" },
        { id: "4.2.8.1d", text: "Dot (scalar) product of two vectors and its applications" } ] },
    ],
  },
  {
    id: "3", spec: "4.3", title: "Fundamentals of algorithms", short: "Algorithms",
    blurb: "Traversals, Reverse Polish, searching, sorting and Dijkstra's algorithm. Paper 1.",
    topics: [
      { id: "3.1", title: "Graph traversal: depth-first and breadth-first", spec: ["4.3.1.1"], specPoints: [
        { id: "4.3.1.1", text: "Trace breadth-first and depth-first search algorithms and describe typical applications of both" } ] },
      { id: "3.2", title: "Tree traversal", spec: ["4.3.2.1"], specPoints: [
        { id: "4.3.2.1a", text: "Trace pre-order, post-order and in-order tree traversals" },
        { id: "4.3.2.1b", text: "Describe uses of tree-traversal algorithms" } ] },
      { id: "3.3", title: "Reverse Polish notation", spec: ["4.3.3.1"], specPoints: [
        { id: "4.3.3.1", text: "Convert simple infix expressions to Reverse Polish notation and vice versa; be aware of why and where it is used" } ] },
      { id: "3.4", title: "Searching algorithms", spec: ["4.3.4.1", "4.3.4.2", "4.3.4.3"], specPoints: [
        { id: "4.3.4.1", text: "Know, trace and analyse the complexity of linear search" },
        { id: "4.3.4.2", text: "Know, trace and analyse the time complexity of binary search" },
        { id: "4.3.4.3", text: "Trace and analyse the time complexity of binary tree search" } ] },
      { id: "3.5", title: "Sorting algorithms", spec: ["4.3.5.1", "4.3.5.2"], specPoints: [
        { id: "4.3.5.1", text: "Know, trace and analyse the time complexity of bubble sort" },
        { id: "4.3.5.2", text: "Trace and analyse the time complexity of merge sort" } ] },
      { id: "3.6", title: "Dijkstra's shortest path algorithm", spec: ["4.3.6.1"], specPoints: [
        { id: "4.3.6.1", text: "Understand and trace Dijkstra's shortest path algorithm; be aware of applications of shortest path algorithms" } ] },
    ],
  },
  {
    id: "4", spec: "4.4", title: "Theory of computation", short: "Theory of computation",
    blurb: "Abstraction, finite state machines, sets, regular expressions, BNF, Big-O, the halting problem and Turing machines. Paper 1.",
    topics: [
      { id: "4.1", title: "Problem solving, algorithms and abstraction", spec: ["4.4.1.1", "4.4.1.2", "4.4.1.3", "4.4.1.4", "4.4.1.5", "4.4.1.6", "4.4.1.7", "4.4.1.8", "4.4.1.9", "4.4.1.10", "4.4.1.11"], specPoints: [
        { id: "4.4.1.1", text: "Develop and check solutions to simple logic problems" },
        { id: "4.4.1.2a", text: "Understand the term algorithm; express the solution to a simple problem as an algorithm using pseudo-code (sequence, assignment, selection, iteration)" },
        { id: "4.4.1.2b", text: "Hand-trace algorithms and convert pseudo-code into high level language code" },
        { id: "4.4.1.2c", text: "Articulate how a program works, arguing for its correctness and efficiency using logical reasoning, test data and user feedback" },
        { id: "4.4.1.3", text: "Abstraction: representational abstraction (removing unnecessary detail) and abstraction by generalisation/categorisation ('is a kind of')" },
        { id: "4.4.1.4", text: "Information hiding: hiding all details of an object that do not contribute to its essential characteristics" },
        { id: "4.4.1.5", text: "Procedural abstraction represents a computational method" },
        { id: "4.4.1.6", text: "Functional abstraction: the particular computation method is hidden" },
        { id: "4.4.1.7", text: "Data abstraction: how data are represented is hidden, allowing new data objects to be built from previously defined types" },
        { id: "4.4.1.8", text: "Problem abstraction/reduction: details are removed until the problem reduces to one already solved" },
        { id: "4.4.1.9", text: "Decomposition: breaking a problem into sub-problems each accomplishing an identifiable task" },
        { id: "4.4.1.10", text: "Composition: combining procedures to form compound procedures and data objects to form compound data (e.g. a tree)" },
        { id: "4.4.1.11", text: "Automation: putting models (abstractions) into action by creating algorithms, implementing them in code and data structures and executing the code" } ] },
      { id: "4.2", title: "Finite state machines", spec: ["4.4.2.1"], specPoints: [
        { id: "4.4.2.1", text: "Draw and interpret state transition diagrams and state transition tables for FSMs with no output and with output (Mealy machines only)" } ] },
      { id: "4.3", title: "Sets and the maths for regular expressions", spec: ["4.4.2.2"], specPoints: [
        { id: "4.4.2.2a", text: "Be familiar with the concept of a set and the notations A = {1, 2, 3} and set comprehension A = {x | x ∈ ℕ ∧ x ≥ 1}; the empty set {} or Ø" },
        { id: "4.4.2.2b", text: "Be familiar with the compact representation of a set, e.g. {0ⁿ1ⁿ | n ≥ 1}" },
        { id: "4.4.2.2c", text: "Finite sets, infinite sets, countably infinite sets, cardinality of a finite set, Cartesian product" },
        { id: "4.4.2.2d", text: "Subset, proper subset, countable set" },
        { id: "4.4.2.2e", text: "Set operations: membership, union, intersection, difference" } ] },
      { id: "4.4", title: "Regular expressions and regular languages", spec: ["4.4.2.3", "4.4.2.4"], specPoints: [
        { id: "4.4.2.3a", text: "Know that a regular expression is a way of describing a set and allows particular types of language to be described in shorthand" },
        { id: "4.4.2.3b", text: "Form and use simple regular expressions for string manipulation and matching" },
        { id: "4.4.2.3c", text: "Describe the relationship between regular expressions and FSMs; write a regex for a given FSM and vice versa" },
        { id: "4.4.2.4", text: "Know that a language is regular if it can be represented by a regular expression" } ] },
      { id: "4.5", title: "Backus-Naur Form and syntax diagrams", spec: ["4.4.3.1"], specPoints: [
        { id: "4.4.3.1a", text: "Check language syntax by referring to BNF or syntax diagrams and formulate simple production rules" },
        { id: "4.4.3.1b", text: "Explain why BNF can represent some languages that cannot be represented using regular expressions" } ] },
      { id: "4.6", title: "Big-O notation and classification of algorithms", spec: ["4.4.4.1", "4.4.4.2", "4.4.4.3"], specPoints: [
        { id: "4.4.4.1", text: "Understand that algorithms are compared by expressing complexity as a function of problem size; some are more efficient time-wise or space-wise" },
        { id: "4.4.4.2a", text: "Function as a mapping from domain to co-domain; linear, polynomial, exponential and logarithmic functions" },
        { id: "4.4.4.2b", text: "Permutation of n distinct objects is n factorial (n!)" },
        { id: "4.4.4.3a", text: "Use Big-O notation for constant, logarithmic, linear, polynomial and exponential time" },
        { id: "4.4.4.3b", text: "Derive the time complexity of an algorithm" } ] },
      { id: "4.7", title: "Limits of computation and the halting problem", spec: ["4.4.4.4", "4.4.4.5", "4.4.4.6", "4.4.4.7"], specPoints: [
        { id: "4.4.4.4", text: "Be aware that algorithmic complexity and hardware impose limits on what can be computed" },
        { id: "4.4.4.5", text: "Classify problems as tractable (polynomial-time solution) or intractable (no polynomial-time solution); heuristic methods" },
        { id: "4.4.4.6", text: "Be aware that some problems cannot be solved algorithmically" },
        { id: "4.4.4.7", text: "Describe the halting problem (not prove it) and understand its significance for computation" } ] },
      { id: "4.8", title: "Turing machines", spec: ["4.4.5.1"], specPoints: [
        { id: "4.4.5.1a", text: "Be familiar with the structure and use of Turing machines: finite set of states, finite alphabet, infinite tape, read-write head; start and halting states" },
        { id: "4.4.5.1b", text: "Understand the equivalence between a transition function and a state transition diagram; represent rules both ways; hand-trace simple Turing machines" },
        { id: "4.4.5.1c", text: "Explain the importance of Turing machines and the Universal Turing machine to the subject of computation" } ] },
    ],
  },
  {
    id: "5", spec: "4.5", title: "Fundamentals of data representation", short: "Data representation",
    blurb: "Number systems and bases, binary arithmetic, floating point, character codes, error checking, images, sound, compression and encryption. Paper 2.",
    topics: [
      { id: "5.1", title: "Number systems", spec: ["4.5.1.1", "4.5.1.2", "4.5.1.3", "4.5.1.4", "4.5.1.5", "4.5.1.6", "4.5.1.7"], specPoints: [
        { id: "4.5.1.1", text: "Natural numbers and the set ℕ (including zero)" },
        { id: "4.5.1.2", text: "Integers and the set ℤ" },
        { id: "4.5.1.3", text: "Rational numbers and the set ℚ, which includes the integers" },
        { id: "4.5.1.4", text: "Irrational numbers" },
        { id: "4.5.1.5", text: "Real numbers and the set ℝ, which includes ℕ, ℚ and the irrationals" },
        { id: "4.5.1.6", text: "Ordinal numbers and their use to describe numerical positions" },
        { id: "4.5.1.7", text: "Natural numbers for counting, real numbers for measurement" } ] },
      { id: "5.2", title: "Number bases: binary and hexadecimal", spec: ["4.5.2.1"], specPoints: [
        { id: "4.5.2.1a", text: "Be familiar with decimal (base 10), binary (base 2) and hexadecimal (base 16)" },
        { id: "4.5.2.1b", text: "Convert between decimal, binary and hexadecimal" },
        { id: "4.5.2.1c", text: "Use hexadecimal as shorthand for binary and understand why it is used in this way" } ] },
      { id: "5.3", title: "Units of information", spec: ["4.5.3.1", "4.5.3.2"], specPoints: [
        { id: "4.5.3.1a", text: "The bit is the fundamental unit of information; a byte is a group of 8 bits" },
        { id: "4.5.3.1b", text: "2ⁿ different values can be represented with n bits" },
        { id: "4.5.3.2", text: "Binary prefixes (kibi, mebi, gibi, tebi: powers of 2) and decimal prefixes (kilo, mega, giga, tera: powers of 10)" } ] },
      { id: "5.4", title: "Binary integers and two's complement", spec: ["4.5.4.1", "4.5.4.2", "4.5.4.3"], specPoints: [
        { id: "4.5.4.1", text: "Difference between unsigned and signed binary; in unsigned binary with n bits the range is 0 to 2ⁿ − 1" },
        { id: "4.5.4.2", text: "Add two unsigned binary integers and multiply two unsigned binary integers" },
        { id: "4.5.4.3a", text: "Represent negative and positive integers in two's complement" },
        { id: "4.5.4.3b", text: "Perform subtraction using two's complement" },
        { id: "4.5.4.3c", text: "Calculate the range of a given number of bits in two's complement" } ] },
      { id: "5.5", title: "Fixed point and floating point", spec: ["4.5.4.4", "4.5.4.5", "4.5.4.6", "4.5.4.7", "4.5.4.8", "4.5.4.9"], specPoints: [
        { id: "4.5.4.4a", text: "Represent numbers with a fractional part in fixed point and in floating point binary with a given number of bits" },
        { id: "4.5.4.4b", text: "Convert decimal ↔ binary for both representations" },
        { id: "4.5.4.5", text: "Explain why both fixed point and floating point representations may be inaccurate (rounding errors)" },
        { id: "4.5.4.6", text: "Calculate absolute and relative errors; compare them for large, small and near-one magnitudes" },
        { id: "4.5.4.7", text: "Compare fixed point and floating point in terms of range, precision and speed of calculation" },
        { id: "4.5.4.8", text: "Know why floating point numbers are normalised; normalise numbers with positive or negative mantissas" },
        { id: "4.5.4.9", text: "Explain underflow and overflow and the circumstances in which they occur" } ] },
      { id: "5.6", title: "Character coding and error checking", spec: ["4.5.5.1", "4.5.5.2", "4.5.5.3"], specPoints: [
        { id: "4.5.5.1", text: "Differentiate between the character code representation of a decimal digit and its pure binary representation" },
        { id: "4.5.5.2", text: "Describe ASCII and Unicode and explain why Unicode was introduced" },
        { id: "4.5.5.3", text: "Describe and explain parity bits, majority voting, checksums and check digits" } ] },
      { id: "5.7", title: "Images and sound", spec: ["4.5.6.1", "4.5.6.2", "4.5.6.3", "4.5.6.4", "4.5.6.5", "4.5.6.6", "4.5.6.7", "4.5.6.8"], specPoints: [
        { id: "4.5.6.1", text: "Describe how bit patterns may represent other forms of data including graphics and sound" },
        { id: "4.5.6.2", text: "Understand the difference between analogue and digital data and signals" },
        { id: "4.5.6.3", text: "Describe the principles of operation of an ADC and a DAC; ADCs are used with analogue sensors; DACs convert digital audio to analogue" },
        { id: "4.5.6.4", text: "Explain how bitmaps are represented: resolution, colour depth, size in pixels; calculate storage requirements; be familiar with typical metadata" },
        { id: "4.5.6.5", text: "Explain how vector graphics represent images using lists of objects; typical properties; use primitives to create a simple vector graphic" },
        { id: "4.5.6.6", text: "Compare vector and bitmapped graphics, their advantages/disadvantages and appropriate uses" },
        { id: "4.5.6.7", text: "Describe digital sound in terms of sample resolution, sampling rate and Nyquist's theorem; calculate sound sample sizes in bytes" },
        { id: "4.5.6.8", text: "Describe the purpose of MIDI, the use of event messages, and the advantages of MIDI files" } ] },
      { id: "5.8", title: "Compression and encryption", spec: ["4.5.6.9", "4.5.6.10"], specPoints: [
        { id: "4.5.6.9a", text: "Know why images, sound and other files are compressed; difference between lossless and lossy compression and advantages/disadvantages of each" },
        { id: "4.5.6.9b", text: "Explain run length encoding and dictionary-based lossless compression" },
        { id: "4.5.6.10a", text: "Define encryption; be familiar with the terms cipher, plaintext and ciphertext" },
        { id: "4.5.6.10b", text: "Apply the Caesar cipher to encrypt and decrypt; explain why it is easily cracked" },
        { id: "4.5.6.10c", text: "Apply the Vernam cipher (one-time pad); explain why it has perfect security" },
        { id: "4.5.6.10d", text: "Compare the Vernam cipher with ciphers that depend on computational security" } ] },
    ],
  },
  {
    id: "6", spec: "4.6", title: "Fundamentals of computer systems", short: "Computer systems",
    blurb: "Hardware and software, the operating system, language classification, translators, logic gates and Boolean algebra. Paper 2.",
    topics: [
      { id: "6.1", title: "Hardware, software and the operating system", spec: ["4.6.1.1", "4.6.1.2", "4.6.1.3", "4.6.1.4"], specPoints: [
        { id: "4.6.1.1", text: "Understand the relationship between hardware and software and define both terms" },
        { id: "4.6.1.2", text: "Explain system software and application software; understand the need for and attributes of different types of software" },
        { id: "4.6.1.3", text: "Understand the need for and functions of operating systems, utility programs, libraries and translators (compiler, assembler, interpreter)" },
        { id: "4.6.1.4", text: "The OS creates a virtual machine hiding hardware complexity; it manages resources (processors, memory, I/O) among competing processes" } ] },
      { id: "6.2", title: "Classification of programming languages", spec: ["4.6.2.1"], specPoints: [
        { id: "4.6.2.1a", text: "Awareness of the development of programming languages and their classification into low- and high-level; machine code and assembly language are low-level; imperative high-level languages" },
        { id: "4.6.2.1b", text: "Describe machine code and assembly language; advantages and disadvantages compared with high-level languages" },
        { id: "4.6.2.1c", text: "Explain the term imperative high-level language and its relationship to low-level languages" } ] },
      { id: "6.3", title: "Program translators", spec: ["4.6.3.1"], specPoints: [
        { id: "4.6.3.1a", text: "Understand the role of assembler, compiler and interpreter; explain the differences between compilation and interpretation and when each is appropriate" },
        { id: "4.6.3.1b", text: "Explain why some compilers produce an intermediate language such as bytecode and how it is subsequently used" },
        { id: "4.6.3.1c", text: "Understand the difference between source code and object (executable) code" } ] },
      { id: "6.4", title: "Logic gates and circuits", spec: ["4.6.4.1"], specPoints: [
        { id: "4.6.4.1a", text: "Construct truth tables for NOT, AND, OR, XOR, NAND and NOR" },
        { id: "4.6.4.1b", text: "Draw and interpret logic circuit diagrams; complete a truth table for a circuit; write a Boolean expression for a circuit; draw a circuit for a Boolean expression" },
        { id: "4.6.4.1c", text: "Recognise and trace the logic of half-adder and full-adder circuits; construct a half-adder" },
        { id: "4.6.4.1d", text: "Be familiar with the use of the edge-triggered D-type flip-flop as a memory unit" } ] },
      { id: "6.5", title: "Boolean algebra", spec: ["4.6.5.1"], specPoints: [
        { id: "4.6.5.1", text: "Use Boolean identities and De Morgan's laws to manipulate and simplify Boolean expressions" } ] },
    ],
  },
  {
    id: "7", spec: "4.7", title: "Computer organisation and architecture", short: "Organisation & architecture",
    blurb: "Internal components and buses, the stored program concept, the fetch-execute cycle, assembly language, interrupts, performance and external devices. Paper 2.",
    topics: [
      { id: "7.1", title: "Internal hardware components and buses", spec: ["4.7.1.1"], specPoints: [
        { id: "4.7.1.1a", text: "Understand the role of the processor, main memory, address bus, data bus, control bus and I/O controllers and how they relate" },
        { id: "4.7.1.1b", text: "Understand the need for and means of communication between components: the concept of a bus and how the address, data and control buses are used" },
        { id: "4.7.1.1c", text: "Explain the difference between von Neumann and Harvard architectures and where each is typically used" },
        { id: "4.7.1.1d", text: "Understand the concept of addressable memory" } ] },
      { id: "7.2", title: "The stored program concept and the processor", spec: ["4.7.2.1", "4.7.3.1", "4.7.3.2"], specPoints: [
        { id: "4.7.2.1", text: "Describe the stored program concept: machine code instructions stored in main memory are fetched and executed serially by a processor that performs arithmetic and logical operations" },
        { id: "4.7.3.1", text: "Explain the role and operation of the ALU, control unit, clock, general-purpose registers and the dedicated registers PC, CIR, MAR, MBR and status register" },
        { id: "4.7.3.2", text: "Explain how the fetch-execute cycle executes machine code programs: fetch, decode, execute and the registers used" } ] },
      { id: "7.3", title: "Instruction sets and assembly language", spec: ["4.7.3.3", "4.7.3.4", "4.7.3.5"], specPoints: [
        { id: "4.7.3.3", text: "Understand the term processor instruction set and that it is processor specific; instructions consist of an opcode and one or more operands" },
        { id: "4.7.3.4", text: "Understand and apply immediate and direct addressing modes" },
        { id: "4.7.3.5", text: "Understand and apply load, add, subtract, store, branching (conditional/unconditional), compare, logical bitwise AND/OR/NOT/XOR, shift left/right and halt in assembly language" } ] },
      { id: "7.4", title: "Interrupts and processor performance", spec: ["4.7.3.6", "4.7.3.7"], specPoints: [
        { id: "4.7.3.6", text: "Describe the role of interrupts and interrupt service routines, their effect on the fetch-execute cycle and the need to save the volatile environment" },
        { id: "4.7.3.7", text: "Explain the effect on performance of multiple cores, cache memory, clock speed, word length, address bus width and data bus width" } ] },
      { id: "7.5", title: "External hardware devices", spec: ["4.7.4.1", "4.7.4.2"], specPoints: [
        { id: "4.7.4.1", text: "Know the characteristics, purposes, suitability and principles of operation of barcode readers, digital cameras, laser printers and RFID" },
        { id: "4.7.4.2a", text: "Explain the need for secondary storage" },
        { id: "4.7.4.2b", text: "Know the characteristics, purposes, suitability and principles of operation of hard disks, optical disks and SSDs; compare capacity and speed and judge suitability" } ] },
    ],
  },
  {
    id: "8", spec: "4.8", title: "Consequences of uses of computing", short: "Consequences of computing",
    blurb: "Moral, ethical, legal and cultural issues, legislation, and how to write extended discursive answers. Paper 2.",
    topics: [
      { id: "8.1", title: "Moral, ethical, legal and cultural issues", spec: ["4.8.1.1"], specPoints: [
        { id: "4.8.1.1a", text: "Show awareness of current individual (moral), social (ethical), legal and cultural opportunities and risks of computing" },
        { id: "4.8.1.1b", text: "Understand that digital technology has transformed the capacity to monitor behaviour, amass and analyse personal information, and distribute/publish/disseminate it" },
        { id: "4.8.1.1c", text: "Computer scientists and software engineers have power and responsibility in the algorithms they devise and code they deploy; software and algorithms embed moral and cultural values" },
        { id: "4.8.1.1d", text: "The issue of scale creates potential for great good and great harm" } ] },
      { id: "8.2", title: "Legislation and the challenges for legislators", spec: ["4.8.1.1"], specPoints: [
        { id: "4.8.1.1e", text: "Discuss the challenges facing legislators in the digital age" },
        { id: "4.8.1.1f", text: "Be aware of relevant UK legislation (Computer Misuse Act, Data Protection Act 2018/UK GDPR, Copyright Designs and Patents Act, Investigatory Powers Act, Equality Act, Freedom of Information Act)" } ] },
      { id: "8.3", title: "Writing extended discursive answers", spec: ["4.8.1.1"], specPoints: [
        { id: "4.8.1.1g", text: "Structure a balanced 9- or 12-mark discussion that reaches a justified conclusion using the AQA levels of response" } ] },
    ],
  },
  {
    id: "9", spec: "4.9", title: "Fundamentals of communication and networking", short: "Communication & networking",
    blurb: "Transmission, topologies, wireless, the Internet, security, TCP/IP, IP addressing and the client-server model. Paper 2.",
    topics: [
      { id: "9.1", title: "Communication methods and basics", spec: ["4.9.1.1", "4.9.1.2"], specPoints: [
        { id: "4.9.1.1a", text: "Define serial and parallel transmission and discuss the advantages of serial over parallel" },
        { id: "4.9.1.1b", text: "Define and compare synchronous and asynchronous transmission; purpose of start and stop bits" },
        { id: "4.9.1.2a", text: "Define baud rate, bit rate, bandwidth, latency and protocol" },
        { id: "4.9.1.2b", text: "Differentiate baud rate and bit rate; understand the relationship between bit rate and bandwidth" } ] },
      { id: "9.2", title: "Networking: topologies, types and wireless", spec: ["4.9.2.1", "4.9.2.2", "4.9.2.3"], specPoints: [
        { id: "4.9.2.1", text: "Understand physical star and logical bus topologies: differentiate, explain their operation and compare them" },
        { id: "4.9.2.2", text: "Explain peer-to-peer and client-server networking and where each is used" },
        { id: "4.9.2.3a", text: "Explain the purpose of WiFi; components required for wireless networking; how wireless networks are secured" },
        { id: "4.9.2.3b", text: "Explain CSMA/CA with and without RTS/CTS" },
        { id: "4.9.2.3c", text: "Be familiar with the purpose of the SSID" } ] },
      { id: "9.3", title: "The Internet: structure, routing and DNS", spec: ["4.9.3.1"], specPoints: [
        { id: "4.9.3.1a", text: "Understand the structure of the Internet; the role of packet switching and routers; main components of a packet" },
        { id: "4.9.3.1b", text: "Define router and gateway and consider where and why they are used; explain how routing is achieved across the Internet" },
        { id: "4.9.3.1c", text: "Describe URL, domain name and IP address; how domain names are organised; the domain name service and DNS; Internet registries" } ] },
      { id: "9.4", title: "Internet security", spec: ["4.9.3.2"], specPoints: [
        { id: "4.9.3.2a", text: "Understand how a firewall works: packet filtering, proxy server, stateful inspection" },
        { id: "4.9.3.2b", text: "Explain symmetric and asymmetric (private/public key) encryption and key exchange" },
        { id: "4.9.3.2c", text: "Explain how digital certificates and digital signatures are obtained and used" },
        { id: "4.9.3.2d", text: "Discuss worms, trojans and viruses and the vulnerabilities they exploit; how improved code quality, monitoring and protection address them" } ] },
      { id: "9.5", title: "TCP/IP, protocols, ports and sockets", spec: ["4.9.4.1", "4.9.4.2"], specPoints: [
        { id: "4.9.4.1a", text: "Describe the role of the four layers of the TCP/IP stack (application, transport, network, link)" },
        { id: "4.9.4.1b", text: "Describe the role of sockets; MAC addresses; well-known ports vs client ports" },
        { id: "4.9.4.2a", text: "Be familiar with FTP, HTTP, HTTPS, POP3, SMTP and SSH; FTP anonymous and non-anonymous access" },
        { id: "4.9.4.2b", text: "SSH for remote management; using an SSH client to make a TCP connection to a remote port and send application-level commands (GET, SMTP, POP3)" },
        { id: "4.9.4.2c", text: "Explain the roles of an email server, a web server and a web browser" } ] },
      { id: "9.6", title: "IP addressing, subnets, DHCP and NAT", spec: ["4.9.4.3", "4.9.4.4", "4.9.4.5", "4.9.4.6", "4.9.4.7", "4.9.4.8", "4.9.4.9"], specPoints: [
        { id: "4.9.4.3", text: "An IP address is split into a network identifier and a host identifier" },
        { id: "4.9.4.4", text: "Know how a subnet mask identifies the network identifier part of an IP address" },
        { id: "4.9.4.5", text: "IPv4 and IPv6 exist; know why IPv6 was introduced" },
        { id: "4.9.4.6", text: "Distinguish between routable (public) and non-routable (private) IP addresses" },
        { id: "4.9.4.7", text: "Understand the purpose and function of DHCP" },
        { id: "4.9.4.8", text: "Explain the basic concept of NAT and why it is used" },
        { id: "4.9.4.9", text: "Explain the basic concept of port forwarding and why it is used" } ] },
      { id: "9.7", title: "Client-server, REST, WebSocket and thin/thick clients", spec: ["4.9.4.10", "4.9.4.11"], specPoints: [
        { id: "4.9.4.10a", text: "Be familiar with the client-server model and the WebSocket protocol: why and where it is used" },
        { id: "4.9.4.10b", text: "Principles of Web CRUD applications and REST: GET→SELECT, POST→INSERT, PUT→UPDATE, DELETE→DELETE" },
        { id: "4.9.4.10c", text: "Compare JSON with XML" },
        { id: "4.9.4.11", text: "Compare and contrast thin-client and thick-client computing" } ] },
    ],
  },
  {
    id: "10", spec: "4.10", title: "Fundamentals of databases", short: "Databases",
    blurb: "Data modelling, relational databases, normalisation to 3NF, SQL and client-server databases. Paper 2.",
    topics: [
      { id: "10.1", title: "Data modelling and entity relationship diagrams", spec: ["4.10.1.1"], specPoints: [
        { id: "4.10.1.1a", text: "Produce a data model from given data requirements for a simple scenario involving multiple entities" },
        { id: "4.10.1.1b", text: "Produce entity relationship diagrams and entity descriptions in the form Entity1(Attribute1, Attribute2, …)" } ] },
      { id: "10.2", title: "Relational databases", spec: ["4.10.2.1"], specPoints: [
        { id: "4.10.2.1a", text: "Explain the concept of a relational database" },
        { id: "4.10.2.1b", text: "Define attribute, primary key, composite primary key and foreign key" } ] },
      { id: "10.3", title: "Normalisation", spec: ["4.10.3.1"], specPoints: [
        { id: "4.10.3.1a", text: "Normalise relations to third normal form" },
        { id: "4.10.3.1b", text: "Understand why databases are normalised" } ] },
      { id: "10.4", title: "SQL", spec: ["4.10.4.1"], specPoints: [
        { id: "4.10.4.1a", text: "Use SQL to retrieve, update, insert and delete data from multiple tables of a relational database" },
        { id: "4.10.4.1b", text: "Use SQL to define a database table" } ] },
      { id: "10.5", title: "Client-server databases", spec: ["4.10.5.1"], specPoints: [
        { id: "4.10.5.1a", text: "Know that a client-server database system provides simultaneous access for multiple clients" },
        { id: "4.10.5.1b", text: "Know how concurrent access can be controlled to preserve the integrity of the database (record locks, serialisation, timestamp ordering, commitment ordering)" } ] },
    ],
  },
  {
    id: "11", spec: "4.11", title: "Big Data", short: "Big Data",
    blurb: "Volume, velocity and variety; fact-based models and graph schemas; distributed processing and why functional programming helps. Paper 2.",
    topics: [
      { id: "11.1", title: "Big Data", spec: ["4.11.1.1"], specPoints: [
        { id: "4.11.1.1a", text: "Know that Big Data is a catch-all term for data that won't fit the usual containers, described by volume, velocity and variety" },
        { id: "4.11.1.1b", text: "When data won't fit on one server, processing must be distributed; functional programming helps write correct, efficient distributed code; know which features of FP make this easier" },
        { id: "4.11.1.1c", text: "Be familiar with the fact-based model for representing data and the graph schema (nodes, edges, properties) for capturing dataset structure" } ] },
    ],
  },
  {
    id: "12", spec: "4.12", title: "Fundamentals of functional programming", short: "Functional programming",
    blurb: "Function types, first-class functions, partial application, composition, map/filter/fold and list processing in Haskell. Paper 2.",
    topics: [
      { id: "12.1", title: "The functional programming paradigm", spec: ["4.12.1.1", "4.12.1.2", "4.12.1.3", "4.12.1.4", "4.12.1.5"], specPoints: [
        { id: "4.12.1.1", text: "A function f has type f: A → B; A is the domain and B the co-domain; both are subsets of objects in some data type" },
        { id: "4.12.1.2", text: "A function is a first-class object: it can be an argument to another function and the result of a function call" },
        { id: "4.12.1.3", text: "Function application means a function applied to its arguments" },
        { id: "4.12.1.4", text: "Partial function application for one, two and three argument functions, using the spec's notation" },
        { id: "4.12.1.5", text: "Composition of functions" } ] },
      { id: "12.2", title: "Writing functional programs: map, filter and fold", spec: ["4.12.2.1"], specPoints: [
        { id: "4.12.2.1a", text: "Construct simple programs in a functional programming language (Haskell)" },
        { id: "4.12.2.1b", text: "Higher-order functions: use map, filter and reduce/fold" } ] },
      { id: "12.3", title: "Lists in functional programming", spec: ["4.12.3.1"], specPoints: [
        { id: "4.12.3.1a", text: "Represent a list as a concatenation of a head and a tail; the head is an element and the tail is a list; a list can be empty" },
        { id: "4.12.3.1b", text: "Describe and apply: return head, return tail, test for empty list, return length, construct an empty list, prepend an item, append an item" } ] },
    ],
  },
  {
    id: "13", spec: "4.13", title: "Systematic approach to problem solving", short: "Problem solving",
    blurb: "Analysis, design, implementation, testing and evaluation — the software development lifecycle the NEA follows. Paper 1.",
    topics: [
      { id: "13.1", title: "Analysis, design, implementation, testing and evaluation", spec: ["4.13.1.1", "4.13.1.2", "4.13.1.3", "4.13.1.4", "4.13.1.5"], specPoints: [
        { id: "4.13.1.1", text: "Analysis: define the problem, establish requirements by interaction with intended users, create a data model; prototyping/agile approaches" },
        { id: "4.13.1.2", text: "Design: plan data structures, algorithms, modular structure and the human user interface; design can be iterative (prototyping/agile)" },
        { id: "4.13.1.3", text: "Implementation: models and algorithms implemented as data structures and code; iterative development solving the critical path first" },
        { id: "4.13.1.4", text: "Testing: test for errors using normal (typical), boundary and erroneous data; acceptance testing with the intended users" },
        { id: "4.13.1.5", text: "Evaluation: know the criteria for evaluating a computer system" } ] },
    ],
  },
  {
    id: "14", spec: "NEA", title: "Non-exam assessment (NEA) project guide", short: "NEA project",
    blurb: "A practical guide to the 75-mark computing practical project: analysis, documented design, technical solution, testing and evaluation.",
    topics: [
      { id: "14.1", title: "NEA overview, choosing a project and analysis", spec: ["NEA"], specPoints: [
        { id: "NEA.1", text: "Know how the NEA is structured and assessed (75 marks: analysis 9, documented design 12, technical solution 42, testing 8, evaluation 4)" },
        { id: "NEA.2", text: "Choose a project with enough technical complexity (level of technical skill) and a real end user" },
        { id: "NEA.3", text: "Produce an analysis: background, research, interviews, modelling, SMART objectives" } ] },
      { id: "14.2", title: "NEA design, development, testing and evaluation", spec: ["NEA"], specPoints: [
        { id: "NEA.4", text: "Produce a documented design: data structures, algorithms, modular structure, UI, validation, database design" },
        { id: "NEA.5", text: "Develop a technical solution that is complete, well-structured and demonstrates skills in the top band" },
        { id: "NEA.6", text: "Plan and evidence testing against the objectives, and evaluate honestly with end-user feedback" } ] },
    ],
  },
  {
    id: "P", spec: "", title: "Paper 1 skeleton program: Piles O' Tiles", short: "Skeleton: Piles O' Tiles",
    blurb: "Everything for the 2027 Paper 1 preliminary material: the game, every method explained, the bugs AQA left in, predicted Section C questions, Section D modifications with tested model answers, and Section B practice programs.",
    topics: [
      { id: "P.1", title: "Paper 1 overview and exam strategy", spec: ["7517/1"], specPoints: [
        { id: "P.1a", text: "Know the structure of Paper 1 (Sections A–D, marks and timing) and what each EAD question slot is likely to be" },
        { id: "P.1b", text: "Know how Section D code and screenshot answers are marked, and how to avoid losing those marks" } ] },
      { id: "P.2", title: "The game and the code: a method-by-method tour", spec: ["7517/1"], specPoints: [
        { id: "P.2a", text: "Explain the rules of Piles O' Tiles and how they are implemented" },
        { id: "P.2b", text: "Draw and explain the class diagram (aggregation, private vs protected attributes, encapsulation)" },
        { id: "P.2c", text: "Explain the purpose of every subroutine and trace the program flow from Main() to the end of a game" },
        { id: "P.2d", text: "Read and write the game file format and trace how LoadGame builds each pile" },
        { id: "P.2e", text: "Convert between (x, y) coordinates and list indices with __GetIndex and its inverse" } ] },
      { id: "P.3", title: "Bugs, weaknesses and unused features", spec: ["7517/1"], specPoints: [
        { id: "P.3a", text: "Identify and explain every bug, missing validation and unused feature in the skeleton, and how to fix each" } ] },
      { id: "P.4", title: "Section C: questions about the skeleton", spec: ["7517/1"], specPoints: [
        { id: "P.4a", text: "Answer identify / explain / trace questions on the skeleton code using precise technical vocabulary" } ] },
      { id: "P.5", title: "Section D: practice modifications", spec: ["7517/1"], specPoints: [
        { id: "P.5-validate", text: "Validate the pile coordinates (done unaided and tested)" },
        { id: "P.5-menu", text: "Accept lowercase and reject invalid menu choices (done unaided and tested)" },
        { id: "P.5-winner", text: "Announce a draw for any number of players (done unaided and tested)" },
        { id: "P.5-loadfix", text: "Fix the failed-load MaxScore bug (done unaided and tested)" },
        { id: "P.5-extra", text: "Extra turn after a match (done unaided and tested)" },
        { id: "P.5-bonus", text: "Use the pile bonus (done unaided and tested)" },
        { id: "P.5-stalemate", text: "End the game after 10 turns without a match (done unaided and tested)" },
        { id: "P.5-peek", text: "Peek power-up costing 1 point (done unaided and tested)" },
        { id: "P.5-save", text: "Save the game to a file (done unaided and tested)" },
        { id: "P.5-computer", text: "Computer player with a memory (done unaided and tested)" },
        { id: "P.5-wild", text: "Wild tiles with inheritance and polymorphism (done unaided and tested)" },
        { id: "P.5-points", text: "Require equal points as well as the same symbol for a match (done unaided and tested)" },
        { id: "P.5-penalty", text: "Penalty of 1 point for choosing an empty pile, never below 0 (done unaided and tested)" },
        { id: "P.5-players", text: "Choose the number of players and their names (done unaided and tested)" },
        { id: "P.5-matched", text: "Show each player's matched symbols (done unaided and tested)" },
        { id: "P.5-sortdiscard", text: "Display the discard in alphabetical order using your own sort (done unaided and tested)" },
        { id: "P.5-symbols", text: "Count the symbols left on the board with a dictionary (done unaided and tested)" },
        { id: "P.5-bonusempty", text: "Award a pile's bonus only when it is emptied (done unaided and tested)" },
        { id: "P.5-align", text: "Line up the board display for 10+ tiles and grids wider than 9 (done unaided and tested)" },
        { id: "P.5-endtop", text: "Rewrite Pile to use the end of the list as the top without changing behaviour (done unaided and tested)" },
        { id: "P.5-shuffle", text: "Shuffle-the-board option costing 2 points (done unaided and tested)" } ] },
      { id: "P.6", title: "Section B: writing a new program", spec: ["7517/1"], specPoints: [
        { id: "P.6a", text: "Write a short standalone program from a specification, with validation, and evidence it with a test" } ] },
    ],
  },
  {
    id: "R", spec: "", title: "Reference pages", short: "Reference",
    blurb: "Quick references you will come back to: pseudocode and Python, Boolean algebra and logic, exam technique.",
    topics: [
      { id: "R.1", title: "AQA pseudocode and Python reference", spec: ["4.1", "4.4.1.2"], specPoints: [
        { id: "R.1a", text: "Read and write AQA-style pseudocode for every construct that appears in exam questions" },
        { id: "R.1b", text: "Translate between pseudocode and Python fluently" } ] },
      { id: "R.2", title: "Boolean algebra and logic reference", spec: ["4.6.4", "4.6.5"], specPoints: [
        { id: "R.2a", text: "Recall every Boolean identity and De Morgan's laws and the truth table of every gate" } ] },
      { id: "R.3", title: "Exam technique and command words", spec: ["All"], specPoints: [
        { id: "R.3a", text: "Know what State, Describe, Explain, Discuss, Evaluate, Compare and Justify demand, and how marks are allocated for 2, 4, 6, 9 and 12-mark questions" } ] },
    ],
  },
];
