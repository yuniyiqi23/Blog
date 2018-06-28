const User = require('../lib/mongoose').User;

module.exports = {
    create: function (user) {
        // 注册一个用户
        return new Promise(function(resolver){
            User.create(user, function (err, result) {
                if (err) return handleError(err);
                // console.log(result);
                resolver(result);
            })
        });
    },

    // 通过用户名获取用户信息
    getUserByName: function (name) {
        return User
            .findOne({ name: name })
            // .addCreatedAt()
            .exec()
    },

}
