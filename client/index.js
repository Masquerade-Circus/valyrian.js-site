import Pages from './pages';

// Create a router
let router = v.router();
router
    .get('/', () => v(Pages.Layout, {
        children: v(Pages.Home)
    }))
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
