```ts
import { mount, update } from "valyrian.js";
import { request } from "valyrian.js/request";

const api = request.new("/api", {
  allowedMethods: ["get", "post"],
});

let status = "pending";
let result = "Loading profile";

mount("body", () => `${status}: ${result}`);

try {
  const profile = await api.get("/profile");
  status = "success";
  result = JSON.stringify(profile);
} catch {
  status = "error";
  result = "Request failed";
} finally {
  update();
}
```
