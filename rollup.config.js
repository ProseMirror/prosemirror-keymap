module.exports = {
  entry: "./src/keymap.js",
  dest: "dist/keymap.js",
  format: "cjs",
  sourceMap: true,
  plugins: [require("rollup-plugin-buble")()],
  external(id) { return !/^[\.\/]/.test(id) }
}
