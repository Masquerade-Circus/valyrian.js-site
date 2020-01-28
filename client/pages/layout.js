import {version} from 'valyrian.js/package.json';

let Page = {
  links: [
    { route: '/get-started', title: 'Get started' },
    { route: '/api', title: 'Api' },
    { route: '/examples', title: 'Examples' },
    { href: 'https://github.com/Masquerade-Circus/valyrian.js', title: 'Github', target: '_blank', rel: 'noopener' }
  ],
  view(props, ...children) {
    let view = [
      <header>
        <h1><a v-route="/" style="color: white">Valyrian.js {version}</a></h1>
      </header>,
      children,
      <footer>
        <nav v-for={Page.links}>
          {(item) => {
            if (item.route) {
              return <a data-button v-route={item.route}>{item.title}</a>;
            }

            return <a data-button {...item}>{item.title}</a>;
          }}
        </nav>
      </footer>
    ];

    return view;
  }
};

export default Page;
