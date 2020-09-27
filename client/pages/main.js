import Links from './links';
import { version, description } from '../../node_modules/valyrian.js/package.json';

let Main = {
  title: 'Valyrian.js',
  version: version,
  description: description,
  view(props, ...children) {
    let view = [
      '<!DOCTYPE html>',
      <html lang="en">
        <head>
          <title>{Main.title}</title>
          <meta charset="utf-8" />
          <meta name="description" content={Main.description} />
          <meta http-equiv="x-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <style>{v.inline.uncss()}</style>
          <Links />
        </head>
        <body>
          {children}
          <script>{v.inline.js()}</script>
        </body>
      </html>
    ];

    return view;
  }
};

export default Main;
