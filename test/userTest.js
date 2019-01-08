const app = require("../app");
const request = require("supertest")(app);
const should = require("should");

// describe("Test user", function() {
//   it("Test get", function(done) {
//     request
//       .get("/users")
//       .expect("Content-Type", "text/html; charset=utf-8")
//       .expect(200)
//       .end(function(err, res) {
//         if (err) throw err;
//         res.text.should.containEql("Hello World!");
//         done();
//       });
//   });

//   it("Test get user id", function(done) {
//     request.get("/users/23").end(function(err, res) {
//       // if (err) throw err;
//       res.text.should.containEql("id");
//       done(err);
//     });
//   });
// });

describe("test sign in", function() {
  const loginname = "adam" + Math.random(1);
  const password = "111";

  it.only("should not sign in successful when loginname is empty", function(done) {
    request
      .post("/signin")
      .send({
        loginname: "",
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("请填写用户名！");
        done();
      });
  });
  it("should not sign in successful when loginname is not exist", function(done) {
    request
      .post("/signin")
      .send({
        // 之前的测试用例已经注册了用户名为loginname的用户，现在改变一下loginname的值，确保该用户不存在
        loginname: loginname + "1",
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("用户不存在");
        done();
      });
  });
  it("should not sign in successful when password is wrong", function(done) {
    request
      .post("/signin")
      .send({
        loginname: loginname,
        // 在用户名存在的前提下改变密码的值
        password: password + "1"
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("用户密码错误");
        done();
      });
  });
  it("should sign in successful", function(done) {
    request
      .post("/signin")
      .send({
        loginname: loginname,
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("登录成功");
        done();
      });
  });
});
