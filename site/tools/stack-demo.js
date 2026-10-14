/* Exemplar tool: interactive stack. Shows the expected structure of a tool file. */
CS.registerTool({
  id: "stack-demo",
  title: "Stack simulator",
  section: "2",
  topic: "2.3",
  icon: "🥞",
  desc: "Push, pop and peek on an array-based stack and watch the stack pointer. Try to cause overflow and underflow.",
  help: "Type a value and press **Push**. **Pop** removes the top item and shows what it returned. **Peek** shows the top without removing it. Change the size to see overflow earlier. The log underneath is written in the words an exam answer should use.",
  mount(el, params) {
    const h = CS.util.el;
    let max = parseInt(params.size || 5, 10) || 5;
    let items = [];
    const controls = h("div", { class: "controls" });
    const input = h("input", { type: "text", placeholder: "value", style: "width:110px", "aria-label": "Value to push" });
    const pushBtn = h("button", { class: "btn sm primary", type: "button", text: "Push" });
    const popBtn = h("button", { class: "btn sm", type: "button", text: "Pop" });
    const peekBtn = h("button", { class: "btn sm", type: "button", text: "Peek" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "Reset" });
    const sizeSel = h("select", { "aria-label": "Stack size" });
    [3, 4, 5, 6, 8].forEach((n) => sizeSel.appendChild(h("option", { value: n, text: "size " + n })));
    sizeSel.value = String(max);
    controls.append(input, pushBtn, popBtn, peekBtn, sizeSel, resetBtn);
    const view = h("div", { class: "two-col" });
    const cellsWrap = h("div");
    const log = h("div", { class: "output", style: "min-height:120px", text: "Stack created. top = -1 (empty)." });
    view.append(cellsWrap, log);
    el.append(controls, view);

    function draw(highlight) {
      cellsWrap.innerHTML = "";
      const col = h("div", { style: "display:flex;flex-direction:column-reverse;gap:4px;align-items:flex-start" });
      for (let i = 0; i < max; i++) {
        const row = h("div", { style: "display:flex;gap:8px;align-items:center" });
        const cell = h("div", { class: "cell" + (i < items.length ? "" : " dim") + (i === highlight ? " hl" : ""), text: i < items.length ? items[i] : "", style: "min-width:90px" });
        const lab = h("span", { class: "bit-label", text: "[" + i + "]" + (i === items.length - 1 ? " ← top" : "") });
        row.append(lab, cell);
        col.appendChild(row);
      }
      cellsWrap.appendChild(col);
      cellsWrap.appendChild(h("div", { class: "stat-line", text: "top = " + (items.length - 1) + (items.length === 0 ? " (empty)" : items.length === max ? " (full)" : "") }));
    }
    function say(msg) {
      log.textContent = msg + "\n" + log.textContent;
    }
    pushBtn.addEventListener("click", () => {
      const v = input.value.trim() || String(Math.floor(Math.random() * 90) + 10);
      if (items.length === max) {
        say("push(" + v + "): isFull() is TRUE → stack overflow, nothing changes.");
        draw(max - 1);
        return;
      }
      items.push(v);
      say("push(" + v + "): not full → top ← top + 1 = " + (items.length - 1) + "; stack[" + (items.length - 1) + "] ← " + v);
      input.value = "";
      draw(items.length - 1);
    });
    popBtn.addEventListener("click", () => {
      if (!items.length) {
        say("pop(): isEmpty() is TRUE → stack underflow, nothing returned.");
        draw(-1);
        return;
      }
      const v = items.pop();
      say("pop(): not empty → item ← stack[" + items.length + "] = " + v + "; top ← top − 1 = " + (items.length - 1) + "; RETURN " + v);
      draw(items.length - 1);
    });
    peekBtn.addEventListener("click", () => {
      if (!items.length) {
        say("peek(): isEmpty() is TRUE → error, stack is empty.");
        return;
      }
      say("peek(): RETURN stack[" + (items.length - 1) + "] = " + items[items.length - 1] + " (top unchanged)");
      draw(items.length - 1);
    });
    resetBtn.addEventListener("click", () => {
      items = [];
      log.textContent = "Stack reset. top = -1 (empty).";
      draw(-1);
    });
    sizeSel.addEventListener("change", () => {
      max = parseInt(sizeSel.value, 10);
      items = items.slice(0, max);
      say("MAX set to " + max + ". Full when top = " + (max - 1) + ".");
      draw(-1);
    });
    input.addEventListener("keydown", (e) => e.key === "Enter" && pushBtn.click());
    draw(-1);
  },
});
