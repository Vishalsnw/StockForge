import React, { useEffect, useState } from "react";
import "./MarketTicker.css";

const dummyData = [
  { type: "Stock", symbol: "ACME", name: "Acme Corp", price: 151, change: +1.2 },
  { type: "Stock", symbol: "FOOD", name: "FoodWorks", price: 147, change: -0.7 },
  { type: "Commodity", name: "Iron Ore", price: 121, change: +0.3 },
  { type: "Commodity", name: "Wheat", price: 19, change: -0.2 }
];

export default function MarketTicker() {
  const [tickers, setTickers] = useState(dummyData);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(tickers =>
        tickers.map(t => ({
          ...t,
          price: +(t.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
          change: +(Math.random() * 2 - 1).toFixed(2)
        }))
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-ticker">
      <div className="ticker-inner">
        {tickers.map((t, i) => (
          <span key={i} className={t.change >= 0 ? "ticker-up" : "ticker-down"}>
            {t.type === "Stock" ? t.symbol : t.name}: <b>{t.price}</b>{" "}
            <span>
              {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}