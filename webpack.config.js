const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/assets/js/main.js",
  output: {
    path: path.resolve(__dirname, "./site/assets/js"),
    filename: "main.bundle.js",
  },
};