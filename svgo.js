let FS = require('fs'),
  SVGO = require('svgo'),
  svgo = new SVGO({
    plugins: [{
      cleanupAttrs: true
    }, {
      removeDoctype: true
    }, {
      removeXMLProcInst: true
    }, {
      removeComments: true
    }, {
      removeMetadata: true
    }, {
      removeTitle: true
    }, {
      removeDesc: true
    }, {
      removeUselessDefs: true
    }, {
      removeEditorsNSData: true
    }, {
      removeEmptyAttrs: true
    }, {
      removeHiddenElems: true
    }, {
      removeEmptyText: true
    }, {
      removeEmptyContainers: true
    }, {
      removeViewBox: false
    }, {
      cleanUpEnableBackground: true
    }, {
      convertStyleToAttrs: true
    }, {
      convertColors: true
    }, {
      convertPathData: true
    }, {
      convertTransform: true
    }, {
      removeUnknownsAndDefaults: true
    }, {
      removeNonInheritableGroupAttrs: true
    }, {
      removeUselessStrokeAndFill: true
    }, {
      removeUnusedNS: true
    }, {
      cleanupIDs: true
    }, {
      cleanupNumericValues: true
    }, {
      moveElemsAttrsToGroup: true
    }, {
      moveGroupAttrsToElems: true
    }, {
      collapseGroups: true
    }, {
      removeRasterImages: false
    }, {
      mergePaths: true
    }, {
      convertShapeToPath: true
    }, {
      sortAttrs: true
    }, {
      transformsWithOnePath: false
    }, {
      removeDimensions: true
    }, {
      removeAttrs: { attrs: '(stroke|fill|font|style|letter-spacing|word-spacing|font-weight|font-family|font-size)' }
    }]
  });

let recursive = require("recursive-readdir");
recursive('./public', function (err, files) {
  if (err) {
    return console.log(err);
  }

  files.forEach(filepath => {
    if (filepath.indexOf('svg') !== -1) {
      FS.readFile(filepath, 'utf8', function (err, data) {
        if (err) {
          throw err;
        }

        svgo.optimize(data, { path: filepath }).then((result) => {
          FS.writeFile(filepath, result.data, (err) => {
            if (err) {
              throw err;
            }
            console.log('The file has been saved!');
          });
        })
          .catch(console.log);

      });
    }

  });
});

