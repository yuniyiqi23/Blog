const express = require('express');
const router = express.Router();
const moment = require('moment');
const path = require('path');

/**
 * @description 获取主持词
 * @author yep
 * @date 2019-3-11
 */
router.get('/', function (req, res, next) {
	const data = [
		{
			"title": "浪漫的婚庆台词",
			"context": "吴京的《流浪地球》票房今年春节档成功位居榜首，上映20天，累计42.87亿，成为仅此于《战狼2》最高票房的亚军。对于吴京来说两部电影都是自己的心血，能否超越《战狼2》并不重要，重要的是能否给社会和观众带来价值。很显然，吴京是成功的。",
			"audioURL": "http://47.75.8.64/audios/Tiffany Alvord - Baby I Love You.mp3",
			"createdTime": "2019-02-27 15:38",
			"author": {
				"name": '李诚',
				"avatar": "http://47.75.8.64/images/upload_987b7bd76062b78fe18cf8f15f7f37db.jpeg",
			}
		},
		{
			"title": "浪漫的婚庆台词",
			"context": "吴京的《流浪地球》票房今年春节档成功位居榜首，上映20天，累计42.87亿，成为仅此于《战狼2》最高票房的亚军。对于吴京来说两部电影都是自己的心血，能否超越《战狼2》并不重要，重要的是能否给社会和观众带来价值。很显然，吴京是成功的。",
			"audioURL": "http://47.75.8.64/audios/Tiffany Alvord - Baby I Love You.mp3",
			"createdTime": "2019-02-27 15:38",
			"author": {
				"name": '李诚',
				"avatar": "http://47.75.8.64/images/upload_987b7bd76062b78fe18cf8f15f7f37db.jpeg",
			}
		},
		{
			"title": "浪漫的婚庆台词",
			"context": "吴京的《流浪地球》票房今年春节档成功位居榜首，上映20天，累计42.87亿，成为仅此于《战狼2》最高票房的亚军。对于吴京来说两部电影都是自己的心血，能否超越《战狼2》并不重要，重要的是能否给社会和观众带来价值。很显然，吴京是成功的。",
			"audioURL": "http://47.75.8.64/audios/Tiffany Alvord - Baby I Love You.mp3",
			"createdTime": "2019-02-27 15:38",
			"author": {
				"name": '李诚',
				"avatar": "http://47.75.8.64/images/upload_987b7bd76062b78fe18cf8f15f7f37db.jpeg",
			}
		},
		{
			"title": "浪漫的婚庆台词",
			"context": "吴京的《流浪地球》票房今年春节档成功位居榜首，上映20天，累计42.87亿，成为仅此于《战狼2》最高票房的亚军。对于吴京来说两部电影都是自己的心血，能否超越《战狼2》并不重要，重要的是能否给社会和观众带来价值。很显然，吴京是成功的。",
			"audioURL": "http://47.75.8.64/audios/Tiffany Alvord - Baby I Love You.mp3",
			"createdTime": "2019-02-27 15:38",
			"author": {
				"name": '李诚',
				"avatar": "http://47.75.8.64/images/upload_987b7bd76062b78fe18cf8f15f7f37db.jpeg",
			}
		},
		{
			"title": "浪漫的婚庆台词",
			"context": "吴京的《流浪地球》票房今年春节档成功位居榜首，上映20天，累计42.87亿，成为仅此于《战狼2》最高票房的亚军。对于吴京来说两部电影都是自己的心血，能否超越《战狼2》并不重要，重要的是能否给社会和观众带来价值。很显然，吴京是成功的。",
			"audioURL": "http://47.75.8.64/audios/Tiffany Alvord - Baby I Love You.mp3",
			"createdTime": "2019-02-27 15:38",
			"author": {
				"name": '李诚',
				"avatar": "http://47.75.8.64/images/upload_987b7bd76062b78fe18cf8f15f7f37db.jpeg",
			}
		},
	];

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(data));
})

module.exports = router;