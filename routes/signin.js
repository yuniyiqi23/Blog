const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, function (req, res, next) {
    res.send('Login Page');
});

router.post('/', checkNotLogin, function (req, res, next) {
    res.send('Login');
});

module.exports = router;


