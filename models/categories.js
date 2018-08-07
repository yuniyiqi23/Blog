const Category = require('../lib/mongoose').Category;
const PostModel = require('./posts');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    // 创建一个博文分类
    create: function (category) {
        return new Promise(function (resolver) {
            Category.create(category, function (err, result) {
                if (err) return new Error(err);
                resolver(result);
            })
        });
    },

    // 通过用户获取分类列表
    getCategoryByAuthorId: function (authorId) {
        return Category
            .findOne({ author: authorId })
    },

    // 通过 authorId 获取 Category
    getPostListByCategory: function (authorId) {
        return Category
            .findOne({ author: authorId })
    },

    // 添加分类
    addCategoryByAuthorId: function (authorId, category) {
        return Category
            .findOneAndUpdate(
                { author: authorId },
                { $addToSet: { categories: category } },
                { new: true })
    },

    // 通过名称删除分类
    delCategoryByName: function (authorId, categoryName) {
        return Category
            .findOneAndUpdate(
                { author: authorId },
                { $pull: { categories: { category: categoryName } } },
                { new: true })
    },

    // 通过 category 添加 post
    addPostByCategory: function (authorId, category, postId) {
        return Category
            .findOneAndUpdate(
                { author: authorId, 'categories.category': category },
                { $push: { 'categories.$.postList': { postId: postId } } })
    },

    // 通过 category 删除 post
    delPostByCategory: function (authorId, category, postId) {
        return Category
            .findOneAndUpdate(
                { author: authorId, 'categories.category': category },
                { $pull: { 'categories.$.postList': { postId: ObjectId(postId) } } })
    },
}
