/* =====================================================================
   sync.js — optional accounts: Google sign-in and cloud sync with Firebase
   Switched off unless CS.config.firebase.apiKey is filled in (js/config.js, docs/SETUP.md).
   Progress still lives in the browser; when signed in, a copy is kept in Firestore
   (one document per person, users/{uid}) and merged with every device you use.
   ===================================================================== */
(function () {
  "use strict";
  const CS = (window.CS = window.CS || {});
  const U = CS.util;
  const h = (t, a, c) => U.el(t, a, c);
  const SDK = "https://www.gstatic.com/firebasejs/10.14.1/";
  const PUSH_DELAY = 4000; // ms after the last change before uploading
  const LOCAL_ONLY = ["prefs"]; // per-device settings that are never synced

  /* ---------------- merging two copies of the progress store ----------------
     Rules: best score / furthest reading (max), ticks and "done" flags (or), the flashcard state
     with the most reviews, mistakes by newest change (with "gone" markers so graduated ones stay
     gone), histories combined, text (exam answers, code drafts) from this device unless it's empty.
     A full reset stamps syncEpoch; the copy with the newer epoch wins outright. */
  function merge(local, remote) {
    local = local || {};
    remote = remote || {};
    const le = local.syncEpoch || 0,
      re = remote.syncEpoch || 0;
    if (le !== re) return clone(le > re ? local : remote, true, le > re ? null : local);
    const out = mergeValue(local, remote, "");
    // mistakes: newest entry wins; an entry is dropped if it left the deck after its last change
    const gone = mergeValue(local.mistakesGone || {}, remote.mistakesGone || {}, "mistakesGone");
    const lm = local.mistakes || {},
      rm = remote.mistakes || {};
    const m = {};
    new Set(Object.keys(lm).concat(Object.keys(rm))).forEach((id) => {
      const a = lm[id],
        b = rm[id];
      const e = !a ? b : !b ? a : (a.at || a.added || 0) >= (b.at || b.added || 0) ? a : b;
      if (!(gone[id] && gone[id] >= (e.at || e.added || 0))) m[id] = e;
    });
    out.mistakes = m;
    out.mistakesGone = gone;
    return out;
  }
  /** copy, optionally keeping this device's local-only settings */
  function clone(obj, keepLocal, localSrc) {
    const out = JSON.parse(JSON.stringify(obj || {}));
    if (keepLocal && localSrc) LOCAL_ONLY.forEach((k) => (localSrc[k] !== undefined ? (out[k] = localSrc[k]) : delete out[k]));
    return out;
  }
  function mergeValue(a, b, path) {
    if (a === undefined) return b;
    if (b === undefined) return a;
    if (path && LOCAL_ONLY.includes(path)) return a;
    if (Array.isArray(a) && Array.isArray(b)) return mergeArray(a, b);
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (/^flash\./.test(path) && "box" in a && "box" in b) return (a.seen || 0) > (b.seen || 0) || ((a.seen || 0) === (b.seen || 0) && (a.due || 0) >= (b.due || 0)) ? a : b;
      const out = {};
      new Set(Object.keys(a).concat(Object.keys(b))).forEach((k) => (out[k] = mergeValue(a[k], b[k], path ? path + "." + k : k)));
      return out;
    }
    if (typeof a === "number" && typeof b === "number") return Math.max(a, b);
    if (typeof a === "boolean" && typeof b === "boolean") return a || b;
    if (typeof a === "string" && typeof b === "string") return a.trim() ? a : b;
    return a;
  }
  function mergeArray(a, b) {
    if (a.every((x) => x && typeof x === "object" && "t" in x) && b.every((x) => x && typeof x === "object" && "t" in x)) {
      const seen = {};
      return a
        .concat(b)
        .filter((x) => (seen[x.t] ? false : (seen[x.t] = true)))
        .sort((x, y) => x.t - y.t)
        .slice(-30);
    }
    if (a.length === b.length && a.concat(b).every((x) => typeof x === "number")) return a.map((x, i) => Math.max(x, b[i])); // ticked mark-scheme points
    return a;
  }

  /* ---------------- Firebase ---------------- */
  const cfg = (CS.config && CS.config.firebase) || {};
  const enabled = !!cfg.apiKey && /^https?:$/.test(location.protocol);
  let fb = null,
    user = null,
    state = "off", // off | loading | signed-out | syncing | synced | error
    message = "",
    pushTimer = null,
    pulling = false;

  CS.sync = {
    merge: merge,
    enabled: enabled,
    user: () => user,
    /** send a mistake report to the database instead of a form (returns false if not signed in) */
    report(ctx) {
      if (!user || !fb) return false;
      const msg = prompt("What's wrong with " + (ctx.id ? "this question" : "this page") + "? (The page and question are attached automatically.)");
      if (msg == null || !msg.trim()) return true;
      fb.firestore()
        .collection("reports")
        .add({ uid: user.uid, where: String(ctx.where || location.hash).slice(0, 300), id: String(ctx.id || "").slice(0, 120), text: String(ctx.text || "").slice(0, 1000), message: msg.trim().slice(0, 2000), page: location.href.slice(0, 300), t: fb.firestore.FieldValue.serverTimestamp() })
        .then(() => CS.toast("Thanks: report sent"))
        .catch((e) => alert("Couldn't send the report: " + e.message));
      return true;
    },
  };
  if (!enabled) return;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("couldn't load " + src));
      document.head.appendChild(s);
    });
  }
  function setState(s, msg) {
    state = s;
    message = msg || "";
    renderBadge();
    document.querySelectorAll(".account-card").forEach((c) => c.replaceWith(accountCard()));
  }
  const userDoc = () => fb.firestore().collection("users").doc(user.uid);

  async function start() {
    setState("loading");
    try {
      if (!window.firebase) {
        await loadScript(SDK + "firebase-app-compat.js");
        await Promise.all([loadScript(SDK + "firebase-auth-compat.js"), loadScript(SDK + "firebase-firestore-compat.js")]);
      }
      fb = window.firebase;
      if (!fb.apps.length) fb.initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId });
      fb.auth().onAuthStateChanged(async (u) => {
        if (u && cfg.allowedDomain && !String(u.email || "").toLowerCase().endsWith("@" + cfg.allowedDomain.toLowerCase())) {
          await fb.auth().signOut();
          return setState("signed-out", "Only " + cfg.allowedDomain + " accounts can sign in here. Choose your school account.");
        }
        user = u;
        if (!u) return setState("signed-out");
        await pull();
      });
    } catch (e) {
      setState("error", "Accounts are unavailable right now (" + e.message + "). Your progress is still saved on this device.");
    }
  }

  /** download, merge with this device, save both ways */
  async function pull() {
    if (!user || pulling) return;
    pulling = true;
    setState("syncing");
    try {
      const snap = await userDoc().get();
      const remote = snap.exists && snap.data().data ? JSON.parse(snap.data().data) : null;
      const before = JSON.stringify(CS.store.all());
      const merged = merge(CS.store.all(), remote);
      const data = JSON.stringify(withoutLocal(merged));
      if (!remote || data !== JSON.stringify(withoutLocal(remote))) await userDoc().set({ data: data, updated: fb.firestore.FieldValue.serverTimestamp() });
      setState("synced");
      if (JSON.stringify(merged) !== before) {
        // only redraw when something actually arrived from another device
        replaceQuietly(merged);
        CS.prefs.apply();
        if (CS.route) CS.route();
      }
    } catch (e) {
      setState("error", "Sync failed: " + e.message);
    }
    pulling = false;
  }
  /** upload after local changes; merges with the cloud copy first so another device's work isn't lost */
  async function push() {
    if (!user) return;
    setState("syncing");
    try {
      await fb.firestore().runTransaction(async (tx) => {
        const snap = await tx.get(userDoc());
        const remote = snap.exists && snap.data().data ? JSON.parse(snap.data().data) : null;
        const merged = merge(CS.store.all(), remote);
        tx.set(userDoc(), { data: JSON.stringify(withoutLocal(merged)), updated: fb.firestore.FieldValue.serverTimestamp() });
        replaceQuietly(merged);
      });
      setState("synced");
    } catch (e) {
      setState("error", "Sync failed: " + e.message);
    }
  }
  /** replace the cloud copy with this device's, no merging (after "reset my progress on this page",
      which a merge would otherwise undo by taking the best score from the cloud) */
  CS.sync.overwrite = async function () {
    if (!user) return;
    clearTimeout(pushTimer);
    pushTimer = null;
    try {
      await userDoc().set({ data: JSON.stringify(withoutLocal(CS.store.all())), updated: fb.firestore.FieldValue.serverTimestamp() });
      setState("synced");
    } catch (e) {
      setState("error", "Sync failed: " + e.message);
    }
  };
  function withoutLocal(obj) {
    const out = Object.assign({}, obj);
    LOCAL_ONLY.forEach((k) => delete out[k]);
    return out;
  }
  function replaceQuietly(obj) {
    const hook = CS.store.onChange;
    CS.store.onChange = null;
    CS.store.replace(obj);
    CS.store.onChange = hook;
  }
  CS.store.onChange = () => {
    if (!user) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, PUSH_DELAY);
  };
  // pick up work done on another device when you come back to this tab
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && user) pull();
    if (document.visibilityState === "hidden" && pushTimer) {
      clearTimeout(pushTimer);
      push();
    }
  });

  async function signIn() {
    const provider = new fb.auth.GoogleAuthProvider();
    provider.setCustomParameters(cfg.allowedDomain ? { prompt: "select_account", hd: cfg.allowedDomain } : { prompt: "select_account" });
    try {
      await fb.auth().signInWithPopup(provider);
    } catch (e) {
      if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") return fb.auth().signInWithRedirect(provider);
      if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") setState("signed-out", "Sign-in failed: " + e.message);
    }
  }
  async function signOut() {
    if (pushTimer) {
      clearTimeout(pushTimer);
      await push();
    }
    await fb.auth().signOut();
  }
  async function deleteData() {
    if (!confirm("Delete your progress from the cloud and sign out? Progress on this device stays.")) return;
    try {
      await userDoc().delete();
      user = null;
      await fb.auth().signOut();
      CS.toast("Your cloud data has been deleted");
    } catch (e) {
      alert("Couldn't delete: " + e.message);
    }
  }

  /* ---------------- UI ---------------- */
  function renderBadge() {
    let b = document.getElementById("account-badge");
    if (!b) {
      b = h("a", { id: "account-badge", class: "pill", href: "#/progress", style: "margin:0 8px 10px;align-self:flex-start" });
      const brand = document.querySelector(".sidebar .brand");
      if (!brand) return;
      brand.insertAdjacentElement("afterend", b);
    }
    const first = user && (user.displayName || user.email || "").split(/[ @]/)[0];
    b.className = "pill " + (state === "synced" ? "ok" : state === "error" ? "bad" : "");
    b.textContent = user ? (state === "syncing" ? "⟳ Syncing…" : state === "error" ? "⚠ Sync problem" : "☁ Synced · " + first) : state === "loading" ? "…" : "👤 Sign in to sync";
    b.title = message || (user ? "Progress is synced across your devices. Click for account settings." : "Sign in with Google to keep your progress on every device");
  }
  function accountCard() {
    const card = h("div", { class: "card account-card", style: "margin-bottom:16px" });
    card.appendChild(h("h3", { style: "margin-top:0", text: "☁ Account and sync" }));
    if (message) card.appendChild(h("p", { class: "small", style: "color:var(--bad)", text: message }));
    if (state === "loading") card.appendChild(h("p", { class: "small muted", text: "Loading…" }));
    else if (!user) {
      card.appendChild(h("p", { class: "small", text: "Sign in with Google to keep your progress (quiz scores, flashcards, My mistakes, checklist, code) on every device. Without signing in, everything is still saved on this device." }));
      const b = h("button", { type: "button", class: "btn primary", text: "Sign in with Google" });
      b.disabled = !fb;
      b.addEventListener("click", signIn);
      card.appendChild(b);
      card.appendChild(h("p", { class: "small muted", style: "margin:10px 0 0", text: "Your progress is stored against an account id. The site's owner can see which Google accounts have signed in, but other students can't see anything of yours. You can delete your cloud data at any time." }));
    } else {
      card.appendChild(h("p", { class: "small", html: "Signed in as <b>" + U.esc(user.email || user.displayName || "you") + "</b>. " + (state === "synced" ? "Everything is synced." : state === "syncing" ? "Syncing…" : "") }));
      const row = h("div", { class: "row" });
      const now = h("button", { type: "button", class: "btn", text: "⟳ Sync now" });
      now.addEventListener("click", pull);
      const out = h("button", { type: "button", class: "btn", text: "Sign out" });
      out.addEventListener("click", signOut);
      const del = h("button", { type: "button", class: "btn ghost", text: "Delete my cloud data" });
      del.addEventListener("click", deleteData);
      row.append(now, out, del);
      card.appendChild(row);
      card.appendChild(h("p", { class: "small muted", style: "margin:10px 0 0", text: "Signing out keeps the progress on this device. On a shared computer, also switch off \"Save my progress on this device\" below." }));
    }
    return card;
  }
  (CS.settingsCards = CS.settingsCards || []).push(accountCard);
  document.addEventListener("DOMContentLoaded", () => setTimeout(start, 0));
})();
