import Links from './links';
import { version, description } from '../../package.json';

let Main = {
  title: 'Valyrian.js',
  version: version,
  description: description,
  view(props, ...children) {
    let view = (
      <html lang="en">
        <head>
          <title>{Main.title}</title>
          <meta charset="utf-8" />
          <meta name="description" content={Main.description} />
          <meta http-equiv="x-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimal-ui" />
          <link href="/dragonglass.css" rel="stylesheet" />
          <style>{v.inline.css()}</style>
          <link href="/main.css" rel="stylesheet" />
          <Links />
        </head>
        <body>
          {children}
          <script src="/index.min.js" />
        </body>
      </html>
    );

    return view;
  }
};

export default Main;
