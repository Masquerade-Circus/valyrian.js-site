let Section = require("../../components/Section");
let Layout = require("./layout");

module.exports = () => (
  <Layout>
    <Section title="Hyperscript/JSX" />
    <Section title="Hyperscript">
      Like many other frameworks, Valyrian, in its core, makes use of Hyperscript to compose a virtual dom for the view layer, and it follows the minimal way of hyperscript, so you can write any dom by calling Valyrian
      this way:
      {code(`
// v(tagName, properties[, childnodes]) 
return v('div', {id: 'valyrian'}, [
    'An awesome framework',
    v('small', null, 'It will surprise you')
]);
            `)}
      The latest code will create the next view
      {code(`
<div id="valyrian">
    An awesome framework <small>It will surprise you</small>
</div>
            `)}
      <samp>
        <div id="valyrian">
          An awesome framework <small>It will surprise you</small>
        </div>
      </samp>
    </Section>

    <Section title="JSX">
      If you use it with a compiler like Webpack or Rollup you can and we encorage you to use JSX.
      <br />
      This way you can create the previous dom the way it is finally represented:
      {code(`
// You write 
return <div id="valyrian">
    An awesome framework <small>It will surprise you</small>
</div>;
            `)}
      {code(`
// And you get 
<div id="valyrian">
    An awesome framework <small>It will surprise you</small>
</div>
      `)}
      <samp>
        <div id="valyrian">
          An awesome framework <small>It will surprise you</small>
        </div>
      </samp>
    </Section>

    <Section title="Babel">
      With Babel you need to install the babel-plugin-transform-react-jsx plugin
      <br />
      Then in your <code>.babelrc</code> file:
      {code(`
{
    "presets": ["..."],
    "plugins": [
        ["transform-react-jsx", {
            "pragma": "v"
        }]
    ]
}
            `)}
    </Section>

    <Section title="Buble">
      With Buble you only need to pass <code>jsx: 'v'</code> in the configuration object:
      {code(`
{
    input: '...',
    plugins: [
        buble({
            jsx: 'v'
        })
    ]
  }
            `)}
    </Section>

    <Section title="Multiple root elements">
      Unlike many other frameworks, when you are working with the view layer with Valyrian, you are not limited to return only one root node. You can return an array of nodes without any trouble and without adding any
      sugar syntax, example:
      {code(`
return [ 
    <span>Hello</span>, 
    <span>World</span>
];
            `)}
    </Section>
  </Layout>
);
