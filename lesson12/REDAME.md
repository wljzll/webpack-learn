## babel/polyfill 和 babel-runtime

### babel/polyfill

- Babel默认只转换新的JavaScript语法，而不转换新的API，比如：Interator/Generator/Set/Maps/Proxy/Reflect/Symbol/Promise等
  全局对象，以及一些在全局对象上的方法(比如 Object.assign)都不会转码。
- 比如说，ES6在Array对象上新增了 Array.from 方法，Babel不会转码这个方法，如果想让这个方法运行，必须使用`babel-polyfill`来转
- 换

- `babel-polyfill`通过向全局对象和内置对象的prototype上添加方法来实现的，比如运行环境中不支持 `Array.prototype.find`方法，
- 引入`polyfill`，我们就可以使用ES6方法来编写了，但是缺点就是会造成全局空间污染。

- `@babel/preset-env`为每一个环境的预设：
  - `"useBuiltIns": false`：此时不对polyfill做操作，如果引入 `@babel/polyfill`，则无视配置的浏览器兼容，全量引入`polyfill`

  - `"useBuiltIns": "entry"`: 根据配置的浏览器兼容，引入浏览器不兼容的`polyfill`，需要在入口文件手动添加`import "@babel/polyfill"`,
  - 会自动根据browserslist替换成浏览器不兼容的所有`polyfill`，
  - 这里需要指定`core-js`的版本，如果是`core-js:3`，则 `import @babel/polyfill`需要改成`import "core-js/stable"`和
  - `import "regenerator-runtime/runtime"`
  
  - `"useBuiltIns": "usage"`：会根据配置的浏览器的兼容，以及你代码用到的API来进行polyfill，实现了按需添加

### babel-runtime
- Bable为了解决全局空间污染的问题，提供了单独的包`babel-runtime`用提供编译模块的工具函数
- 简单的说，`babel-runtime`更像是一种按需加载的实现，比如你哪里需要使用Promise，只要在这个文件头部 
- `require Promise from "babel-runtime/cpre-js/promise"`就行了
- npm i babel-runtime -D
`
import Promise from "babel-runtime/core-js/promise"
const p = new Promise(() => {

})
console.log(p)
`

### babel-plugin-transform-runtime
- 启用插件`babel-plugin-transform-runtime`后，Babel就会使用`babel-runtime`下的工具函数。
- `babel-plugin-transform-runtime`插件能够将这些工具函数的代码转换成require语句，指向为对`babel-runtime`的引用。
- `babel-plugin-transform-runtime`就是可以在我们使用新的API时自动import babel-runtime里面的polyfill
  · 当我们使用 async/await时，自动引入babel-runtime/regenerator
  · 当我们使用ES6的静态事件或者内置对象时，自动引入babel-runtime/core-js
  · 移除内联 babel-helpers 并替换使用 babel-runtime/helpers来替换

`
npm i @babel/runtime-corejs2 -D
npm i @babel/plugin-transform-runtime -D

plugins: [
  [
    '@babel/plugin-transform-runtime',
    {
      corejs: 3,
      helpers: true, // 是否提取一些类的继承的帮助方法，helpers=true 提取成单独的模块，如果是false不提取， 移除内联babel helpers并替换使用 babel-runtime/helpers来替换
      regenerator:true // 是否开启 generatro函数转换成使用regenerator-runtime来避免全局污染 
    }
  ]
]
// helpers和regenerator为true表示提取成单独的模块
`

## 最佳实践
- babel-runtime适合在组件和类库项目中使用，而babel-polyfill适合在业务项目中使用

- 未转义ES6高阶语法: main.js 247 bytes
- 配置了useBuiltIns: false之后：main.js 466 KiB
- 配置了useBuiltIns: "entry"之后，使用core-js@2 => main.js 393 KiB; 使用core-js@3 => main.js 650 KiB
- 配置了useBuiltIns: "usage", main.js 319 KiB