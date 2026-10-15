module.exports = {
  "*.{css,scss}": ["prettier --write", "stylelint --fix"],
  "*.vue": ["prettier --write", "eslint --fix", "stylelint --fix"],
  "*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}": ["prettier --write", "eslint --fix"]
};
