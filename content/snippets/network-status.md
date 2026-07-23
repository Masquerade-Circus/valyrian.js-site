```ts
import { mount, onCreate, update } from "valyrian.js";
import { NetworkEvent, NetworkManager } from "valyrian.js/network";

const network = new NetworkManager();
let online = network.getStatus().online;

const NetworkStatus = () => {
  onCreate(() => {
    const stop = network.on(NetworkEvent.CHANGE, (status) => {
      online = status.online;
      update();
    });
    return () => {
      stop();
      network.destroy();
    };
  });
  return online ? "Online" : "Offline";
};

mount("body", NetworkStatus);
```
