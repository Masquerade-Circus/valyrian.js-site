import Layout from './layout';

export default () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>Lifecycle methods</h1>
      </header>
      <section>
        Virtual dom nodes can have the next lyfecycle methods:
        <ul>
          <li>oninit</li>
          <li>oncreate</li>
          <li>onupdate</li>
          <li>onremove</li>
        </ul>
        {code(`
// Stateless component
let Component = (props, world) => <div {...props}>Hello {world}</div>;

let lifecycle = {
    oninit(vnode){
        // Initialized 
        // vnode.dom is undefined
    },
    oncreate(vnode){
        // Created 
        // Now you can access to the dom element through vnode.dom property
    },
    onupdate(newNode, oldNode){
        // Updated 
        // In Valyrian.js you can not skip the update phase
        // So this is just to know what have changed
    },
    onremove(vnode){
        // Removed 
        // This is your last change to access to the dom element through vnode.dom property
    }
};

v(Component, lifecycle, 'World');
// Or 
<Component {...lifecycle}> World </Component>
                `)}
      </section>
    </div>
  </Layout>
);
