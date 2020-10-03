import Section from "../../components/Section";
import Layout from "./layout";

export default () => (
  <Layout title="Plugins">
    <Section title="Plugins">Valyrian.js comes with a very simple but very powerfull plugin system. You can extend its core functionality or change it completely by the use of plugins.</Section>
    <Section title="Using plugins">
      You can use any Valyrian.js plugin by passing it to the <code>v.usePlugin()</code> method.
      {code(`v.usePlugin(MyPlugin, options);`)}
    </Section>
    <Section title="Creating plugins">
      A Valyrian.js plugin is a module that exports a single function that will be called with the v constructor and with an optional options object if any.
      {code(`
const Plugin = (v, options) => {
    v.myPluginMethod = function(){
        // Some awesome code
    };
};

export default Plugin;
            `)}
    </Section>
  </Layout>
);
