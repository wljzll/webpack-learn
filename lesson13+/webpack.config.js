const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    //  mode 当前的运行模式：开发环境/生产环境/不指定环境
    mode: "development",
    devtool: "cheap-module-source-map",
    entry: "./src/index.js",
    output: {
        path: resolve(__dirname, "dist"), // 输出文件夹的绝对路径
        filename: "main.js", // 输出的文件名
        chunkFilename: '[name].[hash:8].js',
    },
    devServer: {
        contentBase: resolve(__dirname, "static"),
        writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
        compress: true, // 是否启动压缩
        port: 8080, // 制定HTTP服务器端口号
        open: true, // 自动打开浏览器
        before(app) {
            app.get('/api/users', (req, res) => {
                console.log(res, '===============');
                res.json([{ id: 1, name: 'zhufeng' }]);
            });
        },
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:3000',
        //         pathRewrite: {
        //             "^/api": "",
        //         },
        //     },
        // },
    },
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    // presets: [
                    //     ["@babel/preset-env",
                    //         {
                    //             useBuiltIns: "usage", // 按需加载polyfill
                    //             corejs: { version: 3 }, // 指定corejs的版本号，2或者3版本，其实就是polyfill
                    //             targets: ">0.25%",
                    //         },
                    //     ], // 可以转换JS语法
                    //     "@babel/preset-react", // 可以转换JSX语法
                    // ],
                },
            }],
        },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
        { test: /\.less$/, use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"] },
        { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"] },
        { test: /\.txt$/, use: "raw-loader" },
        {
            test: /\.(jpg|png|bmp|jpeg|gif)$/,
            use: [{
                loader: "url-loader",
                options: {
                    name: "[hash:8].[ext]",
                    esModule: false,
                    limit: 5 * 1024,
                },
            }],
        },
        { test: /\.html$/, use: "html-loader" },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: resolve(__dirname, 'src/documents'),
                to: resolve(__dirname, 'dist/documents'),
            }],
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*"],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
};
