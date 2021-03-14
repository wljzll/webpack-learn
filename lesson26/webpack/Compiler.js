const { SyncHook } = require('tapable')
const path = require('path')
const fs = require('fs')

function toUnixPath(filePath) {
    return filePath.replace(/\\/g, '/')
}

class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), // 会在开始编译的时候触发
            done: new SyncHook() // 会在完成编译的时候触发
        }
    }
    run() {
        this.hooks.run.call(); // 当调用run方法的时候会触发run这个钩子，进而执行它的回调

        // 5、根据配置中的`entry`找出入口文件，得到entry的绝对路径

        // E:\2021架构\wepacklearn\lesson26\src\index.js
        let entry = toUnixPath(path.join(this.options.context, this.options.entry))
        console.log(entry)

        // 从入口文件出发，调用所有配置的`loader`对模块进行编译
        let entryModule = this.buildModule(entry)
        // 中间是编译流程

        this.hooks.done.call()
    }
    buildModule(modulePath) {
        // 读取原始源代码
        
        let originalSourceCode = fs.readFileSync(modulePath, 'utf-8');
        let targetSourceCode = originalSourceCode;
        // 查找此模块对应的loader 对代码进行转换
        let rules = this.options.module.rules
        let loaders = []
        for (let index = 0; index < rules.length; index++) {
            if (rules[index].test.test(modulePath)) {
                loaders = [...loaders, ...rules[index].use]
            }
        }

        for (let i = loaders.length - 1; i >= 0; i--) {
            let loader = loaders[i]
            targetSourceCode = require(loader)(targetSourceCode)
        }
        console.log('originalSourceCode', originalSourceCode)
        console.log('targetSourceCode', targetSourceCode)
    }
}

module.exports = Compiler