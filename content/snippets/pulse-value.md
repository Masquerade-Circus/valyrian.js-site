```ts
import { mount } from "valyrian.js";
import { createPulse } from "valyrian.js/pulses";

const [count, setCount] = createPulse(0);

setCount((current) => current + 1);

mount("body", () => `Count: ${count()}`);
```
