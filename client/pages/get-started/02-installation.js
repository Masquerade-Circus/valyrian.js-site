import Section from "../../components/Section";
import Layout from "./layout";

export default () => (
  <Layout title="Installation">
    <Section title="Installation" />
    <Section title="Standalone in the browser">{code('<script src="https://cdn.jsdelivr.net/npm/valyrian.js"></script>')}</Section>
    <Section title="With Rollup or Webpack">
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
    </Section>
    <Section title="Globals">Valyrian.js is intended to be used in both sides, backend and frontend. So, its core is implemented such way that it will be available globally through window.v or global.v.</Section>
  </Layout>
);
