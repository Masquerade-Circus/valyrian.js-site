import Section from "../../../components/Section";
import Layout from "../layout";

export default () => (
  <Layout title="Router plugin">
    <Section title="Router plugin" />
    <Section title="Install">
      This plugin is available with the main valyrian.js package, so, you only need to add it with the
      <code>v.usePlugin()</code> method.
      {code(`
import 'valyrian.js';
import Router from 'valyrian.js/plugins/router';

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
import 'valyrian.js';
import Router from 'valyrian.js/plugins/router.js';

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
import 'valyrian.js';
import Router from 'valyrian.js/plugins/router.js';

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
import 'valyrian.js';
import Router from 'valyrian.js/plugins/router.js';
v.usePlugin(Router);

let Component = () => <div>Hello world</div>;
let router = v.Router();
router
    .get('/', () => Component)
    .get('/hello/:world/whats/:up', () => Component);
        `)}
      Implement SSR with Express
      {code(`
// server.js with Express
let express = require('express');
let app = express();

// Require valyrian and main app
require('./client.js');
let nodePlugin = require('valyrian.js/plugins/node');
v.usePlugin(nodePlugin);

// Create the container component 
// We don't have jsx in here so we do it the hyperscript way
let HtmlComponent = (null, ...children) => ['<!DOCTYPE html>', v('html', null, v('body', null, children))];

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
let micro = require('micro');
let Router = require('micro-ex-router');

// Create a new router
let router = Router();

// Require valyrian and main app
require('./client.js');
let nodePlugin = require('valyrian.js/plugins/node');
v.usePlugin(nodePlugin);

// Create the container component 
// We don't have jsx in here so we do it the hyperscript way
let HtmlComponent = (null, ...children) => ['<!DOCTYPE html>', v('html', null, v('body', null, children))];

// Add Valyrian routes
v.routes.get().forEach((path) =>
  router.get(path, (req) => v.routes.go(HtmlComponent, req.url))
);

// Init the server
micro(router).listen(3000);
        `)}
      <small class="bg-warning-lightest">
        You will need to use the <a v-route="/get-started/node-plugin">Node plugin</a> for SSR to work.
      </small>
    </Section>
  </Layout>
);
