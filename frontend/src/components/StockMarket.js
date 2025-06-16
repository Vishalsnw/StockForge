import React, { useState, useEffect, useRef } from "react";
import "./StockMarket.css";

// Replace these with your actual player and bot companies from your backend/context!
const COMPANIES = [
  { symbol: "PLR1", name: "PlayerOne Corp", price: 112.22, type: "player" },
  { symbol: "BOTX", name: "BotXchange Inc", price: 79.35, type: "bot" },
  { symbol: "PLR2", name: "PlayerTwo Ltd", price: 154.77, type: "player" },
  { symbol: "BOTZ", name: "BotZilla Group", price: 203.15, type: "bot" },
  { symbol: "PLR3", name: "PlayerThree LLC", price: 44.09, type: "player" },
];

export default function StockMarket() {
  const [companies, setCompanies] = useState(COMPANIES);
  const [blink, setBlink] = useState({});
  const prevPrices = useRef(COMPANIES.map(c => c.price));

  // Animate fake price updates (replace this with your backend or context updates!)
  useEffect(() => {
    const interval = setInterval(() => {
      setCompanies(prev =>
        prev.map((c, i) => {
          // Only random walk for demo; replace with real price update logic!
          let delta = (Math.random() - 0.5) * c.price * 0.02;
          delta = Math.round(delta * 100) / 100;
          const newPrice = Math.max(1, Math.round((c.price + delta) * 100) / 100);
          if (newPrice !== c.price) {
            setBlink(b => ({ ...b, [i]: delta > 0 ? "up" : "down" }));
            setTimeout(() => setBlink(b => ({ ...b, [i]: null })), 600);
          }
          prevPrices.current[i] = c.price;
          return { ...c, price: newPrice };
        })
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-panel">
      <h2>Player & Bot Companies</h2>
      <div className="market-table-wrap">
        <table className="market-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Company</th>
              <th>Type</th>
              <th>Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
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
