const marked = require('marked');
const Comment = require('../lib/mongoose').Comment;
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    // 创建一个留言
    create: function (comment) {
        // 注册一个用户
        return new Promise(function (res) {
            Comment.create(comment, function (err, result) {
                if (err) return handleError(err);
                // console.log(result);
                res(result);
            })
        });
    },

    // 通过留言 id 添加回复
    addReplyComment: function (commentId, data) {
        // find by document id and update and push item in array
        return Comment
            .update(
                { _id: commentId },
                {
                    $push: { replys: data    }
                })
            .exec();
    },

    // 通过回复 id 删除一个回复
    delReplyById: function (commentId, replyId) {
        return Comment
            .update({ _id: commentId }, { $pull: { replys: { replyId: ObjectId(replyId) } } })
    },

    // 通过留言 id 获取一个留言
    getCommentById: function (commentId) {
        return Comment.findOne({ _id: commentId }).exec();
    },

    // 通过留言 id 删除一个留言
    delCommentById: function (commentId) {
        return Comment.deleteOne({ _id: commentId });
    },

    // 通过文章 id 删除该文章下所有留言
    delCommentsByPostId: function (postId) {
        return Comment.deleteMany({ postId: postId });
    },

    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments: function (postId) {
        return Comment
            .find({ postId: postId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: 1 })
            // .contentToHtml()
            .exec();
    },

    // 通过文章 id 获取该文章下留言数
    getCommentsCount: function getCommentsCount(postId) {
        return Comment.count({ postId: postId }).exec()
    },

};