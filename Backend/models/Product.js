const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // numeric id to match frontend usage
  title: { type: String, required: true },
  img: { type: String, required: true },
  price: { type: Number, required: true },
  company: { type: String, default: "GENERIC" },
  info: { type: String, default: "" },
  inCart: { type: Boolean, default: false },
  count: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
