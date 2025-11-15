const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products?page=1&limit=12&q=term
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.max(1, parseInt(req.query.limit || '12', 10));
    const q = (req.query.q || '').trim();

    const filter = q
      ? { $or: [
          { title: { $regex: q, $options: 'i' } },
          // { info:  { $regex: q, $options: 'i' } }
        ] }
      : {};

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find(filter)
      .sort({ id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ products, page, limit, total, totalPages });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findOne({ id }).lean();
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
