CS.registerFlashcards("9.6", [
  { front: "How do you find a network ID?", back: "Bitwise AND the IP address with the subnet mask. Octets ANDed with 255 are unchanged; octets ANDed with 0 become 0." },
  { front: "192.168.1.200 AND 255.255.255.192 = ?", back: "192.168.1.192 (200 = 11001000; AND 11000000 = 11000000 = 192)." },
  { front: "Usable hosts in a subnet with h host bits, and why", back: "2ʰ − 2: the all-0s host ID is the network address and the all-1s host ID is the broadcast address." },
  { front: "CIDR /8, /16, /24, /26 as masks", back: "/8 = 255.0.0.0 · /16 = 255.255.0.0 · /24 = 255.255.255.0 · /26 = 255.255.255.192" },
  { front: "The three private IPv4 ranges", back: "10.0.0.0/8 · 172.16.0.0/12 (172.16–172.31) · 192.168.0.0/16" },
  { front: "IPv4 v IPv6", back: "IPv4: 32 bits, dotted denary, ~4.3 billion addresses (exhausted). IPv6: 128 bits, 8 groups of 4 hex digits, ~3.4 × 10³⁸ addresses." },
  { front: "DHCP steps (DORA)", back: "Discover (client broadcast) → Offer (server offers IP, mask, gateway, DNS, lease) → Request (client accepts) → Acknowledge (server confirms)." },
  { front: "NAT in three steps", back: "Outgoing: router swaps private source IP:port for its public IP:new port and records it. Reply arrives at public IP:port. Router looks up table and forwards to the private device." },
  { front: "Two reasons for NAT", back: "Conserves public IPv4 addresses (many devices share one) · security: internal addresses hidden, unsolicited incoming traffic dropped." },
  { front: "Port forwarding", back: "A router rule sending incoming traffic on a chosen port of its public IP to a specific private IP and port, so an internal device can act as a server." },
]);
