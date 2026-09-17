const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  imageFilename: String
}, { timestamps: true });

productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);