CS.registerFlashcards("3.1", [
  { front: "DFS hand method: what do you do with the vertex on top of the stack?", back: "If it has an unvisited neighbour, visit the first one (alphabetically) and **push** it. If not, **pop** it (backtrack)." },
  { front: "BFS hand method: one iteration", back: "Dequeue the front vertex; for each unvisited neighbour (alphabetically) mark visited and enqueue at the rear." },
  { front: "Graph with edges A–B, A–D, A–G, B–E, B–F, C–F, C–H, D–F, E–G. DFS and BFS orders from A?", back: "DFS: **A B E G F C H D**\nBFS: **A B D G E F C H**" },
  { front: "Time complexity of DFS/BFS: adjacency list vs adjacency matrix", back: "List: **O(V + E)**. Matrix: **O(V²)** (each vertex's row of V cells must be scanned)." },
  { front: "Give three applications of breadth-first search", back: "Shortest path (fewest edges) in an unweighted graph · friends-of-friends / degrees of separation · web crawler layer by layer · broadcasting within k hops" },
  { front: "Give three applications of depth-first search", back: "Maze solving / backtracking puzzles · cycle detection · topological ordering of tasks · checking whether a path exists / connected components" },
  { front: "Why is DFS naturally recursive?", back: "Each call pushes a stack frame and each return pops one, so the call stack does the job of the DFS stack; returning = backtracking." },
  { front: "When should a vertex be marked visited in BFS?", back: "When it is **discovered and enqueued**, so it can never be put in the queue twice." },
]);
