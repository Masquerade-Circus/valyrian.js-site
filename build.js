// Require valyrian and main app
require('valyrian.js');
const nodePlugin = require('valyrian.js/plugins/node');
// Require package json to obtain the version
const packageJson = require('./node_modules/valyrian.js/package.json');

v.usePlugin(nodePlugin);

async function build() {
  console.log('Generating service worker...');
  await v.sw('./public/sw.js', {
    name: packageJson.name,
    version: packageJson.version,
    urls: ['/']
  });

  console.log('Generating service worker finished.');
  console.log('Generating app icons and manifest...');
  let favicons = {
    iconsPath: './public/icons/', // Path to the generated icons
    linksViewPath: './client/pages', // Path to the generated links file

    // favicons options
    path: '/icons/', // Path for overriding default icons path. `string`
    appName: packageJson.name, // Your application's name. `string`
    appDescription: packageJson.description, // Your application's description. `string`
    developerName: 'Christian César Robledo López (Masquerade Circus)', // Your (or your developer's) name. `string`
    developerURL: 'http://masquerade-circus.net',
    dir: 'auto',
    lang: 'en-US',
    background: '#fff', // Background colour for flattened icons. `string`
    theme_color: '#fff',
    display: "standalone", // Android display: "browser" or "standalone". `string`
    orientation: "any", // Android orientation: "any" "portrait" or "landscape". `string`
    start_url: "/", // Android start application's URL. `string`
    version: packageJson.version, // Your application's version number. `number`
    logging: false, // Print logs to console? `boolean`
    icons: {
      android: true, // Create Android homescreen icon. `boolean`
      appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset: offsetInPercentage }`
      appleStartup: true, // Create Apple startup images. `boolean`
      coast: false, // Create Opera Coast icon with offset 25%. `boolean` or `{ offset: offsetInPercentage }`
      favicons: true, // Create regular favicons. `boolean`
      firefox: false, // Create Firefox OS icons. `boolean` or `{ offset: offsetInPercentage }`
      windows: true, // Create Windows 8 tile icons. `boolean`
      yandex: false // Create Yandex browser icon. `boolean`
    }
  };

  await v.icons('./public/icon.png', favicons);
  console.log('Generating app icons and manifest finished.');

}

build();
