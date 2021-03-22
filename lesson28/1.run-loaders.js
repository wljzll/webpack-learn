let path = require('path');
let fs = require('fs');
let { runLoaders } = require("loader-runner");
let resource = path.resolve(__dirname, 'src', 'index.js');

let loaders = [
        path.resolve(__dirname, 'loaders', 'post-loader1.js'),
        path.resolve(__dirname, 'loaders', 'post-loader2.js'),
        path.resolve(__dirname, 'loaders', 'inline-loader1.js'),
        path.resolve(__dirname, 'loaders', 'inline-loader2.js'),
        path.resolve(__dirname, 'loaders', 'normal-loader1.js'),
        path.resolve(__dirname, 'loaders', 'normal-loader2.js'),
        path.resolve(__dirname, 'loaders', 'pre-loader1.js'),
        path.resolve(__dirname, 'loaders', 'pre-loader2.js')
    ]
    /**
     * 1、读取要加载的资源
     * 2、把资源传递给loader链条，一一处理，最后得到结果
     */
runLoaders({
    // 要加载和转换的资源 可以包含查询字符串 
    resource,
    // loader的绝对路径数组
    loaders,
    // 额外的loader上下文
    context: { name: '珠峰' },
    // 读取文件的方法
    readResource: fs.readFile.bind(fs)

}, function(err, result) {
    console.log(err);
    console.log(result);

})