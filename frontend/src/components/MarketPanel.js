import React from "react";
import "./MarketPanel.css";
import CommodityMarket from "./CommodityMarket";
import StockMarket from "./StockMarket";

export default function MarketPanel() {
  return (
    <div className="market-panel">
      <h2>Market Overview</h2>
      <div className="market-panels">
        <section className="market-subpanel">
          <CommodityMarket compact />
        </section>
        <section className="market-subpanel">
          <StockMarket compact />
        </section>
      </div>
    </div>
  );
}