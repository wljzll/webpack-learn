## toStringTag的用法(https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag)：
  `
    Symbol.toStringTag 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字
    符串用来表示该对象的自定义类型标签，通常只有内置的 Object.prototype.toString() 方法会去读取这个标签并把
    它包含在自己的返回值里。
  `
  - 自己理解，就是给对象通过toStringTag方法定义一个能够被Object.prototype.toString()方法读取的自定义的数据
    类型
  
  `
    // 内置类
    Object.prototype.toString.call('foo');     // "[object String]"
    Object.prototype.toString.call([1, 2]);    // "[object Array]"
    Object.prototype.toString.call(3);         // "[object Number]"
    Object.prototype.toString.call(true);      // "[object Boolean]"
    Object.prototype.toString.call(undefined); // "[object Undefined]"
    Object.prototype.toString.call(null);      // "[object Null]"

    // 未使用toStringTag定义
    class ValidatorClass {}

    Object.prototype.toString.call(new ValidatorClass()); // "[object Object]"

    <!-- 使用toStringTag定义 -->
    class ValidatorClass {
      get [Symbol.toStringTag]() {
        return "Validator";
      }
    }

    Object.prototype.toString.call(new ValidatorClass()); // "[object Validator]"
  `

## webpack同步加载打包文件分析
 
## CommonJS模块加载CommonJS模块

## CommonJS模块加载ESModule模块

## ESModule模块加载CommonJS模块

## ESModule模块加载ESModule模块


## _webpack_require_.r为什么r方法用字母简写，而_webpack_require_不简写
  - r方法用字母简写是为了减少打包后的文件体积
  - _webpack_require_不简写的原因是在代码压缩阶段可以压缩成一个字母，而r方法
    一类的是作为属性名，无法压缩，所以必须简写，来减少文件体积

## webpack是如何知道一个模块是ESModule还是CommonJS模块的
  - webpack会扫描文件，如果文件代码中有import或者export，webpack就认定这是一个
    ESModule

## 总结
  - CommonJS加载CommonJS   不需要任何处理
  - CommonJS加载ESModule   ESModule需要转换成CommonJS
  - ESModule加载ESModule   两个ESModule都需要转换成CommonJS
  - ESModule加载ESModule   ESModule需要转换成CommonJS

## 异步加载代码块的实现 