/* Linked list demo: node diagram + array implementation (data[], next[], start, nextFree), stepped pointer changes. */
CS.registerTool({
  id: "linked-list-demo",
  title: "Linked list simulator",
  section: "2",
  topic: "2.1",
  icon: "🔗",
  desc: "Insert, delete and traverse a linked list stored in arrays; every pointer change is shown as a step of the exam algorithm.",
  help:
    "The list is stored in **two arrays** (`data` and `next`) with a `start` pointer and a `nextFree` pointer to the free list. The diagram on the left is just a picture of those arrays: each box shows `[index] data | next`.\n\n" +
    "Choose an operation, type a value and press **Start**, then use **▶ Step** (or **⏩ Run**) to see each pointer assignment, e.g. `node[new].next ← node[current].next` then `node[current].next ← new`. Note the **order** of those two assignments – swapping them loses the rest of the list.\n\n" +
    "Deleting a node does not erase its data: the node is simply unlinked and handed back to the free list (`node[old].next ← nextFree; nextFree ← old`). Fill all " +
    "8 nodes to see the *no free node* error.",
  mount(el, params) {
    const h = CS.util.el;
    const N = 8;
    const NULL = -1;
    let data, next, start, nextFree;
    let steps = [],
      stepIdx = 0,
      timer = null,
      temps = {};

    // ---------- UI ----------
    const opSel = h("select", { "aria-label": "Operation" });
    [["insertStart", "Insert at start"], ["insertAfter", "Insert after value"], ["append", "Append (insert at end)"], ["delete", "Delete value"], ["traverse", "Traverse"]].forEach(([v, t]) => opSel.appendChild(h("option", { value: v, text: t })));
    const valIn = h("input", { type: "text", placeholder: "new value", style: "width:95px", "aria-label": "Value" });
    const afterIn = h("input", { type: "text", placeholder: "after value", style: "width:95px", "aria-label": "Insert after this value" });
    const startBtn = h("button", { class: "btn sm primary", type: "button", text: "Start" });
    const stepBtn = h("button", { class: "btn sm", type: "button", text: "▶ Step", disabled: "" });
    const runBtn = h("button", { class: "btn sm", type: "button", text: "⏩ Run", disabled: "" });
    const finishBtn = h("button", { class: "btn sm", type: "button", text: "⏭ Finish", disabled: "" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "⏮ Reset list" });
    const speed = h("input", { type: "range", min: 1, max: 5, value: 3, style: "width:80px", "aria-label": "Run speed" });
    const row1 = h("div", { class: "controls" }, [opSel, valIn, afterIn, startBtn]);
    const row2 = h("div", { class: "controls" }, [stepBtn, runBtn, finishBtn, h("label", { text: "speed " }, speed), resetBtn]);
    const errBox = h("div", { class: "err", style: "min-height:1.2em;margin-bottom:4px" });
    const svgWrap = h("div", { style: "min-width:0;max-width:100%;overflow-x:auto;border:1px solid var(--border);border-radius:10px;background:var(--bg-2)" });
    const tableWrap = h("div");
    svgWrap.style.flex = "1 1 420px";
    tableWrap.style.flex = "1 1 230px";
    const diag = h("div", { style: "display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start" }, [svgWrap, tableWrap]);
    const current = h("div", { class: "output", style: "margin-top:10px;min-height:2.6em;border-color:var(--accent)" });
    const log = h("div", { class: "output", style: "margin-top:10px;min-height:120px;max-height:260px;overflow:auto" });
    el.append(row1, row2, errBox, diag, current, log);

    // ---------- state ----------
    function init() {
      data = new Array(N).fill("");
      next = new Array(N).fill(NULL);
      const initial = (params.values || "Cat,Dog,Fox").split(",").map((s) => s.trim()).filter(Boolean).slice(0, N - 2);
      initial.forEach((v, i) => {
        data[i] = v;
        next[i] = i + 1 < initial.length ? i + 1 : NULL;
      });
      start = initial.length ? 0 : NULL;
      for (let i = initial.length; i < N; i++) next[i] = i + 1 < N ? i + 1 : NULL;
      nextFree = initial.length < N ? initial.length : NULL;
      steps = [];
      stepIdx = 0;
      temps = {};
      stopRun();
      setStepping(false);
      log.textContent = "List reset: start = " + start + ", nextFree = " + nextFree + ". Nodes " + nextFree + "…" + (N - 1) + " are on the free list.";
      current.textContent = "Choose an operation and press Start.";
      errBox.textContent = "";
      draw({});
    }
    const P = (i) => (i === NULL ? "null" : String(i));

    // ---------- planning: run the algorithm on a shadow copy, recording steps ----------
    function plan(op, v, after) {
      const S = { data: data.slice(), next: next.slice(), start, nextFree };
      const out = [];
      const T = {}; // shadow temporaries
      const step = (msg, ops, hl) => out.push({ msg, ops: ops || [], hl: hl || {}, temps: Object.assign({}, T) });
      const node = (i) => "node[" + i + "]";
      const takeFree = () => {
        step("Check the free list: nextFree = " + P(S.nextFree) + " → a free node is available.", [], { node: S.nextFree });
        T.new = S.nextFree;
        step("new ← nextFree  (new = " + T.new + ")", [], { node: T.new });
        S.nextFree = S.next[T.new];
        step("nextFree ← " + node(T.new) + ".next  (nextFree = " + P(S.nextFree) + ")", [["nextFree", S.nextFree]], { node: T.new, ptr: "nextFree" });
        S.data[T.new] = v;
        step(node(T.new) + ".data ← " + JSON.stringify(v), [["data", T.new, v]], { node: T.new, field: "data" });
      };
      const noFree = () => {
        if (S.nextFree !== NULL) return false;
        step("Check the free list: nextFree = null → ERROR: no free node, the list is full. Nothing changes.", [], { ptr: "nextFree" });
        return true;
      };
      if (op === "insertStart") {
        if (noFree()) return out;
        takeFree();
        S.next[T.new] = S.start;
        step(node(T.new) + ".next ← start  (= " + P(S.start) + ")", [["next", T.new, S.start]], { node: T.new, field: "next" });
        S.start = T.new;
        step("start ← new  (start = " + S.start + "). Done – the new node is the first item.", [["start", S.start]], { node: T.new, ptr: "start" });
      } else if (op === "append") {
        if (noFree()) return out;
        takeFree();
        S.next[T.new] = NULL;
        step(node(T.new) + ".next ← null  (it will be the last node)", [["next", T.new, NULL]], { node: T.new, field: "next" });
        if (S.start === NULL) {
          S.start = T.new;
          step("start = null (list was empty) → start ← new  (start = " + S.start + "). Done.", [["start", S.start]], { node: T.new, ptr: "start" });
          return out;
        }
        T.current = S.start;
        step("current ← start  (current = " + T.current + ")", [], { node: T.current });
        while (S.next[T.current] !== NULL) {
          step("WHILE " + node(T.current) + ".next ≠ null: " + P(S.next[T.current]) + " ≠ null → current ← " + node(T.current) + ".next = " + S.next[T.current], [], { node: T.current, field: "next" });
          T.current = S.next[T.current];
        }
        step("WHILE check: " + node(T.current) + ".next = null → stop; current (" + T.current + ") is the last node.", [], { node: T.current, field: "next" });
        S.next[T.current] = T.new;
        step(node(T.current) + ".next ← new  (= " + T.new + "). Done.", [["next", T.current, T.new]], { node: T.current, field: "next" });
      } else if (op === "insertAfter") {
        if (noFree()) return out;
        T.current = S.start;
        step("current ← start  (current = " + P(T.current) + ")", [], { node: T.current });
        while (T.current !== NULL && S.data[T.current] !== after) {
          step("WHILE current ≠ null AND " + node(T.current) + ".data ≠ " + JSON.stringify(after) + ": " + JSON.stringify(S.data[T.current]) + " ≠ " + JSON.stringify(after) + " → current ← " + node(T.current) + ".next = " + P(S.next[T.current]), [], { node: T.current, field: "data" });
          T.current = S.next[T.current];
        }
        if (T.current === NULL) {
          step("current = null → ERROR: " + JSON.stringify(after) + " is not in the list. Nothing changes.", [], {});
          return out;
        }
        step(node(T.current) + ".data = " + JSON.stringify(after) + " → found it at index " + T.current + ".", [], { node: T.current, field: "data" });
        takeFree();
        S.next[T.new] = S.next[T.current];
        step(node(T.new) + ".next ← " + node(T.current) + ".next  (= " + P(S.next[T.current]) + ")   ← this assignment MUST come first", [["next", T.new, S.next[T.current]]], { node: T.new, field: "next" });
        S.next[T.current] = T.new;
        step(node(T.current) + ".next ← new  (= " + T.new + "). Done.", [["next", T.current, T.new]], { node: T.current, field: "next" });
      } else if (op === "delete") {
        if (S.start === NULL) {
          step("start = null → ERROR: the list is empty, nothing to delete.", [], { ptr: "start" });
          return out;
        }
        const free = (i) => {
          S.next[i] = S.nextFree;
          step("Return the node to the free list: " + node(i) + ".next ← nextFree  (= " + P(S.nextFree) + ")", [["next", i, S.nextFree]], { node: i, field: "next" });
          S.nextFree = i;
          step("nextFree ← " + i + ". Done – the data is still in the array but the node is unreachable from start.", [["nextFree", i]], { node: i, ptr: "nextFree" });
        };
        if (S.data[S.start] === v) {
          T.current = S.start;
          step("node[start].data = " + JSON.stringify(v) + " → the first node is the one to delete; current ← start (" + T.current + ")", [], { node: T.current, field: "data" });
          S.start = S.next[T.current];
          step("start ← " + node(T.current) + ".next  (start = " + P(S.start) + ")", [["start", S.start]], { ptr: "start", node: T.current });
          free(T.current);
          return out;
        }
        T.previous = S.start;
        T.current = S.next[S.start];
        step("previous ← start (" + T.previous + "); current ← node[start].next (" + P(T.current) + ")", [], { node: T.current });
        while (T.current !== NULL && S.data[T.current] !== v) {
          step("WHILE current ≠ null AND " + node(T.current) + ".data ≠ " + JSON.stringify(v) + ": " + JSON.stringify(S.data[T.current]) + " ≠ " + JSON.stringify(v) + " → previous ← current (" + T.current + "); current ← " + node(T.current) + ".next (" + P(S.next[T.current]) + ")", [], { node: T.current, field: "data" });
          T.previous = T.current;
          T.current = S.next[T.current];
        }
        if (T.current === NULL) {
          step("current = null → ERROR: " + JSON.stringify(v) + " is not in the list. Nothing changes.", [], {});
          return out;
        }
        step(node(T.current) + ".data = " + JSON.stringify(v) + " → found it at index " + T.current + "; previous = " + T.previous, [], { node: T.current, field: "data" });
        S.next[T.previous] = S.next[T.current];
        step(node(T.previous) + ".next ← " + node(T.current) + ".next  (= " + P(S.next[T.current]) + ")  – the list now bypasses node " + T.current, [["next", T.previous, S.next[T.current]]], { node: T.previous, field: "next" });
        free(T.current);
      } else {
        T.current = S.start;
        step("current ← start  (current = " + P(T.current) + ")", [], { node: T.current });
        const seen = [];
        while (T.current !== NULL) {
          seen.push(S.data[T.current]);
          step("WHILE current ≠ null: OUTPUT " + node(T.current) + ".data = " + JSON.stringify(S.data[T.current]) + "; current ← " + node(T.current) + ".next = " + P(S.next[T.current]), [], { node: T.current, field: "data" });
          T.current = S.next[T.current];
        }
        step("current = null → stop. Output: " + (seen.length ? seen.join(", ") : "(nothing – empty list)") + ". " + seen.length + " node" + (seen.length === 1 ? "" : "s") + " visited.", [], {});
      }
      return out;
    }

    // ---------- stepping ----------
    function applyStep(s) {
      s.ops.forEach((o) => {
        if (o[0] === "start") start = o[1];
        else if (o[0] === "nextFree") nextFree = o[1];
        else if (o[0] === "data") data[o[1]] = o[2];
        else if (o[0] === "next") next[o[1]] = o[2];
      });
      temps = s.temps;
      current.textContent = "Step " + (stepIdx + 1) + "/" + steps.length + ": " + s.msg;
      log.textContent = (stepIdx + 1) + ". " + s.msg + "\n" + log.textContent;
      if (/ERROR/.test(s.msg)) errBox.textContent = s.msg.replace(/^.*ERROR: /, "");
      draw(s.hl);
    }
    function doStep() {
      if (stepIdx >= steps.length) return;
      applyStep(steps[stepIdx]);
      stepIdx++;
      if (stepIdx >= steps.length) {
        stopRun();
        setStepping(false);
        temps = {};
        current.textContent += "   ✔ finished";
      }
    }
    function stopRun() {
      if (timer) clearInterval(timer);
      timer = null;
      runBtn.textContent = "⏩ Run";
    }
    function setStepping(on) {
      stepBtn.disabled = runBtn.disabled = finishBtn.disabled = !on;
      startBtn.disabled = opSel.disabled = on;
    }
    startBtn.addEventListener("click", () => {
      errBox.textContent = "";
      const op = opSel.value;
      const v = valIn.value.trim();
      const after = afterIn.value.trim();
      if (op !== "traverse" && !v) return (errBox.textContent = "Type a value first.");
      if (op === "insertAfter" && !after) return (errBox.textContent = "Type the value to insert after.");
      steps = plan(op, v, after);
      stepIdx = 0;
      temps = {};
      log.textContent = "— " + opSel.options[opSel.selectedIndex].text + (v ? " " + JSON.stringify(v) : "") + (op === "insertAfter" ? " after " + JSON.stringify(after) : "") + " —\n" + log.textContent;
      setStepping(true);
      doStep();
    });
    stepBtn.addEventListener("click", () => {
      stopRun();
      doStep();
    });
    runBtn.addEventListener("click", () => {
      if (timer) return stopRun();
      runBtn.textContent = "⏸ Pause";
      timer = setInterval(doStep, 1500 / parseInt(speed.value, 10));
    });
    finishBtn.addEventListener("click", () => {
      stopRun();
      while (stepIdx < steps.length) doStep();
    });
    resetBtn.addEventListener("click", init);
    opSel.addEventListener("change", () => {
      afterIn.style.display = opSel.value === "insertAfter" ? "" : "none";
      valIn.style.display = opSel.value === "traverse" ? "none" : "";
      valIn.placeholder = opSel.value === "delete" ? "value to delete" : "new value";
    });
    opSel.dispatchEvent(new Event("change"));
    [valIn, afterIn].forEach((i) => i.addEventListener("keydown", (e) => e.key === "Enter" && !startBtn.disabled && startBtn.click()));

    // ---------- drawing ----------
    const SVG = "http://www.w3.org/2000/svg";
    const MID = "ll-arrow-" + Math.random().toString(36).slice(2, 8);
    function sv(tag, attrs, text) {
      const e = document.createElementNS(SVG, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (text != null) e.textContent = text;
      return e;
    }
    function chain(from) {
      const out = [],
        seen = new Set();
      for (let i = from; i !== NULL && !seen.has(i) && i >= 0 && i < N; i = next[i]) {
        seen.add(i);
        out.push(i);
      }
      return out;
    }
    function draw(hl) {
      hl = hl || {};
      const live = chain(start),
        free = chain(nextFree);
      const placed = new Set([...live, ...free]);
      const loose = [];
      for (let i = 0; i < N; i++) if (!placed.has(i)) loose.push(i);
      const rows = [live, loose, free];
      const BW = 84, BH = 36, GX = 26, X0 = 70, Y0 = 30, RY = 70;
      const pos = {};
      rows.forEach((r, ri) => r.forEach((i, k) => (pos[i] = { x: X0 + k * (BW + GX), y: Y0 + ri * RY })));
      const cols = Math.max(1, ...rows.map((r) => r.length));
      const W = X0 + cols * (BW + GX), H = Y0 + rows.length * RY;
      const svg = sv("svg", { width: W, height: H, viewBox: "0 0 " + W + " " + H, style: "display:block;max-width:none;font-family:var(--font-mono);font-size:12px", role: "img", "aria-label": "Linked list diagram" });
      const defs = sv("defs", {});
      defs.innerHTML = '<marker id="' + MID + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker>';
      svg.appendChild(defs);
      svg.style.color = "var(--text-2)";
      const labelRow = (txt, ri, ptr, target) => {
        const y = Y0 + ri * RY + BH / 2;
        const g = sv("g", { fill: hl.ptr === ptr ? "var(--warn)" : "var(--accent)", "font-weight": "700" });
        g.appendChild(sv("text", { x: 4, y: y - 4 }, txt));
        g.appendChild(sv("text", { x: 4, y: y + 12, "font-size": "11px" }, "= " + P(target)));
        svg.appendChild(g);
        if (target !== NULL && pos[target]) svg.appendChild(sv("line", { x1: 56, y1: y, x2: pos[target].x - 2, y2: y, stroke: "currentColor", "stroke-width": 1.5, "marker-end": "url(#" + MID + ")" }));
      };
      labelRow("start", 0, "start", start);
      if (loose.length) svg.appendChild(sv("text", { x: 4, y: Y0 + RY + BH / 2 + 4, fill: "var(--text-3)", "font-size": "11px" }, "unlinked"));
      labelRow("nextFree", 2, "nextFree", nextFree);
      // nodes
      for (let i = 0; i < N; i++) {
        const p = pos[i];
        const isFree = free.includes(i);
        const g = sv("g", { opacity: isFree ? 0.5 : 1 });
        const stroke = hl.node === i ? "var(--warn)" : "var(--border-2)";
        g.appendChild(sv("rect", { x: p.x, y: p.y, width: BW, height: BH, rx: 7, fill: hl.node === i ? "var(--warn-soft)" : "var(--surface)", stroke, "stroke-width": 2 }));
        g.appendChild(sv("line", { x1: p.x + BW - 30, y1: p.y, x2: p.x + BW - 30, y2: p.y + BH, stroke, "stroke-width": 2 }));
        g.appendChild(sv("text", { x: p.x + 4, y: p.y - 5, fill: "var(--text-3)", "font-size": "10px" }, "[" + i + "]"));
        const tn = Object.keys(temps).filter((k) => temps[k] === i);
        if (tn.length) g.appendChild(sv("text", { x: p.x + 24, y: p.y - 5, fill: "var(--bad)", "font-size": "10px", "font-weight": "700" }, tn.join(", ") + " ▼"));
        g.appendChild(sv("text", { x: p.x + 6, y: p.y + 24, fill: "var(--text)", "font-weight": hl.node === i && hl.field === "data" ? "700" : "400" }, isFree && data[i] === "" ? "" : String(data[i]).slice(0, 6)));
        g.appendChild(sv("text", { x: p.x + BW - 25, y: p.y + 24, fill: hl.node === i && hl.field === "next" ? "var(--bad)" : "var(--text-2)", "font-weight": "700", "font-size": "11px" }, next[i] === NULL ? "∅" : String(next[i])));
        svg.appendChild(g);
        const t = next[i];
        if (t !== NULL && pos[t]) {
          const q = pos[t];
          const x1 = p.x + BW - 15, y1 = p.y + BH / 2, x2 = q.x - 2, y2 = q.y + BH / 2;
          const d = q.y === p.y && q.x > p.x ? "M" + x1 + " " + y1 + "L" + x2 + " " + y2 : "M" + x1 + " " + y1 + " C" + (x1 + 40) + " " + (y1 + 30) + "," + (x2 - 40) + " " + (y2 - 30) + "," + x2 + " " + y2;
          svg.appendChild(sv("path", { d, fill: "none", stroke: hl.node === i && hl.field === "next" ? "var(--bad)" : "currentColor", "stroke-width": 1.5, "marker-end": "url(#" + MID + ")", opacity: isFree ? 0.5 : 1 }));
        }
      }
      svgWrap.innerHTML = "";
      svgWrap.appendChild(svg);
      // array table
      const rowsHtml = [];
      for (let i = 0; i < N; i++) {
        const isFree = free.includes(i);
        const tn = Object.keys(temps).filter((k) => temps[k] === i).join(", ");
        const cell = (f, txt) => "<td style='" + (hl.node === i && hl.field === f ? "background:var(--warn-soft);font-weight:700;" : "") + (isFree ? "opacity:.55" : "") + "'>" + CS.util.esc(txt) + "</td>";
        rowsHtml.push("<tr style='" + (hl.node === i ? "outline:2px solid var(--warn)" : "") + "'><td class='mono'>" + i + (tn ? " <span style='color:var(--bad);font-size:.7rem'>" + CS.util.esc(tn) + "</span>" : "") + "</td>" + cell("data", data[i]) + cell("next", P(next[i])) + "</tr>");
      }
      tableWrap.innerHTML =
        "<div class='stat-line'>start = <b style='color:" + (hl.ptr === "start" ? "var(--warn)" : "var(--accent)") + "'>" + P(start) + "</b>   nextFree = <b style='color:" + (hl.ptr === "nextFree" ? "var(--warn)" : "var(--accent)") + "'>" + P(nextFree) + "</b></div>" +
        "<div class='table-wrap' style='margin:0'><table style='width:100%;border-collapse:collapse'><thead><tr><th>index</th><th>data[ ]</th><th>next[ ]</th></tr></thead><tbody>" + rowsHtml.join("") + "</tbody></table></div>";
    }
    init();
  },
});
