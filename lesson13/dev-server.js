const express = require('express');

const app = express();
const webpack = require('webpack');
const WebpackDevMiddleWare = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');

webpackOptions.mode = 'development';
const complier = webpack(webpackOptions);
app.use(WebpackDevMiddleWare(complier, {}));
app.listen(9000);
