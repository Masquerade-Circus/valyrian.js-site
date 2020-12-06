require("./init");
let router = require("./routes");
let Pages = require("./pages");

// Assign routes to ValyrianJs
v.routes("body", router);

if (!v.isNode) {
  v.sw("/sw.js");
}

// Export what is needed for the backend
module.exports = { Pages };
