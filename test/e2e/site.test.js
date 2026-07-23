const { expect, test } = require("@playwright/test");
const { readFileSync } = require("node:fs");
const { connect } = require("node:net");

function serverIsClosed() {
  return new Promise((resolve) => {
    const socket = connect({ host: "127.0.0.1", port: 3023 });
    socket.once("connect", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(true));
  });
}

test("renders the canonical home example without an extra mount root", async ({
  page,
}) => {
  await page.goto("/");
  const copyControl = page.locator('[data-copy="true"]');
  const example = copyControl.locator("..").locator("code");

  await expect(example).toContainText('mount("body", App)');
  await expect(example).not.toContainText("#app");
  await expect(page.locator("body > header")).toHaveCount(1);
  await expect(page.locator("body > main")).toHaveCount(1);
  await expect(page.locator("body > script, #app")).toHaveCount(0);

  await expect(copyControl).toBeVisible();
});

test("navigates internal documentation links without reloading the document", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  let documentNavigations = 0;
  page.on("request", (request) => {
    if (request.isNavigationRequest()) {
      documentNavigations += 1;
    }
  });
  await page.goto("/");
  const initialState = await page
    .locator("#initial-state")
    .evaluate((element) => element.textContent);

  await page.evaluate(() => window.scrollTo(0, 500));

  await page
    .locator('.desktop-navigation a[href="/learn"]')
    .evaluate((link) => link.click());

  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("#main-content")).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator("[data-pwa-update]")).toBeHidden();
  expect(documentNavigations).toBe(1);
  expect(
    await page
      .locator("#initial-state")
      .evaluate((element) => element.textContent),
  ).toBe(initialState);

  const localizedPages = JSON.parse(
    readFileSync("public/generated/pages.es.json", "utf8"),
  );
  await page.locator('[data-locale="es"]').click();
  await expect(page.locator("main h1").first()).toHaveText(
    localizedPages["/learn"].title,
  );
  expect(documentNavigations).toBe(1);

  await page.locator('.desktop-navigation a[href="/reference"]').click();
  await expect(page).toHaveURL(/\/reference$/);
  await expect(page.locator("[data-search]")).toBeVisible();
  await page.locator('[data-search] input[type="search"]').fill("mount");
  await expect(page.locator("[data-search-results]")).toBeVisible();
  await expect(page.locator("[data-search-results] a").first()).toBeVisible();
  expect(documentNavigations).toBe(1);
  await context.close();
});

test("preserves hash targets and browser scroll restoration", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const homeScroll = await page.evaluate(() => window.scrollY);
  expect(homeScroll).toBeGreaterThan(500);

  await page
    .locator('.desktop-navigation a[href="/learn"]')
    .evaluate((link) => link.click());
  await expect(page).toHaveURL(/\/learn$/);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(homeScroll - 100);

  await page
    .locator('.desktop-navigation a[href="/reference"]')
    .evaluate((link) => link.click());
  const anchor = page.locator("[data-reference-index] nav a").first();
  const hash = await anchor.getAttribute("href");
  await anchor.click();
  await expect(page).toHaveURL(new RegExp(`${hash}$`));
  await expect(page.locator(hash)).toBeInViewport();
  await context.close();
});

test("keeps the landing readable and ordered at mobile and desktop widths", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 768, height: 900 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");
    const hero = await page.locator(".hero-inner").evaluate((element) => {
      const content = [
        element.querySelector(".hero-logo"),
        element.querySelector("h1"),
        element.querySelector(".lede"),
        element.querySelector(".hero-actions"),
      ];
      const centered = content.map((child) => {
        const bounds = child.getBoundingClientRect();
        return bounds.left + bounds.width / 2;
      });
      const logo = element.querySelector(".hero-logo");
      return {
        centered,
        classes: ["grid-center", "text-center", "min-h-half-screen"].every(
          (className) => element.classList.contains(className),
        ),
        logoHeight: logo.getAttribute("height"),
        logoOpacity: getComputedStyle(logo).opacity,
        logoWidth: logo.getAttribute("width"),
        order: content.map((child) => child.tagName),
      };
    });
    expect(
      Math.max(...hero.centered) - Math.min(...hero.centered),
    ).toBeLessThan(2);
    expect(hero).toMatchObject({
      classes: true,
      logoHeight: "136",
      logoOpacity: "1",
      logoWidth: "387",
      order: ["IMG", "H1", "P", "DIV"],
    });
  }

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const [brand, menu, locale] = await Promise.all([
    page.getByRole("link", { name: "Valyrian.js" }).first().boundingBox(),
    page.locator("header details").boundingBox(),
    page.locator('[data-locale="en"]').boundingBox(),
  ]);
  expect(Math.abs(brand.y - menu.y)).toBeLessThan(12);
  expect(Math.abs(brand.y - locale.y)).toBeLessThan(12);

  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({
    colorScheme: "light",
    reducedMotion: "no-preference",
  });
  await page.goto("/");
  const lightBackground = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).backgroundColor);

  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "200%";
  });
  const preferences = await page.evaluate(() => ({
    dark: matchMedia("(prefers-color-scheme: dark)").matches,
    fitsViewport: document.documentElement.scrollWidth <= innerWidth,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  await expect
    .poll(() =>
      page
        .locator("body")
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(lightBackground);
  const darkBackground = await page
    .locator("body")
    .evaluate((element) => getComputedStyle(element).backgroundColor);

  expect(preferences).toEqual({
    dark: true,
    fitsViewport: true,
    reduced: true,
    scrollBehavior: "auto",
  });
  expect(darkBackground).not.toBe(lightBackground);
  await context.close();
});

test("uses window scrolling for a long rendered surface", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  await page.goto("/__scroll_fixture__");
  await page.locator("main").evaluate((element) => {
    element.style.minHeight = "200vh";
  });
  expect(
    await page.evaluate(
      () => document.scrollingElement === document.documentElement,
    ),
  ).toBe(true);

  await page.locator("footer").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.body.scrollTop)).toBe(0);
  await context.close();
});

test("tracks the active structured-document section in both tables of contents", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  const registry = JSON.parse(
    readFileSync("public/generated/content-registry.json", "utf8"),
  );
  const reference = registry.find((entry) => entry.type === "reference");
  expect(reference).toBeTruthy();
  await page.goto(reference.pathname);
  const headings = page.locator(".structured-document h2[id]");
  const headingCount = await headings.count();
  expect(headingCount).toBeGreaterThan(1);
  const target = headings.nth(Math.floor(headingCount / 2));
  const id = await target.getAttribute("id");

  await target.evaluate((heading) => {
    window.scrollTo(
      0,
      window.scrollY +
        heading.getBoundingClientRect().top -
        window.innerHeight * 0.2,
    );
  });
  await expect
    .poll(async () =>
      page
        .locator(`[data-toc-link][href="#${id}"]`)
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute("aria-current")),
        ),
    )
    .toEqual(["location", "location"]);
  await context.close();
});

test("starts SSR in English and applies the persisted client locale", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  await context.addInitScript(() => {
    localStorage.setItem("valyrian-locale", "es");
  });
  const page = await context.newPage();
  await page.goto("/");
  const localizedPages = JSON.parse(
    readFileSync("public/generated/pages.es.json", "utf8"),
  );
  const canonicalPages = JSON.parse(
    readFileSync("public/generated/pages.en.json", "utf8"),
  );

  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect
    .poll(() =>
      page.locator("#initial-state").evaluate((element) => element.textContent),
    )
    .toContain('"locale":"en"');
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('[data-locale="es"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(
    await page.evaluate(
      () => performance.getEntriesByType("navigation")[0]?.type,
    ),
  ).toBe("navigate");

  const localizedPath = Object.keys(localizedPages).find(
    (pathname) => typeof localizedPages[pathname]?.markdown === "string",
  );
  expect(localizedPath).toBeTruthy();
  await page.goto(localizedPath);
  await expect(page.locator("main h1").first()).toHaveText(
    localizedPages[localizedPath].title,
  );

  await page.locator('[data-locale="en"]').click();
  await expect(page).toHaveURL(new RegExp(`${localizedPath}$`));
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("valyrian-locale")))
    .toBe("en");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main h1").first()).toHaveText(
    canonicalPages[localizedPath].title,
  );
  expect(
    await page.evaluate(
      () => performance.getEntriesByType("navigation")[0]?.type,
    ),
  ).toBe("navigate");
  await context.close();
});

test("keeps keyboard controls operable across SPA routes", async ({
  browser,
}) => {
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await expect(page.locator(".desktop-navigation > a")).toHaveCount(5);
  await expect(page.locator(".desktop-navigation > a")).toBeVisible();

  for (const pathname of ["/learn", "/guides", "/recipes", "/"]) {
    const link =
      pathname === "/"
        ? page.locator('.desktop-navigation a[href="/"]')
        : page.locator(`.desktop-navigation a[href="${pathname}"]`);
    await link.evaluate((element) => element.click());
    await expect(page).toHaveURL(
      new RegExp(`${pathname === "/" ? "/$" : `${pathname}$`}`),
    );
  }

  await context.close();
});

test("keeps SPA navigation silent while the current worker controls the page", async ({
  page,
}) => {
  let documentNavigations = 0;
  page.on("request", (request) => {
    if (request.isNavigationRequest()) {
      documentNavigations += 1;
    }
  });
  await page.goto("/");
  await page.waitForFunction(
    () => navigator.serviceWorker.controller?.state === "activated",
  );
  await expect(page.locator("[data-pwa-update]")).toBeHidden();

  await page.locator('.desktop-navigation a[href="/learn"]').click();

  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.locator("[data-pwa-update]")).toBeHidden();
  expect(documentNavigations).toBe(1);

  const pendingWorkerUrl = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register(
      "/sw.js?pending-worker-test=1",
    );
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("The updated worker did not start waiting")),
        5000,
      );
      const checkWaitingWorker = () => {
        if (registration.waiting === null) {
          return;
        }
        clearTimeout(timeout);
        resolve();
      };
      registration.addEventListener("updatefound", () => {
        registration.installing?.addEventListener(
          "statechange",
          checkWaitingWorker,
        );
      });
      registration.installing?.addEventListener(
        "statechange",
        checkWaitingWorker,
      );
      checkWaitingWorker();
    });
    return registration.waiting?.scriptURL;
  });

  expect(pendingWorkerUrl).toContain("pending-worker-test=1");
  await expect(page.locator("[data-pwa-update]")).toBeVisible();
  expect(documentNavigations).toBe(1);

  await page.locator("[data-pwa-apply]").click();
  await expect.poll(() => documentNavigations).toBe(2);
  await expect(page.locator("[data-pwa-update]")).toBeHidden();
  await page.waitForTimeout(250);
  expect(documentNavigations).toBe(2);
});

test("serves the localized offline fallback after the worker controls the page", async ({
  context,
  page,
}) => {
  let completedHomeNavigations = 0;
  page.on("requestfinished", (request) => {
    if (
      request.isNavigationRequest() &&
      new URL(request.url()).pathname === "/"
    ) {
      completedHomeNavigations += 1;
    }
  });
  await context.addInitScript(() => {
    localStorage.setItem("valyrian-locale", "es");
  });
  await page.goto("/");
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.ready;
    return (
      registration.active?.state === "activated" &&
      navigator.serviceWorker.controller?.state === "activated" &&
      document.documentElement.lang === "es" &&
      document
        .querySelector('[data-locale="es"]')
        ?.getAttribute("aria-pressed") === "true"
    );
  });
  await expect.poll(() => completedHomeNavigations).toBe(1);
  await page.waitForLoadState("load");
  await page.reload();
  await page.waitForFunction(async () => {
    const cacheName = (await caches.keys()).find((name) =>
      name.includes(":pages"),
    );
    if (typeof cacheName !== "string") {
      return false;
    }
    const response = await caches
      .open(cacheName)
      .then((cache) => cache.match(location.href));
    if (!response?.ok) {
      return false;
    }
    return (
      response.headers.get("content-language") === "en" &&
      (await response.text()).includes('"locale":"en"')
    );
  });
  const localizedHeading = await page.locator("main h1").first().textContent();
  const serverPid = Number(readFileSync("tmp/playwright-server.pid", "utf8"));
  expect(Number.isSafeInteger(serverPid) && serverPid > 0).toBe(true);
  process.kill(serverPid, "SIGTERM");
  await expect.poll(serverIsClosed).toBe(true);
  await context.setOffline(true);
  await expect.poll(() => page.evaluate(() => navigator.onLine)).toBe(false);
  try {
    await page.goto("/");
    await expect(page.locator("main h1").first()).toHaveText(localizedHeading);
    await expect
      .poll(() =>
        page
          .locator("#initial-state")
          .evaluate((element) => element.textContent),
      )
      .toContain('"locale":"en"');
    await page.goto("/offline-check");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("main")).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
