import resolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: 'src/index.js',
    output: {
      file: process.env.OUT + '/js/dataTables.searchBuilder.js',
      format: 'iife'
    },
    plugins: [resolve()]
  },
  {
    input: 'src/searchBuilder.bootstrap.js',
    output: {
      file: process.env.OUT + '/js/searchBuilder.bootstrap.js',
      format: 'iife'
    },
    plugins: [resolve()]
  },
  {
    input: 'src/searchBuilder.bootstrap4.js',
    output: {
      file: process.env.OUT + '/js/searchBuilder.bootstrap4.js',
      format: 'iife'
    },
    plugins: [resolve()]
  },
  {
    input: 'src/searchBuilder.dataTables.js',
    output: {
      file: process.env.OUT + '/js/searchBuilder.dataTables.js',
      format: 'iife'
    },
    plugins: [resolve()]
  },
  {
    input: 'src/searchBuilder.foundation.js',
    output: {
      file: process.env.OUT + '/js/searchBuilder.foundation.js',
      format: 'iife'
    },
    plugins: [resolve()]
  },
  {
    input: 'src/searchBuilder.semanticui.js',
    output: {
      file: process.env.OUT + '/js/searchBuilder.semanticui.js',
      format: 'iife'
    },
    plugins: [resolve()]
  },
];