var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zea-ux.js',
    library: 'ZeaUx',
    libraryTarget: 'umd',
  },
  externals: {
    '@jaames/iro': '@jaames/iro',
    '@zeainc/zea-collab': '@zeainc/zea-collab',
    '@zeainc/zea-engine': '@zeainc/zea-engine',
  },
};
