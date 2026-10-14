/* Turing machine: editable δ(state, read) = (next, write, move) rules, tape with head, step/run, log in AQA notation, state diagram. */
(function () {
  let uid = 0;
  const B = "□";
  const PRESETS = {
    invert: { label: "Bit inverter", start: "S0", tape: "1011", head: 0,
      rules: [["S0", "0", "S0", "1", "R"], ["S0", "1", "S0", "0", "R"], ["S0", B, "halt", B, "L"]],
      note: "Flips every bit until it reads a blank, then halts." },
    increment: { label: "Unary increment (add a 1)", start: "S0", tape: "111", head: 0,
      rules: [["S0", "1", "S0", "1", "R"], ["S0", B, "halt", "1", "L"]],
      note: "Moves right over the 1s and writes a 1 on the first blank: n becomes n + 1." },
    add: { label: "Unary addition (11+111 → 11111)", start: "S0", tape: "11+111", head: 0,
      rules: [["S0", "1", "S0", "1", "R"], ["S0", "+", "S1", "1", "R"], ["S1", "1", "S1", "1", "R"], ["S1", B, "S2", B, "L"], ["S2", "1", "halt", B, "L"]],
      note: "Replace + with 1 (one too many 1s), then erase the last 1." },
    anbn: { label: "0ⁿ1ⁿ checker (accept / reject)", start: "S0", tape: "0011", head: 0,
      rules: [["S0", "0", "S1", "X", "R"], ["S0", "Y", "S3", "Y", "R"], ["S0", B, "accept", B, "R"], ["S0", "1", "reject", "1", "R"],
        ["S1", "0", "S1", "0", "R"], ["S1", "Y", "S1", "Y", "R"], ["S1", "1", "S2", "Y", "L"], ["S1", B, "reject", B, "R"],
        ["S2", "0", "S2", "0", "L"], ["S2", "Y", "S2", "Y", "L"], ["S2", "X", "S0", "X", "R"],
        ["S3", "Y", "S3", "Y", "R"], ["S3", B, "accept", B, "R"], ["S3", "0", "reject", "0", "R"], ["S3", "1", "reject", "1", "R"]],
      note: "Marks a 0 as X, walks right to mark the matching 1 as Y, returns, repeats. A Turing machine can count — a finite state machine cannot." },
  };
  const MAX_STEPS = 1000;

  CS.registerTool({
    id: "turing-machine",
    title: "Turing machine simulator",
    section: "4",
    topic: "4.8",
    icon: "📼",
    desc: "Write transition rules in AQA δ notation, set up a tape and watch the head read, write and move until the machine halts.",
    help: "Rules follow the AQA form **δ(current state, symbol read) = (next state, symbol to write, move L/R)**. Edit them in the table (or load a preset), type a tape (use `□` or `_` for a blank), choose where the head starts and press **▶ Step**. Each line in the log is one transition in δ notation — exactly how you should write a trace in the exam.\n\nThe machine **halts** when it enters a state that has no rules leaving it (e.g. `halt`, `accept`, `reject`) or when no rule matches what it reads. A run is capped at " + MAX_STEPS + " steps because, in general, you cannot decide in advance whether a Turing machine will halt (the halting problem).\n\nNotice how the 0ⁿ1ⁿ checker uses the tape as memory by marking symbols: that is why a Turing machine is more powerful than a finite state machine.",
    mount(el, params) {
      const h = CS.util.el;
      const esc = CS.util.esc;
      const svgNS = "http://www.w3.org/2000/svg";
      const myId = "tm" + ++uid;
      let rules = [];
      let startState = "S0";
      let tapeText = "";
      let headStart = 0;
      let tm = null; // { cells: {pos:sym}, head, state, steps, halted, reason }
      let timer = null;

      /* ---------- UI ---------- */
      const presetSel = h("select", { "aria-label": "Preset machine" });
      Object.keys(PRESETS).forEach((k) => presetSel.appendChild(h("option", { value: k, text: PRESETS[k].label })));
      const tapeIn = h("input", { type: "text", "aria-label": "Tape contents", style: "width:150px;font-family:var(--font-mono)", placeholder: "tape e.g. 1011" });
      const headIn = h("input", { type: "number", "aria-label": "Head start position", min: "0", style: "width:70px" });
      const startIn = h("input", { type: "text", "aria-label": "Start state", style: "width:70px" });
      const applyBtn = h("button", { class: "btn sm", type: "button", text: "Load tape" });
      const top = h("div", { class: "controls" }, [h("label", { text: "Preset " }, presetSel), h("label", { text: "Tape " }, tapeIn), h("label", { text: "Head at " }, headIn), h("label", { text: "Start state " }, startIn), applyBtn]);
      const errBox = h("div", { class: "err", style: "display:none;margin-bottom:8px" });
      const note = h("div", { class: "explain", style: "margin:0 0 8px" });
      const tapeView = h("div", { style: "overflow-x:auto;padding:28px 4px 6px" });
      const stepBtn = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
      const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
      const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
      const speedSel = h("select", { "aria-label": "Run speed" });
      [["800", "slow"], ["350", "normal"], ["80", "fast"]].forEach(([v, t]) => speedSel.appendChild(h("option", { value: v, text: t })));
      speedSel.value = "350";
      const runCtl = h("div", { class: "controls" }, [stepBtn, runBtn, resetBtn, h("label", { text: "Speed " }, speedSel)]);
      const status = h("div", { class: "stat-line" });
      const log = h("div", { class: "output", style: "max-height:220px;overflow-y:auto;min-height:60px" });
      const lower = h("div", { class: "two-col", style: "margin-top:12px" });
      const ruleBox = h("div", { style: "min-width:0" });
      const diagWrap = h("div", { style: "overflow-x:auto;min-width:0" });
      lower.append(ruleBox, diagWrap);
      el.append(top, errBox, note, tapeView, runCtl, status, log, lower);

      /* ---------- model ---------- */
      function normTape(s) {
        return s.replace(/[_ ]/g, B);
      }
      function loadPreset(key) {
        const p = PRESETS[key];
        rules = p.rules.map((r) => ({ state: r[0], read: r[1], next: r[2], write: r[3], move: r[4] }));
        startState = p.start;
        tapeIn.value = p.tape;
        headIn.value = String(p.head);
        startIn.value = p.start;
        note.textContent = p.note;
        applyTape();
        renderRules();
      }
      function statesOf() {
        const s = [];
        const add = (x) => x && !s.includes(x) && s.push(x);
        add(startState);
        rules.forEach((r) => {
          add(r.state);
          add(r.next);
        });
        return s;
      }
      function isHalting(state) {
        return !rules.some((r) => r.state === state);
      }
      function validate() {
        const errs = [];
        if (!startState) errs.push("Enter a start state.");
        const seen = {};
        rules.forEach((r, i) => {
          if (!r.state || !r.next) errs.push("Rule " + (i + 1) + " needs a current and next state.");
          if (r.read.length !== 1 || r.write.length !== 1) errs.push("Rule " + (i + 1) + ": read and write symbols must be single characters (use □ for blank).");
          const k = r.state + "\u0000" + r.read;
          if (seen[k]) errs.push("Two rules for δ(" + r.state + ", " + r.read + ") — a Turing machine is deterministic, keep one.");
          seen[k] = true;
        });
        if (startState && isHalting(startState) && rules.length) errs.push("The start state “" + startState + "” has no rules, so the machine halts immediately.");
        return errs;
      }
      function applyTape() {
        stopTimer();
        tapeText = normTape(tapeIn.value);
        headStart = Math.max(0, parseInt(headIn.value, 10) || 0);
        startState = startIn.value.trim();
        const cells = {};
        for (let i = 0; i < tapeText.length; i++) if (tapeText[i] !== B) cells[i] = tapeText[i];
        tm = { cells, head: headStart, state: startState, steps: 0, halted: false, reason: "" };
        log.textContent = "Tape loaded: " + (tapeText || "(blank)") + ". Head at cell " + headStart + ", state " + startState + ".";
        const errs = validate();
        showErr(errs);
        renderTape();
        renderStatus();
        renderDiagram();
      }
      function readAt(pos) {
        return tm.cells[pos] === undefined ? B : tm.cells[pos];
      }
      function tapeString() {
        const ks = Object.keys(tm.cells).map(Number);
        if (!ks.length) return B;
        const lo = Math.min(...ks, tm.head), hi = Math.max(...ks, tm.head);
        let s = "";
        for (let i = lo; i <= hi; i++) s += i === tm.head ? "[" + readAt(i) + "]" : readAt(i);
        return s;
      }
      function step() {
        if (!tm || tm.halted) return;
        if (validate().length) return;
        if (isHalting(tm.state)) {
          tm.halted = true;
          tm.reason = "HALTED: state " + tm.state + " has no transitions.";
          say("Machine halts in state " + tm.state + " after " + tm.steps + " step" + (tm.steps === 1 ? "" : "s") + ". Tape: " + finalTape());
          finish();
          return;
        }
        const sym = readAt(tm.head);
        const r = rules.find((x) => x.state === tm.state && x.read === sym);
        if (!r) {
          tm.halted = true;
          tm.reason = "HALTED: no rule for δ(" + tm.state + ", " + sym + ").";
          say("No rule δ(" + tm.state + ", " + sym + ") is defined → the machine halts (undefined transition). Tape: " + finalTape());
          finish();
          return;
        }
        tm.steps++;
        const before = tapeString();
        if (r.write === B) delete tm.cells[tm.head];
        else tm.cells[tm.head] = r.write;
        tm.head += r.move === "L" ? -1 : 1;
        tm.state = r.next;
        say("Step " + tm.steps + ": δ(" + r.state + ", " + r.read + ") = (" + r.next + ", " + r.write + ", " + r.move + ")   " + before + " → " + tapeString());
        if (tm.steps >= MAX_STEPS) {
          tm.halted = true;
          tm.reason = "Stopped after " + MAX_STEPS + " steps — it may never halt (halting problem!).";
          say(tm.reason);
          finish();
          return;
        }
        if (isHalting(tm.state)) {
          tm.halted = true;
          tm.reason = "HALTED in state " + tm.state + " after " + tm.steps + " steps.";
          say("Entered " + tm.state + ", which has no rules → machine HALTS. Final tape: " + finalTape());
          finish();
          return;
        }
        renderTape();
        renderStatus();
        renderDiagram();
      }
      function finalTape() {
        const ks = Object.keys(tm.cells).map(Number);
        if (!ks.length) return "(all blank)";
        let s = "";
        for (let i = Math.min(...ks); i <= Math.max(...ks); i++) s += readAt(i);
        return s;
      }
      function finish() {
        stopTimer();
        renderTape();
        renderStatus();
        renderDiagram();
      }
      function say(line) {
        log.textContent += "\n" + line;
        log.scrollTop = log.scrollHeight;
      }
      function stopTimer() {
        if (timer) clearInterval(timer);
        timer = null;
        runBtn.textContent = "⏩ Run";
      }
      function showErr(errs) {
        errBox.style.display = errs.length ? "" : "none";
        errBox.innerHTML = errs.map((e) => "• " + esc(e)).join("<br>");
      }

      /* ---------- rendering ---------- */
      function renderTape() {
        tapeView.innerHTML = "";
        if (!tm) return;
        const ks = Object.keys(tm.cells).map(Number);
        const lo = Math.min(tm.head, ks.length ? Math.min(...ks) : tm.head) - 2;
        const hi = Math.max(tm.head, ks.length ? Math.max(...ks) : tm.head) + 2;
        const strip = h("div", { class: "cells", style: "flex-wrap:nowrap;align-items:flex-start" });
        for (let i = lo; i <= hi; i++) {
          const isHead = i === tm.head;
          const col = h("div", { style: "position:relative;display:flex;flex-direction:column;align-items:center;gap:2px" });
          if (isHead) col.appendChild(h("div", { style: "position:absolute;top:-26px;font-size:0.72rem;font-weight:700;color:var(--accent);white-space:nowrap", text: "▼ " + tm.state }));
          col.append(h("div", { class: "cell" + (isHead ? " active" : readAt(i) === B ? " dim" : ""), text: readAt(i) }), h("span", { class: "bit-label", text: String(i) }));
          strip.appendChild(col);
        }
        tapeView.appendChild(strip);
      }
      function renderStatus() {
        if (!tm) return;
        status.textContent = "State: " + tm.state + "   head: " + tm.head + "   reads: " + readAt(tm.head) + "   steps: " + tm.steps + (tm.halted ? "   ⇒ " + tm.reason : "");
        status.className = "stat-line" + (tm.halted && /accept/i.test(tm.state) ? " ok-text" : "");
        status.style.color = tm.halted && /reject/i.test(tm.state) ? "var(--bad)" : "";
      }
      function renderRules() {
        ruleBox.innerHTML = "";
        const t = h("table", {});
        t.appendChild(h("tr", {}, ["State", "Read", "Next", "Write", "Move", ""].map((x) => h("th", { text: x }))));
        const inp = (val, w, cb, label) => {
          const i = h("input", { type: "text", value: val, "aria-label": label, style: "width:" + w + "px;font-family:var(--font-mono)" });
          i.addEventListener("change", () => {
            cb(i.value.trim());
            applyTape();
            renderRules();
          });
          return i;
        };
        rules.forEach((r, i) => {
          const mv = h("select", { "aria-label": "Move" });
          mv.appendChild(h("option", { value: "L", text: "L" }));
          mv.appendChild(h("option", { value: "R", text: "R" }));
          mv.value = r.move;
          mv.addEventListener("change", () => {
            r.move = mv.value;
            applyTape();
            renderDiagram();
          });
          const del = h("button", { class: "btn sm ghost", type: "button", text: "✕", "aria-label": "Remove rule" });
          del.addEventListener("click", () => {
            rules.splice(i, 1);
            applyTape();
            renderRules();
          });
          const row = h("tr", {}, [
            h("td", {}, inp(r.state, 60, (v) => (r.state = v), "Current state")),
            h("td", {}, inp(r.read, 40, (v) => (r.read = normTape(v) || B), "Symbol read")),
            h("td", {}, inp(r.next, 60, (v) => (r.next = v), "Next state")),
            h("td", {}, inp(r.write, 40, (v) => (r.write = normTape(v) || B), "Symbol to write")),
            h("td", {}, mv),
            h("td", {}, del),
          ]);
          if (tm && !tm.halted && r.state === tm.state && r.read === readAt(tm.head)) row.style.background = "var(--accent-soft)";
          t.appendChild(row);
        });
        const add = h("button", { class: "btn sm", type: "button", text: "+ Add rule" });
        add.addEventListener("click", () => {
          rules.push({ state: rules.length ? rules[rules.length - 1].state : startState, read: B, next: "halt", write: B, move: "R" });
          applyTape();
          renderRules();
        });
        ruleBox.append(h("div", { class: "small muted", text: "Transition rules  δ(state, read) = (next, write, move)" }), h("div", { class: "table-wrap" }, t), add);
      }
      function sv(tag, attrs) {
        const e = document.createElementNS(svgNS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
      }
      function renderDiagram() {
        diagWrap.innerHTML = "";
        const names = statesOf();
        if (!names.length) return;
        const n = names.length, W = 420, r = 22;
        let H = n <= 2 ? 200 : 300;
        const cx = W / 2, cy = H / 2 + 10, R = n === 1 ? 0 : n === 2 ? 110 : Math.min(118, 26 * n + 30);
        const pos = {};
        names.forEach((s, i) => {
          const a = -Math.PI / 2 + (2 * Math.PI * i) / n + (n === 2 ? Math.PI / 2 : 0);
          pos[s] = { x: Math.round(cx + R * Math.cos(a)), y: Math.round(cy + R * Math.sin(a)) };
        });
        const ys = Object.values(pos).map((p) => p.y), shift = 78 - Math.min(...ys);
        Object.values(pos).forEach((p) => (p.y += shift)); // leave room above for self-loops and their labels
        H = Math.max(...ys) + shift + 52;
        const svg = sv("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "State transition diagram", style: "width:100%;max-width:460px;display:block;margin:0 auto;color:var(--text);font-family:inherit" });
        const defs = sv("defs", {});
        const mk = sv("marker", { id: myId + "a", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
        mk.appendChild(sv("path", { d: "M0,0 L10,5 L0,10 z", fill: "currentColor" }));
        defs.appendChild(mk);
        svg.appendChild(defs);
        const arrow = "url(#" + myId + "a)";
        const groups = {};
        rules.forEach((x) => {
          const k = x.state + "→" + x.next;
          (groups[k] = groups[k] || { from: x.state, to: x.next, labels: [] }).labels.push(x.read + "/" + x.write + "," + x.move);
        });
        const cur = tm ? tm.state : null;
        Object.values(groups).forEach((g) => {
          const a = pos[g.from], b = pos[g.to];
          if (!a || !b) return;
          let d, lx, ly;
          if (g.from === g.to) {
            d = "M" + (a.x - 9) + "," + (a.y - r + 2) + " C" + (a.x - 38) + "," + (a.y - r - 42) + " " + (a.x + 38) + "," + (a.y - r - 42) + " " + (a.x + 9) + "," + (a.y - r + 2);
            lx = a.x;
            ly = a.y - r - 36;
          } else {
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len, bend = 26;
            const c = { x: (a.x + b.x) / 2 + nx * bend, y: (a.y + b.y) / 2 + ny * bend };
            const u1 = { x: c.x - a.x, y: c.y - a.y }, l1 = Math.hypot(u1.x, u1.y) || 1, u2 = { x: b.x - c.x, y: b.y - c.y }, l2 = Math.hypot(u2.x, u2.y) || 1;
            d = "M" + (a.x + (u1.x / l1) * r).toFixed(1) + "," + (a.y + (u1.y / l1) * r).toFixed(1) + " Q" + c.x.toFixed(1) + "," + c.y.toFixed(1) + " " + (b.x - (u2.x / l2) * (r + 2)).toFixed(1) + "," + (b.y - (u2.y / l2) * (r + 2)).toFixed(1);
            lx = (a.x + b.x) / 2 + nx * (bend * 0.5 + 10);
            ly = (a.y + b.y) / 2 + ny * (bend * 0.5 + 10);
          }
          svg.appendChild(sv("path", { d, fill: "none", stroke: "currentColor", "stroke-width": 1.5, "marker-end": arrow }));
          g.labels.forEach((lab, i) => {
            const y = ly + (i - (g.labels.length - 1) / 2) * 13;
            svg.appendChild(sv("rect", { x: lx - lab.length * 3.6 - 2, y: y - 6.5, width: lab.length * 7.2 + 4, height: 13, rx: 3, fill: "var(--surface)", "fill-opacity": "0.9" }));
            const t = sv("text", { x: lx, y, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": "11", "font-family": "var(--font-mono)", fill: "currentColor" });
            t.textContent = lab;
            svg.appendChild(t);
          });
        });
        names.forEach((s) => {
          const p = pos[s], isCur = s === cur, halt = isHalting(s);
          if (s === startState) svg.appendChild(sv("path", { d: "M" + (p.x - r - 32) + "," + p.y + " L" + (p.x - r - 2) + "," + p.y, stroke: "currentColor", "stroke-width": 1.5, "marker-end": arrow }));
          svg.appendChild(sv("circle", { cx: p.x, cy: p.y, r, fill: isCur ? "var(--accent)" : "var(--surface)", stroke: isCur ? "var(--accent)" : "currentColor", "stroke-width": 2 }));
          if (halt) svg.appendChild(sv("circle", { cx: p.x, cy: p.y, r: r - 4, fill: "none", stroke: isCur ? "#fff" : "currentColor", "stroke-width": 1.5 }));
          const t = sv("text", { x: p.x, y: p.y, "text-anchor": "middle", "dominant-baseline": "central", "font-size": s.length > 4 ? "10" : "13", "font-weight": "700", fill: isCur ? "#fff" : "currentColor" });
          t.textContent = s;
          svg.appendChild(t);
        });
        diagWrap.append(h("div", { class: "small muted", text: "State transition diagram (labels: read/write,move; double circle = halting state)" }), svg);
      }

      /* ---------- wiring ---------- */
      presetSel.addEventListener("change", () => loadPreset(presetSel.value));
      applyBtn.addEventListener("click", () => {
        applyTape();
        renderRules();
      });
      tapeIn.addEventListener("keydown", (e) => e.key === "Enter" && applyBtn.click());
      stepBtn.addEventListener("click", () => {
        if (!tm || tm.halted) applyTape();
        step();
        renderRules();
      });
      runBtn.addEventListener("click", () => {
        if (timer) return stopTimer();
        if (!tm || tm.halted) applyTape();
        if (validate().length) return;
        runBtn.textContent = "⏸ Pause";
        timer = setInterval(() => {
          step();
          if (tm.halted) {
            stopTimer();
            renderRules();
          }
        }, parseInt(speedSel.value, 10));
      });
      resetBtn.addEventListener("click", () => {
        applyTape();
        renderRules();
      });
      loadPreset(params.preset && PRESETS[params.preset] ? params.preset : "invert");
    },
  });
})();
