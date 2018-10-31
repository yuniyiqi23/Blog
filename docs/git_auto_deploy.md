# Git 自动部署说明
## 实现原理
1. Git钩子
Git能在特定的重要动作发生前触发自定义脚本，这个触发过程叫做钩子。有两组这样的钩子分别是：<br>
- 服务端
- 客户端
对于客户端钩子可以在提交合并的时候使用；对于服务端的钩子可以在被推送的时候使用，正如本文要说的一样，当客户端push以写内容时，服务端的Git触发相应的脚本，在脚本中使用Git相关命令进行内容的拉取，实现自动部署功能。<br>
本文部署用的是服务端的钩子：post-receive<br>
在客户端push完成后运行，可以用来更新其它系统服务或者通知消息；本文通过这post-receive进行代码自动部署<br>
## 系统说明
- 服务器： 阿里云 ECS 服务器
 -操作系统： Ubuntu 16.04
 -操作说明：熟悉 linux 基本操作：vim编辑，chown权限设置等
- 应用说明：服务器上已安装Nodejs、Express、Git、PM2
## 搭建步骤 
1. 服务端
服务器上需要配置两个仓库，一个用于代码中转的远程仓库，一个用于用户访问的本地仓库。这里的「远程仓库」并不等同于托管代码的「中央仓库」，这两个仓库都是为了自动同步代码并部署网站而存在。
- 创建Git用户
注：一般情况下安装了Git，就会自动有git这个用户以及用户组生成。（没有的话新建）<br>
使用root账号（管理员权限）<br>
```
创建git用户：adduser git
```
- 创建裸仓库
裸仓库不同于普通仓库，裸仓库中只包含普通仓库.git目录下的文件，不包括任何代码文件。<br>
```
 cd /srv/  
 git init --bare blog.git
```
克隆裸仓库相比于普通仓库，只是多了一个参数bare。<br>
- 创建部署文件夹（代码仓库）
存放代码，目录是实际运行的线上代码<br>
```
cd /srv/  
git clone  blog.git
```
注：克隆后会有一个空仓库的提示，仓库名为blog<br>
修改代码仓库所有权（为了后面push代码做准备）<br>
```
sudo chown -R git:git blog
```
- 修改远程仓库用户所有权
由于初始化创建的时候，文件所有权归属当前用户（当前使用的是root），为了是git程序有操作权限，我们将所有权改为git拥有.<br>
```
sudo chown -R git:git blog.git
```
- 在裸仓库中添加钩子函数
在/srv/blog.git/hooks/里找到post-receive文件（没有的话创建），并对其修改权限。<br>
```
 vim /srv/blog.git/hooks/post-receive
```
赋予执行权限：chmod +x /srv/blog.git/hooks/post-recive
-  添加用户 ssh 登录权限
在客户端生成密匙文件：执行ssh-keygen<br>
然后查看~./ssh目录，是否有id_rsa.pub文件，把公钥（id_rsa.pub）追加到服务器/home/git/.ssh/authorized_keys文件尾部（没有.ssh路径就创建，所有者要改为git）。如果是团队项目，可以采用 gitosis 进行管理，配置可参考官方文档，此处暂不作介绍<br>
2. 客户端
- 将远程仓库进行克隆
```
git clone git@IP:/srv/blog.git
```
- 第二步：将代码上传到远程仓库
```
#进入blog目录
git add .
git commit -m 'push to Git Server'
git push origin master
```
第三步：测试是否自动部署
在浏览器中输入对应的IP地址即可<br>
## 问题说明
1) 遇到的问题大多是【权限】 问题导致的，用 chown 和 chmod 修改所有权和操作权限即可。
2) 遇到问题要进行前后逻辑思考，比如遇到fatal: Authentication failed。我已经配置了git config …，但是还是报错。去服务器（执行git log）验证了已经上传了代码，原因是触发脚本时报错。所以在服务器执行git config …才能真正解决问题
## 提升方案
- PM2开机启动
- git回滚
自动部署系统发布后发现问题，需要回滚到某一个commit，再重新发布<br>
原理：先将本地分支退回到某个commit，删除远程分支，再重新push本地分支<br>
```
1、新建backup分支 作为备份，以防万一
git branch backup 
2、本地代码回滚到上一版本（或者指定版本）
git reset --hard HEAD~1
3、加入-f参数，强制提交，远程端将强制跟新到reset版本
git push -f origin master 
```