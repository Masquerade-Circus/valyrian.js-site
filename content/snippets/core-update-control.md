```tsx
import { debouncedUpdate, mount, preventUpdate, update } from "valyrian.js";

let query = "";

const Search = () => (
  <main>
    <input
      value={query}
      oninput={(event: Event) => {
        query = (event.currentTarget as HTMLInputElement).value;
        preventUpdate();
        debouncedUpdate(150);
      }}
    />
    <button onclick={() => update()}>Refresh now</button>
  </main>
);

mount("body", Search);
```
