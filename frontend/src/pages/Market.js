import React from "react";
import MarketTicker from "../components/MarketTicker";
import "./MarketPage.css";

export default function Market() {
  return (
    <div className="market-page">
      <MarketTicker />
      <h1>Market Overview</h1>
      <p>Track live prices of all stocks and commodities. Click on Stock or Commodity above to trade.</p>
      {/* Optionally add a summary table here */}
    </div>
  );
}