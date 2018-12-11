let value = 1;

function bar(){
  var value = 2;

  function foo(){
    console.log(value);
  }

  return foo;
}

bar();