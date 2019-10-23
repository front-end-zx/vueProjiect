module.exports = {
    devServer:{
        port:8888, // 端口号，如果端口号被占用，会自动提升1
        host:"localhost", // 主机名：127.0.0.1
        https:false, // 协议
        open:true, // 启动服务时自动打开浏览器访问
        proxy:{ // 开发环境代理配置
            [process.env.VUE_APP_BASE_API]:{
                target:process.env.VUE_APP_SERVICE_URL, // 目标服务器
                changeOrigin:true, // 开启代理服务器
                pathRewrite:{
                    ['^'+process.env.VUE_APP_BASE_API]:''
                }

            }
        }
    },
    lintOnSave:false, // 关闭格式检查
    productionSourceMap:false, // 打包后不回生成.map文件，加快打包速度
}