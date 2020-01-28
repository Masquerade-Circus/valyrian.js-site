let micro = require('micro');
let Router = require('micro-ex-router');
let cors = require('cors');
let compression = require('compression');
let App = require('../public/index.min');
let nodePlugin = require('valyrian.js/plugins/node');
import app from '../public/index.min';

console.log(app);

v.usePlugin(nodePlugin);
v.request.nodeUrl = 'http://localhost:3000';

// Create a new router
let router = Router();

// Add public routes
router
  .use((req, res) => new Promise((next) => cors()(req, res, next)))
  .use((req, res) => new Promise((next) => compression()(req, res, next)))
  .use(Router.serveDir('./public'))
  .get('/favicon.ico', (req, res) => Router.serveFile(res, './public/icons/favicon.ico'));

// Add Valyrian routes
v.routes.get().forEach((path) =>
  router.get(
    path,
    Router.render(async (req) => '<!DOCTYPE html>' + (await v.routes.go(App.Pages.Main, req.url)), {
      'Cache-Control': 'public, max-age=2592000',
      Expires: new Date(Date.now() + 604800000).toUTCString()
    })
  )
);

router.use((req, res) => {
  res.statusCode = 404;
  res.end('Not found');
});

v.inline('./node_modules/prismjs/themes/prism.css');

// // Inline styles and javascript
// let renderedHtml = v.routes().map(path => v.routes.go(path, App.Pages.Main));
// v.inline(
//     './node_modules/valyrian.js/dist/valyrian.min.js',
//     './dist/index.min.js',
//     'https://masquerade-circus.github.io/pure-material-css/css/pure-material.css',
//     './public/main.css'
// )
//     .then(() => v.inline.uncss(renderedHtml, {
//         ignore: [/^\.slide/, /drawer/gi, /open/gi],
//         minify: false
//     }));

// router.get('/index.min.js', (req, res) => {
//     let js = v.inline.js();
//     res.writeHead(200, {
//         'Content-Type': "application/javascript",
//         'Content-Length': js.length,
//         'Cache-Control': 'public, no-cache, no-store, must-revalidate',
//         'Expires': '0',
//         'Pragma': 'no-cache'
//     });

//     res.end(js);
// });

// Init micro server
micro(router).listen(3000, async () => {
  process.stdout.write('Micro listening on port 3000\n');
});
