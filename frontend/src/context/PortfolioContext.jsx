import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useMarket } from './MarketContext';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { getStock } = useMarket();
  
  const [holdings, setHoldings] = useState([
    {
      id: 'holding_1',
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      quantity: 50,
      avgPrice: 2400.00,
      currentPrice: 2450.75,
      invested: 120000,
      currentValue: 122537.50,
      pnl: 2537.50,
      pnlPercent: 2.11,
      dayChange: 625.00,
      dayChangePercent: 0.51,
      sector: 'Oil & Gas',
      purchaseDate: '2025-01-10',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'holding_2',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      quantity: 30,
      avgPrice: 3200.00,
      currentPrice: 3250.20,
      invested: 96000,
      currentValue: 97506.00,
      pnl: 1506.00,
      pnlPercent: 1.57,
      dayChange: -249.00,
      dayChangePercent: -0.25,
      sector: 'IT Services',
      purchaseDate: '2025-01-08',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'holding_3',
      symbol: 'INFY',
      name: 'Infosys Limited',
      quantity: 40,
      avgPrice: 1400.00,
      currentPrice: 1420.45,
      invested: 56000,
      currentValue: 56818.00,
      pnl: 818.00,
      pnlPercent: 1.46,
      dayChange: 608.00,
      dayChangePercent: 1.08,
      sector: 'IT Services',
      purchaseDate: '2025-01-05',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'holding_4',
      symbol: 'HDFC',
      name: 'HDFC Bank',
      quantity: 25,
      avgPrice: 1600.00,
      currentPrice: 1580.90,
      invested: 40000,
      currentValue: 39522.50,
      pnl: -477.50,
      pnlPercent: -1.19,
      dayChange: -127.50,
      dayChangePercent: -0.32,
      sector: 'Banking',
      purchaseDate: '2025-01-03',
      lastUpdated: new Date().toISOString()
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'order_1',
      symbol: 'RELIANCE',
      type: 'BUY',
      orderType: 'MARKET',
      quantity: 10,
      price: 2450.75,
      triggerPrice: null,
      status: 'COMPLETED',
      executedQuantity: 10,
      executedPrice: 2450.75,
      orderTime: '2025-01-15T09:45:30.000Z',
      executionTime: '2025-01-15T09:45:32.000Z',
      validity: 'DAY',
      amount: 24507.50,
      fees: 24.51,
      totalAmount: 24532.01
    },
    {
      id: 'order_2',
      symbol: 'TCS',
      type: 'SELL',
      orderType: 'LIMIT',
      quantity: 5,
      price: 3250.00,
      triggerPrice: null,
      status: 'COMPLETED',
      executedQuantity: 5,
      executedPrice: 3250.20,
      orderTime: '2025-01-15T13:20:15.000Z',
      executionTime: '2025-01-15T13:20:18.000Z',
      validity: 'DAY',
      amount: 16251.00,
      fees: 16.25,
      totalAmount: 16234.75
    },
    {
      id: 'order_3',
      symbol: 'INFY',
      type: 'BUY',
      orderType: 'LIMIT',
      quantity: 15,
      price: 1420.00,
      triggerPrice: null,
      status: 'PENDING',
      executedQuantity: 0,
      executedPrice: 0,
      orderTime: '2025-01-15T14:30:45.000Z',
      executionTime: null,
      validity: 'DAY',
      amount: 21300.00,
      fees: 21.30,
      totalAmount: 21321.30
    }
  ]);

  const [watchlist, setWatchlist] = useState([
    { symbol: 'RELIANCE', addedDate: '2025-01-10' },
    { symbol: 'TCS', addedDate: '2025-01-08' },
    { symbol: 'INFY', addedDate: '2025-01-05' },
    { symbol: 'HDFC', addedDate: '2025-01-03' },
    { symbol: 'WIPRO', addedDate: '2025-01-12' },
    { symbol: 'ICICIBANK', addedDate: '2025-01-14' },
    { symbol: 'HDFCBANK', addedDate: '2025-01-11' }
  ]);

  const [portfolioSummary, setPortfolioSummary] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    dayPnL: 0,
    dayPnLPercent: 0,
    totalHoldings: 0,
    totalSectors: 0,
    lastUpdated: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate portfolio summary
  const calculatePortfolioSummary = useCallback(() => {
    if (holdings.length === 0) {
      setPortfolioSummary({
        totalInvested: 0,
        currentValue: 0,
        totalPnL: 0,
        totalPnLPercent: 0,
        dayPnL: 0,
        dayPnLPercent: 0,
        totalHoldings: 0,
        totalSectors: 0,
        lastUpdated: new Date().toISOString()
      });
      return;
    }

    const totalInvested = holdings.reduce((sum, holding) => sum + holding.invested, 0);
    const currentValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const totalPnL = currentValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const dayPnL = holdings.reduce((sum, holding) => sum + holding.dayChange, 0);
    const dayPnLPercent = currentValue > 0 ? (dayPnL / (currentValue - dayPnL)) * 100 : 0;
    
    const sectors = [...new Set(holdings.map(holding => holding.sector))];

    const summary = {
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      currentValue: parseFloat(currentValue.toFixed(2)),
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      totalPnLPercent: parseFloat(totalPnLPercent.toFixed(2)),
      dayPnL: parseFloat(dayPnL.toFixed(2)),
      dayPnLPercent: parseFloat(dayPnLPercent.toFixed(2)),
      totalHoldings: holdings.length,
      totalSectors: sectors.length,
      lastUpdated: new Date().toISOString()
    };

    setPortfolioSummary(summary);

    // Update user's portfolio data in AuthContext
    if (user) {
      updateUser({
        portfolioValue: summary.currentValue,
        totalPnL: summary.totalPnL,
        dayPnL: summary.dayPnL,
        dayPnLPercent: summary.dayPnLPercent
      });
    }

    return summary;
  }, [holdings, user, updateUser]);

  // Update holdings with latest market prices
  const updateHoldingsPrices = useCallback(() => {
    setHoldings(prevHoldings => {
      return prevHoldings.map(holding => {
        const stockData = getStock(holding.symbol);
        if (!stockData) return holding;

        const currentPrice = stockData.price;
        const currentValue = holding.quantity * currentPrice;
        const pnl = currentValue - holding.invested;
        const pnlPercent = holding.invested > 0 ? (pnl / holding.invested) * 100 : 0;
        const dayChange = holding.quantity * stockData.change;
        const dayChangePercent = stockData.changePercent;

        return {
          ...holding,
          currentPrice,
          currentValue: parseFloat(currentValue.toFixed(2)),
          pnl: parseFloat(pnl.toFixed(2)),
          pnlPercent: parseFloat(pnlPercent.toFixed(2)),
          dayChange: parseFloat(dayChange.toFixed(2)),
          dayChangePercent: parseFloat(dayChangePercent.toFixed(2)),
          lastUpdated: new Date().toISOString()
        };
      });
    });
  }, [getStock]);

  // Update portfolio when market data changes
  useEffect(() => {
    updateHoldingsPrices();
  }, [updateHoldingsPrices]);

  // Calculate summary when holdings change
  useEffect(() => {
    calculatePortfolioSummary();
  }, [calculatePortfolioSummary]);

  // Buy stock
  const buyStock = useCallback(async (symbol, quantity, price, orderType = 'MARKET') => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const stockData = getStock(symbol);
      if (!stockData) {
        throw new Error(`Stock ${symbol} not found`);
      }

      const executionPrice = orderType === 'MARKET' ? stockData.price : price;
      const amount = quantity * executionPrice;
      const fees = amount * 0.001; // 0.1% fees
      const totalAmount = amount + fees;

      // Check if user has sufficient balance
      if (user.balance < totalAmount) {
        throw new Error('Insufficient balance');
      }

      // Create order
      const newOrder = {
        id: `order_${Date.now()}`,
        symbol,
        type: 'BUY',
        orderType,
        quantity,
        price: executionPrice,
        triggerPrice: null,
        status: 'COMPLETED',
        executedQuantity: quantity,
        executedPrice: executionPrice,
        orderTime: new Date().toISOString(),
        executionTime: new Date().toISOString(),
        validity: 'DAY',
        amount,
        fees,
        totalAmount
      };

      // Add to orders
      setOrders(prev => [newOrder, ...prev]);

      // Update or create holding
      setHoldings(prev => {
        const existingHolding = prev.find(h => h.symbol === symbol);
        
        if (existingHolding) {
          // Update existing holding
          const newQuantity = existingHolding.quantity + quantity;
          const newInvested = existingHolding.invested + amount;
          const newAvgPrice = newInvested / newQuantity;
          const newCurrentValue = newQuantity * stockData.price;
          const newPnL = newCurrentValue - newInvested;
          const newPnLPercent = (newPnL / newInvested) * 100;

          return prev.map(holding => 
            holding.symbol === symbol 
              ? {
                  ...holding,
                  quantity: newQuantity,
                  avgPrice: parseFloat(newAvgPrice.toFixed(2)),
                  invested: parseFloat(newInvested.toFixed(2)),
                  currentValue: parseFloat(newCurrentValue.toFixed(2)),
                  pnl: parseFloat(newPnL.toFixed(2)),
                  pnlPercent: parseFloat(newPnLPercent.toFixed(2)),
                  lastUpdated: new Date().toISOString()
                }
              : holding
          );
        } else {
          // Create new holding
          const newHolding = {
            id: `holding_${Date.now()}`,
            symbol,
            name: stockData.name,
            quantity,
            avgPrice: executionPrice,
            currentPrice: stockData.price,
            invested: amount,
            currentValue: quantity * stockData.price,
            pnl: quantity * (stockData.price - executionPrice),
            pnlPercent: ((stockData.price - executionPrice) / executionPrice) * 100,
            dayChange: quantity * stockData.change,
            dayChangePercent: stockData.changePercent,
            sector: stockData.sector,
            purchaseDate: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString()
          };

          return [...prev, newHolding];
        }
      });

      // Update user balance
      updateUser({ balance: user.balance - totalAmount });

      console.log('💰 Stock purchased:', symbol, quantity);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('stockforge:stock_purchased', {
        detail: { symbol, quantity, price: executionPrice, amount: totalAmount }
      }));

      return { success: true, order: newOrder };

    } catch (err) {
      console.error('💰 Buy stock error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [getStock, user, updateUser]);

  // Sell stock
  const sellStock = useCallback(async (symbol, quantity, price, orderType = 'MARKET') => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const holding = holdings.find(h => h.symbol === symbol);
      if (!holding) {
        throw new Error(`No holdings found for ${symbol}`);
      }

      if (holding.quantity < quantity) {
        throw new Error(`Insufficient quantity. Available: ${holding.quantity}`);
      }

      const stockData = getStock(symbol);
      if (!stockData) {
        throw new Error(`Stock ${symbol} not found`);
      }

      const executionPrice = orderType === 'MARKET' ? stockData.price : price;
      const amount = quantity * executionPrice;
      const fees = amount * 0.001; // 0.1% fees
      const totalAmount = amount - fees;

      // Create order
      const newOrder = {
        id: `order_${Date.now()}`,
        symbol,
        type: 'SELL',
        orderType,
        quantity,
        price: executionPrice,
        triggerPrice: null,
        status: 'COMPLETED',
        executedQuantity: quantity,
        executedPrice: executionPrice,
        orderTime: new Date().toISOString(),
        executionTime: new Date().toISOString(),
        validity: 'DAY',
        amount,
        fees,
        totalAmount
      };

      // Add to orders
      setOrders(prev => [newOrder, ...prev]);

      // Update holding
      setHoldings(prev => {
        return prev.map(h => {
          if (h.symbol === symbol) {
            const newQuantity = h.quantity - quantity;
            
            if (newQuantity === 0) {
              // Remove holding completely
              return null;
            } else {
              // Update holding
              const soldInvested = (quantity / h.quantity) * h.invested;
              const newInvested = h.invested - soldInvested;
              const newCurrentValue = newQuantity * stockData.price;
              const newPnL = newCurrentValue - newInvested;
              const newPnLPercent = newInvested > 0 ? (newPnL / newInvested) * 100 : 0;

              return {
                ...h,
                quantity: newQuantity,
                invested: parseFloat(newInvested.toFixed(2)),
                currentValue: parseFloat(newCurrentValue.toFixed(2)),
                pnl: parseFloat(newPnL.toFixed(2)),
                pnlPercent: parseFloat(newPnLPercent.toFixed(2)),
                lastUpdated: new Date().toISOString()
              };
            }
          }
          return h;
        }).filter(Boolean);
      });

      // Update user balance
      updateUser({ balance: user.balance + totalAmount });

      console.log('💰 Stock sold:', symbol, quantity);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('stockforge:stock_sold', {
        detail: { symbol, quantity, price: executionPrice, amount: totalAmount }
      }));

      return { success: true, order: newOrder };

    } catch (err) {
      console.error('💰 Sell stock error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [holdings, getStock, user, updateUser]);

  // Add to watchlist
  const addToWatchlist = useCallback((symbol) => {
    if (watchlist.find(item => item.symbol === symbol)) {
      return { success: false, message: 'Already in watchlist' };
    }

    const newItem = {
      symbol,
      addedDate: new Date().toISOString().split('T')[0]
    };

    setWatchlist(prev => [...prev, newItem]);
    
    console.log('👁️ Added to watchlist:', symbol);
    return { success: true };
  }, [watchlist]);

  // Remove from watchlist
  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
    
    console.log('👁️ Removed from watchlist:', symbol);
    return { success: true };
  }, []);

  // Get holding by symbol
  const getHolding = useCallback((symbol) => {
    return holdings.find(holding => holding.symbol === symbol) || null;
  }, [holdings]);

  // Get order history
  const getOrderHistory = useCallback((symbol = null, limit = null) => {
    let filteredOrders = [...orders];
    
    if (symbol) {
      filteredOrders = filteredOrders.filter(order => order.symbol === symbol);
    }
    
    if (limit) {
      filteredOrders = filteredOrders.slice(0, limit);
    }
    
    return filteredOrders;
  }, [orders]);

  // Get sector allocation
  const getSectorAllocation = useCallback(() => {
    const sectorMap = new Map();
    
    holdings.forEach(holding => {
      const sector = holding.sector;
      const value = holding.currentValue;
      
      if (sectorMap.has(sector)) {
        sectorMap.set(sector, sectorMap.get(sector) + value);
      } else {
        sectorMap.set(sector, value);
      }
    });
    
    const totalValue = portfolioSummary.currentValue;
    
    return Array.from(sectorMap.entries()).map(([sector, value]) => ({
      sector,
      value: parseFloat(value.toFixed(2)),
      percentage: totalValue > 0 ? parseFloat(((value / totalValue) * 100).toFixed(2)) : 0
    }));
  }, [holdings, portfolioSummary.currentValue]);

  // Get top performers
  const getTopPerformers = useCallback((type = 'gainers', limit = 5) => {
    const sorted = [...holdings].sort((a, b) => {
      if (type === 'gainers') {
        return b.pnlPercent - a.pnlPercent;
      } else {
        return a.pnlPercent - b.pnlPercent;
      }
    });
    
    return sorted.slice(0, limit);
  }, [holdings]);

  const value = {
    // State
    holdings,
    orders,
    watchlist,
    portfolioSummary,
    loading,
    error,

    // Functions
    buyStock,
    sellStock,
    addToWatchlist,
    removeFromWatchlist,
    getHolding,
    getOrderHistory,
    getSectorAllocation,
    getTopPerformers,
    calculatePortfolioSummary,
    updateHoldingsPrices
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;
