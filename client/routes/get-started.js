import Pages from '../pages';

// Create a router
let router = v.Router();
router
  .get('/', () => Pages.GetStarted.WhatIsValyrian)
  .get('/installation', () => Pages.GetStarted.Installation)
  .get('/hyperscript', () => Pages.GetStarted.Hyperscript)
  .get('/components', () => Pages.GetStarted.Components)
  .get('/lifecycle-methods', () => Pages.GetStarted.LifecycleMethods)
  .get('/directives', () => Pages.GetStarted.Directives)
  .get('/plugins', () => Pages.GetStarted.Plugins)
  .get('/router-plugin', () => Pages.GetStarted.RouterPlugin)
  .get('/request-plugin', () => Pages.GetStarted.RequestPlugin)
  .get('/service-worker-plugin', () => Pages.GetStarted.ServiceWorkerPlugin)
  .get('/node-plugin', () => Pages.GetStarted.NodePlugin)
  .get('/store-plugin', () => Pages.GetStarted.StorePlugin)
  .get('/hooks-plugin', () => Pages.GetStarted.HooksPlugin)
  .get('/signals-plugin', () => Pages.GetStarted.SignalsPlugin)

;

export default router;
