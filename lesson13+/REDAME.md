## mini-css-extract-plugin
- 安装： npm i mini-css-extract-plugin -D
- 使用
`
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
new MiniCssExtractPlugin({
    filename: '[name].css',
}),
`

## output中的filename和chunkFilename的区别：
- filename：入口代码块的名称
- chunkFilename：非入口代码块的名称配置项，非入口代码块有两个来源：
  - 1) 代码分割产生的 vendor common
  - 2) 懒加载产生的代码块，import方法加载模块
`
<!-- 懒加载产生代码的过程 -->
产出的代码块名字： src_utils_js.1ad35dc9.js
产出规则：
1) 把这个相对模块路径转换成绝对路径： 
C:\webpacklearn\lesson13+\src\utils.js

2) 把这个绝对路径替换成相对于项目根目录的相对路径：
./src/utils.js

3) 把 / 和 . 都替换成 _
src_utils_js
这就是代码块名称的算法

import是一个天然的代码分割点，只要遇到import就会分离出一个单独的代码块
`