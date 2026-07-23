const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const {
  assertNoPathCollisions,
  groupedStructuredRoutes,
  publishedStructuredRoutes,
  structuredHubItems,
  validateSiteMap,
} = require("../../content/structured-content.js");

function fixtureMap(routes) {
  return { routes };
}

describe("structured content model", () => {
  test("rejects malformed, duplicate and colliding routes", () => {
    assert.throws(
      () =>
        validateSiteMap(
          fixtureMap([
            {
              group: "fixture",
              id: "first",
              kind: "guide",
              pathname: "/test-fixture/../escape",
            },
          ]),
        ),
      /invalid route/,
    );
    assert.throws(
      () =>
        validateSiteMap(
          fixtureMap([
            {
              group: "fixture",
              id: "first",
              kind: "guide",
              pathname: "/test-fixture/first",
            },
            {
              group: "fixture",
              id: "first",
              kind: "guide",
              pathname: "/test-fixture/second",
            },
          ]),
        ),
      /unique/,
    );
    assert.throws(
      () =>
        assertNoPathCollisions(
          ["/test-fixture/existing"],
          [{ pathname: "/test-fixture/existing" }],
        ),
      /collides/,
    );
  });

  test("publishes only bilingual records with complete structural fields", () => {
    const route = {
      group: "fixture",
      id: "fixture.record",
      kind: "guide",
      pathname: "/test-fixture/record",
    };
    const siteMap = fixtureMap([route]);
    const record = { sections: [], title: "Fixture" };
    const partial = {
      en: { $groups: { fixture: { title: "Group" } }, [route.id]: record },
      es: { $groups: { fixture: { title: "Grupo" } } },
    };

    assert.deepEqual(publishedStructuredRoutes(siteMap, partial), []);

    const unsafe = {
      en: {
        ...partial.en,
        [route.id]: {
          sections: [
            {
              items: [
                { href: "//evil.example/path", label: "Protocol relative" },
              ],
            },
          ],
          title: "Fixture",
        },
      },
      es: {
        ...partial.es,
        [route.id]: {
          sections: [
            {
              items: [
                { href: "//evil.example/path", label: "Protocol relative" },
              ],
            },
          ],
          title: "Fixture",
        },
      },
    };
    assert.deepEqual(publishedStructuredRoutes(siteMap, unsafe), []);

    const complete = {
      ...partial,
      es: { ...partial.es, [route.id]: record },
    };
    assert.deepEqual(publishedStructuredRoutes(siteMap, complete), [route]);
    assert.deepEqual(structuredHubItems([route], complete, "en", "guide"), [
      {
        group: "fixture",
        pathname: "/test-fixture/record",
        sections: [],
        title: "Fixture",
      },
    ]);
  });

  test("keeps contextual navigation within one route kind and group", () => {
    const current = {
      group: "fixture",
      id: "guide.current",
      kind: "guide",
      pathname: "/test-fixture/current",
    };
    const routes = [
      {
        group: "fixture",
        id: "learning.fixture",
        kind: "learningPath",
        pathname: "/test-fixture/learning",
      },
      current,
      {
        group: "fixture",
        id: "guide.next",
        kind: "guide",
        pathname: "/test-fixture/next",
      },
      {
        group: "other",
        id: "guide.other",
        kind: "guide",
        pathname: "/test-fixture/other",
      },
    ];

    assert.deepEqual(groupedStructuredRoutes(routes, current), [
      current,
      routes[2],
    ]);
  });
});
