CS.registerFlashcards("3.6", [
  { front: "Dijkstra: initialisation", back: "Start vertex distance **0**, all others **∞**, previous = none, nothing visited." },
  { front: "Dijkstra: one iteration", back: "Visit the unvisited vertex with the smallest distance; for each unvisited neighbour, if dist(current) + weight < recorded distance, update distance and previous." },
  { front: "How do you read the shortest path from the final table?", back: "Start at the target, follow **previous** vertices back to the start, then reverse. Cost = target's distance." },
  { front: "Class graph shortest path A → G", back: "**A → C → D → F → G**, cost **12**" },
  { front: "Dijkstra time complexity", back: "Simple array: **O(V²)**. Priority queue (binary heap): **O((V + E) log V)**." },
  { front: "Why can't Dijkstra handle negative weights?", back: "It treats a visited vertex's distance as final; a later negative edge could make it shorter." },
  { front: "Applications of shortest path algorithms", back: "Satnav · network routing (OSPF) · game/robot pathfinding · flight/train planning · telecoms" },
  { front: "Dijkstra vs breadth-first search", back: "BFS: fewest edges, unweighted. Dijkstra: least total weight, weighted (non-negative)." },
]);
