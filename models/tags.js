const Tag = require('../lib/mongoose').Tag;
const PostTag = require('../lib/mongoose').PostTag;
// const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    create: function (tag) {
        return Tag.create(tag);
    },

    createPostTagRel: function(postTagRel){
        return PostTag.create(postTagRel);
    },

    // 通过名称获取 Tag
    getTagByName: function (name) {
        return Tag
            .findOne({ name: name })
    },

}