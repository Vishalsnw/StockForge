import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import TradingInterface from './components/Trading/TradingInterface';
import Navbar from './components/Navigation/Navbar';
import Sidebar from './components/Navigation/Sidebar';
import Portfolio from './components/Portfolio/Portfolio';
import Company from './components/Company/Company';
import IPO from './components/IPO/IPO';
import Profile from './components/Profile/Profile';
import LoadingScreen from './components/Common/LoadingScreen';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [marketStatus, setMarketStatus] = useState({
    isOpen: true,
    nextOpen: null,
    nextClose: null
  });

  // Initialize user data
  const [userData, setUserData] = useState({
    username: 'Vishalsnw',
    email: 'vishal@stockforge.com',
    balance: 100000,
    portfolio: 25000,
    totalValue: 125000,
    dayChange: 2500,
    dayChangePercent: 2.04,
    joinDate: '2025-01-15',
    level: 'Professional Trader',
    completedTrades: 156,
    winRate: 68.5
  });

  // Market status check
  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Indian market: Mon-Fri, 9:15 AM - 3:30 PM IST
      const isWeekday = currentDay >= 1 && currentDay <= 5;
      const isMarketHours = currentHour >= 9 && currentHour < 16;
      
      setMarketStatus({
        isOpen: isWeekday && isMarketHours,
        nextOpen: isWeekday ? null : 'Monday 9:15 AM',
        nextClose: isMarketHours ? 'Today 3:30 PM' : null
      });
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  // Auto-login for demo (remove in production)
  useEffect(() => {
    if (!user && !authLoading) {
      login({
        username: 'Vishalsnw',
        email: 'vishal@stockforge.com',
        uid: 'demo-user-123'
      });
    }
  }, [user, authLoading, login]);

  // Loading screen
  if (authLoading) {
    return <LoadingScreen message="Loading StockForge..." />;
  }

  // Login required
  if (!user) {
    return (
      <div className="app-container login-required">
        <div className="login-prompt">
          <div className="logo-section">
            <h1>📊 StockForge</h1>
            <p>Professional Stock Trading Simulation</p>
          </div>
          <div className="login-form">
            <h2>Welcome to StockForge</h2>
            <p>Build your trading empire with realistic market simulation</p>
            <button 
              className="demo-login-btn"
              onClick={() => login(userData)}
            >
              🚀 Start Trading Demo
            </button>
            <div className="feature-list">
              <div className="feature-item">✅ Real-time market data</div>
              <div className="feature-item">✅ Advanced trading tools</div>
              <div className="feature-item">✅ Portfolio management</div>
              <div className="feature-item">✅ Company management</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`app-container ${theme} ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Navigation */}
      <Navbar 
        user={userData}
        marketStatus={marketStatus}
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        onLogout={logout}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onClose={() => setSidebarOpen(false)}
        user={userData}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            {/* Dashboard - Default Route */}
            <Route 
              path="/" 
              element={
                <Dashboard 
                  user={userData}
                  marketStatus={marketStatus}
                  onNavigate={setCurrentPage}
                />
              } 
            />
            
            {/* Trading Interface */}
            <Route 
              path="/trading" 
              element={
                <TradingInterface 
                  user={userData}
                  marketStatus={marketStatus}
                />
              } 
            />
            
            {/* Portfolio Management */}
            <Route 
              path="/portfolio" 
              element={
                <Portfolio 
                  user={userData}
                  onUpdateBalance={(newBalance) => 
                    setUserData(prev => ({ ...prev, ...newBalance }))
                  }
                />
              } 
            />
            
            {/* Company Management */}
            <Route 
              path="/company" 
              element={
                <Company 
                  user={userData}
                  onUpdateCompany={(companyData) => 
                    console.log('Company updated:', companyData)
                  }
                />
              } 
            />
            
            {/* IPO Center */}
            <Route 
              path="/ipo" 
              element={
                <IPO 
                  user={userData}
                  marketStatus={marketStatus}
                />
              } 
            />
            
            {/* User Profile */}
            <Route 
              path="/profile" 
              element={
                <Profile 
                  user={userData}
                  onUpdateProfile={(newData) => 
                    setUserData(prev => ({ ...prev, ...newData }))
                  }
                />
              } 
            />
            
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Market Status Indicator */}
      <div className={`market-status-fixed ${marketStatus.isOpen ? 'open' : 'closed'}`}>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">
            Market {marketStatus.isOpen ? 'OPEN' : 'CLOSED'}
          </span>
        </div>
        {!marketStatus.isOpen && marketStatus.nextOpen && (
          <div className="next-session">
            Next: {marketStatus.nextOpen}
          </div>
        )}
      </div>

      {/* Current Time Display */}
      <div className="current-time-display">
        <CurrentTime />
      </div>

      {/* Background Elements */}
      <div className="app-background">
        <div className="bg-grid"></div>
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
      </div>
    </div>
  );
}

// Current Time Component
function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="time-widget">
      <div className="date">
        {currentTime.toLocaleDateString('en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </div>
      <div className="time">
        {currentTime.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
      <div className="timezone">IST</div>
    </div>
  );
}

export default App;
