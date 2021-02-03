- babel-loader 使用Babel和webpack转译JavaScript文件
- @babel/core Babel编译的核心包
- @babel/preset-env 为每一个环境的预设
- @babel/preset-react React插件的Babel预设
- @babel/plugin-proposal-decorators 把类和对象装饰器编译成ES5
- @babel/plugin-proposal-class-properties 转换静态类属性以及使用属性初始化语法声明的属性

npm i babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/polyfill -D
npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D

## 什么是预设？什么是插件？
- 预设其实就是插件的集合，相当于把常用或者说必用的插件集合到这个预设里，安装的时候
安装这个预设就可以了，不需要一个个插件安装