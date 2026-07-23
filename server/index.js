const { realpath, readFile, stat } = require("node:fs/promises");
const { extname, resolve, sep } = require("node:path");
const Fastify = require("fastify");
const { render, ServerStorage } = require("valyrian.js/node");
const { v } = require("valyrian.js");
const { createRouter } = require("../client/app/router.js");
const { SITE_ORIGIN } = require("../client/app/site.js");
const { Site } = require("../client/pages/site.js");
const { activateLocale, t } = require("../client/i18n/index.js");
const pagesEn = require("../public/generated/pages.en.json");
const { version: buildVersion } = require("../public/generated/build.json");

const DEFAULT_LOCALE = "en";
const publicDirectory = resolve("public");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};
const publicRoutes = Object.keys(pagesEn);

function resolvePort(environment) {
  if (!("PORT" in environment)) {
    return 3023;
  }

  if (!/^[1-9]\d*$/.test(environment.PORT)) {
    throw new Error("PORT must be an integer from 1 to 65535");
  }

  const port = Number(environment.PORT);
  if (!Number.isSafeInteger(port) || port > 65535) {
    throw new Error("PORT must be an integer from 1 to 65535");
  }

  return port;
}

function renderDocument(routeHtml, initialState) {
  const state = JSON.stringify(initialState)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  const canonical = `${SITE_ORIGIN}${initialState.pathname}`;
  const title =
    initialState.pathname === "/"
      ? "Valyrian.js"
      : `${initialState.title} · Valyrian.js`;

  return `<!doctype html>${render(
    v(
      "html",
      { lang: initialState.locale },
      v(
        "head",
        {},
        v("meta", { charset: "utf-8" }),
        v("meta", {
          content: "width=device-width,initial-scale=1",
          name: "viewport",
        }),
        v("meta", {
          content: initialState.description || t("meta.description"),
          name: "description",
        }),
        initialState.notFound || initialState.serverError
          ? null
          : v("link", { href: canonical, rel: "canonical" }),
        initialState.previous
          ? v("link", {
              href: `${SITE_ORIGIN}${initialState.previous.pathname}`,
              rel: "prev",
            })
          : null,
        initialState.next
          ? v("link", {
              href: `${SITE_ORIGIN}${initialState.next.pathname}`,
              rel: "next",
            })
          : null,
        v("link", { href: "/icon.svg", rel: "icon", type: "image/svg+xml" }),
        v("link", { href: "/manifest.webmanifest", rel: "manifest" }),
        v("meta", { content: "#6a59b8", name: "theme-color" }),
        v("link", {
          href: "/icons/apple-touch-icon.png",
          rel: "apple-touch-icon",
        }),
        v("link", {
          href: `/base.css?v=${buildVersion}`,
          rel: "stylesheet",
        }),
        v("link", {
          href: `/theme.css?v=${buildVersion}`,
          rel: "stylesheet",
        }),
        v("link", {
          href: `/main.css?v=${buildVersion}`,
          rel: "stylesheet",
        }),
        v("title", {}, title),
        v("script", { id: "initial-state", type: "application/json" }, state),
        v("script", {
          defer: true,
          src: `/app.js?v=${buildVersion}`,
        }),
      ),
      v("body", { "v-html": routeHtml }),
    ),
  )}`;
}

async function readPublicAsset(pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return { statusCode: 400 };
  }

  if (decodedPath.includes("\0")) {
    return { statusCode: 400 };
  }

  const candidate = resolve(publicDirectory, `.${decodedPath}`);
  if (!candidate.startsWith(`${publicDirectory}${sep}`)) {
    return { statusCode: 404 };
  }

  try {
    const [publicRoot, assetPath] = await Promise.all([
      realpath(publicDirectory),
      realpath(candidate),
    ]);
    if (!assetPath.startsWith(`${publicRoot}${sep}`)) {
      return { statusCode: 404 };
    }

    const assetStat = await stat(assetPath);
    if (!assetStat.isFile()) {
      return { statusCode: 404 };
    }

    return {
      body: await readFile(assetPath),
      contentType:
        contentTypes[extname(assetPath).toLowerCase()] ||
        "application/octet-stream",
      statusCode: 200,
    };
  } catch (error) {
    if (error && ["EACCES", "ENOENT", "ENOTDIR"].includes(error.code)) {
      return { statusCode: 404 };
    }
    throw error;
  }
}

function createApp(options = {}) {
  const app = Fastify({ logger: options.logger ?? false });

  app.addHook("onRequest", (_request, reply, done) => {
    reply.headers({
      "content-security-policy":
        "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
      "permissions-policy": "camera=(), geolocation=(), microphone=()",
      "referrer-policy": "strict-origin-when-cross-origin",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    });
    done();
  });

  app.get("/*", async (request, reply) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    if (extname(pathname) !== "") {
      const asset = await readPublicAsset(pathname);
      if (asset.statusCode !== 200) {
        return reply
          .code(asset.statusCode)
          .type("text/plain")
          .send("Not found");
      }

      const cacheControl =
        pathname === "/sw.js" || pathname === "/manifest.webmanifest"
          ? "no-cache"
          : new URL(request.url, "http://localhost").searchParams.get("v") ===
              buildVersion
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600";
      return reply
        .header("cache-control", cacheControl)
        .type(asset.contentType)
        .send(asset.body);
    }

    return ServerStorage.run(async () => {
      if (!ServerStorage.isContextActive()) {
        throw new Error("SSR requires request-scoped storage");
      }

      const locale = DEFAULT_LOCALE;
      activateLocale(locale);
      const page = pagesEn[pathname] ?? null;
      const initialState = {
        locale,
        path: request.url,
        pathname,
        routes: publicRoutes,
        ...(page || {}),
      };
      const response = { statusCode: 200 };
      const router = createRouter({ initialState, response });
      const routeHtml = await router.go(request.url);

      return reply
        .code(response.statusCode)
        .header("cache-control", "private, no-store")
        .header("content-language", locale)
        .type("text/html; charset=utf-8")
        .send(renderDocument(routeHtml, initialState));
    });
  });

  app.setNotFoundHandler((request, reply) => {
    const statusCode =
      request.method === "GET" || request.method === "HEAD" ? 404 : 405;
    return ServerStorage.run(() => {
      const locale = DEFAULT_LOCALE;
      activateLocale(locale);
      return reply
        .code(statusCode)
        .header("content-language", locale)
        .type("text/plain")
        .send(t("routes.notFound"));
    });
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error, requestId: request.id }, "Request failed");
    return ServerStorage.run(() => {
      const locale = DEFAULT_LOCALE;
      activateLocale(locale);
      const title = t("serverError");
      const initialState = {
        locale,
        path: request.url,
        pathname: new URL(request.url, "http://localhost").pathname,
        routes: publicRoutes,
        serverError: true,
        title,
      };
      const errorHtml = render(Site(initialState));

      return reply
        .code(500)
        .header("cache-control", "private, no-store")
        .header("content-language", locale)
        .type("text/html; charset=utf-8")
        .send(renderDocument(errorHtml, initialState));
    });
  });

  return app;
}

module.exports = { createApp, resolvePort };
