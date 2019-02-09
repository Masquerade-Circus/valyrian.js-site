import Layout from './layout';

export default () => (
  <Layout>
    <div data-card="full-width">
      <section>
        <h2>What is Valyrian.js?</h2>
        Valyrian.js is a progressive javascript framework whose sole prupouse is to be lighter (1.6kb Base / 3kb
        Base+Router+XHR) but powerful enough to build production ready Progressive Web App's.
        <br />
        <br />
        <h2>Core principles</h2>
        <ul>
          <li>
            Isomorphic: write code once for server and client. (Although browser specific events will not work on node).
          </li>
          <li>
            Give the developer tools to generate all that its needed to build a Progressive Web App, SSR, icons, splash
            screens, manifest.json, service workers, etc.
          </li>
          <li>The average developer must be able to learn the api and start building a PWA's in less than an hour.</li>
        </ul>
        <br />
        <h2>Hello world</h2>
        {code(`
const Component = () => v('h1', null, 'Hello world');
// Or with jsx
const Component = () => <h1>Hello world</h1>;

v.mount('body', Component);
            `)}
      </section>
    </div>
  </Layout>
);
