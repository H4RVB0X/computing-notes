CS.registerTopic({ id: "11.1", title: "Big Data" }, function () {/*

:::objectives
- Define **Big Data** and describe it using the three Vs: **volume**, **velocity** and **variety**, with realistic examples and numbers.
- Distinguish **structured**, **semi-structured** and **unstructured** data, and explain why Big Data does not fit "the usual containers" (a single relational database on one server).
- Explain why Big Data processing must be **distributed** across many machines, using a map → shuffle → reduce word count as an example.
- Explain which features of **functional programming** make it easier to write correct, distributed code: immutability, no side effects, statelessness, higher-order functions.
- Describe the **fact-based model** (immutable, timestamped facts) and draw a **graph schema** using nodes, edges and properties.
:::

:::quick At a glance
- **Big Data** = a catch-all term for data that **won't fit the usual containers**: too big, too fast or too varied for one server and a conventional relational database.
- **Volume**: too much data to store on a single server. **Velocity**: data arrives (and must be processed) very quickly, often as a stream, with responses needed in milliseconds to seconds. **Variety**: many types and forms (text, images, video, sensor readings; structured and unstructured).
- Most Big Data is **unstructured**, so it cannot be forced into rows and columns.
- When data won't fit on one server, **processing is distributed** across many machines working in **parallel**.
- **Functional programming** suits distributed code: **immutable data** (nothing can be overwritten mid-job), **no side effects** (same input → same output), **stateless** functions, and **higher-order functions** such as **map** and **reduce/fold** that split naturally across machines.
- **Fact-based model**: data stored as **immutable, timestamped facts** that are never updated or deleted; the current state is *derived* from them.
- **Graph schema**: shows the structure of the dataset as **nodes** (entities, ovals), **edges** (relationships, solid lines) and **properties** (data about a node, rectangles joined by dashed lines).
- **Machine learning** is used to find patterns in Big Data, especially unstructured data.
:::

:::keyterms
Big Data :: A catch-all term for data that won't fit the usual containers, characterised by volume, velocity and variety. :: Data too big, too fast or too messy for one normal database on one server.
Volume :: The quantity of data is too large to be stored on (or processed by) a single server. :: There is simply too much of it.
Velocity :: Data is generated and must be processed at high speed, often as a continuous stream, with responses needed within milliseconds to seconds. :: It arrives fast and keeps coming.
Variety :: Data comes in many different types and forms, including structured, semi-structured and unstructured data such as text and multimedia. :: Lots of different kinds of data mixed together.
Structured data :: Data that conforms to a predefined model (fields, records, tables) so it can be stored in a relational database and queried with SQL. :: Fits neatly into rows and columns.
Unstructured data :: Data with no predefined model that cannot easily be organised into rows and columns, e.g. emails, images, video, audio, social media posts. :: Free-form stuff you can't put in a table.
Distributed processing :: Splitting a processing task across multiple computers (nodes) that work in parallel and communicate to produce the overall result. :: Lots of machines each doing a share of the work at the same time.
Immutable data :: Data that cannot be changed once created; "changing" it produces a new copy. :: Write once, never edit.
Side effect :: Any change a function makes to state outside itself (e.g. altering a global variable or a parameter passed by reference) other than returning a value. :: A function secretly changing something else.
Fact-based model :: A way of representing data as a collection of immutable, atomic, timestamped facts that are never updated or deleted. :: A diary of things that were true at a time, never rubbed out.
Graph schema :: A graph that captures the structure of a dataset, using nodes for entities, edges for relationships and properties for information about nodes. :: A map of what kinds of things exist and how they link.
Node (graph schema) :: Represents an entity in the dataset, e.g. a person or a product; drawn as an oval. :: A thing.
Edge (graph schema) :: Represents a relationship between two nodes; drawn as a solid line, may be directed. :: How two things are connected.
Property (graph schema) :: A piece of information about a node, e.g. name or age; drawn as a rectangle linked by a dashed line. :: A fact about a thing.
:::

## What Big Data is

The AQA specification calls Big Data **"a catch-all term for data that won't fit the usual containers"**. The "usual container" is a relational database running on a single server. Big Data breaks that model in at least one of three ways.

:::definition The three Vs
- **Volume**: there is too much data to fit on a single server.
- **Velocity**: the data is streaming in, and responses are needed in milliseconds to seconds.
- **Variety**: the data comes in many forms: structured, unstructured, text, multimedia.
:::

The three Vs are about the **difficulty of storing and processing** the data, not just its size. A 50 TB archive of neat, rarely-changing table rows is large, but a 2 GB-per-second stream of mixed video and text is harder.

### The three Vs with numbers

| V | What it means | Example | Rough scale |
|---|---|---|---|
| **Volume** | Total amount exceeds one server's storage | Social network storing every photo and message; a supermarket keeping every transaction for 10 years | A large server might hold tens to hundreds of terabytes; global data created per year is estimated at **over 100 zettabytes** (1 ZB = 10<sup>21</sup> bytes) |
| **Velocity** | Data generated and processed fast, often continuously | Card payments checked for fraud; stock-market feeds; IoT sensors | A card network can handle **thousands of transactions per second**, and each must be approved or declined in well under a second |
| **Variety** | Many types and formats arrive together | A hospital: patient records (tables), X-ray images, doctors' free-text notes, heart-monitor streams | Each source needs different processing; no single table design fits all of it |

:::example Volume and velocity from a sensor network
A city installs **10,000** traffic sensors. Each sends **100 readings per second**, each reading **16 bytes**.

1. Readings per second: 10,000 × 100 = **1,000,000** readings/s.
2. Bytes per second: 1,000,000 × 16 = **16,000,000 B/s = 16 MB/s** (velocity).
3. Seconds in a day: 24 × 60 × 60 = **86,400 s**.
4. Bytes per day: 16 MB/s × 86,400 = **1,382,400 MB ≈ 1.38 TB per day**.
5. Per year: 1.38 TB × 365 ≈ **505 TB** (volume): already beyond a single typical server, and that is one data source.

The velocity matters too: if a sensor reports a crash, the traffic lights need to react in seconds, not after an overnight batch job.
:::

:::trap
- Do not define Big Data as just "a lot of data". The mark scheme wants the idea that it **does not fit the usual containers** (one server / a relational database) **and** the three Vs.
- **Velocity is not "the speed of the network".** It is the rate at which data is **generated and must be processed**.
- **Variety is not "lots of records".** It is about different **types and structures** of data.
- Learn the AQA wording for volume: "too big to fit into a **single server**".
:::

## Structured, semi-structured and unstructured data

| Type | Description | Examples | Fits a relational table? |
|---|---|---|---|
| **Structured** | Follows a predefined model of tables, fields and records | Customer table, bank transactions | Yes, searchable with SQL |
| **Semi-structured** | No fixed table, but contains tags or delimiters that reveal the structure | JSON, XML, CSV files, email headers | Partly |
| **Unstructured** | No predefined model at all | Free text, images, video, audio, social media posts, web pages | No |

Most Big Data is **unstructured**. A photo has a structure (pixels), and a web page has HTML tags, but the *information* in them (who is in the photo, what the page is about) cannot be put into columns without analysing it first.

```text Semi-structured: JSON
{"albums": [
  {"genre": "Rap", "title": "Heavy is the Head", "artist": "Stormzy", "year": 2019},
  {"genre": "Indie Rock", "title": "AM", "artist": "Arctic Monkeys", "year": 2013}
]}
```

### Why relational databases struggle ("the usual containers")

:::columns
**Relational databases expect…**
- a **fixed schema** decided in advance (tables, fields, data types)
- data that is mostly **structured**
- to run on **one server** (scaling up means buying a bigger server)
- **joins** between tables, which are fast when all tables are on one disk
- updates that **overwrite** old values in place, with locking to keep it consistent
|||
**Big Data brings…**
- data whose shape is **unknown or keeps changing**
- mostly **unstructured** data (video, text, images)
- more data than **any single server** can hold
- tables spread across many machines, so a join means sending data **across the network**: slow
- so many simultaneous writes that **locking** for consistency becomes a bottleneck
:::

:::tip Dealing with unstructured data: machine learning
**Machine learning** lets programs find patterns in data without being told exactly what to look for. Simple forms are pattern matching (searching text for terms, e.g. with regular expressions); complex forms build their own models from the data, e.g. classifying images, detecting fraudulent transactions or predicting which products a customer will buy. Big Data provides the huge training sets these techniques need.
:::

## Distributed processing

When the data will not fit on one server, **the processing must be distributed across more than one machine**. Instead of moving all the data to one powerful computer, the work is split into pieces and **sent to where the data is stored**. Each machine (node) processes its own share **in parallel**, and the partial results are combined.

- One machine usually acts as a **coordinator** (master), splitting the job and collecting results.
- The other machines are **workers**, each processing the data on its own disks.
- Cloud computing makes it easy to rent hundreds of workers for one job.

### Worked example: a distributed word count (map → shuffle → reduce)

This pattern is called **MapReduce**. It is the classic way to process Big Data, and its two main stages are named after the higher-order functions **map** and **reduce** (fold) from functional programming.

:::figure Counting words across three machines: each mapper works on its own chunk in parallel; the shuffle groups pairs by key; each reducer folds one group.
<svg class="diagram" viewBox="0 0 700 330" role="img" aria-label="MapReduce word count: three input chunks are mapped to key-value pairs, shuffled into groups by word, then reduced to totals">
  <defs><marker id="arr111" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="12">
    <text x="70" y="20" text-anchor="middle" font-weight="bold">Input chunks</text>
    <text x="235" y="20" text-anchor="middle" font-weight="bold">Map</text>
    <text x="440" y="20" text-anchor="middle" font-weight="bold">Shuffle (group by key)</text>
    <text x="625" y="20" text-anchor="middle" font-weight="bold">Reduce</text>
    <rect x="10" y="40" width="120" height="60" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="70" y="65" text-anchor="middle">Server 1:</text><text x="70" y="83" text-anchor="middle">"big data is big"</text>
    <rect x="10" y="135" width="120" height="60" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="70" y="160" text-anchor="middle">Server 2:</text><text x="70" y="178" text-anchor="middle">"data is fast"</text>
    <rect x="10" y="230" width="120" height="60" rx="6" fill="#7c9aff" fill-opacity="0.3" stroke="currentColor"/>
    <text x="70" y="255" text-anchor="middle">Server 3:</text><text x="70" y="273" text-anchor="middle">"big data"</text>
    <rect x="170" y="35" width="130" height="70" rx="6" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor"/>
    <text x="235" y="55" text-anchor="middle" font-family="monospace">(big,1) (data,1)</text><text x="235" y="75" text-anchor="middle" font-family="monospace">(is,1) (big,1)</text>
    <rect x="170" y="130" width="130" height="70" rx="6" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor"/>
    <text x="235" y="155" text-anchor="middle" font-family="monospace">(data,1) (is,1)</text><text x="235" y="175" text-anchor="middle" font-family="monospace">(fast,1)</text>
    <rect x="170" y="225" width="130" height="70" rx="6" fill="#5fd3a0" fill-opacity="0.25" stroke="currentColor"/>
    <text x="235" y="265" text-anchor="middle" font-family="monospace">(big,1) (data,1)</text>
    <line x1="130" y1="70" x2="168" y2="70" stroke="currentColor" marker-end="url(#arr111)"/>
    <line x1="130" y1="165" x2="168" y2="165" stroke="currentColor" marker-end="url(#arr111)"/>
    <line x1="130" y1="260" x2="168" y2="260" stroke="currentColor" marker-end="url(#arr111)"/>
    <rect x="360" y="40" width="160" height="40" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="440" y="65" text-anchor="middle" font-family="monospace">big: [1,1,1]</text>
    <rect x="360" y="105" width="160" height="40" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="440" y="130" text-anchor="middle" font-family="monospace">data: [1,1,1]</text>
    <rect x="360" y="170" width="160" height="40" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="440" y="195" text-anchor="middle" font-family="monospace">is: [1,1]</text>
    <rect x="360" y="235" width="160" height="40" rx="6" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="440" y="260" text-anchor="middle" font-family="monospace">fast: [1]</text>
    <line x1="300" y1="70" x2="358" y2="60" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#arr111)"/>
    <line x1="300" y1="165" x2="358" y2="125" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#arr111)"/>
    <line x1="300" y1="165" x2="358" y2="190" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#arr111)"/>
    <line x1="300" y1="175" x2="358" y2="252" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#arr111)"/>
    <line x1="300" y1="260" x2="358" y2="70" stroke="currentColor" stroke-dasharray="4 3" marker-end="url(#arr111)"/>
    <rect x="565" y="40" width="120" height="40" rx="6" fill="#c792ea" fill-opacity="0.3" stroke="currentColor"/><text x="625" y="65" text-anchor="middle" font-family="monospace">big → 3</text>
    <rect x="565" y="105" width="120" height="40" rx="6" fill="#c792ea" fill-opacity="0.3" stroke="currentColor"/><text x="625" y="130" text-anchor="middle" font-family="monospace">data → 3</text>
    <rect x="565" y="170" width="120" height="40" rx="6" fill="#c792ea" fill-opacity="0.3" stroke="currentColor"/><text x="625" y="195" text-anchor="middle" font-family="monospace">is → 2</text>
    <rect x="565" y="235" width="120" height="40" rx="6" fill="#c792ea" fill-opacity="0.3" stroke="currentColor"/><text x="625" y="260" text-anchor="middle" font-family="monospace">fast → 1</text>
    <line x1="520" y1="60" x2="563" y2="60" stroke="currentColor" marker-end="url(#arr111)"/>
    <line x1="520" y1="125" x2="563" y2="125" stroke="currentColor" marker-end="url(#arr111)"/>
    <line x1="520" y1="190" x2="563" y2="190" stroke="currentColor" marker-end="url(#arr111)"/>
    <line x1="520" y1="255" x2="563" y2="255" stroke="currentColor" marker-end="url(#arr111)"/>
    <text x="350" y="318" text-anchor="middle" font-size="12">Dashed arrows = pairs sent across the network to the reducer responsible for that word (only some shown)</text>
  </g>
</svg>
:::

:::steps The three stages
1. **Map**: each server applies the *same* function to its own chunk, turning every word into a pair `(word, 1)`. No server needs to know about any other server's data.
2. **Shuffle**: pairs with the same key are sent to the same place and grouped: `big: [1,1,1]`.
3. **Reduce**: each group is folded into one value by adding: `big → 1+1+1 = 3`. Different words can be reduced on different machines at the same time.
:::

Final answer: **big 3, data 3, is 2, fast 1**. Check by hand: "big" appears twice on server 1 and once on server 3.

```python MapReduce word count (simulated on one machine)
from functools import reduce

chunks = ["big data is big", "data is fast", "big data"]   # one per server

# MAP: the same pure function is applied to every chunk independently
def mapper(chunk):
    return [(word, 1) for word in chunk.split()]

mapped = list(map(mapper, chunks))
print(mapped[0])   # [('big', 1), ('data', 1), ('is', 1), ('big', 1)]

# SHUFFLE: group the values by key
groups = {}
for pairs in mapped:
    for word, one in pairs:
        groups.setdefault(word, []).append(one)
print(groups)      # {'big': [1, 1, 1], 'data': [1, 1, 1], 'is': [1, 1], 'fast': [1]}

# REDUCE: fold each group into a single total
totals = {word: reduce(lambda acc, x: acc + x, ones, 0) for word, ones in groups.items()}
print(totals)      # {'big': 3, 'data': 3, 'is': 2, 'fast': 1}
```

:::why Why this works safely in parallel
The mapper only *reads* its chunk and *returns* new pairs. It never changes shared data, so it does not matter which server finishes first, or whether a server crashes and its chunk is re-run on another machine: the answer is identical. That guarantee comes straight from functional programming.
:::

## Why functional programming suits Big Data

This is the most commonly examined part of the topic. Questions read: "Explain why functional programming is often used for Big Data" or "Explain which features of functional programming make it easier to write code that can be distributed".

### The problem with imperative code in parallel

In an imperative (procedural) program, many subroutines can read and **change** the same variables. On one processor that is manageable. Across 1,000 machines it causes:

- **Race conditions**: two processes read a shared total of 10, each add 1 and write back 11; the true answer is 12. The result depends on timing.
- **Unpredictable side effects**: a subroutine on one machine changes a global value another machine is relying on.
- **Hard-to-retry work**: if a machine fails halfway through a job that modified shared state, you cannot simply re-run it without double-counting.
- **Locking overhead**: to stop the above, shared data must be locked, so machines spend time waiting rather than working.

### The model points

| Feature of FP | What it means | Why it helps distributed processing |
|---|---|---|
| **Immutable data** | Once a value or data structure is created it cannot be changed; "changing" a list creates a new list | No process can overwrite data another is using, so there are **no race conditions** and no need for locks |
| **No side effects** (pure functions) | A function only uses its arguments and only returns a result; it changes nothing outside itself | The **same input always gives the same output**, so functions can run **in any order, on any machine, in parallel**, and a failed task can simply be **re-run** |
| **Statelessness** | No program state (variables) that changes during execution | Machines do not need to share or synchronise state, so each piece of work is **independent** |
| **Higher-order functions** (map, filter, reduce/fold) | Functions that take functions as arguments | The programmer says **what** to do to each item; `map` can split the list across machines, and `reduce` combines partial results. The library handles **how** to distribute it |
| **Easier to reason about / prove correct** | Code is like mathematical functions; referential transparency | Distributed code is **more likely to be correct** and easier to test, since each function can be tested on its own |

:::example Model answer: "Explain why functional programming is suited to processing Big Data" (4 marks)
- Big Data is too large for one server, so processing is **distributed across many machines running in parallel**.
- Functional programs use **immutable data**, so no machine can change data that another machine is using; this avoids race conditions and the need for locking.
- Functions have **no side effects**: a function always produces the same output for the same input, so it **does not matter in which order or on which machine** a function is run, and failed tasks can be repeated.
- **Higher-order functions** such as map and fold/reduce apply a function to each part of the data independently, so the work can be **split across processors** and the partial results combined.
:::

:::trap
- "Functional programming is faster" earns nothing. FP is used because it makes it easier to write **correct** code that **can be distributed**, not because each instruction runs faster.
- "No variables" alone is too vague. Say **immutable**: values cannot be changed after creation, so parallel processes cannot interfere.
- Do not stop at naming a feature. Each mark needs **feature + why it helps when distributed** (e.g. "no side effects, *so* functions can run in any order on different machines").
- The teacher's slides say programmers struggle to "maintain data integrity" in distributed programs. That is right, but in the exam say *why*: shared, mutable state changed by many processes at once.
:::

## The fact-based model

A relational database stores the **current state** of each entity and **overwrites** it when something changes. The **fact-based model** stores **facts** instead.

:::definition Fact
A **fact** is a single, atomic piece of data that is **timestamped** and **immutable**. Because it records what was true *at that time*, it is **always true** and never needs changing.
:::

Properties of facts:

- **Atomic**: one piece of information each; cannot be broken down further.
- **Timestamped**: records *when* it became true.
- **Immutable**: never updated or deleted, only **added to**.
- **No redundancy**: each fact is stored once.

:::example Fact-based versus relational: a user moves house
**Relational approach**: the `User` row is changed with `UPDATE User SET Town = 'Leeds' WHERE UserID = 1222`. The fact that they used to live in Essex is **lost**.

**Fact-based approach**: a new fact is added; nothing is changed.

| Fact | Timestamp |
|---|---|
| User 1222 has name "Mark" | 03/02/2020 10:12 |
| User 1222 lives in Essex | 05/04/2020 17:03 |
| User 1222 is friends with user 1333 | 13/03/2020 20:38 |
| User 1222 donated £20 to cause 7899 | 25/08/2020 09:15 |
| User 1222 lives in Leeds | 10/01/2021 08:40 |

**Deriving the current state**: to find where user 1222 lives now, take the fact of that type with the **latest timestamp**: Leeds. To find where they lived in June 2020, take the latest fact *before* that date: Essex.
:::

Advantages of the fact-based model for Big Data:

- **Full history**: the data can be queried as it was at **any point in time**.
- **Robust to errors**: if a wrong fact is added, earlier correct facts are untouched; you can add a correcting fact or ignore the bad one.
- **Fits distribution**: facts are only appended, never updated, so many servers can add facts at once **without locking** (the same immutability idea as functional programming).
- **Flexible**: new kinds of fact can be added without redesigning a schema.

The cost is **storage**: nothing is ever deleted, so the dataset grows for ever, and working out the current state needs processing.

## Graph schemas

A **graph schema** captures the **structure** of a dataset stored with the fact-based model: what kinds of things exist and how they relate. It has three components.

| Component | Represents | Drawn as |
|---|---|---|
| **Node** | An entity (a type of thing): User, Charity cause, Product | **Oval** |
| **Edge** | A relationship between two nodes: *friends with*, *donated to* | **Solid line**, labelled; may be directed (arrow) |
| **Property** | Information about a node: name, location, amount | **Rectangle**, joined to its node by a **dashed line** |

:::figure Graph schema for a school: Student and Teacher nodes are linked to Subject nodes by edges; properties hang off nodes on dashed lines.
<svg class="diagram" viewBox="0 0 680 320" role="img" aria-label="Graph schema with Student, Subject and Teacher nodes, edges studies, teaches and friends with, and properties on dashed lines">
  <defs><marker id="arr112" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13">
    <ellipse cx="130" cy="160" rx="60" ry="28" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="130" y="165" text-anchor="middle" font-weight="bold">Student</text>
    <ellipse cx="360" cy="160" rx="60" ry="28" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="360" y="165" text-anchor="middle" font-weight="bold">Subject</text>
    <ellipse cx="580" cy="160" rx="60" ry="28" fill="#7c9aff" fill-opacity="0.35" stroke="currentColor"/><text x="580" y="165" text-anchor="middle" font-weight="bold">Teacher</text>
    <line x1="190" y1="160" x2="298" y2="160" stroke="currentColor" stroke-width="2" marker-end="url(#arr112)"/><text x="245" y="150" text-anchor="middle">studies</text>
    <line x1="520" y1="160" x2="422" y2="160" stroke="currentColor" stroke-width="2" marker-end="url(#arr112)"/><text x="470" y="150" text-anchor="middle">teaches</text>
    <path d="M100,186 C70,250 190,250 160,186" fill="none" stroke="currentColor" stroke-width="2"/><text x="130" y="262" text-anchor="middle">friends with</text>
    <rect x="20" y="40" width="80" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="60" y="60" text-anchor="middle">name</text>
    <rect x="110" y="40" width="80" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="150" y="60" text-anchor="middle">date of birth</text>
    <rect x="20" y="280" width="80" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="60" y="300" text-anchor="middle">tutor group</text>
    <line x1="60" y1="70" x2="110" y2="134" stroke="currentColor" stroke-dasharray="5 4"/>
    <line x1="150" y1="70" x2="138" y2="132" stroke="currentColor" stroke-dasharray="5 4"/>
    <line x1="60" y1="280" x2="95" y2="183" stroke="currentColor" stroke-dasharray="5 4"/>
    <rect x="300" y="40" width="60" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="330" y="60" text-anchor="middle">title</text>
    <rect x="370" y="40" width="80" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="410" y="60" text-anchor="middle">exam board</text>
    <line x1="330" y1="70" x2="350" y2="132" stroke="currentColor" stroke-dasharray="5 4"/>
    <line x1="410" y1="70" x2="372" y2="133" stroke="currentColor" stroke-dasharray="5 4"/>
    <rect x="540" y="40" width="80" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="580" y="60" text-anchor="middle">name</text>
    <rect x="540" y="250" width="80" height="30" fill="#ffb86b" fill-opacity="0.3" stroke="currentColor"/><text x="580" y="270" text-anchor="middle">room</text>
    <line x1="580" y1="70" x2="580" y2="132" stroke="currentColor" stroke-dasharray="5 4"/>
    <line x1="580" y1="250" x2="580" y2="188" stroke="currentColor" stroke-dasharray="5 4"/>
  </g>
</svg>
:::

Reading the schema as facts: "Student 501 **studies** Computer Science (01/09/2025)", "Teacher T12 **teaches** Computer Science (01/09/2025)", "Student 501 has name Priya (01/09/2024)". Each edge or property in the schema is a *type* of fact the dataset can hold.

:::trap
- **Edges join nodes to nodes only.** The dashed line from a node to a property is **not** an edge. Drawing a property as an oval, or joining it with a solid line, loses marks.
- A graph schema shows the **types** of node, edge and property (the structure), not every individual student.
- Do not confuse the fact-based model with the relational **entity-relationship** model. Facts are timestamped and never updated; relational rows are overwritten.
:::

Why graph schemas suit Big Data: they are **easy to extend** (add a new node, edge or property type without changing existing facts, because facts are immutable), and they model **highly connected** data such as social networks naturally.

:::exam
- **1–2 marks, "State the three Vs" / "Describe volume"**: use the AQA wording: volume = *too big to fit on a single server*; velocity = *streaming data, responses in milliseconds to seconds*; variety = *many forms, structured and unstructured, text and multimedia*.
- **2 marks, "Explain why Big Data cannot be stored in a relational database"**: unstructured data does not fit rows and columns / a fixed schema; data spread across many servers makes joins and consistency (locking) inefficient.
- **4–6 marks, "Explain why functional programming is suited to Big Data"**: for every mark, give a **feature + consequence for distribution**: immutable data → no race conditions; no side effects → same result in any order, tasks can be rerun; stateless; higher-order functions (map, reduce) → work split across machines and results combined.
- **Draw a graph schema**: ovals for nodes, labelled solid lines for edges, rectangles on dashed lines for properties. Label everything.
- **Describe the fact-based model**: immutable, atomic, timestamped facts; never updated or deleted; current state derived from latest facts; history kept.
:::

:::challenge
1. Design a graph schema for a music-streaming service (users, songs, artists, playlists). Include at least three edge types and two properties per node.
2. Write a list of eight timestamped facts for a user of that service, including two facts that mean their "current" favourite artist changed. How would you derive their current favourite?
3. Rewrite the MapReduce word count so the reduce stage finds the **longest word** in each chunk instead. Which stage changes and which stays the same?
4. A bank wants to detect fraud on card payments as they happen. Which of the three Vs is most important, and why would an overnight batch job be no use?
:::

:::recap
- **Big Data** won't fit the usual containers; described by **volume** (too big for one server), **velocity** (fast streams, fast responses) and **variety** (many forms, mostly unstructured).
- Relational databases need a fixed schema and structured data, and work best on one server: Big Data breaks all three assumptions.
- Big Data is processed by **distributing** work across many machines in parallel, e.g. **map → shuffle → reduce**.
- **Functional programming** helps: immutable data, no side effects, statelessness and higher-order functions make code correct and safe to distribute.
- **Fact-based model**: atomic, immutable, **timestamped** facts; never updated or deleted; current state derived from the latest facts.
- **Graph schema**: **nodes** (ovals), **edges** (solid lines), **properties** (rectangles on dashed lines).
- **Machine learning** finds patterns in Big Data, especially unstructured data.
:::

:::related
- [12.1 The functional programming paradigm](#/topic/12.1)
- [12.2 Map, filter and fold](#/topic/12.2)
- [10.2 Relational databases](#/topic/10.2) — the "usual container"
- [10.5 Client-server databases](#/topic/10.5) — concurrency and locking
- [2.4 Graphs](#/topic/2.4) — nodes and edges
:::

*/});
