const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', function (req, res, next) {
    res.render('signin');
});

router.post('/', function (req, res, next) {
    console.log('signin -- Post');

    const name = req.body.name;
    const password = req.body.password;

    //校验参数
    try{
        if(!name.length){
            throw new Error('请填写用户名！');
        }
        if(!password.length){
            throw new Error('请填写密码！');
        }
    }catch (e){
        req.flash('error', e.message);
        return res.redirect('back');
    }

    UserModel.getUserByName(name)
        .then(function (user) {
            if(!user){
                req.flash('error', '用户不存在！');
                return res.redirect('back');
            }
            //检查密码是否匹配
            bcrypt.compare(password, user.password, function(err, result) {
                // result === true
                if(result !== true){
                    req.flash('error', '用户名或是密码错误！');
                    return res.redirect('back');
                }
                req.flash('success', '登录成功！');
                // 用户信息写入 session
                delete user.password;
                req.session.user = user;
                // 跳转到主页
                res.redirect('/posts');
            });
            // if(sha1(password) !== user.password){
            //     req.flash('error', '用户名或是密码错误！');
            //     return res.redirect('back');
            // }

        })
        .catch(next);
});

module.exports = router;


