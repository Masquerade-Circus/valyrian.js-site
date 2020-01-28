import Layout from '../layout';
let Page = {
  sections: [
    { title: 'What is Valyrian.js?', 'v-route': '/get-started' },
    { title: 'Installation', 'v-route': '/get-started/installation' },
    { title: 'Hyperscript/JSX', 'v-route': '/get-started/hyperscript' },
    { title: 'Components', 'v-route': '/get-started/components' },
    { title: 'Lifecycle methods', 'v-route': '/get-started/lifecycle-methods' },
    { title: 'Directives', 'v-route': '/get-started/directives', 'style': 'background: #ededed'},
    { title: 'Plugin system', 'v-route': '/get-started/plugins' },
    { title: 'Router plugin', 'v-route': '/get-started/router-plugin' },
    { title: 'Request plugin', 'v-route': '/get-started/request-plugin' },
    { title: 'Service worker plugin', 'v-route': '/get-started/service-worker-plugin' },
    { title: 'Node plugin', 'v-route': '/get-started/node-plugin', 'style': 'background: #ededed' },
    { title: 'Store plugin', 'v-route': '/get-started/store-plugin', 'style': 'background: #ededed' },
    { title: 'Hooks plugin', 'v-route': '/get-started/hooks-plugin', 'style': 'background: #ededed' },
    { title: 'Signals plugin', 'v-route': '/get-started/signals-plugin', 'style': 'background: #ededed' }
  ],
  view(props, ...children) {
    return (
      <Layout>
        <article>
          <h1>Get started</h1>
          <div data-grid="gutters">
            <div data-column="md-3 xs-12">
              <div data-card="true">
                <section>
                  <ul data-list="sm" v-for={Page.sections}>
                    {(item) => <li><a {...item}>{item.title}</a></li>}
                  </ul>
                </section>
              </div>
            </div>
            <div data-column="md-9 xs-12">{children}</div>
          </div>
        </article>
      </Layout>
    );
  }
};

export default Page;
