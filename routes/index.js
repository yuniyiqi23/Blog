
module.exports = function (app) {
	//use Get to URL
	app.get('/', require('./posts'));
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));
	app.use('/comments', require('./comments'));
	app.use('/categories', require('./categories'));
	app.use('/tags', require('./tags'));
	app.use('/search', require('./search'));
	app.use('/checkCode', require('./checkCode'));
	app.use('/users', require('./users'));

	//光合应用
	app.use('/gh_users', require('./gh_users'));
	app.use('/gh_presideWord', require('./gh_presideWord'));
	app.use('/gh_audio', require('./gh_audio'));

	// 404 page
	app.use(function (req, res) {
		if (!res.headersSent) {
			res.status(404).render('404');
		}
	});
};

