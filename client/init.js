import 'valyrian.js';
import Router from 'valyrian.js/plugins/router';
import Request from 'valyrian.js/plugins/request';
import Sw from 'valyrian.js/plugins/sw';
import VModel from 'valyrian.js/plugins/v-model';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

(v.isNode ? global : window).code = (str, language = 'jsx') => {
  return (
    <pre>
      <code>{v.trust(Prism.highlight(str, Prism.languages[language], language))}</code>
    </pre>
  );
};

v.usePlugin(Router);
v.usePlugin(Request);
v.usePlugin(Sw);
v.usePlugin(VModel);

console.log({ v });
