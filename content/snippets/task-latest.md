```ts
import { mount } from "valyrian.js";
import { Task } from "valyrian.js/tasks";

const searchTask = new Task(
  async (query: string, { signal }) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal,
    });
    return response.json();
  },
  { strategy: "takeLatest" },
);

const superseded = searchTask.run("valyrian").catch(() => null);
const result = await searchTask.run("valyrian.js");
await superseded;

mount("body", () => JSON.stringify(result));
```
