// ===== BOT COMPANIES DATA SYSTEM =====

// Company sectors and their characteristics
export const COMPANY_SECTORS = {
  TECHNOLOGY: {
    name: 'Technology',
    volatility: 0.8, // High volatility
    growthRate: 0.15, // 15% annual growth potential
    dividendYield: 0.02, // Low dividend yield
    marketCap: { min: 1000000, max: 100000000000 }, // $1M to $100B
    color: '#3b82f6'
  },
  HEALTHCARE: {
    name: 'Healthcare',
    volatility: 0.6,
    growthRate: 0.12,
    dividendYield: 0.035,
    marketCap: { min: 5000000, max: 50000000000 },
    color: '#10b981'
  },
  FINANCE: {
    name: 'Finance',
    volatility: 0.7,
    growthRate: 0.08,
    dividendYield: 0.05,
    marketCap: { min: 10000000, max: 200000000000 },
    color: '#f59e0b'
  },
  ENERGY: {
    name: 'Energy',
    volatility: 0.9,
    growthRate: 0.06,
    dividendYield: 0.06,
    marketCap: { min: 50000000, max: 300000000000 },
    color: '#ef4444'
  },
  CONSUMER: {
    name: 'Consumer Goods',
    volatility: 0.4,
    growthRate: 0.07,
    dividendYield: 0.04,
    marketCap: { min: 20000000, max: 150000000000 },
    color: '#8b5cf6'
  },
  INDUSTRIAL: {
    name: 'Industrial',
    volatility: 0.5,
    growthRate: 0.09,
    dividendYield: 0.045,
    marketCap: { min: 15000000, max: 80000000000 },
    color: '#06b6d4'
  },
  RETAIL: {
    name: 'Retail',
    volatility: 0.6,
    growthRate: 0.05,
    dividendYield: 0.03,
    marketCap: { min: 5000000, max: 60000000000 },
    color: '#84cc16'
  },
  REAL_ESTATE: {
    name: 'Real Estate',
    volatility: 0.3,
    growthRate: 0.04,
    dividendYield: 0.07,
    marketCap: { min: 25000000, max: 40000000000 },
    color: '#f97316'
  }
};

// Company name generators
export const COMPANY_NAMES = {
  TECH: [
    'CloudTech', 'DataFlow', 'CyberCore', 'InnovateLabs', 'QuantumSoft',
    'TechNova', 'ByteForge', 'DigitalEdge', 'FutureCode', 'SmartSys',
    'NeuralNet', 'CodeCraft', 'TechPulse', 'DataMind', 'CloudVault',
    'CyberSync', 'IntelliSoft', 'QuantumData', 'TechFlow', 'DigitalCore'
  ],
  HEALTHCARE: [
    'LifeTech', 'MediCore', 'BioGenesis', 'HealthFlow', 'CureTech',
    'MedInnovate', 'BioPharma', 'LifeScience', 'HealthTech', 'MediSync',
    'BioLabs', 'CureGen', 'LifeFlow', 'MediCare+', 'BioCore',
    'HealthPro', 'MediTech', 'BioSync', 'LifeCare', 'MediFlow'
  ],
  FINANCE: [
    'FinTech Pro', 'CreditFlow', 'InvestCore', 'MoneyTech', 'CapitalEdge',
    'FinanceHub', 'CreditSync', 'InvestFlow', 'MoneyCore', 'CapitalTech',
    'FinPro', 'CreditTech', 'InvestSync', 'MoneyFlow', 'CapitalFlow',
    'FinanceCore', 'CreditFlow+', 'InvestTech', 'MoneySync', 'CapitalPro'
  ],
  ENERGY: [
    'PowerCore', 'EnergyFlow', 'GreenTech', 'SolarSync', 'EcoEnergy',
    'PowerTech', 'EnergyPro', 'GreenFlow', 'SolarTech', 'EcoPower',
    'PowerFlow', 'EnergyCore', 'GreenPro', 'SolarFlow', 'EcoTech',
    'PowerSync', 'EnergyTech', 'GreenCore', 'SolarPro', 'EcoFlow'
  ],
  CONSUMER: [
    'ConsumerPro', 'RetailTech', 'BrandFlow', 'ProductCore', 'MarketSync',
    'ConsumerFlow', 'RetailCore', 'BrandTech', 'ProductFlow', 'MarketPro',
    'ConsumerTech', 'RetailFlow', 'BrandCore', 'ProductTech', 'MarketFlow',
    'ConsumerCore', 'RetailPro', 'BrandFlow+', 'ProductSync', 'MarketTech'
  ],
  INDUSTRIAL: [
    'IndustrialPro', 'ManufacTech', 'ProductionFlow', 'FactoryCore', 'IndustrySync',
    'IndustrialFlow', 'ManufacCore', 'ProductionTech', 'FactoryFlow', 'IndustryPro',
    'IndustrialTech', 'ManufacFlow', 'ProductionCore', 'FactoryTech', 'IndustryFlow',
    'IndustrialCore', 'ManufacPro', 'ProductionSync', 'FactoryPro', 'IndustryTech'
  ],
  RETAIL: [
    'ShopTech', 'RetailFlow', 'StorePro', 'SalesTech', 'ShopFlow',
    'RetailCore', 'StoreFlow', 'SalesCore', 'ShopPro', 'RetailTech',
    'StoreCore', 'SalesFlow', 'ShopCore', 'RetailPro', 'StoreTech',
    'SalesPro', 'ShopSync', 'RetailSync', 'StoreSync', 'SalesSync'
  ],
  REAL_ESTATE: [
    'PropertyPro', 'RealEstate+', 'PropertyFlow', 'RealtyTech', 'PropertyCore',
    'RealEstateFlow', 'PropertyTech', 'RealtyFlow', 'PropertySync', 'RealEstatePro',
    'PropertyHub', 'RealtyCore', 'PropertyEdge', 'RealEstateCore', 'PropertyMax',
    'RealtyPro', 'PropertyFlow+', 'RealEstateSync', 'PropertyTech+', 'RealtySync'
  ]
};

// Company descriptions templates
export const COMPANY_DESCRIPTIONS = {
  TECHNOLOGY: [
    'Leading provider of cloud computing solutions and enterprise software.',
    'Innovative technology company specializing in artificial intelligence and machine learning.',
    'Software development company focused on mobile and web applications.',
    'Cybersecurity firm providing advanced threat protection services.',
    'Data analytics platform helping businesses make data-driven decisions.'
  ],
  HEALTHCARE: [
    'Pharmaceutical company developing breakthrough treatments for chronic diseases.',
    'Medical technology firm creating innovative diagnostic equipment.',
    'Biotechnology company focused on gene therapy and personalized medicine.',
    'Healthcare services provider offering comprehensive patient care solutions.',
    'Medical device manufacturer specializing in surgical instruments.'
  ],
  FINANCE: [
    'Digital banking platform providing modern financial services.',
    'Investment management firm specializing in portfolio optimization.',
    'Fintech company offering innovative payment processing solutions.',
    'Insurance provider focused on risk management and coverage solutions.',
    'Financial advisory services helping individuals and businesses grow wealth.'
  ],
  ENERGY: [
    'Renewable energy company developing solar and wind power solutions.',
    'Oil and gas exploration company with global operations.',
    'Clean energy technology firm focused on battery storage systems.',
    'Utility company providing electricity and natural gas services.',
    'Energy efficiency solutions provider for commercial and residential markets.'
  ],
  CONSUMER: [
    'Consumer goods manufacturer producing household and personal care products.',
    'Food and beverage company with popular brand portfolio.',
    'Retail chain specializing in consumer electronics and appliances.',
    'Fashion and apparel company with global retail presence.',
    'Home improvement retailer offering building materials and tools.'
  ],
  INDUSTRIAL: [
    'Manufacturing company producing industrial equipment and machinery.',
    'Construction materials supplier serving infrastructure projects.',
    'Aerospace and defense contractor providing specialized components.',
    'Transportation and logistics company offering supply chain solutions.',
    'Industrial automation firm providing robotics and control systems.'
  ],
  RETAIL: [
    'E-commerce platform connecting buyers and sellers globally.',
    'Department store chain offering fashion, home, and lifestyle products.',
    'Specialty retailer focused on sports and outdoor equipment.',
    'Grocery chain providing fresh food and everyday essentials.',
    'Electronics retailer specializing in consumer technology products.'
  ],
  REAL_ESTATE: [
    'Real estate investment trust focused on commercial properties.',
    'Property development company creating residential and commercial projects.',
    'Real estate services firm providing brokerage and property management.',
    'Real estate technology platform facilitating property transactions.',
    'Construction company specializing in sustainable building practices.'
  ]
};

// Generate random company fundamentals
export const generateCompanyFundamentals = (sector, marketCap) => {
  const sectorData = COMPANY_SECTORS[sector];
  
  // Calculate shares outstanding based on market cap
  const stockPrice = Math.random() * 300 + 10; // $10 to $310
  const sharesOutstanding = Math.floor(marketCap / stockPrice);
  
  // Revenue based on market cap (typically 1-5x revenue multiple)
  const revenueMultiple = Math.random() * 4 + 1;
  const annualRevenue = marketCap / revenueMultiple;
  
  // Profit margin varies by sector
  const profitMargin = (Math.random() * 0.3 + 0.05) * (sectorData.growthRate / 0.1);
  const netIncome = annualRevenue * profitMargin;
  
  // Calculate financial ratios
  const eps = netIncome / sharesOutstanding;
  const pe = stockPrice / eps;
  const bookValue = marketCap * (Math.random() * 0.5 + 0.3);
  const bookValuePerShare = bookValue / sharesOutstanding;
  const pbRatio = stockPrice / bookValuePerShare;
  
  // Debt and cash
  const totalDebt = marketCap * (Math.random() * 0.4 + 0.1);
  const cash = marketCap * (Math.random() * 0.3 + 0.05);
  
  return {
    stockPrice: Math.round(stockPrice * 100) / 100,
    sharesOutstanding,
    marketCap,
    annualRevenue: Math.round(annualRevenue),
    quarterlyRevenue: Math.round(annualRevenue / 4),
    netIncome: Math.round(netIncome),
    quarterlyIncome: Math.round(netIncome / 4),
    eps: Math.round(eps * 100) / 100,
    pe: Math.round(pe * 100) / 100,
    pbRatio: Math.round(pbRatio * 100) / 100,
    bookValue: Math.round(bookValue),
    bookValuePerShare: Math.round(bookValuePerShare * 100) / 100,
    totalDebt: Math.round(totalDebt),
    cash: Math.round(cash),
    dividendYield: sectorData.dividendYield,
    dividendPerShare: Math.round(stockPrice * sectorData.dividendYield * 100) / 100,
    profitMargin: Math.round(profitMargin * 10000) / 100, // Percentage
    
    // Growth metrics
    revenueGrowth: Math.round((Math.random() * 0.4 - 0.1) * 100) / 100, // -10% to +30%
    incomeGrowth: Math.round((Math.random() * 0.6 - 0.2) * 100) / 100, // -20% to +40%
    
    // Analyst data
    analystRating: Math.random() > 0.5 ? 'BUY' : Math.random() > 0.5 ? 'HOLD' : 'SELL',
    targetPrice: Math.round(stockPrice * (Math.random() * 0.4 + 0.8) * 100) / 100,
    
    // Trading metrics
    volume: Math.floor(sharesOutstanding * (Math.random() * 0.05 + 0.001)), // 0.1% to 5% daily volume
    avgVolume: Math.floor(sharesOutstanding * (Math.random() * 0.03 + 0.002)),
    
    // Technical indicators
    support: Math.round(stockPrice * (Math.random() * 0.2 + 0.8) * 100) / 100,
    resistance: Math.round(stockPrice * (Math.random() * 0.2 + 1.1) * 100) / 100,
    
    // 52-week range
    fiftyTwoWeekLow: Math.round(stockPrice * (Math.random() * 0.3 + 0.6) * 100) / 100,
    fiftyTwoWeekHigh: Math.round(stockPrice * (Math.random() * 0.5 + 1.2) * 100) / 100
  };
};

// Generate a complete bot company
export const generateBotCompany = (id) => {
  // Random sector selection
  const sectorKeys = Object.keys(COMPANY_SECTORS);
  const sector = sectorKeys[Math.floor(Math.random() * sectorKeys.length)];
  const sectorData = COMPANY_SECTORS[sector];
  
  // Random market cap within sector range
  const marketCap = Math.floor(
    Math.random() * (sectorData.marketCap.max - sectorData.marketCap.min) + 
    sectorData.marketCap.min
  );
  
  // Get company name based on sector
  const sectorNameKey = sector === 'REAL_ESTATE' ? 'REAL_ESTATE' : 
                       sector === 'CONSUMER' ? 'CONSUMER' :
                       sector === 'TECHNOLOGY' ? 'TECH' : sector;
  
  const nameArray = COMPANY_NAMES[sectorNameKey] || COMPANY_NAMES.TECH;
  const name = nameArray[Math.floor(Math.random() * nameArray.length)];
  
  // Generate ticker symbol (2-4 letters)
  const tickerLength = Math.floor(Math.random() * 3) + 2;
  let ticker = '';
  for (let i = 0; i < tickerLength; i++) {
    ticker += String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  }
  
  // Get description
  const descriptions = COMPANY_DESCRIPTIONS[sector];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Generate fundamentals
  const fundamentals = generateCompanyFundamentals(sector, marketCap);
  
  // Company age and founding
  const foundedYear = 2024 - Math.floor(Math.random() * 50); // 1974-2024
  const employeeCount = Math.floor(marketCap / 200000); // Rough estimate
  
  // Stock exchange (weighted towards major exchanges)
  const exchanges = ['NYSE', 'NASDAQ', 'NYSE', 'NASDAQ', 'AMEX'];
  const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
  
  return {
    id: `bot_company_${id}`,
    name,
    ticker,
    sector: sector.toLowerCase().replace('_', ' '),
    sectorKey: sector,
    description,
    founded: foundedYear,
    employees: employeeCount,
    headquarters: generateHeadquarters(),
    exchange,
    website: `https://${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    
    // Financial data
    ...fundamentals,
    
    // Market data
    isActive: true,
    isBot: true,
    liquidityLevel: Math.random() * 0.8 + 0.2, // 20% to 100%
    
    // Volatility and behavior
    volatility: sectorData.volatility,
    growthRate: sectorData.growthRate,
    
    // News and events
    lastNewsDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within 30 days
    nextEarningsDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Next 90 days
    
    // Created timestamp
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Generate headquarters location
const generateHeadquarters = () => {
  const locations = [
    'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Chicago, IL',
    'Boston, MA', 'Seattle, WA', 'Austin, TX', 'Denver, CO', 'Atlanta, GA',
    'Miami, FL', 'Dallas, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'Detroit, MI',
    'Minneapolis, MN', 'San Diego, CA', 'Portland, OR', 'Las Vegas, NV',
    'Charlotte, NC', 'Nashville, TN', 'Salt Lake City, UT', 'Kansas City, MO'
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Generate initial bot companies pool
export const generateInitialBotCompanies = (count = 100) => {
  const companies = [];
  const usedTickers = new Set();
  
  for (let i = 0; i < count; i++) {
    let company;
    let attempts = 0;
    
    // Ensure unique ticker
    do {
      company = generateBotCompany(i + 1);
      attempts++;
    } while (usedTickers.has(company.ticker) && attempts < 10);
    
    if (!usedTickers.has(company.ticker)) {
      usedTickers.add(company.ticker);
      companies.push(company);
    }
  }
  
  return companies;
};

// Helper function to get companies by sector
export const getCompaniesBySector = (companies, sector) => {
  return companies.filter(company => company.sectorKey === sector);
};

// Helper function to get top companies by market cap
export const getTopCompaniesByMarketCap = (companies, limit = 10) => {
  return companies
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, limit);
};

// Helper function to get most active companies by volume
export const getMostActiveCompanies = (companies, limit = 10) => {
  return companies
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit);
};

export default {
  COMPANY_SECTORS,
  COMPANY_NAMES,
  COMPANY_DESCRIPTIONS,
  generateBotCompany,
  generateInitialBotCompanies,
  getCompaniesBySector,
  getTopCompaniesByMarketCap,
  getMostActiveCompanies
};
