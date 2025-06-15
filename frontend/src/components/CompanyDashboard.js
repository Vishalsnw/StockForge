import React from "react";

export default function CompanyDashboard({ company }) {
  if (!company) return <div>Select a company to view its dashboard.</div>;
  return (
    <div className="company-dashboard">
      <h2>{company.name} ({company.sector})</h2>
      <p><b>Symbol:</b> {company.symbol}</p>
      <p><b>Balance:</b> ₹{company.balance.toLocaleString()}</p>
      <p><b>Shares:</b> {company.shares}</p>
      <p><b>Share Price:</b> ₹{company.sharePrice.toFixed(2)}</p>
      <p><b>Raw Materials Needed:</b> {company.rawMaterials.length ? company.rawMaterials.join(", ") : "None"}</p>
      <p><b>Products:</b> {company.products.join(", ")}</p>
      <div>
        <strong>Inventory:</strong>
        <ul>
          {Object.entries(company.inventory).length === 0 && <li>Empty</li>}
          {Object.entries(company.inventory).map(([mat, qty]) => (
            <li key={mat}>{mat}: {qty}</li>
          ))}
        </ul>
      </div>
      {/* Future: Add buy raw material, produce, sell product, etc. */}
    </div>
  );
}