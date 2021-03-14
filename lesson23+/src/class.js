/**
 * 目的：实现ES6的class转换成ES5的构造函数
    class Person {
        constructor(name) {
            this.name = name;
        }
        getName() {
            return this.name;
        }
    }

    转换成
    
    function Person(name) {
        this.name = name
    }
    Person.prototype.getName = function () {
        return this.name
    }
 */


let core = require('@babel/core')
let types = require('babel-types')
let BabelPluginTransformClasses = require('@babel/plugin-transform-classes')
const sourceCode = `
class Person {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}
`

// 访问者模式visitor对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行的操作也不同
// babel插件其实是一个对象，它会有一个visitor访问器

// 1、仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
// 2、想办法把转换前的转换成转换后的，并且要尽可能的复用旧节点，
// 如果老的没有，新的有，就得创建新节点了，babel-types可以创建新节点
let BabelPluginTransformClasses2 = {
    // 每个插件都会有自己的访问器
    visitor: {
        ClassDeclaration(nodePath) {
            let { node } = nodePath
            let { id } = node; // Person 标识符
            let classMethods = node.body.body; // 获取原来类的方法 constructor和getName
            let body = []
            classMethods.forEach(method => { // 如果这个方法是构造函数
                if (method.kind === 'constructor') {
                    let constructorFunction = types.functionDeclaration(id, method.params, method.body, method.generator, method.async)
                    body.push(constructorFunction)
                } else { // 普通函数，则放到Person的原型上
                    // 成员表达式：创建Person.prototype
                    // id：Person  method.key：getName
                    let left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), method.key)
                    // 函数表达式：创建 function () {return this.name}
                    let right = types.functionExpression(null, method.params, method.body, method.generator, method.async);
                    // 函数声明
                    let assignmentExpression = types.assignmentExpression('=', left, right);
                    body.push(assignmentExpression)
                }
            })
            // replaceWith 替换成单节点
            // replaceWithMultiple  替换成多节点
            nodePath.replaceWithMultiple(body)
        }
    }
}

let targetCode = core.transform(sourceCode, {
    plugins: [BabelPluginTransformClasses2]
})
console.log(targetCode.code)