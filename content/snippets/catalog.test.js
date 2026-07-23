const assert = require("node:assert/strict");
const { readFile, readdir } = require("node:fs/promises");
const path = require("node:path");
const { describe, test } = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "../..");

async function readCatalog() {
  return JSON.parse(
    await readFile(path.join(__dirname, "catalog.json"), "utf8"),
  );
}

function fencedCode(markdown) {
  const match = markdown.match(/^```(?:ts|tsx|js|jsx)\n([\s\S]+)\n```\n?$/);
  assert.ok(
    match,
    "each snippet must contain exactly one executable code fence",
  );
  return match[1];
}

function importsFrom(code) {
  return [...code.matchAll(/import\s+\{([^}]+)\}\s+from\s+"([^"]+)"/g)].map(
    ([, names, moduleName]) => ({
      moduleName,
      names: names
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0),
    }),
  );
}

function semanticErrors(code, snippet) {
  const fileName = path.join(
    root,
    `tmp/snippet-${snippet.id}.${snippet.language}`,
  );
  const compilerOptions = {
    jsx: ts.JsxEmit.ReactJSX,
    jsxImportSource: "valyrian.js",
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2022,
  };
  const host = ts.createCompilerHost(compilerOptions);
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    compilerOptions.target,
    true,
  );
  const originalFileExists = host.fileExists.bind(host);
  const originalGetSourceFile = host.getSourceFile.bind(host);
  const originalReadFile = host.readFile.bind(host);

  host.fileExists = (candidate) =>
    candidate === fileName || originalFileExists(candidate);
  host.getSourceFile = (candidate, languageVersion, ...args) =>
    candidate === fileName
      ? sourceFile
      : originalGetSourceFile(candidate, languageVersion, ...args);
  host.readFile = (candidate) =>
    candidate === fileName ? code : originalReadFile(candidate);

  const program = ts.createProgram([fileName], compilerOptions, host);
  return ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error)
    .map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n",
      );
      if (diagnostic.file === undefined || diagnostic.start === undefined) {
        return message;
      }
      const position = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start,
      );
      return `${position.line + 1}:${position.character + 1} ${message}`;
    });
}

function executeNativeStoreSnippet(code) {
  const values = new Map();
  const storage = {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  const logs = [];
  const errors = [];
  const mounts = [];
  const hadLocalStorage = Object.hasOwn(global, "localStorage");
  const previousLocalStorage = global.localStorage;
  global.localStorage = storage;

  try {
    const output = ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext(output, {
      console: {
        error: (...args) => errors.push(args),
        log: (value) => logs.push(value),
      },
      exports: {},
      require: (moduleName) =>
        moduleName === "valyrian.js"
          ? {
              mount: (target, component) =>
                mounts.push({ output: component(), target }),
            }
          : require(moduleName),
    });
  } finally {
    if (hadLocalStorage) {
      global.localStorage = previousLocalStorage;
    } else {
      delete global.localStorage;
    }
  }

  return { errors, logs, mounts, storage };
}

function executeOfflineQueueSnippet(code) {
  let cleanup = null;
  let networkDestroyCount = 0;
  let queueDestroyCount = 0;
  let stopCount = 0;

  class NetworkManager {
    destroy() {
      networkDestroyCount += 1;
    }
  }

  class OfflineQueue {
    constructor(options) {
      this.network = options.network;
    }

    destroy() {
      queueDestroyCount += 1;
    }

    enqueue() {}

    on() {
      return () => {
        stopCount += 1;
      };
    }

    state() {
      return { failed: 0, pending: 0 };
    }
  }

  const output = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  vm.runInNewContext(output, {
    exports: {},
    fetch: async () => ({ ok: true }),
    require: (moduleName) => {
      if (moduleName === "valyrian.js") {
        return {
          mount: (_target, component) => component(),
          onRemove: (callback) => {
            cleanup = callback;
          },
          update: () => {},
        };
      }
      if (moduleName === "valyrian.js/network") {
        return { NetworkManager };
      }
      if (moduleName === "valyrian.js/offline") {
        return { OfflineQueue };
      }
      return require(moduleName);
    },
  });

  assert.equal(typeof cleanup, "function");
  cleanup();

  return { networkDestroyCount, queueDestroyCount, stopCount };
}

describe("shared snippet catalog", () => {
  test("matches files and the installed public API", async () => {
    const catalog = await readCatalog();
    const installedPackage = JSON.parse(
      await readFile(
        path.join(root, "node_modules/valyrian.js/package.json"),
        "utf8",
      ),
    );
    const projectPackage = JSON.parse(
      await readFile(path.join(root, "package.json"), "utf8"),
    );
    const files = (await readdir(__dirname))
      .filter((file) => file.endsWith(".md"))
      .sort();
    const expectedFiles = catalog.snippets.map(({ id }) => `${id}.md`).sort();

    assert.equal(
      installedPackage.version,
      projectPackage.dependencies[installedPackage.name],
    );
    assert.deepEqual(files, expectedFiles);

    for (const snippet of catalog.snippets) {
      const markdown = await readFile(
        path.join(__dirname, `${snippet.id}.md`),
        "utf8",
      );
      const code = fencedCode(markdown);
      const imports = importsFrom(code);
      const declaredImports = snippet.imports.map(({ module, names }) => ({
        moduleName: module,
        names,
      }));

      assert.deepEqual(
        imports,
        declaredImports,
        `${snippet.id} import manifest`,
      );
      for (const { moduleName, names } of imports) {
        const publicModule = require(moduleName);
        for (const name of names) {
          assert.ok(
            name in publicModule,
            `${snippet.id} uses missing ${moduleName}.${name}`,
          );
        }
      }

      if (
        imports.some(
          ({ moduleName }) => moduleName === "valyrian.js/native-store",
        )
      ) {
        const runtime = executeNativeStoreSnippet(code);
        assert.deepEqual(runtime.logs, []);
        assert.deepEqual(runtime.errors, []);
        assert.deepEqual(runtime.mounts, [
          { output: "Saved theme: dark", target: "body" },
        ]);
        assert.deepEqual(
          JSON.parse(runtime.storage.getItem("preferences")),
          {},
        );
      }

      if (snippet.id === "offline-queue") {
        assert.deepEqual(executeOfflineQueueSnippet(code), {
          networkDestroyCount: 1,
          queueDestroyCount: 1,
          stopCount: 1,
        });
      }

      const allowedMethodsMatch = code.match(/allowedMethods:\s*\[([^\]]+)\]/);
      if (allowedMethodsMatch) {
        const allowedMethods = [
          ...allowedMethodsMatch[1].matchAll(/"([a-z]+)"/g),
        ].map(([, method]) => method);
        const helperCalls = [
          ...code.matchAll(
            /\b\w+\.(get|post|put|patch|delete|head|options)\s*\(/g,
          ),
        ].map(([, method]) => method);
        const { request } = require("valyrian.js/request");
        const client = request.new("/api", { allowedMethods });

        for (const helper of helperCalls) {
          assert.ok(
            allowedMethods.includes(helper),
            `${snippet.id} must allow its ${helper} helper`,
          );
          assert.equal(typeof client[helper], "function");
        }
      }

      const errors = semanticErrors(code, snippet);
      assert.deepEqual(
        errors,
        [],
        `${snippet.id} must pass strict semantic TypeScript validation`,
      );
    }
  });

  test("uses body as the only direct mount target in executable examples", async () => {
    const catalog = await readCatalog();

    for (const { id } of catalog.snippets) {
      const markdown = await readFile(path.join(__dirname, `${id}.md`), "utf8");
      const code = fencedCode(markdown);
      const mounts = [
        ...code.matchAll(/\bmount(?:Router)?\s*\(\s*(["'][^"']+["'])/g),
      ];
      assert.equal(mounts.length, 1, `${id} direct mount count`);
      for (const match of mounts) {
        assert.equal(match[1], '"body"', `${id} mount target`);
      }
      assert.doesNotMatch(code, /id=["']app["']/i, `${id} app root`);
    }
  });
});
