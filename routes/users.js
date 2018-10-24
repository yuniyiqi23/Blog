const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('respond with a resource');
	// res.render('test_post.ejs');
});

module.exports = router;
