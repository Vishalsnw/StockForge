import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { MarketProvider } from './context/MarketContext';
import { TradingProvider } from './context/TradingContext';
import { GameProvider } from './context/GameContext';
import { useAuth } from './context/AuthContext';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import LoadingScreen from './components/UI/LoadingScreen';
import ErrorBoundary from './components/UI/ErrorBoundary';

// CSS
import './App.css';
import './styles/variables.css';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Component with Context Providers
const AppContent = () => {
  const { user, isLoading, initializeAuth } = useAuth();
  const [appLoading, setAppLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('stockforge_theme');
        if (savedTheme) {
          setTheme(savedTheme);
          document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Load notification preference
        const savedNotifications = localStorage.getItem('stockforge_notifications');
        if (savedNotifications !== null) {
          setNotifications(JSON.parse(savedNotifications));
        }

        // Initialize authentication
        await initializeAuth();

        // Simulate app loading (remove in production)
        setTimeout(() => {
          setAppLoading(false);
        }, 1500);

      } catch (error) {
        console.error('Failed to initialize app:', error);
        setAppLoading(false);
      }
    };

    initializeApp();
  }, [initializeAuth]);

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('stockforge_theme', newTheme);
  };

  // Notification toggle function
  const toggleNotifications = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('stockforge_notifications', JSON.stringify(newNotifications));
  };

  // Show loading screen during app initialization
  if (appLoading || isLoading) {
    return <LoadingScreen message="Initializing StockForge..." />;
  }

  return (
    <div className={`app ${theme}`}>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <CompanyProvider>
                <MarketProvider>
                  <TradingProvider>
                    <GameProvider>
                      <Dashboard 
                        theme={theme}
                        toggleTheme={toggleTheme}
                        notifications={notifications}
                        toggleNotifications={toggleNotifications}
                      />
                    </GameProvider>
                  </TradingProvider>
                </MarketProvider>
              </CompanyProvider>
            </ProtectedRoute>
          } 
        />

        {/* Default Route */}
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } 
        />

        {/* 404 Route */}
        <Route 
          path="*" 
          element={
            <div className="not-found">
              <div className="not-found-content">
                <h1>🎮 404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist in StockForge.</p>
                <button 
                  onClick={() => window.location.href = user ? '/dashboard' : '/login'}
                  className="back-home-btn"
                >
                  {user ? 'Back to Dashboard' : 'Go to Login'}
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
};

// Root App Component
const App = () => {
  const [error, setError] = useState(null);

  // Global error handler
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      setError(event.error);
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (event) => {
      // Ctrl/Cmd + K for search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        const closeButtons = document.querySelectorAll('.close-btn, .modal-overlay');
        if (closeButtons.length > 0) {
          closeButtons[closeButtons.length - 1].click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, []);

  // Show error screen if critical error occurs
  if (error) {
    return (
      <div className="app error-state">
        <div className="error-screen">
          <div className="error-content">
            <h1>🔥 Something went wrong!</h1>
            <p>StockForge encountered an unexpected error.</p>
            <details className="error-details">
              <summary>Error Details</summary>
              <pre>{error.toString()}</pre>
            </details>
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()}
                className="reload-btn"
              >
                🔄 Reload Page
              </button>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="reset-btn"
              >
                🗑️ Clear Data & Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
