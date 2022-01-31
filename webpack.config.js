const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'dist/minified'),
  },
};
