const express = require('express'); // Web framework cho Node.js
const  router = express.Router();
const detailMovieController = require('../app/controllers/DetailMovieController');

router.post('/api', detailMovieController.callAPI);
router.get('/', detailMovieController.index);

module.exports = router;