const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productsRoutes = require('./routes/products');
const purchaseRoutes = require('./routes/purchase');
const paymentRoutes = require('./routes/payment'); // ✅ NEW

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_demo';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Mongo connected'))
.catch(err => console.error('Mongo connect error', err));

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/payment', paymentRoutes); // ✅ NEW

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});