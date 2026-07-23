```tsx
import { Router, mountRouter } from "valyrian.js/router";

const router = new Router();
router.add("/", () => <h1>Home</h1>);
router.add("/users/:id", (request) => <h1>User {request.params.id}</h1>);
router.catch(404, () => <h1>Not found</h1>);

mountRouter("body", router);
```
