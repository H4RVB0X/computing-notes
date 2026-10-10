CS.registerTopic({ id: "3.6", title: "Dijkstra's shortest path algorithm" }, function () {/*

:::objectives
- Explain what **Dijkstra's algorithm** finds: the shortest (least-cost) path from **one start vertex to every other vertex** in a weighted graph.
- **Trace** the algorithm using the standard table of **vertex / shortest distance / previous vertex / visited**.
- Read the finished table to give the **shortest path** and its **cost** to any vertex by **backtracking** through the previous vertices.
- Write the algorithm in AQA pseudocode and Python, and state its time complexity.
- State the conditions it needs (non-negative weights) and describe **applications** of shortest path algorithms.
:::

:::quick At a glance
- Works on a **weighted graph** with **non-negative** edge weights (directed or undirected).
- Start: distance to the start vertex **0**, every other vertex **∞**; nothing visited.
- Repeat: pick the **unvisited vertex with the smallest tentative distance**, mark it **visited** (its distance is now final), then **relax** each unvisited neighbour: if `distance(current) + edge weight` is **smaller** than the neighbour's recorded distance, update the distance and set its **previous vertex** to current.
- Stop when every vertex is visited (or when the target is visited, if you only need one path).
- Path = start at the target and follow **previous** vertices back to the start, then reverse.
- **O(V²)** with a simple array; **O((V + E) log V)** with a priority queue (binary heap).
- Uses: satnav route planning, network routing (e.g. OSPF), game pathfinding, travel/airline planning.
:::

:::keyterms
Weighted graph :: A graph in which each edge has a value (weight or cost), e.g. distance, time or price. :: Edges have numbers on them.
Shortest path :: The path between two vertices for which the sum of the edge weights is smallest. :: The cheapest route, not necessarily the fewest edges.
Dijkstra's algorithm :: An algorithm that finds the shortest path from a single source vertex to every other vertex in a graph with non-negative edge weights. :: Finds the cheapest route from one place to everywhere.
Tentative distance :: The shortest distance from the start found so far for a vertex; it can still be reduced until the vertex is visited. :: The best guess so far.
Previous vertex :: For each vertex, the vertex immediately before it on the shortest path found from the start. :: Where you came from.
Visited (settled) vertex :: A vertex whose shortest distance from the start is final and will not change. :: Done, never changes again.
Relaxation :: Checking whether going via the current vertex gives a shorter path to a neighbour, and if so updating that neighbour's distance and previous vertex. :: "Is it cheaper to go this way?"
Priority queue :: A queue in which each item has a priority and the item with the highest priority (here, the smallest distance) is removed first. :: Always serves the closest vertex next.
:::

## What problem does it solve?

[Breadth-first search](#/topic/3.1) finds the route with the **fewest edges**. On a road map that is not good enough: one long motorway is better than three short country lanes only if it is actually shorter. When edges have **weights**, the shortest path is the one with the **smallest total weight**.

Dijkstra's algorithm (Edsger Dijkstra, 1956) solves the **single-source shortest path** problem: from one start vertex, it finds the shortest distance (and route) to **every** other vertex.

:::figure The weighted graph from your class slides. Find the shortest paths from A.
<svg class="diagram" viewBox="0 0 640 290" role="img" aria-label="Weighted graph: A-B 4, A-C 2, B-C 3, B-D 7, B-E 4, C-D 3, D-E 1, D-F 2, E-F 5, E-G 7, F-G 5">
  <g stroke="currentColor" stroke-width="2">
    <line x1="70" y1="150" x2="220" y2="60"/><line x1="70" y1="150" x2="220" y2="240"/><line x1="220" y1="60" x2="220" y2="240"/>
    <line x1="220" y1="60" x2="330" y2="180"/><line x1="220" y1="60" x2="400" y2="60"/><line x1="220" y1="240" x2="330" y2="180"/>
    <line x1="330" y1="180" x2="400" y2="60"/><line x1="330" y1="180" x2="470" y2="220"/><line x1="400" y1="60" x2="470" y2="220"/>
    <line x1="400" y1="60" x2="580" y2="130"/><line x1="470" y1="220" x2="580" y2="130"/>
  </g>
  <g font-size="14" font-family="inherit" text-anchor="middle" fill="currentColor">
    <text x="135" y="95">4</text><text x="135" y="215">2</text><text x="208" y="155">3</text><text x="285" y="112">7</text>
    <text x="310" y="50">4</text><text x="270" y="228">3</text><text x="377" y="125">1</text><text x="400" y="215">2</text>
    <text x="448" y="135">5</text><text x="500" y="85">7</text><text x="535" y="195">5</text>
  </g>
  <g font-size="16" font-family="inherit" text-anchor="middle" fill="currentColor">
    <circle cx="70" cy="150" r="20" fill="#22c55e" fill-opacity="0.35" stroke="currentColor"/><text x="70" y="156">A</text>
    <circle cx="220" cy="60" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="220" y="66">B</text>
    <circle cx="220" cy="240" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="220" y="246">C</text>
    <circle cx="330" cy="180" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="330" y="186">D</text>
    <circle cx="400" cy="60" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="400" y="66">E</text>
    <circle cx="470" cy="220" r="20" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="470" y="226">F</text>
    <circle cx="580" cy="130" r="20" fill="#f97316" fill-opacity="0.35" stroke="currentColor"/><text x="580" y="136">G</text>
  </g>
</svg>
:::

## The algorithm

:::steps Dijkstra's algorithm by hand
1. Draw a table with a row for each vertex and columns **Shortest distance**, **Previous vertex**, **Visited**. Set the start's distance to **0** and all others to **∞**.
2. Choose the **unvisited** vertex with the **smallest** distance. Call it the current vertex and mark it **visited**.
3. For each **unvisited neighbour** of the current vertex, calculate `distance(current) + weight of the edge`. If this is **less than** the neighbour's recorded distance, **replace** the distance and set its previous vertex to the current vertex. Otherwise leave it alone.
4. Repeat from step 2 until all vertices are visited.
:::

:::why Why can a visited vertex never get shorter?
When a vertex is chosen it has the smallest distance of all unvisited vertices. Any other route to it must leave the visited set through some unvisited vertex that is already at least as far away, and since weights are **non-negative** the rest of that route cannot make it shorter. So the distance is final. (This is exactly why **negative weights break Dijkstra**.)
:::

## Worked example

:::example Dijkstra from A on the class graph
Each row shows the table **after** the named vertex is visited and its neighbours are relaxed. Entries are *distance (previous)*; a ✓ marks visited vertices.

| Visit | A | B | C | D | E | F | G | What happened |
|---|---|---|---|---|---|---|---|---|
| start | 0 | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ | |
| A | 0 ✓ | 4 (A) | 2 (A) | ∞ | ∞ | ∞ | ∞ | B: 0+4; C: 0+2 |
| C | ✓ | 4 (A) | 2 ✓ | 5 (C) | ∞ | ∞ | ∞ | B: 2+3 = 5, not < 4, keep. D: 2+3 = 5 |
| B | ✓ | 4 ✓ | ✓ | 5 (C) | 8 (B) | ∞ | ∞ | D: 4+7 = 11, not < 5, keep. E: 4+4 = 8 |
| D | ✓ | ✓ | ✓ | 5 ✓ | **6 (D)** | 7 (D) | ∞ | E: 5+1 = 6 < 8, **update**. F: 5+2 = 7 |
| E | ✓ | ✓ | ✓ | ✓ | 6 ✓ | 7 (D) | 13 (E) | F: 6+5 = 11, not < 7, keep. G: 6+7 = 13 |
| F | ✓ | ✓ | ✓ | ✓ | ✓ | 7 ✓ | **12 (F)** | G: 7+5 = 12 < 13, **update** |
| G | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 12 ✓ | no unvisited neighbours |

**Final table**

| Vertex | Shortest distance from A | Previous vertex | Visited |
|---|---|---|---|
| A | 0 | — | ✓ |
| B | 4 | A | ✓ |
| C | 2 | A | ✓ |
| D | 5 | C | ✓ |
| E | 6 | D | ✓ |
| F | 7 | D | ✓ |
| G | 12 | F | ✓ |

**Shortest path A → G**: G ← F ← D ← C ← A, so **A → C → D → F → G, cost 12** (2 + 3 + 2 + 5). This matches the textbook answer "A, C, D, F, G".
:::

:::trap
- **Add to the current vertex's distance**, not just the edge weight. From D (distance 5) the edge D–E of weight 1 gives 6, not 1.
- **Only update if strictly smaller.** If the new total is equal or larger, leave both the distance and the previous vertex unchanged.
- Choose the next vertex from **all** unvisited vertices, not just the neighbours of the current one. After visiting A, the next vertex is C (2), even though B was listed first.
- When writing the path, follow **previous** vertices **backwards** from the target and then reverse the list. Writing the visiting order (A C B D E F G) is not a path.
- The shortest path is not always the one with the fewest edges: A → B → E → G has 3 edges but costs 15.
:::

{{trace:3.6-1}}

## The algorithm in code

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE dijkstra(graph, start)
    FOR EACH v IN graph
        distance[v] ← ∞
        previous[v] ← Null
        visited[v] ← False
    ENDFOR
    distance[start] ← 0
    REPEAT
        current ← unvisited vertex with the smallest distance
        visited[current] ← True
        FOR EACH neighbour IN graph[current]
            IF visited[neighbour] = False THEN
                newDist ← distance[current] + weight(current, neighbour)
                IF newDist < distance[neighbour] THEN
                    distance[neighbour] ← newDist
                    previous[neighbour] ← current
                ENDIF
            ENDIF
        ENDFOR
    UNTIL all vertices are visited
    RETURN distance, previous
ENDSUBROUTINE
```
:::
:::tab Python (simple, O(V²))
```python
INF = float("inf")
graph = {"A": {"B": 4, "C": 2}, "B": {"A": 4, "C": 3, "D": 7, "E": 4},
         "C": {"A": 2, "B": 3, "D": 3}, "D": {"B": 7, "C": 3, "E": 1, "F": 2},
         "E": {"B": 4, "D": 1, "F": 5, "G": 7}, "F": {"D": 2, "E": 5, "G": 5},
         "G": {"E": 7, "F": 5}}

def dijkstra(graph, start):
    distance = {v: INF for v in graph}
    previous = {v: None for v in graph}
    visited = set()
    distance[start] = 0
    while len(visited) < len(graph):
        # unvisited vertex with the smallest tentative distance
        current = min((v for v in graph if v not in visited), key=lambda v: distance[v])
        visited.add(current)
        for neighbour, weight in graph[current].items():
            if neighbour not in visited and distance[current] + weight < distance[neighbour]:
                distance[neighbour] = distance[current] + weight   # relax
                previous[neighbour] = current
    return distance, previous

def path_to(previous, target):
    path = []
    while target is not None:          # follow 'previous' back to the start
        path.insert(0, target)
        target = previous[target]
    return path

dist, prev = dijkstra(graph, "A")
print(dist)                  # {'A': 0, 'B': 4, 'C': 2, 'D': 5, 'E': 6, 'F': 7, 'G': 12}
print(path_to(prev, "G"))    # ['A', 'C', 'D', 'F', 'G']
```
:::
:::tab Python (priority queue)
```python
import heapq

graph = {"A": {"B": 4, "C": 2}, "B": {"A": 4, "C": 3, "D": 7, "E": 4},
         "C": {"A": 2, "B": 3, "D": 3}, "D": {"B": 7, "C": 3, "E": 1, "F": 2},
         "E": {"B": 4, "D": 1, "F": 5, "G": 7}, "F": {"D": 2, "E": 5, "G": 5},
         "G": {"E": 7, "F": 5}}

def dijkstra_pq(graph, start):
    distance = {start: 0}
    previous = {start: None}
    visited = set()
    pq = [(0, start)]                         # (distance, vertex): smallest first
    while pq:
        d, current = heapq.heappop(pq)
        if current in visited:
            continue                          # an out-of-date entry
        visited.add(current)
        for neighbour, w in graph[current].items():
            new = d + w
            if neighbour not in visited and new < distance.get(neighbour, float("inf")):
                distance[neighbour] = new
                previous[neighbour] = current
                heapq.heappush(pq, (new, neighbour))
    return distance, previous

print(dijkstra_pq(graph, "A")[0]["G"])   # 12
```
:::
::::

### Time complexity

- **Simple version** (array/table): each of the V iterations scans all V vertices to find the smallest unvisited distance, giving **O(V²)**. Relaxing edges adds O(E), which is at most O(V²). This is the version you trace by hand.
- **With a priority queue** (binary heap) holding the unvisited vertices keyed by distance: removing the minimum and updating distances cost O(log V) each, giving **O((V + E) log V)**. Much faster on large, sparse graphs such as road networks.

## Try it: graph explorer

Build a weighted graph, choose a start vertex and step through Dijkstra. Check each relaxation against your own table.

{{tool:graph-explorer}}

{{trace:3.6-2}}

## Applications of shortest path algorithms

- **Satellite navigation and route planners**: vertices are junctions, weights are distance or predicted travel time.
- **Network routing**: link-state routing protocols such as **OSPF** run Dijkstra on each router to build routing tables; weights are link costs (based on bandwidth or delay). See [9.3 The Internet](#/topic/9.3).
- **Computer games and robotics**: finding the cheapest route for a character or robot across a map (often with the A* refinement).
- **Travel and logistics**: cheapest or fastest flights, delivery routes, train journeys with changes.
- **Telecoms and utilities**: least-cost routes through telephone or electricity networks; shortest wiring on circuit boards.
- **Social networks**: weighted "closeness" between people.

:::note Limitations
- Edge weights must be **non-negative**. With negative weights a visited distance could later be beaten (other algorithms, such as Bellman-Ford, handle that: beyond the specification).
- It explores outwards in all directions. If you only need one target you can stop when the target is visited, and heuristic algorithms such as **A*** head towards the target and usually explore fewer vertices.
:::

:::trap From your notes
- The adjacency matrices in your Dijkstra textbook answers are **not symmetric** (e.g. row C shows an edge C–B of 4 but row B shows no edge B–C). An undirected graph's matrix must be symmetric; treat those answers with care.
- One class slide says "change all the distances from **C**" on the step where **B** is the current vertex: always relax the neighbours of the **current** vertex.
- The comments in the class Python example don't match the code (e.g. "D – A, weight 5" for an edge added with weight 4). Trust the code you trace, not the comments.
:::

:::exam
- **"Trace Dijkstra's algorithm"** (6–8 marks): fill the given table exactly. Marks usually go for each correct final distance **and** previous vertex, and sometimes for the order vertices are visited. Show crossed-out values when a distance is improved: examiners like to see them.
- **"State the shortest path from A to G and its length"**: give the vertices in order **and** the total weight.
- **"Describe an application"**: name it and say what the vertices and weights represent.
- **"Explain why BFS is not suitable"**: BFS minimises the number of edges, not the total weight.
:::

:::challenge
1. Run Dijkstra on the class graph starting from **G**. Is the path G → A the reverse of A → G? Why must it be for an undirected graph?
2. Modify `dijkstra` so it stops as soon as a given target is visited. How many vertices does it visit for target D?
3. Add an edge of weight −10 to a small graph and show that the simple algorithm returns a wrong answer.
4. Represent the graph as an adjacency matrix and rewrite the simple version to use it. What is its complexity now?
:::

:::recap
- Single-source shortest paths in a **weighted** graph with **non-negative** weights.
- Initialise start = 0, others = ∞. Repeatedly visit the **closest unvisited** vertex and **relax** its unvisited neighbours.
- Update only if `distance(current) + weight` is **strictly smaller**; record the **previous** vertex.
- Path: follow previous vertices back from the target; cost = its final distance.
- Class graph: A→G is **A, C, D, F, G** with cost **12**.
- **O(V²)** simple; **O((V + E) log V)** with a priority queue.
- Applications: satnav, network routing (OSPF), games/robots, logistics.
:::

:::related
- [2.4 Graphs](#/topic/2.4) — weighted graphs, adjacency matrices and lists
- [3.1 Graph traversal](#/topic/3.1) — BFS for unweighted shortest paths
- [2.2 Queues](#/topic/2.2) — priority queues
- [9.3 The Internet: structure, routing and DNS](#/topic/9.3)
:::

*/});
