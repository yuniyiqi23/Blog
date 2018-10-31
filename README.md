# Blog开发说明
1. Express中next的理解<br>
在Express中注册多个中间件，使用next调用后面的中间件。好比链表一样，往下调用。<br>
在代码中也会有相同的效果，如下所示：<br>
路由匹配上“/create”，会先调用checkLogin函数。后面调用next(),才会继续执行到后面的函数<br>
```node
// ./middlewares/check.js
module.exports = {
	checkLogin : function checkLogin(req, res, next) {
		if(!req.session.user){
			req.flash('error', '未登录！');
			return res.redirect('/signin');
		}
		next();
	},

	checkNotLogin : function checkNotLogin(req, res, next) {
		if(req.session.user){
			// req.flush('error', '已登录！');
			return res.redirect('/posts');
		}
		next();
	}
};
// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
	...
})
```
2. MongoDB ObjectId的理解<br>
- ObjectId是MongoDB数据库自动生成的id标识，里面带有时间戳（可以提取出来转化为相应的时间）
- 在查询过程中对应数据库自动生成的ObjectId可以直接用string字符串查找，如果是自己创建的ObjectId则需要转化成ObjectId类型才能匹配查找<br>
3. 数据库设计（category、tag）<br>
- 博文的分类可以每一个用户特殊的分类列表也可以做成公用列表，两者相结合也可以（根据自身的需求来制定）
- 使用的数据库是MongoDB，标签可以作为博文的一个字段
4. Promise的理解<br>
Promise是异步调用函数，回调方法会在所有同步代码执行完毕之后再执行<br>
5. 项目经验<br>
- res.render和res.redirect的区别<br>
6. 搜索功能<br>
使用like关键字去匹配搜索效率比较低，可以使用全文搜索功能，提升搜索效率（用空间换时间）<br>
- 全文搜索<br>
db.getCollection('posts').ensureIndex({title:"text",content:"text"},{weights:{title:1,content:2}})<br>

## 应用健壮性说明<br>
1. 使用缓存技术<br>
使用缓存服务器，如Nginx来提升访问速度<br>
参考资料：
<a href="http://www.expressjs.com.cn/advanced/best-practice-performance.html#use-a-load-balancer">Express最佳性能实践</a>
2. 用menwatch等工具检查memory<br>
3. 用ESLint检查代码质量<br>
监测引用错误和未定义变量等<br>
参考资料：
<a href="https://www.jianshu.com/p/ad1e46faaea2">ESLint入门教程</a>、
<a href="http://eslint.cn/docs/rules/">ESLint官网</a><br>
4. -trace-sync-io 标识同步代码<br>

## 网站部署<br>
1. 自动化部署说明<br>
<a href="https://github.com/yuniyiqi23/Blog/blob/master/docs/git_auto_deploy.md">Git自动化部署</a><br>
2. 反向代理（Nginx）<br>
3. 守护进程（PM2）<br>
```node
//ecosystem.config.js配置文件
module.exports = {
    apps: [{
		name: "Your APP Name",
		// 最大内存限制
		max_memory_restart: "500M",
		script: "./bin/www",
		// 最大限度地使用CPUs
		instances: "max",
		exec_mode: "cluster",
		out_file: "~/.pm2/logs/blog_out.log",
		error_file: "~/.pm2/logs/blog_error.log",
		merge_logs: true,
		log_date_format: "YYYY-MM-DD HH:mm Z",
		env: {
			"PORT": 3000,
			"NODE_ENV": "development",
		},
		env_production: {
			"PORT": 3001,
			"NODE_ENV": "production"
		}
	}]
}
```
如果在多核CPU服务器上使用pm2 list可以看到多个应用实例<br>
如下图所示：<br>
![](http://47.75.8.64/pm2_list.png)<br>
参考资料：<a href="http://pm2.keymetrics.io/">PM2官网</a>

4. 设置NODE_ENV为Production<br>
   可以让应用有将近3倍速度提升<br>
   如下图所示：<br>
![](https://goldbergyoni.com/wp-content/uploads/2017/03/node_env-performance.png)<br>

## 网站安全性<br>
1. HTTP头安全性设置
通过使用Helmet模块设置 HTTP 头，帮助您保护应用程序避免一些众所周知的 Web 漏洞。<br>
- csp 用于设置 Content-Security-Policy 头，帮助抵御跨站点脚本编制攻击和其他跨站点注入攻击。
- hidePoweredBy 用于移除 X-Powered-By 头。
- hpkp 用于添加公用密钥固定头，防止以伪造证书进行的中间人攻击。
- hsts 用于设置 Strict-Transport-Security 头，实施安全的服务器连接 (HTTP over SSL/TLS)。
- ieNoOpen 用于为 IE8+ 设置 X-Download-Options。
- noCache 用于设置 Cache-Control 和 Pragma 头，以禁用客户端高速缓存。
- noSniff 用于设置 X-Content-Type-Options，以防止攻击者以 MIME 方式嗅探浏览器发出的响应中声明的 content-type。
- frameguard 用于设置 X-Frame-Options 头，提供 clickjacking 保护。
- xssFilter 用于设置 X-XSS-Protection，在最新的 Web 浏览器中启用跨站点脚本编制 (XSS) 过滤器。
```node
const express = require('express');  
const helmet = require('helmet');
const app = express();
app.use(helmet());
```
网站地址：<a href="http://cyh.herokuapp.com/cyh">安全性测试网站</a><br>
效果图如下：<br>
![](http://47.75.8.64/herokuapp.png)<br>

2. 暴力破解保护（通过限制用户在一定时间内登录次数来实现）
通过使用中间件express-rate-limit来实现<br>
```node
const rateLimit = require("express-rate-limit");
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);
```

3. 使用nsp或是requireSafe检测第三方库的安全性<br>
```node
$ npm i nsp -g
$ nsp check --reporter summary
```
效果图如下：<br>
![](http://47.75.8.64/nsp.png)<br>

## 问题处理<br>
1. 应用内存泄漏<br>
Heapdump、Easy-monitor等工具<br>
