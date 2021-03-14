## 转换箭头函数Babel插件
  
  - @babel/core：babel/core的功能只是用来生成语法树、遍历语法树、生成新代码的 ，并不负责转换语法树

  - babel-types[https://babeljs.io/docs/en/babel-types.html]：

  - babel-plugin-transform-es2015-arrow-functions
  `
  npm i "@babel/core" babel-types babel-plugin-transform-es2015-arrow-functions -D
  注意：安装@babel/core时要加双引号，不然安装报错
  `

## 把类编译为Function
  
  - @babel/plugin-transform-classes
  `
  npm i @babel/plugin-transform-classes -D
  `

## 编写插件的一般步骤
  > 1、仔细观察转换前和转换后的语法树，找到它们的相同点和不同点
  2、想办法把转换前的转换成转换后的，并且要尽可能的复用旧节点，
  如果老的没有，新的有，就得创建新节点了，babel-types可以创建新节点

  types.identifier('_this') => { type: 'Identifier', name: '_this' }
  types.thisExpression()    => { type: 'ThisExpression' }
  types.functionDeclaration(id, method.params, method.body, method.generator, method.async)
  types.memberExpression(id, types.identifier('prototype'))
  types.assignmentExpression('=', left, right);