var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('pages/download_form', {title: 'Download'});
    res.send('/pages/download_form')
});

// router.post("/download", function (req, res) {
//     res.render("pages/download_success", {filepath: req.body.filepath});
// });

module.exports = router;