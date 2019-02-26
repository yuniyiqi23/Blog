
EventEmitter.prototype = {
    on: function(eventName, callback){
      this.events[eventName] = callback;
    },
  
    emit: function(eventName){
      const args = Array.prototype.slice.call(arguments, 1);
      console.log(arguments);
      console.log(args);
      const callback = this.events[eventName];
      callback.apply(this, args);
      
    },
  }
  
  function EventEmitter(){
    this.events = {};
  }
  
  const event1 = new EventEmitter();
  event1.on('call', function(name){
    console.log('I am calling ' + name);
  });
  event1.emit('call', 'Adam Smith');