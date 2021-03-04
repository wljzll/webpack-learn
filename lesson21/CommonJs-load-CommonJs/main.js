(() => {
    var modules = {
        './src/title.js': (module) => {
            module.exports = 'title'
        }
    }
    var cache = {}
    // 2、加载title.js模块
    function require(moduleId) {
        // 2.1 如果缓存中有就使用缓存中的
        if (cache[moduleId]) {
            return cache[moduleId].exports
        }
        // 2.2 如果缓存中不存在，新定义一个module存放当前加载的模块，并且放入缓存中
        var module = cache[moduleId] = {
            exports: {}
        }
        // 2.3 执行modules中对应模块的代码
        modules[moduleId](module, module.exports, require)
        // 2.4 将当前加载的模块导出
        return module.exports
    }
    // 入口文件 ./scr/index.js的代码
    // 1、 执行index.js代码 - 通过webpack的require方法加载title.js模块
    (() => {
        let title = require('./src/title.js')
        console.log(title)
    })()
})()