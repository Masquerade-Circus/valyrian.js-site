import 'valyrian.js';
// import './valyrian1.js';
import Router from 'valyrian.js/plugins/router.js';
import Request from 'valyrian.js/plugins/request';
import Sw from 'valyrian.js/plugins/sw';

v
    .use(Router)
    .use(Request)
    .use(Sw);
