import Layout from './layout';

export default () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>Plugins</h1>
      </header>
      <section>
        Valyrian.js comes with a very simple but very powerfull plugin system.
        <br />
        You can extend its core functionality or change it completly by making use of plugins.
        <hr />
        <h2>Using plugins</h2>
        You can use any Valyrian.js plugin by passing it to the <code>v.usePlugin()</code> method.
        {code(`v.usePlugin(MyPlugin, options);`)}
        <hr />
        <h2>Creating plugins</h2>A Valyrian.js plugin is a module that exports a single function that will be called
        with the v constructor and with an optional options object if any.
        {code(`
const Plugin = (v, options) => {
    v.myPluginMethod = function(){
        // Some awesome code
    };
};

export default Plugin;
            `)}
      </section>
    </div>
  </Layout>
);
