/**
 * Created by olyjosh on 29/06/2017.
 */

const nodeMailer = require("nodemailer");
const EmailTemplate = require("email-templates-v2").EmailTemplate;

const sender = 'smtps://378532514%40qq.com'   // The emailto use in sending the email(Change the @ symbol to %40 or do a url encoding )
const password = 'thvhdvugbbxccagc'  // password of the email to use

const transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.qq.com');

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory
const sendResetPasswordLink = transporter.templateSender(
    new EmailTemplate('./templates/activeUser'), {
        from: '378532514@qq.com',
    });

exports.sendActiveUser = function (email, username, activeURL) {
    // transporter.template
    sendResetPasswordLink({
        to: email,
        subject: '激活账号'
    }, {
        username: username,
        activeURL: activeURL
    }, function (err, info) {
        if (err) {
            console.log('Email sent fail!\n' + err)
        } else {
            console.log('Email sent success!\n' + JSON.stringify(info));
        }
    });
};