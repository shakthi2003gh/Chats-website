const CACHE_NAME = "chats-webapp-cache-v1";
const cacheAssets = [];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(cacheAssets))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      const promises = cacheNames.map((cache) => {
        if (cache !== CACHE_NAME) return caches.delete(cache);
      });

      return Promise.all(promises);
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const res = e.request;
  if (res.url.includes("/api/")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });

        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
