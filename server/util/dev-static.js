const axios=require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');//可以读取内存中的文件

const serverConfig = require('../../build/webpack.config.server');

//实时拿到最新的html 模板文件
const getTemplate=()=>{
    return new Promise((resolve,reject)=>{
        axios.get('http://localhost:3003/public/index.html').then(res=>{
            resolve(res.data);
        }).catch(reject);
    })
};

const mfs = new MemoryFs;//实例化MemoryFs
const serverCompiler = webpack(serverConfig);//启动一个webpack
serverConfig.outputFileSystem = mfs;

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
    const bundle = mfs.readFileSync(bundlePath);
});

module.exports=function(app){
    app.get('*',function(req,res){

    })
};