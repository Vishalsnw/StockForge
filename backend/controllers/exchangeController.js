const Order = require('../models/Order');
const Trade = require('../models/Trade');
const Company = require('../models/Company');
const Product = require('../models/Product');

// Place order (stock or commodity)
exports.placeOrder = async (req, res) => {
  try {
    const { type, productType, company, product, price, quantity } = req.body;
    const user = req.user._id;
    const order = new Order({
      type,
      productType,
      user,
      company,
      product: product || undefined,
      price,
      quantity,
    });
    await order.save();

    // TODO: Trigger order matching engine here

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// List open orders
exports.getOrderBook = async (req, res) => {
  try {
    const { productType, company, product } = req.query;
    const filter = { status: 'open' };
    if (productType) filter.productType = productType;
    if (company) filter.company = company;
    if (product) filter.product = product;
    const orders = await Order.find(filter).populate('user', 'username');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// List recent trades
exports.getRecentTrades = async (req, res) => {
  try {
    const { productType, company, product } = req.query;
    const filter = {};
    if (productType) filter.productType = productType;
    if (company) filter.company = company;
    if (product) filter.product = product;
    const trades = await Trade.find(filter)
      .sort({ tradedAt: -1 })
      .limit(100)
      .populate('buyOrder sellOrder company product');
    res.json({ success: true, trades });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};