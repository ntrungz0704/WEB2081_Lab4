const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.get('/latest', bannerController.getLatestBanners);
router.get('/', bannerController.getBanners);
router.get('/:id', bannerController.getBannerById);

module.exports = router;
