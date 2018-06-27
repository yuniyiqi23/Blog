const config = require('config-lite')(__dirname);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(config.mongodb);

//User
// exports.User = mongoose.model('User', {
//     name: { type: String, required: true },
//     password: { type: String, required: true },
//     avatar: { type: String, required: false },
//     gender: { type: String, enum: ['m', 'f', 'x'], default: 'x' },
//     bio: { type: String, required: true },
//     mobile: { type: Number, required: false },
//     email: { type: String, required: false },
//     isAdmin: { type: Boolean, default: false },
// });
// 根据用户名找到用户，用户名全局唯一
// User.index({ name: 1 }, { unique: true });

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true },
    replys: { type: Array, default:[] }
});
// 通过文章 id 获取该文章下所有留言，按留言创建时间升
CommentSchema.index({ postId: 1, _id: 1 });

exports.Comment = CommentSchema;


