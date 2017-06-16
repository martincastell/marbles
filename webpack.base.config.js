const webpack = require('webpack');
const path = require('path');

const DIST_DIR   = path.join(__dirname, 'dist');
const CLIENT_DIR = path.join(__dirname, 'src');

module.exports = {
  context: CLIENT_DIR,

  entry: './main',

  output: {
    path:     DIST_DIR,
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.js']
  },

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
};
