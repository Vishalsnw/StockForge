import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({
    name: 'Vishalsnw',
    balance: 100000,
    portfolio: 25000,
    totalValue: 125000,
    dayChange: 2500,
    dayChangePercent: 2.04
  });

  const [marketStats, setMarketStats] = useState({
    totalVolume: '₹12,45,67,890',
    activeTraders: 1247,
    totalCompanies: 156,
    marketCap: '₹89,45,23,67,890'
  });

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="user-info">
          <h1>Welcome back, {user.name}!</h1>
          <p className="current-time">{new Date().toLocaleString()}</p>
        </div>
        <div className="market-status">
          <span className="market-open">🟢 Market Open</span>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="portfolio-overview">
        <div className="balance-card">
          <h3>Total Balance</h3>
          <div className="balance-amount">₹{user.totalValue.toLocaleString()}</div>
          <div className={`day-change ${user.dayChange >= 0 ? 'positive' : 'negative'}`}>
            {user.dayChange >= 0 ? '+' : ''}₹{user.dayChange.toLocaleString()} 
            ({user.dayChangePercent}%)
          </div>
        </div>

        <div className="portfolio-breakdown">
          <div className="breakdown-item">
            <span>Cash</span>
            <span>₹{user.balance.toLocaleString()}</span>
          </div>
          <div className="breakdown-item">
            <span>Investments</span>
            <span>₹{user.portfolio.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="market-stats">
        <h3>Market Overview</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{marketStats.totalVolume}</div>
            <div className="stat-label">Today's Volume</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{marketStats.activeTraders}</div>
            <div className="stat-label">Active Traders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{marketStats.totalCompanies}</div>
            <div className="stat-label">Listed Companies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{marketStats.marketCap}</div>
            <div className="stat-label">Market Cap</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn primary">
            📈 Start Trading
          </button>
          <button className="action-btn secondary">
            🏢 Manage Company
          </button>
          <button className="action-btn secondary">
            📊 View Portfolio
          </button>
          <button className="action-btn secondary">
            💰 IPO Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
