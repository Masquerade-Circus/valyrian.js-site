let micro = require("micro");
let Router = require("micro-ex-router");
let cors = require("cors");
let compression = require("compression");
let { default: App } = require("../client/index");
// let nodePlugin = require("valyrian.js/plugins/node");
let nodePlugin = require("../../valyrian.js/plugins/node");

process.on("unhandledRejection", console.log);
process.on("uncaughtException", console.log);

const DefaultExpirationTime = 1 * 60 * 1000; // 1 minute
const DefaultRefreshFileListTime = 1000 * 60 * 60 * 24; // 1 day

const DefaultHeaders = {
  any: {
    "Cache-Control": "public, no-cache, no-store, must-revalidate"
  }
};

async function start() {
  let port = process.env.PORT || 3001;

  // Configure nodejs plugin
  v.usePlugin(nodePlugin);
  v.request.nodeUrl = `http://localhost:${port}`;

  // Inline styles and javascript
  let renderedHtml = v.routes.get().map((path) => v.routes.go(path));
  await v.inline("./client/index.js", "./node_modules/prismjs/themes/prism.css", "./public/dragonglass.css", "./public/main.css");

  // Remove unnecessary css
  await v.inline.uncss(renderedHtml);

  // Create a new router
  let router = Router();

  // Add public routes
  router
    .use((req, res) => new Promise((next) => cors()(req, res, next)))
    .use((req, res) => new Promise((next) => compression()(req, res, next)))
    .use(Router.serveDir("./public", DefaultHeaders, DefaultRefreshFileListTime));

  // Add Valyrian routes
  v.routes.get().forEach((path) =>
    router.get(
      path,
      Router.render(async (req) => await v.routes.go(App.Pages.Main, req.url), {
        ...DefaultHeaders.any,
        Expires: new Date(Date.now() + DefaultExpirationTime).toUTCString()
      })
    )
  );

  // If we get to this point throw a 404 not found error
  router.use((req, res) => {
    res.statusCode = 404;
    res.end("Not found");
  });

  // Init micro server
  micro(router).listen(port, () => process.stdout.write(`Micro listening on port ${port}\n`));
}

start();
