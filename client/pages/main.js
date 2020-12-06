let Links = require("./links");
let { version, description } = require("../../node_modules/valyrian.js/package.json");

let Main = {
  title: "Valyrian.js",
  version,
  description,
  styles() {
    if (process.env.NODE_ENV === "development") {
      return v.inline.css().map(({ raw, map }) => (
        <style>
          {raw}
          {map}
        </style>
      ));
    } else {
      return <style>{v.inline.uncss()}</style>;
    }
  },
  js() {
    if (process.env.NODE_ENV === "development") {
      return v.inline.js().map(({ raw, map }) => (
        <script>
          {raw}
          {map}
        </script>
      ));
    } else {
      return v.inline.js().map(({ raw }) => <script>{raw}</script>);
    }
  },
  view(props, ...children) {
    let view = [
      "<!DOCTYPE html>",
      <html lang="en">
        <head>
          <title>{Main.title}</title>
          <meta charset="utf-8" />
          <meta name="description" content={Main.description} />
          <meta http-equiv="x-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          {Main.styles()}
          <Links />
        </head>
        <body>
          {children}
          {Main.js()}
        </body>
      </html>
    ];

    return view;
  }
};

module.exports = Main;
