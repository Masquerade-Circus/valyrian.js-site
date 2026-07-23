const assert = require("node:assert/strict");
const { readFile, rm } = require("node:fs/promises");
const { after, test } = require("node:test");

const { buildContent } = require("../../build.js");
const registry = require("../../content/registry.js");

const output = "tmp/test-generated-artifacts";

after(async () => {
  await rm(output, { recursive: true, force: true });
});

test("keeps generated locale catalogs deterministic and structurally paired", async () => {
  await buildContent(registry, { output });

  for (const locale of ["en", "es"]) {
    for (const artifact of ["search", "pages"]) {
      const expected = await readFile(`${output}/${artifact}.${locale}.json`);
      const actual = await readFile(
        `public/generated/${artifact}.${locale}.json`,
      );
      assert.deepEqual(actual, expected, `${artifact}.${locale}.json is stale`);
    }
  }

  const [english, spanish] = await Promise.all(
    ["en", "es"].map(async (locale) =>
      JSON.parse(await readFile(`${output}/pages.${locale}.json`, "utf8")),
    ),
  );
  assert.deepEqual(Object.keys(spanish).sort(), Object.keys(english).sort());
  for (const pages of [english, spanish]) {
    for (const page of Object.values(pages)) {
      assert.equal(typeof page, "object");
      assert.notEqual(page, null);
      assert.equal(typeof page.title, "string");
      assert.equal(typeof page.viewType, "string");
    }
  }
});
