// Backend/models/Buyer.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: String,
  price: Number,
  count: Number,
  total: Number
}, { _id: false });

const BuyerSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, index: true },   // NEW
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  items: { type: [ItemSchema], default: [] },
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Buyer', BuyerSchema);
