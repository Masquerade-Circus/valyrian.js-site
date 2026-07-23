const { fragment, onCreate, v } = require("valyrian.js");
const { afterRoute } = require("valyrian.js/router");
const {
  closeExpansionOnEscape,
  CopyButton,
  TocLifecycle,
  UpdateNotice,
} = require("../components/interactions.js");
const { getSearchState, Search } = require("../components/search.js");
const { loadBrowserLocale, t, ui } = require("../i18n/index.js");
const { headingSlug, markdownView, tableOfContents } = require("./markdown.js");
const {
  version: valyrianVersion,
} = require("../../node_modules/valyrian.js/package.json");

function routeAttributes(href, attributes = {}) {
  return { ...attributes, "v-route": href };
}

function navigationAttributes(state, href) {
  const attributes = routeAttributes(href, { "data-link": "standalone" });
  if (
    state.pathname === href ||
    (href !== "/" && state.pathname.startsWith(`${href}/`))
  ) {
    attributes["aria-current"] = "page";
  }
  return attributes;
}

async function selectLocale(event, state, runtime) {
  const button = event.target.closest("[data-locale]");
  const locale = button?.dataset.locale;
  if (
    typeof runtime !== "object" ||
    runtime === null ||
    runtime.browser === null ||
    runtime.router === null ||
    (locale !== "en" && locale !== "es") ||
    runtime.localePending === true
  ) {
    return;
  }
  runtime.localePending = true;
  button.disabled = true;
  try {
    await loadBrowserLocale(locale, runtime.browser, state);
    await runtime.router.go(state.path);
    runtime.pwa?.setLocale(locale);
  } finally {
    runtime.localePending = false;
    button.disabled = state.locale === locale;
  }
}

function Header(state, text, runtime) {
  const links = [
    ["/learn", text.start],
    ["/guides", text.guides],
    ["/recipes", text.recipes],
    ["/reference", text.reference],
  ];
  return v(
    "header",
    {},
    v(
      "nav",
      {
        "aria-label": text.main,
        class: "desktop-navigation",
        "data-toolbar": "true",
      },
      v(
        "a",
        routeAttributes("/"),
        v(
          "picture",
          {},
          v("source", {
            height: "44",
            media: "(max-width: 599px)",
            srcset: "/icon.svg",
            width: "44",
          }),
          v("img", {
            alt: "Valyrian.js",
            height: "44",
            src: "/logo.svg",
            width: "126",
          }),
        ),
      ),
      ...links.map(([href, title]) =>
        v("a", navigationAttributes(state, href), title),
      ),
    ),
    v(
      "nav",
      {
        "aria-label": text.language,
        class: "locale-selector",
        role: "group",
      },
      ...["en", "es"].map((locale) =>
        v(
          "button",
          {
            ...(state.locale === locale ? { disabled: true } : {}),
            "aria-pressed": state.locale === locale ? "true" : "false",
            class: "text-xs min-h-8",
            "data-locale": locale,
            lang: locale,
            onclick: (event) => selectLocale(event, state, runtime),
            type: "button",
          },
          locale.toUpperCase(),
        ),
      ),
    ),
  );
}

function Main(attributes, ...children) {
  const mainAttributes = { ...attributes };
  const classNames =
    typeof mainAttributes.class === "string"
      ? mainAttributes.class.split(/\s+/).filter(Boolean)
      : [];
  const sectionAttributes = classNames.includes("container")
    ? { class: "container" }
    : {};
  const mainClassNames = classNames.filter(
    (className) => className !== "container",
  );
  if (mainClassNames.length > 0) {
    mainAttributes.class = mainClassNames.join(" ");
  } else {
    Reflect.deleteProperty(mainAttributes, "class");
  }
  return v(
    "main",
    mainAttributes,
    v("section", sectionAttributes, ...children),
  );
}

function Home(text, example, exampleLanguage) {
  const learningPaths = [
    [
      text.learningRuntimeTitle,
      text.learningRuntimeBody,
      "/learn/first-application",
    ],
    [
      text.learningRoutingTitle,
      text.learningRoutingBody,
      "/learn/routing-data",
    ],
    [text.learningStateTitle, text.learningStateBody, "/learn/state-forms"],
    [
      text.learningOfflineTitle,
      text.learningOfflineBody,
      "/learn/network-offline-pwa",
    ],
    [
      text.learningServerTitle,
      text.learningServerBody,
      "/learn/server-rendering-execution",
    ],
  ];
  const capabilities = [
    [
      text.capabilityViewsTitle,
      text.capabilityViewsBody,
      "/guides/first-application",
    ],
    [
      text.capabilityRoutingTitle,
      text.capabilityRoutingBody,
      "/guides/application-routing",
    ],
    [text.capabilityDataTitle, text.capabilityDataBody, "/guides/requests"],
    [
      text.capabilityStateTitle,
      text.capabilityStateBody,
      "/guides/reactive-values",
    ],
    [
      text.capabilityOfflineTitle,
      text.capabilityOfflineBody,
      "/guides/network-status",
    ],
    [
      text.capabilityServerTitle,
      text.capabilityServerBody,
      "/guides/server-side-rendering",
    ],
  ];
  return Main(
    { class: "home", id: "main-content", tabindex: "-1" },
    v(
      "section",
      { class: "hero home-band" },
      v(
        "div",
        {
          class:
            "home-inner hero-inner container grid-center text-center min-h-half-screen",
        },
        v(
          "div",
          { class: "text-center" },
          v("img", {
            alt: "Valyrian.js",
            class: "w-1/2 inline",
            src: "/logo.svg",
          }),
        ),
        v("h1", { class: "text-5xl leading-none pt-4 pb-4" }, text.heroHeading),
        v("p", { class: "text-3xl leading-none pb-4" }, text.heroPromise),
        v("p", { class: "pb-6 text-lg leading-tight" }, text.heroDetail),
        v(
          "div",
          { class: "hero-actions" },
          v(
            "a",
            routeAttributes("/learn", {
              class: "bg-primary",
              "data-button": true,
            }),
            text.startNow,
          ),
          v(
            "a",
            routeAttributes("/reference", {
              class: "secondary-link",
              "data-link": "standalone",
            }),
            text.referenceAction,
          ),
        ),
      ),
    ),
    v(
      "section",
      { class: "first-example home-band" },
      v(
        "div",
        { class: "home-inner first-example-inner container" },
        v(
          "div",
          { class: "first-example-copy" },
          v("h2", {}, text.firstExampleHeading),
          v("p", {}, text.firstExampleBody),
        ),
        v(
          "div",
          { class: "code-block w-full" },
          v(
            "div",
            { class: "grid" },
            v(
              "div",
              { class: "w-1/2" },
              v("code", { class: "border-0" }, exampleLanguage || text.code),
            ),
            v(
              "div",
              { class: "w-1/2 text-right" },
              CopyButton({ labels: text }),
            ),
          ),
          v("pre", { class: "w-full" }, v("code", {}, example)),
          v("span", {
            "aria-live": "polite",
            class: "copy-status",
            "data-copy-status": "true",
            role: "status",
          }),
        ),
        v(
          "a",
          routeAttributes("/learn/first-application", {
            class: "secondary-link",
            "data-link": "standalone",
          }),
          text.firstExampleAction,
        ),
      ),
    ),
    v(
      "section",
      { class: "adoption home-band" },
      v(
        "div",
        { class: "home-inner container" },
        v("h2", {}, text.adoption),
        v(
          "ul",
          { class: "home-learning-paths text-lg", "data-list": "true" },
          ...learningPaths.map(([title, body, href]) =>
            v(
              "li",
              {},
              v(
                "a",
                routeAttributes(href),
                v("span", {}, v("strong", {}, title), v("small", {}, body)),
              ),
            ),
          ),
        ),
      ),
    ),
    v(
      "section",
      { class: "capabilities home-band" },
      v(
        "div",
        { class: "home-inner container" },
        v("h2", {}, text.capabilities),
        v(
          "ul",
          { class: "capability-list" },
          ...capabilities.map(([title, body, href]) =>
            v(
              "li",
              {},
              v(
                "h3",
                {},
                v(
                  "a",
                  routeAttributes(href, { "data-link": "standalone" }),
                  title,
                ),
              ),
              v("p", {}, body),
            ),
          ),
        ),
      ),
    ),
  );
}

function Hub(state, text, runtime) {
  const categorized =
    state.viewType === "guidesHub" || state.viewType === "recipesHub";
  const hubItem = (item) =>
    v(
      "li",
      {},
      v(
        "h3",
        {},
        v(
          "a",
          routeAttributes(item.pathname, { "data-link": "standalone" }),
          item.title,
        ),
      ),
      typeof item.summary === "string" ? v("p", {}, item.summary) : null,
      Array.isArray(item.apis) && item.apis.length > 0
        ? v(
            "p",
            { class: "item-apis" },
            ...item.apis.map((api) => v("code", {}, api)),
          )
        : null,
    );

  return Main(
    {
      class:
        state.viewType === "referenceHub"
          ? "hub reference-hub container"
          : "hub container",
      id: "main-content",
      tabindex: "-1",
    },
    v(
      "div",
      { class: "hub-inner" },
      markdownView(state.markdown, {
        labels: text,
        h1Id: "hub-title",
        tableLabel: text.table,
      }),
      state.viewType === "referenceHub"
        ? v(Search, {
            browser: runtime?.browser || null,
            labels: text,
            locale: state.locale,
            pathname: state.pathname,
          })
        : null,
      state.viewType === "referenceHub" && state.hubGroups?.length > 0
        ? v(
            "div",
            {
              "data-reference-index": "true",
              hidden:
                runtime?.browser !== null &&
                getSearchState(runtime?.browser, state.locale).showResults,
            },
            v(
              "nav",
              { "aria-label": text.reference, class: "reference-index" },
              v(
                "ul",
                {},
                ...state.hubGroups.map((group) =>
                  v(
                    "li",
                    {},
                    v(
                      "a",
                      { "data-link": "standalone", href: `#${group.id}` },
                      group.title,
                    ),
                    typeof group.introduction === "string"
                      ? v("p", {}, group.introduction)
                      : null,
                  ),
                ),
              ),
            ),
            v(
              "div",
              { class: "reference-groups" },
              ...state.hubGroups.map((group) =>
                v(
                  "section",
                  { id: group.id },
                  v("h2", {}, group.title),
                  v(
                    "dl",
                    { class: "reference-definitions" },
                    ...group.items.flatMap((item) => [
                      v(
                        "dt",
                        {},
                        v(
                          "a",
                          routeAttributes(item.pathname, {
                            "data-link": "standalone",
                          }),
                          v("code", {}, item.symbol || item.title),
                        ),
                      ),
                      v(
                        "dd",
                        {},
                        typeof item.summary === "string" ? item.summary : "",
                      ),
                    ]),
                  ),
                ),
              ),
            ),
          )
        : null,
      categorized && state.hubGroups.length > 0
        ? v(
            "nav",
            {
              "aria-label":
                state.viewType === "guidesHub"
                  ? text.guideCategories
                  : text.recipeCategories,
              class: "hub-category-nav",
              "data-toolbar": "true",
            },
            ...state.hubGroups.map((group) =>
              v(
                "a",
                { "data-link": "standalone", href: `#${group.id}` },
                group.title,
              ),
            ),
          )
        : null,
      state.viewType === "learn"
        ? v(
            "ol",
            { class: "learning-stepper", "data-stepper": "vertical" },
            ...state.hubItems.map((item) =>
              v(
                "li",
                {},
                v(
                  "a",
                  routeAttributes(item.pathname, {
                    class: "learning-step-link",
                    "data-link": "standalone",
                  }),
                  v("strong", {}, item.title),
                  typeof item.summary === "string"
                    ? v("small", {}, item.summary)
                    : null,
                ),
              ),
            ),
          )
        : categorized
          ? v(
              "div",
              { class: "hub-groups" },
              ...state.hubGroups.map((group) =>
                v(
                  "section",
                  { id: group.id },
                  v("h2", {}, group.title),
                  typeof group.introduction === "string"
                    ? v(
                        "p",
                        { class: "hub-group-introduction" },
                        group.introduction,
                      )
                    : null,
                  v(
                    "ul",
                    { class: "editorial-list guide-list" },
                    ...group.items.map((item) => hubItem(item)),
                  ),
                ),
              ),
            )
          : null,
    ),
  );
}

function hasVisibleText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasStructuredSectionContent(section) {
  return (
    hasVisibleText(section.body) ||
    hasVisibleText(section.code) ||
    (Array.isArray(section.items) && section.items.length > 0) ||
    (Array.isArray(section.definitions) && section.definitions.length > 0)
  );
}

function structuredToc(sections) {
  const used = new Map();
  return sections.flatMap((section, sectionIndex) => {
    if (
      !hasVisibleText(section.heading) ||
      !hasStructuredSectionContent(section)
    ) {
      return [];
    }
    const base = headingSlug(section.heading);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return [
      {
        id: count === 0 ? base : `${base}-${count + 1}`,
        sectionIndex,
        title: section.heading,
      },
    ];
  });
}

function CodeBlock(code, language, text) {
  return v(
    "div",
    { class: "code-block w-full" },
    v(
      "div",
      { class: "grid" },
      v(
        "div",
        { class: "w-1/2" },
        v(
          "code",
          { class: "border-0" },
          typeof language === "string" ? language : "",
        ),
      ),
      v("div", { class: "w-1/2 text-right" }, CopyButton({ labels: text })),
    ),
    v("pre", { class: "w-full" }, v("code", {}, code)),
    v("span", {
      "aria-live": "polite",
      class: "copy-status",
      "data-copy-status": "true",
      role: "status",
    }),
  );
}

function SectionNavigation(state, text, mobile = false) {
  const isLearningPath = state.viewType === "learningPathDocument";
  const categorized = [
    "guideDocument",
    "recipeDocument",
    "referenceDocument",
  ].includes(state.viewType);
  const root =
    state.viewType === "guideDocument"
      ? ["/guides", text.allGuides]
      : state.viewType === "recipeDocument"
        ? ["/recipes", text.allRecipes]
        : ["/reference", text.reference];
  const contents = () => {
    if (isLearningPath) {
      return [
        v("strong", { class: "document-group-title" }, text.learningPaths),
        v(
          "div",
          { class: "document-group-links" },
          ...state.sectionItems.map((item) =>
            v(
              "a",
              item.pathname === state.pathname
                ? routeAttributes(item.pathname, {
                    "aria-current": "page",
                    "data-link": "quiet",
                  })
                : routeAttributes(item.pathname, { "data-link": "quiet" }),
              item.title,
            ),
          ),
        ),
      ];
    }
    if (categorized) {
      return [
        v(
          "a",
          routeAttributes(root[0], {
            class: "document-all-link",
            "data-link": "quiet",
          }),
          root[1],
        ),
        ...(state.navigationGroups || []).map((group) =>
          v(
            "details",
            {
              ...(group.id === state.groupId ? { open: true } : {}),
              class: "document-navigation-group",
              "data-expansion-panel": "true",
              onkeydown: closeExpansionOnEscape,
            },
            v(
              "summary",
              {
                ...(group.id === state.groupId
                  ? { "aria-current": "location" }
                  : {}),
                class: "document-category-summary",
              },
              group.title,
            ),
            v(
              "div",
              { class: "document-group-links" },
              ...group.items.map((item) =>
                v(
                  "a",
                  item.pathname === state.pathname
                    ? routeAttributes(item.pathname, {
                        "aria-current": "page",
                        "data-link": "standalone",
                      })
                    : routeAttributes(item.pathname, {
                        "data-link": "standalone",
                      }),
                  item.title,
                ),
              ),
            ),
          ),
        ),
      ];
    }
    return [
      typeof state.groupTitle === "string"
        ? v("strong", { class: "document-group-title" }, state.groupTitle)
        : null,
      v(
        "div",
        { class: "document-group-links" },
        ...state.sectionItems.map((item) =>
          v(
            "a",
            item.pathname === state.pathname
              ? routeAttributes(item.pathname, {
                  "aria-current": "page",
                  "data-link": "quiet",
                })
              : routeAttributes(item.pathname, { "data-link": "quiet" }),
            item.title,
          ),
        ),
      ),
    ];
  };
  const menuLabel = isLearningPath
    ? text.learningPathsMenu
    : state.viewType === "guideDocument"
      ? text.guidesMenu
      : state.viewType === "recipeDocument"
        ? text.recipesMenu
        : text.documentMenu;
  if (mobile) {
    return v(
      "details",
      {
        class: "document-menu",
        "data-expansion-panel": "true",
        onkeydown: closeExpansionOnEscape,
      },
      v("summary", {}, menuLabel),
      v("nav", { "aria-label": menuLabel }, ...contents()),
    );
  }
  return v(
    "nav",
    {
      "aria-label": text.documentNavigation,
      class: "document-sidebar xl:w-3/12",
    },
    ...contents(),
  );
}

function Toc(state, text, items, mobile = false) {
  const links = () =>
    items.map((item, index) =>
      v(
        "a",
        {
          ...(index === 0 ? { "aria-current": "location" } : {}),
          "data-link": "quiet",
          "data-toc-link": "true",
          href: `#${item.id}`,
        },
        item.title,
      ),
    );
  if (mobile) {
    return v(
      "details",
      {
        class: "toc-mobile",
        "data-expansion-panel": "true",
        onkeydown: closeExpansionOnEscape,
      },
      v("summary", {}, text.tocMobile),
      v("nav", { "aria-label": text.tocMobile }, ...links()),
    );
  }
  return v(
    "nav",
    { "aria-label": text.toc, class: "document-toc xl:w-2/12" },
    v("strong", {}, text.toc),
    ...links(),
  );
}

function PreviousNext(state, text) {
  return v(
    "nav",
    {
      "aria-label": t("site.nearbyPages"),
      class: "previous-next",
    },
    state.previous
      ? v(
          "a",
          routeAttributes(state.previous.pathname, {
            "data-link": "standalone",
          }),
          v("small", {}, text.previous),
          state.previous.title,
        )
      : null,
    state.next
      ? v(
          "a",
          routeAttributes(state.next.pathname, { "data-link": "standalone" }),
          v("small", {}, text.next),
          state.next.title,
        )
      : null,
  );
}

function StructuredSection(section, tocItem, renderItem, text) {
  if (!hasStructuredSectionContent(section)) {
    return null;
  }
  const notice = /^(?:errors?|limits?|límite|límites)$/i.test(
    section.heading || "",
  );
  return v(
    "section",
    notice
      ? {
          class: "editorial-notice",
          "data-notification": "inline warning no-shadow",
        }
      : {},
    hasVisibleText(section.heading)
      ? v("h2", { id: tocItem.id }, section.heading)
      : null,
    hasVisibleText(section.body) ? v("p", {}, section.body) : null,
    hasVisibleText(section.code)
      ? CodeBlock(section.code, section.language, text)
      : null,
    Array.isArray(section.items) && section.items.length > 0
      ? v(
          section.ordered === true ? "ol" : "ul",
          {},
          ...section.items.map(renderItem),
        )
      : null,
    Array.isArray(section.definitions) && section.definitions.length > 0
      ? v(
          "dl",
          {},
          ...section.definitions.flatMap((definition) => [
            v("dt", {}, definition.term),
            v("dd", {}, definition.description),
          ]),
        )
      : null,
  );
}

function Breadcrumb(state, text) {
  const root = {
    guideDocument: ["/guides", text.guides],
    learningPathDocument: ["/learn", text.start],
    recipeDocument: ["/recipes", text.recipes],
    referenceDocument: ["/reference", text.reference],
  }[state.viewType];
  if (!Array.isArray(root)) {
    return null;
  }
  const categorized = [
    "guideDocument",
    "recipeDocument",
    "referenceDocument",
  ].includes(state.viewType);
  return v(
    "nav",
    {
      "aria-label": text.breadcrumb,
      class: "breadcrumb",
      "data-breadcrumb": "true",
    },
    v("a", routeAttributes(root[0], { "data-link": "true" }), root[1]),
    categorized && typeof state.groupTitle === "string"
      ? v(
          "a",
          routeAttributes(`${root[0]}#${state.groupId}`, {
            "data-link": "true",
          }),
          state.groupTitle,
        )
      : null,
    v("span", { "aria-current": "page" }, state.title),
  );
}

function StructuredDocument(state, text) {
  const renderItem = (item) => {
    if (typeof item === "string") {
      return v("li", {}, item);
    }
    if (
      typeof item === "object" &&
      item !== null &&
      typeof item.label === "string" &&
      typeof item.href === "string"
    ) {
      return v(
        "li",
        {},
        v(
          "a",
          item.href.startsWith("/")
            ? routeAttributes(item.href, { "data-link": "true" })
            : { "data-link": "true", href: item.href },
          item.label,
        ),
      );
    }
    return null;
  };
  const toc = structuredToc(state.content.sections);
  const exampleIndex =
    state.viewType === "guideDocument"
      ? 1
      : state.viewType === "recipeDocument"
        ? 4
        : -1;
  const sectionNodes = [];
  for (let index = 0; index < state.content.sections.length; index += 1) {
    if (state.exampleCode && index === exampleIndex) {
      sectionNodes.push(
        CodeBlock(state.exampleCode, state.exampleLanguage, text),
      );
    }
    const section = state.content.sections[index];
    const tocItem = toc.find((item) => item.sectionIndex === index);
    const sectionNode = StructuredSection(section, tocItem, renderItem, text);
    if (sectionNode !== null) {
      sectionNodes.push(sectionNode);
    }
  }
  if (state.exampleCode && exampleIndex >= state.content.sections.length) {
    sectionNodes.push(
      CodeBlock(state.exampleCode, state.exampleLanguage, text),
    );
  }
  return Main(
    {
      class: "documentation container",
      id: "main-content",
      tabindex: "-1",
    },
    v(
      "div",
      { class: "grid-gutters w-full" },
      SectionNavigation(state, text, true),
      SectionNavigation(state, text),
      v(
        "article",
        {
          class: "document structured-document w-full mx-auto xl:w-7/12",
        },
        Breadcrumb(state, text),
        state.viewType === "referenceDocument"
          ? v(
              "h1",
              { class: "reference-symbol" },
              v("code", {}, state.content.title),
            )
          : v("h1", {}, state.content.title),
        hasVisibleText(state.content.summary)
          ? v("p", { class: "lede" }, state.content.summary)
          : null,
        hasVisibleText(state.content.introduction)
          ? v("p", {}, state.content.introduction)
          : null,
        toc.length > 0 ? Toc(state, text, toc, true) : null,
        ...sectionNodes,
        PreviousNext(state, text),
      ),
      toc.length > 0 ? Toc(state, text, toc) : null,
    ),
  );
}

function Documentation(state, text) {
  const toc = tableOfContents(state.markdown);
  const tocLink = (item, index, className) => {
    const attributes = {
      "data-link": "quiet",
      "data-toc-link": "true",
      href: `#${item.id}`,
    };
    if (index === 0) {
      attributes["aria-current"] = "location";
    }
    if (typeof className === "string") {
      attributes.class = className;
    }
    return v("a", attributes, item.title);
  };
  return Main(
    {
      class: "documentation container",
      id: "main-content",
      tabindex: "-1",
    },
    v(
      "div",
      { class: "grid-gutters w-full" },
      v(
        "details",
        {
          class: "document-menu",
          "data-expansion-panel": "true",
          onkeydown: closeExpansionOnEscape,
        },
        v("summary", {}, text.docs),
        v(
          "nav",
          { "aria-label": text.docs },
          ...state.sectionItems.map((item) =>
            v(
              "a",
              item.pathname === state.pathname
                ? routeAttributes(item.pathname, {
                    "aria-current": "page",
                    "data-link": "quiet",
                  })
                : routeAttributes(item.pathname, { "data-link": "quiet" }),
              item.title,
            ),
          ),
        ),
      ),
      v(
        "nav",
        {
          "aria-label": text.docs,
          class: "document-sidebar xl:w-3/12",
        },
        ...state.sectionItems.map((item) =>
          v(
            "a",
            item.pathname === state.pathname
              ? routeAttributes(item.pathname, {
                  "aria-current": "page",
                  "data-link": "quiet",
                })
              : routeAttributes(item.pathname, { "data-link": "quiet" }),
            item.title,
          ),
        ),
      ),
      v(
        "article",
        { class: "document w-full mx-auto xl:w-7/12" },
        toc.length > 0
          ? v(
              "details",
              {
                class: "toc-mobile",
                "data-expansion-panel": "true",
                onkeydown: closeExpansionOnEscape,
              },
              v("summary", {}, text.tocMobile),
              v("nav", { "aria-label": text.tocMobile }, ...toc.map(tocLink)),
            )
          : null,
        markdownView(state.markdown, {
          labels: text,
          tableLabel: text.table,
        }),
        v(
          "nav",
          {
            "aria-label": t("site.nearbyPages"),
            class: "previous-next",
          },
          state.previous
            ? v(
                "a",
                routeAttributes(state.previous.pathname, {
                  "data-link": "standalone",
                }),
                v("small", {}, text.previous),
                state.previous.title,
              )
            : null,
          state.next
            ? v(
                "a",
                routeAttributes(state.next.pathname, {
                  "data-link": "standalone",
                }),
                v("small", {}, text.next),
                state.next.title,
              )
            : null,
        ),
      ),
      toc.length > 0
        ? v(
            "nav",
            {
              "aria-label": text.toc,
              class: "document-toc xl:w-2/12",
            },
            v("strong", {}, text.toc),
            ...toc.map((item, index) =>
              tocLink(item, index, `toc-depth-${item.depth}`),
            ),
          )
        : null,
    ),
  );
}

function NotFound(state, text) {
  return Main(
    {
      class: "empty-state container",
      id: "main-content",
      tabindex: "-1",
    },
    v("h1", {}, state.title),
    v("p", {}, text.notFoundBody),
    v(
      "a",
      routeAttributes("/guides", {
        class: "bg-primary",
        "data-button": true,
      }),
      text.notFoundAction,
    ),
  );
}

function ServerError(state, text) {
  return Main(
    {
      class: "empty-state container",
      id: "main-content",
      tabindex: "-1",
    },
    v("h1", {}, state.title),
    v("p", {}, text.errorBody),
    v(
      "a",
      routeAttributes("/", { class: "bg-primary", "data-button": true }),
      text.errorAction,
    ),
  );
}

function finishRouteNavigation(nextRoute, runtime) {
  if (runtime.historyNavigation === true) {
    runtime.historyNavigation = false;
    return;
  }
  const browser = runtime.browser;
  const hash = new URL(nextRoute.path, browser.location.origin).hash;
  if (hash.length > 1) {
    const target = browser.document.getElementById(
      decodeURIComponent(hash.slice(1)),
    );
    target?.scrollIntoView();
    return;
  }
  browser.scrollTo(0, 0);
  browser.document
    .querySelector("#main-content")
    ?.focus({ preventScroll: true });
}

function Site(state, runtime = null) {
  const text = ui();
  let page = state.serverError
    ? ServerError(state, text)
    : state.notFound
      ? NotFound(state, text)
      : state.viewType === "home"
        ? Home(text, state.homeExample, state.homeExampleLanguage)
        : ["learn", "guidesHub", "recipesHub", "referenceHub"].includes(
              state.viewType,
            )
          ? Hub(state, text, runtime)
          : state.content
            ? StructuredDocument(state, text)
            : Documentation(state, text);
  if (
    runtime?.browser &&
    !["home", "learn", "guidesHub", "recipesHub", "referenceHub"].includes(
      state.viewType,
    )
  ) {
    page = v(
      TocLifecycle,
      { browser: runtime.browser, key: state.pathname },
      page,
    );
  }
  return v(
    fragment,
    {},
    Header(state, text, runtime),
    v(UpdateNotice, { labels: text, pwa: runtime?.pwa || null }),
    page,
    v(
      "footer",
      { class: "site-footer" },
      v("p", {}, "Valyrian.js ", v("span", {}, `v${valyrianVersion}`)),
    ),
  );
}

function SiteApplication({ runtime, state }) {
  if (runtime?.browser) {
    onCreate(() => {
      const markHistoryNavigation = () => {
        runtime.historyNavigation = true;
      };
      runtime.browser.addEventListener("popstate", markHistoryNavigation);
      return () => {
        runtime.browser.removeEventListener("popstate", markHistoryNavigation);
      };
    });
    if (typeof runtime.afterRouteCallback !== "function") {
      runtime.afterRouteCallback = (nextRoute) =>
        finishRouteNavigation(nextRoute, runtime);
    }
    afterRoute(runtime.afterRouteCallback);
  }
  return Site(state, runtime);
}

module.exports = { Site, SiteApplication };
