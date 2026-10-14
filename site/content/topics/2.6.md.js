CS.registerTopic({ id: "2.6", title: "Hash tables" }, function () {/*

:::objectives
- Explain what a **hash table** is, why it gives near-instant look-up, and where it is used.
- Apply simple **hashing algorithms**: `key MOD n`, digit sums, **folding** and **ASCII sums**, and say what makes a hash function good.
- Explain what a **collision** is and resolve collisions by **rehashing** (linear probing) and by **chaining**.
- Search a hash table, including when collisions have occurred, and explain why **deleting** needs care.
- Define and use **load factor** and explain **clustering**.
:::

:::quick At a glance
- A **hash table** is an array in which each item's position is calculated from its **key** by a **hash function**: `index ← hash(key)`.
- Ideal look-up is **one step** (O(1)), whatever the size: no searching.
- Common hash functions: `key MOD tableSize`; add the digits then MOD; **folding** (split the key into parts, add them, MOD); **ASCII sum** of the characters, MOD.
- A **collision** happens when two different keys hash to the **same** index.
- **Rehashing / linear probing**: try the next slot, `(index + 1) MOD size`, until a free one is found. Search the same way; stop at an **empty** slot.
- **Chaining**: each slot points to a **linked list** of all items that hashed there.
- **Load factor** = items stored ÷ slots. Keep it below about 0.7; above that, collisions and **clustering** slow everything down.
- Deleting with probing must leave a **"deleted" marker**, or later searches stop too early.
:::

:::keyterms
Hash table :: A data structure that stores key–value pairs in an array, where the position of each item is calculated by applying a hash function to its key. :: An array where the key tells you exactly which box to look in.
Hash function :: An algorithm that takes a key and calculates a hash value (an index within the range of the table). :: The formula that turns a key into a slot number.
Hash value :: The value produced by applying the hash function to a key, used as the index. :: The slot number.
Key :: The unique value used to identify a record and from which its hash value is calculated. :: What you look things up by.
Collision :: When two or more different keys produce the same hash value. :: Two items want the same box.
Rehashing :: Resolving a collision by applying a further hash (e.g. checking the next location) until a free location is found. :: Try another box by a fixed rule.
Linear probing :: A rehashing method that checks each following location in turn, wrapping round to the start, until an empty one is found. :: Try the next box, then the next…
Chaining :: Resolving collisions by storing, at each location, a pointer to a linked list of all the items that hash to that location. :: Each box holds a list.
Load factor :: The number of items stored in a hash table divided by the number of locations. :: How full the table is.
Clustering :: When many keys end up stored in consecutive locations, so that probe sequences become long. :: A traffic jam of filled boxes.
:::

## The idea

Searching a list of n items takes up to n comparisons ([linear search](#/topic/3.4)); a sorted list takes about log<sub>2</sub> n. A **hash table** aims for **one**. Instead of *searching* for an item, you *calculate* where it must be.

1. Take the item's **key** (e.g. a student number).
2. Apply a **hash function** to get a **hash value** in the range of the array's indices.
3. Store (or look for) the item at that index.

The same calculation is used to insert, to search and to delete, so all three are fast. The key must be **stored with the data**, because two different keys can produce the same index, and you need to check you have the right one.

:::example A first hash table (from the AQA teacher resource)
Student records are stored in a table of 7 slots using `H(k) = k MOD 7`, where k is the 8-digit ULN.

| ULN | ULN MOD 7 | Stored in slot |
|---|---|---|
| 34567890 | 0 | 0 |
| 90002789 | 2 | 2 |
| 64156921 | 3 | 3 |
| 24567813 | 4 | 4 |
| 74432167 | 5 | 5 |

To find student 64156921: calculate 64156921 MOD 7 = 3, look in slot 3. One step.

Now add 90002985. 90002985 MOD 7 = **2**, but slot 2 is already taken by 90002789. That is a **collision**.
:::

## Hashing algorithms

A hash function must always produce the **same** value for the same key and must produce values **within the table's range** (MOD the table size guarantees this). You may be asked to apply any of these:

### 1. Modulo (division) method
`hash ← key MOD tableSize`

Example (table of 97 slots): 12345 MOD 97 = **26**; 23423 MOD 97 = **46**.

### 2. Digit sum then MOD (from your class notes)
Add the digits, then MOD by the table size. Table of 5 slots:
- 12345 → 1+2+3+4+5 = 15 → 15 MOD 5 = **0**
- 64526 → 6+4+5+2+6 = 23 → 23 MOD 5 = **3**

### 3. Folding
Split the key into equal-sized parts, add the parts, then MOD.
- Phone-style key 46378215 → 46 + 37 + 82 + 15 = 180 → 180 MOD 50 = **30**.

Folding makes **every** digit affect the result, which spreads values better than just using the last digits.

### 4. ASCII (character) sum
For text keys, add the character codes, then MOD.
- `A5RD` → 65 + 53 + 82 + 68 = 268 → 268 MOD 97 = **74**
- `B7MF` → 66 + 55 + 77 + 70 = 268 → MOD 97 = **74** → a collision!

::::tabs
:::tab Python
```python
def hash_mod(key, size):
    return key % size

def hash_digit_sum(key, size):
    return sum(int(d) for d in str(key)) % size

def hash_fold(key, size, part=2):
    s = str(key)
    parts = [int(s[i:i + part]) for i in range(0, len(s), part)]
    return sum(parts) % size

def hash_ascii(key, size):
    total = 0
    for ch in key:
        total = total + ord(ch)       # ord gives the character code
    return total % size

print(hash_mod(12345, 97))           # 26
print(hash_digit_sum(64526, 5))      # 3
print(hash_fold(46378215, 50))       # 30
print(hash_ascii("A5RD", 97), hash_ascii("B7MF", 97))   # 74 74  <- collision
print(hash_ascii("CAT", 10), hash_ascii("ACT", 10))     # 6 6    <- anagrams always collide
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE hashAscii(key, size)
    total ← 0
    FOR i ← 0 TO LEN(key) - 1
        total ← total + CHAR_TO_CODE(key[i])
    ENDFOR
    RETURN total MOD size
ENDSUBROUTINE
```
:::
::::

### What makes a good hash function?

- **Deterministic**: the same key always gives the same hash value.
- **Uniform spread**: hash values are spread evenly across the whole table, minimising **collisions** and **clustering**.
- **Uses all of the key**: digit sums, folding and ASCII sums let every character influence the result.
- **Fast** to calculate: the whole point is speed.
- **In range**: MOD the table size. A **prime** table size (e.g. 11, 97) usually spreads keys more evenly than a round number.

:::trap
- Simple sums give **anagrams** the same value: CAT and ACT both sum to 216. The teacher resource shows PEN and NEP both hashing to 61 with a sum-of-squares function. Weighting each character by its position (e.g. multiply by 31<sup>i</sup>) fixes this.
- "Hashing gives every key a unique index" is **false**. There are far more possible keys than slots (the **pigeonhole principle**), so collisions are unavoidable. A good function just makes them rare.
:::

## Collisions

A **collision** is when two different keys produce the same hash value. You need a rule to put the second item somewhere and, crucially, to **find it again**.

### Method 1: rehashing with linear probing

If the home slot is taken, try the **next** slot, `(index + 1) MOD size`, and keep going until an empty slot is found. MOD makes it **wrap round** from the last slot to slot 0. (Other rehash rules jump by a fixed step, e.g. +3, or apply a second hash function, but linear probing is the one to know.)

:::example Linear probing, table of 11 slots, `hash = key MOD 11`
Insert 25, 47, 19, 30, 10, 43, 56 in that order.

| Key | key MOD 11 | Slots checked | Stored in |
|---|---|---|---|
| 25 | 3 | 3 | 3 |
| 47 | 3 | 3 ✗, 4 | **4** |
| 19 | 8 | 8 | 8 |
| 30 | 8 | 8 ✗, 9 | **9** |
| 10 | 10 | 10 | 10 |
| 43 | 10 | 10 ✗, (10+1) MOD 11 = 0 | **0** |
| 56 | 1 | 1 | 1 |

Load factor = 7 ÷ 11 ≈ **0.64**.
:::

<svg class="diagram" viewBox="0 0 690 190" role="img" aria-label="Hash table of 11 slots after inserting 25, 47, 19, 30, 10, 43, 56 with key MOD 11 and linear probing. 47 collided at slot 3 and moved to 4; 30 collided at 8 and moved to 9; 43 collided at 10 and wrapped round to slot 0">
  <defs><marker id="arr26" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="14">
    <rect x="40" y="70" width="56" height="44" stroke="currentColor" fill="#f0a35e" fill-opacity="0.35"/>
    <text x="68.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">0</text>
    <text x="68.0" y="97" text-anchor="middle">43</text>
    <rect x="96" y="70" width="56" height="44" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="124.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">1</text>
    <text x="124.0" y="97" text-anchor="middle">56</text>
    <rect x="152" y="70" width="56" height="44" stroke="currentColor" fill="none"/>
    <text x="180.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">2</text>
    <rect x="208" y="70" width="56" height="44" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="236.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">3</text>
    <text x="236.0" y="97" text-anchor="middle">25</text>
    <rect x="264" y="70" width="56" height="44" stroke="currentColor" fill="#f0a35e" fill-opacity="0.35"/>
    <text x="292.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">4</text>
    <text x="292.0" y="97" text-anchor="middle">47</text>
    <rect x="320" y="70" width="56" height="44" stroke="currentColor" fill="none"/>
    <text x="348.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">5</text>
    <rect x="376" y="70" width="56" height="44" stroke="currentColor" fill="none"/>
    <text x="404.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">6</text>
    <rect x="432" y="70" width="56" height="44" stroke="currentColor" fill="none"/>
    <text x="460.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">7</text>
    <rect x="488" y="70" width="56" height="44" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="516.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">8</text>
    <text x="516.0" y="97" text-anchor="middle">19</text>
    <rect x="544" y="70" width="56" height="44" stroke="currentColor" fill="#f0a35e" fill-opacity="0.35"/>
    <text x="572.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">9</text>
    <text x="572.0" y="97" text-anchor="middle">30</text>
    <rect x="600" y="70" width="56" height="44" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/>
    <text x="628.0" y="62" text-anchor="middle" font-size="12" font-family="monospace">10</text>
    <text x="628.0" y="97" text-anchor="middle">10</text>
    <path d="M236.0,116 Q264.0,150 292.0,118" fill="none" stroke="currentColor" marker-end="url(#arr26)"/>
    <text x="264.0" y="168" text-anchor="middle" font-size="12">47: 3 full → 4</text>
    <path d="M516.0,116 Q544.0,150 572.0,118" fill="none" stroke="currentColor" marker-end="url(#arr26)"/>
    <text x="544.0" y="168" text-anchor="middle" font-size="12">30: 8 full → 9</text>
    <path d="M628.0,68 Q348.0,-10 68.0,66" fill="none" stroke="currentColor" stroke-dasharray="5,4" marker-end="url(#arr26)"/>
    <text x="348.0" y="47" text-anchor="middle" font-size="12">43: slot 10 full → (10 + 1) MOD 11 = 0, wrap round</text>
    <text x="345" y="186" text-anchor="middle" font-size="12">orange = stored away from its home slot (a collision was resolved)</text>
  </g>
</svg>

**Searching** with linear probing follows exactly the same path:

1. Calculate the hash value and go to that slot.
2. If the key there matches, **found**.
3. If the slot is **empty**, the item is **not in the table**: stop.
4. Otherwise move to `(index + 1) MOD size` and repeat (stop if you get back to the start).

Search for **43**: slot 10 holds 10 ✗ → slot 0 holds 43 ✓ (2 probes). Search for **36**: 36 MOD 11 = 3 → 25 ✗ → 47 ✗ → slot 5 empty → **not found** (3 probes).

### Method 2: chaining

Each slot holds a **pointer to a linked list**. A colliding item is simply added to the list for its slot. Nothing ever moves to a different slot.

<svg class="diagram" viewBox="0 0 520 330" role="img" aria-label="The same keys stored with chaining: slot 1 holds 56; slot 3 points to a list 25 then 47; slot 8 points to 19 then 30; slot 10 points to 10 then 43; other slots are null">
  <g font-family="inherit" font-size="14">
    <text x="30" y="29" text-anchor="end" font-size="12" font-family="monospace">0</text>
    <rect x="40" y="10" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="28" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="57" text-anchor="end" font-size="12" font-family="monospace">1</text>
    <rect x="40" y="38" width="50" height="26" stroke="currentColor" fill="none"/>
    <circle cx="65" cy="51" r="3" fill="currentColor"/>
    <line x1="65" y1="51" x2="128" y2="51" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="130" y="38" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="180" y="38" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="155" y="56" text-anchor="middle">56</text>
    <text x="193" y="56" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="85" text-anchor="end" font-size="12" font-family="monospace">2</text>
    <rect x="40" y="66" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="84" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="113" text-anchor="end" font-size="12" font-family="monospace">3</text>
    <rect x="40" y="94" width="50" height="26" stroke="currentColor" fill="none"/>
    <circle cx="65" cy="107" r="3" fill="currentColor"/>
    <line x1="65" y1="107" x2="128" y2="107" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="130" y="94" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="180" y="94" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="155" y="112" text-anchor="middle">25</text>
    <line x1="193" y1="107" x2="238" y2="107" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="240" y="94" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="290" y="94" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="265" y="112" text-anchor="middle">47</text>
    <text x="303" y="112" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="141" text-anchor="end" font-size="12" font-family="monospace">4</text>
    <rect x="40" y="122" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="140" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="169" text-anchor="end" font-size="12" font-family="monospace">5</text>
    <rect x="40" y="150" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="168" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="197" text-anchor="end" font-size="12" font-family="monospace">6</text>
    <rect x="40" y="178" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="196" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="225" text-anchor="end" font-size="12" font-family="monospace">7</text>
    <rect x="40" y="206" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="224" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="253" text-anchor="end" font-size="12" font-family="monospace">8</text>
    <rect x="40" y="234" width="50" height="26" stroke="currentColor" fill="none"/>
    <circle cx="65" cy="247" r="3" fill="currentColor"/>
    <line x1="65" y1="247" x2="128" y2="247" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="130" y="234" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="180" y="234" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="155" y="252" text-anchor="middle">19</text>
    <line x1="193" y1="247" x2="238" y2="247" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="240" y="234" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="290" y="234" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="265" y="252" text-anchor="middle">30</text>
    <text x="303" y="252" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="281" text-anchor="end" font-size="12" font-family="monospace">9</text>
    <rect x="40" y="262" width="50" height="26" stroke="currentColor" fill="none"/>
    <text x="65" y="280" text-anchor="middle" font-size="12">∅</text>
    <text x="30" y="309" text-anchor="end" font-size="12" font-family="monospace">10</text>
    <rect x="40" y="290" width="50" height="26" stroke="currentColor" fill="none"/>
    <circle cx="65" cy="303" r="3" fill="currentColor"/>
    <line x1="65" y1="303" x2="128" y2="303" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="130" y="290" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="180" y="290" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="155" y="308" text-anchor="middle">10</text>
    <line x1="193" y1="303" x2="238" y2="303" stroke="currentColor" marker-end="url(#arr26)"/>
    <rect x="240" y="290" width="50" height="26" stroke="currentColor" fill="#7c9aff" fill-opacity="0.3"/><rect x="290" y="290" width="26" height="26" stroke="currentColor" fill="none"/>
    <text x="265" y="308" text-anchor="middle">43</text>
    <text x="303" y="308" text-anchor="middle" font-size="12">∅</text>
    <text x="380" y="110" font-size="12">each slot holds a pointer</text><text x="380" y="128" font-size="12">to a linked list of every</text><text x="380" y="146" font-size="12">key that hashed there</text>
  </g>
</svg>

To search: hash the key, go to that slot, then follow the list until the key is found or the list ends.

| | Linear probing (rehashing) | Chaining |
|---|---|---|
| Where does a colliding item go? | another slot in the same array | a list hanging off its home slot |
| Can the table fill up? | yes: at most `size` items | no: lists keep growing (heap) |
| Effect of high load factor | clustering; long probe sequences | longer lists to search |
| Deletion | needs a "deleted" marker | just remove the node from its list |
| Extra memory | none | a pointer per item |

:::trap Watch the names
Different books use **opposite** names. The AQA teacher resource calls "next free slot" **open hashing** and chaining **closed hashing**; many university texts call chaining *open hashing* and probing *closed hashing* (or open addressing). In the exam, **describe the method** ("the item is placed in the next available location") rather than relying on the label.
:::

## Deleting, load factor and clustering

### The deletion problem

With linear probing you cannot simply empty a slot. In the example, delete 25 from slot 3 and leave it blank. Now search for 47: 47 MOD 11 = 3 → slot 3 is **empty** → the search stops and wrongly reports "not found", though 47 is sitting in slot 4.

The fix: mark the slot as **deleted** (a "tombstone") using a value that can never be a real key. Searches **skip over** deleted slots; inserts may **reuse** them. So a slot has three states: never used, occupied, deleted.

With chaining, deletion is just removing a node from a linked list.

### Load factor

> **load factor = number of items stored ÷ number of slots**

- Low load factor (e.g. 0.3): few collisions, but lots of wasted memory.
- High load factor (e.g. 0.9): little waste, but frequent collisions and long probe sequences.
- A common target is **about 0.7**; the AQA resource suggests keeping the table **no more than about two-thirds full**. When the load factor gets too high, create a **larger table** (ideally a prime size) and re-insert every item using a new hash function. This rebuild is also called *rehashing*.

### Clustering

**Clustering** is when occupied slots bunch together in runs. With linear probing, any key that hashes anywhere into a run must probe to the **end** of it, and then makes the run **longer**: it snowballs. Clustering is caused by a poor hash function (keys not spread evenly) **and** by linear probing itself. A better hash function, a lower load factor or a different probe step all reduce it.

{{trace:2.6-1}}

## A working hash table

```python
EMPTY, DELETED = None, "<deleted>"

class HashTable:
    def __init__(self, size):
        self.size = size
        self.keys = [EMPTY] * size
        self.values = [EMPTY] * size

    def _hash(self, key):
        return key % self.size

    def insert(self, key, value):
        i = self._hash(key)
        for _ in range(self.size):
            if self.keys[i] in (EMPTY, DELETED) or self.keys[i] == key:
                self.keys[i], self.values[i] = key, value
                return i
            i = (i + 1) % self.size            # linear probe, wrapping round
        return "full"

    def search(self, key):
        i = self._hash(key)
        for _ in range(self.size):
            if self.keys[i] is EMPTY:          # never used: stop
                return None
            if self.keys[i] == key:
                return self.values[i]
            i = (i + 1) % self.size            # occupied or DELETED: keep going
        return None

    def delete(self, key):
        i = self._hash(key)
        for _ in range(self.size):
            if self.keys[i] is EMPTY:
                return False
            if self.keys[i] == key:
                self.keys[i] = DELETED          # tombstone, NOT empty
                return True
            i = (i + 1) % self.size
        return False

    def load_factor(self):
        used = sum(1 for k in self.keys if k not in (EMPTY, DELETED))
        return used / self.size

t = HashTable(11)
for k in [25, 47, 19, 30, 10, 43, 56]:
    t.insert(k, "rec" + str(k))
print(t.keys)              # [43, 56, None, 25, 47, None, None, None, 19, 30, 10]
print(t.search(43))        # rec43
t.delete(25)
print(t.search(47))        # rec47 — still found thanks to the tombstone
print(round(t.load_factor(), 2))   # 0.55
```

### Try it: hash table explorer

{{tool:hash-table-demo}}

## Where hash tables are used

- **Database indexing**: hash the primary key to find a record's location directly.
- **Caches**: web browsers and CPUs look up recently used data by address/URL.
- **Compiler symbol tables**: identifiers are hashed to find their type, address and scope quickly.
- **Implementing dictionaries/associative arrays**: Python's `dict` and `set` are hash tables (see [2.7](#/topic/2.7)).
- **Hash files** on disk: the hash value is the record's position in a direct-access file.

Hash *functions* (not tables) are also used for **password storage** (store the hash, not the password), **checksums** and **message digests** to detect tampering, and **digital signatures**. These need cryptographic hash functions that are one-way and collision-resistant.

:::exam
- **Describe a hash table (2–3 marks)**: array/table + hash function applied to the key gives the index where the record is stored; allows direct access / fast search.
- **"Calculate the hash value"**: show every step: the sum, then the MOD.
- **"Insert these keys" (3–5 marks)**: draw the table, show each key's hash, and say where each collision went. Remember wrap-around.
- **"What is a collision and how is it dealt with?" (3–4 marks)**: definition (two keys, same hash value) + method (next free location / linear probing, wrapping round) + how a search must also follow it (stop at empty slot). Or chaining: linked list at each location.
- **Deletion question**: say a deleted slot must be marked differently from a never-used one, otherwise searches stop early.
- Use the words **key**, **hash function**, **hash value/index**, **collision**, **rehash**.
:::

:::challenge
1. Repeat the 11-slot example using chaining and count the comparisons needed to search for each key. Compare the total with linear probing.
2. Change the probe step to +3. Does it still visit every slot of an 11-slot table? What about a 12-slot table? Explain why prime table sizes help.
3. Write a `resize()` method that doubles the table to the next prime size and re-inserts every item when the load factor exceeds 0.7.
4. A person owns n different pairs of socks in a jumbled drawer. How many socks must they pull out to be certain of a matching pair? Link your answer to hash table collisions.
:::

:::recap
- A **hash table** stores items in an array at an index calculated from the **key** by a **hash function**; ideal access is one step.
- Hashing algorithms: `key MOD n`, digit sum, **folding**, **ASCII sum**; always MOD the table size; prime sizes help.
- **Collision** = different keys, same hash value; unavoidable (pigeonhole principle).
- **Linear probing**: next slot `(i + 1) MOD size` until free; search until found or an empty slot.
- **Chaining**: each slot points to a linked list of colliding items.
- **Deleting** with probing needs a tombstone marker; **load factor** = items ÷ slots, keep below ~0.7; **clustering** lengthens probes.
:::

:::related
- [2.7 Dictionaries](#/topic/2.7) — the ADT usually built on a hash table
- [2.1 Data structures](#/topic/2.1) — arrays and linked lists used inside hash tables
- [3.4 Searching algorithms](#/topic/3.4) — compare O(1) hashing with linear and binary search
- [9.4 Internet security](#/topic/9.4) — hashing for digital signatures
:::

*/});
