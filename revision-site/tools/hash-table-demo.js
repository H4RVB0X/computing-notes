/* Hash table demo: choice of N and hash function, step-by-step hash working, linear probing or chaining, search, delete with markers. */
CS.registerTool({
  id: "hash-table-demo",
  title: "Hash table simulator",
  section: "2",
  topic: "2.6",
  icon: "#️⃣",
  desc: "Hash keys into a table of N slots, see collisions, and resolve them by linear probing (rehashing) or chaining. Search, delete and watch the load factor.",
  help:
    "Choose the table size **N** (a prime such as 7, 11 or 13 spreads keys better than 10), a **hash function** and a **collision strategy**, then insert keys.\n\n" +
    "* **key MOD N** and **folding** need whole-number keys. Folding splits the digits into pairs (`123456 → 12 + 34 + 56`), adds them, then takes MOD N.\n" +
    "* **ASCII sum MOD N** works for words: add the character codes and take MOD N. Try `cat` then `act` – anagrams always collide.\n" +
    "* **Linear probing** (open addressing): on a collision, rehash with `h ← (h + 1) MOD N` until a free slot is found. Searching follows the same probe sequence and stops at an *empty* slot.\n" +
    "* **Chaining**: every slot holds a list; colliding keys are added to that slot's list.\n\n" +
    "**The deletion problem:** with linear probing, if you delete a key by emptying its slot, a later search for a key that was probed *past* that slot stops early and wrongly says *not found*. Untick **use DELETED marker** to see this happen, then tick it again: a marker means *keep probing* when searching but *free to reuse* when inserting.\n\n" +
    "The **load factor** = items ÷ slots. As it approaches 1 with linear probing, clusters form and probe sequences get long.",
  mount(el, params) {
    const h = CS.util.el;
    const DEL = { deleted: true };
    let N = [7, 10, 11, 13].includes(+params.n) ? +params.n : 11;
    let fn = "ascii",
      strategy = "probe",
      table,
      busy = false;

    // ---------- UI ----------
    const sel = (label, opts, val) => {
      const s = h("select", { "aria-label": label });
      opts.forEach(([v, t]) => s.appendChild(h("option", { value: v, text: t })));
      s.value = val;
      return s;
    };
    const nSel = sel("Table size N", [7, 10, 11, 13].map((n) => [n, "N = " + n]), String(N));
    const fnSel = sel("Hash function", [["mod", "key MOD N"], ["ascii", "ASCII sum MOD N"], ["fold", "folding (digit pairs) MOD N"]], fn);
    const stSel = sel("Collision handling", [["probe", "linear probing"], ["chain", "chaining"]], strategy);
    const markChk = h("input", { type: "checkbox", checked: "" });
    const markLbl = h("label", { title: "Linear probing only" }, [markChk, "use DELETED marker"]);
    const keyIn = h("input", { type: "text", placeholder: "key e.g. cat or 1234", style: "width:150px", "aria-label": "Key" });
    const insBtn = h("button", { class: "btn sm primary", type: "button", text: "Insert" });
    const findBtn = h("button", { class: "btn sm", type: "button", text: "Search" });
    const delBtn = h("button", { class: "btn sm", type: "button", text: "Delete" });
    const exBtn = h("button", { class: "btn sm", type: "button", text: "Load example" });
    const resetBtn = h("button", { class: "btn sm ghost", type: "button", text: "Clear table" });
    el.append(h("div", { class: "controls" }, [nSel, fnSel, stSel, markLbl]), h("div", { class: "controls" }, [keyIn, insBtn, findBtn, delBtn, exBtn, resetBtn]));
    const errBox = h("div", { class: "err", style: "min-height:1.2em;margin-bottom:4px" });
    const tableWrap = h("div", { style: "display:flex;flex-direction:column;gap:4px" });
    const stat = h("div", { class: "stat-line" });
    const work = h("div", { class: "output", style: "min-height:150px" });
    const log = h("div", { class: "output", style: "margin-top:10px;max-height:200px;overflow:auto;font-size:0.8rem" });
    const right = h("div", {}, [h("div", { class: "bit-label", style: "text-align:left", text: "Working" }), work]);
    el.append(errBox, h("div", { class: "two-col" }, [h("div", {}, [tableWrap, stat]), right]), log);

    // ---------- hashing ----------
    function isNum(k) {
      return /^\d+$/.test(k);
    }
    /** returns {h, lines} or {error} */
    function hash(key) {
      const lines = [];
      if (fn === "mod") {
        if (!isNum(key)) return { error: "key MOD N needs a whole-number key. For words choose “ASCII sum MOD N”." };
        const k = BigInt(key);
        const hv = Number(k % BigInt(N));
        lines.push("hash(" + key + ") = " + key + " MOD " + N, "             = " + hv + "   (" + key + " = " + N + " × " + (k / BigInt(N)) + " + " + hv + ")");
        return { h: hv, lines };
      }
      if (fn === "ascii") {
        const codes = Array.from(key).map((c) => c.charCodeAt(0));
        const sum = codes.reduce((a, b) => a + b, 0);
        lines.push("ASCII codes: " + Array.from(key).map((c, i) => "'" + c + "'=" + codes[i]).join(", "));
        lines.push("sum = " + codes.join(" + ") + " = " + sum);
        lines.push("hash = " + sum + " MOD " + N + " = " + (sum % N) + "   (" + sum + " = " + N + " × " + Math.floor(sum / N) + " + " + (sum % N) + ")");
        return { h: sum % N, lines };
      }
      if (!isNum(key)) return { error: "Folding here works on whole-number keys (e.g. 123456). For words choose “ASCII sum MOD N”." };
      const parts = key.match(/\d{1,2}/g);
      const sum = parts.reduce((a, p) => a + parseInt(p, 10), 0);
      lines.push("split into pairs: " + parts.join(" | "));
      lines.push("fold (add): " + parts.map((p) => parseInt(p, 10)).join(" + ") + " = " + sum);
      lines.push("hash = " + sum + " MOD " + N + " = " + (sum % N));
      return { h: sum % N, lines };
    }

    // ---------- operations (return a list of probed slots + messages) ----------
    function probeSearch(key, h0, lines) {
      const probes = [];
      let i = h0;
      for (let n = 0; n < N; n++) {
        probes.push(i);
        const s = table[i];
        if (s === null) {
          lines.push("probe " + (n + 1) + ": slot " + i + " is EMPTY → stop: " + key + " is NOT in the table.");
          return { found: -1, probes };
        }
        if (s === DEL) lines.push("probe " + (n + 1) + ": slot " + i + " holds a DELETED marker → keep going: i ← (" + i + " + 1) MOD " + N + " = " + ((i + 1) % N));
        else if (s === key) {
          lines.push("probe " + (n + 1) + ": slot " + i + " holds " + s + " → FOUND at slot " + i + ".");
          return { found: i, probes };
        } else lines.push("probe " + (n + 1) + ": slot " + i + " holds " + s + " ≠ " + key + " → i ← (" + i + " + 1) MOD " + N + " = " + ((i + 1) % N));
        i = (i + 1) % N;
      }
      lines.push("All " + N + " slots probed → " + key + " is NOT in the table.");
      return { found: -1, probes };
    }
    function run(op) {
      if (busy) return;
      errBox.textContent = "";
      const key = keyIn.value.trim();
      if (!key) return (errBox.textContent = "Type a key first.");
      if (key.length > 20) return (errBox.textContent = "Keep keys to 20 characters or fewer.");
      const r = hash(key);
      if (r.error) return (errBox.textContent = r.error);
      const lines = [op.toUpperCase() + " " + key, ...r.lines, ""];
      let probes = [r.h],
        final = null,
        cls = "ok",
        summary;
      if (strategy === "chain") {
        const list = table[r.h];
        const pos = list.indexOf(key);
        lines.push("Go to slot " + r.h + " and walk its list: [" + list.join(" → ") + "]" + (pos >= 0 ? " – " + key + " is item " + (pos + 1) : " – " + key + " not in it") + " (" + (pos >= 0 ? pos + 1 : list.length) + " comparison" + ((pos >= 0 ? pos + 1 : list.length) === 1 ? "" : "s") + ")");
        if (op === "insert") {
          if (pos >= 0) (summary = key + " is already in the table – not inserted."), (cls = "bad");
          else {
            if (list.length) lines.push("COLLISION: slot " + r.h + " is already used → add " + key + " to the end of slot " + r.h + "'s list.");
            else lines.push("Slot " + r.h + " is empty → its list becomes [" + key + "].");
            list.push(key);
            summary = "Inserted " + key + " into the list at slot " + r.h + ".";
          }
        } else if (op === "search") summary = pos >= 0 ? "FOUND " + key + " in slot " + r.h + "'s list." : key + " NOT FOUND.";
        else if (pos >= 0) {
          list.splice(pos, 1);
          lines.push("Unlink it from the list. No marker is needed with chaining – the other keys stay in the same list.");
          summary = "Deleted " + key + " from slot " + r.h + ".";
        } else (summary = key + " not found – nothing deleted."), (cls = "bad");
        if (pos < 0 && op !== "insert") cls = "bad";
        final = r.h;
      } else {
        const sr = probeSearch(key, r.h, op === "search" || op === "delete" ? lines : []);
        if (op === "insert") {
          if (sr.found >= 0) {
            summary = key + " is already in slot " + sr.found + " – not inserted.";
            probes = sr.probes;
            final = sr.found;
            cls = "bad";
          } else {
            probes = [];
            let i = r.h,
              placed = -1;
            for (let n = 0; n < N; n++) {
              probes.push(i);
              const s = table[i];
              if (s === null || s === DEL) {
                lines.push("probe " + (n + 1) + ": slot " + i + " is " + (s === null ? "empty" : "DELETED (reusable)") + " → table[" + i + "] ← " + key);
                placed = i;
                break;
              }
              lines.push("probe " + (n + 1) + ": slot " + i + " holds " + s + " → COLLISION → rehash: i ← (" + i + " + 1) MOD " + N + " = " + ((i + 1) % N));
              i = (i + 1) % N;
            }
            if (placed < 0) {
              summary = "Table is FULL – every slot probed, " + key + " cannot be inserted.";
              cls = "bad";
            } else {
              table[placed] = key;
              summary = "Inserted " + key + " at slot " + placed + " after " + probes.length + " probe" + (probes.length === 1 ? "" : "s") + (placed !== r.h ? " (home slot " + r.h + " was taken)." : ".");
              final = placed;
            }
          }
        } else {
          probes = sr.probes;
          final = sr.found >= 0 ? sr.found : null;
          if (sr.found < 0) (summary = key + " NOT FOUND after " + probes.length + " probe" + (probes.length === 1 ? "" : "s") + "."), (cls = "bad");
          else if (op === "search") summary = "FOUND " + key + " at slot " + sr.found + " after " + probes.length + " probe" + (probes.length === 1 ? "" : "s") + ".";
          else if (markChk.checked) {
            table[sr.found] = DEL;
            lines.push("table[" + sr.found + "] ← DELETED marker (not empty!), so searches for keys stored further along the probe sequence keep going past this slot.");
            summary = "Deleted " + key + "; slot " + sr.found + " now holds a DELETED marker.";
          } else {
            table[sr.found] = null;
            lines.push("table[" + sr.found + "] ← EMPTY. ⚠ Any key that probed past slot " + sr.found + " to find its place can now no longer be found – a search will stop here.");
            summary = "Deleted " + key + " by emptying slot " + sr.found + " (no marker – watch out!).";
            cls = "bad";
          }
        }
      }
      lines.push("", summary);
      work.textContent = lines.join("\n");
      log.textContent = summary + "\n" + log.textContent;
      if (op !== "search") keyIn.value = "";
      animate(probes, final, cls);
    }
    function animate(probes, final, cls) {
      busy = true;
      let k = 0;
      const tick = () => {
        draw(probes.slice(0, k + 1), k === probes.length - 1 ? { slot: final, cls } : null);
        k++;
        if (k < probes.length) setTimeout(tick, 220);
        else busy = false;
      };
      tick();
    }

    // ---------- drawing ----------
    function draw(probed, fin) {
      probed = probed || [];
      tableWrap.innerHTML = "";
      let count = 0,
        dels = 0;
      for (let i = 0; i < N; i++) {
        const row = h("div", { style: "display:flex;gap:6px;align-items:center;flex-wrap:wrap" });
        row.appendChild(h("span", { class: "bit-label", style: "min-width:2.2em;text-align:right", text: "[" + i + "]" }));
        const order = probed.indexOf(i);
        const isFin = fin && fin.slot === i;
        const mark = isFin ? " " + fin.cls : order >= 0 ? " hl" : "";
        if (strategy === "chain") {
          const list = table[i];
          count += list.length;
          row.appendChild(h("div", { class: "cell" + (list.length ? "" : " dim") + mark, style: "min-width:40px;font-size:.8rem", text: list.length ? "•" : "∅" }));
          list.forEach((k) => {
            row.appendChild(h("span", { "aria-hidden": "true", style: "color:var(--text-3)", text: "→" }));
            row.appendChild(h("div", { class: "cell", style: "min-width:54px;height:34px;font-size:.85rem", text: k }));
          });
          if (list.length > 1) row.appendChild(h("span", { class: "pill warn", text: "collision" }));
        } else {
          const s = table[i];
          if (s !== null && s !== DEL) count++;
          if (s === DEL) dels++;
          row.appendChild(h("div", { class: "cell" + (s === null ? " dim" : "") + mark, style: "min-width:110px;height:34px;font-size:.85rem" + (s === DEL ? ";color:var(--bad);border-style:dashed" : ""), text: s === null ? "" : s === DEL ? "DELETED" : s }));
          if (order >= 0) row.appendChild(h("span", { class: "bit-label", style: "color:var(--warn);font-weight:700", text: "probe " + (order + 1) }));
        }
        tableWrap.appendChild(row);
      }
      const lf = count / N;
      stat.innerHTML = "items = " + count + ", slots N = " + N + " → <b>load factor = " + count + " ÷ " + N + " = " + lf.toFixed(2) + "</b>" + (dels ? "<br>DELETED markers: " + dels : "") + (lf >= 0.7 && strategy === "probe" ? "<br><span style='color:var(--warn)'>Load factor ≥ 0.7 – probing gets slow; a real table would be resized and every key rehashed.</span>" : "");
    }
    function clear() {
      table = strategy === "chain" ? Array.from({ length: N }, () => []) : new Array(N).fill(null);
      work.textContent = "Empty table of " + N + " slots. Type a key and press Insert.";
      errBox.textContent = "";
      draw();
    }
    function loadExample() {
      clear();
      const words = fn === "ascii" ? ["cat", "dog", "act", "emu", "god", "owl"] : fn === "fold" ? ["123456", "450012", "7788", "990011", "135", "246810"] : ["23", "45", "34", "12", "56", "70"];
      words.forEach((w) => {
        keyIn.value = w;
        const r = hash(w);
        if (strategy === "chain") table[r.h].push(w);
        else {
          let i = r.h;
          for (let n = 0; n < N && table[i] !== null; n++) i = (i + 1) % N;
          if (table[i] === null) table[i] = w;
        }
      });
      keyIn.value = "";
      work.textContent = "Inserted example keys: " + words.join(", ") + "\nNow try searching for one, or deleting one and then searching for a key that collided with it.";
      log.textContent = "Loaded example keys " + words.join(", ") + "\n" + log.textContent;
      draw();
    }
    insBtn.addEventListener("click", () => run("insert"));
    findBtn.addEventListener("click", () => run("search"));
    delBtn.addEventListener("click", () => run("delete"));
    exBtn.addEventListener("click", loadExample);
    resetBtn.addEventListener("click", clear);
    keyIn.addEventListener("keydown", (e) => e.key === "Enter" && run("insert"));
    nSel.addEventListener("change", () => ((N = +nSel.value), clear()));
    fnSel.addEventListener("change", () => ((fn = fnSel.value), clear()));
    stSel.addEventListener("change", () => {
      strategy = stSel.value;
      markLbl.style.display = strategy === "probe" ? "" : "none";
      clear();
    });
    clear();
  },
});
