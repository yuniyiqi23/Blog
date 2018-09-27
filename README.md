# Blog
准备开始写产品展示<br>
1.Express中next的理解<br>
2.Mongoose ObjectId的理解<br>
3.数据库设计（category、tag）<br>
4.Promise<br>
5.做项目过程中学到的经验<br>

网站部署<br>
1.自动化部署<br>

网站安全性<br>
1.安全性相关的HTTP头
通过使用Helmet模块设置
const express = require('express');  
const helmet = require('helmet');
const app = express();
app.use(helmet());
测试网站：http://cyh.herokuapp.com/cyh
2.暴力破解保护（通过限制用户在一定时间内登录次数来实现）
通过使用中间件express-rate-limit来实现
const rateLimit = require("express-rate-limit");
 
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
app.use(limiter);


