require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Blog = require('./models/Blog');
const Banner = require('./models/Banner');
const initialProducts = require('./data/initialProducts');
const initialCategories = require('./data/initialCategories');
const initialBlogs = require('./data/initialBlogs');
const initialBanners = require('./data/initialBanners');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (4 bảng dữ liệu đều có slug + API trang chủ)
app.use('/api/home', homeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/banners', bannerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    endpoints: [
      '/api/home',
      '/api/categories',
      '/api/products',
      '/api/products/new',
      '/api/products/sale',
      '/api/products/bestseller',
      '/api/blogs',
      '/api/banners',
      '/api/banners/latest'
    ],
    timestamp: new Date()
  });
});

// Auto seed safely only when collections are empty
const autoSeedIfEmpty = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(initialCategories);
      console.log(`[Seed] Seeded ${initialCategories.length} categories.`);
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log(`[Seed] Seeded ${initialProducts.length} products.`);
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany(initialBlogs);
      console.log(`[Seed] Seeded ${initialBlogs.length} blogs.`);
    }

    const bannerCount = await Banner.countDocuments();
    if (bannerCount === 0) {
      await Banner.insertMany(initialBanners);
      console.log(`[Seed] Seeded ${initialBanners.length} banners.`);
    }
  } catch (error) {
    console.error('[Seed] Error auto seeding database:', error.message);
  }
};

// Start Server after connecting to MongoDB
connectDB().then(async () => {
  await autoSeedIfEmpty();
  app.listen(PORT, () => {
    console.log(`[Server] Backend running at http://localhost:${PORT}`);
    console.log(`[API] Home: http://localhost:${PORT}/api/home`);
    console.log(`[API] Categories: http://localhost:${PORT}/api/categories`);
    console.log(`[API] Products: http://localhost:${PORT}/api/products`);
    console.log(`[API] Blogs: http://localhost:${PORT}/api/blogs`);
    console.log(`[API] Banners: http://localhost:${PORT}/api/banners`);
  });
});
