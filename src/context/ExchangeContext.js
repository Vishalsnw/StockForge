import React, { createContext, useState } from "react";

export const ExchangeContext = createContext();

export const ExchangeProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);

  // Add fetch logic as needed

  return (
    <ExchangeContext.Provider value={{ orders, setOrders, trades, setTrades }}>
      {children}
    </ExchangeContext.Provider>
  );
};