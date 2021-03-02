const {merge} =require('webpack-merge')
const baseConfig = require('./webpack.base')
const prodConfig = {
    mode = "development",
    module:{
        rules: [
            {
                test: /\.css$/
            }
        ]
    }
}

module.exports = merge(baseConfig, prodConfig)