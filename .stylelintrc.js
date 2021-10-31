module.exports = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-prettier"],
  rules: {},
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
};
