/* Queue simulator: linear, circular and priority queues with front/rear pointers, in exam language. */
CS.registerTool({
  id: "queue-demo",
  title: "Queue simulator (linear, circular, priority)",
  section: "2",
  topic: "2.2",
  icon: "🚶",
  desc: "Enqueue, dequeue and peek on a linear, circular or priority queue; watch the front and rear pointers and the MOD wrap-around.",
  help:
    "Pick a **mode**. Type a value (and, for a priority queue, a priority where **1 = most urgent**) and press **Enqueue**; **Dequeue** removes the item at the front.\n\n" +
    "* **Linear queue** – `rear` only ever moves right. After some dequeues the cells before `front` are *wasted*: the queue reports full even though there is space at the front. That is the problem the circular queue solves.\n" +
    "* **Circular queue** – pointers wrap round with `rear ← (rear + 1) MOD MAX`. Because `front = rear + 1` can mean *either* full or empty, a `size` counter is kept; `isFull` is `size = MAX` and `isEmpty` is `size = 0`.\n" +
    "* **Priority queue** – choose the implementation: *insert in order* keeps the array sorted on every enqueue (slow enqueue, O(1) dequeue), or *search on removal* appends at the rear and scans for the most urgent item when dequeuing (O(1) enqueue, O(n) dequeue). Equal priorities are served first-in first-out.\n\n" +
    "The pseudo-code panel substitutes the live pointer values, and the log is phrased the way an exam answer should be.",
  mount(el, params) {
    const h = CS.util.el;
    let MAX = parseInt(params.size || 5, 10) || 5;
    let mode = ["linear", "circular", "priority"].includes(params.mode) ? params.mode : "linear";
    let pqImpl = "ordered"; // or "unordered"
    let cells, front, rear, size;

    // ---------- UI ----------
    const modeSel = h("select", { "aria-label": "Queue type" });
    [["linear", "Linear queue"], ["circular", "Circular queue"], ["priority", "Priority queue"]].forEach(([v, t]) => modeSel.appendChild(h("option", { value: v, text: t })));
    modeSel.value = mode;
    const implSel = h("select", { "aria-label": "Priority queue implementation" });
    [["ordered", "insert in order"], ["unordered", "search on removal"]].forEach(([v, t]) => implSel.appendChild(h("option", { value: v, text: t })));
    const sizeSel = h("select", { "aria-label": "Queue size (MAX)" });
    [4, 5, 6, 8].forEach((n) => sizeSel.appendChild(h("option", { value: n, text: "MAX " + n })));
    sizeSel.value = String(MAX);
    const input = h("input", { type: "text", placeholder: "value", style: "width:90px", "aria-label": "Value to enqueue" });
    const prio = h("input", { type: "number", min: 1, max: 9, value: 3, style: "width:70px", "aria-label": "Priority (1 = most urgent)", title: "Priority: 1 = most urgent" });
    const enqBtn = h("button", { class: "btn sm primary", type: "button", text: "Enqueue" });
    const deqBtn = h("button", { class: "btn sm", type: "button", text: "Dequeue" });
    const peekBtn = h("button", { class: "btn sm", type: "button", text: "Peek" });
    const emptyBtn = h("button", { class: "btn sm", type: "button", text: "isEmpty?" });
    const fullBtn = h("button", { class: "btn sm", type: "button", text: "isFull?" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "Reset" });
    const row1 = h("div", { class: "controls" }, [modeSel, implSel, sizeSel, resetBtn]);
    const row2 = h("div", { class: "controls" }, [input, h("label", { text: "priority " }, prio), enqBtn, deqBtn, peekBtn, emptyBtn, fullBtn]);
    const errBox = h("div", { class: "err", style: "min-height:1.2em;margin-bottom:6px" });
    const cellsWrap = h("div", { style: "overflow-x:auto;padding:4px 0 2px" });
    const stat = h("div", { class: "stat-line" });
    const code = h("div", { class: "output", style: "font-size:0.82rem" });
    const log = h("div", { class: "output", style: "min-height:140px" });
    const view = h("div", { class: "two-col" }, [code, log]);
    el.append(row1, row2, errBox, cellsWrap, stat, view);

    // ---------- state ----------
    function init() {
      cells = new Array(MAX).fill(null);
      front = 0;
      size = 0;
      rear = mode === "circular" ? MAX - 1 : -1; // circular: rear starts at MAX-1 so the first enqueue wraps to 0
      log.textContent = modeName() + " created with MAX = " + MAX + ". front = " + front + ", rear = " + rear + (mode === "circular" ? ", size = 0" : "") + " (empty).";
      errBox.textContent = "";
      draw();
    }
    function modeName() {
      return mode === "linear" ? "Linear queue" : mode === "circular" ? "Circular queue" : "Priority queue (" + (pqImpl === "ordered" ? "insert in order" : "search on removal") + ")";
    }
    function isEmpty() {
      return mode === "circular" ? size === 0 : front > rear;
    }
    function isFull() {
      return mode === "circular" ? size === MAX : rear === MAX - 1;
    }
    function fmt(it) {
      return it == null ? "" : mode === "priority" ? it.v + " (p" + it.p + ")" : String(it.v);
    }
    function say(msg) {
      log.textContent = msg + "\n" + log.textContent;
    }
    function err(msg) {
      errBox.textContent = msg;
      say(msg);
    }

    // ---------- operations ----------
    function enqueue() {
      errBox.textContent = "";
      const v = input.value.trim() || String(Math.floor(Math.random() * 90) + 10);
      const p = Math.min(9, Math.max(1, parseInt(prio.value, 10) || 1));
      if (isFull()) {
        const why = mode === "circular" ? "size = MAX (" + size + " = " + MAX + ")" : "rear = MAX − 1 (" + rear + " = " + (MAX - 1) + ")";
        let extra = "";
        if (mode !== "circular" && front > 0) extra = " Note: " + front + " cell" + (front > 1 ? "s" : "") + " at the front " + (front > 1 ? "are" : "is") + " empty but wasted — rear cannot move back. A circular queue fixes this.";
        err("enqueue(" + v + "): isFull() is TRUE because " + why + " → queue overflow, nothing added." + extra);
        draw({ bad: rear });
        return;
      }
      const item = { v, p };
      if (mode === "linear") {
        rear = rear + 1;
        cells[rear] = item;
        say("enqueue(" + v + "): not full → rear ← rear + 1 = " + rear + "; queue[" + rear + "] ← " + v);
        draw({ hl: rear });
      } else if (mode === "circular") {
        const old = rear;
        rear = (rear + 1) % MAX;
        cells[rear] = item;
        size++;
        say("enqueue(" + v + "): size < MAX → rear ← (rear + 1) MOD MAX = (" + old + " + 1) MOD " + MAX + " = " + rear + (old === MAX - 1 ? " (wrapped round!)" : "") + "; queue[" + rear + "] ← " + v + "; size ← size + 1 = " + size);
        draw({ hl: rear });
      } else if (pqImpl === "ordered") {
        // insert in order: find first position with a lower priority (larger number); shift the rest right
        let pos = front;
        let cmp = 0;
        while (pos <= rear && cells[pos].p <= p) {
          pos++;
          cmp++;
        }
        for (let i = rear; i >= pos; i--) cells[i + 1] = cells[i];
        rear++;
        cells[pos] = item;
        const shifted = rear - pos;
        say("enqueue(" + v + ", priority " + p + "): scan from front comparing priorities (" + cmp + " comparison" + (cmp === 1 ? "" : "s") + ") → insert position " + pos + "; shift " + shifted + " item" + (shifted === 1 ? "" : "s") + " right; queue[" + pos + "] ← " + v + "; rear ← rear + 1 = " + rear + ". Queue stays ordered, so dequeue is O(1).");
        draw({ hl: pos });
      } else {
        rear = rear + 1;
        cells[rear] = item;
        say("enqueue(" + v + ", priority " + p + "): add at the rear like a normal queue → rear ← rear + 1 = " + rear + "; queue[" + rear + "] ← " + v + ". O(1) — the work is done on removal.");
        draw({ hl: rear });
      }
      input.value = "";
    }
    function dequeue() {
      errBox.textContent = "";
      if (isEmpty()) {
        const why = mode === "circular" ? "size = 0" : "front > rear (" + front + " > " + rear + ")";
        err("dequeue(): isEmpty() is TRUE because " + why + " → queue underflow, nothing returned.");
        draw({});
        return;
      }
      if (mode === "priority" && pqImpl === "unordered") {
        // search on removal: find the most urgent (lowest p), first one wins ties
        let best = front;
        for (let i = front + 1; i <= rear; i++) if (cells[i].p < cells[best].p) best = i;
        const item = cells[best];
        for (let i = best; i < rear; i++) cells[i] = cells[i + 1];
        cells[rear] = null;
        rear--;
        say("dequeue(): search queue[" + front + "..] for the highest priority (" + (rear + 1 - front + 1) + " items examined) → found " + item.v + " (p" + item.p + ") at index " + best + "; remove it and shift later items left; rear ← rear − 1 = " + rear + "; RETURN " + item.v + ". O(n) search.");
        draw({ ok: best });
        return;
      }
      const item = cells[front];
      cells[front] = null;
      if (mode === "circular") {
        const old = front;
        front = (front + 1) % MAX;
        size--;
        say("dequeue(): size > 0 → item ← queue[" + old + "] = " + item.v + "; front ← (front + 1) MOD MAX = (" + old + " + 1) MOD " + MAX + " = " + front + (old === MAX - 1 ? " (wrapped round!)" : "") + "; size ← size − 1 = " + size + "; RETURN " + item.v);
        draw({ ok: old });
      } else {
        const old = front;
        front = front + 1;
        say("dequeue(): not empty → item ← queue[" + old + "] = " + item.v + "; front ← front + 1 = " + front + "; RETURN " + item.v + (mode === "linear" ? ". Cell " + old + " is now wasted: it can never be reused." : "."));
        draw({ ok: old });
      }
    }
    function peek() {
      errBox.textContent = "";
      if (isEmpty()) {
        err("peek(): isEmpty() is TRUE → error, queue is empty.");
        return;
      }
      if (mode === "priority" && pqImpl === "unordered") {
        let best = front;
        for (let i = front + 1; i <= rear; i++) if (cells[i].p < cells[best].p) best = i;
        say("peek(): search for the most urgent item → RETURN queue[" + best + "] = " + cells[best].v + " (p" + cells[best].p + "), nothing removed.");
        draw({ hl: best });
        return;
      }
      say("peek(): RETURN queue[front] = queue[" + front + "] = " + cells[front].v + " (front unchanged).");
      draw({ hl: front });
    }

    // ---------- drawing ----------
    function draw(mark) {
      mark = mark || {};
      cellsWrap.innerHTML = "";
      const row = h("div", { style: "display:flex;gap:6px;align-items:flex-start" });
      for (let i = 0; i < MAX; i++) {
        const used = cells[i] != null;
        let cls = "cell";
        if (!used) cls += " dim";
        if (mark.hl === i) cls += " hl";
        if (mark.ok === i) cls += " ok";
        if (mark.bad === i) cls += " bad";
        const wasted = mode === "linear" && !used && i < front;
        const cell = h("div", { class: cls, text: used ? fmt(cells[i]) : wasted ? "✕" : "", style: "min-width:64px;font-size:0.85rem", title: wasted ? "wasted: in front of the front pointer" : "" });
        const labels = [];
        if (i === front) labels.push("front");
        if (i === rear && rear >= 0) labels.push("rear");
        const lab = h("div", { class: "bit-label", style: "min-height:1.2em;font-weight:700;color:var(--accent)", text: labels.length ? "▲ " + labels.join(" & ") : "" });
        row.appendChild(h("div", { style: "display:flex;flex-direction:column;align-items:center;gap:3px" }, [h("div", { class: "bit-label", text: "[" + i + "]" }), cell, lab]));
      }
      if (mode === "circular") row.appendChild(h("div", { class: "bit-label", style: "align-self:center;max-width:70px", text: "↩ wraps to [0] via MOD " + MAX }));
      cellsWrap.appendChild(row);
      stat.textContent = "front = " + front + "   rear = " + rear + (mode === "circular" ? "   size = " + size : "") + "   isEmpty() = " + (isEmpty() ? "TRUE" : "FALSE") + "   isFull() = " + (isFull() ? "TRUE" : "FALSE") + (mode === "linear" && front > 0 ? "   wasted cells = " + front : "");
      drawCode();
    }
    function drawCode() {
      let t;
      if (mode === "circular") {
        t =
          "// circular queue, live values\n" +
          "isEmpty: size = 0        → " + (size === 0) + "\n" +
          "isFull:  size = MAX      → " + size + " = " + MAX + " → " + (size === MAX) + "\n\n" +
          "enqueue(item):\n  IF isFull THEN error\n  rear ← (rear + 1) MOD MAX\n       = (" + rear + " + 1) MOD " + MAX + " = " + ((rear + 1) % MAX) + "\n  queue[rear] ← item\n  size ← size + 1\n\n" +
          "dequeue():\n  IF isEmpty THEN error\n  item ← queue[front]   // queue[" + front + "]\n  front ← (front + 1) MOD MAX\n        = (" + front + " + 1) MOD " + MAX + " = " + ((front + 1) % MAX) + "\n  size ← size − 1\n  RETURN item";
      } else if (mode === "linear") {
        t =
          "// linear queue, live values\n" +
          "isEmpty: front > rear    → " + front + " > " + rear + " → " + (front > rear) + "\n" +
          "isFull:  rear = MAX − 1  → " + rear + " = " + (MAX - 1) + " → " + (rear === MAX - 1) + "\n\n" +
          "enqueue(item):\n  IF isFull THEN error\n  rear ← rear + 1       // " + (rear + 1) + "\n  queue[rear] ← item\n\n" +
          "dequeue():\n  IF isEmpty THEN error\n  item ← queue[front]   // queue[" + front + "]\n  front ← front + 1     // " + (front + 1) + "\n  RETURN item\n\n// cells left of front are never reused";
      } else if (pqImpl === "ordered") {
        t =
          "// priority queue: insert in order\n" +
          "enqueue(item, p):\n  IF isFull THEN error\n  pos ← front\n  WHILE pos ≤ rear AND queue[pos].p ≤ p\n    pos ← pos + 1\n  shift queue[pos..rear] right by 1\n  queue[pos] ← item\n  rear ← rear + 1\n\n" +
          "dequeue():            // O(1)\n  IF isEmpty THEN error\n  item ← queue[front]\n  front ← front + 1\n  RETURN item";
      } else {
        t =
          "// priority queue: search on removal\n" +
          "enqueue(item, p):     // O(1)\n  IF isFull THEN error\n  rear ← rear + 1\n  queue[rear] ← item\n\n" +
          "dequeue():            // O(n)\n  IF isEmpty THEN error\n  best ← front\n  FOR i ← front + 1 TO rear\n    IF queue[i].p < queue[best].p\n      best ← i\n  item ← queue[best]\n  shift queue[best+1..rear] left by 1\n  rear ← rear − 1\n  RETURN item";
      }
      code.textContent = t;
    }

    // ---------- wiring ----------
    function syncControls() {
      implSel.style.display = mode === "priority" ? "" : "none";
      prio.parentElement.style.display = mode === "priority" ? "" : "none";
    }
    enqBtn.addEventListener("click", enqueue);
    deqBtn.addEventListener("click", dequeue);
    peekBtn.addEventListener("click", peek);
    emptyBtn.addEventListener("click", () => {
      errBox.textContent = "";
      say("isEmpty(): " + (mode === "circular" ? "size = 0 → " + size + " = 0" : "front > rear → " + front + " > " + rear) + " → " + (isEmpty() ? "TRUE" : "FALSE"));
    });
    fullBtn.addEventListener("click", () => {
      errBox.textContent = "";
      say("isFull(): " + (mode === "circular" ? "size = MAX → " + size + " = " + MAX : "rear = MAX − 1 → " + rear + " = " + (MAX - 1)) + " → " + (isFull() ? "TRUE" : "FALSE"));
    });
    resetBtn.addEventListener("click", init);
    modeSel.addEventListener("change", () => {
      mode = modeSel.value;
      syncControls();
      init();
    });
    implSel.addEventListener("change", () => {
      pqImpl = implSel.value;
      init();
    });
    sizeSel.addEventListener("change", () => {
      MAX = parseInt(sizeSel.value, 10);
      init();
    });
    input.addEventListener("keydown", (e) => e.key === "Enter" && enqueue());
    syncControls();
    init();
  },
});
