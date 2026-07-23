const PATH_PATTERN =
  /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const KINDS = new Set(["guide", "learningPath", "recipe", "reference"]);

function isSafeHref(href) {
  return (
    typeof href === "string" &&
    (/^\/(?!\/)/.test(href) ||
      href.startsWith("#") ||
      href.startsWith("https://"))
  );
}

function isValidRecord(record) {
  if (
    typeof record !== "object" ||
    record === null ||
    typeof record.title !== "string" ||
    record.title.trim().length === 0 ||
    !Array.isArray(record.sections)
  ) {
    return false;
  }
  return record.sections.every((section) => {
    if (typeof section !== "object" || section === null) {
      return false;
    }
    for (const field of ["heading", "body", "code", "language"]) {
      if (field in section && typeof section[field] !== "string") {
        return false;
      }
    }
    if ("ordered" in section && typeof section.ordered !== "boolean") {
      return false;
    }
    if (
      "definitions" in section &&
      (!Array.isArray(section.definitions) ||
        !section.definitions.every(
          (definition) =>
            typeof definition === "object" &&
            definition !== null &&
            typeof definition.term === "string" &&
            typeof definition.description === "string",
        ))
    ) {
      return false;
    }
    return (
      !("items" in section) ||
      (Array.isArray(section.items) &&
        section.items.every(
          (item) =>
            typeof item === "string" ||
            (typeof item === "object" &&
              item !== null &&
              typeof item.label === "string" &&
              isSafeHref(item.href)),
        ))
    );
  });
}

function validateSiteMap(siteMap) {
  if (!Array.isArray(siteMap.routes)) {
    throw new Error("Site map routes must be an array");
  }
  const ids = new Set();
  const paths = new Set();
  for (const item of siteMap.routes) {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof item.id !== "string" ||
      item.id.length === 0 ||
      !KINDS.has(item.kind) ||
      typeof item.group !== "string" ||
      item.group.length === 0 ||
      typeof item.pathname !== "string" ||
      !PATH_PATTERN.test(item.pathname)
    ) {
      throw new Error("Site map contains an invalid route");
    }
    if (ids.has(item.id) || paths.has(item.pathname)) {
      throw new Error("Site map route IDs and pathnames must be unique");
    }
    ids.add(item.id);
    paths.add(item.pathname);
  }
}

function publishedStructuredRoutes(siteMap, localizedContent) {
  validateSiteMap(siteMap);
  return siteMap.routes.filter((route) => {
    const english = localizedContent.en?.[route.id];
    const spanish = localizedContent.es?.[route.id];
    return [
      [english, localizedContent.en],
      [spanish, localizedContent.es],
    ].every(
      ([record, localeContent]) =>
        isValidRecord(record) &&
        (route.kind === "learningPath" ||
          typeof (route.kind === "reference"
            ? localeContent.$referenceGroups?.[route.group]?.title
            : localeContent.$groups?.[route.group]?.title) === "string"),
    );
  });
}

function structuredHubItems(routes, localizedContent, locale, kind) {
  const content = localizedContent[locale] || {};
  return routes
    .filter((route) => route.kind === kind && content[route.id])
    .map((route) => ({
      group: route.group,
      pathname: route.pathname,
      ...(typeof route.exampleId === "string"
        ? { exampleId: route.exampleId }
        : {}),
      ...(typeof route.module === "string" ? { module: route.module } : {}),
      ...(typeof route.symbol === "string" ? { symbol: route.symbol } : {}),
      ...content[route.id],
    }));
}

function groupedStructuredRoutes(routes, current) {
  return routes.filter(
    (route) =>
      route.kind === current.kind &&
      (current.kind === "learningPath" || route.group === current.group),
  );
}

function assertNoPathCollisions(existingPaths, routes) {
  const paths = new Set(existingPaths);
  for (const route of routes) {
    if (paths.has(route.pathname)) {
      throw new Error(`Structured route collides with ${route.pathname}`);
    }
    paths.add(route.pathname);
  }
}

module.exports = {
  assertNoPathCollisions,
  groupedStructuredRoutes,
  publishedStructuredRoutes,
  structuredHubItems,
  validateSiteMap,
};
