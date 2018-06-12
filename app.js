//引入express框架
const express = require('express');
//用于处理目录的对象，提高开发效率
const path = require('path');
//加载图标
const favicon = require('serve-favicon');
//在控制台中，显示req请求的信息
const logger = require('morgan');
//加载cookie模块，用于获取web浏览器发送的cookie中的内容
const cookieParser = require('cookie-parser');
//解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');
const winston = require('winston');
const expressWinston = require('express-winston');

const app = express();

// view engine setup
//设置VIEWS文件夹，__dirname是node.js里面的全局变量。取得执行js所在的路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件，定义日志和输出级别
app.use(logger('dev'));
// 加载解析json的中间件,接受json请求
app.use(bodyParser.json());
// 加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));
// 加载解析cookie的中间件
app.use(cookieParser());
//静态文件目录设置,设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: false, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge,// 过期时间，过期后 cookie 中的 session id 自动删除
        // secure: false,//当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb,// mongodb 地址
        touchAfter: 24*3600 //单位是秒
    })
}));
// console.log('session.key = ' + config.session.key);
// console.log('session.secret = ' + config.session.secret);

// flash 中间件，用来显示通知
app.use(flash());

// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

//加载自定义全局方法  
app.locals.Fun = require('./utils/global');  

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        // new (winston.transports.Console)({
        //     json: true,
        //     colorize: true
        // }),
        new winston.transports.File({
            // filename: 'logs/success.log'
            filename : path.join(__dirname, 'logs/success.log'),
        })
    ]
}));

// Blog路由
routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: path.join(__dirname, 'logs/error.log'),
        })
    ]
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
//     next(createError(404));
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

//Debug
//node --inspect-brk ./bin/www

//Run
//node ./bin/wwwe --inspect-brk ./bin/www

//autoRun
//nodemon ./bin/www