let rollup = require("rollup");
let svelte = require("rollup-plugin-svelte");
let resolve = require("@rollup/plugin-node-resolve").nodeResolve; // Updated import
let commonjs = require("@rollup/plugin-commonjs"); // Updated import
let { terser } = require("@rollup/plugin-terser"); // Updated import
let merge = require("lodash.merge");
let requireFromString = require("./utils/requireFromString");

module.exports = async (path, options, cache) => {
  let inputOptions = {
    input: path,
    cache,
    plugins: [
      svelte(
        merge(
          {
            generate: "ssr",
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
    format: "cjs",
  };

  let bundle = await rollup.rollup(inputOptions);

  let { output } = await bundle.generate(outputOptions);

  return {
    cache: bundle.cache,
    component: await requireFromString(output[0].code),
  };
};
