const fs = require('fs');
const path = require('path');
// const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const moment = require('moment');

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const UserModel = require('../models/users');
// 定义加密密码计算强度
var SALT_WORK_FACTOR = 17;

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signup.ejs')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/images');  //文件保存在系统临时目录
    form.maxFieldsSize = 1 * 1024 * 1024;  //上传文件大小限制为最大1M
    form.keepExtensions = true;        //使用文件的原扩展名

    form.parse(req, function (err, fields, files) {
        const userInfo = {
            username: fields.name,
            gender: fields.gender,
            bio: fields.bio,
            email: fields.email,
            avatar: files.avatar.path.split(path.sep).pop(),
            password: fields.password,
            repassword: fields.repassword,
        };

        const schema = Joi.object().keys({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            repassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            email: Joi.string().email({ minDomainAtoms: 2 }),
            bio: Joi.string().min(10).max(100),
        }).with('username', 'password', 'email');

        // 校验参数
        const result = Joi.validate(userInfo, schema);
        if (result.error !== null) {
            // 注册失败，异步删除上传的头像
            fs.unlink(files.avatar.path);
            req.flash('error', result.error);
            return res.redirect('/signup');
        }

        getBcryptPassword(password)
            .then(function (value) {
                // 待写入数据库的用户信息
                let user = {
                    name: userInfo.username,
                    password: value,
                    gender: userInfo.gender,
                    bio: userInfo.bio,
                    avatar: userInfo.avatar,
                    email: userInfo.email,
                    date: moment(),
                    islive: false
                };
                // console.log('user.password = ' + user.password);

                // 用户信息写入数据库
                UserModel.create(user)
                    .then(function (result) {
                        // 此 user 是插入 mongodb 后的值，包含 _id
                        user = result._doc;
                        // 删除密码这种敏感信息，将用户信息存入 session
                        delete user.password;
                        req.session.user = user;
                        // 写入 flash
                        req.flash('success', '注册成功');
                        // 跳转到首页
                        res.redirect('/posts');
                    })
                    .catch(function (e) {
                        // 注册失败，异步删除上传的头像
                        fs.unlink(req.files.avatar.path);
                        // 用户名被占用则跳回注册页，而不是错误页
                        if (e.message.match('duplicate key')) {
                            req.flash('error', '用户名已被占用');
                            return res.redirect('/signup');
                        }
                        // next(e);
                        throw next(e);
                    });
            })
            .catch(function (err) {
                next(err);
            });

    });
});

function getBcryptPassword(password) {
    return new Promise(function (resolve) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt, next) {
            if (err) {
                throw next(err);
            }
            bcrypt.hash(password, salt, function (err, hash) {
                // console.log('salt = ' + salt);
                if (err) {
                    throw next(err);
                }
                password = hash;
                // console.log('password = ' + password);
                resolve(password);
            })
        })
    });
}

module.exports = router;