// import 'valyrian.js';
import './lib';
import Router from 'valyrian.js/plugins/router.js';
import Request from 'valyrian.js/plugins/request';
import Sw from 'valyrian.js/plugins/sw';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

(v.is.node ? global : window).code = (str, language = 'jsx') => {
  return (
    <pre>
      <code>{v.trust(Prism.highlight(str, Prism.languages[language], language))}</code>
    </pre>
  );
};

v.use(Router)
  .use(Request)
  .use(Sw);

console.log({ v });
