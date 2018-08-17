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
            res.render('components/categories.ejs', {
                categories: result.categories,
            });
        })
        .catch(next);
});

// POST categories/delCategory 
router.post('/delCategory', checkLogin, function (req, res, next) {
    const authorId = req.session.user._id;
    const categoryName = req.body.category;
    // 
    const delCategoryProcess = async function (authorId, categoryName) {
        try {
            // 获取 postList
            const postList = await getPostList(authorId, categoryName);
            // 删除 posts
            await delPosts(postList);
            // 删除 category
            await delCategory(authorId, categoryName);
            res.redirect('back');
        } catch (error) {
            console.log(error);
        }
    }

    delCategoryProcess(authorId, categoryName);
});

function getPostList(authorId, categoryName) {
    return CategoryModel.getPostListByCategory(authorId)
        .then(function (result) {
            let postList = null;
            result.categories.forEach(ele => {
                if (ele.category === categoryName) {
                    postList = ele.postList;
                }
            });
            return postList;
        })
}

function delPosts(postList) {
    if (postList) {
        if (postList.length > 0) {
            // 通过博文 IdList 删除博文
            return PostModel.delPostsByIdList(postList);
        }
    }
}

function delCategory(authorId, categoryName) {
    return CategoryModel.delCategoryByName(authorId, categoryName);
}

module.exports = router;