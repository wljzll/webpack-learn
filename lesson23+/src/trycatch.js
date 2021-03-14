/**
 * 目的：给函数体内代码自动包裹上try...catch语句

    function sum(a, b) {
        return a + b + c
    }

    转换成 

    function sum(a, b) {
        try {
            return a + b + c
        } catch (error) {
            console.log(error)
        }
    }
 */


let core = require('@babel/core');
let types = require('babel-types');
const template = require('@babel/template');
const sourceCode = `
function sum(a, b) {
    return a + b + c
}
`

// 1、仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
// 2、想办法把转换前的转换成转换后的，并且要尽可能的复用旧节点，
// 如果老的没有，新的有，就得创建新节点了，babel-types可以创建新节点

let TryCatchTransformPlugin = {
    // 每个插件都会有自己的访问器
    visitor: {

        FunctionDeclaration(nodePath) {
            let { node } = nodePath
            let { id } = node; // Person 标识符
            let blockStatement = node.body
            // 如果次函数的第一个语句已经是一个try语句了，就不要再处理了 会死循环
            if (blockStatement.body && types.isTryStatement(blockStatement.body[0])) return

            // tempalte库可以把一个JS字符串转换成AST语法树节点
            let catchStatement = template.statement('console.log(error)')()
            // 生成 catch 语句 catch中的内容为 console.log(error)
            let catchClause = types.catchClause(types.identifier('error'), types.blockStatement([catchStatement]))
            // 生成try...catch语句，try中的代码为原函数的函数体
            let tryStatement = types.tryStatement(blockStatement, catchClause);
            // 生成新的函数体
            var func = types.functionExpression(id, node.params, types.blockStatement([tryStatement]), node.generator, node.async)
            nodePath.replaceWith(func)
        }
    }
}

let targetCode = core.transform(sourceCode, {
    plugins: [TryCatchTransformPlugin]
})
console.log(targetCode.code)