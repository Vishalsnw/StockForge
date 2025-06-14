const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

// Place order (stock or commodity)
router.post('/order', exchangeController.placeOrder);
// Get open orders (order book)
router.get('/orders', exchangeController.getOrderBook);
// Get recent trades
router.get('/trades', exchangeController.getRecentTrades);

module.exports = router;