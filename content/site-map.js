function route(kind, id, group, pathname, options = {}) {
  return { group, id, kind, pathname, ...options };
}

const learningPaths = [
  route(
    "learningPath",
    "learn.first-application",
    "views-lifecycle",
    "/learn/first-application",
  ),
  route(
    "learningPath",
    "learn.routing-data",
    "data-async",
    "/learn/routing-data",
  ),
  route(
    "learningPath",
    "learn.state-forms",
    "state-forms",
    "/learn/state-forms",
  ),
  route(
    "learningPath",
    "learn.network-offline-pwa",
    "network-offline-pwa",
    "/learn/network-offline-pwa",
  ),
  route(
    "learningPath",
    "learn.server-rendering-execution",
    "ssr-server",
    "/learn/server-rendering-execution",
  ),
];

const guides = [
  ["first-application", "views-lifecycle", "core-mount"],
  ["views-directives-trusted-content", "views-lifecycle"],
  ["lifecycle", "views-lifecycle", "core-lifecycle"],
  ["update-control", "views-lifecycle", "core-update-control"],
  ["application-routing", "routing", "router-basic"],
  ["navigation-hooks-redirects-errors", "routing"],
  ["requests", "data-async", "request-client"],
  ["suspense-boundaries", "data-async", "suspense-boundary"],
  ["asynchronous-tasks", "data-async", "task-latest"],
  ["queries-mutations", "data-async", "query-client"],
  ["reactive-values", "state-forms", "pulse-value"],
  ["reactive-stores-effects", "state-forms", "pulse-store"],
  ["flux-state", "state-forms", "flux-store"],
  ["devtools-integration", "state-forms", "redux-devtools"],
  ["forms-validation", "state-forms", "form-store"],
  ["network-status", "network-offline-pwa", "network-status"],
  ["offline-operations", "network-offline-pwa", "offline-queue"],
  ["service-worker-pwa-lifecycle", "network-offline-pwa"],
  ["server-side-rendering", "ssr-server"],
  ["server-storage", "ssr-server"],
  ["isolated-contexts", "ssr-server"],
  ["server-transformations-resources", "ssr-server"],
  ["translation", "state-forms", "translate-basic"],
  ["money", "state-forms", "money-basic"],
  ["native-storage", "state-forms", "native-store"],
  ["validation-object-paths", "state-forms", "utils-validation"],
].map(([id, group, exampleId]) =>
  route("guide", `guide.${id}`, group, `/guides/${id}`, { exampleId }),
);

const recipeGroups = new Map(
  guides.map((guide) => [guide.exampleId, guide.group]),
);
const recipeIds = [
  "core-mount",
  "core-lifecycle",
  "core-update-control",
  "router-basic",
  "request-client",
  "suspense-boundary",
  "task-latest",
  "query-client",
  "network-status",
  "offline-queue",
  "form-store",
  "pulse-value",
  "pulse-store",
  "flux-store",
  "redux-devtools",
  "translate-basic",
  "money-basic",
  "native-store",
  "utils-validation",
];
const recipes = recipeIds.map((id) =>
  route("recipe", `recipe.${id}`, recipeGroups.get(id), `/recipes/${id}`, {
    exampleId: id,
  }),
);

function moduleSymbols(module, names) {
  return names.map((name) => ({ module, name }));
}

const referenceGroups = [
  [
    "runtime-views",
    moduleSymbols("valyrian.js", [
      "v",
      "mount",
      "unmount",
      "update",
      "debouncedUpdate",
      "preventUpdate",
      "onCreate",
      "onUpdate",
      "onCleanup",
      "onRemove",
      "directive",
      "directives",
      "trust",
      "Vnode",
      "createElement",
      "current",
      "fragment",
      "hydrateDomToVnode",
      "isComponent",
      "isNodeJs",
      "isPOJOComponent",
      "isVnode",
      "isVnodeComponent",
      "reservedProps",
      "setAttribute",
      "setPropNameReserved",
      "updateAttributes",
      "updateVnode",
    ]),
  ],
  [
    "routing",
    moduleSymbols("valyrian.js/router", [
      "Router",
      "RouterError",
      "mountRouter",
      "redirect",
      "beforeRoute",
      "afterRoute",
    ]),
  ],
  [
    "data-async",
    [
      ...moduleSymbols("valyrian.js/request", ["request"]),
      ...moduleSymbols("valyrian.js/suspense", ["Suspense"]),
      ...moduleSymbols("valyrian.js/tasks", ["Task"]),
      ...moduleSymbols("valyrian.js/query", [
        "QueryClient",
        "QueryHandle",
        "MutationHandle",
      ]),
    ],
  ],
  [
    "network-offline",
    [
      ...moduleSymbols("valyrian.js/network", [
        "NetworkManager",
        "NetworkEvent",
        "NetworkError",
      ]),
      ...moduleSymbols("valyrian.js/offline", ["OfflineQueue"]),
    ],
  ],
  [
    "state",
    [
      ...moduleSymbols("valyrian.js/pulses", [
        "createPulse",
        "createPulseStore",
        "createMutableStore",
        "createEffect",
      ]),
      ...moduleSymbols("valyrian.js/flux-store", ["FluxStore"]),
    ],
  ],
  [
    "forms",
    moduleSymbols("valyrian.js/forms", ["FormStore", "formSchemaShield"]),
  ],
  [
    "devtools",
    moduleSymbols("valyrian.js/redux-devtools", [
      "connectPulse",
      "connectPulseStore",
      "connectFluxStore",
    ]),
  ],
  [
    "utilities",
    [
      ...moduleSymbols("valyrian.js/translate", [
        "getLang",
        "getTranslations",
        "setLang",
        "setLog",
        "setStoreStrategy",
        "setTranslations",
        "t",
      ]),
      ...moduleSymbols("valyrian.js/money", [
        "Money",
        "NumberFormatter",
        "formatMoney",
        "parseMoneyInput",
      ]),
      ...moduleSymbols("valyrian.js/native-store", [
        "StorageType",
        "createNativeStore",
      ]),
      ...moduleSymbols("valyrian.js/utils", [
        "deepCloneUnfreeze",
        "deepFreeze",
        "ensureIn",
        "get",
        "hasChanged",
        "hasLength",
        "hasLengthBetween",
        "hasMaxLength",
        "hasMinLength",
        "is",
        "isBetween",
        "isBoolean",
        "isEmpty",
        "isFiniteNumber",
        "isFunction",
        "isGreaterThan",
        "isLessThan",
        "isNumber",
        "isObject",
        "isString",
        "pick",
        "set",
      ]),
    ],
  ],
  [
    "server",
    moduleSymbols("valyrian.js/node", [
      "Event",
      "ServerStorage",
      "document",
      "domToHtml",
      "domToHyperscript",
      "htmlToDom",
      "htmlToHyperscript",
      "icons",
      "inline",
      "render",
      "sw",
    ]),
  ],
  ["pwa", moduleSymbols("valyrian.js/sw", ["SwRuntimeManager", "registerSw"])],
  [
    "context",
    moduleSymbols("valyrian.js/context", [
      "createContextScope",
      "getContext",
      "hasContext",
      "isServerContextActive",
      "runWithContext",
      "setContext",
    ]),
  ],
].map(([id, symbols]) => ({ id, symbols }));

function symbolSlug(symbol) {
  return symbol
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .toLowerCase();
}

const references = referenceGroups.flatMap((group) =>
  group.symbols.map((definition) =>
    route(
      "reference",
      `reference.${group.id}.${definition.name}`,
      group.id,
      `/reference/${group.id}/${symbolSlug(definition.name)}`,
      { module: definition.module, symbol: definition.name },
    ),
  ),
);

module.exports = {
  groups: [
    "views-lifecycle",
    "routing",
    "data-async",
    "state-forms",
    "network-offline-pwa",
    "ssr-server",
  ],
  guides,
  learningPaths,
  recipes,
  referenceGroups,
  references,
  routes: [...learningPaths, ...guides, ...recipes, ...references],
};
