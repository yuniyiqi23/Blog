const express = require('express');
const router = express.Router();
const PostModel = require('../models/posts');

// GET /search 搜索相关文章
router.get('/', function (req, res, next) {
    let keyword = req.query.keyword;
    let page = req.query.page || 1;

    Promise.all([
        PostModel.getPostsCount({ keyword: keyword }),
        PostModel.getPagingPosts({ page: page, keyword: keyword }),
    ])
        .then(function (result) {
            if (result[1].length >= 0) {
                if (req.query.page) {
                    res.render('components/posts-content', {
                        postsCount: result[0],
                        posts: result[1],
                        categories: null
                    })
                } else {
                    res.render('search', {
                        keywords: keyword,
                        postsCount: result[0],
                        posts: result[1],
                        categories: null
                    })
                }
            }
        })
        .catch(next);

})

module.exports = router;
