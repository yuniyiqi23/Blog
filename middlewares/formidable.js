const formidable = require('formidable');

module.exports = {
	getAvatar : function getAvatar(req, res, next) {
		const form = new formidable.IncomingForm();
		form.uploadDir = '/tmp';   //文件保存在系统临时目录
		form.maxFieldsSize = 1 * 1024 * 1024;  //上传文件大小限制为最大1M
		form.keepExtensions = true;        //使用文件的原扩展名


		next();
	},


};