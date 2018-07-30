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

    Promise.all([
        // 获取分类信息
        CategoryModel.getPostListByCategory(authorId),
        // 删除分类
        CategoryModel.delCategoryByName(authorId, categoryName),
    ])
        .then(function (result) {
            let postList = null;
            result[0].categories.forEach(ele => {
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
            // 删除分类成功
            if (result[1]) {
                res.render('components/categories.ejs', {
                    categories: result[1].categories,
                });
            }
        })
        .catch(next)
});

module.exports = router;