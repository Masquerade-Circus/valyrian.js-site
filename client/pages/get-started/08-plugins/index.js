let PluginSystem = require("./08-plugin-system");
let RouterPlugin = require("./08.1-router-plugin");
let RequestPlugin = require("./08.2-request-plugin");
let ServiceWorkerPlugin = require("./08.3-service-worker-plugin");
let NodePlugin = require("./08.4-node-plugin");
let StorePlugin = require("./08.5-store-plugin");
let HooksPlugin = require("./08.6-hooks-plugin");
let SignalsPlugin = require("./08.7-signals-plugin");

module.exports = {
  PluginSystem,
  RouterPlugin,
  RequestPlugin,
  ServiceWorkerPlugin,
  NodePlugin,
  StorePlugin,
  HooksPlugin,
  SignalsPlugin
};
