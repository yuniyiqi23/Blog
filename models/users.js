const User = require('../lib/mongoose').User;
const DataStateEnum = require('../middlewares/enum').DataStateEnum;

module.exports = {
	// 注册一个用户
	createUser: function (user) {
		return User.create(user);
	},

	// 更新一个用户
	updateUser: function (userId, data) {
		return User.findOneAndUpdate({ _id: userId }, { $set: data }, { upsert: true, new: true })
	},

	// 删除一个用户
	deleteUser: function (userId) {
		return User.findOneAndUpdate({ _id: userId }, { $set: { dataStatus: DataStateEnum.cancellation } }, { new: true })
	},

	// 恢复一个用户
	recoveUser: function (userId) {
		return User.findOneAndUpdate({ _id: userId }, { $set: { dataStatus: DataStateEnum.effective } }, { new: true })
	},

	// 通过用户名获取用户信息
	getUserByName: function (name) {
		return User
			.findOne({ name: name, dataStatus: DataStateEnum.effective });
	},

	// 通过 id 获取用户信息
	getUserById: function (id) {
		return User
			.findOne({ _id: id, dataStatus: DataStateEnum.effective });
	},

	// 获取全部用户
	getAllUsers: function () {
		return User.find({ dataStatus: DataStateEnum.effective });
	},

	// 获取删除用户列表
	getDeleteUsers: function () {
		return User.find({ dataStatus: DataStateEnum.cancellation });
	},

	// 激活用户
	activeUser: function (name, code, date) {
		return User
			.findOneAndUpdate({ name: name, code: code, date: { $gt: date } }, { dataStatus: DataStateEnum.effective });
	},

	//更新登录时间
	updateLoginTime: function (name, time) {
		return User
			.findOneAndUpdate({ name: name, dataStatus: DataStateEnum.effective }, { loginTime: time });
	}

};
