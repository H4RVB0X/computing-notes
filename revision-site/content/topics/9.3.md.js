CS.registerTopic({ id: "9.3", title: "The Internet: structure, routing and DNS" }, function () {/*

:::objectives
- Describe the **structure of the Internet**: a network of networks joined by ISPs, a high-speed **backbone**, and **points of presence**.
- Explain **packet switching** and name the main components of a **packet** (header, payload, trailer).
- Define **router** and **gateway**, say where and why each is used, and explain how **routing** works hop by hop across the Internet.
- Describe a **URL**, a **domain name**, a **fully qualified domain name** and an **IP address**, and label the parts of a URL.
- Explain how **domain names are organised** and how the **Domain Name System (DNS)** turns a name into an IP address.
- Explain the role of **Internet registries** and why they are needed.
:::

:::quick At a glance
- The **Internet** is a global **network of networks**. Homes and businesses connect to an **ISP** at a **point of presence (PoP)**; ISPs connect to each other and to the **backbone** of very high-capacity fibre links and core routers.
- Data is split into **packets**. Each packet is routed **independently**, possibly by different routes, and is **reassembled in order** at the destination using **sequence numbers**: **packet switching**.
- A packet has a **header** (source and destination IP, sequence number, **TTL/hop limit**, protocol), a **payload** (the data) and a **trailer** (checksum for error detection).
- A **router** forwards packets between networks using **routing tables**, one **hop** at a time. A **gateway** connects networks that use **different protocols**, translating between them.
- **URL** = full address of a resource, e.g. `https://www.bbc.co.uk/news/index.html`. **FQDN** = domain name including the host, e.g. `www.bbc.co.uk`.
- Domain names are **hierarchical**: root → **top-level domain** (`.uk`) → second-level (`.co`) → organisation (`bbc`) → host (`www`).
- **DNS** is a distributed, hierarchical system of **name servers** that resolves domain names to **IP addresses**.
- **Internet registries** (IANA, then five **Regional Internet Registries** such as **RIPE NCC**) allocate IP addresses so every public address and domain name is **unique**.
:::

:::keyterms
Internet :: A global network of interconnected networks that communicate using common protocols (TCP/IP). :: Lots of networks joined together.
Internet service provider (ISP) :: An organisation that provides customers with access to the Internet via its own network. :: The company you pay for your connection.
Internet backbone :: The high-capacity, high-speed connections (mainly fibre-optic, including undersea cables) and core routers that link the major networks of the Internet. :: The motorways of the Internet.
Packet switching :: A method in which data is split into packets that are each routed independently across a network, possibly by different routes, and reassembled at the destination. :: Send the pieces separately, rebuild at the end.
Packet :: A unit of data transmitted across a network, made up of a header, a payload and (often) a trailer. :: An envelope with the address on the front and part of the letter inside.
Time to live (TTL) :: A value in the packet header that is decremented by each router; when it reaches zero the packet is discarded, preventing packets circulating forever. Called the hop limit in IPv6. :: A countdown of how many more routers it may visit.
Router :: A device that connects two or more networks and forwards packets towards their destination using the destination IP address and a routing table. :: A junction signpost reader.
Gateway :: A device used to connect networks that use different protocols, translating between those protocols. :: A translator at the border.
URL :: Uniform Resource Locator: the full address used to locate a specific resource on the Internet, including the protocol, domain name and path. :: The full web address.
Domain name :: A name that identifies an area or domain of the Internet, associated with an organisation, which is mapped to an IP address. :: A human-friendly name for a server's number.
Fully qualified domain name (FQDN) :: A domain name that includes the host server name, e.g. www.example.co.uk, specifying an exact location in the DNS hierarchy. :: The complete name, host and all.
IP address :: A numerical address that uniquely identifies a device on a network, used to route packets to it. :: The device's phone number on the Internet.
Domain Name System (DNS) :: A hierarchical, distributed system of domain name servers that maps domain names to IP addresses. :: The Internet's phone book.
Internet registry :: An organisation that allocates and records IP addresses (and domain names) so that each is unique, e.g. IANA and the Regional Internet Registries such as RIPE NCC. :: The body that hands out unique numbers and keeps the records.
:::

## The structure of the Internet

The **Internet** is not one network; it is a **network of networks**, owned by thousands of organisations (ISPs, telecoms companies, universities, governments, businesses), all agreeing to use the same protocols (TCP/IP).

:::figure From your laptop to a web server: home LAN → ISP via a point of presence → backbone → another ISP → server
<svg class="diagram" viewBox="0 0 680 280" role="img" aria-label="Diagram of a home network connecting via an ISP point of presence to the Internet backbone, then to another ISP and a web server">
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <rect x="10" y="70" width="130" height="150" rx="8" fill="#7c9aff" fill-opacity="0.12" stroke-dasharray="5 4"/>
    <text x="75" y="88" text-anchor="middle" stroke="none" font-weight="bold">Home LAN</text>
    <rect x="25" y="100" width="45" height="22" rx="3" fill="#7c9aff" fill-opacity="0.35"/><text x="47" y="115" text-anchor="middle" stroke="none">laptop</text>
    <rect x="80" y="100" width="45" height="22" rx="3" fill="#7c9aff" fill-opacity="0.35"/><text x="102" y="115" text-anchor="middle" stroke="none">phone</text>
    <rect x="30" y="165" width="90" height="30" rx="5" fill="#6fd39a" fill-opacity="0.4"/><text x="75" y="184" text-anchor="middle" stroke="none">home router</text>
    <line x1="47" y1="122" x2="60" y2="165"/><line x1="102" y1="122" x2="90" y2="165"/>
    <line x1="120" y1="180" x2="175" y2="180"/>
    <rect x="175" y="160" width="70" height="40" rx="5" fill="#ff9f7c" fill-opacity="0.35"/><text x="210" y="178" text-anchor="middle" stroke="none">ISP</text><text x="210" y="193" text-anchor="middle" stroke="none">PoP</text>
    <rect x="160" y="60" width="100" height="40" rx="6" fill="#ff9f7c" fill-opacity="0.2"/><text x="210" y="84" text-anchor="middle" stroke="none">ISP A network</text>
    <line x1="210" y1="160" x2="210" y2="100"/>
    <ellipse cx="380" cy="80" rx="105" ry="55" fill="#c58cff" fill-opacity="0.15"/>
    <text x="380" y="40" text-anchor="middle" stroke="none" font-weight="bold">Backbone</text>
    <circle cx="320" cy="70" r="12" fill="#c58cff" fill-opacity="0.5"/><circle cx="380" cy="105" r="12" fill="#c58cff" fill-opacity="0.5"/><circle cx="440" cy="70" r="12" fill="#c58cff" fill-opacity="0.5"/><circle cx="380" cy="55" r="12" fill="#c58cff" fill-opacity="0.5"/>
    <line x1="332" y1="70" x2="368" y2="55"/><line x1="332" y1="73" x2="370" y2="100"/><line x1="392" y1="55" x2="428" y2="68"/><line x1="392" y1="102" x2="430" y2="76"/><line x1="380" y1="67" x2="380" y2="93"/>
    <line x1="260" y1="80" x2="308" y2="72"/>
    <rect x="500" y="60" width="100" height="40" rx="6" fill="#ff9f7c" fill-opacity="0.2"/><text x="550" y="84" text-anchor="middle" stroke="none">ISP B network</text>
    <line x1="452" y1="72" x2="500" y2="80"/>
    <rect x="515" y="165" width="80" height="40" rx="5" fill="#6fd39a" fill-opacity="0.35"/><text x="555" y="183" text-anchor="middle" stroke="none">data centre</text><text x="555" y="198" text-anchor="middle" stroke="none">web server</text>
    <line x1="550" y1="100" x2="555" y2="165"/>
    <text x="380" y="160" text-anchor="middle" stroke="none">core routers joined by high-capacity fibre</text>
    <text x="380" y="176" text-anchor="middle" stroke="none">(many alternative paths)</text>
    <text x="340" y="262" text-anchor="middle" stroke="none" font-size="13">Each line between two routers is one hop; packets may take different paths through the mesh</text>
  </g>
</svg>
:::

| Part | What it is / does |
|---|---|
| **LAN and home router** | your local network; the router connects it to the ISP and the outside world |
| **ISP (Internet service provider)** | sells access to the Internet; runs its own network of routers |
| **Point of presence (PoP)** | a location (building/equipment) where an ISP has routers and servers so customers in that area can connect to its network |
| **Internet exchange points (IXPs)** | places where many ISPs' networks meet and swap traffic directly |
| **Backbone** | the very high-capacity fibre-optic links (including **undersea cables**) and powerful **core routers** joining the major networks |

The backbone is a **mesh**: there are many different paths between any two points, so if a link fails, traffic is routed round it.

## Packet switching

Files, web pages and video calls are far too large to send as one lump. Instead:

:::steps How packet switching works
1. The data is split into small **packets** of a set maximum size.
2. Each packet is given a **header** including the **source** and **destination IP addresses** and a **sequence number**.
3. Each packet is sent **independently**. At every router, the best next hop is chosen for that packet based on current conditions, so packets from the same message may take **different routes**.
4. Packets may therefore **arrive out of order**, or some may be lost.
5. At the destination the packets are **reassembled in the correct order** using the sequence numbers. Missing or corrupted packets are **re-requested** (this is TCP's job, see [9.5](#/topic/9.5)).
:::

{{tool:packet-switching}}

:::why Why not reserve a dedicated line (circuit switching)?
The old telephone network reserved a fixed path for the whole call (**circuit switching**). That wastes capacity: the line is reserved even in silences. Packet switching lets **many conversations share the same links**, uses the network much more **efficiently**, and is **resilient**: if a router or link fails, later packets simply take another route.
:::

### What is in a packet?

:::figure The main components of a packet as described in AQA mark schemes
<svg class="diagram" viewBox="0 0 680 190" role="img" aria-label="A packet made of a header with source IP, destination IP, sequence number, TTL and protocol, then the payload, then a trailer with a checksum">
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <rect x="10" y="40" width="330" height="70" fill="#7c9aff" fill-opacity="0.3"/>
    <rect x="340" y="40" width="230" height="70" fill="#6fd39a" fill-opacity="0.3"/>
    <rect x="570" y="40" width="100" height="70" fill="#ff9f7c" fill-opacity="0.35"/>
    <text x="175" y="30" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">Header</text>
    <text x="455" y="30" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">Payload (body)</text>
    <text x="620" y="30" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">Trailer</text>
    <line x1="76" y1="40" x2="76" y2="110"/><line x1="152" y1="40" x2="152" y2="110"/><line x1="218" y1="40" x2="218" y2="110"/><line x1="276" y1="40" x2="276" y2="110"/>
    <text x="43" y="72" text-anchor="middle" stroke="none">source</text><text x="43" y="88" text-anchor="middle" stroke="none">IP</text>
    <text x="114" y="72" text-anchor="middle" stroke="none">destination</text><text x="114" y="88" text-anchor="middle" stroke="none">IP</text>
    <text x="185" y="72" text-anchor="middle" stroke="none">sequence</text><text x="185" y="88" text-anchor="middle" stroke="none">number</text>
    <text x="247" y="72" text-anchor="middle" stroke="none">TTL /</text><text x="247" y="88" text-anchor="middle" stroke="none">hop limit</text>
    <text x="308" y="72" text-anchor="middle" stroke="none">protocol</text><text x="308" y="88" text-anchor="middle" stroke="none">(+ length)</text>
    <text x="455" y="80" text-anchor="middle" stroke="none">the actual data being sent</text>
    <text x="620" y="72" text-anchor="middle" stroke="none">checksum /</text><text x="620" y="88" text-anchor="middle" stroke="none">end marker</text>
    <text x="340" y="150" text-anchor="middle" stroke="none" font-size="13">Header = how to deliver it · Payload = what is delivered · Trailer = was it damaged on the way?</text>
  </g>
</svg>
:::

| Component | Contents | Why it is needed |
|---|---|---|
| **Header** | source IP address, destination IP address, **sequence (packet) number**, **TTL/hop limit**, protocol, packet length | routers read the destination; the receiver uses the sequence number to reassemble; TTL stops packets looping forever |
| **Payload** | the data itself (part of the file, page, email…) | the whole point of sending it |
| **Trailer** | **checksum** (or CRC) and an end-of-packet marker | the receiver recalculates the checksum; a mismatch means the packet was corrupted and must be re-sent |

:::note Accuracy note: where the checksum really lives
Exam mark schemes accept the header/payload/trailer model above. In real IPv4 the header carries its own header checksum and there is **no** IP trailer; the trailer with a **frame check sequence** is added at the **link layer** (e.g. the Ethernet frame). TCP segments also carry a checksum. For the exam, "trailer containing a checksum" is the expected answer.
:::

### Time to live (TTL)

If a routing fault sent a packet round in a loop it would circulate forever, wasting bandwidth. So the sender sets the **TTL** (e.g. 64). **Every router decrements it by 1**. A router that reduces it to **0 discards** the packet (and usually reports back to the sender). In IPv6 this field is called the **hop limit**.

{{trace:9.3-1}}

## Routers and gateways

:::columns
**Router**
- Connects **two or more networks** and forwards packets between them.
- Reads each packet's **destination IP address** and looks it up in its **routing table** to choose the **next hop**.
- Decrements the TTL.
- **Where:** at the edge of every LAN (your home router joins the LAN to the ISP), throughout ISP networks, and as **core routers** on the backbone.
- **Why:** to move packets between networks along an efficient path, and to keep local traffic local.
|||
**Gateway**
- Connects networks that use **different protocols** (different addressing schemes, frame formats or communication rules).
- **Translates** between them: the packet's header (and trailer) for one network is **stripped off** and replaced with the format the other network uses; the payload is passed across.
- **Where:** between dissimilar networks, e.g. a factory or IoT network that does not use TCP/IP connecting to the Internet, or an email system using a different protocol.
- **Why:** without translation, the two networks couldn't understand each other's data.
:::

:::trap
- A router joins networks **using the same protocol** (e.g. IP on both sides). A gateway joins networks **using different protocols** and translates. That distinction is the mark.
- The "**default gateway**" setting on your computer is just the IP address of the **router** it sends non-local traffic to. Don't let the name confuse you.
:::

## How routing works across the Internet

Routing is done **hop by hop**: no single router knows the whole path. Each router only decides **where to send the packet next**.

:::steps What a router does with every packet
1. Receive the packet and read the **destination IP address** from the header.
2. Decrement the **TTL**; if it reaches 0, discard the packet.
3. Look the destination up in the **routing table**: find the most specific entry whose network matches the destination (the **default route** matches anything not listed).
4. Forward the packet out of the interface towards the **next hop** router given by that entry.
5. Repeat at the next router until the packet reaches a router directly connected to the destination network, which delivers it.
:::

:::example Worked example: using a routing table
A router has this routing table:

| Destination network | Next hop | Interface |
|---|---|---|
| 192.168.1.0/24 | directly connected | eth0 |
| 81.2.0.0/16 | 10.0.0.2 | eth1 |
| 0.0.0.0/0 (default route) | 10.0.0.1 | eth2 |

1. Packet for **192.168.1.40**: the first 24 bits (192.168.1) match the first entry → deliver directly on **eth0**.
2. Packet for **81.2.33.7**: the first 16 bits (81.2) match the second entry → forward to **10.0.0.2** on **eth1**.
3. Packet for **151.101.0.81**: no specific entry matches → use the **default route** → forward to **10.0.0.1** on **eth2**.
:::

```python
import ipaddress

routing_table = [
    ("192.168.1.0/24", "direct", "eth0"),
    ("81.2.0.0/16", "10.0.0.2", "eth1"),
    ("0.0.0.0/0", "10.0.0.1", "eth2"),   # default route
]

def route(destination):
    dest = ipaddress.ip_address(destination)
    matches = [(ipaddress.ip_network(net), hop, iface)
               for net, hop, iface in routing_table
               if dest in ipaddress.ip_network(net)]
    net, hop, iface = max(matches, key=lambda m: m[0].prefixlen)   # most specific
    return f"{destination}: matches {net} -> next hop {hop} via {iface}"

print(route("192.168.1.40"))   # direct via eth0
print(route("81.2.33.7"))      # 10.0.0.2 via eth1
print(route("151.101.0.81"))   # default: 10.0.0.1 via eth2
```

**How do routing tables stay up to date?** Routers run **routing protocols** to share information with neighbouring routers about which networks they can reach and how good each path is (number of hops, speed, congestion). If a link fails or becomes congested the tables are updated and **later packets take a different route**. (Examples: OSPF inside an ISP's network, BGP between ISPs. You don't need the names for AQA.)

## URLs, domain names and IP addresses

- **IP address**: the number that actually identifies a device and is used for routing, e.g. `151.101.0.81` (IPv4) or `2001:db8::42` (IPv6).
- **Domain name**: a human-friendly name for an area of the Internet belonging to an organisation, e.g. `bbc.co.uk`. Easier to remember than numbers, and the organisation can move to a new IP address without changing its name.
- **Fully qualified domain name (FQDN)**: the domain name **including the host name**, e.g. `www.bbc.co.uk` (host `www`) or `mail.bbc.co.uk` (host `mail`).
- **URL**: the full address of **one specific resource**, including the protocol and path.

:::figure Labelling a URL
<svg class="diagram" viewBox="0 0 680 190" role="img" aria-label="The URL https://www.bbc.co.uk/news/index.html with the protocol, host, domain name, FQDN and path labelled">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <text x="20" y="60" stroke="none" font-family="monospace" font-size="22">https://www.bbc.co.uk/news/index.html</text>
    <line x1="22" y1="72" x2="94" y2="72" stroke-width="2" stroke="#ff9f7c"/>
    <line x1="134" y1="72" x2="169" y2="72" stroke-width="2" stroke="#6fd39a"/>
    <line x1="182" y1="72" x2="318" y2="72" stroke-width="2" stroke="#7c9aff"/>
    <line x1="318" y1="72" x2="510" y2="72" stroke-width="2" stroke="#c58cff"/>
    <line x1="134" y1="20" x2="318" y2="20" stroke-width="2"/><line x1="134" y1="20" x2="134" y2="28"/><line x1="318" y1="20" x2="318" y2="28"/>
    <text x="226" y="14" text-anchor="middle" stroke="none">fully qualified domain name (FQDN)</text>
    <text x="58" y="100" text-anchor="middle" stroke="none">protocol</text><text x="58" y="116" text-anchor="middle" stroke="none">(scheme)</text>
    <text x="152" y="100" text-anchor="middle" stroke="none">host</text><text x="152" y="116" text-anchor="middle" stroke="none">name</text>
    <text x="250" y="100" text-anchor="middle" stroke="none">domain name</text>
    <text x="414" y="100" text-anchor="middle" stroke="none">path to the resource</text><text x="414" y="116" text-anchor="middle" stroke="none">(folder/file name)</text>
    <text x="340" y="160" text-anchor="middle" stroke="none">uk = top-level domain (country code) · co = second-level domain · bbc = organisation's domain</text>
  </g>
</svg>
:::

## How domain names are organised

The domain name space is a **hierarchy** (a tree), read **right to left**:

:::figure The domain name hierarchy
<svg class="diagram" viewBox="0 0 680 300" role="img" aria-label="Tree with root at the top, top-level domains uk, com and org, second-level domains co and ac under uk, organisations bbc and cam, and host www">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <g stroke-width="1.5">
      <line x1="340" y1="45" x2="160" y2="95"/><line x1="340" y1="45" x2="340" y2="95"/><line x1="340" y1="45" x2="520" y2="95"/>
      <line x1="160" y1="115" x2="90" y2="165"/><line x1="160" y1="115" x2="230" y2="165"/>
      <line x1="340" y1="115" x2="340" y2="165"/>
      <line x1="90" y1="185" x2="90" y2="225"/><line x1="230" y1="185" x2="230" y2="225"/>
      <line x1="90" y1="245" x2="90" y2="265"/>
    </g>
    <rect x="300" y="20" width="80" height="26" rx="13" fill="#c58cff" fill-opacity="0.35"/><text x="340" y="38" text-anchor="middle" stroke="none">root  .</text>
    <rect x="130" y="92" width="60" height="24" rx="5" fill="#7c9aff" fill-opacity="0.35"/><text x="160" y="109" text-anchor="middle" stroke="none">uk</text>
    <rect x="310" y="92" width="60" height="24" rx="5" fill="#7c9aff" fill-opacity="0.35"/><text x="340" y="109" text-anchor="middle" stroke="none">com</text>
    <rect x="490" y="92" width="60" height="24" rx="5" fill="#7c9aff" fill-opacity="0.35"/><text x="520" y="109" text-anchor="middle" stroke="none">org</text>
    <rect x="60" y="162" width="60" height="24" rx="5" fill="#6fd39a" fill-opacity="0.35"/><text x="90" y="179" text-anchor="middle" stroke="none">co</text>
    <rect x="200" y="162" width="60" height="24" rx="5" fill="#6fd39a" fill-opacity="0.35"/><text x="230" y="179" text-anchor="middle" stroke="none">ac</text>
    <rect x="300" y="162" width="80" height="24" rx="5" fill="#6fd39a" fill-opacity="0.35"/><text x="340" y="179" text-anchor="middle" stroke="none">google</text>
    <rect x="60" y="222" width="60" height="24" rx="5" fill="#ff9f7c" fill-opacity="0.35"/><text x="90" y="239" text-anchor="middle" stroke="none">bbc</text>
    <rect x="200" y="222" width="60" height="24" rx="5" fill="#ff9f7c" fill-opacity="0.35"/><text x="230" y="239" text-anchor="middle" stroke="none">cam</text>
    <text x="90" y="285" text-anchor="middle" stroke="none">www</text>
    <text x="560" y="175" stroke="none" font-size="12">top-level domains:</text>
    <text x="560" y="191" stroke="none" font-size="12">.uk .fr (country)</text>
    <text x="560" y="207" stroke="none" font-size="12">.com .org (generic)</text>
    <text x="400" y="255" stroke="none" font-size="12">www.bbc.co.uk = host www in domain bbc,</text>
    <text x="400" y="271" stroke="none" font-size="12">under co, under uk, under the root</text>
  </g>
</svg>
:::

| Level | Example | Meaning |
|---|---|---|
| Root | `.` (usually invisible) | top of the tree; root name servers know where every TLD's servers are |
| **Top-level domain (TLD)** | `.uk`, `.fr` (country code); `.com`, `.org` (generic) | the right-most label |
| **Second-level domain** | `.co` in `.co.uk`, `.ac` in `.ac.uk`; or `google` in `google.com` | type of organisation in many country domains |
| Organisation's domain | `bbc` in `bbc.co.uk` | registered by the organisation |
| Host / subdomain | `www`, `mail` | a particular server or service; makes it an FQDN |

## The Domain Name System (DNS)

Routers need IP addresses, people prefer names. **DNS** translates. It is a **distributed, hierarchical** system: no single server holds every name; each **domain name server** is responsible for part of the tree and knows how to find the others.

:::steps Resolving www.bbc.co.uk (what happens when you type a URL)
1. The browser extracts the domain name from the URL and checks the **local cache** (browser and operating system). If the IP address is there, it is used straight away.
2. Otherwise a query is sent to the **DNS resolver**, usually a DNS server run by the ISP (its address is configured by DHCP).
3. If the resolver has the answer **cached**, it replies immediately.
4. If not, it asks a **root name server**, which replies with the address of the name servers for the **TLD** `.uk`.
5. The resolver asks a `.uk` server, which replies with the address of the **authoritative name server** for `bbc.co.uk`.
6. The resolver asks the authoritative server, which replies with the **IP address** of `www.bbc.co.uk`.
7. The resolver returns the IP address to the computer and **caches** it for a set time. The browser now sends its HTTP(S) request to that IP address.
:::

{{tool:dns-resolver}}

:::tip The short version AQA often accepts
"The domain name is sent to a DNS server, which looks it up in its database and returns the matching IP address. If it does not have an entry, it passes the request to another DNS server higher up the hierarchy." Then the IP address is used to connect to the server.
:::

:::trap
- DNS **doesn't** deliver the web page; it only returns the **IP address**. The browser then contacts the web server itself.
- A domain name and an IP address are **not always one-to-one**: one IP address can host many domain names (shared hosting) and a busy site can have many IP addresses. Your textbook's "one-to-one" is a simplification.
- **URL ≠ domain name.** The URL includes the protocol and the path; the domain name is just the name part.
:::

## Internet registries

Every **public** IP address on the Internet must be **unique**, otherwise packets couldn't be delivered to the right device. Someone has to hand them out.

- **IANA** (Internet Assigned Numbers Authority, part of **ICANN**) manages the global pool of IP addresses and the root of the DNS.
- IANA allocates large blocks of addresses to the five **Regional Internet Registries (RIRs)**:

| RIR | Region |
|---|---|
| **RIPE NCC** | Europe (including the UK), the Middle East, parts of Central Asia |
| ARIN | North America |
| APNIC | Asia-Pacific |
| LACNIC | Latin America and the Caribbean |
| AFRINIC | Africa |

- RIRs allocate smaller blocks to **ISPs** and large organisations, who assign addresses to customers.
- Domain names are similar: ICANN oversees the system, a **registry** manages each TLD (e.g. Nominet for `.uk`) and **registrars** sell names to the public. A name can only be registered once.

:::why Why registries are needed
- To make sure **each public IP address (and domain name) is allocated only once**, so it is globally unique.
- To share out a **finite resource** (especially scarce IPv4 addresses) fairly between regions and organisations.
- To keep a **public record** (the WHOIS database) of who holds each block of addresses or each domain.
:::

:::exam
- **"Describe packet switching"** (4–6 marks): split into packets → header with source/destination IP and sequence number → each routed independently by routers → may take different routes → reassembled in order using sequence numbers → missing packets re-requested.
- **"State the components of a packet"**: header (source IP, destination IP, sequence number, TTL), payload, trailer (checksum). Give the *purpose* of each if asked to "explain".
- **Router v gateway**: always include **same protocol v different protocols** and that a gateway **translates** (strips and replaces the header).
- **DNS questions**: number your steps; mention **cache**, **DNS server**, **passing to a higher-level server** if unknown, **IP returned**, then the browser **connects to the IP**.
- **Label a URL**: protocol, (host +) domain name = FQDN, path/file name.
- **Registries**: unique allocation of IP addresses; IANA → RIRs (RIPE NCC) → ISPs; keep records.
:::

:::challenge
1. Use `tracert` (Windows) or `traceroute` (macOS/Linux) to a distant website. How many hops does it take? How does the tool use the TTL to discover each router on the path?
2. Why might two packets of the same email take different routes? Give two reasons a router might change its choice of next hop.
3. Explain why DNS answers are cached with an expiry time. What could go wrong if they were cached forever?
:::

:::recap
- The Internet is a network of networks: LANs connect to ISPs (at PoPs), ISPs interconnect and join the high-capacity **backbone**.
- **Packet switching**: data split into packets, each routed independently, reassembled using sequence numbers; efficient and resilient.
- Packet = **header** (source/destination IP, sequence number, TTL, protocol) + **payload** + **trailer** (checksum).
- **Router**: forwards packets between networks hop by hop using routing tables. **Gateway**: joins networks with different protocols, translating.
- URL = protocol + FQDN + path. Domain names are hierarchical: root → TLD → second level → organisation → host.
- **DNS** resolves names to IP addresses via caches, resolvers, root, TLD and authoritative name servers.
- **Registries** (IANA → RIRs such as RIPE NCC → ISPs) keep public IP addresses and domain names unique.
:::

:::related
- [9.5 TCP/IP, protocols, ports and sockets](#/topic/9.5) — where packets are created and reassembled
- [9.6 IP addressing, subnets, DHCP and NAT](#/topic/9.6)
- [9.4 Internet security](#/topic/9.4)
- [9.2 Networking: topologies, types and wireless](#/topic/9.2)
:::

*/});
