const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin
const CategoryModel = require('../models/categories');

// POST categories/addCategory 
router.post('/addCategory', checkLogin, function (req, res, next) {
    const authorId = req.session.user._id;
    const categoryName = req.body.category;

    return CategoryModel.addCategoryByAuthorId(authorId, categoryName)
        .then(function (result) {
            // console.log(result);
            if (result) {
                res.render('components/categories.ejs', {
                    categories: result.categories,
                });
            } else {
                let category = {
                    author: authorId,
                    categories: categoryName,
                }
                CategoryModel.create(category)
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

    return CategoryModel.delCategoryByName(authorId, categoryName)
        .then(function (result) {
            // console.log(result);
            if (result) {
                res.render('components/categories.ejs', {
                    categories: result.categories,
                });
            } 
        })
        .catch(next);
});

module.exports = router;