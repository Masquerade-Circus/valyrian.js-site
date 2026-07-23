const assert = require("node:assert/strict");
const { test } = require("node:test");
const { PWA_ASSET_PATHS, pwaVersion } = require("../../build.js");

test("PWA version covers every cache-first resource", () => {
  for (const path of [
    "/icon.svg",
    "/generated/search.en.json",
    "/generated/search.es.json",
  ]) {
    assert.equal(PWA_ASSET_PATHS.includes(path), true, path);
  }

  const assets = new Map(
    PWA_ASSET_PATHS.map((path) => [path, Buffer.from(`content:${path}`)]),
  );
  const baseline = pwaVersion("worker", assets, "server");

  for (const path of ["/icon.svg", "/generated/search.en.json"]) {
    const changed = new Map(assets);
    changed.set(path, Buffer.from(`changed:${path}`));
    assert.notEqual(pwaVersion("worker", changed, "server"), baseline, path);
  }
});
