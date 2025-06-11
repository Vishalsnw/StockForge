// ===== STOCKFORGE MARKET DASHBOARD COMPONENT =====
// ===== MAIN TRADING INTERFACE =====

// 🎯 Built for: Vishalsnw
// 📅 Created: 2025-06-11 21:48:57 UTC
// 🚀 Version: 2.1.0
// 📍 Path: src/components/MarketDashboard/MarketDashboard.jsx

import React, { useState, useEffect } from 'react';
import useBotMarket from '../../hooks/useBotMarket.js';
import './MarketDashboard.css';

// ===== CURRENT SESSION INFO =====
const CURRENT_USER = 'Vishalsnw';
const CREATED_AT = '2025-06-11 21:48:57';
const BUILD_VERSION = '2.1.0';

const MarketDashboard = ({ user, sessionStart, appVersion }) => {
  // ===== MARKET HOOK INTEGRATION =====
  const {
    isEngineRunning,
    startEngine,
    stopEngine,
    toggleEngine,
    quotes,
    companies,
    marketSummary,
    lastUpdate,
    updateCount,
    getMarketMovers,
    getSectorPerformance,
    getEngineStatus,
    getCurrentTime
  } = useBotMarket();

  // ===== COMPONENT STATE =====
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStock, setSelectedStock] = useState(null);
  const [marketMovers, setMarketMovers] = useState({ gainers: [], losers: [], mostActive: [] });
  const [sectorData, setSectorData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // ===== COMPONENT INITIALIZATION =====
  useEffect(() => {
    console.log(`🏦 MarketDashboard initializing for ${CURRENT_USER} at ${CREATED_AT} UTC`);
    console.log(`📊 Dashboard version: ${BUILD_VERSION}`);
    console.log(`👤 User: ${user || CURRENT_USER}`);
    
    // Initialize dashboard
    setTimeout(() => {
      setIsLoading(false);
      console.log(`✅ Dashboard ready for ${CURRENT_USER}`);
    }, 1500);
  }, [user]);

  // ===== UPDATE MARKET DATA =====
  useEffect(() => {
    if (quotes.size > 0) {
      const movers = getMarketMovers();
      setMarketMovers(movers);
      
      const sectors = getSectorPerformance();
      setSectorData(sectors);
    }
  }, [quotes, getMarketMovers, getSectorPerformance]);

  // ===== HANDLE STOCK SELECTION =====
  const handleStockSelect = (ticker) => {
    const quote = Array.from(quotes.values()).find(q => q.ticker === ticker);
    setSelectedStock(quote);
    console.log(`📊 Stock selected: ${ticker} for ${CURRENT_USER}`);
  };

  // ===== FILTER STOCKS BY SEARCH =====
  const filteredStocks = React.useMemo(() => {
    if (!searchTerm) return Array.from(quotes.values()).slice(0, 20);
    
    return Array.from(quotes.values())
      .filter(stock => 
        stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 20);
  }, [quotes, searchTerm]);

  // ===== FORMAT CURRENCY =====
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // ===== FORMAT PERCENTAGE =====
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <h2>🏦 Loading StockForge Dashboard</h2>
          <p>👤 Preparing market data for {CURRENT_USER}</p>
          <p>🕒 {CREATED_AT} UTC</p>
        </div>
      </div>
    );
  }

  // ===== MAIN DASHBOARD RENDER =====
  return (
    <div className="market-dashboard">
      
      {/* ===== DASHBOARD HEADER ===== */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📊 Market Dashboard</h1>
          <p>👤 {CURRENT_USER} • 🕒 {getCurrentTime()} UTC</p>
        </div>
        
        <div className="header-right">
          <div className="engine-controls">
            <button 
              className={`engine-btn ${isEngineRunning ? 'stop' : 'start'}`}
              onClick={toggleEngine}
            >
              {isEngineRunning ? '⏹️ Stop Engine' : '🚀 Start Engine'}
            </button>
            <div className="engine-status">
              <span className={`status-dot ${isEngineRunning ? 'active' : 'inactive'}`}></span>
              <span>{isEngineRunning ? 'Running' : 'Stopped'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MARKET OVERVIEW STATS ===== */}
      <div className="market-stats">
        <div className="stat-card">
          <h3>📈 Total Stocks</h3>
          <div className="stat-value">{quotes.size}</div>
        </div>
        
        <div className="stat-card">
          <h3>🔄 Updates</h3>
          <div className="stat-value">{updateCount}</div>
        </div>
        
        <div className="stat-card">
          <h3>📊 Gainers</h3>
          <div className="stat-value text-success">{marketMovers.gainers.length}</div>
        </div>
        
        <div className="stat-card">
          <h3>📉 Losers</h3>
          <div className="stat-value text-danger">{marketMovers.losers.length}</div>
        </div>
      </div>

      {/* ===== NAVIGATION TABS ===== */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'movers' ? 'active' : ''}`}
          onClick={() => setActiveTab('movers')}
        >
          🚀 Market Movers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sectors' ? 'active' : ''}`}
          onClick={() => setActiveTab('sectors')}
        >
          🏢 Sectors
        </button>
        <button 
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="tab-content">
        
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="overview-grid">
              
              <div className="overview-card">
                <h3>🎯 Market Summary</h3>
                <div className="summary-info">
                  <p><strong>Engine Status:</strong> {isEngineRunning ? '🟢 Active' : '🔴 Inactive'}</p>
                  <p><strong>Last Update:</strong> {lastUpdate || 'Never'}</p>
                  <p><strong>Total Companies:</strong> {companies.length}</p>
                  <p><strong>Live Quotes:</strong> {quotes.size}</p>
                </div>
              </div>
              
              <div className="overview-card">
                <h3>📈 Top Gainers (Quick View)</h3>
                <div className="quick-list">
                  {marketMovers.gainers.slice(0, 5).map((stock, index) => (
                    <div key={stock.ticker} className="quick-item">
                      <span className="ticker">{stock.ticker}</span>
                      <span className="change text-success">
                        {formatPercentage(stock.changePercent)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* ===== MARKET MOVERS TAB ===== */}
        {activeTab === 'movers' && (
          <div className="movers-content">
            <div className="movers-grid">
              
              {/* Top Gainers */}
              <div className="movers-section">
                <h3>📈 Top Gainers</h3>
                <div className="stocks-list">
                  {marketMovers.gainers.slice(0, 10).map((stock) => (
                    <div key={stock.ticker} className="stock-item" onClick={() => handleStockSelect(stock.ticker)}>
                      <div className="stock-info">
                        <div className="stock-ticker">{stock.ticker}</div>
                        <div className="stock-name">{stock.name}</div>
                      </div>
                      <div className="stock-price">
                        <div className="price">{formatCurrency(stock.price)}</div>
                        <div className="change text-success">
                          {formatPercentage(stock.changePercent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Losers */}
              <div className="movers-section">
                <h3>📉 Top Losers</h3>
                <div className="stocks-list">
                  {marketMovers.losers.slice(0, 10).map((stock) => (
                    <div key={stock.ticker} className="stock-item" onClick={() => handleStockSelect(stock.ticker)}>
                      <div className="stock-info">
                        <div className="stock-ticker">{stock.ticker}</div>
                        <div className="stock-name">{stock.name}</div>
                      </div>
                      <div className="stock-price">
                        <div className="price">{formatCurrency(stock.price)}</div>
                        <div className="change text-danger">
                          {formatPercentage(stock.changePercent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ===== SECTORS TAB ===== */}
        {activeTab === 'sectors' && (
          <div className="sectors-content">
            <h3>🏢 Sector Performance</h3>
            <div className="sectors-grid">
              {sectorData.slice(0, 8).map((sector) => (
                <div key={sector.name} className="sector-card">
                  <h4>{sector.name}</h4>
                  <div className="sector-stats">
                    <div className="sector-change">
                      <span className={`change ${sector.avgChange >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatPercentage(sector.avgChange)}
                      </span>
                    </div>
                    <div className="sector-companies">
                      {sector.companies.length} companies
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SEARCH TAB ===== */}
        {activeTab === 'search' && (
          <div className="search-content">
            <div className="search-header">
              <h3>🔍 Stock Search</h3>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by ticker or company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="search-results">
              {filteredStocks.map((stock) => (
                <div key={stock.ticker} className="stock-item" onClick={() => handleStockSelect(stock.ticker)}>
                  <div className="stock-info">
                    <div className="stock-ticker">{stock.ticker}</div>
                    <div className="stock-name">{stock.name}</div>
                    <div className="stock-sector">{stock.sector}</div>
                  </div>
                  <div className="stock-price">
                    <div className="price">{formatCurrency(stock.price)}</div>
                    <div className={`change ${stock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercentage(stock.changePercent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ===== SELECTED STOCK DETAILS ===== */}
      {selectedStock && (
        <div className="stock-details">
          <div className="details-header">
            <h3>📊 {selectedStock.ticker} - {selectedStock.name}</h3>
            <button onClick={() => setSelectedStock(null)} className="close-btn">✕</button>
          </div>
          <div className="details-content">
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Price:</span>
                <span className="value">{formatCurrency(selectedStock.price)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Change:</span>
                <span className={`value ${selectedStock.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatPercentage(selectedStock.changePercent)}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Volume:</span>
                <span className="value">{selectedStock.volume.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="label">Sector:</span>
                <span className="value">{selectedStock.sector}</span>
              </div>
              <div className="detail-item">
                <span className="label">Market Cap:</span>
                <span className="value">${(selectedStock.marketCap / 1000000000).toFixed(2)}B</span>
              </div>
              <div className="detail-item">
                <span className="label">Last Update:</span>
                <span className="value">{selectedStock.lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DASHBOARD FOOTER ===== */}
      <div className="dashboard-footer">
        <div className="footer-info">
          <span>🎮 StockForge v{BUILD_VERSION}</span>
          <span>👤 {CURRENT_USER}</span>
          <span>🕒 Session: {sessionStart}</span>
          <span>📊 Live Market Data</span>
        </div>
      </div>

    </div>
  );
};

// ===== EXPORT COMPONENT =====
export default MarketDashboard;

// ===== FINAL SESSION LOG =====
console.log(`🎯 MarketDashboard component ready for ${CURRENT_USER} at ${CREATED_AT} UTC`);
console.log(`📊 Features: Market overview, movers, sectors, search, real-time data`);
console.log(`🚀 Production ready dashboard!`);

// ===== COMPONENT METADATA =====
/*
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🏦 STOCKFORGE MARKET DASHBOARD                            ║
║                   *** MAIN TRADING INTERFACE ***                            ║
║                                                                              ║
║  🎯 USER: Vishalsnw                                                          ║
║  📅 DATE: 2025-06-11 21:48:57 UTC                                           ║
║  📍 PATH: src/components/MarketDashboard/MarketDashboard.jsx                 ║
║  🚀 STATUS: Production Ready ✅                                              ║
║                                                                              ║
║  📦 FEATURES:                                                                ║
║  • Real-time market engine integration                                      ║
║  • Market overview and statistics                                           ║
║  • Top gainers and losers                                                   ║
║  • Sector performance analysis                                              ║
║  • Stock search and filtering                                               ║
║  • Detailed stock information                                               ║
║  • Engine control interface                                                 ║
║  • Responsive tabbed layout                                                 ║
║                                                                              ║
║  🎮 STOCKFORGE MARKET DASHBOARD READY!                                      ║
╚══════════════════════════════════════════════════════════════════════════════╝
*/
