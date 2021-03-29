const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  // resolveLoader: {
  //   alias: {
  //     "babel-loader": path.resolve("./loader/babel-loader.js"),
  //   },
  //   modules: [path.resolve('./loaders'), 'node_modules']
  // },
  module: {
    rules: [
      {
        test: /\.less$/,
        // use: ['style-loader', 'less-loader'],
        use: [path.resolve("./loaders/style-loader.js"), path.resolve("./loaders/less-loader.js")],
        include: path.resolve("src")
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
