let Page = {
    links: [
        {href: '/get-started', title: 'Get started'},
        {href: '/api', title: 'Api'},
        {href: '/examples', title: 'Examples'},
        {href: 'https://github.com/Masquerade-Circus/valyrian.js', title: 'Github', target: '_blank', rel: 'noopener'}
    ],
    view(props, children) {
        let view = [
            <header>
                <h1>
                    <a href="/" style="color: white" onclick={e=> {
                        v.routes.go('/');
                        e.preventDefault();
                    }}>Valyrian.js v2.0.1</a>
                </h1>
            </header>,
            children,
            <footer>
                <nav>
                    {Page.links.map(item => {
                        return <a
                            data-button="true"
                            title={item.title}
                            target={item.target}
                            rel={item.rel}
                            href={item.href}
                            onclick={e => {
                                if (item.href.indexOf('http') === -1) {
                                    v.routes.go(item.href);
                                    e.preventDefault();
                                }
                            }}>{item.title}</a>;
                    })}
                </nav>
            </footer>
        ];

        return view;
    }
};

export default Page;
