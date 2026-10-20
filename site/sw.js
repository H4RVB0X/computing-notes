/* =====================================================================
   sw.js — service worker: makes the installed app work offline
   Network first (so you always get the latest version when online), falling back to the
   copy saved on the device. Everything is saved on first install, so the whole site works
   offline straight away. Pyodide (code practice) is cached the first time it is used.
   ===================================================================== */
const CACHE = "cs-revision-v1";
const SHELL = [
  "./", "index.html", "manifest.webmanifest", "css/style.css",
  "js/config.js", "js/core.js", "js/highlight.js", "js/markdown.js", "js/quiz.js", "js/flashcards.js",
  "js/trace.js", "js/review.js", "js/sync.js", "js/countdown.js", "js/levels.js", "js/code.js", "js/py-worker.js", "js/search.js", "js/app.js",
  "content/sections.js", "content/manifest.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
];
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/";
const TIMEOUT = 4000; // ms to wait for the network before using the saved copy

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      let content = [];
      try {
        self.window = self; // manifest.js writes to window.CS
        importScripts("content/manifest.js");
        content = self.CS.manifest || [];
      } catch (err) {}
      await cache.addAll(SHELL);
      // content files one by one, so a single missing file doesn't stop the install
      await Promise.all(content.map((u) => cache.add(u).catch(() => {})));
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.href.startsWith(PYODIDE)) return e.respondWith(cacheFirst(req)); // versioned URLs never change
  if (url.origin !== location.origin) return; // Firebase, fonts etc.: straight to the network
  e.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) (await caches.open(CACHE)).put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const fromNet = fetch(req).then((res) => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  });
  const timer = new Promise((resolve) => setTimeout(resolve, TIMEOUT));
  try {
    const res = await Promise.race([fromNet, timer]);
    if (res) return res;
  } catch (err) {}
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  return fromNet; // slow network and nothing saved: keep waiting
}
