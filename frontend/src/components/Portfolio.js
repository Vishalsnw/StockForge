import './Portfolio.css';
import React from "react";
import "./Portfolio.css";

// Dummy data for demonstration
const userPortfolio = {
  cash: 10500,
  stocks: [
    { symbol: "ACME", qty: 10, price: 233 },
    { symbol: "FOOD", qty: 8, price: 87 }
  ],
  commodities: [
    { name: "Iron Ore", qty: 22, price: 120 },
    { name: "Wheat", qty: 9, price: 18 }
  ]
};

export default function Portfolio({ compact }) {
  return (
    <div className={compact ? "portfolio compact" : "portfolio"}>
      <h3>Your Portfolio</h3>
      <div>
        <b>Cash:</b> ₹{userPortfolio.cash.toLocaleString()}
      </div>
      <div className="portfolio-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Asset</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {userPortfolio.stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>Stock</td>
                <td>{stock.symbol}</td>
                <td>{stock.qty}</td>
                <td>₹{stock.price}</td>
              </tr>
            ))}
            {userPortfolio.commodities.map((c) => (
              <tr key={c.name}>
                <td>Commodity</td>
                <td>{c.name}</td>
                <td>{c.qty}</td>
                <td>₹{c.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}