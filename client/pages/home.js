import Layout from './layout';
import logo from '../../public/logo.svg';

export default () => (
  <Layout>
    <article data-background="white">
      <div id="home-middle">
        <div>{v.trust(logo)}</div>
        <br />
        <div v-for={Layout.links}>
          {(item) => {
            if (item.route) {
              return <a data-button='outline' v-route={item.route}>{item.title}</a>;
            }

            return <a data-button='outline' {...item}>{item.title}</a>;
          }}
        </div>
      </div>
    </article>
  </Layout>
);
