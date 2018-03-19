"use strict";

var Http = require('http');
var FS = require('fs');
var URL = require('url');

var CONFIG = {
    'host': '127.0.0.1',
    'port': 8023,
};

// 创建服务器
Http.createServer(function (request, response) {

    // 解析 url 参数
    // http://127.0.0.1:8023/download?filepath=word1.odt
    var params = URL.parse(request.url, true).query;
    var filePath = params.filepath;

    if (filePath != null) {
        //判断文件和目录是否存在
        FS.access(filePath, function (error) {
            if (error == null) {
                //读取文件内容
                FS.readFile(filePath, function (error, data) {
                    if (error) {
                        console.log('error = ' + error.stack);
                        // HTTP 状态码: 500
                        response.writeHead(500, {'Content-Type': 'text/html'});
                        //  发送响应数据
                        var index = '<!DOCTYPE html>' +
                            '<html>' +
                            '<head>' +
                            '<meta charset="utf-8">' +
                            '<title>Download</title>' +
                            '</head>' +
                            '<body>' +
                            '服务器错误 ： ' + error.stack
                        '</body>' +
                        '</html>';
                        response.write(index);
                        response.end();
                    }
                    else {
                        response.writeHead(200, {
                            'Content-Type': 'application/force-download',
                            'Content-Disposition': 'attachment; filename=' + filePath,
                        });
                        /*//  发送响应数据
                        var index = '<!DOCTYPE html>' +
                            '<html>' +
                            '<head>' +
                            '<meta charset="utf-8">' +
                            '<title>Download</title>' +
                            '</head>' +
                            '<body>' +
                            '下载文件 ： ' + filePath + '成功！'
                        '</body>' +
                        '</html>';
                        response.write(index);*/
                        response.end(data);
                    }
                });
            }
            else {
                if (error.code == "ENOENT") {
                    console.log("文件和目录不存在");

                    response.writeHead(404, {'Content-Type': 'text/html'});
                    //  发送响应数据
                    var index = '<!DOCTYPE html>' +
                        '<html>' +
                        '<head>' +
                        '<meta charset="utf-8">' +
                        '<title>Download</title>' +
                        '</head>' +
                        '<body>' +
                        '下载的文件 ： ' + filePath + '不存在！'
                    '</body>' +
                    '</html>';
                    response.write(index);
                    response.end();
                }
            }
        })
    }


}).listen(CONFIG.port, CONFIG.host);

console.log('Server running at : http://' + CONFIG.host + ':' + CONFIG.port.toString() + '/');
