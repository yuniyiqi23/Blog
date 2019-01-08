const express = require('express');
const router = express.Router();
const cls = require('continuation-local-storage');

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('Hello World!');
	// res.render('test_post.ejs');
});

router.get('/:id', (req, res, next) => {
	const namespace = cls.getNamespace('com.blog');
	console.log('Debug: ' + namespace.get('tid'));
	// throw new Error("请填写密码！");
	res.send('id');
})

module.exports = router;