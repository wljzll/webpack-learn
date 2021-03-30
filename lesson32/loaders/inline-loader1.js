function normal(source) {
    console.log('inline1')
    return source + '// inline1'
}
normal.pitch = function () {
    console.log('inline1-pitch')
    // return 'inline1-pitch' // 第一种
    // this.callback(null, 'inlin1-pitch'); // 第二种
    let innerCallback = this.async(); // 第三种
    innerCallback(null, 'inline1-pitch');
}
module.exports = normal