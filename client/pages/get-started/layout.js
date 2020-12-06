import Layout from "../layout";

let Page = {
  Routes: [
    { title: "What is Valyrian.js?", route: "/get-started" },
    { title: "Installation", route: "/get-started/installation" },
    { title: "Hyperscript/JSX", route: "/get-started/hyperscript" },
    { title: "Components", route: "/get-started/components" },
    { title: "Lifecycle methods", route: "/get-started/lifecycle-methods" },
    {
      title: "Directives",
      children: [
        { title: "Built in directives", route: "/get-started/directives/built-in-directives" },
        { title: "v-model", route: "/get-started/directives/v-model" },
        { title: "Custom directives", route: "/get-started/directives/custom-directives" }
      ]
    },
    {
      title: "Plugins",
      children: [
        { title: "Plugin system", route: "/get-started/plugins/plugin-system" },
        { title: "Router plugin", route: "/get-started/plugins/router-plugin" },
        { title: "Request plugin", route: "/get-started/plugins/request-plugin" },
        { title: "Service worker plugin", route: "/get-started/plugins/service-worker-plugin" },
        { title: "NodeJs plugin", route: "/get-started/plugins/nodejs-plugin" },
        { title: "Store plugin", route: "/get-started/plugins/store-plugin" },
        { title: "Hooks plugin", route: "/get-started/plugins/hooks-plugin" },
        { title: "Signals plugin", route: "/get-started/plugins/signals-plugin" }
      ]
    },
    { title: "Server side jsx", route: "/get-started/server-side-jsx" }
  ],
  getRoute({ title, route, children }) {
    if (Array.isArray(children)) {
      return [
        <span style="margin: 0px; background: white; display: block;" class="u-p-sm">
          {title}
        </span>,
        <div class="bg-default-bright u-pl-sm" v-for={children}>
          {Page.getRoute}
        </div>
      ];
    } else {
      return (
        <a title={title} v-route={route} class="btn text-left" style="margin: 0px; display: block;">
          {title}
        </a>
      );
    }
  },
  view({ title }, ...children) {
    return (
      <Layout>
        <article>
          <header>
            <h1>
              Get started <span v-if={title}>- {title}</span>
            </h1>
          </header>
          <div class="grid-gutters">
            <section class="lg:w-3/12 md:w-4/12 sm:w-5/12 xs:w-11/12">
              <div data-card="full-width" v-for={Page.Routes}>
                {Page.getRoute}
              </div>
            </section>
            <section class="lg:w-9/12 md:w-8/12 sm:w-7/12 xs:w-11/12">{children}</section>
          </div>
        </article>
      </Layout>
    );
  }
};

export default Page;
