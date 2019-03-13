//引入express框架
const express = require('express');
//用于处理目录的对象，提高开发效率
const path = require('path');
//加载图标
const favicon = require('serve-favicon');
//在控制台中，显示req请求的信息
const morgan = require('morgan');
//加载cookie模块，用于获取web浏览器发送的cookie中的内容
const cookieParser = require('cookie-parser');
//解析客户端请求的body中的内容,内部使用JSON编码处理,url编码处理以及对于文件的上传处理
const bodyParser = require('body-parser');
//使用Helmet设置安全性相关的HTTP headers
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const moment = require('moment');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');
var winston = require('winston');
const expressWinston = require('express-winston');
//Assign TransactionId
const cls = require('continuation-local-storage');
const namespace = cls.createNamespace('com.blog');
const uuid = require('node-uuid');
//Application Perpormance Monitorting
require('newrelic');

var fs = require('fs');
var qiniu = require('qiniu');
const app = express();

var config1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, "config.json")));
var mac = new qiniu.auth.digest.Mac(config1.AccessKey, config1.SecretKey);

var putExtra = new qiniu.form_up.PutExtra();
var options = {
    scope: config1.Bucket,
    deleteAfterDays: 1,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
};

var putPolicy = new qiniu.rs.PutPolicy(options);
var bucketManager = new qiniu.rs.BucketManager(mac, config1);


app.get('/api/getImg', function(req, res) {
    var options = {
        limit: 5,
        prefix: 'image/test/',
        marker: req.query.marker
    };
    bucketManager.listPrefix(config1.Bucket, options, function(err, respBody, respInfo) {
        if(err) {
            console.log(err);
            throw err;
        }

        if(respInfo.statusCode == 200) {
            var nextMarker = respBody.marker || '';
            var items = respBody.items;
            res.json({
                items: items,
                marker: nextMarker
            });
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
});

app.get('/api/uptoken', function(req, res) {
    var token = putPolicy.uploadToken(mac);
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if(token) {
        res.json({
            uptoken: token,
            domain: config1.Domain
        });
    }
});

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
        //这段仅仅为了方便返回json而已
    // res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        //让options请求快速返回
        res.sendStatus(200); 
    } else { 
        next(); 
    }
});


app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
//set linkTime and requests number
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100 // limit each IP to 100 requests per windowMs
});
// view engine setup
//设置VIEWS文件夹，__dirname是node.js里面的全局变量。取得执行js所在的路径
app.set('views', path.join(__dirname, 'views'));
//设置模板引擎
app.set('view engine', 'ejs');

//Datadog(watch CPU, server RAM,  Node process RAM and so on)
const dd_options = {
	'response_code': true,
	'tags': ['app:aliyun_blog']
};
const connect_datadog = require('connect-datadog')(dd_options);

//Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.noCache());
// apply to all requests
app.use(limiter);
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件，定义日志和输出级别
app.use(morgan('dev'));
// 加载解析json的中间件,接受json请求
app.use(bodyParser.json());
// 加载解析urlencoded请求体的中间件
app.use(bodyParser.urlencoded({ extended: false }));
// 加载解析cookie的中间件
app.use(cookieParser());
//静态文件目录设置,设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
const expiryDate = new Date(Date.now() + 60 * 30 * 1000); // 30min，单位是毫秒
app.use(session({
	name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	rolling : true,// 顺延session过期时间
	// resave: false,
	saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
	cookie: {
		maxAge: config.session.maxAge,// 过期时间，过期后 cookie 中的 session id 自动删除
		secure: false,//当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
		httpOnly: true,
		//测试SSH 22端口
		// expires: expiryDate,//兼容IE(IE早期版本不支持maxAge)
	},
	store: new MongoStore({// 将 session 存储到 mongodb
		url: config.mongodb,// mongodb 地址
		touchAfter: 24 * 3600 //24小时，单位是秒
	})
}));

// flash 中间件，用来显示通知
app.use(flash());

// 设置模板全局常量
app.locals.blog = {
	title: pkg.name,
	description: pkg.description
};

//加载自定义全局方法  
app.locals.global = require('./utils/global');

// 添加模板必需的变量
app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.keywords = null;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});

// create a transaction id for each request
app.use(function (req, res, next) {
	const namespace = cls.getNamespace('com.blog');
	const tid = uuid.v4();

	// wrap the events from request and response
	namespace.bindEmitter(req);
	namespace.bindEmitter(res);

	// run following middleware in the scope of
	// the namespace we created
	namespace.run(function () {

		// set tid on the namespace, makes it
		// available for all continuations
		namespace.set('tid', tid);
		next();
	});
});

// 正常请求的日志
app.use(expressWinston.logger({
	transports: [
		// new (winston.transports.Console)({
		// 	level: 'debug',
		// 	handleExceptions: true,
		// 	json: true,
		// 	colorize: true,
		// }),
		new winston.transports.File({
			// filename: 'logs/success.log'
			json: true,
			filename: path.join(__dirname, 'logs/success.log'),
			maxsize: 5242880,//5MB
			maxFiles: 10,
			timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
		})
	],
	exitOnError: false, // do not exit on handled exceptions
}));

// Add the datadog-middleware before your router
app.use(connect_datadog);
// Blog路由
routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
	transports: [
		// new winston.transports.Console({
		// 	level: 'debug',
		// 	handleExceptions: true,
		// 	json: true,
		// 	colorize: true,
		// }),
		new winston.transports.File({
			json: true,
			filename: path.join(__dirname, 'logs/error.log'),
			maxsize: 5242880,//5MB
			maxFiles: 10,
			timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
		})
	],
	exitOnError: false, // do not exit on handled exceptions
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	//     next(createError(404));
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	if (res.headersSent) {
		return next(err);
	}
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

//Debug
//node --inspect-brk ./bin/www

//autoRun
//nodemon --inspect-brk ./bin/www 

//esay profiling
//NODE_ENV=production node --prof ./bin/www 