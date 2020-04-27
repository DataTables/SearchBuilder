import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    // dir: 'dist/',
    file: '/home/vagrant/DataTablesSrc/built/DataTables/extensions/SearchBuilder/js/dataTables.searchBuilder.js',
    format: 'iife'
  },
  plugins: [resolve()]
};