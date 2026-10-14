CS.registerFlashcards("2.4", [
  { front: "Adjacency matrix vs list: which uses less memory for a **sparse** graph, and why?", back: "The list — it only stores edges that exist; a matrix always has n² cells, mostly empty for a sparse graph." },
  { front: "Adjacency matrix vs list: which tests 'is there an edge between i and j?' faster?", back: "The matrix — a single look-up m[i][j]. The list must be searched." },
  { front: "How can you tell from its adjacency matrix that a graph is undirected?", back: "The matrix is symmetric about the leading diagonal: m[i][j] = m[j][i] for every i, j." },
  { front: "In a directed graph's adjacency matrix, what do rows and columns mean?", back: "Row = the vertex the edge comes **from**, column = the vertex it goes **to** (state your convention)." },
  { front: "What goes in a weighted adjacency matrix where there is no edge?", back: "∞ (or a blank/null/dash) — not 0, because 0 could be a real weight. State the convention." },
  { front: "Give four typical uses of graphs.", back: "Route planning/sat-nav · social networks · Internet routing · web page links · task dependencies/scheduling · FSM state diagrams" },
  { front: "An undirected graph has 7 edges. How many 1s are in its adjacency matrix?", back: "14 — each edge is recorded twice." },
  { front: "Define degree of a vertex.", back: "The number of edges connected to it (its number of neighbours in a simple graph). In a matrix: the row total." },
]);
