import React, { useState, useEffect, useRef } from "react";
import "./CommodityMarket.css";

// Replace these with your actual commodities from your backend/context!
const COMMODITIES = [
  { symbol: "PLRG", name: "Player Gold", price: 1532.10, type: "player" },
  { symbol: "BOTW", name: "Bot Wheat", price: 7.12, type: "bot" },
  { symbol: "PLRS", name: "Player Silver", price: 21.44, type: "player" },
  { symbol: "BOTC", name: "Bot Corn", price: 3.88, type: "bot" },
];

export default function CommodityMarket() {
  const [commodities, setCommodities] = useState(COMMODITIES);
  const [blink, setBlink] = useState({});
  const prevPrices = useRef(COMMODITIES.map(c => c.price));

  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev =>
        prev.map((c, i) => {
          let delta = (Math.random() - 0.5) * c.price * 0.02;
          delta = Math.round(delta * 100) / 100;
          const newPrice = Math.max(0.01, Math.round((c.price + delta) * 100) / 100);
          if (newPrice !== c.price) {
            setBlink(b => ({ ...b, [i]: delta > 0 ? "up" : "down" }));
            setTimeout(() => setBlink(b => ({ ...b, [i]: null })), 600);
          }
          prevPrices.current[i] = c.price;
          return { ...c, price: newPrice };
        })
      );
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-panel">
      <h2>Player & Bot Commodities</h2>
      <div className="market-table-wrap">
        <table className="market-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Commodity</th>
              <th>Type</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {commodities.map((c, i) => (
              <tr key={c.symbol}>
                <td className="ticker">{c.symbol}</td>
                <td>{c.name}</td>
                <td>
                  <span className={c.type === "bot" ? "bot-company" : "player-company"}>
                    {c.type === "bot" ? "Bot" : "Player"}
                  </span>
                </td>
                <td
                  className={
                    blink[i]
                      ? `blink blink-${blink[i]}`
                      : prevPrices.current[i] < c.price
                      ? "price-up"
                      : prevPrices.current[i] > c.price
                      ? "price-down"
                      : ""
                  }
                >
                  ${c.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className={c.price > prevPrices.current[i] ? "price-up" : c.price < prevPrices.current[i] ? "price-down" : ""}>
                  {c.price === prevPrices.current[i]
                    ? "--"
                    : ((c.price - prevPrices.current[i]) > 0 ? "+" : "") +
                      (c.price - prevPrices.current[i]).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
