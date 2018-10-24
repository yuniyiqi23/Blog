
const assert = require('assert');

const sum = require('./add');

// describe('#hello.js', function () {
//
//     describe('#sun()', function () {
//         it('sum() should return 0', function () {
//             assert.strictEqual(sum(1, 2), 3);
//         });
//     })
// });

let user = {
	password : '123456'
};

sum.add(user);

console.log('user = ' + user.password);
// User.save = function (user) {
//
//     return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt, next){
//
//     });
// };