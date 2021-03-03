## 通过.env文件配置环境变量
  - 需要`dotenv`插件来辅助
  - 安装：
    `
    https://www.npmjs.com/package/dotenv
    npm i dotenv -D
    `
    - 使用
      ·创建.env文件（也可自定义文件）
      `
        NODE_ENV = 'hahah'
      `
    - 在webpack.config.js中引入`dotenv`
      `
      require('dotenv').config();
      `
    - 这时在node环境下就能够通过`process.env.NODE_ENV`获取到环境变量了