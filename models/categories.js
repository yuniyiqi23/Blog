const Category = require('../lib/mongoose').Category;
const PostModel = require('./posts');

module.exports = {
    // 创建一个博文分类
    create: function (category) {
        return new Promise(function(resolver){
            Category.create(category, function (err, result) {
                if (err) return handleError(err);
                // console.log(result);
                resolver(result);
            })
        });
    },

    // 通过名称删除分类
    delCategoryByName: function (name) {
        return Category
            .deleteOne({ name: name })
            .then(function (res) {
                // 分类删除后，再删除该分类下的所有文章
                if (res.ok && res.n > 0) {
                    return PostModel.delPostById(postId);
                }
            })
    },

}
