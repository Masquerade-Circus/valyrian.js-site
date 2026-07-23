```ts
import { mount } from "valyrian.js";
import { createNativeStore } from "valyrian.js/native-store";

const preferences = createNativeStore("preferences");

preferences.set("theme", "dark");
const savedTheme = preferences.get("theme");
preferences.delete("theme");

mount("body", () => `Saved theme: ${savedTheme}`);
preferences.cleanup();
```
