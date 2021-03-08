## 转换箭头函数Babel插件
  
  - @babel/core：babel/core的功能只是用来生成语法树、遍历语法树、生成新代码的 ，并不负责转换语法树
  - babel-types[https://babeljs.io/docs/en/babel-types.html]：
  - babel-plugin-transform-es2015-arrow-functions
  `
  npm i "@babel/core" babel-types babel-plugin-transform-es2015-arrow-functions -D
  注意：安装@babel/core时要加双引号，不然安装报错
  `