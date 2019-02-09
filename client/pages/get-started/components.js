import Layout from './layout';

export default () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>Components</h1>
      </header>
      <section>
        Valyrian.js can handle multiple types of components to suit the needs of different implementations.
        <hr />
        <h2>POJO components</h2>
        {code(`
let Component = {
    world: 'World',
    id: 'example',
    view() {
        return <div id={Component.id}>Hello {Component.world}</div>;
    }
};

v(Component);
// Or 
<Component/>
                `)}
        {code('<div id="example">Hello World</div>')}
        <hr />
        <h2>Functional components</h2>
        <hr />
        <h3>Stateful components</h3>
        {code(`
let Component = function() { return <div id={this.id}>Hello {this.world}</div>;};
let state = {
    world: 'World',
    id: 'example'
};
v.addState(Component, state);

v(Component);
// Or 
<Component/>
                `)}
        {code('<div id="example">Hello World</div>')}
        <hr />
        <h3>Stateless components</h3>
        {code(`
let Component = (props, world) => <div id={props.id}>Hello {world}</div>;

v(Component, {id:'example'}, 'World');
// Or 
<Component id="example">World</Component>
                `)}
        {code('<div id="example">Hello World</div>')}
      </section>
    </div>
  </Layout>
);
