```ts
import { mount } from "valyrian.js";
import { setLang, setTranslations, t } from "valyrian.js/translate";

setTranslations({ greeting: "Hello" }, { es: { greeting: "Hola" } });
setLang("es");

mount("body", () => t("greeting"));
```
