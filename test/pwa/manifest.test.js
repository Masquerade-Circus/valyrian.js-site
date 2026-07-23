const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const { test } = require("node:test");

test("manifest provides installable same-origin metadata and complete icons", async () => {
  const manifest = JSON.parse(
    await readFile("public/manifest.webmanifest", "utf8"),
  );

  assert.equal(manifest.id, "/");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.theme_color, "#6a59b8");
  assert.equal(
    manifest.icons.some((icon) => icon.sizes === "192x192"),
    true,
  );
  assert.equal(
    manifest.icons.some((icon) => icon.sizes === "512x512"),
    true,
  );
});
