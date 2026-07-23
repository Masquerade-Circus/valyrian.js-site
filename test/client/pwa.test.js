const assert = require("node:assert/strict");
const { test } = require("node:test");
const { installPwa } = require("../../client/pwa.js");

test("PWA hook rejects invalid locales without messaging the worker", () => {
  const messages = [];
  const browser = {
    navigator: {
      serviceWorker: {
        controller: { postMessage: (message) => messages.push(message) },
      },
    },
  };

  assert.throws(() => installPwa(browser, "../es"), /locale/i);
  assert.deepEqual(messages, []);
});

test("PWA hook does not expose an update for a current registration", async () => {
  class Manager {
    state = { updateAvailable: false, waiting: null };
    listeners = new Map();
    on(type, listener) {
      this.listeners.set(type, listener);
    }
    async init() {
      this.listeners.get("registered")();
    }
  }
  const browser = {
    navigator: { serviceWorker: { controller: null } },
  };

  const pwa = installPwa(browser, "en", Manager);
  await pwa.ready;

  assert.equal(pwa.updateAvailable, false);
});

test("PWA hook exposes updates and applies one only after explicit approval", async () => {
  const messages = [];
  class Manager {
    listeners = new Map();
    state = {
      updateAvailable: true,
      waiting: { postMessage: (message) => messages.push(message) },
    };
    constructor(options) {
      this.options = options;
    }
    on(type, listener) {
      this.listeners.set(type, listener);
    }
    async init() {
      this.listeners.get("registered")();
    }
    applyUpdate() {
      this.state.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  }
  const browser = {
    navigator: {
      serviceWorker: {
        controller: { postMessage: (message) => messages.push(message) },
      },
    },
  };

  const pwa = installPwa(browser, "es", Manager);
  await pwa.ready;

  assert.deepEqual(messages, [{ type: "SET_LOCALE", locale: "es" }]);
  assert.equal(pwa.updateAvailable, true);
  assert.equal(
    messages.some((message) => message.type === "SKIP_WAITING"),
    false,
  );
  pwa.applyUpdate();
  pwa.applyUpdate();
  assert.equal(
    messages.filter((message) => message.type === "SKIP_WAITING").length,
    1,
  );
  assert.equal(pwa.manager.options.strategy, "manual");
});

test("PWA hook can expose a later update after the current notice is dismissed", async () => {
  const firstWorker = {};
  class Manager {
    listeners = new Map();
    state = { updateAvailable: true, waiting: firstWorker };
    on(type, listener) {
      this.listeners.set(type, listener);
    }
    async init() {}
  }
  const browser = {
    navigator: { serviceWorker: { controller: null } },
  };
  const pwa = installPwa(browser, "en", Manager);
  await pwa.ready;

  assert.equal(pwa.updateAvailable, true);
  pwa.dismissUpdate();
  assert.equal(pwa.updateAvailable, false);
  pwa.manager.state.waiting = {};
  assert.equal(pwa.updateAvailable, true);
});

test("PWA hook syncs locale when the first controller appears without reloading", async () => {
  class Manager {
    listeners = new Map();
    state = {};
    on(type, listener) {
      this.listeners.set(type, listener);
    }
    async init() {
      this.listeners.get("registered")();
    }
  }
  const messages = [];
  let reloads = 0;
  const serviceWorker = { controller: null };
  const browser = {
    location: { reload: () => (reloads += 1) },
    navigator: { serviceWorker },
  };
  const pwa = installPwa(browser, "es", Manager);
  await pwa.ready;
  assert.deepEqual(messages, []);

  serviceWorker.controller = {
    postMessage: (message) => messages.push(message),
  };
  pwa.manager.listeners.get("updated")();

  assert.deepEqual(messages, [{ type: "SET_LOCALE", locale: "es" }]);
  assert.equal(reloads, 0);
});

test("PWA hook reloads once only when this page approved the update", async () => {
  class Manager {
    listeners = new Map();
    state = { updateAvailable: true, waiting: {} };
    on(type, listener) {
      this.listeners.set(type, listener);
    }
    async init() {}
    applyUpdate() {}
  }
  let reloads = 0;
  const browser = {
    location: { reload: () => (reloads += 1) },
    navigator: { serviceWorker: { controller: null } },
  };

  const pwa = installPwa(browser, "en", Manager);
  await pwa.ready;
  pwa.manager.listeners.get("updated")();
  assert.equal(reloads, 0);

  pwa.applyUpdate();
  pwa.manager.listeners.get("updated")();
  pwa.manager.listeners.get("updated")();

  assert.equal(reloads, 1);
});

test("PWA hook exposes a worker that was already waiting at startup", async () => {
  class Manager {
    state = { updateAvailable: true, waiting: {} };
    on() {}
    async init() {}
  }
  const browser = {
    navigator: { serviceWorker: { controller: null } },
  };

  const pwa = installPwa(browser, "en", Manager);
  await pwa.ready;

  assert.equal(pwa.updateAvailable, true);
});

test("PWA manager error event resolves to an explicit error state", async () => {
  const failure = new Error("controlled initialization failure");
  class Manager {
    state = {};
    listeners = new Map();
    on(type, listener) {
      this.listeners.set(type, listener);
    }
    async init() {
      this.listeners.get("error")(failure);
    }
  }
  const browser = {
    navigator: { serviceWorker: { controller: null } },
  };

  const result = await installPwa(browser, "en", Manager).ready;

  assert.equal(result.error, failure);
  assert.equal(result.manager instanceof Manager, true);
});
