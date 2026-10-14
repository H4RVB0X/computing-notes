CS.registerTopic({ id: "2.7", title: "Dictionaries" }, function () {/*

:::objectives
- Describe a **dictionary** as an abstract data type made of **key–value pairs**, where each key is unique.
- Name and apply the standard operations: **add**, **retrieve (look up)**, **update**, **delete**, **test for a key** and **iterate**.
- Use a dictionary in Python confidently, including nested dictionaries and counting.
- Explain how dictionaries are usually implemented (a **hash table**) and why that makes look-up fast.
- Describe applications of dictionaries, especially **information retrieval**.
:::

:::quick At a glance
- A **dictionary** is an ADT holding a collection of **key–value pairs**. You look values up **by key**, not by position.
- Keys are **unique**; values can repeat and can be any type (even lists or other dictionaries).
- Operations: **add** a pair, **retrieve** the value for a key, **update** a value, **delete** a pair, **check** whether a key exists, **iterate** over pairs.
- Also called an **associative array** or **map**. Python: `dict`, e.g. `ages = {"Ali": 17, "Bea": 16}`.
- Usually implemented with a **hash table**, so look-up, insertion and deletion are close to **O(1)** on average.
- Applications: **information retrieval** (word counts, search indexes), translation, phone books, DNS-style look-ups, caches, JSON data, sparse vectors, dictionary compression.
:::

:::keyterms
Dictionary :: An abstract data type consisting of a collection of key–value pairs, in which each key is unique and is used to look up its associated value. :: A look-up table: give it a key, get the value.
Key :: The unique identifier used to store and retrieve a value in a dictionary. :: The word you look up.
Value :: The data associated with a key. :: The definition you find.
Key–value pair :: A key together with the value associated with it. :: One entry.
Associative array :: Another name for a dictionary: an array indexed by keys rather than by integer positions. :: An array whose "indexes" can be words.
Information retrieval :: Finding relevant material (e.g. documents) in a large collection, often using a dictionary that maps words to counts or to the documents containing them. :: How search engines find pages.
:::

## What a dictionary is

An array is indexed by **position**: `scores[3]`. A dictionary is indexed by **key**: `scores["Bea"]`. The key can be a string, a number or any other value that cannot change (in Python, an *immutable* value).

<svg class="diagram" viewBox="0 0 560 210" role="img" aria-label="A dictionary drawn as unique keys on the left, each with an arrow to its value on the right; two keys share the same value 84">
  <defs><marker id="arr27" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <text x="110" y="22" text-anchor="middle" font-weight="bold">keys (unique)</text>
    <text x="420" y="22" text-anchor="middle" font-weight="bold">values</text>
    <g stroke="currentColor" fill="#7c9aff" fill-opacity="0.3">
      <rect x="50" y="40" width="120" height="32" rx="6"/><rect x="50" y="85" width="120" height="32" rx="6"/><rect x="50" y="130" width="120" height="32" rx="6"/><rect x="50" y="175" width="120" height="32" rx="6"/>
    </g>
    <g stroke="currentColor" fill="#5ec27a" fill-opacity="0.3">
      <rect x="360" y="50" width="120" height="32" rx="6"/><rect x="360" y="105" width="120" height="32" rx="6"/><rect x="360" y="160" width="120" height="32" rx="6"/>
    </g>
    <g text-anchor="middle" fill="currentColor">
      <text x="110" y="61">"Detra"</text><text x="110" y="106">"Nova"</text><text x="110" y="151">"Hwa"</text><text x="110" y="196">"Elsa"</text>
      <text x="420" y="71">17</text><text x="420" y="126">84</text><text x="420" y="181">29</text>
    </g>
    <line x1="172" y1="56" x2="356" y2="66" stroke="currentColor" marker-end="url(#arr27)"/>
    <line x1="172" y1="101" x2="356" y2="119" stroke="currentColor" marker-end="url(#arr27)"/>
    <line x1="172" y1="146" x2="356" y2="124" stroke="currentColor" marker-end="url(#arr27)"/>
    <line x1="172" y1="191" x2="356" y2="178" stroke="currentColor" marker-end="url(#arr27)"/>
    <text x="265" y="160" text-anchor="middle" font-size="12">values may repeat</text>
  </g>
</svg>

### The operations

| Operation | Meaning | Python |
|---|---|---|
| **Create** | make an empty or initialised dictionary | `d = {}` or `d = {"Nova": 84}` |
| **Add** | insert a new key–value pair | `d["Bob"] = 78` |
| **Retrieve** | get the value for a key | `d["Nova"]` or `d.get("Nova")` |
| **Update** | change the value for an existing key | `d["Nova"] = 71` |
| **Delete** | remove a key and its value | `del d["Nova"]` or `d.pop("Nova")` |
| **Test for a key** | is this key present? | `"Nova" in d` |
| **Iterate** | visit every pair | `for k, v in d.items():` |
| **Size** | number of pairs | `len(d)` |

:::trap
- **Keys must be unique.** Adding a pair with a key that already exists **replaces** the old value; it does not create a second entry.
- Retrieving a key that is not there is an **error** in most languages (`KeyError` in Python). Check with `in` first, or use `d.get(key, default)`.
- A dictionary is **unordered as an ADT**: do not rely on position, and there is no `d[0]` meaning "first item". (Python 3.7+ happens to remember insertion order, but that is a language feature, not part of the ADT.)
- Do not confuse **dictionary** (the ADT: what it does) with **hash table** (one way of building it).
:::

## Using a dictionary in Python

```python
results = {"Detra": 17, "Nova": 84, "Charlie": 22, "Hwa": 75}

# retrieve
print(results["Charlie"])            # 22
print(results.get("Zed", "absent"))  # absent  (no error)

# add and update use the same syntax
results["Bob"] = 78                  # new key -> added
results["Hwa"] = 71                  # existing key -> updated

# test and delete
if "Detra" in results:
    del results["Detra"]

# iterate
for name, score in results.items():
    print(name, score)

print(len(results))                  # 4
print(sorted(results))               # keys in order: ['Bob', 'Charlie', 'Hwa', 'Nova']
print(max(results, key=results.get)) # key with the biggest value: Nova
```

### Values can be anything

A value can be a list, a record-like dictionary or another dictionary. This is how JSON data (used by web APIs) is structured.

```python
countries = {"France": ["Paris", 67], "Germany": ["Berlin", 83], "Ireland": ["Dublin", 5]}
print(countries["Ireland"][1])       # 5   -> the value is a list, so index into it

pupil = {"name": "Aisha", "form": "12B", "grades": {"CS": "A", "Maths": "A*"}}
print(pupil["grades"]["Maths"])      # A*
pupil["grades"]["Physics"] = "B"     # add to the inner dictionary
print(len(pupil["grades"]))          # 3
```

::::tabs
:::tab AQA-style pseudocode
```pseudocode
results ← {"Detra": 17, "Nova": 84}
results["Bob"] ← 78                 # add
results["Nova"] ← 71                # update
OUTPUT results["Detra"]             # retrieve -> 17
IF "Bob" IN results THEN
    REMOVE results["Bob"]           # delete
ENDIF
```
:::
:::tab VB.NET (as in class)
```text
Dim results As New Dictionary(Of String, Integer)
results.Add("Detra", 17)
results.Add("Nova", 84)
If results.ContainsKey("Nova") Then
    Console.WriteLine(results.Item("Nova"))
End If
For Each pair As KeyValuePair(Of String, Integer) In results
    Console.WriteLine("{0}, {1}", pair.Key, pair.Value)
Next
results.Remove("Detra")
```
:::
::::

## How a dictionary is implemented

The dictionary is an ADT, so it could be built several ways:

| Implementation | Look-up cost | Comment |
|---|---|---|
| **Hash table** | about O(1) on average | the usual choice: hash the key to find its slot (see [2.6](#/topic/2.6)) |
| **Binary search tree** of keys | O(log n) if balanced | keeps keys in sorted order, useful for range queries |
| **List of (key, value) pairs** | O(n) | simple but slow: linear search for every look-up |

:::why Why is a hash table the natural fit?
A dictionary's job is "given a key, find the value". A hash table turns the key directly into an array index, so the value is found without searching. Python's `dict` is a hash table, which is why keys must be **immutable**: if a key could change after insertion, its hash value would change and the item could never be found again.
:::

{{tool:hash-table-demo}}

## Applications

### Information retrieval

**Information retrieval** means finding the relevant documents in a large collection: the job of a search engine. Dictionaries are central to it.

:::example Counting word frequencies
Counting how often each word appears in a document gives a "bag of words" that can be compared with other documents.
```python
text = "the cat sat on the mat the end"
counts = {}
for word in text.split():
    if word in counts:
        counts[word] = counts[word] + 1      # seen before: add 1
    else:
        counts[word] = 1                     # first time: start at 1
print(counts)
# {'the': 3, 'cat': 1, 'sat': 1, 'on': 1, 'mat': 1, 'end': 1}
print(counts["the"])                         # 3
```
Each document's word counts can be treated as a [vector](#/topic/2.8), and the **dot product** of two such vectors measures how similar the documents are.
:::

{{trace:2.7-1}}

:::example An inverted index (how a search engine finds pages)
An **inverted index** maps each word to the **set of documents** that contain it. A query is answered by looking up each word and intersecting the sets, with no need to scan every document.
```python
docs = {1: "red apples and green pears",
        2: "green tea",
        3: "red tea and red wine"}

index = {}
for doc_id, text in docs.items():
    for word in text.split():
        if word not in index:
            index[word] = set()
        index[word].add(doc_id)

print(sorted(index["red"]))                    # [1, 3]
print(sorted(index["green"] & index["tea"]))   # [2]   -> documents with both words
print(sorted(index.get("coffee", set())))      # []
```
:::

### Other applications

- **Translation / look-up tables**: English word → French word; product code → price.
- **Phone book / contacts**: name → number.
- **DNS-style resolution**: domain name → IP address (see [9.3](#/topic/9.3)).
- **Configuration and JSON**: settings and web API data are key–value structures.
- **Caching / memoisation**: store the result of an expensive calculation keyed by its inputs, so it is never computed twice.
- **Dictionary-based compression**: repeated strings are replaced by short codes from a dictionary (see [5.8](#/topic/5.8)).
- **Sparse vectors**: store only the non-zero entries, `{position: value}` (see [2.8](#/topic/2.8)).
- **Counting and grouping**: votes per candidate, sales per region.

:::example Memoisation with a dictionary
```python
memo = {}
def fib(n):
    if n in memo:
        return memo[n]                 # already worked out: instant
    result = n if n < 2 else fib(n - 1) + fib(n - 2)
    memo[n] = result
    return result

print(fib(80))       # 23416728348467685, instantly
print(len(memo))     # 81 stored results
```
:::

:::exam
- **"What is a dictionary?" (2 marks)**: a collection of key–value pairs **and** values are accessed by their (unique) key.
- **"Give an application" (1–2 marks)**: name it **and** say what the key and value are, e.g. "information retrieval: key = word, value = number of times it occurs in the document".
- **Code questions**: show checking whether the key exists before incrementing, as in the word count. That check is usually worth a mark.
- **Compare with an array**: array indexed by integer position, fixed type, often fixed size; dictionary indexed by key, look-up by hashing.
- If asked how a dictionary can be implemented, say **hash table** and explain why look-up is fast.
:::

:::challenge
1. Extend the inverted index so it stores, for each word, a dictionary `{doc_id: count}`. Rank the documents for the query "red tea" by total count.
2. Write a function that inverts a dictionary (values become keys). What goes wrong if two keys share a value, and how could you fix it?
3. Implement your own dictionary class using a list of `(key, value)` tuples with `add`, `get`, `delete` and `contains`. What is the time complexity of each operation? How does that compare with Python's `dict`?
4. Use a dictionary to count the letters in a passage and output the five most common. Link this to frequency analysis of a Caesar cipher in [5.8](#/topic/5.8).
:::

:::recap
- A **dictionary** is an ADT of **key–value pairs**; keys are **unique**, values can be anything.
- Operations: add, retrieve, update, delete, test for a key, iterate.
- Adding an existing key **overwrites** its value; retrieving a missing key is an error unless you check first.
- Usually implemented as a **hash table**, so operations are about O(1).
- Applications: **information retrieval** (word counts, inverted indexes), translation, contacts, DNS, JSON, caching, sparse vectors, compression.
:::

:::related
- [2.6 Hash tables](#/topic/2.6) — how dictionaries are built
- [2.8 Vectors](#/topic/2.8) — dictionary representation of a vector
- [5.8 Compression and encryption](#/topic/5.8) — dictionary-based compression
- [2.1 Data structures](#/topic/2.1) — records and the other ADTs
:::

*/});
