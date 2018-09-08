import Pages from '../pages';

// Create a router
let router = v.Router();
router
    .get('/installation', () => Pages.GetStarted.Installation)
    .get('/hyperscript', () => Pages.GetStarted.Hyperscript)
    .get('/components', () => Pages.GetStarted.Components)
    .get('/lifecycle-methods', () => Pages.GetStarted.LifecycleMethods)
    .get('/routing', () => Pages.GetStarted.Routing)
    .get('/request', () => Pages.GetStarted.Request)
    .get('/icons-and-manifest', () => Pages.GetStarted.IconsAndManifest)
    .get('/service-worker', () => Pages.GetStarted.ServiceWorker)
    .get('/', () => Pages.GetStarted.WhatIsValyrian)
;

export default router;
