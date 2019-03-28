一、 学习计划
1. HTTP权威指南（Node、Express其他参考书）
2. 测试网站并发量
3. Radis
4. Readme编写(参考资料：https://www.diycode.cc/topics/498)


二、 项目迭代计划
文章+图片
关注+文章提醒
错误日志发送到开发人员的邮箱
MongoDB高级应用
用户登陆记录
数据可恢复（草稿箱）


三、疑问
1. 按照dedug和release进行编译程序（方便调试）
回归测试（反复测试、自动化测试）
注册用户（防止测试数据污染数据库）、测试数据库
release：npm包 update
2. simple-profiling生成文件分析（processed.txt）
3. 日志文件以Json方式查看
4. ab post(用户登录)
5. Too many requests, please try again later
6. 程序打包发布webpack，gulp（首先学习，预处理css，js）
主要打包html、css等

四、解决的问题：
##2018
#long long ago
call、bind、apply的区别
callback、Promise、Generator
Nginx日志

#12/12
-trace-sync-io标识同步代码（Nginx）
Winston异步输出日志

#12/17
ApacheBench压力测试（并发量）
分析Nodejs代码
https://nodejs.org/en/docs/guides/simple-profiling/

==================

##2019
#1/2
增加用户登录时间记录

#2/28
开发用户管理模块

#3/4
删除（恢复）用户

#3/6
重置密码（通过邮件方式）