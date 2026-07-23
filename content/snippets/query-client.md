```ts
import { mount } from "valyrian.js";
import { QueryClient } from "valyrian.js/query";

type Todo = { id: number; title: string };

const client = new QueryClient({ staleTime: 30_000 });
const todos = client.query({
  key: ["todos"],
  fetcher: async (): Promise<Todo[]> => (await fetch("/api/todos")).json(),
});
const addTodo = client.mutation<{ title: string }, Todo>({
  execute: async (todo) =>
    (
      await fetch("/api/todos", {
        body: JSON.stringify(todo),
        method: "POST",
      })
    ).json(),
  onSuccess: () => todos.invalidate(),
});

await todos.fetch();
await addTodo.execute({ title: "Learn Valyrian.js" });

mount(
  "body",
  () => `query: ${todos.state.status}; mutation: ${addTodo.state.status}`,
);
```
