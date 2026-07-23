```ts
import { mount } from "valyrian.js";
import { ensureIn, get, isFiniteNumber, pick } from "valyrian.js/utils";

type Input = {
  role: string;
  pageSize: number;
  profile: { name: string };
  ignored: boolean;
};

const input: Input = {
  role: "editor",
  pageSize: 20,
  profile: { name: "Arya" },
  ignored: true,
};
const safe = pick<Input, "role" | "pageSize">(input, ["role", "pageSize"]);
const role: string = safe.role;

if (!ensureIn(role, ["viewer", "editor"])) {
  throw new TypeError("Unsupported role");
}
if (!isFiniteNumber(safe.pageSize)) {
  throw new TypeError("Page size must be finite");
}

const name = get(input, "profile.name", "Anonymous");
mount("body", () => `${name}: ${role}`);
```
