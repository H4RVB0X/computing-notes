CS.registerFlashcards("9.5", [
  { front: "TCP/IP layers top to bottom and what each adds", back: "Application (protocol data) → Transport (ports, sequence numbers) → Network (IP addresses, TTL) → Link (MAC addresses, trailer)" },
  { front: "Well-known ports: FTP, SSH, SMTP, HTTP, POP3, HTTPS", back: "FTP 20/21 · SSH 22 · SMTP 25 · HTTP 80 · POP3 110 · HTTPS 443" },
  { front: "Socket", back: "IP address + port number, e.g. 192.168.1.20:51734: one end of a connection." },
  { front: "Well-known port v client port", back: "Well-known (0–1023): fixed numbers for server services so clients know where to connect. Client/ephemeral: temporary high number allocated per connection so replies reach the right process." },
  { front: "MAC address facts", back: "48 bits (12 hex digits), assigned to the NIC by the manufacturer, used at the link layer to deliver frames on the local network; changes hop by hop." },
  { front: "SMTP v POP3", back: "SMTP sends email (client → server, server → server). POP3 retrieves email from the server to the client." },
  { front: "Three SMTP commands and three POP3 commands", back: "SMTP: HELO, MAIL FROM, RCPT TO, DATA, QUIT. POP3: USER, PASS, STAT, LIST, RETR, DELE, QUIT." },
  { front: "Anonymous v non-anonymous FTP", back: "Anonymous: no personal account, public files, usually read-only. Non-anonymous: own username/password, permissions-based access." },
  { front: "Role of a web server", back: "Listens on 80/443; receives HTTP requests; finds or generates the resource (server-side scripts, databases); returns an HTTP response with status code and content." },
  { front: "Role of a web browser", back: "Takes a URL, DNS lookup, sends HTTP(S) requests, receives and renders HTML/CSS, fetches further resources, runs client-side scripts, checks certificates." },
]);
