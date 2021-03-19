const { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
const types = require("babel-types");
const parser = require("@babel/parser"); // 将源代码转成AST抽象语法树
const traverse = require("@babel/traverse").default; // 遍历语法树
const generator = require("@babel/generator").default; // 把抽象语法树重新生成代码

function toUnixPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

// 根目录
let baseDir = toUnixPath(process.cwd());

class Compiler {
  constructor(options) {
    this.options = options;

    this.hooks = {
      run: new SyncHook(), // 会在开始编译的时候触发
      done: new SyncHook(), // 会在完成编译的时候触发
    };
    this.entries = []; // 存放所有的入口模块 
    this.modules = []; // 存放所有的模块
    this.chunks = []; // 存放所有的chunks this.chunks = new Set()
    this.assets = {}; // 输出列表 存放着将要产出的资源文件
    this.files = []; // 本地编译产出的所有文件名
  }
  run(callback) {
    /**
     * entry：
        { page1: './src/page1.js', page2: './src/page2.js' }
      
     * entryModule：
        {
              id: './src/page1.js',
              dependencies: [ 'C:/webpacklearn/lesson27/src/title.js' ],
              _source: 'const title = require("./src/title.js");\n\nconsole.log(title);',
              entryName: 'page1'
        }
        {
            id: './src/page2.js',
            dependencies: [ 'C:/webpacklearn/lesson27/src/title.js' ],
            _source: 'const title = require("./src/title.js");\n\nconsole.log(title);',
            entryName: 'page2'
        }
      
     * this.modules
        [
          {
            id: './src/title.js',
            dependencies: [],
            _source: "module.exports = 'title';",
            entryName: 'page1'
          },
          {
            id: './src/title.js',
            dependencies: [],
            _source: "module.exports = 'title';",
            entryName: 'page2'
          }
        ]

     * this.chunks：
        [
          {
            name: 'page1',
            entryModule: {
              id: './src/page1.js',
              dependencies: [Array],
              _source: 'const title = require("./src/title.js");\n\nconsole.log(title);',
              entryName: 'page1'
            },
            modules: [ [Object] ]
          },
          {
            name: 'page2',
            entryModule: {
              id: './src/page2.js',
              dependencies: [Array],
              _source: 'const title = require("./src/title.js");\n\nconsole.log(title);',
              entryName: 'page2'
            },
            modules: [ [Object] ]
          }
        ]
     * 
     */
    this.hooks.run.call(); // 当调用run方法的时候会触发run这个钩子，进而执行它的回调

    // 5、根据配置中的`entry`找出入口文件，得到entry的绝对路径 - 默认多入口
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    
    for (const entryName in entry) {
      let entryFilePath = toUnixPath(path.join(this.options.context, this.options.entry[entryName])); // E:\2021架构\wepacklearn\lesson26\src\page1.js

      // 从入口文件出发，调用所有配置的`loader`对模块进行编译
      let entryModule = this.buildModule(entryName, entryFilePath);
      
      //  8、根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
      let chunk = { name: entryName, entryModule, modules: this.modules.filter(module => module.entryName === entryName) };
      this.chunks.push(chunk);
      this.entries.push(chunk);
    }
    
    // 9、再把每个Chunk转换成一个单独的文件加入到输出列表
    this.chunks.forEach((chunk) => {
      let filename = this.options.output.filename.replace('[name]', chunk.name);
      // key: 文件名 value:打包后的内容
      this.assets[filename] = getSource(chunk); // { 'main.js': [文件内容] }
    });

    // 10、在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
    this.files = Object.keys(this.assets);
    for (const filename in this.assets) {
      // 本次编译输出的目标文件路径
      let targetPath = path.join(this.options.output.path,filename);
      fs.writeFileSync(targetPath, this.assets[filename]);
    }

    this.hooks.done.call();

    callback(null, {
      toJson : () => {
        return {
          entries: this.entries,
          chunks: this.chunks,
          modules: this.modules,
          files: this.files,
          assets: this.assets
        }
      }
    })
  }

  /**
   *
   * @param {*} modulePath 当前模块的路径
   * @returns 编译处理过的模块，是一个对象有三个属性 moduleId dependencies _source
   */
  buildModule(entryName, modulePath) {
    // 读取原始源代码
    let originalSourceCode = fs.readFileSync(modulePath, "utf-8");
    let targetSourceCode = originalSourceCode;

    // 查找此模块对应的loader
    let rules = this.options.module.rules;
    let loaders = [];
    for (let index = 0; index < rules.length; index++) {
      if (rules[index].test.test(modulePath)) {
        loaders = [...loaders, ...rules[index].use];
      }
    }

    // 6、从入口文件出发，调用所有配置的`loader`对模块进行编译
    for (let i = loaders.length - 1; i > 0; i--) {
      let loader = loaders[i];
      targetSourceCode = require(loader)(targetSourceCode);
    }

    // 现在我们已经得到转换后的代码 babel-loader ES6 => ES5

    // 7、再找出该模块依赖的模块，
    // 7.1 将源代码转换为抽象语法树
    let astTree = parser.parse(targetSourceCode, { sourceType: "module" });

    let moduleId = "./" + path.posix.relative(baseDir, modulePath); // ./src/index.js
    // webpack 最核心的几个概念：module，module（id）有moduleId，依赖的模块的数组dependencies
    let module = { id: moduleId, dependencies: [], _source: null, entryName };

    // 7.2 遍历抽象语法树，并找出require节点
    traverse(astTree, {
      CallExpression: ({ node }) => {
        if (node.callee.name === "require") {
          // 获取模块名字 './title'; 存在两个问题：1、这个模块名字是相对路径；2、而且是相对于当前模块的
          let moduleName = node.arguments[0].value; // './title'

          // 依赖模块的路径 =>  // E:\2021架构\wepacklearn\lesson26\src\title.js
          let depModulePath = "";
          let dirname = "";
          // 获取当前路径(modulePath)所在的目录 => E:\2021架构\wepacklearn\lesson26\src\
          if (path.isAbsolute(moduleName)) {
            // 如果moduleName是一个绝对路径（这种情况很少）
            depModulePath = moduleName;
          } else {
            // moduleName是相对路径
            // E:\2021架构\wepacklearn\lesson26\src
            dirname = path.posix.dirname(modulePath);
            // 获取依赖模块的路径 =>  E:\2021架构\wepacklearn\lesson26\src\title
            depModulePath = path.posix.join(dirname, moduleName);
          }

          // 获取配置项中的extensions => 比如：['.js', '.jsx', '.ts']
          let extensions = this.options.resolve.extensions;

          // 获取完整文件路径（有文件后缀）=> E:\2021架构\wepacklearn\lesson26\src\title.js
          depModulePath = tryExtensions(depModulePath,extensions,moduleName,dirname);

          // 模块ID的问题：每个打包后的模块都有个模块ID，如何生成require模块的模块ID
          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath); // ./src/title.js

          // 修改抽象语法树
          node.arguments = [types.stringLiteral(depModuleId)];

          module.dependencies.push(depModulePath);
        }
      },
    });

    // 根据新的语法树生成新代码
    let { code } = generator(astTree);
    module._source = code; // 模块上现在有三个属性了：moduleId dependencies _source

    // 7、 再递归本步骤直到所有入口依赖的文件都经过本步骤的处理
    module.dependencies.forEach((dependency) => {
      let dependencyModule = this.buildModule(entryName, dependency);
      this.modules.push(dependencyModule);
    });
    return module;
  }
}

// let chunk = { name: "main", entryModule, modules: this.modules };
function getSource(chunk) {
  return `
  (() => {

    var modules = {

        ${chunk.modules
          .map(
            (module) => `
            "${module.id}": (module) => {
                ${module._source}
              }
            `
          )
          .join(",")}
      };
    var cache = {};
    function require(moduleId) {
      var cachedModule = cache[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      var module = (cache[moduleId] = {
        exports: {},
      });
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    var __webpack_exports__ = {};
    (() => {
      ${chunk.entryModule._source}
    })();
  })();
  `;
}
/**
 *
 * @param {*} modulePath 模块的路径（没有后缀名）=> E:\2021架构\wepacklearn\lesson26\src\title
 * @param {*} extensions 配置文件中的扩展 => 比如：['.js', '.jsx', '.ts']
 * @param {*} originalModulePath 模块原始的相对路径 => './title'
 * @param {*} moduleContext 引入该模块的模块的所在目录 => index.js的目录 => E:\2021架构\wepacklearn\lesson26\src
 * @returns
 */
function tryExtensions(
  modulePath,
  extensions,
  originalModulePath,
  moduleContext
) {
  for (let index = 0; index < extensions.length; index++) {
    if (fs.existsSync(modulePath + extensions[index])) {
      return modulePath + extensions[index];
    }
  }
  throw new Error(
    `Module not fount: Error: Can't resolve '${originalModulePath}' in '${moduleContext}'`
  );
}

module.exports = Compiler;
