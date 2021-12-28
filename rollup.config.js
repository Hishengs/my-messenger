const babel = require('@rollup/plugin-babel').default;
const { terser } = require('rollup-plugin-terser');
const commonjs = require("@rollup/plugin-commonjs");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const pkg = require('./package.json');
const banner = `/* ${pkg.name} by Hisheng (hishengs@gmail.com), version: ${pkg.version} */`;

const plugins = () => [
  nodeResolve({
    browser: true,
  }),
  commonjs(),
  babel({ babelHelpers: "bundled", exclude: ["node_modules/**"] }),
];

module.exports = [
  {
    input: 'src/index.js',
    output: {
      banner,
      file: 'dist/my-messenger.common.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    }
  },
  {
    input: 'src/index.js',
    output: {
      banner,
      file: 'dist/my-messenger.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      ...plugins()
    ]
  },
  {
    input: 'src/index.js',
    output: {
      banner,
      file: 'dist/my-messenger.js',
      name: 'MyMessenger',
      format: 'umd',
      exports: 'named',
      sourcemap: true
    },
    plugins: [
      ...plugins(),
      terser()
    ],
  }
];