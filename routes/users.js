const express = require('express');
const router = express.Router();
const cls = require('continuation-local-storage');
const UserModel = require("../models/users");
const checkLogin = require("../middlewares/check").checkLogin;

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('Hello World!');
	// res.render('test_post.ejs');
});

// GET /users/management 用户管理
// 获取用户列表（重制密码，删除用户）
router.get('/management', checkLogin, function (req, res, next) {
	UserModel.getAllusers()
		.then(function (result) {
			res.render("userManagement.ejs", {
				users: result
			});
		})
		.catch(next);
});

// GET /users/information?userId=XXX 用户详情页
router.get('/information', checkLogin, function (req, res, next) {
	let userId = req.query.userId;
	// return res.render("userInformation", { error: 'e.message' });

	UserModel.getUserById(userId)
		.then(function (result) {
			res.render("userInformation.ejs", {
				user: result
			});
		})
		.catch(next);
});

// POST /users/edit?userId=XXX 
router.post('/', checkLogin, function(req, res, next){
	let userId = req.query.userId;

	return res.render("signin", { username: name, error: e.message });
	if(userId){
		
	}
})

router.get('/:id', (req, res, next) => {
	const namespace = cls.getNamespace('com.blog');
	console.log('Debug: ' + namespace.get('tid'));
	// throw new Error("请填写密码！");
	res.send('id');
});

module.exports = router;