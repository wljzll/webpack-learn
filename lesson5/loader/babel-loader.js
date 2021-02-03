
let babelCore = require('@babel/core')
let presetEnv = require('@babel/preset-env')

/**
 * 1、babel-loader的作用是调用babelCore，它并不能解析JS文件。
 * 2、babelCore本身只是提供一个过程管理功能：
 *    把源代码转成抽象语法树，进行遍历和生成，它本身也并不知道具体要转换成
 *    什么语法，以及语法如何转换。
 */

/**
 * 
 * @param {*} source JS源文件内容
 */
function loader(source) {
    let es5 = babelCore.transform(source, {
        preset:["@babel/preset-env"]
    })
}

/**
 * 1、先把ES6转成ES6语法树 => babelCore
 * 2、然后调用预设preset-env把ES6语法树转换成ES5语法树 => preset-env
 * 3、再把ES5语法树重新生成为ES5代码 =>babelCore
 */