// ===== BOT COMPANIES MARKET ENGINE =====

import { COMPANY_SECTORS } from '../data/botCompanies.js';

// Market states and conditions
export const MARKET_STATES = {
  BULL: 'bull',
  BEAR: 'bear',
  SIDEWAYS: 'sideways',
  VOLATILE: 'volatile'
};

export const MARKET_CONDITIONS = {
  OPEN: 'open',
  CLOSED: 'closed',
  PRE_MARKET: 'pre_market',
  AFTER_HOURS: 'after_hours'
};

// News events that affect stock prices
export const NEWS_EVENTS = {
  EARNINGS_BEAT: { impact: 0.15, probability: 0.3 },
  EARNINGS_MISS: { impact: -0.12, probability: 0.25 },
  PRODUCT_LAUNCH: { impact: 0.08, probability: 0.2 },
  PARTNERSHIP: { impact: 0.06, probability: 0.15 },
  ACQUISITION_RUMOR: { impact: 0.18, probability: 0.1 },
  REGULATORY_ISSUE: { impact: -0.15, probability: 0.12 },
  CEO_CHANGE: { impact: -0.05, probability: 0.08 },
  DIVIDEND_INCREASE: { impact: 0.04, probability: 0.18 },
  ANALYST_UPGRADE: { impact: 0.07, probability: 0.25 },
  ANALYST_DOWNGRADE: { impact: -0.09, probability: 0.20 },
  MARKET_EXPANSION: { impact: 0.12, probability: 0.15 },
  LAWSUIT: { impact: -0.10, probability: 0.12 },
  PATENT_APPROVAL: { impact: 0.09, probability: 0.08 },
  SUPPLY_CHAIN_ISSUE: { impact: -0.08, probability: 0.15 }
};

// Sector rotation patterns
export const SECTOR_ROTATION = {
  BULL_MARKET: ['TECHNOLOGY', 'HEALTHCARE', 'CONSUMER', 'FINANCE'],
  BEAR_MARKET: ['CONSUMER', 'HEALTHCARE', 'REAL_ESTATE', 'ENERGY'],
  RECESSION: ['HEALTHCARE', 'CONSUMER', 'REAL_ESTATE'],
  RECOVERY: ['TECHNOLOGY', 'FINANCE', 'INDUSTRIAL', 'ENERGY']
};

class BotMarketEngine {
  constructor() {
    this.companies = [];
    this.marketState = MARKET_STATES.SIDEWAYS;
    this.marketCondition = MARKET_CONDITIONS.CLOSED;
    this.marketTrend = 0; // -1 to 1, negative = bearish, positive = bullish
    this.volatilityIndex = 0.5; // 0 to 1, higher = more volatile
    this.lastUpdate = new Date();
    this.tradingVolume = 0;
    this.marketCap = 0;
    
    // Market hours (UTC)
    this.marketHours = {
      open: { hour: 14, minute: 30 }, // 9:30 AM EST
      close: { hour: 21, minute: 0 }, // 4:00 PM EST
      preMarketStart: { hour: 9, minute: 0 }, // 4:00 AM EST
      afterHoursEnd: { hour: 1, minute: 0 } // 8:00 PM EST (next day)
    };
    
    // Price change limits
    this.dailyLimits = {
      max: 0.20, // 20% max daily change
      circuit_breaker: 0.10 // 10% circuit breaker
    };
    
    this.initialize();
  }

  initialize() {
    this.updateMarketCondition();
    this.updateMarketState();
    console.log('🤖 Bot Market Engine initialized');
  }

  // Update market condition based on current time
  updateMarketCondition() {
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    
    const openTime = this.marketHours.open.hour * 60 + this.marketHours.open.minute;
    const closeTime = this.marketHours.close.hour * 60 + this.marketHours.close.minute;
    const preMarketTime = this.marketHours.preMarketStart.hour * 60 + this.marketHours.preMarketStart.minute;
    
    if (currentTime >= openTime && currentTime < closeTime) {
      this.marketCondition = MARKET_CONDITIONS.OPEN;
    } else if (currentTime >= preMarketTime && currentTime < openTime) {
      this.marketCondition = MARKET_CONDITIONS.PRE_MARKET;
    } else if (currentTime >= closeTime || currentTime < this.marketHours.afterHoursEnd.hour * 60) {
      this.marketCondition = MARKET_CONDITIONS.AFTER_HOURS;
    } else {
      this.marketCondition = MARKET_CONDITIONS.CLOSED;
    }
  }

  // Update overall market state
  updateMarketState() {
    const random = Math.random();
    
    // Market state probabilities
    if (random < 0.4) {
      this.marketState = MARKET_STATES.BULL;
      this.marketTrend = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
    } else if (random < 0.7) {
      this.marketState = MARKET_STATES.SIDEWAYS;
      this.marketTrend = (Math.random() - 0.5) * 0.4; // -0.2 to 0.2
    } else if (random < 0.85) {
      this.marketState = MARKET_STATES.VOLATILE;
      this.marketTrend = (Math.random() - 0.5) * 1.0; // -0.5 to 0.5
      this.volatilityIndex = Math.random() * 0.5 + 0.5; // 0.5 to 1.0
    } else {
      this.marketState = MARKET_STATES.BEAR;
      this.marketTrend = -(Math.random() * 0.6 + 0.2); // -0.2 to -0.8
    }
  }

  // Load companies into the engine
  loadCompanies(companies) {
    this.companies = companies.map(company => ({
      ...company,
      currentPrice: company.stockPrice,
      openPrice: company.stockPrice,
      highPrice: company.stockPrice,
      lowPrice: company.stockPrice,
      previousClose: company.stockPrice,
      priceHistory: [{ 
        price: company.stockPrice, 
        timestamp: new Date(),
        volume: company.volume 
      }],
      currentVolume: 0,
      lastNewsTime: null,
      momentum: 0, // -1 to 1
      technicalIndicators: this.calculateTechnicalIndicators(company),
      lastUpdate: new Date()
    }));
    
    this.calculateMarketMetrics();
  }

  // Calculate technical indicators for a company
  calculateTechnicalIndicators(company) {
    const price = company.stockPrice;
    
    return {
      rsi: Math.random() * 100, // Random RSI for now
      macd: (Math.random() - 0.5) * 2, // -1 to 1
      bollinger: {
        upper: price * 1.02,
        middle: price,
        lower: price * 0.98
      },
      movingAverage: {
        ma20: price * (0.95 + Math.random() * 0.1),
        ma50: price * (0.90 + Math.random() * 0.2),
        ma200: price * (0.80 + Math.random() * 0.4)
      }
    };
  }

  // Generate price movement for a company
  generatePriceMovement(company) {
    const sectorData = COMPANY_SECTORS[company.sectorKey];
    let priceChange = 0;
    
    // Base volatility from sector
    let volatility = sectorData.volatility * this.volatilityIndex;
    
    // Market trend influence
    const marketInfluence = this.marketTrend * 0.3;
    
    // Sector-specific influence
    const sectorInfluence = this.getSectorInfluence(company.sectorKey);
    
    // Company-specific factors
    const companyMomentum = company.momentum * 0.2;
    
    // Random noise
    const randomNoise = (Math.random() - 0.5) * 0.02; // ±1%
    
    // Combine all factors
    const baseChange = marketInfluence + sectorInfluence + companyMomentum + randomNoise;
    
    // Apply volatility
    priceChange = baseChange * (1 + volatility);
    
    // News events (random chance)
    if (Math.random() < 0.1) { // 10% chance of news event
      const newsImpact = this.generateNewsEvent(company);
      priceChange += newsImpact;
    }
    
    // Limit price change to realistic bounds
    priceChange = Math.max(-this.dailyLimits.max, Math.min(this.dailyLimits.max, priceChange));
    
    return priceChange;
  }

  // Get sector-specific influence based on market conditions
  getSectorInfluence(sectorKey) {
    const rotationPattern = this.getRotationPattern();
    const sectorIndex = rotationPattern.indexOf(sectorKey);
    
    if (sectorIndex !== -1) {
      // Favored sectors get positive influence
      const influence = (rotationPattern.length - sectorIndex) / rotationPattern.length;
      return (influence - 0.5) * 0.1; // -5% to +5%
    }
    
    return (Math.random() - 0.5) * 0.05; // Random small influence
  }

  // Get current sector rotation pattern
  getRotationPattern() {
    switch (this.marketState) {
      case MARKET_STATES.BULL:
        return SECTOR_ROTATION.BULL_MARKET;
      case MARKET_STATES.BEAR:
        return SECTOR_ROTATION.BEAR_MARKET;
      default:
        return SECTOR_ROTATION.RECOVERY;
    }
  }

  // Generate random news event
  generateNewsEvent(company) {
    const events = Object.keys(NEWS_EVENTS);
    const eventKey = events[Math.floor(Math.random() * events.length)];
    const event = NEWS_EVENTS[eventKey];
    
    if (Math.random() < event.probability) {
      company.lastNewsTime = new Date();
      company.lastNewsEvent = eventKey;
      
      // Add some randomness to the impact
      const impactVariation = (Math.random() - 0.5) * 0.02;
      return event.impact + impactVariation;
    }
    
    return 0;
  }

  // Update single company price
  updateCompanyPrice(company) {
    const priceChange = this.generatePriceMovement(company);
    const newPrice = company.currentPrice * (1 + priceChange);
    
    // Update price data
    company.previousClose = company.currentPrice;
    company.currentPrice = Math.round(newPrice * 100) / 100;
    
    // Update daily high/low
    company.highPrice = Math.max(company.highPrice, company.currentPrice);
    company.lowPrice = Math.min(company.lowPrice, company.currentPrice);
    
    // Update momentum
    company.momentum = company.momentum * 0.8 + priceChange * 5; // Momentum decay
    company.momentum = Math.max(-1, Math.min(1, company.momentum));
    
    // Generate volume based on price movement
    const volumeMultiplier = 1 + Math.abs(priceChange) * 10;
    const randomVolume = company.avgVolume * (0.5 + Math.random()) * volumeMultiplier;
    company.currentVolume += Math.floor(randomVolume * 0.1); // 10% of calculated volume per update
    
    // Add to price history
    company.priceHistory.push({
      price: company.currentPrice,
      timestamp: new Date(),
      volume: Math.floor(randomVolume * 0.1),
      change: priceChange
    });
    
    // Keep only last 1000 price points
    if (company.priceHistory.length > 1000) {
      company.priceHistory = company.priceHistory.slice(-1000);
    }
    
    // Update technical indicators
    company.technicalIndicators = this.calculateTechnicalIndicators(company);
    company.lastUpdate = new Date();
    
    return {
      ticker: company.ticker,
      price: company.currentPrice,
      change: priceChange,
      volume: Math.floor(randomVolume * 0.1)
    };
  }

  // Update all companies
  updateAllCompanies() {
    this.updateMarketCondition();
    
    // Only update during market hours (with reduced activity after hours)
    const updateProbability = this.marketCondition === MARKET_CONDITIONS.OPEN ? 1.0 :
                             this.marketCondition === MARKET_CONDITIONS.PRE_MARKET ? 0.3 :
                             this.marketCondition === MARKET_CONDITIONS.AFTER_HOURS ? 0.2 : 0.1;
    
    const updates = [];
    
    this.companies.forEach(company => {
      if (Math.random() < updateProbability) {
        const update = this.updateCompanyPrice(company);
        updates.push(update);
      }
    });
    
    // Occasionally update market state
    if (Math.random() < 0.05) { // 5% chance
      this.updateMarketState();
    }
    
    this.calculateMarketMetrics();
    this.lastUpdate = new Date();
    
    return updates;
  }

  // Calculate overall market metrics
  calculateMarketMetrics() {
    if (this.companies.length === 0) return;
    
    this.marketCap = this.companies.reduce((total, company) => 
      total + (company.currentPrice * company.sharesOutstanding), 0
    );
    
    this.tradingVolume = this.companies.reduce((total, company) => 
      total + company.currentVolume, 0
    );
    
    // Calculate market indices (simplified)
    const totalMarketChange = this.companies.reduce((total, company) => {
      const change = (company.currentPrice - company.openPrice) / company.openPrice;
      return total + change;
    }, 0);
    
    this.marketIndex = {
      value: 1000 + (totalMarketChange / this.companies.length) * 1000,
      change: totalMarketChange / this.companies.length,
      volume: this.tradingVolume
    };
  }

  // Get market summary
  getMarketSummary() {
    const gainers = this.companies
      .filter(c => c.currentPrice > c.openPrice)
      .sort((a, b) => {
        const aChange = (a.currentPrice - a.openPrice) / a.openPrice;
        const bChange = (b.currentPrice - b.openPrice) / b.openPrice;
        return bChange - aChange;
      })
      .slice(0, 10);
      
    const losers = this.companies
      .filter(c => c.currentPrice < c.openPrice)
      .sort((a, b) => {
        const aChange = (a.currentPrice - a.openPrice) / a.openPrice;
        const bChange = (b.currentPrice - b.openPrice) / b.openPrice;
        return aChange - bChange;
      })
      .slice(0, 10);
      
    const mostActive = this.companies
      .sort((a, b) => b.currentVolume - a.currentVolume)
      .slice(0, 10);

    return {
      marketState: this.marketState,
      marketCondition: this.marketCondition,
      marketTrend: this.marketTrend,
      volatilityIndex: this.volatilityIndex,
      marketCap: this.marketCap,
      tradingVolume: this.tradingVolume,
      marketIndex: this.marketIndex,
      totalCompanies: this.companies.length,
      gainers: gainers.map(c => ({
        ticker: c.ticker,
        name: c.name,
        price: c.currentPrice,
        change: ((c.currentPrice - c.openPrice) / c.openPrice * 100).toFixed(2)
      })),
      losers: losers.map(c => ({
        ticker: c.ticker,
        name: c.name,
        price: c.currentPrice,
        change: ((c.currentPrice - c.openPrice) / c.openPrice * 100).toFixed(2)
      })),
      mostActive: mostActive.map(c => ({
        ticker: c.ticker,
        name: c.name,
        price: c.currentPrice,
        volume: c.currentVolume
      })),
      lastUpdate: this.lastUpdate
    };
  }

  // Get company by ticker
  getCompany(ticker) {
    return this.companies.find(c => c.ticker === ticker);
  }

  // Get companies by sector
  getCompaniesBySector(sector) {
    return this.companies.filter(c => c.sectorKey === sector);
  }

  // Search companies
  searchCompanies(query) {
    const searchTerm = query.toLowerCase();
    return this.companies.filter(c => 
      c.ticker.toLowerCase().includes(searchTerm) ||
      c.name.toLowerCase().includes(searchTerm) ||
      c.sector.toLowerCase().includes(searchTerm)
    );
  }

  // Reset daily data (call this at market open)
  resetDailyData() {
    this.companies.forEach(company => {
      company.openPrice = company.currentPrice;
      company.highPrice = company.currentPrice;
      company.lowPrice = company.currentPrice;
      company.currentVolume = 0;
      company.momentum = 0;
    });
    
    console.log('📊 Daily market data reset');
  }

  // Get real-time quote
  getQuote(ticker) {
    const company = this.getCompany(ticker);
    if (!company) return null;
    
    const change = company.currentPrice - company.previousClose;
    const changePercent = (change / company.previousClose) * 100;
    
    return {
      ticker: company.ticker,
      name: company.name,
      price: company.currentPrice,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: company.currentVolume,
      open: company.openPrice,
      high: company.highPrice,
      low: company.lowPrice,
      previousClose: company.previousClose,
      marketCap: company.currentPrice * company.sharesOutstanding,
      pe: company.pe,
      lastUpdate: company.lastUpdate,
      marketCondition: this.marketCondition
    };
  }

  // Start the market engine
  start(updateInterval = 5000) { // 5 seconds default
    this.engineInterval = setInterval(() => {
      const updates = this.updateAllCompanies();
      
      // Emit updates if there are any subscribers
      if (this.onUpdate && updates.length > 0) {
        this.onUpdate(updates);
      }
    }, updateInterval);
    
    console.log('🚀 Bot Market Engine started');
  }

  // Stop the market engine
  stop() {
    if (this.engineInterval) {
      clearInterval(this.engineInterval);
      this.engineInterval = null;
      console.log('⏹️ Bot Market Engine stopped');
    }
  }

  // Subscribe to market updates
  subscribe(callback) {
    this.onUpdate = callback;
  }

  // Unsubscribe from market updates
  unsubscribe() {
    this.onUpdate = null;
  }
}

// Export singleton instance
export const botMarketEngine = new BotMarketEngine();

export default {
  BotMarketEngine,
  botMarketEngine,
  MARKET_STATES,
  MARKET_CONDITIONS,
  NEWS_EVENTS
};
