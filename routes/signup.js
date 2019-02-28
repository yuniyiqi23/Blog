const fs = require('fs');
const path = require('path');
// const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const moment = require('moment');
// const sendEmail = require('../utils/email');
const config = require('../config/default');

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const UserModel = require('../models/users');
const mail = require('../utils/nodeMailerWithTemp');
// 定义加密密码计算强度
const SALT_WORK_FACTOR = 11;

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res) {
	res.render('signup.ejs');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
	const form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname, '../public/images');  //文件保存在系统临时目录
	form.maxFieldsSize = 1 * 1024 * 1024;  //上传文件大小限制为最大1M
	form.keepExtensions = true;        //使用文件的原扩展名

	form.parse(req, function (err, fields, files) {
		const userInfo = {
			username: fields.name,
			gender: fields.gender,
			bio: fields.bio,
			email: fields.email,
			avatar: files.avatar.path.split(path.sep).pop(),
			password: fields.password,
			repassword: fields.repassword,
		};

		const schema = Joi.object().keys({
			username: Joi.string().alphanum().min(3).max(30).required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
			repassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
			email: Joi.string().email({ minDomainAtoms: 2 }),
			bio: Joi.string().min(10).max(100),
			gender: Joi.string(),
			avatar: Joi.string()
		});

		// 校验参数
		const result = Joi.validate(userInfo, schema);
		if (result.error !== null) {
			// 注册失败，异步删除上传的头像
			fs.unlink(files.avatar.path);
			req.flash('error', result.error);
			return res.redirect('/signup');
		}

		getBcryptPassword(userInfo.password)
			.then(function (value) {
				// console.timeEnd('getBcryptPassword');
				// 待写入数据库的用户信息
				let user = {
					name: userInfo.username,
					password: value,
					gender: userInfo.gender,
					bio: userInfo.bio,
					avatar: userInfo.avatar,
					email: userInfo.email,
					date: moment().add({ days: 1 }),
					//产生随机数
					code: parseInt(Math.random() * 90000 + 10000).toString(),
					//用户状态（未激活）
					islive: false,
					loginTime: moment().format('YYYY-MM-DD HH:mm')
				};
				// console.log('user.password = ' + user.password);

				// 用户信息写入数据库
				UserModel.createUser(user)
					.then(function (result) {
						// console.log('createUser result :\n' + result);
						//Sending email here
						let activeURL = 'http://' + config.deployEnv().ip + '/checkCode?name=' + result.name + '&code=' + result.code;
						mail.sendActiveUser(result.email, result.name, activeURL);
						res.render('signupSuccess.ejs', { email: result.email});
					})
					.catch(function (e) {
						// 注册失败，异步删除上传的头像
						if(req.files){
							fs.unlink(req.files.avatar.path);
						}
						// 用户名被占用则跳回注册页，而不是错误页
						if (e.message.match('duplicate key')) {
							req.flash('error', '用户名已被占用');
							return res.redirect('/signup');
						}
						// next(e);
						throw next(e);
					});
			})
			.catch(function (err) {
				next(err);
			});

	});
});

function getBcryptPassword(password) {
	// console.time('getBcryptPassword');
	return new Promise(function (resolve) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt, next) {
			if (err) {
				throw next(err);
			}
			bcrypt.hash(password, salt, function (err, hash) {
				// console.log('salt = ' + salt);
				if (err) {
					throw next(err);
				}
				password = hash;
				// console.log('password = ' + password);
				resolve(password);
			});
		});
	});
}

module.exports = router;