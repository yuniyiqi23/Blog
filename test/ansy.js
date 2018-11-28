const a = require('./add');
a.on('ready', () => {
  console.log('模块 a 已准备好');
});