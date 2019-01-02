const User = require('../lib/mongoose').User;

module.exports = {
	// 注册一个用户
	createUser: function (user) {
		return User.create(user);
	},

	// 通过用户名获取用户信息
	getUserByName: function (name) {
		return User
			.findOne({ name: name, isLive: true });
	},

	// 激活用户
	activeUser: function (name, code, date) {
		return User
			.findOneAndUpdate({ name: name, code: code, date: {$gt: date}}, { isLive: true });
	},

	//更新登录时间
	updateLoginTime: function(name, time){
		return User
			.findOneAndUpdate({ name: name, isLive: true}, { loginTime: time });
	}

};
