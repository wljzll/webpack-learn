const { SyncHook } = require('tapable')
const path = require('path')
const fs = require('fs')
const types = require('babel-types');
const parser = require('@babel/parser'); // 将源代码转成AST抽象语法树
const traverse = require('@babel/traverse'); // 遍历语法树
const generator = require('@babel/generator'); // 把抽象语法树重新生成代码
const { Dependency } = require('webpack');

function toUnixPath(filePath) {
    return filePath.replace(/\\/g, '/')
}

// 根目录
let baseDir = toUnixPath(process.cwd())

class Compiler {
    constructor(options) {
        this.options = options;
        this.hooks = {
            run: new SyncHook(), // 会在开始编译的时候触发
            done: new SyncHook() // 会在完成编译的时候触发
        }
    }
    run() {
        let modules = []; // 存放所有的模块
        this.hooks.run.call(); // 当调用run方法的时候会触发run这个钩子，进而执行它的回调

        // 5、根据配置中的`entry`找出入口文件，得到entry的绝对路径
        let entry = toUnixPath(path.join(this.options.context, this.options.entry)) // E:\2021架构\wepacklearn\lesson26\src\index.js
        console.log(entry)

        // 从入口文件出发，调用所有配置的`loader`对模块进行编译
        let entryModule = this.buildModule(entry)

        // 再递归本步骤直到所有入口依赖的文件都经过本步骤的处理
        entryModule.dependencies.forEach(dependency => {
            let dependencyModule = this.buildModule(dependency);
            modules.push(dependencyModule);
        });

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

        // 6、从入口文件出发，调用所有配置的`loader`对模块进行编译
        for (let i = loaders.length - 1; i >= 0; i--) {
            let loader = loaders[i]
            targetSourceCode = require(loader)(targetSourceCode)
        }
        console.log('originalSourceCode', originalSourceCode)
        console.log('targetSourceCode', targetSourceCode)
        // 现在我们已经得到转换后的代码 babel-loader ES6 => ES5

        // 7、再找出该模块依赖的模块，
        // 7.1 将源代码转换为抽象语法树
        let astTree = parser.parse(targetSourceCode, { sourceType: 'module' })

        let moduleId = './' + path.posix.relative(baseDir, modulePath) // ./src/index.js
        // webpack 最核心的几个概念：module，module（id）有moduleId，依赖的模块的数组dependencies
        let modlue = { id: moduleId, dependencies: [] }

        // 7.2 遍历抽象语法树，并找出require节点
        traverse(astTree, {
            CallExpression({ node }) {
                if (node.callee.name === 'require') {

                    // 获取模块名字 './title'; 存在两个问题：1、这个模块名字是相对路径；2、而且是相对于当前模块的
                    let moduleName = node.arguments[0].value; // './title'
                    // 依赖模块的路径 => 
                    let depModulePath = ''; // E:\2021架构\wepacklearn\lesson26\src\title.js
                    // 获取当前路径(modulePath)所在的目录 => E:\2021架构\wepacklearn\lesson26\src\
                    if (path.isAbsolute(moduleName)) { // 如果moduleName是一个绝对路径（这种情况很少）
                        depModulePath = moduleName
                    } else { // moduleName是相对路径
                        // E:\2021架构\wepacklearn\lesson26\src
                        let dirname = path.posix.dirname(modulePath)

                        // 获取依赖模块的路径 =>  E:\2021架构\wepacklearn\lesson26\src\title
                        let depModulePath = path.posix.join(dirname, moduleName)
                    }
                    // 获取配置项中的extensions => 比如：['.js', '.jsx', '.ts']
                    let extensions = this.options.resovle.extensions
                    // 获取完整文件路径（有文件后缀）=> E:\2021架构\wepacklearn\lesson26\src\title.js
                    depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirname)

                    // 模块ID的问题：每个打包后的模块都有个模块ID，如何生成require模块的模块ID
                    let depModuleId = './' + path.posix.relative(baseDir, depModulePath) // ./src/title.js

                    // 修改抽象语法树
                    node.arguments[0] = [types.stringLiteral(depModuleId)]

                    module.dependencies.push(depModulePath)
                }

            }
        })

        // 根据新的语法树生成新代码
        let { code } = generator(astTree);
        module._source = code; // 模块上现在有三个属性了：moduleId dependencies _source
        return module
    }
}
/**
 * 
 * @param {*} modulePath 模块的路径（没有后缀名）=> E:\2021架构\wepacklearn\lesson26\src\title
 * @param {*} extensions 配置文件中的扩展 => 比如：['.js', '.jsx', '.ts']
 * @param {*} originalModulePath 模块原始的相对路径 => './title'
 * @param {*} moduleContext 引入该模块的模块的所在目录 => index.js的目录 => E:\2021架构\wepacklearn\lesson26\src
 * @returns 
 */
function tryExtensions(modulePath, extensions, originalModulePath, moduleContext) {
    for (let index = 0; index < extensions.length; index++) {
        if (fs.existsSync(modulePath + extensions[index])) {
            return modulePath + extensions[index]
        }
    }
    throw new Error(`Module not fount: Error: Can't resolve '${originalModulePath}' in '${moduleContext}'`)
}

module.exports = Compiler