import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check localStorage for saved user data
        const savedUser = localStorage.getItem('stockforge_user');
        const savedToken = localStorage.getItem('stockforge_token');
        
        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('🔐 User authenticated from localStorage:', userData.username);
        } else {
          console.log('🔐 No saved authentication found');
        }
      } catch (error) {
        console.error('🔐 Error initializing auth:', error);
        // Clear corrupted storage
        localStorage.removeItem('stockforge_user');
        localStorage.removeItem('stockforge_token');
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading delay for better UX
    setTimeout(initAuth, 1000);
  }, []);

  // Login function
  const login = async (userData) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced user data with additional fields
      const enhancedUserData = {
        uid: userData.uid || `user_${Date.now()}`,
        username: userData.username || 'Vishalsnw',
        email: userData.email || 'vishal@stockforge.com',
        displayName: userData.displayName || userData.username || 'Vishalsnw',
        avatar: userData.avatar || null,
        
        // Account details
        accountType: userData.accountType || 'Professional',
        accountLevel: userData.accountLevel || 12,
        memberSince: userData.memberSince || '2025-01-15',
        
        // Trading details
        balance: userData.balance || 100000,
        portfolioValue: userData.portfolioValue || 125000,
        totalPnL: userData.totalPnL || 25000,
        dayPnL: userData.dayPnL || 2500,
        dayPnLPercent: userData.dayPnLPercent || 2.04,
        
        // Trading stats
        totalTrades: userData.totalTrades || 156,
        winRate: userData.winRate || 68.5,
        avgProfit: userData.avgProfit || 1250,
        maxDrawdown: userData.maxDrawdown || -2500,
        
        // Company details (if user has a company)
        hasCompany: userData.hasCompany || false,
        companyName: userData.companyName || null,
        companyValue: userData.companyValue || 0,
        companyShares: userData.companyShares || 0,
        
        // Preferences
        theme: userData.theme || 'dark',
        notifications: userData.notifications !== false,
        riskLevel: userData.riskLevel || 'moderate',
        
        // Authentication
        lastLogin: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
        
        // Achievements/Badges
        badges: userData.badges || ['first_trade', 'profit_maker', 'consistent_trader'],
        achievements: userData.achievements || {
          tradesCompleted: 156,
          profitDays: 89,
          maxSingleProfit: 5000,
          portfolioMilestone: 125000
        }
      };

      // Generate mock JWT token
      const token = btoa(JSON.stringify({
        uid: enhancedUserData.uid,
        exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        iat: Date.now()
      }));

      // Save to localStorage
      localStorage.setItem('stockforge_user', JSON.stringify(enhancedUserData));
      localStorage.setItem('stockforge_token', token);

      setUser(enhancedUserData);
      setIsAuthenticated(true);
      
      console.log('🚀 Login successful:', enhancedUserData.username);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('stockforge:login', {
        detail: { user: enhancedUserData }
      }));

      return { success: true, user: enhancedUserData };
      
    } catch (error) {
      console.error('🔐 Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear localStorage
      localStorage.removeItem('stockforge_user');
      localStorage.removeItem('stockforge_token');
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('🚪 Logout successful');
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('stockforge:logout'));
      
      return { success: true };
      
    } catch (error) {
      console.error('🔐 Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUser = (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    
    // Save to localStorage
    localStorage.setItem('stockforge_user', JSON.stringify(updatedUser));
    
    setUser(updatedUser);
    
    console.log('👤 User updated:', Object.keys(updates));
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('stockforge:user_updated', {
      detail: { user: updatedUser, updates }
    }));
  };

  // Update balance
  const updateBalance = (newBalance) => {
    if (!user) return;
    
    const updates = {
      balance: newBalance,
      lastUpdated: new Date().toISOString()
    };
    
    updateUser(updates);
    
    console.log('💰 Balance updated:', newBalance);
  };

  // Update portfolio
  const updatePortfolio = (portfolioData) => {
    if (!user) return;
    
    const updates = {
      portfolioValue: portfolioData.totalValue || user.portfolioValue,
      totalPnL: portfolioData.totalPnL || user.totalPnL,
      dayPnL: portfolioData.dayPnL || user.dayPnL,
      dayPnLPercent: portfolioData.dayPnLPercent || user.dayPnLPercent,
      lastPortfolioUpdate: new Date().toISOString()
    };
    
    updateUser(updates);
    
    console.log('📊 Portfolio updated');
  };

  // Check if token is valid
  const isTokenValid = () => {
    try {
      const token = localStorage.getItem('stockforge_token');
      if (!token) return false;
      
      const decoded = JSON.parse(atob(token));
      return decoded.exp > Date.now();
    } catch {
      return false;
    }
  };

  // Get user achievements
  const getUserAchievements = () => {
    if (!user) return [];
    
    const achievements = [];
    
    if (user.totalTrades >= 100) {
      achievements.push({
        id: 'century_trader',
        title: 'Century Trader',
        description: 'Completed 100+ trades',
        icon: '💯',
        earnedAt: user.memberSince
      });
    }
    
    if (user.winRate >= 60) {
      achievements.push({
        id: 'consistent_winner',
        title: 'Consistent Winner',
        description: '60%+ win rate',
        icon: '🏆',
        earnedAt: user.memberSince
      });
    }
    
    if (user.portfolioValue >= 100000) {
      achievements.push({
        id: 'portfolio_milestone',
        title: 'Portfolio Master',
        description: 'Portfolio value ₹1L+',
        icon: '💎',
        earnedAt: user.memberSince
      });
    }
    
    return achievements;
  };

  // Get user level info
  const getUserLevelInfo = () => {
    if (!user) return null;
    
    const level = user.accountLevel;
    const xpRequired = level * 100;
    const currentXp = Math.floor(user.totalTrades * 8 + (user.winRate / 100) * 50);
    
    return {
      currentLevel: level,
      currentXp,
      xpRequired,
      progress: Math.min((currentXp / xpRequired) * 100, 100),
      nextLevel: level + 1,
      xpToNext: Math.max(xpRequired - currentXp, 0)
    };
  };

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Functions
    login,
    logout,
    updateUser,
    updateBalance,
    updatePortfolio,
    
    // Utilities
    isTokenValid,
    getUserAchievements,
    getUserLevelInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
