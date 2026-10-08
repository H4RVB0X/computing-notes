CS.registerTopic({ id: "10.5", title: "Client-server databases" }, function () {/*

:::objectives
- Describe a **client-server database** and explain how it gives **simultaneous access** to many clients.
- Explain why **concurrent access** can damage **data integrity**, using the **lost update** problem as a worked example.
- Describe the four control methods named in the specification: **record locks**, **serialisation**, **timestamp ordering** and **commitment ordering**.
- Compare the methods, including the **deadlock** problem with record locking.
:::

:::quick At a glance
- **Client-server database**: the database and **DBMS** sit on a **server**; many **clients** send requests (queries/updates) over a network; the server processes them and returns results.
- It gives **simultaneous (concurrent) access** for multiple clients and keeps one consistent central copy.
- Danger: two clients **updating the same record** at the same time → the **lost update** problem (one change overwrites the other).
- **Record locks**: a record being updated is locked; others cannot change it until it is released. Risk: **deadlock**.
- **Serialisation**: transactions are processed so that they do not overlap — the result is as if they ran **one after another**.
- **Timestamp ordering**: each transaction gets a **timestamp** when it starts; conflicting operations are applied in timestamp order and a transaction that would break the order is **aborted and restarted**.
- **Commitment ordering**: transactions are **committed** in an order worked out from how they depend on each other, so conflicting transactions cannot interfere and deadlock is avoided.
:::

:::keyterms
Client-server database :: A database system in which the database and DBMS are held on a central server and accessed by client programs that send requests across a network; the server processes the requests and returns the results. :: One central database many users talk to.
Concurrent access :: More than one client accessing (reading or updating) the same data at the same time. :: Two people using the same record at once.
Transaction :: A single logical operation on the database, possibly made of several reads and writes, that must be completed in full or not at all. :: One complete job, e.g. "sell 3 items".
Lost update :: An error in which one transaction's update to a record is overwritten by another transaction that read the record before the first update was saved. :: Someone else's save wipes out yours.
Record lock :: A technique that prevents a record from being modified by other transactions while one transaction is using it, until the lock is released. :: "In use — wait your turn."
Deadlock :: A situation in which two (or more) transactions each hold a lock on a record the other needs, so neither can proceed. :: Both waiting for each other forever.
Serialisation :: A technique that ensures transactions do not overlap in time, so the outcome is the same as if they had been executed one at a time. :: One at a time.
Timestamp ordering :: A technique in which every transaction is given a timestamp when it starts and the DBMS ensures conflicting reads and writes happen in timestamp order, aborting and restarting any transaction that would violate it. :: Oldest transaction gets priority; latecomers that clash start again.
Commitment ordering :: A technique in which transactions are committed in an order determined by their dependencies on each other, so that conflicting transactions cannot interfere and deadlock is avoided. :: The DBMS works out a safe order to finish the jobs in.
:::

## What a client-server database is

<svg class="diagram" viewBox="0 0 640 240" role="img" aria-label="Several client computers send SQL requests over a network to a database server running the DBMS, which returns results">
  <defs><marker id="arr105" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-size="13" font-family="inherit" fill="currentColor">
    <rect x="20" y="20" width="140" height="44" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="90" y="40" text-anchor="middle">Client 1</text><text x="90" y="56" text-anchor="middle" font-size="11">reception PC</text>
    <rect x="20" y="98" width="140" height="44" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="90" y="118" text-anchor="middle">Client 2</text><text x="90" y="134" text-anchor="middle" font-size="11">vet's tablet</text>
    <rect x="20" y="176" width="140" height="44" rx="6" fill="#7c9aff" fill-opacity="0.25" stroke="currentColor"/><text x="90" y="196" text-anchor="middle">Client 3</text><text x="90" y="212" text-anchor="middle" font-size="11">online booking app</text>
    <ellipse cx="300" cy="120" rx="60" ry="34" fill="none" stroke="currentColor" stroke-dasharray="5 4"/><text x="300" y="125" text-anchor="middle">network</text>
    <line x1="160" y1="42" x2="248" y2="104" stroke="currentColor"/><line x1="160" y1="120" x2="240" y2="120" stroke="currentColor"/><line x1="160" y1="198" x2="248" y2="136" stroke="currentColor"/>
    <rect x="440" y="60" width="180" height="120" rx="8" fill="#4dd4a0" fill-opacity="0.2" stroke="currentColor"/>
    <text x="530" y="84" text-anchor="middle" font-weight="600">Database server</text>
    <rect x="460" y="94" width="140" height="30" rx="4" fill="none" stroke="currentColor"/><text x="530" y="114" text-anchor="middle">DBMS (concurrency control)</text>
    <path d="M490,134 a40,8 0 0,0 80,0 v26 a40,8 0 0,1 -80,0 z" fill="#ffb84d" fill-opacity="0.3" stroke="currentColor"/><ellipse cx="530" cy="134" rx="40" ry="8" fill="none" stroke="currentColor"/><text x="530" y="160" text-anchor="middle" font-size="11">database</text>
    <line x1="360" y1="110" x2="436" y2="100" stroke="currentColor" marker-end="url(#arr105)"/><text x="398" y="94" text-anchor="middle" font-size="11">SQL request</text>
    <line x1="436" y1="140" x2="360" y2="130" stroke="currentColor" marker-end="url(#arr105)"/><text x="398" y="152" text-anchor="middle" font-size="11">results</text>
  </g>
</svg>

- The **server** holds the database and runs the **DBMS**. It listens for requests.
- Each **client** runs an application (a booking screen, a website back end) that sends **SQL requests** to the server and displays the results.
- Many clients can be connected **at the same time**, so the system provides **simultaneous access for multiple clients**.

| Advantage | Why |
|---|---|
| One central, consistent copy of the data | everyone sees the same, up-to-date data; no conflicting local copies |
| Simultaneous multi-user access | many staff and customers work at once |
| Central security and access rights | the DBMS controls who may read or change what |
| Central backup | one place to back up and recover |
| Processing on a powerful server | clients can be cheap/thin; only results cross the network |
| Concurrency control in one place | the DBMS can enforce integrity for every client |

Drawbacks: the server is a **single point of failure** (unless replicated), it needs expert management, and heavy load can slow everyone down.

## Why concurrent access is a problem

**Reading** the same record at the same time is harmless. The trouble starts when at least one client **updates** a record that another client is also using.

A **transaction** is one complete unit of work, e.g. "sell 3 bags of dog food": read the stock level, subtract 3, write it back. If two transactions interleave, their reads and writes can mix up.

:::example The lost update problem, step by step
The practice shop has **10** bags of dog food. Two receptionists sell some at the same moment: **T1** sells 3, **T2** sells 2. The correct final stock is 10 − 3 − 2 = **5**.

| Time | T1 (sells 3) | T2 (sells 2) | Stock in database |
|---|---|---|---|
| t1 | reads Stock → 10 | | 10 |
| t2 | | reads Stock → 10 | 10 |
| t3 | calculates 10 − 3 = 7 | | 10 |
| t4 | | calculates 10 − 2 = 8 | 10 |
| t5 | writes 7 | | **7** |
| t6 | | writes 8 | **8** |

Final stock is **8**, but 5 bags have gone. **T1's update has been lost**: T2 read the value *before* T1 saved its change, then overwrote it. The database no longer matches reality, so its **integrity** has been broken.
:::

{{trace:10.5-1}}

The same pattern causes **double bookings**: two clients both see appointment slot 10:30 as free, both book it, and the second booking overwrites the first.

:::trap
- The problem is **not** "two people reading at the same time". Say: two transactions **update** the same record; one **reads it before the other has written its update**, so one update **overwrites / is lost**.
- "The database crashes" is not the consequence. The consequence is **incorrect / inconsistent data** (loss of **integrity**).
:::

## The four ways to control concurrent access

### 1. Record locks

When a transaction opens a record to **update** it, the DBMS **locks** that record. Other transactions cannot change it (they may be allowed a read-only copy) until the first transaction **saves and releases the lock**.

:::example Record locking fixes the lost update
| Time | T1 (sells 3) | T2 (sells 2) | Stock |
|---|---|---|---|
| t1 | **locks** record, reads 10 | | 10 |
| t2 | | requests record: **locked, must wait** | 10 |
| t3 | writes 7, **releases lock** | | 7 |
| t4 | | locks record, reads **7** | 7 |
| t5 | | writes 5, releases lock | **5** ✓ |
:::

:::trap Deadlock
Locking can cause **deadlock**. T1 locks the **Stock** record and then needs the **Invoice** record; T2 has locked **Invoice** and now needs **Stock**. Each waits for the other forever. The DBMS must detect this and abort one transaction (or prevent it, e.g. by making transactions request locks in the same order). Mention deadlock whenever you evaluate record locking.
:::

```python Simulating a lost update and the fix
stock = 10

# Without locking: both transactions read before either writes
t1_value = stock          # T1 reads 10
t2_value = stock          # T2 reads 10
stock = t1_value - 3      # T1 writes 7
stock = t2_value - 2      # T2 writes 8 -> T1's update is lost
print("without lock:", stock)    # 8

# With a record lock: T2 must wait until T1 has written and released the lock
stock = 10
locked_by = None
def sell(name, qty):
    global stock, locked_by
    assert locked_by is None, "record is locked"
    locked_by = name      # acquire the lock
    value = stock         # read
    stock = value - qty   # write
    locked_by = None      # release the lock
sell("T1", 3)
sell("T2", 2)             # only starts after T1 has released the lock
print("with lock:", stock)       # 5
```

```output
without lock: 8
with lock: 5
```

### 2. Serialisation

**Serialisation** makes sure transactions **do not overlap in time**. Either they genuinely run **one at a time**, or the DBMS only allows interleavings whose outcome is **identical to running them one after another** (a *serialisable* schedule).

- In the stock example, all of T1 finishes before any of T2 begins, so T2 reads 7 and the result is 5.
- Record locking (above) and timestamp ordering (below) are both ways of **achieving** serialisation.
- Simple and safe, but strict one-at-a-time processing **reduces performance** on a busy system.

### 3. Timestamp ordering

Every transaction is given a **timestamp** when it **starts**. Every record keeps the timestamps of the last transaction to **read** it and the last to **write** it.

The rule: conflicting operations must happen in **timestamp order**, oldest first. If a transaction tries to read or write a record that a **younger** (later) transaction has already written (or, for a write, read), it would break the order, so the DBMS **aborts it** and **restarts it with a new timestamp**.

:::example Timestamp ordering on the stock record
T1 starts at 09:00:01 (older), T2 at 09:00:02 (younger).

| Step | Action | Record's read / write timestamps | Decision |
|---|---|---|---|
| 1 | T1 reads Stock (10) | read = 09:00:01 | allowed |
| 2 | T2 reads Stock (10) | read = 09:00:02 | allowed |
| 3 | T2 writes 8 | write = 09:00:02 | allowed: no younger transaction has read it |
| 4 | T1 tries to write 7 | a **younger** transaction (T2) has already read/written Stock | **T1 aborted**, restarted with a new timestamp |
| 5 | T1 (new timestamp 09:00:05) reads **8**, writes 5 | write = 09:00:05 | allowed: Stock = **5** ✓ |

No update is lost, and no locks are held, so there is **no deadlock**. The cost is wasted work when transactions are aborted and rerun.
:::

### 4. Commitment ordering

A transaction's changes become permanent when it **commits**. With **commitment ordering**, the DBMS uses an algorithm to work out a **safe order in which conflicting transactions are committed**, based on how they depend on each other (which one read or wrote the shared data first) and on their impact on other parts of the database.

- A transaction is only allowed to commit when every transaction it conflicts with that should come before it has committed (or aborted).
- Transactions whose commits would violate that order are delayed or aborted, so they **cannot interfere** with each other.
- It **avoids deadlock** because it does not depend on holding locks, and it lets many non-conflicting transactions run in parallel.

In the stock example the DBMS sees that T1 and T2 both depend on the same Stock record, works out that T1 must commit first, and makes T2 use T1's committed value (7) before it commits, giving 5.

:::trap
- Do not describe serialisation as "the server serves requests"; say **transactions are not allowed to overlap / are executed one after another** (or in a way equivalent to that).
- Timestamp ordering gives each transaction a timestamp **when it starts**, not when it finishes, and resolves conflicts by **aborting and restarting** the later-conflicting transaction.
- Commitment ordering is about the **order in which transactions are committed**. Do not confuse it with simply sorting requests by arrival time.
:::

## Comparing the methods

| Method | How it prevents the lost update | Main drawback |
|---|---|---|
| Record locks | other transactions cannot change a record while it is locked | **deadlock**; users wait |
| Serialisation | transactions never overlap (or behave as if they did not) | slower; little parallelism if done strictly |
| Timestamp ordering | conflicting operations forced into start-time order; violators aborted and restarted | aborted transactions waste work and may restart repeatedly |
| Commitment ordering | commits happen in a dependency-safe order worked out by an algorithm | more complex DBMS algorithm; some transactions delayed/aborted |

:::exam
- **"Explain how a client-server database provides simultaneous access"** (2–3 marks): database and DBMS on a server · clients send requests (queries) over a network · server processes the requests/returns results · DBMS manages concurrent requests.
- **"Explain the problem of concurrent access"** (2–3 marks): two transactions access the same record at the same time · both read the original value · the second write overwrites the first · update lost / data inconsistent.
- **"Describe N methods of controlling concurrent access"** (often 4–6 marks): name the method (1) and explain how it works (1) for each. Use the scenario's own record (seat, appointment slot, stock level).
- **Evaluate** (6–9 marks): compare effectiveness, waiting time, deadlock, aborted transactions; reach a reasoned conclusion for the given system (e.g. a cinema booking system with many simultaneous customers).
:::

:::challenge
1. Draw a timeline showing deadlock between two transactions that each need two records. Suggest a simple rule that makes this deadlock impossible.
2. A theatre's online booking system shows a seat as free, then the customer spends two minutes entering card details. Which control method would you use, and when exactly would you take and release a lock?
3. Under timestamp ordering, could a long-running transaction be aborted again and again? How might a DBMS prevent this "starvation"?
:::

:::recap
- **Client-server database**: database + DBMS on a server; many clients send requests over a network → **simultaneous access**, one consistent central copy.
- Concurrent **updates** to the same record can cause the **lost update** problem → loss of integrity.
- **Record locks**: lock while updating, others wait; beware **deadlock**.
- **Serialisation**: transactions do not overlap; same result as running one at a time.
- **Timestamp ordering**: timestamp at start; conflicts resolved in timestamp order; violators aborted and restarted.
- **Commitment ordering**: an algorithm decides a safe order for commits based on dependencies; avoids deadlock.
:::

:::related
- [10.4 SQL](#/topic/10.4) — the UPDATE statements that clash
- [10.2 Relational databases](#/topic/10.2) — data integrity
- [9.7 Client-server and thin/thick clients](#/topic/9.7)
:::

*/});
