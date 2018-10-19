var path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'visualive-ux.js',
    library: 'visualiveUx',
    libraryTarget: 'umd',
  },
  devtool: 'eval-source-map',
};
