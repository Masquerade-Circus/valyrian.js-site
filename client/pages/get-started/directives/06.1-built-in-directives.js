import Layout from '../layout';


let BuiltInDirectives = () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>Built in directives</h1>
      </header>
      <section>
    There are two types of directives in Valyrian.js, <code>Rendering</code> and <code>Reactive</code> directives.
        <br />As the most of events trigger a redraw of the view almost all of the directives listed in here are
    rendering directives.
    Only the <code>v-model</code> directive is reactive.
        <hr />

        <h2>Built in directives</h2>
        <h3>v-if</h3>
      Works as Vue's <code>v-if</code> directive or ember <code>if</code> helper.
      It renders a vnode if the referenced value is thruthy.
        {code(`
let value = true;
v.mount('body', () => <div><span v-if={value}>Hello world</span></div>); // -> <div><span>Hello world</span></div>
value = false; 
v.update(); // -> <div></div>
`)}
        <h3>v-unless</h3>
    Valyrian isn't template based so we can't handle a <code>v-else</code> like directive.
    Instead of <code>v-else</code> we will have a <code>v-unless</code> directive.
        <br />
    Works as ember <code>unless</code> helper. It renders a vnode if the referenced value is falsy.
        {code(`
let value = true;
v.mount('body', () => <div><span v-unless={value}>Hello world</span></div>); // -> <div></div>
value = false; 
v.update(); // ->  <div><span>Hello world</span></div>
`)}
        <h3>v-show</h3>
    Works as Vue's <code>v-show</code> directive. It renders a vnode and only changes it's display style value.
        {code(`
let value = true;
v.mount('body', () => <div><span v-show={value}>Hello world</span></div>); // -> <div><span>Hello world</span></div>
value = false; 
v.update(); // -> <div><span style="display: none;">Hello world</span></div>
`)}
        <h3>v-for</h3>
    v-for directive works like this:
        <ul>
          <li>On the element set the <code>v-for</code> directive to an array.</li>
          <li>Put a function as a child to process the elements of the array.</li>
        </ul>
    Think of it as a map function that returns a list of vnodes.
        {code(`
let items = ['autem', 'possimus', 'non', 'magnam'];
v.mount('body', () => <ul v-for={items}>{(word, i) => <li>{i} - {word}</li>}</ul>);
    `)}

        {code(`
<ul>
<li>0 - autem</li>
<li>1 - possimus</li>
<li>2 - non</li>
<li>3 - magnam</li>
</ul>
`)}
        <h3>v-class</h3>
        <code>v-class</code> directive receives a object with boolean attributes to toggle classes on the dom.
        {code(`
let classes = {
world: true
};
v.mount('body', () => <div class="hello" v-class={classes}></div>); // -> <div class="hello world"></div>

classes.world = false;
v.update(); // -> <div class="hello"></div>

classes.hello = false;
v.update(); // -> <div></div>

`)}
        <h3>v-html</h3>
    The <code>v-html</code> directive is used to direct raw html render.
    It is just a helper directive and it does not improve performance because
    Valyrian.js is already very fast with vnodes.
        {code(`
v.mount('body', () => <div v-html="<div>Hello world</div>"></div>); // -> <div><div>Hello world</div></div>
`)}
    This method helps in situations where you need to render for example an svg string.
        <br />For the same reason that Valyrian.js is very fast rendering vnodes,
    there is no need for a <code>v-text</code> directive to optimize performance,
    conversely, adding a <code>v-text</code> directive slows down the rendering process.
        <br /><br />
        <h3>v-once</h3>
    The <code>v-once</code> directive is used to render just once and skip all subsequent render updates.
    It is similar to write the lifecycle <code>onbeforeupdate={'{() => false}'}</code>
        {code(`
let Store = {hello: 'world'};
v.mount('body', () => <div v-once>Hello {Store.hello}</div>); // -> <div>Hello world</div>
Store.hello = 'John Doe';
v.update(); // -> <div>Hello world</div>
`)}
      </section>
    </div>
  </Layout>
);

export default BuiltInDirectives;
