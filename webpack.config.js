// npm install --save-dev webpack webpack-cli // 全局安装webpage 环境
// npm install --save-dev webpack-dev-server  // webpack 服务器
// npm install --save-dev html-webpack-plugin // html文件插件
// npm install --save-dev css-loader style-loader mini-css-extract-plugin   // 后面 抽离css样式让index.html里面的css样式编程link引入
// npm install --save postcss-loader autoprefixer // css兼容问题 自动添加 -web-kit-
// npm install --save optimize-css-assets-webpack-plugin // css压缩
// npm install --save uglifyjs-webpack-plugin            // js压缩
// npm install --save url-loader     // 图片压缩
// npm install --save file-loader // 文件加载loader
// npm install --save bable-cli  // es6转换es5


let htmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtarctPlugin = require('mini-css-extract-plugin')
let postCss = require('autoprefixer')({
    "overrideBrowserslist":[
        'last 10 Chrome versions',
        'last 5 Firefox versions',
        'Safari >=6 ',
        'ie>8'
    ]
})
let OptimizeCSS=require('optimize-css-assets-webpack-plugin') // css
let UglifyjsPlugin = require('uglifyjs-webpack-plugin') // js
let path = require('path')

console.log(1213)
module.exports = {
    mode:'production',//生产环境下 代码压缩  // development  开发环境下 代码压缩
    entry:'./src/index.js',
    // {
        //index:'./src/index.js', // 配置多页面应用
        // admin: './src/admin.js'
    // },
    output:{
        filename: './hh.js', // [name] 自动识别入口文件名
        path:path.resolve(__dirname,'dist'),
        // publicPath: "/"    // 重要 build后的公共路径c
    },
    // loader配置
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtarctPlugin.loader,
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                postCss
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use:[
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100*1024, //小于100k用base64
                            outputPath: './static/images'
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,  // 支持require（‘*。js）文件
                exclude:/(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: { //用babel-loader 需要把es6转es5
                        presets:[
                            '@babel/preset-env'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-transform-runtime'
                        ]   
                    }
                },
                include:path.resolve(__dirname,'src'),//需要转换的文件夹
                exclude:/node_modules/ //排除转换的文件夹
            }
        ]
    },
    optimization: {
        // 优化项 启动后mode 模式代码压缩不在生效，必须配置js压缩插件
        minimizer:[
            new OptimizeCSS(), // 优化css
            new UglifyjsPlugin({
                cache: true, // 是否用缓存
                parallel: true, // 是否并发打包
                sourceMap: true // es6 映射 es5 需要用
            })
        ]
    },
    // 开发者服务器配置
    devServer:{
        // contentBase:path.join(__dirname,'./dist/demo/js'),
        port: 8000, // 端口
        host: "localhost", // 本地地址 // 0.0.0.0 可以访问网络地址
        progress: true,    // 开启进度条
        contentBase: "./dist",   // 默认打开路径
        open: true,  // 自动打开浏览器
        compress:true , //
        // 跨域
        proxy:{
            '/api':{
                target: 'http://www.baidu.com', // 代理地址
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    "^/api": ''  //需要 rewrite
                }
            }
        } 
    },
    
    // 配置html插件
    plugins:[
        // html 文件配置
        new htmlWebpackPlugin({
            template: "index.html", // 压缩的文件路径
            filename: 'index.html',   // 压缩完成生成的文件名
            minify:{
                collapseWhitespace: true
            },
            hash: true,   // 生成hash戳
            // chunks:['index']
        }),
        // new htmlWebpackPlugin({
        //     template: "./public/admin.html",
        //     filename: 'admin.html',
        //     minify:{
        //         collapseWhitespace: true
        //     },
        //     hash: true,
        //     chunks:['admin']  // 多页面打包 按需加载
        // }),
        new MiniCssExtarctPlugin({
            // 
            filename: 'css/main.css'
        })
    ]
}