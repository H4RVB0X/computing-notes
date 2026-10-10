/* Subnet calculator: IP AND mask in binary, network/host identifiers, broadcast, usable hosts, same-subnet check, private/public ranges. */
(function () {
  function parseIP(s) {
    const m = String(s).trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!m) return null;
    const o = m.slice(1).map(Number);
    if (o.some((x) => x > 255)) return null;
    return ((o[0] << 24) >>> 0) + (o[1] << 16) + (o[2] << 8) + o[3];
  }
  const toDot = (n) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
  const prefixMask = (p) => (p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);
  function parseMask(s) {
    s = String(s).trim().replace(/^\//, "");
    if (/^\d{1,2}$/.test(s)) { const p = +s; return p <= 32 ? { mask: prefixMask(p), prefix: p } : { err: "A prefix length must be between 0 and 32." }; }
    const n = parseIP(s);
    if (n === null) return { err: "Enter the mask as dotted decimal (255.255.255.0) or a prefix (/24)." };
    let p = 0; while (p < 32 && ((n >>> (31 - p)) & 1)) p++;
    if (prefixMask(p) !== n) return { err: "That is not a valid subnet mask: the 1s must all come first, followed by all 0s (e.g. 255.255.240.0)." };
    return { mask: n, prefix: p };
  }
  const RANGES = [
    ["10.0.0.0", 8, "private (RFC 1918), non-routable on the Internet"],
    ["172.16.0.0", 12, "private (RFC 1918), non-routable on the Internet"],
    ["192.168.0.0", 16, "private (RFC 1918), non-routable on the Internet"],
    ["127.0.0.0", 8, "loopback (this computer)"],
    ["169.254.0.0", 16, "link-local (self-assigned when DHCP fails)"],
    ["100.64.0.0", 10, "shared address space for carrier-grade NAT, not public"],
    ["0.0.0.0", 8, "'this network', not usable as a host address"],
    ["224.0.0.0", 4, "multicast"],
    ["240.0.0.0", 4, "reserved"],
  ];
  function classify(ip) {
    for (const [base, p, txt] of RANGES) { const m = prefixMask(p); if (((ip & m) >>> 0) === parseIP(base)) return { txt: base + "/" + p + ": " + txt, pub: false }; }
    return { txt: "public (routable): unique on the Internet, allocated via a registry and ISP", pub: true };
  }
  function calc(ip, mask, prefix) {
    const net = (ip & mask) >>> 0, hostPart = (ip & ~mask) >>> 0, bc = (net | ~mask) >>> 0;
    const total = Math.pow(2, 32 - prefix);
    let usable, first, last;
    if (prefix === 32) { usable = 1; first = last = net; }
    else if (prefix === 31) { usable = 2; first = net; last = bc; }
    else { usable = total - 2; first = net + 1; last = bc - 1; }
    return { net, hostPart, bc, total, usable, first, last };
  }
  const bits8 = (n) => n.toString(2).padStart(8, "0");

  CS.registerTool({
    id: "subnet-calculator",
    title: "Subnet calculator",
    section: "9",
    topic: "9.6",
    icon: "🧮",
    desc: "IP address AND subnet mask, bit by bit: network ID, host ID, broadcast address, usable hosts, and a same-subnet checker.",
    help: "Enter an IPv4 address and a subnet mask, either dotted (**255.255.255.0**) or as a prefix (**/24**). You can also type both together, e.g. **192.168.1.77/26**. The tool ANDs each bit of the address with the matching bit of the mask: **1 AND 1 = 1, anything else = 0**. The result is the **network identifier**. The bits where the mask is 0 form the **host identifier**. Usable hosts = 2<sup>host bits</sup> − 2, because the all-0s host (the network address) and the all-1s host (the broadcast address) cannot be given to a device. Use the checker underneath to test whether two hosts are on the same subnet.",
    mount(el, params) {
      const h = CS.util.el;
      const controls = h("div", { class: "controls" });
      const ipIn = h("input", { type: "text", value: params.ip || "192.168.1.77", "aria-label": "IP address", style: "width:150px" });
      const maskIn = h("input", { type: "text", value: params.mask || "255.255.255.192", "aria-label": "Subnet mask", style: "width:150px" });
      const go = h("button", { class: "btn sm primary", type: "button", text: "Calculate" });
      controls.append(h("label", null, ["IP", ipIn]), h("label", null, ["Mask", maskIn]), go);
      const err = h("div", { class: "err" });
      const binBox = h("div", { style: "display:flex;flex-wrap:wrap;gap:10px;margin:8px 0" });
      const res = h("div", { class: "table-wrap" });
      const steps = h("div", { class: "steps-out", style: "margin-top:10px" });
      const chk = h("div", { style: "margin-top:16px" });
      chk.appendChild(h("div", { class: "stat-line", text: "Are two hosts on the same subnet?" }));
      const c2 = h("div", { class: "controls" });
      const aIn = h("input", { type: "text", value: "192.168.1.77", "aria-label": "First host", style: "width:140px" });
      const bIn = h("input", { type: "text", value: "192.168.1.130", "aria-label": "Second host", style: "width:140px" });
      const mIn = h("input", { type: "text", value: "/26", "aria-label": "Mask for comparison", style: "width:120px" });
      const cBtn = h("button", { class: "btn sm", type: "button", text: "Check" });
      c2.append(h("label", null, ["Host A", aIn]), h("label", null, ["Host B", bIn]), h("label", null, ["Mask", mIn]), cBtn);
      const cOut = h("div", { class: "output", style: "white-space:normal" });
      chk.append(c2, cOut);
      const notes = h("details", { class: "collapse", style: "margin-top:14px" });
      notes.innerHTML = "<summary>IPv4 v IPv6, public v private</summary><div class='collapse-body'><ul>" +
        "<li><b>IPv4</b>: 32 bits, written as four denary octets (192.168.1.77): about 4.3 billion (2<sup>32</sup>) addresses, which have effectively run out.</li>" +
        "<li><b>IPv6</b>: 128 bits, written as eight groups of four hex digits separated by colons (2001:0db8:0000:0000:0000:ff00:0042:8329, shortened to 2001:db8::ff00:42:8329): 2<sup>128</sup> addresses, so every device can have a unique public address without NAT. Introduced because IPv4 addresses were running out (more devices, IoT).</li>" +
        "<li><b>Private (non-routable)</b> ranges 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 can be reused inside any LAN; routers on the Internet will not forward them. A router using <b>NAT</b> swaps them for its public address.</li>" +
        "<li><b>Public (routable)</b> addresses are globally unique and allocated by Internet registries.</li>" +
        "<li>A prefix such as <b>/26</b> means the first 26 bits are the network identifier (mask 255.255.255.192), leaving 6 host bits: 2<sup>6</sup> − 2 = 62 usable hosts.</li></ul></div>";
      el.append(controls, err, binBox, res, steps, chk, notes);

      function octetBlock(ip, mask, prefix, k) {
        const sh = 24 - 8 * k, a = (ip >>> sh) & 255, m = (mask >>> sh) & 255, r = a & m;
        const blk = h("div", { style: "border:1px solid var(--border);border-radius:8px;padding:6px 8px;background:var(--bg-2)" });
        const row = (label, val, kind) => {
          const line = h("div", { style: "display:flex;gap:2px;align-items:center;font-family:var(--font-mono);font-size:0.85rem" });
          line.appendChild(h("span", { style: "width:3.2em;color:var(--text-3);font-size:0.72rem", text: label }));
          bits8(val).split("").forEach((b, i) => {
            const pos = 8 * k + i, isNet = pos < prefix;
            line.appendChild(h("span", { style: "width:1.05em;text-align:center;border-radius:3px;" + (kind === "res" ? (isNet ? "background:var(--ok-soft);color:var(--ok);font-weight:700" : "background:var(--bg-3);color:var(--text-3)") : isNet ? "background:var(--accent-soft)" : ""), text: b }));
          });
          line.appendChild(h("span", { style: "margin-left:6px;font-weight:700", text: String(val) }));
          return line;
        };
        blk.append(h("div", { class: "bit-label", style: "text-align:left", text: "octet " + (k + 1) }), row("IP", a), row("mask", m), h("div", { style: "border-top:1px solid var(--border-2);margin:2px 0" }), row("AND", r, "res"));
        return blk;
      }
      function readPair(ipTxt, maskTxt) {
        let ipS = ipTxt.trim(), mS = maskTxt.trim();
        if (ipS.includes("/")) { const parts = ipS.split("/"); ipS = parts[0]; if (parts[1]) mS = parts[1]; }
        const ip = parseIP(ipS);
        if (ip === null) return { err: "“" + ipS + "” is not a valid IPv4 address: it needs four numbers 0–255 separated by dots." };
        const m = parseMask(mS);
        if (m.err) return m;
        return { ip, mask: m.mask, prefix: m.prefix };
      }
      function run() {
        const p = readPair(ipIn.value, maskIn.value);
        binBox.innerHTML = ""; res.innerHTML = ""; steps.innerHTML = "";
        if (p.err) { err.textContent = p.err; return; }
        err.textContent = "";
        const r = calc(p.ip, p.mask, p.prefix), hb = 32 - p.prefix, cl = classify(p.ip);
        for (let k = 0; k < 4; k++) binBox.appendChild(octetBlock(p.ip, p.mask, p.prefix, k));
        const rows = [
          ["IP address", toDot(p.ip)], ["Subnet mask", toDot(p.mask) + "  (/" + p.prefix + ")"], ["Network identifier", toDot(r.net)], ["Host identifier", toDot(r.hostPart) + "  (host bits only)"],
          ["Broadcast address", toDot(r.bc)], ["First usable host", toDot(r.first)], ["Last usable host", toDot(r.last)],
          ["Addresses in subnet", "2^" + hb + " = " + r.total], ["Usable host addresses", p.prefix >= 31 ? r.usable + (p.prefix === 31 ? " (point-to-point link, no network/broadcast)" : " (single host)") : "2^" + hb + " − 2 = " + r.usable], ["Address type", cl.txt],
        ];
        res.innerHTML = "<table><tbody>" + rows.map((x) => "<tr><th style='text-align:left'>" + x[0] + "</th><td><code class='res-" + CS.util.slug(x[0]) + "'>" + CS.util.esc(x[1]) + "</code></td></tr>").join("") + "</tbody></table>";
        steps.innerHTML = "<ol><li>Write the IP address and the mask in binary, octet by octet.</li><li>AND each pair of bits: 1 AND 1 = 1, otherwise 0. The highlighted green bits give the <b>network identifier</b> " + toDot(r.net) + ".</li><li>The mask has " + p.prefix + " ones, so the first " + p.prefix + " bits identify the network and the remaining " + hb + " bits identify the host (" + toDot(r.hostPart) + ").</li>" + (p.prefix < 31 ? "<li>Set all " + hb + " host bits to 1 to get the <b>broadcast address</b> " + toDot(r.bc) + ". All host bits 0 is the network address itself, so usable hosts = 2<sup>" + hb + "</sup> − 2 = " + r.usable + ".</li>" : "") + "</ol>";
      }
      function check() {
        const a = readPair(aIn.value, mIn.value), b = readPair(bIn.value, mIn.value);
        if (a.err || b.err) { cOut.innerHTML = "<span class='err'>" + CS.util.esc(a.err || b.err) + "</span>"; return; }
        const na = (a.ip & a.mask) >>> 0, nb = (b.ip & a.mask) >>> 0, same = na === nb;
        cOut.innerHTML = "A: " + toDot(a.ip) + " AND " + toDot(a.mask) + " = <b>" + toDot(na) + "</b><br>B: " + toDot(b.ip) + " AND " + toDot(a.mask) + " = <b>" + toDot(nb) + "</b><br>" + (same ? "<span class='ok-text same-result'>Same network identifier → same subnet. A can send to B directly, without a router.</span>" : "<span class='err same-result'>Different network identifiers → different subnets. Traffic between them must go through a router (the default gateway).</span>");
      }
      go.addEventListener("click", run);
      cBtn.addEventListener("click", check);
      [ipIn, maskIn].forEach((i) => i.addEventListener("keydown", (e) => e.key === "Enter" && run()));
      [aIn, bIn, mIn].forEach((i) => i.addEventListener("keydown", (e) => e.key === "Enter" && check()));
      run(); check();
    },
  });
})();
