## MPA多入口配置

  ### 第一版：page1.js/page2.js放在src目录下
    `
    entry: {
      page1: './src/page1.js',
      page2: './src/page2.js'
    },
    `

  ### 第二版：page1.js/page2.js放在src/pages目录下
    `
    const pagesRoot = resolve(__dirname, 'src', 'pages');
    const pages = fs.readdirSync(resolve(__dirname, 'src', 'pages'));
    const HtmlWebpackPlugins = [];
    const entry = pages.reduce((entry, fileName) => {
      const entryName = basename(fileName, '.js');
      entry[entryName] = join(pagesRoot, fileName);
      HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: `${entryName}.html`,
        chunks: [entryName],
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
      }));
      return entry;
    }, {});
    
    `

  ### 怎么设置多入口的默认打开入口
    - 原理就是将你需要设置为默认入口的html设置为index.html
    `
      const pagesRoot = resolve(__dirname, 'src', 'pages');
      const pages = fs.readdirSync(resolve(__dirname, 'src', 'pages'));
      const HtmlWebpackPlugins = [];
      const entry = pages.reduce((entry, fileName) => {
        const entryName = basename(fileName, '.js');
        entry[entryName] = join(pagesRoot, fileName);
        HtmlWebpackPlugins.push(new HtmlWebpackPlugin({
          template: "./src/index.html",
          filename: `${entryName === 'page1' ? 'index' : entryName}.html`,
          chunks: [entryName],
          minify: {
            collapseWhitespace: true,
            removeComments: true,
          },
        }));
        return entry;
      }, {});
    `