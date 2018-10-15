// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  "parser": "babel-eslint",
  parserOptions: {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    'amd': true
  },
  "globals": {
    seajs: true,
    requires: true,
    Vue: true
  },
  "extends": "eslint:recommended",
  "plugins": ["vue"],
  "rules": {
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "quotes": 0,
    "semi": ["error", "always"],
    "vue/jsx-uses-vars": 2,
    "no-console": 0
  }
}