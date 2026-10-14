CS.registerFlashcards("9.7", [
  { front: "CRUD ↔ HTTP ↔ SQL", back: "Create–POST–INSERT · Retrieve–GET–SELECT · Update–PUT–UPDATE · Delete–DELETE–DELETE" },
  { front: "Three key words that describe a WebSocket connection", back: "Persistent (stays open), full duplex (both ways at once), server push (server can send without a request). Set up by an HTTP upgrade handshake on port 80/443." },
  { front: "Give four uses of WebSockets", back: "Chat/messaging, multiplayer browser games, live scores/stock tickers, collaborative editing, live notifications/dashboards." },
  { front: "Why does polling with HTTP waste resources?", back: "The client repeatedly asks for updates, most answers are 'nothing new', and each request carries a full HTTP header (and maybe a new connection), adding bandwidth, server load and latency." },
  { front: "Principles of REST", back: "Resources identified by URLs; standard HTTP methods; each request self-contained (stateless); server performs the action (e.g. SQL) and returns JSON/XML." },
  { front: "Three advantages of JSON over XML", back: "More compact · quicker/simpler to parse (maps to objects) · easier to read · has built-in types (number v string)" },
  { front: "Two advantages of XML over JSON", back: "Can be validated against a schema · very flexible/extensible (attributes, namespaces, any structure)" },
  { front: "Thin client: two advantages, two disadvantages", back: "+ cheap clients; central software management, security and backup. − depends on server and network (single point of failure); needs a powerful server and lots of bandwidth." },
  { front: "Thick client: two advantages, two disadvantages", back: "+ works offline / independent of server; handles demanding software locally. − more expensive per machine; software and security managed on every machine." },
]);
