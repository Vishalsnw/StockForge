import { sectors } from "../data/sectors";
import { botNames } from "../data/botNames";
import { addCompany } from "../data/companies";
import { addCommodityOrder } from "../data/commodityOrders";
import React, { createContext, useEffect } from "react";

// Bot generator for initial companies & commodity orders
function generateBotCompanies(N = 30) {
  for (let i = 0; i < N; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    const symbol = (botName.slice(0, 3) + sector.name.slice(0, 2) + i).toUpperCase();
    const company = {
      id: "BOT" + (i + 1),
      name: botName + " " + sector.name,
      sector: sector.name,
      symbol,
      rawMaterials: sector.rawMaterials,
      products: sector.products,
      inventory: {},
      balance: 200000 + Math.floor(Math.random() * 300000),
      shares: 100000,
      sharePrice: 10 + Math.random() * 90,
      isBot: true
    };
    addCompany(company);

    // Each product: create a sell order
    sector.products.forEach(product => {
      addCommodityOrder({
        commodity: product,
        price: 80 + Math.random() * 40,
        qty: 50 + Math.floor(Math.random() * 100),
        seller: company.name,
        companyId: company.id
      });
    });
  }
}

// Context to ensure bots are generated once per app mount
const MarketBotContext = React.createContext();

export function MarketBotProvider({ children }) {
  useEffect(() => {
    if (!localStorage.getItem("market_bots_generated")) {
      generateBotCompanies();
      localStorage.setItem("market_bots_generated", "yes");
    }
  }, []);

  return (
    <MarketBotContext.Provider value={null}>
      {children}
    </MarketBotContext.Provider>
  );
}