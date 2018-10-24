function getJson(idx) {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			var random = Math.floor(Math.random() * 1000);
			console.log('success' + random);
			reject(random);
		}, 1000);
	});
}


getJson(13).then(function () {
	return getJson(14);
}, function () {
	console.log(arguments);
	return 'adas';
}).then(function (value) {
	console.log('value = ' + value);
	return getJson(15);
}).then(function () {
	return getJson(16);
}).catch(function (error) {
	console.log(error);
});