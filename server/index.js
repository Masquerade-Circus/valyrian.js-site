let config = require('./config');
let micro = require('micro');
let Router = require('micro-ex-router');
let Helper = require('./helpers');
let cors = require('cors');
let compression = require('compression');

// Create a new router
let router = Router();

// Add public routes
router
    .use((req, res) => new Promise(next => cors()(req, res, next)))
    .use((req, res) => new Promise(next => compression()(req, res, next)))
    .use(Helper.serveDir('./public'))
;

// Require valyrian and main app
require('valyrian.js');
let App = require('../dist/index.min.js');

// Add Valyrian routes
v.routes()
    .forEach(path => router.get(
        path,
        Helper.render(
            async (req) => '<!DOCTYPE html>' + await v.routes.go(req.url, App.Pages.Main),
            {
                'Cache-Control': 'public, max-age=2592000',
                'Expires': new Date(Date.now() + 604800000).toUTCString()
            }
        )
    ));

// Set the internal nodejs url
v.request.nodeUrl = 'http://localhost:3000';

// Inline styles and javascript
let renderedHtml = v.routes().map(path => v.routes.go(path, App.Pages.Main));
v.inline(
    './node_modules/valyrian.js/dist/valyrian.min.js',
    './dist/index.min.js',
    'https://masquerade-circus.github.io/pure-material-css/css/pure-material.css',
    './public/main.css'
)
    .then(() => v.inline.uncss(renderedHtml));

router.get('/index.min.js', (req, res) => {
    console.log('ok');
    let js = v.inline.js();
    res.writeHead(200, {
        'Content-Type': config.mimeTypes.js,
        'Content-Length': js.length,
        'Cache-Control': 'public, no-cache, no-store, must-revalidate',
        'Expires': '0',
        'Pragma': 'no-cache'
    });

    res.end(js);
});

// Init micro server
micro(router).listen(3000, async () => {
    process.stdout.write('Micro listening on port 3000\n');
});


