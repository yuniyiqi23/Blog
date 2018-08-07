const Tag = require('../lib/mongoose').Tag;
// const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    create: function (tag) {
        return Tag.create(tag);
    },

    // 通过名称获取 Tag
    getTagByName: function (name) {
        return Tag.findOne({ name: name })
    },

}