import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ 
  user, 
  marketStatus, 
  onToggleSidebar, 
  onToggleTheme, 
  currentTheme, 
  onLogout 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'trade',
      message: 'BUY order for RELIANCE executed at ₹2,450.75',
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'market',
      message: 'Market opened - Trading session started',
      time: '15 min ago',
      read: false
    },
    {
      id: 3,
      type: 'portfolio',
      message: 'Your portfolio gained ₹2,500 today',
      time: '1 hour ago',
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section') && !event.target.closest('.notifications-section')) {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileMenuToggle = (e) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleNotificationsToggle = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trade': return '📈';
      case 'market': return '🔔';
      case 'portfolio': return '💰';
      default: return '📢';
    }
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Section */}
        <div className="navbar-left">
          <button 
            className="menu-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          <div className="logo-section">
            <h1 className="logo">📊 StockForge</h1>
            <span className="version">v2.0</span>
          </div>
        </div>

        {/* Center Section - Market Info */}
        <div className="navbar-center">
          <div className="market-info">
            <div className={`market-status ${marketStatus.isOpen ? 'open' : 'closed'}`}>
              <span className="status-dot"></span>
              <span className="status-text">
                {marketStatus.isOpen ? 'Market Open' : 'Market Closed'}
              </span>
            </div>
            
            <div className="market-indices">
              <div className="index-item">
                <span className="index-name">NIFTY</span>
                <span className="index-value">19,845.30</span>
                <span className="index-change positive">+125.40</span>
              </div>
              <div className="index-item">
                <span className="index-name">SENSEX</span>
                <span className="index-value">66,598.91</span>
                <span className="index-change positive">+389.73</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Balance Display */}
          <div className="balance-display">
            <div className="balance-item">
              <span className="balance-label">Balance</span>
              <span className="balance-value">{formatBalance(user.balance)}</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">P&L</span>
              <span className={`balance-value ${user.dayChange >= 0 ? 'positive' : 'negative'}`}>
                {user.dayChange >= 0 ? '+' : ''}{formatBalance(user.dayChange)}
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {currentTheme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* Notifications */}
          <div className="notifications-section">
            <button 
              className="notifications-btn"
              onClick={handleNotificationsToggle}
              aria-label="View notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button 
                    className="clear-all-btn"
                    onClick={() => setNotifications(prev => 
                      prev.map(n => ({ ...n, read: true }))
                    )}
                  >
                    Mark all read
                  </button>
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <span>📭</span>
                      <p>No notifications</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        {!notification.read && <div className="unread-dot"></div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="profile-section">
            <button 
              className="profile-btn"
              onClick={handleProfileMenuToggle}
              aria-label="User menu"
            >
              <div className="profile-avatar">
                <span className="avatar-text">
                  {user.username?.charAt(0)?.toUpperCase() || 'V'}
                </span>
              </div>
              <div className="profile-info">
                <span className="username">{user.username || 'Vishalsnw'}</span>
                <span className="user-level">{user.level || 'Professional'}</span>
              </div>
              <span className="dropdown-arrow">⌄</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      <span className="avatar-text">
                        {user.username?.charAt(0)?.toUpperCase() || 'V'}
                      </span>
                    </div>
                    <div className="user-details">
                      <h3>{user.username || 'Vishalsnw'}</h3>
                      <p>{user.email || 'vishal@stockforge.com'}</p>
                      <span className="user-badge">{user.level || 'Professional Trader'}</span>
                    </div>
                  </div>
                </div>

                <div className="dropdown-menu">
                  <button className="menu-item">
                    <span className="menu-icon">👤</span>
                    Profile Settings
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">💼</span>
                    Portfolio
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">📊</span>
                    Trading History
                  </button>
                  <button className="menu-item">
                    <span className="menu-icon">⚙️</span>
                    Preferences
                  </button>
                  <div className="menu-divider"></div>
                  <button className="menu-item">
                    <span className="menu-icon">❓</span>
                    Help & Support
                  </button>
                  <button 
                    className="menu-item logout-item"
                    onClick={onLogout}
                  >
                    <span className="menu-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar (Hidden on Desktop) */}
      <div className="mobile-bottom-bar">
        <button className="mobile-nav-item active">
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </button>
        <button className="mobile-nav-item">
          <span className="nav-icon">📈</span>
          <span className="nav-label">Trading</span>
        </button>
        <button className="mobile-nav-item">
          <span className="nav-icon">💼</span>
          <span className="nav-label">Portfolio</span>
        </button>
        <button className="mobile-nav-item">
          <span className="nav-icon">🏢</span>
          <span className="nav-label">Company</span>
        </button>
        <button className="mobile-nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
