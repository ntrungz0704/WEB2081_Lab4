const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
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
    subtitle: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: 'Khám phá ngay →',
    },
    link: {
      type: String,
      default: '/products',
    },
    order: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
