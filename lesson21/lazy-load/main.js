(() => {
    var modules = ({})
    var cache = {}
    // 2、加载title.js模块
    function require(moduleId) {
        // 2.1 如果缓存中有就使用缓存中的
        if (cache[moduleId]) {
            return cache[moduleId].exports
        }
        // 2.2 如果缓存中不存在，新定义一个module存放当前加载的模块，并且放入缓存中
        var module = cache[moduleId] = {
            exports: {}
        }
        // 2.3 执行modules中对应模块的代码
        modules[moduleId](module, module.exports, require)
        // 2.4 将当前加载的模块导出
        return module.exports
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

    // 如何异步加载代码块？
    // 2、调用require.f.j方法，目的是创建promise，发起jsonp请求
    require.e = (chunkId) => {
        let promises = []
        require.f.j(chunkId, promises)
        return Promise.all(promises)
    }

    // 已经安装的代码块 main代码块的名字: 0 (0表示已经安装就绪)
    let installedChunks = {
        main: 0,
        // hello: [resolve, reject]
    }

    require.f = {}
    require.p = '' // 就是配置文件中的publicPath

    /**
     * 
     * @param {*} chunkId 代码块的名字
     * @returns 返回的是这个代码块对应的文件名字
     */
    require.u = (chunkId) => {
        return chunkId + '.main.js'
    }

    // 3、通过jsonp异步加载chunkId，也就是hello这个代码块
    require.f.j = (chunkId, promises) => {
        let promise = new Promise((resolve, reject) => {
            installedChunks[chunkId] = [resolve, reject]
        })
        promises.push(promise)

        // 
        var url = require.p + require.u(chunkId) // => (/hello.main.js)
        require.l(url)
    }

    // 4、通过jsonp请求url对应的文件
    require.l = (url) => {
        let script = document.createElement('script')
        script.src = url
        document.head.append(script)
    }

    // 0、把空数组赋值给  window['webpackChunkwebpacklearn']，然后重写 window['webpackChunkwebpacklearn']的pushfangfa 
    var chunkLoadingGlobal = window['webpackChunkwebpacklearn'] = []

    // 6、执行回调函数
    var webpackJsonpCallback = ([chunkIds, moreModules]) => {
        // 拿到每个模块的resolve方法
        let resolves = []
        chunkIds.forEach(chunkId => {
            resolves.push(installedChunks[chunkId][0])
            installedChunks[chunkId] = 0
        })

        for (const moduleId in moreModules) {
            modules[moduleId] = moreModules[moduleId]
        }
        resolves.forEach(resolve => {
            resolve()
        });
    }

    chunkLoadingGlobal.push = webpackJsonpCallback;

    // 1、执行index.js代码 准备加载异步代码块hello
    require.e("hello").then(require.bind(require, "./src/hello.js")).then(result => {
        console.log(result.default);
    });
})()