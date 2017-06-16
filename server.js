const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const http = require('http');
const ws = require('ws');
const config = require('./webpack.dev.config.js');

const DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_PORT = 3000;
const compiler = webpack(config);
const isDevelopment = process.env.NODE_ENV !== 'production';
const app = express();

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

const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ws.send(message);
  });

  ws.send('blue');
});

server.listen(app.get('port'));
