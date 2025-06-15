import React from "react";
import "./StockMarket.css";
import { useMarket } from "../bots/MarketBot";

export default function StockMarket({ compact }) {
  const market = useMarket();
  const stocks = market?.stocks || [];

  return (
    <div className={compact ? "stock-market compact" : "stock-market"}>
      <h3>Stock Market</h3>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company</th>
            <th>Price</th>
            {!compact && <th>Buy/Sell</th>}
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.symbol}>
              <td>{s.symbol}</td>
              <td>{s.name}</td>
              <td>₹{s.price}</td>
              {!compact && (
                <td>
                  <button className="btn-buy">Buy</button>
                  <button className="btn-sell">Sell</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}