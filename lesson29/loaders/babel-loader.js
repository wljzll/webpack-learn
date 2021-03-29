const core = require('@babel/core');

/**
 * 
 * @param {*} source 上一个loader给我这个loader的内容或者最原始模块内容
 * @param {*} inputSourceMap 
 * @param {*} data 
 */
function loader(source, inputSourceMap, data) {
    const options = {
        presets: ["@babel/preset-env"],
        inputSourceMap, // 上一个loader传递过来的sourecemap
        sourceMap: true // 告诉babel我要生成sourcemap
    }

    //  code: 转换后的代码 map: sourcemap ast: 抽象语法树
    let { code, map, ast } = core.transform(source, options)
    return code;
    return this.callback(null, code, map, ast);
}
module.exports = loader

/**
 * 1、当你需要返回多个值的时候需要使用 this.callback来传递多个参数 
 * 2、如果只需要返回一个值，可以直接return
 * 3、map可以让我们进行代码调试，debug的时候可以直接看到源代码
 * 4、ast：如果你返回ast给webpack，webpack则直接分析就可以了，不需要自己转AST了
 *         节约时间
 */