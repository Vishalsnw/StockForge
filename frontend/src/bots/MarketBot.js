import React, { createContext, useContext, useEffect, useRef } from "react";
import { marketBots } from "./botsData";

// Context to provide market bots simulation globally
const MarketBotContext = createContext();

export function MarketBotProvider({ children }) {
  // You can expand this to have bots actually trade (random or AI logic)
  // For demo, we just provide bot/company data globally
  const botsRef = useRef(marketBots);

  // (Optional) Add effect for bots to place random orders in background
  useEffect(() => {
    // e.g., setInterval to simulate activity
  }, []);

  return (
    <MarketBotContext.Provider value={{
      bots: botsRef.current,
    }}>
      {children}
    </MarketBotContext.Provider>
  );
}

export function useMarketBots() {
  return useContext(MarketBotContext);
}