const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");

const UserModel = require("../models/users");
const checkNotLogin = require("../middlewares/check").checkNotLogin;

router.get("/", checkNotLogin, function(req, res) {
  res.render("signin", { username: null });
});

router.post("/", checkNotLogin, function(req, res, next) {
  const name = req.body.name;
  const password = req.body.password;

  //校验参数
  try {
    if (!name.length) {
      throw new Error("请填写用户名！");
    }
    if (!password.length) {
      throw new Error("请填写密码！");
    }
  } catch (e) {
    // req.flash('error', e.message);
    // return res.send('请填写用户名！');
    return res.render("signin", { username: name, error: e.message });
  }

  UserModel.getUserByName(name)
    .then(function(user) {
      if (!user) {
        // req.flash('error', '用户不存在！');
        return res.render("signin", { username: name, error: "用户不存在！" });
      }
      return validatesPassword(res, user, password);
    })
    .then(function(user) {
      if (user) {
        req.flash("success", "登录成功！");
        // 删除 password;
        user.password = null;
        // 用户信息写入 session
        req.session.user = user;
        res.redirect("/posts");
      }
    })
    .catch(next);

});

function validatesPassword(res, user, password) {
  return Promise.resolve(
    bcrypt.compare(password, user.password).then(function(result) {
      if (result === true) {
        return UserModel.updateLoginTime(
          user.name,
          moment().format("YYYY-MM-DD HH:mm")
        );
      } else {
        res.render("signin", {
          username: user.name,
          error: "用户名或是密码错误！"
        });
      }
    })
  );
}

module.exports = router;
