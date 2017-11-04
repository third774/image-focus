import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"

export default [
  // browser-friendly UMD build
  {
    entry: "src/lib/main.ts",
    dest: pkg.browser,
    format: "umd",
    moduleName: "focus-point",
    plugins: [
      resolve({
        extensions: [".ts", ".js", ".json"],
      }),
      typescript(),
      commonjs(),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    entry: "src/lib/main.ts",
    external: ["ms"],
    targets: [
      { dest: pkg.main, format: "cjs" },
      { dest: pkg.module, format: "es" },
    ],
  },
]
