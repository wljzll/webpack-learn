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