const { mountRouter } = require("valyrian.js/router");
const { createRouter } = require("./app/router.js");
const {
  loadBrowserLocale,
  loadBrowserRoute,
  readBrowserLocale,
  readInitialState,
  selectBrowserLocale,
} = require("./i18n/index.js");
const { installPwa } = require("./pwa.js");

async function hydrate(document) {
  const browser = document.defaultView;
  const initialState = readInitialState(document);
  const locale = readBrowserLocale(browser);
  try {
    await loadBrowserLocale(locale, browser, initialState);
  } catch {
    selectBrowserLocale("en", browser, initialState);
  }

  const runtime = {
    browser,
    historyNavigation: false,
    localePending: false,
    afterRouteCallback: null,
    pwa: null,
    router: null,
  };
  runtime.router = createRouter({
    initialState,
    loadRoute: async (path) => {
      if (
        new URL(path, document.location.origin).pathname ===
        initialState.pathname
      ) {
        return;
      }
      await loadBrowserRoute(path, browser, initialState);
    },
    response: { statusCode: 200 },
    runtime,
  });
  runtime.pwa = installPwa(browser, initialState.locale);
  mountRouter("body", runtime.router);
}

if (typeof window === "object" && typeof document === "object") {
  hydrate(document);
}

module.exports = { hydrate };
