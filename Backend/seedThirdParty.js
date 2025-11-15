const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_demo';

const normalize = (s) => (s || '').toString().trim();
const titleKey = (t) => normalize(t).toLowerCase();

async function fetchDummyJson() {
  const { data } = await axios.get('https://dummyjson.com/products?limit=200');
  // data.products = [{ id, title, description, price, brand, category, images[], thumbnail }]
  return (data.products || []).map(p => ({
    title: normalize(p.title),
    img: (Array.isArray(p.images) && p.images[0]) ? p.images[0] : normalize(p.thumbnail) || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(p.title)}`,
    price: Number(p.price) || 0,
    company: normalize(p.brand || p.category || 'GENERIC'),
    info: normalize(p.description || `Excellent ${p.title} by ${p.brand || p.category || 'GENERIC'}.`)
  }));
}

async function fetchFakeStore() {
  const { data } = await axios.get('https://fakestoreapi.com/products');
  // data = [{ title, description, price, image, category }]
  return (data || []).map(p => ({
    title: normalize(p.title),
    img: normalize(p.image) || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(p.title)}`,
    price: Number(p.price) || 0,
    company: normalize(p.category || 'GENERIC'),
    info: normalize(p.description || `Awesome ${p.title}.`)
  }));
}

(async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Mongo');

    const [a, b] = await Promise.all([fetchDummyJson(), fetchFakeStore()]);
    const combined = [...a, ...b];

    // de-dupe by title (case-insensitive)
    const seen = new Set();
    const unique = [];
    for (const p of combined) {
      const key = titleKey(p.title);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(p);
    }

    // Ensure we have at least 50
    const final = unique.slice(0, Math.max(50, unique.length)); // usually > 50 anyway

    // assign sequential numeric id starting from 1
    const docs = final.map((p, idx) => ({
      id: idx + 1,
      title: p.title,
      img: p.img,
      price: p.price,
      company: p.company.toUpperCase(),
      info: p.info,
      inCart: false,
      count: 0,
      total: 0
    }));

    await Product.deleteMany({});
    await Product.insertMany(docs);

    console.log(`Seeded ${docs.length} unique products`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
