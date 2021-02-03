/**
 * 
 * @param {*} target 装饰的目标
 * @param {*} key 装饰的key PI
 * @param {*} descriptor 属性描述
 */
function readonly(target, key, descriptor) {
    descriptor.writable = false
}

class Person{
    @readonly PI = 3.14;
}

let p = new Person();
p.PI = 3.15;
console.log(p)

// import React from 'react';
// import ReactDOM from 'react-dom';

// ReactDOM.render(<h1>hello</h1>, document.getElementById('root'))
// let func = () => {
//     console.log('hello world')
// }
