//引入express框架
var express = require('express');
//用于处理目录的对象，提高开发效率
var path = require('path');
//用户加载图标
var favicon = require('serve-favicon');
//在控制台中，显示req请求的信息
var logger = require('morgan');
//加载cookie模块，用于获取web浏览器发送的cookie中的内容
var cookieParser = require('cookie-parser');
//解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理
var bodyParser = require('body-parser');

var index = require('./app_server/routes/index');
var users = require('./app_server/routes/users');
//To do download
var download = require('./app_server/routes/download');

var app = express();

// view engine setup
//定义视图搜索路径
//设置VIEWS文件夹，__dirname是node.js里面的全局变量。取得执行js所在的路径
app.set('views', path.join(__dirname, 'app_server', 'views'));
//设置模板引擎
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件，定义日志和输出级别
app.use(logger('dev'));
//加载解析json的中间件,接受json请求
app.use(bodyParser.json());
//加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));
//加载解析cookie的中间件
app.use(cookieParser());
//静态文件目录设置,设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));

//路由控制器
app.use('/', index);
app.use('/users', users);
app.use('/download_form', download);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
  res.render('/pages/error');
});

module.exports = app;

