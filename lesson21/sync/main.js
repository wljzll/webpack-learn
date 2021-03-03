(() => {
    var modules = {
        './src/title.js': (module) => {
            module.exports = 'title'
        }
    }
    var cache = {}
    function require(moduleId) {
        if (cache[moduleId]) {
            return cache[moduleId].exports
        }
        var module = cache[moduleId] = {
            exports: {}
        }
        modules[moduleId](module, module.exports, require)
        return module.exports
    }
    // 入口文件 ./scr/index.js的代码
    (() => {
        let title = require('./src/title.js')
        console.log(title)
    })()
})()