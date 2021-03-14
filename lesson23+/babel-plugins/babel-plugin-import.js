const types = require('babel-types')
const visitor = {
    // 捕获ImportDeclaration节点
    ImportDeclaration: {
        /**
         * @param {*} path 节点的路径
         * @param {*} state 节点的状态 babel-loader配置项传递进来的配置项
         * @description 当进入这个节点的时候，执行此函数
         */
        enter(path, state = { opts }) {
            const { node } = path;
            const source = node.source;
            const specifiers = node.specifiers;
            if (state.opts.libraryName === source.value && !types.isImportDefaultSpecifier(specifiers[0])) {
                let ImportDefaultSpecifier = specifiers.map(specifier => {
                    let importDefaultSpecifier = types.importDefaultSpecifier(specifier.local)
                    // lodash/fp/[flatten/concat]
                    return types.importDeclaration([importDefaultSpecifier], types.stringLiteral(`${source.value}/${state.opts.libraryDirectory}/${specifier.imported.name}`))
                })
                path.replaceWithMultiple(ImportDefaultSpecifier)
            }

        }
    }
}

module.exports = function (babel) {
    return {
        visitor
    }
}