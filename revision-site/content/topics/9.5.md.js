CS.registerTopic({ id: "9.5", title: "TCP/IP, protocols, ports and sockets" }, function () {/*

:::objectives
- Describe the role of each of the four layers of the **TCP/IP stack**: **application**, **transport**, **network** and **link**.
- Explain **encapsulation**: what each layer adds on the way down and removes on the way up.
- Describe the role of **sockets**, **MAC addresses**, **well-known ports** and **client (ephemeral) ports**.
- Be familiar with **FTP**, **HTTP**, **HTTPS**, **POP3**, **SMTP** and **SSH**, their ports and what each is for, including **anonymous** and **non-anonymous FTP**.
- Explain how **SSH** is used for remote management and to send application-level commands (**GET**, **SMTP**, **POP3**) to a remote port.
- Explain the roles of an **email server**, a **web server** and a **web browser**.
:::

:::quick At a glance
- **TCP/IP stack**, top to bottom: **Application → Transport → Network (Internet) → Link**.
- **Application**: chooses the right protocol for the application (HTTP, SMTP, FTP…) and formats the data.
- **Transport** (TCP): splits data into **segments**, adds **source and destination port numbers** and **sequence numbers**, makes delivery **reliable** (acknowledgements, retransmission) and reassembles at the other end.
- **Network**: adds **source and destination IP addresses** to make **packets**; **routers** work at this layer.
- **Link**: adds **MAC addresses** of the next hop and turns the frame into signals on the physical medium (NIC, cable, WiFi).
- **Encapsulation**: each layer adds its own header on the way down; the receiver strips them off on the way up.
- **Socket** = **IP address + port number**, e.g. `192.168.1.20:51734`: one end of a connection.
- **Well-known ports** (0–1023) identify **server** services: 20/21 FTP, 22 SSH, 25 SMTP, 80 HTTP, 110 POP3, 443 HTTPS. **Client ports** are temporary, high-numbered ports chosen by the client for each connection.
- **MAC address**: a **48-bit** hardware address unique to each network interface, used by the **link layer** to deliver frames on the local network.
:::

:::keyterms
TCP/IP stack :: A set of networking protocols organised into four layers (application, transport, network, link), each layer using the services of the layer below. :: Four teams passing a parcel down to the van and back up again.
Application layer :: The layer that selects and uses the appropriate protocol for the application (e.g. HTTP, FTP, SMTP) and formats the data accordingly. :: Speaks the app's language.
Transport layer :: The layer that establishes end-to-end connections, splits data into numbered segments, adds port numbers and ensures reliable, ordered delivery (TCP). :: Chops, numbers, checks off, re-orders.
Network layer :: The layer that adds source and destination IP addresses to form packets and routes them across networks. :: Writes the postal address and finds the route.
Link layer :: The layer that handles the physical transmission of data across the local network medium, adding source and destination MAC addresses to form frames. :: Gets it across the next wire.
Encapsulation :: The process by which each layer adds its own header (and possibly trailer) to the data passed down from the layer above. :: Envelopes inside envelopes.
Socket :: An endpoint of a communication across a network, made up of an IP address combined with a port number. :: The exact door at the exact building.
Port :: A 16-bit number used to identify a particular application or process on a host so that data is passed to the right one. :: Which flat in the building.
Well-known port :: A port number in the range 0–1023 reserved for a standard server service, e.g. 80 for HTTP, so clients know where to connect. :: The famous doors everyone knows.
Client (ephemeral) port :: A temporary port number, usually above 1023, allocated by the client's operating system for the duration of one connection so replies return to the right process. :: A cloakroom ticket for this conversation.
MAC address :: Media Access Control address: a unique 48-bit identifier assigned to a network interface card, used to address frames at the link layer. :: The device's hardware serial number on the network.
Protocol :: A set of rules relating to communication between devices. :: Agreed rules of conversation.
:::

## Why use layers?

Sending data across the Internet involves many separate jobs: speaking the application's language, making delivery reliable, finding a route, and pushing signals down a wire. The **TCP/IP model** splits these into **four layers**, each with **one job** and its own **protocols**.

- Each layer only needs to talk to the **layer directly above and below**.
- A layer can be **changed without affecting the others**: your browser doesn't care whether the bits travel over WiFi, Ethernet or 5G.
- Different companies can build different layers to the same **standard**, and they will work together.

## The four layers

:::figure Encapsulation: each layer adds a header on the way down; the receiver removes them on the way up
<svg class="diagram" viewBox="0 0 680 300" role="img" aria-label="Four TCP/IP layers with the data unit growing as each layer adds a header: data, TCP header plus data, IP header plus segment, frame header plus packet plus trailer">
  <defs><marker id="arr95" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <text x="12" y="48" stroke="none" font-weight="bold">Application</text>
    <text x="12" y="113" stroke="none" font-weight="bold">Transport</text>
    <text x="12" y="178" stroke="none" font-weight="bold">Network</text>
    <text x="12" y="243" stroke="none" font-weight="bold">Link</text>
    <rect x="420" y="30" width="150" height="30" fill="#7c9aff" fill-opacity="0.35"/><text x="495" y="50" text-anchor="middle" stroke="none">HTTP data</text>
    <rect x="300" y="95" width="120" height="30" fill="#6fd39a" fill-opacity="0.4"/><text x="360" y="109" text-anchor="middle" stroke="none">TCP header</text><text x="360" y="121" text-anchor="middle" stroke="none" font-size="10">ports, seq no.</text>
    <rect x="420" y="95" width="150" height="30" fill="#7c9aff" fill-opacity="0.35"/><text x="495" y="115" text-anchor="middle" stroke="none">HTTP data</text>
    <rect x="190" y="160" width="110" height="30" fill="#c58cff" fill-opacity="0.4"/><text x="245" y="174" text-anchor="middle" stroke="none">IP header</text><text x="245" y="186" text-anchor="middle" stroke="none" font-size="10">IP addresses, TTL</text>
    <rect x="300" y="160" width="120" height="30" fill="#6fd39a" fill-opacity="0.4"/><text x="360" y="180" text-anchor="middle" stroke="none">TCP header</text>
    <rect x="420" y="160" width="150" height="30" fill="#7c9aff" fill-opacity="0.35"/><text x="495" y="180" text-anchor="middle" stroke="none">HTTP data</text>
    <rect x="95" y="225" width="95" height="30" fill="#ff9f7c" fill-opacity="0.45"/><text x="142" y="239" text-anchor="middle" stroke="none">frame header</text><text x="142" y="251" text-anchor="middle" stroke="none" font-size="10">MAC addresses</text>
    <rect x="190" y="225" width="110" height="30" fill="#c58cff" fill-opacity="0.4"/><text x="245" y="245" text-anchor="middle" stroke="none">IP header</text>
    <rect x="300" y="225" width="120" height="30" fill="#6fd39a" fill-opacity="0.4"/><text x="360" y="245" text-anchor="middle" stroke="none">TCP header</text>
    <rect x="420" y="225" width="150" height="30" fill="#7c9aff" fill-opacity="0.35"/><text x="495" y="245" text-anchor="middle" stroke="none">HTTP data</text>
    <rect x="570" y="225" width="70" height="30" fill="#ff9f7c" fill-opacity="0.45"/><text x="605" y="239" text-anchor="middle" stroke="none">trailer</text><text x="605" y="251" text-anchor="middle" stroke="none" font-size="10">checksum</text>
    <text x="625" y="50" text-anchor="middle" stroke="none" font-size="11">data</text>
    <text x="625" y="115" text-anchor="middle" stroke="none" font-size="11">segment</text>
    <text x="625" y="180" text-anchor="middle" stroke="none" font-size="11">packet</text>
    <line x1="80" y1="60" x2="80" y2="222" stroke-width="2" marker-end="url(#arr95)"/>
    <text x="340" y="292" text-anchor="middle" stroke="none" font-size="12">sending: add headers ↓ · receiving: strip headers ↑</text>
    <text x="605" y="272" text-anchor="middle" stroke="none" font-size="11">frame</text>
  </g>
</svg>
:::

### Application layer

- Where network applications (browser, email client, FTP client) hand their data to the network.
- **Selects and uses the correct protocol** for the job: HTTP/HTTPS for web pages, SMTP/POP3 for email, FTP for file transfer, SSH for remote login, DNS for name lookups.
- Formats the data so the application at the other end can understand it (e.g. writes the HTTP `GET` request).

### Transport layer

- Sets up and manages an **end-to-end connection** between the two hosts. TCP opens a connection with a **three-way handshake** (SYN → SYN-ACK → ACK) before data flows.
- **Splits** the data into **segments** and adds a header with:
  - the **source port** and **destination port** (so the data reaches the right application),
  - a **sequence number** for each segment (so they can be reassembled in order).
- At the receiving end: **acknowledges** segments, **requests re-sends** of lost or corrupted ones (checksum), and **reassembles** them in order before passing the data up.
- **TCP** gives reliable, ordered delivery. (Its alternative, **UDP**, is faster but makes no guarantees, so it suits live streaming and DNS lookups.)

### Network (Internet) layer

- Adds a header containing the **source and destination IP addresses** (plus TTL) to each segment, making a **packet**.
- Responsible for **routing**: deciding the next hop towards the destination. **Routers** operate at this layer (see [9.3](#/topic/9.3)).
- IP itself is **connectionless** and doesn't guarantee delivery; that's TCP's job one layer up.

### Link layer

- Handles transmission across the **physical medium of the local network** (copper, fibre, radio), using the **network interface card** and its driver.
- Adds a header with the **source and destination MAC addresses** (and a trailer with an error-checking value) to form a **frame**, then converts it into electrical, light or radio signals.
- The destination MAC is that of the **next device on the path** (often the router), not the final server. At each router the frame is removed and a **new frame** is built for the next link, while the IP packet inside is unchanged.
- Protocols here include **Ethernet** and **WiFi** (with CSMA/CA, see [9.2](#/topic/9.2)).

{{tool:tcpip-layers}}

```python
# Sending: each layer wraps the data from the layer above with its own header
app_data = "GET /index.html HTTP/1.1"                       # application layer (HTTP)

segment = {"src_port": 51734, "dst_port": 80,              # transport layer (TCP)
           "seq": 1, "data": app_data}

packet = {"src_ip": "192.168.1.20", "dst_ip": "203.0.113.80",  # network layer (IP)
          "ttl": 64, "data": segment}

frame = {"src_mac": "3C:22:FB:1A:2B:3C",                    # link layer (Ethernet)
         "dst_mac": "A4:91:B1:00:11:22",                    # MAC of the next hop (router)
         "data": packet, "fcs": "checksum"}

# Receiving: each layer strips its own header and passes the payload up
p = frame["data"]           # link layer removes frame header and trailer
s = p["data"]               # network layer removes IP header
print(s["dst_port"])        # 80 -> transport layer hands data to the web server process
print(s["data"])            # GET /index.html HTTP/1.1
```

| Layer | Data unit | Adds | Key job | Example protocols / devices |
|---|---|---|---|---|
| Application | data/message | application protocol formatting | right protocol for the app | HTTP, HTTPS, FTP, SMTP, POP3, SSH, DNS |
| Transport | segment | **port numbers**, **sequence numbers**, checksum | reliable end-to-end delivery, reassembly | TCP, UDP |
| Network | packet | **IP addresses**, TTL | addressing and routing between networks | IP; **routers** |
| Link | frame | **MAC addresses**, error-check trailer | transmission over the local physical medium | Ethernet, WiFi; NICs, **switches** |

:::trap
- Ports go in at the **transport** layer; IP addresses at the **network** layer; MAC addresses at the **link** layer. Mixing these up is the most common error.
- The **link** layer's MAC addresses change at **every hop**; the IP addresses (normally) stay the same from source to destination.
- Learn the order **A-T-N-L** from the top ("**A**ll **T**eachers **N**eed **L**unch"). Some books call the network layer the *Internet* layer and the link layer the *network access* layer.
:::

## Ports and sockets

An IP address gets data to the right **device**. But one device runs many networked programs at once (browser tabs, email, a game). The **port number** gets the data to the right **program**.

- A **port** is a **16-bit number** (0–65535) in the transport-layer header.
- **Well-known ports (0–1023)** are reserved for standard **server** services, so a client always knows where to find, say, a web server: it connects to port 80 (HTTP) or 443 (HTTPS).
- **Client (ephemeral) ports** are **temporary** numbers (usually high, e.g. 49152–65535) that the **client's operating system allocates** for each new connection. The server's replies are sent back to that port, so they reach the right process.
- A **socket** is the combination **IP address : port number**, e.g. `192.168.1.20:51734`. A TCP connection is identified by **two sockets**, one at each end.

:::example Worked example: two browser tabs, one server
Your laptop (`192.168.1.20`) opens two tabs on the same website (`203.0.113.80`, HTTPS):

| | Client socket (source) | Server socket (destination) |
|---|---|---|
| Tab 1 request | 192.168.1.20 : **51734** | 203.0.113.80 : **443** |
| Tab 2 request | 192.168.1.20 : **51735** | 203.0.113.80 : **443** |

The replies **swap source and destination**: tab 1's reply comes *from* 203.0.113.80:443 *to* 192.168.1.20:51734. Because each tab has its own client port, each reply reaches the correct tab even though the IP addresses are the same.
:::

### Well-known ports to learn

| Port | Protocol | Used for |
|---|---|---|
| 20, 21 | **FTP** | file transfer (21 = control/commands, 20 = data) |
| 22 | **SSH** | secure remote login and management |
| 25 | **SMTP** | sending email / transferring it between mail servers |
| 80 | **HTTP** | web pages (unencrypted) |
| 110 | **POP3** | retrieving email from a mail server |
| 443 | **HTTPS** | web pages encrypted with TLS |

## MAC addresses

- A **MAC (Media Access Control) address** is a **48-bit** (6-byte) identifier given to each **network interface card** when it is made, written as 12 hex digits, e.g. `3C:22:FB:1A:2B:3C`.
- The first 24 bits identify the **manufacturer**; the rest are a unique serial for that card.
- Used by the **link layer** to deliver frames to the right device **on the local network**: switches forward frames by MAC address.
- MAC addresses are **not** used for routing across the Internet; that is what IP addresses are for.

| | MAC address | IP address |
|---|---|---|
| Size | 48 bits | 32 bits (IPv4) / 128 bits (IPv6) |
| Assigned by | manufacturer, fixed to the NIC | network administrator or DHCP; can change |
| Layer | link | network |
| Scope | local network segment only | end to end across the Internet |
| Used by | switches | routers |

## Application-layer protocols

| Protocol | Port | Role |
|---|---|---|
| **HTTP** (Hypertext Transfer Protocol) | 80 | rules for requesting and transferring web pages and other resources between a browser and a web server (requests such as GET, POST; responses with status codes like 200 OK, 404 Not Found) |
| **HTTPS** (HTTP Secure) | 443 | HTTP sent through an encrypted **TLS** connection; the server is authenticated by its **digital certificate** (see [9.4](#/topic/9.4)) |
| **FTP** (File Transfer Protocol) | 20/21 | transferring files between a client and a server: list directories, upload, download, delete |
| **SMTP** (Simple Mail Transfer Protocol) | 25 | **sending** email from a client to its mail server, and **between** mail servers |
| **POP3** (Post Office Protocol v3) | 110 | **retrieving** email from the mail server to the client; typically downloads and then deletes it from the server |
| **SSH** (Secure Shell) | 22 | **encrypted** remote login to a computer's command line, for remote management; can also **tunnel** other protocols |

### FTP: anonymous and non-anonymous access

- **Anonymous FTP**: users log in with the username `anonymous` (and often an email address as a password), with no account of their own. Used to make **public** files available, e.g. software downloads. Access is normally **read-only** and limited to a public area.
- **Non-anonymous FTP**: users log in with their **own username and password** and get access to their own areas with the **permissions** the administrator has set (e.g. upload, rename and delete files). Used by web developers uploading their sites.
- Standard FTP sends passwords and data **unencrypted**; secure alternatives (SFTP over SSH, or FTPS) are preferred today.

## SSH: remote management and talking to other services

**SSH** opens an **encrypted connection** (on port 22) to a remote computer and gives you its **command line**, after authenticating with a password or key pair. Network administrators use it to:
- configure and **manage remote servers, routers and devices** without being physically there (including "headless" devices with no screen, e.g. a Raspberry Pi),
- start/stop services, install updates, edit configuration files, view logs,
- securely **tunnel** other traffic.

The AQA specification also wants you to know that you can use an SSH (or similar) client to **make a TCP connection to a remote port** and type **application-layer commands by hand**. That shows exactly what an application protocol is: plain text commands following agreed rules.

```text Log in to a remote server with SSH, then open a TCP connection to another service
$ ssh admin@server.example.com            # encrypted login on port 22
admin@server:~$ telnet www.example.com 80  # from the remote shell: TCP connection to port 80
```

::::tabs
:::tab HTTP (port 80)
```text Requesting a web page by hand
GET /index.html HTTP/1.1
Host: www.example.com
                                  <- blank line ends the request
HTTP/1.1 200 OK                   <- server's response line
Content-Type: text/html
...
<html> ... the page ... </html>
```
:::
:::tab SMTP (port 25)
```text Sending an email by hand
HELO client.example.com
MAIL FROM:<alice@example.com>
RCPT TO:<bob@example.org>
DATA
Subject: Meeting

See you at 3pm.
.                                  <- a full stop on its own line ends the message
QUIT
```
:::
:::tab POP3 (port 110)
```text Collecting email by hand
USER bob
PASS ********
STAT          <- number of messages and total size
LIST          <- list messages with their sizes
RETR 1        <- retrieve message 1
DELE 1        <- mark message 1 for deletion
QUIT
```
:::
::::

```python nocheck
# The same idea in Python: open a TCP socket to port 80 and send an HTTP GET command.
import socket
with socket.create_connection(("www.example.com", 80)) as s:
    print("client socket:", s.getsockname())   # e.g. ('192.168.1.20', 51734): ephemeral port
    print("server socket:", s.getpeername())   # (server IP, 80): well-known port
    s.sendall(b"GET / HTTP/1.1\r\nHost: www.example.com\r\nConnection: close\r\n\r\n")
    print(s.recv(200).decode(errors="replace"))  # HTTP/1.1 200 OK ...
```

:::trap
- **SMTP sends, POP3 retrieves.** Writing "POP3 sends email" is a classic slip.
- **SSH ≠ HTTPS.** Both are encrypted, but SSH is for remote command-line access (port 22); HTTPS is for web pages (port 443).
- Your textbook says "HTTP provides an additional layer of security". That is a typo: it is **HTTPS** that adds security (encryption via TLS).
:::

## Email servers, web servers and web browsers

:::figure How an email travels: SMTP to send and forward, POP3 to collect
<svg class="diagram" viewBox="0 0 680 180" role="img" aria-label="Alice's email client sends by SMTP to her mail server, which forwards by SMTP to Bob's mail server; Bob's client retrieves the mail by POP3">
  <defs><marker id="arr95b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <rect x="10" y="60" width="100" height="46" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="60" y="80" text-anchor="middle" stroke="none">Alice's</text><text x="60" y="96" text-anchor="middle" stroke="none">email client</text>
    <rect x="190" y="60" width="110" height="46" rx="6" fill="#6fd39a" fill-opacity="0.35"/><text x="245" y="80" text-anchor="middle" stroke="none">Alice's</text><text x="245" y="96" text-anchor="middle" stroke="none">mail server</text>
    <rect x="380" y="60" width="110" height="46" rx="6" fill="#6fd39a" fill-opacity="0.35"/><text x="435" y="80" text-anchor="middle" stroke="none">Bob's mail server</text><text x="435" y="96" text-anchor="middle" stroke="none">(stores mailbox)</text>
    <rect x="570" y="60" width="100" height="46" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="620" y="80" text-anchor="middle" stroke="none">Bob's</text><text x="620" y="96" text-anchor="middle" stroke="none">email client</text>
    <line x1="110" y1="83" x2="188" y2="83" marker-end="url(#arr95b)"/><text x="149" y="74" text-anchor="middle" stroke="none">SMTP</text>
    <line x1="300" y1="83" x2="378" y2="83" marker-end="url(#arr95b)"/><text x="339" y="74" text-anchor="middle" stroke="none">SMTP</text>
    <line x1="568" y1="83" x2="492" y2="83" marker-end="url(#arr95b)"/><text x="530" y="74" text-anchor="middle" stroke="none">POP3</text>
    <text x="530" y="125" text-anchor="middle" stroke="none" font-size="11">client requests</text>
    <text x="530" y="139" text-anchor="middle" stroke="none" font-size="11">its new mail</text>
    <text x="340" y="165" text-anchor="middle" stroke="none">Alice's server uses DNS to find Bob's mail server, then forwards the message</text>
  </g>
</svg>
:::

:::columns
**Email server**
- Runs **SMTP** to accept outgoing mail from its users' clients and **forward** it to the recipient's mail server (found using DNS).
- Accepts incoming mail by SMTP and **stores it in each user's mailbox**.
- Lets users **retrieve** mail using **POP3** (or IMAP), after checking username and password.
- Often filters **spam and malware**.
|||
**Web server**
- Stores (hosts) websites and runs 24/7, **listening** on port 80 (HTTP) and/or 443 (HTTPS).
- Receives **HTTP requests** from browsers, finds or **generates** the requested resource (running server-side scripts, querying databases), and sends an **HTTP response** with a status code and the content.
- For HTTPS, holds the site's **digital certificate** and private key.
|||
**Web browser**
- **Client** software the user interacts with.
- Takes a URL, uses **DNS** to find the server's IP address, and sends **HTTP(S) requests** (e.g. GET).
- Receives HTML, CSS, images and JavaScript, **renders** the page, requests any further resources, and **runs client-side scripts**.
- For HTTPS, **checks the server's certificate** and handles encryption.
:::

:::exam
- **"Describe the role of the transport layer"** (3–4 marks): establishes the connection / splits data into segments / adds port numbers and sequence numbers / acknowledges and re-sends lost segments / reassembles in order at the receiver.
- **"Explain encapsulation"**: each layer adds its own header (and the link layer a trailer) to the data from the layer above; the receiver removes them in reverse order.
- **"What is a socket?"**: IP address + port number; identifies one end of a connection, e.g. a specific process on a specific host.
- **"Why are well-known ports used?"**: so clients know which port to connect to for a standard service; client ports are temporary and identify the process expecting the reply.
- **Protocols**: name the protocol, its **port** and **exactly what it does** (SMTP sends/forwards; POP3 retrieves).
- **Roles of servers/browser**: say what each **receives**, **does**, and **sends back**.
:::

:::challenge
1. Open a terminal and run `netstat -an` (or `ss -tan` on Linux). Identify a connection's two sockets. Which side used a well-known port?
2. Why does the IP header stay the same across the whole journey while the Ethernet header is rebuilt at every router?
3. Research IMAP (port 143). Why do people who read email on a phone and a laptop prefer IMAP to POP3?
:::

:::recap
- TCP/IP: **Application** (right protocol) → **Transport** (segments, ports, sequence numbers, reliability) → **Network** (IP addresses, routing) → **Link** (MAC addresses, physical transmission).
- Encapsulation adds a header at each layer going down; decapsulation removes them going up.
- Socket = IP address + port. Well-known ports for servers; temporary client ports for each connection.
- Ports: 20/21 FTP, 22 SSH, 25 SMTP, 80 HTTP, 110 POP3, 443 HTTPS.
- MAC address: 48-bit NIC address used on the local link; IP address used end to end.
- Anonymous FTP = public, usually read-only; non-anonymous = own account and permissions.
- SSH: encrypted remote management; can connect to remote ports and send GET / SMTP / POP3 commands as text.
- Email server: SMTP to send/forward and store; POP3 to retrieve. Web server: answers HTTP requests. Browser: requests, renders, runs scripts.
:::

:::related
- [9.3 The Internet: structure, routing and DNS](#/topic/9.3)
- [9.4 Internet security](#/topic/9.4) — HTTPS, certificates, firewalls and ports
- [9.6 IP addressing, subnets, DHCP and NAT](#/topic/9.6)
- [9.7 Client-server, REST, WebSocket and thin/thick clients](#/topic/9.7)
:::

*/});
