const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const watchMovieController = require('../app/controllers/WatchMovieController');

router.post('/api', watchMovieController.callAPI);
router.get('/', watchMovieController.index);

module.exports = router;