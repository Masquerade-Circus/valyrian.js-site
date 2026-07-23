```tsx
import { mount, onCreate, onRemove, unmount } from "valyrian.js";

const Clock = () => {
  onCreate(() => {
    const timer = setInterval(() => console.log(Date.now()), 1000);
    return () => clearInterval(timer);
  });
  onRemove(() => console.log("Clock removed"));
  return <time>Active</time>;
};

mount("body", Clock);
unmount();
```
