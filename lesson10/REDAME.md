### 模式(mode)详解：
- 日常的开发工作中，一般都会有两套构建环境。
- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印debug信息，包含sourcemap文件。
- 一套构建后的结果是直接应用于线上的，即代码都是压缩后的，运行时不打印debug信息，静态文件不包括sourcemap。
- webpack4.x版本引入了mode的概念。
- 当你指定使用production mode时，默认会启用各种性能优化的功能，包括构建结果优化以及webpack运行性能优化。
- 而如果是development mode的话，则会开启debug工具，运行时打印详细的错误信息，以及更加快速的增量编译构建。

- development：会将 process.env.NODE_ENV的值设为development。启用 NamedChunksPlugin 和 NamedModulesPlugin
- production：会将 process.env.NODE_ENV的值设为production。启用 FlagDependencyUsagePlugin，
- FlagIncludeChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，
- SideEffectsFlagPlugin 和 UglifyJsPlugin


### 环境变量 process.env.NODE_ENV 的区分：
- process.env.NODE_ENV分为两种，
-  1、是node环境下的环境变量(node的进程对象)。
-  2、是模块(也就是JS文件中)中使用的环境变量。
-  3、配置文件中导出函数中的env。

### 配置mode的方式以及对环境变量的影响：
- 1、命令行配置：
  - 1) webpack在执行的时候，mode默认是production，它在模块内(JS文件)内，可以通过process.env.NODE_ENV读取到。

  - 2) 在package.json中配置脚本： `webpack --mode=development` 来改变mode的值。这时命令行的脚本可以覆盖配置
  - 中的mode配置，在脚本中配置的mode只影响模块内的环境变量。

  - 3) 在package.json中配置脚本：`webpack --env=development` 改变的是配置文件导出函数中的参数 env 的值。

  - 4) 在package.json中配置脚本：`cross-env NODE_ENV=production` 或者 `set NODE_ENV=production` 改变的是配置文
  - 件也就是node环境下的环境变量。

  - 5) 在配置文件中通过DefinePlugin插件去定义对应的全局变量 `process.env.NODE_ENV` 来覆盖webpack默认调用 
  - DefindPlugin插件设置的 `process.env.NODE_ENV` 全局变量。

### 总结：改变三种环境变量的方式
- 1、node进程对象(node环境下的环境变量)：通过cross-env插件修改。
- 2、模块内(JS文件中)的环境变量：
     - 1) 默认是 `production`，可以通过配置脚本： `webpack --mode=development`来改变。
     - 2）可以通过 `DefinePlugin` 插件，修改全局变量的方式来修改 `process.env.NODE_ENV`全局变量的值。
- 3、配置文件导出函数参数的环境变量：通过配置脚本 `webpack --env=development` 来改变。