const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/banners
exports.getBanners = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;
    let query = Banner.find().sort({ createdAt: -1, id: -1 });
    if (limit > 0) {
      query = query.limit(limit);
    }
    const banners = await query.exec();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách banner', error: error.message });
  }
};

// @desc    Get 3 latest banners for Homepage
// @route   GET /api/banners/latest
exports.getLatestBanners = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 3;
    const banners = await Banner.find().sort({ createdAt: -1, id: -1 }).limit(limit);
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy banner mới nhất', error: error.message });
  }
};

// @desc    Get banner by ID or Slug
// @route   GET /api/banners/:idOrSlug
exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    let banner;
    if (!isNaN(id)) {
      banner = await Banner.findOne({ id: Number(id) });
    }
    if (!banner) {
      banner = await Banner.findOne({ slug: id });
    }
    if (!banner) {
      return res.status(404).json({ message: 'Không tìm thấy banner' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy banner', error: error.message });
  }
};
