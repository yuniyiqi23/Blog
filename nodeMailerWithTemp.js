/**
 * Created by olyjosh on 29/06/2017.
 */

var sender = 'smtps://378532514@qq.com'   // The emailto use in sending the email(Change the @ symbol to %40 or do a url encoding )
var password = 'thvhdvugbbxccagc'  // password of the email to use

var nodeMailer = require("nodemailer");
var EmailTemplate = require("email-templates").EmailTemplate;


var transporter = nodeMailer.createTransport(sender + ':' + password + '@smtp.qq.com');

// create template based sender function
// assumes text.{ext} and html.{ext} in template/directory
var sendResetPasswordLink = transporter.templateSender(
    new EmailTemplate('./templates/activeUser'), {
        from: 'hello@yourdomain.com',
    });

exports.sendPasswordReset = function (email, username, name, tokenUrl) {
    // transporter.template
    sendResetPasswordLink({
        to: email,
        subject: 'Password Reset - YourDomain.com'
    }, {
        name: name,
        username: username,
        token: tokenUrl
    }, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('Link sent\n' + JSON.stringify(info));
        }
    });
};