# Blog开发说明
1. Express中next的理解<br>
2. Mongoose ObjectId的理解<br>
3. 数据库设计（category、tag）<br>
4. Promise的理解<br>
5. 做项目过程中学到的经验<br>
- res.render和res.redirect的区别<br>
6. 全文索引<br>
db.getCollection('posts').ensureIndex({title:"text",content:"text"},{weights:{title:1,content:2}})<br>

## 应用健壮性说明<br>
1. 使用缓存技术<br>
Nginx<br>
2. 用menwatch等工具检查memory<br>
3. 用ESLint检查代码质量<br>
监测引用错误和未定义变量等<br>
参考资料：<br>
https://www.jianshu.com/p/ad1e46faaea2<br>
http://eslint.cn/docs/rules/<br>
4. -trace-sync-io 标识同步代码<br>

## 网站部署<br>
1. 自动化部署说明<br>
2. 反向代理（Nginx）<br>
3. 守护进程（PM2）<br>
```node
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
	}],
```
参考资料：<br>
http://pm2.keymetrics.io/<br>
4. 设置NODE_ENV为Production<br>
   可以让应用有将近3倍速度提升<br>
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
测试网站安全性：http://cyh.herokuapp.com/cyh<br>
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

3. 使用nsp和requireSafe管理第三方的依赖库的安全问题<br>
```node
$ npm i nsp -g
使用以下命令将 package.json 文件提交至 nodesecurity.io 以进行验证：
$ nsp audit-package
```

## 问题处理<br>
1. 应用内存泄漏<br>
Heapdump、Easy-monitor等工具<br>
