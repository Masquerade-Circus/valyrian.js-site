import Layout from './layout';
import logo from '../../public/logo.svg';

export default () => (
  <Layout>
    <article>
      <div id="home-middle">
        <div v-html={logo}></div>
        <br />
        <div v-for={Layout.links}>
          {(item) => {
            if (item.route) {
              return <a class='btn border-primary' v-route={item.route}>{item.title}</a>;
            }

            return <a class='btn border-primary' {...item}>{item.title}</a>;
          }}
        </div>
      </div>
    </article>
  </Layout>
);
