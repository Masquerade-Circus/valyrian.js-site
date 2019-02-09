import Layout from './layout';
import logo from '../../public/logo.svg';

export default () => (
  <Layout>
    <article data-background="white">
      <div id="home-middle">
        <div>{v.trust(logo)}</div>
        <br />
        <div>
          {Layout.links.map((item) => {
            return (
              <a
                data-button="outline"
                title={item.title}
                target={item.target}
                rel={item.rel}
                href={item.href}
                onclick={(e) => {
                  if (item.href.indexOf('http') === -1) {
                    v.routes.go(item.href);
                    e.preventDefault();
                  }
                }}
              >
                {item.title}
              </a>
            );
          })}
        </div>
      </div>
    </article>
  </Layout>
);
