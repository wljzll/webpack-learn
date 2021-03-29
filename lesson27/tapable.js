// let {SyncHook} = require('tapable')

class SyncHook {
    constructor(args) {
        this.args = args || [];
        this.taps = [];
    }
    tap(name, fn) {
        this.taps.push(fn)
    }
    call() {
        let args = Array.prototype.slice.call(arguments, 0, this.args.length)
        this.taps.forEach(tap => tap(...args))
    }
}

let syncHook = new SyncHook(['name'])
syncHook.tap('这个名字没有什么用，只是给程序员看的', (name) => {
    console.log(name, '这是一个回调')
})
syncHook.call('zhufeng')

// 无事件名怎么区分多事件
let syncHook1 = new SyncHook()
let syncHook2 = new SyncHook()