import './CompanyPanel.css';
import React, { useState } from "react";
import "./CompanyPanel.css";

export default function CompanyPanel() {
  const [company, setCompany] = useState({
    name: "Vishal Industries",
    cash: 15000,
    factories: 2,
    employees: 24,
    products: [
      { name: "Processed Food", qty: 92 },
      { name: "Steel", qty: 40 },
    ],
    revenue: 4300,
    expenses: 3150,
  });

  return (
    <div className="company-panel">
      <h2>Company</h2>
      <div className="company-summary">
        <strong>{company.name}</strong>
        <div>💰 Cash: ₹{company.cash.toLocaleString()}</div>
        <div>🏭 Factories: {company.factories}</div>
        <div>👨‍💼 Employees: {company.employees}</div>
        <div>📈 Revenue: ₹{company.revenue.toLocaleString()}</div>
        <div>📉 Expenses: ₹{company.expenses.toLocaleString()}</div>
      </div>
      <div className="company-products">
        <h4>Product Inventory</h4>
        <ul>
          {company.products.map((p) => (
            <li key={p.name}>
              {p.name}: <b>{p.qty}</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}