CS.registerTopic({ id: "2.8", title: "Vectors" }, function () {/*

:::objectives
- Explain what a **vector** is and use all the AQA notations: **list** `[2.0, 3.14159, -1.0, 2.718281828]`, **n-vector over ℝ** (ℝ<sup>4</sup>) and the **function interpretation** `0 ↦ 2.0`.
- Represent a vector as a **list**, a **1-D array** and a **dictionary**, and explain why all entries must come from the **same field**.
- Visualise a 2-vector as an **arrow** with magnitude and direction.
- Carry out **vector addition**, **scalar–vector multiplication** and a **convex combination** of two vectors, by calculation and by drawing.
- Calculate the **dot (scalar) product** and use it to find the **angle** between vectors, test for perpendicularity and measure similarity.
:::

:::quick At a glance
- A **vector** is an ordered collection of n values all drawn from the **same field**, e.g. ℝ. A vector of 4 reals is a **4-vector over ℝ**, written **ℝ<sup>4</sup>**.
- Three views: a **list** `[2.0, 3.14, -1.0, 2.72]`; a **function** from {0, 1, 2, 3} to ℝ, `0 ↦ 2.0, 1 ↦ 3.14 …` (`↦` means "maps to"); a **geometric arrow** with magnitude and direction.
- In code: list, 1-D array, or dictionary `{0: 2.0, 1: 3.14, …}`.
- **Addition**: add matching components. `(1, 6) + (7, 4) = (8, 10)`. Geometrically: head-to-tail; a **translation**.
- **Scalar multiplication**: multiply every component. `3 × (2, 1) = (6, 3)`. Geometrically: **scaling**.
- **Convex combination**: `αu + βv` with **α + β = 1** and **α, β ≥ 0**. The result lies on the line segment between the heads of u and v.
- **Dot product**: `u · v = u₁v₁ + u₂v₂ + … + uₙvₙ`. The answer is a **single number (a scalar)**, not a vector.
- Dot product uses: **angle** between vectors (`cos θ = u·v ÷ (|u||v|)`), **perpendicular** test (u·v = 0), **similarity** of documents, facing/field-of-view tests in games, lighting, **parity** of a bit vector.
:::

:::keyterms
Vector :: An ordered collection of n values (components), all drawn from the same field, e.g. ℝ; geometrically, a quantity with magnitude and direction. :: A list of numbers that can be drawn as an arrow.
n-vector over ℝ :: A vector with n components, each a real number; the set of all such vectors is written ℝⁿ. :: ℝ⁴ = "four real numbers".
Field :: The set the components are drawn from, such as the real numbers ℝ, with addition and multiplication defined on it. :: What kind of number every entry is.
Function interpretation :: Viewing a vector as a function f : S → ℝ that maps each index in S = {0, 1, …, n − 1} to a value, written 0 ↦ value. :: Position in, value out.
Scalar :: A single number (from the field), as opposed to a vector. :: Just a number.
Scalar–vector multiplication :: Multiplying every component of a vector by the same scalar, which scales its length (and reverses it if negative). :: Stretch or shrink the arrow.
Vector addition :: Adding two vectors of the same dimension component by component; geometrically a translation. :: Follow one arrow, then the other.
Convex combination :: A vector αu + βv where α + β = 1 and α, β ≥ 0; it lies on the line segment joining the heads of u and v. :: A weighted average of two vectors.
Dot (scalar) product :: The sum of the products of corresponding components of two vectors of the same dimension; the result is a scalar. :: Multiply pairs, add up, get one number.
Magnitude :: The length of a vector, |v| = √(v₁² + v₂² + … + vₙ²). :: How long the arrow is.
:::

## What a vector is

A **vector** is an ordered list of values that are all from the **same field**, most often the real numbers ℝ. The AQA specification wants you to recognise three equivalent ways of describing one.

### Notation 1: a list

```text
[2.0, 3.14159, -1.0, 2.718281828]
```

The order matters: `[1, 2]` and `[2, 1]` are different vectors.

### Notation 2: an n-vector over ℝ

That vector has 4 components, each a real number, so it is a **4-vector over ℝ**. The set of all such vectors is written **ℝ<sup>4</sup>**, so we say the vector is a member of ℝ<sup>4</sup>. A 2-D game position is in ℝ<sup>2</sup>; a 3-D position is in ℝ<sup>3</sup>.

### Notation 3: the function interpretation

A vector can be seen as a **function** that maps each position (index) to the value stored there. With S = {0, 1, 2, 3}, the vector above is the function f : S → ℝ given by:

```text
0 ↦ 2.0
1 ↦ 3.14159
2 ↦ -1.0
3 ↦ 2.718281828
```

`↦` is read "**maps to**". S is the **domain** (the indices), ℝ is the **co-domain** (where the values come from).

:::trap Same field
**All the entries must be drawn from the same field**, e.g. all real numbers. `[3, "cat", True]` is a perfectly good Python list but it is **not** a vector. In an exam, "a vector is a list of items" on its own is not enough: say the entries come from the same field (e.g. ℝ) and it has a fixed number of components.
:::

## Representing a vector in code

| Representation | Example for (2.0, 3.14159, −1.0, 2.718281828) | Notes |
|---|---|---|
| **List** | `v = [2.0, 3.14159, -1.0, 2.718281828]` | Python list; `v[2]` gives −1.0 |
| **1-D array** | `ARRAY v[4]` holding the same values | fixed size and type: a natural fit for a vector |
| **Dictionary** | `v = {0: 2.0, 1: 3.14159, 2: -1.0, 3: 2.718281828}` | directly mirrors the function view: key = index, value = component |

The dictionary representation really earns its place for **sparse** vectors, where most components are 0. A document's word-count vector over a 100,000-word vocabulary might have only 200 non-zero entries, so you store `{index: count}` for just those (see [2.7 Dictionaries](#/topic/2.7)).

```python
v_list = [2.0, 3.14159, -1.0, 2.718281828]
v_dict = {i: x for i, x in enumerate(v_list)}     # function view: index -> value
print(v_dict)          # {0: 2.0, 1: 3.14159, 2: -1.0, 3: 2.718281828}
print(v_dict[2])       # -1.0

# sparse vector in R^10: only non-zero entries stored
sparse = {2: 7.0, 9: 3.0}
dense = [sparse.get(i, 0.0) for i in range(10)]
print(dense)           # [0.0, 0.0, 7.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 3.0]
```

## Visualising a vector as an arrow

A 2-vector (x, y) can be drawn as an **arrow** from the origin to the point (x, y). The arrow shows the vector's **direction** and its **magnitude** (length). A vector has no fixed position: an arrow of the same length and direction drawn anywhere represents the **same** vector.

<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="The vector a = (4, 3) drawn as an arrow from the origin to the point (4, 3), and the same vector drawn again starting at (5, 1); both arrows have the same length and direction">
  <defs><marker id="arr28" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13">
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="40" y="236" text-anchor="middle" font-size="11">0</text>
    <line x1="72" y1="220" x2="72" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="72" y="236" text-anchor="middle" font-size="11">1</text>
    <line x1="104" y1="220" x2="104" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="104" y="236" text-anchor="middle" font-size="11">2</text>
    <line x1="136" y1="220" x2="136" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="136" y="236" text-anchor="middle" font-size="11">3</text>
    <line x1="168" y1="220" x2="168" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="168" y="236" text-anchor="middle" font-size="11">4</text>
    <line x1="200" y1="220" x2="200" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="200" y="236" text-anchor="middle" font-size="11">5</text>
    <line x1="232" y1="220" x2="232" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="232" y="236" text-anchor="middle" font-size="11">6</text>
    <line x1="264" y1="220" x2="264" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="264" y="236" text-anchor="middle" font-size="11">7</text>
    <line x1="296" y1="220" x2="296" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="296" y="236" text-anchor="middle" font-size="11">8</text>
    <line x1="328" y1="220" x2="328" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="328" y="236" text-anchor="middle" font-size="11">9</text>
    <line x1="360" y1="220" x2="360" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="360" y="236" text-anchor="middle" font-size="11">10</text>
    <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor" stroke-opacity="0.12"/>
    <line x1="40" y1="188" x2="360" y2="188" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="192" text-anchor="end" font-size="11">1</text>
    <line x1="40" y1="156" x2="360" y2="156" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="160" text-anchor="end" font-size="11">2</text>
    <line x1="40" y1="124" x2="360" y2="124" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="128" text-anchor="end" font-size="11">3</text>
    <line x1="40" y1="92" x2="360" y2="92" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="96" text-anchor="end" font-size="11">4</text>
    <line x1="40" y1="60" x2="360" y2="60" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="64" text-anchor="end" font-size="11">5</text>
    <line x1="40" y1="28" x2="360" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="32" text-anchor="end" font-size="11">6</text>
    <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor"/>
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor"/>
    <line x1="40" y1="220" x2="168" y2="124" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="78.4" y="136.8" font-weight="bold">a = (4, 3)</text>
    <line x1="200" y1="188" x2="328" y2="92" stroke="currentColor" stroke-width="2.2" stroke-dasharray="6,4" marker-end="url(#arr28)"/>
    <text x="276.8" y="152.8" font-weight="bold">a again</text>
    <text x="200" y="44.0" text-anchor="middle" font-size="12">Same magnitude and direction = same vector, wherever it is drawn</text>
  </g>
</svg>

The **magnitude** comes from Pythagoras: |a| = √(4² + 3²) = √25 = **5**.

## Vector addition

Add **corresponding components**. Both vectors must have the same number of components.

> u + v = (u₁ + v₁, u₂ + v₂, …, uₙ + vₙ)

Example from your notes: (1, 6) + (7, 4) = (1 + 7, 6 + 4) = **(8, 10)**.

Geometrically, place the **tail of v on the head of u** (the "head-to-tail" method); u + v is the arrow from the start of u to the end of v. Adding a vector to a position **translates** (moves) it: this is how a game moves a sprite each frame (position + velocity).

<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="Vector addition: u = (2, 3) from the origin, then v = (4, 1) drawn from the head of u, giving u + v = (6, 4) from the origin to the final head">
  <g font-family="inherit" font-size="13">
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="40" y="236" text-anchor="middle" font-size="11">0</text>
    <line x1="72" y1="220" x2="72" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="72" y="236" text-anchor="middle" font-size="11">1</text>
    <line x1="104" y1="220" x2="104" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="104" y="236" text-anchor="middle" font-size="11">2</text>
    <line x1="136" y1="220" x2="136" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="136" y="236" text-anchor="middle" font-size="11">3</text>
    <line x1="168" y1="220" x2="168" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="168" y="236" text-anchor="middle" font-size="11">4</text>
    <line x1="200" y1="220" x2="200" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="200" y="236" text-anchor="middle" font-size="11">5</text>
    <line x1="232" y1="220" x2="232" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="232" y="236" text-anchor="middle" font-size="11">6</text>
    <line x1="264" y1="220" x2="264" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="264" y="236" text-anchor="middle" font-size="11">7</text>
    <line x1="296" y1="220" x2="296" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="296" y="236" text-anchor="middle" font-size="11">8</text>
    <line x1="328" y1="220" x2="328" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="328" y="236" text-anchor="middle" font-size="11">9</text>
    <line x1="360" y1="220" x2="360" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="360" y="236" text-anchor="middle" font-size="11">10</text>
    <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor" stroke-opacity="0.12"/>
    <line x1="40" y1="188" x2="360" y2="188" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="192" text-anchor="end" font-size="11">1</text>
    <line x1="40" y1="156" x2="360" y2="156" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="160" text-anchor="end" font-size="11">2</text>
    <line x1="40" y1="124" x2="360" y2="124" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="128" text-anchor="end" font-size="11">3</text>
    <line x1="40" y1="92" x2="360" y2="92" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="96" text-anchor="end" font-size="11">4</text>
    <line x1="40" y1="60" x2="360" y2="60" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="64" text-anchor="end" font-size="11">5</text>
    <line x1="40" y1="28" x2="360" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="32" text-anchor="end" font-size="11">6</text>
    <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor"/>
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor"/>
    <line x1="40" y1="220" x2="104" y2="124" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="56.0" y="149.6" font-weight="bold">u</text>
    <line x1="104" y1="124" x2="232" y2="92" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="161.6" y="92.0" font-weight="bold">v</text>
    <line x1="40" y1="220" x2="232" y2="92" stroke="#e0803a" stroke-width="2.6" marker-end="url(#arr28)"/>
    <text x="168.0" y="175.2" font-weight="bold">u + v = (6, 4)</text>
    <line x1="40" y1="220" x2="168" y2="188" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6,4" marker-end="url(#arr28)"/>
    <line x1="168" y1="188" x2="232" y2="92" stroke="currentColor" stroke-width="1.2" stroke-dasharray="6,4" marker-end="url(#arr28)"/>
    <text x="264" y="44.0" font-size="12">head-to-tail: put v's tail on u's head</text>
    <text x="264" y="60.0" font-size="12">dashed: v then u gives the same result</text>
  </g>
</svg>

## Scalar–vector multiplication

Multiply **every component** by the same scalar k.

> k × v = (k·v₁, k·v₂, …, k·vₙ)

- 3 × (2, 1) = **(6, 3)** — three times as long, same direction.
- 0.5 × (35, 15) = **(17.5, 7.5)** — half as long.
- −2 × (2, 1) = **(−4, −2)** — twice as long, **opposite** direction.

Geometrically this **scales** the vector. Used to resize graphics, change speed while keeping direction, and so on.

<svg class="diagram" viewBox="0 0 560 250" role="img" aria-label="Scalar multiplication: a = (2, 1); 2a = (4, 2) is twice as long in the same direction; 0.5a = (1, 0.5) is half as long">
  <g font-family="inherit" font-size="13">
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="40" y="236" text-anchor="middle" font-size="11">0</text>
    <line x1="72" y1="220" x2="72" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="72" y="236" text-anchor="middle" font-size="11">1</text>
    <line x1="104" y1="220" x2="104" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="104" y="236" text-anchor="middle" font-size="11">2</text>
    <line x1="136" y1="220" x2="136" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="136" y="236" text-anchor="middle" font-size="11">3</text>
    <line x1="168" y1="220" x2="168" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="168" y="236" text-anchor="middle" font-size="11">4</text>
    <line x1="200" y1="220" x2="200" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="200" y="236" text-anchor="middle" font-size="11">5</text>
    <line x1="232" y1="220" x2="232" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="232" y="236" text-anchor="middle" font-size="11">6</text>
    <line x1="264" y1="220" x2="264" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="264" y="236" text-anchor="middle" font-size="11">7</text>
    <line x1="296" y1="220" x2="296" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="296" y="236" text-anchor="middle" font-size="11">8</text>
    <line x1="328" y1="220" x2="328" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="328" y="236" text-anchor="middle" font-size="11">9</text>
    <line x1="360" y1="220" x2="360" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="360" y="236" text-anchor="middle" font-size="11">10</text>
    <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor" stroke-opacity="0.12"/>
    <line x1="40" y1="188" x2="360" y2="188" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="192" text-anchor="end" font-size="11">1</text>
    <line x1="40" y1="156" x2="360" y2="156" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="160" text-anchor="end" font-size="11">2</text>
    <line x1="40" y1="124" x2="360" y2="124" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="128" text-anchor="end" font-size="11">3</text>
    <line x1="40" y1="92" x2="360" y2="92" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="96" text-anchor="end" font-size="11">4</text>
    <line x1="40" y1="60" x2="360" y2="60" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="64" text-anchor="end" font-size="11">5</text>
    <line x1="40" y1="28" x2="360" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="32" text-anchor="end" font-size="11">6</text>
    <line x1="40" y1="220" x2="360" y2="220" stroke="currentColor"/>
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor"/>
    <line x1="40" y1="220" x2="104" y2="188" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="59.2" y="168.8" font-weight="bold">a = (2, 1)</text>
    <line x1="72" y1="156" x2="200" y2="92" stroke="#e0803a" stroke-width="2.6" marker-end="url(#arr28)"/>
    <text x="91.2" y="95.2" font-weight="bold">2a = (4, 2)</text>
    <line x1="232" y1="188" x2="264" y2="172.0" stroke="#5ec27a" stroke-width="2.6" marker-end="url(#arr28)"/>
    <text x="251.2" y="143.2" font-weight="bold">0.5a = (1, 0.5)</text>
    <text x="200" y="44.0" text-anchor="middle" font-size="12">Same direction, length multiplied by the scalar (a negative scalar would reverse it)</text>
  </g>
</svg>

## Convex combination of two vectors

A **convex combination** of u and v is

> **w = αu + βv**, where **α + β = 1** and **α ≥ 0, β ≥ 0**.

α and β are **scalars** (real numbers), not vectors. Because they are non-negative and add to 1, w is a **weighted average** of u and v. If you draw u and v from the same origin, w always ends **on the straight line segment joining their heads**. α = 1 gives u, β = 1 gives v, α = β = 0.5 gives the midpoint.

:::example Convex combination of u = (2, 6) and v = (8, 2) with α = 0.25, β = 0.75
1. Check the conditions: 0.25 + 0.75 = 1 ✓, both ≥ 0 ✓.
2. αu = 0.25 × (2, 6) = (0.5, 1.5)
3. βv = 0.75 × (8, 2) = (6, 1.5)
4. w = (0.5 + 6, 1.5 + 1.5) = **(6.5, 3)**

Check it lies on the segment: starting at u and moving three-quarters of the way to v gives (2, 6) + 0.75 × (6, −4) = (6.5, 3) ✓.
:::

<svg class="diagram" viewBox="0 0 560 260" role="img" aria-label="Convex combination of u = (2, 6) and v = (8, 2): the dashed segment joins their heads; alpha u + beta v with alpha + beta = 1 and both non-negative lands on that segment, for example (6.5, 3) when alpha = 0.25 and beta = 0.75">
  <g font-family="inherit" font-size="13">
    <line x1="40" y1="230" x2="40" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="40" y="246" text-anchor="middle" font-size="11">0</text>
    <line x1="72" y1="230" x2="72" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="72" y="246" text-anchor="middle" font-size="11">1</text>
    <line x1="104" y1="230" x2="104" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="104" y="246" text-anchor="middle" font-size="11">2</text>
    <line x1="136" y1="230" x2="136" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="136" y="246" text-anchor="middle" font-size="11">3</text>
    <line x1="168" y1="230" x2="168" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="168" y="246" text-anchor="middle" font-size="11">4</text>
    <line x1="200" y1="230" x2="200" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="200" y="246" text-anchor="middle" font-size="11">5</text>
    <line x1="232" y1="230" x2="232" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="232" y="246" text-anchor="middle" font-size="11">6</text>
    <line x1="264" y1="230" x2="264" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="264" y="246" text-anchor="middle" font-size="11">7</text>
    <line x1="296" y1="230" x2="296" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="296" y="246" text-anchor="middle" font-size="11">8</text>
    <line x1="328" y1="230" x2="328" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="328" y="246" text-anchor="middle" font-size="11">9</text>
    <line x1="360" y1="230" x2="360" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="360" y="246" text-anchor="middle" font-size="11">10</text>
    <line x1="40" y1="230" x2="360" y2="230" stroke="currentColor" stroke-opacity="0.12"/>
    <line x1="40" y1="198" x2="360" y2="198" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="202" text-anchor="end" font-size="11">1</text>
    <line x1="40" y1="166" x2="360" y2="166" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="170" text-anchor="end" font-size="11">2</text>
    <line x1="40" y1="134" x2="360" y2="134" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="138" text-anchor="end" font-size="11">3</text>
    <line x1="40" y1="102" x2="360" y2="102" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="106" text-anchor="end" font-size="11">4</text>
    <line x1="40" y1="70" x2="360" y2="70" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="74" text-anchor="end" font-size="11">5</text>
    <line x1="40" y1="38" x2="360" y2="38" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="42" text-anchor="end" font-size="11">6</text>
    <line x1="40" y1="6" x2="360" y2="6" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="10" text-anchor="end" font-size="11">7</text>
    <line x1="40" y1="230" x2="360" y2="230" stroke="currentColor"/>
    <line x1="40" y1="230" x2="40" y2="6" stroke="currentColor"/>
    <line x1="104" y1="38" x2="296" y2="166" stroke="#e0803a" stroke-width="2" stroke-dasharray="6,4"/>
    <line x1="40" y1="230" x2="104" y2="38" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="49.6" y="28.400000000000006" font-weight="bold">u = (2, 6)</text>
    <line x1="40" y1="230" x2="296" y2="166" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="302.4" y="178.8" font-weight="bold">v = (8, 2)</text>
    <line x1="40" y1="230" x2="248.0" y2="134" stroke="#5ec27a" stroke-width="2.4" marker-end="url(#arr28)"/>
    <circle cx="152.0" cy="70.0" r="4" fill="#e0803a"/>
    <text x="160.0" y="64.0" font-size="12">α = 0.75 → (3.5, 5)</text>
    <circle cx="200.0" cy="102.0" r="4" fill="#e0803a"/>
    <text x="208.0" y="96.0" font-size="12">α = 0.5 → (5, 4)</text>
    <circle cx="248.0" cy="134.0" r="4" fill="#e0803a"/>
    <text x="256.0" y="128.0" font-size="12">α = 0.25 → (6.5, 3)</text>
    <text x="216.0" y="18.80000000000001" font-size="12">α + β = 1, α, β ≥ 0</text>
  </g>
</svg>

:::trap Correcting your notes on convex combinations
- Your slides say α and β "could be scalars or another vector", and the textbook says you multiply "by a scalar or by another vector". **Wrong**: α and β are always **scalars**.
- Your slides say "any values (above 0)" for α and β. Not enough: they must also **add up to 1** (and may equal 0). With α = β = 1 you get u + v, which is nowhere near the segment.
:::

Uses: **interpolation** in animation and graphics (moving smoothly from one position or colour to another as α runs from 1 to 0), blending, and testing whether a point lies inside a shape (the set of all convex combinations of the corners is the **convex hull**).

## Dot (scalar) product

> **u · v = u₁v₁ + u₂v₂ + … + uₙvₙ**

Multiply corresponding components, then **add the results**. Both vectors must have the same dimension. The answer is a **single number — a scalar** — which is why it is also called the **scalar product**.

:::example Dot products, every step
- (7, 5) · (8, 2) = 7×8 + 5×2 = 56 + 10 = **66**
- (4, 5) · (6, 12) = 4×6 + 5×12 = 24 + 60 = **84**
- (2, −1) · (−7, −4) = −14 + 4 = **−10**
- (1, 2, 3) · (4, −5, 6) = 4 − 10 + 18 = **12**
:::

:::trap The dot product is a SCALAR
Your textbook's answer says "(4, 5) · (6, 12) … gives a new vector {24, 60}", and another answer defines the dot product as "multiplying two vectors together to produce another vector". **Both are wrong.** The products 24 and 60 must be **added**: the dot product is the single number **84**. If your answer to a dot-product question has brackets round it, you have made this mistake.
:::

### Applications of the dot product

**1. The angle between two vectors.** The dot product is linked to the angle θ between the vectors:

> u · v = |u| |v| cos θ, so **cos θ = (u · v) ÷ (|u| × |v|)**

<svg class="diagram" viewBox="0 0 420 250" role="img" aria-label="Vectors a = (3, 4) and b = (2, 6) drawn from the origin with the angle theta between them, about 18.4 degrees">
  <g font-family="inherit" font-size="13">
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="40" y="236" text-anchor="middle" font-size="11">0</text>
    <line x1="72" y1="220" x2="72" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="72" y="236" text-anchor="middle" font-size="11">1</text>
    <line x1="104" y1="220" x2="104" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="104" y="236" text-anchor="middle" font-size="11">2</text>
    <line x1="136" y1="220" x2="136" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="136" y="236" text-anchor="middle" font-size="11">3</text>
    <line x1="168" y1="220" x2="168" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="168" y="236" text-anchor="middle" font-size="11">4</text>
    <line x1="200" y1="220" x2="200" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="200" y="236" text-anchor="middle" font-size="11">5</text>
    <line x1="232" y1="220" x2="232" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="232" y="236" text-anchor="middle" font-size="11">6</text>
    <line x1="264" y1="220" x2="264" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="264" y="236" text-anchor="middle" font-size="11">7</text>
    <line x1="40" y1="220" x2="264" y2="220" stroke="currentColor" stroke-opacity="0.12"/>
    <line x1="40" y1="188" x2="264" y2="188" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="192" text-anchor="end" font-size="11">1</text>
    <line x1="40" y1="156" x2="264" y2="156" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="160" text-anchor="end" font-size="11">2</text>
    <line x1="40" y1="124" x2="264" y2="124" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="128" text-anchor="end" font-size="11">3</text>
    <line x1="40" y1="92" x2="264" y2="92" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="96" text-anchor="end" font-size="11">4</text>
    <line x1="40" y1="60" x2="264" y2="60" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="64" text-anchor="end" font-size="11">5</text>
    <line x1="40" y1="28" x2="264" y2="28" stroke="currentColor" stroke-opacity="0.12"/>
    <text x="32" y="32" text-anchor="end" font-size="11">6</text>
    <line x1="40" y1="220" x2="264" y2="220" stroke="currentColor"/>
    <line x1="40" y1="220" x2="40" y2="28" stroke="currentColor"/>
    <line x1="40" y1="220" x2="136" y2="92" stroke="currentColor" stroke-width="2.2" marker-end="url(#arr28)"/>
    <text x="139.2" y="104.8" font-weight="bold">a = (3, 4)</text>
    <line x1="40" y1="220" x2="104" y2="28" stroke="#e0803a" stroke-width="2.4" marker-end="url(#arr28)"/>
    <text x="91.2" y="21.599999999999994" font-weight="bold">b = (2, 6)</text>
    <path d="M73.0,176.0 A55,55 0 0,0 57.4,167.8" fill="none" stroke="currentColor"/>
    <text x="72.5" y="158.0" font-size="14">θ</text>
  </g>
</svg>

:::example Angle between a = (3, 4) and b = (2, 6)
1. a · b = 3×2 + 4×6 = 6 + 24 = **30**
2. |a| = √(3² + 4²) = √25 = **5**
3. |b| = √(2² + 6²) = √40 ≈ **6.325**
4. cos θ = 30 ÷ (5 × 6.325) = 30 ÷ 31.62 ≈ **0.9487**
5. θ = cos⁻¹(0.9487) ≈ **18.4°**

(If you round cos θ to 0.94 too early you get about 19.9°, which is why some sources give that. Keep full accuracy until the end.)
:::

**2. Sign tells you the type of angle**, without calculating it:

| u · v | Angle | Meaning in a game |
|---|---|---|
| > 0 | acute (less than 90°) | target is roughly **in front** |
| = 0 | right angle: vectors are **perpendicular** (orthogonal) | target is exactly to the side |
| < 0 | obtuse (more than 90°) | target is **behind** |

Example from your notes: (1, 2, 3) · (4, −5, 6) = 12 > 0, so the angle is **acute**.

**3. Similarity.** If two documents are represented as word-count vectors, cos θ (the *cosine similarity*) is close to 1 when they use words in similar proportions and 0 when they share none. Search engines and recommendation systems rely on this; it connects to **information retrieval** in [2.7](#/topic/2.7).

**4. Projection and lighting.** u · v ÷ |v| is the length of u's shadow (projection) along v. Graphics engines use the dot product of a surface's normal with the light direction to decide how brightly to shade it.

**5. Parity of a bit vector.** Treat a bit pattern as a vector over the field {0, 1} with arithmetic MOD 2. Its dot product with the all-ones vector is the sum of its bits MOD 2: 0 for even parity, 1 for odd. E.g. (1, 0, 1, 1) · (1, 1, 1, 1) = 1 + 0 + 1 + 1 = 3, and 3 MOD 2 = **1** (odd number of 1s). See [5.6 error checking](#/topic/5.6).

## All the operations in code

::::tabs
:::tab Python
```python
import math

def add(u, v):
    if len(u) != len(v):
        raise ValueError("vectors must have the same dimension")
    return [u[i] + v[i] for i in range(len(u))]

def scale(k, v):
    return [k * x for x in v]

def dot(u, v):
    total = 0
    for i in range(len(u)):
        total = total + u[i] * v[i]
    return total                     # a single number

def convex(alpha, u, v):
    beta = 1 - alpha                 # guarantees alpha + beta = 1
    if not (0 <= alpha <= 1):
        raise ValueError("alpha must be between 0 and 1")
    return add(scale(alpha, u), scale(beta, v))

def magnitude(v):
    return math.sqrt(dot(v, v))

def angle(u, v):
    return math.degrees(math.acos(dot(u, v) / (magnitude(u) * magnitude(v))))

print(add([1, 6], [7, 4]))               # [8, 10]
print(scale(3, [2, 1]))                  # [6, 3]
print(dot([4, 5], [6, 12]))              # 84   <- a scalar, not [24, 60]
print(convex(0.25, [2, 6], [8, 2]))      # [6.5, 3.0]
print(round(angle([3, 4], [2, 6]), 1))   # 18.4
print(dot([1, 0, 1, 1], [1, 1, 1, 1]) % 2)   # 1 -> odd parity
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE dotProduct(u, v)
    total ← 0
    FOR i ← 0 TO LEN(u) - 1
        total ← total + u[i] * v[i]
    ENDFOR
    RETURN total
ENDSUBROUTINE

SUBROUTINE vectorAdd(u, v)
    w ← array of LEN(u)
    FOR i ← 0 TO LEN(u) - 1
        w[i] ← u[i] + v[i]
    ENDFOR
    RETURN w
ENDSUBROUTINE

SUBROUTINE convex(alpha, u, v)
    beta ← 1 - alpha
    w ← array of LEN(u)
    FOR i ← 0 TO LEN(u) - 1
        w[i] ← alpha * u[i] + beta * v[i]
    ENDFOR
    RETURN w
ENDSUBROUTINE
```
:::
::::

{{trace:2.8-1}}

### Try it: vector tool

{{tool:vector-tool}}

:::exam
- **"Explain what is meant by a vector" (2 marks)**: a collection/list of values (components) **all from the same field**, e.g. ℝ; can be seen as a function from indices to values / an arrow with magnitude and direction.
- **Notation questions**: be ready to write a vector as a list, as ℝ<sup>n</sup>, as `0 ↦ …` lines, and as a Python dictionary.
- **Calculations (1–2 marks each)**: show the component-by-component working. For a dot product write the products **and** their sum; the final answer is one number.
- **Convex combination**: state **α + β = 1, α, β ≥ 0**, show αu and βv, then add.
- **"Give an application of the dot product"**: finding the angle between two vectors; checking whether vectors are perpendicular; measuring document similarity; parity. Say *what* it is used for, not just "games".
- **Array vs vector**: an array is a data structure for storage; a vector is a mathematical object (fixed dimension, same field, with operations defined). A 1-D array is one way to **represent** a vector.
:::

:::challenge
1. Show that for any vectors u and v, u · v = v · u. Then show (u + v) · w = u · w + v · w.
2. A guard in a game faces direction f = (0, 1). A player is at displacement p = (3, 4) from the guard. Use the dot product to decide whether the player is within the guard's 90° field of view (45° either side).
3. Write a function `cosine_similarity(doc1, doc2)` that builds word-count vectors (as dictionaries) for two strings and returns cos θ. Test it on similar and unrelated sentences.
4. Prove that a convex combination of u and v always lies on the segment between them by rewriting αu + βv as u + β(v − u).
:::

:::recap
- A **vector** = ordered values all from the **same field**; a **4-vector over ℝ** is in **ℝ<sup>4</sup>**; function view `0 ↦ 2.0` (↦ = maps to).
- Represent as a **list**, **1-D array** or **dictionary** (great for sparse vectors); visualise as an **arrow** (magnitude + direction).
- **Addition**: componentwise, a translation. **Scalar multiplication**: every component × k, a scaling.
- **Convex combination**: αu + βv with **α + β = 1, α, β ≥ 0**; lies on the segment between the heads.
- **Dot product**: Σ uᵢvᵢ — a **scalar**. (4, 5) · (6, 12) = **84**.
- Uses of dot product: angle (cos θ = u·v ÷ |u||v|), perpendicular test (= 0), similarity, projection/lighting, parity.
:::

:::related
- [2.7 Dictionaries](#/topic/2.7) — dictionary representation and information retrieval
- [2.1 Data structures](#/topic/2.1) — arrays and lists
- [5.7 Images and sound](#/topic/5.7) — vector graphics
- [5.6 Character coding and error checking](#/topic/5.6) — parity bits
:::

*/});
