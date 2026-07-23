```ts
import { mount, onRemove, update } from "valyrian.js";
import { OfflineQueue } from "valyrian.js/offline";
import { NetworkManager } from "valyrian.js/network";

const network = new NetworkManager();
const queue = new OfflineQueue({
  id: "orders",
  network,
  handler: async (operation) => {
    await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(operation.payload),
    });
  },
});

const stop = queue.on("change", () => update());
queue.enqueue({ type: "create-order", payload: { sku: "A-1" } });

const QueueStatus = () => {
  onRemove(() => {
    stop();
    queue.destroy();
    network.destroy();
  });
  const state = queue.state();
  return `Pending: ${state.pending}; failed: ${state.failed}`;
};

mount("body", QueueStatus);
```
