import Section from "../../components/Section";
import Layout from "./layout";

export default () => (
  <Layout title="Service worker plugin">
    <Section title="Service worker plugin" />
    <Section title="Install">
      This plugin is available with the main valyrian.js package, so, you only need to add it with the
      <code>v.usePlugin()</code> method.
      {code(`
import 'valyrian.js';
import Sw from 'valyrian.js/plugins/sw.js';

v.usePlugin(Sw);
            `)}
    </Section>

    <Section title="Use">
      The service worker plugin is a helper plugin that just adds a convenience method to register a service worker.
      <br />
      If it's called without any params, it defaults to register <code>./sw.js</code> file with
      <code>{"{scope: '/'}"}</code> options passed to the navigator.serviceWorker.register method.
      <br />
      It returns a Promise that resolves with the service worker object.
      {code(`
// v.sw(file = './sw.js', options = {scope: '/'})
if (!v.isNode){
    v.sw()
        .then(console.log)
        .catch(console.log);
}
            `)}
      <small class="bg-warning-lightest">If you use server-side renderign remember to first validate that you are in a browser environment before call this method.</small>
    </Section>
  </Layout>
);
