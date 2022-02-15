// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-compare-neg-zero": "off",
    "react/react-in-jsx-scope": "off",
    eqeqeq: "error",
    "no-var": "error",
    "arrow-body-style": "error",
    curly: "error",
    "prefer-template": "error",
    "no-irregular-whitespace": ["error", { skipStrings: false }],
    // "no-console": ["error", { allow: ["warn", "error"] }],
    complexity: ["error", { max: 6 }],
    "no-unused-vars": ["error", { ignoreRestSiblings: true, argsIgnorePattern: "^_" }],
    "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }],
    "max-lines-per-function": ["error", { max: 100, skipBlankLines: true, skipComments: true }],
    "no-param-reassign": ["error", { props: true, ignorePropertyModificationsFor: ["ctx", "draft"] }],
    "max-params": ["error", 5],
    "object-shorthand": ["error"],
  },
}
