CS.registerTopic({ id: "3.1", title: "Graph traversal: depth-first and breadth-first" }, function () {/*

:::objectives
- Explain what a **graph traversal** is and why a **visited list** is essential.
- Trace a **depth-first search (DFS)** using a **stack**, showing the stack and the visited list after every step.
- Trace a **breadth-first search (BFS)** using a **queue**, showing the queue and the visited list after every step.
- Write both algorithms in AQA pseudocode and Python (including recursive DFS).
- State the time complexity of each traversal and justify it.
- Describe typical **applications** of each and choose the right one for a scenario.
:::

:::quick At a glance
- A **traversal** visits every vertex reachable from a start vertex **exactly once**.
- **Depth-first**: go as far as possible down one path, then **backtrack**. Uses a **stack** (or recursion, which uses the call stack).
- **Breadth-first**: visit **all neighbours** of the current vertex, then their neighbours, layer by layer. Uses a **queue**.
- A **visited (discovered) list** stops you going round **cycles** forever.
- Exam convention: when there is a choice, take neighbours in **alphabetical (or numerical) order**.
- BFS finds the **shortest path (fewest edges) in an unweighted graph**. DFS suits **mazes, backtracking, cycle detection, topological ordering**.
- Both are **O(V + E)** with an adjacency list (**O(V²)** with an adjacency matrix).
:::

:::keyterms
Graph traversal :: A systematic process of visiting every vertex in a graph that is reachable from a starting vertex. :: Visiting every node once, in a planned order.
Depth-first search (DFS) :: A traversal that explores as far as possible along each branch before backtracking; implemented with a stack or recursion. :: Go deep down one route, then back up and try the next.
Breadth-first search (BFS) :: A traversal that visits all the neighbours of a vertex before moving on to the neighbours' neighbours; implemented with a queue. :: Spread out in rings from the start.
Neighbour (adjacent vertex) :: A vertex that is connected to a given vertex by an edge. :: A node one step away.
Visited list :: A record of the vertices that have already been discovered, so that no vertex is processed twice. :: The "been there" list that stops infinite loops.
Backtracking :: Returning to a previous vertex (by popping the stack) when the current vertex has no unvisited neighbours. :: Going back to the last junction with an untried path.
Fully explored (completed) :: A vertex all of whose neighbours have been visited; it is popped from the stack (DFS) or dequeued (BFS). :: Nothing new left to see from here.
Cycle :: A path through a graph that starts and ends at the same vertex. :: A loop in the graph.
:::

## Why traversals need care

A **tree** has no cycles, so you can never come back to a node by accident. A **graph** usually does have cycles, and a vertex can have any number of neighbours. Without a record of where you have been, a traversal could loop forever.

So both algorithms keep:
- a **visited list** of vertices already discovered;
- a supporting structure that remembers **what still needs exploring**: a **stack** for depth-first, a **queue** for breadth-first.

That single difference (stack versus queue) is the whole difference between the two algorithms.

:::why
Why a stack for DFS? A stack is LIFO, so the most recently found vertex is explored next: you keep going **deeper**. When you get stuck you pop, which takes you **back** to the last junction. A queue is FIFO, so vertices are explored in the order they were found: everything one edge away, then everything two edges away, and so on. See [2.3 Stacks](#/topic/2.3) and [2.2 Queues](#/topic/2.2).
:::

### The graph used for the worked examples

This is the graph from your class slides. Edges: A–B, A–D, A–G, B–E, B–F, C–F, C–H, D–F, E–G.

:::figure Graph 1: undirected, unweighted. Start vertex A.
<svg class="diagram" viewBox="0 0 660 300" role="img" aria-label="Graph with vertices A to H. Edges A-B, A-D, A-G, B-E, B-F, D-F, E-G, F-C, C-H">
  <g stroke="currentColor" stroke-width="2">
    <line x1="90" y1="150" x2="250" y2="150"/><line x1="90" y1="150" x2="90" y2="40"/><line x1="90" y1="150" x2="90" y2="260"/>
    <line x1="250" y1="150" x2="250" y2="260"/><line x1="250" y1="150" x2="250" y2="40"/><line x1="90" y1="260" x2="250" y2="260"/>
    <line x1="90" y1="40" x2="250" y2="40"/><line x1="250" y1="40" x2="410" y2="40"/><line x1="410" y1="40" x2="570" y2="40"/>
  </g>
  <g font-size="16" font-family="inherit" text-anchor="middle">
    <circle cx="90" cy="150" r="20" fill="#7c9aff" fill-opacity="0.45" stroke="currentColor"/><text x="90" y="156" fill="currentColor">A</text>
    <circle cx="250" cy="150" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="250" y="156" fill="currentColor">B</text>
    <circle cx="90" cy="40" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="90" y="46" fill="currentColor">D</text>
    <circle cx="250" cy="40" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="250" y="46" fill="currentColor">F</text>
    <circle cx="410" cy="40" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="410" y="46" fill="currentColor">C</text>
    <circle cx="570" cy="40" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="570" y="46" fill="currentColor">H</text>
    <circle cx="90" cy="260" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="90" y="266" fill="currentColor">G</text>
    <circle cx="250" cy="260" r="20" fill="#7c9aff" fill-opacity="0.2" stroke="currentColor"/><text x="250" y="266" fill="currentColor">E</text>
    <text x="440" y="200" font-size="13" text-anchor="start" fill="currentColor">Adjacency list (alphabetical):</text>
    <text x="440" y="222" font-size="13" text-anchor="start" fill="currentColor">A: B D G    B: A E F</text>
    <text x="440" y="242" font-size="13" text-anchor="start" fill="currentColor">C: F H      D: A F</text>
    <text x="440" y="262" font-size="13" text-anchor="start" fill="currentColor">E: B G      F: B C D</text>
    <text x="440" y="282" font-size="13" text-anchor="start" fill="currentColor">G: A E      H: C</text>
  </g>
</svg>
:::

:::tip
Before you start any trace, **write the adjacency list with each vertex's neighbours in alphabetical order**. It takes 30 seconds and stops you choosing the wrong neighbour halfway through.
:::

## Depth-first search (DFS)

### The method (exam style)

:::steps DFS by hand
1. Push the start vertex on the stack and add it to the visited list.
2. Look at the vertex on **top** of the stack. Does it have an **unvisited** neighbour?
3. **Yes:** take the first one alphabetically, mark it visited and **push** it. Go to step 2.
4. **No:** the top vertex is fully explored, so **pop** it (backtrack). Go to step 2.
5. Stop when the stack is empty.
:::

The order of the visited list is the **depth-first order**.

:::example DFS on Graph 1 from A
| Step | Action | Stack (bottom → top) | Visited list |
|---|---|---|---|
| 1 | visit A, push | A | A |
| 2 | A's first unvisited neighbour is B: visit, push | A B | A B |
| 3 | B → E (A already visited) | A B E | A B E |
| 4 | E → G | A B E G | A B E G |
| 5 | G: neighbours A, E both visited → **pop G** | A B E | A B E G |
| 6 | E: B, G visited → **pop E** | A B | A B E G |
| 7 | B → F (next unvisited) | A B F | A B E G F |
| 8 | F → C (B visited, C first unvisited) | A B F C | A B E G F C |
| 9 | C → H | A B F C H | A B E G F C H |
| 10 | H: nothing new → pop H | A B F C | … |
| 11 | C: nothing new → pop C | A B F | … |
| 12 | F → D | A B F D | A B E G F C H D |
| 13 | pop D, then pop F, pop B, pop A | (empty) | A B E G F C H D |

**Depth-first order: A, B, E, G, F, C, H, D.** Notice how it dives A→B→E→G before ever looking at D, even though D is right next to A.
:::

:::trap
- **Pop only when stuck.** In the hand method a vertex stays on the stack until *all* its neighbours are visited. Popping straight after visiting gives the wrong backtracking.
- **Check the visited list before every push.** Re-visiting a vertex is the most common error and usually means the stack never empties.
- **Alphabetical order** is a convention, not part of the algorithm. If the question gives a different order (e.g. "neighbours in the order listed"), follow the question.
- Different implementations can give **different valid DFS orders**. The "push every unvisited neighbour at once (marking each as visited when pushed), then pop" version visits Graph 1 in the order A, G, E, D, F, C, H, B. In an exam, always follow the algorithm or rule you are given.
:::

### DFS in code

::::tabs
:::tab AQA pseudocode (recursive)
```pseudocode
visited ← []

SUBROUTINE dfs(graph, v)
    visited.append(v)
    OUTPUT v
    FOR EACH w IN graph[v]
        IF w NOT IN visited THEN
            dfs(graph, w)
        ENDIF
    ENDFOR
ENDSUBROUTINE
```
:::
:::tab Python (recursive)
```python
graph = {"A": ["B", "D", "G"], "B": ["A", "E", "F"], "C": ["F", "H"],
         "D": ["A", "F"], "E": ["B", "G"], "F": ["B", "C", "D"],
         "G": ["A", "E"], "H": ["C"]}

def dfs(graph, v, visited=None):
    if visited is None:
        visited = []
    visited.append(v)                 # visit v
    for w in graph[v]:                # neighbours in alphabetical order
        if w not in visited:
            dfs(graph, w, visited)    # go deeper; returning = backtracking
    return visited

print(dfs(graph, "A"))   # ['A', 'B', 'E', 'G', 'F', 'C', 'H', 'D']
```
:::
:::tab Python (explicit stack)
```python
graph = {"A": ["B", "D", "G"], "B": ["A", "E", "F"], "C": ["F", "H"],
         "D": ["A", "F"], "E": ["B", "G"], "F": ["B", "C", "D"],
         "G": ["A", "E"], "H": ["C"]}

def dfs_stack(graph, start):
    visited = [start]
    stack = [start]
    while stack:
        top = stack[-1]                                   # peek
        unvisited = [w for w in graph[top] if w not in visited]
        if unvisited:
            w = unvisited[0]                              # first alphabetically
            visited.append(w)
            stack.append(w)                               # push
        else:
            stack.pop()                                   # backtrack
    return visited

print(dfs_stack(graph, "A"))   # ['A', 'B', 'E', 'G', 'F', 'C', 'H', 'D']
```
:::
::::

:::note Recursion *is* a stack
The recursive version has no stack variable, but every call to `dfs` pushes a **stack frame** onto the call stack, and every return pops one. Returning from a call is exactly the "pop and backtrack" step. That is why DFS is naturally recursive and BFS is not. See [1.6 Recursion](#/topic/1.6).
:::

{{trace:3.1-1}}

## Breadth-first search (BFS)

### The method (exam style)

:::steps BFS by hand
1. Add the start vertex to the visited list and **enqueue** it.
2. **Dequeue** the vertex at the front of the queue: this is the current vertex.
3. For each neighbour of the current vertex, in alphabetical order: if it is **not visited**, mark it visited and **enqueue** it.
4. The current vertex is now fully explored. Repeat from step 2 until the queue is empty.
:::

:::example BFS on Graph 1 from A
| Step | Dequeued (current) | Enqueued | Queue (front → rear) | Visited list |
|---|---|---|---|---|
| 0 | — | A | A | A |
| 1 | A | B, D, G | B D G | A B D G |
| 2 | B | E, F | D G E F | A B D G E F |
| 3 | D | (F already visited) | G E F | A B D G E F |
| 4 | G | (none) | E F | A B D G E F |
| 5 | E | (none) | F | A B D G E F |
| 6 | F | C | C | A B D G E F C |
| 7 | C | H | H | A B D G E F C H |
| 8 | H | (none) | (empty) | A B D G E F C H |

**Breadth-first order: A, B, D, G, E, F, C, H.** Look at the "layers": A (distance 0), then B D G (distance 1), then E F (distance 2), then C (3), then H (4).
:::

### BFS in code

::::tabs
:::tab AQA pseudocode
```pseudocode
SUBROUTINE bfs(graph, start)
    visited ← [start]
    queue ← [start]
    WHILE LEN(queue) > 0
        current ← queue.dequeue()
        OUTPUT current
        FOR EACH w IN graph[current]
            IF w NOT IN visited THEN
                visited.append(w)
                queue.enqueue(w)
            ENDIF
        ENDFOR
    ENDWHILE
ENDSUBROUTINE
```
:::
:::tab Python
```python
from collections import deque

graph = {"A": ["B", "D", "G"], "B": ["A", "E", "F"], "C": ["F", "H"],
         "D": ["A", "F"], "E": ["B", "G"], "F": ["B", "C", "D"],
         "G": ["A", "E"], "H": ["C"]}

def bfs(graph, start):
    visited = [start]
    queue = deque([start])
    order = []
    while queue:
        current = queue.popleft()          # dequeue from the front
        order.append(current)
        for w in graph[current]:
            if w not in visited:
                visited.append(w)          # mark when DISCOVERED
                queue.append(w)            # enqueue at the rear
    return order

print(bfs(graph, "A"))   # ['A', 'B', 'D', 'G', 'E', 'F', 'C', 'H']
```
:::
:::tab Python: shortest path (fewest edges)
```python
from collections import deque

graph = {"A": ["B", "D", "G"], "B": ["A", "E", "F"], "C": ["F", "H"],
         "D": ["A", "F"], "E": ["B", "G"], "F": ["B", "C", "D"],
         "G": ["A", "E"], "H": ["C"]}

def shortest_path(graph, start, goal):
    previous = {start: None}           # also acts as the visited list
    queue = deque([start])
    while queue:
        current = queue.popleft()
        if current == goal:
            break
        for w in graph[current]:
            if w not in previous:
                previous[w] = current
                queue.append(w)
    path, v = [], goal
    while v is not None:               # walk back along 'previous'
        path.insert(0, v)
        v = previous[v]
    return path

print(shortest_path(graph, "A", "H"))   # ['A', 'B', 'F', 'C', 'H']
```
:::
::::

:::trap
- Mark a vertex as visited when it is **enqueued** (discovered), not when it is dequeued. Otherwise the same vertex can be put in the queue twice.
- The queue is **FIFO**: new vertices join the **rear**, the next current vertex comes from the **front**. Writing the queue in the wrong direction is an easy way to lose every mark after step 2.
- The ZigZag summary slide says BFS "is typically used to find the shortest path". Be precise: **shortest path in an *unweighted* graph (fewest edges)**. For **weighted** graphs you need [Dijkstra](#/topic/3.6).
:::

{{trace:3.1-2}}

## Try it: the graph explorer

Build your own graph, pick a start vertex and step through DFS and BFS. Watch the stack grow and shrink, and the queue fill from the rear.

{{tool:graph-explorer}}

## Comparing DFS and BFS

| | Depth-first | Breadth-first |
|---|---|---|
| Supporting structure | **Stack** (or recursion) | **Queue** |
| Explores | one branch as deep as possible, then backtracks | all vertices at distance 1, then 2, then 3… |
| Natural implementation | recursive | iterative |
| Finds shortest path (unweighted)? | **No**, it may find a long route first | **Yes**, the first time it reaches a vertex is by the fewest edges |
| Memory | proportional to the **depth** of the path (good for wide graphs) | proportional to the **width** of a layer (can be huge for wide graphs) |
| Time complexity | O(V + E) | O(V + E) |

### Time complexity

Each vertex is pushed/enqueued **once** (the visited list guarantees it) and, with an **adjacency list**, each edge is examined **once from each end**. So the work is proportional to V + E: **O(V + E)**.

With an **adjacency matrix** you must scan a whole row of V entries to find each vertex's neighbours, so the total becomes V × V: **O(V²)**. The algorithm is the same; only the data structure changes the cost. See [2.4 Graphs](#/topic/2.4).

## Applications

:::columns
**Depth-first search**
- **Navigating a maze / puzzle solving**: follow one corridor to the end, backtrack at dead ends (backtracking algorithms such as Sudoku solvers).
- **Detecting cycles**: if DFS meets a vertex that is still on the stack (still "in progress"), there is a cycle.
- **Topological ordering**: ordering tasks that depend on other tasks (e.g. build order, course prerequisites), using the order vertices become fully explored.
- **Finding whether a path exists** between two vertices, and finding connected components.
- **Web crawling deep into one site** before moving on (can get stuck very deep, so usually depth-limited).
|||
**Breadth-first search**
- **Shortest path in an unweighted graph**: fewest moves in a game, fewest stops on a train line, fewest hops between routers.
- **Social networks**: "friends of friends" (everyone within 2 connections), degrees of separation.
- **Web crawlers** that index pages close to a seed page first (layer by layer).
- **Peer-to-peer networks** and broadcasting a message to all nodes in hops.
- **GPS "nearby" searches** and finding all locations within *k* steps.
:::

:::exam
- **"Trace a depth-first traversal"**: draw a table with **stack** and **visited** columns. Show every push and pop. Marks are usually for the final order *and* the stack contents at key steps.
- **"Describe a typical application"** (2 marks): name the application **and** say *why* that traversal suits it, e.g. "BFS finds the route with the fewest edges because it explores all vertices one edge away before any two edges away."
- **"Explain the difference between DFS and BFS"** (3–4 marks): stack vs queue; deep then backtrack vs layer by layer; DFS can be recursive; BFS gives shortest path in an unweighted graph.
- **State** = one fact. **Describe** = the steps or features. **Explain** = add *why/because*.
:::

:::challenge
1. Run DFS and BFS on Graph 1 starting at **H**. Which vertices are visited last in each, and why?
2. Modify the BFS Python so it also records each vertex's **distance** (number of edges) from the start.
3. Write an iterative DFS that uses a Python list as a stack and **pushes all unvisited neighbours at once**. Show by experiment that it gives a different, still valid, depth-first order.
4. How could you use DFS to decide whether an undirected graph is **connected**?
:::

:::recap
- Traversal = visit every reachable vertex once; a **visited list** handles cycles.
- **DFS** uses a **stack** (or recursion): go deep, **pop to backtrack** when no unvisited neighbours remain.
- **BFS** uses a **queue**: dequeue a vertex, enqueue all its unvisited neighbours, repeat.
- Take neighbours in **alphabetical order** unless told otherwise; mark visited when discovered.
- Graph 1 from A: DFS **A B E G F C H D**; BFS **A B D G E F C H**.
- Both are **O(V + E)** with an adjacency list, **O(V²)** with a matrix.
- BFS → shortest path (unweighted), friends-of-friends. DFS → mazes, backtracking, cycle detection, topological sort.
:::

:::related
- [2.4 Graphs](#/topic/2.4) — adjacency matrices and lists
- [2.3 Stacks](#/topic/2.3) and [2.2 Queues](#/topic/2.2)
- [3.2 Tree traversal](#/topic/3.2) — depth-first traversals of trees
- [3.6 Dijkstra's shortest path algorithm](#/topic/3.6) — shortest paths when edges have weights
- [1.6 Recursion](#/topic/1.6)
:::

*/});
