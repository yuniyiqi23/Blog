const config = require('config-lite')(__dirname);
const mongoose = require("mongoose");

mongoose.connect(config.mongodb);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function () {
    // we're connected!
    console.log("数据库连接成功！");
});
