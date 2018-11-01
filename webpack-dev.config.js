var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'visualive-ux.js',
    library: 'visualiveUx',
    libraryTarget: 'umd',
  },
  devtool: 'eval-source-map',
  externals: {
    '@jaames/iro': '@jaames/iro',
    '@visualive/collab': '@visualive/collab',
    '@visualive/engine': '@visualive/engine',
  },
};
