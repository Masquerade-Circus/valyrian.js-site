# T2 editorial inventory

This inventory maps the 40 approved Valyrian.js 9.1.13 sources to an adoption-oriented information architecture. It defines destinations and ownership without drafting the localized chapters.

## Editorial rules

- English remains the technical base. Spanish must preserve every contract, warning, example, link, and availability statement.
- API names, imports, modules, properties, and code remain unchanged in both languages.
- T7S reviews every source code block before T7 reuses it as a shared snippet.
- Hubs orient the reader and move detailed mechanics to their child pages.
- Dragonglass remains an internal implementation dependency and has no entry in this inventory.
- All public destinations use the same pathname in English and Spanish.

## Classification

| Type        | Editorial job                                            |
| ----------- | -------------------------------------------------------- |
| `start`     | Explain the product and help a new reader choose a path. |
| `tutorial`  | Lead the reader through a first working result.          |
| `guide`     | Teach a workflow, decision, or runtime model.            |
| `reference` | Preserve canonical contracts and API behavior.           |
| `recipe`    | Solve a bounded integration or implementation problem.   |
| `hub`       | Orient readers and connect related chapters.             |

## Source map

| Order | ID                       | Frozen source                                     | Destination                                     | Section               | Type      | Owner | Fenced blocks |
| ----: | ------------------------ | ------------------------------------------------- | ----------------------------------------------- | --------------------- | --------- | ----- | ------------: |
|     1 | `docs-index`             | `docs/toc.md`                                     | `/guides`                                       | Guides                | hub       | T7I   |             0 |
|     2 | `introduction`           | `docs/1-introduction.md`                          | `/start/introduction`                           | Start                 | start     | T7A   |             1 |
|     3 | `getting-started`        | `docs/2-getting-started.md`                       | `/start/getting-started`                        | Start                 | tutorial  | T7A   |            10 |
|     4 | `essentials`             | `docs/3-the-essentials.md`                        | `/start/essentials`                             | Start                 | guide     | T7A   |            17 |
|     5 | `runtime-core`           | `docs/3.1-runtime-core.md`                        | `/reference/runtime-core`                       | Reference             | reference | T7C   |             5 |
|     6 | `build-an-app`           | `docs/4-building-spa.md`                          | `/guides/build-an-app`                          | Build an app          | hub       | T7A   |             0 |
|     7 | `routing`                | `docs/4.1-routing-and-navigation.md`              | `/guides/build-an-app/routing`                  | Build an app          | guide     | T7A   |            15 |
|     8 | `async-workflows`        | `docs/4.2-data-fetching-and-async.md`             | `/guides/build-an-app/async-workflows`          | Build an app          | hub       | T7A   |             0 |
|     9 | `request`                | `docs/4.2.1-request.md`                           | `/guides/build-an-app/request`                  | Build an app          | reference | T7A   |             7 |
|    10 | `suspense`               | `docs/4.2.2-suspense.md`                          | `/guides/build-an-app/suspense`                 | Build an app          | reference | T7A   |             1 |
|    11 | `tasks`                  | `docs/4.2.3-tasks.md`                             | `/guides/build-an-app/tasks`                    | Build an app          | reference | T7A   |             2 |
|    12 | `query`                  | `docs/4.2.4-query.md`                             | `/guides/build-an-app/query`                    | Build an app          | reference | T7A   |             3 |
|    13 | `network`                | `docs/4.2.5-network.md`                           | `/guides/build-an-app/network`                  | Build an app          | reference | T7A   |             1 |
|    14 | `offline-queue`          | `docs/4.2.6-offline.md`                           | `/guides/build-an-app/offline-queue`            | Build an app          | reference | T7A   |             2 |
|    15 | `forms`                  | `docs/4.3-forms.md`                               | `/guides/build-an-app/forms`                    | Build an app          | guide     | T7A   |             7 |
|    16 | `state-and-performance`  | `docs/5-advanced-state-management.md`             | `/guides/state-and-performance`                 | State and performance | hub       | T7B   |             1 |
|    17 | `pulses`                 | `docs/5.2-pulses.md`                              | `/guides/state-and-performance/pulses`          | State and performance | reference | T7B   |             5 |
|    18 | `flux-store`             | `docs/5.3-flux-store.md`                          | `/guides/state-and-performance/flux-store`      | State and performance | reference | T7B   |             2 |
|    19 | `redux-devtools`         | `docs/5.4-redux-devtools.md`                      | `/guides/state-and-performance/redux-devtools`  | State and performance | guide     | T7B   |             2 |
|    20 | `performance`            | `docs/6-optimization-and-performance.md`          | `/guides/state-and-performance/performance`     | State and performance | guide     | T7B   |             3 |
|    21 | `server-and-pwa`         | `docs/7-full-stack-capability.md`                 | `/guides/server-and-pwa`                        | Server and PWA        | hub       | T7B   |             0 |
|    22 | `ssr`                    | `docs/7.1-ssr.md`                                 | `/guides/server-and-pwa/ssr`                    | Server and PWA        | guide     | T7B   |            13 |
|    23 | `node-runtime`           | `docs/7.1.1-node-runtime-apis.md`                 | `/guides/server-and-pwa/node-runtime`           | Server and PWA        | reference | T7B   |             2 |
|    24 | `isomorphic-networking`  | `docs/7.2-isomorphic-networking-and-storage.md`   | `/guides/server-and-pwa/isomorphic-networking`  | Server and PWA        | guide     | T7B   |             8 |
|    25 | `pwa-build`              | `docs/7.3-pwa-and-build-tooling.md`               | `/guides/server-and-pwa/pwa-build`              | Server and PWA        | guide     | T7B   |             4 |
|    26 | `service-worker-runtime` | `docs/7.3.1-sw-runtime.md`                        | `/guides/server-and-pwa/service-worker-runtime` | Server and PWA        | reference | T7B   |             2 |
|    27 | `server-context`         | `docs/7.4-server-context.md`                      | `/guides/server-and-pwa/server-context`         | Server and PWA        | guide     | T7B   |             1 |
|    28 | `utilities`              | `docs/8-utilities-and-ecosystem.md`               | `/guides/utilities`                             | Utilities             | hub       | T7C   |             0 |
|    29 | `translate`              | `docs/8.1-translate.md`                           | `/guides/utilities/translate`                   | Utilities             | reference | T7C   |             4 |
|    30 | `money`                  | `docs/8.2-money.md`                               | `/guides/utilities/money`                       | Utilities             | reference | T7C   |             4 |
|    31 | `native-store`           | `docs/8.3-native-store.md`                        | `/guides/utilities/native-store`                | Utilities             | reference | T7C   |             3 |
|    32 | `utils`                  | `docs/8.4-utils.md`                               | `/guides/utilities/utils`                       | Utilities             | reference | T7C   |             2 |
|    33 | `recipes`                | `docs/9-recipes-and-integrations.md`              | `/recipes`                                      | Recipes               | hub       | T7I   |             0 |
|    34 | `vite`                   | `docs/9.1-vite-integration.md`                    | `/recipes/vite`                                 | Recipes               | recipe    | T7D   |             5 |
|    35 | `webpack-rspack`         | `docs/9.2-webpack-rspack-integration.md`          | `/recipes/webpack-rspack`                       | Recipes               | recipe    | T7D   |            10 |
|    36 | `express-fastify-ssr`    | `docs/9.3-express-fastify-ssr.md`                 | `/recipes/express-fastify-ssr`                  | Recipes               | recipe    | T7D   |             7 |
|    37 | `api-client`             | `docs/9.4-api-client-composition.md`              | `/recipes/api-client`                           | Recipes               | recipe    | T7D   |             2 |
|    38 | `offline-commands`       | `docs/9.5-offline-first-commands.md`              | `/recipes/offline-commands`                     | Recipes               | recipe    | T7D   |             3 |
|    39 | `component-shapes`       | `docs/9.7-counter-variants-by-component-shape.md` | `/recipes/component-shapes`                     | Recipes               | recipe    | T7D   |            10 |
|    40 | `reactive-counters`      | `docs/9.8-reactive-counter-variants.md`           | `/recipes/reactive-counters`                    | Recipes               | recipe    | T7D   |             6 |

## Consolidation decisions

- The original table of contents becomes the Guides hub. It remains a tracked source because it carries the recommended reading sequence.
- The SPA, async, state, server, utilities, and recipes overview sources become hubs. Their child sources retain separate destinations so readers can link to canonical contracts directly.
- Runtime Core moves to Reference because it defines the canonical root-module contract.
- API-focused module pages remain inside the adoption guide that supplies their context. Reference can index them later without duplicating their content.
- The two counter collections become recipes. T7 should preserve their distinctions while reducing repeated setup through shared snippets.

## Handoff boundaries

- T6 may consume and validate `content/registry.js` but must preserve the 40 approved source mappings unless an editorial review records a change.
- T7S owns snippet extraction and verification. The fenced-block counts include code and diagrams in the frozen snapshot, so they do not create snippet IDs or assert that every block is executable.
- T7A through T7D own only the localized directories assigned in `PLAN.md`.
- T7I owns the cross-cutting Guides hub, final registry states, and glossary integration.
- S-T7D transferred only the English and Spanish Recipes hub to T7I. T7D retains every Recipes child page.
