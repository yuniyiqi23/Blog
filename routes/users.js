const express = require('express');
const router = express.Router();
const cls = require('continuation-local-storage');

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('respond with a resource');
	// res.render('test_post.ejs');
});

router.get('/:id', (req, res, next) => {
	// const namespace = cls.getNamespace('com.blog');
	// console.log('Debug: ' + namespace.get('tid'));
	res.send('id');
})

module.exports = router;