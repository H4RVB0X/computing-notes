CS.registerTopic({ id: "9.2", title: "Networking: topologies, types and wireless" }, function () {/*

:::objectives
- Tell apart **physical** topology (how devices are wired) and **logical** topology (how data actually flows).
- Explain how a **physical star** and a **logical bus** work, including collisions and **CSMA/CD**, and compare them.
- Explain how a **hub** makes a star behave like a bus and how a **switch** stops it doing so.
- Explain **peer-to-peer** and **client-server** networking and say where each is used.
- Explain the purpose of **WiFi**, the components needed, the purpose of the **SSID** and how wireless networks are secured.
- Explain **CSMA/CA** with and without **RTS/CTS**, and the **hidden node** problem it solves.
:::

:::quick At a glance
- **Physical topology** = the cabling layout. **Logical topology** = the path data takes between devices.
- **Physical star**: every device has its **own cable** to a central **switch** (or hub). A cable fault only affects one device; the central device is a single point of failure.
- **Logical bus**: every frame reaches **every** device on a shared medium; each device checks the **destination MAC address**. Only one device can transmit at once, so **collisions** happen and **CSMA/CD** is used.
- A star wired to a **hub** is physically a star but **logically a bus**. A **switch** learns which MAC address is on which port and forwards frames only there, so there are **no collisions**.
- **Client-server**: a central **server** provides resources and security to **clients**. **Peer-to-peer**: every computer is **equal**, acting as both client and server.
- **WiFi**: a wireless LAN using radio waves (IEEE 802.11). Needs a **wireless network adapter** in each device and a **wireless access point (WAP)**.
- **SSID**: the name identifying a wireless network (up to **32 characters**). Security: **WPA2/WPA3 encryption**, **SSID broadcast disabled**, **MAC address allow list**.
- **CSMA/CA**: listen; if busy wait a **random back-off**; if idle transmit and wait for an **ACK**. **RTS/CTS** reserves the channel to defeat **hidden nodes**.
:::

:::keyterms
Topology :: The arrangement of the devices and connections in a network. :: The "map" of a network.
Physical topology :: The physical layout of the cabling and devices in a network. :: Where the wires actually go.
Logical topology :: The way data flows between the devices on a network, regardless of how they are cabled. :: Who actually hears each message.
Physical star topology :: Each device is connected by its own dedicated cable to a central device such as a switch or hub. :: Spokes on a wheel.
Logical bus topology :: All devices share a single communication medium, so every transmission reaches every device and only one device can transmit at a time. :: Everyone on one party line.
CSMA/CD :: Carrier Sense Multiple Access with Collision Detection: a device listens before transmitting, detects collisions while transmitting, sends a jam signal and retries after a random delay. :: Wired-bus etiquette: listen, talk, and if you clash, both back off.
Switch :: A device at the centre of a star network that learns the MAC address on each port and forwards each frame only to the port of its destination. :: A smart postroom.
Client-server network :: A network in which one or more central servers provide resources and services, and manage security, for client computers that request them. :: Customers and a shop.
Peer-to-peer network :: A network with no dedicated server, in which every computer has equal status and can act as both client and server. :: Friends lending each other things.
WiFi :: A wireless local area network technology, based on the IEEE 802.11 standards, that uses radio waves to connect devices. :: Network without wires.
Wireless access point (WAP) :: A device that allows wireless devices to connect to a wired network, acting as the central point of the wireless network. :: The base station everyone's radio talks to.
SSID :: Service Set Identifier: a locally unique name, of up to 32 characters, that identifies a wireless network. :: The WiFi network's name.
CSMA/CA :: Carrier Sense Multiple Access with Collision Avoidance: a device listens to check the channel is idle before transmitting, waiting a random back-off time if it is busy, and expects an acknowledgement. :: Wireless etiquette: listen, wait your turn, confirm it arrived.
RTS/CTS :: Request to Send / Clear to Send: an optional extension to CSMA/CA in which a device asks the access point for permission to transmit, and the CTS reply tells all other devices to stay silent. :: Put your hand up and wait to be picked.
:::

## Physical v logical topology

A network's **topology** is its arrangement. AQA wants you to see that there are two different questions:

- **Physical topology**: how are the cables (or radio links) actually laid out?
- **Logical topology**: when one device sends a frame, which devices does it actually reach, and how do they share the medium?

The two do not have to match. The classic exam case is a network that is **wired as a star** but **behaves as a bus**.

:::figure Left: a physical bus (one shared backbone). Right: a physical star (each device has its own cable to a central switch).
<svg class="diagram" viewBox="0 0 680 260" role="img" aria-label="Physical bus topology with terminators and a physical star topology with a central switch">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <text x="165" y="22" text-anchor="middle" stroke="none" font-size="15" font-weight="bold">Physical bus</text>
    <line x1="25" y1="130" x2="305" y2="130" stroke-width="4"/>
    <rect x="15" y="120" width="10" height="20" fill="#ff9f7c" fill-opacity="0.6"/>
    <rect x="305" y="120" width="10" height="20" fill="#ff9f7c" fill-opacity="0.6"/>
    <line x1="70" y1="130" x2="70" y2="80"/><line x1="160" y1="130" x2="160" y2="80"/><line x1="250" y1="130" x2="250" y2="80"/>
    <line x1="115" y1="130" x2="115" y2="180"/><line x1="205" y1="130" x2="205" y2="180"/>
    <rect x="45" y="55" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="70" y="72" text-anchor="middle" stroke="none">A</text>
    <rect x="135" y="55" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="160" y="72" text-anchor="middle" stroke="none">B</text>
    <rect x="225" y="55" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="250" y="72" text-anchor="middle" stroke="none">C</text>
    <rect x="90" y="180" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="115" y="197" text-anchor="middle" stroke="none">D</text>
    <rect x="180" y="180" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="205" y="197" text-anchor="middle" stroke="none">E</text>
    <text x="165" y="235" text-anchor="middle" stroke="none" font-size="12">shared backbone cable, terminator at each end</text>
    <text x="505" y="22" text-anchor="middle" stroke="none" font-size="15" font-weight="bold">Physical star</text>
    <line x1="505" y1="130" x2="430" y2="65"/><line x1="505" y1="130" x2="580" y2="65"/><line x1="505" y1="130" x2="400" y2="160"/><line x1="505" y1="130" x2="610" y2="160"/><line x1="505" y1="130" x2="505" y2="200"/>
    <rect x="460" y="113" width="90" height="34" rx="6" fill="#6fd39a" fill-opacity="0.45"/><text x="505" y="135" text-anchor="middle" stroke="none">switch</text>
    <rect x="405" y="45" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="430" y="62" text-anchor="middle" stroke="none">A</text>
    <rect x="555" y="45" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="580" y="62" text-anchor="middle" stroke="none">B</text>
    <rect x="360" y="150" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="385" y="167" text-anchor="middle" stroke="none">C</text>
    <rect x="600" y="150" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="625" y="167" text-anchor="middle" stroke="none">D</text>
    <rect x="480" y="200" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.3"/><text x="505" y="217" text-anchor="middle" stroke="none">E</text>
    <text x="505" y="250" text-anchor="middle" stroke="none" font-size="12">one dedicated cable per device</text>
  </g>
</svg>
:::

## The logical bus and CSMA/CD

On a **bus**, all devices share one medium. Whatever one device transmits travels to **every** device.

- Each frame carries a **source** and **destination MAC address**. Every device reads the destination address; only the matching device keeps the frame, the rest ignore it.
- Only **one** device can successfully transmit at a time. If two transmit together, the signals interfere: a **collision**. Both frames are corrupted and must be re-sent.
- The more devices and the more traffic, the more collisions, so **performance falls under heavy load**.
- Security is weaker: every device physically receives every frame, so eavesdropping is easy.

To share the medium fairly, wired Ethernet on a bus uses **CSMA/CD**.

:::steps CSMA/CD (Carrier Sense Multiple Access with Collision Detection)
1. **Carrier sense**: the device with data listens to check whether the medium is in use.
2. If it is **busy**, keep listening until it is **idle**, then transmit.
3. **Collision detection**: while transmitting, keep monitoring the medium. If what it hears differs from what it sent, a collision has happened.
4. On a collision, stop and send a short **jam signal** so every device knows a collision occurred.
5. Wait a **random** amount of time (a back-off), then start again from step 1. The randomness makes it unlikely the same two devices clash again.
:::

## The physical star, hubs and switches

In a **physical star**, each device has its own cable to a central device. What the network behaves like *logically* depends on that central device.

:::figure The same physical star behaves very differently with a hub (logical bus) and a switch (frames go only to the destination)
<svg class="diagram" viewBox="0 0 680 250" role="img" aria-label="A hub repeating a frame from A to every port compared with a switch forwarding the frame only to C">
  <defs><marker id="arr92" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor">
    <text x="170" y="22" text-anchor="middle" font-size="15" font-weight="bold">Hub: physical star, logical bus</text>
    <rect x="125" y="105" width="90" height="34" rx="6" fill="#ff9f7c" fill-opacity="0.4" stroke="currentColor"/><text x="170" y="127" text-anchor="middle">hub</text>
    <rect x="20" y="45" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.4" stroke="currentColor"/><text x="45" y="62" text-anchor="middle">A</text>
    <rect x="270" y="45" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="295" y="62" text-anchor="middle">B</text>
    <rect x="20" y="180" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="45" y="197" text-anchor="middle">C</text>
    <rect x="270" y="180" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="295" y="197" text-anchor="middle">D</text>
    <g stroke="currentColor" stroke-width="2">
      <line x1="70" y1="60" x2="125" y2="110" marker-end="url(#arr92)"/>
      <line x1="215" y1="110" x2="268" y2="62" marker-end="url(#arr92)"/>
      <line x1="125" y1="135" x2="72" y2="185" marker-end="url(#arr92)"/>
      <line x1="215" y1="135" x2="268" y2="185" marker-end="url(#arr92)"/>
    </g>
    <text x="170" y="235" text-anchor="middle" font-size="12">A→C is repeated to B, C and D; collisions possible</text>
    <text x="510" y="22" text-anchor="middle" font-size="15" font-weight="bold">Switch: frame only to its destination</text>
    <rect x="465" y="105" width="90" height="34" rx="6" fill="#6fd39a" fill-opacity="0.45" stroke="currentColor"/><text x="510" y="127" text-anchor="middle">switch</text>
    <rect x="360" y="45" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.4" stroke="currentColor"/><text x="385" y="62" text-anchor="middle">A</text>
    <rect x="610" y="45" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="635" y="62" text-anchor="middle">B</text>
    <rect x="360" y="180" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.4" stroke="currentColor"/><text x="385" y="197" text-anchor="middle">C</text>
    <rect x="610" y="180" width="50" height="25" rx="4" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor"/><text x="635" y="197" text-anchor="middle">D</text>
    <g stroke="currentColor">
      <line x1="410" y1="60" x2="465" y2="110" stroke-width="2" marker-end="url(#arr92)"/>
      <line x1="465" y1="135" x2="412" y2="185" stroke-width="2" marker-end="url(#arr92)"/>
      <line x1="555" y1="110" x2="610" y2="60" stroke-opacity="0.3" stroke-dasharray="4 4"/>
      <line x1="555" y1="135" x2="610" y2="185" stroke-opacity="0.3" stroke-dasharray="4 4"/>
    </g>
    <text x="510" y="235" text-anchor="middle" font-size="12">switch looks up C's MAC address and uses only C's port</text>
  </g>
</svg>
:::

- **Hub**: has no idea what the bits mean. It simply **repeats every incoming signal out of every other port**. So every device still receives every frame and only one can transmit at a time: the network is a **physical star but a logical bus**, with collisions and CSMA/CD.
- **Switch**: reads the **source MAC address** of each incoming frame and records which port that address is on, building a **MAC address table**. When a frame arrives it looks up the **destination MAC address** and sends the frame **only out of that port**. (If the address is not yet in the table, it sends the frame out of all ports, like a hub, until it learns.)
- Each device has its own link to the switch, and modern switches are full duplex and buffer frames, so **collisions do not occur**. Several pairs of devices can communicate at the same time.

:::note About "switched Ethernet acts like a bus"
Your slides say switched Ethernet is "wired as a star but acts like a bus". The part that is bus-like is the **protocol**: Ethernet was designed for a shared bus, so every frame still carries destination and source MAC addresses and devices still ignore frames not addressed to them. The part that is **not** bus-like is the data flow: a switch delivers each frame only to its destination, removing collisions. In the exam, the safe example of "physical star, logical bus" is a **star built around a hub**.
:::

### Comparing a physical star with a logical bus

| | Physical star | Logical bus |
|---|---|---|
| What it describes | how devices are cabled: each to a central switch/hub | how data flows: every transmission reaches every device on a shared medium |
| Who receives a frame | with a switch, only the destination device | every device; each checks the destination MAC address |
| Transmitting | with a switch, several pairs at once | only one device at a time |
| Collisions | none with a switch | possible; handled by CSMA/CD |
| Performance under load | consistent; each device has a dedicated link | falls as traffic and collisions increase |
| Effect of a cable failure | only the device on that cable is affected | on a physical bus, a backbone break stops the whole network |
| Single point of failure | the central switch/hub | the shared backbone cable (physical bus) |
| Security | harder to eavesdrop (switch) | any device can read all traffic |
| Cost | more cable plus a central device | a physical bus uses the least cable |
| Fault finding | easy; test each link separately | harder on a single backbone |

:::trap
- **Physical** is about cables, **logical** is about data flow. A question that says "differentiate" wants you to say this, then give the hub example.
- A **switch** prevents collisions; a **hub** does not. Don't say "a star never has collisions" without naming the switch.
- **CSMA/CD** is for wired (bus) Ethernet. **CSMA/CA** is for wireless. Mixing the letters is a very common lost mark.
- The central device in a star is a **single point of failure**: if the switch fails, the whole network stops, even though a single cable fault doesn't.
:::

## Peer-to-peer and client-server networking

:::columns
**Client-server**
- One or more central **servers** provide resources and services: files, printing, email, web pages, databases, authentication.
- **Clients** request services; the server **responds**.
- **Security, user accounts, access rights and backups are managed centrally**.
- Servers are usually powerful, always on and can be **specialised** (file server, print server, web server…).
- Used by: schools, businesses, websites, online games, banking, email, cloud services.
|||
**Peer-to-peer (P2P)**
- **No dedicated server**: every computer (peer) has **equal status** and can act as both client and server.
- Each peer **shares its own resources** (files, printers, processing) and each user decides what to share.
- **No central management**: security and backups are handled **individually** on each machine.
- Cheap and simple: no server to buy or administer.
- Used by: small home networks, file sharing (e.g. BitTorrent, where a file is downloaded in pieces from many peers at once), some video calling and distributed computing.
:::

| | Client-server | Peer-to-peer |
|---|---|---|
| Central control | yes, from the server | none |
| Security | strong, central accounts and access rights | weaker, depends on each user |
| Backups | central and automatable | each peer backs up its own data |
| Cost | servers and a network manager cost money | cheap |
| Scalability | scales to thousands of clients (add servers) | suits small networks; large P2P file sharing scales because peers add capacity |
| Single point of failure | yes, if the server fails clients lose the service | no single point; others continue if one peer is off |
| Performance | server can become a bottleneck under heavy load | a peer slows down when others use its resources |

:::trap
"Peer-to-peer means there's no network hardware" is wrong: peers are still connected by switches or WiFi. The difference is the **roles** of the computers, not the cabling. Similarly, client and server are **roles** (software processes): one machine can be both. See [9.7](#/topic/9.7).
:::

## Wireless networking

### Purpose of WiFi

**WiFi** is a **wireless local area network (WLAN)** technology based on the **IEEE 802.11** standards. It uses **radio waves** (commonly in the 2.4 GHz and 5 GHz bands) to connect devices to a network without cables.

- Devices can **move around** and still be connected (laptops, phones, handheld scanners).
- No cabling to install, so it is **cheaper and quicker** to add devices and works where cables can't go.
- It is the usual way for portable devices to reach a LAN and, through it, the Internet.

### Components needed

| Component | Job |
|---|---|
| **Wireless network adapter** (wireless NIC) | in each device; converts data into radio signals and back. Has a unique **MAC address**. |
| **Wireless access point (WAP)** | the central point of the wireless network; connects wireless devices to each other and to the **wired** network |
| **Router** (often combined with the WAP in a home "wireless router") | connects the LAN to other networks, e.g. the Internet via the ISP |

A home "router" is really several devices in one box: WAP, switch, router, often a modem and a firewall.

### The SSID

- The **SSID (Service Set Identifier)** is the **name that identifies a particular wireless network**, so devices connect to the right one when several networks overlap in the same place.
- It is up to **32 characters (32 bytes)** long and is case sensitive.
- The WAP normally **broadcasts** its SSID in regular beacon frames so devices can list nearby networks. A device must use the correct SSID to join.

:::trap
Your notes say the SSID is "a 32-bit character code". That is wrong: an SSID can be **up to 32 characters (bytes)**, i.e. up to 256 bits. Write "up to 32 characters".
:::

### How wireless networks are secured

Radio signals spread beyond the walls, so anyone within range can try to listen in or connect. Layers of protection are used:

- **Strong encryption: WPA2 or WPA3** (WiFi Protected Access). Data sent over the air is encrypted (WPA2 uses AES), so intercepted frames can't be read. Use a long, strong passphrase. The older **WEP** is easily cracked and should never be used.
- **Disable SSID broadcast**: the network doesn't advertise its name, so casual users don't see it; to join you must already know the SSID.
- **MAC address filtering (allow list / whitelist)**: the WAP only accepts devices whose MAC addresses are on an approved list.
- Also: change the **default admin password** of the router, keep its **firmware updated**, and use a **firewall**.

:::trap
Hiding the SSID and MAC filtering are **weak on their own**. The SSID still appears in frames when devices connect, and MAC addresses can be **spoofed** (copied). **Encryption (WPA2/WPA3)** is the measure that actually protects the data. In a "how secure is it?" question, say this.
:::

### Why wireless can't use collision detection

On a cable, a device can listen while it transmits and notice a collision. A radio **can't easily hear other signals while it is transmitting** (its own signal drowns them out), and some devices may be **out of range of each other** anyway. So wireless networks **avoid** collisions instead of detecting them: **CSMA/CA**.

### CSMA/CA

:::steps CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)
1. A device with a frame to send **listens** to check whether the channel is idle (no other device is transmitting).
2. If the channel is **busy**, it waits a **random back-off time** and then listens again. The back-off counts down only while the channel is idle.
3. When the channel is **idle**, it transmits the frame (with RTS/CTS, it first asks permission; see below).
4. The receiver checks the frame and returns an **acknowledgement (ACK)**.
5. If **no ACK** arrives, the sender assumes a collision/corruption, waits a random back-off and tries again.
:::

### The hidden node problem

:::figure Hidden nodes: A and C are both in range of the WAP but not of each other
<svg class="diagram" viewBox="0 0 680 270" role="img" aria-label="Device A and device C each have a radio range that reaches the access point in the middle but not each other">
  <g font-family="inherit" font-size="13" fill="currentColor">
    <ellipse cx="190" cy="130" rx="175" ry="105" fill="#7c9aff" fill-opacity="0.15" stroke="currentColor" stroke-dasharray="5 4"/>
    <ellipse cx="490" cy="130" rx="175" ry="105" fill="#ff9f7c" fill-opacity="0.15" stroke="currentColor" stroke-dasharray="5 4"/>
    <circle cx="190" cy="130" r="22" fill="#7c9aff" fill-opacity="0.5" stroke="currentColor"/><text x="190" y="135" text-anchor="middle">A</text>
    <circle cx="490" cy="130" r="22" fill="#ff9f7c" fill-opacity="0.5" stroke="currentColor"/><text x="490" y="135" text-anchor="middle">C</text>
    <rect x="310" y="112" width="60" height="36" rx="6" fill="#6fd39a" fill-opacity="0.5" stroke="currentColor"/><text x="340" y="135" text-anchor="middle">WAP</text>
    <text x="110" y="60" text-anchor="middle">A's range</text>
    <text x="570" y="60" text-anchor="middle">C's range</text>
    <text x="340" y="258" text-anchor="middle">A senses the channel as idle (it can't hear C), so both transmit to the WAP and collide there</text>
  </g>
</svg>
:::

Carrier sense only works for signals you can **hear**. A and C both find the channel idle, both transmit, and the frames collide **at the WAP**. Neither sender detects it; they only find out when no ACK arrives.

### RTS/CTS: the fix

**RTS/CTS** is an **optional** extension to CSMA/CA:

1. When the channel is idle, the sender transmits a short **Request to Send (RTS)** to the WAP, stating how long it needs.
2. If the WAP is free, it broadcasts **Clear to Send (CTS)**. Because the WAP is in range of **everyone**, hidden nodes hear the CTS too.
3. Every other device that hears the CTS **stays silent** for the stated time; only the device that sent the RTS transmits.
4. The sender transmits its frame and the WAP replies with an ACK.
5. If no CTS comes back, the sender waits a random back-off and tries again.

The cost: RTS and CTS are extra messages, an **overhead** that slows things down slightly, so RTS/CTS is often used only for larger frames.

:::figure CSMA/CA as a flowchart; the dashed box is only used when RTS/CTS is enabled
<svg class="diagram" viewBox="0 0 680 550" role="img" aria-label="Flowchart of CSMA/CA: listen, if busy wait random back-off, if idle optionally send RTS and wait for CTS, transmit, wait for ACK">
  <defs><marker id="arr92b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="250" y="12" width="180" height="34" rx="17" fill="#7c9aff" fill-opacity="0.3"/><text x="340" y="34" text-anchor="middle" stroke="none">Frame ready to send</text>
    <line x1="340" y1="46" x2="340" y2="68" marker-end="url(#arr92b)"/>
    <rect x="250" y="70" width="180" height="34" rx="4" fill="#7c9aff" fill-opacity="0.15"/><text x="340" y="92" text-anchor="middle" stroke="none">Listen to the channel</text>
    <line x1="340" y1="104" x2="340" y2="126" marker-end="url(#arr92b)"/>
    <polygon points="340,128 425,160 340,192 255,160" fill="#c58cff" fill-opacity="0.25"/><text x="340" y="165" text-anchor="middle" stroke="none">Channel idle?</text>
    <line x1="425" y1="160" x2="468" y2="160" marker-end="url(#arr92b)"/><text x="445" y="152" stroke="none">No</text>
    <rect x="470" y="143" width="190" height="34" rx="4" fill="#ff9f7c" fill-opacity="0.3"/><text x="565" y="165" text-anchor="middle" stroke="none">Wait random back-off</text>
    <polyline points="565,143 565,87 432,87" fill="none" marker-end="url(#arr92b)"/>
    <rect x="232" y="203" width="216" height="140" rx="6" fill="none" stroke-dasharray="6 4"/>
    <text x="120" y="270" text-anchor="middle" stroke="none" font-size="12">only with</text>
    <text x="120" y="286" text-anchor="middle" stroke="none" font-size="12">RTS/CTS</text>
    <line x1="340" y1="192" x2="340" y2="213" marker-end="url(#arr92b)"/><text x="348" y="207" stroke="none">Yes</text>
    <rect x="250" y="215" width="180" height="34" rx="4" fill="#7c9aff" fill-opacity="0.15"/><text x="340" y="237" text-anchor="middle" stroke="none">Send RTS to the WAP</text>
    <line x1="340" y1="249" x2="340" y2="266" marker-end="url(#arr92b)"/>
    <polygon points="340,268 425,300 340,332 255,300" fill="#c58cff" fill-opacity="0.25"/><text x="340" y="305" text-anchor="middle" stroke="none">CTS received?</text>
    <polyline points="425,300 565,300 565,179" fill="none" marker-end="url(#arr92b)"/><text x="445" y="292" stroke="none">No</text>
    <line x1="340" y1="332" x2="340" y2="353" marker-end="url(#arr92b)"/><text x="348" y="348" stroke="none">Yes</text>
    <polyline points="255,160 200,160 200,372 248,372" fill="none" stroke-dasharray="4 3" marker-end="url(#arr92b)"/>
    <text x="150" y="390" text-anchor="middle" stroke="none" font-size="12">without RTS/CTS</text>
    <rect x="250" y="355" width="180" height="34" rx="4" fill="#6fd39a" fill-opacity="0.35"/><text x="340" y="377" text-anchor="middle" stroke="none">Transmit the frame</text>
    <line x1="340" y1="389" x2="340" y2="406" marker-end="url(#arr92b)"/>
    <polygon points="340,408 425,440 340,472 255,440" fill="#c58cff" fill-opacity="0.25"/><text x="340" y="445" text-anchor="middle" stroke="none">ACK received?</text>
    <polyline points="425,440 565,440 565,302" fill="none"/><text x="445" y="432" stroke="none">No</text>
    <line x1="340" y1="472" x2="340" y2="493" marker-end="url(#arr92b)"/><text x="348" y="488" stroke="none">Yes</text>
    <rect x="250" y="495" width="180" height="34" rx="17" fill="#6fd39a" fill-opacity="0.35"/><text x="340" y="517" text-anchor="middle" stroke="none">Done</text>
  </g>
</svg>
:::

:::example Worked example: describing CSMA/CA with RTS/CTS (6 marks)
**Q:** Explain how CSMA/CA with RTS/CTS is used by a laptop to send data to a wireless access point.

1. The laptop **listens** to check whether any other device is transmitting on the channel. *(1)*
2. If the channel is **busy**, it waits a **random period of time** before checking again. *(1)*
3. When the channel is **idle**, the laptop sends a **Request to Send (RTS)** to the WAP. *(1)*
4. The WAP replies with **Clear to Send (CTS)** if it is free; the CTS is received by all devices in range of the WAP. *(1)*
5. Other devices hearing the CTS **do not transmit**, so the laptop transmits its data. *(1)*
6. The WAP sends an **acknowledgement**; if no ACK (or no CTS) is received the laptop waits a random time and tries again. *(1)*
:::

:::exam
- **"Differentiate between physical star and logical bus"**: physical = cabling layout, each device on its own cable to a central device; logical bus = all devices receive all data on a shared medium, one transmits at a time. Example: a star with a hub is a physical star, logical bus.
- **"Explain how a switch…"**: learns MAC addresses from the source address of frames; looks up destination MAC; forwards only to that port; so no collisions/better security/better performance.
- **CSMA/CA (4–6 marks)**: listen → if busy random wait → if idle (RTS → CTS) → transmit → ACK → if no ACK, back off and resend. Always mention the **random** back-off and the **acknowledgement**.
- **"Why is RTS/CTS used?"**: to overcome the **hidden node problem**: devices out of range of each other can't sense each other's transmissions, but all can hear the WAP's CTS.
- **Wireless security**: name the measure **and** say how it helps; for higher marks evaluate (SSID hiding and MAC filtering can be bypassed; WPA2/WPA3 encryption is the strongest).
- **P2P v client-server**: compare like with like (security, management, cost, backups, single point of failure).
:::

:::challenge
1. A switch receives a frame for a MAC address it has never seen. What does it do, and how does it learn where that device is for next time?
2. Why does a random back-off work better than every device waiting a fixed time after the channel becomes idle?
3. A café offers free WiFi with no password. Even with WPA3 off, why might a website login still be safe? (Think about HTTPS in [9.4](#/topic/9.4).)
:::

:::recap
- Physical topology = cabling; logical topology = data flow. A star wired to a **hub** is a physical star but a **logical bus**.
- Logical bus: every device receives every frame, one transmits at a time, collisions → **CSMA/CD** (listen, transmit, detect, jam, random back-off).
- A **switch** learns MAC addresses and forwards frames only to their destination port: no collisions, more secure, consistent performance.
- Client-server: central servers, central security/backups, single point of failure. P2P: equal peers, cheap, no central control.
- WiFi = wireless LAN (IEEE 802.11); needs wireless adapters and a **WAP** (plus router for the Internet). **SSID** = network name, up to 32 characters.
- Secure WiFi with **WPA2/WPA3**, disabled SSID broadcast and a **MAC allow list**; encryption is the strong one.
- **CSMA/CA**: listen, random back-off if busy, transmit, ACK. **RTS/CTS** defeats the **hidden node** problem at the cost of overhead.
:::

:::related
- [9.1 Communication methods and basics](#/topic/9.1)
- [9.5 TCP/IP, protocols, ports and sockets](#/topic/9.5) — MAC addresses and the link layer
- [9.7 Client-server, REST, WebSocket and thin/thick clients](#/topic/9.7)
- [9.4 Internet security](#/topic/9.4)
:::

*/});
