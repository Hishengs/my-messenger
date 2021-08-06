module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/messenger.common.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    }
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/messenger.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  }
];