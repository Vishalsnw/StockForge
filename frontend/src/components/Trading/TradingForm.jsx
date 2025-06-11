import React, { useState, useEffect } from 'react';
import './TradingForm.css';

const TradingForm = ({ selectedStock, orderType, setOrderType }) => {
  const [formData, setFormData] = useState({
    orderType: 'MARKET', // MARKET, LIMIT, SL, SL-M
    quantity: '',
    price: '',
    stopLoss: '',
    target: '',
    validity: 'DAY' // DAY, IOC, GTD
  });

  const [userBalance, setUserBalance] = useState({
    cash: 100000,
    availableMargin: 250000,
    usedMargin: 15000
  });

  const [orderPreview, setOrderPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 1,
      symbol: 'RELIANCE',
      type: 'BUY',
      quantity: 100,
      price: 2445.50,
      status: 'EXECUTED',
      time: '2025-06-11 16:45:32'
    },
    {
      id: 2,
      symbol: 'TCS',
      type: 'SELL',
      quantity: 50,
      price: 3240.25,
      status: 'PENDING',
      time: '2025-06-11 16:30:15'
    }
  ]);

  // Calculate order preview when form data changes
  useEffect(() => {
    if (formData.quantity && selectedStock.price) {
      const qty = parseInt(formData.quantity) || 0;
      const price = formData.orderType === 'MARKET' 
        ? selectedStock.price 
        : parseFloat(formData.price) || selectedStock.price;
      
      const orderValue = qty * price;
      const brokerage = Math.max(orderValue * 0.0003, 20); // 0.03% or min ₹20
      const taxes = orderValue * 0.001; // Approx taxes
      const totalCost = orderType === 'BUY' 
        ? orderValue + brokerage + taxes 
        : orderValue - brokerage - taxes;

      setOrderPreview({
        quantity: qty,
        price: price.toFixed(2),
        orderValue: orderValue.toFixed(2),
        brokerage: brokerage.toFixed(2),
        taxes: taxes.toFixed(2),
        totalCost: totalCost.toFixed(2)
      });
    } else {
      setOrderPreview(null);
    }
  }, [formData, selectedStock.price, orderType]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickQuantity = (qty) => {
    setFormData(prev => ({
      ...prev,
      quantity: qty.toString()
    }));
  };

  const handleSubmitOrder = async () => {
    if (!formData.quantity || formData.quantity <= 0) {
      alert('Please enter valid quantity');
      return;
    }

    if (formData.orderType === 'LIMIT' && (!formData.price || formData.price <= 0)) {
      alert('Please enter valid price for limit order');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder = {
        id: Date.now(),
        symbol: selectedStock.symbol,
        type: orderType,
        orderType: formData.orderType,
        quantity: parseInt(formData.quantity),
        price: formData.orderType === 'MARKET' ? selectedStock.price : parseFloat(formData.price),
        status: 'PENDING',
        time: new Date().toLocaleString('sv-SE').replace('T', ' ').slice(0, 19)
      };

      setRecentOrders(prev => [newOrder, ...prev.slice(0, 4)]);
      
      // Reset form
      setFormData({
        orderType: 'MARKET',
        quantity: '',
        price: '',
        stopLoss: '',
        target: '',
        validity: 'DAY'
      });

      alert(`${orderType} order placed successfully!`);
      
    } catch (error) {
      alert('Order failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'EXECUTED': return '#4caf50';
      case 'PENDING': return '#ff9800';
      case 'CANCELLED': return '#f44336';
      default: return '#888';
    }
  };

  return (
    <div className="trading-form-container">
      {/* Order Type Toggle */}
      <div className="order-type-toggle">
        <button 
          className={`toggle-btn ${orderType === 'BUY' ? 'active buy' : ''}`}
          onClick={() => setOrderType('BUY')}
        >
          BUY
        </button>
        <button 
          className={`toggle-btn ${orderType === 'SELL' ? 'active sell' : ''}`}
          onClick={() => setOrderType('SELL')}
        >
          SELL
        </button>
      </div>

      {/* User Balance Info */}
      <div className="balance-info">
        <div className="balance-item">
          <span className="label">Available Cash</span>
          <span className="value">₹{userBalance.cash.toLocaleString()}</span>
        </div>
        <div className="balance-item">
          <span className="label">Margin Available</span>
          <span className="value">₹{userBalance.availableMargin.toLocaleString()}</span>
        </div>
      </div>

      {/* Trading Form */}
      <div className="trading-form">
        <h3>{orderType} {selectedStock.symbol}</h3>
        
        {/* Order Type Selection */}
        <div className="form-group">
          <label>Order Type</label>
          <select 
            value={formData.orderType}
            onChange={(e) => handleInputChange('orderType', e.target.value)}
            className="form-select"
          >
            <option value="MARKET">Market</option>
            <option value="LIMIT">Limit</option>
            <option value="SL">Stop Loss</option>
            <option value="SL-M">SL-Market</option>
          </select>
        </div>

        {/* Quantity Input */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            className="form-input"
            min="1"
          />
          
          {/* Quick Quantity Buttons */}
          <div className="quick-quantity">
            {[10, 25, 50, 100].map(qty => (
              <button 
                key={qty}
                onClick={() => handleQuickQuantity(qty)}
                className="quick-qty-btn"
              >
                {qty}
              </button>
            ))}
          </div>
        </div>

        {/* Price Input (for Limit orders) */}
        {(formData.orderType === 'LIMIT' || formData.orderType === 'SL') && (
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder={`₹${selectedStock.price}`}
              className="form-input"
              step="0.05"
            />
          </div>
        )}

        {/* Stop Loss (for SL orders) */}
        {(formData.orderType === 'SL' || formData.orderType === 'SL-M') && (
          <div className="form-group">
            <label>Trigger Price</label>
            <input
              type="number"
              value={formData.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', e.target.value)}
              placeholder="Stop loss price"
              className="form-input"
              step="0.05"
            />
          </div>
        )}

        {/* Order Validity */}
        <div className="form-group">
          <label>Validity</label>
          <select 
            value={formData.validity}
            onChange={(e) => handleInputChange('validity', e.target.value)}
            className="form-select"
          >
            <option value="DAY">Day</option>
            <option value="IOC">IOC</option>
            <option value="GTD">Good Till Date</option>
          </select>
        </div>

        {/* Order Preview */}
        {orderPreview && (
          <div className="order-preview">
            <h4>Order Preview</h4>
            <div className="preview-row">
              <span>Quantity:</span>
              <span>{orderPreview.quantity} shares</span>
            </div>
            <div className="preview-row">
              <span>Price:</span>
              <span>₹{orderPreview.price}</span>
            </div>
            <div className="preview-row">
              <span>Order Value:</span>
              <span>₹{orderPreview.orderValue}</span>
            </div>
            <div className="preview-row">
              <span>Brokerage:</span>
              <span>₹{orderPreview.brokerage}</span>
            </div>
            <div className="preview-row">
              <span>Taxes:</span>
              <span>₹{orderPreview.taxes}</span>
            </div>
            <div className="preview-row total">
              <span>{orderType === 'BUY' ? 'Total Cost:' : 'Net Amount:'}</span>
              <span>₹{orderPreview.totalCost}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          onClick={handleSubmitOrder}
          disabled={isSubmitting || !formData.quantity}
          className={`submit-btn ${orderType.toLowerCase()}`}
        >
          {isSubmitting ? 'Placing Order...' : `${orderType} ${selectedStock.symbol}`}
        </button>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h4>Recent Orders</h4>
        <div className="orders-list">
          {recentOrders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <span className={`order-type ${order.type.toLowerCase()}`}>
                  {order.type}
                </span>
                <span className="order-symbol">{order.symbol}</span>
                <span 
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-details">
                <span>{order.quantity} @ ₹{order.price.toFixed(2)}</span>
                <span className="order-time">{order.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingForm;
