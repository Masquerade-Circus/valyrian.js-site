require("valyrian.js");
let Router = require("valyrian.js/plugins/router");
let Request = require("valyrian.js/plugins/request");
let Sw = require("valyrian.js/plugins/sw");
let VModel = require("valyrian.js/plugins/v-model");
let Prism = require("prismjs");
require("prismjs/components/prism-jsx");

(v.isNode ? global : window).code = (str, language = "jsx") => {
  return (
    <pre>
      <code v-html={Prism.highlight(str, Prism.languages[language], language)} />
    </pre>
  );
};

v.usePlugin(Router);
v.usePlugin(Request);
v.usePlugin(Sw);
v.usePlugin(VModel);
