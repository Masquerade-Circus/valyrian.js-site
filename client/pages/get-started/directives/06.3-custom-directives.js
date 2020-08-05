import Layout from '../layout';

let directives = {
  simple: () => {
    v.directive('test', (value) => console.log(`Hello ${value}`));
    return <div v-test={'world'}></div>;
  }
};

let CustomDirectives = () => (
  <Layout>
    <div data-card="full-width">
      <header>
        <h1>Custom directives</h1>
      </header>
      <section>
        <h3>Simple directive</h3>
        {code(`
v.directive('test', (value) => console.log(\`Hello \${value}\`));
v.mount('body', () => <div v-test={'world'}></div>)
      `)}
        <samp>
          {directives.simple()}
          {code(`
$ Hello world
          `)}
        </samp>
      </section>
    </div>
  </Layout>
);

export default CustomDirectives;
