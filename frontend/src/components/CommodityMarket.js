import React from "react";
import "./CommodityMarket.css";
import { useMarket } from "../bots/MarketBot";

export default function CommodityMarket({ compact }) {
  const market = useMarket();
  const commodities = market?.commodities || [];

  return (
    <div className={compact ? "commodity-market compact" : "commodity-market"}>
      <h3>Commodity Market</h3>
      <table>
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Price</th>
            {!compact && <th>Buy/Sell</th>}
          </tr>
        </thead>
        <tbody>
          {commodities.map((c) => (
            <tr key={c.name}>
              <td>{c.name}</td>
              <td>₹{c.price}</td>
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