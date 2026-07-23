const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createApp } = require("../../server/index.js");
const { version } = require("../../public/generated/build.json");

test("serves PWA control files and versioned assets with safe cache policies", async () => {
  const app = createApp();
  const [worker, manifest, offline, versioned] = await Promise.all([
    app.inject({ method: "GET", url: "/sw.js" }),
    app.inject({ method: "GET", url: "/manifest.webmanifest" }),
    app.inject({ method: "GET", url: "/offline.es.html" }),
    app.inject({ method: "GET", url: `/app.js?v=${version}` }),
  ]);

  assert.equal(worker.headers["cache-control"], "no-cache");
  assert.equal(manifest.headers["cache-control"], "no-cache");
  assert.match(
    manifest.headers["content-type"],
    /^application\/manifest\+json/,
  );
  assert.match(offline.headers["content-type"], /^text\/html/);
  assert.equal(
    versioned.headers["cache-control"],
    "public, max-age=31536000, immutable",
  );
  await app.close();
});
