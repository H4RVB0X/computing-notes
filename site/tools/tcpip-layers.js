/* TCP/IP stack: encapsulation down the sender's four layers, hop-by-hop link-layer rewriting at routers, decapsulation at the receiver. */
(function () {
  const SCEN = [
    { id: "http", name: "Request a web page (HTTP)", proto: "HTTP", port: 80, tp: "TCP", app: "GET /index.html HTTP/1.1  Host: www.example.com", server: "web server", client: "web browser" },
    { id: "https", name: "Secure web page (HTTPS)", proto: "HTTPS", port: 443, tp: "TCP", app: "[TLS-encrypted] GET /account HTTP/1.1", server: "web server", client: "web browser" },
    { id: "smtp", name: "Send an email (SMTP)", proto: "SMTP", port: 25, tp: "TCP", app: "MAIL FROM:<sam@example.com>  RCPT TO:<ali@example.org>  DATA …", server: "email server (SMTP)", client: "email client" },
    { id: "pop3", name: "Download email (POP3)", proto: "POP3", port: 110, tp: "TCP", app: "USER ali  PASS ****  RETR 1", server: "email server (POP3)", client: "email client" },
    { id: "imap", name: "Read email kept on server (IMAP)", proto: "IMAP", port: 143, tp: "TCP", app: "a1 SELECT INBOX  a2 FETCH 1 BODY[]", server: "email server (IMAP)", client: "email client" },
    { id: "ftp", name: "Fetch a file (FTP)", proto: "FTP", port: 21, tp: "TCP", app: "USER anonymous  PASS guest  RETR notes.pdf", server: "FTP server", client: "FTP client", note: "FTP uses port 21 for commands (control) and port 20 for the data transfer itself (active mode)." },
    { id: "ssh", name: "Remote login (SSH)", proto: "SSH", port: 22, tp: "TCP", app: "[encrypted] ls -l /var/www", server: "SSH server", client: "SSH client" },
    { id: "dns", name: "Look up a name (DNS)", proto: "DNS", port: 53, tp: "UDP", app: "Query: A record for www.example.com ?", server: "DNS server", client: "resolver on the computer" },
  ];
  const PORTS = [["HTTP", "80"], ["HTTPS", "443"], ["FTP", "20 (data), 21 (control)"], ["SSH", "22"], ["SMTP", "25"], ["DNS", "53"], ["POP3", "110"], ["IMAP", "143"]];
  const C_IP = "203.0.113.10", S_IP = "198.51.100.20", C_PORT = 51432;
  const MAC = { C: "0A:11:22:33:44:55", R1a: "1C:AA:00:00:00:01", R1b: "1C:AA:00:00:00:02", R2a: "2E:BB:00:00:00:01", R2b: "2E:BB:00:00:00:02", S: "3F:66:77:88:99:00" };
  const LAYERS = ["Application", "Transport", "Network", "Link"];
  const COL = { Application: "accent", Transport: "ok", Network: "warn", Link: "bad" };

  function buildSteps(sc) {
    const seg = sc.tp === "TCP" ? "segment" : "datagram";
    const tpH = { src: C_PORT, dst: sc.port, extra: sc.tp === "TCP" ? "seq 1, ACK flag" : "length, checksum" };
    const ipH = (ttl) => ({ src: C_IP, dst: S_IP, ttl });
    const frame = (s, d) => ({ src: s, dst: d });
    const st = [];
    const add = (where, layer, parts, title, text) => st.push({ where, layer, parts, title, text });
    const A = { k: "app", data: sc.app };
    add("C", 0, [A], "Application layer (sender)", "The " + sc.client + " uses the **" + sc.proto + "** protocol to format the request. The application layer decides *what* is sent; it does not care how it gets there." + (sc.tp === "TCP" ? " (Before this, TCP has already opened a connection with the three-way handshake.)" : ""));
    add("C", 1, [{ k: "tp", h: tpH }, A], "Transport layer (sender)", "**" + sc.tp + "** splits the data into " + seg + "s if needed and adds a header with the **source port** " + C_PORT + " (a temporary client port, 49152–65535) and the **destination port** " + sc.port + " (the well-known port for " + sc.proto + ")." + (sc.tp === "TCP" ? " TCP adds a **sequence number** so the receiver can reorder and acknowledge segments." : " DNS queries use UDP: no connection, no acknowledgements, just fast.") + " Socket at this end: **" + C_IP + ":" + C_PORT + "**.");
    add("C", 2, [{ k: "ip", h: ipH(64) }, { k: "tp", h: tpH }, A], "Network layer (sender)", "**IP** adds a header with the **source IP address** " + C_IP + " and the **destination IP address** " + S_IP + ", plus a **time to live** (TTL = 64). This is now a **packet**. The network layer decides the next hop: the destination is on another network, so it is sent to the default gateway, router R1.");
    add("C", 3, [{ k: "mac", h: frame(MAC.C, MAC.R1a) }, { k: "ip", h: ipH(64) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Link layer (sender)", "The link layer wraps the packet in a **frame** with the **source MAC address** (this computer's network card) and the **destination MAC address of the next hop**, router R1, not the final server. A trailer with an error-check (frame check sequence) is added. The bits are sent over the physical medium.");
    add("L1", 3, [{ k: "mac", h: frame(MAC.C, MAC.R1a) }, { k: "ip", h: ipH(64) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Hop 1: computer → router R1", "The frame travels across the local network to R1.");
    add("R1", 2, [{ k: "ip", h: ipH(63) }, { k: "tp", h: tpH }, A], "Router R1", "R1's link layer checks the frame is addressed to it and **removes the frame**. Its network layer reads the **destination IP address**, looks it up in its **routing table** and chooses the next hop, R2. It decrements the **TTL** (64 → 63). The **IP addresses are not changed**.");
    add("R1", 3, [{ k: "mac", h: frame(MAC.R1b, MAC.R2a) }, { k: "ip", h: ipH(63) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Router R1 builds a new frame", "A **new frame** is made for the next link: source MAC = R1's outgoing interface, destination MAC = R2. Only the link layer is rewritten hop by hop.");
    add("L2", 3, [{ k: "mac", h: frame(MAC.R1b, MAC.R2a) }, { k: "ip", h: ipH(63) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Hop 2: R1 → R2", "The frame crosses the link between the two routers (in reality there may be many more routers across the Internet).");
    add("R2", 2, [{ k: "ip", h: ipH(62) }, { k: "tp", h: tpH }, A], "Router R2", "R2 removes the frame, reads the destination IP address, finds the server is on a network it is directly connected to, and decrements TTL (63 → 62). Source and destination IP addresses are still " + C_IP + " → " + S_IP + ".");
    add("R2", 3, [{ k: "mac", h: frame(MAC.R2b, MAC.S) }, { k: "ip", h: ipH(62) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Router R2 builds a new frame", "New frame: source MAC = R2, destination MAC = the server's network card.");
    add("L3", 3, [{ k: "mac", h: frame(MAC.R2b, MAC.S) }, { k: "ip", h: ipH(62) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Hop 3: R2 → server", "The frame is delivered on the server's local network.");
    add("S", 3, [{ k: "mac", h: frame(MAC.R2b, MAC.S) }, { k: "ip", h: ipH(62) }, { k: "tp", h: tpH }, A, { k: "fcs" }], "Link layer (receiver)", "The server's link layer checks the destination MAC address is its own and the error-check is correct, then **strips the frame header and trailer** and passes the packet up.");
    add("S", 2, [{ k: "ip", h: ipH(62) }, { k: "tp", h: tpH }, A], "Network layer (receiver)", "IP checks the destination IP address (" + S_IP + ") is this machine, **removes the IP header** and passes the " + seg + " up.");
    add("S", 1, [{ k: "tp", h: tpH }, A], "Transport layer (receiver)", sc.tp + " reads the **destination port " + sc.port + "** and hands the data to the process listening on that port, the " + sc.server + "." + (sc.tp === "TCP" ? " TCP puts segments in order by sequence number and sends an **acknowledgement**." : "") + " The header is removed. Socket at this end: **" + S_IP + ":" + sc.port + "**.");
    add("S", 0, [A], "Application layer (receiver)", "The " + sc.server + " receives exactly the data the client sent and acts on it. Its reply travels back the same way, with the ports and IP addresses swapped (source " + S_IP + ":" + sc.port + " → destination " + C_IP + ":" + C_PORT + ")." + (sc.note ? " " + sc.note : ""));
    return st;
  }

  CS.registerTool({
    id: "tcpip-layers",
    title: "TCP/IP stack: encapsulation and routing",
    section: "9",
    topic: "9.5",
    icon: "📦",
    desc: "Watch data go down the four TCP/IP layers, across routers that rewrite only the link layer, and back up at the server.",
    help: "Choose an application, then press **Next** (or **Play**). Each layer **adds a header** on the way down (encapsulation): ports at the transport layer, IP addresses at the network layer, MAC addresses at the link layer. Routers only work up to the network layer: they remove the frame, read the destination IP address, decrement the TTL and build a **new frame** for the next hop, so MAC addresses change at every hop but IP addresses do not. At the receiver each layer **removes its header** on the way up. A **socket** is an IP address plus a port, e.g. 198.51.100.20:80.",
    mount(el, params) {
      const h = CS.util.el;
      let sc = SCEN.find((s) => s.id === params.app) || SCEN[0];
      let steps = buildSteps(sc), idx = 0, timer = null;
      const controls = h("div", { class: "controls" });
      const sel = h("select", { "aria-label": "Application" });
      SCEN.forEach((s) => sel.appendChild(h("option", { value: s.id, text: s.name })));
      sel.value = sc.id;
      const back = h("button", { class: "btn sm", type: "button", text: "◀ Back" });
      const next = h("button", { class: "btn sm primary", type: "button", text: "Next ▶" });
      const play = h("button", { class: "btn sm", type: "button", text: "▶▶ Play" });
      const reset = h("button", { class: "btn sm ghost", type: "button", text: "Reset" });
      controls.append(sel, back, next, play, reset);
      const stat = h("div", { class: "stat-line" });
      const svgWrap = h("div");
      const pkt = h("div", { style: "display:flex;flex-wrap:wrap;gap:4px;margin:10px 0" });
      const pktLabel = h("div", { class: "stat-line" });
      const out = h("div", { class: "output", style: "white-space:normal;font-family:inherit" });
      const legend = h("div", { class: "legend" });
      LAYERS.forEach((L) => legend.appendChild(h("span", { html: '<i style="background:var(--' + COL[L] + ')"></i>' + L + (L === "Link" ? " (frame)" : L === "Network" ? " (packet)" : L === "Transport" ? " (segment)" : " (data)") })));
      const ports = h("details", { class: "collapse", style: "margin-top:12px" });
      ports.innerHTML = "<summary>Well-known ports and sockets</summary><div class='collapse-body'><div class='table-wrap'><table><thead><tr><th>Protocol</th><th>Well-known port</th></tr></thead><tbody>" + PORTS.map((p) => "<tr><td>" + p[0] + "</td><td>" + p[1] + "</td></tr>").join("") + "</tbody></table></div><p class='small'>Servers listen on <b>well-known ports</b> (0–1023). Clients use a temporary <b>client (ephemeral) port</b>, typically 49152–65535, chosen for each connection. A <b>socket</b> = IP address + port number, e.g. <code>" + S_IP + ":80</code>. A connection is identified by the pair of sockets at its two ends.</p></div>";
      el.append(controls, stat, svgWrap, h("div", { class: "stat-line", text: "What is on the wire / in the layer right now:" }), pkt, pktLabel, legend, out, ports);

      const NODES = { C: { x: 70, t: "Client" }, R1: { x: 245, t: "Router R1" }, R2: { x: 395, t: "Router R2" }, S: { x: 570, t: "Server" } };
      function drawSVG(s) {
        const W = 640, top = 34, bh = 34, gap = 6, bw = 116;
        let g = '<svg viewBox="0 0 ' + W + ' 220" style="width:100%;height:auto;display:block" role="img" aria-label="Client, two routers and server with their TCP/IP layers">';
        g += '<g font-family="inherit" font-size="13" fill="currentColor">';
        const yOf = (k) => top + k * (bh + gap);
        Object.keys(NODES).forEach((key) => {
          const n = NODES[key];
          const isHost = key === "C" || key === "S";
          g += '<text x="' + n.x + '" y="20" text-anchor="middle" font-weight="bold">' + n.t + "</text>";
          LAYERS.forEach((L, k) => {
            if (!isHost && k < 2) return;
            const active = s.where === key && s.layer === k;
            const w = isHost ? bw : 96;
            g += '<rect x="' + (n.x - w / 2) + '" y="' + yOf(k) + '" width="' + w + '" height="' + bh + '" rx="6" style="fill:var(--' + COL[L] + (active ? ")" : "-soft)") + ";stroke:var(--" + COL[L] + ');stroke-width:' + (active ? 3 : 1) + '"/>';
            g += '<text x="' + n.x + '" y="' + (yOf(k) + 22) + '" text-anchor="middle"' + (active ? ' style="fill:var(--surface);font-weight:700"' : "") + ">" + L + "</text>";
          });
        });
        const linkY = yOf(3) + bh / 2;
        [["C", "R1", "L1"], ["R1", "R2", "L2"], ["R2", "S", "L3"]].forEach(([a, b, id]) => {
          const x1 = NODES[a].x + (a === "C" ? bw / 2 : 48), x2 = NODES[b].x - (b === "S" ? bw / 2 : 48);
          const on = s.where === id;
          g += '<line x1="' + x1 + '" y1="' + linkY + '" x2="' + x2 + '" y2="' + linkY + '" stroke="currentColor" stroke-width="' + (on ? 4 : 1.5) + '"' + (on ? "" : ' stroke-dasharray="4 4"') + "/>";
          if (on) g += '<circle cx="' + (x1 + x2) / 2 + '" cy="' + linkY + '" r="9" style="fill:var(--bad);stroke:currentColor"/>';
        });
        g += '<text x="70" y="212" text-anchor="middle" font-size="12">' + C_IP + "</text>";
        g += '<text x="570" y="212" text-anchor="middle" font-size="12">' + S_IP + "</text>";
        g += '<text x="320" y="212" text-anchor="middle" font-size="12">routers: network + link layers only</text>';
        g += "</g></svg>";
        svgWrap.innerHTML = g;
      }
      function part(c, title, lines) {
        const d = h("div", { style: "border:2px solid var(--" + c + ");background:var(--" + c + "-soft);border-radius:8px;padding:4px 8px;font-family:var(--font-mono);font-size:0.78rem;min-width:0;overflow-wrap:anywhere" });
        d.appendChild(h("div", { style: "font-weight:700", text: title }));
        lines.forEach((l) => d.appendChild(h("div", { text: l })));
        return d;
      }
      function drawPacket(s) {
        pkt.innerHTML = "";
        s.parts.forEach((p) => {
          if (p.k === "mac") pkt.appendChild(part("bad", "Frame header", ["src MAC " + p.h.src, "dst MAC " + p.h.dst]));
          else if (p.k === "ip") pkt.appendChild(part("warn", "IP header", ["src IP " + p.h.src, "dst IP " + p.h.dst, "TTL " + p.h.ttl]));
          else if (p.k === "tp") pkt.appendChild(part("ok", sc.tp + " header", ["src port " + p.h.src, "dst port " + p.h.dst, p.h.extra]));
          else if (p.k === "app") pkt.appendChild(part("accent", sc.proto + " data", [p.data]));
          else if (p.k === "fcs") pkt.appendChild(part("bad", "Frame trailer", ["error check (FCS)"]));
        });
        const names = { 0: "data", 1: sc.tp === "TCP" ? "segment" : "datagram", 2: "packet", 3: "frame" };
        pktLabel.textContent = "Unit at this layer: " + names[s.layer] + " · headers: " + (s.parts.length - (s.parts.some((p) => p.k === "fcs") ? 2 : 1)) + (s.parts.some((p) => p.k === "fcs") ? " + trailer" : "");
      }
      function render() {
        const s = steps[idx];
        stat.textContent = "Step " + (idx + 1) + " of " + steps.length + " · " + s.title;
        drawSVG(s);
        drawPacket(s);
        out.innerHTML = "<b>" + CS.util.esc(s.title) + ".</b> " + CS.markdown.inline(s.text);
        back.disabled = idx === 0;
        next.disabled = idx === steps.length - 1;
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶▶ Play"; } }
      back.addEventListener("click", () => { stop(); if (idx > 0) { idx--; render(); } });
      next.addEventListener("click", () => { stop(); if (idx < steps.length - 1) { idx++; render(); } });
      reset.addEventListener("click", () => { stop(); idx = 0; render(); });
      play.addEventListener("click", () => {
        if (timer) return stop();
        if (idx === steps.length - 1) idx = 0;
        play.textContent = "❚❚ Pause";
        timer = setInterval(() => {
          if (!el.isConnected) return stop();
          if (idx >= steps.length - 1) return stop();
          idx++; render();
        }, 1600);
      });
      sel.addEventListener("change", () => { stop(); sc = SCEN.find((s) => s.id === sel.value) || SCEN[0]; steps = buildSteps(sc); idx = 0; render(); });
      render();
    },
  });
})();
