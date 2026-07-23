const { createApp, resolvePort } = require("./server/index.js");

async function start() {
  const app = createApp({ logger: true });
  const port = resolvePort(process.env);

  await app.listen({ host: "0.0.0.0", port });
}

if (require.main === module) {
  start().catch((error) => {
    process.stderr.write(`Server failed to start: ${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { start };
