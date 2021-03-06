let Layout = require("./layout");
let Logo = require("../components/Logo");

module.exports = () => (
  <Layout>
    <article>
      <div id="home-middle">
        <div v-html={Logo} />
        <br />
        <div v-for={Layout.links}>
          {(item) => {
            if (item.route) {
              return (
                <a class="btn border-primary" v-route={item.route}>
                  {item.title}
                </a>
              );
            }

            return (
              <a class="btn border-primary" {...item}>
                {item.title}
              </a>
            );
          }}
        </div>
      </div>
    </article>
  </Layout>
);
