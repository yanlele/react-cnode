# 项目实战二：Webpack + React全栈工程架构项目实战精讲

## 目录
- [一、工程架构](#一、工程架构：)
    - [1、webapp 架构简介](#1、webapp-架构简介)
    - [2、web开发常用网络优化](#2、web开发常用网络优化)
    - [3、webpack 的基础配置](#3、webpack-的基础配置)
    - [4、webpack loader的基本使用](#4、webpack-loader的基本使用)
    - [5、服务端渲染的基础配置](#5、服务端渲染的基础配置)


## 一、工程架构：
### 1、webapp 架构简介
工程架构：解放生产力、围绕解决方案搭建环境、保证项目质量
- 解放生产力：源代码处理；自动打包自动更新页面显示；自动处理图片依赖，保证开发和正式环境的统一
- 围绕解决方案搭建环境：不同的前段框架需要不同的运行架构；预期可能出现的问题并规避；
- 保证项目质量：code lint; 不同环境排除差异；git commit预处理

项目架构：技术选型、数据解决方案、整体代码风格

### 2、web开发常用网络优化
优化方案：合并资源文件，减少HTTP请求；压缩资源文件较少请求大小；合理利用缓存机制

### 3、webpack 的基础配置
```javascript
const path=require('path');

module.exports={
    entry:{
        app:path.join(__dirname,'../client/app.js')//打包入口文件
    },
    output: {
        filename: "[name].[hash].js",//打包输出文件名：[name]表示入口文件名
        path: path.join(__dirname,'../dist'),//文件输出位置
        publicPath: "",//前缀区分资源
    }
};
```
运行的时候，可以配置package.js
```json
  "scripts": {
    "build": "webpack --config build/webpack.config.js"
  },
```

### 4、webpack loader的基本使用
webpack 的loader的基本配置
```javascript
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
    new HTMLPlugin()
]
    
```

补充：[Webpack 删除重复文件的一种优化思路](http://blog.csdn.net/lichking11/article/details/78742066)
- 1、推荐使用`clean-webpack-plugin`插件
你说你已经尝试过使用这个插件，但是只能指定把某一个文件夹下面的文件都删除，这句话其实是不正确的，clean-webpack-plugin 可以指定删除某一文件夹下的某一类文件，你可以使用 node-glob 语法来指定你想要删除的文件名称。例如，下面是我的项目中的一处该插件的配置。       
```javascript
/* 每次编译生产环境代码时先将之前的文件删除掉 */
new CleanWebpackPlugin(
  [
    'dist/app.*.js',
    'dist/*.chunk.js',
    'dist/styles.*.css',
    'dist/styles.*.css.map',
  ],
  {
    verbose: true,
    dry: false,
  }
)
```
- 2、使用rimraf包来删除，配置在package.json中，每次打包的时候自动运行：
首先安装模块
`npm install rimraf --save-dev`
然后再package中使用配置就可以了:
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:client": "webpack --config build/webpack.config.client.js",
    "build:server": "webpack --config build/webpack.config.server.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run build:client && npm run build:server"
  },
```


### 5、服务端渲染的基础配置
单页应用存在的问题：SEO不友好；首次请求等待时间比较长，体验不好；          

- 5.1、基础配置：
因为在服务端我们是没有document.body之类的配置的，所以我们要在client重新新建一个入口js取名字叫server-entry.js
这个文件里面做的就是引用react组件然后抛出出去
```javascript
import React from 'react'
import App from './App.jsx'

export default <App/>
```
因为我们这是给服务端用的，所以要重新新建一个专门给服务端打包用的webpack 配置，所以在build目录下面新建webapck.config.server.js
整体做如下的配置：
```javascript
    const path = require('path');
    
    module.exports = {
        target: 'node', //target这个属性可以让webpack 知道打包出来的东西执行在什么环境中的
        entry: {
            app: path.join(__dirname, '../client/server-entry.js')//打包入口文件
        },
        output: {
            filename: "[name].js",//打包输出文件名：[name]表示入口文件名
            path: path.join(__dirname, '../dist'),//文件输出位置
            publicPath: "",//前缀区分资源
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
```
修改package.json 中的script,自动以打包命令行，同时为了区分两个打包配置文件，我们把webpack.config.js改名为webpack.config.client.js:
package.json配置如下:
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:client": "webpack --config build/webpack.config.client.js",
    "build:server": "webpack --config build/webpack.config.server.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run build:client && npm run build:server"
  },
```

自此，服务端渲染的基本配置已经完成，接下来是服务端程序的编写：     

- 5.2、服务端渲染服务端程序的编写(基于express)
首先先安装express: `npm install express --save`          
然后再项目根目录创建目录server,在server目录下面创建server.js的文件，并写上服务端渲染的基本的代码
```javascript
    const express = require('express');
    const ReactSSR = require('react-dom/server');//react-dom的服务端渲染模块
    const serverEntry = require('../dist/server-entry').default;//打包编译之服务端渲染容器,这个地方一定要注意加default
    
    const app=express();
    
    //截取所有服务端发送过来的get请求
    app.get('*',function(req,res){
        const appString = ReactSSR.renderToString(serverEntry);
        res.send(appString);
    });
    
    app.listen(3002,function(){
        console.log('server is start and listen port 3002')
    });
```
最后在把启动项配置到package.json 的 script中去：
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:client": "webpack --config build/webpack.config.client.js",
    "build:server": "webpack --config build/webpack.config.server.js",
    "clear": "rimraf dist",
    "build": "npm run clear && npm run build:client && npm run build:server",
    "start": "node server/server.js"
  }
```
这个时候启动应该会报错：    
`Invariant Violation: Objects are not valid as a React child (found: object with keys {default}). If you meant to render a collection of children, use an array instead.null`       
这个时候一定要注意：
`const serverEntry = require('../dist/server-entry').default;//打包编译之服务端渲染容器,这个地方一定要注意加default`

接下来再启动服务，访问3002端口，就可以看到我们服务端渲染的内容了，但是这个时候也只有纯的html 并没有我们的其他的script和style文件，换句话说，这个就相当于一个服务端渲染出来的纯html,这个显然是有问题的。接下来就是我们的改造和优化阶段         

- 5.3、服务端渲染的改造和优化
在client目录下面，新建一个template.html文件     
body下面内容如下      
```html
<div id="root"><app></app></div>
```

接下来我们要修改client目录下面app.js文件渲染位置和路径
```javascript
ReactDOM.render(< App/>, document.getElementById('root'))
```

最后修改客户端webpack.config.client.js中的配置HTMLPlugin,修改如下：
```javascript
    plugins: [
        new HTMLPlugin({
            template:path.join(__dirname,'../client/template.html')
        })
    ]
```
这里的意思是让我们的client/template.html作为模板生成html ，然后把打包后的文件插入到生成的html文件中去


然后服务端修改server/server.js如下:
```javascript
    const express = require('express');
    const ReactSSR = require('react-dom/server');//react-dom的服务端渲染模块
    const fs = require('fs');
    const path = require('path');
    const serverEntry = require('../dist/server-entry').default;//打包编译之服务端渲染容器
    
    const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');//读取文件模板
    
    const app=express();
    
    //截取所有服务端发送过来的get请求
    app.get('*',function(req,res){
        const appString = ReactSSR.renderToString(serverEntry);
        res.send(template.replace('<app></app>',appString));//重新替换模板之后，发送给浏览器
    });
    
    app.listen(3002,function(){
        console.log('server is start and listen port 3002')
    });
```

接下来重新打包，重新启动服务，访问3002服务端渲染完成！但是我们发现一个问题，js返回的内容还是localhost:3002的内容，这个就有问题了，接下来是我们的修复方案

- 5.4、服务端渲染的修复（解决其他资源返回相同内容的问题）
修改server/server.js  主要是为了区分静态资源内容和服务端加载资源内容
```javascript
const app=express();
app.use('/public', express.static(path.join(__dirname,'../dist')));//标志这个路径下面我们加载的是静态资源的内容
```

同时修改两个webpack 配置文件里面的output配置项下面加入如下内容
`publicPath: "/public",`

最后在app.js中，使用服务端的渲染方法：
```javascript
ReactDOM.hydrate(<App/>, document.getElementById('root'));
```
最后重新打包和运行项目就可以大功告成了！




















