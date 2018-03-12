const path = require('path');

module.exports = {
    target: 'node', //target这个属性可以让webpack 知道打包出来的东西执行在什么环境中的
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')//打包入口文件
    },
    output: {
        filename: "server-entry.js",//打包输出文件名：[name]表示入口文件名
        path: path.join(__dirname, '../dist'),//文件输出位置
        publicPath: "/public/",//前缀区分资源
        libraryTarget: "commonjs2",//打包出来的js使用模块引用的方案
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader", //具体配置转接到.babelrc文件中去了
                exclude: /node_modules/ //忽略这个目录下的文件使用
            },
            {
                test:/\.js?&/,//让js文件也能够使用babel，而且不包含node_modules文件下面的js
                loader: "babel-loader",
                exclude:[
                    path.join(__dirname,'../node_modules')
                ]
            }
        ]
    }
};