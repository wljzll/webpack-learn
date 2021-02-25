## 编译监听：watch 当代码发生变化后，自动重新编译

### watch配置的方式：
- 1、在配置文件中配置
`
watch:true,
watchOptions: {
    ignored: /node_modules/, // 不监听哪些文件夹
    aggregateTimeout: 300, // 监听到文件发生变化后延迟300毫秒才去重新编译
    poll: 1000, // 1S扫描1000次文件系统，数字越大，越敏感，数字越小，越延迟
},
`
- 2、将watch命令配置在package.json脚本中，这样配置文件中的watch就不需要配置了，但是watchOptions还是需要的
`
"build": "webpack --watch",
`

## copy-webpack-plugin
- 安装 npm i copy-webpack-plugin -D
- 使用：
`
 const CopyWebpackPlugin = require("copy-webpack-plugin"); 
 new CopyWebpackPlugin({
  patterns: [
    {
      from: resolve(__dirname, 'src/documents'),
      to: resolve(__dirname, 'dist/documents'),
    },
  ],
}),
`
- 注意：这里使用的copy-webpack-plugin是7.x版本，node版本必须是12.X版本，否则会报错

## clean-webpack-plugin
- 安装 npm i clean-webpack-plugin -D
- 使用
`
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ["**/*"],
})
`
## proxy代理
- 使用
`
<!-- 直接代理 -->
devServer: {
    contentBase: resolve(__dirname, "static"),
    writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
    compress: true, // 是否启动压缩
    port: 8080, // 制定HTTP服务器端口号
    open: true, // 自动打开浏览器
    proxy: {
        '/api': 'http://localhost:3000'
    },
},

<!-- 重写 -->
devServer: {
    contentBase: resolve(__dirname, "static"),
    writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
    compress: true, // 是否启动压缩
    port: 8080, // 制定HTTP服务器端口号
    open: true, // 自动打开浏览器
    proxy: {
        '/api': {
            target: 'http://localhost:3000',
            pathRewrite: {
                "^/api": "",
            },
        },
    },
},
`
- devServer实现简单mock
`
devServer: {
    contentBase: resolve(__dirname, "static"),
    writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
    compress: true, // 是否启动压缩
    port: 8080, // 制定HTTP服务器端口号
    open: true, // 自动打开浏览器
    before(app) {
        app.get('/api/users', (req, res) => {
            res.json([{ id: 1, name: 'zhufeng' }]);
        });
    }
}
`

## webpack-dev-middleware