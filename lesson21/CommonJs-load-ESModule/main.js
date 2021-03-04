(() => {
  var modules = {
    // 总结：esModule是如何变成commonjs规范的
    // export defalut会变成exports.default
    // export xxx会变成exports.xxx
    "./src/title.js": (module, exports, require) => {
      // 2.5 通过require.r方法给当前要处理的ESModule添加ESModule属性
      require.r(exports);
      // 2.6 require.d方法给模块的属性定义getter 
      require.d(exports, {
        default: () => DEFAULT_EXPORT,
        age: () => age,
      });
      const DEFAULT_EXPORT = "title_name";
      const age = "title_age";
    },
  };
  var cache = {};
  // 2、加载title.js模块
  function require(moduleId) {
    // 2.1 如果缓存中有就使用缓存中的
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    // 2.2 如果缓存中不存在，新定义一个module存放当前加载的模块，并且放入缓存中
    var module = (cache[moduleId] = {
      exports: {},
    });
    // 2.3 执行modules中对应模块的代码
    modules[moduleId](module, module.exports, require);
      // 2.4 将当前加载的模块导出
    return module.exports;
  }
  // 添加ESModule标记
  require.r = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    Object.defineProperty(exports, "_esModule", { value: true });
  };
  // 给每个属性定义getter
  require.d = (exports, definition) => {
    for (const key in definition) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  };
  // 1、执行index.js模块代码 - require加载title.js模块
  (() => {
    let title = require("./src/title.js");
    console.log(title);
    console.log(title.age);
  })();
})();
