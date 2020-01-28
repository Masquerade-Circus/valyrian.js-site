import Layout from './layout';

export default () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>Installation</h1>
      </header>
      <section>
        <h2>To use it Standalone in the Browser</h2>
        {code('<script src="https://cdn.jsdelivr.net/npm/valyrian.js"></script>')}
        <hr />
        <h2>To use it with Rollup or Webpack</h2>
        Install with npm or yarn
        {code(`
npm i valyrian.js
//or 
yarn add valyrian.js
            `)}
        Then:
        {code(`
import 'valyrian.js';
// or
require('valyrian.js');
            `)}
        <hr />
        <h2>Globals</h2>
        Valyrian.js is intended to be used in both sides, backend and frontend. So, its core is implemented such way
        that it will be available globally through window.v or global.v.
      </section>
    </div>
  </Layout>
);
