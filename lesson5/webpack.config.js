const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  //  mode 当前的运行模式：开发环境/生产环境/不指定环境
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: resolve(__dirname, "dist"), // 输出文件夹的绝对路径
    filename: "main.js", // 输出的文件名
    publicPath: "/assets",
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
  module: {
    rules: [
      { test: /\.jsx?$$/, use:[
        {
          loader: 'babel-loader',
          options: {
            presets: [
              "@babel/preset-env", // 可以转换JS语法
              "@babel/preset-react" // 可以转换JSX语法
            ],
            plugins:[
              ["@babel/plugin-proposal-decorators",{legacy: true} ],
              ["@babel/plugin-proposal-class-properties",{loose: true} ]
            ]
          }
        }
      ] },
      { test: /\.txt$/, use: "raw-loader" },
      {
        test: /\.(jpg|png|bmp|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[hash:8].[ext]",
              esModule: false,
              limit: 5*1024
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
  ],
};
