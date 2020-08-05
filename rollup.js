let rollup = require('rollup');
let commonjs = require('@rollup/plugin-commonjs');
let {nodeResolve} = require('@rollup/plugin-node-resolve');
let includepaths = require('rollup-plugin-includepaths');
let filesize = require('rollup-plugin-filesize');
let progress = require('rollup-plugin-progress');
let buble = require('@rollup/plugin-buble');
let json = require('@rollup/plugin-json');
let {string} = require('rollup-plugin-string');
let { terser } = require('rollup-plugin-terser');
let sourcemaps = require('rollup-plugin-sourcemaps');

let inputOptions = {
  input: './client/index.js',
  plugins: [
    progress({ clearLine: false }),
    includepaths({ paths: ['./client', './dist', './node_modules'] }),
    nodeResolve({
      mainFields: ['browser', 'jsnext', 'module', 'main'],
      browser: true
    }),
    string({
      include: '**/*.svg'
    }),
    json(),
    buble({
      jsx: 'v',
      transforms: {asyncAwait: false},
      objectAssign: 'Object.assign',
      target: { chrome: 70, firefox: 60, safari: 10, node: 8.7 }
    }),
    commonjs({
      include: ['./node_modules/**'], // Default: undefined
      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: true // Default: true
    }),
    sourcemaps(),
    filesize()
  ],
  cache: undefined
};

let outputOptions = {
  file: './public/index.min.js',
  format: 'umd',
  sourcemap: true,
  name: 'App',
  compact: true
};

if (process.env.NODE_ENV === 'production') {
  outputOptions.sourcemap = false;
  inputOptions.plugins.push(terser({ warnings: 'verbose', sourcemap: false }));
  rollup
    .rollup(inputOptions)
    .then((bundle) => bundle.write(outputOptions))
    .then(() => console.log('Bundle finished.'))
    .catch(console.log);
}

if (process.env.NODE_ENV !== 'production') {
  inputOptions.plugins.push(terser({ warnings: 'verbose' }));

  inputOptions.output = outputOptions;
  inputOptions.watch = {
    include: ['./client/**'],
    chokidar: false
  };

  const watch = rollup.watch(inputOptions);
  const stderr = console.error.bind(console);

  watch.on('event', (event) => {
    switch (event.code) {
      case 'START':
        stderr('checking rollup-watch version...');
        break;
      case 'BUNDLE_START':
        stderr(`bundling ${outputOptions.file}...`);
        break;
      case 'BUNDLE_END':
        stderr(`${outputOptions.file} bundled in ${event.duration}ms.`);
        break;
      case 'ERROR':
        stderr(`error: ${event.error}`);
        break;
      case 'FATAL':
        stderr(`error: ${event.error}`);
        break;
      case 'END':
        stderr(`Watching for changes...`);
        break;
      default:
        stderr(`unknown event: ${event}`);
    }
  });
}
