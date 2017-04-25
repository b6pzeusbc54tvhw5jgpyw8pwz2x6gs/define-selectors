module.exports = {
  parser: "babel-eslint",
  plugins: ["import"],
  ecmaFeatures: {
    ecamVersion: 6,
    templateStrings: true,
    modules: true,
    classes: true,
    arrowFunctions: true,
    blockBindings: true,
  },
  env: {
    "node": true,
    "es6": true,
  },
  "rules": {
    "no-use-before-define": [2, "nofunc"],
    "no-param-reassign": 0
  },
  globals: {
    "__DEV__": false
  },
}
