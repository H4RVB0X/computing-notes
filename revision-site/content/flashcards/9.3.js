CS.registerFlashcards("9.3", [
  { front: "The three parts of a packet and what each holds", back: "Header: source and destination IP, sequence number, TTL, protocol. Payload: the data. Trailer: checksum (and end marker)." },
  { front: "Packet switching in five steps", back: "Split into packets → add header (addresses, sequence number) → route each independently → arrive possibly out of order → reassemble using sequence numbers (re-request missing ones)." },
  { front: "Router v gateway", back: "Router: joins networks using the same protocol, forwards packets using routing tables. Gateway: joins networks using different protocols and translates between them." },
  { front: "What does a router do with each packet?", back: "Read destination IP → decrement TTL (discard at 0) → look up routing table for the next hop (default route if no match) → forward out of that interface." },
  { front: "Label: https://www.bbc.co.uk/news/index.html", back: "https = protocol · www = host · bbc.co.uk = domain name · www.bbc.co.uk = FQDN · /news/index.html = path · uk = TLD · co = second-level domain" },
  { front: "Steps of DNS resolution", back: "Local cache → DNS resolver (ISP) → root server → TLD server → authoritative server → IP returned and cached → browser connects to the IP" },
  { front: "Name the five Regional Internet Registries", back: "RIPE NCC (Europe/Middle East), ARIN (North America), APNIC (Asia-Pacific), LACNIC (Latin America/Caribbean), AFRINIC (Africa). IANA allocates to them." },
  { front: "Two advantages of packet switching", back: "Links are shared so the network is used efficiently · packets can be rerouted around failed or congested links (resilient)" },
  { front: "Why use domain names as well as IP addresses?", back: "Names are easier for people to remember; the organisation can change server/IP address without changing its name. Routers still need the IP address." },
]);
