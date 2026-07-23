const NAMESPACE = "valyrian-site";
const VERSION = "BUILD_VERSION";
const ASSET_CACHE = `${NAMESPACE}:${VERSION}:assets`;
const PAGE_CACHE = `${NAMESPACE}:${VERSION}:pages`;
const PREFERENCE_CACHE = `${NAMESPACE}:preferences`;
const CURRENT_CACHES = new Set([ASSET_CACHE, PREFERENCE_CACHE, PAGE_CACHE]);
const CACHE_FIRST_PATHS = new Set(BUILD_ASSET_PATHS);
const VERSIONED_PATHS = new Set(VERSIONED_ASSET_PATHS);
const LOCALE_KEY = "/__valyrian_locale__";
let preferenceWrite = Promise.resolve();
const essentialAssets = BUILD_ASSET_PATHS.map((pathname) =>
  VERSIONED_PATHS.has(pathname) ? `${pathname}?v=${VERSION}` : pathname,
);

function localeKey(clientId) {
  return `${LOCALE_KEY}/${encodeURIComponent(clientId)}`;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(ASSET_CACHE).then((cache) => cache.addAll(essentialAssets)),
      caches.open(PAGE_CACHE),
    ]),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter(
              (name) =>
                name.startsWith(`${NAMESPACE}:`) && !CURRENT_CACHES.has(name),
            )
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }
  if (
    event.data?.type === "SET_LOCALE" &&
    (event.data.locale === "en" || event.data.locale === "es") &&
    typeof event.source?.id === "string"
  ) {
    preferenceWrite = preferenceWrite
      .catch(() => null)
      .then(() => caches.open(PREFERENCE_CACHE))
      .then((cache) =>
        cache.put(
          new Request(
            new URL(localeKey(event.source.id), self.location.origin),
          ),
          new Response(event.data.locale, {
            headers: { "content-type": "text/plain" },
          }),
        ),
      );
    event.waitUntil?.(preferenceWrite);
  }
});

async function localeFor(clientId) {
  await preferenceWrite.catch(() => null);
  const stored = await caches
    .open(PREFERENCE_CACHE)
    .then((cache) => cache.match(localeKey(clientId)));
  const locale = stored ? await stored.text() : "en";
  return locale === "es" ? "es" : "en";
}

async function navigation(request, locale) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok && response.headers.get("content-language") === "en") {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (
      (await cache.match(request)) ||
      (await caches
        .open(ASSET_CACHE)
        .then((assets) => assets.match(`/offline.${locale}.html?v=${VERSION}`)))
    );
  }
}

async function asset(request) {
  const requestedVersion = new URL(request.url).searchParams.get("v");
  if (requestedVersion !== null && requestedVersion !== VERSION) {
    return fetch(request);
  }
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response.ok && response.type !== "opaque") {
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(
      localeFor(event.clientId).then((locale) =>
        navigation(event.request, locale),
      ),
    );
    return;
  }
  if (CACHE_FIRST_PATHS.has(url.pathname)) {
    event.respondWith(asset(event.request));
  }
});
