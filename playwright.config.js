const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "test/e2e",
  outputDir: "tmp/playwright-results",
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:3023",
    browserName: "chromium",
    serviceWorkers: "allow",
    trace: "off",
  },
  webServer: {
    command:
      "sh -c 'rm -f tmp/playwright-server.pid && echo $$ > tmp/playwright-server.pid && exec node server.js'",
    reuseExistingServer: false,
    stderr: "pipe",
    stdout: "pipe",
    url: "http://127.0.0.1:3023",
  },
});
