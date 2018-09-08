import Links from './links';
import {version, description} from '../../package.json';

let Main = {
    title: 'Valyrian.js',
    version: version,
    description: description,
    view(...children) {
        let view = <html lang="en">
            <head>
                <title>{Main.title}</title>
                <meta charset="utf-8"/>
                <meta name="description" content={Main.description}/>
                <meta http-equiv="x-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimal-ui"/>
                <link href="/pure-material.css" rel="stylesheet"/>
                <link href="/main.css" rel="stylesheet"/>
                <Links></Links>
            </head>
            <body>
                {children}
                <script src="/index.min.js"></script>
            </body>
        </html>;

        return view;
    }
};

export default Main;
