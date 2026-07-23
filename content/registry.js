function hub(id, pathname) {
  const contentPath = pathname.slice(1);
  return {
    id,
    section: id,
    type: "hub",
    pathname,
    variants: {
      en: `content/en/${contentPath}.md`,
      es: `content/es/${contentPath}.md`,
    },
  };
}

module.exports = [hub("guides", "/guides"), hub("recipes", "/recipes")];
