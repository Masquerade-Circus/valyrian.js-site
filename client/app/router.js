const { v } = require("valyrian.js");
const { Router } = require("valyrian.js/router");
const { t } = require("../i18n/index.js");
const { SiteApplication } = require("../pages/site.js");

function createRouter({
  initialState,
  loadRoute = null,
  response,
  runtime = null,
}) {
  const router = new Router();
  for (const path of initialState.routes) {
    router.add(path, async () => {
      if (typeof loadRoute === "function") {
        await loadRoute(path);
      }
      response.statusCode = 200;
      return v(SiteApplication, { runtime, state: initialState });
    });
  }

  router.add("/.*", () => {
    if (initialState.serverError === true) {
      return () => v(SiteApplication, { runtime, state: initialState });
    }
    response.statusCode = 404;
    initialState.title = t("routes.notFound");
    initialState.notFound = true;
    return () => v(SiteApplication, { runtime, state: initialState });
  });

  return router;
}

module.exports = { createRouter };
