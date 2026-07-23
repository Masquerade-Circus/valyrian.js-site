```ts
import { mount } from "valyrian.js";
import { FluxStore } from "valyrian.js/flux-store";

const store = new FluxStore({
  state: { count: 0 },
  mutations: {
    increment(state, amount = 1) {
      state.count += amount;
    },
  },
});

store.commit("increment", 2);

mount("body", () => `Count: ${store.state.count}`);
```
