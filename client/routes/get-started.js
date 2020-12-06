let Pages = require("../pages");

// Create a router
let router = v.Router();
router
  .get("/", () => Pages.GetStarted.WhatIsValyrian)
  .get("/installation", () => Pages.GetStarted.Installation)
  .get("/hyperscript", () => Pages.GetStarted.Hyperscript)
  .get("/components", () => Pages.GetStarted.Components)
  .get("/lifecycle-methods", () => Pages.GetStarted.LifecycleMethods)
  .get("/directives/built-in-directives", () => Pages.GetStarted.Directives.BuiltInDirectives)
  .get("/directives/v-model", () => Pages.GetStarted.Directives.VModel)
  .get("/directives/custom-directives", () => Pages.GetStarted.Directives.CustomDirectives)
  .get("/plugins/plugin-system", () => Pages.GetStarted.Plugins.PluginSystem)
  .get("/plugins/router-plugin", () => Pages.GetStarted.Plugins.RouterPlugin)
  .get("/plugins/request-plugin", () => Pages.GetStarted.Plugins.RequestPlugin)
  .get("/plugins/service-worker-plugin", () => Pages.GetStarted.Plugins.ServiceWorkerPlugin)
  .get("/plugins/nodejs-plugin", () => Pages.GetStarted.Plugins.NodePlugin)
  .get("/plugins/store-plugin", () => Pages.GetStarted.Plugins.StorePlugin)
  .get("/plugins/hooks-plugin", () => Pages.GetStarted.Plugins.HooksPlugin)
  .get("/plugins/signals-plugin", () => Pages.GetStarted.Plugins.SignalsPlugin)
  .get("/server-side-jsx", () => Pages.GetStarted.ServerSideJsx);

module.exports = router;
