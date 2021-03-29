let fs = require('fs');
let readFile = fs.readFile.bind(this); // 读取硬盘上文件的默认方法

function runLoaders(options, callback) {
    let resource = options.resource || ""; // 要加载的资源 c:/src/index.js
    let loaders = options.loaders || []; // loader的绝对路径的数组
    let loaderContext = options.context || {}; // 这个是一个对象，它将会成为loader函数执行时候的上下文
    let readResource = options.readResource || readFile;
}

exports.runLoaders = runLoaders;