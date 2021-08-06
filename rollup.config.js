const babel = require('@rollup/plugin-babel').default;
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');
const banner = `/* ${pkg.name} by Hisheng (hishengs@gmail.com), version: ${pkg.version} */`;

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
      babel()
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
      terser()
    ],
  }
];