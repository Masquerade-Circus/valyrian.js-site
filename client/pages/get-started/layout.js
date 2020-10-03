import Layout from "../layout";

let Page = {
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
              <div data-card="full-width">
                <a title="What is Valyrian.js?" v-route="/get-started" class="btn text-left" style="margin: 0px;">
                  What is Valyrian.js?
                </a>
                <a title="Installation" v-route="/get-started/installation" class="btn text-left" style="margin: 0px;">
                  Installation
                </a>
                <a title="Hyperscript/JSX" v-route="/get-started/hyperscript" class="btn text-left" style="margin: 0px;">
                  Hyperscript/JSX
                </a>
                <a title="Components" v-route="/get-started/components" class="btn text-left" style="margin: 0px;">
                  Components
                </a>
                <a title="Lifecycle methods" v-route="/get-started/lifecycle-methods" class="btn text-left" style="margin: 0px;">
                  Lifecycle methods
                </a>
                <span style="margin: 0px; background: white; display: block;" class="u-p-sm">
                  Directives
                </span>
                <div class="bg-default-bright u-pl-sm">
                  <a title="Built in directives" v-route="/get-started/directives/built-in-directives" class="btn text-left" style="margin: 0px; display: blocK">
                    Built in directives
                  </a>
                  <a title="v-model" v-route="/get-started/directives/v-model" class="btn text-left" style="margin: 0px; display: blocK">
                    v-model
                  </a>
                  <a title="Custom directives" v-route="/get-started/directives/custom-directives" class="btn text-left" style="margin: 0px; display: blocK">
                    Custom directives
                  </a>
                </div>
                <a title="Plugin system" v-route="/get-started/plugins" class="btn text-left" style="margin: 0px;">
                  Plugin system
                </a>
                <a title="Router plugin" v-route="/get-started/router-plugin" class="btn text-left" style="margin: 0px;">
                  Router plugin
                </a>
                <a title="Request plugin" v-route="/get-started/request-plugin" class="btn text-left" style="margin: 0px;">
                  Request plugin
                </a>
                <a title="Service worker plugin" v-route="/get-started/service-worker-plugin" class="btn text-left" style="margin: 0px;">
                  Service worker plugin
                </a>
                <a title="Node plugin" v-route="/get-started/node-plugin" class="btn text-left disabled" style="margin: 0px;">
                  Node plugin
                </a>
                <a title="Store plugin" v-route="/get-started/store-plugin" class="btn text-left disabled" style="margin: 0px;">
                  Store plugin
                </a>
                <a title="Hooks plugin" v-route="/get-started/hooks-plugin" class="btn text-left disabled" style="margin: 0px;">
                  Hooks plugin
                </a>
                <a title="Signals plugin" v-route="/get-started/signals-plugin" class="btn text-left disabled" style="margin: 0px;">
                  Signals plugin
                </a>
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
