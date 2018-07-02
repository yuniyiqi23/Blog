const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const CommentModel = require('../models/comments');
// const Counter = require('../lib/mongo').Counter;
// const Mongolass = require('mongolass');
const ObjectId = require('mongoose').Types.ObjectId;

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
    const author = req.session.user._id;
    const postId = req.body.postId;
    const content = req.body.content;

    // 校验参数
    try {
        if (!content.length) {
            throw new Error('请填写留言内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    const comment = {
        postId: postId,
        author: author,
        content: content,
    };

    CommentModel.create(comment)
        .then(function () {
            req.flash('success', '留言成功');
            // 留言成功后跳转到上一页
            res.redirect('back');
        })
        .catch(next);

});

// POST /comments/addReply 回复留言
router.post('/addReply', checkLogin, function (req, res, next) {
    const commentId = req.body.commentId;
    const content = req.body.content;
    const author = req.session.user;
    let nowDate = new Date();
    let time = nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString();

    const replyComment = {
        replyId: new ObjectId(),
        author: author,
        content: content,
        time: time,
    };

    CommentModel.getCommentById(commentId)
        .then(function (comment) {
            if (!comment) {
                throw new Error('留言不存在');
            }
            CommentModel.addReplyComment(commentId, replyComment)
                .then(function () {
                    req.flash('success', '留言成功');
                    // 留言成功后跳转到上一页
                    res.redirect('back');
                })
                .catch(next)
        })
});

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
    const commentId = req.params.commentId;
    const author = req.session.user._id;

    CommentModel.getCommentById(commentId)
        .then(function (comment) {
            if (!comment) {
                throw new Error('留言不存在');
            }
            if (comment.author.toString() !== author.toString()) {
                throw new Error('没有权限删除留言');
            }
            CommentModel.delCommentById(commentId)
                .then(function (value) {
                    if (value.ok && value.n > 0) {
                        req.flash('success', '删除留言成功')
                        // 删除成功后跳转到上一页
                        res.redirect('back')
                    }else{
                        req.flash('fail', '删除留言失败')
                    }
                })
                .catch(next);
        })
});

//GET /comments/reply/:replyId/remove 删除一条回复
router.get('/:commentId/removeReply/:replyId', checkLogin, function (req, res, next) {
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;
    const author = req.session.user._id;

    CommentModel.getCommentById(commentId)
        .then(function (comment) {
            if (!comment) {
                throw new Error('留言不存在');
            }
            CommentModel.delReplyById(commentId, replyId)
                .then(function (result) {
                    // console.log(result);
                    if (value.ok && value.n > 0 && value.nModified > 0) {
                        req.flash('success', '删除回复成功')
                        // 删除成功后跳转到上一页
                        res.redirect('back')
                    }else{
                        req.flash('fail', '删除留言失败')
                    }
                })
                .catch(next);
        })
});

module.exports = router