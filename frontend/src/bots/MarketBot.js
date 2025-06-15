import React, { createContext, useContext, useEffect, useState } from "react";

// Context to share market state across your app
const MarketContext = createContext();

export function useMarket() {
  return useContext(MarketContext);
}

/**
 * MarketBot simulates commodity/stock price changes.
 * It generates new prices at intervals and provides them via context.
 */
export function MarketBotProvider({ children }) {
  const [marketData, setMarketData] = useState({
    stocks: [
      { symbol: "ACME", name: "Acme Corp", price: 233 },
      { symbol: "FOOD", name: "FoodWorks", price: 87 },
      { symbol: "OILX", name: "OilX Ltd.", price: 153 }
    ],
    commodities: [
      { name: "Iron Ore", price: 120 },
      { name: "Oil", price: 72 },
      { name: "Wheat", price: 18 }
    ]
  });

  // Simulate price updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => ({
        stocks: prev.stocks.map((stock) => ({
          ...stock,
          price: Math.max(
            1,
            +(stock.price * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2)
          )
        })),
        commodities: prev.commodities.map((comm) => ({
          ...comm,
          price: Math.max(
            1,
            +(comm.price * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)
          )
        }))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MarketContext.Provider value={marketData}>
      {children}
    </MarketContext.Provider>
  );
}