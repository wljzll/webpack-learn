let core = require('@babel/core')
let types = require('babel-types')
// let BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
const sourceCode = `
const sum = (a, b) => {
    return a + b
}
`
// 访问者模式visitor对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行的操作也不同
// babel插件其实是一个对象，它会有一个visitor访问器
let BabelPluginTransformEs2015ArrowFunctions = {
    // 每个插件都会有自己的访问器
    visitor: {
        ArrowFunctionExpression(nodePath) {
            let node = nodePath.node
            node.type = "FunctionExpression"
            // console.log(nodePath)
        }
    }
}

let targetCode = core.transform(sourceCode, {
    plugins: [BabelPluginTransformEs2015ArrowFunctions]
})
console.log(targetCode.code)
// const sum = function (a, b) {
//     return a + b;
// };