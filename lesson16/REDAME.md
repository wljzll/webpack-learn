## px自动转成rem
  · lib-flexible + rem 实现移动端自适应 
  · lib-flexible 自动计算根元素的font-size的值
  · px2rem-loader 自动将px转成rem
  · px2rem
  · 页面渲染时计算根元素的`font-size`值

  - 安装
    `
    npm i px2rem-loader lib-flexible -D
    `
  
  - 配置
    `
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 规定1rem = 75px
            },
          },
        ],
      },
    `