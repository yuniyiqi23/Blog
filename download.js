"use strict";

var Http = require('http');
var FS = require('fs');
var URL = require('url');

var CONFIG = {
    'host': '127.0.0.1',
    'port': 8023,
};

//检测文件或者文件夹存在
function fsExistsSync(path) {

    try{
        FS.accessSync(path, FS.F_OK);
    }catch(e){
        return false;
    }

    console.log('file is exist!')
    return true;
}

// 创建服务器
Http.createServer( function (request, response) {

    // 解析 url 参数
    // http://127.0.0.1:8023/download?filepath=word.odt
    var params = URL.parse(request.url, true).query;
    var filePath = params.filepath;

    //判断文件是否存在
    if(fsExistsSync(filePath)){
        //读取文件内容
        FS.readFile(filePath, function ( error, data ){
            if ( error ){
                console.log('error = ' + error.stack);
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
    }
    else{
        // HTTP 状态码: 404 : NOT FOUND
        response.writeHead(404, {'Content-Type': 'text/html'});
        //  发送响应数据
        response.end();
    }

}).listen(CONFIG.port, CONFIG.host);

console.log( 'Server running at : http://' + CONFIG.host + ':' + CONFIG.port.toString() + '/' );
