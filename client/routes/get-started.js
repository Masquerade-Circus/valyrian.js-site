import Pages from '../pages';

// Create a router
let router = v.Router();
router
  .get('/installation', () => Pages.GetStarted.Installation)
  .get('/hyperscript', () => Pages.GetStarted.Hyperscript)
  .get('/components', () => Pages.GetStarted.Components)
  .get('/lifecycle-methods', () => Pages.GetStarted.LifecycleMethods)
  .get('/router-plugin', () => Pages.GetStarted.RouterPlugin)
  .get('/request-plugin', () => Pages.GetStarted.RequestPlugin)
  .get('/service-worker-plugin', () => Pages.GetStarted.ServiceWorkerPlugin)
  .get('/icons-and-manifest', () => Pages.GetStarted.IconsAndManifest)
  .get('/plugins', () => Pages.GetStarted.Plugins)
  .get('/node-plugin', () => Pages.GetStarted.NodePlugin)
  .get('/', () => Pages.GetStarted.WhatIsValyrian);

export default router;
