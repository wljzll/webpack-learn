// 1、引入核心包
const webpack = require('./webpack');
// 2、加载配置文件
const options = require('./webpack.config');
// 3、执行webpack，得到编译对象，就是一个大管家，是核心编译对象
const compiler = webpack(options)
// 4、调用comiller的run方法开始启动编译
debugger
compiler.run()
// compiler.run((err, status) => {
//     // 编译完成后执行回调
//     console.log('err=', err)
//     // state是编辑结果的描述对象
//     console.log(JSON.stringify(status.toJson({
//         assets: true, // 产出的资源 [main.js]
//         chunks: true, // 代码块 [main]
//         modules: true, // 模块 [./src/index.js] 或 [./src/index.js, ./src/title.js]
//         entrypoints: true // 入口模块[ ./src/index.js]
//     }), null, 2))
// })