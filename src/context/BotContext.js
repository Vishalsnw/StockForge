import React, { createContext, useState, useEffect } from "react";

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const [botActivities, setBotActivities] = useState([]);

  useEffect(() => {
    // Dummy: Replace with API fetch for bot activity feed
    setBotActivities([
      "Bot MarketMakerBot1 placed a buy order for AlphaTech",
      "Bot RandomTraderBot1 sold 10 units of GreenFarms Wheat"
    ]);
  }, []);

  return (
    <BotContext.Provider value={{ botActivities, setBotActivities }}>
      {children}
    </BotContext.Provider>
  );
};