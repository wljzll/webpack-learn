const path = require('path');
const { getOptions, interpolateName } = require('loader-utils');
/**
 * file-loader负责打包加载图片
 * 1、把此文件内容拷贝到目标目录里
 * @param {*} source 上一个loader给我这个loader的内容或者最原始模块内容
 * @param {*} inputSourceMap 
 * @param {*} data 
 */
function loader(content) {
    let options = getOptions(this) || {};
    let filename = interpolateName(this, "[hash:8].[ext]", { content: content });
    console.log(filename, '========================')
    this.emitFile(filename, content);
    if (typeof options.esModule === 'undefined' || options.esModule) {
        return `export default "${filename}"`
    } else {
        return `module.exports="${filename}"`
    }

}

loader.raw = true; //这样写辨识source是一个二进制
module.exports = loader