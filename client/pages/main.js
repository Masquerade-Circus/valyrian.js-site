import links from './links';
import {version, description} from '../../package.json';

let Main = {
    title: 'Valyrian.js',
    version: version,
    description: description,
    baseUrl: v.window.location.href,
    view() {
        return v('html[lang=en]', [
            v('head', [
                v('title', Main.title),
                v('meta[charset="utf-8"]'),
                v('meta', {
                    name: 'description',
                    content: Main.description
                }),
                v('meta', {
                    'http-equiv': 'X-UA-Compatible',
                    content: 'IE=edge'
                }),
                v('meta', {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1, maximum-scale=5, minimal-ui'
                }),
                v('style', v.inline.uncss()),
                v(links)
            ]),
            v('body', [
                Main.attributes.children,
                v('script', {src: '/index.min.js', async: true})
            ])
        ]);
    }
};

export default Main;
