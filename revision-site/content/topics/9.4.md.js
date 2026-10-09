CS.registerTopic({ id: "9.4", title: "Internet security" }, function () {/*

:::objectives
- Explain how a **firewall** protects a network using **packet filtering**, **stateful inspection** and a **proxy server**.
- Explain **symmetric** and **asymmetric** (public/private key) encryption and why asymmetric encryption solves the **key distribution** problem.
- Describe the idea behind **key exchange** (Diffie–Hellman) and why real systems combine both kinds of encryption.
- Explain how a **digital signature** is created and checked, and how a **digital certificate** is obtained and used (e.g. in HTTPS).
- Discuss **worms**, **trojans** and **viruses**, the **vulnerabilities** they exploit, and how **code quality**, **monitoring** and **protection** defend against them.
:::

:::quick At a glance
- A **firewall** sits between a trusted network and the Internet and decides which traffic is allowed through.
- **Packet filtering**: checks each packet's **header** (source/destination IP, port, protocol) against rules. **Stateful inspection**: also tracks **connections** and inspects the **payload**. **Proxy server**: makes requests **on behalf of** clients so there is no direct connection; can filter, log and cache.
- **Symmetric**: the **same key** encrypts and decrypts. Fast, but the key must be shared securely (**key distribution problem**).
- **Asymmetric**: a **public key** (shared with everyone) and a matching **private key** (kept secret). Encrypt with the recipient's **public** key; only their **private** key decrypts.
- **Diffie–Hellman** lets two parties agree a shared secret key over a public channel without sending the key. HTTPS uses asymmetric methods to agree a **symmetric session key**.
- **Digital signature**: hash the message → encrypt the hash with the sender's **private** key. Receiver decrypts with the sender's **public** key and compares with their own hash. Proves **authenticity** and **integrity**.
- **Digital certificate**: issued and signed by a **certificate authority (CA)**; binds an organisation's identity to its **public key**.
- **Virus**: attaches to a host file, spreads when the file is run. **Worm**: standalone, **self-replicates** across networks with no user action. **Trojan**: disguised as useful software, **doesn't self-replicate**.
- Defences: **code quality** (input validation, preventing buffer overflows, testing, patches), **monitoring** (traffic, logs, unusual behaviour), **protection** (antivirus, firewalls, user education, least privilege).
:::

:::keyterms
Firewall :: Hardware and/or software that sits between a trusted network and an untrusted network, monitoring and controlling incoming and outgoing traffic according to a set of rules. :: The border guard.
Packet filtering :: A firewall checks the header of each packet (source/destination IP address, port number, protocol) against rules and accepts or drops it; also called static filtering. :: Check the label on the envelope.
Stateful inspection :: A firewall keeps a table of active connections and examines packet contents (payload) and the context of each packet, only allowing traffic that belongs to a legitimate connection. :: Check the envelope, what's inside, and whether you were expecting it.
Proxy server :: A server that makes requests on behalf of clients so they have no direct connection to the Internet; it can filter content, log activity, cache pages and hide clients' IP addresses. :: A go-between who fetches things for you.
Symmetric encryption :: Encryption in which the same key is used to encrypt and decrypt the data. :: One key locks and unlocks.
Asymmetric encryption :: Encryption that uses a mathematically related pair of keys: data encrypted with one key (e.g. the public key) can only be decrypted with the other (the private key). :: A padlock anyone can close but only you can open.
Public key :: The key in an asymmetric pair that is made freely available to anyone. :: The open padlock you hand out.
Private key :: The key in an asymmetric pair that is kept secret by its owner. :: The only key that opens your padlock.
Key exchange :: A method by which two parties agree or share a secret key so that they can communicate securely. :: Getting the same key to both people safely.
Digital signature :: A hash of a message encrypted with the sender's private key, sent with the message so the receiver can verify who sent it and that it has not been altered. :: A tamper-evident seal only you can make.
Digital certificate :: An electronic document issued and digitally signed by a certificate authority that binds an identity (e.g. a website's domain) to a public key. :: An ID card for a public key.
Certificate authority (CA) :: A trusted organisation that verifies identities and issues and signs digital certificates. :: The passport office.
Virus :: Malware that attaches itself to a host program or file and replicates by copying itself into other files when the host is run. :: A hitchhiker that needs you to run it.
Worm :: Standalone malware that replicates itself and spreads across a network without needing a host file or user action, usually by exploiting a vulnerability. :: Spreads by itself.
Trojan :: Malware disguised as legitimate, useful software that performs a hidden malicious function and does not replicate itself. :: A gift with a nasty surprise inside.
:::

## Firewalls

A **firewall** sits at the boundary between a **trusted** network (e.g. a school LAN) and an **untrusted** one (the Internet). It can be **software** (running on a computer) or a **hardware** device with two network interface cards, one facing each network. Every packet that wants to cross must pass through it.

:::figure A firewall between the LAN and the Internet, with a proxy server handling web requests
<svg class="diagram" viewBox="0 0 680 220" role="img" aria-label="LAN computers connect through a proxy server and a firewall to the Internet">
  <defs><marker id="arr94" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="10" y="30" width="190" height="160" rx="8" fill="#6fd39a" fill-opacity="0.12" stroke-dasharray="5 4"/>
    <text x="105" y="50" text-anchor="middle" stroke="none" font-weight="bold">Trusted LAN</text>
    <rect x="30" y="70" width="60" height="26" rx="4" fill="#7c9aff" fill-opacity="0.35"/><text x="60" y="88" text-anchor="middle" stroke="none">PC 1</text>
    <rect x="30" y="110" width="60" height="26" rx="4" fill="#7c9aff" fill-opacity="0.35"/><text x="60" y="128" text-anchor="middle" stroke="none">PC 2</text>
    <rect x="30" y="150" width="60" height="26" rx="4" fill="#7c9aff" fill-opacity="0.35"/><text x="60" y="168" text-anchor="middle" stroke="none">PC 3</text>
    <rect x="115" y="100" width="75" height="46" rx="5" fill="#c58cff" fill-opacity="0.35"/><text x="152" y="120" text-anchor="middle" stroke="none">proxy</text><text x="152" y="136" text-anchor="middle" stroke="none">server</text>
    <line x1="90" y1="83" x2="115" y2="112"/><line x1="90" y1="123" x2="115" y2="123"/><line x1="90" y1="163" x2="115" y2="135"/>
    <line x1="190" y1="123" x2="268" y2="123" marker-end="url(#arr94)"/>
    <rect x="270" y="60" width="110" height="126" rx="6" fill="#ff9f7c" fill-opacity="0.4"/>
    <text x="325" y="84" text-anchor="middle" stroke="none" font-weight="bold">FIREWALL</text>
    <text x="325" y="108" text-anchor="middle" stroke="none" font-size="12">NIC (LAN side)</text>
    <text x="325" y="128" text-anchor="middle" stroke="none" font-size="12">rules + state</text>
    <text x="325" y="148" text-anchor="middle" stroke="none" font-size="12">table</text>
    <text x="325" y="170" text-anchor="middle" stroke="none" font-size="12">NIC (Internet side)</text>
    <line x1="380" y1="123" x2="478" y2="123" marker-end="url(#arr94)"/>
    <ellipse cx="575" cy="123" rx="95" ry="60" fill="#7c9aff" fill-opacity="0.12" stroke-dasharray="5 4"/>
    <text x="575" y="118" text-anchor="middle" stroke="none" font-weight="bold">Untrusted</text>
    <text x="575" y="136" text-anchor="middle" stroke="none">Internet</text>
    <text x="430" y="212" text-anchor="middle" stroke="none" font-size="12">✗ packets that break the rules are dropped in either direction</text>
  </g>
</svg>
:::

### Packet filtering (static filtering)

- The firewall examines each packet's **header**: **source IP address**, **destination IP address**, **port number** and **protocol**.
- It compares them with **rules** set by the network administrator (an access control list) and **accepts** or **drops** (or rejects) the packet.
- Examples of rules: block all incoming traffic to **port 22** (SSH) from outside; allow outgoing traffic to ports 80 and 443 (web); block all packets from a known malicious IP address.
- It is **fast**, but it looks at each packet **in isolation** and only at the **header**, so it can be fooled by packets with forged (spoofed) headers or by malicious content on an allowed port.

### Stateful inspection

- The firewall keeps a **state (connection) table** of every connection that is currently open: which inside device is talking to which outside address and port.
- Incoming packets are allowed only if they **belong to an established connection** (e.g. a reply to a request an inside computer made) or match a rule for a new one.
- It can also look **inside the payload** and at the **pattern** of traffic, so it can spot suspicious content, e.g. a connection suddenly sending large amounts of data out.
- More secure than packet filtering, but needs more processing and memory.

### Proxy server

- Clients send their requests to the **proxy**, which makes the request to the Internet **on their behalf** and passes back the response. There is **no direct connection** between the LAN and the outside.
- Outside servers only ever see the **proxy's IP address**, hiding the internal devices (**anonymity**).
- It can **filter** content (e.g. a school blocking unsuitable sites with a block list or allow list), **log** every request, and **cache** frequently requested pages, which **speeds up** access and reduces bandwidth use.

| | Packet filtering | Stateful inspection | Proxy server |
|---|---|---|---|
| Looks at | packet header only | header, payload and connection state | whole requests and responses at the application level |
| Remembers connections? | no | yes, state table | handles each session itself |
| Strength | fast, simple | blocks unsolicited and suspicious traffic | no direct connection; filtering, logging, caching, hides IPs |
| Weakness | fooled by spoofed headers or malicious payloads on allowed ports | more processing | can slow traffic; must handle every request |

:::trap
- Packet filtering checks the **header**, not the contents. If you say it "checks the data for viruses", you have described stateful/deep inspection or antivirus.
- Firewalls control traffic in **both directions**: blocking outgoing traffic stops malware already inside from sending data out.
- A firewall **doesn't** remove malware from a computer; that's antivirus software.
:::

## Encryption

**Encryption** turns **plaintext** into **ciphertext** using an **algorithm** and a **key**, so that intercepted data can't be understood. Data crossing the Internet passes through many routers owned by other people, so assume it **can** be intercepted.

### Symmetric encryption

- The **same key** is used to **encrypt and decrypt** (the Caesar and Vernam ciphers from [5.8](#/topic/5.8) are symmetric; modern ones include AES).
- **Fast**, so it suits large amounts of data (streaming, file transfer, web pages).
- **The key distribution problem**: both sides need the same key. If it is sent over the network and intercepted, the attacker can decrypt everything. And with many people, everyone needs a separate key with everyone else.

### Asymmetric (public/private key) encryption

- Each person has a **pair of keys** that are mathematically related: a **public key** that is published for anyone, and a **private key** that is kept secret.
- Data encrypted with the **public** key can **only** be decrypted with the matching **private** key (and vice versa).
- To send a confidential message to Bob, Alice encrypts it with **Bob's public key**. Only **Bob's private key** can decrypt it, and Bob never has to send his private key anywhere.

:::figure Asymmetric encryption: anyone can lock with Bob's public key; only Bob's private key unlocks
<svg class="diagram" viewBox="0 0 680 190" role="img" aria-label="Alice encrypts plaintext with Bob's public key, ciphertext crosses the Internet, Bob decrypts with his private key">
  <defs><marker id="arr94b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="13" fill="currentColor" stroke="currentColor">
    <rect x="10" y="60" width="100" height="44" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="60" y="80" text-anchor="middle" stroke="none">Alice's</text><text x="60" y="96" text-anchor="middle" stroke="none">plaintext</text>
    <line x1="110" y1="82" x2="168" y2="82" marker-end="url(#arr94b)"/>
    <rect x="170" y="55" width="100" height="54" rx="6" fill="#6fd39a" fill-opacity="0.35"/><text x="220" y="78" text-anchor="middle" stroke="none">encrypt with</text><text x="220" y="96" text-anchor="middle" stroke="none">Bob's PUBLIC key</text>
    <line x1="270" y1="82" x2="398" y2="82" marker-end="url(#arr94b)"/>
    <text x="335" y="70" text-anchor="middle" stroke="none" font-family="monospace">x7#Qp9…</text>
    <text x="335" y="110" text-anchor="middle" stroke="none" font-size="12">ciphertext crosses the Internet</text>
    <text x="335" y="126" text-anchor="middle" stroke="none" font-size="12">(useless if intercepted)</text>
    <rect x="400" y="55" width="110" height="54" rx="6" fill="#ff9f7c" fill-opacity="0.4"/><text x="455" y="78" text-anchor="middle" stroke="none">decrypt with</text><text x="455" y="96" text-anchor="middle" stroke="none">Bob's PRIVATE key</text>
    <line x1="510" y1="82" x2="568" y2="82" marker-end="url(#arr94b)"/>
    <rect x="570" y="60" width="100" height="44" rx="6" fill="#7c9aff" fill-opacity="0.3"/><text x="620" y="80" text-anchor="middle" stroke="none">Bob reads</text><text x="620" y="96" text-anchor="middle" stroke="none">plaintext</text>
    <text x="340" y="170" text-anchor="middle" stroke="none">The private key never leaves Bob, so there is nothing secret to intercept in transit</text>
  </g>
</svg>
:::

```python
# Toy public-key encryption (RSA) with tiny numbers - never use small keys for real!
p, q = 61, 53
n = p * q                      # 3233, part of both keys
e = 17                         # public exponent
d = 2753                       # private exponent: (e * d) % ((p-1)*(q-1)) == 1
print((e * d) % ((p - 1) * (q - 1)))   # 1

public_key, private_key = (e, n), (d, n)

def apply(key, number):
    exponent, modulus = key
    return pow(number, exponent, modulus)

message = 65
cipher = apply(public_key, message)      # anyone can encrypt with the public key
print(cipher)                            # 2790
print(apply(private_key, cipher))        # 65 - only the private key decrypts
```

Its security rests on a hard maths problem: working out `d` from the public `(e, n)` needs the prime factors of `n`. That's trivial for 3233 but practically impossible when `n` is hundreds of digits long.

{{tool:cipher-tool}}

| | Symmetric | Asymmetric |
|---|---|---|
| Keys | one shared secret key | public/private key pair per person |
| Speed | fast | much slower (heavy maths) |
| Key distribution | hard: the secret key must reach the other party safely | easy: public keys can be published openly |
| Typical use | encrypting bulk data | key exchange, digital signatures, certificates |

### Key exchange: getting both sides the same key

Asymmetric encryption solves the distribution problem, but it is too slow for everything. So real systems are **hybrid**:

1. Use asymmetric methods **at the start** to agree a **symmetric session key** securely.
2. Use fast **symmetric** encryption with that key for the rest of the conversation.

Two ways to do step 1:
- **Encrypt the key**: the client generates a random session key, encrypts it with the server's **public key** and sends it; only the server's private key can recover it.
- **Diffie–Hellman key exchange**: both parties **calculate** the same secret from numbers sent in the open, so the key itself is **never transmitted at all**.

:::example Worked example: Diffie–Hellman with small numbers
1. **Public**: Alice and Bob agree openly on a prime modulus *p* = 23 and a base *g* = 5.
2. **Private**: Alice picks a secret *a* = 4; Bob picks a secret *b* = 3. These are never sent.
3. Alice sends *A* = 5<sup>4</sup> mod 23 = 625 mod 23 = **4**. Bob sends *B* = 5<sup>3</sup> mod 23 = 125 mod 23 = **10**. An eavesdropper sees 23, 5, 4 and 10.
4. Alice computes *B*<sup>a</sup> mod 23 = 10<sup>4</sup> mod 23 = 10000 mod 23 = **18**.
5. Bob computes *A*<sup>b</sup> mod 23 = 4<sup>3</sup> mod 23 = 64 mod 23 = **18**.
6. Both now share the secret **18**, which was never sent. Recovering *a* or *b* from the public values is infeasible when the numbers are hundreds of digits long.
:::

```python
# Diffie-Hellman with tiny numbers (real systems use numbers hundreds of digits long)
p, g = 23, 5                  # public: agreed openly
a, b = 4, 3                   # private: Alice's and Bob's secrets, never sent

A = pow(g, a, p)              # Alice sends A = 5^4 mod 23
B = pow(g, b, p)              # Bob sends   B = 5^3 mod 23
print(A, B)                   # 4 10  (these cross the network in the open)

alice_key = pow(B, a, p)      # 10^4 mod 23
bob_key = pow(A, b, p)        # 4^3 mod 23
print(alice_key, bob_key)     # 18 18 - same shared secret, never transmitted
```

:::trap
- To send someone a **confidential** message, encrypt with **their public key**, not your private key. Encrypting with your own private key proves it came from you, but anyone with your public key can read it.
- Asymmetric encryption is **not** "more secure so it's used for everything": it is **slower**, which is why it's used to set up a symmetric key.
- Never say the private key is "sent securely". The whole point is that it is **never sent**.
:::

## Digital signatures

Encryption gives **confidentiality**. But how does Bob know a message **really came from Alice** and **wasn't changed** on the way? A **digital signature** provides **authentication** and **integrity**.

:::figure Creating and verifying a digital signature
<svg class="diagram" viewBox="0 0 680 270" role="img" aria-label="Sender hashes message and encrypts the hash with her private key to make a signature; receiver decrypts the signature with the sender's public key, hashes the received message and compares">
  <defs><marker id="arr94c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g font-family="inherit" font-size="12" fill="currentColor" stroke="currentColor">
    <text x="150" y="20" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">Sender (Alice)</text>
    <rect x="20" y="35" width="90" height="34" rx="5" fill="#7c9aff" fill-opacity="0.3"/><text x="65" y="56" text-anchor="middle" stroke="none">message</text>
    <line x1="110" y1="52" x2="148" y2="52" marker-end="url(#arr94c)"/>
    <rect x="150" y="35" width="80" height="34" rx="5" fill="#6fd39a" fill-opacity="0.3"/><text x="190" y="56" text-anchor="middle" stroke="none">hash it</text>
    <line x1="190" y1="69" x2="190" y2="93" marker-end="url(#arr94c)"/>
    <rect x="130" y="95" width="120" height="40" rx="5" fill="#ff9f7c" fill-opacity="0.35"/><text x="190" y="112" text-anchor="middle" stroke="none">encrypt hash with</text><text x="190" y="127" text-anchor="middle" stroke="none">Alice's PRIVATE key</text>
    <line x1="190" y1="135" x2="190" y2="160" marker-end="url(#arr94c)"/>
    <rect x="20" y="162" width="250" height="34" rx="5" fill="#c58cff" fill-opacity="0.3"/><text x="145" y="183" text-anchor="middle" stroke="none">message + signature sent together</text>
    <line x1="270" y1="179" x2="368" y2="179" marker-end="url(#arr94c)"/>
    <text x="520" y="20" text-anchor="middle" stroke="none" font-size="14" font-weight="bold">Receiver (Bob)</text>
    <rect x="370" y="35" width="120" height="40" rx="5" fill="#ff9f7c" fill-opacity="0.35"/><text x="430" y="52" text-anchor="middle" stroke="none">decrypt signature with</text><text x="430" y="67" text-anchor="middle" stroke="none">Alice's PUBLIC key</text>
    <rect x="540" y="35" width="120" height="40" rx="5" fill="#6fd39a" fill-opacity="0.3"/><text x="600" y="52" text-anchor="middle" stroke="none">hash the received</text><text x="600" y="67" text-anchor="middle" stroke="none">message himself</text>
    <line x1="430" y1="162" x2="430" y2="77" marker-end="url(#arr94c)"/>
    <line x1="430" y1="162" x2="600" y2="162"/><line x1="600" y1="162" x2="600" y2="77" marker-end="url(#arr94c)"/>
    <text x="430" y="105" text-anchor="middle" stroke="none">hash A</text><text x="600" y="105" text-anchor="middle" stroke="none">hash B</text>
    <rect x="455" y="118" width="120" height="30" rx="15" fill="#7c9aff" fill-opacity="0.3"/><text x="515" y="137" text-anchor="middle" stroke="none">A = B ?</text>
    <line x1="430" y1="110" x2="455" y2="128"/><line x1="600" y1="110" x2="575" y2="128"/>
    <text x="515" y="225" text-anchor="middle" stroke="none">match → really from Alice and unchanged</text>
    <text x="515" y="243" text-anchor="middle" stroke="none">no match → altered, or not from Alice</text>
  </g>
</svg>
:::

:::steps Creating and checking a digital signature
1. The sender applies a **hashing algorithm** to the message, producing a short fixed-length **digest** (hash).
2. The sender **encrypts the digest with their own private key**. This encrypted digest is the **digital signature**.
3. The signature is **appended to the message** and both are sent (the whole thing may also be encrypted with the receiver's public key for confidentiality).
4. The receiver **decrypts the signature using the sender's public key**, recovering the original digest.
5. The receiver **hashes the received message** with the same algorithm.
6. If the two digests **match**, the message **came from the sender** (only their private key could have made a signature their public key opens) and **has not been altered** (any change would give a different hash).
:::

```python
import hashlib

n, e, d = 3233, 17, 2753      # toy RSA keys from above: (e, n) public, (d, n) private

def digest(text):
    # real signatures sign the whole hash; we shrink it to fit our tiny key
    return int(hashlib.sha256(text.encode()).hexdigest(), 16) % n

message = "Pay Bob 10 pounds"
signature = pow(digest(message), d, n)          # sender: hash, then encrypt with PRIVATE key

def verify(msg, sig):
    return pow(sig, e, n) == digest(msg)        # receiver: decrypt with PUBLIC key, re-hash, compare

print(verify("Pay Bob 10 pounds", signature))   # True  - authentic and unchanged
print(verify("Pay Bob 99 pounds", signature))   # False - message was altered
```

:::why Why hash first instead of encrypting the whole message?
Asymmetric encryption is slow. A hash is small and fixed length, so signing the hash is quick whatever the message size, and any change to the message changes the hash.
:::

## Digital certificates

A signature proves a message was made with a particular private key, but **whose** key is it? An attacker could publish their own public key claiming to be your bank. A **digital certificate** solves this: a trusted third party, a **certificate authority (CA)**, vouches that a public key really belongs to a named organisation.

### What a certificate contains

- The **owner's name** / organisation and **domain name** (e.g. `www.mybank.co.uk`).
- The owner's **public key**.
- A **serial number**.
- **Validity dates** (issued, expiry).
- The **issuer**: the CA's name.
- The **CA's digital signature** over all of the above.

### How a certificate is obtained

1. The organisation generates its own **public/private key pair** and keeps the private key secret.
2. It sends a **certificate signing request** containing its public key and identity details to a **CA**.
3. The CA **verifies the identity** (at least that the applicant controls the domain; for higher-level certificates, the organisation's legal identity).
4. The CA creates the certificate and **signs it with the CA's private key**, then issues it to the organisation.

### How a certificate is used (HTTPS/TLS)

{{tool:handshake-demo}}

:::steps What your browser does when you visit an https:// site
1. The browser connects to the server and the server sends its **digital certificate**.
2. The browser checks the certificate: it uses the **CA's public key** (built into the browser/OS as a trusted root certificate) to **verify the CA's signature**, and checks the **domain matches** and the certificate is **in date** and not revoked.
3. If any check fails, the browser shows a security warning.
4. If it passes, the browser trusts that the **public key in the certificate really belongs to that website**.
5. The browser and server use that public key (or Diffie–Hellman, authenticated by it) to agree a **symmetric session key**.
6. The rest of the session is encrypted **symmetrically** with the session key: the padlock icon.
:::

:::trap
- A **digital signature** is attached to a **message**; a **digital certificate** is an ID document for a **public key**. Certificates contain a CA's signature, but they are not the same thing.
- Signing uses the **sender's private key**; verifying uses the **sender's public key**. Get them the wrong way round and the answer gets nothing.
- A signature proves **authenticity and integrity**, not confidentiality. The message itself may be readable unless it is also encrypted.
:::

## Malware: worms, trojans and viruses

**Malware** is software written to cause harm: steal data, damage files, take control of systems or disrupt services.

| | Virus | Worm | Trojan |
|---|---|---|---|
| What it is | malicious code attached to a **host** program or file | **standalone** program | malicious program **disguised as legitimate** software |
| How it spreads | when the infected host is **run**, it copies itself into other files; spread by users sharing files, USB drives, email attachments | **self-replicates across networks** on its own, e.g. copying itself to other computers through an unpatched network service or by emailing itself to contacts | the **user is tricked** into installing it (fake game, fake update, pirated software); does **not** replicate |
| Needs user action? | yes, running the host | no, once released | yes, installing/running it |
| Vulnerabilities exploited | users running untrusted files; out-of-date antivirus | **software vulnerabilities**: unpatched OS/service bugs such as buffer overflows; open ports; weak passwords | **human trust** (social engineering); users with too many permissions |
| Typical damage | corrupts/deletes files, steals data | uses up bandwidth/resources, carries a payload (e.g. ransomware such as WannaCry) | opens a **back door** for remote control (bots/botnets), steals data, installs more malware |

### The vulnerabilities malware exploits

- **Poor code quality**: e.g. a **buffer overflow**, where a program writes input into a fixed-size buffer without checking its length; extra data spills into neighbouring memory and can overwrite instructions or return addresses, letting an attacker run their own code. Also missing **input validation** (e.g. SQL injection), leftover debug code.
- **Unpatched software**: once a vulnerability is published, anyone can exploit systems that haven't applied the fix.
- **Human weakness**: **social engineering** such as phishing emails persuading users to open attachments, click links or install software.
- **Poor configuration**: open ports, default passwords, users with administrator rights they don't need.

### Defences

:::columns
**Improved code quality**
- **Validate all input**: check length, type, range and format; never trust the user.
- **Prevent buffer overflows**: always check the size of data before writing into a buffer; use languages/functions with **bounds checking**.
- **Thorough testing** and **code reviews** to find bugs before release.
- Release **patches/updates** quickly when a flaw is found, and **apply** them.
|||
**Monitoring**
- Monitor **network traffic** for unusual patterns (e.g. one machine contacting hundreds of others: worm-like behaviour).
- **Stateful-inspection firewalls** and intrusion detection systems flag suspicious connections.
- Check **logs** of logins, file access and outgoing connections; investigate anomalies.
- Anti-malware **scans** of files and memory.
|||
**Protection**
- **Antivirus/anti-malware** software with **up-to-date** signatures, plus behaviour-based detection.
- **Firewalls** to block unauthorised traffic in both directions.
- **User education**: don't open unexpected attachments, verify links, only install trusted software.
- **Least privilege**: users don't run as administrator, limiting what malware can do.
- Regular **backups** to recover from ransomware or corruption.
:::

:::example Matching defence to threat (how to structure a 9-mark answer)
- **Worm** exploiting a buffer overflow in a network service → *code quality* (bounds checking, input validation) prevents the flaw; *patching* removes it once found; *firewall* blocks the port; *monitoring* spots unusual traffic and isolates infected machines.
- **Trojan** delivered by a fake app → *user education* stops it being installed; *antivirus* recognises known trojans; *least privilege* limits damage; *firewall/monitoring* detects the back door's outgoing connection.
- **Virus** in an email attachment → *email filtering and antivirus* scanning; *education* about attachments; *backups* to recover.
:::

:::trap
- **Worms spread on their own; viruses need a host file to be run; trojans don't replicate.** Most lost marks come from blurring these three.
- "Install antivirus" alone is a weak answer. Say **why** it helps (detects known malware signatures/behaviour) and **keep it updated**.
- The spec says **code quality, monitoring and protection**. Use those three headings to structure discussion answers.
:::

:::exam
- **"Explain how a firewall uses packet filtering"**: header checked → source/destination IP, port, protocol → compared with rules → allowed or dropped.
- **"Explain stateful inspection"**: keeps a connection/state table; only allows packets that are part of an established, legitimate connection; may examine payload.
- **"Explain the purpose of a proxy server"**: acts on behalf of clients; no direct link; hides IP addresses; filtering; logging; caching.
- **Asymmetric encryption (4 marks)**: key pair; public key shared; private key secret; encrypt with recipient's **public** key; only their **private** key decrypts.
- **Digital signature (5–6 marks)**: hash → encrypt hash with sender's **private** key → append → receiver decrypts with sender's **public** key → hashes message → compares.
- **Certificates**: issued by a CA after verifying identity; contain public key, owner, validity, serial number, CA signature; browser verifies with CA's public key.
- **9/12-mark malware discussions**: define each type and how it spreads, name the vulnerability, and evaluate defences under code quality / monitoring / protection. Use examples and reach a conclusion (layered defence).
:::

:::challenge
1. Why can't an attacker simply replace the public key inside a website's certificate with their own? What would the browser notice?
2. Research "forward secrecy". Why do modern HTTPS connections prefer Diffie–Hellman to sending a session key encrypted with the server's public key?
3. Write a Python function that copies user input into a fixed-size list "buffer" safely, rejecting input that is too long. Why don't Python programs suffer classic buffer overflows the way C programs can?
:::

:::recap
- Firewall: packet filtering (header vs rules), stateful inspection (connection table, payload), proxy server (acts on clients' behalf, hides IPs, filters, logs, caches).
- Symmetric: one shared key, fast, but the key must be distributed securely.
- Asymmetric: public/private key pair; encrypt with the recipient's public key; private key never sent; slow.
- Key exchange: asymmetric methods or Diffie–Hellman agree a symmetric session key; bulk data then encrypted symmetrically.
- Digital signature: hash → encrypt with sender's private key; verify with sender's public key and compare hashes → authenticity + integrity.
- Digital certificate: CA-signed binding of identity to public key; obtained by request + identity check; checked by browsers in HTTPS.
- Virus (host file, needs running), worm (self-replicating over networks), trojan (disguised, no replication). Defend with code quality, monitoring and protection.
:::

:::related
- [5.8 Compression and encryption](#/topic/5.8) — Caesar and Vernam ciphers
- [9.2 Networking: topologies, types and wireless](#/topic/9.2) — WiFi security
- [9.5 TCP/IP, protocols, ports and sockets](#/topic/9.5) — ports that firewalls filter
- [8.1 Moral, ethical, legal and cultural issues](#/topic/8.1)
:::

*/});
