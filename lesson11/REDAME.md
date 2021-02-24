## 编译过程监听 watch 

## proxy代理
- 最简单的代理
`
proxy: {
  '/api': 'http://localhost:3000',
},
`
- 重写
`
proxy: {
  '/api': {
      target: 'http://localhost:3000',
      pathRewrite: {
          "^/api": "",
      },
  },
},
// 重写：例如我们请求： localhost:8080/api/users时，代理中的重写会代理到localhost:3000/users接口，其实就是将接口请求中的/api替换掉
`
## 解决没有服务器模拟的问题
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
    },
    // proxy: {
    //     '/api': {
    //         target: 'http://localhost:3000',
    //         pathRewrite: {
    //             "^/api": "",
    //         },
    //     },
    // },
},
`