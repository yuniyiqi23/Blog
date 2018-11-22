function* foo(obj) {
  let keys = Reflect.ownKeys(obj);

  for(key of keys){
	  yield [key, obj[key]];
  }
}

let adam = { first: 'ye', last: 'adam' };
adam[Symbol.iterator] = foo

for([key, value] of foo(adam)){
	console.log(key + ' : ' + value)
}
