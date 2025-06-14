const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
require('./config');

const app = express();

app.use(express.json());

// Import routes
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const ipoRoutes = require('./routes/ipoRoutes');
const commodityRoutes = require('./routes/commodityRoutes');
const botRoutes = require('./routes/botRoutes');

// API Routes
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/ipos', ipoRoutes);
app.use('/api/commodities', commodityRoutes);
app.use('/api/bots', botRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Sim Companies Dual Exchange Backend Running!');
});

// Example: Schedule bot engine (simple interval)
const { runBotMarketActivity } = require('./services/botEngine');
setInterval(() => {
  runBotMarketActivity().then(() => {
    console.log('Bot market activity tick...');
  });
}, 10000); // every 10 seconds

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});