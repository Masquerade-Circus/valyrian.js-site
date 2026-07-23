```ts
import { mount } from "valyrian.js";
import { createPulse } from "valyrian.js/pulses";
import { connectPulse } from "valyrian.js/redux-devtools";

const count = connectPulse(createPulse(0), { name: "Count" });

mount("body", () => `Count: ${count[0]()}`);
```
