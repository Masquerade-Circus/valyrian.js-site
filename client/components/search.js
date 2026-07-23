const { update, v } = require("valyrian.js");
const { t } = require("../i18n/index.js");

const searchStateByBrowser = new WeakMap();

function searchRecords(records, query) {
  if (!Array.isArray(records)) {
    return { state: "error", results: [] };
  }
  if (typeof query !== "string" || query.trim().length === 0) {
    return { state: "idle", results: [] };
  }

  const normalized = query.trim().toLocaleLowerCase();
  const terms = normalized.split(/\s+/);
  const score = (record) => {
    const title = record.title.toLocaleLowerCase();
    const headings = record.headings.join(" ").toLocaleLowerCase();
    if (terms.every((term) => title.includes(term))) {
      return 0;
    }
    return terms.every((term) => headings.includes(term)) ? 1 : 2;
  };
  const results = records
    .filter((record) => {
      if (
        typeof record !== "object" ||
        record === null ||
        typeof record.pathname !== "string" ||
        typeof record.title !== "string" ||
        !Array.isArray(record.headings) ||
        typeof record.text !== "string"
      ) {
        return false;
      }
      const haystack =
        `${record.title} ${record.headings.join(" ")} ${record.text}`.toLocaleLowerCase();
      return terms.every((term) => haystack.includes(term));
    })
    .sort((first, second) => score(first) - score(second))
    .map((record) => {
      const matchHeading =
        record.headings.find((heading) =>
          heading.toLocaleLowerCase().includes(normalized),
        ) ||
        record.headings[0] ||
        record.title;
      const matchAt = record.text.toLocaleLowerCase().indexOf(normalized);
      const roughStart = Math.max(0, matchAt < 0 ? 0 : matchAt - 45);
      const nextSpace = record.text.indexOf(" ", roughStart);
      const start = roughStart === 0 || nextSpace < 0 ? 0 : nextSpace + 1;
      const excerpt = `${start > 0 ? "…" : ""}${record.text
        .slice(start, start + 150)
        .trim()}${start + 150 < record.text.length ? "…" : ""}`;
      return { ...record, excerpt, matchHeading };
    });

  return { state: results.length > 0 ? "results" : "empty", results };
}

function searchResultMessage(count, messages) {
  return count === 1
    ? messages.searchResultSingular
    : t("site.searchResultPlural", { count: String(count) });
}

function getSearchState(browser, locale) {
  if (browser === null || typeof browser !== "object") {
    return {
      busy: false,
      locale,
      query: "",
      results: [],
      showResults: false,
      status: "idle",
    };
  }
  const current = searchStateByBrowser.get(browser);
  if (current?.locale === locale) {
    return current;
  }
  current?.browser.clearTimeout(current.timer);
  const state = {
    browser,
    busy: false,
    locale,
    query: "",
    records: null,
    request: 0,
    results: [],
    showResults: false,
    status: "idle",
    timer: null,
  };
  searchStateByBrowser.set(browser, state);
  return state;
}

function groupedResults(results) {
  const groups = new Map();
  for (const record of results) {
    const group = record.module || record.group;
    if (typeof group !== "string" || group.length === 0) {
      continue;
    }
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group).push(record);
  }
  return groups;
}

function Search({ browser = null, labels, locale = "en", pathname = "" }) {
  const state = getSearchState(browser, locale);
  const status =
    state.status === "idle"
      ? labels.searchIdle
      : state.status === "loading"
        ? labels.searchLoading
        : state.status === "empty"
          ? labels.searchEmpty
          : state.status === "error"
            ? labels.searchError
            : searchResultMessage(state.results.length, labels);
  const runSearch = async (force = false) => {
    const query = state.query.trim();
    if (!force && query.length < 2) {
      state.results = [];
      state.showResults = false;
      state.status = "idle";
      update();
      return;
    }
    const request = ++state.request;
    state.busy = true;
    state.results = [];
    state.showResults = true;
    state.status = "loading";
    update();
    try {
      if (state.records === null) {
        const response = await browser.fetch(
          `/generated/search.${state.locale}.json`,
        );
        if (!response.ok) {
          throw new Error("Search index request failed");
        }
        state.records = await response.json();
        if (pathname === "/reference") {
          state.records = state.records.filter((record) =>
            record.pathname.startsWith("/reference/"),
          );
        }
      }
      if (request !== state.request) {
        return;
      }
      const result = searchRecords(state.records, query);
      state.results = result.results;
      state.status = result.state;
    } catch {
      if (request !== state.request) {
        return;
      }
      state.records = null;
      state.results = [];
      state.showResults = false;
      state.status = "error";
    } finally {
      if (request === state.request) {
        state.busy = false;
        update();
      }
    }
  };

  return v(
    "form",
    {
      "aria-label": labels.search,
      "aria-busy": state.busy ? "true" : "false",
      class: "reference-search",
      "data-search": "true",
      novalidate: true,
      onsubmit: (event) => {
        event.preventDefault();
        browser.clearTimeout(state.timer);
        return runSearch(true);
      },
      role: "search",
    },
    v("label", { for: "site-search" }, labels.search),
    v("input", {
      autocomplete: "off",
      id: "site-search",
      name: "query",
      oninput: (event) => {
        browser.clearTimeout(state.timer);
        state.query = event.target.value;
        if (state.query.trim().length < 2) {
          state.request += 1;
          state.results = [];
          state.showResults = false;
          state.status = "idle";
          return;
        }
        state.timer = browser.setTimeout(() => runSearch(), 250);
      },
      placeholder: labels.searchPlaceholder,
      type: "search",
      value: state.query,
    }),
    v(
      "button",
      { class: "bg-primary", "data-button": true, type: "submit" },
      labels.searchAction,
    ),
    v(
      "button",
      {
        "data-search-clear": "true",
        hidden: state.query.length === 0,
        onclick: (event) => {
          browser.clearTimeout(state.timer);
          state.request += 1;
          state.query = "";
          state.results = [];
          state.showResults = false;
          state.status = "idle";
          event.target
            .closest("form")
            ?.querySelector('input[type="search"]')
            ?.focus();
        },
        type: "button",
      },
      labels.searchClear,
    ),
    v(
      "p",
      {
        "aria-live": "polite",
        "data-search-status": "true",
        role: "status",
      },
      status,
    ),
    v(
      "div",
      {
        "data-search-results": "true",
        class: "search-results",
        hidden: !state.showResults,
      },
      ...[...groupedResults(state.results)].map(([moduleName, records]) =>
        v(
          "section",
          {},
          v("h2", {}, moduleName),
          v(
            "ul",
            {},
            ...records.map((record) =>
              v(
                "li",
                {},
                v(
                  "a",
                  {
                    "data-link": "standalone",
                    "v-route": record.pathname,
                  },
                  v("strong", {}, record.symbol || record.title),
                  v("span", {}, record.summary || record.excerpt),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

module.exports = {
  getSearchState,
  Search,
  searchRecords,
  searchResultMessage,
};
