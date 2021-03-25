const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    resolveLoader: {
        alias: {
            "babel-loader": path.resolve('./loader/babel-loader.js')
        },
        // modules: [path.resolve('./loaders'), 'node_modules']
    },
    // devServer: {
    //     writeToDisk: true, // 如果你指定此选项，也会把打包后的文件写入硬盘一份
    //     compress: true, // 是否启动压缩
    //     port: 8080, // 制定HTTP服务器端口号
    //     open: true, // 自动打开浏览器
    //     publicPath: "/",
    // },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     // use: ['babel-loader']
            //     use: [path.resolve('./loaders/babel-loader.js')]
            // },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                // use: {
                //     loader: 'file-loader',
                //     options: {
                //         esModule: false
                //     }
                // }
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[hash:8].[ext]',
                        esModule: true
                    }
                },
                include: path.resolve('src')
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin
    ]
}