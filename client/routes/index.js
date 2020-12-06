let Pages = require("../pages");
let GetStarted = require("./get-started");

// Create a router
let router = v.Router();
router
  .get("/", () => Pages.Home)
  .use("/get-started", GetStarted)
  .get("/api", () => Pages.Api)
  .get("/examples", () => Pages.Examples);

module.exports = router;
