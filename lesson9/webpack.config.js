const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const webpack = require("webpack");

const processENV = process.env.NODE_ENV;
console.log(processENV);
module.exports = (env) => {
  console.log('函数里的', env);
  return ({
    //  mode 当前的运行模式：开发环境/生产环境/不指定环境
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: "./src/index.js",
    output: {
      path: resolve(__dirname, "dist"), // 输出文件夹的绝对路径
      filename: "main.js", // 输出的文件名
      // publicPath: "/assets",
    },
    // 1) devServer会启动一个HTTP开发服务器，把一个文件夹作为静态根目录
    // 2) 为了提高性能，使用的是内存文件系统，将文件打包到内存中
    // 3) 默认情况下，devServer会读取output的输出路径
    // 4) devServer是先读取output中的输出路径，如果找不到，再读取 contentBase 的路径
    devServer: {
      contentBase: resolve(__dirname, "static"),
      writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
      compress: true, // 是否启动压缩
      port: 8080, // 制定HTTP服务器端口号
      open: true, // 自动打开浏览器
      // publicPath: "/",
    },
    externals: [{
      lodash: "_",
    }],
    module: {
      rules: [
        // {
        //   test: require.resolve("lodash"),
        //   loader: "expose-loader",
        //   options: {
        //     exposes: {
        //       globalName: "_",
        //       override: true,
        //     },
        //   },
        // },
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  ["@babel/preset-env",
                    //  {
                    //   useBuiltIns: 'usage', // 按需加载polyfill
                    //   corejs: { version: 3 }, // 指定corejs的版本号，2或者3版本，其实就是polyfill
                    //   targets: { // 指定要兼容哪些浏览器及其版本
                    //     chrome: '60',
                    //     firefox: '60',
                    //     ie: '9',
                    //     safari: '10',
                    //     edge: '17',
                    //   },
                    // }
                  ], // 可以转换JS语法
                  "@babel/preset-react", // 可以转换JSX语法
                ],
                plugins: [
                  ["@babel/plugin-proposal-decorators", { legacy: true }],
                  ["@babel/plugin-proposal-class-properties", { loose: true }],
                ],
              },
            },
          ],
        },
        { test: /\.txt$/, use: "raw-loader" },
        {
          test: /\.(jpg|png|bmp|jpeg|gif)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "[hash:8].[ext]",
                esModule: false,
                limit: 5 * 1024,
              },
            },
          ],
        },
        { test: /\.html$/, use: "html-loader" },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      // new webpack.ProvidePlugin({
      //   _: "lodash",
      // }),
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: "lodash",
            entry: processENV === 'development' ? 'http://localhost:8080/lodash.js' : "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js",
            global: "_",
          },
        ],
      }),
      new webpack.DefinePlugin({
        DEVELOPMENT: true,
        VERSION: "1",
        EXPRESSION: "1 + 2",
        COYPRIGHT: {
          AUTHOR: JSON.stringify('webpack5.x学习'),
        },
      }),
    ],
  });
};
