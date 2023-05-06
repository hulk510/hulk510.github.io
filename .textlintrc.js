module.exports = {
  filters: {
    comments: true,
    allowlist: {
      allow: [],
    },
  },
  rules: {
    // "no-todo": true, // - [ ] や todo があるとエラーになる
    "preset-ja-technical-writing": {
      "sentence-length": {
        max: 110,
      },
    },
  },
};
