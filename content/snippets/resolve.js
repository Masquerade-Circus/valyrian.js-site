const { readFile, realpath } = require("node:fs/promises");
const path = require("node:path");

const SNIPPET_PATTERN = /\{\{snippet:([a-z0-9][a-z0-9/-]*)\}\}/g;
const EXTENSIONS = ["js", "md", "html"];

function assertInside(root, target, label) {
  const relative = path.relative(root, target);
  if (
    relative.length === 0 ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`${label} must stay inside content/snippets`);
  }
}

async function readSnippet(root, snippetId) {
  if (!/^[a-z0-9][a-z0-9/-]*$/.test(snippetId)) {
    throw new Error("Snippet ID is invalid");
  }

  const snippetRoot = path.resolve(root, "content/snippets");
  const realRoot = await realpath(snippetRoot);
  for (const extension of EXTENSIONS) {
    const target = path.resolve(snippetRoot, `${snippetId}.${extension}`);
    assertInside(snippetRoot, target, `Snippet ${snippetId}`);
    try {
      const realTarget = await realpath(target);
      assertInside(realRoot, realTarget, `Snippet ${snippetId}`);
      return await readFile(realTarget, "utf8");
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  return null;
}

async function resolveSnippets(markdown, options = {}) {
  const ids = [
    ...new Set(
      [...markdown.matchAll(SNIPPET_PATTERN)].map((match) => match[1]),
    ),
  ];
  let resolved = markdown;
  for (const id of ids) {
    const snippet = await readSnippet(options.root ?? ".", id);
    if (snippet === null) {
      if (options.allowMissing === true) {
        continue;
      }
      throw new Error(`Snippet ${id} does not exist`);
    }
    resolved = resolved.split(`{{snippet:${id}}}`).join(snippet);
  }
  return resolved;
}

module.exports = { readSnippet, resolveSnippets };
