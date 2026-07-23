# Editorial glossary

Use this glossary to keep English and Spanish chapters aligned. Code, imports, API names, module names, properties, and literal values never change.

Established technical anglicisms remain in Spanish when they identify a runtime concept, API role or toolchain contract more precisely than a translation. Explanatory prose still avoids literal calques that make the action less clear.

| English source term    | Preferred Spanish                 | Rule                                                                                                              |
| ---------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| app                    | aplicación                        | Use "app" only in code, product names, or established labels.                                                     |
| browser/server runtime | runtime de navegador y servidor   | Keep "runtime" because it names the execution model.                                                              |
| build                  | build                             | Keep the established toolchain term. Use "compilar" for the action when the sentence describes compilation.       |
| bundler                | bundler                           | Keep the established tool category and leave product names unchanged.                                             |
| callback               | callback                          | Keep the established function role. Translate only when a sentence benefits from naming the concrete action.      |
| component              | componente                        | Keep API and component identifiers unchanged.                                                                     |
| directive              | directiva                         | Keep directive names such as `v-model` unchanged.                                                                 |
| downstream             | posterior o independiente         | Translate the relationship in natural Spanish unless it forms part of quoted source terminology.                  |
| event handler          | manejador de eventos              | Avoid "handler" in explanatory Spanish.                                                                           |
| FluxStore              | `FluxStore`                       | Treat it as an API name.                                                                                          |
| full-stack             | full-stack                        | Use only when the source discusses both browser and server behavior.                                              |
| fallback               | fallback                          | Keep the established UI and control-flow term. Describe the fallback result when the consequence matters.         |
| handle                 | handle                            | Keep the object-role term and use "handles" as its Spanish plural. Exported identifiers never change.             |
| helper                 | helper                            | Keep the established code-adjacent term and use "helpers" as its Spanish plural.                                  |
| hydration              | hidratación                       | Explain the server HTML and client runtime relationship on first use.                                             |
| isomorphic             | isomórfico                        | Define it as one runtime model across browser and server.                                                         |
| middleware             | middleware                        | Keep the established technical term and clarify its role in context.                                              |
| mount                  | montar                            | Keep `mount()` unchanged.                                                                                         |
| Network Awareness      | detección del estado de red       | Keep exported API identifiers unchanged.                                                                          |
| Offline Queue          | cola offline                      | Keep module paths and API identifiers unchanged.                                                                  |
| pathname               | pathname                          | Use it for the URL path contract without the language prefix.                                                     |
| preview                | preview                           | Keep it when it names a tool command or the server mode exposed by a bundler.                                     |
| Progressive Web App    | aplicación web progresiva         | Use "PWA" after the first mention.                                                                                |
| pulse                  | pulse                             | Keep the Valyrian.js state primitive distinct from a generic "pulso".                                             |
| Query Cache            | caché de consultas                | Keep `Query` and exported identifiers unchanged.                                                                  |
| recipe                 | receta                            | Use for a bounded solution, not for canonical API behavior.                                                       |
| request-scoped         | aislado por solicitud             | Prefer the consequence over a literal calque. Keep API names unchanged.                                           |
| route                  | ruta                              | Use "navegación" for the action and "ruta" for the declared destination.                                          |
| routing                | enrutamiento                      | Use it for the navigation system. Use "ruta" for each declared destination.                                       |
| server context         | contexto del servidor             | Emphasize isolation when the context belongs to one request.                                                      |
| server-side rendering  | renderizado del lado del servidor | Use "SSR" after the first mention.                                                                                |
| service worker         | service worker                    | Keep the platform term and use masculine agreement.                                                               |
| shared snippet         | snippet compartido                | Code stays identical in English and Spanish.                                                                      |
| state                  | estado                            | Distinguish local state, shared state, and persisted state when the source does.                                  |
| storage                | storage                           | Keep the platform contract when it covers `localStorage`, `sessionStorage`, or server-compatible storage objects. |
| store                  | store                             | Keep class names such as `FormStore` and `FluxStore` unchanged.                                                   |
| Suspense               | `Suspense`                        | Treat it as an API name, not as a translated concept.                                                             |
| task                   | tarea                             | Keep `Task` and module identifiers unchanged.                                                                     |
| tooling                | herramientas                      | Use "tooling" only in code-adjacent names or quoted source terminology.                                           |
| unmount                | desmontar                         | Keep `unmount()` unchanged. Use "desmontar" for the lifecycle action and "liberar" only for its resources.        |
| update cycle           | ciclo de actualización            | Preserve the distinction between automatic and manual updates.                                                    |
| validation path        | flujo de validación               | Prefer the concrete flow over the literal calque "camino de validación".                                          |
| VNode                  | `VNode`                           | Treat it as a technical type name.                                                                                |

## Voice and availability

- Write active instructions with a visible actor and a concrete result.
- State verified capabilities directly.
- Keep limitations next to the behavior they constrain.
- Label experimental behavior as experimental when the source does.
- Describe the meta-framework and CLI as planned downstream work.
- Avoid superiority claims that the frozen source does not prove.
