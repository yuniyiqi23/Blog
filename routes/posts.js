const express = require('express');
const router = express.Router();
const moment = require('moment');
const checkLogin = require('../middlewares/check').checkLogin;
const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');
const CategoryModel = require('../models/categories');

// GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
    let author = req.query.author;
    let page = req.query.page || 1;

    Promise.all([PostModel.getPostsCount(author), PostModel.getPagingPosts({ author: author, page: page })])
        .then(function (result) {
            if (result[1].length >= 0) {
                if (req.query.page) {
                    res.render('components/posts-content', {
                        postsCount: result[0],
                        posts: result[1],
                    })
                } else {
                    res.render('posts', {
                        postsCount: result[0],
                        posts: result[1],
                    })
                }
            }
        })
        .catch(next);
});

// eg: GET /posts?author=xxx
router.get('/author/:authorId', function (req, res, next) {
    if (req.session.user) {//检查用户是否已经登录
        console.log(req.session);//打印session的值
    }

    const author = req.query.author;

    PostModel.getPosts(author)
        .then(function (posts) {
            res.render('posts', {
                posts: posts
            })
        })
        .catch(next)
});

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
    const author = req.session.user._id;
    const title = req.body.title;
    const content = req.body.content;
    const categoryName = req.body.categoryName;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    let post = {
        author: author,
        title: title,
        content: content,
        category: categoryName
    }

    PostModel.create(post)
        .then(function (result) {
            if (result) {
                CategoryModel.addPostByCategory(author, categoryName, result._id)
                    .then(function (res) {
                        req.flash('success', '发表成功');
                        // 发表成功后跳转到该文章页
                        res.redirect('/posts/' + result._id);
                    })
                    .catch(next);
            }
        })
        .catch(next);
})

// GET /posts/create 发表文章
router.get('/create', checkLogin, function (req, res, next) {
    let authorId = req.session.user._id;
    CategoryModel.getCategoryByAuthorId(authorId)
        .then(function (result) {
            if (result) {
                res.render('create.ejs', {
                    categories: result.categories,
                });
            } else {
                res.render('create.ejs', {
                    categories: null,
                });
            }
        })
        .catch(next);
});

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
    const postId = req.params.postId;

    Promise.all([
        // 获取文章信息
        PostModel.getPostById(postId),
        // 获取该文章所有留言
        CommentModel.getComments(postId),
        // pv 加 1
        PostModel.incPv(postId),
    ])
        .then(function (result) {
            const post = result[0];
            const comments = result[1];
            if (!post) {
                throw new Error('该文章不存在')
            }

            res.render('post', {
                post: post,
                comments: comments,
            })
        })
        .catch(next)
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error('该文章不存在！');
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足！');
            }
            res.render('edit.ejs', {
                post: post,
            });

        })
        .catch(next);
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;
    const title = req.body.title;
    const content = req.body.content;

    //校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题!');
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    PostModel.getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }

            PostModel.updatePostById(postId, { title: title, content: content, updatedAt: moment().format('YYYY-MM-DD HH:mm') })
                .then(function () {
                    req.flash('success', '编辑文章成功')
                    // 编辑成功后跳转到上一页
                    res.redirect('/posts/' + postId)
                })

                .catch(next)
        });
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function (post) {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }

            PostModel.delPostById(postId)
                .then(function (value) {
                    req.flash('success', '删除文章成功');
                    // 删除成功后跳转到主页
                    res.redirect('/posts');
                })

        })
        .catch(next)
})

module.exports = router;
