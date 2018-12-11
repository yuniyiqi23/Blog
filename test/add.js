var zaphod = {name: 'Zaphod', age: 42};
var marvin = {name: 'Marvin', age: 420000000000};

zaphod.sayHello = function(){
  return "Hi, I'm " + this.name;
}
marvin.sayHello = zaphod.sayHello;