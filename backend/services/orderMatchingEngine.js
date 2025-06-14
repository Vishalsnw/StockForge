// Order Matching Engine for Stock and Commodity Exchange

const Order = require('../models/Order');
const Trade = require('../models/Trade');
const Product = require('../models/Product');
const Company = require('../models/Company');

// Match buy and sell orders for a given productType, company, (and product for commodity)
async function matchOrders({ productType, companyId, productId = null }) {
  // Find all open buy and sell orders
  const buyFilter = {
    type: 'buy',
    productType,
    company: companyId,
    status: 'open'
  };
  const sellFilter = {
    type: 'sell',
    productType,
    company: companyId,
    status: 'open'
  };
  if (productType === 'commodity' && productId) {
    buyFilter.product = productId;
    sellFilter.product = productId;
  }

  // Get orders sorted by price (highest buy first, lowest sell first)
  const buyOrders = await Order.find(buyFilter).sort({ price: -1, createdAt: 1 });
  const sellOrders = await Order.find(sellFilter).sort({ price: 1, createdAt: 1 });

  let trades = [];

  // Simple matching: best buy >= best sell
  let i = 0, j = 0;
  while (i < buyOrders.length && j < sellOrders.length) {
    const buy = buyOrders[i];
    const sell = sellOrders[j];
    if (buy.price >= sell.price) {
      // Trade at sell price (or midpoint/negotiation logic can be improved)
      const tradedQuantity = Math.min(buy.quantity, sell.quantity);
      const tradePrice = sell.price;

      // Create trade
      const trade = new Trade({
        buyOrder: buy._id,
        sellOrder: sell._id,
        productType,
        company: companyId,
        product: productId || undefined,
        price: tradePrice,
        quantity: tradedQuantity
      });
      await trade.save();
      trades.push(trade);

      // Update order quantities and status
      buy.quantity -= tradedQuantity;
      sell.quantity -= tradedQuantity;
      if (buy.quantity === 0) buy.status = 'matched';
      if (sell.quantity === 0) sell.status = 'matched';
      buy.matchedAt = new Date();
      sell.matchedAt = new Date();
      await buy.save();
      await sell.save();

      // Update product or share quantities if applicable (not implemented here)

      // Move to next order(s)
      if (buy.quantity === 0) i++;
      if (sell.quantity === 0) j++;
    } else {
      // No match possible
      break;
    }
  }

  return trades;
}

module.exports = { matchOrders };