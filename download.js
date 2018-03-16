"use strict";

var Http = require('http');
var FS = require('fs');
var URL = require('url');

var CONFIG = {
    'host': '127.0.0.1',
    'port': 8023,
};

// 创建服务器
Http.createServer( function (request, response) {

    // 解析 url 参数
    // http://127.0.0.1:8023/download?filepath=word1.odt
    var params = URL.parse(request.url, true).query;
    var filePath = params.filepath;

    //读取文件内容
    FS.readFile(filePath, function ( error, data ){
        if ( error ){
            console.log('error = ' + error.stack);
            // // HTTP 状态码: 404 : NOT FOUND
            // response.writeHead(404, {'Content-Type': 'text/html'});
            // //  发送响应数据
            // response.end(error.stack);
        }
        else {
            console.log('data = ' + data);

            response.writeHead(200, {
                'Content-Type': 'application/force-download',
                'Content-Disposition': 'attachment; filename=' + filePath,
            });
            response.end(data);
        }
    });

}).listen(CONFIG.port, CONFIG.host);

console.log( 'Server running at : http://' + CONFIG.host + ':' + CONFIG.port.toString() + '/' );
