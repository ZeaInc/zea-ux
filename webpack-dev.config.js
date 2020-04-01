const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zea-ux.js',
    library: 'ZeaUx',
    libraryTarget: 'umd',
  },
  devtool: 'eval-source-map',
  externals: {
    '@jaames/iro': '@jaames/iro',
    '@zeainc/zea-collab': '@zeainc/zea-collab',
    '@zeainc/zea-engine': '@zeainc/zea-engine',
  },
};
