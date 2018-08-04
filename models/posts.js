const marked = require('marked');
const Post = require('../lib/mongoose').Post;
const PostSchema = require('../lib/mongoose').PostSchema;
const CommentModel = require('./comments');
const ObjectId = require('mongodb').ObjectID;
const DataState = require('../middlewares/enum').DataState;

module.exports = {
    // 创建一篇文章
    create: function (post) {
        return new Promise(function (resolve) {
            Post.create(post, function (err, result) {
                if (err) return handleError(err);
                resolve(result);
            })
        });
    },

    // 通过文章 id 获取一篇文章
    getPostById: function (postId) {
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function (author) {
        let query = {}
        if (author) {
            query.author = author
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
    },

    //获取所有文章数量
    getPostsCount: function (author) {
        let query = {}
        if (author) {
            query.author = author
        }else{
            query.state = DataState.Publish
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .count()
            .exec();
    },

    //分页获取文章
    getPagingPosts: function ({ author, page = 1, pageSize = 5 }) {
        let query = {}
        if (author) {
            query.author = author
        }else{
            query.state = DataState.Publish
        }
        let skipNum = (page - 1) * pageSize;

        return Post
            .find(query)
            .skip(skipNum)
            .limit(pageSize)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
    },

    // 通过文章 id 给 pv 加 1
    incPv: function (postId) {
        return Post
            .update({ _id: postId }, { $inc: { pv: 1 } })
            .exec()
    },

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawPostById: function (postId) {
        return Post
            .findOne({ _id: postId, state: DataState.Publish})
            .populate({ path: 'author', model: 'User' })
            .exec()
    },

    // 通过文章 id 更新一篇文章
    updatePostById: function (postId, data) {
        return Post
            .update({ _id: postId }, { $set: data })
            .exec()
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delPostById: function (postId) {
        return Post
            .updateOne({ _id: postId }, {state: DataState.Delete})
            .then(function (res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.ok && res.n > 0 && res.nModified == 1) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            })
    },

}