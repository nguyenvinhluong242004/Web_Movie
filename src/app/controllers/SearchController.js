const FetchDataProvider = require('../models/FetchDataProvider');

class SearchController {

    // [GET] /
    index(req, res) {
        res.render('search')
    }

    // [POST] /api/search
    async callAPI(req, res) {
        const { keyword, page } = req.body;
        FetchDataProvider.fetchSearchMovie(keyword, page)
            .then(data => {
                console.log('Movies data:', data);
                return res.json({ success: true, data: data.data, message: 'Lấy dữ liệu thành công' });
            })
            .catch(error => {
                console.error('Failed to fetch comics:', error);
                return res.json({ success: false, message: 'Không lấy được dữ liệu' });
            });
    };

}

module.exports = new SearchController;