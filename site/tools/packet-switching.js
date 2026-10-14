/* Packet switching: split a message into packets, route them independently, show out-of-order arrival, loss, TTL and reassembly. */
(function () {
  const NODE = { A: [40, 140], R1: [170, 60], R4: [170, 220], R2: [320, 60], R3: [320, 220], R5: [460, 140], B: [590, 140] };
  const DELAY = { "A-R1": 1, "A-R4": 1, "R1-R2": 1, "R1-R3": 1, "R4-R3": 2, "R2-R5": 1, "R3-R5": 2, "R3-R2": 1, "R5-B": 1 };
  const ROUTES = [["A", "R1", "R2", "R5", "B"], ["A", "R4", "R3", "R5", "B"], ["A", "R1", "R3", "R5", "B"], ["A", "R4", "R3", "R2", "R5", "B"]];
  const SRC = "203.0.113.10", DST = "198.51.100.20";
  const delay = (a, b) => DELAY[a + "-" + b] || DELAY[b + "-" + a] || 1;
  const checksum = (s) => { let t = 0; for (const ch of s) t = (t + ch.charCodeAt(0)) % 256; return t; };

  function simulate(msg, size, ttl0, congestion) {
    const chunks = [];
    for (let i = 0; i < msg.length; i += size) chunks.push(msg.slice(i, i + size));
    const N = chunks.length;
    const attempts = [];
    function plan(seq, route, start, resend) {
      const times = [start];
      for (let k = 1; k < route.length; k++) times.push(times[k - 1] + delay(route[k - 1], route[k]));
      let fate = { type: "arrived", at: times[times.length - 1], node: "B", idx: route.length - 1 };
      for (let k = 1; k < route.length - 1; k++) {
        if (!resend && congestion && seq === 3 && route[k] === "R3") { fate = { type: "dropped", at: times[k], node: route[k], idx: k }; break; }
        if (ttl0 - k <= 0) { fate = { type: "expired", at: times[k], node: route[k], idx: k }; break; }
      }
      attempts.push({ seq, route, times, start, fate, resend, ttl0 });
    }
    chunks.forEach((_, i) => plan(i + 1, ROUTES[i % ROUTES.length], i, false));
    let tEnd = Math.max(...attempts.map((a) => a.fate.at));
    const missing = attempts.filter((a) => a.fate.type !== "arrived").map((a) => a.seq);
    const resendAt = tEnd + 1;
    missing.forEach((seq, j) => plan(seq, ROUTES[0], resendAt + 1 + j, true));
    const last = Math.max(...attempts.map((a) => a.fate.at));
    return { chunks, N, attempts, missing, resendAt, last, ttl0 };
  }

  function stateAt(a, t) {
    if (t < a.start) return { status: "waiting" };
    if (t >= a.fate.at) {
      const p = NODE[a.fate.node];
      return { status: a.fate.type, x: p[0], y: p[1], ttl: a.ttl0 - Math.min(a.fate.idx, a.route.length - 2), node: a.fate.node, final: true };
    }
    for (let k = 0; k < a.route.length - 1; k++) {
      if (t >= a.times[k] && t < a.times[k + 1]) {
        const f = (t - a.times[k]) / (a.times[k + 1] - a.times[k]);
        const p = NODE[a.route[k]], q = NODE[a.route[k + 1]];
        const fr = t === a.times[k] && k > 0 ? 0.15 : Math.max(f, 0.15);
        return { status: "transit", x: p[0] + (q[0] - p[0]) * fr, y: p[1] + (q[1] - p[1]) * fr, ttl: a.ttl0 - k, node: a.route[k] };
      }
    }
    return { status: "transit", x: 0, y: 0, ttl: a.ttl0 };
  }

  function eventsAt(sim, t) {
    const ev = [];
    sim.attempts.forEach((a) => {
      const tag = "Packet " + a.seq + (a.resend ? " (resent)" : "");
      if (t === a.start) ev.push(tag + " leaves A towards " + a.route[1] + ". TTL = " + a.ttl0 + ".");
      for (let k = 1; k < a.route.length - 1; k++) {
        if (a.times[k] !== t) continue;
        if (a.fate.idx === k && a.fate.type === "dropped") ev.push("✗ " + tag + ": router " + a.route[k] + "'s queue is full (congestion), so the packet is dropped.");
        else if (a.fate.idx === k && a.fate.type === "expired") ev.push("✗ " + tag + ": " + a.route[k] + " decrements TTL to 0, so it discards the packet (TTL stops packets circulating for ever).");
        else if (k < a.fate.idx || a.fate.type === "arrived") ev.push(a.route[k] + " reads the destination IP of " + tag.toLowerCase() + ", decrements TTL " + (a.ttl0 - k + 1) + " → " + (a.ttl0 - k) + " and forwards it to " + a.route[k + 1] + ".");
      }
      if (a.fate.type === "arrived" && a.fate.at === t) ev.push("✓ " + tag + " arrives at B.");
    });
    if (t === sim.resendAt && sim.missing.length) ev.push("B has not received packet" + (sim.missing.length > 1 ? "s " : " ") + sim.missing.join(", ") + ", so it has not acknowledged " + (sim.missing.length > 1 ? "them" : "it") + ". A's timer runs out and A retransmits.");
    return ev;
  }

  CS.registerTool({
    id: "packet-switching",
    title: "Packet switching simulator",
    section: "9",
    topic: "9.3",
    icon: "✉️",
    desc: "Split a message into packets, send them by different routes, and watch out-of-order arrival, a lost packet being resent, TTL and reassembly.",
    help: "Type a message and choose a packet size, then step with **Next** or press **Play**. Each packet is routed **independently**: routers choose the next hop for every packet, so packets take different routes and can **arrive out of order**. The receiver puts them back in order using the **sequence number** in each header. With **congestion** on, packet 3 is dropped and has to be retransmitted. Set the starting **TTL** to 4 to see a packet on the longest route discarded when its TTL reaches 0. Use **Inspect** to see a packet's header, payload and trailer.",
    mount(el, params) {
      const h = CS.util.el;
      const controls = h("div", { class: "controls" });
      const msgIn = h("input", { type: "text", value: params.message || "SEND MORE PIZZA", maxlength: "40", "aria-label": "Message", style: "width:170px" });
      const sizeSel = h("select", { "aria-label": "Payload size" });
      [2, 3, 4, 5, 6].forEach((n) => sizeSel.appendChild(h("option", { value: n, text: n + " chars/packet" })));
      sizeSel.value = "3";
      const ttlSel = h("select", { "aria-label": "Starting TTL" });
      [64, 4].forEach((n) => ttlSel.appendChild(h("option", { value: n, text: "TTL " + n })));
      const cong = h("input", { type: "checkbox", checked: "checked" });
      const congL = h("label", null, [cong, "congestion"]);
      const go = h("button", { class: "btn sm primary", type: "button", text: "Send" });
      controls.append(msgIn, sizeSel, ttlSel, congL, go);
      const steps = h("div", { class: "controls" });
      const back = h("button", { class: "btn sm", type: "button", text: "◀ Back" });
      const next = h("button", { class: "btn sm primary", type: "button", text: "Next ▶" });
      const play = h("button", { class: "btn sm", type: "button", text: "▶▶ Play" });
      const end = h("button", { class: "btn sm ghost", type: "button", text: "Skip to end" });
      steps.append(back, next, play, end);
      const err = h("div", { class: "err" });
      const stat = h("div", { class: "stat-line" });
      const svgWrap = h("div");
      const log = h("div", { class: "output", style: "white-space:normal;font-family:inherit;min-height:70px" });
      const grid = h("div", { class: "two-col", style: "margin-top:12px" });
      const tableBox = h("div", { class: "table-wrap" });
      const right = h("div");
      grid.append(tableBox, right);
      const inspectRow = h("div", { class: "controls", style: "margin-top:12px" });
      const insSel = h("select", { "aria-label": "Packet to inspect" });
      inspectRow.append(h("label", null, ["Inspect", insSel]));
      const insBox = h("div", { style: "display:flex;flex-wrap:wrap;gap:4px" });
      const note = h("details", { class: "collapse", style: "margin-top:12px" });
      note.innerHTML = "<summary>Compare: circuit switching</summary><div class='collapse-body'><p>In <b>circuit switching</b> (the old telephone network) a dedicated path is set up between the two ends for the whole conversation. All data follows the same path and arrives in order, with a fixed delay.</p><ul><li><b>Circuit switching</b>: path reserved even when nothing is being sent (wasteful); fails if any link on the path fails; predictable delay suits live voice.</li><li><b>Packet switching</b>: links shared by many users, so capacity is used efficiently; packets are rerouted round failures or congestion; but packets can arrive out of order or be lost, so they must carry sequence numbers and be reassembled, and missing ones resent.</li></ul></div>";
      el.append(controls, err, steps, stat, svgWrap, log, grid, inspectRow, insBox, note);

      let sim, t = 0, timer = null, history = [];
      function build() {
        stop();
        const msg = msgIn.value.replace(/\s+$/, "");
        if (!msg) { err.textContent = "Type a message to send."; return false; }
        err.textContent = "";
        sim = simulate(msg, +sizeSel.value, +ttlSel.value, cong.checked);
        t = -1; history = [];
        insSel.innerHTML = "";
        sim.chunks.forEach((_, i) => insSel.appendChild(h("option", { value: i + 1, text: "packet " + (i + 1) })));
        insSel.value = String(Math.min(3, sim.N));
        return true;
      }
      const maxT = () => sim.last + 1;
      function drawSVG() {
        let g = '<svg viewBox="0 0 630 280" style="width:100%;height:auto;display:block" role="img" aria-label="Network of routers between computer A and computer B with packets in transit"><g font-family="inherit" font-size="14" fill="currentColor">';
        Object.keys(DELAY).forEach((k) => {
          const [a, b] = k.split("-"), p = NODE[a], q = NODE[b];
          g += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="currentColor" stroke-opacity="0.45" stroke-width="' + (DELAY[k] > 1 ? 1 : 2.5) + '"' + (DELAY[k] > 1 ? ' stroke-dasharray="6 4"' : "") + "/>";
        });
        Object.keys(NODE).forEach((k) => {
          const [x, y] = NODE[k], host = k === "A" || k === "B";
          g += host ? '<rect x="' + (x - 28) + '" y="' + (y - 20) + '" width="56" height="40" rx="6" style="fill:var(--accent-soft);stroke:var(--accent)"/>' : '<circle cx="' + x + '" cy="' + y + '" r="22" style="fill:var(--bg-2);stroke:currentColor"/>';
          g += '<text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" font-weight="bold">' + k + "</text>";
        });
        const crowd = {};
        sim.attempts.forEach((a) => {
          const s = stateAt(a, t);
          if (s.status === "waiting" || (s.final && s.status === "arrived")) return;
          const key = Math.round(s.x) + "," + Math.round(s.y), n = (crowd[key] = (crowd[key] || 0) + 1) - 1;
          const x = s.x + (n % 3) * 15 - 8, y = s.y - 30 - Math.floor(n / 3) * 16;
          const bad = s.status === "dropped" || s.status === "expired";
          g += '<circle cx="' + x + '" cy="' + y + '" r="10" style="fill:var(--' + (bad ? "bad" : a.resend ? "ok" : "warn") + ');stroke:currentColor"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11" style="fill:var(--surface);font-weight:700">' + (bad ? "✗" : a.seq) + "</text>";
        });
        g += '<text x="315" y="272" text-anchor="middle" font-size="12">dashed links are slower (congested); every router picks the next hop for each packet</text></g></svg>';
        svgWrap.innerHTML = g;
      }
      function latest(seq) {
        const list = sim.attempts.filter((a) => a.seq === seq && a.start <= Math.max(t, 0));
        return list.length ? list[list.length - 1] : sim.attempts.find((a) => a.seq === seq);
      }
      function render() {
        drawSVG();
        stat.textContent = t < 0 ? sim.N + " packets ready to send. Press Next." : "Tick " + t + (t >= maxT() ? " · finished" : "");
        if (t >= 0 && !history[t]) history[t] = eventsAt(sim, t);
        const evs = t < 0 ? ["The message has been split into " + sim.N + " packets of up to " + sizeSel.value + " characters. Each gets a header with the source and destination IP addresses, a sequence number and a TTL."] : t >= maxT() ? ["All packets received. B puts them in order by sequence number and reassembles the message: “" + sim.chunks.join("") + "”."] : history[t].length ? history[t] : ["Packets are travelling along the links."];
        log.innerHTML = evs.map((e) => "<div>" + CS.util.esc(e) + "</div>").join("");
        // table
        let rows = "";
        const arrivedOrder = [];
        sim.attempts.filter((a) => a.fate.type === "arrived" && a.fate.at <= t).sort((x, y) => x.fate.at - y.fate.at || x.seq - y.seq).forEach((a) => arrivedOrder.push(a.seq));
        sim.chunks.forEach((c, i) => {
          const a = latest(i + 1), s = stateAt(a, Math.max(t, 0));
          const label = t < 0 || s.status === "waiting" ? "waiting at A" : s.status === "transit" ? "at/after " + s.node : s.status === "arrived" ? "arrived ✓" : s.status === "dropped" ? "dropped ✗" : "TTL expired ✗";
          rows += "<tr><td>" + (i + 1) + "</td><td><code>" + CS.util.esc(c) + "</code></td><td>" + a.route.slice(1, -1).join("→") + (a.resend ? " (resent)" : "") + "</td><td>" + (t < 0 || s.status === "waiting" ? a.ttl0 : s.ttl) + "</td><td>" + label + "</td></tr>";
        });
        tableBox.innerHTML = "<table><thead><tr><th>Seq</th><th>Payload</th><th>Route</th><th>TTL</th><th>Status</th></tr></thead><tbody>" + rows + "</tbody></table>";
        right.innerHTML = "";
        right.appendChild(h("div", { class: "stat-line", text: "Arrival order at B: " + (arrivedOrder.join(", ") || "—") }));
        const slots = h("div", { class: "cells" });
        const got = new Set(arrivedOrder);
        sim.chunks.forEach((c, i) => slots.appendChild(h("div", { class: "cell" + (got.has(i + 1) ? " ok" : " dim"), title: "sequence " + (i + 1), text: got.has(i + 1) ? c.replace(/ /g, "·") : i + 1 })));
        right.appendChild(h("div", { class: "stat-line", text: "B's buffer, by sequence number:" }));
        right.appendChild(slots);
        const ooo = arrivedOrder.some((v, i) => i > 0 && v < arrivedOrder[i - 1]);
        right.appendChild(h("div", { class: "explain", text: t >= maxT() ? "Reassembled: “" + sim.chunks.join("") + "”" : ooo ? "Packets have arrived out of order, so B must sort them by sequence number." : "B waits until it holds every sequence number from 1 to " + sim.N + "." }));
        // inspect
        const seq = +insSel.value || 1, a = latest(seq), s = stateAt(a, Math.max(t, 0)), pay = sim.chunks[seq - 1], cs = checksum(pay);
        const box = (c, title, lines) => h("div", { style: "border:2px solid var(--" + c + ");background:var(--" + c + "-soft);border-radius:8px;padding:4px 8px;font-family:var(--font-mono);font-size:0.8rem;min-width:0;overflow-wrap:anywhere" }, [h("div", { style: "font-weight:700", text: title })].concat(lines.map((l) => h("div", { text: l }))));
        insBox.innerHTML = "";
        insBox.append(
          box("warn", "Header", ["source IP " + SRC, "destination IP " + DST, "protocol TCP", "packet " + seq + " of " + sim.N, "TTL " + (t < 0 || s.status === "waiting" ? a.ttl0 : s.ttl)]),
          box("accent", "Payload", ["“" + pay + "”"]),
          box("ok", "Trailer", ["checksum " + cs + " (0x" + cs.toString(16).toUpperCase().padStart(2, "0") + ")", "= sum of character codes mod 256"])
        );
        back.disabled = t < 0; next.disabled = t >= maxT();
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; play.textContent = "▶▶ Play"; } }
      back.addEventListener("click", () => { stop(); if (t > -1) { t--; render(); } });
      next.addEventListener("click", () => { stop(); if (t < maxT()) { t++; render(); } });
      end.addEventListener("click", () => { stop(); t = maxT(); render(); });
      play.addEventListener("click", () => {
        if (timer) return stop();
        if (t >= maxT()) t = -1;
        play.textContent = "❚❚ Pause";
        timer = setInterval(() => { if (!el.isConnected || t >= maxT()) return stop(); t++; render(); }, 900);
      });
      go.addEventListener("click", () => { if (build()) render(); });
      [sizeSel, ttlSel, cong].forEach((c) => c.addEventListener("change", () => { if (build()) render(); }));
      msgIn.addEventListener("keydown", (e) => { if (e.key === "Enter") go.click(); });
      insSel.addEventListener("change", render);
      if (build()) render();
    },
  });
})();
