let fs = require('fs');
let readFile = fs.readFile.bind(this); // 读取硬盘上文件的默认方法

let PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
function parsePathQueryFragment(resource) {
  let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
  return {
    path: result[1],
    query: result[2],
    fragment: result[3]
  }
}

function createLoaderObject(loaderAbsPath) {
  // let splittedResource = parsePathQueryFragment(request);
  let loaderObj = {
    // path: splittedResource.path, // loader的绝对路径
    // query: splittedResource.query,
    // fragment: splittedResource.fragment,
    path: '', // loader的绝对路径
    query: '',
    fragment: '',
    normal: null, // loader函数本身
    pitch: null, // pitch函数本身
    raw: false, // 是否需要转成字符串，默认是转的
    data: {}, // 每个loader都会有一个自定义的data对象，用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过
    normalExecuted: false, // normal函数是否已经执行过了
  }

  Object.defineProperty(loaderObj, 'request', {
    get() {
      return loaderObj.path + loaderObj.query + loaderObj.fragment;
    },
    set(request) {
      let splittedResource = parsePathQueryFragment(request);
      loaderObj.path = splittedResource.path;
      loaderObj.query = splittedResource.query;
      loaderObj.fragment = splittedResource.fragment;
    }
  })
  loaderObj.request = request;
  return loaderObj;
}

function runLoaders(options, callback) {
  let resource = options.resource || ""; // 要加载的资源 c:/src/index.js?name=zhufeng#top
  let loaders = options.loaders || []; // loader的绝对路径的数组
  let loaderContext = options.context || {}; // 这个是一个对象，它将会成为loader函数执行时候的上下文
  let readResource = options.readResource || readFile; // 读取文件的方法
  let splittedResource = parsePathQueryFragment(resource);

  let resourcePath = splittedResource.path;
  let resourceQuery = splittedResource.query;
  let resourceFragment = splittedResource.fragment;
  let contextDirectory = path.dirname(resourcePath); // 需要加载的资源所在的目录

  loaderObject = loaders.map(createLoaderObject)

  loaderContext.context = contextDirectory;
  loaderContext.resourcePath = resourcePath;
  loaderContext.resourceQuery = resourceQuery;
  loaderContext.resourceFragment = resourceFragment;
  loaderContext.loaderIndex = 0; // 它是一个指标，就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loaderObject; // 存放着所有的loaders
  loaderContext.callback = null;
  loaderContext.async = null;

  // 要加载的资源=> c:/src/index.js?name=zhufeng#top 不包含loader
  Object.defineProperty(loaderContext, 'resource', {
    get() {
      return loaderContext.resourcePath + loaderContext.resourceQuery + loaderContext.resourceFragment;
    }
  })
  // 要加载的资源 => c:/src/index.js?name=zhufeng#top 包含loader loader1.js!loader2.js!loader3.js!index.js
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loader.map(l => l.request).concat(loaderContext.resource).join('!');
    }
  })

}

exports.runLoaders = runLoaders;