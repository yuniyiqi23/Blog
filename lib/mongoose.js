const config = require('config-lite')(__dirname);
const mongoose = require("mongoose");
const plugins = require('./plugins');
const Schema = mongoose.Schema;

mongoose.connect(config.mongodb, function (error) {
    if (error) {
        console.log('数据库连接失败：' + error);
    }
});

// User
const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    gender: { type: String, enum: ['m', 'f', 'x'], default: 'x' },
    bio: { type: String, required: true },
    mobile: { type: Number, required: false },
    email: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
});
// 根据用户名找到用户，用户名全局唯一
UserSchema.index({ name: 1 }, { unique: true });
UserSchema.plugin(plugins.createdAt);

// Post
const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    pv: { type: Number, required: false },
    category: { type: String, required: false },
    tags: { type: Array, default: [] },
    state: { type: Number, required: true }
});
// 按创建时间降序查看用户的文章列表
PostSchema.index({ author: 1, _id: -1 });
PostSchema.plugin(plugins.createdAt);

// Comment
const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    replys: { type: Array, default: [] }
});
// 通过文章 id 获取该文章下所有留言，按留言创建时间升序排列
CommentSchema.index({ postId: 1, _id: 1 });
CommentSchema.plugin(plugins.createdAt);

// Category
const CategorySchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true},
    categories: { type: Array, default: [] }
});
CategorySchema.index({ author: 1 });

// Tag
const TagSchema = new Schema({
    name: { type: String, required: true },
});
TagSchema.index({ name: 1, _id: 1 });

const PostTagSchema = new Schema({
    name: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true}
}); 
PostTagSchema.index({name: 1});

const Comment = mongoose.model('Comment', CommentSchema);

// 添加中间件 通过文章 id 获取所有留言()
PostSchema.post('findOne', function (post) {
    if (post) {
        return Comment.find({ postId: post._id })
            .then(function (results) {
                if (results) {
                    let commentsCount = results.length;
                    results.forEach(element => {
                        commentsCount = commentsCount + element.replys.length;
                    });
                    post.commentsCount = commentsCount;
                    return post;
                }
            });
    } 
});
// 给 post 添加留言数 commentsCount
PostSchema.post('find', function (posts) {
    return Promise.all(posts.map(function (post) {
        return Comment.find({ postId: post._id })
            .then(function (results) {
                if (results) {
                    let commentsCount = results.length;
                    results.forEach(element => {
                        commentsCount = commentsCount + element.replys.length;
                    });
                    post.commentsCount = commentsCount;
                    return post;
                }
            })
    }))
});

module.exports = {
    Comment: Comment,
    User: mongoose.model('User', UserSchema),
    Post: mongoose.model('Post', PostSchema),
    Category: mongoose.model('Category', CategorySchema),
    Tag: mongoose.model('Tag', TagSchema),
    PostTag: mongoose.model('PostTag', PostTagSchema),
}


