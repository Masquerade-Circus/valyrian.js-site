let Page = {
    links: [
        {href: '/getting-started', title: 'Get started'},
        {href: '/api', title: 'Api'},
        {href: '/examples', title: 'Examples'},
        {href: 'https://github.com/Masquerade-Circus/valyrian.js', title: 'Github'}
    ],
    view() {
        return [
            v('header', [
                v('h1', [
                    v('a[href=/][style=color:white]', {onclick(e) {
                        v.routes.go('/');
                        e.preventDefault();
                    }}, 'Valyrian.js'),
                    v('small', ' v1.1.1')
                ]),
                v('nav', Page.links.map(item => {
                    return v('a', {
                        'data-button': '',
                        href: item.href,
                        target: item.href.indexOf('http') > -1 ? '_blank' : '',
                        onclick(e) {
                            if (item.href.indexOf('http') === -1) {
                                v.routes.go(item.href);
                                e.preventDefault();
                            }
                        }
                    }, item.title);
                }))
            ]),
            Page.attributes.children
        ];
    }
};

export default Page;
