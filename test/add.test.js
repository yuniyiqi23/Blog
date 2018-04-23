
const assert = require('assert');

const sum = require('./add');

describe('#hello.js', function () {

    describe('#sun()', function () {
        it('sum() should return 0', function () {
            assert.strictEqual(sum(1, 2), 3);
        });
    })
});
