## 1、AST抽象语法树

  ### `webpack`和`Lint`等很多工具和库的核心都是通过`Abstract Syntax Tree`抽象语
  ### 法树这个概念来实现代码的检查、分析等操作的。
  · 通过了解抽象语法树这个概念，你也可以随手编写类似的工具

## 2、抽象语法树用途
  - 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码的错误提示、
  代码自动补全等等
    · 如JSlint、JSHint对代码错误或风格的检查，发现一些潜在的错误。
    · IDE的错误提示、格式化、高亮、自动补全等等
  
  - 代码混淆压缩
    · UglifyJS2等

  - 优化变更代码，改变代码结构使达到想要的结构
    · 代码打包工具 webpack、rollup等等
    · CommonJS、AMD、CMD、UMD等代码规范间的转化
    · CoffeeScript、TypeScript、JSX等转化为原生JS

## 3、抽象语法树定义
  - 这个工具的原理都是通过`Javascript Parser`把代码转化为一棵抽象语法树，这棵树定
  - 义了代码的结构，通过操纵这棵树，我们可以精准的定位到声明语句、赋值语句、运算语
  - 句等等，实现对代码的分析、优化、变更等操作。
  
  > 在计算机科学中，抽象语法树（abstract syntax tree或者缩写为AST），或者语法树
  （syntax tree），是源代码的抽象语法结构的树状表现形式，这里特指编程语言的源代码

  > Javascript的语法是为了给开发者更好的编程而设计的，但是不适合程序的理解，所以需要
  转化为AST来使之更适合程序分析，浏览器编译器一般会把源代码转化为AST来进行进一步的分
  析等其他操作

## 4、JavaScript Parser
  · JavaScript Parser：把JS源码转化为抽象语法树的解析器。
  · 浏览器会把JS源码通过解析器转化为抽象语法树，再进一步转化为字节码或直接生成机器码
  · 一般来说每个JS引擎都会有自己的抽象语法树格式，Chrome的V8引擎，Firefox的SpiderMonky引擎等，
  MDN提供了详细的SpiderMonky AST format的详细说明，算是业界的标准。
  
  ### 常用的JavaScript Parser
    · esprima
    · traceur
    · acorn
    · shift

  ### esprima
    · 通过`esprima`把源码转化为AST
    · 通过`estraverse`遍历并更新AST
    · 通过`escodegen`将AST重新生成源码
    · `astexplore` AST的可视化工具 [https://astexplorer.net/]
    `
    npm i esprima estraverse escodegen -D
    `

## 5、babel插件
  
  · 访问者模式`Visitor`对于某个对象或者一组对象，不同的访问者，产生的结果不同，执行的操作也不同

  · `@babel/core`Babel的编译器，核心API都在这里面，比如常见的 transform/parse/babylon Babel的解析器

  · `babel-types`[[https://babeljs.io/docs/en/babel-types.html]用于AST节点的lodash式工具库，它包含了构造、验证以及变换AST节点的方法，对编写处理AST逻辑非常有用

  · `babel-template`可以将普通字符串转化成AST，提供更便捷的使用

  · `babel-traverse`用于对AST的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点