const assert = require("node:assert/strict");
const { describe, test } = require("node:test");
const {
  loadBrowserLocale,
  loadBrowserRoute,
  readBrowserLocale,
  readInitialState,
  selectBrowserLocale,
  t,
  ui,
} = require("../../client/i18n/index.js");

function browserHarness(storedLocale = null) {
  const values = new Map();
  if (storedLocale !== null) {
    values.set("valyrian-locale", storedLocale);
  }
  return {
    document: { documentElement: { lang: "en" } },
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    values,
  };
}

describe("client locale", () => {
  test("rejects an invalid locale without changing client state", () => {
    const browser = browserHarness();
    const state = { locale: "en" };

    assert.throws(
      () => selectBrowserLocale("../es", browser, state),
      /locale/i,
    );
    assert.equal(browser.values.size, 0);
    assert.equal(browser.document.documentElement.lang, "en");
    assert.equal(state.locale, "en");
  });

  test("reads the validated English SSR locale from hydration state", () => {
    const document = {
      getElementById() {
        return { textContent: '{"locale":"en","path":"/__test/current"}' };
      },
    };

    assert.deepEqual(readInitialState(document), {
      locale: "en",
      path: "/__test/current",
    });
  });

  test("falls closed when hydration state contains an invalid locale", () => {
    const document = {
      getElementById() {
        return { textContent: '{"locale":"../../tmp","path":"/__test"}' };
      },
    };

    assert.throws(() => readInitialState(document), /locale/i);
  });

  test("falls back to English when client storage is missing or invalid", () => {
    assert.equal(readBrowserLocale(browserHarness()), "en");
    assert.equal(readBrowserLocale(browserHarness("../es")), "en");
  });

  test("falls back to English when browser storage cannot be read", () => {
    const browser = browserHarness();
    browser.localStorage.getItem = () => {
      throw new Error("storage blocked");
    };

    assert.equal(readBrowserLocale(browser), "en");
  });

  test("does not mutate client state when localized content is invalid", async () => {
    const browser = browserHarness();
    browser.fetch = async () =>
      new Response(JSON.stringify({ "/other": { title: "Other" } }));
    const state = {
      locale: "en",
      markdown: "# English",
      pathname: "/guides",
      title: "Guides",
      viewType: "hub",
    };

    await assert.rejects(
      () => loadBrowserLocale("es", browser, state),
      /localized content/i,
    );
    assert.deepEqual(state, {
      locale: "en",
      markdown: "# English",
      pathname: "/guides",
      title: "Guides",
      viewType: "hub",
    });
    assert.equal(browser.values.size, 0);
  });

  test("persists and applies a valid locale without navigation", () => {
    const browser = browserHarness();
    const state = { locale: "en" };

    selectBrowserLocale("es", browser, state);

    assert.equal(browser.values.get("valyrian-locale"), "es");
    assert.equal(browser.document.documentElement.lang, "es");
    assert.equal(state.locale, "es");
    assert.equal(t("routes.notFound"), "Página no encontrada");
    assert.equal(ui().updateAction, "Actualizar ahora");
  });

  test("applies a locale in memory when browser storage cannot be written", () => {
    const browser = browserHarness();
    browser.localStorage.setItem = () => {
      throw new Error("storage blocked");
    };
    const state = { locale: "en" };

    selectBrowserLocale("es", browser, state);

    assert.equal(browser.document.documentElement.lang, "es");
    assert.equal(state.locale, "es");
    assert.equal(t("routes.notFound"), "Página no encontrada");
  });

  test("loads and applies the complete localized page state", async () => {
    const browser = browserHarness();
    browser.fetch = async () =>
      new Response(
        JSON.stringify({
          "/guides": {
            markdown: "# Contenido localizado",
            title: "Título localizado",
            viewType: "hub",
          },
        }),
      );
    const state = {
      locale: "en",
      markdown: "# English content",
      pathname: "/guides",
      title: "English title",
      viewType: "hub",
    };

    await loadBrowserLocale("es", browser, state);

    assert.equal(state.locale, "es");
    assert.equal(state.markdown, "# Contenido localizado");
    assert.equal(state.title, "Título localizado");
    assert.equal(browser.document.documentElement.lang, "es");
  });

  test("replaces stale page fields during client-side route navigation", async () => {
    const browser = browserHarness();
    browser.document.title = "Old";
    browser.fetch = async () =>
      new Response(
        JSON.stringify({
          "/next": {
            markdown: "# Next",
            title: "Next",
            viewType: "document",
          },
        }),
      );
    const state = {
      content: { title: "Stale structured content" },
      locale: "en",
      path: "/old",
      pathname: "/old",
      routes: ["/old", "/next"],
      title: "Old",
      viewType: "referenceDocument",
    };

    await loadBrowserRoute("/next", browser, state);

    assert.equal(Object.hasOwn(state, "content"), false);
    assert.equal(state.markdown, "# Next");
    assert.equal(state.path, "/next");
    assert.equal(state.pathname, "/next");
    assert.deepEqual(state.routes, ["/old", "/next"]);
    assert.equal(browser.document.title, "Next · Valyrian.js");
  });
});
