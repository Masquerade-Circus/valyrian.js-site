const assert = require("node:assert/strict");
const {
  mkdir,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} = require("node:fs/promises");
const { after, before, describe, test } = require("node:test");

const registry = require("../../content/registry.js");
const { resolveSnippets } = require("../../content/snippets/resolve.js");
const {
  buildContent,
  validateContent,
  validateRegistry,
} = require("../../build.js");

const fixtureRoot = "tmp/test-content";
const outsideRoot = "tmp/test-content-outside";

function cloneRegistry() {
  return structuredClone(registry);
}

describe("content registry integrity", () => {
  test("rejects missing routing metadata and localized variants", () => {
    for (const field of ["type", "pathname"]) {
      const candidate = cloneRegistry();
      delete candidate[0][field];
      assert.throws(
        () => validateRegistry(candidate),
        new RegExp(field),
        field,
      );
    }

    for (const locale of ["en", "es"]) {
      const candidate = cloneRegistry();
      delete candidate[0].variants[locale];
      assert.throws(
        () => validateRegistry(candidate),
        new RegExp(`variants\\.${locale}`),
        locale,
      );
    }
  });

  test("rejects duplicate IDs, duplicate pathnames and malformed paths", () => {
    for (const field of ["id", "pathname"]) {
      const candidate = cloneRegistry();
      candidate[1][field] = candidate[0][field];
      assert.throws(
        () => validateRegistry(candidate),
        new RegExp(field),
        field,
      );
    }

    const candidate = cloneRegistry();
    candidate[0].pathname = "/__test/../escape";
    assert.throws(() => validateRegistry(candidate), /pathname/);
  });
});

describe("localized content integrity", () => {
  before(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });
    await rm(outsideRoot, { recursive: true, force: true });
    await mkdir(`${fixtureRoot}/content/en/guides`, { recursive: true });
    await mkdir(`${fixtureRoot}/content/es/guides`, { recursive: true });
    await mkdir(`${fixtureRoot}/content/snippets`, { recursive: true });
    await mkdir(outsideRoot, { recursive: true });
  });

  after(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });
    await rm(outsideRoot, { recursive: true, force: true });
  });

  test("resolves JavaScript, Markdown and HTML snippets through one resolver", async () => {
    await Promise.all([
      writeFile(`${fixtureRoot}/content/snippets/source-js.js`, "js-source"),
      writeFile(`${fixtureRoot}/content/snippets/source-md.md`, "md-source"),
      writeFile(
        `${fixtureRoot}/content/snippets/source-html.html`,
        "html-source",
      ),
    ]);

    const result = await resolveSnippets(
      "{{snippet:source-js}} {{snippet:source-md}} {{snippet:source-html}}",
      { root: fixtureRoot },
    );

    assert.equal(result, "js-source md-source html-source");
  });

  test("rejects output traversal and symlink escapes from content", async () => {
    const candidate = [cloneRegistry()[0]];
    await writeFile(`${fixtureRoot}/${candidate[0].variants.en}`, "# Guides\n");
    await writeFile(`${fixtureRoot}/${candidate[0].variants.es}`, "# Guías\n");

    await assert.rejects(
      buildContent(candidate, {
        root: fixtureRoot,
        output: "../test-content-outside/generated",
      }),
      /output.*root/i,
    );

    await symlink("../test-content-outside", `${fixtureRoot}/escaped-output`);
    await assert.rejects(
      buildContent(candidate, {
        root: fixtureRoot,
        output: "escaped-output",
      }),
      /output.*symlink/i,
    );
    await rm(`${fixtureRoot}/escaped-output`, { force: true });

    await writeFile(`${outsideRoot}/escaped.md`, "# Escaped\n");
    await rm(`${fixtureRoot}/${candidate[0].variants.en}`, { force: true });
    await symlink(
      "../../../test-content-outside/escaped.md",
      `${fixtureRoot}/${candidate[0].variants.en}`,
    );
    await writeFile(`${fixtureRoot}/${candidate[0].variants.es}`, "# Guías\n");

    await assert.rejects(
      validateContent(candidate, { root: fixtureRoot }),
      /content.*root|symlink/i,
    );
    await rm(`${fixtureRoot}/${candidate[0].variants.en}`, { force: true });

    await writeFile(
      `${fixtureRoot}/${candidate[0].variants.en}`,
      "# Guides\n\n{{snippet:escaped}}\n",
    );
    await writeFile(
      `${fixtureRoot}/${candidate[0].variants.es}`,
      "# Guías\n\n{{snippet:escaped}}\n",
    );
    await writeFile(`${outsideRoot}/escaped.js`, "outsideApi()\n");
    await symlink(
      "../../../test-content-outside/escaped.js",
      `${fixtureRoot}/content/snippets/escaped.js`,
    );

    await assert.rejects(
      validateContent(candidate, { root: fixtureRoot }),
      /snippet.*(?:root|content\/snippets)|symlink/i,
    );
    await rm(`${fixtureRoot}/content/snippets/escaped.js`, { force: true });
  });

  test("builds deterministic public registry and localized search indexes", async () => {
    const candidate = [cloneRegistry()[0]];

    await writeFile(
      `${fixtureRoot}/content/snippets/intro.js`,
      "v('p', 'ok')\n",
    );
    await writeFile(
      `${fixtureRoot}/${candidate[0].variants.en}`,
      `# Fixture\n\n[Open the route](${candidate[0].pathname}).\n\nUse \`request.get\` here.\n\n{{snippet:intro}}\n`,
    );
    await writeFile(
      `${fixtureRoot}/${candidate[0].variants.es}`,
      `# Fixture\n\n[Open the route](${candidate[0].pathname}).\n\n{{snippet:intro}}\n`,
    );
    await buildContent(candidate, {
      root: fixtureRoot,
      output: "generated",
    });
    const searchIndex = JSON.parse(
      await readFile(`${fixtureRoot}/generated/search.en.json`, "utf8"),
    );
    assert.ok(
      searchIndex.every(
        (record) =>
          typeof record.module === "string" || typeof record.group === "string",
      ),
      "every published search record needs a module or group",
    );
    const firstFiles = (await readdir(`${fixtureRoot}/generated`)).sort();
    const firstBytes = await Promise.all(
      firstFiles.map((file) => readFile(`${fixtureRoot}/generated/${file}`)),
    );

    await writeFile(`${fixtureRoot}/generated/stale.json`, "stale\n");
    await writeFile(`${fixtureRoot}/sibling-canary.txt`, "preserve\n");
    await buildContent(candidate, {
      root: fixtureRoot,
      output: "generated",
    });

    const secondFiles = (await readdir(`${fixtureRoot}/generated`)).sort();
    const secondBytes = await Promise.all(
      secondFiles.map((file) => readFile(`${fixtureRoot}/generated/${file}`)),
    );
    const publicRegistry = JSON.parse(
      await readFile(`${fixtureRoot}/generated/content-registry.json`, "utf8"),
    );
    const englishIndex = JSON.parse(
      await readFile(`${fixtureRoot}/generated/search.en.json`, "utf8"),
    );
    const spanishIndex = JSON.parse(
      await readFile(`${fixtureRoot}/generated/search.es.json`, "utf8"),
    );
    const spanishPages = JSON.parse(
      await readFile(`${fixtureRoot}/generated/pages.es.json`, "utf8"),
    );
    const sitemap = await readFile(
      `${fixtureRoot}/generated/sitemap.xml`,
      "utf8",
    );

    assert.deepEqual(firstFiles, [
      "content-registry.json",
      "pages.en.json",
      "pages.es.json",
      "search.en.json",
      "search.es.json",
      "sitemap.xml",
    ]);
    assert.deepEqual(secondFiles, firstFiles);
    assert.deepEqual(secondBytes, firstBytes);
    assert.equal(
      await readFile(`${fixtureRoot}/sibling-canary.txt`, "utf8"),
      "preserve\n",
    );
    assert.equal(typeof spanishPages[candidate[0].pathname].markdown, "string");
    for (const entry of candidate) {
      assert.ok(
        publicRegistry.some(
          (publicEntry) =>
            publicEntry.id === entry.id &&
            publicEntry.pathname === entry.pathname,
        ),
      );
    }
    assert.equal(
      new Set(publicRegistry.map((entry) => entry.pathname)).size,
      publicRegistry.length,
    );
    assert.equal(typeof englishIndex[0].title, "string");
    assert.equal(typeof spanishIndex[0].title, "string");
    assert.match(englishIndex[0].text, /request\.get/);
    assert.match(englishIndex[0].text, /v\('p', 'ok'\)/);
    assert.doesNotMatch(englishIndex[0].text, /snippet:intro/);
    assert.match(sitemap, /<urlset/);
  });
});
