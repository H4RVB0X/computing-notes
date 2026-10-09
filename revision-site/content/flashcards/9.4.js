CS.registerFlashcards("9.4", [
  { front: "Packet filtering v stateful inspection v proxy server", back: "Packet filtering: header (IP, port, protocol) against rules. Stateful: connection table + payload, only legitimate connections. Proxy: requests made on clients' behalf; hides IPs, filters, logs, caches." },
  { front: "Which key encrypts a confidential message to Bob? Which decrypts?", back: "Encrypt with Bob's **public** key; decrypt with Bob's **private** key." },
  { front: "Which key signs? Which verifies?", back: "Sign with the sender's **private** key; verify with the sender's **public** key." },
  { front: "Digital signature in 6 steps", back: "Hash message → encrypt hash with sender's private key → append and send → receiver decrypts signature with sender's public key → receiver hashes message → compare: match = authentic and unaltered." },
  { front: "Contents of a digital certificate", back: "Owner's name/domain, owner's public key, serial number, validity dates, issuer (CA) name, CA's digital signature." },
  { front: "Why do HTTPS connections use both asymmetric and symmetric encryption?", back: "Asymmetric (or Diffie–Hellman) safely agrees a session key without the key distribution problem; symmetric encryption is then used because it is much faster for bulk data." },
  { front: "Diffie–Hellman with p = 23, g = 5, a = 4, b = 3", back: "A = 5⁴ mod 23 = 4; B = 5³ mod 23 = 10. Shared secret = 10⁴ mod 23 = 4³ mod 23 = 18." },
  { front: "Virus v worm v trojan", back: "Virus: attaches to a host file, spreads when it's run. Worm: standalone, self-replicates over networks. Trojan: disguised as legitimate software, doesn't replicate." },
  { front: "What is a buffer overflow and how is it prevented?", back: "Data longer than a fixed-size buffer is written into it, overwriting neighbouring memory (possibly code). Prevent by checking input length / bounds checking / input validation." },
  { front: "Code quality, monitoring, protection: one example each", back: "Code quality: input validation/patching. Monitoring: network traffic analysis/logs/intrusion detection. Protection: antivirus, firewall, user education, least privilege, backups." },
]);
