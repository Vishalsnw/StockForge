import './StockMarket.css';
import React from "react";
import { companies } from "../data/companies";

export default function StockMarket() {
  return (
    <div>
      <h1>Stock Market</h1>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Symbol</th>
            <th>Share Price</th>
            <th>Shares</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.symbol}</td>
              <td>₹{c.sharePrice.toFixed(2)}</td>
              <td>{c.shares}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}