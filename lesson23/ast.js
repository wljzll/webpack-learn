let esprima = require('esprima')
let estraverse = require('estraverse')
let escodegen = require('escodegen')

let sourceCode = `function ast() {}`

// 1、将源代码转化成抽象语法树
let ast = esprima.parseModule(sourceCode)
console.log(ast)

/**
 * 2、遍历抽象语法树
 * 遍历语法树采用的是深度遍历的方式
 * 遍历的时候只遍历有type属性的节点
 * 如果一个节点遍历完成，它同时有儿子和弟弟节点，
 * 如果先遍历弟弟节点就是广度遍历
 * 如果先遍历儿子节点就是深度遍历
 */
let indent = 0
let padding = () => " ".repeat(indent)

estraverse.traverse(ast, {
    enter(node) {
        console.log(padding() + '进入' + node.type)
        indent += 2
    },
    leave(node) {
        indent -= 2
        console.log(padding() + '离开' + node.type)

    }
})

// 3、将处理过的抽象语法树重新生成JS代码
let targetCode = escodegen.generate(ast)
console.log(targetCode)