const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');

/* GET users listing. */
router.get('/', function (req, res, next) {
	const username = req.query.name;
	const code = req.query.code;

	UserModel.activeUser(username, code, Date.now())
		.then(function (result) {
			if (result) {
				// 此 user 是插入 mongodb 后的值，包含 _id
				let user = result._doc;
				// 删除密码这种敏感信息，将用户信息存入 session
				delete user.password;
				req.session.user = user;
				// 写入 flash
				req.flash('success', '激活成功，已登录！');
				// 跳转到首页
				res.redirect('/posts');
			} else {
				req.flash('fail', '激活失败');
				res.redirect('/posts');
			}
		})
		.catch(next);

});



module.exports = router;