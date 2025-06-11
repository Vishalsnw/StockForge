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
    session: 'pre-market',
    nextSession: 'market-open',
    timeToNext: 0,
    lastUpdate: new Date().toISOString()
  });

  const [indices, setIndices] = useState({
    nifty50: {
      name: 'NIFTY 50',
      symbol: 'NIFTY',
      value: 19845.30,
      change: 125.40,
      changePercent: 0.63,
      high: 19950.75,
      low: 19720.15,
      open: 19719.90,
      prevClose: 19719.90,
      volume: 0,
      lastUpdate: new Date().toISOString()
    },
    sensex: {
      name: 'SENSEX',
      symbol: 'SENSEX',
      value: 66598.91,
      change: 389.73,
      changePercent: 0.59,
      high: 66850.22,
      low: 66209.18,
      open: 66209.18,
      prevClose: 66209.18,
      volume: 0,
      lastUpdate: new Date().toISOString()
    },
    bankNifty: {
      name: 'BANK NIFTY',
      symbol: 'BANKNIFTY',
      value: 45234.75,
      change: -89.25,
      changePercent: -0.20,
      high: 45456.80,
      low: 45134.20,
      open: 45324.00,
      prevClose: 45324.00,
      volume: 0,
      lastUpdate: new Date().toISOString()
    }
  });

  const [stockData, setStockData] = useState({
    'RELIANCE': {
      name: 'Reliance Industries',
      symbol: 'RELIANCE',
      price: 2450.75,
      change: 12.50,
      changePercent: 0.51,
      high: 2465.20,
      low: 2438.30,
      open: 2438.30,
      prevClose: 2438.25,
      volume: 2456789,
      marketCap: 1658000000000,
      pe: 24.5,
      sector: 'Oil & Gas',
      lastUpdate: new Date().toISOString()
    },
    'TCS': {
      name: 'Tata Consultancy Services',
      symbol: 'TCS',
      price: 3250.20,
      change: -8.30,
      changePercent: -0.25,
      high: 3268.50,
      low: 3245.80,
      open: 3258.50,
      prevClose: 3258.50,
      volume: 1234567,
      marketCap: 1189000000000,
      pe: 26.8,
      sector: 'IT Services',
      lastUpdate: new Date().toISOString()
    },
    'INFY': {
      name: 'Infosys Limited',
      symbol: 'INFY',
      price: 1420.45,
      change: 15.20,
      changePercent: 1.08,
      high: 1425.60,
      low: 1405.25,
      open: 1405.25,
      prevClose: 1405.25,
      volume: 3456789,
      marketCap: 587000000000,
      pe: 22.3,
      sector: 'IT Services',
      lastUpdate: new Date().toISOString()
    },
    'HDFC': {
      name: 'HDFC Bank',
      symbol: 'HDFC',
      price: 1580.90,
      change: -5.10,
      changePercent: -0.32,
      high: 1586.00,
      low: 1575.30,
      open: 1586.00,
      prevClose: 1586.00,
      volume: 2987654,
      marketCap: 873000000000,
      pe: 18.7,
      sector: 'Banking',
      lastUpdate: new Date().toISOString()
    },
    'WIPRO': {
      name: 'Wipro Limited',
      symbol: 'WIPRO',
      price: 385.60,
      change: 4.20,
      changePercent: 1.10,
      high: 388.90,
      low: 381.40,
      open: 381.40,
      prevClose: 381.40,
      volume: 5432198,
      marketCap: 198000000000,
      pe: 24.1,
      sector: 'IT Services',
      lastUpdate: new Date().toISOString()
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [updateInterval, setUpdateInterval] = useState(5000); // 5 seconds

  // Market timings (IST)
  const marketTimings = {
    preMarket: { start: '09:00', end: '09:15' },
    regular: { start: '09:15', end: '15:30' },
    postMarket: { start: '15:40', end: '16:00' }
  };

  // Check market status based on current time
  const checkMarketStatus = useCallback(() => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-IN', { 
      hour12: false, 
      timeZone: 'Asia/Kolkata' 
    });
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if it's a weekend
    if (currentDay === 0 || currentDay === 6) {
      return {
        isOpen: false,
        session: 'weekend',
        nextSession: 'pre-market',
        timeToNext: 0
      };
    }

    const [hours, minutes] = currentTime.split(':').map(Number);
    const currentMinutes = hours * 60 + minutes;

    // Pre-market: 9:00 - 9:15
    const preMarketStart = 9 * 60; // 540 minutes
    const preMarketEnd = 9 * 60 + 15; // 555 minutes

    // Regular market: 9:15 - 15:30
    const marketStart = 9 * 60 + 15; // 555 minutes
    const marketEnd = 15 * 60 + 30; // 930 minutes

    // Post-market: 15:40 - 16:00
    const postMarketStart = 15 * 60 + 40; // 940 minutes
    const postMarketEnd = 16 * 60; // 960 minutes

    if (currentMinutes >= preMarketStart && currentMinutes < preMarketEnd) {
      return {
        isOpen: true,
        session: 'pre-market',
        nextSession: 'regular',
        timeToNext: (marketStart - currentMinutes) * 60000
      };
    } else if (currentMinutes >= marketStart && currentMinutes < marketEnd) {
      return {
        isOpen: true,
        session: 'regular',
        nextSession: 'post-market',
        timeToNext: (postMarketStart - currentMinutes) * 60000
      };
    } else if (currentMinutes >= postMarketStart && currentMinutes < postMarketEnd) {
      return {
        isOpen: true,
        session: 'post-market',
        nextSession: 'closed',
        timeToNext: (postMarketEnd - currentMinutes) * 60000
      };
    } else {
      // Market is closed
      let nextOpenTime;
      if (currentMinutes < preMarketStart) {
        // Before pre-market today
        nextOpenTime = preMarketStart - currentMinutes;
      } else {
        // After post-market, next day
        nextOpenTime = (24 * 60) - currentMinutes + preMarketStart;
      }

      return {
        isOpen: false,
        session: 'closed',
        nextSession: 'pre-market',
        timeToNext: nextOpenTime * 60000
      };
    }
  }, []);

  // Initialize market status
  useEffect(() => {
    const status = checkMarketStatus();
    setMarketStatus({
      ...status,
      lastUpdate: new Date().toISOString()
    });
    setLoading(false);
    
    console.log('📊 Market status initialized:', status);
  }, [checkMarketStatus]);

  // Update market status every minute
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const status = checkMarketStatus();
      setMarketStatus(prev => ({
        ...prev,
        ...status,
        lastUpdate: new Date().toISOString()
      }));
    }, 60000); // Check every minute

    return () => clearInterval(statusInterval);
  }, [checkMarketStatus]);

  // Simulate real-time market data updates
  useEffect(() => {
    if (!marketStatus.isOpen || marketStatus.session === 'closed') {
      return;
    }

    const updateMarketData = () => {
      try {
        setConnectionStatus('connected');
        
        // Update indices
        setIndices(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            const index = updated[key];
            const volatility = marketStatus.session === 'regular' ? 0.5 : 0.2;
            const changeAmount = (Math.random() - 0.5) * volatility;
            const newValue = Math.max(index.value + changeAmount, index.value * 0.98);
            const newChange = newValue - index.prevClose;
            const newChangePercent = (newChange / index.prevClose) * 100;

            updated[key] = {
              ...index,
              value: parseFloat(newValue.toFixed(2)),
              change: parseFloat(newChange.toFixed(2)),
              changePercent: parseFloat(newChangePercent.toFixed(2)),
              high: Math.max(index.high, newValue),
              low: Math.min(index.low, newValue),
              lastUpdate: new Date().toISOString()
            };
          });
          return updated;
        });

        // Update stock data
        setStockData(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(symbol => {
            const stock = updated[symbol];
            const volatility = marketStatus.session === 'regular' ? 2 : 0.8;
            const changeAmount = (Math.random() - 0.5) * volatility;
            const newPrice = Math.max(stock.price + changeAmount, stock.price * 0.95);
            const newChange = newPrice - stock.prevClose;
            const newChangePercent = (newChange / stock.prevClose) * 100;

            // Simulate volume updates
            const volumeIncrease = Math.floor(Math.random() * 10000);

            updated[symbol] = {
              ...stock,
              price: parseFloat(newPrice.toFixed(2)),
              change: parseFloat(newChange.toFixed(2)),
              changePercent: parseFloat(newChangePercent.toFixed(2)),
              high: Math.max(stock.high, newPrice),
              low: Math.min(stock.low, newPrice),
              volume: stock.volume + volumeIncrease,
              lastUpdate: new Date().toISOString()
            };
          });
          return updated;
        });

        setError(null);
        
      } catch (err) {
        console.error('📊 Error updating market data:', err);
        setError(err.message);
        setConnectionStatus('error');
      }
    };

    // Update immediately
    updateMarketData();

    // Set up interval for regular updates
    const dataInterval = setInterval(updateMarketData, updateInterval);

    return () => clearInterval(dataInterval);
  }, [marketStatus.isOpen, marketStatus.session, updateInterval]);

  // Get stock by symbol
  const getStock = useCallback((symbol) => {
    return stockData[symbol] || null;
  }, [stockData]);

  // Get index by symbol
  const getIndex = useCallback((symbol) => {
    return Object.values(indices).find(index => 
      index.symbol === symbol || index.name.includes(symbol)
    ) || null;
  }, [indices]);

  // Add stock to tracking
  const addStock = useCallback((symbol, stockInfo) => {
    setStockData(prev => ({
      ...prev,
      [symbol]: {
        ...stockInfo,
        lastUpdate: new Date().toISOString()
      }
    }));
    
    console.log('📊 Stock added to tracking:', symbol);
  }, []);

  // Remove stock from tracking
  const removeStock = useCallback((symbol) => {
    setStockData(prev => {
      const updated = { ...prev };
      delete updated[symbol];
      return updated;
    });
    
    console.log('📊 Stock removed from tracking:', symbol);
  }, []);

  // Get market summary
  const getMarketSummary = useCallback(() => {
    const totalStocks = Object.keys(stockData).length;
    const gainers = Object.values(stockData).filter(stock => stock.change > 0).length;
    const losers = Object.values(stockData).filter(stock => stock.change < 0).length;
    const unchanged = totalStocks - gainers - losers;

    return {
      totalStocks,
      gainers,
      losers,
      unchanged,
      advanceDeclineRatio: losers > 0 ? (gainers / losers).toFixed(2) : 'N/A'
    };
  }, [stockData]);

  // Format market timing
  const formatMarketTiming = useCallback((session) => {
    const timing = marketTimings[session];
    if (!timing) return 'N/A';
    return `${timing.start} - ${timing.end} IST`;
  }, []);

  // Get time to next session
  const getTimeToNextSession = useCallback(() => {
    if (marketStatus.timeToNext <= 0) return 'N/A';
    
    const hours = Math.floor(marketStatus.timeToNext / (1000 * 60 * 60));
    const minutes = Math.floor((marketStatus.timeToNext % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((marketStatus.timeToNext % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, [marketStatus.timeToNext]);

  // Force data refresh
  const refreshMarketData = useCallback(() => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      const status = checkMarketStatus();
      setMarketStatus({
        ...status,
        lastUpdate: new Date().toISOString()
      });
      setLoading(false);
      
      console.log('🔄 Market data refreshed');
      
      // Dispatch refresh event
      window.dispatchEvent(new CustomEvent('stockforge:market_refreshed', {
        detail: { timestamp: new Date().toISOString() }
      }));
    }, 1000);
  }, [checkMarketStatus]);

  // Set update frequency
  const setUpdateFrequency = useCallback((frequency) => {
    const frequencies = {
      'fast': 1000,
      'normal': 5000,
      'slow': 10000
    };
    
    if (frequencies[frequency]) {
      setUpdateInterval(frequencies[frequency]);
      console.log('📊 Update frequency changed to:', frequency);
    }
  }, []);

  const value = {
    // State
    marketStatus,
    indices,
    stockData,
    loading,
    error,
    connectionStatus,
    updateInterval,

    // Market timings
    marketTimings,

    // Functions
    getStock,
    getIndex,
    addStock,
    removeStock,
    getMarketSummary,
    formatMarketTiming,
    getTimeToNextSession,
    refreshMarketData,
    setUpdateFrequency,
    checkMarketStatus
  };

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
};

export default MarketContext;
