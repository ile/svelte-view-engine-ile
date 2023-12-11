let rollup = require("rollup");
let svelte = require("rollup-plugin-svelte");
let resolve = require("@rollup/plugin-node-resolve").nodeResolve; // Updated import
let commonjs = require("@rollup/plugin-commonjs"); // Updated import
let { terser } = require("@rollup/plugin-terser"); // Updated import
let fs = require("flowfs");
let merge = require("lodash.merge");

module.exports = async (path, name, options, cache) => {
  let inputOptions = {
    input: path,
    cache,
    plugins: [
      svelte(
        merge(
          {
            hydratable: true,
            css: false,
          },
          options.svelte
        )
      ),

      resolve({
        browser: true,
      }),

      commonjs(),

      options.minify && terser(),
    ],
  };

  let outputOptions = {
    format: "iife",
    name,
  };

  let bundle = await rollup.rollup(inputOptions);

  let { output } = await bundle.generate(outputOptions);

  return {
    cache: bundle.cache,
    js: output[0],
    watchFiles: bundle.watchFiles,
  };
};
