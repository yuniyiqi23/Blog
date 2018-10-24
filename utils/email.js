// 引入 nodemailer
const nodemailer = require('nodemailer');

// 创建一个SMTP客户端配置
const config = {
	host: 'smtp.qq.com', 
	port: 25,
	auth: {
		user: '378532514@qq.com', //刚才注册的邮箱账号
		pass: 'thvhdvugbbxccagc'  //邮箱的授权码，不是注册时的密码
	}
};

// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

// 发送邮件
module.exports = function (mail){
	transporter.sendMail(mail, function(error, info){
		if(error) {
			return console.log(error);
		}
		console.log('mail sent:', info.response);
	});
};