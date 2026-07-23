const siteMap = require("./site-map.js");
const snippetCatalog = require("./snippets/catalog.json");

const groups = {
  en: {
    "views-lifecycle": {
      title: "Views and lifecycle",
      introduction:
        "Build vnodes, mount an application and respond to lifecycle changes.",
    },
    routing: {
      title: "Routing",
      introduction: "Resolve routes, redirect navigation and run route hooks.",
    },
    "data-async": {
      title: "Data and async work",
      introduction:
        "Send requests, represent pending work and coordinate queries and mutations.",
    },
    "state-forms": {
      title: "State and forms",
      introduction: "Store values, run effects and validate form data.",
    },
    "network-offline-pwa": {
      title: "Network, offline and PWA",
      introduction:
        "Observe connectivity, retain queued operations and manage service worker registration.",
    },
    "ssr-server": {
      title: "SSR and server APIs",
      introduction:
        "Render on the server, isolate scopes and transform server output.",
    },
  },
  es: {
    "views-lifecycle": {
      title: "Vistas y ciclo de vida",
      introduction:
        "Crea vnodes, monta una aplicación y responde a los cambios de su ciclo de vida.",
    },
    routing: {
      title: "Enrutamiento",
      introduction:
        "Resuelve rutas, redirige la navegación y ejecuta hooks de ruta.",
    },
    "data-async": {
      title: "Datos y trabajo asíncrono",
      introduction:
        "Envía solicitudes, representa trabajo pendiente y coordina consultas y mutaciones.",
    },
    "state-forms": {
      title: "Estado y formularios",
      introduction:
        "Guarda valores, ejecuta efectos y valida datos de formularios.",
    },
    "network-offline-pwa": {
      title: "Red, offline y PWA",
      introduction:
        "Observa la conectividad, conserva operaciones en cola y administra el registro del service worker.",
    },
    "ssr-server": {
      title: "SSR y APIs de servidor",
      introduction:
        "Renderiza en el servidor, aísla ámbitos de ejecución y transforma la salida del servidor.",
    },
  },
};

const referenceGroups = {
  en: {
    "runtime-views": [
      "Runtime and views",
      "Create vnodes, mount application roots, control updates and run work through the public view lifecycle.",
    ],
    routing: [
      "Routing",
      "Resolve application routes, mount the router, redirect navigation and run route hooks.",
    ],
    "data-async": [
      "Data and async",
      "Send requests, represent pending content, coordinate tasks, and manage query and mutation state.",
    ],
    "network-offline": [
      "Network and offline",
      "Observe connectivity, handle public network events and retain suitable operations for later attempts.",
    ],
    state: [
      "State",
      "Create reactive values, organize stores, run effects and model Flux transitions.",
    ],
    forms: [
      "Forms",
      "Keep form state together and apply the schema validation path exposed by Valyrian.js.",
    ],
    devtools: [
      "DevTools",
      "Connect supported Valyrian.js state primitives to an available inspection environment.",
    ],
    utilities: [
      "Utilities",
      "Translate content, represent money, use native storage, validate values and access object paths.",
    ],
    server: [
      "Server",
      "Render views, use server storage, transform supported output and produce public server resources.",
    ],
    pwa: [
      "PWA",
      "Register a service worker and read its registration, update and failure states.",
    ],
    context: [
      "Context",
      "Create isolated execution boundaries for state and server work.",
    ],
  },
  es: {
    "runtime-views": [
      "Runtime y vistas",
      "Crea vnodes, monta raíces de aplicación, controla actualizaciones y ejecuta trabajo mediante el ciclo de vida público de las vistas.",
    ],
    routing: [
      "Enrutamiento",
      "Resuelve rutas de la aplicación, monta el router, redirige la navegación y ejecuta hooks de ruta.",
    ],
    "data-async": [
      "Datos y trabajo asíncrono",
      "Envía solicitudes, representa contenido pendiente, coordina tareas y administra el estado de consultas y mutaciones.",
    ],
    "network-offline": [
      "Red y operación offline",
      "Observa la conectividad, maneja eventos públicos de red y conserva operaciones adecuadas para intentos posteriores.",
    ],
    state: [
      "Estado",
      "Crea valores reactivos, organiza stores, ejecuta efectos y modela transiciones con Flux.",
    ],
    forms: [
      "Formularios",
      "Mantén unido el estado de un formulario y aplica el flujo de validación por esquema que expone Valyrian.js.",
    ],
    devtools: [
      "DevTools",
      "Conecta primitivas de estado compatibles de Valyrian.js con un entorno de inspección disponible.",
    ],
    utilities: [
      "Utilidades",
      "Traduce contenido, representa dinero, usa almacenamiento nativo, valida valores y accede a rutas de objetos.",
    ],
    server: [
      "Servidor",
      "Renderiza vistas, usa almacenamiento del servidor, transforma salidas compatibles y produce recursos públicos del servidor.",
    ],
    pwa: [
      "PWA",
      "Registra un service worker y lee sus estados de registro, actualización y falla.",
    ],
    context: [
      "Contexto",
      "Crea límites aislados de ejecución para el estado y el trabajo del servidor.",
    ],
  },
};

const learningPaths = {
  "learn.first-application": {
    en: [
      "Your first application",
      "Create a view, mount it, understand its lifecycle and control its updates.",
      "Start with your first application",
      ["guide.first-application", "guide.lifecycle", "guide.update-control"],
      "Choose the DOM target where `mount` will attach the root view.",
      "A mounted view with lifecycle cleanup and explicit update control.",
      "You can mount the root view, attach and clean up lifecycle work, control an update and unmount the application without leaving work active.",
    ],
    es: [
      "Tu primera aplicación",
      "Crea una vista, móntala, comprende su ciclo de vida y controla sus actualizaciones.",
      "Crear la primera aplicación",
      ["guide.first-application", "guide.lifecycle", "guide.update-control"],
      "Elige el destino del DOM donde `mount` conectará la vista raíz.",
      "Una vista montada con limpieza de ciclo de vida y control explícito de actualizaciones.",
      "Puedes montar la vista raíz, vincular y limpiar trabajo del ciclo de vida, controlar una actualización y desmontar la aplicación sin dejar trabajo activo.",
    ],
  },
  "learn.routing-data": {
    en: [
      "Routing and data",
      "Connect screens, intercept navigation, load remote data and represent asynchronous work.",
      "Add routing and data",
      [
        "guide.application-routing",
        "guide.requests",
        "guide.suspense-boundaries",
        "guide.queries-mutations",
      ],
      "Complete the first application path and identify the remote data source used by each screen.",
      "A routed application that loads remote data and exposes pending, success and failure states.",
      "You can navigate between screens, intercept a route change, load data and represent each asynchronous state without hiding failures.",
    ],
    es: [
      "Enrutamiento y datos",
      "Conecta pantallas, intercepta la navegación, carga datos remotos y representa trabajo asíncrono.",
      "Agregar enrutamiento y datos",
      [
        "guide.application-routing",
        "guide.requests",
        "guide.suspense-boundaries",
        "guide.queries-mutations",
      ],
      "Completa el recorrido de la primera aplicación e identifica la fuente de datos remotos que usa cada pantalla.",
      "Una aplicación con enrutamiento que carga datos remotos y muestra estados pendiente, exitoso y fallido.",
      "Puedes navegar entre pantallas, interceptar un cambio de ruta, cargar datos y representar cada estado asíncrono sin ocultar fallos.",
    ],
  },
  "learn.state-forms": {
    en: [
      "State and forms",
      "Choose a state primitive, organize shared values, run effects and validate user input.",
      "Manage state and forms",
      [
        "guide.reactive-values",
        "guide.reactive-stores-effects",
        "guide.flux-state",
        "guide.forms-validation",
      ],
      "Start with a mounted view and choose the Valyrian.js state primitive used by the flow.",
      "A form flow with an appropriate state primitive, explicit effects and schema validation.",
      "You can choose the state boundary, update shared values, clean up effects and reject invalid form input before submission.",
    ],
    es: [
      "Estado y formularios",
      "Elige una primitiva de estado, organiza valores compartidos, ejecuta efectos y valida entradas del usuario.",
      "Administrar estado y formularios",
      [
        "guide.reactive-values",
        "guide.reactive-stores-effects",
        "guide.flux-state",
        "guide.forms-validation",
      ],
      "Parte de una vista montada y elige la primitiva de estado de Valyrian.js que usará el flujo.",
      "Un flujo de formulario con una primitiva de estado adecuada, efectos explícitos y validación por esquema.",
      "Puedes elegir el límite del estado, actualizar valores compartidos, limpiar efectos y rechazar entradas inválidas antes del envío.",
    ],
  },
  "learn.network-offline-pwa": {
    en: [
      "Network, offline and PWA",
      "Observe connectivity, retain work in a queue and use the service worker APIs exposed by Valyrian.js.",
      "Handle connectivity changes",
      [
        "guide.network-status",
        "guide.offline-operations",
        "guide.service-worker-pwa-lifecycle",
      ],
      "Start with a browser application and choose one asynchronous operation that can be retained for a later attempt.",
      "An application that reports connectivity, retains suitable work and manages its service worker lifecycle.",
      "You can react to a network change, distinguish queued from failed work and register or update the service worker through its public lifecycle.",
    ],
    es: [
      "Red, offline y PWA",
      "Observa la conectividad, conserva trabajo en una cola y usa las APIs de service worker que expone Valyrian.js.",
      "Responder a cambios de conectividad",
      [
        "guide.network-status",
        "guide.offline-operations",
        "guide.service-worker-pwa-lifecycle",
      ],
      "Parte de una aplicación de navegador y elige una operación asíncrona que pueda conservarse para un intento posterior.",
      "Una aplicación que muestra la conectividad, conserva trabajo adecuado y administra el ciclo de vida de su service worker.",
      "Puedes responder a un cambio de red, distinguir el trabajo en cola del fallido y registrar o actualizar el service worker mediante su ciclo de vida público.",
    ],
  },
  "learn.server-rendering-execution": {
    en: [
      "Server rendering and execution",
      "Render views on the server, isolate execution scopes and use server storage and transformations.",
      "Use the server APIs",
      [
        "guide.server-side-rendering",
        "guide.server-storage",
        "guide.isolated-contexts",
        "guide.server-transformations-resources",
      ],
      "Use an isolated Valyrian.js context for values that belong to one server request.",
      "A server-rendered view with request isolation, server storage and explicit output transformations.",
      "You can render a view on the server, keep request state isolated, use server storage and transform output without leaking work across requests.",
    ],
    es: [
      "Renderizado y ejecución en servidor",
      "Renderiza vistas en el servidor, aísla ámbitos de ejecución y usa almacenamiento y transformaciones del servidor.",
      "Usar las APIs de servidor",
      [
        "guide.server-side-rendering",
        "guide.server-storage",
        "guide.isolated-contexts",
        "guide.server-transformations-resources",
      ],
      "Usa un contexto aislado de Valyrian.js para los valores que pertenecen a una solicitud del servidor.",
      "Una vista renderizada en el servidor con aislamiento por solicitud, storage del servidor y transformaciones explícitas de salida.",
      "Puedes renderizar una vista en el servidor, mantener aislado el estado de cada solicitud, usar storage del servidor y transformar la salida sin filtrar trabajo entre solicitudes.",
    ],
  },
};

const guideCopy = {
  "guide.first-application": {
    apis: ["v", "mount", "unmount"],
    en: [
      "Build your first Valyrian.js application",
      "Create a view with `v`, attach it with `mount` and remove the mounted root with `unmount`.",
      "`v` creates the vnode to render. `mount` attaches the root view. `unmount` removes it and runs registered cleanup.",
      "Limit",
      "`mount` requires a valid target. Use `unmount` to remove the mounted root.",
    ],
    es: [
      "Crea tu primera aplicación con Valyrian.js",
      "Crea una vista con `v`, conéctala con `mount` y elimina la raíz montada con `unmount`.",
      "`v` crea el vnode que se renderizará. `mount` conecta la vista raíz. `unmount` la elimina y ejecuta la limpieza registrada.",
      "Límite",
      "`mount` requiere un destino válido. Usa `unmount` para eliminar la raíz montada.",
    ],
  },
  "guide.views-directives-trusted-content": {
    apis: ["v", "directives", "trust"],
    en: [
      "Compose views and control rendered content",
      "Build a view from vnodes, attributes and child values. Use public vnode utilities when you need to inspect or transform supported vnode structures, and use directives when behavior belongs to the rendered node lifecycle.",
      "trust marks content for trusted rendering. Use it only with content whose origin and transformation you control. It does not validate or sanitize untrusted input.",
      "Limit",
      "",
    ],
    es: [
      "Compón vistas y controla el contenido renderizado",
      "Construye una vista con vnodes, atributos y valores hijos. Usa las utilidades públicas de vnode cuando necesites inspeccionar o transformar estructuras compatibles. Usa directivas cuando el comportamiento pertenezca al ciclo de vida del nodo renderizado.",
      "trust marca contenido para renderizado confiable. Úsalo únicamente con contenido cuyo origen y transformación controles. Esta API no valida ni sanitiza entradas que provienen de fuentes no confiables.",
      "Límite",
      "",
    ],
  },
  "guide.lifecycle": {
    apis: ["onCreate", "onUpdate", "onCleanup", "onRemove"],
    en: [
      "Run work through the view lifecycle",
      "Use lifecycle hooks to attach work to the moments when a view enters, changes within or leaves the rendered tree.",
      "Keep setup and cleanup paired so a removed view does not retain subscriptions or external resources.",
      "Limit",
      "A hook should coordinate the lifecycle phase documented by its contract. Do not depend on undocumented ordering between unrelated views.",
    ],
    es: [
      "Ejecuta trabajo durante el ciclo de vida de una vista",
      "Usa los hooks de ciclo de vida para vincular trabajo con los momentos en que una vista entra, cambia dentro o sale del árbol renderizado.",
      "Mantén juntas la preparación y la limpieza para que una vista desmontada no conserve suscripciones ni recursos externos.",
      "Límite",
      "Cada hook debe coordinar la fase que documenta su contrato. No dependas de un orden no documentado entre vistas independientes.",
    ],
  },
  "guide.update-control": {
    apis: ["update", "debouncedUpdate", "preventUpdate"],
    en: [
      "Control when views update",
      "Use update for a public runtime update, debouncedUpdate to group repeated requests and preventUpdate when an interaction must finish without the update that would normally follow it.",
      "Use `update` immediately, `debouncedUpdate` for repeated requests and `preventUpdate` to suppress the current interaction update.",
      "Limit",
      "",
    ],
    es: [
      "Controla cuándo se actualizan las vistas",
      "Usa update para solicitar una actualización al runtime, debouncedUpdate para agrupar solicitudes repetidas y preventUpdate cuando una interacción deba terminar sin la actualización que normalmente ocurriría después.",
      "Usa `update` de inmediato, `debouncedUpdate` para solicitudes repetidas y `preventUpdate` para suprimir la actualización de la interacción actual.",
      "Límite",
      "",
    ],
  },
  "guide.application-routing": {
    apis: ["Router", "mountRouter"],
    en: [
      "Connect views with the Valyrian.js router",
      "Create a Router from the routes your application exposes, then connect it to the application with mountRouter.",
      "The router resolves the current location and selects the matching route flow.",
      "Error",
      "Handle unmatched or invalid navigation through the public router error flow. Do not assume that every location resolves successfully.",
    ],
    es: [
      "Conecta vistas con el router de Valyrian.js",
      "Crea un Router con las rutas que expone tu aplicación y conéctalo mediante mountRouter.",
      "El router resuelve la ubicación actual y selecciona el flujo de la ruta correspondiente.",
      "Error",
      "Maneja las navegaciones inválidas o sin coincidencia mediante el flujo público de errores del router. No supongas que todas las ubicaciones se resolverán correctamente.",
    ],
  },
  "guide.navigation-hooks-redirects-errors": {
    apis: ["redirect", "beforeRoute", "afterRoute", "RouterError"],
    en: [
      "Control the route transition",
      "Use beforeRoute for work before a route completes, afterRoute for work tied to a completed transition and redirect when navigation should continue at another supported location.",
      "`beforeRoute` and `afterRoute` run during route transitions. `RouterError` represents router failures.",
      "Error",
      "A failed route transition enters the `RouterError` flow.",
    ],
    es: [
      "Controla la transición entre rutas",
      "Usa beforeRoute para el trabajo previo a completar una ruta, afterRoute para el trabajo de una transición completada y redirect cuando la navegación deba continuar en otra ubicación compatible.",
      "`beforeRoute` y `afterRoute` se ejecutan durante las transiciones. `RouterError` representa fallas del router.",
      "Error",
      "Una transición fallida entra en el flujo de `RouterError`.",
    ],
  },
  "guide.requests": {
    apis: ["request"],
    en: [
      "Send requests with Valyrian.js",
      "Use request to start an HTTP operation through the public client API.",
      "`request` returns its successful result or enters its rejection path.",
      "Error",
      "Rejected requests enter the error path of the calling flow.",
    ],
    es: [
      "Envía solicitudes con Valyrian.js",
      "Usa request para iniciar una operación HTTP mediante la API pública del cliente.",
      "`request` devuelve el resultado exitoso o entra en su flujo de rechazo.",
      "Error",
      "Las solicitudes rechazadas entran en el flujo de error de la llamada.",
    ],
  },
  "guide.suspense-boundaries": {
    apis: ["Suspense"],
    en: [
      "Represent content that is still resolving",
      "Use Suspense around supported asynchronous content when the view needs a defined pending boundary.",
      "`Suspense` renders its fallback while asynchronous content resolves.",
      "Error",
      "A pending boundary and a failed operation describe different states. Handle failures through the error path of the underlying operation.",
    ],
    es: [
      "Representa contenido que todavía se está resolviendo",
      "Usa Suspense alrededor de contenido asíncrono compatible cuando la vista necesite un límite pendiente definido.",
      "`Suspense` renderiza su fallback mientras se resuelve el contenido asíncrono.",
      "Error",
      "Un límite pendiente y una operación fallida representan estados distintos. Maneja las fallas mediante el camino de error de la operación subyacente.",
    ],
  },
  "guide.asynchronous-tasks": {
    apis: ["Task"],
    en: [
      "Coordinate replaceable asynchronous work",
      "Use Task when an interaction can start new work before earlier work finishes and only the current supported result should drive the application flow.",
      "`Task` exposes the state of the current asynchronous run.",
      "Limit",
      "Task coordinates work according to its contract. It does not make external side effects reversible.",
    ],
    es: [
      "Coordina trabajo asíncrono reemplazable",
      "Usa Task cuando una interacción pueda iniciar trabajo nuevo antes de que termine el anterior y solo el resultado actual compatible deba controlar el flujo.",
      "`Task` expone el estado de la ejecución asíncrona actual.",
      "Límite",
      "Task coordina el trabajo conforme a su contrato. No vuelve reversibles los efectos externos.",
    ],
  },
  "guide.queries-mutations": {
    apis: ["QueryClient", "QueryHandle", "MutationHandle"],
    en: [
      "Coordinate server data with QueryClient",
      "Use QueryClient as the shared coordinator for supported query and mutation flows.",
      "Read QueryHandle and MutationHandle states from the application layer that renders progress, results and recovery actions.",
      "Error",
      "Keep query and mutation failures distinguishable. A failed mutation may require a different recovery action from a failed read.",
    ],
    es: [
      "Coordina datos del servidor con QueryClient",
      "Usa QueryClient como coordinador compartido de los flujos compatibles de consulta y mutación.",
      "Lee los estados de QueryHandle y MutationHandle desde la capa que representa progreso, resultados y acciones de recuperación.",
      "Error",
      "Mantén distinguibles las fallas de consultas y mutaciones. Una mutación fallida puede requerir una recuperación distinta de una lectura fallida.",
    ],
  },
  "guide.reactive-values": {
    apis: ["createPulse"],
    en: [
      "Share a reactive value with createPulse",
      "`createPulse` returns operations to read, update and dispose one reactive value.",
      "Read and change it through the operations exposed by the returned value.",
      "Limit",
      "Each `createPulse` call creates one independent reactive value.",
    ],
    es: [
      "Comparte un valor reactivo con createPulse",
      "`createPulse` devuelve operaciones para leer, actualizar y desechar un valor reactivo.",
      "Léelo y modifícalo mediante las operaciones que expone el valor devuelto.",
      "Límite",
      "Cada llamada a `createPulse` crea un valor reactivo independiente.",
    ],
  },
  "guide.reactive-stores-effects": {
    apis: ["createPulseStore", "createMutableStore", "createEffect"],
    en: [
      "Organize reactive state and its effects",
      "Use createPulseStore for the pulse-store contract, createMutableStore for the public mutable-store model and createEffect for work that reacts to supported state changes.",
      "`createPulseStore` and `createMutableStore` expose different state models. `createEffect` returns a disposer.",
      "Limit",
      "The two store creators expose different contracts. Consult their reference entries before choosing by name alone.",
    ],
    es: [
      "Organiza estado reactivo y sus efectos",
      "Usa createPulseStore para el contrato de pulse store, createMutableStore para el modelo público de store mutable y createEffect para trabajo que reacciona a cambios compatibles.",
      "`createPulseStore` y `createMutableStore` exponen modelos distintos. `createEffect` devuelve una función de limpieza.",
      "Límite",
      "Los dos creadores de stores exponen contratos distintos. Consulta sus entradas de referencia antes de elegir solo por el nombre.",
    ],
  },
  "guide.flux-state": {
    apis: ["FluxStore"],
    en: [
      "Organize state transitions with FluxStore",
      "Use FluxStore when the application benefits from the action and state-transition model exposed by its public contract.",
      "Committed mutations update the `FluxStore` state rendered by the application.",
      "Limit",
      "",
    ],
    es: [
      "Organiza transiciones de estado con FluxStore",
      "Usa FluxStore cuando la aplicación se beneficie del modelo de acciones y transiciones que expone su contrato público.",
      "Las mutaciones confirmadas actualizan el estado de `FluxStore` que renderiza la aplicación.",
      "Límite",
      "",
    ],
  },
  "guide.devtools-integration": {
    apis: ["connectPulse", "connectPulseStore", "connectFluxStore"],
    en: [
      "Inspect Valyrian.js state with DevTools",
      "Connect the state primitive that your application already uses with the matching public connector.",
      "Follow the returned connection lifecycle documented by the API.",
      "Error",
      "DevTools may be unavailable. The application must continue without an active inspection connection.",
    ],
    es: [
      "Inspecciona el estado de Valyrian.js con DevTools",
      "Conecta la primitiva de estado que ya usa tu aplicación mediante el conector público correspondiente.",
      "Sigue el ciclo de vida de la conexión que documenta la API.",
      "Error",
      "DevTools puede no estar disponible. La aplicación debe continuar sin una conexión activa de inspección.",
    ],
  },
  "guide.forms-validation": {
    apis: ["FormStore", "formSchemaShield"],
    en: [
      "Manage form values and validation",
      "Use FormStore to keep supported form values, errors and interaction state together. Use formSchemaShield for the schema validation path exposed by Valyrian.js.",
      "`FormStore` exposes values, validation errors, interaction state and submission state together.",
      "Error",
      "Separate validation failures from submission failures because they require different responses.",
    ],
    es: [
      "Administra valores y validación de formularios",
      "Usa FormStore para mantener juntos los valores, errores y estados de interacción compatibles. Usa formSchemaShield para el flujo de validación por esquema.",
      "`FormStore` expone juntos los valores, errores de validación y estados de interacción y envío.",
      "Error",
      "Separa las fallas de validación de las fallas de envío porque requieren respuestas distintas.",
    ],
  },
  "guide.network-status": {
    apis: ["NetworkManager", "NetworkEvent", "NetworkError"],
    en: [
      "Respond to connectivity changes",
      "Use NetworkManager to observe the network state exposed by Valyrian.js and NetworkEvent values to update the application flow.",
      "Connectivity is a signal, not proof that a remote operation will succeed.",
      "Limit",
      "Keep request errors and network status as related but distinct states.",
    ],
    es: [
      "Responde a los cambios de conectividad",
      "Usa NetworkManager para observar el estado de red y los valores de NetworkEvent para actualizar el flujo de la aplicación.",
      "La conectividad es una señal, no una prueba de que una operación remota tendrá éxito.",
      "Límite",
      "Mantén los errores de solicitud y el estado de red como condiciones relacionadas pero distintas.",
    ],
  },
  "guide.offline-operations": {
    apis: ["OfflineQueue"],
    en: [
      "Retain supported work in an offline queue",
      "Use OfflineQueue when an operation can wait until the application can attempt it again.",
      "`OfflineQueue` exposes queued, retried and failed operations.",
      "Error",
      "A queued operation can still fail when retried. Preserve a recoverable failed state rather than presenting it as completed.",
    ],
    es: [
      "Conserva trabajo compatible en una cola offline",
      "Usa OfflineQueue cuando una operación pueda esperar hasta que la aplicación tenga condiciones para intentarla de nuevo.",
      "`OfflineQueue` expone operaciones en cola, reintentadas y fallidas.",
      "Error",
      "Una operación encolada todavía puede fallar durante el reintento. Conserva un estado fallido recuperable en lugar de presentarla como completada.",
    ],
  },
  "guide.service-worker-pwa-lifecycle": {
    apis: ["SwRuntimeManager", "registerSw"],
    en: [
      "Connect the application to its service worker",
      "Use `registerSw` to register the service worker and `SwRuntimeManager` to read registration states.",
      "`SwRuntimeManager` exposes registration progress, availability and failure states.",
      "Limit",
      "",
    ],
    es: [
      "Conecta la aplicación con su service worker",
      "Usa `registerSw` para registrar el service worker y `SwRuntimeManager` para leer los estados del registro.",
      "`SwRuntimeManager` expone los estados de progreso, disponibilidad y falla del registro.",
      "Límite",
      "",
    ],
  },
  "guide.server-side-rendering": {
    apis: ["render"],
    en: [
      "Render Valyrian.js views on the server",
      "Use the server render API to turn a supported Valyrian.js view into the output defined by its public contract.",
      "The `render` call receives the view and the inputs required by its public contract.",
      "Limit",
      "",
    ],
    es: [
      "Renderiza vistas de Valyrian.js en el servidor",
      "Usa la API render del servidor para convertir una vista compatible en la salida que define su contrato público.",
      "La llamada a `render` recibe la vista y las entradas requeridas por su contrato público.",
      "Límite",
      "",
    ],
  },
  "guide.server-storage": {
    apis: ["ServerStorage"],
    en: [
      "Keep server values within their intended execution",
      "Use ServerStorage for values that belong to the supported server execution flow.",
      "`ServerStorage` creates, reads and updates values within the active server execution.",
      "Limit",
      "",
    ],
    es: [
      "Mantén los valores del servidor dentro de su ejecución",
      "Usa ServerStorage para valores que pertenecen al flujo compatible de ejecución en el servidor.",
      "`ServerStorage` crea, lee y actualiza valores dentro de la ejecución activa del servidor.",
      "Límite",
      "",
    ],
  },
  "guide.isolated-contexts": {
    apis: ["createContextScope", "runWithContext"],
    en: [
      "Isolate Valyrian.js execution with scopes",
      "Use the public context APIs to create an execution boundary for state that must not leak into independent work.",
      "Run related rendering and storage operations inside that boundary.",
      "Limit",
      "Keep references created inside a scope within the lifetime documented for that scope.",
    ],
    es: [
      "Aísla la ejecución de Valyrian.js mediante ámbitos",
      "Usa las APIs públicas de contexto para crear un límite de ejecución alrededor del estado que no debe filtrarse hacia trabajo independiente.",
      "Ejecuta dentro de ese límite las operaciones relacionadas de renderizado y almacenamiento.",
      "Límite",
      "Mantén las referencias creadas dentro de un ámbito durante la vigencia documentada para ese ámbito.",
    ],
  },
  "guide.server-transformations-resources": {
    apis: ["inline", "icons", "sw"],
    en: [
      "Transform supported server output and resources",
      "Use public server transformations to change supported output before delivery.",
      "Use inline, icon helpers and service worker resources only with the input and output types documented by their contracts.",
      "Error",
      "Unsupported input enters the public error path of the transformation API.",
    ],
    es: [
      "Transforma salidas y recursos compatibles del servidor",
      "Usa las transformaciones públicas del servidor para cambiar una salida compatible antes de entregarla.",
      "Usa inline, los helpers de iconos y los recursos del service worker solo con los tipos documentados por sus contratos.",
      "Error",
      "Las entradas incompatibles entran en el flujo público de error de la API de transformación.",
    ],
  },
  "guide.translation": {
    apis: ["getLang", "setLang", "setTranslations", "t"],
    en: [
      "Translate application content",
      "Use the public translation utilities to resolve a message for the active locale and render it in the view that owns it.",
      "Keep message identifiers stable across supported locales.",
      "Error",
      "When `t` cannot resolve a translation, it returns the documented fallback.",
    ],
    es: [
      "Traduce contenido de la aplicación",
      "Usa las utilidades públicas de traducción para resolver un mensaje en el idioma activo y renderízalo en la vista que lo controla.",
      "Mantén estables los identificadores de mensajes entre los idiomas compatibles.",
      "Error",
      "Cuando `t` no puede resolver una traducción, devuelve el fallback documentado.",
    ],
  },
  "guide.money": {
    apis: ["Money", "NumberFormatter", "formatMoney", "parseMoneyInput"],
    en: [
      "Represent money with the Valyrian.js utilities",
      "Use the public money utilities with the value, currency and locale forms accepted by their contracts.",
      "The money utilities preserve the numeric amount separately from its localized representation.",
      "Error",
      "Formatting returns a localized representation and does not change the `Money` amount.",
    ],
    es: [
      "Representa dinero con las utilidades de Valyrian.js",
      "Usa las utilidades públicas de dinero con los valores, monedas e idiomas que acepten sus contratos.",
      "Las utilidades de dinero conservan separadas la cantidad numérica y su representación localizada.",
      "Error",
      "El formato devuelve una representación localizada y no cambia la cantidad `Money`.",
    ],
  },
  "guide.native-storage": {
    apis: ["StorageType", "createNativeStore"],
    en: [
      "Persist supported values in native storage",
      "Use the native storage utilities to read, write and remove values through the public Valyrian.js contract.",
      "",
      "Error",
      "",
    ],
    es: [
      "Persiste valores compatibles en almacenamiento nativo",
      "Usa las utilidades de almacenamiento nativo para leer, escribir y eliminar valores mediante el contrato público de Valyrian.js.",
      "",
      "Error",
      "",
    ],
  },
  "guide.validation-object-paths": {
    apis: ["ensureIn", "get", "pick", "set"],
    en: [
      "Validate values and access nested data",
      "Public validators report whether a value satisfies their configured rule.",
      "Use object-path utilities to access supported nested paths without duplicating traversal logic.",
      "Limit",
      "Each validator checks only the rule represented by its API.",
    ],
    es: [
      "Valida valores y accede a datos anidados",
      "Los validadores públicos informan si un valor satisface la regla configurada.",
      "Usa las utilidades de rutas de objetos para acceder a rutas anidadas sin duplicar la lógica de recorrido.",
      "Límite",
      "Cada validador comprueba únicamente la regla que representa su API.",
    ],
  },
};

const recipeCopy = {
  "core-mount": [
    "Mount and unmount an application",
    "Connect a root view with `mount`, then remove it with `unmount`.",
    "Montar y desmontar una aplicación",
    "Conecta una vista raíz con `mount` y elimínala con `unmount`.",
  ],
  "core-lifecycle": [
    "Clean up work when a view leaves",
    "Pair lifecycle setup with cleanup when the rendered view is removed.",
    "Limpiar trabajo cuando una vista sale",
    "Acompaña la preparación del ciclo de vida con su limpieza cuando se desmonte la vista renderizada.",
  ],
  "core-update-control": [
    "Group repeated view updates",
    "Choose the public update path that matches one direct, repeated or prevented update.",
    "Agrupar actualizaciones repetidas",
    "Elige el camino público que corresponda con una actualización directa, repetida o impedida.",
  ],
  "router-basic": [
    "Mount a routed application",
    "Connect route resolution to the application root.",
    "Montar una aplicación con enrutamiento",
    "Conecta la resolución de rutas con la raíz de la aplicación.",
  ],
  "request-client": [
    "Load data from a view",
    "Represent the pending, successful and failed outcomes of a request.",
    "Cargar datos desde una vista",
    "Representa los estados pendiente, exitoso y fallido de una solicitud.",
  ],
  "suspense-boundary": [
    "Show a pending content boundary",
    "Give supported asynchronous content a defined pending state.",
    "Mostrar un límite de contenido pendiente",
    "Da a un contenido asíncrono compatible un estado pendiente definido.",
  ],
  "task-latest": [
    "Keep the latest asynchronous task",
    "Prevent an older supported result from replacing the current task result.",
    "Conservar la tarea asíncrona más reciente",
    "Evita que un resultado anterior compatible sustituya el resultado de la tarea actual.",
  ],
  "query-client": [
    "Coordinate a query and a mutation",
    "Read the public state of server-data operations from their handles.",
    "Coordinar una consulta y una mutación",
    "Lee el estado público de las operaciones de datos desde sus handles.",
  ],
  "network-status": [
    "React to connectivity changes",
    "Update the application flow from the public network events.",
    "Reaccionar a cambios de conectividad",
    "Actualiza el flujo de la aplicación a partir de los eventos públicos de red.",
  ],
  "offline-queue": [
    "Retry queued work after connectivity returns",
    "Retain a suitable operation and handle the result of a later attempt.",
    "Reintentar trabajo en cola al recuperar conexión",
    "Conserva una operación adecuada y maneja el resultado de un intento posterior.",
  ],
  "form-store": [
    "Validate and submit a form",
    "Keep form values, validation and submission outcomes distinguishable.",
    "Validar y enviar un formulario",
    "Mantén distinguibles los valores, la validación y los resultados del envío.",
  ],
  "pulse-value": [
    "Share one reactive value",
    "`createPulse` returns a reader and a setter for one reactive value.",
    "Compartir un valor reactivo",
    "`createPulse` devuelve una función de lectura y una de actualización para un valor reactivo.",
  ],
  "pulse-store": [
    "Organize structured reactive state",
    "Keep related values and effects in the supported store flow.",
    "Organizar estado reactivo estructurado",
    "Mantén valores y efectos relacionados dentro del flujo compatible del store.",
  ],
  "flux-store": [
    "Model named state transitions",
    "Drive state changes through the public FluxStore contract.",
    "Modelar transiciones de estado con nombre",
    "Controla cambios de estado mediante el contrato público de FluxStore.",
  ],
  "redux-devtools": [
    "Inspect state with DevTools",
    "Connect the matching Valyrian.js state primitive without making inspection required at runtime.",
    "Inspeccionar estado con DevTools",
    "Conecta la primitiva correspondiente sin volver obligatoria la inspección durante la ejecución.",
  ],
  "translate-basic": [
    "Translate a view",
    "Resolve visible content for the active locale.",
    "Traducir una vista",
    "Resuelve el contenido visible para el idioma activo.",
  ],
  "money-basic": [
    "Format a money value",
    "Produce a supported locale-aware representation while keeping the underlying amount separate.",
    "Formatear un valor monetario",
    "Produce una representación compatible con el idioma y conserva separada la cantidad original.",
  ],
  "native-store": [
    "Persist a local value",
    "Read, write and remove a value through the public native storage contract.",
    "Persistir un valor local",
    "Lee, escribe y elimina un valor mediante el contrato público de almacenamiento nativo.",
  ],
  "utils-validation": [
    "Validate data and read a nested path",
    "Apply a public validator and access supported nested data.",
    "Validar datos y leer una ruta anidada",
    "Aplica un validador público y accede a datos anidados compatibles.",
  ],
};

const recipeDetails = {
  "core-mount": {
    en: [
      "Define one root view that renders the application content.",
      "Mount the view in `body`, then call `unmount` to remove the mounted root.",
      "The root renders, and `unmount` removes it and runs registered cleanup.",
      "Call `unmount` after `mount` to remove the current root.",
    ],
    es: [
      "Define una vista raíz que renderice el contenido de la aplicación.",
      "Monta la vista en `body` y llama a `unmount` para eliminar la raíz montada.",
      "La raíz se renderiza, y `unmount` la elimina y ejecuta la limpieza registrada.",
      "Llama a `unmount` después de `mount` para eliminar la raíz actual.",
    ],
  },
  "core-lifecycle": {
    en: [
      "Create a view that starts external work when it enters the rendered tree.",
      "Register the timer with onCreate, return its cleanup, observe removal with onRemove and finish by unmounting the view.",
      "Removing the view clears the timer and runs the registered removal callback.",
      "Every external resource started by a lifecycle callback needs matching cleanup.",
    ],
    es: [
      "Crea una vista que inicie trabajo externo al entrar en el árbol renderizado.",
      "Registra el temporizador con onCreate, devuelve su limpieza, observa la salida con onRemove y termina desmontando la vista.",
      "Al desmontar la vista, el temporizador se cancela y se ejecuta el callback de salida.",
      "Cada recurso externo iniciado por un callback del ciclo de vida necesita una limpieza correspondiente.",
    ],
  },
  "core-update-control": {
    en: [
      "Define a search value and expose immediate and delayed update paths.",
      "Prevent the input event update, request a debounced update after 150 milliseconds and keep a button for an immediate update.",
      "Typing groups repeated refreshes while the button requests the current view immediately.",
      "`debouncedUpdate` schedules the latest requested update after the delay.",
    ],
    es: [
      "Define un valor de búsqueda y ofrece actualizaciones inmediatas y diferidas.",
      "Impide la actualización del evento de entrada, solicita una actualización agrupada después de 150 milisegundos y conserva un botón para actualizar de inmediato.",
      "La escritura agrupa actualizaciones repetidas y el botón solicita la vista actual de inmediato.",
      "`debouncedUpdate` programa la actualización solicitada más reciente después del retraso.",
    ],
  },
  "router-basic": {
    en: [
      "Create a router with a home route, one parameterized route and a 404 handler.",
      "Register each route, read the user identifier from route parameters and mount the router in body.",
      "The router renders the matching heading or the not-found response for an unmatched location.",
      "Keep route paths and fallback behavior explicit in the router definition.",
    ],
    es: [
      "Crea un router con una ruta de inicio, una ruta con parámetro y un manejador para 404.",
      "Registra cada ruta, lee el identificador del usuario desde sus parámetros y monta el router en body.",
      "El router renderiza el encabezado correspondiente o la respuesta de página no encontrada.",
      "Mantén explícitas las rutas y el comportamiento alternativo en la definición del router.",
    ],
  },
  "request-client": {
    en: [
      "Create a request client for the API base path and represent pending, successful and failed states.",
      "Mount the status view, request the profile, update the result in try or catch and refresh the view in finally.",
      "The page moves from loading to either the serialized profile or a recoverable failure message.",
      "A rejected request enters `catch` before the view refreshes in `finally`.",
    ],
    es: [
      "Crea un cliente de solicitudes para la ruta base de la API y representa los estados pendiente, exitoso y fallido.",
      "Monta la vista de estado, solicita el perfil, actualiza el resultado en try o catch y refresca la vista en finally.",
      "La página pasa de la carga al perfil serializado o a un mensaje de falla recuperable.",
      "Una solicitud rechazada entra en `catch` antes de que la vista se actualice en `finally`.",
    ],
  },
  "suspense-boundary": {
    en: [
      "Wrap profile content in a pending boundary with an explicit fallback.",
      "Give Suspense a stable key, provide the loading view and mount the screen that owns the boundary.",
      "The screen has a defined loading state while the supported content resolves.",
      "Handle operation failures separately from the pending fallback.",
    ],
    es: [
      "Envuelve el contenido del perfil en un límite pendiente con una alternativa explícita.",
      "Asigna a Suspense una clave estable, proporciona la vista de carga y monta la pantalla que controla el límite.",
      "La pantalla cuenta con un estado de carga definido mientras se resuelve el contenido compatible.",
      "Maneja las fallas de la operación por separado de la alternativa pendiente.",
    ],
  },
  "task-latest": {
    en: [
      "Create a search task whose latest run supersedes earlier work.",
      "Pass the task signal to fetch, start two searches and await the newest result before mounting it.",
      "The rendered result belongs to the latest search instead of the superseded request.",
      "Cancellation coordinates the task result but does not reverse external effects.",
    ],
    es: [
      "Crea una tarea de búsqueda cuya ejecución más reciente sustituya el trabajo anterior.",
      "Pasa la señal de la tarea a fetch, inicia dos búsquedas y espera el resultado más nuevo antes de montarlo.",
      "El resultado renderizado pertenece a la búsqueda más reciente y no a la solicitud sustituida.",
      "La cancelación coordina el resultado de la tarea, pero no revierte efectos externos.",
    ],
  },
  "query-client": {
    en: [
      "Create one query for a todo list and one mutation that adds a todo.",
      "Fetch the list, execute the mutation, invalidate the query after success and render both operation states.",
      "The mutation triggers query invalidation and the view reports separate query and mutation statuses.",
      "Keep read failures and change failures distinguishable because they require different recovery actions.",
    ],
    es: [
      "Crea una consulta para una lista de pendientes y una mutación que agregue un elemento.",
      "Carga la lista, ejecuta la mutación, invalida la consulta después del éxito y renderiza los estados de ambas operaciones.",
      "La mutación invalida la consulta y la vista informa por separado el estado de la consulta y el de la mutación.",
      "Distingue las fallas de lectura de las fallas de cambio porque requieren recuperaciones distintas.",
    ],
  },
  "network-status": {
    en: [
      "Read the initial connectivity state and observe subsequent network changes.",
      "Subscribe when the view is created, update the rendered status on each change and destroy the manager during cleanup.",
      "The view switches between Online and Offline as public network events arrive.",
      "Connectivity does not guarantee that a remote operation will succeed.",
    ],
    es: [
      "Lee el estado inicial de conectividad y observa los cambios posteriores de la red.",
      "Suscríbete al crear la vista, actualiza el estado renderizado con cada cambio y destruye el administrador durante la limpieza.",
      "La vista alterna entre Online y Offline conforme llegan los eventos públicos de red.",
      "La conectividad no garantiza que una operación remota tendrá éxito.",
    ],
  },
  "offline-queue": {
    en: [
      "Create an order queue with a network manager and an asynchronous delivery handler.",
      "Subscribe to queue changes, enqueue one order, render pending and failed counts, then release the subscription, queue and network manager on removal.",
      "The view exposes queued and failed work while the queue attempts suitable operations later.",
      "A queued operation may still fail. Never present it as completed until processing succeeds.",
    ],
    es: [
      "Crea una cola de pedidos con un administrador de red y un manejador asíncrono de entrega.",
      "Suscríbete a los cambios, encola un pedido, renderiza los conteos pendientes y fallidos, y libera la suscripción, la cola y el administrador de red al desmontar la vista.",
      "La vista muestra cuántas operaciones siguen pendientes y cuántas fallaron mientras la cola intenta procesar el trabajo adecuado.",
      "Una operación encolada todavía puede fallar. No la presentes como completada hasta que el procesamiento termine correctamente.",
    ],
  },
  "form-store": {
    en: [
      "Create a profile form with one required name field and an asynchronous submit handler.",
      "Set the name, submit the form and render success only after the store reports a successful submission.",
      "The example submits Arya and renders either Profile saved or a prompt to check the form.",
      "Keep validation failures separate from submission failures.",
    ],
    es: [
      "Crea un formulario de perfil con un nombre obligatorio y un manejador asíncrono de envío.",
      "Asigna el nombre, envía el formulario y renderiza el éxito únicamente cuando el store informe un envío correcto.",
      "El ejemplo envía Arya y muestra Profile saved o una indicación para revisar el formulario.",
      "Mantén separadas las fallas de validación y las fallas de envío.",
    ],
  },
  "pulse-value": {
    en: [
      "Create one reactive counter value with its reader and setter.",
      "Increment the current value through the setter and render the value returned by the reader.",
      "The mounted view displays Count: 1.",
      "This `createPulse` call exposes one reader and one setter.",
    ],
    es: [
      "Crea un contador reactivo con su función de lectura y su función de actualización.",
      "Incrementa el valor actual mediante la función de actualización y renderiza el valor de la función de lectura.",
      "La vista montada muestra Count: 1.",
      "Esta llamada a `createPulse` expone una función de lectura y una de actualización.",
    ],
  },
  "pulse-store": {
    en: [
      "Create a reactive store with a named increment operation.",
      "Change the state count through increment and render the resulting public store state.",
      "Calling increment with 2 produces a rendered count of 2.",
      "The pulse store returns related values and named operations in one store.",
    ],
    es: [
      "Crea un store reactivo con una operación de incremento con nombre.",
      "Cambia el conteo del estado mediante increment y renderiza el estado público resultante del store.",
      "Llamar a increment con 2 produce un conteo renderizado de 2.",
      "El pulse store devuelve valores relacionados y operaciones con nombre en un solo store.",
    ],
  },
  "flux-store": {
    en: [
      "Create a Flux store with one named mutation.",
      "Commit increment with an amount of 2 and render the resulting store state.",
      "The named transition changes the rendered count from 0 to 2.",
      "`FluxStore` applies this change through the named `increment` mutation.",
    ],
    es: [
      "Crea un store de Flux con una mutación con nombre.",
      'Ejecuta commit("increment", 2) y renderiza el estado resultante del store.',
      "La transición con nombre cambia el conteo renderizado de 0 a 2.",
      "`FluxStore` aplica este cambio mediante la mutación `increment`.",
    ],
  },
  "redux-devtools": {
    en: [
      "Create a pulse and connect it to the available DevTools inspection flow.",
      "Name the connection Count and render the reader returned by the connected pulse.",
      "The application renders the pulse value and can expose its changes to an available inspection environment.",
      "When DevTools is unavailable, the connected pulse still returns its reader.",
    ],
    es: [
      "Crea un pulse y conéctalo con el flujo de inspección disponible en DevTools.",
      "Nombra Count a la conexión y renderiza la función de lectura que devuelve el pulse conectado.",
      "La aplicación renderiza el valor y puede exponer sus cambios a un entorno de inspección disponible.",
      "Cuando DevTools no está disponible, el pulse conectado conserva su función de lectura.",
    ],
  },
  "translate-basic": {
    en: [
      "Register English and Spanish messages and select Spanish as the active language.",
      "Set both dictionaries, activate es and render the greeting resolved by t.",
      "The mounted view displays Hola for the active language.",
      "Keep message keys stable across supported languages.",
    ],
    es: [
      "Registra mensajes en inglés y español, y selecciona español como idioma activo.",
      "Configura ambos diccionarios, activa es y renderiza el saludo que resuelve t.",
      "La vista montada muestra Hola para el idioma activo.",
      "Mantén estables las claves de los mensajes entre los idiomas compatibles.",
    ],
  },
  "money-basic": {
    en: [
      "Parse a decimal subtotal, add five dollars in cents and format the total for US dollars.",
      "Parse 19.90 with two decimal places, add Money.fromCents(500) and format the result with en-US and USD.",
      "The view renders the locale-aware representation of a 24.90 USD total.",
      "Formatting represents a value. It does not validate a business transaction.",
    ],
    es: [
      "Interpreta un subtotal decimal, agrega cinco dólares en centavos y formatea el total en dólares estadounidenses.",
      "Interpreta 19.90 con dos decimales, agrega Money.fromCents(500) y formatea el resultado con en-US y USD.",
      "La vista renderiza la representación localizada de un total de 24.90 USD.",
      "El formato representa un valor. No valida una transacción del negocio.",
    ],
  },
  "native-store": {
    en: [
      "Create a native store for application preferences.",
      "Write the theme, read it, delete the stored key, render the captured value and clean up the store.",
      "The view displays the saved dark theme even though the key is removed before cleanup.",
      "",
    ],
    es: [
      "Crea un store nativo para las preferencias de la aplicación.",
      "Escribe el tema, léelo, elimina la clave almacenada, renderiza el valor capturado y limpia el store.",
      "La vista muestra el tema dark que se leyó antes de eliminar la clave y limpiar el store.",
      "",
    ],
  },
  "utils-validation": {
    en: [
      "Select allowed fields, validate their values and read one nested profile value.",
      "Pick role and pageSize, check the allowed role and finite number, then read profile.name with a fallback.",
      "Valid input renders Arya: editor. Unsupported roles and non-finite page sizes raise explicit type errors.",
      "The validators check the selected role and finite-number rules.",
    ],
    es: [
      "Selecciona los campos permitidos, valida sus valores y lee un dato anidado del perfil.",
      "Elige role y pageSize, comprueba el rol permitido y el número finito, y lee profile.name con un valor alternativo.",
      "Una entrada válida renderiza Arya: editor. Los roles incompatibles y los tamaños no finitos producen errores de tipo explícitos.",
      "Los validadores comprueban las reglas seleccionadas de rol y número finito.",
    ],
  },
};

const namedSummaries = {
  v: [
    "Creates the vnode description that Valyrian.js renders as part of a view.",
    "Crea la descripción vnode que Valyrian.js renderiza como parte de una vista.",
  ],
  mount: [
    "Connects a root view to a supported target and starts its runtime lifecycle.",
    "Conecta una vista raíz con un destino compatible e inicia su ciclo de vida en el runtime.",
  ],
  unmount: [
    "Removes the mounted root and ends its mounted lifecycle.",
    "Retira la raíz montada y termina su ciclo de vida montado.",
  ],
  update: [
    "Requests a view update through the public runtime.",
    "Solicita una actualización de la vista mediante el runtime público.",
  ],
  debouncedUpdate: [
    "Groups repeated update requests according to the timing behavior of the public API.",
    "Agrupa solicitudes repetidas de actualización según el comportamiento temporal de la API pública.",
  ],
  preventUpdate: [
    "Prevents the update that would normally follow a supported interaction.",
    "Impide la actualización que normalmente seguiría a una interacción compatible.",
  ],
  trust: [
    "Renders the supplied HTML string without validating or sanitizing it.",
    "Renderiza la cadena HTML proporcionada sin validarla ni sanitizarla.",
  ],
  Router: [
    "Coordinates route definitions and resolves navigation through the public router flow.",
    "Coordina definiciones de rutas y resuelve la navegación mediante el flujo público del router.",
  ],
  RouterError: [
    "Represents a router failure exposed for application-level handling.",
    "Representa una falla del router expuesta para su manejo en la aplicación.",
  ],
  mountRouter: [
    "Connects a router to the mounted application flow.",
    "Conecta un router con el flujo montado de la aplicación.",
  ],
  redirect: [
    "Continues navigation at a different supported location.",
    "Continúa la navegación en otra ubicación compatible.",
  ],
  beforeRoute: [
    "Registers work that runs before a supported route transition completes.",
    "Registra trabajo que se ejecuta antes de completar una transición de ruta compatible.",
  ],
  afterRoute: [
    "Registers work associated with a completed route transition.",
    "Registra trabajo asociado con una transición de ruta completada.",
  ],
  request: [
    "Starts an HTTP operation through the public Valyrian.js client API.",
    "Inicia una operación HTTP mediante la API pública de cliente de Valyrian.js.",
  ],
  Suspense: [
    "Defines a pending boundary around supported asynchronous content.",
    "Define un límite pendiente alrededor de contenido asíncrono compatible.",
  ],
  Task: [
    "Coordinates asynchronous work whose current result may replace an earlier one.",
    "Coordina trabajo asíncrono cuyo resultado actual puede sustituir uno anterior.",
  ],
  QueryClient: [
    "Coordinates the supported query and mutation flows shared by an application.",
    "Coordina los flujos compatibles de consultas y mutaciones que comparte una aplicación.",
  ],
  QueryHandle: [
    "Exposes the public state and operations of a query.",
    "Expone el estado y las operaciones públicas de una consulta.",
  ],
  MutationHandle: [
    "Exposes the public state and operations of a mutation.",
    "Expone el estado y las operaciones públicas de una mutación.",
  ],
  NetworkManager: [
    "Exposes the network state and event flow supported by Valyrian.js.",
    "Expone el estado de red y el flujo de eventos compatibles con Valyrian.js.",
  ],
  NetworkEvent: [
    "Identifies a public event in the supported network flow.",
    "Identifica un evento público dentro del flujo compatible de red.",
  ],
  NetworkError: [
    "Represents a public network failure that the application can handle.",
    "Representa una falla pública de red que la aplicación puede manejar.",
  ],
  OfflineQueue: [
    "Retains suitable operations for a later processing attempt.",
    "Conserva operaciones adecuadas para un intento posterior de procesamiento.",
  ],
  createPulse: [
    "Creates one reactive value through the pulse contract.",
    "Crea un valor reactivo mediante el contrato de pulse.",
  ],
  createPulseStore: [
    "Creates a reactive store through the pulse-store contract.",
    "Crea un store reactivo mediante el contrato de pulse store.",
  ],
  createMutableStore: [
    "Creates a store that follows the public mutable-state contract.",
    "Crea un store que sigue el contrato público de estado mutable.",
  ],
  createEffect: [
    "Creates work that reacts to supported state changes.",
    "Crea trabajo que reacciona a cambios de estado compatibles.",
  ],
  FluxStore: [
    "Organizes state through the public Flux action and transition model.",
    "Organiza estado mediante el modelo público de acciones y transiciones de Flux.",
  ],
  FormStore: [
    "Keeps the supported values, errors and interaction state of a form together.",
    "Mantiene juntos los valores, errores y estados de interacción compatibles de un formulario.",
  ],
  formSchemaShield: [
    "Applies the schema validation path exposed for Valyrian.js forms.",
    "Aplica el flujo de validación por esquema que se expone para formularios de Valyrian.js.",
  ],
  connectPulse: [
    "Connects a pulse to the supported DevTools inspection flow.",
    "Conecta un pulse con el flujo compatible de inspección de DevTools.",
  ],
  connectPulseStore: [
    "Connects a pulse store to the supported DevTools inspection flow.",
    "Conecta un pulse store con el flujo compatible de inspección de DevTools.",
  ],
  connectFluxStore: [
    "Connects a Flux store to the supported DevTools inspection flow.",
    "Conecta un Flux store con el flujo compatible de inspección de DevTools.",
  ],
  render: [
    "Produces server output from a supported Valyrian.js view.",
    "Produce una salida de servidor a partir de una vista compatible de Valyrian.js.",
  ],
  ServerStorage: [
    "Stores values through the public server storage contract.",
    "Guarda valores mediante el contrato público de almacenamiento del servidor.",
  ],
  inline: [
    "Processes a supported resource through the public server inlining API.",
    "Procesa un recurso compatible mediante la API pública de integración en línea del servidor.",
  ],
  SwRuntimeManager: [
    "Exposes the supported service worker runtime lifecycle to the application.",
    "Expone a la aplicación el ciclo de vida compatible del runtime del service worker.",
  ],
  registerSw: [
    "Starts the supported service worker registration flow.",
    "Inicia el flujo compatible de registro del service worker.",
  ],
  t: [
    "Resolves a translated message by path and replaces the provided parameters.",
    "Resuelve un mensaje traducido mediante su ruta y sustituye los parámetros proporcionados.",
  ],
  get: [
    "Reads a nested value by path and returns the provided fallback when needed.",
    "Lee un valor anidado mediante su ruta y devuelve el valor alternativo cuando hace falta.",
  ],
  set: [
    "Writes a value at a nested object path.",
    "Escribe un valor en una ruta anidada de un objeto.",
  ],
  createContextScope: [
    "Creates a named context boundary for values that belong to one execution flow.",
    "Crea un ámbito de contexto con nombre para los valores que pertenecen a un flujo de ejecución.",
  ],
  getContext: [
    "Reads the value associated with a context boundary in the active execution.",
    "Lee el valor asociado con un ámbito de contexto dentro de la ejecución activa.",
  ],
  hasContext: [
    "Reports whether the active execution contains a value for a context boundary.",
    "Indica si la ejecución activa contiene un valor para un ámbito de contexto.",
  ],
  runWithContext: [
    "Runs a synchronous or asynchronous callback with a value bound to a context boundary.",
    "Ejecuta un callback síncrono o asíncrono con un valor asociado a un ámbito de contexto.",
  ],
  setContext: [
    "Binds a value to a context boundary and returns a function that restores the previous state.",
    "Asocia un valor con un ámbito de contexto y devuelve una función que restaura el estado anterior.",
  ],
};

Object.assign(namedSummaries, {
  onCreate: [
    "Registers work for the moment a view enters the rendered tree.",
    "Registra trabajo para el momento en que una vista entra en el árbol renderizado.",
  ],
  onUpdate: [
    "Registers work that runs after a view update.",
    "Registra trabajo que se ejecuta después de actualizar una vista.",
  ],
  onCleanup: [
    "Registers cleanup work for the current view lifecycle.",
    "Registra trabajo de limpieza para el ciclo de vida de la vista actual.",
  ],
  onRemove: [
    "Registers work for the moment a view leaves the rendered tree.",
    "Registra trabajo para el momento en que una vista sale del árbol renderizado.",
  ],
  directive: [
    "Registers a named directive for use on rendered nodes.",
    "Registra una directiva con nombre para usarla en nodos renderizados.",
  ],
  directives: [
    "Exposes the registered runtime directives by name.",
    "Expone por nombre las directivas registradas en el runtime.",
  ],
  Vnode: [
    "Represents a virtual node with its tag, properties, children and lifecycle state.",
    "Representa un nodo virtual con su etiqueta, propiedades, hijos y estado del ciclo de vida.",
  ],
  createElement: [
    "Creates a DOM or SVG element for the requested tag.",
    "Crea un elemento del DOM o SVG para la etiqueta solicitada.",
  ],
  current: [
    "Exposes the vnode, component and event currently processed by the runtime.",
    "Expone el vnode, el componente y el evento que procesa el runtime en ese momento.",
  ],
  fragment: [
    "Identifies a fragment that groups children without adding a wrapper element.",
    "Identifica un fragmento que agrupa hijos sin agregar un elemento contenedor.",
  ],
  hydrateDomToVnode: [
    "Builds a vnode representation from an existing DOM value.",
    "Construye una representación vnode a partir de un valor existente del DOM.",
  ],
  isComponent: [
    "Checks whether a value satisfies a supported component shape.",
    "Comprueba si un valor cumple una forma de componente compatible.",
  ],
  isNodeJs: [
    "Reports whether Valyrian.js is running in a Node.js environment.",
    "Indica si Valyrian.js se ejecuta en un entorno de Node.js.",
  ],
  isPOJOComponent: [
    "Checks whether a value is a plain-object component with a view.",
    "Comprueba si un valor es un componente de objeto plano con una vista.",
  ],
  isVnode: [
    "Checks whether a value is a Valyrian.js vnode.",
    "Comprueba si un valor es un vnode de Valyrian.js.",
  ],
  isVnodeComponent: [
    "Checks whether a value is a vnode whose tag is a component.",
    "Comprueba si un valor es un vnode cuya etiqueta es un componente.",
  ],
  reservedProps: [
    "Exposes property names reserved by Valyrian.js.",
    "Expone los nombres de propiedades reservados por Valyrian.js.",
  ],
  setAttribute: [
    "Applies one property value to the DOM represented by a vnode.",
    "Aplica el valor de una propiedad al DOM representado por un vnode.",
  ],
  setPropNameReserved: [
    "Marks a property name for special runtime handling.",
    "Marca el nombre de una propiedad para que el runtime lo maneje de forma especial.",
  ],
  updateAttributes: [
    "Reconciles the properties of a new vnode with its previous DOM state.",
    "Concilia las propiedades de un vnode nuevo con su estado anterior en el DOM.",
  ],
  updateVnode: [
    "Updates the DOM rendered for a vnode and returns server output when produced.",
    "Actualiza el DOM renderizado para un vnode y devuelve la salida de servidor cuando se produce.",
  ],
  getLang: [
    "Returns the active translation language.",
    "Devuelve el idioma de traducción activo.",
  ],
  getTranslations: [
    "Returns the configured translation dictionaries.",
    "Devuelve los diccionarios de traducción configurados.",
  ],
  setLang: [
    "Selects one configured translation language.",
    "Selecciona uno de los idiomas de traducción configurados.",
  ],
  setLog: [
    "Enables or disables translation logging.",
    "Activa o desactiva el registro de la traducción.",
  ],
  setStoreStrategy: [
    "Configures how the translation module reads and persists the active language.",
    "Configura cómo el módulo de traducción lee y conserva el idioma activo.",
  ],
  setTranslations: [
    "Sets the default dictionary and merges dictionaries for additional languages.",
    "Configura el diccionario predeterminado y combina los diccionarios de idiomas adicionales.",
  ],
  Money: [
    "Represents a monetary amount in integer cents and provides arithmetic operations.",
    "Representa una cantidad monetaria en centavos enteros y ofrece operaciones aritméticas.",
  ],
  NumberFormatter: [
    "Builds and transforms a numeric value before locale-aware formatting.",
    "Construye y transforma un valor numérico antes de aplicarle un formato localizado.",
  ],
  formatMoney: [
    "Formats a Money or numeric value with the requested currency and locale options.",
    "Formatea un valor Money o numérico con las opciones solicitadas de moneda e idioma.",
  ],
  parseMoneyInput: [
    "Parses a localized text value into a Money amount.",
    "Interpreta un texto localizado y lo convierte en una cantidad Money.",
  ],
  StorageType: [
    "Identifies the native storage strategies accepted by createNativeStore.",
    "Identifica las estrategias de almacenamiento nativo que acepta createNativeStore.",
  ],
  createNativeStore: [
    "Creates a named store with the selected storage type, or returns it when reuse is enabled.",
    "Crea un store con nombre mediante el tipo seleccionado o lo devuelve cuando se habilita su reutilización.",
  ],
  deepCloneUnfreeze: [
    "Creates a mutable deep clone of the provided value.",
    "Crea una copia profunda y mutable del valor proporcionado.",
  ],
  deepFreeze: [
    "Freezes an object graph recursively.",
    "Congela de forma recursiva el grafo de un objeto.",
  ],
  ensureIn: [
    "Checks whether a value belongs to an allowed collection.",
    "Comprueba si un valor pertenece a una colección permitida.",
  ],
  hasChanged: [
    "Checks whether the current value differs from the previous value.",
    "Comprueba si el valor actual difiere del valor anterior.",
  ],
  hasLength: [
    "Checks whether a value has the requested length.",
    "Comprueba si un valor tiene la longitud solicitada.",
  ],
  hasLengthBetween: [
    "Checks whether a value length falls within an inclusive range.",
    "Comprueba si la longitud de un valor está dentro de un intervalo inclusivo.",
  ],
  hasMaxLength: [
    "Checks whether a value stays within a maximum length.",
    "Comprueba si un valor respeta una longitud máxima.",
  ],
  hasMinLength: [
    "Checks whether a value reaches a minimum length.",
    "Comprueba si un valor alcanza una longitud mínima.",
  ],
  is: [
    "Checks whether a value matches the requested type or constructor.",
    "Comprueba si un valor coincide con el tipo o constructor solicitado.",
  ],
  isBetween: [
    "Checks whether a numeric value falls within an inclusive range.",
    "Comprueba si un valor numérico está dentro de un intervalo inclusivo.",
  ],
  isBoolean: [
    "Checks for a boolean value.",
    "Comprueba si un valor es booleano.",
  ],
  isEmpty: [
    "Checks whether a supported value contains no data.",
    "Comprueba si un valor compatible no contiene datos.",
  ],
  isFiniteNumber: [
    "Checks for a finite numeric value.",
    "Comprueba si un valor es un número finito.",
  ],
  isFunction: [
    "Checks for a function.",
    "Comprueba si un valor es una función.",
  ],
  isGreaterThan: [
    "Checks whether a numeric value exceeds a limit.",
    "Comprueba si un valor numérico supera un límite.",
  ],
  isLessThan: [
    "Checks whether a numeric value stays below a limit.",
    "Comprueba si un valor numérico es menor que un límite.",
  ],
  isNumber: [
    "Checks for a numeric value.",
    "Comprueba si un valor es numérico.",
  ],
  isObject: [
    "Checks for an object value.",
    "Comprueba si un valor es un objeto.",
  ],
  isString: [
    "Checks for a string value.",
    "Comprueba si un valor es una cadena.",
  ],
  pick: [
    "Creates an object with the selected keys from a source value.",
    "Crea un objeto con las claves seleccionadas de un valor de origen.",
  ],
  Event: [
    "Represents a server-side DOM event with propagation and cancellation state.",
    "Representa un evento del DOM en el servidor con estado de propagación y cancelación.",
  ],
  document: [
    "Exposes the server-side document used by the DOM utilities.",
    "Expone el documento del servidor que utilizan las funciones del DOM.",
  ],
  domToHtml: [
    "Serializes a server-side DOM value as HTML.",
    "Serializa como HTML un valor del DOM del servidor.",
  ],
  domToHyperscript: [
    "Serializes server-side child nodes as hyperscript source.",
    "Serializa nodos hijos del servidor como código hyperscript.",
  ],
  htmlToDom: [
    "Parses HTML into a server-side DOM value.",
    "Interpreta HTML y produce un valor del DOM del servidor.",
  ],
  htmlToHyperscript: [
    "Converts HTML text into hyperscript source.",
    "Convierte texto HTML en código hyperscript.",
  ],
  icons: [
    "Generates icon resources and their related links from a source image.",
    "Genera recursos de iconos y sus enlaces relacionados a partir de una imagen de origen.",
  ],
  sw: [
    "Builds a service worker resource with the requested server options.",
    "Construye un recurso de service worker con las opciones de servidor solicitadas.",
  ],
  isServerContextActive: [
    "Reports whether server context storage is active for the current execution.",
    "Indica si el almacenamiento de contexto del servidor está activo para la ejecución actual.",
  ],
});

const referenceContracts = {
  v: "(tagOrComponent: VnodeTag, props: Properties | null, ...children: Children): Vnode",
  mount:
    "(dom: string | DomElement, component: ValyrianComponent | VnodeComponentInterface | any): string",
  unmount: "(): string",
  update: "(): string",
  debouncedUpdate: "(timeout?: number): void",
  preventUpdate: "(): void",
  onCreate: "(callback: OnCreateCallback): void",
  onUpdate: "(callback: OnUpdateCallback): void",
  onCleanup: "(callback: Function): void",
  onRemove: "(callback: Function): void",
  directive: "(name: string, directive: Directive): void",
  directives: "Record<string, Directive>",
  trust: "(htmlString: string): (string | void | VnodeWithDom | null)[]",
  Vnode:
    "(tag: VnodeTag, props: null | Properties, children: Children, key?: string | number | undefined, dom?: DomElement | undefined, isSVG?: boolean | undefined, oldChildComponents?: Set<ValyrianComponent> | undefined, childComponents?: Set<ValyrianComponent> | undefined, hasKeys?: boolean | undefined, oncreate?: Set<Function> | undefined, oncleanup?: Set<Function> | undefined, onupdate?: Set<Function> | undefined, onremove?: Set<Function> | undefined): Vnode",
  createElement: "(tag: string, isSVG: boolean): DomElement",
  current:
    "{ oldVnode: Vnode | null; vnode: Vnode | null; component: ValyrianComponent | null; event: Event | null; }",
  fragment: "typeof fragment",
  hydrateDomToVnode: "(dom: any): VnodeWithDom | string | null | void",
  isComponent: "(component: unknown): component is Component",
  isNodeJs: "boolean",
  isPOJOComponent: "(component: unknown): component is POJOComponent",
  isVnode: "(object?: unknown): object is Vnode",
  isVnodeComponent: "(object?: unknown): object is VnodeComponentInterface",
  reservedProps: "Set<string>",
  setAttribute: "(name: string, value: any, newVnode: VnodeWithDom): void",
  setPropNameReserved: "(name: string): void",
  updateAttributes: "(newVnode: VnodeWithDom, oldVnode?: VnodeWithDom): void",
  updateVnode: "(vnode: VnodeWithDom, shouldCleanup?: boolean): string | void",
  Router: "(pathPrefix?: string): Router",
  RouterError:
    "(message?: string): { status: number | undefined; name: string; message: string; stack?: string; cause?: unknown; }\n(message?: string, options?: ErrorOptions): { status: number | undefined; name: string; message: string; stack?: string; cause?: unknown; }",
  mountRouter: "(elementContainer: string | any, router: Router): void",
  redirect:
    "(url: string, parentComponent?: Component | POJOComponent | VnodeComponentInterface, preventPushState?: boolean): Promise<string | void>",
  beforeRoute: "(callback: RouteCallback): () => void",
  afterRoute: "(callback: RouteCallback): () => void",
  request:
    "(method: string, url: string, data?: Record<string, any> | null, options?: Partial<SendOptions>): any | Response",
  Suspense:
    "({ suspenseKey, fallback, error }: SuspenseProps, children: Children): Vnode",
  Task: "<TArgs = void, TResult = unknown>(handler: TaskHandler<TArgs, TResult>, options?: TaskOptions<TArgs, TResult>): Task<TArgs, TResult>",
  QueryClient: "(options?: QueryClientOptions): QueryClient",
  QueryHandle:
    "<TData>(entry: CacheEntry<TData>, fetch: () => Promise<TData | null>, invalidate: () => void): QueryHandle<TData>",
  MutationHandle:
    "<TPayload, TResult>(state: QueryState<TResult>, execute: (payload: TPayload) => Promise<TResult>, reset: () => void): MutationHandle<TPayload, TResult>",
  NetworkManager: "(options?: NetworkManagerOptions): NetworkManager",
  NetworkEvent: "typeof NetworkEvent",
  NetworkError:
    "(message?: string): NetworkError\n(message?: string, options?: ErrorOptions): NetworkError",
  OfflineQueue: "(options: OfflineQueueOptions): OfflineQueue",
  createPulse:
    "<T>(initialValue: T): [() => T, (newValue: T | ((current: T) => T)) => void, () => void]",
  createPulseStore:
    "<StateType extends State, PulsesType extends Record<string, Pulse<StateType, any>>>(initialState: StateType, pulses: PulsesType & ThisType<PulsesType & PulseContext>): StorePulses<PulsesType> & { state: ProxyState<StateType>; on: (event: string, callback: Function) => void; off: (event: string, callback: Function) => void; }",
  createMutableStore:
    "<StateType extends State, PulsesType extends Record<string, Pulse<StateType, any>>>(initialState: StateType, pulses: PulsesType & ThisType<PulsesType & PulseContext>): StorePulses<PulsesType> & { state: ProxyState<StateType>; on: (event: string, callback: Function) => void; off: (event: string, callback: Function) => void; }",
  createEffect: "(effect: Function): () => void",
  FluxStore:
    "({ state, mutations, actions, getters, modules, shouldFreeze, namespace, rootStore }?: StoreOptions): FluxStore",
  FormStore:
    "<TState extends FormState>(options: FormOptions<TState>): FormStore<TState>",
  formSchemaShield: "SchemaShield",
  connectPulse: "(pulse: any, options?: DevToolsOptions): any",
  connectPulseStore: "(store: any, options?: DevToolsOptions): void",
  connectFluxStore: "(store: FluxStore, options?: DevToolsOptions): void",
  getLang: "(): string",
  getTranslations: "(): Record<string, Record<string, any>>",
  setLang: "(newLang: string): void",
  setLog: "(value: boolean): void",
  setStoreStrategy:
    "(strategy: { get: () => string; set: (lang: string) => void; }): void",
  setTranslations:
    "(defaultTranslation: Record<string, any>, newTranslations?: Record<string, Record<string, any>>): void",
  t: "(path: string, params?: Record<string, string>): string",
  Money: "(): Money",
  NumberFormatter: "(): NumberFormatter",
  formatMoney: "(value: Money | number, options?: MoneyFormatOptions): string",
  parseMoneyInput:
    "(value: string, options?: { locale?: Intl.LocalesArgument; decimalPlaces?: number; }): Money",
  StorageType: "typeof StorageType",
  createNativeStore:
    "<T>(id: string, definition?: Record<string, any>, storageType?: StorageType, reuseIfExist?: boolean): NativeStorageInterface & T",
  deepCloneUnfreeze:
    "<T>(obj: T, cloneClassInstances?: boolean, seen?: WeakMap<WeakKey, any>): T",
  deepFreeze:
    "(obj: any, freezeClassInstances?: boolean, seen?: WeakSet<WeakKey>): any",
  ensureIn: "<T>(value: T, allowed: readonly T[]): boolean",
  get: "(obj: unknown, path: string, defaultValue?: unknown): any",
  hasChanged: "(prev: any, current: any): boolean",
  hasLength: "(value: any, length: number): boolean",
  hasLengthBetween: "(value: any, min: number, max: number): boolean",
  hasMaxLength: "(value: any, length: number): boolean",
  hasMinLength: "(value: any, length: number): boolean",
  is: "<T>(value: any, type: string | any): value is T",
  isBetween: "(value: any, min: number, max: number): boolean",
  isBoolean: "(value: any): value is boolean",
  isEmpty: "(value: any): boolean",
  isFiniteNumber: "(value: any): value is number",
  isFunction: "(value: any): value is Function",
  isGreaterThan: "(value: any, limit: number): boolean",
  isLessThan: "(value: any, limit: number): boolean",
  isNumber: "(value: any): value is number",
  isObject: "(value: any): value is object",
  isString: "(value: any): value is string",
  pick: "<T extends object, K extends keyof T>(source: any, keys: K[]): Pick<T, K>",
  set: "(obj: any, path: string, value: any): void",
  Event: "(type: string, options?: EventInit): Event",
  ServerStorage: "(): ServerStorage",
  document: "Document",
  domToHtml:
    "(dom: Element | Text | DocumentFragment, rawText?: boolean): string",
  domToHyperscript: "(childNodes: ChildNodes, depth?: number): string",
  htmlToDom: "(html: string): Element | Text | DocumentFragment",
  htmlToHyperscript: "(html: string): string",
  icons: "(source: string, configuration?: IconsOptions): Promise<void>",
  inline:
    "(file: string | { raw: string; map?: string | null; file: string; }, options?: Record<string, any>): Promise<{ raw: string; map: string | null; file: string; }>",
  render: "(...args: any[]): string",
  sw: "(file: string, options?: SwOptions): void",
  SwRuntimeManager: "(options?: CreateSwRuntimeOptions): SwRuntimeManager",
  registerSw:
    "(file?: string, options?: RegistrationOptions, navigatorRef?: Navigator | null): Promise<ServiceWorkerRegistration | undefined>",
  createContextScope: "<T>(name: string): ContextScope<T>",
  getContext: "<T>(scope: ContextScope<T>): T | undefined",
  hasContext: "<T>(scope: ContextScope<T>): boolean",
  isServerContextActive: "(): boolean",
  runWithContext:
    "<T, TResult>(scope: ContextScope<T>, value: T, callback: () => TResult): TResult\n<T, TResult>(scope: ContextScope<T>, value: T, callback: () => Promise<TResult>): Promise<TResult>",
  setContext: "<T>(scope: ContextScope<T>, value: T): () => void",
};

const referenceEffects = {
  mount: [
    "Connects the application root to the selected DOM target and starts an update.",
    "Conecta la raíz de la aplicación con el destino del DOM seleccionado e inicia una actualización.",
  ],
  unmount: [
    "Removes the mounted root and runs registered removal and cleanup callbacks.",
    "Elimina la raíz montada y ejecuta los callbacks registrados de salida y limpieza.",
  ],
  update: [
    "Updates the mounted root with the current component.",
    "Actualiza la raíz montada con el componente actual.",
  ],
  debouncedUpdate: [
    "Schedules the latest requested update after the delay.",
    "Programa la actualización solicitada más reciente después del retraso.",
  ],
  directive: [
    "Registers or replaces the directive under its name.",
    "Registra o sustituye la directiva mediante su nombre.",
  ],
  trust: [
    "Parses the supplied string through innerHTML without sanitizing it.",
    "Interpreta la cadena proporcionada mediante innerHTML sin sanitizarla.",
  ],
  mountRouter: [
    "Mounts the router on the target and starts route resolution.",
    "Monta el router en el destino e inicia la resolución de rutas.",
  ],
  request: [
    "Starts an HTTP operation through the configured request client.",
    "Inicia una operación HTTP mediante el cliente de solicitudes configurado.",
  ],
  createPulse: [
    "Changing the pulse value notifies the reactive flow that owns it.",
    "Cambiar el valor del pulse notifica al flujo reactivo que lo controla.",
  ],
  createEffect: [
    "Runs reactive work and returns a function that disposes it.",
    "Ejecuta trabajo reactivo y devuelve una función para desecharlo.",
  ],
  setLang: [
    "Changes the active translation language through the configured storage strategy.",
    "Cambia el idioma de traducción activo mediante la estrategia de almacenamiento configurada.",
  ],
  setLog: [
    "Changes whether missing translation activity is logged.",
    "Cambia si se registra la actividad de traducciones faltantes.",
  ],
  setStoreStrategy: [
    "Replaces the strategy used to read and persist the active language.",
    "Sustituye la estrategia utilizada para leer y conservar el idioma activo.",
  ],
  setTranslations: [
    "Replaces the default dictionary and updates dictionaries for additional languages.",
    "Sustituye el diccionario predeterminado y actualiza los diccionarios de idiomas adicionales.",
  ],
  createNativeStore: [
    "Creates the named store with the selected storage type.",
    "Crea el store con nombre mediante el tipo de almacenamiento seleccionado.",
  ],
  set: [
    "Creates missing path segments and writes the value into the source object.",
    "Crea los segmentos faltantes de la ruta y escribe el valor en el objeto de origen.",
  ],
  icons: [
    "Reads the source image and writes the configured icon resources and links.",
    "Lee la imagen de origen y escribe los recursos de iconos y enlaces configurados.",
  ],
  inline: [
    "Reads or transforms the supplied resource and resolves an output object asynchronously.",
    "Lee o transforma el recurso proporcionado y resuelve de forma asíncrona un objeto de salida.",
  ],
  sw: [
    "Transforms and writes the requested service worker resource.",
    "Transforma y escribe el recurso de service worker solicitado.",
  ],
  setContext: [
    "Changes the value associated with a context boundary and returns a restoration function.",
    "Cambia el valor asociado con un ámbito de contexto y devuelve una función de restauración.",
  ],
};

const referenceErrors = {
  Router: [
    "Router operations reject invalid middleware, invalid error conditions, circular error handling and subrouter misuse with RouterError.",
    "Las operaciones del router rechazan middleware inválido, condiciones de error incompatibles, manejo circular de errores y uso incorrecto de subrouters mediante RouterError.",
  ],
  beforeRoute: [
    "Throws RouterError when the router is not mounted or the call occurs outside a component context.",
    "Lanza RouterError cuando el router no está montado o la llamada ocurre fuera del contexto de un componente.",
  ],
  afterRoute: [
    "Throws RouterError when the router is not mounted or the call occurs outside a component context.",
    "Lanza RouterError cuando el router no está montado o la llamada ocurre fuera del contexto de un componente.",
  ],
  Suspense: [
    "Throws when rendered outside a component or without suspenseKey.",
    "Lanza un error cuando se renderiza fuera de un componente o sin suspenseKey.",
  ],
  NetworkManager: [
    "Throws NetworkError for an unavailable navigator, an unavailable connection or an invalid event type.",
    "Lanza NetworkError cuando no hay navigator, no hay conexión disponible o el tipo de evento es inválido.",
  ],
  OfflineQueue: [
    "Throws TypeError when options.network is missing.",
    "Lanza TypeError cuando falta options.network.",
  ],
  FluxStore: [
    "Throws for invalid mutation paths, duplicate namespaces and invalid store functions.",
    "Lanza errores ante rutas de mutación inválidas, namespaces duplicados y funciones incompatibles del store.",
  ],
  setLang: [
    "Throws when the requested language has no configured dictionary.",
    "Lanza un error cuando el idioma solicitado no tiene un diccionario configurado.",
  ],
  Money: [
    "Division throws when the divisor is zero.",
    "La división lanza un error cuando el divisor es cero.",
  ],
  createNativeStore: [
    "Throws when a store with the same identifier already exists and reuse is not enabled.",
    "Lanza un error cuando ya existe un store con el mismo identificador y no se habilitó su reutilización.",
  ],
  inline: [
    "Rejects unknown file types and transformation errors.",
    "Rechaza tipos de archivo desconocidos y errores de transformación.",
  ],
};

function routeById(id) {
  return siteMap.routes.find((route) => route.id === id);
}

function linkItems(ids, locale) {
  return ids.map((id) => ({
    href: routeById(id).pathname,
    label: guideCopy[id][locale][0],
  }));
}

function buildLearningPath(id, locale) {
  const [title, summary, action, guideIds, prerequisites, outcome, completion] =
    learningPaths[id][locale];
  const spanish = locale === "es";
  return {
    action,
    sections: [
      {
        body: prerequisites,
        heading: spanish ? "Antes de comenzar" : "Before you start",
      },
      {
        body: outcome,
        heading: spanish ? "Resultado esperado" : "Outcome",
      },
      {
        heading: spanish ? "Hitos" : "Milestones",
        items: linkItems(guideIds, locale),
        ordered: true,
      },
      {
        body: completion,
        heading: spanish ? "Comprobación final" : "Completion check",
      },
    ],
    summary,
    title,
  };
}

function referenceGroupForGuide(route) {
  const specific = {
    "guide.devtools-integration": "devtools",
    "guide.forms-validation": "forms",
    "guide.isolated-contexts": "context",
    "guide.money": "utilities",
    "guide.native-storage": "utilities",
    "guide.server-side-rendering": "server",
    "guide.server-storage": "server",
    "guide.server-transformations-resources": "server",
    "guide.service-worker-pwa-lifecycle": "pwa",
    "guide.translation": "utilities",
    "guide.validation-object-paths": "utilities",
  }[route.id];
  return (
    specific ||
    {
      "data-async": "data-async",
      "network-offline-pwa": "network-offline",
      routing: "routing",
      "ssr-server": "server",
      "state-forms": "state",
      "views-lifecycle": "runtime-views",
    }[route.group]
  );
}

function apiDescription(symbol, locale) {
  const summary = namedSummaries[symbol];
  if (!summary) {
    throw new Error(`Missing editorial summary for ${symbol}`);
  }
  return summary[locale === "es" ? 1 : 0];
}

function contractParts(signature) {
  return signature.split("\n").map((variant) => {
    const parametersStart = variant.indexOf("(");
    const parametersEnd = variant.lastIndexOf("): ");
    if (parametersStart < 0 || parametersEnd < parametersStart) {
      return { parameters: null, result: variant };
    }
    return {
      parameters: variant.slice(parametersStart + 1, parametersEnd),
      result: variant.slice(parametersEnd + 3),
    };
  });
}

function referenceFieldCopy(symbol, signature, locale) {
  const spanish = locale === "es";
  const parts = contractParts(signature);
  const callable = parts.every((part) => part.parameters !== null);
  const hasParameters = parts.some((part) => part.parameters?.length > 0);
  const parameters =
    callable && hasParameters
      ? parts.map((part) => part.parameters).join("\n")
      : spanish
        ? callable
          ? "No recibe parámetros."
          : "Este símbolo expone un valor y no recibe parámetros."
        : callable
          ? "It does not accept parameters."
          : "This symbol exposes a value and does not accept parameters.";
  const result = parts.map((part) => part.result).join("\n");
  return {
    effects: referenceEffects[symbol]
      ? referenceEffects[symbol][spanish ? 1 : 0]
      : null,
    errors: referenceErrors[symbol]
      ? referenceErrors[symbol][spanish ? 1 : 0]
      : null,
    parameters,
    parametersAsCode: callable && hasParameters,
    result,
  };
}

function buildGuide(route, locale) {
  const source = guideCopy[route.id];
  const [title, summary, introduction, noteHeading, note] = source[locale];
  const referenceGroup = referenceGroupForGuide(route);
  return {
    apis: source.apis,
    sections: [
      {
        definitions: source.apis.map((api) => ({
          description: apiDescription(api, locale),
          term: api,
        })),
        heading: locale === "es" ? "APIs principales" : "Main APIs",
      },
      { body: note, heading: noteHeading },
      {
        heading:
          locale === "es" ? "Referencia relacionada" : "Related reference",
        items: [
          {
            href: `/reference#${referenceGroup}`,
            label: referenceGroups[locale][referenceGroup][0],
          },
        ],
      },
    ],
    summary,
    introduction,
    title,
  };
}

function recipeApis(exampleId) {
  const snippet = snippetCatalog.snippets.find((item) => item.id === exampleId);
  return snippet.imports.flatMap((entry) => entry.names);
}

function recipeRelations(route, locale) {
  const guide = siteMap.guides.find(
    (candidate) => candidate.exampleId === route.exampleId,
  );
  const snippet = snippetCatalog.snippets.find(
    (candidate) => candidate.id === route.exampleId,
  );
  const imports = snippet.imports.flatMap((entry) =>
    entry.names.map((symbol) => ({ module: entry.module, symbol })),
  );
  const preferredImports = [
    ...imports.filter((entry) => entry.module !== "valyrian.js"),
    ...imports.filter((entry) => entry.module === "valyrian.js"),
  ];
  const reference = preferredImports
    .map((entry) =>
      siteMap.references.find(
        (candidate) =>
          candidate.module === entry.module &&
          candidate.symbol === entry.symbol,
      ),
    )
    .find(Boolean);
  const spanish = locale === "es";
  return [
    {
      href: guide.pathname,
      label: spanish ? "Consultar la guía" : "Read the guide",
    },
    {
      href: reference.pathname,
      label: spanish
        ? "Consultar la referencia de API"
        : "Open the API reference",
    },
  ];
}

function buildRecipe(route, locale) {
  const copy = recipeCopy[route.exampleId];
  const spanish = locale === "es";
  const title = copy[spanish ? 2 : 0];
  const summary = copy[spanish ? 3 : 1];
  const apis = recipeApis(route.exampleId);
  const [startingPoint, steps, result, limits] =
    recipeDetails[route.exampleId][locale];
  return {
    apis,
    sections: [
      {
        definitions: apis.map((api) => ({
          description: apiDescription(api, locale),
          term: api,
        })),
        heading: spanish ? "APIs utilizadas" : "APIs used",
      },
      {
        body: startingPoint,
        heading: spanish ? "Punto de partida" : "Starting point",
      },
      {
        body: steps,
        heading: spanish ? "Pasos" : "Steps",
      },
      { body: result, heading: spanish ? "Resultado" : "Result" },
      {
        body: limits,
        heading: spanish ? "Límites" : "Limits",
      },
      {
        heading: spanish ? "Continuar" : "Continue",
        items: recipeRelations(route, locale),
      },
    ],
    summary,
    title,
  };
}

function buildReference(route, locale) {
  const spanish = locale === "es";
  const summary = apiDescription(route.symbol, locale);
  const signature = referenceContracts[route.symbol];
  const fields = referenceFieldCopy(route.symbol, signature, locale);
  return {
    sections: [
      {
        code: `import { ${route.symbol} } from "${route.module}";`,
        heading: spanish ? "Importación" : "Import",
        language: "js",
      },
      {
        code: signature,
        heading: spanish ? "Firma pública" : "Public signature",
        language: "ts",
      },
      {
        ...(fields.parametersAsCode
          ? { code: fields.parameters, language: "ts" }
          : { body: fields.parameters }),
        heading: spanish ? "Parámetros" : "Parameters",
      },
      {
        code: fields.result,
        heading: spanish ? "Resultado" : "Result",
        language: "ts",
      },
      ...(fields.effects
        ? [
            {
              body: fields.effects,
              heading: spanish ? "Efectos observables" : "Observable effects",
            },
          ]
        : []),
      ...(fields.errors
        ? [
            {
              body: fields.errors,
              heading: spanish ? "Errores" : "Errors",
            },
          ]
        : []),
      {
        heading: spanish ? "Guía relacionada" : "Related guide",
        items: [
          {
            href: `/guides/${
              {
                context: "isolated-contexts",
                "data-async": "requests",
                devtools: "devtools-integration",
                forms: "forms-validation",
                "network-offline": "network-status",
                pwa: "service-worker-pwa-lifecycle",
                routing: "application-routing",
                "runtime-views": "views-directives-trusted-content",
                server: "server-transformations-resources",
                state: "reactive-stores-effects",
                utilities: "validation-object-paths",
              }[route.group]
            }`,
            label: spanish ? "Consultar la guía" : "Read the guide",
          },
        ],
      },
    ],
    summary,
    title: route.symbol,
  };
}

const content = { en: {}, es: {} };

for (const locale of ["en", "es"]) {
  content[locale].$groups = groups[locale];
  content[locale].$referenceGroups = Object.fromEntries(
    Object.entries(referenceGroups[locale]).map(
      ([id, [title, introduction]]) => [id, { introduction, title }],
    ),
  );

  for (const route of siteMap.learningPaths) {
    content[locale][route.id] = buildLearningPath(route.id, locale);
  }
  for (const route of siteMap.guides) {
    content[locale][route.id] = buildGuide(route, locale);
  }
  for (const route of siteMap.recipes) {
    content[locale][route.id] = buildRecipe(route, locale);
  }
  for (const route of siteMap.references) {
    content[locale][route.id] = buildReference(route, locale);
  }
}

module.exports = Object.freeze({
  en: Object.freeze(content.en),
  es: Object.freeze(content.es),
});
