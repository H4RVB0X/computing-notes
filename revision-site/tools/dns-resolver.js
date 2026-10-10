/* DNS resolution: URL → FQDN → local cache → resolver → root → TLD → authoritative → IP address, with caching. */
(function () {
  const SLD = ["co", "ac", "gov", "org", "net", "sch", "nhs", "police", "ltd", "plc", "me"];
  const N = { client: [70, 120, "Your computer", "browser + OS cache"], res: [250, 120, "DNS resolver", "ISP's DNS server"], root: [470, 40, "Root server", "."], tld: [470, 120, "TLD server", ""], auth: [470, 200, "Authoritative", "name server"] };
  function hashName(s) { let x = 7; for (const c of s) x = (x * 31 + c.charCodeAt(0)) % 100003; return x; }
  const ipFor = (f) => { const v = hashName(f); return (v % 2 ? "198.51.100." : "203.0.113.") + (1 + (v % 254)); };
  function parse(raw) {
    let s = String(raw).trim();
    if (!s) return { err: "Type a URL, e.g. https://www.bbc.co.uk/news" };
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = "http://" + s;
    let u;
    try { u = new URL(s); } catch (e) { return { err: "That doesn't look like a valid URL." }; }
    const host = u.hostname.toLowerCase().replace(/\.$/, "");
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host) || host.startsWith("[")) return { err: "That URL already contains an IP address, so no DNS lookup is needed." };
    const labels = host.split(".");
    if (labels.length < 2 || labels.some((l) => !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(l))) return { err: "“" + host + "” is not a valid fully qualified domain name: it needs at least two labels such as example.com." };
    const tld = labels[labels.length - 1];
    const take = labels.length >= 3 && tld.length === 2 && SLD.includes(labels[labels.length - 2]) ? 3 : 2;
    const domain = labels.slice(-take).join(".");
    const scheme = u.protocol.replace(":", "");
    const port = u.port || (scheme === "https" ? "443" : scheme === "http" ? "80" : scheme === "ftp" ? "21" : "");
    return { url: u.href, scheme, fqdn: host, domain, tld, path: u.pathname + u.search, port, host: labels.length > take ? labels.slice(0, labels.length - take).join(".") : "(none)" };
  }
  function buildSteps(p, cc, rc) {
    const ip = ipFor(p.fqdn), st = [];
    const add = (from, to, label, text) => st.push({ from, to, label, text });
    const tldName = "TLD server for ." + p.tld, authName = "ns1." + p.domain;
    add(null, "client", "Parse the URL", "The browser takes the **FQDN** `" + p.fqdn + "` from the URL `" + p.url + "`. The protocol (" + p.scheme + ") and path (" + p.path + ") are not part of the DNS lookup.");
    const finish = (via) => {
      add(null, "client", "Connect", "The browser now has the IP address **" + ip + "**" + via + ". It opens a TCP connection to **" + ip + ":" + p.port + "** and sends its " + p.scheme.toUpperCase() + " request for `" + p.path + "`.");
    };
    if (cc[p.fqdn]) {
      add("client", "client", "Local cache HIT", "The IP address for `" + p.fqdn + "` is already in the **local DNS cache** (from an earlier lookup, still within its TTL), so **no query is sent at all**. This is why repeat visits are faster.");
      finish(" from the local cache");
      return { steps: st, ip };
    }
    add("client", "client", "Local cache miss", "`" + p.fqdn + "` is not in the browser or operating system cache.");
    add("client", "res", "Query the resolver", "The computer sends a **recursive query** to its configured DNS resolver (usually the ISP's DNS server, whose address was supplied by DHCP): “What is the IP address of " + p.fqdn + "?”");
    if (rc.names[p.fqdn]) {
      add("res", "res", "Resolver cache HIT", "The resolver has the answer **cached** from another user's earlier lookup, so it replies straight away.");
    } else {
      if (rc.domains[p.domain]) {
        add("res", "res", "Resolver knows the domain's name server", "The resolver already **cached** the address of the authoritative server for `" + p.domain + "` from an earlier lookup, so it **skips the root and TLD servers**.");
      } else {
        if (rc.tlds[p.tld]) add("res", "res", "Resolver knows the ." + p.tld + " server", "The resolver has the ." + p.tld + " TLD server's address cached, so it **skips the root server**.");
        else {
          add("res", "root", "Ask a root server", "The resolver asks a **root name server**: “Where is " + p.fqdn + "?”");
          add("root", "res", "Referral to ." + p.tld, "The root server doesn't know the address, but replies with the address of the **top-level domain (TLD) name server** for **." + p.tld + "**. (A referral, not the answer.)");
        }
        add("res", "tld", "Ask the ." + p.tld + " server", "The resolver asks the " + tldName + ".");
        add("tld", "res", "Referral to " + p.domain, "The TLD server replies with the address of the **authoritative name server** for `" + p.domain + "` (" + authName + ").");
      }
      add("res", "auth", "Ask the authoritative server", "The resolver asks " + authName + ", which holds the DNS records for `" + p.domain + "`.");
      add("auth", "res", "Answer: " + ip, "The authoritative server returns the **A record**: " + p.fqdn + " → **" + ip + "**, with a time to live (TTL) of 300 seconds.");
      add("res", "res", "Resolver caches", "The resolver **caches** the answer and the referrals, so later lookups (by anyone using this resolver) are faster.");
    }
    add("res", "client", "Reply to the computer", "The resolver returns **" + ip + "** to the computer, which also stores it in its **local cache** until the TTL expires.");
    finish("");
    return { steps: st, ip };
  }

  CS.registerTool({
    id: "dns-resolver",
    title: "DNS lookup animator",
    section: "9",
    topic: "9.3",
    icon: "🌐",
    desc: "Follow a URL's domain name through the local cache, the resolver, root, TLD and authoritative name servers to an IP address, then see caching speed up the next lookup.",
    help: "Enter a URL and press **Look up**, then step with **Next** or press **Play**. The first lookup goes all the way: local cache → resolver → root server → TLD server → authoritative name server. Look the same name up again and it is answered from the **local cache**. Try another name in the same domain (e.g. news.bbc.co.uk after www.bbc.co.uk): the resolver already knows the domain's authoritative server, so it skips the root and TLD servers. **Clear caches** starts afresh. The IP addresses shown are made up (from ranges reserved for documentation).",
    mount(el, params) {
      const h = CS.util.el;
      const controls = h("div", { class: "controls" });
      const urlIn = h("input", { type: "text", value: params.url || "https://www.bbc.co.uk/news", "aria-label": "URL", style: "width:230px;max-width:100%" });
      const ex = h("select", { "aria-label": "Example URLs" });
      ["Examples…", "https://www.bbc.co.uk/news", "https://news.bbc.co.uk/sport", "http://www.example.com/index.html", "https://www.ox.ac.uk/admissions", "ftp://files.example.org/notes.pdf"].forEach((u, i) => ex.appendChild(h("option", { value: i ? u : "", text: u })));
      const go = h("button", { class: "btn sm primary", type: "button", text: "Look up" });
      const clear = h("button", { class: "btn sm ghost", type: "button", text: "Clear caches" });
      controls.append(urlIn, ex, go, clear);
      const nav = h("div", { class: "controls" });
      const back = h("button", { class: "btn sm", type: "button", text: "◀ Back" });
      const next = h("button", { class: "btn sm primary", type: "button", text: "Next ▶" });
      const play = h("button", { class: "btn sm", type: "button", text: "▶▶ Play" });
      nav.append(back, next, play);
      const err = h("div", { class: "err" });
      const parts = h("div", { class: "table-wrap" });
      const stat = h("div", { class: "stat-line" });
      const svgWrap = h("div");
      const out = h("div", { class: "output", style: "white-space:normal;font-family:inherit" });
      const caches = h("div", { class: "two-col", style: "margin-top:10px" });
      const terms = h("details", { class: "collapse", style: "margin-top:12px" });
      terms.innerHTML = "<summary>URL v FQDN v domain name v IP address</summary><div class='collapse-body'><ul><li><b>URL</b> (uniform resource locator): the full address of a resource, e.g. <code>https://www.bbc.co.uk/news</code> = protocol + FQDN + path.</li><li><b>Fully qualified domain name (FQDN)</b>: the complete name of a particular host, including the host name, e.g. <code>www.bbc.co.uk</code>. This is what DNS looks up.</li><li><b>Domain name</b>: identifies an area or organisation on the Internet, e.g. <code>bbc.co.uk</code>; it is organised as a hierarchy read right to left: root → TLD (<code>uk</code>) → second-level (<code>co</code>) → organisation (<code>bbc</code>).</li><li><b>IP address</b>: the numeric address routers actually use to deliver packets. DNS translates FQDNs into IP addresses.</li><li>Domain names are registered through <b>domain name registrars</b>; IP address blocks are allocated by <b>Internet registries</b>.</li></ul></div>";
      el.append(controls, err, parts, nav, stat, svgWrap, out, caches, terms);
      let cc = {}, rc = { names: {}, domains: {}, tlds: {} }, steps = [], idx = 0, timer = null, cur = null, pending = null;
      function commit() { if (!pending) return; const { p, ip } = pending; cc[p.fqdn] = ip; rc.names[p.fqdn] = ip; rc.domains[p.domain] = true; rc.tlds[p.tld] = true; pending = null; }

      function drawSVG(s) {
        const lab = { tld: cur ? "." + cur.tld : "", auth: cur ? cur.domain : "" };
        let g = '<svg viewBox="0 0 600 250" style="width:100%;height:auto;display:block" role="img" aria-label="Computer, resolver, root, TLD and authoritative name servers"><defs><marker id="dnsArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs><g font-family="inherit" font-size="13" fill="currentColor">';
        [["client", "res"], ["res", "root"], ["res", "tld"], ["res", "auth"]].forEach(([a, b]) => { g += '<line x1="' + N[a][0] + '" y1="' + N[a][1] + '" x2="' + N[b][0] + '" y2="' + N[b][1] + '" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="4 4"/>'; });
        if (s && s.from && s.to && s.from !== s.to) {
          const a = N[s.from], b = N[s.to], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), off = 62 / L;
          g += '<line x1="' + (a[0] + dx * off) + '" y1="' + (a[1] + dy * off) + '" x2="' + (b[0] - dx * off) + '" y2="' + (b[1] - dy * off) + '" style="stroke:var(--accent)" stroke-width="3.5" marker-end="url(#dnsArr)"/>';
        }
        Object.keys(N).forEach((k) => {
          const [x, y, t, sub] = N[k], on = s && (s.from === k || s.to === k);
          g += '<rect x="' + (x - 62) + '" y="' + (y - 26) + '" width="124" height="52" rx="8" style="fill:var(--' + (on ? "accent-soft" : "bg-2") + ');stroke:var(--' + (on ? "accent" : "border-2") + ');stroke-width:' + (on ? 2.5 : 1) + '"/>';
          g += '<text x="' + x + '" y="' + (y - 4) + '" text-anchor="middle" font-weight="bold">' + t + '</text><text x="' + x + '" y="' + (y + 14) + '" text-anchor="middle" font-size="11">' + CS.util.esc(lab[k] || sub) + "</text>";
        });
        g += '<text x="250" y="200" text-anchor="middle" font-size="11">recursive query →</text><text x="250" y="216" text-anchor="middle" font-size="11">← iterative queries →</text></g></svg>';
        svgWrap.innerHTML = g;
      }
      function drawCaches() {
        const list = (title, items) => { const d = h("div"); d.appendChild(h("div", { class: "stat-line", text: title })); d.appendChild(h("div", { class: "output", text: items.length ? items.join("\n") : "(empty)" })); return d; };
        caches.innerHTML = "";
        caches.append(list("Local cache (your computer)", Object.keys(cc).map((k) => k + " → " + cc[k])), list("Resolver cache", Object.keys(rc.names).map((k) => k + " → " + rc.names[k]).concat(Object.keys(rc.domains).map((d) => "NS for " + d + " → ns1." + d), Object.keys(rc.tlds).map((t) => "NS for ." + t))));
      }
      function render() {
        const s = steps[idx];
        stat.textContent = steps.length ? "Step " + (idx + 1) + " of " + steps.length + " · " + s.label : "";
        drawSVG(s);
        out.innerHTML = s ? "<b>" + CS.util.esc(s.label) + ".</b> " + CS.markdown.inline(s.text) : "";
        back.disabled = idx === 0; next.disabled = idx >= steps.length - 1;
        if (steps.length && idx === steps.length - 1) commit();
        drawCaches();
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶▶ Play"; } }
      function lookup() {
        stop();
        const p = parse(urlIn.value);
        if (p.err) { err.textContent = p.err; return; }
        err.textContent = "";
        commit();
        cur = p;
        parts.innerHTML = "<table><tbody><tr><th style='text-align:left'>URL</th><td><code>" + CS.util.esc(p.url) + "</code></td></tr><tr><th style='text-align:left'>Protocol</th><td><code>" + p.scheme + "</code> (port " + (p.port || "?") + ")</td></tr><tr><th style='text-align:left'>FQDN</th><td><code class='dns-fqdn'>" + p.fqdn + "</code></td></tr><tr><th style='text-align:left'>Host</th><td><code>" + CS.util.esc(p.host) + "</code></td></tr><tr><th style='text-align:left'>Domain name</th><td><code class='dns-domain'>" + p.domain + "</code></td></tr><tr><th style='text-align:left'>Top-level domain</th><td><code>." + p.tld + "</code></td></tr><tr><th style='text-align:left'>Path</th><td><code>" + CS.util.esc(p.path) + "</code></td></tr></tbody></table>";
        const r = buildSteps(p, cc, rc);
        steps = r.steps; idx = 0;
        pending = { p, ip: r.ip };
        render();
      }
      back.addEventListener("click", () => { stop(); if (idx > 0) { idx--; render(); } });
      next.addEventListener("click", () => { stop(); if (idx < steps.length - 1) { idx++; render(); } });
      play.addEventListener("click", () => {
        if (timer) return stop();
        if (idx >= steps.length - 1) idx = 0;
        play.textContent = "❚❚ Pause"; render();
        timer = setInterval(() => { if (!el.isConnected || idx >= steps.length - 1) return stop(); idx++; render(); }, 1500);
      });
      go.addEventListener("click", lookup);
      urlIn.addEventListener("keydown", (e) => e.key === "Enter" && lookup());
      ex.addEventListener("change", () => { if (ex.value) { urlIn.value = ex.value; ex.value = ""; lookup(); } });
      clear.addEventListener("click", () => { stop(); pending = null; cc = {}; rc = { names: {}, domains: {}, tlds: {} }; steps = []; idx = 0; out.innerHTML = "Caches cleared. Press Look up."; drawSVG(null); drawCaches(); stat.textContent = ""; });
      lookup();
    },
  });
})();
