// ===== BOT MARKET INTEGRATION HOOK =====

import { useState, useEffect, useCallback, useRef } from 'react';
import { botMarketEngine } from '../services/botMarketEngine.js';
import { generateInitialBotCompanies } from '../data/botCompanies.js';

export const useBotMarket = () => {
  const [companies, setCompanies] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  
  // Refs for managing subscriptions
  const engineSubscription = useRef(null);
  const updateTimeout = useRef(null);

  // Initialize bot market
  const initializeBotMarket = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🤖 Initializing Bot Market...');
      
      // Generate initial companies
      const botCompanies = generateInitialBotCompanies(150); // 150 companies
      
      // Load companies into engine
      botMarketEngine.loadCompanies(botCompanies);
      
      // Set initial state
      setCompanies(botCompanies);
      setMarketSummary(botMarketEngine.getMarketSummary());
      setLastUpdate(new Date());
      
      console.log(`✅ Bot Market initialized with ${botCompanies.length} companies`);
      
    } catch (error) {
      console.error('❌ Failed to initialize bot market:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start the market engine
  const startMarketEngine = useCallback(() => {
    if (isEngineRunning) return;
    
    console.log('🚀 Starting Bot Market Engine...');
    
    // Subscribe to market updates
    engineSubscription.current = (updates) => {
      handleMarketUpdates(updates);
    };
    
    botMarketEngine.subscribe(engineSubscription.current);
    botMarketEngine.start(3000); // Update every 3 seconds
    
    setIsEngineRunning(true);
    console.log('✅ Bot Market Engine started');
  }, [isEngineRunning]);

  // Stop the market engine
  const stopMarketEngine = useCallback(() => {
    if (!isEngineRunning) return;
    
    console.log('⏹️ Stopping Bot Market Engine...');
    
    botMarketEngine.stop();
    botMarketEngine.unsubscribe();
    
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
      updateTimeout.current = null;
    }
    
    setIsEngineRunning(false);
    console.log('✅ Bot Market Engine stopped');
  }, [isEngineRunning]);

  // Handle real-time market updates
  const handleMarketUpdates = useCallback((updates) => {
    if (!updates || updates.length === 0) return;
    
    // Batch updates to avoid too many re-renders
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }
    
    updateTimeout.current = setTimeout(() => {
      // Update companies with new prices
      setCompanies(prevCompanies => {
        const updatedCompanies = [...prevCompanies];
        
        updates.forEach(update => {
          const companyIndex = updatedCompanies.findIndex(c => c.ticker === update.ticker);
          if (companyIndex !== -1) {
            const company = updatedCompanies[companyIndex];
            updatedCompanies[companyIndex] = {
              ...company,
              currentPrice: update.price,
              currentVolume: company.currentVolume + update.volume,
              lastUpdate: new Date()
            };
          }
        });
        
        return updatedCompanies;
      });
      
      // Update market summary
      setMarketSummary(botMarketEngine.getMarketSummary());
      setLastUpdate(new Date());
      
      // Check price alerts
      checkPriceAlerts(updates);
      
    }, 100); // Batch updates every 100ms
  }, []);

  // Check price alerts
  const checkPriceAlerts = useCallback((updates) => {
    if (priceAlerts.length === 0) return;
    
    updates.forEach(update => {
      const relevantAlerts = priceAlerts.filter(alert => 
        alert.ticker === update.ticker && alert.isActive
      );
      
      relevantAlerts.forEach(alert => {
        const triggered = 
          (alert.type === 'above' && update.price >= alert.targetPrice) ||
          (alert.type === 'below' && update.price <= alert.targetPrice);
          
        if (triggered) {
          // Trigger alert notification
          onPriceAlertTriggered?.(alert, update);
          
          // Deactivate alert
          setPriceAlerts(prev => 
            prev.map(a => 
              a.id === alert.id 
                ? { ...a, isActive: false, triggeredAt: new Date() }
                : a
            )
          );
        }
      });
    });
  }, [priceAlerts]);

  // Get real-time quote for a specific ticker
  const getQuote = useCallback((ticker) => {
    return botMarketEngine.getQuote(ticker);
  }, []);

  // Search companies
  const searchCompanies = useCallback((query) => {
    return botMarketEngine.searchCompanies(query);
  }, []);

  // Get companies by sector
  const getCompaniesBySector = useCallback((sector) => {
    return botMarketEngine.getCompaniesBySector(sector);
  }, []);

  // Add to watchlist
  const addToWatchlist = useCallback((ticker) => {
    const company = botMarketEngine.getCompany(ticker);
    if (company && !watchlist.find(w => w.ticker === ticker)) {
      const watchlistItem = {
        id: `watchlist_${Date.now()}`,
        ticker: company.ticker,
        name: company.name,
        addedAt: new Date()
      };
      
      setWatchlist(prev => [...prev, watchlistItem]);
      return true;
    }
    return false;
  }, [watchlist]);

  // Remove from watchlist
  const removeFromWatchlist = useCallback((ticker) => {
    setWatchlist(prev => prev.filter(w => w.ticker !== ticker));
  }, []);

  // Add price alert
  const addPriceAlert = useCallback((ticker, targetPrice, type = 'above') => {
    const company = botMarketEngine.getCompany(ticker);
    if (!company) return false;
    
    const alert = {
      id: `alert_${Date.now()}`,
      ticker,
      companyName: company.name,
      currentPrice: company.currentPrice,
      targetPrice,
      type, // 'above' or 'below'
      isActive: true,
      createdAt: new Date(),
      triggeredAt: null
    };
    
    setPriceAlerts(prev => [...prev, alert]);
    return true;
  }, []);

  // Remove price alert
  const removePriceAlert = useCallback((alertId) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  // Get watchlist with current prices
  const getWatchlistWithPrices = useCallback(() => {
    return watchlist.map(item => {
      const quote = getQuote(item.ticker);
      return {
        ...item,
        ...quote
      };
    });
  }, [watchlist, getQuote]);

  // Get market movers
  const getMarketMovers = useCallback(() => {
    if (!marketSummary) return { gainers: [], losers: [], mostActive: [] };
    
    return {
      gainers: marketSummary.gainers,
      losers: marketSummary.losers,
      mostActive: marketSummary.mostActive
    };
  }, [marketSummary]);

  // Get sector performance
  const getSectorPerformance = useCallback(() => {
    const sectors = {};
    
    companies.forEach(company => {
      const sectorKey = company.sectorKey;
      if (!sectors[sectorKey]) {
        sectors[sectorKey] = {
          name: company.sector,
          companies: [],
          totalMarketCap: 0,
          avgChange: 0
        };
      }
      
      const change = company.currentPrice 
        ? (company.currentPrice - company.openPrice) / company.openPrice
        : 0;
        
      sectors[sectorKey].companies.push({
        ticker: company.ticker,
        change
      });
      
      sectors[sectorKey].totalMarketCap += company.currentPrice * company.sharesOutstanding;
    });
    
    // Calculate average change per sector
    Object.keys(sectors).forEach(key => {
      const sector = sectors[key];
      sector.avgChange = sector.companies.reduce((sum, c) => sum + c.change, 0) / sector.companies.length;
      sector.changePercent = (sector.avgChange * 100).toFixed(2);
    });
    
    return Object.values(sectors).sort((a, b) => b.avgChange - a.avgChange);
  }, [companies]);

  // Reset daily data (call at market open)
  const resetDailyData = useCallback(() => {
    botMarketEngine.resetDailyData();
    setMarketSummary(botMarketEngine.getMarketSummary());
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeBotMarket();
    
    // Cleanup on unmount
    return () => {
      stopMarketEngine();
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, [initializeBotMarket, stopMarketEngine]);

  // Auto-start engine when companies are loaded
  useEffect(() => {
    if (companies.length > 0 && !isEngineRunning) {
      startMarketEngine();
    }
  }, [companies.length, isEngineRunning, startMarketEngine]);

  // Market hours management
  useEffect(() => {
    const checkMarketHours = () => {
      const now = new Date();
      const currentHour = now.getUTCHours();
      
      // Auto-reset daily data at market open (9:30 AM EST = 14:30 UTC)
      if (currentHour === 14 && now.getUTCMinutes() === 30) {
        resetDailyData();
      }
    };
    
    const marketHoursInterval = setInterval(checkMarketHours, 60000); // Check every minute
    
    return () => clearInterval(marketHoursInterval);
  }, [resetDailyData]);

  // Event handlers that can be overridden
  const onPriceAlertTriggered = useCallback((alert, update) => {
    console.log(`🚨 Price Alert Triggered: ${alert.ticker} reached ${update.price}`);
    
    // You can emit custom events here or show notifications
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('priceAlertTriggered', {
        detail: { alert, update }
      }));
    }
  }, []);

  return {
    // Data
    companies,
    marketSummary,
    selectedCompany,
    watchlist,
    priceAlerts,
    lastUpdate,
    
    // State
    isLoading,
    isEngineRunning,
    
    // Actions
    initializeBotMarket,
    startMarketEngine,
    stopMarketEngine,
    resetDailyData,
    
    // Company operations
    getQuote,
    searchCompanies,
    getCompaniesBySector,
    setSelectedCompany,
    
    // Watchlist operations
    addToWatchlist,
    removeFromWatchlist,
    getWatchlistWithPrices,
    
    // Price alerts
    addPriceAlert,
    removePriceAlert,
    
    // Market data
    getMarketMovers,
    getSectorPerformance,
    
    // Market engine instance (for advanced usage)
    engine: botMarketEngine
  };
};

export default useBotMarket;
