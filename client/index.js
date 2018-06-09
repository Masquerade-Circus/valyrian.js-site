import Pages from './pages';

// Create a router
let router = v.router();
router
    .get('/', () => v(Pages.Layout, v(Pages.Home)))
    .get('/getting-started', () => v(Pages.Layout, v(Pages.GettingStarted)))
    .get('/api', () => v(Pages.Layout, v(Pages.Api)))
    .get('/examples', () => v(Pages.Layout, v(Pages.Examples)))
;

// Assign routes to ValyrianJs
v.routes('body', router);

if (v.isBrowser) {
    v.sw('./sw.js')
        .then(() => {
            console.log('SW registered');
        });
}

// Export what is needed for the backend
export default {Pages};
