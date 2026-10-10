CS.registerTopic({ id: "9.7", title: "Client-server, REST, WebSocket and thin/thick clients" }, function () {/*

:::objectives
- Explain the **client-server model**: request, process, response.
- Explain what the **WebSocket** protocol does, **why** it is used and **where** (chat, games, live feeds).
- Explain the principles of **web CRUD applications** and **REST**, mapping **GET → SELECT, POST → INSERT, PUT → UPDATE, DELETE → DELETE**.
- **Compare JSON and XML** as formats for exchanging data, with examples.
- **Compare and contrast thin-client and thick-client** computing and recommend one for a given scenario.
:::

:::quick At a glance
- **Client-server model**: the **client** sends a **request**; the **server** (always on, listening on a known port) **processes** it and sends a **response**. Client and server are **roles** (software processes), not types of hardware.
- Ordinary HTTP is **request-response only**: the server can't speak first, so a client wanting live updates must keep asking (**polling**), with a full header each time.
- **WebSocket**: after an HTTP **handshake**, a **persistent, full-duplex** connection stays open over a single TCP connection (port 80/443), so **either side can send at any time** with tiny overhead. Used for **chat, multiplayer games, live scores/stock tickers, collaborative editing, notifications**.
- **CRUD** = Create, Retrieve, Update, Delete. **REST** uses HTTP methods on resource URLs: **POST = INSERT**, **GET = SELECT**, **PUT = UPDATE**, **DELETE = DELETE**. The server runs the SQL and replies, usually in **JSON** (or XML).
- **JSON**: name/value pairs and arrays, compact, quick to parse, easy to read, maps onto objects. **XML**: tagged elements, more verbose, slower to parse, but flexible and can be validated with a **schema**.
- **Thin client**: little local processing/storage, depends on a powerful **server**. **Thick client**: does most processing and storage **locally**, needs the server less.
:::

:::keyterms
Client-server model :: A model in which a client sends a request for a service or resource to a server, which processes the request and sends back a response. :: Ask, and the server answers.
Client :: A process (or computer) that requests a service or resource from a server. :: The one asking.
Server :: A process (or computer) that waits for, and responds to, requests from clients, providing a service or resource. :: The one answering.
API :: Application Programming Interface: a set of protocols and rules that defines how one program can request services or data from another. :: The menu of requests a program will accept.
WebSocket :: A protocol that provides a persistent, full-duplex (two-way, simultaneous) connection between a client and a server over a single TCP connection, set up by an HTTP handshake. :: An open phone line instead of sending letters.
Full duplex :: Data can be sent in both directions at the same time. :: Both can talk at once.
CRUD :: Create, Retrieve, Update, Delete: the four basic operations performed on persistent stored data. :: The four things you do to records.
REST :: Representational State Transfer: an architectural style for web APIs in which resources are identified by URLs and manipulated using standard HTTP methods (GET, POST, PUT, DELETE), each request containing all the information needed. :: Use plain HTTP verbs on web addresses to work with data.
JSON :: JavaScript Object Notation: a lightweight, human-readable text format for data interchange made of name/value pairs and ordered lists (arrays). :: Curly-bracket data.
XML :: Extensible Markup Language: a text format that stores data between user-defined opening and closing tags, and can be validated against a schema. :: Angle-bracket data.
Thin client :: A computer that relies heavily on a server for its processing, applications and storage, having minimal resources itself. :: A window onto the server.
Thick client :: A computer that performs most of its processing and stores its own applications and data locally, needing a server only for some services. :: A full computer that occasionally uses the server.
:::

## The client-server model

In the **client-server model**, providers of a resource are **servers** and requesters are **clients**.

:::steps The request–response cycle
1. The server process runs continuously, **listening** on a known (well-known) **port**, e.g. a web server on 443.
2. The client **sends a request** in the agreed protocol, e.g. an HTTP `GET` for a web page.
3. The server **processes** the request: checks permissions, reads files, runs server-side code, queries a database.
4. The server **sends a response**: the requested data or an error (e.g. 404 Not Found).
5. The client **uses** the response, e.g. the browser renders the page.
:::

- **Client** and **server** are **roles played by software**. One computer can run several server processes (web, mail, FTP) and also client software at the same time.
- Examples: web browsing, email, online banking, file and print servers, database servers, game servers, cloud storage.
- An **API** defines the requests a server will accept and the format of its responses, so programmers can write clients for it without knowing how the server works inside.

## The WebSocket protocol

### The problem with plain HTTP

HTTP is **request-response**: the **client must ask first**, and the server can only reply. That's fine for loading a page, but what about a **chat app** that must show a new message the moment it arrives?

- The client would have to **poll**: ask "anything new?" every second or so.
- Most answers are "no", wasting requests, bandwidth and server time.
- Each request carries a **full HTTP header** (hundreds of bytes) and may need a new connection, adding **latency**.
- An update could sit on the server for up to a whole polling interval before the client asks.

### What WebSocket does

:::figure HTTP polling (left) compared with a WebSocket connection (right)
<svg class="diagram" viewBox="0 0 680 320" role="img" aria-label="Left: a client repeatedly polling a server with HTTP requests, mostly getting nothing new. Right: one handshake then messages flowing both ways at any time on one open connection">
  <defs><marker id="arr97" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <text x="165" y="20" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">HTTP polling</text>
    <text x="60" y="42" text-anchor="middle" stroke="none">client</text><text x="270" y="42" text-anchor="middle" stroke="none">server</text>
    <line x1="60" y1="50" x2="60" y2="300" stroke-dasharray="4 4"/><line x1="270" y1="50" x2="270" y2="300" stroke-dasharray="4 4"/>
    <line x1="60" y1="70" x2="268" y2="80" marker-end="url(#arr97)"/><text x="165" y="68" text-anchor="middle" stroke="none" font-size="11">GET: anything new?</text>
    <line x1="270" y1="90" x2="62" y2="100" marker-end="url(#arr97)"/><text x="165" y="110" text-anchor="middle" stroke="none" font-size="11">no</text>
    <line x1="60" y1="130" x2="268" y2="140" marker-end="url(#arr97)"/><text x="165" y="128" text-anchor="middle" stroke="none" font-size="11">GET: anything new?</text>
    <line x1="270" y1="150" x2="62" y2="160" marker-end="url(#arr97)"/><text x="165" y="170" text-anchor="middle" stroke="none" font-size="11">no</text>
    <line x1="60" y1="190" x2="268" y2="200" marker-end="url(#arr97)"/><text x="165" y="188" text-anchor="middle" stroke="none" font-size="11">GET: anything new?</text>
    <line x1="270" y1="210" x2="62" y2="220" marker-end="url(#arr97)"/><text x="165" y="230" text-anchor="middle" stroke="none" font-size="11">yes: 1 message</text>
    <text x="165" y="270" text-anchor="middle" stroke="none" font-size="11">full header every time,</text>
    <text x="165" y="285" text-anchor="middle" stroke="none" font-size="11">server can't start a conversation</text>
    <text x="510" y="20" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">WebSocket</text>
    <text x="405" y="42" text-anchor="middle" stroke="none">client</text><text x="615" y="42" text-anchor="middle" stroke="none">server</text>
    <rect x="405" y="55" width="210" height="245" fill="#6fd39a" fill-opacity="0.12" stroke="none"/>
    <line x1="405" y1="50" x2="405" y2="300" stroke-width="2"/><line x1="615" y1="50" x2="615" y2="300" stroke-width="2"/>
    <line x1="405" y1="70" x2="613" y2="80" marker-end="url(#arr97)"/><text x="510" y="68" text-anchor="middle" stroke="none" font-size="11">HTTP handshake: Upgrade: websocket</text>
    <line x1="615" y1="90" x2="407" y2="100" marker-end="url(#arr97)"/><text x="510" y="112" text-anchor="middle" stroke="none" font-size="11">101 Switching Protocols</text>
    <line x1="615" y1="140" x2="407" y2="150" stroke="#7c9aff" stroke-width="2" marker-end="url(#arr97)"/><text x="510" y="138" text-anchor="middle" stroke="none" font-size="11">server pushes a message</text>
    <line x1="405" y1="180" x2="613" y2="190" stroke="#7c9aff" stroke-width="2" marker-end="url(#arr97)"/><text x="510" y="178" text-anchor="middle" stroke="none" font-size="11">client sends a message</text>
    <line x1="615" y1="205" x2="407" y2="215" stroke="#7c9aff" stroke-width="2" marker-end="url(#arr97)"/>
    <line x1="405" y1="215" x2="613" y2="225" stroke="#7c9aff" stroke-width="2" marker-end="url(#arr97)"/><text x="510" y="245" text-anchor="middle" stroke="none" font-size="11">both at once (full duplex)</text>
    <text x="510" y="270" text-anchor="middle" stroke="none" font-size="11">one connection stays open,</text>
    <text x="510" y="285" text-anchor="middle" stroke="none" font-size="11">tiny frames, either side starts</text>
  </g>
</svg>
:::

1. The client sends a normal HTTP request asking to **upgrade** the connection to WebSocket (a **handshake**).
2. The server agrees, and the underlying TCP connection is **kept open**: a **persistent** connection.
3. From then on it is **full duplex**: **client and server can each send messages whenever they like**, in both directions at the same time, without new requests.
4. Messages are sent in small **frames** with very little header data.
5. It runs over **port 80** (or **443** when encrypted), so it passes through firewalls that allow ordinary web traffic.

:::why Why it is used
- **Low latency**: updates are **pushed** by the server the instant they happen, with no polling delay.
- **Less overhead**: no repeated HTTP headers or new connections, so less bandwidth and less server load.
- **Two-way, real time**: both sides can talk at once.
:::

| Where WebSockets are used | Why it needs them |
|---|---|
| Chat and messaging apps | new messages must appear instantly for everyone |
| Browser-based multiplayer games | player moves sent and received many times a second |
| Live sports scores, stock prices, auction bids | the server pushes each change as it happens |
| Collaborative editing (shared docs) | every user sees others' edits live |
| Live dashboards and notifications | instant alerts without refreshing |

:::trap
- WebSocket is **not** "faster HTTP". The key ideas are **persistent** connection, **full duplex** and the **server being able to send without a request**. Use those words.
- It **starts** with an HTTP handshake and uses the web ports, but after the upgrade the messages are **not** HTTP requests.
:::

## Web CRUD applications and REST

Most web apps store data in a **database** and need four operations on it: **CRUD**.

| CRUD operation | HTTP method (REST) | SQL statement | Example request |
|---|---|---|---|
| **C**reate | **POST** | **INSERT** | `POST /api/books` with the new book in the body |
| **R**etrieve | **GET** | **SELECT** | `GET /api/books/2` |
| **U**pdate | **PUT** | **UPDATE** | `PUT /api/books/2` with the new values |
| **D**elete | **DELETE** | **DELETE** | `DELETE /api/books/2` |

**REST** (Representational State Transfer) is a style for designing web APIs:
- Each **resource** (a book, a student, an order) is identified by a **URL**, e.g. `/api/books/2`.
- The client uses the **standard HTTP methods** to say what to do with it.
- Each request is **self-contained** (stateless): it carries all the information the server needs.
- The server carries out the action (usually by running the matching **SQL** on its database) and returns a **response**, typically in **JSON** or XML, with an HTTP status code.
- Because the interface is standard, the client (browser, phone app) and the server can be **written independently** in different languages.

:::figure A REST request travelling from a browser to a database and back
<svg class="diagram" viewBox="0 0 680 180" role="img" aria-label="Browser sends GET /api/books/2 to a web server API, which runs SELECT on the database and returns JSON">
  <defs><marker id="arr97b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <rect x="10" y="55" width="120" height="50" rx="6" fill="#7c9aff" fill-opacity="0.35"/><text x="70" y="77" text-anchor="middle" stroke="none">client</text><text x="70" y="93" text-anchor="middle" stroke="none">(browser / app)</text>
    <rect x="280" y="55" width="130" height="50" rx="6" fill="#6fd39a" fill-opacity="0.4"/><text x="345" y="77" text-anchor="middle" stroke="none">web server</text><text x="345" y="93" text-anchor="middle" stroke="none">(REST API)</text>
    <rect x="550" y="55" width="120" height="50" rx="6" fill="#ff9f7c" fill-opacity="0.4"/><text x="610" y="85" text-anchor="middle" stroke="none">database</text>
    <line x1="130" y1="68" x2="278" y2="68" marker-end="url(#arr97b)"/><text x="204" y="60" text-anchor="middle" stroke="none" font-family="monospace">GET /api/books/2</text>
    <line x1="410" y1="68" x2="548" y2="68" marker-end="url(#arr97b)"/><text x="479" y="60" text-anchor="middle" stroke="none" font-family="monospace">SELECT … WHERE BookID = 2</text>
    <line x1="548" y1="95" x2="412" y2="95" marker-end="url(#arr97b)"/><text x="479" y="115" text-anchor="middle" stroke="none">matching row</text>
    <line x1="278" y1="95" x2="132" y2="95" marker-end="url(#arr97b)"/><text x="204" y="115" text-anchor="middle" stroke="none">200 OK + JSON</text>
    <text x="340" y="160" text-anchor="middle" stroke="none" font-family="monospace">{"id": 2, "title": "Emma", "stock": 9}</text>
  </g>
</svg>
:::

```python
import json, sqlite3

db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE Book (BookID INTEGER PRIMARY KEY, Title TEXT, Stock INTEGER)")

def handle(method, url, body=None):
    """A tiny RESTful API: HTTP method + URL -> SQL -> JSON response."""
    parts = url.strip("/").split("/")          # e.g. ["api", "books", "2"]
    book_id = int(parts[2]) if len(parts) > 2 else None
    if method == "POST":                       # Create -> INSERT
        cur = db.execute("INSERT INTO Book (Title, Stock) VALUES (?, ?)", (body["title"], body["stock"]))
        return json.dumps({"created": cur.lastrowid})
    if method == "GET":                        # Retrieve -> SELECT
        rows = db.execute("SELECT BookID, Title, Stock FROM Book WHERE BookID = ?", (book_id,)).fetchall()
        return json.dumps([{"id": r[0], "title": r[1], "stock": r[2]} for r in rows])
    if method == "PUT":                        # Update -> UPDATE
        db.execute("UPDATE Book SET Stock = ? WHERE BookID = ?", (body["stock"], book_id))
        return json.dumps({"updated": book_id})
    if method == "DELETE":                     # Delete -> DELETE
        db.execute("DELETE FROM Book WHERE BookID = ?", (book_id,))
        return json.dumps({"deleted": book_id})

print(handle("POST", "/api/books", {"title": "Dune", "stock": 4}))      # {"created": 1}
print(handle("POST", "/api/books", {"title": "Emma", "stock": 2}))      # {"created": 2}
print(handle("PUT", "/api/books/2", {"stock": 9}))                      # {"updated": 2}
print(handle("GET", "/api/books/2"))       # [{"id": 2, "title": "Emma", "stock": 9}]
print(handle("DELETE", "/api/books/1"))    # {"deleted": 1}
print(handle("GET", "/api/books/1"))       # []
```

{{trace:9.7-1}}

:::trap
- **POST creates (INSERT); PUT updates (UPDATE).** Swapping them is the most common lost mark.
- **GET** retrieves; it should never change data.
- The browser doesn't run SQL. It sends an HTTP request; the **server** turns it into SQL against its database.
:::

## JSON and XML

Both are **text-based formats for exchanging structured data** between a server and a client (e.g. the response of a REST API).

::::tabs
:::tab JSON
```text The same student record in JSON
{
  "student": {
    "id": 17,
    "name": "Asha Patel",
    "subjects": ["Computer Science", "Maths"]
  }
}
```
:::
:::tab XML
```text The same student record in XML
<student id="17">
  <name>Asha Patel</name>
  <subjects>
    <subject>Computer Science</subject>
    <subject>Maths</subject>
  </subjects>
</student>
```
:::
::::

| | JSON | XML |
|---|---|---|
| Structure | **name/value pairs** in `{ }` and ordered **arrays** in `[ ]` | data between **user-defined opening and closing tags**, plus attributes |
| Readability for people | easier: less clutter | harder: lots of tags |
| Size | **more compact** (no closing tags) | **more verbose**, so more bytes to transmit |
| Parsing | **quicker and simpler**; maps directly onto objects/dictionaries and arrays | slower; needs an XML parser to walk the tree of elements |
| Data types | has numbers, strings, Booleans, null, arrays, objects, so `17` and `"17"` are different | everything is text unless a schema says otherwise |
| Validation | possible (JSON Schema) but less established | can be strictly validated against a **schema** (XSD) |
| Flexibility | limited set of data types | very flexible: any structure, attributes, namespaces, comments |
| Typical use | web APIs, config files, browser ↔ server data | documents, older enterprise systems, office file formats, RSS |

```python
import json
import xml.etree.ElementTree as ET

json_text = '{"student": {"id": 17, "name": "Asha Patel", "subjects": ["Computer Science", "Maths"]}}'
xml_text = """<student id="17">
  <name>Asha Patel</name>
  <subjects>
    <subject>Computer Science</subject>
    <subject>Maths</subject>
  </subjects>
</student>"""

data = json.loads(json_text)                 # JSON maps straight onto dicts and lists
print(data["student"]["name"], data["student"]["subjects"][0])   # Asha Patel Computer Science
print(type(data["student"]["id"]))           # <class 'int'> - JSON knows 17 is a number

root = ET.fromstring(xml_text)               # XML is a tree of elements
print(root.find("name").text, root.find("subjects/subject").text)  # Asha Patel Computer Science
print(type(root.get("id")))                  # <class 'str'> - XML text has no built-in types
print(len(json_text), len(xml_text))         # 88 150 - JSON is shorter for the same data
```

:::trap
JSON isn't "only for JavaScript". It is **language independent**: Python, Java, C# and others all read and write it. And "XML is better because it is more flexible" needs a reason: e.g. it can be **validated against a schema**, which matters when data must follow a strict structure.
:::

## Thin-client and thick-client computing

:::columns
**Thin client**
- Minimal local processing, memory and storage; may have **no hard drive**.
- Applications run on, and data is stored on, a **powerful central server** (or the cloud); the client mainly handles input and display.
- Examples: school terminals logging on to a terminal server, Chromebooks using web apps, cloud-gaming devices.
|||
**Thick (fat) client**
- A **fully functional computer** with its own powerful processor, memory, storage and installed software.
- Does most processing **locally**; uses the server for some things (file storage, authentication, backups).
- Examples: a gaming PC, a video-editing workstation, a laptop with locally installed office software.
:::

| | Thin client | Thick client |
|---|---|---|
| Processing | done mostly on the **server** | done mostly **locally** |
| Hardware cost per client | **low**: cheap, simple devices; old PCs can be reused | **higher**: each needs a capable spec |
| Server requirements | **powerful (expensive) server** needed | less demanding server |
| Network | needs **constant**, reliable connection and **more bandwidth** | works offline / with intermittent connection; less traffic |
| If the server or network fails | **all clients stop working** | clients carry on with local work |
| Software installation and updates | **once, on the server**: easy to manage | on every machine: more IT work |
| Security | data held centrally: easier to secure and back up; less local data to lose or steal | data on many machines: harder to control; more exposure to malware |
| Performance | can slow down when many clients are busy | consistent, not affected by other users; handles demanding software |
| Flexibility for users | limited to what the server provides | users can install and run specialist software |

:::example Applying it: which would you recommend?
- **A school ICT suite of 30 machines used for web, documents and online learning** → **thin clients**: cheap hardware, central software management, central security and backups; the reliable school network makes the dependence acceptable.
- **A design studio editing 4K video** → **thick clients**: heavy processing and huge files are better handled locally, without saturating the network or overloading one server.
- **A sales rep who works on trains with no signal** → **thick client** (laptop): needs to work offline.
:::

:::exam
- **"Explain the client-server model"**: client sends request → server (listening) processes → sends response. Add an example.
- **WebSocket (3–4 marks)**: persistent connection; full duplex; established by an HTTP handshake (upgrade); server can push data without a request / less overhead / lower latency; example uses (chat, games, live feeds).
- **CRUD/REST**: learn the table both ways (e.g. "which HTTP method maps to the SQL UPDATE?" → PUT). Mention that the server translates the request into SQL and returns JSON/XML.
- **JSON v XML**: compare point by point (readability, size, parse speed, data types, flexibility/schema). One-sided lists cap your mark.
- **Thin v thick (6–9 marks)**: use the scenario. Weigh cost, management, security, network dependence and performance, then **justify a recommendation**.
:::

:::challenge
1. Open your browser's developer tools (Network tab) on a live chat or sports-score site. Can you spot a WebSocket ("WS") connection and the frames flowing through it?
2. Design REST endpoints for a revision-quiz app: create a question, get all questions on a topic, update a question's answer, delete a question. Write the HTTP method, URL and matching SQL for each.
3. Some argue a modern smartphone is a thick client running thin-client apps. Make the case for and against.
:::

:::recap
- Client-server: client requests, server (listening on a port) processes and responds; roles are software processes.
- HTTP alone is request-response, so live updates need wasteful polling.
- **WebSocket**: HTTP handshake upgrades to a persistent, full-duplex connection on port 80/443; server can push; low latency and overhead; chat, games, live feeds.
- CRUD ↔ REST ↔ SQL: Create–POST–INSERT; Retrieve–GET–SELECT; Update–PUT–UPDATE; Delete–DELETE–DELETE.
- JSON: compact, readable, fast to parse, typed values, limited types. XML: tags, verbose, slower, flexible, schema validation.
- Thin client: server does the work; cheap, central management/security; depends on network and server. Thick client: local processing; works independently, handles heavy tasks; costlier, harder to manage.
:::

:::related
- [10.4 SQL](#/topic/10.4) — the SELECT, INSERT, UPDATE and DELETE behind REST
- [10.5 Client-server databases](#/topic/10.5)
- [9.5 TCP/IP, protocols, ports and sockets](#/topic/9.5) — HTTP, ports and sockets
- [9.2 Networking: topologies, types and wireless](#/topic/9.2) — client-server v peer-to-peer
:::

*/});
