```ts
import { mount } from "valyrian.js";
import { Money, formatMoney, parseMoneyInput } from "valyrian.js/money";

const subtotal = parseMoneyInput("19.90", { decimalPlaces: 2 });
const total = subtotal.add(Money.fromCents(500));

mount("body", () => formatMoney(total, { currency: "USD", locale: "en-US" }));
```
