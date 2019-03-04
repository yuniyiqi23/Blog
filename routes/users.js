const express = require('express');
const router = express.Router();
const cls = require('continuation-local-storage');
const UserModel = require("../models/users");
const checkLogin = require("../middlewares/check").checkLogin;
const Joi = require('joi');
// const DataStateEnum = require('../middlewares/enum').DataStateEnum;

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
			return res.render("userManagement.ejs", {
				users: result
			});
		})
		.catch(next);
});

// GET /users/information?userId=XXX 用户详情页
router.get('/information', checkLogin, function (req, res, next) {
	let userId = req.query.userId;

	UserModel.getUserById(userId)
		.then(function (result) {
			if (result) {
				return res.render("userInformation.ejs", {
					user: result
				});
			}
			// 优化查询不到的用户提示信息
			return res.render("userInformation", { user: null, error: '查询的用户不存在！' });
		})
		.catch(next);
});

// GET /users/delete?userId=XXX 删除用户
router.get('/delete', checkLogin, function (req, res, next) {
	let userId = req.query.userId;

	deleteUser(userId)
		.then(function (result) {
			if(result.delResult){
				if(result.delResult.dataStatus === '2'){
					return res.render("userManagement.ejs", {
						success: '删除成功!',
						users: result.users
					});
				}else{
					return res.render("userManagement.ejs", {
						success: '删除失败!',
						users: result.users
					});
				}
			}
			
		})
		.catch(next)

});

async function deleteUser(userId) {
	try {
		const delResult = await UserModel.deleteUser(userId);
		const users = await UserModel.getAllusers();
		return { delResult, users };
	} catch (e) {
		console.error(err);
	}
}

// POST /users/update?userId=XXX 
router.post('/update', checkLogin, function (req, res, next) {
	const userId = req.body.userId;
	const userInfo = {
		gender: req.body.gender,
		bio: req.body.bio,
		email: req.body.email,
	};
	const schema = Joi.object().keys({
		email: Joi.string().email({ minDomainAtoms: 2 }),
		bio: Joi.string().min(10).max(100),
		gender: Joi.string(),
	});

	// 校验参数
	const result = Joi.validate(userInfo, schema);
	if (result.error !== null) {
		// 更新失败
		req.flash('error', result.error.message);
		return res.redirect('back');
	}

	UserModel.updateUser(userId, userInfo)
		.then(function (result) {
			res.render("userInformation.ejs", { user: result, success: '更新成功！' });
		})
		.catch(next);

})

router.get('/:id', (req, res, next) => {
	const namespace = cls.getNamespace('com.blog');
	console.log('Debug: ' + namespace.get('tid'));
	// throw new Error("请填写密码！");
	res.send('id');
});

module.exports = router;