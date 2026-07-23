const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const { describe, test } = require("node:test");
const vm = require("node:vm");

async function loadWorker(options = {}) {
  const listeners = new Map();
  const stores = options.stores ?? new Map();
  const deleted = [];
  let network = async (request) =>
    new Response(request.url, {
      headers: { "content-language": "en" },
    });
  let skipped = false;

  function cache(name) {
    if (!stores.has(name)) {
      stores.set(name, new Map());
    }
    const entries = stores.get(name);
    return {
      async addAll(urls) {
        for (const url of urls) {
          entries.set(
            new URL(url, "https://valyrianjs.dev").href,
            new Response(url),
          );
        }
      },
      async match(request, options = {}) {
        const key =
          typeof request === "string"
            ? new URL(request, "https://valyrianjs.dev").href
            : request.url;
        if (options.ignoreSearch) {
          const pathname = new URL(key).pathname;
          for (const [entry, response] of entries) {
            if (new URL(entry).pathname === pathname) {
              return response.clone();
            }
          }
        }
        return entries.get(key)?.clone();
      },
      async put(request, response) {
        const key =
          typeof request === "string"
            ? new URL(request, "https://valyrianjs.dev").href
            : request.url;
        if (typeof options.put === "function") {
          return options.put({ entries, key, name, response });
        }
        entries.set(key, response);
      },
    };
  }

  const self = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    clients: { claim: async () => undefined },
    location: { origin: "https://valyrianjs.dev" },
    skipWaiting: async () => {
      skipped = true;
    },
  };
  const caches = {
    delete: async (name) => {
      deleted.push(name);
      stores.delete(name);
    },
    keys: async () => [...stores.keys()],
    open: async (name) => cache(name),
  };
  const source = options.source ?? (await readFile("public/sw.js", "utf8"));
  vm.runInNewContext(source, {
    URL,
    Request,
    Response,
    caches,
    fetch: (request) => network(request),
    self,
  });

  return {
    cache,
    deleted,
    dispatch(type, event) {
      listeners.get(type)(event);
    },
    setNetwork(handler) {
      network = handler;
    },
    stores,
    wasSkipped: () => skipped,
  };
}

async function dispatchExtendable(worker, type, event = {}) {
  let completion;
  worker.dispatch(type, {
    ...event,
    waitUntil(promise) {
      completion = promise;
    },
  });
  await completion;
}

async function dispatchFetch(worker, request, clientId = "client") {
  let response;
  worker.dispatch("fetch", {
    clientId,
    request,
    respondWith(promise) {
      response = promise;
    },
  });
  return response === undefined ? undefined : response;
}

describe("PWA worker", () => {
  test("ignores non-GET requests without touching the network or cache", async () => {
    const worker = await loadWorker();
    let fetched = false;
    worker.setNetwork(async () => {
      fetched = true;
      return new Response("unexpected");
    });

    const response = await dispatchFetch(
      worker,
      new Request("https://valyrianjs.dev/actions", { method: "POST" }),
    );

    assert.equal(response, undefined);
    assert.equal(fetched, false);
    assert.equal(worker.stores.size, 0);
  });

  test("does not cache same-origin resources outside the build asset list", async () => {
    const worker = await loadWorker();
    let fetched = false;
    worker.setNetwork(async () => {
      fetched = true;
      return new Response("unexpected");
    });

    const response = await dispatchFetch(worker, {
      method: "GET",
      mode: "same-origin",
      url: "https://valyrianjs.dev/generated/build.json",
    });

    assert.equal(response, undefined);
    assert.equal(fetched, false);
    assert.equal(worker.stores.size, 0);
  });

  test("deletes stale site caches and preserves caches from other applications", async () => {
    const worker = await loadWorker();
    await worker
      .cache("unrelated-app:v1")
      .put(
        new Request("https://valyrianjs.dev/foreign"),
        new Response("foreign"),
      );
    await worker
      .cache("valyrian-site:stale:assets")
      .put(new Request("https://valyrianjs.dev/stale"), new Response("stale"));

    await dispatchExtendable(worker, "activate");

    assert.deepEqual(worker.deleted, ["valyrian-site:stale:assets"]);
    assert.equal(worker.stores.has("unrelated-app:v1"), true);
  });

  test("precaches each asset through one canonical request URL", async () => {
    const worker = await loadWorker();

    await dispatchExtendable(worker, "install");

    const assetEntries = [...worker.stores.entries()].find(([name]) =>
      name.endsWith(":assets"),
    )?.[1];
    assert.ok(assetEntries instanceof Map);
    const urls = [...assetEntries.keys()];
    assert.equal(new Set(urls).size, urls.length);
    assert.equal(
      urls.filter((url) => new URL(url).pathname === "/generated/pages.es.json")
        .length,
      1,
    );
    assert.equal(
      urls.filter((url) => new URL(url).pathname === "/app.js").length,
      1,
    );
    assert.equal(
      new URL(
        urls.find((url) => new URL(url).pathname === "/app.js"),
      ).searchParams.has("v"),
      true,
    );
    assert.equal(
      new URL(
        urls.find(
          (url) => new URL(url).pathname === "/generated/pages.es.json",
        ),
      ).search,
      "",
    );
  });

  test("caches canonical English navigation for every client locale", async () => {
    const worker = await loadWorker();
    await dispatchExtendable(worker, "install");
    worker.dispatch("message", {
      data: { type: "SET_LOCALE", locale: "en" },
      source: { id: "en-client" },
    });
    worker.dispatch("message", {
      data: { type: "SET_LOCALE", locale: "es" },
      source: { id: "es-client" },
    });
    const request = {
      method: "GET",
      mode: "navigate",
      url: "https://valyrianjs.dev/__test/navigation",
    };
    worker.setNetwork(async () => {
      return new Response("Canonical English SSR", {
        headers: { "content-language": "en" },
      });
    });
    await dispatchFetch(worker, request, "es-client");
    worker.setNetwork(async () => {
      throw new Error("offline");
    });

    const english = await dispatchFetch(worker, request, "en-client");
    const spanish = await dispatchFetch(worker, request, "es-client");

    assert.equal(await english.text(), "Canonical English SSR");
    assert.equal(await spanish.text(), "Canonical English SSR");
    assert.equal(
      [...worker.stores.keys()].filter((name) => name.includes(":pages"))
        .length,
      1,
    );
  });
});

describe("PWA worker locale and updates", () => {
  test("restores locale by client after restart without crossing clients", async () => {
    const stores = new Map();
    const firstWorker = await loadWorker({ stores });
    await dispatchExtendable(firstWorker, "install");
    await dispatchExtendable(firstWorker, "message", {
      data: { type: "SET_LOCALE", locale: "es" },
      source: { id: "spanish-client" },
    });

    const restartedWorker = await loadWorker({ stores });
    restartedWorker.setNetwork(async () => {
      throw new Error("offline");
    });
    const spanish = await dispatchFetch(
      restartedWorker,
      {
        method: "GET",
        mode: "navigate",
        url: "https://valyrianjs.dev/after-restart",
      },
      "spanish-client",
    );
    const english = await dispatchFetch(
      restartedWorker,
      {
        method: "GET",
        mode: "navigate",
        url: "https://valyrianjs.dev/after-restart",
      },
      "new-client",
    );

    assert.match(await spanish.text(), /offline\.es\.html/);
    assert.match(await english.text(), /offline\.en\.html/);
  });

  test("preserves client locale while activating a new build offline", async () => {
    const source = await readFile("public/sw.js", "utf8");
    const stores = new Map();
    const oldWorker = await loadWorker({
      source: source.replace(
        /const VERSION = "[^"]+";/,
        'const VERSION = "build-old";',
      ),
      stores,
    });
    await dispatchExtendable(oldWorker, "install");
    await dispatchExtendable(oldWorker, "message", {
      data: { type: "SET_LOCALE", locale: "es" },
      source: { id: "spanish-client" },
    });

    const newWorker = await loadWorker({
      source: source.replace(
        /const VERSION = "[^"]+";/,
        'const VERSION = "build-new";',
      ),
      stores,
    });
    await dispatchExtendable(newWorker, "install");
    await dispatchExtendable(newWorker, "activate");
    newWorker.setNetwork(async () => {
      throw new Error("offline");
    });

    const response = await dispatchFetch(
      newWorker,
      {
        method: "GET",
        mode: "navigate",
        url: "https://valyrianjs.dev/after-update",
      },
      "spanish-client",
    );

    assert.match(await response.text(), /offline\.es\.html/);
    assert.equal(
      [...stores.keys()].some((name) => name === "valyrian-site:preferences"),
      true,
    );
  });

  test("serializes locale writes so a slower old value cannot win", async () => {
    let releaseFirst;
    let puts = 0;
    const worker = await loadWorker({
      async put({ entries, key, response }) {
        puts += 1;
        if (puts === 1) {
          await new Promise((resolve) => {
            releaseFirst = resolve;
          });
        }
        entries.set(key, response);
      },
    });
    await dispatchExtendable(worker, "install");
    const completions = [];
    for (const locale of ["en", "es"]) {
      worker.dispatch("message", {
        data: { type: "SET_LOCALE", locale },
        source: { id: "client" },
        waitUntil(promise) {
          completions.push(promise);
        },
      });
    }
    for (
      let attempt = 0;
      attempt < 10 && typeof releaseFirst !== "function";
      attempt += 1
    ) {
      await Promise.resolve();
    }
    assert.equal(typeof releaseFirst, "function");
    releaseFirst();
    await Promise.all(completions);
    worker.setNetwork(async () => {
      throw new Error("offline");
    });

    const response = await dispatchFetch(worker, {
      method: "GET",
      mode: "navigate",
      url: "https://valyrianjs.dev/serialized-locale",
    });

    assert.match(await response.text(), /offline\.es\.html/);
  });

  test("continues locale writes after a cache failure", async () => {
    let puts = 0;
    const worker = await loadWorker({
      async put({ entries, key, response }) {
        puts += 1;
        if (puts === 1) {
          throw new Error("controlled preference failure");
        }
        entries.set(key, response);
      },
    });
    await dispatchExtendable(worker, "install");
    await assert.rejects(
      dispatchExtendable(worker, "message", {
        data: { type: "SET_LOCALE", locale: "en" },
        source: { id: "client" },
      }),
      /preference failure/,
    );
    await dispatchExtendable(worker, "message", {
      data: { type: "SET_LOCALE", locale: "es" },
      source: { id: "client" },
    });
    worker.setNetwork(async () => {
      throw new Error("offline");
    });

    const response = await dispatchFetch(worker, {
      method: "GET",
      mode: "navigate",
      url: "https://valyrianjs.dev/recovered-locale",
    });

    assert.match(await response.text(), /offline\.es\.html/);
  });

  test("uses the localized offline fallback and waits for explicit update approval", async () => {
    const worker = await loadWorker();
    await dispatchExtendable(worker, "install");
    worker.dispatch("message", {
      data: { type: "SET_LOCALE", locale: "es" },
      source: { id: "client" },
    });
    worker.setNetwork(async () => {
      throw new Error("offline");
    });

    const response = await dispatchFetch(worker, {
      method: "GET",
      mode: "navigate",
      url: "https://valyrianjs.dev/missing",
    });

    assert.match(await response.text(), /offline\.es\.html/);
    assert.equal(worker.wasSkipped(), false);
    worker.dispatch("message", {
      data: { type: "SKIP_WAITING" },
      source: { id: "client" },
    });
    assert.equal(worker.wasSkipped(), true);
  });

  test("serves current-build styles to the offline fallback", async () => {
    const worker = await loadWorker();
    await dispatchExtendable(worker, "install");
    const assetEntries = [...worker.stores.entries()].find(([name]) =>
      name.endsWith(":assets"),
    )?.[1];
    const cachedStyleUrl = [...assetEntries.keys()].find(
      (url) => new URL(url).pathname === "/base.css",
    );
    assert.equal(typeof cachedStyleUrl, "string");
    worker.setNetwork(async () => {
      throw new Error("offline");
    });

    const response = await dispatchFetch(worker, {
      method: "GET",
      mode: "same-origin",
      url: cachedStyleUrl,
    });

    assert.equal(
      new URL(await response.text(), "https://valyrianjs.dev").pathname,
      "/base.css",
    );
  });

  test("activates a complete new build without mixing old assets", async () => {
    const source = await readFile("public/sw.js", "utf8");
    const stores = new Map();
    const oldWorker = await loadWorker({
      source: source.replace(
        /const VERSION = "[^"]+";/,
        'const VERSION = "build-old";',
      ),
      stores,
    });
    await dispatchExtendable(oldWorker, "install");
    oldWorker.setNetwork(async () => new Response("new asset from network"));
    const transitionResponse = await dispatchFetch(oldWorker, {
      method: "GET",
      mode: "same-origin",
      url: "https://valyrianjs.dev/app.js?v=build-new",
    });
    assert.equal(await transitionResponse.text(), "new asset from network");
    const oldAssetCache = [...stores.keys()].find((name) =>
      name.endsWith(":assets"),
    );
    assert.equal(
      await oldWorker
        .cache(oldAssetCache)
        .match("https://valyrianjs.dev/app.js?v=build-new"),
      undefined,
    );

    const newWorker = await loadWorker({
      source: source.replace(
        /const VERSION = "[^"]+";/,
        'const VERSION = "build-new";',
      ),
      stores,
    });
    await dispatchExtendable(newWorker, "install");
    await dispatchExtendable(newWorker, "activate");

    assert.equal(
      [...stores.keys()].some((name) => name.includes("build-old")),
      false,
    );
    assert.equal(
      [...stores.keys()].every(
        (name) =>
          !name.startsWith("valyrian-site:") ||
          name.includes("build-new") ||
          name === "valyrian-site:preferences",
      ),
      true,
    );
    const response = await dispatchFetch(newWorker, {
      method: "GET",
      mode: "same-origin",
      url: "https://valyrianjs.dev/app.js?v=build-new",
    });
    assert.equal(await response.text(), "/app.js?v=build-new");
  });
});
