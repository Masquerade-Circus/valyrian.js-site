# T7I editorial integration report

Reviewed on 2026-07-18 against the frozen Valyrian.js 9.1.13 snapshot.

## Inputs

| Batch | Accepted fingerprint                                               | Integrated scope                      |
| ----- | ------------------------------------------------------------------ | ------------------------------------- |
| T7A   | `db848a5261989c47634ff33819336884d58e8f9c20d5300e52b81454743dbb17` | Start and Build an app                |
| T7B   | `6254de235460945042bfe3bdccb6632ece8cd81f5dda602c3d70430f57f6ff07` | State and performance, Server and PWA |
| T7C   | `c607acc4935fe4f1dadebb948403b7dac7fba19e534e308fb119d4bc027a8482` | Utilities and Reference               |
| T7D   | `90d2f596d8e59edd69313a3364deae5a126f0db47b02f76e4b5e42e087574dfb` | Recipes child pages                   |
| T7S   | `a78c1702e93075147008cd2c00905fadbceb6e1b8db2c5aad085df3629d96675` | Shared snippet catalog                |

## Coverage and status

- The registry retains all 40 approved sources in source order.
- All 40 sources have English and Spanish files at their registered paths.
- All 40 released pages use `available` status.
- Every released page participates in content validation and search-index generation.
- Dragonglass has no public registry entry, chapter, recipe, or search document.

## Ownership and transfer

T7I owns `docs-index`, the registry, the glossary, this report, and the two Recipes hub files transferred by S-T7D. The transfer covers only `content/en/recipes.md` and `content/es/recipes.md`. T7D retains its seven Recipes child pairs.

## Editorial reconciliation

- The Guides hub turns the frozen table of contents into an adoption path and a goal-based index.
- The Recipes hub preserves the source split between integrations, reliability, and architecture patterns while excluding infrastructure instructions.
- The glossary now fixes shared treatment for build, bundler, downstream, preview, routing, and storage.
- English and Spanish hubs preserve API names, module names, commands, and pathnames.
- Internal links target registered released pages.

## Validation evidence

- `node --test "test/content/integrity.test.js"` passed 8 of 8 focused integrity tests.
- `bun run build` builds 40 registry entries and 40 available search documents per locale set.
- The generated English and Spanish search indexes each contain 40 records and include both integrated hubs.
- Direct file coverage checks cover 40 of 40 registered English variants and 40 of 40 registered Spanish variants.
- Focused Prettier validation passed for every integration source.

The fixture registry clone now resets entry status to `mapped` before each negative test. This keeps fixture tests isolated after the production registry advanced to its integrated statuses and does not change production validation behavior.

# I1 contractual coverage correction

Reviewed on 2026-07-18 against all 40 approved sources and both localized destinations. This pass retains the adoption-oriented architecture and restores the normative examples omitted when infrastructure was excluded. It documents package APIs and bounded adapters without adding deployment instructions.

## Audit method and result

- The audit compared each frozen source with its English and Spanish page for API names, signatures, availability statements, warnings, behavioral constraints, and distinct example flows.
- Fenced-block totals were used only to locate risk. Repeated setup and near-identical variants were consolidated when one example preserved the same contract.
- Before I1, 27 of the 35 sources containing fenced material had an example in both public variants. After I1, coverage is 35 of 35 in both variants.
- Public example references increased from 51 to 72 per language. The 21 restored chapter-local blocks cover the eight pages that had no example despite normative source material.
- The 8 conceptual or navigation sources without normative fenced material remain intentionally free of code examples.

## Traceable manifest

| ID                       | Contract and warning audit | Example coverage |
| ------------------------ | -------------------------- | ---------------- |
| `docs-index`             | Verified, unchanged        | Not required     |
| `introduction`           | Verified, unchanged        | Preserved        |
| `getting-started`        | Verified, unchanged        | Preserved        |
| `essentials`             | Verified, unchanged        | Preserved        |
| `runtime-core`           | Verified, unchanged        | Preserved        |
| `build-an-app`           | Verified, unchanged        | Not required     |
| `routing`                | Verified, unchanged        | Preserved        |
| `async-workflows`        | Verified, unchanged        | Not required     |
| `request`                | Verified, unchanged        | Preserved        |
| `suspense`               | Verified, unchanged        | Preserved        |
| `tasks`                  | Verified, unchanged        | Preserved        |
| `query`                  | Verified, unchanged        | Preserved        |
| `network`                | Verified, unchanged        | Preserved        |
| `offline-queue`          | Verified, unchanged        | Preserved        |
| `forms`                  | Verified, unchanged        | Preserved        |
| `state-and-performance`  | Verified, unchanged        | Restored, 0 to 1 |
| `pulses`                 | Verified, unchanged        | Preserved        |
| `flux-store`             | Verified, unchanged        | Preserved        |
| `redux-devtools`         | Verified, unchanged        | Preserved        |
| `performance`            | Verified, unchanged        | Preserved        |
| `server-and-pwa`         | Verified, unchanged        | Not required     |
| `ssr`                    | Verified, unchanged        | Restored, 0 to 4 |
| `node-runtime`           | Verified, unchanged        | Restored, 0 to 2 |
| `isomorphic-networking`  | Verified, unchanged        | Restored, 0 to 3 |
| `pwa-build`              | Verified, unchanged        | Restored, 0 to 4 |
| `service-worker-runtime` | Verified, unchanged        | Restored, 0 to 2 |
| `server-context`         | Verified, unchanged        | Restored, 0 to 1 |
| `utilities`              | Verified, unchanged        | Not required     |
| `translate`              | Verified, unchanged        | Preserved        |
| `money`                  | Verified, unchanged        | Preserved        |
| `native-store`           | Verified, unchanged        | Preserved        |
| `utils`                  | Verified, unchanged        | Preserved        |
| `recipes`                | Verified, unchanged        | Not required     |
| `vite`                   | Verified, unchanged        | Preserved        |
| `webpack-rspack`         | Verified, unchanged        | Preserved        |
| `express-fastify-ssr`    | Verified, unchanged        | Restored, 0 to 4 |
| `api-client`             | Verified, unchanged        | Preserved        |
| `offline-commands`       | Verified, unchanged        | Preserved        |
| `component-shapes`       | Verified, unchanged        | Preserved        |
| `reactive-counters`      | Verified, unchanged        | Preserved        |

## Restored normative flows

- `state-and-performance` restores the state-model decision flow.
- `ssr` restores safe state serialization, request isolation, browser mounting, router rendering, and ordered backend route adaptation.
- `node-runtime` restores `render(...)` and DOM conversion examples.
- `isomorphic-networking` restores URL rewriting, a request-scoped client, and server-side native storage setup.
- `pwa-build` restores the available `icons`, `sw`, `inline`, and `inline.uncss` calls while leaving deployment infrastructure out of scope.
- `service-worker-runtime` restores manager initialization and direct `registerSw(...)` registration.
- `server-context` restores the complete context API, including temporary-value restoration.
- `express-fastify-ssr` restores a shared per-request render boundary, bounded Express and Fastify adapters, and the browser entry.

## Technical closure

- The integrity suite fails when a source with normative fenced material loses its last approved snippet or chapter-local example in either locale. Fence totals remain a diagnostic signal rather than a contractual equality check.

# Senda scope correction

Reviewed on 2026-07-18 across the complete English and Spanish public copy.

## Public-copy rule

- Public documentation teaches developers how to use Valyrian.js APIs.
- API signatures, options, errors, timing, side effects, availability, and observable consequences remain in scope.
- Internal mechanics remain only when they explain behavior that changes correct API use.
- General development discipline, deployment guidance, infrastructure, application policy, and responsibilities outside Valyrian.js are excluded.
- English and Spanish pages apply the same scope and preserve the same public contracts.

## Editorial changes

- Start, guide, reference, utility, and recipe copy now states API behavior directly instead of prescribing a development workflow.
- Performance pages retain Valyrian.js controls such as stable keys, `v-keep`, and update APIs without teaching general profiling practice.
- Server and PWA pages retain server rendering, browser-entry requirements, storage, context, request, service-worker, and build-helper contracts without exposing unrelated implementation mechanics.
- Integration recipes retain the Valyrian.js settings required by Vite, Webpack, Rspack, Express, and Fastify without covering infrastructure or deployment.

## Technical integration

- The registry, source requirements, snippet catalog, integrity assertions, search indexes, sitemap, and build-derived files now cover the same 40 approved documents.

## Separate assigned corrections

- Public `mount()` and `mountRouter()` examples may target `body` when they demonstrate the released API signature. Documentation does not present that target as a promotional advantage or a prescribed application architecture.
- The official colored logo is already assigned and approved as the byte-for-byte SVG asset served from `/logo.svg`. Senda did not modify the logo or replace the asset with inline markup.

# Senda adoption correction

Reviewed on 2026-07-21 across the English and Spanish Markdown sources.

## Adopted rule

- Public pages show what developers can build and how to call Valyrian.js APIs.
- Imports, signatures, examples, requirements, errors, timing, side effects, and observable results remain documented.
- Component trees, VNode reconstruction, internal containers, listener traversal, patch cycles, and hydration flow diagrams are removed unless an observable API requirement depends on them.
- Server-rendering pages express browser-entry requirements through route inputs, component inputs, initial state, and mount targets rather than internal tree mechanics.
- Mounting in `body` remains in API examples where required by the released contract. It is not a product claim, architectural lesson, or adoption argument.

## Applied changes

- `introduction` now presents available capabilities and contains no runtime-flow diagram.
- `docs-index`, `getting-started`, and `essentials` direct readers toward APIs and observable behavior.
- `runtime-core` documents public inputs, results, event timing, lifecycle timing, and browser-entry requirements without describing VNode conversion or listener internals.
- `server-and-pwa`, `ssr`, `node-runtime`, and `express-fastify-ssr` retain the calls and constraints needed for integration while removing internal tree and container explanations.
- `async-workflows`, `performance`, `pulses`, `utilities`, `component-shapes`, and `isomorphic-networking` now describe developer-facing effects directly.

## Technical handoff

- The `introduction` source no longer contains a normative fenced block after the runtime-flow diagram was removed.
- The registry owner must change the `introduction` value of `fencedBlockCount` from `1` to `0`.
- The count must be corrected in the registry. The removed diagram must not be restored to satisfy the previous count.
