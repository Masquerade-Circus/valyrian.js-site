import './init';
import router from './routes';
import Pages from './pages';

// Assign routes to ValyrianJs
v.routes('body', router);

console.log(v.routes.get());

// if (!v.isNode) {
//     v.sw('/sw.js');
//     console.log(v.routes.get());
// }

// Export what is needed for the backend
export default { Pages };
