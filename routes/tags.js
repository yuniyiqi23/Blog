var express = require('express');
var router = express.Router();
const TagModel = require('../models/tags');

/* GET users listing. */
router.get('/', function (req, res, next) {
    let tag = req.query.tag;
    if (tag) {
        TagModel.getTagsBySearch(tag)
            .then(function (result) {
                // console.log('getTagsBySearch : ' + result);
                res.send(result);
            })
    }
});

module.exports = router;
