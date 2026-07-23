```ts
import { mount } from "valyrian.js";
import { FormStore } from "valyrian.js/forms";

const profileForm = new FormStore({
  state: { name: "" },
  schema: {
    type: "object",
    required: ["name"],
    properties: { name: { type: "string", minLength: 1 } },
  },
  onSubmit: async (values) => console.log(values),
});

profileForm.setField("name", "Arya");
await profileForm.submit();

mount("body", () => (profileForm.success ? "Profile saved" : "Check the form"));
```
