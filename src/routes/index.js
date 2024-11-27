const home = require('./home.route');
const detailMovie = require('./detail-movie.route');
const watchMovie = require('./watch-movie.route');

function route(app) {
    
    app.use('/watch-movie', watchMovie);
    
    app.use('/detail-movie', detailMovie);
    
    app.use('/', home);

}

module.exports = route;