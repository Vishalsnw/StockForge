import React from "react";
import { companies } from "../data/companies";

export default function StockMarket() {
  return (
    <div>
      <h1>Stock Market</h1>
      <p>Trade shares of these companies:</p>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            {c.name} ({c.symbol}) — ₹{c.sharePrice.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}