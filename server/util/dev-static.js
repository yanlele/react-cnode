const axios=require('axios');
const path = require('path');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');//可以读取内存中的文件
const ReactDomServer = require('react-dom/server');

const serverConfig = require('../../build/webpack.config.server');

//实时拿到最新的html 模板文件
const getTemplate=()=>{
    return new Promise((resolve,reject)=>{
        axios.get('http://localhost:3003/public/index.html').then(res=>{
            resolve(res.data);
        }).catch(reject);
    })
};

const Module = module.constructor;//module的构造方法，可以通过这个构造方法创建一个新的module

const mfs = new MemoryFs;//实例化MemoryFs
const serverCompiler = webpack(serverConfig);//启动一个webpack
serverCompiler.outputFileSystem = mfs;

let serverBundle;

//监听webpack 的变化
serverCompiler.watch({},(err,stats)=>{
    if(err){
        throw err
    }

    stats=stats.toJson();
    stats.errors.forEach(err=>{
        console.log(err)
    });
    stats.warnings.forEach(warn=>{
        console.log(warn)
    });

    //获取serverBundle中的信息
    const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
    const bundle = mfs.readFileSync(bundlePath,'utf-8');
    const m = new Module();
    m._compile(bundle,'server-entry.js');//让module来解析我们内存获得的bundle
    serverBundle = m.default;
});

module.exports=function(app){
    app.get('*',function(req,res){
        getTemplate().then(template=>{
            const content = ReactDomServer.renderToString(serverBundle);
            res.send(template.replace('<!-- app -->',content))
        })
    })
};