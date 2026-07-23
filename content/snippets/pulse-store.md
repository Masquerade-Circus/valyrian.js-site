```ts
import { mount } from "valyrian.js";
import { createPulseStore } from "valyrian.js/pulses";

const counter = createPulseStore(
  { count: 0 },
  {
    increment(state, amount = 1) {
      state.count += amount;
    },
  },
);

counter.increment(2);

mount("body", () => `Count: ${counter.state.count}`);
```
