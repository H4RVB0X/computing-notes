CS.registerTopic({ id: "2.4", title: "Graphs" }, function () {/*

:::objectives
- Explain what a **graph** is and why it is used to represent **complex relationships** that lists and trees cannot.
- Use the terms **vertex/node**, **edge/arc**, **weighted graph**, **undirected graph**, **directed graph**, neighbour, degree, path and cycle correctly.
- Build an **adjacency matrix** and an **adjacency list** for undirected, directed and weighted graphs, and draw a graph from either.
- **Compare** the two representations on memory and speed, and choose the right one for **sparse** and **dense** graphs.
- Give typical **uses** of graphs.
:::

:::quick At a glance
- A **graph** is a set of **vertices (nodes)** joined by **edges (arcs)**. It models relationships where anything can connect to anything.
- **Undirected**: edges work both ways. **Directed** (digraph): each edge has a direction, drawn as an arrow. **Weighted**: each edge carries a value (distance, time, cost).
- **Adjacency matrix**: a 2-D array; cell [row][col] = 1 (or the weight) if there is an edge from row to col, 0 (or ∞/blank) if not. Undirected → **symmetric** about the leading diagonal.
- **Adjacency list**: for each vertex, a list of its neighbours (with weights if weighted).
- Matrix: fast "is there an edge?" test, but n² memory — best for **dense** graphs.
- List: memory only for edges that exist — best for **sparse** graphs; slower edge test.
- Uses: maps and sat-nav, social networks, the Internet and routing, web links, task dependencies.
:::

:::keyterms
Graph :: A data structure consisting of a set of vertices (nodes) connected by a set of edges (arcs), used to represent relationships between items. :: Dots joined by lines.
Vertex (node) :: An object in a graph. :: A dot.
Edge (arc) :: A connection between two vertices. :: A line between two dots.
Undirected graph :: A graph in which edges have no direction, so each edge can be traversed both ways. :: Two-way roads.
Directed graph :: A graph in which each edge has a direction, from one vertex to another. :: One-way streets.
Weighted graph :: A graph in which each edge has a value (weight) associated with it, such as a distance, time or cost. :: Lines labelled with numbers.
Neighbours (adjacent vertices) :: Two vertices connected by an edge. :: Next-door dots.
Degree :: The number of edges connected to a vertex (its number of neighbours, in a simple undirected graph). :: How many lines touch the dot.
Cycle :: A path that starts and ends at the same vertex without reusing an edge. :: A loop you can walk round.
Adjacency matrix :: A two-dimensional array in which the entry at row i, column j records whether there is an edge from vertex i to vertex j (or its weight). :: A grid of yes/no (or weights).
Adjacency list :: A representation in which each vertex stores a list of the vertices adjacent to it (with weights for a weighted graph). :: Each dot keeps a list of its friends.
Sparse graph :: A graph with few edges compared with the maximum possible. :: Mostly empty matrix.
Dense graph :: A graph with many edges, close to the maximum possible. :: Mostly full matrix.
:::

## What a graph is

Arrays, queues and stacks are **linear**: each item has at most one item before and one after. Many real problems are not like that. A town has roads to several other towns; a person has many friends; a web page links to many pages. A **graph** captures that "anything can connect to anything" relationship.

<svg class="diagram" viewBox="0 0 690 215" role="img" aria-label="A friendship graph of five people with labels explaining vertex, edge, neighbour, degree and cycle">
  <g font-family="inherit" font-size="14">
    <line x1="93.8" y1="56.8" x2="196.2" y2="43.2" stroke="currentColor" stroke-width="1.6"/>
    <line x1="243.5" y1="45.0" x2="336.5" y2="65.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="82.9" y1="80.2" x2="127.1" y2="149.8" stroke="currentColor" stroke-width="1.6"/>
    <line x1="207.4" y1="60.4" x2="152.6" y2="149.6" stroke="currentColor" stroke-width="1.6"/>
    <line x1="164.0" y1="171.5" x2="276.0" y2="178.5" stroke="currentColor" stroke-width="1.6"/>
    <line x1="348.5" y1="91.1" x2="311.5" y2="158.9" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="70" cy="60" r="24" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="70" y="65" text-anchor="middle">Ana</text>
    <circle cx="220" cy="40" r="24" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="220" y="45" text-anchor="middle">Ben</text>
    <circle cx="360" cy="70" r="24" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="360" y="75" text-anchor="middle">Cal</text>
    <circle cx="140" cy="170" r="24" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="140" y="175" text-anchor="middle">Dee</text>
    <circle cx="300" cy="180" r="24" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="300" y="185" text-anchor="middle">Eli</text>
    <text x="470" y="60" font-size="13">vertex (node) = a person</text>
    <text x="470" y="85" font-size="13">edge (arc) = "are friends"</text>
    <text x="470" y="110" font-size="13">Ben's neighbours: Ana, Cal, Dee</text>
    <text x="470" y="135" font-size="13">degree(Ben) = 3</text>
    <text x="470" y="160" font-size="13">cycle: Ana → Ben → Dee → Ana</text>
  </g>
</svg>

### Key vocabulary

- **Vertex / node**: an object (town, person, router, web page).
- **Edge / arc**: a connection between two vertices.
- **Neighbours**: two vertices joined by an edge are *adjacent*.
- **Degree** of a vertex: the number of edges touching it.
- **Path**: a sequence of vertices joined by edges. **Cycle**: a path that returns to its start.
- **Loop**: an edge from a vertex to itself (rare in exam questions).
- **Connected**: there is a path between every pair of vertices.

### Three kinds of graph

:::columns
**Undirected**
Edges have no direction. If A connects to B, B connects to A. Example: two-way roads, Facebook-style friendships.
|||
**Directed (digraph)**
Each edge has a direction, drawn as an arrow. A → B does not mean B → A. Example: one-way streets, Twitter/Instagram "follows", web hyperlinks.
|||
**Weighted**
Each edge has a value: distance, time, cost, bandwidth. Can be directed or undirected. Example: road map with distances, network with latencies.
:::

### Typical uses

| Application | Vertices | Edges | Type |
|---|---|---|---|
| Sat-nav / route planning | junctions or towns | roads, weighted by distance or time | weighted, often directed (one-way streets) |
| Social network | people | friendships / follows | undirected (friends) or directed (follows) |
| The Internet | routers and hosts | network links, weighted by latency/cost | weighted |
| World Wide Web | web pages | hyperlinks | directed (used by search engine ranking) |
| Project planning | tasks | "must finish before" | directed, no cycles |
| Computer science itself | states of an FSM | transitions | directed, labelled |

## Adjacency matrix

A program cannot "see" a drawing, so the graph must be stored as data. The first way is a **2-D array** with one row and one column per vertex.

- For an **unweighted** graph, `m[i][j] = 1` if there is an edge from vertex i to vertex j, otherwise 0.
- For an **undirected** graph every edge is recorded **twice** (row A col B **and** row B col A), so the matrix is **symmetric** about the leading diagonal.
- For a **directed** graph, read **row = from, column = to**. The matrix is usually not symmetric.
- For a **weighted** graph, store the **weight** instead of 1, and use ∞ (or a blank/null) where there is no edge, because 0 could be a genuine weight.

### Worked example 1: undirected graph

<svg class="diagram" viewBox="0 0 440 225" role="img" aria-label="Undirected graph with vertices A to E and edges A-B, A-C, A-D, B-C, C-E, D-E">
  <g font-family="inherit" font-size="14">
    <line x1="145.4" y1="40.6" x2="64.6" y2="99.4" stroke="currentColor" stroke-width="1.6"/>
    <line x1="160.0" y1="48.0" x2="160.0" y2="177.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="175.3" y1="39.4" x2="274.7" y2="100.6" stroke="currentColor" stroke-width="1.6"/>
    <line x1="64.2" y1="121.0" x2="145.8" y2="184.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="178.0" y1="195.0" x2="372.0" y2="195.0" stroke="currentColor" stroke-width="1.6"/>
    <line x1="303.7" y1="121.7" x2="376.3" y2="183.3" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="160" cy="30" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="35" text-anchor="middle">A</text>
    <circle cx="50" cy="110" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="50" y="115" text-anchor="middle">B</text>
    <circle cx="160" cy="195" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="200" text-anchor="middle">C</text>
    <circle cx="290" cy="110" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="290" y="115" text-anchor="middle">D</text>
    <circle cx="390" cy="195" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="390" y="200" text-anchor="middle">E</text>
  </g>
</svg>

:::example Building the matrix and list (undirected)
Edges: A–B, A–C, A–D, B–C, C–E, D–E (6 edges).

**Adjacency matrix** (each edge gives two 1s, so there are 12 ones):

| | A | B | C | D | E |
|---|---|---|---|---|---|
| **A** | 0 | 1 | 1 | 1 | 0 |
| **B** | 1 | 0 | 1 | 0 | 0 |
| **C** | 1 | 1 | 0 | 0 | 1 |
| **D** | 1 | 0 | 0 | 0 | 1 |
| **E** | 0 | 0 | 1 | 1 | 0 |

**Adjacency list:**

| Vertex | Adjacent vertices |
|---|---|
| A | B, C, D |
| B | A, C |
| C | A, B, E |
| D | A, E |
| E | C, D |

Checks: the matrix is symmetric; each row total is that vertex's **degree** (A = 3); the list has 12 entries = 2 × 6 edges.
:::

### Worked example 2: directed graph

<svg class="diagram" viewBox="0 0 440 225" role="img" aria-label="Directed graph with edges A to B, A to C, B to C, C to D, D to A and D to E">
  <defs><marker id="arr24" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <line x1="145.4" y1="40.6" x2="66.2" y2="98.2" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr24)"/>
    <line x1="160.0" y1="48.0" x2="160.0" y2="175.0" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr24)"/>
    <line x1="64.2" y1="121.0" x2="144.2" y2="182.8" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr24)"/>
    <line x1="175.1" y1="185.1" x2="273.3" y2="120.9" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr24)"/>
    <line x1="274.7" y1="100.6" x2="177.0" y2="40.5" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr24)"/>
    <line x1="303.7" y1="121.7" x2="374.8" y2="182.0" stroke="currentColor" stroke-width="1.6" marker-end="url(#arr24)"/>
    <circle cx="160" cy="30" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="35" text-anchor="middle">A</text>
    <circle cx="50" cy="110" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="50" y="115" text-anchor="middle">B</text>
    <circle cx="160" cy="195" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="200" text-anchor="middle">C</text>
    <circle cx="290" cy="110" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="290" y="115" text-anchor="middle">D</text>
    <circle cx="390" cy="195" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="390" y="200" text-anchor="middle">E</text>
  </g>
</svg>

:::example Directed graph: row = from, column = to
Edges: A→B, A→C, B→C, C→D, D→A, D→E.

| from \ to | A | B | C | D | E |
|---|---|---|---|---|---|
| **A** | 0 | 1 | 1 | 0 | 0 |
| **B** | 0 | 0 | 1 | 0 | 0 |
| **C** | 0 | 0 | 0 | 1 | 0 |
| **D** | 1 | 0 | 0 | 0 | 1 |
| **E** | 0 | 0 | 0 | 0 | 0 |

| Vertex | Edges out to |
|---|---|
| A | B, C |
| B | C |
| C | D |
| D | A, E |
| E | (none) |

Now there are only 6 ones, one per edge, and the matrix is **not** symmetric: `m[A][B] = 1` but `m[B][A] = 0`. E has no outgoing edges, so its row and list are empty.
:::

### Worked example 3: weighted graph

<svg class="diagram" viewBox="0 0 440 225" role="img" aria-label="Weighted undirected graph: A-B 4, A-C 2, A-D 7, B-C 5, C-E 3, D-E 1">
  <g font-family="inherit" font-size="14">
    <line x1="145.4" y1="40.6" x2="64.6" y2="99.4" stroke="currentColor" stroke-width="1.6"/>
    <text x="97.9" y="65.3" text-anchor="middle" font-size="13" font-weight="bold">4</text>
    <line x1="160.0" y1="48.0" x2="160.0" y2="177.0" stroke="currentColor" stroke-width="1.6"/>
    <text x="148.0" y="117.5" text-anchor="middle" font-size="13" font-weight="bold">2</text>
    <line x1="175.3" y1="39.4" x2="274.7" y2="100.6" stroke="currentColor" stroke-width="1.6"/>
    <text x="218.7" y="85.2" text-anchor="middle" font-size="13" font-weight="bold">7</text>
    <line x1="64.2" y1="121.0" x2="145.8" y2="184.0" stroke="currentColor" stroke-width="1.6"/>
    <text x="97.7" y="167.0" text-anchor="middle" font-size="13" font-weight="bold">5</text>
    <line x1="178.0" y1="195.0" x2="372.0" y2="195.0" stroke="currentColor" stroke-width="1.6"/>
    <text x="275.0" y="212.0" text-anchor="middle" font-size="13" font-weight="bold">3</text>
    <line x1="303.7" y1="121.7" x2="376.3" y2="183.3" stroke="currentColor" stroke-width="1.6"/>
    <text x="332.2" y="166.6" text-anchor="middle" font-size="13" font-weight="bold">1</text>
    <circle cx="160" cy="30" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="35" text-anchor="middle">A</text>
    <circle cx="50" cy="110" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="50" y="115" text-anchor="middle">B</text>
    <circle cx="160" cy="195" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="160" y="200" text-anchor="middle">C</text>
    <circle cx="290" cy="110" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="290" y="115" text-anchor="middle">D</text>
    <circle cx="390" cy="195" r="18" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="390" y="200" text-anchor="middle">E</text>
  </g>
</svg>

:::example Weighted (undirected): store the weight, ∞ where no edge
| | A | B | C | D | E |
|---|---|---|---|---|---|
| **A** | ∞ | 4 | 2 | 7 | ∞ |
| **B** | 4 | ∞ | 5 | ∞ | ∞ |
| **C** | 2 | 5 | ∞ | ∞ | 3 |
| **D** | 7 | ∞ | ∞ | ∞ | 1 |
| **E** | ∞ | ∞ | 3 | 1 | ∞ |

| Vertex | Adjacent vertex, weight |
|---|---|
| A | B,4  C,2  D,7 |
| B | A,4  C,5 |
| C | A,2  B,5  E,3 |
| D | A,7  E,1 |
| E | C,3  D,1 |

The leading diagonal is ∞ (or 0/blank — mark schemes accept any clearly stated convention) because no vertex has an edge to itself.
:::

:::trap
- **Undirected = two entries per edge.** Putting a 1 in only one cell is the most common error in matrix questions.
- **Directed: row is "from".** Say so in your answer, or the examiner cannot tell which way you read it.
- **Weighted: do not use 0 for "no edge"** unless the question says to. Use ∞, a dash or leave blank, and state it.
- In an adjacency list for a directed graph, list only **outgoing** edges.
:::

## The two representations in code

::::tabs
:::tab Python
```python
names = ["A", "B", "C", "D", "E"]
idx = {n: i for i, n in enumerate(names)}
edges = [("A","B",4), ("A","C",2), ("A","D",7), ("B","C",5), ("C","E",3), ("D","E",1)]

INF = float("inf")
# --- adjacency matrix (weighted, undirected) ---
matrix = [[INF] * 5 for _ in range(5)]
for a, b, w in edges:
    matrix[idx[a]][idx[b]] = w
    matrix[idx[b]][idx[a]] = w        # undirected: record both ways

# --- adjacency list (dictionary of lists) ---
adj = {n: [] for n in names}
for a, b, w in edges:
    adj[a].append((b, w))
    adj[b].append((a, w))

print(matrix[idx["C"]][idx["E"]])     # 3   <- one look-up
print(adj["C"])                        # [('A', 2), ('B', 5), ('E', 3)]

# Is there an edge B-E?
print(matrix[idx["B"]][idx["E"]] != INF)      # False, one step
print(any(v == "E" for v, _ in adj["B"]))     # False, scans B's list

# Degree of each vertex from the list
print({n: len(adj[n]) for n in names})  # {'A': 3, 'B': 2, 'C': 3, 'D': 2, 'E': 2}
```
:::
:::tab AQA pseudocode
```pseudocode
# Is there an edge from vertex i to vertex j?
# Matrix: one access
IF m[i][j] ≠ 0 THEN OUTPUT "edge" ENDIF

# List: search the list for vertex i
found ← False
FOR EACH v IN adj[i]
    IF v = j THEN found ← True ENDIF
ENDFOR

# Degree of vertex i from a matrix
deg ← 0
FOR j ← 0 TO n - 1
    deg ← deg + m[i][j]
ENDFOR
```
:::
::::

{{trace:2.4-1}}

## Comparing matrix and list

| Feature | Adjacency matrix | Adjacency list |
|---|---|---|
| Memory | always n² cells, whether or not edges exist | proportional to vertices + edges; nothing stored for missing edges |
| Test "is there an edge i→j?" | **one** look-up: `m[i][j]`, constant time | search i's list: time depends on i's degree |
| List all neighbours of i | scan a whole row: n cells | read i's list: just the neighbours |
| Add/remove an edge | change one (or two) cells | insert/delete in a list |
| Add a vertex | must grow the 2-D array (rebuild if static) | add a new empty list |
| Best for | **dense** graphs, frequent edge look-ups | **sparse** graphs, algorithms that walk neighbours (BFS, DFS, Dijkstra) |

:::why Why sparse graphs favour lists
A road network for the UK might have 1,000,000 junctions, each joined to about 3 others. A matrix needs 10<sup>12</sup> cells, almost all 0: impossible. A list stores about 3,000,000 entries. Real-world graphs are usually sparse, which is why most software uses lists. When a graph is dense (almost every pair connected), the matrix wastes little and gives instant edge checks.
:::

### Try it: graph explorer

Build a graph, switch between directed/undirected and weighted, and watch the matrix and list update.

{{tool:graph-explorer}}

:::exam
- **"Explain the terms…" (1 mark each)**: give the definition, not an example. Weighted graph = "edges have a value/cost associated with them"; directed graph = "edges have a direction / can only be traversed one way".
- **Complete a matrix or list (3–5 marks)**: mark schemes usually give 1 mark per correct row. Check symmetry for undirected graphs before moving on.
- **Draw a graph from a matrix/list**: label every vertex, use arrows for directed edges, write weights beside edges.
- **Compare matrix and list (4 marks)**: pair your points: memory (n² vs edges only) **and** speed (direct look-up vs searching a list) **and** when each is suitable (dense vs sparse).
- **"Explain why a list is more appropriate for this graph"**: say the graph is **sparse** (few edges compared with vertices²), so a matrix would be mostly empty and waste memory.
- **"Explain why this graph is not a tree"**: it contains a **cycle** (name one) — see [2.5 Trees](#/topic/2.5).
:::

:::challenge
1. A complete undirected graph has an edge between every pair of n vertices. How many edges does it have? How many 1s in its adjacency matrix?
2. Write a Python function that converts an adjacency matrix into an adjacency list, and another that does the reverse.
3. Given an adjacency list for a **directed** graph, write code that outputs the **in-degree** (edges arriving) of every vertex. Why is this easier with a matrix?
4. For a graph with 10,000 vertices and 25,000 edges, estimate the memory for a matrix of 1-byte cells and for a list using 8 bytes per entry. Which would you choose?
:::

:::recap
- A **graph** = vertices (nodes) + edges (arcs); represents complex, non-linear relationships.
- **Undirected** edges go both ways; **directed** edges are arrows; **weighted** edges carry a value.
- **Matrix**: n × n array, 1/weight where an edge exists; undirected → symmetric; row = from for directed.
- **List**: each vertex lists its neighbours (with weights).
- Matrix: n² memory, instant edge test → dense graphs. List: memory for real edges only, edge test needs a search → sparse graphs.
- Uses: maps/route finding, social networks, Internet routing, web links, task dependencies.
:::

:::related
- [2.5 Trees](#/topic/2.5) — a tree is a special graph with no cycles
- [3.1 Graph traversal](#/topic/3.1) — depth-first and breadth-first search
- [3.6 Dijkstra's algorithm](#/topic/3.6) — shortest paths on weighted graphs
- [2.1 Data structures](#/topic/2.1) — 2-D arrays and lists used to store graphs
:::

*/});
