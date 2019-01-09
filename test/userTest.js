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

describe("test signin", function() {
  const name = "adam05";
  const password = "111111";

  it("signin fail when name is empty", function(done) {
    request
      .post("/signin")
      .send({
        name: "",
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("请填写用户名！");
        done();
      });
  });
  it("signin fail when password is empty", function(done) {
    request
    .post("/signin")
    .send({
      name: name,
      password: ""
    })
    .end(function(err, res){
      should.not.exist(err);
      res.text.should.containEql("请填写密码！");
      done();
    });
  });
  it("signin fail when name is not exist", function(done) {
    request
      .post("/signin")
      .send({
        name: name + "!@#",
        password: password
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("用户不存在！");
        done();
      });
  });
  it("signin fail when password is wrong", function(done) {
    request
      .post("/signin")
      .send({
        name: name,
        password: password + "!@#"
      })
      .end(function(err, res) {
        should.not.exist(err);
        res.text.should.containEql("密码错误！");
        done();
      });
  });
  it("signin successful", function(done) {
    request
      .post("/signin")
      .send({
        name: name,
        password: password
      })
      .expect(302)
      .end(function(err, res) {
        should.not.exist(err);
        done();
      });
  });
});
