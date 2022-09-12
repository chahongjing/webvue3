module.exports = {
    devServer: {
        open: true,
        host: 'localhost',
        port: 5173, //这里的ip和端口是前端项目的;下面为需要跨域访问后端项目
        proxy: {
            '/': {
                target: 'http://localhost:8088/', //这里填入你要请求的接口的前缀
                ws:true,//代理websocked
                changeOrigin:true,//虚拟的站点需要更管origin
                secure: false,                   //是否https接口
                pathRewrite:{
                    '^/':''//重写路径
                },
                headers: {
                    referer: 'http://localhost:8088/', //这里后端做了拒绝策略限制，请求头必须携带referer，否则无法访问后台
                }
            }
        }
    }
}