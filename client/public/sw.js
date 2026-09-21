const VERSION = "letterbox-offline-v1";
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;
const FONT_CACHE = `${VERSION}-fonts`;
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_ASSET_ENTRIES = 90;
const MAX_PAGE_ENTRIES = 24;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGE_CACHE);
      try {
        await pages.addAll(["/", "/manifest.webmanifest"]);
      } catch {
        // First visit may not be able to precache HTML; runtime caching will.
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (isFontRequest(url)) {
    event.respondWith(cacheFirst(request, FONT_CACHE, 40));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGE_CACHE, MAX_PAGE_ENTRIES));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE, MAX_ASSET_ENTRIES));
  }
});

function isFontRequest(url) {
  return (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com" ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff")
  );
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached && !isExpired(cached)) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      await putWithTimestamp(cache, request, response.clone());
      await trimCache(cache, maxEntries);
    }
    return response;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

async function networkFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      await putWithTimestamp(cache, request, response.clone());
      const path = new URL(request.url).pathname;
      if (path === "/" || path === "") {
        await putWithTimestamp(cache, new Request("/"), response.clone());
      }
      await trimCache(cache, maxEntries);
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await cache.match("/")) ||
      new Response("Letterbox is offline. Open the app once with internet, then you can play for a while without it.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

async function staleWhileRevalidate(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await putWithTimestamp(cache, request, response.clone());
        await trimCache(cache, maxEntries);
      }
      return response;
    })
    .catch(() => null);

  if (cached && !isExpired(cached)) return cached;
  const fresh = await network;
  if (fresh) return fresh;
  if (cached) return cached;
  return new Response("", { status: 504 });
}

async function putWithTimestamp(cache, request, response) {
  const headers = new Headers(response.headers);
  headers.set("sw-cached-at", String(Date.now()));
  const body = await response.blob();
  await cache.put(
    request,
    new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    }),
  );
}

function isExpired(response) {
  const cachedAt = Number(response.headers.get("sw-cached-at") || 0);
  if (!cachedAt) return false;
  return Date.now() - cachedAt > MAX_AGE_MS;
}

async function trimCache(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
}
