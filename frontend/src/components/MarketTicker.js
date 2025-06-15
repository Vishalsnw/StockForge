import './MarketTicker.css';
import React, { useEffect, useState } from "react";
import { companies } from "../data/companies";
import "./MarketTicker.css";

export default function MarketTicker() {
  const [tickers, setTickers] = useState(() =>
    companies.slice(0, 30).map(c => ({
      symbol: c.symbol,
      name: c.name,
      price: c.sharePrice,
      change: +(Math.random() * 2 - 1).toFixed(2)
    }))
  );

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
            {t.symbol}: <b>{t.price}</b>{" "}
            <span>
              {t.change >= 0 ? "▲" : "▼"} {Math.abs(t.change)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}