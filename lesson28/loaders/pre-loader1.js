function loader(source) {
    console.log(this.name);
    console.log('pre1');
    return source + '// pre1';
}

module.exports = loader;