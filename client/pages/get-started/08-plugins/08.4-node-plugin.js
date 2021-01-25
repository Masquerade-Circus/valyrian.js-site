let Section = require("../../../components/Section");
let Layout = require("../layout");

module.exports = () => (
  <Layout title="Node plugin">
    <Section title="Node plugin" />
    <Section title="Install">
      This plugin is available with the main valyrian.js package, so, you only need to add it with the <code>v.usePlugin()</code> method.
      {code(`
require('valyrian.js');
let NodePlugin = require('valyrian.js/plugins/node');

v.usePlugin(NodePlugin);
            `)}
      This plugin provides what is necessary to work on the server side without having to change the client code. As well as the tools for the inclusion of minified JS / CSS in HTML and the generation of the required
      files for a PWA.
    </Section>
    <Section title="Inline css and js">
      To improve PWA's performance, Valyrian.js provides a method to transpile, minimize and embed the client code in the server's HTML response.
      <br />
      <br />
      Assume this client side app
      {code(`
// client.js
require('valyrian.js');
let Router = require('valyrian.js/plugins/router.js');
v.usePlugin(Router);

let Component = () => <div>Hello world</div>;
let router = v.Router();
router.get('/', () => Component);

// Main container component
let HtmlComponent = (null, ...children) => [
  '<!DOCTYPE html>',
  <html lang="en">
    <head>
      <title>My awesome app</title>
      {v.inline.css().map(({raw, map}) => <style>{raw}{map}</style>)}
    </head>
    <body>
      {children}
      {v.inline.js().map(({raw, map}) => <script>{raw}{map}</script>)}
    </body>
  </html>
];

// Export main container component
module.exports = HtmlComponent;
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

// Require express
let express = require('express');

// Require valyrian and main html container
let HtmlComponent = require('./client.js');
let nodePlugin = require('valyrian.js/plugins/node');
v.usePlugin(nodePlugin);

// We make this an async function because top level await is still an experimental function in nodejs
let init = async () => {
  // Init express
  let app = express();

  // Compile and minimize client.js and bootstrap.css
  await v.inline('./client.js', './some-awesome.css');
  // Same as call await v.inline.js('./client.js') && await v.inline.css('./some-awesome.css');

  // Add home route
  app.get('/', (req, res) => v.routes.go(HtmlComponent, '/').then(res.send))

  // Init the server
  app.listen(3000);
});

init();
        `)}
      The result to call our home route in the browser will be:
      {code(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My awesome app</title>
    <style>
      // inline minified some awesome css minimized
      // some awesome css source map
    </style>
  </head>
  <body>
    <div>Hello world</div>
    <script>
      // Inline, bundled as iife, client js code
      // client js source map
    </script>
  </body>
</html>
        `)}
      <h2>
        <code>v.inline</code> method
      </h2>
      The inline method takes any number of arguments and will perform the next steps:
      <ol>
        <li>For each passed file path</li>
        <li>It will extract the extension of that passed file path</li>
        <li>If the inline method does not have a convenience method for this extension it will create it. (inlining a `txt` file will create a `v.inline.txt` getter/setter method)</li>
        <li>Then it will pass the file path to this method to get its contents</li>
        <li>The method will push the contents to an array to be used as the store for this extension</li>
      </ol>
      Take into account that the convenience method will be a getter setter. The setter method will always return a promise. The getter method will always return an array of the parsed files.
      <br />
      If you pass a file path it will get the contents of that file.
      <br />
      If you does not pass a file, then, it will return the contents of the stored files.
      <br />
      <br />
      At the start the inline method will only have the <code>v.inline.js</code> and the <code>v.inline.css</code> methods.Will also have an <code>v.inline.uncss</code> method whose implementation is different from the
      previous ones, keep reading to know more about this method.
      <h2>
        <code>v.inline.js</code> method
      </h2>
      The <code>v.inline.js</code> inline method not only will get the contents of the file, but also compile and minimize the code by passing it to a customized
      <a href="https://rollupjs.org/" title="Rollup" target="_blank">
        Rollup
      </a>{" "}
      configuration. The result will be an object like:
      {code(`
{
  raw, // Bundled and minimized code
  map, // Generated source map for this code
  file // The name of the entry file
}        
      `)}
      This will allow us to embed the client side source code directly in the html response without the need of a transpilation/build step and reduce the need of a js file request for the client. Also, this method will
      receive an options object as a second parameter that will be passed to rollup.
      <br />
      <br />
      This object must have the next shape:
      {code(`
{
  inputOptions: {
    // Some custom options
  },
  outputOptions: {
    // Some output options
  }
}
      `)}
      <h2>
        <code>v.inline.css</code> method
      </h2>
      The <code>v.inline.css</code> inline method not only will get the contents of the file, but also will minify the css by passing it to a default instance of the{" "}
      <a href="https://github.com/jakubpawlowicz/clean-css" target="_blank">
        CleanCSS
      </a>{" "}
      optimizer. The result will be an object like:
      {code(`
{
  raw, // Minimized styles
  map: null,
  file // The name of the entry file
}   
      `)}
      Similar to the <code>v.inline.js</code>, this method will receive an options object as a second parameter that will be passed directly to CleanCSS.
      <h2>
        <code>v.inline.uncss</code> method
      </h2>
      Although the styles getted by the <code>v.inline.css</code> method will be minified, the result will be the whole styles, no matter if the styles are used or not by the site. This minimized styles allow us to
      develop faster, but for production we recommend to include only the styles that will be used by the site. For this task we have the <code>v.inline.uncss</code> method which works different from the other
      convenience methods.
      <br />
      <br />
      You will need to use the <code>v.inline.css</code> method first for this to work. After minimize some css files with the <code>v.inline.css</code> method you can pass a set of html strings to the{" "}
      <code>v.inline.uncss</code> method to get only the used css styles.
      <br />
      <br />
      Example:
      <br />
      <br />
      Given this css file:
      {code(`
// style.css file
span{display:block;}
span.hello{display: inline-block}
      `)}
      {code(`
// js file
let html = "<body><span>Hello world</span></body>";

await v.inline.css('./style.css');
let cleanCss = await v.inline.uncss([html]); // -> "span{display:block}"
      `)}
      This method will use{" "}
      <a href="https://purgecss.com/" target="_blank">
        PurgeCSS
      </a>{" "}
      to do this cleaning of styles, and can also receive an options object as a second parameter that will be passed directly to the <code>PurgeCSS.purge</code> method.
    </Section>
    <Section title="Service worker generation" />
    <Section title="Icons and manifest.json generation" />
  </Layout>
);
