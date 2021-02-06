module.exports = {
    // root: true,  // 表明这个配置文件是根配置文件，权限最高
    parser: 'babel-eslint', // 把源代码转换成抽象语法树，这个loader支持ES6语法的转换
    extends: "airbnb", // 继承airbnb的eslint配置
    // 之地当解析器选项
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2015,
    },
    // 指定脚本的运行环境
    env: {
        browser: true,
    },
    // 启用的规则及其各自的错误级别
    rules: {
        indent: "off", // 缩进风格 ["error", 2]
        quotes: "off", // 引号类型
        "no-console": "off", // 禁止使用console
        "no-undef": "off",
        "no-debugger": "off",
    },
};
