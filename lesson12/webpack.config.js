const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const webpack = require("webpack");

const processENV = process.env.NODE_ENV;
console.log('配置文件中的process.env.NODE_ENV：' + process.env.NODE_ENV);
module.exports = (env) => {
    console.log('函数里的', env);
    return ({
        //  mode 当前的运行模式：开发环境/生产环境/不指定环境
        mode: "development",
        devtool: "cheap-module-source-map",
        entry: "./src/index.js",
        output: {
            path: resolve(__dirname, "dist"), // 输出文件夹的绝对路径
            filename: "main.js", // 输出的文件名
        },
        devServer: {
            contentBase: resolve(__dirname, "static"),
            writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
            compress: true, // 是否启动压缩
            port: 8080, // 制定HTTP服务器端口号
            open: true, // 自动打开浏览器
        },
        externals: [{
            lodash: "_",
        }],
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
                            //         }
                            //     ], // 可以转换JS语法
                            //     "@babel/preset-react", // 可以转换JSX语法
                            // ],
                            plugins: [
                                [
                                    '@babel/plugin-transform-runtime',
                                    {
                                        corejs: 3,
                                        helpers: true, // 是否提取一些类的继承的帮助方法，helpers=true 提取成单独的模块，如果是false不提取， 移除内联babel helpers并替换使用 babel-runtime/helpers来替换
                                        regenerator: true // 是否开启 generatro函数转换成使用regenerator-runtime来避免全局污染 
                                    }
                                ],
                                ["@babel/plugin-proposal-decorators", { legacy: true }],
                                ["@babel/plugin-proposal-class-properties", { loose: true }],
                            ],
                        },
                    }, ],
                },
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
                    }, ],
                },
                { test: /\.html$/, use: "html-loader" },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./src/index.html",
            })
        ],
    });
};