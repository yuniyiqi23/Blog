const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin
const CategoryModel = require('../models/categories');

// POST categories/addCategory 
router.post('/addCategory', checkLogin, function (req, res, next) {
    const authorId = req.session.user._id;
    const category = req.body.category;

    return CategoryModel.getCategoryByAuthorId(authorId)
        .then(function (result) {
            if (result.length > 0) {
                CategoryModel.addCategoryByAuthorId(authorId, category)
                    .then(function (result) {
                        if (result.ok && result.n > 0) {
                            CategoryModel.getCategoryByAuthorId(authorId)
                                .then(function (result) {
                                    res.render('components/categories.ejs', {
                                        categories: result[0].categories,
                                    });
                                })
                        }
                        // console.log(result);
                        // res.render('components/categories.ejs', {
                        //     categories: result[0].categories,
                        // });
                    })
                // let category = '新建文档';
                // CategoryModel.addCategoryByAuthorId(authorId, category)
                //     .then(function (res) {
                //         console.log(res);
                //     })
                //     .catch(next);
            } else {
                let category = {
                    author: authorId,
                    categories: '新建文档1',
                }
                CategoryModel.create(category)
                    .then(function (res) {
                        console.log(res);
                    })
                    .catch(next);
                console.log(result);
            }
        })
        .catch(next);
});

module.exports = router;