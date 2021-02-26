## CSS的兼容性和压缩处理

  - CSS兼容性
    · 为了浏览器的兼容性，有时候我们必须加入 -webkit/-ms/-o/-moz这些前缀
      ·Trident内核：主要代表为IE浏览器，前缀为-ms
      ·Gecko内核：主要代表为Firefox，前缀为-moz
      ·Presto内核：主要代表为opera，前缀为-o
      ·Webkit内核：主要代表为Chrome和Safari，前缀为-webkit 

    - 安装
      · https://caniuse.com/
      · postcss-loader => 可以使用postcss处理CSS
      · postcss-preset-env => 把现代的CSS转换为大多数浏览器能够理解的CSS语法
      · postcss preset env 已经包含了`autoprefixed`和`browsers`选项
      `
      npm i postcss-loader postcss-preset-env -D
      `

  - 配置：postcss.config.js
    `
      const postCssPresetEnv = require('postcss-preset-env');

      module.exports = {
          plugins: [postCssPresetEnv],
      };
    `

  - 处理CSS时loader配置
    `
    { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"] },
    { test: /\.less$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "less-loader"] },
    { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"] },
    `

## 压缩JS/CSS/HTML

  ### CSS压缩

    - 安装：
      `
      npm i optimize-css-assets-webpack-plugin -D
      `

    - optimize-css-assets-webpack-plugin作用：优化和压缩CSS资源的插件
    
    - 配置：在plugins选项中配置
      `
      plugins:[
        new OptimizeCssAssetsWebpackPlugin(),
      ]
    `

  ### JS压缩
    - 安装：
      `
      npm i terser-webpack-plugin -D
      `
    - terser-webpack-plugin作用：优化和压缩JS资源的插件
    
    - 配置
      `
        optimization: {
            minimize: true,
            minimizer: [
                new TerserWebpackPlugin(),
                // new OptimizeCssAssetsWebpackPlugin(), // 可以写在这，一般不写在这里
            ],
        },
      `
  
  ### 区分生产开发环境的优化
    - 直接在配置文件中修改：思路就是根据环境变量决定要不要压缩

## 关于postcss.config.js配置文件是否可以有多种配置文件形式
  - postcss的配置文件不仅仅可以写成JS文件的形式，一般来说，配置文件有四到五种形式
    · rc
    · .config.js
    · .json
    · 直接写在webpack.config.js中

  - https://www.npmjs.com/package/postcss-loader#config
  
  - postcss-loader在读取配置文件的时候会根据以下优先级查找
   · 先查找`package.json`有无配置项，有则使用，无继续查找下一种配置文件
   · 再查找有无`postcssrc`，有则使用，无继续查找下一种配置文件
   · 再查找有无`.postcssrc.json, .postcssrc.yaml, .postcssrc.yml, .postcssrc.js, or .postcssrc.cjs file`，有则使用，无继续查找下一种配置文件
   · 最后查找有无`postcss.config.js or postcss.config.cjs CommonJS module exporting an object (recommended)`