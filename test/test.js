var http = require("http");

function Promise(fn) {
  var value = null,
    callbacks = []; //callbacks为数组，因为可能同时有很多个回调

  this.then = function(onFulfilled) {
    callbacks.push(onFulfilled);
    return this;
  };

  function resolve(value12) {
    setImmediate(function() {
      callbacks.forEach(function(callback) {
        callback(value12);
      });
    });
  }

  fn(resolve);
  // resolve(fn());
}

//例1
function getUserId() {
  return new Promise(function(res1) {
    res1(9876);
    //异步请求
    // http.get({ host: "www.baidu.com" }, function(results) {
    //   res1(results);
    // });
  });
}

getUserId().then(function(res2) {
  //一些处理
  // console.log(res2);
});

function a(fn){
  function b(value){
    console.log(value);
  }

  fn(b);

}

function c(para){
  para(123);
}

a(c);
