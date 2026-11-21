const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: 'BHShop Studio',
    },
    category: {
      type: String,
      default: 'Mẹo chăm sóc',
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    readTime: {
      type: String,
      default: '4 phút đọc',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Blog', blogSchema);
