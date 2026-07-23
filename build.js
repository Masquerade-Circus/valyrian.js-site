const {
  lstat,
  mkdir,
  readFile,
  realpath,
  rm,
  writeFile,
} = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
const sass = require("sass");
const { inline } = require("valyrian.js/node");

const {
  SITE_ORIGIN,
  SYNTHETIC_PAGES,
  SYNTHETIC_PATHS,
} = require("./client/app/site.js");
const registry = require("./content/registry.js");
const siteMap = require("./content/site-map.js");
const snippetCatalog = require("./content/snippets/catalog.json");
const { readSnippet } = require("./content/snippets/resolve.js");
const {
  assertNoPathCollisions,
  groupedStructuredRoutes,
  publishedStructuredRoutes,
  structuredHubItems,
} = require("./content/structured-content.js");
const viewContent = require("./content/view-content.js");

const PWA_ASSET_PATHS = [
  "/app.js",
  "/base.css",
  "/theme.css",
  "/main.css",
  "/generated/content-registry.json",
  "/generated/pages.en.json",
  "/generated/pages.es.json",
  "/generated/search.en.json",
  "/generated/search.es.json",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/logo.svg",
  "/icon.svg",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/apple-touch-icon.png",
  "/offline.en.html",
  "/offline.es.html",
];
const PWA_VERSIONED_ASSET_PATHS = [
  "/app.js",
  "/base.css",
  "/theme.css",
  "/main.css",
  "/offline.en.html",
  "/offline.es.html",
];

const ALLOWED_TYPES = new Set([
  "start",
  "tutorial",
  "guide",
  "reference",
  "recipe",
  "hub",
]);
function requireString(entry, field, index) {
  const value = field
    .split(".")
    .reduce((current, key) => current?.[key], entry);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Registry entry ${index + 1} requires ${field}`);
  }
}

function validateRegistry(candidate) {
  if (!Array.isArray(candidate) || candidate.length === 0) {
    throw new Error("Registry must contain at least one route");
  }

  const uniqueFields = {
    id: new Set(),
    pathname: new Set(),
  };

  candidate.forEach((entry, index) => {
    for (const field of [
      "id",
      "section",
      "type",
      "pathname",
      "variants.en",
      "variants.es",
    ]) {
      requireString(entry, field, index);
    }

    for (const [field, values] of Object.entries(uniqueFields)) {
      if (values.has(entry[field])) {
        throw new Error(`Registry contains duplicate ${field}`);
      }
      values.add(entry[field]);
    }

    if (!ALLOWED_TYPES.has(entry.type)) {
      throw new Error(`Registry entry ${entry.id} has invalid type`);
    }

    if (
      !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(
        entry.pathname,
      )
    ) {
      throw new Error(`Registry entry ${entry.id} has invalid pathname`);
    }

    const contentPath =
      entry.pathname === "/" ? "home" : entry.pathname.slice(1);
    for (const locale of ["en", "es"]) {
      const expected = `content/${locale}/${contentPath}.md`;
      if (entry.variants[locale] !== expected) {
        throw new Error(
          `Registry entry ${entry.id} has invalid variants.${locale}`,
        );
      }
    }
  });
}

function markdownHeadings(markdown) {
  return [...markdown.matchAll(/^(#{1,6})\s+(.+?)\s*#*\s*$/gm)].map((match) =>
    match[2].replace(/[*_`]/g, "").trim(),
  );
}

function headingSlug(heading) {
  return heading
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function publicPaths(candidate) {
  const paths = new Set(SYNTHETIC_PATHS);

  for (const entry of candidate) {
    paths.add(entry.pathname);
  }

  for (const entry of publishedStructuredRoutes(siteMap, viewContent)) {
    paths.add(entry.pathname);
  }

  return paths;
}

function assertContained(root, target, label) {
  const relative = path.relative(root, target);
  if (
    relative.length === 0 ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`${label} must stay inside the project root`);
  }
}

async function readContainedFile(root, relativePath, label) {
  const target = path.resolve(root, relativePath);
  assertContained(root, target, label);

  const [realRoot, realTarget] = await Promise.all([
    realpath(root),
    realpath(target),
  ]);
  assertContained(realRoot, realTarget, label);
  return readFile(realTarget, "utf8");
}

async function validateMarkdown(markdown, entry, locale, options) {
  const errors = [];
  const seenHeadings = new Set();
  let resolvedMarkdown = markdown;

  for (const heading of markdownHeadings(markdown)) {
    const slug = headingSlug(heading);
    if (seenHeadings.has(slug)) {
      errors.push(`${entry.id} ${locale} has duplicate heading ${heading}`);
    }
    seenHeadings.add(slug);
  }

  for (const match of markdown.matchAll(
    /\[[^\]]*\]\((\/[^)\s#]*)(?:#[^)]*)?\)/g,
  )) {
    if (!options.paths.has(match[1])) {
      errors.push(`${entry.id} ${locale} has broken internal link ${match[1]}`);
    }
  }

  for (const match of markdown.matchAll(
    /\{\{snippet:([a-z0-9][a-z0-9/-]*)\}\}/g,
  )) {
    const snippet = await readSnippet(options.root, match[1]);
    if (snippet === null) {
      errors.push(`${entry.id} ${locale} has missing snippet ${match[1]}`);
      continue;
    }
    resolvedMarkdown = resolvedMarkdown.split(match[0]).join(snippet);
  }

  return { errors, markdown: resolvedMarkdown };
}

async function validateContent(candidate, options = {}) {
  validateRegistry(candidate);
  const root = path.resolve(options.root ?? ".");
  const paths = publicPaths(candidate);
  const documents = [];
  const errors = [];

  for (const entry of candidate) {
    for (const locale of ["en", "es"]) {
      try {
        const markdown = await readContainedFile(
          root,
          entry.variants[locale],
          `Content ${entry.id} ${locale}`,
        );
        const validated = await validateMarkdown(markdown, entry, locale, {
          root,
          paths,
        });
        errors.push(...validated.errors);
        documents.push({ entry, locale, markdown: validated.markdown });
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
        errors.push(`${entry.id} requires ${entry.variants[locale]}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return documents;
}

function searchRecord(document) {
  const headings = markdownHeadings(document.markdown);
  const text = document.markdown
    .replace(/```(?:\w+)?\n?([\s\S]*?)```/g, " $1 ")
    .replace(/`([^`]+)`/g, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, " $1 ")
    .replace(/[#>*_{}-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    group: document.entry.section,
    id: document.entry.id,
    pathname: document.entry.pathname,
    title: headings[0] ?? document.entry.id,
    headings,
    text,
  };
}

function descriptionFromMarkdown(markdown) {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .find((block) => !block.startsWith("#") && !block.startsWith("```"));
  return paragraph
    ?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fencedSnippetCode(snippet) {
  if (typeof snippet !== "string") {
    return null;
  }
  const match = /^```[^\n]*\n([\s\S]*?)\n```\s*$/.exec(snippet);
  return match?.[1] ?? snippet;
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

function localizedNavigationGroups(structuredRoutes, locale, kind) {
  const reference = kind === "reference";
  const groupIds = reference
    ? siteMap.referenceGroups.map((group) => group.id)
    : siteMap.groups;
  const localizedGroups = reference
    ? viewContent[locale].$referenceGroups
    : viewContent[locale].$groups;
  return groupIds
    .map((id) => ({
      ...localizedGroups[id],
      id,
      items: structuredRoutes
        .filter((entry) => entry.kind === kind && entry.group === id)
        .map((entry) => ({
          pathname: entry.pathname,
          title: viewContent[locale][entry.id].title,
        })),
    }))
    .filter((group) => group.items.length > 0);
}

async function localizedPages(
  locale,
  candidate,
  documents,
  structuredRoutes,
  root,
) {
  const records = documents
    .filter((document) => document.locale === locale)
    .map(searchRecord);
  const titles = new Map(
    records.map((record) => [record.pathname, record.title]),
  );
  const documentByPath = new Map(
    documents
      .filter((document) => document.locale === locale)
      .map((document) => [document.entry.pathname, document]),
  );
  const pages = {};
  const homeSnippet = await readSnippet(root, "browser-cdn");
  pages["/"] = {
    homeExample: fencedSnippetCode(homeSnippet),
    homeExampleLanguage: "html",
    title: "Valyrian.js",
    viewType: "home",
  };

  for (const pathname of ["/learn", "/reference"]) {
    const markdown = SYNTHETIC_PAGES[locale][pathname];
    const section = pathname.slice(1);
    const items = candidate
      .filter((entry) => entry.section === section)
      .map((entry) => ({
        pathname: entry.pathname,
        title: titles.get(entry.pathname) || entry.id,
      }));
    items.unshift({
      pathname,
      title: markdown.match(/^#\s+(.+)$/m)?.[1],
    });
    const structuredKind = pathname === "/learn" ? "learningPath" : "reference";
    const hubItems = structuredHubItems(
      structuredRoutes,
      viewContent,
      locale,
      structuredKind,
    ).map((item) => ({
      ...item,
      groupTitle:
        (structuredKind === "reference"
          ? viewContent[locale].$referenceGroups?.[item.group]?.title
          : viewContent[locale].$groups?.[item.group]?.title) || item.group,
    }));
    pages[pathname] = {
      description: descriptionFromMarkdown(markdown),
      hubGroups:
        pathname === "/reference"
          ? siteMap.referenceGroups
              .map((group) => ({
                ...viewContent[locale].$referenceGroups?.[group.id],
                id: group.id,
                items: hubItems.filter((item) => item.group === group.id),
              }))
              .filter((group) => typeof group.title === "string")
          : [],
      hubItems,
      markdown,
      next: items[1] || null,
      previous: null,
      sectionItems: items,
      title: titles.get(pathname) || items[0].title,
      viewType: pathname === "/learn" ? "learn" : "referenceHub",
    };
  }

  for (const entry of candidate) {
    const document = documentByPath.get(entry.pathname);
    const items = candidate
      .filter((item) => item.section === entry.section)
      .map((item) => ({
        pathname: item.pathname,
        title: titles.get(item.pathname) || item.id,
      }));
    const currentIndex = items.findIndex(
      (item) => item.pathname === entry.pathname,
    );
    const viewType =
      entry.type === "hub" && entry.id === "guides"
        ? "guidesHub"
        : entry.type === "hub" && entry.id === "recipes"
          ? "recipesHub"
          : entry.type;
    const structuredKind =
      viewType === "guidesHub"
        ? "guide"
        : viewType === "recipesHub"
          ? "recipe"
          : null;
    const hubItems = structuredKind
      ? structuredHubItems(
          structuredRoutes,
          viewContent,
          locale,
          structuredKind,
        ).map((item) => ({
          ...item,
          groupTitle:
            viewContent[locale].$groups?.[item.group]?.title || item.group,
        }))
      : [];
    const hubGroups = structuredKind
      ? localizedNavigationGroups(structuredRoutes, locale, structuredKind).map(
          (group) => ({
            ...group,
            items: hubItems.filter((item) => item.group === group.id),
          }),
        )
      : [];
    pages[entry.pathname] = {
      description: descriptionFromMarkdown(document.markdown),
      hubGroups,
      hubItems,
      markdown: document.markdown,
      next: items[currentIndex + 1] || null,
      previous: currentIndex > 0 ? items[currentIndex - 1] : null,
      sectionItems: items,
      title: titles.get(entry.pathname),
      viewType,
    };
  }

  for (const entry of structuredRoutes) {
    const content = viewContent[locale][entry.id];
    const groupEntries = groupedStructuredRoutes(structuredRoutes, entry);
    const currentIndex = groupEntries.findIndex(
      (candidateEntry) => candidateEntry.id === entry.id,
    );
    const snippet = entry.exampleId
      ? await readSnippet(root, entry.exampleId)
      : null;
    pages[entry.pathname] = {
      content,
      description: content.summary || content.introduction,
      exampleCode: fencedSnippetCode(snippet),
      exampleLanguage: entry.exampleId
        ? snippetCatalog.snippets.find((item) => item.id === entry.exampleId)
            ?.language || null
        : null,
      groupTitle:
        (entry.kind === "reference"
          ? viewContent[locale].$referenceGroups?.[entry.group]?.title
          : viewContent[locale].$groups?.[entry.group]?.title) || entry.group,
      groupId: entry.group,
      navigationGroups: ["guide", "recipe", "reference"].includes(entry.kind)
        ? localizedNavigationGroups(structuredRoutes, locale, entry.kind)
        : [],
      next:
        currentIndex >= 0 && groupEntries[currentIndex + 1]
          ? {
              pathname: groupEntries[currentIndex + 1].pathname,
              title:
                viewContent[locale][groupEntries[currentIndex + 1].id].title,
            }
          : null,
      previous:
        currentIndex > 0
          ? {
              pathname: groupEntries[currentIndex - 1].pathname,
              title:
                viewContent[locale][groupEntries[currentIndex - 1].id].title,
            }
          : null,
      sectionItems: groupEntries.map((candidateEntry) => ({
        pathname: candidateEntry.pathname,
        title: viewContent[locale][candidateEntry.id].title,
      })),
      title: content.title,
      viewType: `${entry.kind}Document`,
    };
  }

  return pages;
}

async function writeJson(filePath, value, indentation = 2) {
  await writeFile(filePath, `${JSON.stringify(value, null, indentation)}\n`);
}

function sitemap(candidate, extraPaths = []) {
  const paths = new Set(SYNTHETIC_PATHS);
  for (const entry of candidate) {
    paths.add(entry.pathname);
  }
  for (const pathname of extraPaths) {
    paths.add(pathname);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    ...paths,
  ]
    .map((pathname) => `  <url><loc>${SITE_ORIGIN}${pathname}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
}

async function prepareOutput(root, outputOption) {
  const output = path.resolve(root, outputOption);
  assertContained(root, output, "Build output");
  const realRoot = await realpath(root);
  let ancestor = output;

  while (true) {
    try {
      const details = await lstat(ancestor);
      if (ancestor === output && details.isSymbolicLink()) {
        throw new Error("Build output cannot be a symlink");
      }

      const realAncestor = await realpath(ancestor);
      const projectedOutput = path.resolve(
        realAncestor,
        path.relative(ancestor, output),
      );
      assertContained(realRoot, projectedOutput, "Build output");
      break;
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
      ancestor = path.dirname(ancestor);
    }
  }

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  assertContained(realRoot, await realpath(output), "Build output");
  return output;
}

async function buildContent(candidate = registry, options = {}) {
  const root = path.resolve(options.root ?? ".");
  const documents = await validateContent(candidate, { root });
  const structuredRoutes = publishedStructuredRoutes(siteMap, viewContent);
  assertNoPathCollisions(
    [...SYNTHETIC_PATHS, ...candidate.map((entry) => entry.pathname)],
    structuredRoutes,
  );
  const publicRegistry = [
    ...candidate.map((entry) => ({
      id: entry.id,
      section: entry.section,
      type: entry.type,
      pathname: entry.pathname,
    })),
    ...structuredRoutes.map((entry) => ({
      id: entry.id,
      section: entry.group,
      type: entry.kind,
      pathname: entry.pathname,
    })),
  ];

  const output = await prepareOutput(
    root,
    options.output ?? "public/generated",
  );
  await writeJson(path.join(output, "content-registry.json"), publicRegistry);
  await writeFile(
    options.output === undefined
      ? path.join(root, "public/sitemap.xml")
      : path.join(output, "sitemap.xml"),
    sitemap(
      candidate,
      structuredRoutes.map((entry) => entry.pathname),
    ),
  );

  for (const locale of ["en", "es"]) {
    await writeJson(
      path.join(output, `pages.${locale}.json`),
      await localizedPages(
        locale,
        candidate,
        documents,
        structuredRoutes,
        root,
      ),
      0,
    );
    await writeJson(path.join(output, `search.${locale}.json`), [
      ...documents
        .filter((document) => document.locale === locale)
        .map(searchRecord),
      ...structuredRoutes.map((entry) => {
        const content = viewContent[locale][entry.id];
        const visibleSections = content.sections.filter(
          hasStructuredSectionContent,
        );
        const sectionText = visibleSections
          .map((section) =>
            [
              section.heading,
              section.body,
              ...(Array.isArray(section.items) ? section.items : []),
            ]
              .filter(hasVisibleText)
              .join(" "),
          )
          .join(" ");
        return {
          group: entry.group,
          headings: visibleSections
            .map((section) => section.heading)
            .filter(hasVisibleText),
          id: entry.id,
          module: entry.module,
          pathname: entry.pathname,
          summary: content.summary,
          symbol: entry.symbol,
          text: [
            entry.symbol,
            entry.module,
            content.summary,
            content.introduction,
            sectionText,
          ]
            .filter(hasVisibleText)
            .join(" "),
          title: content.title,
        };
      }),
    ]);
  }

  return {
    entries: publicRegistry.length,
    output,
  };
}

function pwaVersion(workerTemplate, assets, serverSource) {
  const hash = createHash("sha256").update(workerTemplate).update(serverSource);
  for (const assetPath of PWA_ASSET_PATHS) {
    const content = assets.get(assetPath);
    if (content === undefined) {
      throw new Error(`PWA asset ${assetPath} is missing from the build`);
    }
    hash.update(assetPath).update(content);
  }
  return hash.digest("hex").slice(0, 16);
}

async function buildSite() {
  const result = await buildContent();
  const bundle = await inline("./client/index.js", { compact: true });
  const themeCss = sass.compile("client/styles/theme.scss", {
    importers: [new sass.NodePackageImporter()],
    style: "compressed",
  }).css;
  const [baseCss, siteCss, workerTemplate, serverSource] = await Promise.all([
    readFile("node_modules/dragonglass/dist/dragonglass.css"),
    readFile("client/styles/site.css"),
    readFile("client/sw.js", "utf8"),
    readFile("server/index.js"),
  ]);
  const assets = new Map([
    ["/app.js", bundle.raw],
    ["/base.css", baseCss],
    ["/theme.css", themeCss],
    ["/main.css", siteCss],
  ]);
  await Promise.all(
    PWA_ASSET_PATHS.map(async (assetPath) => {
      if (!assets.has(assetPath)) {
        assets.set(
          assetPath,
          await readFile(path.join("public", assetPath.slice(1))),
        );
      }
    }),
  );
  const version = pwaVersion(workerTemplate, assets, serverSource);
  const worker = workerTemplate
    .replace("BUILD_VERSION", version)
    .replaceAll("BUILD_ASSET_PATHS", JSON.stringify(PWA_ASSET_PATHS))
    .replaceAll(
      "VERSIONED_ASSET_PATHS",
      JSON.stringify(PWA_VERSIONED_ASSET_PATHS),
    );
  await Promise.all([
    writeFile("public/app.js", bundle.raw),
    writeFile("public/base.css", baseCss),
    writeFile("public/theme.css", themeCss),
    writeFile("public/main.css", siteCss),
    writeFile("public/sw.js", worker),
    writeJson(path.join(result.output, "build.json"), { version }),
  ]);
  return { ...result, version };
}

if (require.main === module) {
  buildSite()
    .then((result) => {
      process.stdout.write(`Built ${result.entries} content entries\n`);
    })
    .catch((error) => {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = {
  PWA_ASSET_PATHS,
  PWA_VERSIONED_ASSET_PATHS,
  buildContent,
  buildSite,
  pwaVersion,
  validateContent,
  validateRegistry,
};
