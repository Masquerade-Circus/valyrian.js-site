let micro = require('micro');
let Router = require('micro-ex-router');
let cors = require('cors');
let compression = require('compression');
let App = require('../public/index.min');
let nodePlugin = require('valyrian.js/plugins/node');

process.on('unhandledRejection', console.log);
process.on('uncaughtException', console.log);

const HtmlExpirationTime = 1 * 60 * 1000;

async function start() {
  let port = process.env.PORT || 3001;

  v.usePlugin(nodePlugin);
  v.request.nodeUrl = `http://localhost:${port}`;

  // Inline styles and javascript
  let renderedHtml = v.routes.get().map(path => v.routes.go(App.Pages.Main, path));
  await v.inline(
    './public/index.min.js',
    './node_modules/prismjs/themes/prism.css',
    './public/dragonglass.css',
    './public/main.css'
  );

  await v.inline.uncss(renderedHtml, {
    ignore: [/open/gi],
    minify: true
  });

  // Create a new router
  let router = Router();

  // Add public routes
  router
    .use((req, res) => new Promise((next) => cors()(req, res, next)))
    .use((req, res) => new Promise((next) => compression()(req, res, next)))
    .use(Router.serveDir('./public'));

  // Add Valyrian routes
  v.routes.get().forEach((path) =>
    router.get(
      path,
      Router.render(async (req) => await v.routes.go(App.Pages.Main, req.url), {
        'Cache-Control': 'no-cache',
        Expires: new Date(Date.now() + HtmlExpirationTime).toUTCString()
      })
    )
  );

  // If we get to this point throw a 404 not found error
  router.use((req, res) => {
    res.statusCode = 404;
    res.end('Not found');
  });

  // Init micro server
  micro(router).listen(port, () => process.stdout.write(`Micro listening on port ${port}\n`));
}

start();
