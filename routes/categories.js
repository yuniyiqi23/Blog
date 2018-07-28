const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin
const CategoryModel = require('../models/categories');

// POST categories/addCategory 
router.post('/addCategory', checkLogin, function (req, res, next) {
    const authorId = req.session.user._id;
    const category = {
        category: req.body.category,
        postList: []
    };

    return CategoryModel.addCategoryByAuthorId(authorId, category)
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

    return CategoryModel.getPostListByCategory(authorId, categoryName)
        .then(function (result) {
            if (result) {
                let postList = result.categories.postList;
                if (postList.length > 0) {
                    postList.forEach(element => {
                        console.log(element);

                    });
                }
            }
        })
        .catch(next);

    // return CategoryModel.delCategoryByName(authorId, categoryName)
    //     .then(function (result) {
    //         // console.log(result);
    //         if (result) {
    //             // 分类删除后，再删除该分类下的所有文章
    //             // if (result.ok && result.n > 0) {
    //             //     PostModel.delPostById(postId).catch(next);
    //             res.render('components/categories.ejs', {
    //                 categories: result.categories,
    //             });
    //             // }
    //         }
    //     })
    //     .catch(next);
});

module.exports = router;