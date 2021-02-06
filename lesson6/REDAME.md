## eslint代码风格检查
## 依赖：npm i eslint eslint-loader babel-eslint -D
- eslint：核心包
- eslint-laoder：把源代码转换成抽象语法树，这个loader支持ES6语法的转换
- babel-eslint：转换ES6的转换工具

## 启用eslint代码风格检查步骤
- 1、安装依赖
- 2、配置规则
- 3、编写eslintrc.js配置文件 => 写错了不生效的
- 4、在VsCode中安装eslint插件

## 如何使用第三方规范：
 - 以 `airbnb` 为例：
 - 1、安装：npm install --save-dev eslint-config-airbnb eslint eslint-plugin-jsx-a11y eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks
 - 2、在.eslintrc.js中添加 extends: "airbnb", 继承airbnb的配置
 - 3、设置保存代码时自动修复代码：
 - 在项目中的.vscode > settings.json中
 {
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "typescript",
        "typescriptreact"
    ],
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
- 但是好像不生效，需要全局设置，在 文件—>首选项—>设置处选择setting配置
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}