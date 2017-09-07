module.exports = {
  input: "./src/keymap.js",
  output: {format: "cjs", file: "dist/keymap.js"},
  sourcemap: true,
  plugins: [require("rollup-plugin-buble")()],
  external(id) { return !/^[\.\/]/.test(id) }
}
