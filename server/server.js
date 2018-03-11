const express = require('express');
const ReactSSR = require('react-dom/server');//react-dom的服务端渲染模块
const fs = require('fs');
const path = require('path');
const serverEntry = require('../dist/server-entry').default;//打包编译之服务端渲染容器

const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');

const app=express();
app.use('/public', express.static(path.join(__dirname,'../dist')));//标志这个路径下面我们加载的是静态资源的内容

//截取所有服务端发送过来的get请求
app.get('*',function(req,res){
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace('<app></app>',appString));
});

app.listen(3002,function(){
    console.log('server is start and listen port 3002')
});