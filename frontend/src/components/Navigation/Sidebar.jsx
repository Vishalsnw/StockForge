import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, currentPage, onPageChange, onClose, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [quickStats, setQuickStats] = useState({
    todayTrades: 8,
    activeOrders: 3,
    watchlistItems: 15,
    portfolioValue: 125000,
    dayPnL: 2500,
    weekPnL: 8750
  });

  // Navigation menu items
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/',
      description: 'Overview & Analytics'
    },
    {
      id: 'trading',
      label: 'Trading',
      icon: '📈',
      path: '/trading',
      description: 'Buy & Sell Stocks',
      submenu: [
        { id: 'market', label: 'Market Orders', icon: '💹', path: '/trading/market' },
        { id: 'limit', label: 'Limit Orders', icon: '⚡', path: '/trading/limit' },
        { id: 'stop-loss', label: 'Stop Loss', icon: '🛡️', path: '/trading/stop-loss' },
        { id: 'watchlist', label: 'Watchlist', icon: '👁️', path: '/trading/watchlist' }
      ]
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      path: '/portfolio',
      description: 'Holdings & Performance',
      submenu: [
        { id: 'holdings', label: 'My Holdings', icon: '📊', path: '/portfolio/holdings' },
        { id: 'orders', label: 'Order History', icon: '📋', path: '/portfolio/orders' },
        { id: 'pnl', label: 'P&L Report', icon: '💰', path: '/portfolio/pnl' },
        { id: 'analytics', label: 'Analytics', icon: '📈', path: '/portfolio/analytics' }
      ]
    },
    {
      id: 'company',
      label: 'Company',
      icon: '🏢',
      path: '/company',
      description: 'Manage Your Company',
      submenu: [
        { id: 'overview', label: 'Company Overview', icon: '🏛️', path: '/company/overview' },
        { id: 'financials', label: 'Financials', icon: '💹', path: '/company/financials' },
        { id: 'employees', label: 'Employees', icon: '👥', path: '/company/employees' },
        { id: 'board', label: 'Board Members', icon: '👔', path: '/company/board' }
      ]
    },
    {
      id: 'ipo',
      label: 'IPO Center',
      icon: '🚀',
      path: '/ipo',
      description: 'Initial Public Offerings',
      badge: 'New',
      submenu: [
        { id: 'upcoming', label: 'Upcoming IPOs', icon: '⏳', path: '/ipo/upcoming' },
        { id: 'live', label: 'Live IPOs', icon: '🔴', path: '/ipo/live' },
        { id: 'my-applications', label: 'My Applications', icon: '📝', path: '/ipo/applications' },
        { id: 'allotment', label: 'Allotment Status', icon: '✅', path: '/ipo/allotment' }
      ]
    }
  ];

  const bottomMenuItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings',
      description: 'App Preferences'
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: '❓',
      path: '/help',
      description: 'Get Help'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile',
      description: 'User Settings'
    }
  ];

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  }, [location.pathname, onClose]);

  // Handle menu item click
  const handleMenuClick = (item, event) => {
    event.preventDefault();
    
    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
    } else {
      navigate(item.path);
      onPageChange(item.id);
      if (window.innerWidth <= 768) {
        onClose();
      }
    }
  };

  // Handle submenu item click
  const handleSubmenuClick = (item, event) => {
    event.preventDefault();
    navigate(item.path);
    onPageChange(item.id);
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  // Check if menu item is active
  const isMenuActive = (item) => {
    return location.pathname === item.path || 
           (item.submenu && item.submenu.some(sub => location.pathname === sub.path));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose}></div>
      )}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">
              <span className="avatar-text">
                {user?.username?.charAt(0)?.toUpperCase() || 'V'}
              </span>
              <div className="online-indicator"></div>
            </div>
            <div className="user-info">
              <h3 className="username">{user?.username || 'Vishalsnw'}</h3>
              <p className="user-status">Professional Trader</p>
              <div className="user-stats">
                <span className="stat-item">
                  <span className="stat-icon">📊</span>
                  Level 12
                </span>
                <span className="stat-item">
                  <span className="stat-icon">🔥</span>
                  156 Trades
                </span>
              </div>
            </div>
          </div>
          
          <button className="sidebar-close" onClick={onClose}>
            <span className="close-icon">✕</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stats-header">
            <h4>Today's Summary</h4>
            <span className="live-indicator">🔴 Live</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{quickStats.todayTrades}</div>
              <div className="stat-label">Trades</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{quickStats.activeOrders}</div>
              <div className="stat-label">Active Orders</div>
            </div>
            <div className="stat-card">
              <div className={`stat-value ${quickStats.dayPnL >= 0 ? 'positive' : 'negative'}`}>
                {quickStats.dayPnL >= 0 ? '+' : ''}{formatCurrency(quickStats.dayPnL)}
              </div>
              <div className="stat-label">Day P&L</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatCurrency(quickStats.portfolioValue)}</div>
              <div className="stat-label">Portfolio</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h5 className="nav-section-title">Main Navigation</h5>
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${isMenuActive(item) ? 'active' : ''}`}
                    onClick={(e) => handleMenuClick(item, e)}
                  >
                    <div className="nav-link-content">
                      <span className="nav-icon">{item.icon}</span>
                      <div className="nav-text">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                    {item.submenu && (
                      <span className={`nav-arrow ${activeSubmenu === item.id ? 'expanded' : ''}`}>
                        ⌄
                      </span>
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {item.submenu && (
                    <ul className={`submenu ${activeSubmenu === item.id ? 'submenu-open' : ''}`}>
                      {item.submenu.map((subItem) => (
                        <li key={subItem.id} className="submenu-item">
                          <button
                            className={`submenu-link ${location.pathname === subItem.path ? 'active' : ''}`}
                            onClick={(e) => handleSubmenuClick(subItem, e)}
                          >
                            <span className="submenu-icon">{subItem.icon}</span>
                            <span className="submenu-label">{subItem.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Menu */}
          <div className="nav-section nav-section-bottom">
            <h5 className="nav-section-title">Account</h5>
            <ul className="nav-list">
              {bottomMenuItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${isMenuActive(item) ? 'active' : ''}`}
                    onClick={(e) => handleMenuClick(item, e)}
                  >
                    <div className="nav-link-content">
                      <span className="nav-icon">{item.icon}</span>
                      <div className="nav-text">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="footer-info">
            <div className="app-version">
              <span className="version-label">StockForge</span>
              <span className="version-number">v2.0</span>
            </div>
            <div className="market-status">
              <span className="status-dot online"></span>
              <span className="status-text">Market Open</span>
            </div>
          </div>
          
          <div className="footer-actions">
            <button className="action-btn" title="Refresh Data">
              <span className="action-icon">🔄</span>
            </button>
            <button className="action-btn" title="Notifications">
              <span className="action-icon">🔔</span>
              <span className="notification-dot"></span>
            </button>
            <button className="action-btn" title="Full Screen">
              <span className="action-icon">⛶</span>
            </button>
          </div>
        </div>

        {/* Progress Bar for Level */}
        <div className="level-progress">
          <div className="progress-header">
            <span className="progress-label">Level 12 Progress</span>
            <span className="progress-percentage">78%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '78%' }}></div>
          </div>
          <div className="progress-info">
            <span className="progress-text">1,248 / 1,600 XP</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
