# Blog开发说明
## 知识梳理<br>
#### 1. Express中next的理解<br>
- 在Express中注册多个中间件，使用next调用后面的中间件。好比链表一样，向下调用。<br>

#### 2. MongoDB中ObjectId的理解<br>
- ObjectId是MongoDB数据库自动生成的id标识，里面带有时间戳（可以提取出来转化为相应的创建时间）
- 在查询过程中对应数据库自动生成的ObjectId可以直接用string字符串查找，如果是自己创建的ObjectId则需要转化成ObjectId类型才能匹配查找<br>

#### 3. 数据库设计（category、tag）<br>
- 博文的分类可以每一个用户特殊的分类列表也可以做成公用列表，两者相结合也可以（根据自身的需求来制定）
- 使用的数据库是MongoDB，标签可以作为博文的一个字段

#### 4. callback、Event、Promise的理解<br>
- callback回调函数就是把函数的引用传递给另一个函数，在JS中可以把函数看成对象，这样容易理解<br>
- event相对于callback更灵活，属于发布和订阅的模式，可以有多个订阅，适合于公开的场景（如按钮的点击），callback更适合于私有的场景（如内部函数的调用）<br>
- Promise是异步调用函数，回调方法会在所有同步代码执行完毕之后再执行<br>

#### 5. 项目经验<br>
- res.render和res.redirect的区别：res.render可以传递参数；res.redirect不能传递参数<br>

#### 6. 搜索功能<br>
- 使用全文搜索提升效率（空间换时间）建立索引表快速查找目标；使用like关键字去匹配搜索效率较低<br>
```
db.getCollection('posts').ensureIndex({title:"text",content:"text"},{weights:{title:1,content:2}})<br>
```

#### 7. setTimeout、setimmediate、process.nextTick的区别
- setTimeout是在一定时间后执行，比如设置在10s后执行，到了10s只是排上了队。如果CPU还在执行其他任务的话，只能等待<br>
- setimmediate是有空闲了立刻执行。在异步调用上，setimmediate调用会比setTimeout快<br>
- process.nextTick会在代码执行异步回调之前执行，所以在setimmediate之前执行<br>
参考资料：<a href="https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/">The Node.js Event Loop, Timers, and process.nextTick()</a>


## 应用健壮性说明<br>
#### 1. 使用缓存技术（静态文件服务器）<br>
使用缓存服务器，如Nginx来提升访问速度<br>
以下是Apache和Nginx作为Http服务器的测试对比<br>
![](http://47.75.8.64/readme_images/nginx_1.jpg)<br>
- Apache、Nginx 与 Node 的对比：请求负载的性能（每 100 位并发用户）<br>
![](http://47.75.8.64/readme_images/nginx_2.jpg)<br>
- Apache、Nginx 与 Node 的对比：用户负载能力（每 1000 个请求）<br>
![](http://47.75.8.64/readme_images/nginx_3.jpg)<br>
- Apache、Nginx 与 Node 的对比：完成 1000 位用户并发的 100000 个请求耗时<br>
**综合考虑：Nginx比Apache更适合做静态文件服务器**
参考资料：
<a href="http://www.expressjs.com.cn/advanced/best-practice-performance.html#use-a-load-balancer">Express最佳性能实践</a>

#### 2. 用menwatch等工具检查memory<br>

#### 3. 用ESLint检查代码质量<br>
监测引用错误和未定义变量等<br>
参考资料：
<a href="https://www.jianshu.com/p/ad1e46faaea2">ESLint入门教程</a>、
<a href="http://eslint.cn/docs/rules/">ESLint官网</a><br>

#### 4. -trace-sync-io 标识同步代码<br>
实践举例：<br>
**环境：nodejs 10.2.1；express 4.15.5**<br>
根据输出结果google得知res.render方法是同步方法，在Express5.0可能会调整底层逻辑。目前可以设置NODE_ENV=production或者使用缓存技术（如：Nginx）来提升应用的响应<br>

#### 5. 测试应用性能，设置基准，避免版本之间的性能回归
参考资料：
<a href="https://pdfs.semanticscholar.org/301b/45bb8e795f83774c920b942c0dba7e290b53.pdf">Node.js Paradigms and Benchmarks</a>、
<a href="https://github.com/nodejs/help/issues/1365">Node.js vs C on x86 vs ARM performance tests</a><br>

## 网站部署<br>
#### 1. 自动化部署说明<br>
参考资料：<a href="https://github.com/yuniyiqi23/Blog/blob/master/docs/git_auto_deploy.md">Git自动化部署(亲自部署总结的经验)</a><br>

#### 2. 反向代理（Nginx）<br>

#### 3. 守护进程（PM2）<br>
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
**Nodejs是单线程应用，可以部署cluster模式充分发挥多CPU的效能**
如果在多核CPU服务器上使用pm2 list可以看到多个应用实例<br>
如下图所示：<br>
![](http://47.75.8.64/readme_images/pm2_list.png)<br>
参考资料：<a href="http://pm2.keymetrics.io/">PM2官网</a>

#### 4. 设置NODE_ENV为Production<br>
可以让应用有将近3倍速度提升，如下图所示：<br>
![](https://goldbergyoni.com/wp-content/uploads/2017/03/node_env-performance.png)<br>

#### 5. 日志使用的理解<br>
console.log输出到控制台属于同步输出，在开发Nodejs应用程序时不建议使用。<br>
可以使用Winston中间件输出日志<br>

## 网站安全性<br>
#### 1. HTTP头安全性设置
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
![](http://47.75.8.64/readme_images/herokuapp.png)<br>

#### 2. 暴力破解保护（通过限制用户在一定时间内登录次数来实现）
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

#### 3. 使用nsp或是requireSafe检测第三方库的安全性<br>
**个人理解**：发布中间件的时候会把代码提交给检测方测试，通过检测的版本记录到相应的数据库里，还会做一些签名。这样在验证中间件的时候只要提供相应的版本和签名就可以检测其安全性了。<br>
```node
$ npm i nsp -g
$ nsp check --reporter summary
```
效果图如下：<br>
![](http://47.75.8.64/readme_images/nsp.png)<br>

## 问题处理<br>
#### 1. 应用内存泄漏<br>
Heapdump、Easy-monitor等工具<br>
Easy-monitor使用截图<br>
