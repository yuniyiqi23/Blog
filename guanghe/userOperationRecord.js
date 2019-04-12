const UserOperationRecordModel = require('../models/userOperationRecord');

module.exports = {
	/**
    * @Description: 创建一条记录
    * @Author: yep
    * @LastEditors: 
    * @LastEditTime: 
    * @since: 2019-04-06 09:45:53
    */
	createOperationRecord: function (record) {
		return UserOperationRecordModel.create(record);
	},

	/**
    * @Description: 查找记录数据(月活)
    * @Author: yep
    * @LastEditors: 
    * @LastEditTime: 
    * @since: 2019-04-06 09:45:53
    */
	getStatisticMAU: function (params) {
		// 兼容userId为空
		return UserOperationRecordModel.aggregate([
			{
				$match: {
					year: params.year // 匹配年份，如：2019
				}
			},
			{
				$group: {
					_id: { month: "$month" },
					users: { $addToSet: "$userId" },
					// count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }// 根据month排序
			}
		])
	},

	/**
    * @Description: 按月统计课程点击数 CAU(course active user)
    * @Author: yep
    * @LastEditors: 
    * @LastEditTime: 
    * @since: 2019-04-011 09:45:53
    */
	getStatisticCAU: function (params) {
		// operationRecord --> GET/courseware/info?courseId=5c87606733da1e5a87b162ef
		// 根据courseId查找用户学习课程数，时间参数：按月统计
		return UserOperationRecordModel.aggregate([
			{
				$match: {
					year: params.year, // 匹配年份，如：2019
					operationRecord: 'GET/courseware/info?courseId=' + params.courseId
				}
			},
			{
				$group: {
					_id: { month: "$month" },
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }// 根据month排序
			}
		])
	},


	/**
    * @Description: 按月统计该月前三课程 CFT(course of first three)
    * @Author: yep
    * @LastEditors: 
    * @LastEditTime: 
    * @since: 2019-04-011 10:45:53
    */
	getStatisticCFT: function (params) {
		// 根据 month、operationRecord 分类
		return UserOperationRecordModel.aggregate([
			{
				$match: {
					year: params.year, // 匹配年份，如：2019
					// 正则表达式匹配 GET/courseware/info?courseId=5c87606733da1e5a87b162ef
					operationRecord: { $regex: /^GET.*courseware.*info.*courseId/i }
				}
			},
			{
				$project: {
					
				}
			},
			{
				$group: {
					_id: { month: "$month" },
					count: { $sum: 1 }
				}
			},
			{
				$sort: { _id: 1 }// 根据month排序
			}
		])
	},

};
