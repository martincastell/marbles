const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev.config.js');

const isDevelopment = process.env.NODE_ENV !== 'production';

const app = express();
const DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_PORT = 3000;
const compiler = webpack(config);

app.set('port', process.env.PORT || DEFAULT_PORT);

if (isDevelopment) {
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res, next) => {
    const filename = path.join(DIST_DIR, 'index.html');

    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => res.sendFile('index.html'));
}


app.listen(app.get('port'));
