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
安装这个预设就可以了，不需要一个个安装插件

## legacy和loose参数：
- legacy：默认值是false，设置为true时，表示使用过期的语法(stage1阶段)，因为stage1阶段的语法可能
会被废弃，设置为true，达到更好的兼容性
- loose：默认值是false，这个属性决定了以何种方式去编译Class：
   【loose: true】:表示将Class的属性编译成构造函数的形式去定义。
   【loose: false】:表示将Class的属性编译成以Object.defineProperty的形式去定义。

## @babel/preset-env的参数
- 为什么使用了@babel/preset-env后还要使用 @babel/polyfill？
- 因为@babel/preset-env不是所有的ES6语法都能转换成ES5语法，比如Promise/Set/Map之类的
  @babel/preset-env就无法转换，那么我们就只能使用额外的插件去转换这一部分语法。

## @babel/polyfill是干什么的？
- @babel/polyfill是一些包集合，这些包分别用ES5实现了一些@babel/preset-env不能转换的高阶语法，例如
当我们使用Promise时，@babel/polyfill会用自己实现的Promise去替换代码中的Promise

## @babel/polyfill的使用方式：
- 1、直接在JS文件顶部`全量引入` => require("@babel/polyfill")
- 2、通过webpack配置`按需引入`
- 3、通过polyfill.io通过cdn方式引入：polyfill.io会根据请求的浏览器，返回不同的代码，如果是高版本浏览器，
不需要再去转换语法，则不返回那些兼容方法，低版本浏览器则返回对应文件，文件中包含该版本浏览器不支持的方法。

## useBuiltIns的三种配置：
- false: 不对polyfill做操作，如果引入@babel/polyfill，则无视配置的浏览器兼容，引入所有的 polyfill
- entry：根据配置的浏览器兼容，引入浏览器不兼容的 polyfill。需要在入口文件手动添加 import "@babel/polyfill"
- usage：会根据代码中使用到API来进行 polyfill，实现了按需加载。

## `@babel/preset-env`默认支持JS语法的转化，如果我们想转化API和实例方法，需要开启 useBuiltIns 才能转化
- 最新ES语法：比如，箭头函数
- 最新ES API：比如，Promise
- 最新ES 实例方法：比如，String.prototype.includes