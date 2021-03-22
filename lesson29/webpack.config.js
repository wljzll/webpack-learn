const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    // resolveLoader: {
    //     alias: {
    //         "babel-loader": path.resolve('./loader/babel-loader.js')
    //     },
    //     modules: [path.resolve('./loaders'), 'node_modules']
    // },
    module: {
        rules: [{
            test: /\.js$/,
            // use: ['babel-loader']
            use: [path.resolve('./loaders/babel-loader.js')]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin
    ]
}