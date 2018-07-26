const Category = require('../lib/mongoose').Category;
const PostModel = require('./posts');

module.exports = {
    // 创建一个博文分类
    create: function (category) {
        return new Promise(function (resolver) {
            Category.create(category, function (err, result) {
                if (err) return new Error(err);
                // console.log(result);
                resolver(result);
            })
        });
    },

    // 通过用户获取分类列表
    getCategoryByAuthorId: function (authorId) {
        return Category
            .findOne({ author: authorId })
        // .exec();
    },

    // 添加分类
    addCategoryByAuthorId: function (authorId, categoryName) {
        return Category
            .findOneAndUpdate(
                { author: authorId },
                { $addToSet: { categories: categoryName }},
                { new: true })
    },

    // 通过名称删除分类
    delCategoryByName: function (authorId, categoryName) {
        return Category
            .findOneAndUpdate(
                { author: authorId },
                { $pull: { categories: categoryName }},
                { new: true })
    },

}
