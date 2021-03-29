let Compiler = require('./Compiler')

/**
 * process.argv 命令行参数
    [
    'D:\\SOFTWARE\\NODE\\node.exe',
    'E:\\2021架构\\wepacklearn\\lesson26\\debug.js',
    '--mode=development'
    ]
 * @param {*} options 
 */
function webpack(options) {
    // 1、初始化参数：从配置文件和Shell语句中读取并合并参数，得出最终的配置对象
    // 获取命令行参数对象
    let shellConfig = process.argv.slice(2).reduce((shellConfig, item) => {
        let { key, value } = item.split('=') // item => --mode=development
        shellConfig[key.slice(2)] = value
        return shellConfig
    })
    // 合并配置参数
    let finalOptions = Object.assign(options, shellConfig)

    // 2、用上一步得到的参数初始化Compiler对象
    let compiler = new Compiler(finalOptions)

    // 3、加载所有配置的插件
    if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
        // 刚开始的时候，就会加载所有插件，并执行所有插件实例的apply方法，并传递compiler参数
        for (const plugin of finalOptions.plugins) {
            plugin.apply(compiler)
        }
    }

    return compiler
}
module.exports = webpack