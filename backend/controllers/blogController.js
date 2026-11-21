const Blog = require('../models/Blog');

// @desc    Get all blogs (supports category, search, limit)
// @route   GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    const { category, search, limit } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    let blogsQuery = Blog.find(query).sort({ createdAt: -1, id: -1 });
    if (limit) {
      blogsQuery = blogsQuery.limit(parseInt(limit, 10));
    }
    const blogs = await blogsQuery.exec();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài viết', error: error.message });
  }
};

// @desc    Get blog by ID or Slug
// @route   GET /api/blogs/:idOrSlug
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;
    if (!isNaN(id)) {
      blog = await Blog.findOne({ id: Number(id) });
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    if (!blog && id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết bài viết', error: error.message });
  }
};

// @desc    Create blog
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    if (!req.body.id) {
      const maxBlog = await Blog.findOne().sort({ id: -1 });
      req.body.id = maxBlog ? maxBlog.id + 1 : 1;
    }
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo bài viết', error: error.message });
  }
};
