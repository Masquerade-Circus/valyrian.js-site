let fs = require('fs');
let micro = require('micro');
let Router = require('micro-ex-router');
let Helper = require('./helpers');
let cors = require('cors');
let compression = require('compression');

// Require valyrian and main app
require('valyrian.js');
let App = require('../dist/index.min.js');

let v = global.v;

// Set the internal nodejs url
v.request.nodeUrl = 'http://localhost:3001';

// Inline styles and javascript
v.inline.js('./node_modules/valyrian.js/dist/valyrian.min.js');
v.inline.js('./dist/index.min.js');
v.inline.css('https://masquerade-circus.github.io/pure-material-css/css/pure-material.css')
    .then(() => v.inline.css('./public/main.css'))
    .then(() => {
        let renderedHtml = v.routes().map(path => v.routes.go(path, App.Pages.Main));
        v.inline
            .uncss(renderedHtml)
            .then((css) => {
                App.Pages.Main.css = css;
                App.Pages.Main.js = v.inline.js();
            });
    });

// Set the title and version for the Main component
let packageJson = require('../package.json');
App.Pages.Main.title = 'Valyrian.js';
App.Pages.Main.version = packageJson.version;
App.Pages.Main.description = packageJson.description;
App.Pages.Main.css = v.inline.css();


// Create a new router
let router = Router();

// Add public routes
router
    .use((req, res) => new Promise(next => cors()(req, res, next)))
    .use((req, res) => new Promise(next => compression()(req, res, next)))
    .use(Helper.serveDir('./dist'))
    .use(Helper.serveDir('./public'))
;

// Add Valyrian routes
v.routes()
    .forEach(path => router.get(
        path,
        async (req, res) =>
            '<!DOCTYPE html>' +
            await v.routes.go(req.url, App.Pages.Main)
    ));

// Init micro server
micro(router).listen(3000, async () => {
    process.stdout.write('Micro listening on port 3000\n');
});


