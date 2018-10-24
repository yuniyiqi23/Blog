const Post = require('../lib/mongoose').Post;
const CommentModel = require('./comments');

const DataState = require('../middlewares/enum').DataState;

module.exports = {
	// 创建一篇文章
	create: function (post) {
		return Post.create(post);
	},

	// 通过文章 id 获取一篇文章
	getPostById: function (postId) {
		return Post
			.findOne({ _id: postId })
			.populate({ path: 'author', model: 'User' });
	},

	// 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
	getPosts: function (author = null) {
		let query = {};
		if (author) {
			query.author = author;
		}
		query.state = DataState.Publish;
		return Post
			.find(query)
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: -1 });
	},

	//获取所有文章数量
	getPostsCount: function ({ author = null, keyword = null }) {
		let query = {};
		if (author) {
			query.author = author;
		}
		if (keyword) {
			query = {
				$or: [
					{ title: { $regex: keyword, $options: '$i' } }, //  $options: '$i' 忽略大小写
					{ content: { $regex: keyword, $options: '$i' } },
					{ tags: { $regex: keyword, $options: '$i' } }
				],
			};
		}
		query.state = DataState.Publish;
		return Post
			.find(query)
			.populate({ path: 'author', model: 'User' })
			.count()
			.exec();
	},

	//分页获取文章
	getPagingPosts: function ({ author = null, page = 1, pageSize = 5, keyword = null }) {
		let query = {};
		if (author) {
			query.author = author;
		}
		if (keyword) {
			query = {
				//全文索引
				$text: { $search: keyword }
				// $or: [
				//     { title: { $regex: keyword, $options: '$i' } }, //  $options: '$i' 忽略大小写
				//     { content: { $regex: keyword, $options: '$i' } },
				//     { tags: { $regex: keyword, $options: '$i' } }
				// ],
			};
		}
		// 设置文章状态 Publish
		query.state = DataState.Publish;
		// 分页 
		let skipNum = (page - 1) * pageSize;

		return Post
			.find(query)
			.skip(skipNum)
			.limit(pageSize)
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: -1 });
	},

	// 通过文章 id 给 pv 加 1
	incPv: function (postId) {
		return Post
			.update({ _id: postId }, { $inc: { pv: 1 } })
			.exec();
	},

	// 通过文章 id 获取一篇原生文章（编辑文章）
	getRawPostById: function (postId) {
		return Post
			.findOne({ _id: postId, state: DataState.Publish })
			.populate({ path: 'author', model: 'User' })
			.exec();
	},

	// 通过文章 id 更新一篇文章
	updatePostById: function (postId, data) {
		return Post
			.update({ _id: postId }, { $set: data })
			.exec();
	},

	// 通过文章 id 删除一篇文章
	delPostById: function (postId) {
		return Post
			.updateOne({ _id: postId }, { state: DataState.Delete })
			.then(function (res) {
				// 文章删除后，再删除该文章下的所有留言
				if (res.ok && res.n > 0 && res.nModified == 1) {
					return CommentModel.delCommentsByPostId(postId);
				}
			});
	},

	// 通过文章 ids 删除多篇文章
	delPostsByIdList: function (postIdList) {
		let query = postIdList.map(ele => {
			return { _id: ele.postId };
		});
		// console.log(query);
		return Post
			.updateMany({ $or: query }, { state: DataState.Delete })
			.then(function (res) {
				// 文章删除后，再删除该文章下的所有留言
				if (res.ok && res.n > 0 && res.nModified == 1) {
					return CommentModel.delCommentsByPostIdList(postIdList);
				}
			});
	},

};