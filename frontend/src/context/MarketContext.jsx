import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MarketContext = createContext();

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

export const MarketProvider = ({ children }) => {
  const [marketStatus, setMarketStatus] = useState({
    isOpen: false,
    openTime: '09:15',
    closeTime: '15:30',
    timezone: 'Asia/Kolkata'
  });

  const [indices, setIndices] = useState({
    stockforge50: {
      name: 'STOCKFORGE 50',
      value: 15248.32,
      change: 127.45,
      changePercent: 0.84,
      high: 15298.67,
      low: 15089.23,
      volume: 2847592
    },
    niftyGaming: {
      name: 'NIFTY GAMING',
      value: 8956.78,
      change: -23.12,
      changePercent: -0.26,
      high: 9012.45,
      low: 8923.56,
      volume: 1536748
    },
    techIndex: {
      name: 'TECH INDEX',
      value: 12456.89,
      change: 89.34,
      changePercent: 0.72,
      high: 12489.12,
      low: 12367.45,
      volume: 3245896
    }
  });

  const [marketNews, setMarketNews] = useState([
    {
      id: 1,
      title: "StockForge Exchange Hits New All-Time High",
      summary: "The gaming stock exchange reaches record levels as virtual companies show strong growth",
      timestamp: new Date().toISOString(),
      category: "Market",
      importance: "high"
    },
    {
      id: 2,
      title: "Tech Sector Shows Strong Performance",
      summary: "Technology companies lead the market with consistent growth in Q2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      category: "Sector",
      importance: "medium"
    },
    {
      id: 3,
      title: "New IPO Listings Expected This Week",
      summary: "Several high-profile companies are planning to go public",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      category: "IPO",
      importance: "high"
    }
  ]);

  const [marketVolatility, setMarketVolatility] = useState({
    vix: 16.45, // Volatility Index
    trend: 'stable', // stable, bullish, bearish
    sentiment: 'positive' // positive, negative, neutral
  });

  // Check if market is open based on IST time
  const checkMarketStatus = useCallback(() => {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    const currentMinute = istTime.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    // Market open: 9:15 AM to 3:30 PM IST (Monday to Friday)
    const openTime = 9 * 60 + 15; // 9:15 AM
    const closeTime = 15 * 60 + 30; // 3:30 PM
    const dayOfWeek = istTime.getDay(); // 0 = Sunday, 6 = Saturday
    
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isInTradingHours = currentTime >= openTime && currentTime <= closeTime;
    
    const isOpen = isWeekday && isInTradingHours;
    
    setMarketStatus(prev => ({
      ...prev,
      isOpen,
      currentTime: istTime.toTimeString().slice(0, 8),
      nextOpen: isOpen ? null : getNextOpenTime(istTime),
      nextClose: isOpen ? getNextCloseTime(istTime) : null
    }));
  }, []);

  // Get next market open time
  const getNextOpenTime = (currentTime) => {
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 15, 0, 0);
    
    // If tomorrow is weekend, move to Monday
    if (tomorrow.getDay() === 0) { // Sunday
      tomorrow.setDate(tomorrow.getDate() + 1);
    } else if (tomorrow.getDay() === 6) { // Saturday
      tomorrow.setDate(tomorrow.getDate() + 2);
    }
    
    return tomorrow.toTimeString().slice(0, 8);
  };

  // Get next market close time
  const getNextCloseTime = (currentTime) => {
    const closeTime = new Date(currentTime);
    closeTime.setHours(15, 30, 0, 0);
    return closeTime.toTimeString().slice(0, 8);
  };

  // Simulate real-time market data updates
  const updateMarketData = useCallback(() => {
    setIndices(prevIndices => {
      const updatedIndices = { ...prevIndices };
      
      Object.keys(updatedIndices).forEach(key => {
        const index = updatedIndices[key];
        const changePercent = (Math.random() - 0.5) * 0.5; // ±0.25% change
        const newValue = index.value * (1 + changePercent / 100);
        const change = newValue - index.value;
        
        updatedIndices[key] = {
          ...index,
          value: parseFloat(newValue.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: index.volume + Math.floor(Math.random() * 10000)
        };
      });
      
      return updatedIndices;
    });

    // Update market volatility
    setMarketVolatility(prev => ({
      ...prev,
      vix: parseFloat((prev.vix + (Math.random() - 0.5) * 2).toFixed(2)),
      trend: Math.random() > 0.7 ? 
        (Math.random() > 0.5 ? 'bullish' : 'bearish') : 'stable'
    }));
  }, []);

  // Market analysis functions
  const getMarketTrend = useCallback(() => {
    const totalChange = Object.values(indices).reduce((sum, index) => sum + index.changePercent, 0);
    const avgChange = totalChange / Object.keys(indices).length;
    
    if (avgChange > 0.5) return 'bullish';
    if (avgChange < -0.5) return 'bearish';
    return 'neutral';
  }, [indices]);

  const getTopPerformers = useCallback(() => {
    return Object.entries(indices)
      .sort(([,a], [,b]) => b.changePercent - a.changePercent)
      .slice(0, 3)
      .map(([key, data]) => ({ key, ...data }));
  }, [indices]);

  const getWorstPerformers = useCallback(() => {
    return Object.entries(indices)
      .sort(([,a], [,b]) => a.changePercent - b.changePercent)
      .slice(0, 3)
      .map(([key, data]) => ({ key, ...data }));
  }, [indices]);

  // Market alerts system
  const [marketAlerts, setMarketAlerts] = useState([]);

  const addMarketAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...alert
    };
    
    setMarketAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
  }, []);

  // Check for significant market movements
  const checkMarketAlerts = useCallback(() => {
    Object.entries(indices).forEach(([key, index]) => {
      if (Math.abs(index.changePercent) > 2) {
        addMarketAlert({
          type: index.changePercent > 0 ? 'surge' : 'drop',
          title: `${index.name} ${index.changePercent > 0 ? 'Surges' : 'Drops'} ${Math.abs(index.changePercent).toFixed(1)}%`,
          message: `${index.name} is showing significant movement with ${index.changePercent > 0 ? 'gains' : 'losses'} of ${Math.abs(index.changePercent).toFixed(2)}%`,
          severity: Math.abs(index.changePercent) > 3 ? 'high' : 'medium',
          index: key
        });
      }
    });
  }, [indices, addMarketAlert]);

  // Trading session info
  const getTradingSession = useCallback(() => {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const currentHour = istTime.getHours();
    
    if (currentHour >= 9 && currentHour < 12) {
      return { session: 'morning', description: 'Morning Session' };
    } else if (currentHour >= 12 && currentHour < 15) {
      return { session: 'afternoon', description: 'Afternoon Session' };
    } else if (currentHour >= 15 && currentHour <= 15.5) {
      return { session: 'closing', description: 'Closing Session' };
    } else {
      return { session: 'closed', description: 'Market Closed' };
    }
  }, []);

  // Market stats
  const getMarketStats = useCallback(() => {
    const totalVolume = Object.values(indices).reduce((sum, index) => sum + index.volume, 0);
    const avgChange = Object.values(indices).reduce((sum, index) => sum + index.changePercent, 0) / Object.keys(indices).length;
    
    return {
      totalVolume,
      avgChange: parseFloat(avgChange.toFixed(2)),
      activeIndices: Object.keys(indices).length,
      marketCap: '₹2,45,678 Cr', // Simulated total market cap
      tradingSession: getTradingSession()
    };
  }, [indices, getTradingSession]);

  // Initialize market data
  useEffect(() => {
    checkMarketStatus();
    
    // Update market status every minute
    const statusInterval = setInterval(checkMarketStatus, 60000);
    
    // Update market data every 5 seconds when market is open
    const dataInterval = setInterval(() => {
      if (marketStatus.isOpen) {
        updateMarketData();
      }
    }, 5000);
    
    // Check for alerts every 30 seconds
    const alertInterval = setInterval(checkMarketAlerts, 30000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(dataInterval);
      clearInterval(alertInterval);
    };
  }, [checkMarketStatus, updateMarketData, checkMarketAlerts, marketStatus.isOpen]);

  // Market context value
  const value = {
    // Market status and timing
    marketStatus,
    checkMarketStatus,
    getTradingSession,
    
    // Market indices and data
    indices,
    updateMarketData,
    getMarketTrend,
    getTopPerformers,
    getWorstPerformers,
    
    // Market news and alerts
    marketNews,
    setMarketNews,
    marketAlerts,
    addMarketAlert,
    
    // Market analysis
    marketVolatility,
    getMarketStats,
    
    // Utility functions
    formatCurrency: (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    },
    
    formatNumber: (num) => {
      if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
      if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
      if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
      return `₹${num}`;
    },
    
    formatPercentage: (percent) => {
      return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
    }
  };

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
};

export default MarketContext;
