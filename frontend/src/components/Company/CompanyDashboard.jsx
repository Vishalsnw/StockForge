import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import { useAuth } from '../../context/AuthContext';
import './CompanyDashboard.css';

const CompanyDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    playerCompany, 
    companyTypes, 
    resources, 
    createCompany, 
    goPublic, 
    buyResource,
    simulateOperations,
    getTopCompanies,
    loading, 
    error 
  } = useCompany();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showIPOModal, setShowIPOModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [topCompanies, setTopCompanies] = useState([]);

  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    type: 'technology',
    description: '',
    headquarters: 'Mumbai'
  });

  const [ipoData, setIPOData] = useState({
    sharePrice: 10,
    sharesForSale: 100000,
    description: ''
  });

  const [resourceQuantity, setResourceQuantity] = useState(1);

  // Load top companies on mount
  useEffect(() => {
    const companies = getTopCompanies(5);
    setTopCompanies(companies);
  }, [getTopCompanies]);

  // Simulate operations every 30 seconds
  useEffect(() => {
    if (!playerCompany) return;

    const interval = setInterval(() => {
      simulateOperations();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [playerCompany, simulateOperations]);

  // Handle company creation
  const handleCreateCompany = async (e) => {
    e.preventDefault();
    
    if (!newCompanyData.name.trim()) {
      alert('Company name is required');
      return;
    }

    const result = await createCompany(newCompanyData);
    
    if (result.success) {
      setShowCreateModal(false);
      setNewCompanyData({
        name: '',
        type: 'technology',
        description: '',
        headquarters: 'Mumbai'
      });
      alert(`🎉 Company "${result.company.name}" created successfully!`);
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  // Handle IPO launch
  const handleLaunchIPO = async (e) => {
    e.preventDefault();
    
    if (ipoData.sharePrice < 1 || ipoData.sharesForSale < 1000) {
      alert('Invalid IPO parameters');
      return;
    }

    const result = await goPublic(ipoData);
    
    if (result.success) {
      setShowIPOModal(false);
      setIPOData({
        sharePrice: 10,
        sharesForSale: 100000,
        description: ''
      });
      alert(`🚀 IPO launched successfully! Raised ₹${result.raised.toLocaleString()}`);
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  // Handle resource purchase
  const handleBuyResource = async () => {
    if (!selectedResource || resourceQuantity < 1) {
      alert('Invalid resource selection');
      return;
    }

    const result = await buyResource(selectedResource, resourceQuantity);
    
    if (result.success) {
      setShowResourceModal(false);
      setSelectedResource(null);
      setResourceQuantity(1);
      alert(`📦 Purchased ${resourceQuantity}x ${resources[selectedResource].name} for ₹${result.cost.toLocaleString()}`);
    } else {
      alert(`❌ Error: ${result.error}`);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  // No company created yet
  if (!playerCompany) {
    return (
      <div className="company-dashboard no-company">
        <div className="welcome-section">
          <div className="welcome-header">
            <h1>🏢 Welcome to Company Builder!</h1>
            <p>Start your entrepreneurial journey and build the next big company</p>
          </div>

          <div className="company-types-grid">
            {Object.entries(companyTypes).map(([type, data]) => (
              <div key={type} className="company-type-card">
                <div className="type-icon">{data.icon}</div>
                <h3>{data.name}</h3>
                <p>{data.description}</p>
                <div className="type-stats">
                  <div className="stat">
                    <span className="label">Starting Cost:</span>
                    <span className="value">{formatCurrency(data.startingCost)}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Profit Margin:</span>
                    <span className="value">{(data.profitMargin * 100).toFixed(0)}%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Growth Rate:</span>
                    <span className="value">{data.growthRate}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="create-company-section">
            <button 
              className="create-company-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="btn-icon">🚀</span>
              Start Your Company
            </button>
            <p className="balance-info">
              Your Balance: <strong>{formatCurrency(user?.balance || 0)}</strong>
            </p>
          </div>

          {/* Top Companies Leaderboard */}
          <div className="top-companies-section">
            <h2>🏆 Top Public Companies</h2>
            <div className="companies-list">
              {topCompanies.map((company, index) => (
                <div key={company.id} className="company-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="company-info">
                    <h4>{company.name}</h4>
                    <p>{companyTypes[company.type]?.name} • Level {company.level}</p>
                    <p className="owner">CEO: {company.owner}</p>
                  </div>
                  <div className="company-stats">
                    <div className="market-cap">
                      <span className="label">Market Cap</span>
                      <span className="value">{formatNumber(company.marketCap)}</span>
                    </div>
                    <div className="stock-price">
                      <span className="label">Stock Price</span>
                      <span className="value">₹{company.stockPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
              {/* Create Company Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏢 Create Your Company</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleCreateCompany} className="create-form">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={newCompanyData.name}
                  onChange={(e) => setNewCompanyData({...newCompanyData, name: e.target.value})}
                  placeholder="Enter company name"
                  maxLength={50}
                  required
                />
              </div>

              <div className="form-group">
                <label>Industry Type *</label>
                <select
                  value={newCompanyData.type}
                  onChange={(e) => setNewCompanyData({...newCompanyData, type: e.target.value})}
                  required
                >
                  {Object.entries(companyTypes).map(([type, data]) => (
                    <option key={type} value={type}>
                      {data.icon} {data.name} - {formatCurrency(data.startingCost)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Headquarters</label>
                <select
                  value={newCompanyData.headquarters}
                  onChange={(e) => setNewCompanyData({...newCompanyData, headquarters: e.target.value})}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newCompanyData.description}
                  onChange={(e) => setNewCompanyData({...newCompanyData, description: e.target.value})}
                  placeholder="Describe your company's mission and vision"
                  maxLength={200}
                  rows={3}
                />
              </div>

              <div className="cost-summary">
                <div className="cost-item">
                  <span>Starting Cost:</span>
                  <span>{formatCurrency(companyTypes[newCompanyData.type]?.startingCost || 0)}</span>
                </div>
                <div className="cost-item">
                  <span>Your Balance:</span>
                  <span>{formatCurrency(user?.balance || 0)}</span>
                </div>
                <div className="cost-item total">
                  <span>Remaining Balance:</span>
                  <span>{formatCurrency((user?.balance || 0) - (companyTypes[newCompanyData.type]?.startingCost || 0))}</span>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading || (user?.balance || 0) < (companyTypes[newCompanyData.type]?.startingCost || 0)}
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Company exists - show dashboard
return (
  <div className="company-dashboard">
    {/* Company Header */}
    <div className="company-header">
      <div className="company-info">
        <div className="company-title">
          <h1>
            {companyTypes[playerCompany.type]?.icon} {playerCompany.name}
          </h1>
          <div className="company-badges">
            <span className="level-badge">Level {playerCompany.level}</span>
            {playerCompany.isPublic && <span className="public-badge">📈 Public</span>}
            <span className="type-badge">{companyTypes[playerCompany.type]?.name}</span>
          </div>
        </div>
        <p className="company-description">{playerCompany.description}</p>
        <div className="company-meta">
          <span>📍 {playerCompany.headquarters}</span>
          <span>👥 {playerCompany.employees} employees</span>
          <span>📅 Founded {playerCompany.founded}</span>
        </div>
      </div>

      <div className="company-actions">
        {!playerCompany.isPublic && playerCompany.level >= 5 && (
          <button 
            className="action-btn ipo-btn"
            onClick={() => setShowIPOModal(true)}
          >
            🚀 Launch IPO
          </button>
        )}
        <button 
          className="action-btn resource-btn"
          onClick={() => setShowResourceModal(true)}
        >
          📦 Buy Resources
        </button>
        <button 
          className="action-btn market-btn"
          onClick={() => onNavigate('trading')}
        >
          📈 Stock Market
        </button>
      </div>
    </div>

    {/* Company Stats Grid */}
    <div className="stats-grid">
      <div className="stat-card financial">
        <div className="card-header">
          <h3>💰 Financial Performance</h3>
          <span className="live-indicator">🔴 Live</span>
        </div>
        <div className="stats-list">
          <div className="stat-item">
            <span className="label">Company Cash</span>
            <span className="value">{formatCurrency(playerCompany.cash)}</span>
          </div>
          <div className="stat-item">
            <span className="label">Total Revenue</span>
            <span className="value positive">{formatCurrency(playerCompany.revenue)}</span>
          </div>
          <div className="stat-item">
            <span className="label">Total Profit</span>
            <span className={`value ${playerCompany.profit >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(playerCompany.profit)}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Company Valuation</span>
            <span className="value">{formatCurrency(playerCompany.valuation)}</span>
          </div>
        </div>
      </div>

      {playerCompany.isPublic && (
        <div className="stat-card stock">
          <div className="card-header">
            <h3>📈 Stock Performance</h3>
            <span className="market-badge">Market Open</span>
          </div>
          <div className="stats-list">
            <div className="stat-item large">
              <span className="label">Stock Price</span>
              <span className="value stock-price">₹{playerCompany.stockPrice.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Market Cap</span>
              <span className="value">{formatNumber(playerCompany.marketCap)}</span>
            </div>
            <div className="stat-item">
              <span className="label">Shares Outstanding</span>
              <span className="value">{playerCompany.sharesOutstanding.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="label">IPO Date</span>
              <span className="value">{playerCompany.ipoDate || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="stat-card resources">
        <div className="card-header">
          <h3>📦 Resources & Assets</h3>
          <button className="card-action" onClick={() => setShowResourceModal(true)}>
            Buy More →
          </button>
        </div>
        <div className="resources-list">
          {companyTypes[playerCompany.type]?.resources.map(resourceType => (
            <div key={resourceType} className="resource-item">
              <span className="resource-name">{resources[resourceType]?.name}</span>
              <span className="resource-quantity">
                {playerCompany.resources?.[resourceType] || 0}
              </span>
              <span className="resource-value">
                {formatCurrency((playerCompany.resources?.[resourceType] || 0) * resources[resourceType]?.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-card operations">
        <div className="card-header">
          <h3>⚙️ Operations</h3>
          <span className="auto-badge">Auto</span>
        </div>
        <div className="stats-list">
          <div className="stat-item">
            <span className="label">Employees</span>
            <span className="value">{playerCompany.employees}</span>
          </div>
          <div className="stat-item">
            <span className="label">Monthly Expenses</span>
            <span className="value negative">
              {formatCurrency(playerCompany.employees * 5000 + (playerCompany.revenue * 0.3))}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Efficiency</span>
            <span className="value">
              {Math.min(100, Math.max(50, Object.values(playerCompany.resources || {}).reduce((sum, qty) => sum + qty, 0) * 5)).toFixed(0)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Next Level</span>
            <span className="value">
              {formatCurrency(playerCompany.level * 100000 - playerCompany.revenue)} revenue needed
            </span>
          </div>
        </div>
      </div>
    </div>
          {/* Modals */}
      {showIPOModal && (
        <div className="modal-overlay" onClick={() => setShowIPOModal(false)}>
          <div className="modal-content ipo-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚀 Launch IPO</h3>
              <button className="close-btn" onClick={() => setShowIPOModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleLaunchIPO} className="ipo-form">
              <div className="ipo-requirements">
                <h4>Requirements Check:</h4>
                <div className={`requirement ${playerCompany.level >= 5 ? 'met' : 'unmet'}`}>
                  ✓ Company Level 5+ ({playerCompany.level})
                </div>
                <div className={`requirement ${playerCompany.revenue > 0 ? 'met' : 'unmet'}`}>
                  ✓ Positive Revenue History
                </div>
                <div className={`requirement ${playerCompany.employees >= 50 ? 'met' : 'unmet'}`}>
                  ✓ 50+ Employees ({playerCompany.employees})
                </div>
              </div>

              <div className="form-group">
                <label>Share Price (₹)</label>
                <input
                  type="number"
                  value={ipoData.sharePrice}
                  onChange={(e) => setIPOData({...ipoData, sharePrice: parseFloat(e.target.value) || 0})}
                  min="1"
                  max="1000"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label>Shares for Sale</label>
                <input
                  type="number"
                  value={ipoData.sharesForSale}
                  onChange={(e) => setIPOData({...ipoData, sharesForSale: parseInt(e.target.value) || 0})}
                  min="1000"
                  max="500000"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label>IPO Description</label>
                <textarea
                  value={ipoData.description}
                  onChange={(e) => setIPOData({...ipoData, description: e.target.value})}
                  placeholder="Describe your company's growth plans and investment use"
                  rows={4}
                  maxLength={500}
                  className="ipo-description"
                  required
                />
                <div className="char-counter">
                  {ipoData.description.length}/500 characters
                </div>
                <div className="description-tips">
                  <h5>💡 IPO Description Tips:</h5>
                  <ul>
                    <li>• Explain how you'll use the raised capital</li>
                    <li>• Highlight your company's competitive advantages</li>
                    <li>• Mention future expansion plans</li>
                    <li>• Include market opportunity and growth potential</li>
                  </ul>
                </div>
                
                {/* Pre-filled Templates */}
                <div className="description-templates">
                  <h6>Quick Templates:</h6>
                  <div className="template-buttons">
                    <button 
                      type="button"
                      className="template-btn"
                      onClick={() => setIPOData({
                        ...ipoData, 
                        description: `${playerCompany.name} is seeking ₹${(ipoData.sharePrice * ipoData.sharesForSale).toLocaleString()} through this IPO to accelerate growth in the ${companyTypes[playerCompany.type]?.name.toLowerCase()} sector. We plan to expand operations, hire top talent, and invest in cutting-edge technology. With ${playerCompany.employees} employees and proven revenue of ₹${playerCompany.revenue.toLocaleString()}, we're positioned for 3x growth over the next 24 months.`
                      })}
                    >
                      🚀 Growth Focus
                    </button>
                    
                    <button 
                      type="button"
                      className="template-btn"
                      onClick={() => setIPOData({
                        ...ipoData, 
                        description: `${playerCompany.name} is going public to fund expansion into new markets and strengthen our position as a leader in ${companyTypes[playerCompany.type]?.name.toLowerCase()}. The raised capital will be used for: 40% expansion, 30% R&D, 20% marketing, 10% working capital. We project 150% revenue growth and profitability improvements through operational efficiency.`
                      })}
                    >
                      📊 Detailed Plan
                    </button>
                    
                    <button 
                      type="button"
                      className="template-btn"
                      onClick={() => setIPOData({
                        ...ipoData, 
                        description: `Join us in revolutionizing the ${companyTypes[playerCompany.type]?.name.toLowerCase()} industry! ${playerCompany.name} has achieved consistent growth and is ready for the next phase. This IPO will fund innovation, strategic partnerships, and market expansion. Our experienced team of ${playerCompany.employees} professionals is committed to delivering exceptional returns to shareholders.`
                      })}
                    >
                      🏆 Innovation Focus
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="ipo-preview">
                <h4>📋 IPO Listing Preview</h4>
                <div className="listing-card">
                  <div className="listing-header">
                    <h3>{companyTypes[playerCompany.type]?.icon} {playerCompany.name}</h3>
                    <span className="industry-tag">{companyTypes[playerCompany.type]?.name}</span>
                  </div>
                  
                  <div className="listing-stats">
                    <div className="stat">
                      <span className="label">IPO Price</span>
                      <span className="value">₹{ipoData.sharePrice.toFixed(2)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Shares Offered</span>
                      <span className="value">{ipoData.sharesForSale.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Market Cap</span>
                      <span className="value">{formatNumber(ipoData.sharePrice * (playerCompany.sharesOutstanding + ipoData.sharesForSale))}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Company Level</span>
                      <span className="value">Level {playerCompany.level}</span>
                    </div>
                  </div>
                  
                  <div className="listing-description">
                    <p>{ipoData.description || "No description provided yet..."}</p>
                  </div>
                  
                  <div className="listing-footer">
                    <span className="founded">Founded: {playerCompany.founded}</span>
                    <span className="employees">{playerCompany.employees} employees</span>
                    <span className="hq">📍 {playerCompany.headquarters}</span>
                  </div>
                </div>
              </div>

              <div className="ipo-summary">
                <div className="summary-item">
                  <span>Total Shares:</span>
                  <span>{(playerCompany.sharesOutstanding + ipoData.sharesForSale).toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span>Your Ownership:</span>
                  <span>{((playerCompany.sharesOutstanding / (playerCompany.sharesOutstanding + ipoData.sharesForSale)) * 100).toFixed(1)}%</span>
                </div>
                <div className="summary-item highlight">
                  <span>Capital Raised:</span>
                  <span>{formatCurrency(ipoData.sharePrice * ipoData.sharesForSale)}</span>
                </div>
              </div>

              {/* Risk Warning */}
              <div className="ipo-warning">
                <h5>⚠️ Important Notes:</h5>
                <ul>
                  <li>• Once public, your company stock price will fluctuate based on performance</li>
                  <li>• Other players can buy and sell your company shares</li>
                  <li>• You'll retain {((playerCompany.sharesOutstanding / (playerCompany.sharesOutstanding + ipoData.sharesForSale)) * 100).toFixed(1)}% ownership after IPO</li>
                  <li>• IPO process takes 24-48 hours for regulatory approval</li>
                  <li>• Stock will be listed on StockForge Exchange immediately after approval</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowIPOModal(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Launching...' : 'Launch IPO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResourceModal && (
        <div className="modal-overlay" onClick={() => setShowResourceModal(false)}>
          <div className="modal-content resource-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📦 Buy Resources</h3>
              <button className="close-btn" onClick={() => setShowResourceModal(false)}>×</button>
            </div>
            
            <div className="resource-categories">
              <h4>Available Resources for {companyTypes[playerCompany.type]?.name}:</h4>
              <div className="resources-grid">
                {companyTypes[playerCompany.type]?.resources.map(resourceType => (
                  <div 
                    key={resourceType} 
                    className={`resource-card ${selectedResource === resourceType ? 'selected' : ''}`}
                    onClick={() => setSelectedResource(resourceType)}
                  >
                    <h5>{resources[resourceType]?.name}</h5>
                    <p className="price">₹{resources[resourceType]?.price.toLocaleString()} each</p>
                    <p className="owned">Owned: {playerCompany.resources?.[resourceType] || 0}</p>
                    <span className={`demand ${resources[resourceType]?.demand}`}>
                      {resources[resourceType]?.demand.replace('_', ' ')} demand
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedResource && (
              <div className="purchase-section">
                <h4>Purchase {resources[selectedResource]?.name}</h4>
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={resourceQuantity}
                    onChange={(e) => setResourceQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    max={Math.floor(playerCompany.cash / resources[selectedResource]?.price)}
                  />
                </div>
                <div className="purchase-summary">
                  <div className="summary-row">
                    <span>Unit Price:</span>
                    <span>₹{resources[selectedResource]?.price.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Quantity:</span>
                    <span>{resourceQuantity}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Cost:</span>
                    <span>₹{(resources[selectedResource]?.price * resourceQuantity).toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Company Cash:</span>
                    <span>₹{playerCompany.cash.toLocaleString()}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button onClick={() => setShowResourceModal(false)}>
                    Cancel
                  </button>
                  <button 
                    onClick={handleBuyResource}
                    disabled={loading || playerCompany.cash < (resources[selectedResource]?.price * resourceQuantity)}
                  >
                    {loading ? 'Purchasing...' : 'Buy Resources'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="error-toast">
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
