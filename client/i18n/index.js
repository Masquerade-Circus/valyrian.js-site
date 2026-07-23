const {
  getLang,
  getTranslations,
  setLang,
  setStoreStrategy,
  setTranslations,
  t,
} = require("valyrian.js/translate");
const english = require("./ui.en.js");
const spanish = require("./ui.es.js");

const STORAGE_KEY = "valyrian-locale";
const catalogRequests = new WeakMap();
const supportedLocales = new Set(["en", "es"]);

setTranslations(english, { es: spanish });

function isSupportedLocale(locale) {
  return typeof locale === "string" && supportedLocales.has(locale);
}

function activateLocale(locale) {
  if (!isSupportedLocale(locale)) {
    throw new Error("Unsupported locale");
  }

  setLang(locale);
}

function ui() {
  return getTranslations()[getLang()].site;
}

function readInitialState(document) {
  const element = document.getElementById("initial-state");
  if (element === null || typeof element.textContent !== "string") {
    throw new Error("Hydration state is missing");
  }

  const state = JSON.parse(element.textContent);
  if (
    typeof state !== "object" ||
    state === null ||
    !isSupportedLocale(state.locale) ||
    typeof state.path !== "string" ||
    !state.path.startsWith("/")
  ) {
    throw new Error("Hydration state has an invalid locale or path");
  }

  return state;
}

function readBrowserLocale(browser = globalThis) {
  try {
    const locale = browser.localStorage.getItem(STORAGE_KEY);
    return isSupportedLocale(locale) ? locale : "en";
  } catch {
    return "en";
  }
}

function selectBrowserLocale(locale, browser = globalThis, state = null) {
  if (!isSupportedLocale(locale)) {
    throw new Error("Unsupported locale");
  }
  if (typeof state !== "object" || state === null) {
    throw new Error("Browser locale state is required");
  }

  setStoreStrategy({
    get: () => state.locale,
    set: (nextLocale) => {
      try {
        browser.localStorage.setItem(STORAGE_KEY, nextLocale);
      } catch {
        // Persistence is optional. The active page keeps the locale in state.
      }
    },
  });
  state.locale = locale;
  browser.document.documentElement.lang = locale;
  setLang(locale);
}

async function browserCatalog(locale, browser) {
  let catalogs = catalogRequests.get(browser);
  if (catalogs === undefined) {
    catalogs = new Map();
    catalogRequests.set(browser, catalogs);
  }
  if (!catalogs.has(locale)) {
    catalogs.set(
      locale,
      browser
        .fetch(`/generated/pages.${locale}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Localized content request failed");
          }
          return response.json();
        })
        .catch((error) => {
          catalogs.delete(locale);
          throw error;
        }),
    );
  }
  return catalogs.get(locale);
}

function replacePageState(state, page) {
  if (
    typeof page !== "object" ||
    page === null ||
    typeof page.title !== "string" ||
    typeof page.viewType !== "string"
  ) {
    throw new Error("Localized content is invalid");
  }
  for (const key of Object.keys(state)) {
    if (!["locale", "path", "pathname", "routes"].includes(key)) {
      Reflect.deleteProperty(state, key);
    }
  }
  Object.assign(state, page);
}

function updateBrowserTitle(browser, state) {
  browser.document.title =
    state.pathname === "/" ? "Valyrian.js" : `${state.title} · Valyrian.js`;
}

async function loadBrowserLocale(locale, browser, state) {
  if (!isSupportedLocale(locale)) {
    throw new Error("Unsupported locale");
  }
  if (typeof state !== "object" || state === null) {
    throw new Error("Browser locale state is required");
  }

  if (locale === state.locale) {
    selectBrowserLocale(locale, browser, state);
    return;
  }

  if (state.notFound === true || state.serverError === true) {
    selectBrowserLocale(locale, browser, state);
    state.title =
      state.notFound === true ? t("routes.notFound") : t("serverError");
    return;
  }

  const pages = await browserCatalog(locale, browser);
  const page = pages?.[state.pathname];
  replacePageState(state, page);
  selectBrowserLocale(locale, browser, state);
  updateBrowserTitle(browser, state);
}

async function loadBrowserRoute(path, browser, state) {
  if (typeof path !== "string" || !path.startsWith("/")) {
    throw new Error("Browser route path is invalid");
  }
  const pathname = new URL(path, "https://valyrian.invalid").pathname;
  if (!Array.isArray(state.routes) || !state.routes.includes(pathname)) {
    throw new Error("Browser route is unavailable");
  }
  const pages = await browserCatalog(state.locale, browser);
  replacePageState(state, pages?.[pathname]);
  state.path = path;
  state.pathname = pathname;
  updateBrowserTitle(browser, state);
}

module.exports = {
  activateLocale,
  loadBrowserLocale,
  loadBrowserRoute,
  readBrowserLocale,
  readInitialState,
  selectBrowserLocale,
  t,
  ui,
};
