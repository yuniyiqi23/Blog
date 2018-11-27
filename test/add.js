function* gen() {
  let a = yield output('a', 'aa', 456);
  let b = yield output(123);
}

function output(...args){
  console.log('Hello ' + args);
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}