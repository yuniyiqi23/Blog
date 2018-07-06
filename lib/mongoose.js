const config = require('config-lite')(__dirname);
const mongoose = require("mongoose");
const plugins = require('./plugins');
const Schema = mongoose.Schema;

mongoose.connect(config.mongodb, function (error) {
    if(error){
        console.log('数据库连接失败：' + error);
    }
});

//User
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

//Post
const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    pv: { type: Number, required: false },
    categoryId: { type: Schema.Types.ObjectId, required: false },
    tagId: { type: Schema.Types.ObjectId, required: false },
    isPublish: { type: Boolean, required: false }
});
// 按创建时间降序查看用户的文章列表
PostSchema.index({ author: 1, _id: -1 });
PostSchema.plugin(plugins.createdAt);

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    replys: { type: Array, default: [] }
});
// 通过文章 id 获取该文章下所有留言，按留言创建时间升
CommentSchema.index({ postId: 1, _id: 1 });
CommentSchema.plugin(plugins.createdAt);

exports.User = mongoose.model('User', UserSchema);
exports.Post = mongoose.model('Post', PostSchema);
exports.Comment = mongoose.model('Comment', CommentSchema);
