(() => {
  var modules = {
    // 总结：esModule是如何变成commonjs规范的
    // export defalut会变成exports.default
    // export xxx会变成exports.xxx
    "./src/title.js": (module, exports, require) => {
      require.r(exports);
      require.d(exports, {
        default: () => DEFAULT_EXPORT,
        age: () => age,
      });
      const DEFAULT_EXPORT = "title_name";
      const age = "title_age";
    },
  };
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      exports: {},
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  require.r = (exports) => {
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    Object.defineProperty(exports, "_esModule", { value: true });
  };
  require.d = (exports, definition) => {
    for (const key in definition) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      });
    }
  };
  // 入口文件 ./scr/index.js的代码
  (() => {
    let title = require("./src/title.js");
    console.log(title);
    console.log(title.age);
  })();
})();
