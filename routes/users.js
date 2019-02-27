const express = require('express');
const router = express.Router();
const cls = require('continuation-local-storage');
const UserModel = require("../models/users");

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('Hello World!');
	// res.render('test_post.ejs');
});

// 用户管理
// 获取用户列表（重制密码，删除用户）
router.get('/manage', function (req, res, next) {
	UserModel.getAllusers()
		.then(function (result) {
			res.render("userManage.ejs", {
				users: result
			});
		})
		.catch(next);
});

router.get('/:id', (req, res, next) => {
	const namespace = cls.getNamespace('com.blog');
	console.log('Debug: ' + namespace.get('tid'));
	// throw new Error("请填写密码！");
	res.send('id');
});

module.exports = router;