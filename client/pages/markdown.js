const { v } = require("valyrian.js");
const { CopyButton } = require("../components/interactions.js");

function headingSlug(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function inlineView(text) {
  const nodes = [];
  const pattern =
    /(`[^`]+`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  let offset = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > offset) {
      nodes.push(text.slice(offset, match.index));
    }

    if (match[0].startsWith("`")) {
      nodes.push(v("code", {}, match[0].slice(1, -1)));
    } else if (typeof match[2] === "string") {
      const href = match[3];
      const external = /^https:\/\//.test(href);
      const internal = href.startsWith("#") || /^\/(?!\/)/.test(href);
      nodes.push(
        v(
          "a",
          external
            ? { "data-link": "true", href, rel: "noopener noreferrer" }
            : {
                "data-link": "true",
                ...(/^\/(?!\/)/.test(href) ? { "v-route": href } : {}),
                href: internal ? href : "#",
              },
          match[2],
        ),
      );
    } else if (typeof match[4] === "string") {
      nodes.push(v("strong", {}, match[4]));
    } else {
      nodes.push(v("em", {}, match[5]));
    }
    offset = pattern.lastIndex;
  }

  if (offset < text.length) {
    nodes.push(text.slice(offset));
  }
  return nodes;
}

function markdownCells(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function headingAttributes(depth, title, h1Id) {
  if (depth !== 1) {
    return { id: headingSlug(title) };
  }
  return typeof h1Id === "string" ? { id: h1Id } : {};
}

function markdownView(markdown, options = {}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const children = [];
  const copyLabel = options.copyLabel || "Copy code";
  const copyLabels = options.labels || {
    copy: copyLabel,
    copyError: "Could not copy the code.",
    copySuccess: "Code copied",
  };
  const h1Id = options.h1Id;
  const tableLabel = options.tableLabel || "Documentation table";

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    const fence = /^```([^\s]*)/.exec(line);
    if (fence !== null) {
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += index < lines.length ? 1 : 0;
      children.push(
        v(
          "div",
          { class: "code-block w-full" },
          v(
            "div",
            { class: "grid" },
            v(
              "div",
              { class: "w-1/2" },
              v("code", { class: "border-0" }, fence[1] || ""),
            ),
            v(
              "div",
              { class: "w-1/2 text-right" },
              CopyButton({ labels: copyLabels }),
            ),
          ),
          v("pre", { class: "w-full" }, v("code", {}, code.join("\n"))),
          v("span", {
            "aria-live": "polite",
            class: "copy-status",
            "data-copy-status": "true",
          }),
        ),
      );
      continue;
    }

    const heading = /^(#{1,6})\s+(.+?)\s*#*$/.exec(line);
    if (heading !== null) {
      const title = heading[2].replace(/[*_`]/g, "").trim();
      children.push(
        v(
          `h${heading[1].length}`,
          headingAttributes(heading[1].length, title, h1Id),
          ...inlineView(title),
        ),
      );
      index += 1;
      continue;
    }

    if (
      /^\s*\|/.test(line) &&
      index + 1 < lines.length &&
      /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1])
    ) {
      const headers = markdownCells(line);
      const rows = [];
      index += 2;
      while (index < lines.length && /^\s*\|/.test(lines[index])) {
        rows.push(markdownCells(lines[index]));
        index += 1;
      }
      children.push(
        v(
          "div",
          {
            "aria-label": tableLabel,
            class: "table-scroll w-full",
            role: "region",
            tabindex: "0",
          },
          v(
            "table",
            {},
            v(
              "thead",
              {},
              v(
                "tr",
                {},
                ...headers.map((header) =>
                  v("th", { scope: "col" }, ...inlineView(header)),
                ),
              ),
            ),
            v(
              "tbody",
              {},
              ...rows.map((row) =>
                v(
                  "tr",
                  {},
                  ...row.map((cell) => v("td", {}, ...inlineView(cell))),
                ),
              ),
            ),
          ),
        ),
      );
      continue;
    }

    const list = /^(\s*)([-*]|\d+\.)\s+(.+)$/.exec(line);
    if (list !== null) {
      const ordered = /\d+\./.test(list[2]);
      const items = [];
      while (index < lines.length) {
        const item = /^(\s*)([-*]|\d+\.)\s+(.+)$/.exec(lines[index]);
        if (item === null || /\d+\./.test(item[2]) !== ordered) {
          break;
        }
        items.push(v("li", {}, ...inlineView(item[3])));
        index += 1;
      }
      children.push(v(ordered ? "ol" : "ul", {}, ...items));
      continue;
    }

    const quote = /^>\s?(.*)$/.exec(line);
    if (quote !== null) {
      children.push(v("blockquote", {}, ...inlineView(quote[1])));
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim().length > 0 &&
      !/^(#{1,6})\s|^```|^(\s*)([-*]|\d+\.)\s|^>\s?/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }
    children.push(v("p", {}, ...inlineView(paragraph.join(" "))));
  }

  return v("div", { class: "markdown" }, ...children);
}

function tableOfContents(markdown) {
  return [...markdown.matchAll(/^(#{2,3})\s+(.+?)\s*#*$/gm)].map((match) => {
    const title = match[2].replace(/[*_`]/g, "").trim();
    return { depth: match[1].length, id: headingSlug(title), title };
  });
}

module.exports = { headingSlug, markdownView, tableOfContents };
