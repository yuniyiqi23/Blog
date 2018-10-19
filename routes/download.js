const express = require('express');
const router = express.Router();
const FS = require('fs');

const download_files = require('../models/download_files');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('pages/download_form', {title: 'Download'});
});

router.post('/', function (req, res) {
    let filePath = '../' + req.body.filepath;

    if (filePath != null) {
        //判断文件和目录是否存在
        FS.access(filePath, function (error) {
            if (error == null) {
                //读取文件内容
                FS.readFile(filePath, function (error, data) {
                    if (error) {
                        res.render('pages/download_result', {filepath: req.body.filepath, result: '下载失败！'});
                    }
                    else {
                        res.writeHead(200, {
                            'Content-Type': 'application/force-download',
                            'Content-Disposition': 'attachment; filename=' + req.body.filepath,
                        });
                        res.end(data);
                        // res.render('pages/download_result', {filepath: req.body.filepath, result: '下载成功！'});
                    }
                });
            }else {
                if (error.code == "ENOENT") {
                    res.render('pages/download_result', {filepath: null, result: '文件不存在！'});
                }
            }
        });
    }
});

module.exports = router;