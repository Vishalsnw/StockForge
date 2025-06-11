import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  
  // Player's company data
  const [playerCompany, setPlayerCompany] = useState(null);
  
  // All companies in the game (other players + NPCs)
  const [gameCompanies, setGameCompanies] = useState([
    {
      id: 'comp_001',
      name: 'TechCorp Industries',
      owner: 'rahul_kumar',
      type: 'technology',
      level: 15,
      employees: 250,
      revenue: 15000000,
      profit: 3500000,
      valuation: 85000000,
      isPublic: true,
      stockPrice: 125.50,
      sharesOutstanding: 677000,
      marketCap: 84963500,
      founded: '2024-03-15',
      headquarters: 'Mumbai',
      description: 'Leading software development and AI solutions'
    },
    {
      id: 'comp_002', 
      name: 'GreenEnergy Solutions',
      owner: 'priya_sharma',
      type: 'energy',
      level: 12,
      employees: 180,
      revenue: 12000000,
      profit: 2100000,
      valuation: 45000000,
      isPublic: false,
      stockPrice: 0,
      sharesOutstanding: 0,
      marketCap: 0,
      founded: '2024-05-20',
      headquarters: 'Bangalore',
      description: 'Renewable energy and solar panel manufacturing'
    }
  ]);

  // Company types and their characteristics
  const companyTypes = {
    technology: {
      name: 'Technology',
      icon: '💻',
      description: 'Software, AI, and digital solutions',
      startingCost: 100000,
      profitMargin: 0.25,
      growthRate: 1.8,
      resources: ['servers', 'software_licenses', 'talent']
    },
    manufacturing: {
      name: 'Manufacturing',
      icon: '🏭',
      description: 'Production of physical goods',
      startingCost: 250000,
      profitMargin: 0.15,
      growthRate: 1.3,
      resources: ['raw_materials', 'machinery', 'labor']
    },
    retail: {
      name: 'Retail',
      icon: '🛍️',
      description: 'Consumer goods and services',
      startingCost: 150000,
      profitMargin: 0.12,
      growthRate: 1.4,
      resources: ['inventory', 'locations', 'staff']
    },
    energy: {
      name: 'Energy',
      icon: '⚡',
      description: 'Power generation and utilities',
      startingCost: 500000,
      profitMargin: 0.20,
      growthRate: 1.2,
      resources: ['equipment', 'permits', 'infrastructure']
    },
    finance: {
      name: 'Finance',
      icon: '🏦',
      description: 'Banking and financial services',
      startingCost: 300000,
      profitMargin: 0.30,
      growthRate: 1.5,
      resources: ['capital', 'licenses', 'compliance']
    },
    healthcare: {
      name: 'Healthcare',
      icon: '🏥',
      description: 'Medical services and pharmaceuticals',
      startingCost: 400000,
      profitMargin: 0.22,
      growthRate: 1.3,
      resources: ['medical_equipment', 'research', 'specialists']
    }
  };

  // Resources system
  const [resources, setResources] = useState({
    // Technology resources
    servers: { name: 'Servers', price: 5000, quantity: 0, demand: 'high' },
    software_licenses: { name: 'Software Licenses', price: 1200, quantity: 0, demand: 'medium' },
    talent: { name: 'Tech Talent', price: 8000, quantity: 0, demand: 'very_high' },
    
    // Manufacturing resources
    raw_materials: { name: 'Raw Materials', price: 500, quantity: 0, demand: 'medium' },
    machinery: { name: 'Machinery', price: 25000, quantity: 0, demand: 'low' },
    labor: { name: 'Factory Workers', price: 3000, quantity: 0, demand: 'medium' },
    
    // Retail resources
    inventory: { name: 'Product Inventory', price: 2000, quantity: 0, demand: 'high' },
    locations: { name: 'Store Locations', price: 15000, quantity: 0, demand: 'medium' },
    staff: { name: 'Sales Staff', price: 2500, quantity: 0, demand: 'medium' },
    
    // Energy resources
    equipment: { name: 'Energy Equipment', price: 50000, quantity: 0, demand: 'low' },
    permits: { name: 'Energy Permits', price: 10000, quantity: 0, demand: 'low' },
    infrastructure: { name: 'Infrastructure', price: 100000, quantity: 0, demand: 'very_low' },
    
    // Finance resources
    capital: { name: 'Investment Capital', price: 10000, quantity: 0, demand: 'high' },
    licenses: { name: 'Financial Licenses', price: 8000, quantity: 0, demand: 'low' },
    compliance: { name: 'Compliance Systems', price: 6000, quantity: 0, demand: 'medium' },
    
    // Healthcare resources
    medical_equipment: { name: 'Medical Equipment', price: 30000, quantity: 0, demand: 'medium' },
    research: { name: 'R&D Investment', price: 15000, quantity: 0, demand: 'high' },
    specialists: { name: 'Medical Specialists', price: 12000, quantity: 0, demand: 'high' }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize player company if they have one
  useEffect(() => {
    if (user?.hasCompany && user?.companyName) {
      // Load player's company data
      setPlayerCompany({
        id: `comp_${user.uid}`,
        name: user.companyName,
        owner: user.username,
        type: user.companyType || 'technology',
        level: user.companyLevel || 1,
        employees: user.companyEmployees || 10,
        revenue: user.companyRevenue || 0,
        profit: user.companyProfit || 0,
        valuation: user.companyValue || 100000,
        isPublic: user.companyIsPublic || false,
        stockPrice: user.companyStockPrice || 0,
        sharesOutstanding: user.companyShares || 0,
        marketCap: user.companyMarketCap || 0,
        founded: user.companyFounded || new Date().toISOString().split('T')[0],
        headquarters: user.companyHeadquarters || 'Mumbai',
        description: user.companyDescription || 'A growing company',
        cash: user.companyCash || 50000,
        debt: user.companyDebt || 0,
        assets: user.companyAssets || 100000
      });
    }
  }, [user]);

  // Create new company
  const createCompany = useCallback(async (companyData) => {
    setLoading(true);
    setError(null);

    try {
      const { name, type, description, headquarters } = companyData;
      const companyTypeData = companyTypes[type];
      
      if (!companyTypeData) {
        throw new Error('Invalid company type');
      }

      // Check if user has enough money
      if (user.balance < companyTypeData.startingCost) {
        throw new Error(`Insufficient funds. Need ₹${companyTypeData.startingCost.toLocaleString()}`);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newCompany = {
        id: `comp_${user.uid}`,
        name,
        owner: user.username,
        type,
        level: 1,
        employees: 10,
        revenue: 0,
        profit: 0,
        valuation: companyTypeData.startingCost,
        isPublic: false,
        stockPrice: 0,
        sharesOutstanding: 1000000, // 1M shares for founder
        marketCap: 0,
        founded: new Date().toISOString().split('T')[0],
        headquarters,
        description,
        cash: companyTypeData.startingCost * 0.5,
        debt: 0,
        assets: companyTypeData.startingCost,
        industry: companyTypeData.name,
        resources: {}
      };

      // Initialize resources for company type
      companyTypeData.resources.forEach(resourceType => {
        newCompany.resources[resourceType] = 0;
      });

      setPlayerCompany(newCompany);

      // Update user data
      updateUser({
        hasCompany: true,
        companyName: name,
        companyType: type,
        companyLevel: 1,
        companyValue: newCompany.valuation,
        companyFounded: newCompany.founded,
        companyHeadquarters: headquarters,
        companyDescription: description,
        balance: user.balance - companyTypeData.startingCost
      });

      console.log('🏢 Company created:', name);
      
      // Dispatch event
      window.dispatchEvent(new CustomEvent('stockforge:company_created', {
        detail: { company: newCompany }
      }));

      return { success: true, company: newCompany };

    } catch (err) {
      console.error('🏢 Company creation error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user, updateUser, companyTypes]);

  // Go public (IPO)
  const goPublic = useCallback(async (ipoData) => {
    if (!playerCompany) {
      throw new Error('No company found');
    }

    if (playerCompany.isPublic) {
      throw new Error('Company is already public');
    }

    if (playerCompany.level < 5) {
      throw new Error('Company must be level 5+ to go public');
    }

    setLoading(true);
    setError(null);

    try {
      const { sharePrice, sharesForSale, description } = ipoData;
      
      // Simulate IPO process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const totalRaised = sharePrice * sharesForSale;
      const updatedCompany = {
        ...playerCompany,
        isPublic: true,
        stockPrice: sharePrice,
        sharesOutstanding: playerCompany.sharesOutstanding + sharesForSale,
        marketCap: sharePrice * (playerCompany.sharesOutstanding + sharesForSale),
        cash: playerCompany.cash + totalRaised,
        ipoDate: new Date().toISOString().split('T')[0],
        ipoPrice: sharePrice,
        ipoDescription: description
      };

      setPlayerCompany(updatedCompany);

      // Update user data
      updateUser({
        companyIsPublic: true,
        companyStockPrice: sharePrice,
        companyShares: updatedCompany.sharesOutstanding,
        companyMarketCap: updatedCompany.marketCap
      });

      console.log('🚀 IPO successful:', playerCompany.name, 'Raised:', totalRaised);

      // Add to game companies list
      setGameCompanies(prev => [...prev, updatedCompany]);

      // Dispatch event
      window.dispatchEvent(new CustomEvent('stockforge:ipo_launched', {
        detail: { company: updatedCompany, raised: totalRaised }
      }));

      return { success: true, company: updatedCompany, raised: totalRaised };

    } catch (err) {
      console.error('🚀 IPO error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [playerCompany, updateUser]);

  // Buy resources
  const buyResource = useCallback(async (resourceType, quantity) => {
    if (!playerCompany) {
      throw new Error('No company found');
    }

    const resource = resources[resourceType];
    if (!resource) {
      throw new Error('Resource not found');
    }

    const totalCost = resource.price * quantity;
    
    if (playerCompany.cash < totalCost) {
      throw new Error('Insufficient company cash');
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate purchase
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update company resources and cash
      const updatedCompany = {
        ...playerCompany,
        cash: playerCompany.cash - totalCost,
        resources: {
          ...playerCompany.resources,
          [resourceType]: (playerCompany.resources[resourceType] || 0) + quantity
        }
      };

      setPlayerCompany(updatedCompany);

      console.log('📦 Resource purchased:', resourceType, quantity);

      return { success: true, cost: totalCost };

    } catch (err) {
      console.error('📦 Resource purchase error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [playerCompany, resources]);

  // Simulate company operations (revenue, expenses, growth)
  const simulateOperations = useCallback(() => {
    if (!playerCompany) return;

    const companyTypeData = companyTypes[playerCompany.type];
    if (!companyTypeData) return;

    // Calculate monthly revenue based on company level and resources
    const baseRevenue = playerCompany.level * 50000;
    const resourceMultiplier = Math.max(1, Object.values(playerCompany.resources || {}).reduce((sum, qty) => sum + qty, 0) / 100);
    const monthlyRevenue = baseRevenue * resourceMultiplier * companyTypeData.growthRate;

    // Calculate expenses
    const employeeCosts = playerCompany.employees * 5000; // ₹5000 per employee
    const operationalCosts = monthlyRevenue * 0.3; // 30% of revenue
    const totalExpenses = employeeCosts + operationalCosts;

    // Calculate profit
    const monthlyProfit = monthlyRevenue - totalExpenses;

    // Update company
    const updatedCompany = {
      ...playerCompany,
      revenue: playerCompany.revenue + monthlyRevenue,
      profit: playerCompany.profit + monthlyProfit,
      cash: playerCompany.cash + monthlyProfit,
      valuation: playerCompany.valuation * 1.02, // 2% growth
    };

    // Check for level up
    if (updatedCompany.revenue > playerCompany.level * 100000) {
      updatedCompany.level = playerCompany.level + 1;
      updatedCompany.employees = Math.floor(updatedCompany.employees * 1.1);
    }

    // Update stock price if public
    if (playerCompany.isPublic && monthlyProfit > 0) {
      const growthFactor = monthlyProfit / (playerCompany.valuation * 0.01);
      updatedCompany.stockPrice = playerCompany.stockPrice * (1 + growthFactor);
      updatedCompany.marketCap = updatedCompany.stockPrice * updatedCompany.sharesOutstanding;
    }

    setPlayerCompany(updatedCompany);

    console.log('🏢 Operations simulated - Revenue:', monthlyRevenue, 'Profit:', monthlyProfit);
  }, [playerCompany, companyTypes]);

  // Get company by ID
  const getCompany = useCallback((companyId) => {
    if (playerCompany && playerCompany.id === companyId) {
      return playerCompany;
    }
    return gameCompanies.find(company => company.id === companyId) || null;
  }, [playerCompany, gameCompanies]);

  // Get top companies by market cap
  const getTopCompanies = useCallback((limit = 10) => {
    const allCompanies = playerCompany ? [playerCompany, ...gameCompanies] : gameCompanies;
    return allCompanies
      .filter(company => company.isPublic)
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, limit);
  }, [playerCompany, gameCompanies]);

  // Get companies by sector
  const getCompaniesBySector = useCallback((sector) => {
    const allCompanies = playerCompany ? [playerCompany, ...gameCompanies] : gameCompanies;
    return allCompanies.filter(company => company.type === sector);
  }, [playerCompany, gameCompanies]);

  const value = {
    // State
    playerCompany,
    gameCompanies,
    companyTypes,
    resources,
    loading,
    error,

    // Functions
    createCompany,
    goPublic,
    buyResource,
    simulateOperations,
    getCompany,
    getTopCompanies,
    getCompaniesBySector
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyContext;
