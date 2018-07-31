const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin
const CategoryModel = require('../models/categories');
const PostModel = require('../models/posts');

// POST categories/addCategory 
router.post('/addCategory', checkLogin, function (req, res, next) {
    const authorId = req.session.user._id;
    const category = {
        category: req.body.category,
        postList: []
    };

    CategoryModel.addCategoryByAuthorId(authorId, category)
        .then(function (result) {
            // console.log(result);
            if (result) {
                res.render('components/categories.ejs', {
                    categories: result.categories,
                });
            } else {
                let value = {
                    author: authorId,
                    categories: [category],
                }
                CategoryModel.create(value)
                    .then(function (result) {
                        res.render('components/categories.ejs', {
                            categories: result.categories,
                        });
                    })
                    .catch(next);
            }
        })
        .catch(next);
});

// POST categories/delCategory 
router.post('/delCategory', checkLogin, function (req, res, next) {
    const authorId = req.session.user._id;
    const categoryName = req.body.category;

    CategoryModel.getPostListByCategory(authorId)
        .then(function (result) {
            let postList = null;
            result.categories.forEach(ele => {
                if (ele.category === categoryName) {
                    postList = ele.postList;
                }
            });
            if (postList.length > 0) {
                postList.forEach(element => {
                    // 通过博文 Id 删除博文
                    PostModel.delPostById(element.postId).catch(next);
                });
            }
        })
        .then(function () {
            // 删除分类
            return CategoryModel.delCategoryByName(authorId, categoryName);
        })
        .then(function (result) {
            // 删除分类成功
            if (result) {
                res.redirect('/posts?author=' + authorId);
                // res.render('components/categories.ejs', {
                //     categories: result.categories,
                // });
            }
        })
        .catch(next);

});



module.exports = router;