const FetchDataProvider = require('../models/FetchDataProvider');

class DetailMovieController {

    // [GET] /
    index(req, res) {
        res.render('detail-movie', { title: '' });
    }

    // [POST] /api/detail-movie
    async callAPI(req, res) {
        const { slug } = req.body;
        FetchDataProvider.fetchDetailMovie(slug)
            .then(data => {
                //console.log('Movies data:', data);
                return res.json({ success: data.status, data: data, message: 'Lấy dữ liệu thành công' });
            })
            .catch(error => {
                console.error('Failed to fetch comics:', error);
                return res.json({ success: false, message: 'Không lấy được dữ liệu' });
            });
    };

}

module.exports = new DetailMovieController;