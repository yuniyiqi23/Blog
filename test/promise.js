var http = require("http");

function Promise(fn) {
  var state = 'pending',
    value = null,
    callbacks = [];

  this.then = function (onFulfilled) {
    console.log(1);
    return new Promise(function (resolve1) {
      handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve1
      });
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }
    //如果then中没有传递任何东西
    if (!callback.onFulfilled) {
      callback.resolve(value);
      return;
    }

    var ret = callback.onFulfilled(value);
    console.log(3);
    callback.resolve(ret);
    console.log(4);
  }


  function resolve(newValue) {
    console.log(0);
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (typeof then === 'function') {
        then.call(newValue, resolve);
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    setTimeout(function () {
      callbacks.forEach(function (callback) {
        console.log(2);
        handle(callback);
      });
    }, 0);
  }

  fn(resolve);
}

// 例4
getUserId()
  .then(getUserJobById)
  // .then(function (job) {
  //   // 对job的处理
  //   console.log(job);
  // });

function getUserId() {
  return new Promise(function (resolve) {
    resolve(123);
  });
}

function getUserJobById(id) {
  return new Promise(function (resolve123) {
    //异步请求
    http.get({ host: "www.baidu.com" }, function (results) {
      resolve123(results);
    });
  });
}