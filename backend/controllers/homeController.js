const Banner = require('../models/Banner');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Blog = require('../models/Blog');

// @desc    API tổng hợp dành riêng cho Trang chủ (3 banner mới nhất, sản phẩm mới, bán chạy, khuyến mãi, 3 bài viết mới nhất)
// @route   GET /api/home
exports.getHomeData = async (req, res) => {
  try {
    const [banners, categories, newProducts, bestSellingProducts, saleProducts, latestBlogs] =
      await Promise.all([
        Banner.find().sort({ createdAt: -1, id: -1 }).limit(3),
        Category.find().sort({ order: 1, id: 1 }),
        Product.find().sort({ id: -1 }).limit(4),
        Product.find().sort({ sold: -1 }).limit(4),
        Product.find({ discount: { $gt: 0 } }).sort({ discount: -1 }).limit(4),
        Blog.find().sort({ createdAt: -1, id: -1 }).limit(3),
      ]);

    res.json({
      banners,
      categories,
      newProducts,
      bestSellingProducts,
      saleProducts,
      latestBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tải dữ liệu trang chủ', error: error.message });
  }
};
