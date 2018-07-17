const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

//User
exports.User = mongolass.model('User', {
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    avatar: { type: 'string', required: false },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
    bio: { type: 'string', required: true },
    mobile: { type: 'int', required: false },
    email: { type: 'string', required: false },
    isAdmin: { type: 'Boolean', default: false },
});
// 根据用户名找到用户，用户名全局唯一
exports.User.index({ name: 1 }, { unique: true }).exec();

//Post
exports.Post = mongolass.model('Post', {
    author: { type: Mongolass.Types.ObjectId, required: true },
    title: { type: 'string', required: true },
    content: { type: 'string', required: true },
    pv: { type: 'number', required: false },
    categoryId: { type: Mongolass.Types.ObjectId, required: false },
    tagId: { type: Mongolass.Types.ObjectId, required: false },
    isPublish: { type: 'Boolean', required: false }
});
// 按创建时间降序查看用户的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec();

//Comment
exports.Comment = mongolass.model('Comment', {
    author: { type: Mongolass.Types.ObjectId, required: true },
    content: { type: 'string', required: true },
    postId: { type: Mongolass.Types.ObjectId, required: true },
    replys: { type: Object }
});
// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ postId: 1, _id: 1 }).exec();

// category
exports.Category = mongolass.model('Category', {
    // author : { type : Mongolass.Types.ObjectId, required : true},
    name: { type: 'string', required: true },
});
exports.Category.index({ name: 1 }).exec();

// Tag
exports.Tag = mongolass.model('Tag', {
    name: { type: 'string', required: true },
});
exports.Tag.index({ name: 1 }).exec();

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        })
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});