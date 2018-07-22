const path = require('path');
const webapck=require('webpack');
const HTMLPlugin=require('html-webpack-plugin');//这个插件可以自动生成html文件，并且把我们编译好的js文件引入进去

//区分开发环境和线上环境
const isDev = process.env.NODE_ENV==='development';

const config = {
    entry: {
        app: path.join(__dirname, '../client/app.js')//打包入口文件
    },
    output: {
        filename: "[name].[hash].js",//打包输出文件名：[name]表示入口文件名
        path: path.join(__dirname, '../dist'),//文件输出位置
        publicPath: "/public/",//前缀区分资源
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /.{js|jsx}$/,
                loader: 'eslint-loader'
            },
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

if(isDev){
    config.entry={
        app:[
            'react-hot-loader/patch',
            path.join(__dirname, '../client/app.js')
        ]
    };

    config.devServer = {
        host:'localhost',
        port:'3003',
        contentBase:path.join(__dirname,'../dist'), //启动本地资源的路径
        hot:true,   //资源热加载
        overlay:{
            errors:true //如果在编译中出现错误，就直接在浏览器中显示出来
        },
        publicPath:'/public/',   //通过public 前缀访问静态资源文件
        historyApiFallback:{
            index:'/public/index.html'  //如果404，全部都直接返回public/index.html
        }
    };

    config.plugins.push(new webapck.HotModuleReplacementPlugin())
}

module.exports=config;