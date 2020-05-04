import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    // dir: 'dist/',
    file: process.env.OUT + '/js/dataTables.searchBuilder.js',
    format: 'iife'
  },
  plugins: [resolve()]
};