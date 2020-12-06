let Section = require("../../../components/Section");
let Layout = require("../layout");

module.exports = () => (
  <Layout title="Router plugin">
    <Section title="Router plugin" />
    <Section title="Install">
      This plugin is available with the main valyrian.js package, so, you only need to add it with the
      <code>v.usePlugin()</code> method.
      {code(`
require('valyrian.js');
let Router = require('valyrian.js/plugins/router');

v.usePlugin(Router);
            `)}
    </Section>
    <Section title="Features">
      <ul>
        <li>
          Default returned Components. <small>The router will mount the first returned Component.</small>
        </li>
        <li>
          Parametrized routes. <small>You can use express like named parameters.</small>
        </li>
        <li>"Use" middlewares.</li>
        <li>Arrays of middlewares.</li>
        <li>Mix single middlewares and array of middlewares.</li>
        <li>Use of subrouters.</li>
        <li>Server side rendering</li>
      </ul>
    </Section>

    <Section title="Use">
      {code(`
require('valyrian.js');
let Router = require('valyrian.js/plugins/router.js');

v.usePlugin(Router);

let Store = {world: 'world', up: 'up'};
let Component = () => <div>Hello {Store.world}, what's {Store.up}</div>;
let NotFoundComponent = () => <div>Ups, no route was found.</div>;

// Create a router
let router = v.Router();
router
    // Use middlewares available for all routes
    .use(() => console.log('Hello world'))

    // Default component to mount
    .get('/', () => Component)

    .get('/hello/:world/whats/:up', [
        (params) => {
            // Set the params to the store or to the component
            Store.world = params.world;
            Store.up = params.up;
        },
        () => Component
    ])

    // Mix single and array of middlewares
    .get('/mixed',
        () => console.log('Middleware 1'),
        [
            () => console.log('Middleware 1.1'),
            () => console.log('Middleware 1.2'),
            [
                () => console.log('Middleware 1.2.1'),
                () => console.log('Middleware 1.2.2')
            ]
        ],
        () => console.log('Middleware 2'),
        // This is the final response
        () => Component
    )

    // If the router got to this point then show the not found component
    .use(() => NotFoundComponent);

// Assign routes to Valyrian.js
v.routes('body', router);
            `)}
    </Section>

    <Section title="Subrouters">
      {code(`
require('valyrian.js');
let Router = require('valyrian.js/plugins/router.js');

v.usePlugin(Router);

let Store = {world: 'world', country: 'México'};
let Component = () => <div>Hello {Store.world}, from {Store.country}</div>;
let NotFoundComponent = () => <div>Ups, no route was found.</div>;

// Create a sub router
let subrouter = v.Router();
subrouter
    .use(() => console.log('Sub router "Use" middleware'))
    .get('/from/:country', [
        (params) => {
            // Set the params to the store or to the component
            Store.world = params.world;
            Store.country = params.country;
        },
        () => Component
    ]);

// Create a router
let router = v.Router();
router
    // Use middlewares available for all routes
    .use(() => console.log('Hello world'))
    // Use the subrouter with this url prefix
    .use('/hello/:world', subrouter)
    .use(() => NotFoundComponent);

// Assign routes to Valyrian.js
v.routes('body', router);
            `)}
    </Section>

    <Section title="Server side rendering">
      Assume this client side app
      {code(`
// client.js
require('valyrian.js');
let Router = require('valyrian.js/plugins/router.js');
v.usePlugin(Router);

let Component = () => <div>Hello world</div>;
let router = v.Router();
router
    .get('/', () => Component)
    .get('/hello/:world/whats/:up', () => Component);
        `)}
      Create entry point for server side requiring Valyrian.js register hook
      {code(`
// index.js - server side entry point

// Register Valyrian.js in fly transpilation
require('valyrian.js/register');

// Require server file
require('./server.js');
    `)}
      Implement SSR with Express
      {code(`
// server.js with Express
// Init express
let app = require('express')();

// Require valyrian and main app
require('./client.js');
let nodePlugin = require('valyrian.js/plugins/node');
v.usePlugin(nodePlugin);

// Create the container component 
// We can have jsx in here thanks to the Valyrian.js register hook
let HtmlComponent = (null, ...children) => [
  '<!DOCTYPE html>',
  <html lang="en">
    <body>{children}</body>
  </html>
];

// Add Valyrian routes
v.routes.get().forEach((path) =>
  app.get(path, (req, res) => v.routes.go(HtmlComponent, req.url).then(res.send))
);

// Init the server
app.listen(3000);
        `)}
      Implement SSR with Micro
      {code(`
// server.js with Micro

// Require micro and micro-ex-router
let micro = require('micro');
let Router = require('micro-ex-router');

// Create a new router
let router = Router();

// Require valyrian and main app
require('./client.js');
let nodePlugin = require('valyrian.js/plugins/node');
v.usePlugin(nodePlugin);

// Create the container component 
// We can have jsx in here thanks to the Valyrian.js register hook
let HtmlComponent = (null, ...children) => [
  '<!DOCTYPE html>',
  <html lang="en">
    <body>{children}</body>
  </html>
];

// Add Valyrian routes
v.routes.get().forEach((path) => router.get(path, (req) => v.routes.go(HtmlComponent, req.url)));

// Init the server
micro(router).listen(3000);
        `)}
      <small class="bg-warning-lightest">
        You will need to use the <a v-route="/get-started/plugins/node-plugin">Node plugin</a> for SSR to work, and <a v-route="/get-started/server-side-jsx">Valyrian.js register hook</a> for server side jsx and client
        code use.
      </small>
    </Section>
  </Layout>
);
