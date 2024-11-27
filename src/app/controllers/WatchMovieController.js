class WatchMovieController {

    // [GET] /
    index(req, res) {
        res.render('watch-movie', { title: '' });
    }

    // [POST] /api/watch-movie
    async callAPI(req, res) {
        
    };

}

module.exports = new WatchMovieController;