const express = require('express');
const router = express.Router();
const TagModel = require('../models/tags');

router.get('/', function (req, res) {
	let tag = req.query.tag;
	if (tag) {
		TagModel.getTagsBySearch(tag)
			.then(function (result) {
				// console.log('getTagsBySearch : ' + result);
				res.send(result);
			});
	}
});

module.exports = router;
