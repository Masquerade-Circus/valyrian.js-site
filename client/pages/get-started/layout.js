import Layout from '../layout';
let Page = {
  sections: [
    { title: 'What is Valyrian.js?', href: '/get-started' },
    { title: 'Installation', href: '/get-started/installation' },
    { title: 'Hyperscript/JSX', href: '/get-started/hyperscript' },
    { title: 'Components', href: '/get-started/components' },
    { title: 'Lifecycle methods', href: '/get-started/lifecycle-methods' },
    { title: 'Plugin system', href: '/get-started/plugins' },
    { title: 'Router plugin', href: '/get-started/router-plugin' },
    { title: 'Request plugin', href: '/get-started/request-plugin' },
    { title: 'Service worker plugin', href: '/get-started/service-worker-plugin' },
    { title: 'Node plugin', href: '/get-started/node-plugin' }
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
                  <ul data-list="sm">
                    {Page.sections.map((item) => {
                      return (
                        <li>
                          <a
                            title={item.title}
                            href={item.href}
                            onclick={(e) => {
                              v.routes.go(item.href);
                              e.preventDefault();
                            }}
                          >
                            {item.title}
                          </a>
                        </li>
                      );
                    })}
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
