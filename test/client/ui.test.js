const assert = require("node:assert/strict");
const { describe, test } = require("node:test");
const { render } = require("valyrian.js/node");
const { markdownView } = require("../../client/pages/markdown.js");
const { Site } = require("../../client/pages/site.js");
const { Search, searchRecords } = require("../../client/components/search.js");

describe("documentation UI", () => {
  test("renders editorial markup without trusting embedded HTML", () => {
    const html = render(
      markdownView(
        "# Safe title\n\n<script>globalThis.compromised = true</script>\n\n## Next step",
      ),
    );

    assert.match(html, /<h1>Safe title<\/h1>/);
    assert.match(
      html,
      /&lt;script&gt;globalThis\.compromised = true&lt;\/script&gt;/,
    );
    assert.doesNotMatch(html, /<script>globalThis\.compromised/);
    assert.match(html, /<h2 id="next-step">Next step<\/h2>/);
  });

  test("degrades links with unsafe or unsupported schemes", () => {
    const html = render(
      markdownView(
        "[script](javascript:alert(1)) [data](data:text/html,unsafe) [mail](mailto:team@example.com) [protocol-relative](//example.com/docs)",
      ),
    );

    assert.doesNotMatch(html, /href="(?:javascript:|data:|mailto:)/);
    assert.doesNotMatch(html, /href="\/\/example\.com/);
    assert.equal((html.match(/href="#"/g) || []).length, 4);
  });

  test("preserves anchors, site routes and HTTPS links", () => {
    const html = render(
      markdownView(
        "[section](#fixture-section) [route](/__test/route) [source](https://example.com/fixture)",
      ),
    );

    assert.match(html, /href="#fixture-section"/);
    assert.match(html, /href="\/__test\/route"/);
    assert.match(
      html,
      /href="https:\/\/example\.com\/fixture" rel="noopener noreferrer"/,
    );
  });

  test("returns an explicit error for an invalid search index", () => {
    assert.deepEqual(searchRecords(null, "router"), {
      state: "error",
      results: [],
    });
    assert.deepEqual(searchRecords([], "   "), {
      state: "idle",
      results: [],
    });
  });

  test("matches titles, headings, API names and terms without changing paths", () => {
    const records = [
      {
        headings: ["Needle contract"],
        pathname: "/__test/first",
        text: "A needle appears in this technical fixture.",
        title: "First fixture",
      },
      {
        headings: ["Other contract"],
        pathname: "/__test/second",
        text: "A separate technical fixture.",
        title: "Second fixture",
      },
    ];

    const result = searchRecords(records, "needle");

    assert.equal(result.state, "results");
    assert.deepEqual(
      result.results.map((record) => record.pathname),
      ["/__test/first"],
    );
    assert.equal(result.results[0].matchHeading, "Needle contract");
    assert.match(result.results[0].excerpt, /needle appears/);
  });

  test("renders tables with headers and contained horizontal scrolling", () => {
    const html = render(
      markdownView(
        "| API | Contract |\n| --- | --- |\n| `mount()` | Mounts the app. |",
      ),
    );

    assert.match(html, /role="region"/);
    assert.match(html, /<th scope="col">API<\/th>/);
    assert.match(html, /<td><code>mount\(\)<\/code><\/td>/);
  });

  test("renders an accessible service worker update notice", () => {
    const english = render(
      Site({
        homeExample: "",
        locale: "en",
        pathname: "/",
        viewType: "home",
      }),
    );

    assert.match(english, /<aside[^>]+data-pwa-update/);
    assert.match(english, /aria-live="polite"/);
    assert.match(english, /data-pwa-apply/);
    assert.match(english, /data-pwa-cancel/);
    assert.match(english, /hidden/);
  });

  test("renders the canonical home example with an accessible copy control", () => {
    const html = render(
      Site({
        homeExample: 'mount("body", App)',
        locale: "en",
        pathname: "/",
        viewType: "home",
      }),
    );

    assert.match(html, /<button[^>]+data-copy="true"[^>]+type="button"/);
    assert.match(html, /data-copy-status="true"/);
    assert.match(html, /aria-live="polite"/);
    assert.match(html, /mount\(&quot;body&quot;, App\)/);
    assert.equal((html.match(/<h1/g) || []).length, 1);
  });

  test("renders structured sections, definitions and code controls", () => {
    const html = render(
      Site({
        content: {
          sections: [
            {
              definitions: [
                { description: "Fixture description", term: "Fixture term" },
              ],
              heading: "Fixture section",
              items: ["First", "Second"],
              ordered: true,
            },
            { code: "fixture()", heading: "Code", language: "js" },
          ],
          summary: "Fixture summary",
          title: "Fixture title",
        },
        locale: "en",
        next: null,
        pathname: "/test-fixture/record",
        previous: null,
        sectionItems: [],
        viewType: "guideDocument",
      }),
    );

    assert.match(html, /<h1>Fixture title<\/h1>/);
    assert.match(html, /<ol><li>First<\/li><li>Second<\/li><\/ol>/);
    assert.match(
      html,
      /<dl><dt>Fixture term<\/dt><dd>Fixture description<\/dd><\/dl>/,
    );
    assert.match(
      html,
      /<button class="text-xs" data-copy="true" type="button">/,
    );
    assert.match(html, /<code>fixture\(\)<\/code>/);
    assert.match(html, /<h2 id="fixture-section">Fixture section<\/h2>/);
    assert.match(html, /class="document-menu"/);
    assert.match(html, /class="toc-mobile"/);
    assert.match(html, /class="[^"]*\bdocument-toc\b[^"]*"/);
    assert.doesNotMatch(html, /<pre tabindex="0">/);
  });

  test("uses the reference symbol as code and labels nearby links", () => {
    const html = render(
      Site({
        content: {
          sections: [{ body: "Fixture", heading: "Description" }],
          summary: "Fixture summary",
          title: "fixtureSymbol",
        },
        locale: "en",
        next: { pathname: "/test-fixture/next", title: "Next fixture" },
        pathname: "/test-fixture/reference",
        previous: {
          pathname: "/test-fixture/previous",
          title: "Previous fixture",
        },
        sectionItems: [],
        viewType: "referenceDocument",
      }),
    );

    assert.match(
      html,
      /<h1 class="reference-symbol"><code>fixtureSymbol<\/code><\/h1>/,
    );
    assert.match(html, /<small>Previous<\/small>Previous fixture/);
    assert.match(html, /<small>Next<\/small>Next fixture/);
  });

  test("renders reference search controls and a replaceable result region", () => {
    const html = render(
      Search({
        labels: {
          search: "Fixture search",
          searchAction: "Search",
          searchClear: "Clear search",
          searchIdle: "Enter a term",
          searchPlaceholder: "Search fixtures",
        },
      }),
    );

    assert.match(html, /aria-busy="false"/);
    assert.match(html, /data-search-clear="true" hidden/);
    assert.match(html, /data-search-results="true"/);
  });
});
