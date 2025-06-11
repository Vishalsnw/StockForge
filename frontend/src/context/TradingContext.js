import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useMarket } from './MarketContext';

const TradingContext = createContext();

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const { marketStatus, indices } = useMarket();

  // Trading state
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [tradingStats, setTradingStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0,
    todaysPnL: 0,
    bestPerformer: null,
    worstPerformer: null
  });

  // Trading fees and limits
  const TRADING_FEES = {
    brokerage: 0.001, // 0.1%
    stt: 0.001, // Securities Transaction Tax
    stampDuty: 0.00015,
    gst: 0.18, // On brokerage
    minimumBrokerage: 20
  };

  const TRADING_LIMITS = {
    maxOrderValue: 1000000, // ₹10L per order
    maxDailyTrades: 100,
    minOrderQuantity: 1,
    maxOrderQuantity: 10000
  };

  // Initialize user portfolio
  useEffect(() => {
    if (user) {
      // Load portfolio from localStorage or initialize
      const savedPortfolio = localStorage.getItem(`portfolio_${user.username}`);
      const savedWatchlist = localStorage.getItem(`watchlist_${user.username}`);
      const savedOrderHistory = localStorage.getItem(`orderHistory_${user.username}`);

      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio));
      }
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
      if (savedOrderHistory) {
        setOrderHistory(JSON.parse(savedOrderHistory));
      }
    }
  }, [user]);

  // Save data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`portfolio_${user.username}`, JSON.stringify(portfolio));
      localStorage.setItem(`watchlist_${user.username}`, JSON.stringify(watchlist));
      localStorage.setItem(`orderHistory_${user.username}`, JSON.stringify(orderHistory));
    }
  }, [portfolio, watchlist, orderHistory, user]);

  // Calculate trading fees
  const calculateFees = useCallback((orderValue, orderType) => {
    const brokerage = Math.max(orderValue * TRADING_FEES.brokerage, TRADING_FEES.minimumBrokerage);
    const stt = orderType === 'SELL' ? orderValue * TRADING_FEES.stt : 0;
    const stampDuty = orderValue * TRADING_FEES.stampDuty;
    const gst = brokerage * TRADING_FEES.gst;
    
    const totalFees = brokerage + stt + stampDuty + gst;
    
    return {
      brokerage: parseFloat(brokerage.toFixed(2)),
      stt: parseFloat(stt.toFixed(2)),
      stampDuty: parseFloat(stampDuty.toFixed(2)),
      gst: parseFloat(gst.toFixed(2)),
      totalFees: parseFloat(totalFees.toFixed(2))
    };
  }, []);

  // Validate order
  const validateOrder = useCallback((orderData) => {
    const { symbol, quantity, price, orderType, priceType } = orderData;
    const errors = [];

    // Basic validation
    if (!symbol || !quantity || !price || !orderType) {
      errors.push('Missing required order parameters');
    }

    if (quantity < TRADING_LIMITS.minOrderQuantity || quantity > TRADING_LIMITS.maxOrderQuantity) {
      errors.push(`Quantity must be between ${TRADING_LIMITS.minOrderQuantity} and ${TRADING_LIMITS.maxOrderQuantity}`);
    }

    const orderValue = quantity * price;
    if (orderValue > TRADING_LIMITS.maxOrderValue) {
      errors.push(`Order value cannot exceed ₹${TRADING_LIMITS.maxOrderValue.toLocaleString()}`);
    }

    // Check daily trading limit
    const todayOrders = orderHistory.filter(order => {
      const orderDate = new Date(order.timestamp).toDateString();
      const today = new Date().toDateString();
      return orderDate === today;
    });

    if (todayOrders.length >= TRADING_LIMITS.maxDailyTrades) {
      errors.push(`Daily trading limit of ${TRADING_LIMITS.maxDailyTrades} orders exceeded`);
    }

    // Check balance for buy orders
    if (orderType === 'BUY') {
      const fees = calculateFees(orderValue, orderType);
      const totalRequired = orderValue + fees.totalFees;
      
      if (!user || user.balance < totalRequired) {
        errors.push('Insufficient balance for this order');
      }
    }

    // Check holdings for sell orders
    if (orderType === 'SELL') {
      const holding = portfolio.find(p => p.symbol === symbol);
      if (!holding || holding.quantity < quantity) {
        errors.push('Insufficient shares to sell');
      }
    }

    return errors;
  }, [user, portfolio, orderHistory, calculateFees]);

  // Place order function
  const placeOrder = useCallback(async (orderData) => {
    const { symbol, quantity, price, orderType, priceType = 'MARKET' } = orderData;

    // Validate order
    const validationErrors = validateOrder(orderData);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors[0]);
    }

    // Create order object
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderValue = quantity * price;
    const fees = calculateFees(orderValue, orderType);
    const netAmount = orderType === 'BUY' ? 
      orderValue + fees.totalFees : 
      orderValue - fees.totalFees;

    const newOrder = {
      id: orderId,
      symbol,
      quantity,
      price,
      orderType,
      priceType,
      orderValue,
      fees: fees.totalFees,
      netAmount,
      status: priceType === 'MARKET' ? 'EXECUTED' : 'PENDING',
      timestamp: new Date().toISOString(),
      executionTime: priceType === 'MARKET' ? new Date().toISOString() : null,
      userId: user.id
    };

    // Execute market orders immediately
    if (priceType === 'MARKET') {
      await executeOrder(newOrder);
    } else {
      // Add to pending orders for limit orders
      setPendingOrders(prev => [...prev, newOrder]);
    }

    // Add to order history
    setOrderHistory(prev => [newOrder, ...prev]);

    return newOrder;
  }, [user, validateOrder, calculateFees]);

  // Execute order (for market orders and triggered limit orders)
  const executeOrder = useCallback(async (order) => {
    const { symbol, quantity, orderType, netAmount } = order;

    try {
      if (orderType === 'BUY') {
        // Update portfolio
        setPortfolio(prev => {
          const existingHolding = prev.find(p => p.symbol === symbol);
          
          if (existingHolding) {
            // Update existing holding
            const newQuantity = existingHolding.quantity + quantity;
            const newInvested = existingHolding.invested + netAmount;
            const newAvgPrice = newInvested / newQuantity;
            
            return prev.map(p => 
              p.symbol === symbol 
                ? {
                    ...p,
                    quantity: newQuantity,
                    avgPrice: newAvgPrice,
                    invested: newInvested,
                    lastUpdated: new Date().toISOString()
                  }
                : p
            );
          } else {
            // Add new holding
            return [...prev, {
              symbol,
              quantity,
              avgPrice: order.price,
              invested: netAmount,
              currentPrice: order.price,
              lastUpdated: new Date().toISOString()
            }];
          }
        });

        // Update user balance
        updateUser({ balance: user.balance - netAmount });

      } else if (orderType === 'SELL') {
        // Update portfolio
        setPortfolio(prev => {
          return prev.map(p => {
            if (p.symbol === symbol) {
              const newQuantity = p.quantity - quantity;
              
              if (newQuantity === 0) {
                // Remove holding completely
                return null;
              } else {
                // Update holding
                const soldValue = (quantity / p.quantity) * p.invested;
                const newInvested = p.invested - soldValue;
                
                return {
                  ...p,
                  quantity: newQuantity,
                  invested: newInvested,
                  lastUpdated: new Date().toISOString()
                };
              }
            }
            return p;
          }).filter(Boolean);
        });

        // Update user balance
        updateUser({ balance: user.balance + netAmount });
      }

      // Update order status
      setOrderHistory(prev => 
        prev.map(o => 
          o.id === order.id 
            ? { ...o, status: 'EXECUTED', executionTime: new Date().toISOString() }
            : o
        )
      );

      // Remove from pending orders if it was pending
      setPendingOrders(prev => prev.filter(o => o.id !== order.id));

    } catch (error) {
      // Update order status to failed
      setOrderHistory(prev => 
        prev.map(o => 
          o.id === order.id 
            ? { ...o, status: 'FAILED', error: error.message }
            : o
        )
      );
      throw error;
    }
  }, [user, updateUser]);

  // Cancel pending order
  const cancelOrder = useCallback((orderId) => {
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));
    setOrderHistory(prev => 
      prev.map(o => 
        o.id === orderId 
          ? { ...o, status: 'CANCELLED', cancelTime: new Date().toISOString() }
          : o
      )
    );
  }, []);

  // Update portfolio prices (simulate real-time updates)
  const updatePortfolioPrices = useCallback((marketData) => {
    setPortfolio(prev => 
      prev.map(holding => {
        const stockData = marketData.find(stock => stock.symbol === holding.symbol);
        if (stockData) {
          return {
            ...holding,
            currentPrice: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent,
            lastUpdated: new Date().toISOString()
          };
        }
        return holding;
      })
    );
  }, []);

  // Calculate portfolio statistics
  useEffect(() => {
    const totalInvested = portfolio.reduce((sum, holding) => sum + holding.invested, 0);
    const currentValue = portfolio.reduce((sum, holding) => 
      sum + (holding.quantity * (holding.currentPrice || holding.avgPrice)), 0
    );
    const totalPnL = currentValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    // Find best and worst performers
    const holdingsWithPnL = portfolio.map(holding => {
      const currentVal = holding.quantity * (holding.currentPrice || holding.avgPrice);
      const pnl = currentVal - holding.invested;
      const pnlPercent = holding.invested > 0 ? (pnl / holding.invested) * 100 : 0;
      
      return { ...holding, pnl, pnlPercent };
    });

    const bestPerformer = holdingsWithPnL.reduce((best, current) => 
      (!best || current.pnlPercent > best.pnlPercent) ? current : best, null
    );

    const worstPerformer = holdingsWithPnL.reduce((worst, current) => 
      (!worst || current.pnlPercent < worst.pnlPercent) ? current : worst, null
    );

    // Calculate today's P&L (simplified - would need historical data)
    const todaysPnL = portfolio.reduce((sum, holding) => {
      if (holding.change) {
        return sum + (holding.quantity * holding.change);
      }
      return sum;
    }, 0);

    setTradingStats({
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      currentValue: parseFloat(currentValue.toFixed(2)),
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      totalPnLPercent: parseFloat(totalPnLPercent.toFixed(2)),
      todaysPnL: parseFloat(todaysPnL.toFixed(2)),
      bestPerformer,
      worstPerformer
    });
  }, [portfolio]);

  // Watchlist management
  const addToWatchlist = useCallback((symbol, name) => {
    if (!watchlist.find(item => item.symbol === symbol)) {
      setWatchlist(prev => [...prev, {
        symbol,
        name,
        addedDate: new Date().toISOString()
      }]);
    }
  }, [watchlist]);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  }, []);

  // Get trading performance metrics
  const getTradingMetrics = useCallback(() => {
    const totalTrades = orderHistory.filter(order => order.status === 'EXECUTED').length;
    const buyTrades = orderHistory.filter(order => order.orderType === 'BUY' && order.status === 'EXECUTED').length;
    const sellTrades = orderHistory.filter(order => order.orderType === 'SELL' && order.status === 'EXECUTED').length;
    
    const totalFeesPaid = orderHistory
      .filter(order => order.status === 'EXECUTED')
      .reduce((sum, order) => sum + (order.fees || 0), 0);

    const avgOrderValue = totalTrades > 0 ? 
      orderHistory
        .filter(order => order.status === 'EXECUTED')
        .reduce((sum, order) => sum + order.orderValue, 0) / totalTrades : 0;

    return {
      totalTrades,
      buyTrades,
      sellTrades,
      totalFeesPaid: parseFloat(totalFeesPaid.toFixed(2)),
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      successRate: totalTrades > 0 ? ((totalTrades / orderHistory.length) * 100).toFixed(1) : 0
    };
  }, [orderHistory]);

  const value = {
    // Portfolio data
    portfolio,
    watchlist,
    orderHistory,
    pendingOrders,
    tradingStats,

    // Trading functions
    placeOrder,
    executeOrder,
    cancelOrder,
    validateOrder,
    calculateFees,

    // Portfolio management
    updatePortfolioPrices,
    addToWatchlist,
    removeFromWatchlist,

    // Analytics
    getTradingMetrics,

    // Constants
    TRADING_FEES,
    TRADING_LIMITS,

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
    }
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

export default TradingContext;
