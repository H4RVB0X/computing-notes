CS.registerFlashcards("11.1", [
  { front: "State the three Vs of Big Data with the AQA wording.", back: "**Volume**: too big to fit on a single server.\n**Velocity**: streaming data, responses needed in milliseconds to seconds.\n**Variety**: data in many forms, structured and unstructured, text and multimedia." },
  { front: "Give four features of functional programming that make it suitable for distributed Big Data processing.", back: "Immutable data · no side effects (pure functions) · statelessness · higher-order functions such as map and reduce/fold." },
  { front: "Why do immutable data structures help when processing in parallel?", back: "No process can change data another process is using, so there are no race conditions and no locking is needed." },
  { front: "Why does 'no side effects' help when distributing code?", back: "Same input → same output, so functions can run in any order, on any machine, and failed tasks can be re-run safely." },
  { front: "Name the three stages of a MapReduce job.", back: "**Map** (apply a function to each chunk in parallel → key–value pairs), **shuffle** (group pairs by key), **reduce** (fold each group to one value)." },
  { front: "Map → shuffle → reduce word count on \"a b a\" and \"b a\": what are the results?", back: "Map: (a,1)(b,1)(a,1) and (b,1)(a,1). Shuffle: a:[1,1,1], b:[1,1]. Reduce: a → 3, b → 2." },
  { front: "Give three properties of a fact in the fact-based model.", back: "Atomic (one piece of information) · timestamped · immutable (never updated or deleted)." },
  { front: "How is a graph schema drawn?", back: "Nodes = ovals (entities). Edges = labelled solid lines between nodes (relationships, may be directed). Properties = rectangles joined to a node by dashed lines." },
  { front: "Give two reasons relational databases struggle with Big Data.", back: "They need a fixed schema (rows and columns) but Big Data is mostly unstructured; they work best on one server, but distributed joins and locking are slow." },
  { front: "Give two advantages of the fact-based model.", back: "Full history kept, so data can be queried at any point in time; erroneous facts don't destroy earlier correct data; append-only suits parallel writes; new fact types can be added easily." },
]);
