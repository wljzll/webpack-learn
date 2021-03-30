let fs = require("fs");
let readFile = fs.readFile.bind(this); // 读取硬盘上文件的默认方法

let PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
function parsePathQueryFragment(resource) {
  let result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource);
  return {
    path: result[1],
    query: result[2],
    fragment: result[3],
  };
}

function createLoaderObject(request) {
  // let splittedResource = parsePathQueryFragment(request);
  let loaderObj = {
    // path: splittedResource.path, // loader的绝对路径
    // query: splittedResource.query,
    // fragment: splittedResource.fragment,
    path: "", // loader的绝对路径
    query: "",
    fragment: "",
    normal: null, // loader函数本身
    pitch: null, // pitch函数本身
    raw: false, // 是否需要转成字符串，默认是转的
    data: {}, // 每个loader都会有一个自定义的data对象，用来存放一些自定义信息
    pitchExecuted: false, // pitch函数是否已经执行过
    normalExecuted: false, // normal函数是否已经执行过了
  };

  Object.defineProperty(loaderObj, "request", {
    get() {
      return loaderObj.path + loaderObj.query + loaderObj.fragment;
    },
    set(request) {
      let splittedResource = parsePathQueryFragment(request);
      loaderObj.path = splittedResource.path;
      loaderObj.query = splittedResource.query;
      loaderObj.fragment = splittedResource.fragment;
    },
  });
  loaderObj.request = request;
  return loaderObj;
}

/**
 * 执行loader的pitch方法
 * @param {*} processOptions
 * @param {*} loaderContext loader里的this，就是所谓的上下文对象loaderContext
 * @param {*} finalCallback loader全部执行完会执行此回调
 */
function interatePitchingLoaders(processOptions, loaderContext, finalCallback) {
  // 获取当前的loader
  let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++;
    return interatePitchingLoaders(
      processOptions,
      loaderContext,
      finalCallback
    );
  }
  let pitchFunction = currentLoaderObject.pitch;
  currentLoaderObject.pitchExecuted = true; // 表示pitch函数已经执行过了
  if (!pitchFunction) {
    // 如果此loader没有pitch方法
    return interatePitchingLoaders(
      processOptions,
      loaderContext,
      finalCallback
    );
  }
  runSyncOrAsync(
    pitchFunction,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, values) => {}
  );
}

function runSyncOrAsync(fn, context, args, callback) {
  let isSync = true; // 是否同步 默认是同步
  let isDone = false; // 是否fn已经执行完成 默认是false

  const innerCallback = (context.callback = function (err, values) {
    isDone = true;
    isSync = false;
    callback(err, values);
  });
  context.async = function () {
    isSync = false; // 把同步标志设置为false 意思就是改为异步
    return innerCallback;
  };

  // pitch的返回值可有可无
  let result = fn.apply(context, args);
  if (isSync) {
    isDone = true; // 直接完成
    return callback(null, result); // 调用回调
  }
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

  let loaderObject = loaders.map(createLoaderObject);

  loaderContext.context = contextDirectory;
  loaderContext.resourcePath = resourcePath;
  loaderContext.resourceQuery = resourceQuery;
  loaderContext.resourceFragment = resourceFragment;
  loaderContext.loaderIndex = 0; // 它是一个指标，就是通过修改它来控制当前在执行哪个loader
  loaderContext.loaders = loaderObject; // 存放着所有的loaders
  loaderContext.callback = null;
  loaderContext.async = null;

  // 要加载的资源=> c:/src/index.js?name=zhufeng#top 不包含loader
  Object.defineProperty(loaderContext, "resource", {
    get() {
      return (
        loaderContext.resourcePath +
        loaderContext.resourceQuery +
        loaderContext.resourceFragment
      );
    },
  });
  // 要加载的资源 => c:/src/index.js?name=zhufeng#top 包含loader loader1.js!loader2.js!loader3.js!index.js
  Object.defineProperty(loaderContext, "request", {
    get() {
      return loaderContext.loaders
        .map((l) => l.request)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  // 当前loader的query
  Object.defineProperty(loaderContext, "query", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.options || loaderObj.query;
    },
  });
  // 当前loader的data
  Object.defineProperty(loaderContext, "data", {
    get() {
      let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
      return loaderObj.data;
    },
  });

  let processOptions = {
    resourceBuffer: null,
    readResource,
  };

  // 开始执行loader
  interatePitchingLoaders(processOptions, loaderContext, (err, result) => {
    callback(nul, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

exports.runLoaders = runLoaders;
