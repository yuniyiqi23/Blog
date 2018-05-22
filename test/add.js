// add.js
const bcrypt = require('bcryptjs');

module.exports.add = function (user) {

    return bcrypt.genSalt(10, function(err, salt, next){
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            console.log('salt = ' + salt);
            if (err) {
                console.log(err);
            }
            user.password = hash;
            console.log('user.password = ' + user.password);

            return user;
        })
    })

};

