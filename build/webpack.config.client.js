const path = require('path');
const HTMLPlugin=require('html-webpack-plugin');//这个插件可以自动生成html文件，并且把我们编译好的js文件引入进去

module.exports = {
    entry: {
        app: path.join(__dirname, '../client/app.js')//打包入口文件
    },
    output: {
        filename: "[name].[hash].js",//打包输出文件名：[name]表示入口文件名
        path: path.join(__dirname, '../dist'),//文件输出位置
        publicPath: "/public",//前缀区分资源
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
    },
    plugins: [
        new HTMLPlugin({
            template:path.join(__dirname,'../client/template.html')
        })
    ]
};