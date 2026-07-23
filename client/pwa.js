const { SwRuntimeManager } = require("valyrian.js/sw");

function installPwa(browser, locale, Manager = SwRuntimeManager) {
  if (locale !== "en" && locale !== "es") {
    throw new Error("Unsupported locale");
  }

  const manager = new Manager({
    runtime: {
      isNodeJs: false,
      navigator: browser.navigator,
      window: browser,
    },
    scope: "/",
    strategy: "manual",
    swUrl: "/sw.js",
  });
  const setLocale = (nextLocale) => {
    if (nextLocale !== "en" && nextLocale !== "es") {
      throw new Error("Unsupported locale");
    }
    browser.navigator.serviceWorker?.controller?.postMessage({
      locale: nextLocale,
      type: "SET_LOCALE",
    });
  };

  let appliedWorker = null;
  let dismissedWorker = null;
  let initializationError = null;
  let updateApproved = false;
  let reloaded = false;
  const reportError = (error) => {
    initializationError = error;
  };
  manager.on("error", reportError);
  manager.on("registered", setLocale.bind(null, locale));
  manager.on("updated", () => {
    setLocale(locale);
    if (!updateApproved || reloaded) {
      return;
    }
    reloaded = true;
    browser.location?.reload();
  });
  const ready = manager
    .init()
    .then(() => {
      return initializationError === null
        ? manager
        : { error: initializationError, manager };
    })
    .catch((error) => {
      reportError(error);
      return { error, manager };
    });

  return {
    applyUpdate: () => {
      const waiting = manager.state.waiting;
      if (waiting === null || waiting === appliedWorker) {
        return;
      }
      appliedWorker = waiting;
      updateApproved = true;
      manager.applyUpdate();
    },
    dismissUpdate: () => {
      dismissedWorker = manager.state.waiting;
    },
    manager,
    ready,
    setLocale,
    get updateAvailable() {
      const state = manager.state;
      return (
        state.updateAvailable === true &&
        state.waiting !== null &&
        state.waiting !== appliedWorker &&
        state.waiting !== dismissedWorker
      );
    },
  };
}

module.exports = { installPwa };
