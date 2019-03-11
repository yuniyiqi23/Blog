const express = require('express');
const fs = require('fs');
const router = express.Router();

/**
 * @description 获取音频
 * @author yep
 * @date 2019-3-11
 */
router.get('/', function (req, res, next) {
    const mp3 = 'audios/Tiffany Alvord - Baby I Love You.mp3';
    const stat = fs.statSync(mp3);

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    })

    // 创建可读流
    let readableStream = fs.createReadStream(mp3)
    // 管道pipe流入
    readableStream.pipe(res);
})

module.exports = router;
