import Pages from './pages';

// Create a router
let router = v.router();
router
    .get('/', () => v(Pages.Layout, v(Pages.Home)))
    .get('/get-started', () => v(Pages.Layout, v(Pages.GetStarted)))
    .get('/api', () => v(Pages.Layout, v(Pages.Api)))
    .get('/examples', () => v(Pages.Layout, v(Pages.Examples)))
;

// Assign routes to ValyrianJs
v.routes('body', router);

if (v.is.browser) {
    v.sw('./sw.js');
}

// Export what is needed for the backend
export default {Pages};
