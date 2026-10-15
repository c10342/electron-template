module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-recess-order"
  ],
  plugins: ["stylelint-scss"],
  overrides: [{ files: ["**/*.vue"], customSyntax: "postcss-html" }],
  rules: {
    "no-descending-specificity": null,
    "no-empty-source": null,
    "font-family-no-missing-generic-family-keyword": null,
    "no-duplicate-selectors": null,
    "selector-class-pattern": null,
    "import-notation": "string"
  }
};
