function loader(source) {
    console.log(this.name);
    console.log('pre1');
    return source + '// pre1';
}

loader.pitch = function () {
    console.log('pre1-pitch')
}
module.exports = loader;