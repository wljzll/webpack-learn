## 打包第三方模块

### 引入第三方类库的几种方法：

- 1、通过 import 直接引入
  import _ from "lodash";
  alert(_.join(['a', 'b', 'c'], '~'));
- 缺点：比较麻烦，每次都需要引入

- 2、插件引入：
- webpack配置ProvidePlugin后，在使用时将不在需要import或者require引入，直接使用即可，
- 函数会自动添加到当前模块的上下文，无需显示声明。
  new webpack.ProvidePlugin({
    _: "lodash",
  }),
- 缺点：无法在全局下引用

- 3、通过expose-loader的方式引入
- 这种方式是指，当我们使用import或者require方式引入第三方模块时，同时想将第三方模块挂载
- 到window上
require('lodash');

alert(_.join(['a', 'b', 'c'], '~'));

{
    test: require.resolve("lodash"),
    loader: "expose-loader",
    options: {
        exposes: {
        globalName: "_",
        override: true,
        },
    },
},

- 4、CDN方式引入
  > 第一种方式：
    1) 在HTML模板文件中引入CDN地址
     <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js"></script>
    2) 在webpack配置文件中配置：
    externals: [{
        lodash: "_", // 库名: 映射变量
    }],
    
  > 第二种方式：使用HtmlWebpackExternalsPlugin按需 自动引入
     new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: "lodash", // 引入的模块名
          // CDN地址
          entry: "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js",
          global: "_", // 全局变量名
        },
      ],
    }),
    优点：1)在HTML中自动添加script标签
      