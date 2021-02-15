## 环境变量的配置

### 第一种配置环境变量的方式
- 在package.json的脚本中
- "build": "webpack --env=production",
- "start": "webpack serve --env=development"
- 这时候配置文件需要是个函数才能去接收env变量，env变量的形式是
- { WEBPACK_SERVE: true, development: true }，所以此时需要通过
- env.development取值去判断环境

### 第二种配置环境变量的方式：cross-env 跨操作系统配置环境变量
- 1、安装cross-env：npm i cross-env -D
- 2、在package.json的脚本中配置脚本：
-    "build": "cross-env NODE_ENV=production webpack",
-    "start": "cross-env NODE_ENV=development webpack serve"
- 在配置文件中通过 const processENV = process.env.NODE_ENV 取值
- 结果：就是NODE_EVN对应的值

### 浏览器环境下使用环境变量的问题
- 使用`webpack.definePlugin`插件定义：根据环境变量的值包装一个
- 对应的全局环境变量，但是并未挂载到window上，而是打包时给变成实际值了。
new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(processENV === 'development'),
    VERSION: "1",
    EXPRESSION: "1 + 2",
    COYPRIGHT: {
        AUTHOR: JSON.stringify('webpack5.x学习'),
    },
}),
- 关于配置对象中的值：
- 1、如果对应的键的值是字符串，那么整个字符串会被当做代码片段来执行(使用eval)，
-    其结果作为最终变量的值。
- 2、如果配置的值不是字符串，也不是对象字面量，那么该值会被转换为一个字符串，如：
-    如'true'，
- 3、如果配置的是对象字面量，那么该对象的所有的key会以同样的方式去定义
-    JSON.stringify('true')的结果是 'true'

