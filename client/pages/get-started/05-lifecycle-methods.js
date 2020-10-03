import Section from "../../components/Section";
import Layout from "./layout";

export default () => (
  <Layout title="Lifecycle methods">
    <Section title="Lifecycle methods">
      With Valyrian.js, components don't have lifecycle, just Virtual dom nodes have them. You can apply the next lyfecycle methods to the Virtual dom:
      <ul>
        <li>oncreate</li>
        <li>onbeforeupdate</li>
        <li>onupdate</li>
        <li>onremove</li>
      </ul>
      {code(`
// Stateless component
let Component = (props, world) => <div {...props}>Hello {world}</div>;

let lifecycle = {
  oncreate(newVnode) {
    // After dom element is created and attached to the document
    // You can access to the dom by the vnode.dom property
    console.log(vnode);
  },

  onbeforeupdate(newVnode, oldVnode) {
    // before dom element is updated
    // if you return false the update step is skipped
    console.log(newVnode, oldVnode);
  },

  onupdate(newVnode, oldVnode) {
    // after dom element is updated
    console.log(newVnode, oldVnode);
  },

  onremove(oldVnode) {
    // Before dom element is removed
    // This is the last chance to get the dom properties
    console.log(oldVnode)
  }
};

v(Component, lifecycle, 'World');
// Or 
<Component {...lifecycle}> World </Component>
                `)}
    </Section>
  </Layout>
);
