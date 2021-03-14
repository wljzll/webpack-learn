let core = require('@babel/core')
let types = require('babel-types')
// let BabelPluginTransformEs2015ArrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
const sourceCode = `
const sum = (a, b) => {
    console.log(this)
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
            // 处理this指针的问题
            const thisBinding = hoistFunctionEnvironment(nodePath)
            node.type = "FunctionExpression"
        }
    }
}

function hoistFunctionEnvironment(fnPath) {
    // thisEnvFn是Program节点
    const thisEnvFn = fnPath.findParent(p => {
        // 如果是函数不能是箭头函数，或者是Program或者是类的属性
        return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram()
    })
    // thisPaths存放的是哪些地方用到了this 
    let thisPaths = getScopeInfoInformation(fnPath)
    let thisBinding = '_this'; // 把this变量重定向到的变量名
    // 如果有地方用到了，则需要在this.EnvFn环境上添加一个语句 let _this = this
    if (thisPaths.length > 0) {
        // 表示在this环境函数中添加一个变量，变量的id名叫_this，初始值是 thisExpression()
        // 也就是在箭头函数的父作用域中 let _this = this
        thisEnvFn.scope.push({
            id: types.identifier(thisBinding),
            init: types.thisExpression()
        })
        console.log(types.identifier(thisBinding), types.thisExpression())
        // 遍历所有使用到this的路径节点(子节点)，把所有的thisExpression替换成_this
        thisPaths.forEach(thisChild => {
            let thisRef = types.identifier(thisBinding)
            thisChild.replaceWith(thisRef);
        })
    }
}
function getScopeInfoInformation(fnPath) {
    thisPaths = []
    // 找到当前函数中用到this的节点
    fnPath.traverse({
        ThisExpression(expression) {
            thisPaths.push(expression)
        }
    })
    console.log(thisPaths)
    return thisPaths
}
let targetCode = core.transform(sourceCode, {
    plugins: [BabelPluginTransformEs2015ArrowFunctions]
})
// console.log(targetCode.code)
// const sum = function (a, b) {
//     return a + b;
// };


