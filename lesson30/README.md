### 想使用自定义的loader有三种方法：


### 问题
 - loader如果有异步的话，也只能用callback吧？
  答：是的

 - loader的返回值没有确定的吗？没有固定要求去返回源代码还是语法树吗？
   答：最左边的loader返回值只能是JS代码，因为它的返回值是给webpack的，
    webpack是要用它生成JS AST。
    其他的loader返回值没有要求，可以是任意的内容，但是要求下一个loader
    能够处理