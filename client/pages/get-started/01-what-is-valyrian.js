import Layout from "./layout";
import Section from "../../components/Section";

export default () => (
  <Layout title="What is Valyrian.js">
    <Section title="What is Valyrian.js">
      Valyrian.js is a progressive javascript framework whose sole purpose is to be lighter (2kb Base / 3.5kb Base+Router+XHR) but powerful enough to build production ready Progressive Web App's.
    </Section>

    <Section title="Core principles">
      <ul>
        <li>Isomorphic: write code once for server and client. (Although browser specific events will not work on node).</li>
        <li>Give the developer tools to generate all that its needed to build a Progressive Web App (SSR, icons, splash screens, manifest.json, service workers, etc).</li>
        <li>The average developer must be able to learn the api and start building a PWA's in less than an hour.</li>
      </ul>
    </Section>

    <Section title="Hello world example">
      {code(`
const Component = () => v('h1', null, 'Hello world';
// Or with jsx
const Component = () => <h1>Hello world</h1>;

v.mount('body', Component);
            `)}
      <samp>
        <h1>hello world</h1>
      </samp>
    </Section>
  </Layout>
);
