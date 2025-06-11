import React, { useState, useEffect, useCallback } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import { useMarket } from '../../context/MarketContext';
import './StockMarket.css';

const StockMarket = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const { marketStatus, indices } = useMarket();
  const { 
    playerCompany, 
    gameCompanies, 
    getTopCompanies, 
    getCompaniesBySector 
  } = useCompany();

  const [activeTab, setActiveTab] = useState('market');
  const [selectedStock, setSelectedStock] = useState(null);
  const [orderType, setOrderType] = useState('BUY');
  const [priceType, setPriceType] = useState('MARKET');
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Market data with public companies
  useEffect(() => {
    const publicCompanies = gameCompanies.filter(company => company.isPublic);
    
    // Add player company if public
    if (playerCompany?.isPublic) {
      publicCompanies.push(playerCompany);
    }

    // Convert to market data format
    const marketStocks = publicCompanies.map(company => ({
      symbol: company.symbol || company.name.replace(/\s+/g, '').toUpperCase(),
      name: company.name,
      price: company.stockPrice || 10,
      change: (Math.random() - 0.5) * 5, // Simulate daily change
      changePercent: ((Math.random() - 0.5) * 10).toFixed(2),
      volume: Math.floor(Math.random() * 1000000) + 10000,
      marketCap: company.marketCap || company.valuation,
      pe: (15 + Math.random() * 20).toFixed(1),
      high: company.stockPrice * (1 + Math.random() * 0.05),
      low: company.stockPrice * (1 - Math.random() * 0.05),
      open: company.stockPrice * (0.98 + Math.random() * 0.04),
      sector: company.type,
      level: company.level,
      employees: company.employees,
      owner: company.owner,
      companyId: company.id,
      isPlayerCompany: company.id === playerCompany?.id
    }));

    setMarketData(marketStocks);
  }, [gameCompanies, playerCompany]);

  // Initialize sample portfolio
  useEffect(() => {
    if (user) {
      setPortfolio([
        {
          symbol: 'TECHCORP',
          name: 'TechCorp Industries',
          quantity: 100,
          avgPrice: 120.50,
          currentPrice: 125.50,
          invested: 12050,
          currentValue: 12550,
          pnl: 500,
          pnlPercent: 4.15
        }
      ]);

      setWatchlist([
        { symbol: 'TECHCORP', addedDate: '2025-01-15' },
        { symbol: 'GREENENERGY', addedDate: '2025-01-14' }
      ]);

      setOrderHistory([
        {
          id: 'ord_001',
          symbol: 'TECHCORP',
          type: 'BUY',
          quantity: 100,
          price: 120.50,
          status: 'COMPLETED',
          timestamp: '2025-01-15T10:30:00Z',
          total: 12050
        }
      ]);
    }
  }, [user]);

  // Format currency
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Format number
  const formatNumber = useCallback((num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  }, []);

  // Handle stock selection
  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    setLimitPrice(stock.price);
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!selectedStock || quantity < 1) {
      setError('Invalid order parameters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPrice = priceType === 'MARKET' ? selectedStock.price : limitPrice;
      const totalAmount = quantity * orderPrice;
      const fees = totalAmount * 0.001; // 0.1% fees
      const finalAmount = orderType === 'BUY' ? totalAmount + fees : totalAmount - fees;

      // Check balance for buy orders
      if (orderType === 'BUY' && user.balance < finalAmount) {
        throw new Error('Insufficient balance');
      }

      // Check holdings for sell orders
      if (orderType === 'SELL') {
        const holding = portfolio.find(p => p.symbol === selectedStock.symbol);
        if (!holding || holding.quantity < quantity) {
          throw new Error('Insufficient shares to sell');
        }
      }

      // Simulate order execution
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newOrder = {
        id: `ord_${Date.now()}`,
        symbol: selectedStock.symbol,
        type: orderType,
        quantity,
        price: orderPrice,
        status: 'COMPLETED',
        timestamp: new Date().toISOString(),
        total: finalAmount,
        fees
      };

      // Update order history
      setOrderHistory(prev => [newOrder, ...prev]);

      // Update portfolio
      if (orderType === 'BUY') {
        setPortfolio(prev => {
          const existing = prev.find(p => p.symbol === selectedStock.symbol);
          if (existing) {
            const newQuantity = existing.quantity + quantity;
            const newInvested = existing.invested + totalAmount;
            const newAvgPrice = newInvested / newQuantity;
            const newCurrentValue = newQuantity * selectedStock.price;
            const newPnL = newCurrentValue - newInvested;

            return prev.map(p => 
              p.symbol === selectedStock.symbol 
                ? {
                    ...p,
                    quantity: newQuantity,
                    avgPrice: newAvgPrice,
                    invested: newInvested,
                    currentValue: newCurrentValue,
                    pnl: newPnL,
                    pnlPercent: (newPnL / newInvested) * 100
                  }
                : p
            );
          } else {
            return [...prev, {
              symbol: selectedStock.symbol,
              name: selectedStock.name,
              quantity,
              avgPrice: orderPrice,
              currentPrice: selectedStock.price,
              invested: totalAmount,
              currentValue: quantity * selectedStock.price,
              pnl: quantity * (selectedStock.price - orderPrice),
              pnlPercent: ((selectedStock.price - orderPrice) / orderPrice) * 100
            }];
          }
        });

        // Update user balance
        updateUser({ balance: user.balance - finalAmount });
      } else {
        // Sell order
        setPortfolio(prev => {
          const updated = prev.map(p => {
            if (p.symbol === selectedStock.symbol) {
              const newQuantity = p.quantity - quantity;
              if (newQuantity === 0) return null;
              
              const soldInvested = (quantity / p.quantity) * p.invested;
              const newInvested = p.invested - soldInvested;
              const newCurrentValue = newQuantity * selectedStock.price;
              const newPnL = newCurrentValue - newInvested;

              return {
                ...p,
                quantity: newQuantity,
                invested: newInvested,
                currentValue: newCurrentValue,
                pnl: newPnL,
                pnlPercent: newInvested > 0 ? (newPnL / newInvested) * 100 : 0
              };
            }
            return p;
          }).filter(Boolean);
          return updated;
        });

        // Update user balance
        updateUser({ balance: user.balance + finalAmount });
      }

      setShowOrderModal(false);
      setQuantity(1);
      alert(`✅ ${orderType} order executed successfully!`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to watchlist
  const handleAddToWatchlist = (symbol) => {
    if (!watchlist.find(w => w.symbol === symbol)) {
      setWatchlist(prev => [...prev, {
        symbol,
        addedDate: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  // Remove from watchlist
  const handleRemoveFromWatchlist = (symbol) => {
    setWatchlist(prev => prev.filter(w => w.symbol !== symbol));
  };
  // Main render function
return (
  <div className="stock-market">
    {/* Market Header */}
    <div className="market-header">
      <div className="market-info">
        <h1>📈 StockForge Exchange</h1>
        <div className="market-status">
          <span className={`status-indicator ${marketStatus?.isOpen ? 'open' : 'closed'}`}>
            {marketStatus?.isOpen ? '🟢 Market Open' : '🔴 Market Closed'}
          </span>
          <span className="market-time">
            {new Date().toLocaleTimeString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              hour12: false 
            })} IST
          </span>
        </div>
        <div className="market-indices">
          <div className="index-item">
            <span className="index-name">STOCKFORGE 50</span>
            <span className="index-value">15,248.32</span>
            <span className="index-change positive">+127.45 (+0.84%)</span>
          </div>
          <div className="index-item">
            <span className="index-name">NIFTY GAMING</span>
            <span className="index-value">8,956.78</span>
            <span className="index-change negative">-23.12 (-0.26%)</span>
          </div>
        </div>
      </div>
      
      <div className="user-portfolio-summary">
        <div className="portfolio-stats">
          <div className="stat">
            <span className="label">Available Balance</span>
            <span className="value">{formatCurrency(user?.balance || 0)}</span>
          </div>
          <div className="stat">
            <span className="label">Portfolio Value</span>
            <span className="value">{formatCurrency(portfolio.reduce((sum, stock) => sum + stock.currentValue, 0))}</span>
          </div>
          <div className="stat">
            <span className="label">Total P&L</span>
            <span className={`value ${portfolio.reduce((sum, stock) => sum + stock.pnl, 0) >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(portfolio.reduce((sum, stock) => sum + stock.pnl, 0))}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Navigation Tabs */}
    <div className="market-tabs">
      <button 
        className={`tab ${activeTab === 'market' ? 'active' : ''}`}
        onClick={() => setActiveTab('market')}
      >
        📊 Market Watch
      </button>
      <button 
        className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
        onClick={() => setActiveTab('portfolio')}
      >
        💼 My Portfolio
      </button>
      <button 
        className={`tab ${activeTab === 'watchlist' ? 'active' : ''}`}
        onClick={() => setActiveTab('watchlist')}
      >
        ⭐ Watchlist
      </button>
      <button 
        className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
        onClick={() => setActiveTab('orders')}
      >
        📋 Orders
      </button>
      <button 
        className={`tab ${activeTab === 'ipo' ? 'active' : ''}`}
        onClick={() => setActiveTab('ipo')}
      >
        🚀 IPO Center
      </button>
    </div>

    {/* Market Watch Tab */}
    {activeTab === 'market' && (
      <div className="market-watch">
        <div className="market-filters">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search stocks..." 
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button className="filter-btn active">All Stocks</button>
            <button className="filter-btn">Technology</button>
            <button className="filter-btn">Manufacturing</button>
            <button className="filter-btn">Energy</button>
            <button className="filter-btn">Finance</button>
            <button className="filter-btn">Healthcare</button>
          </div>
        </div>

        <div className="stocks-table">
          <div className="table-header">
            <div className="col-symbol">Symbol</div>
            <div className="col-company">Company</div>
            <div className="col-price">Price</div>
            <div className="col-change">Change</div>
            <div className="col-volume">Volume</div>
            <div className="col-marketcap">Market Cap</div>
            <div className="col-actions">Actions</div>
          </div>
          
          <div className="table-body">
            {marketData.map((stock, index) => (
              <div key={stock.symbol} className="stock-row">
                <div className="col-symbol">
                  <span className="symbol">{stock.symbol}</span>
                  {stock.isPlayerCompany && <span className="my-company">👑</span>}
                </div>
                <div className="col-company">
                  <div className="company-info">
                    <span className="name">{stock.name}</span>
                    <span className="sector">{stock.sector} • Level {stock.level}</span>
                    <span className="owner">CEO: {stock.owner}</span>
                  </div>
                </div>
                <div className="col-price">
                  <span className="price">₹{stock.price.toFixed(2)}</span>
                </div>
                <div className="col-change">
                  <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)}
                  </span>
                  <span className={`change-percent ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                    ({stock.changePercent}%)
                  </span>
                </div>
                <div className="col-volume">
                  {stock.volume.toLocaleString()}
                </div>
                <div className="col-marketcap">
                  {formatNumber(stock.marketCap)}
                </div>
                <div className="col-actions">
                  <button 
                    className="action-btn buy-btn"
                    onClick={() => {
                      handleStockSelect(stock);
                      setOrderType('BUY');
                      setShowOrderModal(true);
                    }}
                  >
                    Buy
                  </button>
                  <button 
                    className="action-btn sell-btn"
                    onClick={() => {
                      handleStockSelect(stock);
                      setOrderType('SELL');
                      setShowOrderModal(true);
                    }}
                  >
                    Sell
                  </button>
                  <button 
                    className="action-btn watch-btn"
                    onClick={() => handleAddToWatchlist(stock.symbol)}
                  >
                    ⭐
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Portfolio Tab */}
    {activeTab === 'portfolio' && (
      <div className="portfolio-section">
        <div className="portfolio-summary">
          <div className="summary-cards">
            <div className="summary-card">
              <h3>💰 Total Investment</h3>
              <p className="amount">{formatCurrency(portfolio.reduce((sum, stock) => sum + stock.invested, 0))}</p>
            </div>
            <div className="summary-card">
              <h3>📈 Current Value</h3>
              <p className="amount">{formatCurrency(portfolio.reduce((sum, stock) => sum + stock.currentValue, 0))}</p>
            </div>
            <div className="summary-card">
              <h3>💸 Total P&L</h3>
              <p className={`amount ${portfolio.reduce((sum, stock) => sum + stock.pnl, 0) >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(portfolio.reduce((sum, stock) => sum + stock.pnl, 0))}
              </p>
            </div>
            <div className="summary-card">
              <h3>📊 P&L %</h3>
              <p className={`amount ${portfolio.reduce((sum, stock) => sum + stock.pnl, 0) >= 0 ? 'positive' : 'negative'}`}>
                {portfolio.reduce((sum, stock) => sum + stock.invested, 0) > 0 
                  ? ((portfolio.reduce((sum, stock) => sum + stock.pnl, 0) / portfolio.reduce((sum, stock) => sum + stock.invested, 0)) * 100).toFixed(2)
                  : '0.00'
                }%
              </p>
            </div>
          </div>
        </div>

        <div className="holdings-table">
          <div className="table-header">
            <div className="col-symbol">Symbol</div>
            <div className="col-quantity">Quantity</div>
            <div className="col-avgprice">Avg Price</div>
            <div className="col-ltp">LTP</div>
            <div className="col-invested">Invested</div>
            <div className="col-current">Current Value</div>
            <div className="col-pnl">P&L</div>
            <div className="col-actions">Actions</div>
          </div>
          
          <div className="table-body">
            {portfolio.map((holding, index) => (
              <div key={holding.symbol} className="holding-row">
                <div className="col-symbol">
                  <span className="symbol">{holding.symbol}</span>
                  <span className="company-name">{holding.name}</span>
                </div>
                <div className="col-quantity">{holding.quantity}</div>
                <div className="col-avgprice">₹{holding.avgPrice.toFixed(2)}</div>
                <div className="col-ltp">₹{holding.currentPrice.toFixed(2)}</div>
                <div className="col-invested">{formatCurrency(holding.invested)}</div>
                <div className="col-current">{formatCurrency(holding.currentValue)}</div>
                <div className="col-pnl">
                  <span className={`pnl ${holding.pnl >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(holding.pnl)}
                  </span>
                  <span className={`pnl-percent ${holding.pnl >= 0 ? 'positive' : 'negative'}`}>
                    ({holding.pnlPercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="col-actions">
                  <button 
                    className="action-btn sell-btn"
                    onClick={() => {
                      const stock = marketData.find(s => s.symbol === holding.symbol);
                      if (stock) {
                        handleStockSelect(stock);
                        setOrderType('SELL');
                        setShowOrderModal(true);
                      }
                    }}
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
            
            {portfolio.length === 0 && (
              <div className="empty-state">
                <h3>📊 No Holdings Yet</h3>
                <p>Start investing by buying stocks from the Market Watch</p>
                <button 
                  className="cta-btn"
                  onClick={() => setActiveTab('market')}
                >
                  Explore Market
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Watchlist Tab */}
    {activeTab === 'watchlist' && (
      <div className="watchlist-section">
        <div className="watchlist-header">
          <h2>⭐ My Watchlist</h2>
          <p>Keep track of your favorite stocks</p>
        </div>

        <div className="watchlist-table">
          <div className="table-header">
            <div className="col-symbol">Symbol</div>
            <div className="col-company">Company</div>
            <div className="col-price">Price</div>
            <div className="col-change">Change</div>
            <div className="col-actions">Actions</div>
          </div>
          
          <div className="table-body">
            {watchlist.map(item => {
              const stock = marketData.find(s => s.symbol === item.symbol);
              if (!stock) return null;
              
              return (
                <div key={item.symbol} className="watchlist-row">
                  <div className="col-symbol">{stock.symbol}</div>
                  <div className="col-company">
                    <span className="name">{stock.name}</span>
                    <span className="sector">{stock.sector}</span>
                  </div>
                  <div className="col-price">₹{stock.price.toFixed(2)}</div>
                  <div className="col-change">
                    <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                      {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.changePercent}%)
                    </span>
                  </div>
                  <div className="col-actions">
                    <button 
                      className="action-btn buy-btn"
                      onClick={() => {
                        handleStockSelect(stock);
                        setOrderType('BUY');
                        setShowOrderModal(true);
                      }}
                    >
                      Buy
                    </button>
                    <button 
                      className="action-btn remove-btn"
                      onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
            
            {watchlist.length === 0 && (
              <div className="empty-state">
                <h3>⭐ Watchlist Empty</h3>
                <p>Add stocks to your watchlist to track them easily</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
          {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="orders-section">
          <div className="orders-header">
            <h2>📋 Order History</h2>
            <div className="order-filters">
              <button className="filter-btn active">All Orders</button>
              <button className="filter-btn">Buy Orders</button>
              <button className="filter-btn">Sell Orders</button>
              <button className="filter-btn">Pending</button>
            </div>
          </div>

          <div className="orders-table">
            <div className="table-header">
              <div className="col-time">Time</div>
              <div className="col-symbol">Symbol</div>
              <div className="col-type">Type</div>
              <div className="col-quantity">Quantity</div>
              <div className="col-price">Price</div>
              <div className="col-total">Total</div>
              <div className="col-status">Status</div>
            </div>
            
            <div className="table-body">
              {orderHistory.map((order, index) => (
                <div key={order.id} className="order-row">
                  <div className="col-time">
                    {new Date(order.timestamp).toLocaleString('en-IN')}
                  </div>
                  <div className="col-symbol">{order.symbol}</div>
                  <div className="col-type">
                    <span className={`order-type ${order.type.toLowerCase()}`}>
                      {order.type}
                    </span>
                  </div>
                  <div className="col-quantity">{order.quantity}</div>
                  <div className="col-price">₹{order.price.toFixed(2)}</div>
                  <div className="col-total">{formatCurrency(order.total)}</div>
                  <div className="col-status">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              
              {orderHistory.length === 0 && (
                <div className="empty-state">
                  <h3>📋 No Orders Yet</h3>
                  <p>Your trading history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IPO Center Tab */}
      {activeTab === 'ipo' && (
        <div className="ipo-section">
          <div className="ipo-header">
            <h2>🚀 IPO Center</h2>
            <p>Invest in newly listed companies</p>
          </div>

          <div className="ipo-categories">
            <div className="category-tabs">
              <button className="category-btn active">🔥 Live IPOs</button>
              <button className="category-btn">📅 Upcoming IPOs</button>
              <button className="category-btn">✅ Recent Listings</button>
            </div>
          </div>

          <div className="ipo-listings">
            {marketData.filter(stock => stock.isPlayerCompany || Math.random() > 0.7).map((stock, index) => (
              <div key={stock.symbol} className="ipo-card">
                <div className="ipo-header-info">
                  <div className="company-details">
                    <h3>{stock.name}</h3>
                    <p className="sector">{stock.sector} • Level {stock.level}</p>
                    <p className="ceo">CEO: {stock.owner}</p>
                  </div>
                  <div className="ipo-status">
                    <span className="status-badge live">🔴 Live</span>
                    <span className="time-left">2d 14h left</span>
                  </div>
                </div>

                <div className="ipo-details">
                  <div className="detail-item">
                    <span className="label">IPO Price</span>
                    <span className="value">₹{stock.price.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Market Cap</span>
                    <span className="value">{formatNumber(stock.marketCap)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Employees</span>
                    <span className="value">{stock.employees}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Subscription</span>
                    <span className="value">{(Math.random() * 5 + 0.5).toFixed(1)}x</span>
                  </div>
                </div>

                <div className="ipo-description">
                  <p>
                    {stock.name} is seeking capital to expand operations and accelerate growth 
                    in the {stock.sector.toLowerCase()} sector. The company has shown consistent 
                    growth and is positioned for significant expansion.
                  </p>
                </div>

                <div className="ipo-actions">
                  <button 
                    className="ipo-invest-btn"
                    onClick={() => {
                      handleStockSelect(stock);
                      setOrderType('BUY');
                      setShowOrderModal(true);
                    }}
                  >
                    💰 Invest Now
                  </button>
                  <button className="ipo-details-btn">
                    📄 View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedStock && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content order-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {orderType === 'BUY' ? '💰 Buy' : '💸 Sell'} {selectedStock.symbol}
              </h3>
              <button className="close-btn" onClick={() => setShowOrderModal(false)}>×</button>
            </div>
            
            <div className="order-form">
              <div className="stock-info">
                <div className="stock-details">
                  <h4>{selectedStock.name}</h4>
                  <p>{selectedStock.sector} • Market Cap: {formatNumber(selectedStock.marketCap)}</p>
                </div>
                <div className="stock-price">
                  <span className="current-price">₹{selectedStock.price.toFixed(2)}</span>
                  <span className={`price-change ${selectedStock.change >= 0 ? 'positive' : 'negative'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}₹{selectedStock.change.toFixed(2)} ({selectedStock.changePercent}%)
                  </span>
                </div>
              </div>

              <div className="order-controls">
                <div className="order-type-toggle">
                  <button 
                    className={`toggle-btn ${orderType === 'BUY' ? 'active' : ''}`}
                    onClick={() => setOrderType('BUY')}
                  >
                    Buy
                  </button>
                  <button 
                    className={`toggle-btn ${orderType === 'SELL' ? 'active' : ''}`}
                    onClick={() => setOrderType('SELL')}
                  >
                    Sell
                  </button>
                </div>

                <div className="price-type-toggle">
                  <button 
                    className={`toggle-btn ${priceType === 'MARKET' ? 'active' : ''}`}
                    onClick={() => setPriceType('MARKET')}
                  >
                    Market
                  </button>
                  <button 
                    className={`toggle-btn ${priceType === 'LIMIT' ? 'active' : ''}`}
                    onClick={() => setPriceType('LIMIT')}
                  >
                    Limit
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max={orderType === 'SELL' ? 
                    (portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 0) : 
                    Math.floor(user?.balance / selectedStock.price) || 1
                  }
                />
                {orderType === 'SELL' && (
                  <small>
                    Available: {portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity || 0} shares
                  </small>
                )}
              </div>

              {priceType === 'LIMIT' && (
                <div className="form-group">
                  <label>Limit Price</label>
                  <input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                    min="0.01"
                    step="0.01"
                  />
                </div>
              )}

              <div className="order-summary">
                <div className="summary-row">
                  <span>Price per share:</span>
                  <span>₹{(priceType === 'MARKET' ? selectedStock.price : limitPrice).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Quantity:</span>
                  <span>{quantity}</span>
                </div>
                <div className="summary-row">
                  <span>Gross Amount:</span>
                  <span>₹{((priceType === 'MARKET' ? selectedStock.price : limitPrice) * quantity).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Brokerage (0.1%):</span>
                  <span>₹{(((priceType === 'MARKET' ? selectedStock.price : limitPrice) * quantity) * 0.001).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>
                    ₹{(((priceType === 'MARKET' ? selectedStock.price : limitPrice) * quantity) * 
                      (orderType === 'BUY' ? 1.001 : 0.999)).toFixed(2)}
                  </span>
                </div>
              </div>

              {orderType === 'BUY' && (
                <div className="balance-check">
                  <span>Available Balance: {formatCurrency(user?.balance || 0)}</span>
                  {user?.balance < (((priceType === 'MARKET' ? selectedStock.price : limitPrice) * quantity) * 1.001) && (
                    <span className="insufficient-balance">⚠️ Insufficient Balance</span>
                  )}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowOrderModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={`place-order-btn ${orderType.toLowerCase()}`}
                  onClick={handlePlaceOrder}
                  disabled={loading || 
                    (orderType === 'BUY' && user?.balance < (((priceType === 'MARKET' ? selectedStock.price : limitPrice) * quantity) * 1.001)) ||
                    (orderType === 'SELL' && (!portfolio.find(p => p.symbol === selectedStock.symbol) || 
                      portfolio.find(p => p.symbol === selectedStock.symbol)?.quantity < quantity))
                  }
                >
                  {loading ? 'Processing...' : `${orderType} ${quantity} Shares`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          ❌ {error}
          <button className="toast-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing your order...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockMarket;
