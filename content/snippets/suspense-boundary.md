```tsx
import { mount } from "valyrian.js";
import { Suspense } from "valyrian.js/suspense";

const Profile = () => <p>Loaded profile</p>;

const Screen = () => (
  <Suspense suspenseKey="profile" fallback={<p>Loading...</p>}>
    <Profile />
  </Suspense>
);

mount("body", Screen);
```
