import links from './links';

let Main = {
    title: '',
    version: '',
    description: '',
    css: '',
    js: '',
    view() {
        return [
            v('head', [
                v('title', Main.title),
                v('meta', {
                    name: 'description',
                    content: Main.description
                }),
                v('meta[charset="utf-8"]'),
                v('meta', {
                    'http-equiv': 'X-UA-Compatible',
                    content: 'IE=edge'
                }),
                v('meta', {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, maximum-scale=5, minimal-ui'
                }),
                v('style', Main.css),
                v(links)
            ]),
            v('body', [
                Main.attributes.children,
                v('script', Main.js)
            ])
        ];
    }
};

export default Main;
