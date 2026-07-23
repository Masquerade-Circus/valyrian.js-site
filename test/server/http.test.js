const assert = require("node:assert/strict");
const { rm, mkdir, writeFile } = require("node:fs/promises");
const { after, before, describe, test } = require("node:test");
const { SYNTHETIC_PATHS } = require("../../client/app/site.js");
const registry = require("../../content/registry.js");
const { createApp, resolvePort } = require("../../server/index.js");
const { version: buildVersion } = require("../../public/generated/build.json");

const canaryDirectory = "tmp/test";
const canaryPath = `${canaryDirectory}/asset-canary.txt`;
const canary = "controlled-asset-canary";

describe("server configuration", () => {
  test("rejects invalid PORT values without opening a socket", () => {
    for (const value of ["", "0", "-1", "65536", "abc"]) {
      assert.throws(() => resolvePort({ PORT: value }), /PORT/);
    }
  });

  test("uses 3023 by default and gives PORT precedence", () => {
    assert.equal(resolvePort({}), 3023);
    assert.equal(resolvePort({ PORT: "4100" }), 4100);
  });
});

describe("HTTP boundary", () => {
  before(async () => {
    await mkdir(canaryDirectory, { recursive: true });
    await writeFile(canaryPath, canary);
  });

  after(async () => {
    await rm(canaryDirectory, { recursive: true, force: true });
  });

  test("serves every configured hub through the HTTP boundary", async () => {
    const app = createApp();
    const hubPaths = [
      ...registry
        .filter((entry) => entry.type === "hub")
        .map((entry) => entry.pathname),
      ...SYNTHETIC_PATHS.filter((pathname) => pathname !== "/"),
    ];

    for (const pathname of new Set(hubPaths)) {
      const response = await app.inject({ method: "GET", url: pathname });

      assert.equal(response.statusCode, 200, pathname);
      assert.match(response.headers["content-type"], /^text\/html/, pathname);
    }
    await app.close();
  });

  test("returns a safe 404 for an unknown route", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/missing" });

    assert.equal(response.statusCode, 404);
    assert.doesNotMatch(
      response.body,
      /node_modules|\/home\/|"stack"\s*:|\bat [\w.]+ \(/,
    );
    await app.close();
  });

  test("renders routes inside isolated request storage", async () => {
    const app = createApp();
    const [first, second] = await Promise.all([
      app.inject({ method: "GET", url: "/?request=first" }),
      app.inject({ method: "GET", url: "/?request=second" }),
    ]);

    assert.equal(first.statusCode, 200);
    assert.match(first.body, /\/\?request=first/);
    assert.doesNotMatch(first.body, /request=second/);
    assert.equal(second.statusCode, 200);
    assert.match(second.body, /\/\?request=second/);
    assert.doesNotMatch(second.body, /request=first/);
    assert.equal(first.headers["cache-control"], "private, no-store");
    assert.match(first.headers["content-security-policy"], /object-src 'none'/);
    await app.close();
  });

  test("renders English as the fixed backend locale", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/" });

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers["content-language"], "en");
    assert.equal(Object.hasOwn(response.headers, "vary"), false);
    assert.match(response.body, /<html lang="en">/);
    assert.match(response.body, /"locale":"en"/);
    await app.close();
  });

  test("localizes metadata without inventing language URLs", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/?source=test" });

    assert.equal(response.statusCode, 200);
    assert.match(response.body, /<title>[^<]+<\/title>/);
    assert.match(response.body, /<meta content="[^"]+" name="description"\/>/);
    assert.match(
      response.body,
      /<link href="https:\/\/valyrian-js\.appspot\.com\/" rel="canonical"\/>/,
    );
    assert.doesNotMatch(response.body, /hreflang/);
    await app.close();
  });

  test("renders 404 pages and hydration state in English", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/missing" });

    assert.equal(response.statusCode, 404);
    assert.equal(response.headers["content-language"], "en");
    assert.equal((response.body.match(/<h1/g) || []).length, 1);
    assert.match(response.body, /"locale":"en"/);
    assert.doesNotMatch(response.body, /rel="canonical"/);
    await app.close();
  });

  test("returns a safe 500 without internal details", async () => {
    const logs = [];
    const app = createApp({
      logger: {
        level: "error",
        stream: { write: (line) => logs.push(line) },
      },
    });
    app.get("/__test/error", async () => {
      throw new Error("controlled internal detail");
    });

    const response = await app.inject({
      method: "GET",
      url: "/__test/error",
    });

    assert.equal(response.statusCode, 500);
    assert.equal(response.headers["content-language"], "en");
    assert.equal((response.body.match(/<h1/g) || []).length, 1);
    assert.doesNotMatch(
      response.body,
      /controlled internal detail|node_modules|\/home\/|"stack"\s*:|\bat [\w.]+ \(/,
    );
    assert.doesNotMatch(response.body, /rel="canonical"/);
    assert.match(logs.join(""), /controlled internal detail/);
    await app.close();
  });

  test("rejects unsupported methods", async () => {
    const app = createApp();
    const response = await app.inject({ method: "POST", url: "/" });

    assert.equal(response.statusCode, 405);
    await app.close();
  });

  test("does not expose missing assets or traversal canaries", async () => {
    const app = createApp();

    for (const url of [
      "/missing.js",
      "/%2e%2e/tmp/test/asset-canary.txt",
      "/%E0%A4%A",
    ]) {
      const response = await app.inject({ method: "GET", url });

      assert.ok([400, 404].includes(response.statusCode), url);
      assert.doesNotMatch(response.body, new RegExp(canary), url);
    }

    await app.close();
  });

  test("serves public assets with a cache policy distinct from HTML", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/logo.svg" });

    assert.equal(response.statusCode, 200);
    assert.match(response.headers["content-type"], /^image\/svg\+xml/);
    assert.equal(response.headers["cache-control"], "public, max-age=3600");
    await app.close();
  });

  test("serves the sitemap from the conventional root path", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/sitemap.xml" });

    assert.equal(response.statusCode, 200);
    assert.match(response.headers["content-type"], /^application\/xml/);
    assert.match(response.body, /<urlset[^>]*>/);
    assert.doesNotMatch(response.body, /hreflang|\/en\/|\/es\//);
    await app.close();
  });

  test("renders an accessible shell through SSR", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/" });

    assert.equal(response.statusCode, 200);
    assert.match(response.body, /^<!doctype html>/);
    assert.doesNotMatch(response.body, /^&lt;!doctype html&gt;/);
    assert.doesNotMatch(response.body, /href="#main-content"/);
    assert.match(response.body, /<body><header>/);
    assert.match(response.body, /<nav[^>]+aria-label="[^"]+"/);
    assert.match(response.body, /class="locale-selector"[^>]+role="group"/);
    assert.match(response.body, /<main[^>]+id="main-content"/);
    assert.equal((response.body.match(/<h1/g) || []).length, 1);
    assert.match(response.body, /<footer class="site-footer">/);
    await app.close();
  });

  test("exposes CSS and hydration hooks in deterministic order", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/" });

    const base = response.body.indexOf("/base.css");
    const theme = response.body.indexOf("/theme.css");
    const site = response.body.indexOf("/main.css");
    assert.ok(base > 0);
    assert.ok(theme > base);
    assert.ok(site > theme);
    assert.match(
      response.body,
      new RegExp(`<script[^>]+defer[^>]+src="/app\\.js\\?v=${buildVersion}"`),
    );
    await app.close();
  });
});

describe("SSR body and landing", () => {
  test("mounts the SSR application directly in body and keeps scripts in head", async () => {
    const app = createApp();
    const response = await app.inject({ method: "GET", url: "/" });

    assert.equal(response.statusCode, 200);
    assert.doesNotMatch(response.body, /id="app"/);
    assert.match(response.body, /<body><header>/);
    assert.doesNotMatch(response.body, /site-shell/);

    const head = response.body.match(/<head>([\s\S]*?)<\/head>/)?.[1] || "";
    const body = response.body.match(/<body>([\s\S]*?)<\/body>/)?.[1] || "";
    assert.match(head, /<script id="initial-state" type="application\/json">/);
    assert.match(head, /<script[^>]+defer[^>]+src="\/app\.js/);
    assert.ok(
      head.indexOf('id="initial-state"') < head.indexOf('src="/app.js'),
    );
    assert.doesNotMatch(body, /<script/);
    await app.close();
  });

  test("renders the structural landing contract in English", async () => {
    const app = createApp();
    const english = await app.inject({ url: "/" });

    assert.equal((english.body.match(/<h1/g) || []).length, 1);
    assert.match(english.body, /mount\(&amp;quot;body&amp;quot;, App\)/);
    assert.match(english.body, /data-copy="true"/);
    assert.match(english.body, /aria-live="polite"/);
    assert.match(english.body, /"locale":"en"/);
    await app.close();
  });
});
