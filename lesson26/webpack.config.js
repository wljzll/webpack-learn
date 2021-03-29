const { resolve } = require("path");
const RunPlugin = require('./plugins/run-plugin')
const DonePlugin = require('./plugins/done-plugin')
module.exports = {
  //  mode 当前的运行模式：开发环境/生产环境/不指定环境
  mode: 'development',
  // E:\2021架构\wepacklearn\lesson26\
  context: process.cwd(), // 根目录 current working directory 
  devtool: "hidden-source-map",
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, "dist"), // 输出文件夹的绝对路径
    filename: "main.js", // 输出的文件名
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
<<<<<<< HEAD
          resolve(__dirname, 'loaders', 'logger1-loader.js'),
          resolve(__dirname, 'loaders', 'logger2-loader.js'),
=======
          // resolve(__dirname, 'loaders', 'logger1-loader.js'),
          // resolve(__dirname, 'loaders', 'logger2-loader.js'),
>>>>>>> cd4d85717a36b261d93299d5c6bd3cb4a1779063
          // path.resolve(__dirname, 'loaders', 'logger3-loader'),
          // path.resolve(__dirname, 'loaders', 'logger4-loader'),
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),
    new DonePlugin()
  ]
}
