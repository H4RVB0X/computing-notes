CS.registerTopic({ id: "9.6", title: "IP addressing, subnets, DHCP and NAT" }, function () {/*

:::objectives
- Explain that an IP address is split into a **network identifier** and a **host identifier**.
- Use a **subnet mask** and a bitwise **AND** to find the network identifier, and decide whether two devices are on the **same subnet**.
- Read and write **CIDR** (slash) notation and work out how many hosts a subnet can hold.
- Explain why **IPv6** was introduced and how it differs from **IPv4**.
- Distinguish **routable (public)** and **non-routable (private)** IP addresses and recognise the private ranges.
- Explain the purpose and steps of **DHCP**, the basic concept of **NAT** and why it is used, and the concept of **port forwarding** and why it is used.
:::

:::quick At a glance
- An IPv4 address is **32 bits**, written as four denary octets, e.g. `192.168.1.200`. The left part is the **network ID**, the right part the **host ID**.
- The **subnet mask** has 1s over the network ID and 0s over the host ID, e.g. `255.255.255.0` = 24 ones. **IP AND mask = network ID**.
- Two devices are on the **same subnet** if (IP AND mask) gives the **same result** for both: they can talk directly. Otherwise traffic goes via the **router (default gateway)**.
- **CIDR**: `192.168.1.0/24` means the first **24 bits** are the network ID. Usable hosts = **2<sup>host bits</sup> − 2**.
- **IPv6**: **128-bit** addresses (≈ 3.4 × 10<sup>38</sup>) introduced because IPv4's ~4.3 billion addresses have **run out**.
- **Private (non-routable)** ranges: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. Routers on the Internet won't forward them. **Public (routable)** addresses are globally unique.
- **DHCP** automatically gives devices an IP address, subnet mask, gateway and DNS server: **Discover, Offer, Request, Acknowledge (DORA)**.
- **NAT**: the router swaps private source addresses for its **public** address (and tracks ports) so many devices share one public IP. **Port forwarding**: incoming traffic on a chosen port is sent to a particular internal device, so it can act as a server.
:::

:::keyterms
Network identifier :: The part of an IP address that identifies the network (subnet) the host is on; it is the same for every device on that network. :: The street name.
Host identifier :: The part of an IP address that identifies a particular device on its network. :: The house number.
Subnet mask :: A 32-bit value with 1s in the network ID positions and 0s in the host ID positions; ANDing it with an IP address gives the network identifier. :: A stencil that blanks out the host part.
Subnet :: A logical subdivision of a network in which all devices share the same network identifier. :: One street of a town.
CIDR notation :: Writing an address followed by a slash and the number of network ID bits, e.g. 192.168.1.0/24. :: Short-hand for the mask.
IPv4 :: Version 4 of the Internet Protocol, using 32-bit addresses (about 4.3 billion). :: The original, now-exhausted numbering.
IPv6 :: Version 6 of the Internet Protocol, using 128-bit addresses written as eight groups of four hex digits. :: The enormous new numbering.
Routable (public) IP address :: A globally unique IP address, allocated via an Internet registry, that can be reached across the Internet. :: An address the whole world can deliver to.
Non-routable (private) IP address :: An address from a reserved private range, used only within a local network; Internet routers will not forward packets to or from it. :: An internal extension number.
DHCP :: Dynamic Host Configuration Protocol: automatically allocates an IP address and other network configuration to a device from a pool, for a limited lease time. :: The network hands you an address when you join.
NAT :: Network Address Translation: a router replaces the private IP address (and port) of outgoing packets with its own public IP address (and a port), recording the mapping so replies can be returned to the right device. :: Everyone in the house shares one front door.
Port forwarding :: A router setting that sends all incoming traffic arriving on a particular port of its public IP address to a specified device (private IP address and port) on the internal network. :: A standing instruction: "parcels for flat 80 go to this room".
:::

## Network ID and host ID

An IPv4 address is **32 bits**, written in **dotted decimal**: four 8-bit **octets** converted to denary, each 0–255.

The bits are split into two parts:
- the **network identifier** (left-hand bits): the same for every device on the same network,
- the **host identifier** (right-hand bits): different for each device on that network.

:::figure 192.168.1.200 with a /26 mask: the first 26 bits are the network ID, the last 6 the host ID
<svg class="diagram" viewBox="0 0 680 170" role="img" aria-label="The 32 bits of 192.168.1.200 split into 26 network bits and 6 host bits">
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="20" y="50" width="520" height="40" fill="#7c9aff" fill-opacity="0.3"/>
    <rect x="540" y="50" width="120" height="40" fill="#ff9f7c" fill-opacity="0.4"/>
    <text x="280" y="76" text-anchor="middle" stroke="none" font-family="monospace" font-size="16">11000000.10101000.00000001.11</text>
    <text x="600" y="76" text-anchor="middle" stroke="none" font-family="monospace" font-size="16">001000</text>
    <text x="280" y="38" text-anchor="middle" stroke="none" font-weight="bold">network ID (26 bits)</text>
    <text x="600" y="38" text-anchor="middle" stroke="none" font-weight="bold">host ID (6 bits)</text>
    <text x="340" y="118" text-anchor="middle" stroke="none" font-family="monospace" font-size="15">mask 11111111.11111111.11111111.11 000000 = 255.255.255.192</text>
    <text x="340" y="152" text-anchor="middle" stroke="none">The boundary doesn't have to fall between octets</text>
  </g>
</svg>
:::

**Why split it?** Routers only need to look at the **network ID** to get a packet to the right network; only the final router needs the host ID. And a device can tell instantly whether a destination is **on its own network** (send directly) or **elsewhere** (send to the router).

## Subnet masks and the AND operation

A **subnet mask** is 32 bits: a run of **1s** covering the network ID followed by **0s** covering the host ID.

Recall the AND truth table: the result bit is 1 only if **both** bits are 1. So:
- where the mask is **1**, the IP address bit **passes through** unchanged,
- where the mask is **0**, the result is **0**: the host bits are wiped out.

**IP address AND subnet mask = network identifier.**

:::example Worked example 1: same subnet? (/24)
Sender `120.176.134.32`, receiver `120.176.134.75`, mask `255.255.255.0`.

| | Octet 1 | Octet 2 | Octet 3 | Octet 4 |
|---|---|---|---|---|
| Sender 120.176.134.32 | 01111000 | 10110000 | 10000110 | 00100000 |
| Mask 255.255.255.0 | 11111111 | 11111111 | 11111111 | 00000000 |
| **Sender AND mask** | **01111000** | **10110000** | **10000110** | **00000000** |
| Receiver 120.176.134.75 | 01111000 | 10110000 | 10000110 | 01001011 |
| Mask | 11111111 | 11111111 | 11111111 | 00000000 |
| **Receiver AND mask** | **01111000** | **10110000** | **10000110** | **00000000** |

Both give **120.176.134.0**, so they are on the **same subnet** and can communicate directly.

Check the first octet carefully: 120 = 64 + 32 + 16 + 8 = **01111000**, and 01111000 AND 11111111 = **01111000** (still 120).
:::

:::trap
Your school slide works this exact example but writes the result's first octet as `01110000` (= 112). That's an arithmetic slip: ANDing with 11111111 **never changes** a bit, so the result is **01111000** (= 120). In an exam, an octet ANDed with 255 is copied unchanged and an octet ANDed with 0 becomes 0. Only a "partial" octet (like 192 or 240) needs bit-by-bit work.
:::

:::example Worked example 2: a mask that splits an octet (/26)
Mask `255.255.255.192` (/26). Are `192.168.1.200` and `192.168.1.100` on the same subnet?

The first three octets are ANDed with 255, so they stay `192.168.1`. Only the last octet needs work (192 = 11000000):

| | Last octet (binary) | Denary |
|---|---|---|
| 200 | 11001000 | |
| mask 192 | 11000000 | |
| **200 AND 192** | **11000000** | **192** |
| 100 | 01100100 | |
| mask 192 | 11000000 | |
| **100 AND 192** | **01000000** | **64** |

Network IDs: **192.168.1.192** and **192.168.1.64**: **different** subnets. A packet between them must go through a router.
:::

{{trace:9.6-1}}

::::tabs
:::tab Python
```python
def to_binary(dotted):
    return ".".join(format(int(octet), "08b") for octet in dotted.split("."))

def network_id(ip, mask):
    return ".".join(str(int(a) & int(m)) for a, m in zip(ip.split("."), mask.split(".")))

def same_subnet(ip1, ip2, mask):
    return network_id(ip1, mask) == network_id(ip2, mask)

print(to_binary("120.176.134.32"))            # 01111000.10110000.10000110.00100000
print(network_id("120.176.134.32", "255.255.255.0"))   # 120.176.134.0
print(same_subnet("120.176.134.32", "120.176.134.75", "255.255.255.0"))   # True
print(network_id("192.168.1.200", "255.255.255.192"))  # 192.168.1.192
print(network_id("192.168.1.100", "255.255.255.192"))  # 192.168.1.64
print(same_subnet("192.168.1.200", "192.168.1.100", "255.255.255.192"))  # False
```
:::
:::tab AQA pseudocode
```pseudocode
SUBROUTINE networkID(ip, mask)
    FOR i ← 0 TO 3
        net[i] ← ip[i] AND mask[i]
    ENDFOR
    RETURN net
ENDSUBROUTINE

IF networkID(ipA, mask) = networkID(ipB, mask) THEN
    OUTPUT "Same subnet: send directly"
ELSE
    OUTPUT "Different subnet: send to default gateway"
ENDIF
```
:::
::::

{{tool:subnet-calculator}}

### What the device does with the answer

1. A device wants to send to a destination IP address.
2. It ANDs **its own** IP and the **destination** IP with **its subnet mask**.
3. **Same result** → destination is on the local network → deliver directly (via the switch, using the destination's MAC address).
4. **Different result** → destination is on another network → send the frame to the **default gateway** (router), which forwards it on.

## CIDR notation and counting hosts

Writing `255.255.255.192` is clumsy, so **CIDR (Classless Inter-Domain Routing)** notation puts a slash and the **number of network bits** after the address: `192.168.1.192/26`.

| CIDR | Subnet mask | Host bits | Usable hosts (2<sup>h</sup> − 2) |
|---|---|---|---|
| /8 | 255.0.0.0 | 24 | 16,777,214 |
| /12 | 255.240.0.0 | 20 | 1,048,574 |
| /16 | 255.255.0.0 | 16 | 65,534 |
| /24 | 255.255.255.0 | 8 | 254 |
| /25 | 255.255.255.128 | 7 | 126 |
| /26 | 255.255.255.192 | 6 | 62 |
| /28 | 255.255.255.240 | 4 | 14 |

**Why − 2?** In every subnet, the host ID of **all 0s** is the address of the **network itself**, and **all 1s** is the **broadcast** address (send to every host). Neither can be given to a device.

```python
import ipaddress

net = ipaddress.ip_network("192.168.1.200/26", strict=False)
print(net)                       # 192.168.1.192/26
print(net.netmask)               # 255.255.255.192
print(net.num_addresses - 2)     # 62 usable host addresses
print(net.broadcast_address)     # 192.168.1.255
```

## IPv4 and IPv6

| | IPv4 | IPv6 |
|---|---|---|
| Address length | **32 bits** | **128 bits** |
| Number of addresses | 2<sup>32</sup> ≈ 4.3 billion | 2<sup>128</sup> ≈ 3.4 × 10<sup>38</sup> |
| Written as | 4 denary octets: `192.168.1.200` | 8 groups of 4 hex digits: `2001:0db8:0000:0000:0000:8a2e:0370:7334` |
| Short form | — | drop leading zeros, replace one run of all-zero groups with `::` → `2001:db8::8a2e:370:7334` |

:::why Why IPv6 was introduced
- IPv4's 32 bits allow only about **4.3 billion** addresses, fewer than the number of people on Earth, never mind devices.
- The growth of the Internet, smartphones and the **Internet of Things** (smart meters, cameras, cars) means demand far exceeds that. The central pool of unallocated IPv4 addresses ran out in 2011.
- Work-arounds (private addresses + **NAT**) extended IPv4's life, but they add complexity.
- IPv6's **128-bit** addresses give enough for every device to have its own **globally unique, public** address, with no need for NAT. (Its design also simplifies the header and builds in support for security and auto-configuration.)
:::

:::trap
- IPv6 isn't "4 times as many addresses" because it is 4 times as long. Every extra bit **doubles** the count: it is 2<sup>96</sup> times as many.
- IPv6 is written in **hexadecimal**, not denary.
:::

## Routable (public) and non-routable (private) addresses

- **Public (routable)** addresses are **globally unique**, allocated through the Internet registries (see [9.3](#/topic/9.3)) to ISPs and organisations. Internet routers will forward packets to them.
- **Private (non-routable)** addresses come from three **reserved ranges**. Anyone may use them **inside** a local network; they only need to be unique **within that network**, so millions of homes can all use `192.168.1.x`. Internet routers **discard** packets with these addresses, which is why they are called non-routable.

| Private range | CIDR | Typical use |
|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | large organisations, mobile networks |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | medium networks (schools, businesses) |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | home networks |

```python
import ipaddress
for addr in ["10.4.7.1", "172.20.5.9", "172.40.1.1", "192.168.0.12", "8.8.8.8"]:
    print(addr, "private" if ipaddress.ip_address(addr).is_private else "public")
# 10.4.7.1 private / 172.20.5.9 private / 172.40.1.1 public / 192.168.0.12 private / 8.8.8.8 public
```

:::trap
The 172 range is **172.16 to 172.31** only. `172.40.1.1` is **public**. Check the second octet is between 16 and 31.
:::

Why use private addresses? They **save public IPv4 addresses** (a whole organisation can share one or a few public addresses through NAT), and devices with private addresses **can't be reached directly** from the Internet, adding a layer of protection.

## DHCP: automatic configuration

Every device needs an IP address, subnet mask, default gateway and DNS server address. Typing these into every device by hand is slow and **error-prone**: two devices given the same address would conflict. **DHCP** does it automatically.

:::figure DHCP's four messages: Discover, Offer, Request, Acknowledge (DORA)
<svg class="diagram" viewBox="0 0 680 270" role="img" aria-label="Sequence diagram between a new client and a DHCP server showing Discover, Offer, Request and Acknowledge messages">
  <defs><marker id="arr96" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="70" y="15" width="140" height="32" rx="6" fill="#7c9aff" fill-opacity="0.35"/><text x="140" y="36" text-anchor="middle" stroke="none">New client</text>
    <rect x="470" y="15" width="140" height="32" rx="6" fill="#6fd39a" fill-opacity="0.4"/><text x="540" y="36" text-anchor="middle" stroke="none">DHCP server</text>
    <line x1="140" y1="47" x2="140" y2="255" stroke-dasharray="4 4"/><line x1="540" y1="47" x2="540" y2="255" stroke-dasharray="4 4"/>
    <line x1="140" y1="80" x2="538" y2="80" stroke-width="2" marker-end="url(#arr96)"/>
    <text x="340" y="72" text-anchor="middle" stroke="none"><tspan font-weight="bold">1 Discover</tspan> (broadcast): "Is there a DHCP server?"</text>
    <line x1="540" y1="125" x2="142" y2="125" stroke-width="2" marker-end="url(#arr96)"/>
    <text x="340" y="117" text-anchor="middle" stroke="none"><tspan font-weight="bold">2 Offer</tspan>: "You can have 192.168.1.37, mask, gateway, DNS, lease 24 h"</text>
    <line x1="140" y1="170" x2="538" y2="170" stroke-width="2" marker-end="url(#arr96)"/>
    <text x="340" y="162" text-anchor="middle" stroke="none"><tspan font-weight="bold">3 Request</tspan> (broadcast): "I'd like 192.168.1.37 from you"</text>
    <line x1="540" y1="215" x2="142" y2="215" stroke-width="2" marker-end="url(#arr96)"/>
    <text x="340" y="207" text-anchor="middle" stroke="none"><tspan font-weight="bold">4 Acknowledge</tspan>: "Confirmed: it's yours for the lease time"</text>
    <text x="340" y="250" text-anchor="middle" stroke="none" font-size="12">The client now configures itself and records the address as in use until the lease expires</text>
  </g>
</svg>
:::

:::steps DHCP (DORA)
1. **Discover**: a device joining the network has no IP address, so it **broadcasts** a DHCP Discover message to the whole local network looking for a DHCP server.
2. **Offer**: a DHCP server **reserves a free address from its pool** and sends an Offer containing the IP address, **subnet mask**, **default gateway**, **DNS server** address and **lease** duration.
3. **Request**: the client **broadcasts** a Request accepting that offer (so any other DHCP servers know their offers weren't taken and can release them).
4. **Acknowledge**: the server confirms; the client configures itself with the settings.
5. The address is **leased** for a set time; the client must **renew** the lease before it expires or the address returns to the pool.
:::

:::columns
**Why DHCP is used**
- No manual configuration: devices just plug in or join the WiFi.
- Avoids **errors** and **duplicate addresses**.
- Addresses are **re-used**: when a device leaves, its address goes back into the pool, so fewer addresses are needed than total devices.
- Settings (e.g. a new DNS server) can be changed centrally.
|||
**Static addresses still matter**
- Servers, printers and routers need an address that **doesn't change**, so others can find them.
- These are configured manually or **reserved** in DHCP (always given to that device's MAC address), and excluded from the pool.
:::

## NAT: Network Address Translation

Devices on your home network have **private** addresses, which can't be used on the Internet. Your ISP gives your router **one public address**. **NAT** on the router lets every device share it.

:::steps How NAT works
1. A device sends a packet to a server on the Internet. Its source is its **private socket**, e.g. `192.168.1.10:50001`.
2. The router **replaces** the source IP with its **public IP** (and the source port with a port it chooses) and **records the mapping in a translation table**.
3. The server replies to the router's **public** address and that port.
4. The router looks up the port in its table, **replaces** the destination with the original private IP and port, and forwards the reply to the right device.
:::

:::example Worked example: a NAT translation table
Router public IP: `203.0.113.5`. Two devices contact the same web server `198.51.100.7:443`, both happening to use client port 50001.

| Private (inside) socket | Public (outside) socket after NAT | Remote server |
|---|---|---|
| 192.168.1.10 : 50001 | 203.0.113.5 : **40001** | 198.51.100.7 : 443 |
| 192.168.1.11 : 50001 | 203.0.113.5 : **40002** | 198.51.100.7 : 443 |
| 192.168.1.10 : 50002 | 203.0.113.5 : **40003** | 198.51.100.7 : 443 |

A reply arriving at `203.0.113.5:40002` is matched to row 2 and forwarded to **192.168.1.11:50001**. Because the router gives each connection its **own public port**, the two devices' identical client ports don't clash.
:::

{{trace:9.6-2}}

:::why Why NAT is used
- **Conserves public IPv4 addresses**: a whole network shares one (or a few) public addresses.
- **Security**: internal devices' private addresses are hidden; unsolicited incoming packets have no matching table entry, so they are dropped. Outsiders can't start a connection to an inside device.
- Lets you change ISP (and public address) without renumbering every internal device.
:::

## Port forwarding

NAT only creates table entries for connections started **from inside**. So what if you want to run a **server** inside your network (a web server, game server or home CCTV) that people on the Internet need to reach? It has a private address, which can't be reached directly.

**Port forwarding** is a **permanent rule** on the router:

| Incoming to router (public) | Forward to (private) |
|---|---|
| 203.0.113.5 : **80** | 192.168.1.50 : 80 (web server) |
| 203.0.113.5 : **25565** | 192.168.1.60 : 25565 (game server) |

1. A client on the Internet connects to the router's **public IP address** and the forwarded **port** (e.g. 80).
2. The router's rule says traffic on that port goes to `192.168.1.50`, so it translates the destination and forwards it.
3. Replies go back out through the router, which translates the source back to its public address.

**Why it's used**: to make a service on a device with a **private (non-routable) address** available to clients on the Internet, while every other port stays closed. The internal server should have a **static** private address so the rule keeps working.

:::trap
- **NAT** handles outgoing connections and their replies automatically. **Port forwarding** is a manual rule so **incoming** connections can reach a chosen internal device. Don't merge them.
- DHCP allocates **addresses**; NAT **translates** them. Different jobs.
- Port forwarding opens a hole in the router's protection: only forward the ports you need, and keep the server patched.
:::

:::exam
- **Subnet questions**: write each octet in binary, AND with the mask **bit by bit**, convert back to denary, compare. Show the working; method marks are available even if you slip.
- **"Explain how a subnet mask is used"**: ANDed with the IP address to give the network ID → compare with the destination's → same = local delivery, different = send to the router/gateway.
- **"Explain why IPv6 was introduced"**: IPv4 32-bit → ~4.3 billion addresses → exhausted by growth in devices/IoT → IPv6 128-bit gives vastly more → every device can have a unique public address.
- **DHCP**: purpose (automatic allocation of IP and configuration from a pool, avoids conflicts/manual work) + DORA steps + lease.
- **NAT**: private ↔ public translation at the router, translation table, why (address shortage, security).
- **Port forwarding**: incoming traffic on a port → specific internal private IP; why (host a server behind NAT).
:::

:::challenge
1. A company has the network 172.16.0.0/16 and needs 60 subnets of at least 900 hosts each. What mask would you choose? How many hosts does each subnet then allow?
2. Run `ipconfig /all` (Windows) or `ip addr` (Linux/macOS). Find your IP address, mask, default gateway, DNS server and DHCP lease time. Is your address public or private?
3. Why can two devices behind NAT run peer-to-peer video calls without port forwarding? (Research "NAT traversal" or "STUN".)
:::

:::recap
- IP address = network ID + host ID. Mask: 1s over the network ID. **IP AND mask = network ID**.
- Same network ID → same subnet → deliver directly; otherwise send to the default gateway.
- CIDR `/n` = n network bits; usable hosts = 2<sup>host bits</sup> − 2 (network and broadcast addresses reserved).
- IPv4 32-bit (~4.3 billion, exhausted); IPv6 128-bit hex addresses (~3.4 × 10<sup>38</sup>).
- Private ranges 10/8, 172.16/12, 192.168/16 are non-routable; public addresses are globally unique and routable.
- DHCP: Discover, Offer, Request, Acknowledge; leased addresses with mask, gateway and DNS.
- NAT: router swaps private source sockets for its public IP and a port, recording a translation table; saves addresses, hides devices.
- Port forwarding: incoming traffic on a chosen port is sent to a specific internal device so it can be a server.
:::

:::related
- [6.4 Logic gates and circuits](#/topic/6.4) — the AND operation
- [5.2 Number bases: binary and hexadecimal](#/topic/5.2)
- [9.3 The Internet: structure, routing and DNS](#/topic/9.3) — routing and registries
- [9.5 TCP/IP, protocols, ports and sockets](#/topic/9.5) — ports and sockets used by NAT
:::

*/});
