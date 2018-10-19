const sendEmail = require('./utils/email');

// 创建一个邮件对象
const mail = {
    // 发件人
    from: '378532514@qq.com',
    // 主题
    subject: '激活账号',
    // 收件人
    to: 'yuniyiqi23@gmail.com',
    // 邮件内容，HTML格式
    text: '点击激活：<a href="http://' + config.deployEnv().ip +'/checkCode?name='+ user.name +'&code='+ user.code + '"></a>'
};
sendEmail(mail);