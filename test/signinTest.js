const app = require("../app");
const request = require("supertest")(app);
const should = require("should");

describe("test signin", function() {
  const name = "adam05";
  const password = "111111";

  it("get signin page", function(done) {
    request
      .get("/signin")
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        done();
      });
  });
  it("signin fail when name is empty", function(done) {
    request
      .post("/signin")
      .send({
        name: "",
        password: password
      })
      .expect(200)
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
      .expect(200)
      .end(function(err, res) {
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
      .expect(200)
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
      .expect(200)
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
