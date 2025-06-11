import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import { useMarket } from '../../context/MarketContext';
import { useTrading } from '../../context/TradingContext';
import { useGame } from '../../context/GameContext';
import CompanyDashboard from '../Company/CompanyDashboard';
import StockMarket from '../Trading/StockMarket';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { playerCompany } = useCompany();
  const { marketStatus, indices, formatCurrency } = useMarket();
  const { portfolio, tradingStats } = useTrading();
  const { playerProgress, notifications, dailyChallenge, gameStats } = useGame();

  const [activeSection, setActiveSection] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Navigation items
  const navigationItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: '📊',
      description: 'Dashboard overview'
    },
    {
      id: 'company',
      name: 'My Company',
      icon: '🏢',
      description: 'Company management'
    },
    {
      id: 'trading',
      name: 'Stock Market',
      icon: '📈',
      description: 'Trading platform'
    },
    {
      id: 'leaderboards',
      name: 'Leaderboards',
      icon: '🏆',
      description: 'Rankings and achievements'
    },
    {
      id: 'resources',
      name: 'Resources',
      icon: '⛏️',
      description: 'Resource management'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      description: 'Game settings'
    }
  ];

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle navigation
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Overview section component
  const OverviewSection = () => (
    <div className="overview-section">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div className="welcome-content">
          <h1>Welcome back, {user.username}! 👋</h1>
          <p className="user-title">
            {playerProgress.title} • Level {playerProgress.level}
          </p>
          <div className="current-time">
            📅 {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            <br />
            🕐 {currentTime.toLocaleTimeString('en-IN')}
          </div>
        </div>
        
        <div className="user-stats-quick">
          <div className="stat-quick">
            <span className="label">Balance</span>
            <span className="value">{formatCurrency(user.balance)}</span>
          </div>
          <div className="stat-quick">
            <span className="label">XP</span>
            <span className="value">{playerProgress.xp}/{playerProgress.xpToNext}</span>
          </div>
          {playerProgress.rank && (
            <div className="stat-quick">
              <span className="label">Rank</span>
              <span className="value">#{playerProgress.rank}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="quick-stats-grid">
        {/* Market Status */}
        <div className="stat-card market-status-card">
          <div className="card-header">
            <h3>📈 Market Status</h3>
            <span className={`status-badge ${marketStatus.isOpen ? 'open' : 'closed'}`}>
              {marketStatus.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div className="card-content">
            <div className="market-indices-mini">
              {Object.entries(indices).slice(0, 2).map(([key, index]) => (
                <div key={key} className="index-mini">
                  <span className="index-name">{index.name}</span>
                  <div className="index-data">
                    <span className="value">{index.value.toFixed(2)}</span>
                    <span className={`change ${index.change >= 0 ? 'positive' : 'negative'}`}>
                      {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Status */}
        <div className="stat-card company-status-card">
          <div className="card-header">
            <h3>🏢 My Company</h3>
            {playerCompany && (
              <span className="level-badge">Level {playerCompany.level}</span>
            )}
          </div>
          <div className="card-content">
            {playerCompany ? (
              <div className="company-quick-info">
                <div className="company-name">{playerCompany.name}</div>
                <div className="company-stats-mini">
                  <div className="stat-mini">
                    <span>Valuation</span>
                    <span>{formatCurrency(playerCompany.valuation)}</span>
                  </div>
                  <div className="stat-mini">
                    <span>Employees</span>
                    <span>{playerCompany.employees}</span>
                  </div>
                  <div className="stat-mini">
                    <span>Revenue</span>
                    <span>{formatCurrency(playerCompany.monthlyRevenue)}</span>
                  </div>
                </div>
                <button 
                  className="quick-action-btn"
                  onClick={() => setActiveSection('company')}
                >
                  Manage Company
                </button>
              </div>
            ) : (
              <div className="no-company-prompt">
                <p>You haven't created a company yet</p>
                <button 
                  className="create-company-btn"
                  onClick={() => setActiveSection('company')}
                >
                  Create Company
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Status */}
        <div className="stat-card portfolio-status-card">
          <div className="card-header">
            <h3>💼 Portfolio</h3>
            <span className="holdings-count">{portfolio.length} Holdings</span>
          </div>
          <div className="card-content">
            <div className="portfolio-quick-stats">
              <div className="stat-mini">
                <span>Invested</span>
                <span>{formatCurrency(tradingStats.totalInvested)}</span>
              </div>
              <div className="stat-mini">
                <span>Current Value</span>
                <span>{formatCurrency(tradingStats.currentValue)}</span>
              </div>
              <div className="stat-mini">
                <span>P&L</span>
                <span className={tradingStats.totalPnL >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(tradingStats.totalPnL)}
                </span>
              </div>
            </div>
            <button 
              className="quick-action-btn"
              onClick={() => setActiveSection('trading')}
            >
              View Portfolio
            </button>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="stat-card challenge-card">
          <div className="card-header">
            <h3>🎯 Daily Challenge</h3>
            {dailyChallenge?.completed && <span className="completed-badge">✅ Done</span>}
          </div>
          <div className="card-content">
            {dailyChallenge ? (
              <div className="challenge-info">
                <div className="challenge-name">
                  {dailyChallenge.icon} {dailyChallenge.name}
                </div>
                <div className="challenge-description">
                  {dailyChallenge.description}
                </div>
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(dailyChallenge.progress / dailyChallenge.target) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {dailyChallenge.progress} / {dailyChallenge.target}
                  </span>
                </div>
                <div className="challenge-reward">
                  Reward: +{dailyChallenge.reward.xp} XP, +₹{dailyChallenge.reward.money}
                </div>
              </div>
            ) : (
              <div className="no-challenge">
                <p>No challenge available today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <h2>📋 Recent Activity</h2>
        <div className="activity-cards">
          <div className="activity-card">
            <h4>📈 Latest Trades</h4>
            <div className="activity-list">
              {portfolio.length > 0 ? (
                portfolio.slice(0, 3).map((holding, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-text">
                      Holding {holding.quantity} shares of {holding.symbol}
                    </span>
                    <span className={`activity-value ${holding.pnl >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(holding.currentValue)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <span className="activity-text">No recent trades</span>
                </div>
              )}
            </div>
          </div>

          <div className="activity-card">
            <h4>🏆 Recent Achievements</h4>
            <div className="activity-list">
              {/* This would show recent achievements */}
              <div className="activity-item">
                <span className="activity-text">Check achievements page for progress</span>
              </div>
            </div>
          </div>

          <div className="activity-card">
            <h4>🌍 Game Stats</h4>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-text">Total Players</span>
                <span className="activity-value">{gameStats.totalPlayers.toLocaleString()}</span>
              </div>
              <div className="activity-item">
                <span className="activity-text">Active Companies</span>
                <span className="activity-value">{gameStats.activeCompanies.toLocaleString()}</span>
              </div>
              <div className="activity-item">
                <span className="activity-text">Market Volume</span>
                <span className="activity-value">{formatCurrency(gameStats.marketVolume)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <h2>🎮 StockForge</h2>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search companies, players..." 
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>

        <div className="nav-right">
          <button 
            className="notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          <div className="user-menu">
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className="balance">{formatCurrency(user.balance)}</span>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>🔔 Notifications</h3>
            <button 
              className="close-notifications"
              onClick={() => setShowNotifications(false)}
            >
              ✕
            </button>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon">{notification.icon}</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-body">
        {/* Side Navigation */}
        <div className="side-nav">
          <div className="nav-items">
            {navigationItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
                title={item.description}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="nav-footer">
            <div className="level-progress">
              <div className="level-info">
                <span>Level {playerProgress.level}</span>
                <span>{playerProgress.xp}/{playerProgress.xpToNext} XP</span>
              </div>
              <div className="xp-bar">
                <div 
                  className="xp-fill"
                  style={{ 
                    width: `${(playerProgress.xp / playerProgress.xpToNext) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'company' && <CompanyDashboard />}
          {activeSection === 'trading' && <StockMarket />}
          {activeSection === 'leaderboards' && (
            <div className="coming-soon">
              <h2>🏆 Leaderboards</h2>
              <p>Coming soon...</p>
            </div>
          )}
          {activeSection === 'resources' && (
            <div className="coming-soon">
              <h2>⛏️ Resources</h2>
              <p>Coming soon...</p>
            </div>
          )}
          {activeSection === 'settings' && (
            <div className="coming-soon">
              <h2>⚙️ Settings</h2>
              <p>Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
