
var express = require('express');
var FS = require('fs');

function downloading(filepath, response) {

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
}

function test(callback) {
    callback('ok');
}

module.exports = downloading;
module.exports = test;

