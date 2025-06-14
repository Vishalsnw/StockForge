// Simple Bot Engine: create basic trading activity for liquidity

const Bot = require('../models/Bot');
const Order = require('../models/Order');
const Company = require('../models/Company');
const Product = require('../models/Product');

// Helper: random value in range
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Bot Activity: runs every X seconds
async function runBotMarketActivity() {
  // Find active bots
  const bots = await Bot.find({ isActive: true }).populate('user');
  for (const bot of bots) {
    // Strategy: random trading in both exchanges
    // 50% chance stock, 50% chance commodity
    if (Math.random() < 0.5) {
      // Stock exchange: buy or sell random company shares
      const companies = await Company.find({});
      if (!companies.length) continue;
      const company = companies[randomBetween(0, companies.length - 1)];
      const buyOrSell = Math.random() < 0.5 ? 'buy' : 'sell';
      const quantity = randomBetween(1, 20);
      const price = randomBetween(80, 120); // Simulated price

      const order = new Order({
        type: buyOrSell,
        productType: 'stock',
        user: bot.user._id,
        company: company._id,
        price,
        quantity
      });
      await order.save();
    } else {
      // Commodity exchange: buy or sell random product
      const products = await Product.find({});
      if (!products.length) continue;
      const product = products[randomBetween(0, products.length - 1)];
      const buyOrSell = Math.random() < 0.5 ? 'buy' : 'sell';
      const quantity = randomBetween(5, 50);
      const price = randomBetween(
        Math.floor(product.marketPrice * 0.8),
        Math.floor(product.marketPrice * 1.2)
      );

      const order = new Order({
        type: buyOrSell,
        productType: 'commodity',
        user: bot.user._id,
        company: product.company,
        product: product._id,
        price,
        quantity
      });
      await order.save();
    }
  }
}

// For scheduled bot runs (e.g., setInterval in your app entrypoint)
module.exports = { runBotMarketActivity };