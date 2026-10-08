/* =====================================================================
   flashcards.js — Leitner-box spaced repetition
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const DAY = 86400000;
  const INTERVALS = [0, 0, 1, 3, 7, 14]; // box -> days until due (box 1 = every session)

  function cardsFor(topicId) {
    const out = [];
    const t = CS.topics[topicId];
    if (t) {
      if (!t.keyterms) {
        const ctx = { toc: [], keyterms: [] };
        CS.markdown.render(t.md, ctx);
        t.keyterms = ctx.keyterms;
      }
      t.keyterms.forEach((k) => out.push({ front: k.term, back: k.formal + (k.plain ? "\n\n_" + k.plain + "_" : ""), topic: topicId, kind: "term" }));
    }
    (CS.flashcards[topicId] || []).forEach((c) => out.push(Object.assign({ topic: topicId, kind: "card" }, c)));
    out.forEach((c) => (c.id = U.hash(topicId + "|" + c.front)));
    return out;
  }
  function state(id) {
    return CS.store.get("flash." + id, { box: 1, due: 0 });
  }
  function isDue(id) {
    return state(id).due <= Date.now();
  }
  function dueCount(topicId) {
    const ids = topicId ? [topicId] : CS.allTopicIds();
    let n = 0;
    ids.forEach((t) => cardsFor(t).forEach((c) => isDue(c.id) && n++));
    return n;
  }
  function grade(card, ok) {
    const s = state(card.id);
    let box = ok ? Math.min(5, s.box + 1) : 1;
    const due = Date.now() + INTERVALS[box] * DAY;
    CS.store.set("flash." + card.id, { box: box, due: due, seen: (s.seen || 0) + 1 });
  }
  CS.flash = { cardsFor, dueCount, state, grade };

  CS.views.flashcards = function (main, arg) {
    const topicId = arg[0];
    if (!topicId) return deckList(main);
    const meta = topicId === "due" ? { title: "All cards due today" } : CS.topicMeta(topicId);
    if (!meta) return CS.views.notfound(main);
    document.title = "CS Revision · Flashcards " + (topicId === "due" ? "" : topicId);
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › <a href="#/flashcards">Flashcards</a>' + (topicId !== "due" ? ' › <a href="#/topic/' + topicId + '">' + topicId + "</a>" : "") + "</div><h1>Flashcards: " + U.esc(meta.title) + "</h1>" }));
    let cards = topicId === "due" ? CS.allTopicIds().flatMap(cardsFor).filter((c) => isDue(c.id)) : cardsFor(topicId);
    if (!cards.length) {
      main.appendChild(h("div", { class: "card", text: topicId === "due" ? "Nothing is due. Nice." : "No flashcards for this topic yet." }));
      return;
    }
    const due = cards.filter((c) => isDue(c.id));
    const wrap = h("div", { class: "flash-wrap" });
    main.appendChild(wrap);
    const boxes = h("div", { class: "leitner" });
    const drawBoxes = () => {
      boxes.innerHTML = "";
      for (let b = 1; b <= 5; b++) {
        const n = cards.filter((c) => state(c.id).box === b).length;
        boxes.appendChild(h("div", { class: "box", html: "<b>" + n + "</b>Box " + b + (b === 1 ? " (daily)" : " (" + INTERVALS[b] + "d)") }));
      }
    };
    drawBoxes();
    wrap.appendChild(boxes);
    const info = h("p", { class: "small muted", text: due.length + " of " + cards.length + " cards are due now. Cards you know move up a box and come back less often; cards you miss drop to box 1." });
    wrap.appendChild(info);
    const modeRow = h("div", { class: "row", style: "margin-bottom:12px" });
    const startDue = h("button", { type: "button", class: "btn primary", text: "Review due cards (" + due.length + ")" });
    const startAll = h("button", { type: "button", class: "btn", text: "Practise all cards" });
    startDue.disabled = !due.length;
    modeRow.append(startDue, startAll);
    wrap.appendChild(modeRow);
    const area = h("div");
    wrap.appendChild(area);
    const session = (deck) => {
      modeRow.remove();
      info.remove();
      let queue = U.shuffle(deck);
      let i = 0,
        got = 0,
        missed = 0;
      const render = () => {
        area.innerHTML = "";
        if (i >= queue.length) {
          area.appendChild(h("div", { class: "card quiz-summary", html: '<div class="big">' + got + "/" + queue.length + "</div><p>Cards you knew. " + (missed ? missed + " went back to box 1 — they'll show up again next session." : "Everything moved up a box.") + '</p><p><a class="btn primary" href="#/flashcards">Back to decks</a> ' + (topicId !== "due" ? '<a class="btn" href="#/topic/' + topicId + '">Back to notes</a>' : "") + "</p>" }));
          drawBoxes();
          return;
        }
        const c = queue[i];
        const st = state(c.id);
        const fc = h("div", { class: "flashcard", tabindex: "0", role: "button", "aria-label": "Flashcard, press space to flip" });
        const inner = h("div", { class: "inner" });
        inner.appendChild(h("div", { class: "face front", html: '<span class="lbl">' + (c.kind === "term" ? "Key term" : "Question") + '</span><span class="box">Box ' + st.box + "</span><div>" + CS.markdown.inline(c.front) + "</div>" }));
        inner.appendChild(h("div", { class: "face back", html: '<span class="lbl">Answer</span><div>' + CS.markdown.render(c.back, {}) + "</div>" }));
        fc.appendChild(inner);
        const flip = () => fc.classList.toggle("flipped");
        fc.addEventListener("click", flip);
        fc.addEventListener("keydown", (e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            flip();
          }
        });
        area.appendChild(h("div", { class: "small muted", style: "text-align:center;margin-bottom:6px", text: "Card " + (i + 1) + " of " + queue.length + " · " + c.topic }));
        area.appendChild(fc);
        const ctr = h("div", { class: "flash-controls" });
        const no = h("button", { type: "button", class: "btn danger", text: "✗ Not yet (1)" });
        const yes = h("button", { type: "button", class: "btn ok", text: "✓ Got it (2)" });
        const flipBtn = h("button", { type: "button", class: "btn", text: "Flip (space)" });
        flipBtn.addEventListener("click", flip);
        no.addEventListener("click", () => {
          grade(c, false);
          missed++;
          i++;
          render();
        });
        yes.addEventListener("click", () => {
          grade(c, true);
          got++;
          i++;
          render();
        });
        ctr.append(no, flipBtn, yes);
        area.appendChild(ctr);
        fc.focus();
        area._keys = (e) => {
          if (/input|textarea/i.test(e.target.tagName)) return;
          if (e.key === "1") no.click();
          if (e.key === "2") yes.click();
        };
      };
      document.removeEventListener("keydown", area._globalKeys || (() => {}));
      area._globalKeys = (e) => area._keys && area._keys(e);
      document.addEventListener("keydown", area._globalKeys);
      render();
    };
    startDue.addEventListener("click", () => session(due));
    startAll.addEventListener("click", () => session(cards));
    if (arg[1] === "all") startAll.click();
  };

  function deckList(main) {
    document.title = "CS Revision · Flashcards";
    main.appendChild(h("div", { class: "topic-head", html: '<div class="crumbs"><a href="#/">Home</a> › Flashcards</div><h1>Flashcards</h1><p class="muted">Spaced repetition using Leitner boxes. Review the due cards every day you revise; it takes a few minutes and it works.</p>' }));
    const totalDue = dueCount();
    main.appendChild(h("p", null, h("a", { class: "btn primary", href: "#/flashcards/due", text: "Review everything due today (" + totalDue + ")" })));
    CS.sections.forEach((s) => {
      const decks = s.topics.map((t) => ({ t: t, cards: cardsFor(t.id) })).filter((d) => d.cards.length);
      if (!decks.length) return;
      main.appendChild(h("h2", { text: s.id + " · " + s.title, style: "font-size:1.15rem;margin:1.4em 0 0.5em" }));
      const grid = h("div", { class: "deck-list" });
      decks.forEach((d) => {
        const due = d.cards.filter((c) => isDue(c.id)).length;
        const mastered = d.cards.filter((c) => state(c.id).box >= 4).length;
        grid.appendChild(h("a", { class: "action-card", href: "#/flashcards/" + d.t.id, html: '<div class="t">' + d.t.id + " " + U.esc(d.t.title) + '</div><div class="d">' + d.cards.length + " cards · " + due + " due · " + mastered + " mastered</div>" }));
      });
      main.appendChild(grid);
    });
  }
})();
