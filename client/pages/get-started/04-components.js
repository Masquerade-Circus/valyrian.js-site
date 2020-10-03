import Section from "../../components/Section";
import Layout from "./layout";

export default () => (
  <Layout title="Components">
    <Section title="Components">Valyrian.js can handle multiple types of components to suit the needs of different implementations.</Section>

    <Section title="POJO components">
      {code(`
let Component = {
    world: 'World',
    id: 'example',
    view() {
        return <div id={this.id}>Hello {this.world}</div>;
    }
};

v(Component);
// Or 
<Component/>
                `)}
      {code('<div id="example">Hello World</div>')}
      <samp>
        <div id="example">Hello World</div>
      </samp>
    </Section>

    <Section title="Functional components">
      <h3>Stateful components</h3>
      {code(`
let Component = function() { return <div id={this.id}>Hello {this.world}</div>;};
Component.world ='World';
Component.id = 'example';

v(Component);
// Or 
<Component/>
                `)}
      {code('<div id="example">Hello World</div>')}
      <samp>
        <div id="example">Hello World</div>
      </samp>
      <hr />
      <h3>Stateless components</h3>
      {code(`
let Component = (props, world) => <div id={props.id}>Hello {world}</div>;

v(Component, {id:'example'}, 'World');
// Or 
<Component id="example">World</Component>
                `)}
      {code('<div id="example">Hello World</div>')}
      <samp>
        <div id="example">Hello World</div>
      </samp>
    </Section>
  </Layout>
);
