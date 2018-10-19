
module.exports = function (app) {

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

    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).render('404')
        }
    });
}

