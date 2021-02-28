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

## 怎么把image打包到对应的文件夹下（例如images文件夹下）
- 1、配置outputPath和publicPath
`
{
  test: /\.(jpg|png|bmp|jpeg|gif)$/,
  use: [{
      loader: "url-loader",
      options: {
          name: "[hash:8].[ext]",
          esModule: false,
          limit: 5 * 1024,
          outputPath: 'images',
          publicPath: 'images',
      },
  }],
},
`
- 2、在filename中配置（不推荐）
`
{
  test: /\.(jpg|png|bmp|jpeg|gif)$/,
  use: [{
      loader: "url-loader",
      options: {
          name: "images/[hash:8].[ext]",
          esModule: false,
          limit: 5 * 1024,
          // outputPath: 'images',
          // publicPath: '/images',
      },
  }],
},
`
- publicPath中相对路径和绝对路径的问题：
  - 加上 / 就是相对于根路径
  - 不加 / 就是相对于当前文件的相对路径 /css/main.css => 图片路径 /css/images/hash.png

## hash/chunkhash/contenthash
- 文件指纹 是指打包后输出的文件名和后缀
- hash一般是结合CDN缓存来使用，通过webpack构建之后，生成对应的文件名自动带上对应的MD5值
- 如果文件的内容改变的话，那么对应文件哈希值也会改变，对应的HTML引用的URL地址也会改变，
- 触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存

ext         资源后缀名
name        文件名称
path        文件的相对路径
folder      文件所在的文件夹
hash        每次webpack构建时生成的唯一的hash值
chunkhash   根据chunk生成的hash值，来源于同一个chunk，则hash值就一样
contenthash 根据内容生成的hash值，文件内容相同，则hash值就一样

- 哈希的产生过程
`
let entry = {
  page1: 'page1', // 入口
  page2: 'page2'  // 入口
}

let page1 = 'require title1' // 模块（JS文件）
let page2 = 'require title2' // 模块（JS文件）

let title1 = 'title1' // 模块（JS文件）
let title2 = 'title2' // 模块（JS文件）

let crypto = require('crypto')

let page1ContentHash = crypto.createHash('md5').update(page1).digest('hex')
let page2ContentHash = crypto.createHash('md5').update(page2).digest('hex')
let title1ContentHash = crypto.createHash('md5').update(title1).digest('hex')
let title2ContentHash = crypto.createHash('md5').update(title2).digest('hex')

let page1ChunkHash =  crypto.createHash('md5').update(page1).update(title1).digest('hex')
let page2ChunkHash =  crypto.createHash('md5').update(page2).update(title2).digest('hex')

let hash =  crypto.createHash('md5')
.update(page1)
.update(title1)
.update(page2)
.update(title2)
.digest('hex')
`
- 当我们使用contenthash时，一个代码块会产出多个文件，到底使用哪个文件的contenthash来作为最终的asset文件名哪？
  - 答：asset和文件是一对的，所以谁用谁的hash

- 当我们能用hash的时候不用chunkhash，能用chunkhash时候不用contenthash，因为hash最容易受影响，chunkhash只有chunk
- 内容改变才会改变，contenthash只有自己的content改变才会改变