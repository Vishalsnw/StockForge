import React, { useState, useEffect } from 'react';
import './OrderBook.css';

const OrderBook = ({ symbol }) => {
  const [orderBook, setOrderBook] = useState({
    bids: [], // Buy orders
    asks: []  // Sell orders
  });

  const [lastTrades, setLastTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = 2450.75;
      const bids = [];
      const asks = [];

      // Generate bid orders (buyers)
      for (let i = 0; i < 10; i++) {
        bids.push({
          price: basePrice - (i + 1) * (Math.random() * 5 + 1),
          quantity: Math.floor(Math.random() * 1000) + 100,
          orders: Math.floor(Math.random() * 20) + 1
        });
      }

      // Generate ask orders (sellers)
      for (let i = 0; i < 10; i++) {
        asks.push({
          price: basePrice + (i + 1) * (Math.random() * 5 + 1),
          quantity: Math.floor(Math.random() * 1000) + 100,
          orders: Math.floor(Math.random() * 20) + 1
        });
      }

      setOrderBook({ bids, asks });
    };

    const generateLastTrades = () => {
      const trades = [];
      const basePrice = 2450.75;
      
      for (let i = 0; i < 15; i++) {
        const price = basePrice + (Math.random() - 0.5) * 20;
        const quantity = Math.floor(Math.random() * 500) + 10;
        const time = new Date(Date.now() - i * 60000); // Last 15 minutes
        
        trades.push({
          id: i,
          price: price.toFixed(2),
          quantity,
          time: time.toLocaleTimeString('en-IN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          type: Math.random() > 0.5 ? 'buy' : 'sell'
        });
      }
      
      setLastTrades(trades);
    };

    // Initial data load
    generateOrderBook();
    generateLastTrades();

    // Update every 3 seconds for real-time feel
    const interval = setInterval(() => {
      generateOrderBook();
      generateLastTrades();
    }, 3000);

    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);
  };

  const formatQuantity = (qty) => {
    return qty.toLocaleString();
  };

  return (
    <div className="orderbook-container">
      <div className="orderbook-header">
        <h3>Order Book - {symbol}</h3>
        <div className="market-depth-indicator">
          <span className="depth-label">Market Depth</span>
          <div className="depth-bar">
            <div className="depth-fill" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>

      <div className="orderbook-content">
        {/* Order Book Table */}
        <div className="orderbook-table">
          <div className="table-header">
            <div className="col">Price</div>
            <div className="col">Qty</div>
            <div className="col">Orders</div>
          </div>

          {/* Ask Orders (Sell) */}
          <div className="asks-section">
            <div className="section-label sell-label">SELL ORDERS</div>
            {orderBook.asks.slice(0, 8).reverse().map((ask, index) => (
              <div key={`ask-${index}`} className="order-row ask-row">
                <div className="price-cell sell-price">₹{formatPrice(ask.price)}</div>
                <div className="quantity-cell">{formatQuantity(ask.quantity)}</div>
                <div className="orders-cell">{ask.orders}</div>
                <div 
                  className="depth-bar-bg sell-bg"
                  style={{ width: `${(ask.quantity / 1000) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>

          {/* Current Market Price */}
          <div className="market-price-divider">
            <div className="current-price-display">
              <span className="price-label">LTP</span>
              <span className="current-price">₹2,450.75</span>
              <span className="price-change positive">+1.88%</span>
            </div>
          </div>

          {/* Bid Orders (Buy) */}
          <div className="bids-section">
            <div className="section-label buy-label">BUY ORDERS</div>
            {orderBook.bids.slice(0, 8).map((bid, index) => (
              <div key={`bid-${index}`} className="order-row bid-row">
                <div className="price-cell buy-price">₹{formatPrice(bid.price)}</div>
                <div className="quantity-cell">{formatQuantity(bid.quantity)}</div>
                <div className="orders-cell">{bid.orders}</div>
                <div 
                  className="depth-bar-bg buy-bg"
                  style={{ width: `${(bid.quantity / 1000) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Trades */}
        <div className="last-trades">
          <div className="trades-header">
            <h4>Recent Trades</h4>
            <span className="live-indicator">🔴 LIVE</span>
          </div>
          
          <div className="trades-table">
            <div className="trades-table-header">
              <div className="col">Time</div>
              <div className="col">Price</div>
              <div className="col">Qty</div>
            </div>
            
            <div className="trades-list">
              {lastTrades.slice(0, 10).map((trade) => (
                <div key={trade.id} className="trade-row">
                  <div className="time-cell">{trade.time}</div>
                  <div className={`price-cell ${trade.type === 'buy' ? 'buy-price' : 'sell-price'}`}>
                    ₹{trade.price}
                  </div>
                  <div className="quantity-cell">{formatQuantity(trade.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Book Stats */}
      <div className="orderbook-stats">
        <div className="stat-item">
          <span className="stat-label">Total Bids</span>
          <span className="stat-value buy-color">
            {orderBook.bids.reduce((sum, bid) => sum + bid.quantity, 0).toLocaleString()}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Asks</span>
          <span className="stat-value sell-color">
            {orderBook.asks.reduce((sum, ask) => sum + ask.quantity, 0).toLocaleString()}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Spread</span>
          <span className="stat-value">
            ₹{orderBook.asks.length && orderBook.bids.length ? 
              (orderBook.asks[0].price - orderBook.bids[0].price).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
