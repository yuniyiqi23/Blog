const express = require('express');
const router = express.Router();
const cls = require('continuation-local-storage');
const UserModel = require("../models/users");
const checkLogin = require("../middlewares/check").checkLogin;
const Joi = require('joi');
const DataStateEnum = require('../middlewares/enum').DataStateEnum;
const mail = require('../utils/nodeMailerWithTemp');
const moment = require('moment');

/* GET users listing. */
router.get('/', function (req, res, next) {
	UserModel.getAllUsers()
		.then(function (result) {
            if(result){
                res.send(result)
            }
		})
		.catch(next);
});

// GET /users/management 用户管理
// 获取用户列表（重制密码，删除用户）
router.get('/management', checkLogin, function (req, res, next) {
	UserModel.getAllUsers()
		.then(function (result) {
			return res.render("userManagement.ejs", {
				users: result
			});
		})
		.catch(next);
});


// GET /users/deleteUserList
router.get('/deleteUserList', function (req, res, next) {
	UserModel.getDeleteUsers()
		.then(function (result) {
			return res.render("userDeletedList.ejs", {
				users: result
			});
		})
		.catch(next);
})

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
			if (result.delResult) {
				if (result.delResult.dataStatus == DataStateEnum.cancellation) {
					return res.render("userManagement.ejs", {
						success: '删除成功!',
						users: result.users
					});
				} else {
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
		const users = await UserModel.getAllUsers();
		return { delResult, users };
	} catch (e) {
		console.error(err);
	}
}

// GET /users/recover?userId=XXX 恢复用户
router.get('/recover', checkLogin, function (req, res, next) {
	const userId = req.query.userId;

	recoverUser(userId)
		.then(function (result) {
			if (result.recResult) {
				if (result.recResult.dataStatus == DataStateEnum.effective) {
					return res.render("userDeletedList.ejs", {
						success: '恢复成功!',
						users: result.users
					});
				} else {
					return res.render("userDeletedList.ejs", {
						success: '恢复失败!',
						users: result.users
					});
				}
			}

		})
		.catch(next)
});

async function recoverUser(userId) {
	try {
		const recResult = await UserModel.recoveUser(userId);
		const users = await UserModel.getDeleteUsers();
		return { recResult, users };
	} catch (e) {
		console.error(err);
	}
}

// GET /users/sendEmailToResetPassword?userId=XXX 发邮件重置用户密码
router.get('/sendEmailToResetPassword', function (req, res, next) {
	const userId = req.query.userId;
	const resetPasswordURL = 'http://' + req.headers.host + '/users/resetPassword?userId=' + userId;
	const limitTime = {
		date: moment().add({ days: 1 })
	};

	UserModel.updateUser(userId, limitTime)
		.then(function (result) {
			if (!result.email) {
				req.flash('fail', '邮箱不存在！');
			}
			mail.resetPassword(result, resetPasswordURL);
			req.flash('success', '邮件已发送！请到' + result.email +  '中查收邮件，重置密码！');
			res.redirect('back');
		})
		.catch(next)

});

// GET /users/resetPassword?userId=XXX 重置用户密码
router.get('/resetPassword', function (req, res, next) {
	const value = {
		userId: req.query.userId,
		resetPasswordURL: 'http://' + req.headers.host + '/signup/resetPassword'
	}
	res.render("userResetPassword.ejs", { value: value });
});

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

});

router.get('/:id', (req, res, next) => {
	const namespace = cls.getNamespace('com.blog');
	console.log('Debug: ' + namespace.get('tid'));
	// throw new Error("请填写密码！");
	res.send('访问的URL未被捕捉到！');
});

module.exports = router;