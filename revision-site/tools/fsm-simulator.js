/* FSM simulator: editable finite state machine / Mealy machine with diagram, transition table and step-by-step run. */
(function () {
  let uid = 0;
  const PRESETS = {
    endsAB: {
      label: "FSA: strings ending in “ab”", type: "fsa",
      states: [{ name: "S0", start: true }, { name: "S1" }, { name: "S2", accept: true }],
      trans: [["S0", "a", "S1"], ["S0", "b", "S0"], ["S1", "a", "S1"], ["S1", "b", "S2"], ["S2", "a", "S1"], ["S2", "b", "S0"]],
      input: "aab",
    },
    inverter: {
      label: "Mealy: bit inverter", type: "mealy",
      states: [{ name: "S0", start: true }],
      trans: [["S0", "0", "S0", "1"], ["S0", "1", "S0", "0"]],
      input: "1011",
    },
    parity: {
      label: "FSA: even parity (even number of 1s)", type: "fsa",
      states: [{ name: "Even", start: true, accept: true }, { name: "Odd" }],
      trans: [["Even", "0", "Even"], ["Even", "1", "Odd"], ["Odd", "0", "Odd"], ["Odd", "1", "Even"]],
      input: "1101",
    },
    traffic: {
      label: "Controller: traffic lights (no accepting states)", type: "fsa",
      states: [{ name: "Red", start: true }, { name: "RedAmber" }, { name: "Green" }, { name: "Amber" }],
      trans: [["Red", "t", "RedAmber"], ["RedAmber", "t", "Green"], ["Green", "t", "Amber"], ["Amber", "t", "Red"], ["Green", "e", "Amber"], ["RedAmber", "e", "Red"]],
      input: "ttett",
    },
  };

  CS.registerTool({
    id: "fsm-simulator",
    title: "Finite state machine simulator",
    section: "4",
    topic: "4.2",
    icon: "🔁",
    desc: "Build a finite state machine (with or without outputs), run an input string one symbol at a time and read the transition table.",
    help: "Pick a **preset** or build your own: add states, tick which one is the **start state** (→) and which are **accepting** (double circle), then add transitions *from → to* on an input symbol. Switch to **Mealy machine** to add an output symbol to each transition (shown as `input/output`).\n\nType an input string and press **▶ Step** to consume one symbol at a time: the current state is highlighted and the log shows each move as `δ(state, symbol) = next`. An FSA **accepts** a string only if the whole string is consumed *and* it finishes in an accepting state; if a symbol has no transition the machine halts and rejects. A Mealy machine produces one output symbol per input symbol.\n\nThe **transition table** underneath is exactly what the exam asks you to complete — one row per state, one column per input symbol. **Export as table** gives a copy-and-paste version.",
    mount(el, params) {
      const h = CS.util.el;
      const esc = CS.util.esc;
      const svgNS = "http://www.w3.org/2000/svg";
      const myId = "fsm" + ++uid;
      let m = { type: "fsa", states: [], trans: [] };
      let run = null;
      let timer = null;
      let inputStr = "";

      /* ---------- UI skeleton ---------- */
      const presetSel = h("select", { "aria-label": "Preset machine" });
      Object.keys(PRESETS).forEach((k) => presetSel.appendChild(h("option", { value: k, text: PRESETS[k].label })));
      const typeSel = h("select", { "aria-label": "Machine type" });
      typeSel.appendChild(h("option", { value: "fsa", text: "FSA (accepting states)" }));
      typeSel.appendChild(h("option", { value: "mealy", text: "Mealy machine (outputs)" }));
      const exportBtn = h("button", { class: "btn sm", type: "button", text: "Export as table" });
      const top = h("div", { class: "controls" }, [h("label", { text: "Preset " }, presetSel), h("label", { text: "Type " }, typeSel), exportBtn]);
      const errBox = h("div", { class: "err", style: "margin:0 0 8px;display:none" });
      const svgWrap = h("div", { style: "overflow-x:auto" });
      const editor = h("div", { class: "two-col" });
      const stateBox = h("div");
      const transBox = h("div");
      editor.append(stateBox, transBox);

      const inputField = h("input", { type: "text", "aria-label": "Input string", placeholder: "input string", style: "width:150px;font-family:var(--font-mono)" });
      const stepBtn = h("button", { class: "btn sm primary", type: "button", text: "▶ Step" });
      const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run" });
      const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset" });
      const speedSel = h("select", { "aria-label": "Run speed" });
      [["1000", "slow"], ["500", "normal"], ["150", "fast"]].forEach(([v, t]) => speedSel.appendChild(h("option", { value: v, text: t })));
      speedSel.value = "500";
      const runCtl = h("div", { class: "controls", style: "margin-top:12px" }, [h("label", { text: "Input " }, inputField), stepBtn, runBtn, resetBtn, h("label", { text: "Speed " }, speedSel)]);
      const status = h("div", { class: "stat-line" });
      const log = h("div", { class: "output", style: "min-height:80px" });
      const tableWrap = h("div", { class: "table-wrap", style: "margin-top:12px" });
      const exportBox = h("textarea", { "aria-label": "Transition table as text", readonly: "readonly", style: "display:none;margin-top:8px;font-family:var(--font-mono);min-height:140px" });
      el.append(top, errBox, svgWrap, editor, runCtl, status, log, tableWrap, exportBox);

      /* ---------- model helpers ---------- */
      function loadPreset(key) {
        const p = PRESETS[key];
        m = { type: p.type, states: p.states.map((s) => ({ name: s.name, start: !!s.start, accept: !!s.accept })), trans: p.trans.map((t) => ({ from: t[0], input: t[1], to: t[2], output: t[3] || "" })) };
        typeSel.value = m.type;
        inputField.value = p.input;
        resetRun();
        renderAll();
      }
      function startState() {
        return m.states.find((s) => s.start) || null;
      }
      function symbols() {
        const set = [];
        m.trans.forEach((t) => t.input && !set.includes(t.input) && set.push(t.input));
        return set.sort();
      }
      function validate() {
        const errs = [];
        if (!m.states.length) errs.push("Add at least one state.");
        if (m.states.length && !startState()) errs.push("No start state: tick “start” on one state.");
        const names = m.states.map((s) => s.name);
        if (new Set(names).size !== names.length) errs.push("State names must be unique.");
        if (names.some((n) => !n)) errs.push("Every state needs a name.");
        const seen = {};
        m.trans.forEach((t) => {
          if (!t.input) errs.push("A transition has no input symbol.");
          else if (t.input.length !== 1) errs.push("Input symbol “" + t.input + "” must be a single character (add one transition per symbol).");
          if (!names.includes(t.from) || !names.includes(t.to)) errs.push("Transition " + t.from + " → " + t.to + " refers to a missing state.");
          const k = t.from + "\u0000" + t.input;
          if (seen[k]) errs.push("Non-deterministic: two transitions from " + t.from + " on “" + t.input + "”. An FSM must have at most one.");
          seen[k] = true;
          if (m.type === "mealy" && !t.output) errs.push("Mealy transition δ(" + t.from + ", " + t.input + ") needs an output symbol.");
        });
        return errs;
      }
      function findTrans(state, sym) {
        return m.trans.find((t) => t.from === state && t.input === sym) || null;
      }

      /* ---------- run engine ---------- */
      function stopTimer() {
        if (timer) clearInterval(timer);
        timer = null;
        runBtn.textContent = "⏩ Run";
      }
      function resetRun() {
        stopTimer();
        run = null;
        log.textContent = "";
        status.textContent = "";
      }
      function beginRun() {
        const errs = validate();
        if (errs.length) {
          showErr(errs);
          return false;
        }
        inputStr = inputField.value;
        run = { pos: 0, state: startState().name, output: "", done: false };
        log.textContent = "Start in state " + run.state + ". Input = “" + inputStr + "”" + (inputStr ? "" : " (empty string)") + ".";
        return true;
      }
      function say(line) {
        log.textContent += "\n" + line;
      }
      function step() {
        if (!run && !beginRun()) return;
        if (run.done) return;
        if (run.pos >= inputStr.length) {
          run.done = true;
          if (m.type === "mealy") {
            say("Input exhausted. Output string = “" + run.output + "”.");
            run.result = "Output: " + run.output;
          } else {
            const acc = m.states.some((s) => s.accept);
            const st = m.states.find((s) => s.name === run.state);
            if (!acc) {
              say("Input exhausted. Finished in state " + run.state + ". This FSM has no accepting states — it is a controller, so it neither accepts nor rejects.");
              run.result = "Finished in " + run.state;
            } else if (st && st.accept) {
              say("Input exhausted in state " + run.state + ", which IS an accepting state → ACCEPTED.");
              run.result = "ACCEPTED";
            } else {
              say("Input exhausted in state " + run.state + ", which is NOT an accepting state → REJECTED.");
              run.result = "REJECTED";
            }
          }
          stopTimer();
          renderDiagram();
          renderStatus();
          return;
        }
        const sym = inputStr[run.pos];
        const t = findTrans(run.state, sym);
        if (!t) {
          run.done = true;
          say("Read “" + sym + "” in state " + run.state + ": no transition δ(" + run.state + ", " + sym + ") is defined → the machine halts. String REJECTED.");
          run.result = "REJECTED (no transition)";
          stopTimer();
          renderDiagram();
          renderStatus();
          return;
        }
        if (m.type === "mealy") {
          say("δ(" + run.state + ", " + sym + ") = " + t.to + ", output " + t.output);
          run.output += t.output;
        } else say("δ(" + run.state + ", " + sym + ") = " + t.to + "   (read “" + sym + "”, move " + run.state + " → " + t.to + ")");
        run.prevState = run.state;
        run.lastSym = sym;
        run.state = t.to;
        run.pos++;
        renderDiagram();
        renderStatus();
      }
      function renderStatus() {
        if (!run) {
          status.textContent = "";
          return;
        }
        let s = "Current state: " + run.state + "   consumed: “" + inputStr.slice(0, run.pos) + "”   remaining: “" + inputStr.slice(run.pos) + "”";
        if (m.type === "mealy") s += "   output so far: “" + run.output + "”";
        if (run.done) s += "   ⇒ " + run.result;
        status.textContent = s;
        status.className = "stat-line" + (run.done ? run.result.startsWith("ACCEPTED") ? " ok-text" : run.result.startsWith("REJECTED") ? " err" : "" : "");
      }
      function showErr(errs) {
        errBox.style.display = errs.length ? "" : "none";
        errBox.innerHTML = errs.map((e) => "• " + esc(e)).join("<br>");
      }

      /* ---------- diagram ---------- */
      function layout() {
        const n = m.states.length;
        const W = 520, H = n <= 1 ? 160 : n <= 3 ? 240 : 300;
        const cx = W / 2, cy = H / 2 + 6;
        const R = n <= 1 ? 0 : n === 2 ? 110 : Math.min(120, 30 * n + 20);
        const pos = {};
        m.states.forEach((s, i) => {
          const ang = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(n, 1) + (n === 2 ? Math.PI / 2 : n === 3 ? Math.PI / 6 : 0);
          pos[s.name] = { x: Math.round(cx + R * Math.cos(ang)), y: Math.round(cy + R * Math.sin(ang)) };
        });
        return { pos, W, H };
      }
      function sv(tag, attrs) {
        const e = document.createElementNS(svgNS, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
      }
      function renderDiagram() {
        svgWrap.innerHTML = "";
        if (!m.states.length) {
          svgWrap.appendChild(h("div", { class: "muted small", text: "No states yet — add one below." }));
          return;
        }
        const { pos, W, H } = layout();
        const r = 24;
        const svg = sv("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "State transition diagram", style: "width:100%;max-width:560px;display:block;margin:0 auto;font-family:inherit" });
        const defs = sv("defs", {});
        const mk = sv("marker", { id: myId + "arr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "8", markerHeight: "8", orient: "auto-start-reverse" });
        mk.appendChild(sv("path", { d: "M0,0 L10,5 L0,10 z", fill: "currentColor" }));
        defs.appendChild(mk);
        svg.appendChild(defs);
        svg.style.color = "var(--text)";
        const arrow = "url(#" + myId + "arr)";
        /* group transitions by from→to */
        const groups = {};
        m.trans.forEach((t) => {
          const k = t.from + "→" + t.to;
          (groups[k] = groups[k] || { from: t.from, to: t.to, labels: [] }).labels.push(m.type === "mealy" ? t.input + "/" + (t.output || "?") : t.input);
        });
        const current = run ? run.state : null;
        Object.values(groups).forEach((g) => {
          const a = pos[g.from], b = pos[g.to];
          if (!a || !b) return;
          const label = g.labels.join(", ");
          let lx, ly, d;
          if (g.from === g.to) {
            d = "M" + (a.x - 10) + "," + (a.y - r + 2) + " C" + (a.x - 40) + "," + (a.y - r - 45) + " " + (a.x + 40) + "," + (a.y - r - 45) + " " + (a.x + 10) + "," + (a.y - r + 2);
            lx = a.x;
            ly = a.y - r - 38;
          } else {
            const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
            const nx = -dy / len, ny = dx / len; // perpendicular (right-hand side)
            const bend = 28;
            const c = { x: (a.x + b.x) / 2 + nx * bend, y: (a.y + b.y) / 2 + ny * bend };
            const u1 = { x: c.x - a.x, y: c.y - a.y }, l1 = Math.hypot(u1.x, u1.y) || 1;
            const u2 = { x: b.x - c.x, y: b.y - c.y }, l2 = Math.hypot(u2.x, u2.y) || 1;
            const p0 = { x: a.x + (u1.x / l1) * r, y: a.y + (u1.y / l1) * r };
            const p2 = { x: b.x - (u2.x / l2) * (r + 2), y: b.y - (u2.y / l2) * (r + 2) };
            d = "M" + p0.x.toFixed(1) + "," + p0.y.toFixed(1) + " Q" + c.x.toFixed(1) + "," + c.y.toFixed(1) + " " + p2.x.toFixed(1) + "," + p2.y.toFixed(1);
            lx = (a.x + b.x) / 2 + nx * (bend * 0.5 + 10);
            ly = (a.y + b.y) / 2 + ny * (bend * 0.5 + 10);
          }
          const active = !!(run && run.prevState === g.from && g.to === current && m.trans.some((t) => t.from === g.from && t.to === g.to && t.input === run.lastSym));
          svg.appendChild(sv("path", { d, fill: "none", stroke: active ? "var(--accent)" : "currentColor", "stroke-width": active ? 2.5 : 1.5, "marker-end": arrow }));
          const tx = sv("text", { x: lx, y: ly, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": "13", "font-family": "var(--font-mono)", fill: active ? "var(--accent)" : "currentColor" });
          tx.textContent = label;
          const bg = sv("rect", { x: lx - label.length * 4 - 3, y: ly - 8, width: label.length * 8 + 6, height: 16, rx: 3, fill: "var(--surface)", "fill-opacity": "0.9" });
          svg.append(bg, tx);
        });
        m.states.forEach((s) => {
          const p = pos[s.name];
          const isCur = s.name === current;
          if (s.start) svg.appendChild(sv("path", { d: "M" + (p.x - r - 34) + "," + p.y + " L" + (p.x - r - 2) + "," + p.y, stroke: "currentColor", "stroke-width": 1.5, "marker-end": arrow }));
          svg.appendChild(sv("circle", { cx: p.x, cy: p.y, r, fill: isCur ? "var(--accent)" : "var(--surface)", stroke: isCur ? "var(--accent)" : "currentColor", "stroke-width": 2 }));
          if (s.accept) svg.appendChild(sv("circle", { cx: p.x, cy: p.y, r: r - 4, fill: "none", stroke: isCur ? "#fff" : "currentColor", "stroke-width": 1.5 }));
          const t = sv("text", { x: p.x, y: p.y, "text-anchor": "middle", "dominant-baseline": "central", "font-size": s.name.length > 5 ? "10" : "13", "font-weight": "700", fill: isCur ? "#fff" : "currentColor" });
          t.textContent = s.name;
          svg.appendChild(t);
        });
        svgWrap.appendChild(svg);
      }

      /* ---------- editors ---------- */
      function renderEditors() {
        stateBox.innerHTML = "";
        transBox.innerHTML = "";
        const st = h("table", {});
        st.appendChild(h("tr", {}, [h("th", { text: "State" }), h("th", { text: "Start" }), h("th", { text: m.type === "mealy" ? "" : "Accepting" }), h("th", { text: "" })]));
        m.states.forEach((s, i) => {
          const name = h("input", { type: "text", value: s.name, "aria-label": "State name", style: "width:80px" });
          name.addEventListener("change", () => {
            const nv = name.value.trim().replace(/\s+/g, "");
            if (!nv) return renderAll();
            m.trans.forEach((t) => {
              if (t.from === s.name) t.from = nv;
              if (t.to === s.name) t.to = nv;
            });
            s.name = nv;
            resetRun();
            renderAll();
          });
          const start = h("input", { type: "radio", name: myId + "start", "aria-label": "Start state" });
          start.checked = !!s.start;
          start.addEventListener("change", () => {
            m.states.forEach((x) => (x.start = x === s));
            resetRun();
            renderAll();
          });
          const acc = h("input", { type: "checkbox", "aria-label": "Accepting state" });
          acc.checked = !!s.accept;
          acc.addEventListener("change", () => {
            s.accept = acc.checked;
            resetRun();
            renderAll();
          });
          const del = h("button", { class: "btn sm ghost", type: "button", text: "✕", "aria-label": "Remove state " + s.name });
          del.addEventListener("click", () => {
            m.states.splice(i, 1);
            m.trans = m.trans.filter((t) => t.from !== s.name && t.to !== s.name);
            resetRun();
            renderAll();
          });
          st.appendChild(h("tr", {}, [h("td", {}, name), h("td", {}, start), h("td", {}, m.type === "mealy" ? "" : acc), h("td", {}, del)]));
        });
        const addS = h("button", { class: "btn sm", type: "button", text: "+ Add state" });
        addS.addEventListener("click", () => {
          let n = 0;
          while (m.states.some((s) => s.name === "S" + n)) n++;
          m.states.push({ name: "S" + n, start: !m.states.length, accept: false });
          resetRun();
          renderAll();
        });
        stateBox.append(h("div", { class: "small muted", text: "States" }), h("div", { class: "table-wrap" }, st), addS);

        const tt = h("table", {});
        tt.appendChild(h("tr", {}, [h("th", { text: "From" }), h("th", { text: "Input" }), m.type === "mealy" ? h("th", { text: "Output" }) : null, h("th", { text: "To" }), h("th", { text: "" })].filter(Boolean)));
        const stateSel = (val, onChange) => {
          const sel = h("select", { "aria-label": "State" });
          m.states.forEach((s) => sel.appendChild(h("option", { value: s.name, text: s.name })));
          sel.value = val;
          sel.addEventListener("change", () => {
            onChange(sel.value);
            resetRun();
            renderAll();
          });
          return sel;
        };
        m.trans.forEach((t, i) => {
          const inp = h("input", { type: "text", value: t.input, maxlength: "1", "aria-label": "Input symbol", style: "width:44px;font-family:var(--font-mono)" });
          inp.addEventListener("change", () => {
            t.input = inp.value.trim();
            resetRun();
            renderAll();
          });
          const out = h("input", { type: "text", value: t.output, maxlength: "1", "aria-label": "Output symbol", style: "width:44px;font-family:var(--font-mono)" });
          out.addEventListener("change", () => {
            t.output = out.value.trim();
            resetRun();
            renderAll();
          });
          const del = h("button", { class: "btn sm ghost", type: "button", text: "✕", "aria-label": "Remove transition" });
          del.addEventListener("click", () => {
            m.trans.splice(i, 1);
            resetRun();
            renderAll();
          });
          tt.appendChild(h("tr", {}, [h("td", {}, stateSel(t.from, (v) => (t.from = v))), h("td", {}, inp), m.type === "mealy" ? h("td", {}, out) : null, h("td", {}, stateSel(t.to, (v) => (t.to = v))), h("td", {}, del)].filter(Boolean)));
        });
        const addT = h("button", { class: "btn sm", type: "button", text: "+ Add transition" });
        addT.addEventListener("click", () => {
          if (!m.states.length) return showErr(["Add a state first."]);
          m.trans.push({ from: m.states[0].name, input: "", to: m.states[0].name, output: "" });
          resetRun();
          renderAll();
        });
        transBox.append(h("div", { class: "small muted", text: "Transitions" + (m.type === "mealy" ? " (input / output)" : "") }), h("div", { class: "table-wrap" }, tt), addT);
      }

      /* ---------- transition table ---------- */
      function tableText() {
        const syms = symbols();
        const rows = [["State"].concat(syms.map((s) => "input " + s))];
        m.states.forEach((s) => {
          rows.push([(s.start ? "→ " : "") + s.name + (s.accept && m.type === "fsa" ? " *" : "")].concat(syms.map((x) => {
            const t = findTrans(s.name, x);
            return t ? t.to + (m.type === "mealy" ? " / " + t.output : "") : "—";
          })));
        });
        return rows;
      }
      function renderTable() {
        tableWrap.innerHTML = "";
        const rows = tableText();
        const tb = h("table", {});
        rows.forEach((r, i) => tb.appendChild(h("tr", {}, r.map((c) => h(i ? "td" : "th", { text: c, style: i ? "font-family:var(--font-mono)" : "" })))));
        tableWrap.append(h("div", { class: "small muted", style: "padding:6px 10px 0", text: "State transition table" + (m.type === "mealy" ? " (next state / output)" : " (→ start, * accepting)") }), tb);
        const widths = rows[0].map((_, c) => Math.max(...rows.map((r) => r[c].length)));
        const line = (r) => "| " + r.map((c, i) => c + " ".repeat(widths[i] - c.length)).join(" | ") + " |";
        exportBox.value = [line(rows[0]), "|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|"].concat(rows.slice(1).map(line)).join("\n") + "\n\n" + m.trans.map((t) => "δ(" + t.from + ", " + t.input + ") = " + t.to + (m.type === "mealy" ? " / " + t.output : "")).join("\n");
      }
      function renderAll() {
        showErr(validate());
        renderDiagram();
        renderEditors();
        renderTable();
        renderStatus();
      }

      /* ---------- wiring ---------- */
      presetSel.addEventListener("change", () => loadPreset(presetSel.value));
      typeSel.addEventListener("change", () => {
        m.type = typeSel.value;
        resetRun();
        renderAll();
      });
      exportBtn.addEventListener("click", () => {
        exportBox.style.display = exportBox.style.display === "none" ? "" : "none";
        if (exportBox.style.display !== "none") exportBox.select();
      });
      stepBtn.addEventListener("click", () => {
        if (run && run.done) resetRun();
        step();
      });
      runBtn.addEventListener("click", () => {
        if (timer) return stopTimer();
        if (run && run.done) resetRun();
        if (!run && !beginRun()) return;
        runBtn.textContent = "⏸ Pause";
        timer = setInterval(() => {
          step();
          if (!run || run.done) stopTimer();
        }, parseInt(speedSel.value, 10));
      });
      resetBtn.addEventListener("click", () => {
        resetRun();
        renderAll();
      });
      inputField.addEventListener("change", () => {
        resetRun();
        renderAll();
      });
      inputField.addEventListener("keydown", (e) => e.key === "Enter" && stepBtn.click());
      loadPreset(params.preset && PRESETS[params.preset] ? params.preset : "endsAB");
    },
  });
})();
