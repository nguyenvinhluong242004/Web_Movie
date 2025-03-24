const home = require('./home.route');
const detailMovie = require('./detail-movie.route');
const watchMovie = require('./watch-movie.route');
const search = require('./search.route');
const path = require("path");

function route(app) {

    app.use("/tiktokihsyNtbiXnl4eQIZ8G14VFmfGJwpgroK.txt", (req, res) => {
        res.sendFile(path.join(__dirname, "../app/config/tiktokihsyNtbiXnl4eQIZ8G14VFmfGJwpgroK.txt"));
    });

    app.use('/watch-movie', watchMovie);
    
    app.use('/detail-movie', detailMovie);
    
    app.use('/search', search);
    
    app.use('/', home);

}

module.exports = route;