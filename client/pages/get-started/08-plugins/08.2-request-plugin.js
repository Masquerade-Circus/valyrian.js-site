let Section = require("../../../components/Section");
let Layout = require("../layout");

module.exports = () => (
  <Layout title="Request plugin">
    <Section title="Request plugin" />
    <Section title="Install">
      This plugin is available with the main valyrian.js package, so, you only need to add it with the
      <code>v.usePlugin()</code> method.
      {code(`
require('valyrian.js');
let Request = require('valyrian.js/plugins/request');

v.usePlugin(Request);
            `)}
    </Section>
    <Section title="Features">
      The Request plugin is a helper built on top of the <code>fetch api</code>. And it helps with the following:
      <br />
      <ul>
        <li>
          Adds default headers to <code>Accept application/json</code>.
        </li>
        <li>
          Adds convenience methods to perform <code>get, post, put, patch, delete</code> requests.
        </li>
        <li>Automatically stringify/serialize payload when sending data.</li>
        <li>Automatically throws an error when the response code is an error.</li>
        <li>Scope a request with a base url to ease the api url handling.</li>
        <li>Add a node url to ease server side rendering.</li>
        <li>Automatically updates the view when the request has finished.</li>
      </ul>
    </Section>
    <Section title="Use cases">
      <h3>Simple request</h3>
      {code(`
// v.request(method, url, data, options)
v.request('get', 'http://example.com', {hello: 'world'}, {})
    .then(console.log)
    .catch(console.log);
            `)}
      This will perform a request to <code>http://example.com?hello=world</code> with Accept headers set to application/json. Therefore, the response will be converted to a json object if any. You can overide any
      previous options passing an object with your custom fetch options.
      <hr />
      <h3>Convenience methods</h3>
      You can make use of the convenience methods to perform the request. The default request helper will handle the
      <code>get, post, put, patch, delete</code> methods.
      {code(`
// v.request.get(url, data, options)
v.request.get('http://example.com', {hello: 'world'}, {})
    .then(console.log)
    .catch(console.log);
            `)}
      <hr />
      <h3>Scoped request</h3>
      You can create another request helper function by calling the <code>new</code> method of the base request helper. Additionally you can create more request helpers based on a previous created helper inheriting its
      options like baseUrl and default request options.
      {code(`
// v.request.new(baseUrl, defaultOptions);
let request = v.request.new('http://example.com', {});
request.get('/hello', {hello: 'world'}, {})
    .then(console.log)
    .catch(console.log);
            `)}
      This will create a request helper pointing to <code>http://example.com</code>. So, the instruction will perform a request to <code>http://example.com/hello?hello=world</code>.
      <hr />
      <h3>Allowed methods</h3>
      You can create method scoped request helpers by passing an array with the <code>methods</code> option.
      {code(`
// v.request.new(baseUrl, defaultOptions);
let request = v.request.new('http://example.com', {methods: ['post']});
request.post('/hello', {hello: 'world'}, {})
    .then(console.log)
    .catch(console.log);
            `)}
      This will create a request helper with only the <code>post</code> method allowed, so you can safely use this helper without worrying about a wrong use of other methods.
      <hr />
      <h3>For server side rendering</h3>
      You can pass within the options object or set manually the urls to handle the requests for server side rendering.
      {code(`
v.request.options('urls.node','http://localhost:3000');
v.request.options('urls.api','http://example.com/api');
            `)}
      This will redirect all local requests to <code>http://localhost:3000</code>. For most of the use cases this will be enough, but for the case where you only use full external urls, you can use the api option to
      convert this urls to the node version.
      {code(`
v.request.get('/hello') // http://localhost:3000/hello
v.request.get('http://example.com/api/hello') // http://localhost:3000/hello
            `)}
      <small class="bg-warning-lightest">
        You will need to use the <a v-route="/get-started/plugins/node-plugin">Node plugin</a> for SSR to work.
      </small>
    </Section>
  </Layout>
);
