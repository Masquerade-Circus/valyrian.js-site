const SITE_ORIGIN = "https://valyrian-js.appspot.com";
const SYNTHETIC_PATHS = Object.freeze(["/", "/learn", "/reference"]);
const SYNTHETIC_PAGES = Object.freeze({
  en: {
    "/learn":
      "# Learn Valyrian.js\n\nFollow a complete path or open the guide that matches the feature you need. Start with views and mounting, then add routing, data, state, offline behavior or server rendering as your application requires.",
    "/reference":
      "# API reference\n\nFind Valyrian.js modules and symbols by capability. Each entry provides its import, signature, result, errors and related guide.",
  },
  es: {
    "/learn":
      "# Aprende Valyrian.js\n\nSigue un recorrido completo o abre la guía de la capacidad que necesitas. Comienza con las vistas y el montaje. Después agrega enrutamiento, datos, estado, operación offline o renderizado en el servidor según lo requiera tu aplicación.",
    "/reference":
      "# Referencia de API\n\nEncuentra módulos y símbolos de Valyrian.js por capacidad. Cada entrada ofrece su importación, firma, resultado, errores y guía relacionada.",
  },
});

module.exports = { SITE_ORIGIN, SYNTHETIC_PAGES, SYNTHETIC_PATHS };
