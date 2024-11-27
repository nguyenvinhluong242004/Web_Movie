const home = require('./home.route');
const detailMovie = require('./detail-movie.route');
const watchMovie = require('./watch-movie.route');
const search = require('./search.route');

function route(app) {
    
    app.use('/watch-movie', watchMovie);
    
    app.use('/detail-movie', detailMovie);
    
    app.use('/search', search);
    
    app.use('/', home);

}

module.exports = route;